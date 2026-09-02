import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, testFirestoreConnection } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firebaseError';
import { collection, doc, setDoc, onSnapshot } from 'firebase/firestore';
import {
  UserRole,
  Candidate,
  CandidateStatus,
  ProgramInfo,
  LMSModule,
  StudyResource,
  FinancialRecord,
  NewsArticle,
  ChatMessage,
  FeedbackItem,
  CandidateBiodata,
  StudentDocument,
  PaymentRecord,
  ProgramType,
  AppNotification,
  WebmasterUser,
  WebsiteFeatures,
  WebsiteSettings,
  AuditLogEntry,
  DocumentRequest,
  StudentPortfolio,
  PortfolioCertificate,
  StudentSkill,
  DigitalSignatureInfo,
  WhatsAppGatewayConfig,
  EmailGatewayConfig,
  EmailNotificationLog,
  AttendanceRecord,
  LetterheadConfig,
  LetterTemplate,
  IssuedLetter,
} from '../types';
import {
  DEFAULT_LETTERHEAD_CONFIG,
  DEFAULT_LETTER_TEMPLATES as INITIAL_LETTER_TEMPLATES,
  DEFAULT_ISSUED_LETTERS as INITIAL_ISSUED_LETTERS,
} from '../data/letterTemplatesData';
import {
  DEFAULT_WA_CONFIG,
  triggerDocumentStatusWhatsApp,
  triggerLoaApprovedWhatsApp,
  triggerPaymentVerifiedWhatsApp,
} from '../utils/whatsappNotification';
import {
  DEFAULT_EMAIL_CONFIG,
  sendAccountApprovalEmailNotification,
} from '../utils/emailNotification';
import { SystemAlerts } from '../utils/SystemAlerts';
import {
  INITIAL_PROGRAMS,
  INITIAL_CANDIDATES,
  INITIAL_LMS_MODULES,
  INITIAL_STUDY_RESOURCES,
  INITIAL_FINANCIAL_RECORDS,
  INITIAL_NEWS,
  INITIAL_CHAT,
  INITIAL_WEBMASTERS,
  INITIAL_WEBSITE_FEATURES,
  INITIAL_WEBSITE_SETTINGS,
  INITIAL_AUDIT_LOGS,
  INITIAL_DOCUMENT_REQUESTS,
  INITIAL_PORTFOLIOS,
  INITIAL_ATTENDANCES,
} from '../data/initialData';

interface AppContextType {
  language: 'id' | 'en';
  setLanguage: (lang: 'id' | 'en') => void;
  t: (idText: string, enText: string) => string;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedProgramId: ProgramType | null;
  setSelectedProgramId: (id: ProgramType | null) => void;

  // Webmaster & Website Features Management
  webmasters: WebmasterUser[];
  websiteFeatures: WebsiteFeatures;
  websiteSettings: WebsiteSettings;
  addWebmasterUser: (wm: Omit<WebmasterUser, 'id' | 'createdAt' | 'lastActive'>) => void;
  updateWebmasterUser: (id: string, updates: Partial<WebmasterUser>) => void;
  deleteWebmasterUser: (id: string) => void;
  toggleWebsiteFeature: (key: keyof WebsiteFeatures) => void;
  updateWebsiteSettings: (settings: Partial<WebsiteSettings>) => void;

  deleteNewsArticle: (id: string) => void;
  updateNewsArticle: (id: string, updates: Partial<NewsArticle>) => void;

  // Audit Logs Security & Activity Tracking
  auditLogs: AuditLogEntry[];
  addAuditLog: (log: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
  clearAuditLogs: () => void;

  // Digital Document Requests & Automated Status Tracking
  documentRequests: DocumentRequest[];
  addDocumentRequest: (req: Omit<DocumentRequest, 'id' | 'requestDate' | 'status' | 'trackingHistory'>) => void;
  updateDocumentRequestStatus: (
    id: string,
    status: DocumentRequest['status'],
    note: string,
    processedBy?: string,
    downloadUrl?: string
  ) => void;

  // Personal Student Portfolio & Skill Sharing
  studentPortfolios: StudentPortfolio[];
  getPortfolioByCandidateId: (candidateId: string) => StudentPortfolio | undefined;
  updatePortfolioBio: (candidateId: string, bioSummary: string, careerGoals: string) => void;
  addPortfolioCertificate: (candidateId: string, cert: Omit<PortfolioCertificate, 'id'>) => void;
  deletePortfolioCertificate: (candidateId: string, certId: string) => void;
  addPortfolioSkill: (candidateId: string, skill: Omit<StudentSkill, 'id'>) => void;
  deletePortfolioSkill: (candidateId: string, skillId: string) => void;

  // Attendance Records for Realtime Language Class Check-in
  attendances: AttendanceRecord[];
  addAttendanceRecord: (record: Omit<AttendanceRecord, 'id'>) => AttendanceRecord;
  updateAttendanceStatus: (id: string, status: AttendanceRecord['status'], notes?: string) => void;

  // Candidates & Student state
  currentCandidateId: string;
  setCurrentCandidateId: (id: string) => void;
  currentCandidate: Candidate | undefined;
  candidates: Candidate[];
  registerNewCandidate: (data: {
    fullName: string;
    email: string;
    phoneWA: string;
    programType: ProgramType;
  }) => Candidate;
  registerCandidate: (data: {
    fullName: string;
    email: string;
    phoneWA: string;
    selectedProgram?: ProgramType;
    programType?: ProgramType;
  }) => Candidate;
  updateCandidateBiodata: (candidateId: string, biodata: CandidateBiodata) => void;
  updateCandidateProfile: (
    candidateId: string,
    updates: {
      fullName?: string;
      email?: string;
      phoneWA?: string;
      address?: string;
      regency?: string;
      avatarUrl?: string;
      password?: string;
    }
  ) => void;
  uploadCandidateDocument: (candidateId: string, doc: Omit<StudentDocument, 'id' | 'status'>) => void;
  verifyDocumentStatus: (candidateId: string, docId: string, status: 'verified' | 'rejected', notes?: string) => void;
  verifyDocument: (candidateId: string, docId: string, status: 'verified' | 'rejected', notes?: string) => void;
  updateCandidateStatus: (candidateId: string, status: CandidateStatus) => void;
  deleteCandidate: (candidateId: string) => void;

  // Payment
  submitPayment: (candidateId: string, payment: Omit<PaymentRecord, 'id' | 'invoiceNo' | 'paymentStatus'>) => void;
  verifyPaymentStatus: (candidateId: string, payId: string, status: 'verified' | 'failed') => void;

  // Super Admin Approval & LoA & Digital Signature
  approveCandidateSuperAdmin: (candidateId: string) => void;
  approveLoABySuperAdmin: (candidateId: string) => void;
  signCandidateLoa: (candidateId: string, signatureInfo: Partial<DigitalSignatureInfo>) => void;
  signAdminLoa: (candidateId: string, signatureInfo: Partial<DigitalSignatureInfo>) => void;

  // Programs & LMS
  programs: ProgramInfo[];
  addProgram: (program: ProgramInfo) => void;
  updateProgram: (id: string, updates: Partial<ProgramInfo>) => void;
  deleteProgram: (id: string) => void;
  lmsModules: LMSModule[];
  toggleLMSModuleComplete: (moduleId: string) => void;
  addLMSModule: (module: LMSModule) => void;
  updateLMSModule: (id: string, updates: Partial<LMSModule>) => void;
  deleteLMSModule: (id: string) => void;
  updateWebsiteFeatures: (features: Partial<WebsiteFeatures>) => void;

  // Downloadable Resources
  studyResources: StudyResource[];
  addStudyResource: (resource: Omit<StudyResource, 'id' | 'downloadCount' | 'uploadedAt'>) => void;
  deleteStudyResource: (id: string) => void;
  incrementResourceDownloadCount: (id: string) => void;

  // Financial & Reports
  financialRecords: FinancialRecord[];
  financials: FinancialRecord[];
  addFinancialRecord: (record: FinancialRecord) => void;

  // News & Feedback & Chat & Notifications
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => void;
  news: NewsArticle[];
  addNewsArticle: (article: NewsArticle) => void;
  chatMessages: ChatMessage[];
  sendStudentChatMessage: (text: string) => void;
  sendCandidateChatMessage: (candidateId: string, text: string) => void;
  sendAdminChatMessage: (text: string) => void;
  feedbacks: FeedbackItem[];
  submitFeedback: (feedback: Omit<FeedbackItem, 'id' | 'createdAt'>) => void;

  // Official Correspondence (Surat Menyurat & Kop Surat)
  letterheadConfig: LetterheadConfig;
  updateLetterheadConfig: (config: LetterheadConfig) => void;
  letterTemplates: LetterTemplate[];
  addLetterTemplate: (template: Omit<LetterTemplate, 'id' | 'updatedAt'>) => void;
  updateLetterTemplate: (id: string, updates: Partial<LetterTemplate>) => void;
  deleteLetterTemplate: (id: string) => void;
  issuedLetters: IssuedLetter[];
  issueNewLetter: (letter: Omit<IssuedLetter, 'id' | 'issueDate'>) => IssuedLetter;
  deleteIssuedLetter: (id: string) => void;

  // WhatsApp Gateway Notification Settings
  whatsappConfig: WhatsAppGatewayConfig;
  updateWhatsAppConfig: (newConfig: WhatsAppGatewayConfig) => void;

  // Email Notification Gateway Settings & Service
  emailConfig: EmailGatewayConfig;
  updateEmailConfig: (newConfig: EmailGatewayConfig) => void;
  sendApprovalEmail: (candidateId: string) => Promise<{ success: boolean; message?: string }>;

  // Quick Reset
  resetDataToDefault: () => void;

  // JWT Server Authentication & Validated Session Management
  authToken: string | null;
  getAuthHeaders: () => Record<string, string>;
  authenticateWithServer: (email?: string, password?: string, requestedRole?: UserRole) => Promise<boolean>;

  // Dedicated User Credential Authentication & Session Security
  currentUserSession: {
    username: string;
    fullName: string;
    role: UserRole;
    email: string;
    loginTime: string;
  } | null;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  loginModalRole: UserRole;
  loginModalInitialTab: 'login' | 'register';
  openLoginModal: (role?: UserRole, initialTab?: 'login' | 'register') => void;
  closeLoginModal: () => void;
  loginWithCredentials: (
    usernameInput: string,
    passwordInput: string,
    requestedRole: UserRole
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<'id' | 'en'>(() => {
    const saved = localStorage.getItem('prospect_language');
    return saved === 'en' ? 'en' : 'id';
  });

  const setLanguage = (lang: 'id' | 'en') => {
    setLanguageState(lang);
    localStorage.setItem('prospect_language', lang);
  };

  const t = (idText: string, enText: string) => (language === 'en' ? enText : idText);

  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('prospect_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    localStorage.setItem('prospect_theme', newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const [currentRole, setRoleState] = useState<UserRole>('visitor');
  const [activeTab, setActiveTab] = useState<string>('beranda');
  const [selectedProgramId, setSelectedProgramId] = useState<ProgramType | null>(null);

  // User Session & Authentication Modal State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalRole, setLoginModalRole] = useState<UserRole>('student');
  const [loginModalInitialTab, setLoginModalInitialTab] = useState<'login' | 'register'>('login');
  const [currentUserSession, setCurrentUserSession] = useState<{
    username: string;
    fullName: string;
    role: UserRole;
    email: string;
    loginTime: string;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('prospect_user_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const openLoginModal = (role?: UserRole, initialTab: 'login' | 'register' = 'login') => {
    if (role && role !== 'visitor') {
      setLoginModalRole(role);
    }
    setLoginModalInitialTab(initialTab);
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  // Server JWT Auth Token State
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem('prospect_jwt_token');
  });

  const getAuthHeaders = (): Record<string, string> => {
    if (authToken) {
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      };
    }
    return { 'Content-Type': 'application/json' };
  };

  const authenticateWithServer = async (email?: string, password?: string, requestedRole?: UserRole): Promise<boolean> => {
    try {
      const emailToUse = email || (requestedRole ? `${requestedRole}@prospecteducation.id` : 'visitor@prospecteducation.id');
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailToUse,
          password: password || 'Prospect2026Secure!',
          requestedRole: requestedRole || currentRole,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        setAuthToken(data.token);
        localStorage.setItem('prospect_jwt_token', data.token);
        if (data.user?.role) {
          setRoleState(data.user.role as UserRole);
        }
        return true;
      }
    } catch (err) {
      console.warn('Server JWT auth notice:', err);
    }
    return false;
  };

  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    try {
      const saved = localStorage.getItem('prospect_candidates');
      return saved ? JSON.parse(saved) : INITIAL_CANDIDATES;
    } catch {
      return INITIAL_CANDIDATES;
    }
  });

  const [currentCandidateId, setCurrentCandidateId] = useState<string>('CAND-001');

  const [programs, setPrograms] = useState<ProgramInfo[]>(() => {
    try {
      const saved = localStorage.getItem('prospect_programs');
      return saved ? JSON.parse(saved) : INITIAL_PROGRAMS;
    } catch {
      return INITIAL_PROGRAMS;
    }
  });

  const [webmasters, setWebmasters] = useState<WebmasterUser[]>(() => {
    try {
      const saved = localStorage.getItem('prospect_webmasters');
      return saved ? JSON.parse(saved) : INITIAL_WEBMASTERS;
    } catch {
      return INITIAL_WEBMASTERS;
    }
  });

  const [websiteFeatures, setWebsiteFeatures] = useState<WebsiteFeatures>(() => {
    try {
      const saved = localStorage.getItem('prospect_website_features');
      return saved ? JSON.parse(saved) : INITIAL_WEBSITE_FEATURES;
    } catch {
      return INITIAL_WEBSITE_FEATURES;
    }
  });

  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings>(() => {
    try {
      const saved = localStorage.getItem('prospect_website_settings');
      return saved ? JSON.parse(saved) : INITIAL_WEBSITE_SETTINGS;
    } catch {
      return INITIAL_WEBSITE_SETTINGS;
    }
  });

  const [whatsappConfig, setWhatsappConfig] = useState<WhatsAppGatewayConfig>(() => {
    try {
      const saved = localStorage.getItem('prospect_whatsapp_config');
      return saved ? JSON.parse(saved) : DEFAULT_WA_CONFIG;
    } catch {
      return DEFAULT_WA_CONFIG;
    }
  });

  const updateWhatsAppConfig = (newConfig: WhatsAppGatewayConfig) => {
    setWhatsappConfig(newConfig);
    localStorage.setItem('prospect_whatsapp_config', JSON.stringify(newConfig));
  };

  const [emailConfig, setEmailConfig] = useState<EmailGatewayConfig>(() => {
    try {
      const saved = localStorage.getItem('prospect_email_config');
      return saved ? JSON.parse(saved) : DEFAULT_EMAIL_CONFIG;
    } catch {
      return DEFAULT_EMAIL_CONFIG;
    }
  });

  const updateEmailConfig = (newConfig: EmailGatewayConfig) => {
    setEmailConfig(newConfig);
    localStorage.setItem('prospect_email_config', JSON.stringify(newConfig));
  };

  const sendApprovalEmail = async (candidateId: string): Promise<{ success: boolean; message?: string }> => {
    const candidate = candidates.find((c) => c.id === candidateId);
    if (!candidate) {
      return { success: false, message: 'Data pendaftar tidak ditemukan.' };
    }
    const res = await sendAccountApprovalEmailNotification(candidate, {
      isSuperAdmin: currentRole === 'superadmin',
    });
    return {
      success: res.success,
      message: res.message || res.errorMessage,
    };
  };

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem('prospect_audit_logs');
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  const [documentRequests, setDocumentRequests] = useState<DocumentRequest[]>(() => {
    try {
      const saved = localStorage.getItem('prospect_document_requests');
      return saved ? JSON.parse(saved) : INITIAL_DOCUMENT_REQUESTS;
    } catch {
      return INITIAL_DOCUMENT_REQUESTS;
    }
  });

  const [studentPortfolios, setStudentPortfolios] = useState<StudentPortfolio[]>(() => {
    try {
      const saved = localStorage.getItem('prospect_student_portfolios');
      return saved ? JSON.parse(saved) : INITIAL_PORTFOLIOS;
    } catch {
      return INITIAL_PORTFOLIOS;
    }
  });

  const [attendances, setAttendances] = useState<AttendanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem('prospect_attendances');
      return saved ? JSON.parse(saved) : INITIAL_ATTENDANCES;
    } catch {
      return INITIAL_ATTENDANCES;
    }
  });

  const addAttendanceRecord = (record: Omit<AttendanceRecord, 'id'>): AttendanceRecord => {
    const newRecord: AttendanceRecord = {
      ...record,
      id: `att-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    };
    const updated = [newRecord, ...attendances];
    setAttendances(updated);
    try {
      localStorage.setItem('prospect_attendances', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    return newRecord;
  };

  const updateAttendanceStatus = (id: string, status: AttendanceRecord['status'], notes?: string) => {
    const updated = attendances.map((a) =>
      a.id === id
        ? {
            ...a,
            status,
            notes: notes !== undefined ? notes : a.notes,
          }
        : a
    );
    setAttendances(updated);
    try {
      localStorage.setItem('prospect_attendances', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const [lmsModules, setLmsModules] = useState<LMSModule[]>(() => {
    try {
      const saved = localStorage.getItem('prospect_lms_modules');
      return saved ? JSON.parse(saved) : INITIAL_LMS_MODULES;
    } catch {
      return INITIAL_LMS_MODULES;
    }
  });

  const [studyResources, setStudyResources] = useState<StudyResource[]>(() => {
    try {
      const saved = localStorage.getItem('prospect_study_resources');
      return saved ? JSON.parse(saved) : INITIAL_STUDY_RESOURCES;
    } catch {
      return INITIAL_STUDY_RESOURCES;
    }
  });

  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>(() => {
    try {
      const saved = localStorage.getItem('prospect_financial_records');
      return saved ? JSON.parse(saved) : INITIAL_FINANCIAL_RECORDS;
    } catch {
      return INITIAL_FINANCIAL_RECORDS;
    }
  });

  const [news, setNews] = useState<NewsArticle[]>(() => {
    try {
      const saved = localStorage.getItem('prospect_news');
      return saved ? JSON.parse(saved) : INITIAL_NEWS;
    } catch {
      return INITIAL_NEWS;
    }
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT);

  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([
    {
      id: 'fb-1',
      name: 'Ahmad Dahlan',
      email: 'ahmad@gmail.com',
      phone: '081233445566',
      subject: 'Pertanyaan Program IFP 1+4',
      message: 'Apakah ada kuota khusus untuk pendaftar dari wilayah Balung dan Ambulu Jember?',
      createdAt: '2026-07-20 14:00',
      isReplied: true,
    },
  ]);

  const INITIAL_NOTIFICATIONS: AppNotification[] = [
    {
      id: 'notif-1',
      candidateId: 'CAND-001',
      titleId: 'Verifikasi Dokumen KTP & Ijazah Disetujui',
      titleEn: 'ID Card & Diploma Document Verified',
      messageId: 'Scan KTP & Ijazah Anda telah berhasil diverifikasi oleh Tim Admin Prospect Jember.',
      messageEn: 'Your ID Card & Diploma scan has been verified by Prospect Jember Admin.',
      type: 'verification',
      timestamp: '10 Menit lalu',
      isRead: false,
      linkTab: 'pendaftaran',
    },
    {
      id: 'notif-2',
      titleId: 'Pengumuman Baru: Pembekalan Beasiswa Taiwan',
      titleEn: 'New Announcement: Taiwan Scholarship Orientation',
      messageId: 'Jadwal pembekalan tatap muka Program Taiwan IFP 1+4 Cabang Jember resmi dibuka.',
      messageEn: 'In-person orientation for Taiwan IFP 1+4 Jember Branch is officially opened.',
      type: 'announcement',
      timestamp: '1 Jam lalu',
      isRead: false,
      linkTab: 'berita',
    },
    {
      id: 'notif-3',
      candidateId: 'CAND-001',
      titleId: 'Surat Penerimaan Resmi (LoA) Diterbitkan',
      titleEn: 'Official Acceptance Letter (LoA) Issued',
      messageId: 'Surat LoA Beasiswa S1 Taiwan Anda resmi disahkan oleh Kepala Cabang Rohim Egy.',
      messageEn: 'Your Taiwan S1 Scholarship LoA was officially signed by Branch Head Rohim Egy.',
      type: 'loa',
      timestamp: 'Kemarin, 14:20',
      isRead: true,
      linkTab: 'pendaftaran',
    },
  ];

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('prospect_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Initialize Firestore Connection Test
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  // Persist local storage and Firestore database changes
  useEffect(() => {
    localStorage.setItem('prospect_candidates', JSON.stringify(candidates));
    // Background sync to Firestore candidates collection
    candidates.forEach((c) => {
      setDoc(doc(db, 'candidates', c.id), c, { merge: true }).catch((err) =>
        console.warn('Firestore candidate sync warning:', err)
      );
    });
  }, [candidates]);

  useEffect(() => {
    localStorage.setItem('prospect_lms_modules', JSON.stringify(lmsModules));
    lmsModules.forEach((m) => {
      setDoc(doc(db, 'lms_modules', m.id), m, { merge: true }).catch((err) =>
        console.warn('Firestore lms_modules sync warning:', err)
      );
    });
  }, [lmsModules]);

  useEffect(() => {
    localStorage.setItem('prospect_financial_records', JSON.stringify(financialRecords));
    financialRecords.forEach((f) => {
      setDoc(doc(db, 'financials', f.id), f, { merge: true }).catch((err) =>
        console.warn('Firestore financials sync warning:', err)
      );
    });
  }, [financialRecords]);

  useEffect(() => {
    localStorage.setItem('prospect_audit_logs', JSON.stringify(auditLogs));
    auditLogs.forEach((al) => {
      setDoc(doc(db, 'audit_logs', al.id), al, { merge: true }).catch((err) =>
        console.warn('Firestore audit_logs sync warning:', err)
      );
    });
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('prospect_programs', JSON.stringify(programs));
  }, [programs]);

  useEffect(() => {
    localStorage.setItem('prospect_study_resources', JSON.stringify(studyResources));
  }, [studyResources]);

  useEffect(() => {
    localStorage.setItem('prospect_financial_records', JSON.stringify(financialRecords));
  }, [financialRecords]);

  useEffect(() => {
    localStorage.setItem('prospect_news', JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem('prospect_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('prospect_webmasters', JSON.stringify(webmasters));
  }, [webmasters]);

  useEffect(() => {
    localStorage.setItem('prospect_website_features', JSON.stringify(websiteFeatures));
  }, [websiteFeatures]);

  useEffect(() => {
    localStorage.setItem('prospect_website_settings', JSON.stringify(websiteSettings));
  }, [websiteSettings]);

  useEffect(() => {
    localStorage.setItem('prospect_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('prospect_document_requests', JSON.stringify(documentRequests));
  }, [documentRequests]);

  const addDocumentRequest = (req: Omit<DocumentRequest, 'id' | 'requestDate' | 'status' | 'trackingHistory'>) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newId = `DOC-REQ-${Date.now().toString().slice(-4)}`;
    
    const newReq: DocumentRequest = {
      ...req,
      id: newId,
      requestDate: nowStr,
      status: 'submitted',
      trackingHistory: [
        {
          status: 'submitted',
          title: 'Pengajuan Surat Dikirim',
          note: `Permohonan ${req.documentTypeName} berhasil terdaftar di sistem.`,
          timestamp: nowStr,
        },
      ],
    };

    setDocumentRequests((prev) => [newReq, ...prev]);

    // Automatically add audit log
    addAuditLog({
      actorName: `${req.candidateName} (Siswa)`,
      actorRole: 'admin',
      actionCategory: 'student_update',
      actionDescription: `Siswa mengajukan permohonan dokumen digital: ${req.documentTypeName}`,
      targetEntity: `Permohonan Dokumen ID: ${newId}`,
      ipAddress: 'Sistem Portal Siswa',
      status: 'success',
      details: `Keperluan: ${req.purpose}`,
    });

    addNotification({
      type: 'system',
      titleId: 'Pengajuan Dokumen Berhasil',
      titleEn: 'Document Request Submitted',
      messageId: `Permohonan ${req.documentTypeName} Anda telah diterima dan dalam antrean admin.`,
      messageEn: `Your request for ${req.documentTypeName} has been received.`,
    });
  };

  const updateDocumentRequestStatus = (
    id: string,
    status: DocumentRequest['status'],
    note: string,
    processedBy?: string,
    downloadUrl?: string
  ) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    setDocumentRequests((prev) =>
      prev.map((req) => {
        if (req.id !== id) return req;

        let statusTitle = 'Pembaruan Status';
        if (status === 'processing') statusTitle = 'Sedang Diproses Staff Admin';
        if (status === 'signed') statusTitle = 'Penandatanganan / Legalitas Pimpinan';
        if (status === 'ready') statusTitle = 'Dokumen Resmi Siap Diunduh';
        if (status === 'rejected') statusTitle = 'Pengajuan Ditolak / Dibatalkan';

        const updatedHistory = [
          ...req.trackingHistory,
          {
            status,
            title: statusTitle,
            note: note || 'Status permohonan diperbarui oleh staf akademik.',
            timestamp: nowStr,
          },
        ];

        return {
          ...req,
          status,
          processedBy: processedBy || req.processedBy,
          downloadUrl: downloadUrl || req.downloadUrl,
          trackingHistory: updatedHistory,
        };
      })
    );
  };

  useEffect(() => {
    localStorage.setItem('prospect_student_portfolios', JSON.stringify(studentPortfolios));
  }, [studentPortfolios]);

  const getPortfolioByCandidateId = (candidateId: string): StudentPortfolio | undefined => {
    return studentPortfolios.find((p) => p.candidateId === candidateId);
  };

  const updatePortfolioBio = (candidateId: string, bioSummary: string, careerGoals: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setStudentPortfolios((prev) => {
      const existing = prev.find((p) => p.candidateId === candidateId);
      if (existing) {
        return prev.map((p) =>
          p.candidateId === candidateId
            ? { ...p, bioSummary, careerGoals, updatedAt: nowStr }
            : p
        );
      }
      const cand = candidates.find((c) => c.id === candidateId);
      const newPortfolio: StudentPortfolio = {
        candidateId,
        candidateName: cand?.fullName || 'Siswa LKP Prospect',
        bioSummary,
        careerGoals,
        skills: [],
        certificates: [],
        shareCode: `PORTFOLIO-${candidateId}-${Date.now().toString().slice(-4)}`,
        isPublic: true,
        updatedAt: nowStr,
      };
      return [...prev, newPortfolio];
    });
  };

  const addPortfolioCertificate = (candidateId: string, cert: Omit<PortfolioCertificate, 'id'>) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newCert: PortfolioCertificate = {
      ...cert,
      id: `cert-${Date.now().toString().slice(-4)}`,
      verifiedStatus: cert.verifiedStatus || 'self_uploaded',
    };

    setStudentPortfolios((prev) => {
      const existing = prev.find((p) => p.candidateId === candidateId);
      if (existing) {
        return prev.map((p) =>
          p.candidateId === candidateId
            ? { ...p, certificates: [newCert, ...p.certificates], updatedAt: nowStr }
            : p
        );
      }
      const cand = candidates.find((c) => c.id === candidateId);
      return [
        ...prev,
        {
          candidateId,
          candidateName: cand?.fullName || 'Siswa LKP Prospect',
          bioSummary: 'Peserta Pelatihan LKP & Konsultan Prospect Education Jember',
          careerGoals: 'Mengembangkan karir internasional di Taiwan/Jepang.',
          skills: [],
          certificates: [newCert],
          shareCode: `PORTFOLIO-${candidateId}-${Date.now().toString().slice(-4)}`,
          isPublic: true,
          updatedAt: nowStr,
        },
      ];
    });
  };

  const deletePortfolioCertificate = (candidateId: string, certId: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setStudentPortfolios((prev) =>
      prev.map((p) =>
        p.candidateId === candidateId
          ? { ...p, certificates: p.certificates.filter((c) => c.id !== certId), updatedAt: nowStr }
          : p
      )
    );
  };

  const addPortfolioSkill = (candidateId: string, skill: Omit<StudentSkill, 'id'>) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newSkill: StudentSkill = {
      ...skill,
      id: `sk-${Date.now().toString().slice(-4)}`,
    };

    setStudentPortfolios((prev) => {
      const existing = prev.find((p) => p.candidateId === candidateId);
      if (existing) {
        return prev.map((p) =>
          p.candidateId === candidateId
            ? { ...p, skills: [...p.skills, newSkill], updatedAt: nowStr }
            : p
        );
      }
      const cand = candidates.find((c) => c.id === candidateId);
      return [
        ...prev,
        {
          candidateId,
          candidateName: cand?.fullName || 'Siswa LKP Prospect',
          bioSummary: 'Peserta Pelatihan LKP & Konsultan Prospect Education Jember',
          careerGoals: 'Mengembangkan karir internasional di Taiwan/Jepang.',
          skills: [newSkill],
          certificates: [],
          shareCode: `PORTFOLIO-${candidateId}-${Date.now().toString().slice(-4)}`,
          isPublic: true,
          updatedAt: nowStr,
        },
      ];
    });
  };

  const deletePortfolioSkill = (candidateId: string, skillId: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setStudentPortfolios((prev) =>
      prev.map((p) =>
        p.candidateId === candidateId
          ? { ...p, skills: p.skills.filter((s) => s.id !== skillId), updatedAt: nowStr }
          : p
      )
    );
  };

  const addAuditLog = (logData: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newEntry: AuditLogEntry = {
      ...logData,
      id: `audit-${Date.now()}`,
      timestamp: nowStr,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  const clearAuditLogs = () => {
    setAuditLogs([]);
  };

  const addWebmasterUser = (wm: Omit<WebmasterUser, 'id' | 'createdAt' | 'lastActive'>) => {
    const newUser: WebmasterUser = {
      ...wm,
      id: `web-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastActive: 'Baru Dibuat',
    };
    setWebmasters((prev) => [newUser, ...prev]);
    addNotification({
      titleId: 'Berhasil Tambah Pengelola Website',
      titleEn: 'Webmaster Added Successfully',
      messageId: `User ${wm.fullName} resmi ditambahkan sebagai ${wm.roleType}.`,
      messageEn: `User ${wm.fullName} added as ${wm.roleType}.`,
      type: 'system',
    });
  };

  const updateWebmasterUser = (id: string, updates: Partial<WebmasterUser>) => {
    setWebmasters((prev) => prev.map((w) => (w.id === id ? { ...w, ...updates } : w)));
    addNotification({
      titleId: 'Pengelola Website Diperbarui',
      titleEn: 'Webmaster Updated',
      messageId: 'Data tim pengelola website telah dikerjakan.',
      messageEn: 'Webmaster data updated.',
      type: 'system',
    });
  };

  const deleteWebmasterUser = (id: string) => {
    setWebmasters((prev) => prev.filter((w) => w.id !== id));
    addNotification({
      titleId: 'Pengelola Dihapus',
      titleEn: 'Webmaster Removed',
      messageId: 'User pengelola website telah dihapus dari daftar.',
      messageEn: 'Webmaster user removed from list.',
      type: 'system',
    });
  };

  const toggleWebsiteFeature = (key: keyof WebsiteFeatures) => {
    setWebsiteFeatures((prev) => {
      const nextVal = !prev[key];
      addNotification({
        titleId: 'Fitur Website Diperbarui',
        titleEn: 'Website Feature Toggled',
        messageId: `Fitur ${key} sekarang ${nextVal ? 'AKTIF (ON)' : 'NONAKTIF (OFF)'}.`,
        messageEn: `Feature ${key} is now ${nextVal ? 'ACTIVE (ON)' : 'INACTIVE (OFF)'}.`,
        type: 'system',
      });
      return { ...prev, [key]: nextVal };
    });
  };

  const updateWebsiteSettings = (updates: Partial<WebsiteSettings>) => {
    setWebsiteSettings((prev) => ({ ...prev, ...updates }));
    addNotification({
      titleId: 'Pengaturan Website Disimpan',
      titleEn: 'Website Settings Saved',
      messageId: 'Identitas, banner darurat, dan meta SEO website berhasil diperbarui.',
      messageEn: 'Site identity, emergency banner, and meta SEO updated.',
      type: 'system',
    });
  };

  const deleteNewsArticle = (id: string) => {
    setNews((prev) => prev.filter((n) => n.id !== id));
    addNotification({
      titleId: 'Berita Dihapus',
      titleEn: 'News Article Deleted',
      messageId: 'Artikel berita telah dihapus dari website.',
      messageEn: 'News article deleted from website.',
      type: 'announcement',
    });
  };

  const updateNewsArticle = (id: string, updates: Partial<NewsArticle>) => {
    setNews((prev) => prev.map((n) => (n.id === id ? { ...n, ...updates } : n)));
    addNotification({
      titleId: 'Berita Diperbarui',
      titleEn: 'News Article Updated',
      messageId: 'Perubahan pada artikel berita berhasil disimpan.',
      messageEn: 'News article changes saved.',
      type: 'announcement',
    });
  };

  const addNotification = (notifData: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotif: AppNotification = {
      ...notifData,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: 'Baru saja',
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  const loginWithCredentials = async (
    usernameInput: string,
    passwordInput: string,
    requestedRole: UserRole
  ): Promise<{ success: boolean; message?: string }> => {
    const uLower = usernameInput.trim().toLowerCase();
    const pass = passwordInput.trim();

    if (!uLower || !pass) {
      return { success: false, message: 'Username/Email dan Kata Sandi wajib diisi.' };
    }

    let fullName = 'Pengguna Terverifikasi';

    if (requestedRole === 'superadmin') {
      const validUsers = ['superadmin', 'superadmin@prospect-jember.id', 'direksi', 'super_admin', 'super.admin'];
      const validPasses = ['super123', 'superadmin', 'admin123', 'prospect2026'];
      if (!validUsers.includes(uLower)) {
        return { success: false, message: 'Username / Email Super Admin tidak terdaftar dalam sistem.' };
      }
      if (!validPasses.includes(pass.toLowerCase())) {
        return { success: false, message: 'Kata sandi Super Admin tidak sesuai. Silakan periksa kembali kata sandi Anda.' };
      }
      fullName = 'Super Admin Pusat (Direksi)';
    } else if (requestedRole === 'admin') {
      const validUsers = ['admin', 'admin@prospect-jember.id', 'admin_jember', 'adminjember', 'admin.jember'];
      const validPasses = ['admin123', 'admin', 'prospect2026', 'prospect123'];
      if (!validUsers.includes(uLower)) {
        return { success: false, message: 'Username / Email Admin tidak terdaftar dalam sistem.' };
      }
      if (!validPasses.includes(pass.toLowerCase())) {
        return { success: false, message: 'Kata sandi Admin tidak sesuai. Silakan periksa kembali kata sandi Anda.' };
      }
      fullName = 'Admin Cabang Jember';
    } else if (requestedRole === 'investor') {
      const validUsers = ['investor', 'investor@prospect-jember.id', 'hendra', 'investor_mitras'];
      const validPasses = ['investor123', 'investor', 'prospect2026'];
      if (!validUsers.includes(uLower)) {
        return { success: false, message: 'Username / Email Investor tidak terdaftar dalam sistem.' };
      }
      if (!validPasses.includes(pass.toLowerCase())) {
        return { success: false, message: 'Kata sandi Investor tidak sesuai. Silakan periksa kembali kata sandi Anda.' };
      }
      fullName = 'Investor Mitras (Bapak Hendra)';
    } else if (requestedRole === 'webmaster') {
      const validUsers = ['webmaster', 'webmaster@prospect-jember.id', 'it_webmaster', 'webmaster_it'];
      const validPasses = ['webmaster123', 'webmaster', 'prospect2026'];
      if (!validUsers.includes(uLower)) {
        return { success: false, message: 'Username / Email Webmaster tidak terdaftar dalam sistem.' };
      }
      if (!validPasses.includes(pass.toLowerCase())) {
        return { success: false, message: 'Kata sandi Webmaster tidak sesuai. Silakan periksa kembali kata sandi Anda.' };
      }
      fullName = 'Tim IT Webmaster';
    } else {
      // Role: student / peserta
      const candidate = candidates.find(
        (c) =>
          c.biodata?.email?.toLowerCase() === uLower ||
          c.email?.toLowerCase() === uLower ||
          c.fullName.toLowerCase() === uLower ||
          c.registrationNumber.toLowerCase() === uLower ||
          c.id.toLowerCase() === uLower ||
          (uLower.length > 3 && c.fullName.toLowerCase().includes(uLower))
      );

      if (!candidate) {
        return {
          success: false,
          message: `Username atau Email '${usernameInput}' tidak terdaftar dalam database. Siswa baru WAJIB melakukan pendaftaran terlebih dahulu melalui Form Pendaftaran Online.`,
        };
      }

      // Check candidate registration approval status
      if (candidate.status === 'registered') {
        return {
          success: false,
          message: `Akun pendaftaran Anda ('${candidate.fullName}' - ${candidate.registrationNumber}) sedang 'Menunggu Verifikasi & Persetujuan Admin Cabang Jember'. Akun baru wajib disetujui Admin terlebih dahulu sebelum Anda dapat masuk ke Portal LMS Peserta.`,
        };
      }

      // Validate student password
      const validStudentPasses = [
        'siswa123',
        'siswa',
        'prospect123',
        'prospect2026',
        'password123',
        candidate.registrationNumber.toLowerCase(),
        candidate.id.toLowerCase(),
      ];

      if (!validStudentPasses.includes(pass.toLowerCase())) {
        return {
          success: false,
          message: 'Kata sandi tidak sesuai. Silakan periksa kembali kata sandi Anda.',
        };
      }

      fullName = candidate.fullName;
      setCurrentCandidateId(candidate.id);
    }

    const sessionObj = {
      username: uLower,
      fullName,
      role: requestedRole,
      email: uLower.includes('@') ? uLower : `${requestedRole}@prospect-jember.id`,
      loginTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setCurrentUserSession(sessionObj);
    localStorage.setItem('prospect_user_session', JSON.stringify(sessionObj));

    setRoleState(requestedRole);

    await authenticateWithServer(sessionObj.email, pass, requestedRole);

    addAuditLog({
      actorName: fullName,
      actorRole: requestedRole === 'superadmin' ? 'superadmin' : requestedRole === 'webmaster' ? 'webmaster' : 'admin',
      actionCategory: 'security',
      actionDescription: `Berhasil login ke sistem dengan username '${uLower}' (Role: ${requestedRole}).`,
      targetEntity: `User: ${uLower}`,
      ipAddress: '180.252.32.110',
      status: 'success',
    });

    return { success: true };
  };

  const logout = () => {
    if (currentUserSession) {
      addAuditLog({
        actorName: currentUserSession.fullName,
        actorRole: currentUserSession.role === 'superadmin' ? 'superadmin' : currentUserSession.role === 'webmaster' ? 'webmaster' : 'admin',
        actionCategory: 'security',
        actionDescription: `Pengguna '${currentUserSession.username}' berhasil keluar (logout) dari sistem.`,
        targetEntity: `User: ${currentUserSession.username}`,
        ipAddress: '180.252.32.110',
        status: 'success',
      });
    }

    setCurrentUserSession(null);
    localStorage.removeItem('prospect_user_session');
    localStorage.removeItem('prospect_jwt_token');
    setAuthToken(null);
    setRoleState('visitor');
    setActiveTab('beranda');
    setCurrentCandidateId('');

    try {
      fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    } catch {}
  };

  const setRole = (role: UserRole) => {
    setRoleState(role);
    if (role === 'student' && !currentCandidateId && candidates.length > 0) {
      setCurrentCandidateId(candidates[0].id);
    }

    // Perform server-validated session role update
    if (authToken) {
      fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ requestedRole: role }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.token) {
            setAuthToken(data.token);
            localStorage.setItem('prospect_jwt_token', data.token);
          }
        })
        .catch((err) => {
          console.warn('Role switch server verification notice:', err);
        });
    } else {
      authenticateWithServer(undefined, undefined, role);
    }
  };

  useEffect(() => {
    // On app mount, verify existing JWT session token with server
    const savedToken = localStorage.getItem('prospect_jwt_token');
    if (savedToken) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated && data.user) {
            setAuthToken(savedToken);
            if (data.user.role) {
              setRoleState(data.user.role as UserRole);
            }
          } else {
            authenticateWithServer(undefined, undefined, currentRole);
          }
        })
        .catch(() => {
          authenticateWithServer(undefined, undefined, currentRole);
        });
    } else {
      authenticateWithServer(undefined, undefined, currentRole);
    }
  }, []);

  const currentCandidate = candidates.find((c) => c.id === currentCandidateId);

  // Register new student
  const registerNewCandidate = (data: {
    fullName: string;
    email: string;
    phoneWA: string;
    programType: ProgramType;
  }): Candidate => {
    const newId = `CAND-${String(candidates.length + 1).padStart(3, '0')}`;
    const newRegNum = `PE-JBR-2026-${String(Math.floor(100 + Math.random() * 900))}`;

    const newCandidate: Candidate = {
      id: newId,
      registrationNumber: newRegNum,
      email: data.email,
      fullName: data.fullName,
      selectedProgram: data.programType,
      status: 'registered',
      registeredAt: new Date().toISOString().split('T')[0],
      documents: [],
      payments: [],
      lmsProgressPercent: 0,
      biodata: {
        nik: '',
        fullName: data.fullName,
        birthPlace: 'Jember',
        birthDate: '2003-01-01',
        gender: 'Laki-Laki',
        religion: 'Islam',
        address: '',
        district: 'Balung',
        regency: 'Kabupaten Jember',
        phoneWA: data.phoneWA,
        email: data.email,
        education: 'SMA/SMK',
        major: '-',
        parentName: '',
        parentPhone: '',
        parentJob: '',
      },
    };

    setCandidates((prev) => [newCandidate, ...prev]);
    setCurrentCandidateId(newId);
    SystemAlerts.notifyWelcomeStudent(addNotification, newId, data.fullName, newRegNum);
    return newCandidate;
  };

  const registerCandidate = (data: {
    fullName: string;
    email: string;
    phoneWA: string;
    selectedProgram?: ProgramType;
    programType?: ProgramType;
  }): Candidate => {
    return registerNewCandidate({
      fullName: data.fullName,
      email: data.email,
      phoneWA: data.phoneWA,
      programType: data.selectedProgram || data.programType || 'taiwan_ifp',
    });
  };

  const updateCandidateStatus = (candidateId: string, status: CandidateStatus) => {
    let targetCandidate: Candidate | undefined = undefined;
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          targetCandidate = { ...c, status };
          return targetCandidate;
        }
        return c;
      })
    );
    SystemAlerts.notifyStatusChanged(addNotification, candidateId, status, targetCandidate?.fullName || '');

    // Trigger email notification when candidate account is approved
    if (
      targetCandidate &&
      emailConfig.notifyOnAccountApproval &&
      (status === 'document_verified' || status === 'superadmin_approved' || status === 'loa_issued' || status === 'lms_active')
    ) {
      sendAccountApprovalEmailNotification(targetCandidate, {
        isSuperAdmin: currentRole === 'superadmin',
      }).catch((err) => console.warn('Email dispatch notice:', err));
    }
  };

  const deleteCandidate = (candidateId: string) => {
    let deletedName = '';
    setCandidates((prev) => {
      const target = prev.find((c) => c.id === candidateId);
      if (target) deletedName = target.fullName;
      return prev.filter((c) => c.id !== candidateId);
    });
    if (deletedName) {
      addAuditLog({
        actorName: 'Super Admin / Admin Pusat',
        actorRole: 'admin',
        actionCategory: 'student_update',
        actionDescription: `Super Admin/Admin menghapus data siswa: ${deletedName} (ID: ${candidateId})`,
        targetEntity: `Candidate (${deletedName})`,
        ipAddress: '127.0.0.1',
        status: 'success',
      });
    }
  };

  const updateCandidateBiodata = (candidateId: string, biodata: CandidateBiodata) => {
    let updatedNextStatus: CandidateStatus | null = null;
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          const nextStatus = c.status === 'registered' ? 'biodata_completed' : c.status;
          if (nextStatus !== c.status) {
            updatedNextStatus = nextStatus;
          }
          return {
            ...c,
            fullName: biodata.fullName,
            email: biodata.email,
            biodata,
            status: nextStatus,
          };
        }
        return c;
      })
    );
    if (updatedNextStatus === 'biodata_completed') {
      SystemAlerts.notifyBiodataCompleted(addNotification, candidateId);
    }
  };

  const updateCandidateProfile = (
    candidateId: string,
    updates: {
      fullName?: string;
      email?: string;
      phoneWA?: string;
      address?: string;
      regency?: string;
      avatarUrl?: string;
      password?: string;
    }
  ) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          const updatedBiodata = c.biodata
            ? {
                ...c.biodata,
                fullName: updates.fullName ?? c.biodata.fullName,
                email: updates.email ?? c.biodata.email,
                phoneWA: updates.phoneWA ?? c.biodata.phoneWA,
                address: updates.address ?? c.biodata.address,
                regency: updates.regency ?? c.biodata.regency,
              }
            : undefined;

          return {
            ...c,
            fullName: updates.fullName ?? c.fullName,
            email: updates.email ?? c.email,
            avatarUrl: updates.avatarUrl ?? c.avatarUrl,
            password: updates.password ?? c.password,
            biodata: updatedBiodata,
          };
        }
        return c;
      })
    );
  };

  const uploadCandidateDocument = (
    candidateId: string,
    docData: Omit<StudentDocument, 'id' | 'status'>
  ) => {
    let documentUploadedStatusTriggered = false;
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          const docId = `doc-${Date.now()}`;
          const newDoc: StudentDocument = {
            id: docId,
            ...docData,
            status: 'pending',
            uploadedAt: new Date().toISOString().split('T')[0],
          };

          const existingDocs = c.documents.filter((d) => d.docType !== docData.docType);
          const updatedDocs = [...existingDocs, newDoc];

          // Check if key documents are present (ktp, ijazah, pasfoto)
          const hasKtp = updatedDocs.some((d) => d.docType === 'ktp');
          const hasIjazah = updatedDocs.some((d) => d.docType === 'ijazah');

          let newStatus = c.status;
          if (hasKtp && hasIjazah && (c.status === 'biodata_completed' || c.status === 'registered')) {
            newStatus = 'documents_uploaded';
            documentUploadedStatusTriggered = true;
          }

          return {
            ...c,
            documents: updatedDocs,
            status: newStatus,
          };
        }
        return c;
      })
    );

    SystemAlerts.notifyDocumentUploaded(addNotification, candidateId, docData.title);
    if (documentUploadedStatusTriggered) {
      SystemAlerts.notifyStatusChanged(addNotification, candidateId, 'documents_uploaded');
    }
  };

  const verifyDocumentStatus = (
    candidateId: string,
    docId: string,
    status: 'verified' | 'rejected',
    notes?: string
  ) => {
    let docTitle = 'Dokumen';
    let computedNextStatus: CandidateStatus | null = null;

    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          const targetDoc = c.documents.find((d) => d.id === docId);
          if (targetDoc) docTitle = targetDoc.title;

          const updatedDocs = c.documents.map((d) => (d.id === docId ? { ...d, status, notes } : d));
          const allVerified = updatedDocs.length >= 2 && updatedDocs.every((d) => d.status === 'verified');
          const anyRejected = updatedDocs.some((d) => d.status === 'rejected');

          let newStatus = c.status;
          if (allVerified) {
            newStatus = 'document_verified';
          } else if (anyRejected) {
            newStatus = 'revision_requested';
          }
          computedNextStatus = newStatus;

          return { ...c, documents: updatedDocs, status: newStatus };
        }
        return c;
      })
    );

    if (status === 'verified') {
      SystemAlerts.notifyDocumentVerified(addNotification, candidateId, docTitle, notes);
    } else {
      SystemAlerts.notifyDocumentRejected(addNotification, candidateId, docTitle, notes);
    }

    if (computedNextStatus === 'document_verified') {
      SystemAlerts.notifyStatusChanged(addNotification, candidateId, 'document_verified');
    } else if (computedNextStatus === 'revision_requested') {
      SystemAlerts.notifyStatusChanged(addNotification, candidateId, 'revision_requested');
    }

    // Trigger WhatsApp notification if enabled
    const targetCandidate = candidates.find((c) => c.id === candidateId);
    if (targetCandidate && whatsappConfig.notifyOnDocumentStatusChange) {
      triggerDocumentStatusWhatsApp(targetCandidate, docTitle, status, notes, whatsappConfig).catch((err) =>
        console.warn('WhatsApp trigger error:', err)
      );
    }
  };

  const submitPayment = (
    candidateId: string,
    paymentData: Omit<PaymentRecord, 'id' | 'invoiceNo' | 'paymentStatus'>
  ) => {
    const invNo = `INV/2026/${String(Date.now()).slice(-4)}`;
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          const payId = `PAY-${Date.now()}`;
          const newPayment: PaymentRecord = {
            id: payId,
            invoiceNo: invNo,
            ...paymentData,
            paymentStatus: 'paid',
            paidAt: new Date().toLocaleString('id-ID'),
          };

          return {
            ...c,
            payments: [newPayment, ...c.payments],
            status: 'payment_pending',
          };
        }
        return c;
      })
    );

    SystemAlerts.notifyPaymentReceived(
      addNotification,
      candidateId,
      invNo,
      paymentData.amount,
      paymentData.paymentMethod
    );
    SystemAlerts.notifyStatusChanged(addNotification, candidateId, 'payment_pending');
  };

  const verifyPaymentStatus = (candidateId: string, payId: string, status: 'verified' | 'failed') => {
    let invNo = 'INV/PE-JBR/2026/088';
    let payAmount = 3000000;

    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          const targetPay = c.payments.find((p) => p.id === payId);
          if (targetPay) {
            invNo = targetPay.invoiceNo;
            payAmount = targetPay.amount;
          }

          const updatedPayments = c.payments.map((p) =>
            p.id === payId ? { ...p, paymentStatus: status } : p
          );

          let newStatus = c.status;
          if (status === 'verified') {
            newStatus = 'payment_verified';
          }

          return { ...c, payments: updatedPayments, status: newStatus };
        }
        return c;
      })
    );

    if (status === 'verified') {
      SystemAlerts.notifyPaymentVerified(addNotification, candidateId, invNo, payAmount);
      SystemAlerts.notifyStatusChanged(addNotification, candidateId, 'payment_verified');
    }

    // Trigger WhatsApp notification if enabled
    const targetCandidate = candidates.find((c) => c.id === candidateId);
    if (targetCandidate && status === 'verified' && whatsappConfig.notifyOnPaymentVerified) {
      triggerPaymentVerifiedWhatsApp(targetCandidate, 'dp_dokumen', payAmount, whatsappConfig).catch((err) =>
        console.warn('WhatsApp trigger error:', err)
      );
    }
  };

  const approveCandidateSuperAdmin = (candidateId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const loaNum = `LOA/PE-JBR/${Math.floor(1000 + Math.random() * 9000)}`;

    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          return {
            ...c,
            status: 'loa_issued',
            superAdminApprovalDate: today,
            loaNumber: loaNum,
            loaIssueDate: today,
            lmsProgressPercent: c.lmsProgressPercent || 10,
            adminSignature: c.adminSignature || {
              isSigned: true,
              signerName: 'Rohim Egy, S.Pd.',
              signerTitle: 'Kepala Cabang Prospect Education Jember',
              signedAt: new Date().toLocaleString('id-ID'),
              approvalCode: `PE-JBR-ADM-${c.registrationNumber.slice(-4)}`,
              hashVerification: `SHA256:PE-JBR-ADM-LOA-APPROVED-${c.id}`
            }
          };
        }
        return c;
      })
    );

    SystemAlerts.notifySuperAdminApproved(addNotification, candidateId);
    SystemAlerts.notifyLoAIssued(addNotification, candidateId, loaNum);

    // Trigger WhatsApp notification for LoA approval
    const targetCandidate = candidates.find((c) => c.id === candidateId);
    if (targetCandidate && whatsappConfig.notifyOnLoaApproval) {
      triggerLoaApprovedWhatsApp(targetCandidate, loaNum, whatsappConfig).catch((err) =>
        console.warn('WhatsApp trigger error:', err)
      );
    }
  };

  const approveLoABySuperAdmin = (candidateId: string) => {
    approveCandidateSuperAdmin(candidateId);
  };

  const signCandidateLoa = (candidateId: string, signatureInfo: Partial<DigitalSignatureInfo>) => {
    const nowStr = new Date().toLocaleString('id-ID');
    const hash = `SHA256:PE-JBR-CAND-${candidateId.slice(-4)}-${Date.now()}`;

    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          const sig: DigitalSignatureInfo = {
            isSigned: true,
            signatureDataUrl: signatureInfo.signatureDataUrl,
            signatureType: signatureInfo.signatureType || 'drawn',
            signerName: signatureInfo.signerName || c.fullName,
            signerNik: signatureInfo.signerNik || c.biodata?.nik || '3509xxxxxxxxxxxx',
            signedAt: nowStr,
            ipAddress: '180.252.112.45 (Portal Peserta PE Jember)',
            hashVerification: hash,
            ...signatureInfo,
          };
          return {
            ...c,
            candidateSignature: sig,
          };
        }
        return c;
      })
    );

    addNotification({
      titleId: 'Tanda Tangan Digital LoA Berhasil',
      titleEn: 'Digital LoA Signed',
      messageId: 'Surat Penerimaan (LoA) telah Anda tanda tangani secara digital dengan sah dan mengikat secara hukum.',
      messageEn: 'Letter of Acceptance has been digitally signed with full legal validity.',
      type: 'loa',
    });
  };

  const signAdminLoa = (candidateId: string, signatureInfo: Partial<DigitalSignatureInfo>) => {
    const nowStr = new Date().toLocaleString('id-ID');
    const hash = `SHA256:PE-JBR-ADM-${candidateId.slice(-4)}-${Date.now()}`;

    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          const sig: DigitalSignatureInfo = {
            isSigned: true,
            signatureDataUrl: signatureInfo.signatureDataUrl,
            signatureType: signatureInfo.signatureType || 'digital_stamp',
            signerName: signatureInfo.signerName || 'Rohim Egy, S.Pd.',
            signerTitle: signatureInfo.signerTitle || 'Kepala Cabang Prospect Education Jember',
            signedAt: nowStr,
            approvalCode: `PE-JBR-ADM-${c.registrationNumber.slice(-4)}`,
            hashVerification: hash,
            ...signatureInfo,
          };
          return {
            ...c,
            adminSignature: sig,
          };
        }
        return c;
      })
    );
  };

  const toggleLMSModuleComplete = (moduleId: string) => {
    let updatedModules: LMSModule[] = [];
    setLmsModules((prev) => {
      updatedModules = prev.map((m) => {
        if (m.id === moduleId) {
          const nextCompleted = !m.isCompleted;
          return {
            ...m,
            isCompleted: nextCompleted,
            progressPercent: nextCompleted ? 100 : 30,
            timeSpentMinutes: nextCompleted ? m.durationMinutes : Math.round(m.durationMinutes * 0.3),
          };
        }
        return m;
      });
      return updatedModules;
    });

    if (currentCandidateId) {
      setCandidates((prev) =>
        prev.map((c) => {
          if (c.id === currentCandidateId) {
            const completedCount = updatedModules.filter((m) => m.isCompleted).length;
            const newPercent = updatedModules.length > 0 ? Math.min(100, Math.round((completedCount / updatedModules.length) * 100)) : 0;
            return { ...c, lmsProgressPercent: newPercent };
          }
          return c;
        })
      );
    }
  };

  const addProgram = (program: ProgramInfo) => {
    setPrograms((prev) => [...prev, program]);
    addAuditLog({
      actorName: 'Admin / Webmaster',
      actorRole: 'admin',
      actionCategory: 'system_config',
      actionDescription: `Menambahkan program pelatihan baru: '${program.title}' (${program.category})`,
      targetEntity: `Program (${program.id})`,
      ipAddress: '127.0.0.1',
      status: 'success',
    });
  };

  const updateProgram = (id: string, updates: Partial<ProgramInfo>) => {
    setPrograms((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    addAuditLog({
      actorName: 'Admin / Webmaster',
      actorRole: 'admin',
      actionCategory: 'system_config',
      actionDescription: `Memperbarui data program pelatihan: ID '${id}'`,
      targetEntity: `Program (${id})`,
      ipAddress: '127.0.0.1',
      status: 'success',
    });
  };

  const deleteProgram = (id: string) => {
    setPrograms((prev) => prev.filter((p) => p.id !== id));
    addAuditLog({
      actorName: 'Admin / Webmaster',
      actorRole: 'admin',
      actionCategory: 'system_config',
      actionDescription: `Menghapus program pelatihan: ID '${id}'`,
      targetEntity: `Program (${id})`,
      ipAddress: '127.0.0.1',
      status: 'success',
    });
  };

  const addLMSModule = (module: LMSModule) => {
    setLmsModules((prev) => [module, ...prev]);
  };

  const updateLMSModule = (id: string, updates: Partial<LMSModule>) => {
    setLmsModules((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };

  const deleteLMSModule = (id: string) => {
    setLmsModules((prev) => prev.filter((m) => m.id !== id));
  };

  const updateWebsiteFeatures = (features: Partial<WebsiteFeatures>) => {
    setWebsiteFeatures((prev) => {
      const updated = { ...prev, ...features };
      localStorage.setItem('prospect_website_features', JSON.stringify(updated));
      return updated;
    });
  };

  const addStudyResource = (resourceData: Omit<StudyResource, 'id' | 'downloadCount' | 'uploadedAt'>) => {
    const newResource: StudyResource = {
      ...resourceData,
      id: `res-${Date.now()}`,
      downloadCount: 0,
      uploadedAt: new Date().toISOString().split('T')[0],
    };
    setStudyResources((prev) => [newResource, ...prev]);
    addNotification({
      titleId: `Materi/Panduan Baru: ${newResource.title}`,
      titleEn: `New Study Guide: ${newResource.title}`,
      messageId: `Instruktur/Admin mengunggah modul belajar baru yang dapat diunduh offline.`,
      messageEn: `Instructor uploaded a new downloadable study guide.`,
      type: 'announcement',
    });
  };

  const deleteStudyResource = (id: string) => {
    setStudyResources((prev) => prev.filter((r) => r.id !== id));
  };

  const incrementResourceDownloadCount = (id: string) => {
    setStudyResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, downloadCount: r.downloadCount + 1 } : r))
    );
  };

  const addFinancialRecord = (record: FinancialRecord) => {
    setFinancialRecords((prev) => [record, ...prev]);
  };

  const addNewsArticle = (article: NewsArticle) => {
    setNews((prev) => [article, ...prev]);
    addNotification({
      titleId: `Pengumuman Baru: ${article.title}`,
      titleEn: `New Announcement: ${article.title}`,
      messageId: article.summary || article.content.substring(0, 120),
      messageEn: article.summary || article.content.substring(0, 120),
      type: 'announcement',
      linkTab: 'berita',
    });
  };

  const sendStudentChatMessage = (text: string) => {
    if (!text.trim()) return;
    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderRole: 'student',
      senderName: currentCandidate?.fullName || 'Peserta',
      message: text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, msg]);

    // Auto simulated response from admin
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-admin-${Date.now()}`,
          senderRole: 'admin',
          senderName: 'Admin Prospect Jember',
          message: 'Halo! Pesan Anda telah diterima oleh Admin Prospect Education Cabang Jember. Kami akan memverifikasi permohonan Anda secepatnya.',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  const sendAdminChatMessage = (text: string) => {
    if (!text.trim()) return;
    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderRole: 'admin',
      senderName: 'Admin Jember',
      message: text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, msg]);
  };

  const sendCandidateChatMessage = (candidateId: string, text: string) => {
    sendStudentChatMessage(text);
  };

  const submitFeedback = (fb: Omit<FeedbackItem, 'id' | 'createdAt'>) => {
    const newFb: FeedbackItem = {
      ...fb,
      id: `fb-${Date.now()}`,
      createdAt: new Date().toLocaleString('id-ID'),
    };
    setFeedbacks((prev) => [newFb, ...prev]);
  };

  // Official Correspondence (Surat Menyurat & Kop Surat)
  const [letterheadConfig, setLetterheadConfig] = useState<LetterheadConfig>(() => {
    try {
      const saved = localStorage.getItem('prospect_letterhead_config');
      return saved ? JSON.parse(saved) : DEFAULT_LETTERHEAD_CONFIG;
    } catch {
      return DEFAULT_LETTERHEAD_CONFIG;
    }
  });

  const [letterTemplates, setLetterTemplates] = useState<LetterTemplate[]>(() => {
    try {
      const saved = localStorage.getItem('prospect_letter_templates');
      return saved ? JSON.parse(saved) : INITIAL_LETTER_TEMPLATES;
    } catch {
      return INITIAL_LETTER_TEMPLATES;
    }
  });

  const [issuedLetters, setIssuedLetters] = useState<IssuedLetter[]>(() => {
    try {
      const saved = localStorage.getItem('prospect_issued_letters');
      return saved ? JSON.parse(saved) : INITIAL_ISSUED_LETTERS;
    } catch {
      return INITIAL_ISSUED_LETTERS;
    }
  });

  useEffect(() => {
    localStorage.setItem('prospect_letterhead_config', JSON.stringify(letterheadConfig));
  }, [letterheadConfig]);

  useEffect(() => {
    localStorage.setItem('prospect_letter_templates', JSON.stringify(letterTemplates));
  }, [letterTemplates]);

  useEffect(() => {
    localStorage.setItem('prospect_issued_letters', JSON.stringify(issuedLetters));
  }, [issuedLetters]);

  const updateLetterheadConfig = (config: LetterheadConfig) => {
    setLetterheadConfig(config);
  };

  const addLetterTemplate = (template: Omit<LetterTemplate, 'id' | 'updatedAt'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newTmpl: LetterTemplate = {
      ...template,
      id: `tmpl-${Date.now()}`,
      updatedAt: today,
    };
    setLetterTemplates((prev) => [newTmpl, ...prev]);
  };

  const updateLetterTemplate = (id: string, updates: Partial<LetterTemplate>) => {
    const today = new Date().toISOString().split('T')[0];
    setLetterTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: today } : t))
    );
  };

  const deleteLetterTemplate = (id: string) => {
    setLetterTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const issueNewLetter = (letter: Omit<IssuedLetter, 'id' | 'issueDate'>): IssuedLetter => {
    const today = new Date().toISOString().split('T')[0];
    const newLetter: IssuedLetter = {
      ...letter,
      id: `issue-${Date.now()}`,
      issueDate: today,
    };
    setIssuedLetters((prev) => [newLetter, ...prev]);
    return newLetter;
  };

  const deleteIssuedLetter = (id: string) => {
    setIssuedLetters((prev) => prev.filter((l) => l.id !== id));
  };

  const resetDataToDefault = () => {
    localStorage.removeItem('prospect_candidates');
    localStorage.removeItem('prospect_lms_modules');
    localStorage.removeItem('prospect_financial_records');
    localStorage.removeItem('prospect_news');
    localStorage.removeItem('prospect_letterhead_config');
    localStorage.removeItem('prospect_letter_templates');
    localStorage.removeItem('prospect_issued_letters');
    setCandidates(INITIAL_CANDIDATES);
    setLmsModules(INITIAL_LMS_MODULES);
    setFinancialRecords(INITIAL_FINANCIAL_RECORDS);
    setNews(INITIAL_NEWS);
    setChatMessages(INITIAL_CHAT);
    setLetterheadConfig(DEFAULT_LETTERHEAD_CONFIG);
    setLetterTemplates(INITIAL_LETTER_TEMPLATES);
    setIssuedLetters(INITIAL_ISSUED_LETTERS);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        theme,
        setTheme,
        toggleTheme,
        currentRole,
        setRole,
        activeTab,
        setActiveTab,
        selectedProgramId,
        setSelectedProgramId,
        webmasters,
        websiteFeatures,
        websiteSettings,
        addWebmasterUser,
        updateWebmasterUser,
        deleteWebmasterUser,
        toggleWebsiteFeature,
        updateWebsiteSettings,
        deleteNewsArticle,
        updateNewsArticle,
        auditLogs,
        addAuditLog,
        clearAuditLogs,
        documentRequests,
        addDocumentRequest,
        updateDocumentRequestStatus,
        studentPortfolios,
        getPortfolioByCandidateId,
        updatePortfolioBio,
        addPortfolioCertificate,
        deletePortfolioCertificate,
        addPortfolioSkill,
        deletePortfolioSkill,
        attendances,
        addAttendanceRecord,
        updateAttendanceStatus,
        currentCandidateId,
        setCurrentCandidateId,
        currentCandidate,
        candidates,
        registerNewCandidate,
        registerCandidate,
        updateCandidateBiodata,
        updateCandidateProfile,
        uploadCandidateDocument,
        verifyDocumentStatus,
        verifyDocument: verifyDocumentStatus,
        updateCandidateStatus,
        deleteCandidate,
        submitPayment,
        verifyPaymentStatus,
        approveCandidateSuperAdmin,
        approveLoABySuperAdmin: approveCandidateSuperAdmin,
        signCandidateLoa,
        signAdminLoa,
        programs,
        addProgram,
        updateProgram,
        deleteProgram,
        lmsModules,
        toggleLMSModuleComplete,
        addLMSModule,
        updateLMSModule,
        deleteLMSModule,
        updateWebsiteFeatures,
        studyResources,
        addStudyResource,
        deleteStudyResource,
        incrementResourceDownloadCount,
        financialRecords,
        financials: financialRecords,
        addFinancialRecord,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        news,
        addNewsArticle,
        chatMessages,
        sendStudentChatMessage,
        sendCandidateChatMessage,
        sendAdminChatMessage,
        feedbacks,
        submitFeedback,
        letterheadConfig,
        updateLetterheadConfig,
        letterTemplates,
        addLetterTemplate,
        updateLetterTemplate,
        deleteLetterTemplate,
        issuedLetters,
        issueNewLetter,
        deleteIssuedLetter,
        whatsappConfig,
        updateWhatsAppConfig,
        emailConfig,
        updateEmailConfig,
        sendApprovalEmail,
        resetDataToDefault,
        authToken,
        getAuthHeaders,
        authenticateWithServer,
        currentUserSession,
        isLoginModalOpen,
        setIsLoginModalOpen,
        loginModalRole,
        loginModalInitialTab,
        openLoginModal,
        closeLoginModal,
        loginWithCredentials,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
