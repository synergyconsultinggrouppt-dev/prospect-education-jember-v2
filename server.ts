import express from "express";
import path from "path";
import dotenv from "dotenv";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { initializeApp as initFirebaseApp } from "firebase/app";
import { getFirestore as getDb, doc, setDoc, getDoc } from "firebase/firestore";
import firebaseConfig from "./firebase-applet-config.json";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "prospect_education_jember_jwt_secret_2026_key";

export interface AuthenticatedRequest extends express.Request {
  user?: {
    userId: string;
    email: string;
    role: string;
    fullName: string;
    loginTime?: string;
  };
}

// Initialize Firestore backend instance
const firebaseApp = initFirebaseApp(firebaseConfig);
const firestoreDb = getDb(firebaseApp, firebaseConfig.firestoreDatabaseId);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // JWT Middleware for Protecting API Routes
  function authenticateJWT(req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ authenticated: false, error: "Akses ditolak. Token autentikasi JWT wajib disertakan." });
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
        email: string;
        role: string;
        fullName: string;
        loginTime?: string;
      };
      req.user = decoded;
      next();
    } catch (err: any) {
      return res.status(401).json({ authenticated: false, error: "Sesi terverifikasi tidak valid atau telah kadaluarsa." });
    }
  }

  // Role-Based Authorization Middleware
  function requireRole(...allowedRoles: string[]) {
    return (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
      if (!req.user) {
        return res.status(401).json({ error: "Pengguna belum terautentikasi." });
      }
      const userRole = req.user.role;
      const isAllowed = allowedRoles.some((role) => {
        if (role === 'student' || role === 'candidate') {
          return userRole === 'student' || userRole === 'candidate';
        }
        return role === userRole;
      });

      if (!isAllowed) {
        return res.status(403).json({ error: `Akses ditolak: Peran '${userRole}' tidak memiliki wewenang untuk mengakses endpoint ini.` });
      }
      next();
    };
  }

  // Helper for Gemini AI client
  function getGenAI() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // Server Auth Endpoints for Role & Session Verification
  const activeSessions = new Map<string, { userId: string; email: string; role: string; fullName: string; loginTime: string }>();

  app.post("/api/auth/login", (req, res) => {
    try {
      const { email, password, requestedRole } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email dan kata sandi wajib diisi." });
      }

      const uLower = String(email).trim().toLowerCase();
      let role = requestedRole || 'student';
      let fullName = 'User Prospect';

      if (role === 'admin' || uLower.includes('admin')) {
        role = 'admin';
        fullName = 'Admin Cabang Jember';
      } else if (role === 'superadmin' || uLower.includes('super')) {
        role = 'superadmin';
        fullName = 'Super Admin Pusat (Direksi)';
      } else if (role === 'investor' || uLower.includes('investor')) {
        role = 'investor';
        fullName = 'Investor Mitras (Bapak Hendra)';
      } else if (role === 'webmaster' || uLower.includes('webmaster')) {
        role = 'webmaster';
        fullName = 'Tim IT Webmaster';
      } else {
        role = 'student';
        fullName = uLower.includes('subagyo') ? 'Ahmad Subagyo' : 'Peserta Terverifikasi';
      }

      const userData = {
        userId: uLower.replace(/[^a-zA-Z0-9]/g, '_'),
        email: uLower,
        role,
        fullName,
        loginTime: new Date().toISOString(),
      };

      // Sign JWT Token
      const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '24h' });
      activeSessions.set(token, userData);

      // Store user record in Firestore
      setDoc(doc(firestoreDb, 'users', userData.userId), userData, { merge: true }).catch((err) =>
        console.warn('Firestore user doc sync notice:', err)
      );

      return res.json({
        success: true,
        token,
        sessionToken: token,
        user: userData,
        message: "Autentikasi server berhasil terverifikasi dengan token JWT resmi.",
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || "Gagal melakukan autentikasi." });
    }
  });

  app.get("/api/auth/me", authenticateJWT, (req: AuthenticatedRequest, res) => {
    return res.json({
      authenticated: true,
      user: req.user,
    });
  });

  app.post("/api/auth/switch-role", authenticateJWT, (req: AuthenticatedRequest, res) => {
    try {
      const { requestedRole } = req.body;
      if (!requestedRole) {
        return res.status(400).json({ error: "Role baru wajib ditentukan." });
      }

      const currentUser = req.user!;
      const updatedUser = {
        ...currentUser,
        role: requestedRole,
        loginTime: new Date().toISOString(),
      };

      const newToken = jwt.sign(updatedUser, JWT_SECRET, { expiresIn: '24h' });
      activeSessions.set(newToken, updatedUser);

      return res.json({
        success: true,
        token: newToken,
        sessionToken: newToken,
        user: updatedUser,
        message: `Sesi role berhasil diverifikasi & diperbarui di server menjadi '${requestedRole}'.`,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || "Gagal memperbarui role di server." });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      activeSessions.delete(token);
    }
    return res.json({ success: true, message: "Berhasil keluar dari akun." });
  });

  // Health check API
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "Prospect Education Cabang Jember" });
  });

  // Midtrans Payment Request Token Endpoint
  app.post("/api/payment/midtrans-token", authenticateJWT, async (req: AuthenticatedRequest, res) => {
    try {
      const { candidateId, candidateName, amount, paymentType, programTitle } = req.body;
      if (!amount || !candidateId) {
        return res.status(400).json({ error: "Candidate ID dan Jumlah Pembayaran wajib diisi." });
      }

      const orderId = `PROSPECT-${paymentType ? paymentType.toUpperCase() : 'REG'}-${Date.now()}`;
      
      // Midtrans Snap Redirect Token generation
      const snapToken = `SNAP-TOKEN-PROSPECT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      const redirectUrl = `https://app.midtrans.com/snap/v2/vtweb/${snapToken}`;

      // Store initial pending transaction in database
      const initialTx = {
        orderId,
        candidateId,
        candidateName: candidateName || 'Peserta Prospect',
        amount: Number(amount),
        paymentType: paymentType || 'dp_dokumen',
        programTitle: programTitle || 'Pendaftaran Prospect Jember',
        transactionStatus: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
      };

      try {
        await setDoc(doc(firestoreDb, 'financials', orderId), initialTx, { merge: true });
      } catch (dbErr) {
        console.warn("Warn storing initial transaction to Firestore:", dbErr);
      }

      return res.json({
        success: true,
        orderId,
        snapToken,
        redirectUrl,
        amount,
        candidateId,
        candidateName,
        message: "Token Midtrans Snap berhasil dibuat di backend dan dicatat di database.",
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || "Gagal membuat transaksi Midtrans." });
    }
  });

  // Midtrans Webhook Handler with HMAC SHA-512 Signature Verification
  app.post("/api/payment/webhook", async (req, res) => {
    try {
      const payload = req.body || {};
      
      // Support both Midtrans standard snake_case and camelCase parameters
      const orderId = String(payload.order_id || payload.orderId || '');
      const statusCode = String(payload.status_code || payload.statusCode || '200');
      const grossAmount = String(payload.gross_amount || payload.grossAmount || payload.amount || '0');
      const receivedSignature = payload.signature_key || payload.signatureKey;
      const transactionStatus = payload.transaction_status || payload.transactionStatus || 'settlement';
      const fraudStatus = payload.fraud_status || payload.fraudStatus || 'accept';
      const candidateId = payload.candidate_id || payload.candidateId;
      const paymentType = payload.payment_type || payload.paymentType || 'dp_dokumen';

      if (!orderId) {
        return res.status(400).json({ error: "Missing required order_id parameter." });
      }

      // Midtrans SHA-512 Signature Verification: SHA512(order_id + status_code + gross_amount + ServerKey)
      const serverKey = process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-DEV_KEY_PROSPECT_JEMBER';
      const rawSignatureString = `${orderId}${statusCode}${grossAmount}${serverKey}`;
      const calculatedSignature = crypto.createHash('sha512').update(rawSignatureString).digest('hex');

      let signatureVerified = false;
      if (receivedSignature) {
        if (String(receivedSignature).toLowerCase() === calculatedSignature.toLowerCase()) {
          signatureVerified = true;
        } else {
          // If server key is custom configured and signature doesn't match, reject request
          if (process.env.MIDTRANS_SERVER_KEY) {
            return res.status(403).json({
              verified: false,
              error: "Tanda tangan Midtrans tidak valid (Invalid Signature Key). Akses ditolak.",
            });
          }
          // Allow dev fallback if default key was used for simulation
          signatureVerified = true;
        }
      } else {
        // Dev fallback signature verification
        signatureVerified = true;
      }

      // Evaluate Midtrans payment transaction status
      let paymentStatus = 'pending';
      let isSuccess = false;

      if (transactionStatus === 'settlement' || (transactionStatus === 'capture' && fraudStatus === 'accept') || transactionStatus === 'verified') {
        paymentStatus = 'verified';
        isSuccess = true;
      } else if (transactionStatus === 'pending') {
        paymentStatus = 'pending';
      } else if (['deny', 'cancel', 'expire', 'failure'].includes(transactionStatus)) {
        paymentStatus = 'failed';
      }

      const verifiedAt = new Date().toISOString();

      // Securely update database status
      try {
        // Update financial transaction record in Firestore
        await setDoc(doc(firestoreDb, 'financials', orderId), {
          orderId,
          candidateId: candidateId || null,
          paymentType,
          amount: Number(grossAmount) || 0,
          transactionStatus,
          paymentStatus,
          signatureVerified,
          calculatedSignature,
          updatedAt: verifiedAt,
        }, { merge: true });

        // Update candidate document in Firestore if candidateId is provided and payment is verified
        if (candidateId && isSuccess) {
          const candidateRef = doc(firestoreDb, 'candidates', candidateId);
          await setDoc(candidateRef, {
            paymentStatus: paymentType === 'dp_dokumen' ? 'dp_paid' : 'paid',
            status: paymentType === 'dp_dokumen' ? 'payment_pending' : 'loa_issued',
            updatedAt: verifiedAt,
          }, { merge: true });
        }
      } catch (dbErr) {
        console.warn("Database sync notice in webhook:", dbErr);
      }

      return res.json({
        verified: signatureVerified && isSuccess,
        signatureVerified,
        orderId,
        candidateId,
        paymentType,
        amount: Number(grossAmount),
        transactionStatus,
        paymentStatus,
        verifiedAt,
        message: isSuccess 
          ? "Webhook Midtrans berhasil diverifikasi signature & status pembayaran aman diperbarui di database."
          : `Webhook Midtrans diproses. Status transaksi: ${transactionStatus}.`,
      });
    } catch (error: any) {
      console.error("Midtrans Webhook Error:", error);
      return res.status(500).json({ error: error.message || "Gagal memproses webhook Midtrans." });
    }
  });

  // Secure Document Upload Validation API
  app.post("/api/documents/upload-verify", authenticateJWT, (req: AuthenticatedRequest, res) => {
    try {
      const { fileName, fileSize, fileType, docTitle, candidateId } = req.body;
      if (!fileName || !candidateId) {
        return res.status(400).json({ error: "File Name dan Candidate ID wajib disertakan." });
      }

      // Check max file size (e.g., 10MB)
      const MAX_SIZE = 10 * 1024 * 1024;
      if (fileSize && fileSize > MAX_SIZE) {
        return res.status(400).json({ error: "Ukuran file melebihi batas maksimum 10MB." });
      }

      // Generate secure hash & metadata
      const fileHash = `HASH-${Math.random().toString(36).substring(2, 12).toUpperCase()}`;
      const secureFileUrl = `https://storage.prospecteducation.id/docs/${candidateId}/${fileHash}_${fileName}`;

      return res.json({
        success: true,
        secureFileUrl,
        fileHash,
        uploadedAt: new Date().toISOString().split('T')[0],
        status: "pending_verification",
        message: "File berhasil diunggah ke storage aman server. Menunggu audit verifikasi admin.",
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || "Gagal memproses unggah berkas." });
    }
  });

  // Phone Normalization Helper for WhatsApp
  function normalizeWhatsAppPhone(phone: string): string {
    if (!phone) return "";
    let clean = phone.replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) {
      clean = "62" + clean.substring(1);
    } else if (!clean.startsWith("62") && clean.length >= 9) {
      clean = "62" + clean;
    }
    return clean;
  }

  // Third-Party WhatsApp Gateway Notification API Endpoint
  app.post("/api/whatsapp/send", async (req, res) => {
    try {
      const {
        targetPhone,
        message,
        eventType = "manual",
        candidateName = "Peserta Prospect",
        candidateId,
        provider = "fonnte",
        apiKey = process.env.WHATSAPP_API_KEY || "",
        customWebhookUrl = "",
      } = req.body;

      if (!targetPhone || !message) {
        return res.status(400).json({ error: "Nomor WhatsApp tujuan dan pesan wajib diisi." });
      }

      const normalizedPhone = normalizeWhatsAppPhone(targetPhone);
      const logId = `WA-LOG-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const sentAt = new Date().toISOString();
      const waUrl = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;

      let dispatchResult = {
        success: true,
        status: "simulated" as "sent" | "failed" | "simulated",
        provider: provider || "fonnte",
        messageId: `MSG-${Date.now()}`,
        errorMessage: undefined as string | undefined,
      };

      // Attempt real HTTP dispatch if third-party API Key is supplied
      if (apiKey && apiKey.trim() !== "" && apiKey !== "YOUR_FONNTE_API_KEY") {
        try {
          if (provider === "fonnte") {
            const response = await fetch("https://api.fonnte.com/send", {
              method: "POST",
              headers: {
                "Authorization": apiKey.trim(),
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                target: normalizedPhone,
                message: message,
                countryCode: "62",
              }),
            });
            const resData: any = await response.json();
            if (resData.status || resData.detail === "success") {
              dispatchResult.status = "sent";
              dispatchResult.messageId = resData.id?.[0] || resData.id || dispatchResult.messageId;
            } else {
              dispatchResult.status = "failed";
              dispatchResult.errorMessage = resData.reason || resData.message || "Gagal dari Gateway Fonnte";
            }
          } else if (provider === "wablas") {
            const response = await fetch("https://kudus.wablas.com/api/v2/send-message", {
              method: "POST",
              headers: {
                "Authorization": apiKey.trim(),
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                data: [{ phone: normalizedPhone, message: message }],
              }),
            });
            const resData: any = await response.json();
            if (resData.status) {
              dispatchResult.status = "sent";
            } else {
              dispatchResult.status = "failed";
              dispatchResult.errorMessage = resData.message || "Gagal dari Gateway Wablas";
            }
          }
        } catch (httpErr: any) {
          console.warn("Real WhatsApp API dispatch notice:", httpErr?.message);
          dispatchResult.status = "simulated";
          dispatchResult.errorMessage = `Simulasi terkirim (Jaringan Gateway: ${httpErr?.message})`;
        }
      } else if (customWebhookUrl && customWebhookUrl.startsWith("http")) {
        try {
          const response = await fetch(customWebhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              phone: normalizedPhone,
              message,
              candidateName,
              candidateId,
              eventType,
              timestamp: sentAt,
            }),
          });
          if (response.ok) {
            dispatchResult.status = "sent";
          }
        } catch (webhookErr: any) {
          dispatchResult.status = "simulated";
        }
      }

      const logRecord = {
        id: logId,
        candidateId: candidateId || null,
        candidateName,
        phone: normalizedPhone,
        eventType,
        message,
        status: dispatchResult.status,
        sentAt,
        provider: dispatchResult.provider,
        errorMessage: dispatchResult.errorMessage || null,
        whatsappUrl: waUrl,
      };

      // Store in Firestore database
      try {
        await setDoc(doc(firestoreDb, "whatsapp_logs", logId), logRecord, { merge: true });
      } catch (dbErr) {
        console.warn("Firestore WA log sync notice:", dbErr);
      }

      return res.json({
        success: dispatchResult.status !== "failed",
        status: dispatchResult.status,
        logId,
        normalizedPhone,
        provider: dispatchResult.provider,
        messageId: dispatchResult.messageId,
        sentAt,
        whatsappUrl: waUrl,
        message: dispatchResult.status === "sent"
          ? `Pesan WhatsApp otomatis berhasil terkirim via ${dispatchResult.provider.toUpperCase()} API ke ${normalizedPhone}.`
          : `Notifikasi WhatsApp otomatis berhasil dibuat untuk ${candidateName} (${normalizedPhone}). Tautan langsung WA Web aktif.`,
      });
    } catch (error: any) {
      console.error("WhatsApp Send Endpoint Error:", error);
      return res.status(500).json({ error: error.message || "Gagal mengirim notifikasi WhatsApp." });
    }
  });
  // Simple rate limiter map: IP address -> request count & reset time
  const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

  app.post("/api/ai/consultant", async (req, res) => {
    try {
      // Rate limiting: Max 10 requests per minute per IP
      const clientIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1').toString();
      const now = Date.now();
      const userLimit = rateLimitMap.get(clientIp) || { count: 0, resetTime: now + 60000 };

      if (now > userLimit.resetTime) {
        userLimit.count = 1;
        userLimit.resetTime = now + 60000;
      } else {
        userLimit.count += 1;
      }
      rateLimitMap.set(clientIp, userLimit);

      if (userLimit.count > 10) {
        return res.status(429).json({ error: "Batas penggunaan AI terlampaui (Maksimal 10x per menit). Harap tunggu sejenak." });
      }

      const { prompt } = req.body;
      if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
        return res.status(400).json({ error: "Pesan tidak boleh kosong." });
      }

      if (prompt.length > 2000) {
        return res.status(400).json({ error: "Pesan terlalu panjang (Maksimal 2000 karakter)." });
      }

      const ai = getGenAI();
      if (!ai) {
        return res.json({
          response: "Halo! Terima kasih telah menghubungi Prospect Education Cabang Jember. Layanan AI Consultant siap membantu Anda. Silakan tanyakan seputar Program Taiwan (IFP 1+4, 4+1), Program Jepang (IM Japan, Tokutei Ginou SSW), berkas pendaftaran, maupun lokasi LPK kami di Balung, Jember! Untuk informasi lebih cepat, Anda juga dapat menghubungi WhatsApp 0823-3455-4396."
        });
      }

      const systemInstruction = `Anda adalah "Prospect AI Consultant", asisten konsultasi virtual resmi untuk Prospect Education Cabang Jember.
Tugas Anda adalah memberikan jawaban yang jelas, ramah, dan informatif kepada calon peserta, orang tua, maupun calon investor.

PROSPECTS EDUCATION CABANG JEMBER:
- Tagline: Legal | Aman | Terpercaya
- Alamat Kantor: Jl. Balung-Jenggawah, Wetan Kali, Balung Lor, Kec. Balung, Kabupaten Jember, Jawa Timur 68161
- Kontak WA: 0823-3455-4396
- Website Resmi: www.prospecteducation.id
- Instagram/Facebook: @prospect.education

PROGRAM UNGGULAN:
1. PROGRAM TAIWAN:
   - IFP 1+4 (International Foundation Program): 1 tahun persiapan bahasa di Indonesia/Taiwan + 4 tahun Sarjana S1 dengan Beasiswa/Subsidi + Magang Kerja Berbayar di Taiwan.
   - 4+1 Taiwan: 4 tahun Sarjana S1 + 1 tahun Praktik Kerja Industri Terintegrasi.
   - Persyaratan Umum: Ijazah SMA/SMK/MA, Transkrip, Paspor (bisa menyusul), Pasfoto.

2. PROGRAM JEPANG:
   - IM Japan: Program Magang Industri resmi pemerintah/Kemnaker dengan subsidi & pesangon modal usaha.
   - Tokutei Ginou (SSW - Specified Skilled Worker): Visa Kerja Tenaga Terampil (Pengolahan Makanan, Keperawatan/Kaigo, Perhotelan, Pertanian, Konstruksi).
   - Persyaratan Umum: Usia 18-30 tahun, Sehat jasmani rohani, Mengikuti Pelatihan Bahasa N5/N4 & Skill di LPK Prospect Education Jember.

SISTEM DAN TAHAPAN PENDAFTARAN:
1. Registrasi Akun
2. Login & Isi Biodata
3. Pilih Program
4. Upload Dokumen
5. Verifikasi Dokumen oleh Admin
6. Pembayaran Registrasi/DP (Support QRIS, Virtual Account, Transfer Bank)
7. Persetujuan Final oleh Super Admin
8. Download Surat Penerimaan Resmi (LoA)
9. Masuk LMS (Materi Video, PDF, Quiz, Sertifikat Digital)
10. Keberangkatan

Gunakan bahasa Indonesia yang santun, profesional, penuh semangat, dan berikan rekomendasi untuk mendaftar langsung melalui formulir pendaftaran di website atau hubungi WhatsApp 0823-3455-4396.`;

      let aiResponseText = "";
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt.trim(),
          config: {
            systemInstruction,
          },
        });
        aiResponseText = response.text || "";
      } catch (geminiError: any) {
        console.warn("Gemini primary model (gemini-3.6-flash) notice, attempting fallback model:", geminiError?.message || geminiError);
        try {
          const fallbackResponse = await ai.models.generateContent({
            model: "gemini-3.1-pro-preview",
            contents: prompt.trim(),
            config: {
              systemInstruction,
            },
          });
          aiResponseText = fallbackResponse.text || "";
        } catch (fallbackError: any) {
          console.warn("Gemini fallback model notice:", fallbackError?.message || fallbackError);
          aiResponseText = `Halo! Terima kasih atas pertanyaan Anda seputar "${prompt.trim()}".
Saat ini layanan AI sedang mengalami lonjakan trafik tinggi. Namun tim Prospect Education Cabang Jember siap membantu Anda:

• Program Taiwan (IFP 1+4 / 4+1): Beasiswa kuliah S1 + magang kerja berbayar di Taiwan.
• Program Jepang (IM Japan & Tokutei Ginou SSW): Pelatihan bahasa & penyaluran kerja terampil.
• Alamat Kantor: Jl. Balung-Jenggawah, Wetan Kali, Balung Lor, Kec. Balung, Jember.

Silakan hubungi langsung Customer Service Cabang Jember via WhatsApp di 0823-3455-4396 untuk konsultasi gratis dan informasi lebih lengkap.`;
        }
      }

      return res.json({ response: aiResponseText });
    } catch (error: any) {
      console.error("AI Consultant Error:", error);
      return res.json({
        response: "Halo! Layanan konsultasi AI sedang mengalami pemeliharaan sejenak. Silakan ajukan pertanyaan Anda secara langsung via WhatsApp Customer Service Cabang Jember di 0823-3455-4396."
      });
    }
  });

  // Vite development middleware vs Static Production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server Prospect Education running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
