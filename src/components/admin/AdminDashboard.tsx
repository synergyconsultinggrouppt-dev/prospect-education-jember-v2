import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Candidate, FinancialRecord, ProgramType } from '../../types';
import { NotificationBell } from '../NotificationBell';
import { SuperAdminPanel } from './SuperAdminPanel';
import { WebmasterDashboard } from '../webmaster/WebmasterDashboard';
import { AuditActivityLog } from './AuditActivityLog';
import { InstitutionSettings } from './InstitutionSettings';
import { ConfirmActionModal } from './ConfirmActionModal';
import { AdminRechartsAnalytics } from '../analytics/AdminRechartsAnalytics';
import { AdminPDFReportModal } from '../reports/AdminPDFReportModal';
import { LoaVerificationModal } from '../LoaVerificationModal';
import { WhatsAppGatewayModal } from './WhatsAppGatewayModal';
import { EmailGatewayModal } from './EmailGatewayModal';
import { AdminAttendanceMonitoring } from './AdminAttendanceMonitoring';
import { AdminProgramManager } from './AdminProgramManager';
import { AdminLMSManager } from './AdminLMSManager';
import { AdminWebsiteContentManager } from './AdminWebsiteContentManager';
import { OfficialCorrespondenceManager } from './OfficialCorrespondenceManager';
import {
  Users,
  FileCheck,
  CreditCard,
  TrendingUp,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Download,
  FileSpreadsheet,
  Search,
  Filter,
  Plus,
  BarChart2,
  FileText,
  Crown,
  BookOpen,
  Newspaper,
  UserPlus,
  UserCheck,
  Clock,
  Eye,
  PhoneCall,
  RefreshCw,
  Sliders,
  Sparkles,
  ShieldCheck,
  X,
  Edit,
  Check,
  Trash2,
  QrCode,
  MapPin,
  Mail,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const {
    candidates = [],
    registerCandidate,
    verifyDocument,
    updateCandidateStatus,
    deleteCandidate,
    approveLoABySuperAdmin,
    verifyPaymentStatus,
    addLMSModule,
    addNewsArticle,
    financials = [],
    addFinancialRecord,
    currentRole,
    resetDataToDefault,
    whatsappConfig,
    updateWhatsAppConfig,
    emailConfig,
    updateEmailConfig,
    addAuditLog,
  } = useApp();

  const isSuperAdmin = currentRole === 'superadmin' || currentRole === 'super_admin';

  const safeCandidates = candidates || [];
  const safeFinancials = financials || [];

  const pendingCandidates = safeCandidates.filter((c) => c.status === 'registered');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgramFilter, setSelectedProgramFilter] = useState('all');
  const [isPdfReportModalOpen, setIsPdfReportModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedPendingUserForDetail, setSelectedPendingUserForDetail] = useState<Candidate | null>(null);
  const [activeTab, setActiveTab] = useState<
    | 'pending_users'
    | 'candidates'
    | 'verifications'
    | 'loa'
    | 'program_manager'
    | 'lms_manager'
    | 'attendance_monitoring'
    | 'website_content'
    | 'financials'
    | 'settings'
    | 'webmaster_features'
    | 'audit_log'
    | 'users'
    | 'correspondence'
  >('pending_users');

  const handleApproveUser = (candidate: Candidate) => {
    setConfirmModal({
      isOpen: true,
      title: 'Setujui & Aktifkan Akun User?',
      description: (
        <div className="space-y-2 text-xs text-slate-600">
          <p>
            Apakah Anda yakin ingin menyetujui pendaftaran user <strong>{candidate.fullName}</strong> ({candidate.registrationNumber})?
          </p>
          <p className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-semibold">
            ✓ Setelah disetujui, akun akan langsung diaktifkan dan pengguna dapat melakukan LOGIN ke Portal LMS Peserta dengan Username/Email dan Kata Sandinya.
          </p>
        </div>
      ),
      confirmText: 'Ya, Setujui & Aktifkan Akun',
      variant: 'success',
      iconType: 'approve',
      onConfirm: () => {
        updateCandidateStatus(candidate.id, 'verified_admin');
        if (addAuditLog) {
          addAuditLog({
            actorName: isSuperAdmin ? 'Super Admin Pusat' : 'Admin Cabang Jember',
            actorRole: isSuperAdmin ? 'superadmin' : 'admin',
            actionCategory: 'student_update',
            actionDescription: `Menyetujui & mengaktifkan akun pendaftaran baru '${candidate.fullName}' (${candidate.registrationNumber}). User sekarang dapat login.`,
            targetEntity: `Candidate: ${candidate.registrationNumber}`,
            ipAddress: '180.252.32.110',
            status: 'success',
          });
        }
        if (selectedPendingUserForDetail?.id === candidate.id) {
          setSelectedPendingUserForDetail(null);
        }
      },
    });
  };

  const handleApproveAllPendingUsers = () => {
    if (pendingCandidates.length === 0) {
      alert('Tidak ada antrean pendaftar pending untuk disetujui.');
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Setujui Seluruh Antrean Pendaftar Pending?',
      description: (
        <div className="space-y-2 text-xs text-slate-600">
          <p>
            Apakah Anda yakin ingin menyetujui <strong>{pendingCandidates.length} pendaftar baru</strong> sekaligus?
          </p>
          <p className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-semibold">
            ✓ Semua pendaftar yang disetujui akan langsung menerima hak akses log in ke platform.
          </p>
        </div>
      ),
      confirmText: 'Ya, Setujui Semua User',
      variant: 'success',
      iconType: 'approve',
      onConfirm: () => {
        pendingCandidates.forEach((c) => {
          updateCandidateStatus(c.id, 'verified_admin');
        });
        if (addAuditLog) {
          addAuditLog({
            actorName: isSuperAdmin ? 'Super Admin Pusat' : 'Admin Cabang Jember',
            actorRole: isSuperAdmin ? 'superadmin' : 'admin',
            actionCategory: 'student_update',
            actionDescription: `Persetujuan masal (Batch Approval) ${pendingCandidates.length} pendaftar pending.`,
            targetEntity: 'Batch Pending Candidates',
            ipAddress: '180.252.32.110',
            status: 'success',
          });
        }
        alert(`[BERHASIL] ${pendingCandidates.length} pendaftar berhasil disetujui dan diaktifkan akunnya!`);
      },
    });
  };

  // Global Confirmation Alert Modal for Sensitive Admin Actions
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: React.ReactNode;
    confirmText?: string;
    variant?: 'danger' | 'warning' | 'success' | 'info';
    iconType?: 'trash' | 'alert' | 'approve' | 'reject' | 'reset';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });

  // Modals for Super Admin
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isAddLMSModalOpen, setIsAddLMSModalOpen] = useState(false);
  const [isAddNewsModalOpen, setIsAddNewsModalOpen] = useState(false);

  // Document Verification Team Modals
  const [rejectionModalDoc, setRejectionModalDoc] = useState<{
    candidateId: string;
    candidateName: string;
    docId: string;
    docTitle: string;
  } | null>(null);
  const [rejectionNote, setRejectionNote] = useState('');

  const [previewModalDoc, setPreviewModalDoc] = useState<{
    candidateName: string;
    docTitle: string;
    fileName?: string;
    fileUrl?: string;
    uploadedAt?: string;
    status: string;
    notes?: string;
  } | null>(null);

  // New Student Form
  const [newStudentForm, setNewStudentForm] = useState({
    fullName: '',
    email: '',
    phoneWA: '',
    selectedProgram: 'S1_TAIWAN' as ProgramType,
  });

  // New LMS Module Form
  const [newLmsForm, setNewLmsForm] = useState({
    title: '',
    language: 'Mandarin' as 'Mandarin' | 'Inggris' | 'Jepang',
    duration: '4 Minggu (16 Sesi)',
    moduleCount: 6,
    description: '',
  });

  // New News Article Form
  const [newNewsForm, setNewNewsForm] = useState({
    title: '',
    category: 'Sistem & Pendaftaran',
    summary: '',
  });

  // Financial Form state
  const [finForm, setFinForm] = useState({
    description: '',
    category: 'pendaftaran',
    type: 'income' as 'income' | 'expense',
    amount: '',
  });

  const filteredCandidates = safeCandidates.filter((c) => {
    const matchesSearch =
      (c.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.registrationNumber || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProg = selectedProgramFilter === 'all' || c.selectedProgram === selectedProgramFilter;
    return matchesSearch && matchesProg;
  });

  const handleCreateStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentForm.fullName || !newStudentForm.email) return;

    registerCandidate({
      fullName: newStudentForm.fullName,
      email: newStudentForm.email,
      phoneWA: newStudentForm.phoneWA || '081234567890',
      selectedProgram: newStudentForm.selectedProgram,
    });

    alert(`[SUPER ADMIN] Peserta "${newStudentForm.fullName}" berhasil didaftarkan secara manual ke sistem!`);
    setNewStudentForm({ fullName: '', email: '', phoneWA: '', selectedProgram: 'S1_TAIWAN' });
    setIsAddStudentModalOpen(false);
  };

  const handleCreateLMSModuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLmsForm.title) return;

    addLMSModule({
      id: `lms-${Date.now()}`,
      title: newLmsForm.title,
      language: newLmsForm.language,
      duration: newLmsForm.duration,
      moduleCount: newLmsForm.moduleCount,
      description: newLmsForm.description || 'Materi pembelajaran interaktif disiapkan oleh Instruktur Pusat.',
      isCompleted: false,
      topics: [
        { id: 't1', title: 'Pendahuluan & Vocabulary Utama', isCompleted: false },
        { id: 't2', title: 'Latihan Soal & Podcast Audio', isCompleted: false },
      ],
    });

    alert(`[SUPER ADMIN] Modul LMS baru "${newLmsForm.title}" berhasil diinput dan diterbitkan untuk siswa!`);
    setNewLmsForm({ title: '', language: 'Jepang', duration: '4 Minggu (16 Sesi)', moduleCount: 6, description: '' });
    setIsAddLMSModalOpen(false);
  };

  const handleCreateNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNewsForm.title) return;

    addNewsArticle({
      id: `news-${Date.now()}`,
      title: newNewsForm.title,
      category: newNewsForm.category,
      date: new Date().toISOString().split('T')[0],
      summary: newNewsForm.summary || 'Pengumuman resmi dari Direksi & Super Admin Pusat Prospect Education.',
      author: 'Super Admin Pusat',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    });

    alert(`[SUPER ADMIN] Pengumuman baru "${newNewsForm.title}" berhasil diterbitkan ke halaman publik!`);
    setNewNewsForm({ title: '', category: 'Sistem & Pendaftaran', summary: '' });
    setIsAddNewsModalOpen(false);
  };

  const handleBatchApproveAllPending = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Persetujuan Masal Berkas Pending',
      description: 'Apakah Super Admin yakin ingin menyetujui SELURUH berkas dokumen dan status pendaftaran peserta yang saat ini berstatus pending secara masal?',
      confirmText: 'Ya, Setujui Masal',
      variant: 'success',
      iconType: 'approve',
      onConfirm: () => {
        safeCandidates.forEach((c) => {
          c.documents.forEach((doc) => {
            verifyDocument(c.id, doc.id, 'verified', 'Disetujui otomatis oleh Super Admin Pusat');
          });
          updateCandidateStatus(c.id, 'approved_superadmin');
        });
        alert('[SUPER ADMIN] Seluruh berkas peserta pending berhasil disetujui secara masal!');
      },
    });
  };

  const handleExportCSV = () => {
    if (filteredCandidates.length === 0) {
      alert('Tidak ada data peserta untuk diexport.');
      return;
    }

    const headers = [
      'No. Registrasi',
      'Nama Lengkap Peserta',
      'NIK',
      'Email',
      'No. HP / WhatsApp',
      'Asal Sekolah / Kampus',
      'Kabupaten / Kota',
      'Nama Orang Tua / Wali',
      'No. HP Orang Tua',
      'Program Pilihan',
      'Status Tahapan Alur',
      'Jumlah Dokumen Unggah',
      'Status Pembayaran DP',
      'Nomor Surat LoA',
      'Tanggal Pendaftaran',
    ];

    const rows = filteredCandidates.map((c) => {
      const phone = c.biodata?.phoneWA || c.biodata?.phone || c.phone || '-';
      const nik = c.biodata?.nik || '-';
      const school = c.biodata?.schoolOrigin || '-';
      const city = c.biodata?.cityOrigin || '-';
      const parentName = c.biodata?.parentName || '-';
      const parentPhone = c.biodata?.parentPhone || '-';
      const statusPayment = c.paymentStatus || (c.payments && c.payments.length > 0 ? c.payments[0].paymentStatus : 'pending');
      const docCount = c.documents ? c.documents.length : 0;
      const createdAt = c.createdAt || c.registeredAt || new Date().toISOString().split('T')[0];

      return [
        `"${(c.registrationNumber || '').replace(/"/g, '""')}"`,
        `"${(c.fullName || '').replace(/"/g, '""')}"`,
        `"${nik.replace(/"/g, '""')}"`,
        `"${(c.email || '').replace(/"/g, '""')}"`,
        `"${phone.replace(/"/g, '""')}"`,
        `"${school.replace(/"/g, '""')}"`,
        `"${city.replace(/"/g, '""')}"`,
        `"${parentName.replace(/"/g, '""')}"`,
        `"${parentPhone.replace(/"/g, '""')}"`,
        `"${(c.selectedProgram || '').replace(/"/g, '""')}"`,
        `"${(c.status || '').replace(/"/g, '""')}"`,
        `"${docCount}"`,
        `"${statusPayment.replace(/"/g, '""')}"`,
        `"${(c.loaNumber || '-').replace(/"/g, '""')}"`,
        `"${createdAt.replace(/"/g, '""')}"`,
      ];
    });

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `Rekap_Pendaftaran_Peserta_Prospect_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate quick summary metrics
  const totalCandidates = safeCandidates.length;
  const verifiedCandidates = safeCandidates.filter((c) => c.status !== 'registered').length;
  const pendingLoACount = safeCandidates.filter(
    (c) => (c.status === 'payment_verified' || c.status === 'payment_pending') && !c.loaNumber
  ).length;
  const totalIncome = safeFinancials
    .filter((f) => f.type === 'income')
    .reduce((sum, f) => sum + (f.amount || f.totalRevenue || 0), 0) || 165000000;

  const handleAddFinancial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!finForm.description || !finForm.amount) return;
    addFinancialRecord({
      date: new Date().toISOString().split('T')[0],
      description: finForm.description,
      category: finForm.category as any,
      type: finForm.type,
      amount: parseFloat(finForm.amount),
      recordedBy: currentRole === 'super_admin' ? 'Super Admin' : 'Admin Jember',
    });
    setFinForm({ description: '', category: 'pendaftaran', type: 'income', amount: '' });
  };

  const chartData = [
    { month: 'Jan', peserta: 12, pendapatan: 36000000 },
    { month: 'Feb', peserta: 18, pendapatan: 54000000 },
    { month: 'Mar', peserta: 25, pendapatan: 75000000 },
    { month: 'Apr', peserta: 32, pendapatan: 96000000 },
    { month: 'Mei', peserta: 28, pendapatan: 84000000 },
    { month: 'Jun', peserta: 40, pendapatan: 120000000 },
    { month: 'Jul', peserta: 45, pendapatan: 135000000 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-slate-800 bg-slate-50/50">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-[#0F3D7A] via-sky-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-sky-300/30 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-[10px] font-bold uppercase tracking-widest text-sky-200 bg-sky-950/80 px-3 py-1 rounded-full border border-sky-400/30">
            {isSuperAdmin ? 'PANEL KONTROL SUPER ADMIN (PUSAT)' : 'PANEL OPERASIONAL ADMIN CABANG JEMBER'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-white">
            {isSuperAdmin
              ? 'Sistem Pengawasan Pusat & Otorisasi Final'
              : 'Manajemen Operasional & Verifikasi Berkas'}
          </h1>
          <p className="text-xs text-slate-200 max-w-xl">
            Sistem Informasi Terpadu Prospect Education. Mengelola pendaftaran peserta, verifikasi berkas, pencatatan keuangan, dan persetujuan LoA.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="px-3.5 py-2.5 bg-indigo-900 hover:bg-indigo-800 text-indigo-100 border border-indigo-400/40 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
            title="Kelola Integrasi Notifikasi Email Otomatis & Log SMTP"
          >
            <Mail className="w-4 h-4 text-indigo-300" />
            <span>Gateway Email Notifikasi</span>
          </button>

          <button
            onClick={() => setIsWhatsAppModalOpen(true)}
            className="px-3.5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 border border-emerald-400/40 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
            title="Kelola & Integrasi Gateway WhatsApp Notifikasi Otomatis"
          >
            <MessageCircle className="w-4 h-4 text-emerald-300" />
            <span>Gateway WhatsApp</span>
          </button>

          <button
            onClick={() => setIsVerificationModalOpen(true)}
            className="px-3.5 py-2.5 bg-sky-950 hover:bg-sky-900 text-amber-300 border border-amber-400/40 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
            title="Scan atau Cek Validasi Keaslian QR Code Surat LoA"
          >
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>Validasi QR LoA</span>
          </button>

          <button
            onClick={() => setIsPdfReportModalOpen(true)}
            className="px-3.5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
            title="Unduh Laporan PDF Eksekutif Kelembagaan & Operasional"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>Unduh Laporan PDF</span>
          </button>

          <div className="bg-sky-950/90 p-1 rounded-2xl border border-sky-400/30 flex items-center justify-center">
            <NotificationBell />
          </div>

          <div className="flex items-center gap-3 bg-sky-950/90 p-3 rounded-2xl border border-sky-400/30 text-xs">
            <div className="p-2.5 bg-sky-900/60 text-amber-300 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-sky-200">Total Kas Terpenuhi (Jember):</p>
              <p className="text-base font-black text-amber-300 font-mono">
                Rp {totalIncome.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Pendaftar</span>
            <div className="p-2 bg-sky-50 text-blue-900 rounded-xl">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-blue-900">{totalCandidates}</p>
          <p className="text-[10px] text-slate-500">Peserta Terdaftar di Sistem</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Berkas Terverifikasi</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600">{verifiedCandidates}</p>
          <p className="text-[10px] text-slate-500">Tahap Administrasi Lanjut</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Pending LoA Approval</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600">{pendingLoACount}</p>
          <p className="text-[10px] text-slate-500">Menunggu TTD Manajemen Prospect Education</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Penerimaan Kas Total</span>
            <div className="p-2 bg-sky-50 text-sky-700 rounded-xl">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-blue-900 font-mono text-sm sm:text-base">
            Rp {totalIncome.toLocaleString('id-ID')}
          </p>
          <p className="text-[10px] text-slate-500">Terverifikasi Midtrans / Kasir</p>
        </div>
      </div>

      {/* Recharts Analytics Visualization Component */}
      <AdminRechartsAnalytics candidates={safeCandidates} />

      {/* Tabs Switcher (Mobile Select + Categorized Header Navigation) */}
      <div className="space-y-4 border-b border-slate-200 pb-4">
        {/* Mobile Navigation Dropdown */}
        <div className="md:hidden w-full bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
          <label className="block text-xs font-bold text-blue-900 mb-1.5 flex items-center justify-between">
            <span>📍 Navigasi Admin & Manajemen:</span>
            <span className="text-[10px] text-slate-500 font-normal">Pilih modul</span>
          </label>
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as any)}
            className="w-full bg-slate-50 text-blue-900 font-bold text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
          >
            <optgroup label="👥 1. Pendaftaran & Peserta">
              <option value="pending_users">⏳ Persetujuan User Pending ({pendingCandidates.length})</option>
              <option value="candidates">👥 Daftar Peserta & Status Alur</option>
              <option value="verifications">🛡️ Verifikasi Dokumen Syarat</option>
              <option value="loa">📋 Persetujuan Surat LoA (Direksi)</option>
            </optgroup>
            <optgroup label="🎓 2. Program & Pembelajaran (LMS)">
              <option value="program_manager">📚 Kelola Program Pelatihan (Tambah/Edit/Hapus)</option>
              <option value="lms_manager">📖 Kelola LMS & Modul Video PDF</option>
              <option value="attendance_monitoring">📊 Monitoring Absensi QR & GPS</option>
            </optgroup>
            <optgroup label="🌐 3. Website & Public Content">
              <option value="website_content">📢 Kelola Website, Teks Banner & Berita</option>
              <option value="settings">⚙️ Pengaturan Lembaga & Template Dokumen</option>
              <option value="correspondence">✉️ Surat Menyurat, Kop & Logo Lembaga</option>
              <option value="webmaster_features">🌐 Pengelola Fitur Website</option>
            </optgroup>
            <optgroup label="💰 4. Keuangan, Audit & Hak Akses">
              <option value="financials">💰 Keuangan & Kas Jember</option>
              <option value="audit_log">🛡️ Audit Log Aktivitas System</option>
              {isSuperAdmin && <option value="users">👑 Hak Akses (RBAC) & System Control</option>}
            </optgroup>
          </select>
        </div>

        {/* Desktop Categorized Navigation Bar */}
        <div className="hidden md:flex flex-col space-y-3">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-1 no-scrollbar">
            {/* Group 1: Pendaftaran & Peserta */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button
                onClick={() => setActiveTab('pending_users')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === 'pending_users'
                    ? 'bg-[#0F3D7A] text-amber-300 shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>Persetujuan User</span>
                {pendingCandidates.length > 0 && (
                  <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full animate-pulse">
                    {pendingCandidates.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('candidates')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                  activeTab === 'candidates'
                    ? 'bg-[#0F3D7A] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                Peserta & Status
              </button>

              <button
                onClick={() => setActiveTab('verifications')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                  activeTab === 'verifications'
                    ? 'bg-[#0F3D7A] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                Verifikasi Dokumen
              </button>

              <button
                onClick={() => setActiveTab('loa')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                  activeTab === 'loa'
                    ? 'bg-[#0F3D7A] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                Approval LoA
              </button>
            </div>

            {/* Group 2: Program & Pembelajaran */}
            <div className="flex items-center gap-1.5 bg-blue-50/70 p-1.5 rounded-2xl border border-blue-200/80">
              <button
                onClick={() => setActiveTab('program_manager')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === 'program_manager'
                    ? 'bg-[#0F3D7A] text-amber-300 shadow-xs'
                    : 'bg-white text-blue-950 hover:bg-blue-100'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                <span>📚 Kelola Program</span>
              </button>

              <button
                onClick={() => setActiveTab('lms_manager')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === 'lms_manager'
                    ? 'bg-[#0F3D7A] text-amber-300 shadow-xs'
                    : 'bg-white text-blue-950 hover:bg-blue-100'
                }`}
              >
                <span>📖 Kelola LMS</span>
              </button>

              <button
                onClick={() => setActiveTab('attendance_monitoring')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === 'attendance_monitoring'
                    ? 'bg-[#0F3D7A] text-amber-300 shadow-xs'
                    : 'bg-white text-blue-950 hover:bg-blue-100'
                }`}
              >
                <QrCode className="w-3.5 h-3.5 text-amber-600" />
                <span>Presensi QR & GPS</span>
              </button>
            </div>

            {/* Group 3: Website & Public Content */}
            <div className="flex items-center gap-1.5 bg-indigo-50/70 p-1.5 rounded-2xl border border-indigo-200/80">
              <button
                onClick={() => setActiveTab('website_content')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === 'website_content'
                    ? 'bg-indigo-900 text-white shadow-xs'
                    : 'bg-white text-indigo-950 hover:bg-indigo-100'
                }`}
              >
                <Newspaper className="w-3.5 h-3.5 text-indigo-600" />
                <span>📢 Kelola Website</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-indigo-900 text-white shadow-xs'
                    : 'bg-white text-indigo-950 hover:bg-indigo-100'
                }`}
              >
                ⚙️ Pengaturan
              </button>

              <button
                onClick={() => setActiveTab('correspondence')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === 'correspondence'
                    ? 'bg-indigo-900 text-amber-300 shadow-xs'
                    : 'bg-white text-indigo-950 hover:bg-indigo-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span>✉️ Kop & Surat Menyurat</span>
              </button>

              <button
                onClick={() => setActiveTab('webmaster_features')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                  activeTab === 'webmaster_features'
                    ? 'bg-indigo-900 text-white shadow-xs'
                    : 'bg-white text-indigo-950 hover:bg-indigo-100'
                }`}
              >
                🌐 Saklar Fitur
              </button>
            </div>

            {/* Group 4: Keuangan & System */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button
                onClick={() => setActiveTab('financials')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                  activeTab === 'financials'
                    ? 'bg-[#0F3D7A] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                💰 Keuangan
              </button>

              <button
                onClick={() => setActiveTab('audit_log')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer ${
                  activeTab === 'audit_log'
                    ? 'bg-slate-900 text-sky-300 shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Audit Log</span>
              </button>

              {isSuperAdmin && (
                <button
                  onClick={() => setActiveTab('users')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer ${
                    activeTab === 'users'
                      ? 'bg-[#0F3D7A] text-amber-300 shadow-xs'
                      : 'bg-amber-100 text-amber-950 hover:bg-amber-200'
                  }`}
                >
                  👑 Hak Akses
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama / NIK / No. Reg..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* VIEW 0: PENDING USERS REGISTRATION APPROVAL */}
      {activeTab === 'pending_users' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-6 p-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-amber-50 via-sky-50 to-blue-50 border border-amber-200/80 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-amber-500/20 border border-amber-400/40 rounded-2xl flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-lg font-serif">
                    Persetujuan & Verifikasi Pendaftaran User Baru
                  </h3>
                  <span className="bg-amber-100 text-amber-900 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-amber-300">
                    {pendingCandidates.length} Antrean Pending
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  Pengguna yang mendaftar melalui formulir pendaftaran online memerlukan persetujuan dan verifikasi dari Admin Cabang Jember sebelum dapat melakukan log in ke Portal LMS Peserta.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleApproveAllPendingUsers}
                disabled={pendingCandidates.length === 0}
                className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-sm cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>Setujui Semua User Pending ({pendingCandidates.length})</span>
              </button>
            </div>
          </div>

          {/* Pending Users List */}
          {pendingCandidates.length === 0 ? (
            <div className="p-12 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-800">Semua Pendaftaran User Telah Disetujui!</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Tidak ada antrean pendaftar pending saat ini. Semua pendaftar baru yang mendaftar telah diaktivasi dan dapat mengakses portal.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider">
                    <th className="p-3.5">No. Reg / Tgl Daftar</th>
                    <th className="p-3.5">Nama Pendaftar & Kontak</th>
                    <th className="p-3.5">Program Pilihan</th>
                    <th className="p-3.5">Asal Sekolah & NIK</th>
                    <th className="p-3.5">Status Akun</th>
                    <th className="p-3.5 text-center">Aksi Persetujuan Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingCandidates.map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-amber-50/40 transition">
                      <td className="p-3.5 font-mono">
                        <div className="font-bold text-slate-900">{candidate.registrationNumber}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{candidate.registeredAt || '2026-08-05'}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 text-sm">{candidate.fullName}</div>
                        <div className="text-slate-500 text-[11px]">{candidate.email}</div>
                        {candidate.biodata?.phoneWA && (
                          <a
                            href={`https://wa.me/62${candidate.biodata.phoneWA.replace(/^0/, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold hover:underline mt-0.5"
                          >
                            <MessageCircle className="w-3 h-3 text-emerald-600" />
                            <span>{candidate.biodata.phoneWA}</span>
                          </a>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span className="bg-[#0F3D7A] text-amber-300 font-bold text-[10px] px-2.5 py-1 rounded-full uppercase border border-amber-400/30 inline-block">
                          {candidate.selectedProgram}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="font-medium text-slate-800">{candidate.biodata?.education || 'SMK / SMA Jember'}</div>
                        <div className="text-[10px] font-mono text-slate-400">NIK: {candidate.biodata?.nik || '-'}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-lg text-[10px] inline-flex items-center gap-1 border border-amber-300">
                          <Clock className="w-3 h-3 text-amber-700" />
                          <span>MENUNGGU VERIFIKASI</span>
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleApproveUser(candidate)}
                            className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition flex items-center gap-1 cursor-pointer shadow-xs"
                            title="Setujui & Aktifkan Hak Akses Login User"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Setujui Akun</span>
                          </button>

                          <button
                            onClick={() => setSelectedPendingUserForDetail(candidate)}
                            className="bg-sky-50 hover:bg-sky-100 text-blue-900 font-bold px-2.5 py-1.5 rounded-xl text-xs transition border border-sky-200 flex items-center gap-1 cursor-pointer"
                            title="Lihat Detail Biodata Pendaftaran"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-800" />
                            <span>Detail</span>
                          </button>

                          <button
                            onClick={() => {
                              setConfirmModal({
                                isOpen: true,
                                title: 'Tolak Pendaftaran User?',
                                description: `Apakah Anda yakin ingin menolak dan menghapus pendaftaran ${candidate.fullName}?`,
                                confirmText: 'Ya, Tolak & Hapus',
                                variant: 'danger',
                                iconType: 'trash',
                                onConfirm: () => deleteCandidate(candidate.id),
                              });
                            }}
                            className="bg-red-50 hover:bg-red-100 text-red-700 p-1.5 rounded-xl border border-red-200 transition cursor-pointer"
                            title="Tolak Pendaftaran"
                          >
                            <XCircle className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* VIEW 1: CANDIDATES LIST */}
      {activeTab === 'candidates' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base font-serif flex items-center gap-2">
                <span>Data Seluruh Peserta Terdaftar</span>
                {isSuperAdmin && (
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-300">
                    SUPER ADMIN CONTROL
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 font-semibold">{filteredCandidates.length} Data Ditampilkan</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddStudentModalOpen(true)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-xs"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Input Peserta Baru</span>
              </button>

              {isSuperAdmin && (
                <button
                  type="button"
                  onClick={handleBatchApproveAllPending}
                  className="bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-xs border border-slate-700"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>⚡ Batch Approve All</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleExportCSV}
                className="bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition shadow-sm border border-emerald-600/40 cursor-pointer"
                title="Unduh Seluruh Data Rekapitulasi Peserta dalam Format Excel (.csv)"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-200 shrink-0" />
                <span>Unduh Excel</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
                  <th className="p-3">No. Registrasi</th>
                  <th className="p-3">Nama Peserta</th>
                  <th className="p-3">Program Pilihan</th>
                  <th className="p-3">Tahap Alur Status</th>
                  <th className="p-3">Pembayaran</th>
                  <th className="p-3">Aksi Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCandidates.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-mono font-bold text-slate-900">{c.registrationNumber}</td>
                    <td className="p-3 font-bold text-slate-900">
                      {c.fullName}
                      <p className="text-[10px] text-slate-400 font-normal">{c.email}</p>
                    </td>
                    <td className="p-3">
                      <span className="bg-red-50 text-red-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase border border-red-200">
                        {c.selectedProgram}
                      </span>
                    </td>
                    <td className="p-3">
                      <select
                        value={c.status}
                        onChange={(e) => updateCandidateStatus(c.id, e.target.value as any)}
                        className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-semibold text-slate-800"
                      >
                        <option value="registered">1. Registered</option>
                        <option value="biodata_completed">2. Biodata Lengkap</option>
                        <option value="documents_uploaded">3. Dokumen Diunggah</option>
                        <option value="verified_admin">4. Terverifikasi Admin</option>
                        <option value="payment_completed">5. Pembayaran DP Lunas</option>
                        <option value="approved_superadmin">6. Super Admin Approved</option>
                        <option value="loa_issued">7. LoA Diterbitkan</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                          (c.payments && c.payments.some((p) => p.paymentStatus === 'paid' || p.paymentStatus === 'verified'))
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {(c.payments && c.payments.length > 0 ? c.payments[0].paymentStatus : 'PENDING').toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setConfirmModal({
                              isOpen: true,
                              title: 'Setujui Berkas Peserta?',
                              description: `Apakah Anda yakin ingin mengubah status pendaftaran ${c.fullName} (${c.registrationNumber}) menjadi "Terverifikasi Admin"?`,
                              confirmText: 'Ya, Setujui',
                              variant: 'success',
                              iconType: 'approve',
                              onConfirm: () => updateCandidateStatus(c.id, 'verified_admin'),
                            });
                          }}
                          className="bg-slate-900 text-white font-bold px-3 py-1 rounded-lg text-[10px] hover:bg-slate-800 transition cursor-pointer"
                        >
                          Setujui Berkas
                        </button>
                        <button
                          onClick={() => {
                            setConfirmModal({
                              isOpen: true,
                              title: 'Hapus Data Siswa?',
                              description: (
                                <span>
                                  Apakah Anda yakin ingin menghapus data siswa <strong>{c.fullName}</strong> ({c.registrationNumber}) secara permanen dari database sistem? Tindakan ini <strong>tidak dapat dibatalkan</strong>.
                                </span>
                              ),
                              confirmText: 'Ya, Hapus Permanen',
                              variant: 'danger',
                              iconType: 'trash',
                              onConfirm: () => deleteCandidate(c.id),
                            });
                          }}
                          title="Hapus Data Siswa"
                          className="bg-red-50 hover:bg-red-100 text-red-700 p-1 rounded-lg text-[10px] border border-red-200 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: DOCUMENT VERIFICATION TEAM PANEL */}
      {activeTab === 'verifications' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-red-800" />
                <h3 className="font-bold text-slate-900 text-base font-serif">Tim Verifikasi Dokumen - Modul Peninjauan Berkas Siswa</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Review seluruh 11 berkas dokumen persyaratan asli pendaftaran. Anda dapat menerima atau menolak dokumen yang tidak sesuai disertai catatan revisi.
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 px-3 py-1.5 rounded-xl text-xs font-bold text-red-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Tim Verifikasi Aktif</span>
            </div>
          </div>

          <div className="space-y-6">
            {filteredCandidates.map((c) => {
              const totalDocs = c.documents?.length || 0;
              const verifiedDocs = c.documents?.filter((d) => d.status === 'verified').length || 0;
              const rejectedDocs = c.documents?.filter((d) => d.status === 'rejected').length || 0;
              const pendingDocs = c.documents?.filter((d) => d.status === 'pending').length || 0;

              return (
                <div key={c.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{c.fullName}</h4>
                        <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-full">
                          {c.selectedProgram}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        No. Registrasi: <span className="font-bold text-slate-700">{c.registrationNumber}</span> • HP/WA: {c.phoneWA || '-'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-bold">
                      <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg">
                        {verifiedDocs} Terverifikasi
                      </span>
                      <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg">
                        {pendingDocs} Menunggu
                      </span>
                      <span className="bg-red-100 text-red-800 px-2.5 py-1 rounded-lg">
                        {rejectedDocs} Ditolak
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {c.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className={`bg-white p-3.5 rounded-2xl border transition shadow-xs flex flex-col justify-between space-y-2.5 text-xs ${
                          doc.status === 'verified'
                            ? 'border-emerald-300 ring-1 ring-emerald-100'
                            : doc.status === 'rejected'
                            ? 'border-red-300 ring-1 ring-red-100'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-bold text-slate-800 text-xs leading-snug">{doc.title}</span>
                            <span
                              className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase shrink-0 ${
                                doc.status === 'verified'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : doc.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {doc.status === 'verified' ? 'ACC VERIFIED' : doc.status === 'rejected' ? 'REVISI / TOLAK' : 'PENDING'}
                            </span>
                          </div>

                          <p className="text-[10px] font-mono text-slate-500 truncate mt-1">
                            📄 {doc.fileName || 'file_dokumen.pdf'}
                          </p>

                          {doc.notes && (
                            <div className="mt-1.5 p-2 bg-red-50 border border-red-200 rounded-lg text-[10px] text-red-900 leading-tight">
                              <strong>Catatan Revisi:</strong> {doc.notes}
                            </div>
                          )}
                        </div>

                        <div className="space-y-1.5 pt-1">
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewModalDoc({
                                candidateName: c.fullName,
                                docTitle: doc.title,
                                fileName: doc.fileName,
                                fileUrl: doc.fileUrl,
                                uploadedAt: doc.uploadedAt,
                                status: doc.status,
                                notes: doc.notes,
                              })
                            }
                            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-1.5 rounded-xl text-[11px] flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-slate-600" />
                            <span>Preview Dokumen</span>
                          </button>

                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setConfirmModal({
                                  isOpen: true,
                                  title: 'Setujui Dokumen Siswa?',
                                  description: `Apakah Anda yakin ingin menyetujui dokumen "${doc.title}" milik ${c.fullName}?`,
                                  confirmText: 'Ya, Setujui',
                                  variant: 'success',
                                  iconType: 'approve',
                                  onConfirm: () => verifyDocument(c.id, doc.id, 'verified'),
                                });
                              }}
                              className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-1.5 rounded-xl text-[10px] flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                            >
                              <Check className="w-3 h-3" />
                              <span>Setujui</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setRejectionModalDoc({
                                  candidateId: c.id,
                                  candidateName: c.fullName,
                                  docId: doc.id,
                                  docTitle: doc.title,
                                });
                                setRejectionNote(doc.notes || '');
                              }}
                              className="flex-1 bg-red-800 hover:bg-red-900 text-white font-bold py-1.5 rounded-xl text-[10px] flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                            >
                              <X className="w-3 h-3" />
                              <span>Tolak / Revisi</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: LOA APPROVAL (SUPER ADMIN) */}
      {activeTab === 'loa' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base font-serif">Persetujuan Penerbitan LoA Resmi</h3>
            <p className="text-xs text-slate-500">
              Persetujuan final dari Manajemen Prospect Education untuk menerbitkan Surat Keterangan Penerimaan (LoA) beserta penomoran sah.
            </p>
          </div>

          <div className="space-y-4">
            {safeCandidates.map((c) => {
              const hasLoa = !!c.loaNumber || c.status === 'loa_issued';
              const pStatus = c.payments && c.payments.length > 0 ? c.payments[0].paymentStatus : 'PENDING';
              return (
                <div key={c.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{c.fullName}</h4>
                    <p className="text-slate-500">
                      Reg: <span className="font-mono font-bold text-slate-800">{c.registrationNumber}</span> • Status Pembayaran:{' '}
                      <span className="font-bold text-emerald-700">{pStatus.toUpperCase()}</span>
                    </p>
                    {hasLoa && (
                      <p className="text-emerald-700 font-bold mt-1">
                        LoA Diterbitkan: {c.loaNumber || 'LOA/PE-JBR/2026/012'} ({c.loaIssueDate || '2026-06-20'})
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {hasLoa ? (
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-4 py-2 rounded-xl flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>LoA Sudah Terbit</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setConfirmModal({
                            isOpen: true,
                            title: 'Terbitkan LoA Digital Resmi?',
                            description: `Apakah Anda yakin ingin memberikan persetujuan final dan menerbitkan Surat Keterangan Penerimaan (LoA) resmi beserta penomoran sah untuk peserta ${c.fullName} (${c.registrationNumber})?`,
                            confirmText: 'Ya, Terbitkan LoA',
                            variant: 'success',
                            iconType: 'approve',
                            onConfirm: () => approveLoABySuperAdmin(c.id),
                          });
                        }}
                        className="bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-900 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition cursor-pointer"
                      >
                        Persetujuan & Terbitkan LoA Digital
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 4: FINANCIALS */}
      {activeTab === 'financials' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Form */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
              <h3 className="font-bold text-slate-900 text-base font-serif">Input Transaksi Kas Jember</h3>

              <form onSubmit={handleAddFinancial} className="space-y-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Keterangan Transaksi *</label>
                  <input
                    type="text"
                    required
                    value={finForm.description}
                    onChange={(e) => setFinForm({ ...finForm, description: e.target.value })}
                    placeholder="Pembayaran DP Pendaftaran Peserta A..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Jenis Transaksi *</label>
                    <select
                      value={finForm.type}
                      onChange={(e) => setFinForm({ ...finForm, type: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
                    >
                      <option value="income">Pemasukan (Income)</option>
                      <option value="expense">Pengeluaran (Expense)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Jumlah (Rp) *</label>
                    <input
                      type="number"
                      required
                      value={finForm.amount}
                      onChange={(e) => setFinForm({ ...finForm, amount: e.target.value })}
                      placeholder="3000000"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition shadow-xs"
                >
                  Simpan Catatan Transaksi
                </button>
              </form>
            </div>

            {/* Financial Chart */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base font-serif">Grafik Pendapatan Bulanan</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" h="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" textAnchor="end" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="pendapatan" fill="#991b1b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Transaction Table */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-base font-serif">Jurnal Transaksi Kas Terakhir</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500 uppercase">
                    <th className="p-3">Tanggal</th>
                    <th className="p-3">Keterangan</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Jenis</th>
                    <th className="p-3">Jumlah</th>
                    <th className="p-3">Petugas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {safeFinancials.map((f) => {
                    const dateStr = f.date || f.period || '2026-07-01';
                    const descStr = f.description || `Laporan Arus Kas (${f.period || 'Jember'})`;
                    const catStr = f.category || 'operasional';
                    const isIncome = f.type ? f.type === 'income' : (f.netCashFlow ? f.netCashFlow > 0 : true);
                    const amtVal = f.amount || f.totalRevenue || f.netCashFlow || 0;
                    return (
                      <tr key={f.id}>
                        <td className="p-3 font-mono text-slate-500">{dateStr}</td>
                        <td className="p-3 font-bold text-slate-900">{descStr}</td>
                        <td className="p-3 uppercase text-[10px] text-slate-500">{catStr}</td>
                        <td className="p-3 font-bold uppercase">
                          {isIncome ? (
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Pemasukan</span>
                          ) : (
                            <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded">Pengeluaran</span>
                          )}
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-900">
                          Rp {amtVal.toLocaleString('id-ID')}
                        </td>
                        <td className="p-3 text-slate-500">{f.recordedBy || 'Admin Jember'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 5: SUPER ADMIN SYSTEM CONTROL & USER MANAGEMENT */}
      {activeTab === 'users' && isSuperAdmin && <SuperAdminPanel />}

      {/* VIEW 6: INSTITUTION & DOCUMENT SETTINGS MODULE */}
      {activeTab === 'settings' && <InstitutionSettings />}

      {/* VIEW 7: WEBMASTER & WEBSITE FEATURE MANAGEMENT */}
      {activeTab === 'webmaster_features' && <WebmasterDashboard />}

      {/* VIEW 8: AUDIT ACTIVITY LOG */}
      {activeTab === 'audit_log' && <AuditActivityLog />}

      {/* VIEW 9: REALTIME ATTENDANCE MONITORING MODULE */}
      {activeTab === 'attendance_monitoring' && <AdminAttendanceMonitoring />}

      {/* VIEW 10: PROGRAM MANAGEMENT MODULE */}
      {activeTab === 'program_manager' && <AdminProgramManager />}

      {/* VIEW 11: LMS MODULE MANAGEMENT */}
      {activeTab === 'lms_manager' && <AdminLMSManager />}

      {/* VIEW 12: WEBSITE CONTENT & PUBLIC ANNOUNCEMENTS */}
      {activeTab === 'website_content' && <AdminWebsiteContentManager />}

      {/* VIEW 13: OFFICIAL CORRESPONDENCE & LETTERHEAD MANAGER */}
      {activeTab === 'correspondence' && <OfficialCorrespondenceManager />}

      {/* MODAL 1: ADD STUDENT (SUPER ADMIN) */}
      {isAddStudentModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 text-amber-900 rounded-xl">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base font-serif">Input Peserta Baru (Manual)</h3>
                  <p className="text-[11px] text-slate-500">Daftarkan kandidat siswa baru ke database sistem</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddStudentModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudentSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nama Lengkap Peserta *</label>
                <input
                  type="text"
                  required
                  value={newStudentForm.fullName}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, fullName: e.target.value })}
                  placeholder="Budi Santoso"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Email Utama *</label>
                  <input
                    type="email"
                    required
                    value={newStudentForm.email}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, email: e.target.value })}
                    placeholder="budi@gmail.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">No. WhatsApp / HP</label>
                  <input
                    type="text"
                    value={newStudentForm.phoneWA}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, phoneWA: e.target.value })}
                    placeholder="081234567890"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Program Tujuan *</label>
                <select
                  value={newStudentForm.selectedProgram}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, selectedProgram: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-semibold"
                >
                  <option value="S1_TAIWAN">Kuliah S1 Taiwan (IFP 1+4)</option>
                  <option value="TAIWAN_VOKASI">Taiwan 4+1 (4 Thn S1 + 1 Thn S2)</option>
                  <option value="MAGANG_JEPANG">Magang Jepang (IM Japan / Pemagangan)</option>
                  <option value="SSW_JEPANG">Kerja Jepang Tokutei Ginou (SSW)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddStudentModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2.5 rounded-xl shadow-md transition"
                >
                  Simpan Peserta Manual
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD LMS MODULE (SUPER ADMIN) */}
      {isAddLMSModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 text-blue-900 rounded-xl">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base font-serif">Tambah Modul Pembelajaran LMS</h3>
                  <p className="text-[11px] text-slate-500">Unggah materi persiapan bahasa & akademik baru</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddLMSModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLMSModuleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Judul Modul Pembelajaran *</label>
                <input
                  type="text"
                  required
                  value={newLmsForm.title}
                  onChange={(e) => setNewLmsForm({ ...newLmsForm, title: e.target.value })}
                  placeholder="Tata Bahasa N4 & Percakapan Kaiwa Percobaan 1"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Bahasa *</label>
                  <select
                    value={newLmsForm.language}
                    onChange={(e) => setNewLmsForm({ ...newLmsForm, language: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800"
                  >
                    <option value="Mandarin">🇹🇼 Mandarin Basic (Taiwan IFP 1+4)</option>
                    <option value="Inggris">🔤 Inggris Basic (Taiwan IFP 1+4)</option>
                    <option value="Jepang">🇯🇵 Jepang (JLPT / Tokutei Ginou)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Estimasi Durasi Belajar</label>
                  <input
                    type="text"
                    value={newLmsForm.duration}
                    onChange={(e) => setNewLmsForm({ ...newLmsForm, duration: e.target.value })}
                    placeholder="4 Minggu (16 Sesi)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Deskripsi Ringkas Modul</label>
                <textarea
                  rows={3}
                  value={newLmsForm.description}
                  onChange={(e) => setNewLmsForm({ ...newLmsForm, description: e.target.value })}
                  placeholder="Materi praktis mencakup video penjelasan tata bahasa, latihan percakapan harian, dan bank soal simulasi..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddLMSModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition"
                >
                  Terbitkan Modul LMS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD NEWS (SUPER ADMIN) */}
      {isAddNewsModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-900 rounded-xl">
                  <Newspaper className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base font-serif">Input Pengumuman / Berita Resmi</h3>
                  <p className="text-[11px] text-slate-500">Terbitkan pengumuman ke halaman publik & kabar pendaftaran</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddNewsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewsSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Judul Pengumuman *</label>
                <input
                  type="text"
                  required
                  value={newNewsForm.title}
                  onChange={(e) => setNewNewsForm({ ...newNewsForm, title: e.target.value })}
                  placeholder="Jadwal Pembekalan & Orientasi Peserta Gelombang 2 2026"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Kategori Berita</label>
                <select
                  value={newNewsForm.category}
                  onChange={(e) => setNewNewsForm({ ...newNewsForm, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800"
                >
                  <option value="Sistem & Pendaftaran">Sistem & Pendaftaran</option>
                  <option value="Beasiswa Taiwan">Beasiswa Taiwan</option>
                  <option value="Kelulusan & LoA">Kelulusan & LoA</option>
                  <option value="Info Magang Jepang">Info Magang Jepang</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Ringkasan Berita *</label>
                <textarea
                  rows={3}
                  required
                  value={newNewsForm.summary}
                  onChange={(e) => setNewNewsForm({ ...newNewsForm, summary: e.target.value })}
                  placeholder="Diberitahukan kepada seluruh calon peserta bahwa jadwal seleksi wawancara dan tes kemampuan..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddNewsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition"
                >
                  Terbitkan Berita Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL REVISI / PENOLAKAN DOKUMEN (TIM VERIFIKASI) */}
      {rejectionModalDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-red-800">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 text-base font-serif">Penyebab Penolakan & Revisi Dokumen</h3>
              </div>
              <button
                onClick={() => setRejectionModalDoc(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1">
              <p><strong>Nama Siswa:</strong> {rejectionModalDoc.candidateName}</p>
              <p><strong>Nama Dokumen:</strong> <span className="text-red-900 font-bold">{rejectionModalDoc.docTitle}</span></p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 block">Pilih Templat Alasan Penolakan Cepat:</label>
              <div className="grid grid-cols-1 gap-1.5 text-xs">
                {[
                  'Foto tidak memenuhi standar Taiwan: Wajib latar belakang PUTIH POLOS, foto berwarna 35x45mm, tanpa kacamata & telinga terlihat.',
                  'Ijazah / Transkrip Nilai belum dilampirkan terjemahan Bahasa Inggris resmi & cap legalisir.',
                  'Scan KTP / Kartu Pelajar / KK buram, terpotong, atau NIK tidak terbaca jelas.',
                  'Paspor RI aktif kurang dari 18 bulan dari estimasi keberangkatan.',
                  'File dokumen yang diunggah tidak sesuai dengan jenis persyaratan yang diminta.',
                  'Berkas tidak lengkap / halaman raport kurang.',
                ].map((template, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setRejectionNote(template)}
                    className="text-left bg-slate-100 hover:bg-red-50 hover:border-red-200 border border-slate-200 p-2 rounded-xl text-[11px] text-slate-800 font-medium transition cursor-pointer"
                  >
                    • {template}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-slate-800 block">Tuliskan Catatan Instruksi Revisi untuk Siswa *</label>
              <textarea
                rows={3}
                required
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
                placeholder="Tulis instruksi revisi secara spesifik..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRejectionModalDoc(null)}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!rejectionNote.trim()) {
                    alert('Mohon isi catatan atau alasan penolakan.');
                    return;
                  }
                  verifyDocument(rejectionModalDoc.candidateId, rejectionModalDoc.docId, 'rejected', rejectionNote);
                  setRejectionModalDoc(null);
                  setRejectionNote('');
                }}
                className="bg-red-800 hover:bg-red-900 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition cursor-pointer"
              >
                Kirim Penolakan & Notifikasi Siswa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PREVIEW DOKUMEN (TIM VERIFIKASI) */}
      {previewModalDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base font-serif">{previewModalDoc.docTitle}</h3>
                <p className="text-xs text-slate-500">
                  Siswa: <span className="font-bold text-slate-800">{previewModalDoc.candidateName}</span> • File: {previewModalDoc.fileName || 'dokumen.pdf'}
                </p>
              </div>
              <button
                onClick={() => setPreviewModalDoc(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-100 rounded-2xl p-6 border border-slate-200 text-center space-y-3 min-h-[220px] flex flex-col items-center justify-center">
              <FileText className="w-12 h-12 text-slate-400" />
              <div>
                <p className="font-bold text-slate-800 text-sm">{previewModalDoc.fileName || 'Preview File Digital'}</p>
                <p className="text-xs text-slate-500 mt-1">Status Verifikasi: <span className="uppercase font-mono font-bold text-red-800">{previewModalDoc.status}</span></p>
                {previewModalDoc.uploadedAt && <p className="text-[11px] text-slate-400">Diunggah pada: {previewModalDoc.uploadedAt}</p>}
              </div>
              <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
                File siap diperiksa Tim Verifikasi Prospect Jember
              </span>
            </div>

            {previewModalDoc.notes && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900">
                <strong>Catatan Revisi Terakhir:</strong> {previewModalDoc.notes}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPreviewModalDoc(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Pendaftaran User Pending */}
      {selectedPendingUserForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-[#092852] to-[#0F3D7A] p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/20 rounded-xl border border-amber-400/30 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-bold text-lg font-serif">{selectedPendingUserForDetail.fullName}</h3>
                  <p className="text-xs text-amber-300 font-mono">
                    No. Reg: {selectedPendingUserForDetail.registrationNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPendingUserForDetail(null)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">NIK KTP</span>
                  <span className="font-bold font-mono text-slate-800 dark:text-slate-200">
                    {selectedPendingUserForDetail.biodata?.nik || '-'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Program Pilihan</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {selectedPendingUserForDetail.selectedProgram}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Email Terdaftar</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedPendingUserForDetail.email}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">No. WhatsApp</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedPendingUserForDetail.biodata?.phoneWA || '-'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Pendidikan Terakhir</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedPendingUserForDetail.biodata?.education || '-'} ({selectedPendingUserForDetail.biodata?.major || '-'})
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Orang Tua / Wali</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedPendingUserForDetail.biodata?.parentName || '-'} ({selectedPendingUserForDetail.biodata?.parentPhone || '-'})
                  </span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200">
                <strong>Status Pendaftaran:</strong> Menunggu persetujuan Admin Cabang Jember. Klik tombol di bawah untuk mengaktifkan akun pendaftar ini.
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedPendingUserForDetail(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-bold text-xs cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => handleApproveUser(selectedPendingUserForDetail)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Setujui & Aktifkan Akun</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Confirmation Alert Modal */}
      <ConfirmActionModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        description={confirmModal.description}
        confirmText={confirmModal.confirmText}
        variant={confirmModal.variant}
        iconType={confirmModal.iconType}
      />

      {/* Official Executive Admin PDF Report Modal */}
      <AdminPDFReportModal
        isOpen={isPdfReportModalOpen}
        onClose={() => setIsPdfReportModalOpen(false)}
        candidates={safeCandidates}
        financials={financials}
      />

      {/* LoA Dynamic QR Code Document Verification Modal */}
      <LoaVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        candidates={safeCandidates}
      />

      {/* WhatsApp Gateway Integration Modal */}
      <WhatsAppGatewayModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        config={whatsappConfig}
        onSaveConfig={updateWhatsAppConfig}
        candidates={safeCandidates}
      />

      {/* Email Gateway Notification Integration Modal */}
      <EmailGatewayModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        config={emailConfig}
        onSaveConfig={updateEmailConfig}
        candidates={safeCandidates}
      />
    </div>
  );
};
