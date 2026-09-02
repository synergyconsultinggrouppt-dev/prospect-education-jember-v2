import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { downloadLoaPDF, downloadStudentProfilePDF } from '../../utils/pdfGenerator';
import { BiodataForm } from './BiodataForm';
import { DocumentUpload } from './DocumentUpload';
import { PaymentGatewayModal } from './PaymentGatewayModal';
import { AcceptanceLetterView } from './AcceptanceLetterView';
import { LMSStudentView } from './LMSStudentView';
import { StudentChat } from './StudentChat';
import { LiveClassCalendar } from './LiveClassCalendar';
import { StudentBadges } from './StudentBadges';
import { EnrollmentJourneyTracker } from './EnrollmentJourneyTracker';
import { PrintableEnrollmentSummaryModal } from './PrintableEnrollmentSummaryModal';
import { PaymentReceiptModal } from './PaymentReceiptModal';
import { ProfileEditModal } from './ProfileEditModal';
import { DigitalCertificateModal } from './DigitalCertificateModal';
import { TopPerformersLeaderboard } from './TopPerformersLeaderboard';
import { DownloadableResourcesLibrary } from './DownloadableResourcesLibrary';
import { MentorConnect } from './MentorConnect';
import { DocumentRequestTracker } from './DocumentRequestTracker';
import { PersonalPortfolio } from './PersonalPortfolio';
import { InterviewMatchmakingModule } from './InterviewMatchmakingModule';
import { StudentAttendanceModule } from './StudentAttendanceModule';
import { StudentRechartsAnalytics } from '../analytics/StudentRechartsAnalytics';
import { StudentPDFReportModal } from '../reports/StudentPDFReportModal';
import { NotificationBell } from '../NotificationBell';
import { SystemAlerts } from '../../utils/SystemAlerts';
import {
  UserCheck,
  Upload,
  CreditCard,
  FileCheck,
  BookOpen,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  Printer,
  User,
  Settings,
  Video,
  Award,
  Timer,
  FileText,
  HelpCircle,
  Trophy,
  Briefcase,
  Download,
  QrCode,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { currentCandidate, lmsModules } = useApp();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'biodata' | 'documents' | 'doc_requests' | 'portfolio' | 'interview_matching' | 'payment' | 'loa' | 'lms' | 'resources' | 'mentor_connect' | 'live_class' | 'attendance' | 'leaderboard' | 'badges' | 'chat'
  >('overview');

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isPdfReportModalOpen, setIsPdfReportModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  if (!currentCandidate) {
    return (
      <div className="max-w-4xl mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
        <h2 className="text-xl font-bold font-serif">Data Peserta Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500">
          Silakan melakukan pendaftaran akun terlebih dahulu melalui menu Pendaftaran Online.
        </p>
      </div>
    );
  }

  // Separate Taiwan vs Japan LMS modules according to candidate choice
  const candidateProgram = currentCandidate.selectedProgram || 'taiwan_ifp';
  const isTaiwanCandidate = candidateProgram.startsWith('taiwan');

  const candidateLmsModules = lmsModules.filter((m) => {
    if (isTaiwanCandidate) {
      return m.programType.startsWith('taiwan') || m.language === 'Mandarin' || m.language === 'Inggris';
    }
    return m.programType.startsWith('japan') || m.language === 'Jepang';
  });

  const steps = [
    { key: 'registered', label: 'Registrasi' },
    { key: 'biodata_completed', label: 'Biodata' },
    { key: 'documents_uploaded', label: 'Dokumen' },
    { key: 'verified_admin', label: 'Verifikasi' },
    { key: 'payment_completed', label: 'Pembayaran' },
    { key: 'approved_superadmin', label: 'Persetujuan Manajemen' },
    { key: 'loa_issued', label: 'LoA Diterbitkan' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'registered':
        return 0;
      case 'biodata_completed':
        return 1;
      case 'documents_uploaded':
        return 2;
      case 'verified_admin':
        return 3;
      case 'payment_completed':
        return 4;
      case 'approved_superadmin':
        return 5;
      case 'loa_issued':
      case 'lms_active':
        return 6;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(currentCandidate.status);

  // Grouped Menu Categories for clean and simple navigation
  const menuCategories = [
    {
      id: 'overview_group',
      title: 'Ringkasan & Status',
      icon: GraduationCap,
      badge: 'Utama',
      tabs: [
        { id: 'overview', label: 'Ringkasan Dashboard', icon: GraduationCap },
        { id: 'loa', label: 'Surat Penerimaan (LoA)', icon: FileCheck },
      ],
    },
    {
      id: 'registration_group',
      title: 'Pendaftaran & Berkas',
      icon: UserCheck,
      badge: 'Wajib',
      tabs: [
        { id: 'biodata', label: 'Isi Biodata Peserta', icon: UserCheck },
        { id: 'documents', label: 'Upload Dokumen', icon: ShieldCheck },
        { id: 'payment', label: 'Pembayaran DP', icon: CreditCard },
      ],
    },
    {
      id: 'lms_group',
      title: 'Pembelajaran & LMS',
      icon: BookOpen,
      badge: 'Akademik',
      tabs: [
        { id: 'lms', label: 'LMS Pembelajaran', icon: BookOpen },
        { id: 'attendance', label: 'Absensi QR & GPS', icon: QrCode },
        { id: 'resources', label: 'Modul PDF & Materi', icon: FileText },
        { id: 'live_class', label: 'Jadwal Live Class', icon: Video },
        { id: 'mentor_connect', label: 'MentorConnect Chat', icon: UserCheck },
      ],
    },
    {
      id: 'career_group',
      title: 'Karir & Penyaluran',
      icon: Briefcase,
      badge: 'Sertifikasi',
      tabs: [
        { id: 'interview_matching', label: 'Wawancara & Mitrah', icon: Briefcase },
        { id: 'portfolio', label: 'Portofolio & Pengalaman', icon: Award },
        { id: 'doc_requests', label: 'Surat Digital & Transkrip', icon: FileText },
      ],
    },
    {
      id: 'community_group',
      title: 'Komunitas & Support',
      icon: Trophy,
      badge: 'Interaktif',
      tabs: [
        { id: 'leaderboard', label: 'Papan Peringkat', icon: Trophy },
        { id: 'badges', label: 'Lencana Digital', icon: Award },
        { id: 'chat', label: 'Chat Admin Jember', icon: MessageCircle },
      ],
    },
  ];

  // Helper to find category of active tab
  const activeCategory = menuCategories.find((cat) =>
    cat.tabs.some((t) => t.id === activeTab)
  ) || menuCategories[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 bg-slate-50/50">
      {/* Welcome Header Banner - Clean Institutional Design */}
      <div className="bg-[#0C2340] text-white p-5 sm:p-7 rounded-3xl border border-slate-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          {/* Avatar Thumbnail */}
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-800 border-2 border-slate-700 shadow-sm overflow-hidden shrink-0 group transition hover:border-amber-400 cursor-pointer"
            title="Klik untuk ubah foto profil & data kontak"
          >
            {currentCandidate.avatarUrl ? (
              <img
                src={currentCandidate.avatarUrl}
                alt={currentCandidate.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-900 text-amber-300 font-bold text-lg font-serif">
                {currentCandidate.fullName.charAt(0)}
              </div>
            )}
            <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-amber-300">
              <Settings className="w-5 h-5" />
            </div>
          </button>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-950 text-blue-300 px-2.5 py-0.5 rounded-md border border-blue-800/80">
                Portal Peserta Jember
              </span>
              <span className="text-[10px] font-semibold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                {isTaiwanCandidate ? 'Program Kuliah Taiwan' : 'Program Kerja Jepang'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-white">
              {currentCandidate.fullName}
            </h1>
            <p className="text-xs text-slate-300">
              ID Registrasi: <span className="font-mono text-amber-300 font-bold">{currentCandidate.registrationNumber}</span>
              <span className="mx-2 text-slate-600">•</span>
              Status: <span className="font-medium text-emerald-400">{SystemAlerts.getStatusLabel(currentCandidate.status, 'id')}</span>
            </p>
          </div>
        </div>

        {/* Concise Action Buttons */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 w-full md:w-auto">
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span>Profil</span>
          </button>

          <button
            onClick={() => downloadStudentProfilePDF(currentCandidate, candidateLmsModules)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Unduh PDF</span>
          </button>

          {currentCandidate.loaIssued ? (
            <button
              onClick={() => setActiveTab('loa')}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-slate-950" />
              <span>Surat LoA</span>
            </button>
          ) : (
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-slate-950" />
              <span>Bayar DP</span>
            </button>
          )}
        </div>
      </div>

      {/* Visual Progress Journey Tracker */}
      <EnrollmentJourneyTracker
        candidate={currentCandidate}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
      />

      {/* Structured Category & Sub-Menu Navigation Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3.5">
        {/* Mobile & Tablet Category Swipeable Pills */}
        <div className="md:hidden space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span>Kategori Menu:</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              {activeCategory.tabs.length} Fitur Tersedia
            </span>
          </div>

          {/* Category Pills Slider */}
          <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-300">
            {menuCategories.map((category) => {
              const Icon = category.icon;
              const isCategoryActive = category.id === activeCategory.id;

              return (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.tabs[0].id as any)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isCategoryActive
                      ? 'bg-[#0F3D7A] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">{category.title}</span>
                </button>
              );
            })}
          </div>

          {/* Sub-menu Grid for Mobile */}
          <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-slate-100">
            {activeCategory.tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isTabActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`p-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 text-left cursor-pointer border ${
                    isTabActive
                      ? 'bg-sky-600 text-white border-sky-700 shadow-xs'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200/80'
                  }`}
                >
                  <TabIcon className={`w-3.5 h-3.5 shrink-0 ${isTabActive ? 'text-white' : 'text-[#0F3D7A]'}`} />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop 5 Main Category Tabs - Clean Segmented Navigation */}
        <div className="hidden md:grid grid-cols-5 gap-2">
          {menuCategories.map((category) => {
            const Icon = category.icon;
            const isCategoryActive = category.id === activeCategory.id;

            return (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.tabs[0].id as any)}
                className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 cursor-pointer ${
                  isCategoryActive
                    ? 'bg-[#0F3D7A] text-white border-[#0F3D7A] shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div
                  className={`p-2 rounded-xl shrink-0 ${
                    isCategoryActive
                      ? 'bg-white/20 text-amber-300'
                      : 'bg-white text-[#0F3D7A] shadow-2xs'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-xs leading-tight truncate">{category.title}</h4>
                  <p
                    className={`text-[10px] mt-0.5 ${
                      isCategoryActive ? 'text-slate-200' : 'text-slate-500'
                    }`}
                  >
                    {category.tabs.length} Menu
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Category Sub-Menu Pills (Desktop) */}
        <div className="hidden md:flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 mr-1">
            Menu [{activeCategory.title}]:
          </span>
          {activeCategory.tabs.map((tab) => {
            const TabIcon = tab.icon;
            const isTabActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer ${
                  isTabActive
                    ? 'bg-[#0F3D7A] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <TabIcon className={`w-3.5 h-3.5 ${isTabActive ? 'text-amber-300' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Views */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Status Alert Summary */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0F3D7A] flex items-center justify-center shrink-0 border border-blue-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-900">Status Pendaftaran Terkini:</span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      SystemAlerts.getStatusBadgeStyle(currentCandidate.status).bg
                    } ${SystemAlerts.getStatusBadgeStyle(currentCandidate.status).text} ${
                      SystemAlerts.getStatusBadgeStyle(currentCandidate.status).border
                    }`}
                  >
                    {SystemAlerts.getStatusLabel(currentCandidate.status, 'id')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Data Anda tersinkronisasi langsung dengan sistem verifikasi Admin Prospect Education Cabang Jember.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Biodata Status */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="p-2 bg-blue-50 text-[#0F3D7A] rounded-xl border border-blue-100">
                    <UserCheck className="w-5 h-5" />
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${currentCandidate.biodata ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'}`}>
                    {currentCandidate.biodata ? 'Lengkap' : 'Belum Lengkap'}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Biodata Peserta</h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                    {currentCandidate.biodata
                      ? `NIK: ${currentCandidate.biodata.nik}`
                      : 'Lengkapi formulir biodata pribadi Anda.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('biodata')}
                className="w-full text-center bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-xl transition text-xs cursor-pointer"
              >
                {currentCandidate.biodata ? 'Ubah Biodata' : 'Isi Biodata'}
              </button>
            </div>

            {/* Card 2: Documents Status */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="p-2 bg-amber-50 text-amber-800 rounded-xl border border-amber-100">
                    <Upload className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full">
                    {currentCandidate.documents.length} Berkas
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Dokumen & Berkas</h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                    {currentCandidate.documents.length > 0
                      ? 'Dokumen tersimpan dan terverifikasi.'
                      : 'Unggah KTP, Ijazah, Pasfoto, & KK.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('documents')}
                className="w-full text-center bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-xl transition text-xs cursor-pointer"
              >
                Kelola Dokumen
              </button>
            </div>

            {/* Card 3: Payment Status */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="p-2 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100">
                    <CreditCard className="w-5 h-5" />
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      currentCandidate.paymentStatus === 'lunas'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-900 border-amber-200'
                    }`}
                  >
                    {currentCandidate.paymentStatus === 'lunas' ? 'LUNAS' : 'Belum Lunas'}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Pembayaran DP</h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                    {currentCandidate.paymentStatus === 'lunas'
                      ? 'Pembayaran DP telah terkonfirmasi.'
                      : 'Lakukan pembayaran DP via QRIS/VA.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (currentCandidate.paymentStatus === 'lunas') {
                    setIsReceiptModalOpen(true);
                  } else {
                    setIsPaymentModalOpen(true);
                  }
                }}
                className="w-full text-center bg-[#0F3D7A] hover:bg-[#0C2340] text-white font-bold py-2 rounded-xl transition text-xs cursor-pointer"
              >
                {currentCandidate.paymentStatus === 'lunas' ? 'Bukti Bayar' : 'Bayar Sekarang'}
              </button>
            </div>

            {/* Card 4: Sertifikat Digital LMS */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="p-2 bg-amber-50 text-amber-800 rounded-xl border border-amber-100">
                    <Award className="w-5 h-5" />
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      candidateLmsModules.every((m) => m.isCompleted)
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {candidateLmsModules.filter((m) => m.isCompleted).length}/{candidateLmsModules.length} Modul
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Sertifikat Digital</h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                    {candidateLmsModules.every((m) => m.isCompleted)
                      ? 'Seluruh modul tuntas. Sertifikat siap.'
                      : 'Tuntaskan materi untuk sertifikat.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCertificateModalOpen(true)}
                className="w-full text-center bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 rounded-xl transition text-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Lihat Sertifikat</span>
              </button>
            </div>
          </div>

          {/* Interactive Recharts Analytics Visualization Component */}
          <StudentRechartsAnalytics candidate={currentCandidate} lmsModules={candidateLmsModules} />

          {/* Dedicated Visual Learning Progress & Time Spent Statistics Widget */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1 rounded-full text-[11px] font-bold mb-1.5">
                  <Timer className="w-3.5 h-3.5 text-amber-700" />
                  <span>Statistik & Tracking Belajar LMS ({isTaiwanCandidate ? 'Taiwan 🇹🇼' : 'Jepang 🇯🇵'})</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-serif">Progres Belajar & Durasi Waktu (Time Spent)</h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Pantau persentase penyelesaian modul {isTaiwanCandidate ? 'Mandarin & Akademik Taiwan' : 'Jepang & Tokutei Ginou'} Anda.
                </p>
              </div>

              <div className="flex items-center gap-3 bg-slate-900 text-white p-4 rounded-2xl shrink-0 border border-slate-800">
                <div className="text-right space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Total Waktu Belajar</span>
                  <div className="text-lg font-black text-amber-400 font-mono">
                    {candidateLmsModules.reduce((acc, m) => acc + (m.isCompleted ? m.durationMinutes : (m.timeSpentMinutes ?? Math.round(m.durationMinutes * 0.3))), 0)}{' '}
                    <span className="text-xs font-normal text-slate-300">/ {candidateLmsModules.reduce((acc, m) => acc + m.durationMinutes, 0)} Menit</span>
                  </div>
                </div>
                <span className="p-2.5 bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-xl">
                  <Clock className="w-6 h-6" />
                </span>
              </div>
            </div>

            {/* Total Visual Progress Bar */}
            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-red-600" />
                  Total Penyelesaian Modul Pelatihan ({isTaiwanCandidate ? 'Taiwan' : 'Jepang'})
                </span>
                <span className="text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full border border-red-200 font-mono">
                  {candidateLmsModules.length > 0 ? Math.round((candidateLmsModules.filter((m) => m.isCompleted).length / candidateLmsModules.length) * 100) : 0}% Selesai ({candidateLmsModules.filter((m) => m.isCompleted).length}/{candidateLmsModules.length} Modul)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                <div
                  className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 transition-all duration-500"
                  style={{
                    width: `${candidateLmsModules.length > 0 ? Math.round((candidateLmsModules.filter((m) => m.isCompleted).length / candidateLmsModules.length) * 100) : 0}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Breakdown of Each LMS Module */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>Rincian Modul & Waktu Belajar ({isTaiwanCandidate ? 'Taiwan' : 'Jepang'})</span>
                <button
                  onClick={() => setActiveTab('lms')}
                  className="text-red-700 hover:text-red-800 text-[11px] font-bold flex items-center gap-1 hover:underline"
                >
                  Buka LMS <ArrowRight className="w-3 h-3" />
                </button>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {candidateLmsModules.map((m) => {
                  const mProgress = m.isCompleted ? 100 : m.progressPercent ?? (m.isCompleted ? 100 : 30);
                  const mTimeSpent = m.isCompleted
                    ? m.durationMinutes
                    : m.timeSpentMinutes ?? Math.round(m.durationMinutes * 0.3);

                  return (
                    <div
                      key={m.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 transition space-y-3 shadow-2xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase">
                            {m.contentType === 'video' && (
                              <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-200 flex items-center gap-1">
                                <Video className="w-3 h-3" /> Video Lesson
                              </span>
                            )}
                            {m.contentType === 'pdf' && (
                              <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 flex items-center gap-1">
                                <FileText className="w-3 h-3" /> PDF Guide
                              </span>
                            )}
                            {m.contentType === 'quiz' && (
                              <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                                <HelpCircle className="w-3 h-3" /> Ujian Tryout
                              </span>
                            )}
                          </div>
                          <h5 className="font-bold text-slate-900 text-xs leading-snug">{m.title}</h5>
                        </div>

                        {m.isCompleted ? (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
                            SELESAI
                          </span>
                        ) : mProgress > 0 ? (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full border border-amber-200 shrink-0">
                            DIPELAJARI
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full shrink-0">
                            BELUM
                          </span>
                        )}
                      </div>

                      {/* Visual Progress Bar per Module */}
                      <div className="space-y-1.5 bg-white p-2.5 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 font-medium flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-600" /> Waktu Belajar:
                          </span>
                          <span className="font-bold font-mono text-slate-900">
                            {mTimeSpent} / {m.durationMinutes} Menit ({mProgress}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div
                            className={`h-full transition-all duration-300 ${
                              m.isCompleted
                                ? 'bg-emerald-500'
                                : mProgress > 0
                                ? 'bg-amber-500'
                                : 'bg-slate-300'
                            }`}
                            style={{ width: `${mProgress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-slate-400">
                          {m.isCompleted ? '100% Selesai & Lulus' : `${m.durationMinutes - mTimeSpent} menit tersisa`}
                        </span>
                        <button
                          onClick={() => setActiveTab('lms')}
                          className="text-xs font-bold text-red-700 hover:text-red-800 transition flex items-center gap-1 cursor-pointer"
                        >
                          <span>Pelajari Modul</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Interactive Live Class Calendar */}
          <LiveClassCalendar />

          {/* Top Performers Leaderboard Widget */}
          <TopPerformersLeaderboard onNavigateLMS={() => setActiveTab('lms')} />
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <TopPerformersLeaderboard onNavigateLMS={() => setActiveTab('lms')} />
      )}

      {activeTab === 'biodata' && <BiodataForm />}
      {activeTab === 'documents' && <DocumentUpload />}
      {activeTab === 'payment' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6 text-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-red-100 border border-red-200 text-red-900 px-3 py-1 rounded-full text-[11px] font-bold mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-red-700" aria-hidden="true" />
                <span>Skema Resmi Pembayaran Prospect Education</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg font-serif">Status & Tahapan Pembayaran Transparan</h3>
              <p className="text-slate-500 text-xs mt-0.5">
                DP dibayarkan setelah dokumen lengkap, Pra-pemberangkatan untuk visa, dan pelunasan setelah siap berangkat.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsReceiptModalOpen(true)}
                className="bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <Printer className="w-4 h-4 text-emerald-200" aria-hidden="true" />
                <span>Cetak Kwitansi / Bukti Bayar</span>
              </button>

              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-amber-300"
              >
                <CreditCard className="w-4 h-4" aria-hidden="true" />
                <span>Buka Payment Gateway</span>
              </button>
            </div>
          </div>

          {/* 3 Payment Stages Visual Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Stage 1: DP */}
            <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-200 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-900 px-2.5 py-1 rounded-full">
                  Tahap 1: DP Uang Muka
                </span>
                <span className="text-xs font-mono font-bold text-slate-900">Rp 3.000.000</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs">Pendaftaran & Matrikulasi</h4>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  Syarat: Dibayarkan <strong>SETELAH DOKUMEN LENGKAP</strong> & terverifikasi oleh Admin Jember.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">Status DP:</span>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  LUNAS / VERIFIED
                </span>
              </div>
            </div>

            {/* Stage 2: Pra-Pemberangkatan */}
            <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-200 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full">
                  Tahap 2: Pra-Pemberangkatan
                </span>
                <span className="text-xs font-mono font-bold text-slate-900">Rp 5.000.000</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs">Pengurusan Visa & Dokumen</h4>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  Syarat: Pengurusan Visa Pelajar/Kerja, Legalisir TETO/Kedutaan, & Pembekalan Akhir.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">Status Pra-Pemberangkatan:</span>
                <span className="font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full text-[11px]">
                  PROSES MATRIKULASI
                </span>
              </div>
            </div>

            {/* Stage 3: Pelunasan Sisa Biaya */}
            <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-200 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full">
                  Tahap 3: Pelunasan
                </span>
                <span className="text-xs font-mono font-bold text-slate-900">Rp 7.000.000</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs">Pelunasan Siap Berangkat</h4>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  Syarat: Dibayarkan <strong>SETELAH SIAP BERANGKAT</strong> (Visa & Tiket Penerbangan Terbit).
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">Status Pelunasan:</span>
                <span className="font-bold text-slate-600 bg-slate-200 px-2.5 py-0.5 rounded-full text-[11px]">
                  MENUNGGU SIAP TERBANG
                </span>
              </div>
            </div>
          </div>

          {/* Verification Log Table */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 text-xs font-serif">Catatan Verifikasi & Midtrans Gateway:</h4>
            <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto text-[11px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3">Tahap Pembayaran</th>
                    <th className="p-3">Syarat Kelayakan</th>
                    <th className="p-3">Metode Bayar</th>
                    <th className="p-3">Nominal</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono text-slate-800">
                  <tr>
                    <td className="p-3 font-bold font-sans">1. Uang Muka (DP)</td>
                    <td className="p-3 font-sans text-emerald-800 font-medium">Dokumen Lengkap (Verified)</td>
                    <td className="p-3">Midtrans QRIS / VA</td>
                    <td className="p-3 font-bold">Rp 3.000.000</td>
                    <td className="p-3 text-emerald-700 font-bold font-sans">LUNAS</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold font-sans">2. Pra-Pemberangkatan</td>
                    <td className="p-3 font-sans text-amber-800 font-medium">LoA Terbit & Paspor</td>
                    <td className="p-3">Midtrans VA BCA</td>
                    <td className="p-3 font-bold">Rp 5.000.000</td>
                    <td className="p-3 text-amber-800 font-bold font-sans">PROS SES</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold font-sans">3. Pelunasan Final</td>
                    <td className="p-3 font-sans text-slate-700 font-medium">Siap Berangkat (Visa & Tiket)</td>
                    <td className="p-3">Midtrans VA Mandiri</td>
                    <td className="p-3 font-bold">Rp 7.000.000</td>
                    <td className="p-3 text-slate-500 font-bold font-sans">PENDING</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'loa' && <AcceptanceLetterView candidate={currentCandidate} />}
      {activeTab === 'doc_requests' && <DocumentRequestTracker />}
      {activeTab === 'portfolio' && <PersonalPortfolio />}
      {activeTab === 'interview_matching' && <InterviewMatchmakingModule />}
      {activeTab === 'lms' && (
        <LMSStudentView onOpenCertificate={() => setIsCertificateModalOpen(true)} />
      )}
      {activeTab === 'attendance' && <StudentAttendanceModule />}
      {activeTab === 'resources' && <DownloadableResourcesLibrary />}
      {activeTab === 'mentor_connect' && <MentorConnect />}
      {activeTab === 'live_class' && <LiveClassCalendar />}
      {activeTab === 'badges' && <StudentBadges candidate={currentCandidate} />}
      {activeTab === 'chat' && <StudentChat />}

      {/* Official Help & Support WhatsApp Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Butuh Bantuan atau Panduan Administrasi?</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Konsultan dan Tim Verifikasi Prospect Education Cabang Jember siap mendampingi proses Anda.
            </p>
          </div>
        </div>

        <a
          href={`https://wa.me/6282334554396?text=${encodeURIComponent(
            `Halo Admin Prospect Education Cabang Jember, saya ${currentCandidate.fullName} (ID: ${currentCandidate.registrationNumber}) membutuhkan informasi dan bantuan terkait proses pendaftaran program ${currentCandidate.selectedProgram}. Terima kasih.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-xs shrink-0 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Hubungi CS WhatsApp</span>
        </a>
      </div>

      {/* Midtrans Modal */}
      <PaymentGatewayModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onOpenReceipt={() => setIsReceiptModalOpen(true)}
      />

      {/* Printable Payment Receipt Modal */}
      {isReceiptModalOpen && (
        <PaymentReceiptModal
          candidate={currentCandidate}
          onClose={() => setIsReceiptModalOpen(false)}
        />
      )}

      {/* Printable Enrollment Summary Modal */}
      {isPrintModalOpen && (
        <PrintableEnrollmentSummaryModal
          candidate={currentCandidate}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}

      {/* Official Student PDF Report Modal */}
      <StudentPDFReportModal
        isOpen={isPdfReportModalOpen}
        onClose={() => setIsPdfReportModalOpen(false)}
        candidate={currentCandidate}
        lmsModules={candidateLmsModules}
      />

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Digital Certificate Preview Modal */}
      {isCertificateModalOpen && (
        <DigitalCertificateModal
          candidate={currentCandidate}
          modules={candidateLmsModules}
          onClose={() => setIsCertificateModalOpen(false)}
        />
      )}
    </div>
  );
};
