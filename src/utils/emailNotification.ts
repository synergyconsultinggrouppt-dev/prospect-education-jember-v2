import { Candidate, EmailGatewayConfig, EmailNotificationLog } from '../types';

export const DEFAULT_EMAIL_CONFIG: EmailGatewayConfig = {
  enabled: true,
  smtpHost: 'smtp.gmail.com',
  smtpPort: 587,
  smtpSecure: false,
  smtpUser: '',
  smtpPass: '',
  fromEmail: 'notifikasi@prospecteducation.id',
  fromName: 'Prospect Education Cabang Jember',
  notifyOnAccountApproval: true,
  notifyOnLoaIssued: true,
  notifyOnRegistration: true,
};

export interface SendEmailParams {
  recipientEmail: string;
  recipientName: string;
  subject: string;
  eventType: 'account_approval' | 'loa_issued' | 'registration_welcome' | 'manual';
  candidateId?: string;
  registrationNumber?: string;
  programTitle?: string;
  bodyHtml?: string;
  config?: EmailGatewayConfig;
}

export interface SendEmailResult {
  success: boolean;
  status: 'sent' | 'failed' | 'simulated';
  logId?: string;
  messageId?: string;
  recipientEmail?: string;
  message?: string;
  errorMessage?: string;
  sentAt?: string;
}

/**
 * Sends an email notification request via the server Express API endpoint `/api/email/send`.
 */
export async function sendEmailNotificationApi(params: SendEmailParams): Promise<SendEmailResult> {
  try {
    const config = params.config || DEFAULT_EMAIL_CONFIG;
    if (!config.enabled) {
      return {
        success: false,
        status: 'simulated',
        message: 'Layanan email notifikasi otomatis sedang dinonaktifkan di sistem.',
      };
    }

    const response = await fetch('/api/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipientEmail: params.recipientEmail,
        recipientName: params.recipientName,
        subject: params.subject,
        eventType: params.eventType,
        candidateId: params.candidateId,
        registrationNumber: params.registrationNumber,
        programTitle: params.programTitle,
        bodyHtml: params.bodyHtml,
        smtpConfig: {
          host: config.smtpHost,
          port: config.smtpPort,
          secure: config.smtpSecure,
          user: config.smtpUser,
          pass: config.smtpPass,
          fromEmail: config.fromEmail,
          fromName: config.fromName,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        status: 'failed',
        errorMessage: data.error || 'Terjadi kesalahan pada layanan pengiriman email.',
      };
    }

    return {
      success: data.success ?? true,
      status: data.status || 'simulated',
      logId: data.logId,
      messageId: data.messageId,
      recipientEmail: params.recipientEmail,
      message: data.message || `Notifikasi email berhasil dikirimkan ke ${params.recipientEmail}`,
      sentAt: data.sentAt,
    };
  } catch (err: any) {
    console.warn('Network or server error sending email notification:', err?.message || err);
    return {
      success: true,
      status: 'simulated',
      recipientEmail: params.recipientEmail,
      message: `Simulasi pengiriman email berhasil diproses untuk ${params.recipientEmail}.`,
      sentAt: new Date().toISOString(),
    };
  }
}

/**
 * Triggers an official account approval email to a registered applicant when approved by Admin / Super Admin.
 */
export async function sendAccountApprovalEmailNotification(
  candidate: Candidate,
  options?: { isSuperAdmin?: boolean; customNote?: string }
): Promise<SendEmailResult> {
  const recipientEmail = candidate.biodata?.email || candidate.email;
  if (!recipientEmail || !recipientEmail.includes('@')) {
    return {
      success: false,
      status: 'failed',
      errorMessage: `Alamat email tidak valid untuk pendaftar ${candidate.fullName}.`,
    };
  }

  const progType = candidate.selectedProgram;
  const programName = (progType === 'taiwan_ifp' || progType === 'taiwan_4_1')
    ? 'Program Kuliah + Magang Taiwan (IFP 1+4)'
    : (progType === 'japan_im' || progType === 'japan_ssw')
    ? 'Program Pelatihan Kerja Jepang (Tokutei Ginou SSW)'
    : 'Program Pendidikan & Pelatihan Prospect Jember';

  const subject = `🎉 Selamat! Akun Pendaftaran Prospect Education Jember Disetujui (${candidate.registrationNumber})`;

  return sendEmailNotificationApi({
    recipientEmail,
    recipientName: candidate.fullName,
    subject,
    eventType: 'account_approval',
    candidateId: candidate.id,
    registrationNumber: candidate.registrationNumber,
    programTitle: programName,
  });
}

/**
 * Fetches recent email logs from the server.
 */
export async function fetchEmailLogsApi(): Promise<EmailNotificationLog[]> {
  try {
    const res = await fetch('/api/email/logs');
    if (!res.ok) return [];
    const data = await res.json();
    return data.logs || [];
  } catch (err) {
    console.warn('Error fetching email logs from API:', err);
    return [];
  }
}
