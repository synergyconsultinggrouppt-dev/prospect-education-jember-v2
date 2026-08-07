import React, { useState } from 'react';
import { Candidate, LMSModule } from '../../types';
import { useApp } from '../../context/AppContext';
import { downloadCertificatePDF } from '../../utils/downloadCertificatePdf';
import logoImg from '../../assets/images/prospect_logo_1784769572843.jpg';
import {
  X,
  Award,
  Download,
  Printer,
  CheckCircle2,
  Copy,
  Check,
  QrCode,
  ShieldCheck,
  BookOpen,
  Sparkles,
  FileText,
  ExternalLink,
  Info,
  GraduationCap,
  FileCheck,
  Building2,
  Sliders,
  CheckSquare,
  Square,
  BadgeCheck,
} from 'lucide-react';

interface DigitalCertificateModalProps {
  candidate: Candidate;
  modules: LMSModule[];
  onClose: () => void;
  defaultDocType?: 'cert' | 'transcript' | 'loa' | 'active_student';
}

export const DigitalCertificateModal: React.FC<DigitalCertificateModalProps> = ({
  candidate,
  modules,
  onClose,
  defaultDocType = 'cert',
}) => {
  const { websiteSettings } = useApp();
  const [docType, setDocType] = useState<'cert' | 'transcript' | 'loa' | 'active_student'>(defaultDocType);

  // Customization options before printing
  const [showTranscriptOnCert, setShowTranscriptOnCert] = useState(true);
  const [showSignature, setShowSignature] = useState(true);
  const [showQrCode, setShowQrCode] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Dynamic LKP institution settings
  const siteName = websiteSettings?.siteName || 'PROSPECT EDUCATION CABANG JEMBER';
  const officeAddress =
    websiteSettings?.officeAddress ||
    'Jl. Balung-Jenggawah, Wetan Kali, Balung Lor, Kec. Balung, Kabupaten Jember, Jawa Timur 68161';
  const csPhoneWhatsApp = websiteSettings?.csPhoneWhatsApp || '0823-3455-4396';
  const contactEmail = websiteSettings?.contactEmail || 'info@prospect-jember.id';
  const officialSignatoryName = websiteSettings?.officialSignatoryName || 'Rohim Egy, S.Pd.';
  const officialSignatoryTitle =
    websiteSettings?.officialSignatoryTitle || 'Kepala Cabang Prospect Education Jember';

  const completedModules = modules.filter((m) => m.isCompleted);
  const totalModules = modules.length;
  const isFullyCompleted = completedModules.length === totalModules && totalModules > 0;
  const certNumber =
    candidate.certificateNumber ||
    `CERT/PE-JBR/${candidate.selectedProgram ? candidate.selectedProgram.toUpperCase() : 'LMS'}/2026/088`;
  const issueDate = candidate.superAdminApprovalDate || candidate.registeredAt || '24 Juli 2026';

  const programTitle =
    candidate.selectedProgram === 'taiwan_ifp'
      ? 'Program Taiwan IFP 1+4 (S1 Beasiswa Subsidized - 1 Thn Bahasa + 4 Thn S1)'
      : candidate.selectedProgram === 'taiwan_4_1'
      ? 'Program Taiwan 4+1 (4 Thn S1 + 1 Thn S2 Pascasarjana)'
      : candidate.selectedProgram === 'japan_im'
      ? 'Program Magang Kerja Jepang IM Japan (Kemnaker RI)'
      : candidate.selectedProgram === 'japan_ssw'
      ? 'Program Kerja Jepang Tokutei Ginou (SSW)'
      : 'Program Pembekalan & Orientasi Prospect Education';

  // Candidate biodata details
  const candidateNik = candidate.biodata?.nik || candidate.nik || '-';
  const candidatePhone = candidate.biodata?.phoneWA || candidate.phoneWA || candidate.phone || '-';
  const candidateCity = candidate.biodata?.regency || candidate.city || 'Jember';

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleCopyLink = () => {
    const verifyUrl = `https://prospect-jember.id/verify/${certNumber.replace(/\//g, '-')}`;
    navigator.clipboard.writeText(verifyUrl);
    setCopiedLink(true);
    triggerToast('Link verifikasi resmi berhasil disalin ke clipboard!');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // 1. Generate standalone HTML for printing in a new window / tab
  const generateStandaloneHtml = () => {
    const isCert = docType === 'cert';
    const isTranscript = docType === 'transcript';
    const isLoa = docType === 'loa';
    const isActiveStudent = docType === 'active_student';

    const pageOrientation = isCert ? 'landscape' : 'portrait';

    return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>${
    isCert
      ? 'Sertifikat_Kelulusan'
      : isTranscript
      ? 'Transkrip_Nilai_LMS'
      : isLoa
      ? 'Surat_Penerimaan_LoA'
      : 'Surat_Keterangan_Peserta_Aktif'
  }_${candidate.fullName.replace(/\s+/g, '_')}</title>
  <style>
    @page {
      size: A4 ${pageOrientation};
      margin: 8mm;
    }
    * { box-sizing: border-box; }
    body {
      font-family: 'Times New Roman', Times, serif;
      background-color: #ffffff;
      color: #0f172a;
      margin: 0;
      padding: 12px;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .print-bar {
      background: #0f172a;
      color: white;
      padding: 12px 20px;
      border-radius: 12px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .btn-print {
      background: #b91c1c;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: bold;
      cursor: pointer;
      font-size: 13px;
    }
    .doc-container {
      background: #fff;
      border: ${isCert ? '6px double #b45309' : '2px solid #991b1b'};
      padding: ${isCert ? '20px' : '32px'};
      max-width: ${isCert ? '1050px' : '800px'};
      margin: 0 auto;
      border-radius: 8px;
      position: relative;
    }
    .doc-border-inner {
      border: ${isCert ? '2px solid #d97706' : 'none'};
      padding: ${isCert ? '16px 24px' : '0'};
      border-radius: 4px;
      background: ${isCert ? 'linear-gradient(180deg, #fffdfa 0%, #ffffff 100%)' : 'none'};
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #991b1b;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .org-title {
      font-size: 9pt;
      font-weight: bold;
      color: #7f1d1d;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      font-family: system-ui, sans-serif;
    }
    .brand-title {
      font-size: 18pt;
      font-weight: 900;
      color: #991b1b;
      margin: 2px 0;
      text-transform: uppercase;
      letter-spacing: -0.5px;
    }
    .subbrand {
      font-size: 8.5pt;
      color: #475569;
      font-family: system-ui, sans-serif;
      line-height: 1.4;
    }
    .doc-title {
      text-align: center;
      margin: 16px 0;
    }
    .main-heading {
      font-size: 18pt;
      font-weight: 900;
      color: #b45309;
      text-transform: uppercase;
      margin: 0;
      letter-spacing: 0.5px;
    }
    .sub-heading {
      font-size: 9.5pt;
      font-style: italic;
      color: #64748b;
      margin-top: 2px;
    }
    .doc-no {
      font-family: monospace;
      font-size: 9pt;
      font-weight: bold;
      color: #0f172a;
      background: #f1f5f9;
      padding: 3px 12px;
      border-radius: 12px;
      display: inline-block;
      margin-top: 6px;
      border: 1px solid #cbd5e1;
    }
    .candidate-name {
      font-size: 22pt;
      font-weight: 900;
      color: #991b1b;
      border-bottom: 2px solid #b45309;
      display: inline-block;
      padding: 0 20px 2px 20px;
      margin: 6px 0;
      text-transform: uppercase;
    }
    .meta-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 16px;
      font-family: system-ui, sans-serif;
      font-size: 9pt;
      margin: 12px 0;
    }
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8.5pt;
      font-family: system-ui, sans-serif;
      margin: 12px 0;
    }
    table.data-table th {
      background: #f1f5f9;
      color: #334155;
      padding: 6px 8px;
      border: 1px solid #cbd5e1;
      text-align: left;
    }
    table.data-table td {
      padding: 6px 8px;
      border: 1px solid #cbd5e1;
      color: #0f172a;
    }
    .footer-sigs {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 24px;
      font-family: system-ui, sans-serif;
      padding-top: 12px;
      border-top: 1px solid #e2e8f0;
    }
    .sig-box {
      text-align: center;
      width: 210px;
    }
    .sig-title {
      font-size: 8.5pt;
      color: #64748b;
      margin-bottom: 30px;
    }
    .sig-name {
      font-size: 9.5pt;
      font-weight: bold;
      color: #0f172a;
      border-top: 1px solid #94a3b8;
      padding-top: 3px;
    }
    .qr-stamp {
      text-align: center;
      background: #fffbe2;
      border: 2px dashed #d97706;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 8pt;
      color: #78350f;
      font-family: system-ui, sans-serif;
    }
    @media print {
      .no-print { display: none !important; }
      body { padding: 0; background: none; }
      .doc-container { box-shadow: none !important; }
    }
  </style>
</head>
<body>
  <div class="print-bar no-print">
    <div>
      <strong style="font-size: 15px; color: #fbbf24;">DOKUMEN RESMI PENCETAKAN CETAK / SIMPAN PDF</strong>
      <span style="font-size: 12px; display: block; color: #cbd5e1;">${siteName}</span>
    </div>
    <button class="btn-print" onclick="window.print()">🖨️ Cetak / Simpan PDF</button>
  </div>

  <div class="doc-container">
    <div class="doc-border-inner">
      <!-- Kop Surat Header -->
      <div class="header">
        <div class="org-title">LEMBAGA PELATIHAN KERJA (LPK) & KONSULTAN PENDIDIKAN</div>
        <div class="brand-title">${siteName}</div>
        <div class="subbrand">
          ${officeAddress}<br/>
          Email: <strong>${contactEmail}</strong> • WA CS: <strong>${csPhoneWhatsApp}</strong> • Website: <strong>prospect-jember.id</strong>
        </div>
      </div>

      ${
        isCert
          ? `
        <!-- Sertifikat Kelulusan -->
        <div class="doc-title">
          <div class="main-heading">SERTIFIKAT KELULUSAN MATRIKULASI</div>
          <div class="sub-heading">Certificate of Completion & Orientation Program</div>
          <div class="doc-no">NO. SERI: ${certNumber}</div>
        </div>

        <div style="text-align: center; margin: 12px 0;">
          <p style="font-size: 9.5pt; color: #475569; margin: 0;">Diberikan kepada peserta pelatihan (This is to certify that):</p>
          <div class="candidate-name">${candidate.fullName.toUpperCase()}</div>
          <div class="meta-box" style="display: inline-block;">
            <strong>No. Registrasi:</strong> <span style="color: #991b1b; font-family: monospace;">${candidate.registrationNumber}</span> &nbsp;|&nbsp;
            <strong>NIK:</strong> ${candidateNik} &nbsp;|&nbsp;
            <strong>Kota:</strong> ${candidateCity}
          </div>
          <p style="font-size: 10pt; font-weight: bold; color: #1e293b; margin-top: 6px; font-family: system-ui, sans-serif;">
            Program Pilihan: <span style="color: #991b1b;">${programTitle}</span>
          </p>
        </div>

        <p style="text-align: center; font-size: 10pt; line-height: 1.6; color: #334155; font-family: system-ui, sans-serif; max-w-2xl; margin: 12px auto;">
          Dinyatakan <strong>LULUS & MEMUASKAN</strong> dalam menyelesaikan seluruh rangkaian <strong>Modul Pelatihan LMS (${totalModules} Modul Utama)</strong> serta Pembekalan Vokasi & Budaya Kerja Luar Negeri di ${siteName}.
        </p>

        ${
          showTranscriptOnCert
            ? `
        <div style="background: #fff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px 14px; margin: 12px 0;">
          <div style="display: flex; justify-content: space-between; font-family: system-ui, sans-serif; font-size: 8.5pt; font-weight: bold; border-bottom: 1px solid #e2e8f0; pb: 4px; mb: 6px;">
            <span style="color: #991b1b;">PDF SUMMARY CARD: RINGKASAN MODUL & HASIL EVALUASI</span>
            <span style="color: #15803d;">${completedModules.length}/${totalModules} Modul Selesai (${totalModules > 0 ? Math.round((completedModules.length / totalModules) * 100) : 0}%)</span>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th style="width:30px; text-align:center;">No</th>
                <th>Nama Modul Pembelajaran</th>
                <th>Tipe Konten</th>
                <th>Durasi</th>
                <th style="text-align:center;">Status Evaluasi</th>
              </tr>
            </thead>
            <tbody>
              ${modules
                .map(
                  (m, idx) => `
                <tr>
                  <td style="text-align:center; font-family:monospace;">${idx + 1}</td>
                  <td><strong>${m.title}</strong></td>
                  <td style="text-transform:uppercase; font-size:7.5pt;">${m.contentType}</td>
                  <td>${m.durationMinutes} Menit</td>
                  <td style="text-align:center; color:${m.isCompleted ? '#15803d' : '#b45309'}; font-weight:bold;">
                    ${m.isCompleted ? '✓ SELESAI' : 'PROSES'}
                  </td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>
        `
            : ''
        }
      `
          : isTranscript
          ? `
        <!-- Transkrip Nilai LMS -->
        <div class="doc-title">
          <div class="main-heading" style="color: #991b1b;">TRANSKRIP NILAI & HASIL EVALUASI KUIS LMS</div>
          <div class="sub-heading">Official Academic & Competency Transcript Record</div>
          <div class="doc-no">NO. TRANSKRIP: TR/PE-JBR/${candidate.registrationNumber}/2026</div>
        </div>

        <div class="meta-box">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div><strong>Nama Peserta:</strong> ${candidate.fullName}</div>
            <div><strong>Nomor Registrasi:</strong> <span style="font-family: monospace; color: #991b1b;">${candidate.registrationNumber}</span></div>
            <div><strong>NIK:</strong> ${candidateNik}</div>
            <div><strong>Program Pilihan:</strong> ${programTitle}</div>
            <div><strong>Tanggal Terbit:</strong> ${issueDate}</div>
            <div><strong>Status Matrikulasi:</strong> <span style="color: #15803d; font-weight: bold;">LULUS (GRADE A)</span></div>
          </div>
        </div>

        <h4 style="font-family: system-ui, sans-serif; font-size: 10pt; color: #0f172a; margin-top: 16px;">
          Rincian Nilai & Capaian Modul LMS:
        </h4>
        <table class="data-table">
          <thead>
            <tr>
              <th style="width:30px; text-align:center;">No</th>
              <th>Modul Pembelajaran & Orientasi</th>
              <th>Kategori Language / Skill</th>
              <th>Durasi (Menit)</th>
              <th style="text-align:center;">Skor Kuis / Evaluasi</th>
              <th style="text-align:center;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${modules
              .map(
                (m, idx) => `
              <tr>
                <td style="text-align:center; font-family:monospace;">${idx + 1}</td>
                <td><strong>${m.title}</strong></td>
                <td>${m.language || 'Bahasa & Vokasi'}</td>
                <td>${m.durationMinutes} Menit</td>
                <td style="text-align:center; font-family:monospace; font-weight:bold; color: #991b1b;">
                  ${m.isCompleted ? '92 / 100' : '85 / 100'}
                </td>
                <td style="text-align:center; font-weight:bold; color:${m.isCompleted ? '#15803d' : '#b45309'};">
                  ${m.isCompleted ? 'LULUS (A)' : 'DALAM PROSES'}
                </td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px; margin-top: 16px; font-family: system-ui, sans-serif; font-size: 9pt; color: #166534;">
          <strong>Predikat Kelulusan Akhir:</strong> SANGAT MEMUASKAN (Grade A / Distinction) | Indeks Prestasi Pelatihan: <strong>3.88 / 4.00</strong>
        </div>
      `
          : isLoa
          ? `
        <!-- Surat LoA Penerimaan -->
        <div class="doc-title">
          <div class="main-heading" style="color: #991b1b;">SURAT KETERANGAN PENERIMAN (LETTER OF ACCEPTANCE)</div>
          <div class="sub-heading">Official Acceptance Letter & Training Endorsement</div>
          <div class="doc-no">NO. SURAT: ${candidate.loaNumber || 'LOA/PE-JBR/2026/088'}</div>
        </div>

        <div style="font-family: system-ui, sans-serif; font-size: 10pt; line-height: 1.8; color: #1e293b; margin: 20px 0; text-align: justify;">
          <p>Kepada Yth.<br/>
          <strong style="font-size: 12pt; color: #0f172a;">${candidate.fullName}</strong><br/>
          Peserta Pendaftaran Prospect Education Cabang Jember</p>

          <p>Dengan hormat,</p>
          <p>Berdasarkan hasil verifikasi berkas administrasi dan persetujuan Manajemen Prospect Education Cabang Jember, dengan ini kami menyatakan bahwa saudara/i:</p>

          <div class="meta-box">
            <div><strong>Nama Lengkap:</strong> ${candidate.fullName}</div>
            <div><strong>Nomor Registrasi:</strong> <span style="font-family: monospace; color: #991b1b;">${candidate.registrationNumber}</span></div>
            <div><strong>NIK:</strong> ${candidateNik}</div>
            <div><strong>Program Diterima:</strong> ${programTitle}</div>
            <div><strong>Status Penerimaan:</strong> <span style="color: #15803d; font-weight: bold;">RESMI DITERIMA (APPROVED)</span></div>
          </div>

          <p>Secara resmi telah <strong>DITERIMA</strong> untuk mengikuti seluruh rangkaian program pelatihan bahasa, pembentukan karakter, serta pengurusan dokumen keberangkatan di Prospect Education Cabang Jember.</p>
        </div>
      `
          : `
        <!-- Surat Peserta Aktif -->
        <div class="doc-title">
          <div class="main-heading" style="color: #0f172a;">SURAT KETERANGAN PESERTA AKTIF PELATIHAN</div>
          <div class="sub-heading">Active Student Enrollment Certification</div>
          <div class="doc-no">NO. KET: SKP/PE-JBR/${candidate.registrationNumber}/2026</div>
        </div>

        <div style="font-family: system-ui, sans-serif; font-size: 10pt; line-height: 1.8; color: #1e293b; margin: 20px 0; text-align: justify;">
          <p>Yang bertanda tangan di bawah ini, Kepala Cabang LKP & Konsultan Pendidikan Prospect Education Jember, menerangkan bahwa:</p>

          <div class="meta-box">
            <div><strong>Nama Lengkap:</strong> ${candidate.fullName}</div>
            <div><strong>Nomor Registrasi:</strong> <span style="font-family: monospace; color: #991b1b;">${candidate.registrationNumber}</span></div>
            <div><strong>NIK:</strong> ${candidateNik}</div>
            <div><strong>Program Pelatihan:</strong> ${programTitle}</div>
            <div><strong>Status Keaktifan:</strong> <span style="color: #15803d; font-weight: bold;">AKTIF MENGIKUTI MATRIKULASI & LMS</span></div>
          </div>

          <p>Adalah benar merupakan <strong>Peserta Didik Aktif</strong> yang terdaftar resmi di LKP Prospect Education Cabang Jember untuk persiapan keberangkatan studi/studi kerja luar negeri. Surat keterangan ini diterbitkan untuk keperluan kelengkapan administrasi paspor, visa, dan universitas/mitra kerja tujuan.</p>
        </div>
      `
      }

      <!-- Bottom Signature & Legal Seal Block -->
      <div class="footer-sigs">
        <div class="sig-box">
          <div class="sig-title">Tim Akademik & Instruktur Utama</div>
          ${showSignature ? '<div style="height: 40px; font-style: italic; color: #991b1b; font-weight: bold;">[Tanda Tangan Digital]</div>' : ''}
          <div class="sig-name">Siti Aminah, S.Pd.</div>
        </div>

        ${
          showQrCode
            ? `
        <div class="qr-stamp">
          <div style="font-weight:bold; font-size:8.5pt; margin-bottom:2px; color:#78350f;">VERIFIKASI DIGITAL RESMI</div>
          <div>QR Code ID: ${candidate.id}</div>
          <div>Diterbitkan: ${issueDate}</div>
          <div style="font-weight:bold; color:#991b1b; margin-top:2px; text-transform:uppercase;">${siteName}</div>
        </div>
        `
            : ''
        }

        <div class="sig-box">
          <div class="sig-title">${officialSignatoryTitle}</div>
          ${showSignature ? '<div style="height: 40px; font-style: italic; color: #991b1b; font-weight: bold;">[Stempel & Tanda Tangan]</div>' : ''}
          <div class="sig-name">${officialSignatoryName}</div>
        </div>
      </div>
    </div>
  </div>

  <script>
    window.addEventListener('DOMContentLoaded', function() {
      setTimeout(function() {
        window.print();
      }, 400);
    });
  </script>
</body>
</html>`;
  };

  // Handler for printing directly using browser dialog or popup window
  const handlePrintInNewWindow = () => {
    triggerToast('Membuka halaman dokumen khusus pencetakan...');
    const htmlContent = generateStandaloneHtml();
    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(htmlContent);
      printWin.document.close();
      printWin.focus();
    } else {
      triggerToast('Gagal membuka popup. Silakan izinkan popup browser Anda untuk mencetak.');
    }
  };

  // Handler for direct window print fallback
  const handlePrintDirect = () => {
    triggerToast('Membuka dialog pencetakan browser...');
    setTimeout(() => {
      window.print();
    }, 250);
  };

  // Handler for downloading HTML / PDF certificate file
  const handleDownloadDoc = () => {
    if (docType === 'cert') {
      downloadCertificatePDF(candidate, modules, websiteSettings);
      triggerToast('Sertifikat Digital resmi berhasil disiapkan & diunduh!');
      return;
    }

    const htmlContent = generateStandaloneHtml();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const docTitle =
      docType === 'transcript'
        ? 'Transkrip_Nilai_LMS'
        : docType === 'loa'
        ? 'Surat_Penerimaan_LoA'
        : 'Surat_Peserta_Aktif';
    const safeName = candidate.fullName.toLowerCase().replace(/\s+/g, '_');
    link.download = `${docTitle}_Prospect_${safeName}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    triggerToast(`File ${docTitle.replace(/_/g, ' ')} berhasil diunduh!`);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
    >
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[95vh] flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-amber-500/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  Modul Pencetakan Sertifikat & Berkas Resmi
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> AKREDITASI RESMI LKP
                </span>
              </div>
              <h3 className="font-bold text-base sm:text-lg font-serif mt-0.5">
                Cetak Sertifikat Kelulusan & Dokumen Digital Peserta
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-full transition cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast Alert Banner */}
        {toastMsg && (
          <div className="bg-slate-900 text-white px-5 py-3 border-b border-amber-500/40 flex items-center justify-between gap-3 animate-in fade-in duration-150 shrink-0">
            <div className="flex items-center gap-2.5">
              <BadgeCheck className="w-5 h-5 text-amber-400 shrink-0" />
              <p className="text-xs text-amber-200 font-medium">{toastMsg}</p>
            </div>
            <button onClick={() => setToastMsg(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Document Type Switcher Tabs */}
        <div className="bg-slate-900 text-white p-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 shrink-0">
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setDocType('cert')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                docType === 'cert'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>1. Sertifikat Kelulusan LMS</span>
            </button>

            <button
              onClick={() => setDocType('transcript')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                docType === 'transcript'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>2. Transkrip Nilai Modul</span>
            </button>

            <button
              onClick={() => setDocType('loa')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                docType === 'loa'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>3. Surat Penerimaan (LoA)</span>
            </button>

            <button
              onClick={() => setDocType('active_student')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                docType === 'active_student'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>4. Surat Peserta Aktif</span>
            </button>
          </div>

          {/* Format Options Toggles */}
          <div className="flex items-center gap-3 text-[11px] text-slate-300 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 shrink-0">
            {docType === 'cert' && (
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-white transition">
                <input
                  type="checkbox"
                  checked={showTranscriptOnCert}
                  onChange={(e) => setShowTranscriptOnCert(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
                />
                <span>Tampilkan Tabel Rincian Modul</span>
              </label>
            )}

            <label className="flex items-center gap-1.5 cursor-pointer hover:text-white transition">
              <input
                type="checkbox"
                checked={showSignature}
                onChange={(e) => setShowSignature(e.target.checked)}
                className="rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
              />
              <span>Stempel & Tanda Tangan</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer hover:text-white transition">
              <input
                type="checkbox"
                checked={showQrCode}
                onChange={(e) => setShowQrCode(e.target.checked)}
                className="rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
              />
              <span>QR Code Verifikasi</span>
            </label>
          </div>
        </div>

        {/* Modal Body: Printable Canvas Preview */}
        <div className="p-4 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto bg-slate-100">
          {/* Printable Document Container */}
          <div className="printable-certificate-area bg-white border-4 border-amber-600 rounded-2xl p-6 sm:p-10 shadow-lg relative font-serif text-slate-900 space-y-6 max-w-4xl mx-auto">
            {/* Watermark / Badge Accent */}
            <div className="absolute top-3 right-3 sm:top-5 sm:right-5 bg-amber-100 border border-amber-300 text-amber-900 px-3 py-1 rounded-full text-[10px] font-sans font-bold flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>AKREDITASI RESMI LKP</span>
            </div>

            {/* Header Kop Surat LKP */}
            <div className="text-center border-b-2 border-red-900 pb-5 space-y-1">
              <p className="text-[10px] font-bold tracking-widest text-red-900 font-sans uppercase">
                LEMBAGA PELATIHAN KERJA (LPK) & KONSULTAN PENDIDIKAN
              </p>
              <h2 className="text-xl sm:text-2xl font-black text-red-800 tracking-tight font-serif uppercase">
                {siteName}
              </h2>
              <p className="text-[11px] text-slate-600 font-sans max-w-3xl mx-auto leading-relaxed">
                {officeAddress}
                <br />
                Email: <strong className="text-slate-800">{contactEmail}</strong> • WA: <strong className="text-slate-800">{csPhoneWhatsApp}</strong> • Website: <strong className="text-slate-800">prospect-jember.id</strong>
              </p>
            </div>

            {/* Document Specific Preview Contents */}
            {docType === 'cert' && (
              <>
                <div className="text-center space-y-1 my-4">
                  <h3 className="text-lg sm:text-2xl font-black text-amber-800 tracking-wide uppercase font-serif">
                    SERTIFIKAT KELULUSAN MATRIKULASI
                  </h3>
                  <p className="text-xs text-slate-500 italic font-serif">
                    Certificate of Completion & Orientation Program
                  </p>
                  <p className="text-xs font-mono font-bold text-slate-800 mt-2 bg-slate-100 px-3 py-1 rounded-full inline-block border border-slate-200">
                    NO. SERI: {certNumber}
                  </p>
                </div>

                <div className="text-center space-y-2 py-2">
                  <p className="text-xs text-slate-600 font-sans">Diberikan kepada peserta pelatihan (This is to certify that):</p>
                  <div className="inline-block border-b-2 border-amber-600 px-6 pb-1">
                    <h4 className="text-xl sm:text-3xl font-black text-red-900 uppercase tracking-tight">
                      {candidate.fullName}
                    </h4>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-sans text-slate-700 mt-2 bg-slate-50 py-2 px-4 rounded-xl border border-slate-200">
                    <span><strong>No. Registrasi:</strong> <span className="font-mono text-red-900 font-bold">{candidate.registrationNumber}</span></span>
                    <span>•</span>
                    <span><strong>NIK:</strong> <span className="font-mono">{candidateNik}</span></span>
                    <span>•</span>
                    <span><strong>Kota/Kab:</strong> {candidateCity}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 font-sans mt-1">
                    Program Pilihan: <span className="text-red-900">{programTitle}</span>
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-center text-slate-700 leading-relaxed max-w-2xl mx-auto font-sans">
                  Dinyatakan <strong>LULUS & MEMUASKAN</strong> dalam menyelesaikan seluruh rangkaian{' '}
                  <strong>Modul Pelatihan LMS ({totalModules} Modul Utama)</strong> serta Pembekalan Vokasi & Budaya Kerja Luar Negeri di {siteName}.
                </p>

                {showTranscriptOnCert && (
                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs font-sans space-y-3">
                    <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-2 gap-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-red-700" />
                        <h5 className="font-bold text-xs sm:text-sm text-slate-900 uppercase tracking-wider">
                          PDF Summary Card: Ringkasan Modul & Hasil Evaluasi
                        </h5>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {completedModules.length}/{totalModules} Modul Selesai ({totalModules > 0 ? Math.round((completedModules.length / totalModules) * 100) : 0}%)
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-slate-700 border-b border-slate-200">
                            <th className="p-2 font-bold w-10 text-center">No</th>
                            <th className="p-2 font-bold">Nama Modul Pembelajaran</th>
                            <th className="p-2 font-bold">Tipe Konten</th>
                            <th className="p-2 font-bold">Durasi</th>
                            <th className="p-2 font-bold text-center">Status Evaluasi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-800">
                          {modules.map((mod, idx) => (
                            <tr key={mod.id} className="hover:bg-slate-50/80">
                              <td className="p-2 text-center font-mono text-slate-500">{idx + 1}</td>
                              <td className="p-2 font-bold text-slate-900">{mod.title}</td>
                              <td className="p-2 uppercase text-[10px] text-slate-500 font-semibold">{mod.contentType}</td>
                              <td className="p-2">{mod.durationMinutes} Menit</td>
                              <td className="p-2 text-center">
                                {mod.isCompleted ? (
                                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700 text-[11px]">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> SELESAI
                                  </span>
                                ) : (
                                  <span className="font-medium text-amber-700 text-[11px]">DALAM PROSES</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}

            {docType === 'transcript' && (
              <div className="font-sans space-y-4 text-xs sm:text-sm">
                <div className="text-center space-y-1 my-2">
                  <h3 className="text-xl font-black text-red-900 uppercase font-serif">
                    TRANSKRIP NILAI & HASIL EVALUASI KUIS LMS
                  </h3>
                  <p className="text-xs text-slate-500 italic font-serif">
                    Official Academic & Competency Transcript Record
                  </p>
                  <p className="text-xs font-mono font-bold text-slate-800 mt-1 inline-block bg-slate-100 px-3 py-0.5 rounded-full border border-slate-200">
                    NO. TRANSKRIP: TR/PE-JBR/{candidate.registrationNumber}/2026
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><strong>Nama Peserta:</strong> {candidate.fullName}</div>
                  <div><strong>No. Registrasi:</strong> <span className="font-mono text-red-800 font-bold">{candidate.registrationNumber}</span></div>
                  <div><strong>NIK:</strong> {candidateNik}</div>
                  <div><strong>Program Diterima:</strong> {programTitle}</div>
                  <div><strong>Tanggal Terbit:</strong> {issueDate}</div>
                  <div><strong>Status Kelulusan:</strong> <span className="font-bold text-emerald-700">LULUS (GRADE A)</span></div>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                        <th className="p-2.5 text-center w-10">No</th>
                        <th className="p-2.5">Modul Pembelajaran & Orientasi</th>
                        <th className="p-2.5">Kategori Language / Skill</th>
                        <th className="p-2.5 text-center">Durasi</th>
                        <th className="p-2.5 text-center">Skor Evaluasi</th>
                        <th className="p-2.5 text-center">Hasil</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800 font-mono">
                      {modules.map((mod, idx) => (
                        <tr key={mod.id}>
                          <td className="p-2.5 text-center text-slate-500">{idx + 1}</td>
                          <td className="p-2.5 font-bold font-sans text-slate-900">{mod.title}</td>
                          <td className="p-2.5 font-sans">{mod.language || 'Bahasa & Vokasi'}</td>
                          <td className="p-2.5 text-center font-sans">{mod.durationMinutes} mnt</td>
                          <td className="p-2.5 text-center font-bold text-red-800">
                            {mod.isCompleted ? '92 / 100' : '85 / 100'}
                          </td>
                          <td className="p-2.5 text-center font-sans font-bold text-emerald-700">
                            {mod.isCompleted ? 'LULUS (A)' : 'PROSES'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-emerald-900 font-medium text-xs flex items-center justify-between">
                  <span>Predikat Kelulusan: <strong>SANGAT MEMUASKAN (Grade A / Distinction)</strong></span>
                  <span className="font-mono font-bold">IPK: 3.88 / 4.00</span>
                </div>
              </div>
            )}

            {docType === 'loa' && (
              <div className="font-sans space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed">
                <div className="text-center space-y-1 my-2">
                  <h3 className="text-xl font-black text-red-900 uppercase font-serif">
                    SURAT KETERANGAN PENERIMAAN (LETTER OF ACCEPTANCE)
                  </h3>
                  <p className="text-xs font-mono font-bold text-slate-800 mt-1 inline-block bg-slate-100 px-3 py-0.5 rounded-full border border-slate-200">
                    NO. SURAT: {candidate.loaNumber || 'LOA/PE-JBR/2026/088'}
                  </p>
                </div>

                <p>
                  Kepada Yth. <br />
                  <strong className="text-slate-900 text-base">{candidate.fullName}</strong> <br />
                  Peserta Pendaftaran Prospect Education Cabang Jember
                </p>

                <p>Dengan hormat,</p>

                <p className="text-justify">
                  Berdasarkan hasil verifikasi administrasi dokumen dan persetujuan Manajemen Prospect Education Cabang Jember, bersama ini kami menyatakan bahwa peserta di bawah ini:
                </p>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div><strong>Nama Lengkap:</strong> {candidate.fullName}</div>
                  <div><strong>Nomor Registrasi:</strong> <span className="font-mono text-red-800 font-bold">{candidate.registrationNumber}</span></div>
                  <div><strong>NIK:</strong> {candidateNik}</div>
                  <div><strong>Program Diterima:</strong> {programTitle}</div>
                  <div><strong>Status Penerimaan:</strong> <span className="text-emerald-700 font-bold">RESMI DITERIMA (APPROVED)</span></div>
                </div>

                <p className="text-justify">
                  Secara resmi telah <strong>DITERIMA</strong> untuk mengikuti seluruh tahap pelatihan persiapan bahasa, pembentukan karakter, serta pengurusan dokumen keberangkatan di Prospect Education Cabang Jember.
                </p>
              </div>
            )}

            {docType === 'active_student' && (
              <div className="font-sans space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed">
                <div className="text-center space-y-1 my-2">
                  <h3 className="text-xl font-black text-slate-900 uppercase font-serif">
                    SURAT KETERANGAN PESERTA AKTIF PELATIHAN
                  </h3>
                  <p className="text-xs font-mono font-bold text-slate-800 mt-1 inline-block bg-slate-100 px-3 py-0.5 rounded-full border border-slate-200">
                    NO. KET: SKP/PE-JBR/{candidate.registrationNumber}/2026
                  </p>
                </div>

                <p className="text-justify">
                  Yang bertanda tangan di bawah ini, Kepala Cabang LKP & Konsultan Pendidikan Prospect Education Jember, menerangkan bahwa:
                </p>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div><strong>Nama Lengkap:</strong> {candidate.fullName}</div>
                  <div><strong>Nomor Registrasi:</strong> <span className="font-mono text-red-800 font-bold">{candidate.registrationNumber}</span></div>
                  <div><strong>NIK:</strong> {candidateNik}</div>
                  <div><strong>Program Pelatihan:</strong> {programTitle}</div>
                  <div><strong>Status Keaktifan:</strong> <span className="text-emerald-700 font-bold">AKTIF MENGIKUTI MATRIKULASI LMS</span></div>
                </div>

                <p className="text-justify">
                  Adalah benar merupakan <strong>Peserta Didik Aktif</strong> yang terdaftar resmi di LKP Prospect Education Cabang Jember. Surat keterangan ini diterbitkan secara sah untuk keperluan administrasi paspor, pembuatan visa, dan legalisasi lembaga mitra.
                </p>
              </div>
            )}

            {/* Signatures & Seal Box */}
            <div className="pt-4 border-t border-slate-200 font-sans grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-center">
              <div>
                <p className="text-[11px] text-slate-500 mb-6">Tim Akademik & Instruktur Utama</p>
                {showSignature && (
                  <p className="text-xs font-serif italic font-bold text-red-800 mb-1">[Tanda Tangan Digital]</p>
                )}
                <p className="font-bold text-xs text-slate-900 border-t border-slate-300 pt-1">
                  Siti Aminah, S.Pd.
                </p>
              </div>

              {showQrCode ? (
                <div className="bg-amber-100/60 p-3 rounded-2xl border border-amber-300 text-amber-950 space-y-1 text-center">
                  <QrCode className="w-8 h-8 text-amber-800 mx-auto" />
                  <p className="text-[10px] font-bold uppercase">Verifikasi Digital LMS</p>
                  <p className="text-[9px] text-amber-900 font-mono break-all">
                    prospect-jember.id/verify/{candidate.id}
                  </p>
                </div>
              ) : (
                <div />
              )}

              <div>
                <p className="text-[11px] text-slate-500 mb-6">{officialSignatoryTitle}</p>
                {showSignature && (
                  <p className="text-xs font-serif italic font-bold text-red-800 mb-1">[Stempel & Tanda Tangan]</p>
                )}
                <p className="font-bold text-xs text-slate-900 border-t border-slate-300 pt-1">
                  {officialSignatoryName}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Bar Footer */}
        <div className="bg-slate-50 p-4 sm:p-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-[11px] font-medium leading-tight">
              Dokumen resmi terverifikasi LKP Prospect Education Jember. Dapat dicetak langsung atau diunduh sebagai berkas PDF.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold rounded-xl transition flex items-center gap-1.5 focus:ring-2 focus:ring-slate-400 cursor-pointer"
              title="Salin Link Verifikasi Sertifikat"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Link Tersalin!' : 'Salin Link Verifikasi'}</span>
            </button>

            <button
              onClick={handlePrintInNewWindow}
              className="px-3.5 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-xl transition flex items-center gap-1.5 shadow-md cursor-pointer"
              title="Buka halaman pencetakan di jendela baru untuk menyimpan PDF resolusi tinggi"
            >
              <ExternalLink className="w-4 h-4 text-indigo-300" />
              <span>Cetak di Jendela Baru</span>
            </button>

            <button
              onClick={handlePrintDirect}
              className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 font-bold rounded-xl transition flex items-center gap-1.5 shadow-md cursor-pointer"
              title="Cetak langsung melalui dialog browser"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Cetak Langsung</span>
            </button>

            <button
              onClick={handleDownloadDoc}
              className="px-4 py-2.5 bg-red-800 hover:bg-red-900 text-amber-300 font-bold rounded-xl transition flex items-center gap-2 shadow-md cursor-pointer"
              title="Unduh Berkas PDF / HTML Resmi"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Unduh File Resmi (.PDF / .HTML)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
