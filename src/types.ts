export type UserRole = 'visitor' | 'student' | 'admin' | 'webmaster' | 'superadmin' | 'investor';

export interface WebmasterUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  roleType: 'Head Webmaster' | 'Content Editor' | 'SEO Specialist' | 'System Admin';
  status: 'active' | 'inactive';
  assignedScope: string;
  createdAt: string;
  lastActive: string;
}

export interface WebsiteFeatures {
  maintenanceMode: boolean;
  onlineRegistration: boolean;
  lmsLearningSystem: boolean;
  aiConsultantAssistant: boolean;
  whatsappHelpdesk: boolean;
  runningBanner: boolean;
  investorPortalAccess: boolean;
  liveClassCalendar: boolean;
  gallerySection: boolean;
}

export interface WebsiteSettings {
  siteName: string;
  siteTagline: string;
  emergencyBannerText: string;
  emergencyBannerActive: boolean;
  csPhoneWhatsApp: string;
  contactEmail: string;
  officeAddress: string;
  metaDescription: string;
  metaKeywords: string;
  officialSignatoryName?: string;
  officialSignatoryTitle?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  type: 'Foto' | 'Video' | 'Dokumentasi';
  category: string;
  image: string;
  badge?: string;
}

export type ProgramType = 'taiwan_ifp' | 'taiwan_4_1' | 'japan_im' | 'japan_ssw';

export type CandidateStatus =
  | 'registered'
  | 'biodata_completed'
  | 'documents_uploaded'
  | 'document_verified'
  | 'revision_requested'
  | 'payment_pending'
  | 'payment_verified'
  | 'superadmin_approved'
  | 'loa_issued'
  | 'lms_active'
  | 'graduated';

export interface ProgramInfo {
  id: ProgramType;
  title: string;
  category: 'Taiwan' | 'Jepang';
  badge: string;
  shortDesc: string;
  fullDesc: string;
  duration: string;
  estimatedCost: string;
  targetQuota: number;
  enrolledCount: number;
  requirements: string[];
  benefits: string[];
  stages: string[];
  partnerUniversitiesOrCompanies: string[];
  faqs: { question: string; answer: string }[];
  image: string;
}

export type StudentDocType =
  | 'ktp'
  | 'kk'
  | 'ijazah'
  | 'transkrip'
  | 'raport'
  | 'paspor'
  | 'pasfoto'
  | 'recommendation_letter'
  | 'study_plan'
  | 'autobiography'
  | 'ktp_ortu'
  | 'surat_izin';

export interface StudentDocument {
  id: string;
  docType: StudentDocType;
  title: string;
  fileName?: string;
  fileUrl?: string;
  status: 'pending' | 'verified' | 'rejected';
  notes?: string;
  uploadedAt?: string;
}

export interface CandidateBiodata {
  nik: string;
  fullName: string;
  birthPlace: string;
  birthDate: string;
  gender: 'Laki-Laki' | 'Perempuan';
  religion: string;
  address: string;
  district: string;
  regency: string; // Jember etc.
  phoneWA: string;
  email: string;
  education: string;
  major: string;
  parentName: string;
  parentPhone: string;
  parentJob: string;
}

export interface PaymentRecord {
  id: string;
  candidateId: string;
  candidateName: string;
  programType: ProgramType;
  programTitle: string;
  amount: number;
  paymentMethod: 'qris' | 'va_bca' | 'va_mandiri' | 'va_bri' | 'bank_transfer';
  paymentStatus: 'pending' | 'paid' | 'verified' | 'failed';
  proofUrl?: string;
  paidAt?: string;
  invoiceNo: string;
}

export interface DigitalSignatureInfo {
  isSigned: boolean;
  signatureDataUrl?: string;
  signatureType?: 'drawn' | 'digital_stamp' | 'typed';
  signerName: string;
  signerTitle?: string;
  signerNik?: string;
  signedAt: string;
  ipAddress?: string;
  hashVerification?: string;
  approvalCode?: string;
}

export interface Candidate {
  id: string;
  registrationNumber: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  password?: string;
  selectedProgram?: ProgramType;
  status: CandidateStatus;
  paymentStatus?: 'unpaid' | 'pending' | 'dp_paid' | 'paid' | 'lunas';
  biodata?: CandidateBiodata;
  documents: StudentDocument[];
  payments: PaymentRecord[];
  registeredAt: string;
  superAdminApprovalDate?: string;
  loaNumber?: string;
  loaIssueDate?: string;
  certificateNumber?: string;
  lmsProgressPercent: number;
  candidateSignature?: DigitalSignatureInfo;
  adminSignature?: DigitalSignatureInfo;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface LMSModule {
  id: string;
  programType: ProgramType | 'all';
  title: string;
  description: string;
  contentType: 'video' | 'pdf' | 'quiz';
  videoEmbedUrl?: string;
  pdfDownloadUrl?: string;
  durationMinutes: number;
  timeSpentMinutes?: number;
  progressPercent?: number;
  quizQuestions?: QuizQuestion[];
  isCompleted?: boolean;
}

export interface AuditLogEntry {
  id: string;
  actorName: string;
  actorRole: 'admin' | 'webmaster' | 'superadmin' | 'finance';
  actionCategory: 'student_update' | 'page_edit' | 'resource_upload' | 'financial_edit' | 'system_config' | 'security';
  actionDescription: string;
  targetEntity: string;
  timestamp: string;
  ipAddress: string;
  status: 'success' | 'warning' | 'failed';
  details?: string;
}

export interface PortfolioCertificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  category: 'Bahasa' | 'Vokasi & Keahlian' | 'Sertifikat LKP' | 'Prestasi & Penghargaan';
  credentialUrl?: string;
  fileUrl?: string;
  verifiedStatus?: 'verified' | 'pending' | 'self_uploaded';
}

export interface StudentSkill {
  id: string;
  name: string;
  category: 'Bahasa' | 'Teknis & Vokasi' | 'Soft Skills' | 'Sertifikasi';
  proficiency: 'Pemula' | 'Menengah' | 'Mahir' | 'Ahli';
  certificateTitle?: string;
}

export interface StudentPortfolio {
  candidateId: string;
  candidateName: string;
  bioSummary: string;
  careerGoals: string;
  skills: StudentSkill[];
  certificates: PortfolioCertificate[];
  shareCode: string;
  isPublic: boolean;
  updatedAt: string;
}

export interface DocumentRequest {
  id: string;
  candidateId: string;
  candidateName: string;
  documentType: 'surat_keterangan_aktif' | 'transkrip_nilai' | 'surat_rekomendasi' | 'pengantar_visa' | 'sertifikat_kelulusan' | 'surat_pernyataan_ijin';
  documentTypeName: string;
  purpose: string;
  notes?: string;
  requestDate: string;
  status: 'submitted' | 'processing' | 'signed' | 'ready' | 'rejected';
  estimatedCompletionDate?: string;
  downloadUrl?: string;
  processedBy?: string;
  trackingHistory: {
    status: string;
    title: string;
    note: string;
    timestamp: string;
  }[];
}

export interface StudyResource {
  id: string;
  title: string;
  description: string;
  category: 'mandarin' | 'japanese' | 'visa_guide' | 'worksheet' | 'general';
  categoryLabel: string;
  programType: ProgramType | 'all';
  fileFormat: 'pdf' | 'docx' | 'zip';
  fileSizeMb: number;
  downloadUrl: string;
  uploadedBy: string;
  uploadedAt: string;
  downloadCount: number;
  tags: string[];
}

export interface FinancialRecord {
  id: string;
  period: string; // e.g., "Januari 2026"
  month: string;
  year: number;
  revenueTuition: number;
  revenueRegistration: number;
  totalRevenue: number;
  expenseStaff: number;
  expenseMarketing: number;
  expenseFacility: number;
  expenseVisaDoc: number;
  totalExpenses: number;
  netCashFlow: number;
  activeStudents: number;
  newRegistrations: number;
}

export interface ChatMessage {
  id: string;
  senderRole: 'student' | 'admin';
  senderName: string;
  message: string;
  timestamp: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  category: 'Pengumuman' | 'Artikel' | 'Agenda' | 'Prestasi';
  date: string;
  author: string;
  summary: string;
  content: string;
  image: string;
  featured?: boolean;
}

export interface FeedbackItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  isReplied?: boolean;
}

export interface WhatsAppGatewayConfig {
  provider: 'fonnte' | 'wablas' | 'twilio' | 'generic_webhook';
  apiKey: string;
  senderPhone: string;
  enabled: boolean;
  notifyOnDocumentStatusChange: boolean;
  notifyOnLoaApproval: boolean;
  notifyOnPaymentVerified: boolean;
  notifyOnRegistration: boolean;
  customWebhookUrl?: string;
}

export interface WhatsAppNotificationLog {
  id: string;
  candidateId?: string;
  candidateName: string;
  phone: string;
  eventType: 'document_status' | 'loa_approved' | 'payment_verified' | 'registration' | 'manual';
  message: string;
  status: 'sent' | 'failed' | 'simulated';
  sentAt: string;
  provider: string;
  errorMessage?: string;
}

export interface EmailGatewayConfig {
  enabled: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPass: string;
  fromEmail: string;
  fromName: string;
  notifyOnAccountApproval: boolean;
  notifyOnLoaIssued: boolean;
  notifyOnRegistration: boolean;
}

export interface EmailNotificationLog {
  id: string;
  candidateId?: string;
  candidateName: string;
  recipientEmail: string;
  subject: string;
  eventType: 'account_approval' | 'loa_issued' | 'registration_welcome' | 'manual';
  status: 'sent' | 'failed' | 'simulated';
  sentAt: string;
  messageId?: string;
  errorMessage?: string;
  htmlPreview?: string;
}

export interface AppNotification {
  id: string;
  candidateId?: string;
  titleId: string;
  titleEn: string;
  messageId: string;
  messageEn: string;
  type: 'verification' | 'announcement' | 'payment' | 'loa' | 'system';
  timestamp: string;
  isRead: boolean;
  linkTab?: string;
}

export interface AttendanceRecord {
  id: string;
  candidateId: string;
  candidateName: string;
  registrationNumber: string;
  className: string;
  programType: ProgramType;
  method: 'qr' | 'gps';
  date: string;
  checkInTime: string;
  status: 'hadir' | 'terlambat' | 'izin' | 'sakit';
  locationName?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  notes?: string;
  verifiedBySystem: boolean;
}

export interface LetterheadConfig {
  institutionName: string;
  institutionSubName: string;
  legalLicense: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  logoUrl: string;
  sealUrl?: string;
  headerLineStyle: 'double' | 'single' | 'accent_bar';
  primaryColor: string;
  cityIssued: string;
  defaultSignerName: string;
  defaultSignerTitle: string;
  defaultSignerNip: string;
  signatureUrl?: string;
  stempelUrl?: string;
  enableQrVerification?: boolean;
  qrPosition?: 'bottom_footer' | 'top_kop' | 'both';
  qrVerificationBaseUrl?: string;
  qrLabelText?: string;
  enableDigitalHash?: boolean;
}

export interface LetterStyleConfig {
  fontFamily?: string;
  fontSize?: string;
  lineHeight?: string;
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  marginTop?: string;
  marginBottom?: string;
  customCss?: string;
}

export interface LetterTemplateVersion {
  id: string;
  versionNumber: number;
  title: string;
  subject: string;
  numberFormat: string;
  bodyContent: string;
  signerName?: string;
  signerTitle?: string;
  signerNip?: string;
  styleConfig?: LetterStyleConfig;
  savedAt: string;
  savedBy?: string;
  changeNote?: string;
}

export interface LetterTemplate {
  id: string;
  title: string;
  code: string;
  category: 'LoA' | 'Surat Keterangan' | 'Rekomendasi' | 'Permohonan Visa' | 'Perjanjian' | 'Pernyataan' | 'Lainnya';
  subject: string;
  numberFormat: string;
  bodyContent: string;
  signerName?: string;
  signerTitle?: string;
  signerNip?: string;
  signatureUrl?: string;
  stempelUrl?: string;
  styleConfig?: LetterStyleConfig;
  updatedAt: string;
  versionHistory?: LetterTemplateVersion[];
}

export interface IssuedLetter {
  id: string;
  letterNumber: string;
  templateId: string;
  templateTitle: string;
  candidateId?: string;
  candidateName: string;
  candidateRegNumber?: string;
  subject: string;
  issueDate: string;
  contentHtml: string;
  signerName: string;
  signerTitle: string;
  issuedBy: string;
  status: 'published' | 'draft' | 'revoked';
  downloadCount: number;
  verificationHash?: string;
  verificationUrl?: string;
}

export type {
  AndroidBridgeConfig,
  CameraPermissionStatus,
  NativeCameraOptions,
  NativeCameraResult,
  OAuthRedirectPayload,
  NativeDeviceInfo,
  AndroidNativeInterface,
} from './utils/androidBridge';

