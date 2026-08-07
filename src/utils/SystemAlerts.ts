import { AppNotification, CandidateStatus } from '../types';

export type AddNotificationFn = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => void;

export class SystemAlerts {
  /**
   * Helper to dispatch a system alert notification
   */
  static triggerAlert(
    addNotifFn: AddNotificationFn,
    payload: {
      candidateId?: string;
      titleId: string;
      titleEn: string;
      messageId: string;
      messageEn: string;
      type: 'verification' | 'announcement' | 'payment' | 'loa' | 'system';
      linkTab?: string;
    }
  ) {
    addNotifFn({
      candidateId: payload.candidateId,
      titleId: payload.titleId,
      titleEn: payload.titleEn,
      messageId: payload.messageId,
      messageEn: payload.messageEn,
      type: payload.type,
      linkTab: payload.linkTab || 'pendaftaran',
    });
  }

  /**
   * Trigger alert when student completes new registration
   */
  static notifyWelcomeStudent(
    addNotifFn: AddNotificationFn,
    candidateId: string,
    fullName: string,
    regNumber: string
  ) {
    this.triggerAlert(addNotifFn, {
      candidateId,
      titleId: 'Selamat Datang di Prospect Education Jember',
      titleEn: 'Welcome to Prospect Education Jember',
      messageId: `Pendaftaran atas nama ${fullName} (No. Reg: ${regNumber}) berhasil. Silakan lengkapi Biodata & Dokumen Persyaratan.`,
      messageEn: `Registration for ${fullName} (Reg No: ${regNumber}) was successful. Please complete your Biodata & Required Documents.`,
      type: 'system',
      linkTab: 'pendaftaran',
    });
  }

  /**
   * Trigger alert when student completes biodata
   */
  static notifyBiodataCompleted(addNotifFn: AddNotificationFn, candidateId: string) {
    this.triggerAlert(addNotifFn, {
      candidateId,
      titleId: 'Biodata Peserta Berhasil Dilengkapi',
      titleEn: 'Candidate Biodata Successfully Completed',
      messageId: 'Biodata pendaftaran Anda telah disimpan di database Cabang Jember. Tahap selanjutnya: Unggah dokumen KTP, KK, & Ijazah.',
      messageEn: 'Your registration biodata is saved in Jember database. Next step: Upload ID card, Family Card, & Diploma.',
      type: 'verification',
      linkTab: 'pendaftaran',
    });
  }

  /**
   * Trigger alert when student uploads a document
   */
  static notifyDocumentUploaded(addNotifFn: AddNotificationFn, candidateId: string, docTitle: string) {
    this.triggerAlert(addNotifFn, {
      candidateId,
      titleId: `Dokumen Berhasil Diunggah: ${docTitle}`,
      titleEn: `Document Uploaded: ${docTitle}`,
      messageId: `Dokumen "${docTitle}" telah diterima dan sedang ditinjau oleh Tim Verifikasi Admin Prospect Education Jember.`,
      messageEn: `Document "${docTitle}" has been received and is being verified by Prospect Jember Admin.`,
      type: 'verification',
      linkTab: 'pendaftaran',
    });
  }

  /**
   * Trigger alert when admin verifies a document
   */
  static notifyDocumentVerified(
    addNotifFn: AddNotificationFn,
    candidateId: string,
    docTitle: string,
    notes?: string
  ) {
    this.triggerAlert(addNotifFn, {
      candidateId,
      titleId: `Verifikasi Dokumen Disetujui: ${docTitle}`,
      titleEn: `Document Verified: ${docTitle}`,
      messageId: `Dokumen "${docTitle}" Anda telah diverifikasi dan dinyatakan LENGKAP & SAH oleh Admin Jember.${notes ? ` Catatan: ${notes}` : ''}`,
      messageEn: `Your document "${docTitle}" has been verified and marked COMPLETE & VALID by Admin.${notes ? ` Note: ${notes}` : ''}`,
      type: 'verification',
      linkTab: 'pendaftaran',
    });
  }

  /**
   * Trigger alert when admin requests document revision
   */
  static notifyDocumentRejected(
    addNotifFn: AddNotificationFn,
    candidateId: string,
    docTitle: string,
    notes?: string
  ) {
    this.triggerAlert(addNotifFn, {
      candidateId,
      titleId: `Revisi Dokumen Diperlukan: ${docTitle}`,
      titleEn: `Document Revision Required: ${docTitle}`,
      messageId: `Dokumen "${docTitle}" memerlukan unggah ulang.${notes ? ` Catatan Admin: ${notes}` : ''}`,
      messageEn: `Your document "${docTitle}" requires re-uploading.${notes ? ` Admin note: ${notes}` : ''}`,
      type: 'verification',
      linkTab: 'pendaftaran',
    });
  }

  /**
   * Trigger alert when payment is submitted via Midtrans Gateway
   */
  static notifyPaymentReceived(
    addNotifFn: AddNotificationFn,
    candidateId: string,
    invoiceNo: string,
    amount: number,
    paymentMethod: string
  ) {
    const formattedAmount = `Rp ${amount.toLocaleString('id-ID')}`;
    this.triggerAlert(addNotifFn, {
      candidateId,
      titleId: `Pembayaran Midtrans Berhasil Disimulasikan: ${invoiceNo}`,
      titleEn: `Midtrans Payment Received: ${invoiceNo}`,
      messageId: `Sistem menerima pembayaran ${formattedAmount} (${paymentMethod.toUpperCase()}). Menunggu sinkronisasi settlement keuangan.`,
      messageEn: `System received payment of ${formattedAmount} via ${paymentMethod.toUpperCase()}. Awaiting settlement sync.`,
      type: 'payment',
      linkTab: 'pendaftaran',
    });
  }

  /**
   * Trigger alert when payment status becomes verified/lunas
   */
  static notifyPaymentVerified(
    addNotifFn: AddNotificationFn,
    candidateId: string,
    invoiceNo: string,
    amount?: number
  ) {
    const amountStr = amount ? ` sebesar Rp ${amount.toLocaleString('id-ID')}` : '';
    this.triggerAlert(addNotifFn, {
      candidateId,
      titleId: `Pembayaran Dikonfirmasi Lunas (Settlement)`,
      titleEn: `Payment Confirmed Settled (Paid)`,
      messageId: `Pembayaran invoice ${invoiceNo}${amountStr} resmi LUNAS & TERVERIFIKASI. Anda kini dapat mengunduh / mencetak Kwitansi Digital Bukti Bayar.`,
      messageEn: `Invoice ${invoiceNo}${amountStr} is officially SETTLED & VERIFIED. You can now view and print your Digital Receipt.`,
      type: 'payment',
      linkTab: 'pendaftaran',
    });
  }

  /**
   * Trigger alert when super admin approves candidate
   */
  static notifySuperAdminApproved(addNotifFn: AddNotificationFn, candidateId: string) {
    this.triggerAlert(addNotifFn, {
      candidateId,
      titleId: `Persetujuan Resmi Kepala Cabang Prospect Jember`,
      titleEn: `Branch Head Official Approval`,
      messageId: `Selamat! Berkas dan pendaftaran Anda telah disetujui resmi oleh Kepala Cabang Rohim Egy. Surat Penerimaan (LoA) diterbitkan!`,
      messageEn: `Congratulations! Your application is officially approved by Branch Head Rohim Egy. Acceptance Letter (LoA) issued!`,
      type: 'loa',
      linkTab: 'loa',
    });
  }

  /**
   * Trigger alert when LoA is issued
   */
  static notifyLoAIssued(addNotifFn: AddNotificationFn, candidateId: string, loaNumber: string) {
    this.triggerAlert(addNotifFn, {
      candidateId,
      titleId: `Surat Penerimaan Resmi (LoA) Diterbitkan!`,
      titleEn: `Official Acceptance Letter (LoA) Issued!`,
      messageId: `Surat LoA Beasiswa/Program No. ${loaNumber} resmi diterbitkan dan disahkan oleh LKP & Konsultan Pendidikan Prospect Education Jember.`,
      messageEn: `Official Acceptance Letter No. ${loaNumber} has been issued and authorized by LKP & Educational Consultant Prospect Education Jember.`,
      type: 'loa',
      linkTab: 'loa',
    });
  }

  /**
   * Trigger alert when candidate status changes generically
   */
  static notifyStatusChanged(
    addNotifFn: AddNotificationFn,
    candidateId: string,
    newStatus: CandidateStatus | string,
    candidateName?: string
  ) {
    switch (newStatus) {
      case 'registered':
        this.triggerAlert(addNotifFn, {
          candidateId,
          titleId: 'Pendaftaran Akun Berhasil',
          titleEn: 'Account Registration Successful',
          messageId: 'Pendaftaran akun Anda berhasil. Silakan lengkapi Biodata Peserta.',
          messageEn: 'Your registration was successful. Please fill out your Candidate Biodata.',
          type: 'system',
          linkTab: 'pendaftaran',
        });
        break;

      case 'biodata_completed':
        this.notifyBiodataCompleted(addNotifFn, candidateId);
        break;

      case 'documents_uploaded':
        this.triggerAlert(addNotifFn, {
          candidateId,
          titleId: 'Dokumen Utama Berhasil Diunggah',
          titleEn: 'Core Documents Uploaded',
          messageId: 'Dokumen KTP & Ijazah Anda telah masuk ke sistem. Menunggu verifikasi tim admin.',
          messageEn: 'Your ID & Diploma documents have been submitted. Awaiting admin verification.',
          type: 'verification',
          linkTab: 'pendaftaran',
        });
        break;

      case 'document_verified':
        this.triggerAlert(addNotifFn, {
          candidateId,
          titleId: 'Seluruh Dokumen Terverifikasi Lengkap',
          titleEn: 'All Documents Fully Verified',
          messageId: 'Selamat! Dokumen persyaratan Anda dinyatakan LENGKAP & VALID. Tahap selanjutnya: Pembayaran DP Matrikulasi.',
          messageEn: 'Congratulations! Your documents are COMPLETE & VALID. Next step: Down payment.',
          type: 'verification',
          linkTab: 'pendaftaran',
        });
        break;

      case 'revision_requested':
        this.triggerAlert(addNotifFn, {
          candidateId,
          titleId: 'Permintaan Perbaikan / Revisi Dokumen',
          titleEn: 'Document Revision Requested',
          messageId: 'Ada dokumen yang memerlukan perbaikan. Silakan periksa menu Dokumen Persyaratan.',
          messageEn: 'Some documents require revision. Please check your Document Checklist.',
          type: 'verification',
          linkTab: 'pendaftaran',
        });
        break;

      case 'payment_pending':
        this.triggerAlert(addNotifFn, {
          candidateId,
          titleId: 'Transaksi Pembayaran Dalam Proses',
          titleEn: 'Payment Transaction In Progress',
          messageId: 'Instruksi pembayaran Midtrans telah dibuat. Harap selesaikan pembayaran sesuai metode yang dipilih.',
          messageEn: 'Midtrans payment instructions generated. Please complete payment accordingly.',
          type: 'payment',
          linkTab: 'pendaftaran',
        });
        break;

      case 'payment_verified':
        this.notifyPaymentVerified(addNotifFn, candidateId, 'INV/PE-JBR/2026/088');
        break;

      case 'superadmin_approved':
      case 'loa_issued':
        this.notifySuperAdminApproved(addNotifFn, candidateId);
        break;

      case 'lms_active':
        this.triggerAlert(addNotifFn, {
          candidateId,
          titleId: 'Akses Portal LMS Matrikulasi Aktif',
          titleEn: 'LMS Learning Portal Active',
          messageId: 'Modul matrikulasi bahasa dan pembekalan budaya luar negeri kini telah dibuka untuk Anda!',
          messageEn: 'Your language matriculation and culture orientation LMS modules are now unlocked!',
          type: 'system',
          linkTab: 'lms',
        });
        break;

      case 'graduated':
        this.triggerAlert(addNotifFn, {
          candidateId,
          titleId: 'Selamat! Anda Dinyatakan SIAP BERANGKAT (Graduated)',
          titleEn: 'Congratulations! Ready for Departure',
          messageId: 'Selamat! Pembekalan tuntas, Visa & Tiket terbit. Anda dinyatakan SIAP TERBANG ke negara tujuan!',
          messageEn: 'Congratulations! Orientation completed, Visa & Tickets issued. You are ready to fly!',
          type: 'system',
          linkTab: 'beranda',
        });
        break;

      default:
        this.triggerAlert(addNotifFn, {
          candidateId,
          titleId: `Pembaruan Status Pendaftaran: ${this.getStatusLabel(newStatus, 'id')}`,
          titleEn: `Status Update: ${this.getStatusLabel(newStatus, 'en')}`,
          messageId: `Status pendaftaran atas nama ${candidateName || 'Peserta'} telah diperbarui menjadi ${this.getStatusLabel(newStatus, 'id')}.`,
          messageEn: `Registration status for ${candidateName || 'Candidate'} updated to ${this.getStatusLabel(newStatus, 'en')}.`,
          type: 'system',
          linkTab: 'pendaftaran',
        });
        break;
    }
  }

  /**
   * Readable human text label for candidate statuses
   */
  static getStatusLabel(status: CandidateStatus | string, lang: 'id' | 'en' = 'id'): string {
    switch (status) {
      case 'registered':
        return lang === 'en' ? 'Registered' : 'Pendaftaran Akun Baru';
      case 'biodata_completed':
        return lang === 'en' ? 'Biodata Completed' : 'Biodata Lengkap';
      case 'documents_uploaded':
        return lang === 'en' ? 'Documents Uploaded' : 'Dokumen Terunggah';
      case 'document_verified':
        return lang === 'en' ? 'Documents Verified' : 'Dokumen Verified (Lengkap)';
      case 'revision_requested':
        return lang === 'en' ? 'Revision Requested' : 'Revisi Dokumen';
      case 'payment_pending':
        return lang === 'en' ? 'Payment Pending' : 'Proses Pembayaran';
      case 'payment_verified':
        return lang === 'en' ? 'Payment Verified (Paid)' : 'Pembayaran Lunas & Terverifikasi';
      case 'superadmin_approved':
        return lang === 'en' ? 'Super Admin Approved' : 'Disetujui Kepala Cabang';
      case 'loa_issued':
        return lang === 'en' ? 'LoA Issued' : 'LoA Resmi Terbit';
      case 'lms_active':
        return lang === 'en' ? 'LMS Active' : 'Akses LMS Aktif';
      case 'graduated':
        return lang === 'en' ? 'Siap Berangkat' : 'Lulus & Siap Berangkat';
      default:
        return status;
    }
  }

  /**
   * Tailwind CSS colors for status badges
   */
  static getStatusBadgeStyle(status: CandidateStatus | string): { bg: string; text: string; border: string } {
    switch (status) {
      case 'registered':
        return { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300' };
      case 'biodata_completed':
        return { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' };
      case 'documents_uploaded':
        return { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' };
      case 'document_verified':
        return { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' };
      case 'revision_requested':
        return { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200' };
      case 'payment_pending':
        return { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-200' };
      case 'payment_verified':
        return { bg: 'bg-emerald-100', text: 'text-emerald-900', border: 'border-emerald-300' };
      case 'superadmin_approved':
      case 'loa_issued':
        return { bg: 'bg-purple-100', text: 'text-purple-900', border: 'border-purple-300' };
      case 'lms_active':
        return { bg: 'bg-indigo-100', text: 'text-indigo-900', border: 'border-indigo-300' };
      case 'graduated':
        return { bg: 'bg-emerald-600', text: 'text-white', border: 'border-emerald-700' };
      default:
        return { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300' };
    }
  }
}
