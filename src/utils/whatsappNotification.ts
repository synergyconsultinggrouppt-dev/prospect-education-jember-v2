import { Candidate, WhatsAppGatewayConfig, WhatsAppNotificationLog } from '../types';

export const DEFAULT_WA_CONFIG: WhatsAppGatewayConfig = {
  provider: 'fonnte',
  apiKey: '',
  senderPhone: '082334554396',
  enabled: true,
  notifyOnDocumentStatusChange: true,
  notifyOnLoaApproval: true,
  notifyOnPaymentVerified: true,
  notifyOnRegistration: true,
};

export interface SendWhatsAppParams {
  targetPhone: string;
  message: string;
  eventType: 'document_status' | 'loa_approved' | 'payment_verified' | 'registration' | 'manual';
  candidateName: string;
  candidateId?: string;
  config?: WhatsAppGatewayConfig;
}

export interface SendWhatsAppResult {
  success: boolean;
  status: 'sent' | 'failed' | 'simulated';
  logId?: string;
  normalizedPhone?: string;
  provider?: string;
  message?: string;
  whatsappUrl?: string;
  errorMessage?: string;
}

/**
  Normalizes any Indonesian phone number into 628xxx format.
 */
export function normalizePhoneNumber(phone: string): string {
  if (!phone) return '';
  let clean = phone.replace(/[^0-9]/g, '');
  if (clean.startsWith('0')) {
    clean = '62' + clean.substring(1);
  } else if (!clean.startsWith('62') && clean.length >= 9) {
    clean = '62' + clean;
  }
  return clean;
}

/**
 * Dispatches a WhatsApp notification request to the backend express server API.
 */
export async function sendWhatsAppNotificationApi(params: SendWhatsAppParams): Promise<SendWhatsAppResult> {
  try {
    const config = params.config || DEFAULT_WA_CONFIG;
    if (!config.enabled) {
      return {
        success: false,
        status: 'simulated',
        message: 'Layanan WhatsApp Notifikasi otomatis sedang dinonaktifkan di pengaturan.',
      };
    }

    const payload = {
      targetPhone: params.targetPhone,
      message: params.message,
      eventType: params.eventType,
      candidateName: params.candidateName,
      candidateId: params.candidateId,
      provider: config.provider,
      apiKey: config.apiKey,
      customWebhookUrl: config.customWebhookUrl,
    };

    const response = await fetch('/api/whatsapp/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server HTTP ${response.status}`);
    }

    const data = await response.json();
    return {
      success: data.success,
      status: data.status || 'simulated',
      logId: data.logId,
      normalizedPhone: data.normalizedPhone,
      provider: data.provider,
      message: data.message,
      whatsappUrl: data.whatsappUrl,
    };
  } catch (err: any) {
    console.warn('WhatsApp Dispatch API notice:', err);
    // Client-side fallback if offline
    const normPhone = normalizePhoneNumber(params.targetPhone);
    const waUrl = `https://wa.me/${normPhone}?text=${encodeURIComponent(params.message)}`;
    return {
      success: true,
      status: 'simulated',
      normalizedPhone: normPhone,
      whatsappUrl: waUrl,
      message: `Pesan WhatsApp disiapkan untuk ${params.candidateName}. Tautan manual WhatsApp aktif.`,
    };
  }
}

/**
 * Generates and triggers WhatsApp message when a candidate's document status changes.
 */
export async function triggerDocumentStatusWhatsApp(
  candidate: Candidate,
  docTitle: string,
  status: 'verified' | 'revision' | 'rejected',
  note?: string,
  config?: WhatsAppGatewayConfig
): Promise<SendWhatsAppResult> {
  const phone = candidate.biodata?.phoneWA || (candidate as any).phone || '082334554396';
  const statusLabel =
    status === 'verified'
      ? '✅ TERVERIFIKASI & SAH'
      : status === 'revision'
      ? '⚠️ PERLU PERBAIKAN / REVISI'
      : '❌ DITOLAK';

  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://prospect-jember.id';

  const message = `*PROSPECT EDUCATION CABANG JEMBER*
*PEMBERITAHUAN STATUS BERKAS DOKUMEN*

Halo sdr/i *${candidate.fullName}*,
Nomor Registrasi: *${candidate.registrationNumber}*

Status verifikasi untuk berkas dokumen Anda telah diperbarui oleh Admin:

📄 *Nama Berkas:* ${docTitle}
📌 *Status Baru:* ${statusLabel}
${note ? `📝 *Catatan Admin:* ${note}\n` : ''}
${
  status === 'revision'
    ? `⚠️ *Tindakan:* Mohon segera melakukan login ke Dashboard Peserta untuk mengunggah ulang dokumen revisi.`
    : `✨ *Tindakan:* Berkas Anda telah tersimpan rapi di database resmi Prospect Education Jember.`
}

Silakan cek portal pendaftaran Anda:
🔗 ${originUrl}

_Pesan ini dikirimkan secara otomatis oleh Sistem Portal LKP Prospect Education Cabang Jember (Legal | Aman | Terpercaya)._`;

  return sendWhatsAppNotificationApi({
    targetPhone: phone,
    message,
    eventType: 'document_status',
    candidateName: candidate.fullName,
    candidateId: candidate.id,
    config,
  });
}

/**
 * Generates and triggers WhatsApp message when a candidate's LoA is approved/issued.
 */
export async function triggerLoaApprovedWhatsApp(
  candidate: Candidate,
  loaNumber: string,
  config?: WhatsAppGatewayConfig
): Promise<SendWhatsAppResult> {
  const phone = candidate.biodata?.phoneWA || (candidate as any).phone || '082334554396';
  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://prospect-jember.id';
  const verifyUrl = `${originUrl}?verifyLoa=${encodeURIComponent(loaNumber)}`;

  const programName = candidate.selectedProgram
    .replace('_', ' ')
    .toUpperCase();

  const message = `🎉 *CONGRATULATIONS! SURAT LOA RESMI DISERAHKAN*
*LKP PROSPECT EDUCATION CABANG JEMBER*

Selamat kepada Sdr/i *${candidate.fullName}*!
Nomor Registrasi: *${candidate.registrationNumber}*
Program Pilihan: *${programName}*

Surat Penerimaan Resmi (*Letter of Acceptance - LoA*) Anda telah disetujui oleh Direksi & Super Admin Pusat:

📜 *No. LoA Resmi:* ${loaNumber}
📅 *Status:* Official Registered & Accepted
🔐 *Verifikasi QR:* Terverifikasi Otentik Digital

Anda kini dapat mengunduh Surat LoA resmi berstempel basah & bertanda tangan digital di Dashboard Peserta, serta melakukan scan QR Code keaslian dokumen.

Unduh & Cek Keaslian LoA:
🔗 ${verifyUrl}

Silakan lanjutkan ke tahap berikutnya untuk akses Learning Management System (LMS) & persiapan program keberangkatan.

_Prospect Education Cabang Jember - Legal | Aman | Terpercaya_
📞 CS WhatsApp: 0823-3455-4396`;

  return sendWhatsAppNotificationApi({
    targetPhone: phone,
    message,
    eventType: 'loa_approved',
    candidateName: candidate.fullName,
    candidateId: candidate.id,
    config,
  });
}

/**
 * Generates and triggers WhatsApp message when payment is verified.
 */
export async function triggerPaymentVerifiedWhatsApp(
  candidate: Candidate,
  paymentType: string,
  amount: number,
  config?: WhatsAppGatewayConfig
): Promise<SendWhatsAppResult> {
  const phone = candidate.biodata?.phoneWA || (candidate as any).phone || '082334554396';
  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);

  const message = `*PROSPECT EDUCATION CABANG JEMBER*
*NOTIFIKASI PEMBAYARAN TERVERIFIKASI*

Halo *${candidate.fullName}*,
Nomor Registrasi: *${candidate.registrationNumber}*

Pembayaran Anda telah berhasil kami terima dan diverifikasi secara sah di sistem keuangan Prospect Education Jember:

💳 *Jenis Transaksi:* ${paymentType.replace('_', ' ').toUpperCase()}
💰 *Jumlah Pembayaran:* ${formattedAmount}
Status: *LUNAS & TERVERIFIKASI*

Kuitansi digital telah terbit dan tersimpan di riwayat transaksi Dashboard Peserta Anda.

Terima kasih atas kepercayaan Anda mendaftar bersama Prospect Education Jember!`;

  return sendWhatsAppNotificationApi({
    targetPhone: phone,
    message,
    eventType: 'payment_verified',
    candidateName: candidate.fullName,
    candidateId: candidate.id,
    config,
  });
}
