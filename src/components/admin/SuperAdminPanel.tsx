import React, { useState } from 'react';
import { ConfirmActionModal } from './ConfirmActionModal';
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Edit3,
  Trash2,
  Settings,
  Sliders,
  Eye,
  FileCheck,
  Lock,
  Unlock,
  Search,
  Filter,
  Clock,
  Plus,
  RefreshCw,
  Power,
  Globe,
  CreditCard,
  AlertTriangle,
  Activity,
  Check,
  X,
  ChevronRight,
  Database,
  Layers,
  Award,
} from 'lucide-react';
import { UserRole, Candidate } from '../../types';
import { useApp } from '../../context/AppContext';
import { WebmasterDashboard } from '../webmaster/WebmasterDashboard';

export interface ManagedUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  phone: string;
  status: 'active' | 'suspended' | 'pending';
  branchLocation: string; // e.g. "Pusat Jakarta", "Cabang Jember", etc.
  createdAt: string;
  lastLogin?: string;
}

export interface SystemAuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  actionType: 'USER_CREATE' | 'USER_DELETE' | 'ROLE_CHANGE' | 'SETTING_UPDATE' | 'CONTENT_APPROVE' | 'SYSTEM_RESET';
  details: string;
  ipAddress: string;
}

export interface PendingContentApproval {
  id: string;
  contentType: 'Pengumuman / Berita' | 'Modul LMS' | 'Update Tarif Program' | 'Draft LoA Baru';
  title: string;
  submittedBy: string;
  branch: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  previewDetails: string;
}

export const SuperAdminPanel: React.FC = () => {
  const { candidates = [], registerCandidate, currentRole } = useApp();

  // Primary active tab inside SuperAdminPanel
  const [subTab, setSubTab] = useState<'users' | 'settings' | 'approvals' | 'webmaster' | 'audit_logs'>('users');

  // --- 1. USER MANAGEMENT STATE ---
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [userSearch, setUserSearch] = useState<string>('');

  const [managedUsers, setManagedUsers] = useState<ManagedUser[]>([
    {
      id: 'usr-001',
      fullName: 'Dr. Hendra Wijaya, M.Ed.',
      email: 'superadmin@prospect.co.id',
      role: 'superadmin',
      phone: '081198765432',
      status: 'active',
      branchLocation: 'Kantor Pusat Jakarta',
      createdAt: '2025-01-01',
      lastLogin: 'Baru Saja',
    },
    {
      id: 'usr-002',
      fullName: "Ahmad Syafi'i, S.Pd.",
      email: 'admin.jember@prospect.co.id',
      role: 'admin',
      phone: '085234567890',
      status: 'active',
      branchLocation: 'Cabang Jember',
      createdAt: '2025-02-15',
      lastLogin: '10 menit lalu',
    },
    {
      id: 'usr-003',
      fullName: 'Bambang Soesilo (Investor)',
      email: 'bambang.investor@prospect.co.id',
      role: 'investor',
      phone: '081299887766',
      status: 'active',
      branchLocation: 'Mitra Pemodal Jember',
      createdAt: '2025-03-01',
      lastLogin: '2 jam lalu',
    },
    {
      id: 'usr-004',
      fullName: 'Budi Santoso (Siswa)',
      email: 'budi.santoso@gmail.com',
      role: 'student',
      phone: '081234567890',
      status: 'active',
      branchLocation: 'Peserta Cabang Jember',
      createdAt: '2026-07-10',
      lastLogin: '1 hari lalu',
    },
    {
      id: 'usr-005',
      fullName: 'Siti Rahmawati (Siswa)',
      email: 'siti.rahma@yahoo.com',
      role: 'student',
      phone: '089876543210',
      status: 'active',
      branchLocation: 'Peserta Cabang Jember',
      createdAt: '2026-07-12',
      lastLogin: '3 jam lalu',
    },
  ]);

  // Modals for CRUD users
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [userFormData, setUserFormData] = useState({
    fullName: '',
    email: '',
    role: 'student' as UserRole,
    phone: '',
    branchLocation: 'Cabang Jember',
    status: 'active' as 'active' | 'suspended' | 'pending',
  });

  // --- 2. GLOBAL SYSTEM SETTINGS STATE ---
  const [sysSettings, setSysSettings] = useState({
    siteTitle: 'Prospect Education Global & Cabang Jember',
    contactEmail: 'info@prospect.co.id',
    contactPhone: '+62 852-3456-7890',
    registrationOpen: true,
    maintenanceMode: false,
    requireSuperAdminLoaApproval: true,
    autoVerifyPaymentThreshold: 5000000,
    paymentGatewayMode: 'sandbox' as 'sandbox' | 'production',
    allowStudentDirectRegistration: true,
  });

  // --- 3. APPROVAL & AUDIT LOGS STATE ---
  const [pendingApprovals, setPendingApprovals] = useState<PendingContentApproval[]>([
    {
      id: 'appr-01',
      contentType: 'Pengumuman / Berita',
      title: 'Pembukaan Pendaftaran Gelombang II 2026 Cabang Jember',
      submittedBy: "Ahmad Syafi'i (Admin Jember)",
      branch: 'Cabang Jember',
      submittedAt: '2026-07-23 14:30',
      status: 'pending',
      previewDetails: 'Rincian jadwal tes wawancara dan potongan biaya pendaftaran awal sebesar 10% untuk 15 pendaftar pertama.',
    },
    {
      id: 'appr-02',
      contentType: 'Modul LMS',
      title: 'Modul Percakapan Kaiwa Lanjutan (Level N4)',
      submittedBy: 'Tim Instruktur LMS',
      branch: 'Pusat Academic',
      submittedAt: '2026-07-23 10:15',
      status: 'pending',
      previewDetails: '20 video latihan simulasi mensetsu kerja Jepang dan kuis tata bahasa dasar.',
    },
    {
      id: 'appr-03',
      contentType: 'Update Tarif Program',
      title: 'Penyesuaian Biaya Program Magang Kuliah Taiwan 4+1',
      submittedBy: 'Keuangan Jember',
      branch: 'Cabang Jember',
      submittedAt: '2026-07-22 18:00',
      status: 'pending',
      previewDetails: 'Penyesuaian estimasi biaya visa dan pemeriksaan medis dari Rp 28,500,000 menjadi Rp 29,000,000.',
    },
  ]);

  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>([
    {
      id: 'log-101',
      timestamp: '2026-07-23 22:14:05',
      actorName: 'Super Admin Pusat',
      actorRole: 'superadmin',
      actionType: 'ROLE_CHANGE',
      details: 'Mengubah otorisasi pengguna admin.jember@prospect.co.id menjadi Admin Cabang Verified',
      ipAddress: '180.252.12.98',
    },
    {
      id: 'log-102',
      timestamp: '2026-07-23 20:30:12',
      actorName: 'Super Admin Pusat',
      actorRole: 'superadmin',
      actionType: 'CONTENT_APPROVE',
      details: 'Menyetujui penerbitan Surat LoA Resmi No. PROSPECT/LOA/2026/001',
      ipAddress: '180.252.12.98',
    },
    {
      id: 'log-103',
      timestamp: '2026-07-23 16:45:00',
      actorName: "Ahmad Syafi'i (Admin Jember)",
      actorRole: 'admin',
      actionType: 'USER_CREATE',
      details: 'Mendaftarkan kandidat peserta baru Budi Santoso (Program Kuliah S1 Taiwan)',
      ipAddress: '114.122.45.101',
    },
  ]);

  // --- CONFIRMATION MODAL STATE ---
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

  // --- HANDLERS ---
  const handleOpenCreateUser = () => {
    setEditingUser(null);
    setUserFormData({
      fullName: '',
      email: '',
      role: 'student',
      phone: '',
      branchLocation: 'Cabang Jember',
      status: 'active',
    });
    setIsUserModalOpen(true);
  };

  const handleOpenEditUser = (u: ManagedUser) => {
    setEditingUser(u);
    setUserFormData({
      fullName: u.fullName,
      email: u.email,
      role: u.role,
      phone: u.phone,
      branchLocation: u.branchLocation,
      status: u.status,
    });
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userFormData.fullName || !userFormData.email) return;

    if (editingUser) {
      // Update
      setManagedUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                fullName: userFormData.fullName,
                email: userFormData.email,
                role: userFormData.role,
                phone: userFormData.phone,
                branchLocation: userFormData.branchLocation,
                status: userFormData.status,
              }
            : u
        )
      );

      addAuditLog('ROLE_CHANGE', `Memperbarui data & hak akses pengguna: ${userFormData.email} (${userFormData.role})`);
    } else {
      // Create new
      const newUser: ManagedUser = {
        id: `usr-${Date.now()}`,
        fullName: userFormData.fullName,
        email: userFormData.email,
        role: userFormData.role,
        phone: userFormData.phone || '081234567890',
        status: userFormData.status,
        branchLocation: userFormData.branchLocation,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setManagedUsers([newUser, ...managedUsers]);

      // If student, sync with AppContext candidate
      if (userFormData.role === 'student') {
        registerCandidate({
          fullName: userFormData.fullName,
          email: userFormData.email,
          phoneWA: userFormData.phone,
          selectedProgram: 'S1_TAIWAN' as any,
        });
      }

      addAuditLog('USER_CREATE', `Super Admin membuat akun pengguna baru: ${userFormData.email} [Role: ${userFormData.role}]`);
    }

    setIsUserModalOpen(false);
  };

  const handleDeleteUser = (id: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Akun Pengguna?',
      description: (
        <span>
          Apakah Super Admin yakin ingin menghapus akun pengguna <strong>"{name}"</strong> secara permanen? Akses pengguna ini akan dicabut sepenuhnya.
        </span>
      ),
      confirmText: 'Ya, Hapus Akun',
      variant: 'danger',
      iconType: 'trash',
      onConfirm: () => {
        setManagedUsers((prev) => prev.filter((u) => u.id !== id));
        addAuditLog('USER_DELETE', `Super Admin menghapus akun pengguna: ${name} (ID: ${id})`);
      },
    });
  };

  const handleToggleUserStatus = (id: string) => {
    const targetUser = managedUsers.find((u) => u.id === id);
    if (!targetUser) return;
    const isSuspending = targetUser.status === 'active';

    setConfirmModal({
      isOpen: true,
      title: isSuspending ? 'Bekukan Akun Pengguna?' : 'Aktifkan Kembali Akun?',
      description: `Apakah Anda yakin ingin ${isSuspending ? 'membekukan (suspend)' : 'mengaktifkan kembali'} akses akun ${targetUser.email}?`,
      confirmText: isSuspending ? 'Ya, Bekukan Akun' : 'Ya, Aktifkan Akun',
      variant: isSuspending ? 'warning' : 'success',
      iconType: isSuspending ? 'alert' : 'approve',
      onConfirm: () => {
        setManagedUsers((prev) =>
          prev.map((u) => {
            if (u.id === id) {
              const nextStatus = u.status === 'active' ? 'suspended' : 'active';
              addAuditLog('ROLE_CHANGE', `Mengubah status akun ${u.email} menjadi ${nextStatus}`);
              return { ...u, status: nextStatus };
            }
            return u;
          })
        );
      },
    });
  };

  const handleApproveContent = (id: string, isApproved: boolean) => {
    const targetContent = pendingApprovals.find((item) => item.id === id);
    if (!targetContent) return;

    setConfirmModal({
      isOpen: true,
      title: isApproved ? 'Setujui Publikasi Konten?' : 'Tolak Publikasi Konten?',
      description: `Apakah Super Admin yakin ingin ${isApproved ? 'MENYETUJUI' : 'MENOLAK'} penerbitan konten "${targetContent.title}"?`,
      confirmText: isApproved ? 'Ya, Setujui Konten' : 'Ya, Tolak Konten',
      variant: isApproved ? 'success' : 'danger',
      iconType: isApproved ? 'approve' : 'reject',
      onConfirm: () => {
        setPendingApprovals((prev) =>
          prev.map((item) => {
            if (item.id === id) {
              const nextStatus = isApproved ? 'approved' : 'rejected';
              addAuditLog(
                'CONTENT_APPROVE',
                `Super Admin ${isApproved ? 'MENYETUJUI' : 'MENOLAK'} konten: "${item.title}" (${item.contentType})`
              );
              return { ...item, status: nextStatus };
            }
            return item;
          })
        );
      },
    });
  };

  const handleSaveSystemSettings = (e: React.FormEvent) => {
    e.preventDefault();
    addAuditLog('SETTING_UPDATE', 'Memperbarui Konfigurasi Sistem Global Super Admin & Gateway Payment');
    alert('[SUPER ADMIN] Konfigurasi sistem global berhasil disimpan dan diterapkan!');
  };

  const addAuditLog = (actionType: SystemAuditLog['actionType'], details: string) => {
    const newLog: SystemAuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actorName: 'Super Admin Utama',
      actorRole: 'superadmin',
      actionType,
      details,
      ipAddress: '180.252.12.98 (Verified)',
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const filteredUsers = managedUsers.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Super Admin Top Hero Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3.5 py-1 rounded-full text-xs font-black tracking-wide uppercase">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>SISTEM MANAJEMEN PUSAT & OTORITAS FINAL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-serif tracking-tight text-white">
              Super Admin Control Panel
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              Otoritas tertinggi pengelolaan akun (Siswa, Admin Cabang, Investor), pengaturan variabel sistem global, persetujuan konten publik, serta audit log keamanan platform.
            </p>
          </div>

          {/* Metrics summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto shrink-0">
            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl text-center">
              <span className="text-xl font-black text-amber-400 font-mono">{managedUsers.length}</span>
              <p className="text-[10px] font-bold uppercase text-slate-400 mt-0.5">Total Pengguna</p>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl text-center">
              <span className="text-xl font-black text-emerald-400 font-mono">
                {pendingApprovals.filter((a) => a.status === 'pending').length}
              </span>
              <p className="text-[10px] font-bold uppercase text-slate-400 mt-0.5">Persetujuan Pending</p>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl text-center col-span-2 sm:col-span-1">
              <span className="text-xl font-black text-blue-400 font-mono">100%</span>
              <p className="text-[10px] font-bold uppercase text-slate-400 mt-0.5">Status Sistem Global</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={() => setSubTab('users')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            subTab === 'users'
              ? 'bg-slate-950 text-amber-400 shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Kelola Pengguna (Users CRUD)</span>
        </button>

        <button
          onClick={() => setSubTab('settings')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            subTab === 'settings'
              ? 'bg-slate-950 text-amber-400 shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Pengaturan Sistem Global</span>
        </button>

        <button
          onClick={() => setSubTab('webmaster')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            subTab === 'webmaster'
              ? 'bg-indigo-950 text-indigo-300 shadow-sm font-black'
              : 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Pengelola Website & Fitur</span>
        </button>

        <button
          onClick={() => setSubTab('approvals')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 relative ${
            subTab === 'approvals'
              ? 'bg-slate-950 text-amber-400 shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Persetujuan Konten</span>
          {pendingApprovals.filter((a) => a.status === 'pending').length > 0 && (
            <span className="bg-red-500 text-white font-extrabold text-[10px] px-1.5 py-0.2 rounded-full">
              {pendingApprovals.filter((a) => a.status === 'pending').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setSubTab('audit_logs')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            subTab === 'audit_logs'
              ? 'bg-slate-950 text-amber-400 shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Audit Log Keamanan</span>
        </button>
      </div>

      {/* --- SUBTAB 1: USER MANAGEMENT (CRUD) --- */}
      {subTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base font-serif">
                Manajemen Seluruh Akun Pengguna System
              </h3>
              <p className="text-xs text-slate-500">
                Tambah, ubah role, bekukan (suspend), atau hapus akun Siswa, Admin Cabang Operasional, dan Investor.
              </p>
            </div>

            <button
              onClick={handleOpenCreateUser}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs transition shadow-sm flex items-center gap-2 shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Buat Akun Baru</span>
            </button>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {['all', 'student', 'admin', 'investor', 'superadmin'].map((roleKey) => (
                <button
                  key={roleKey}
                  onClick={() => setUserRoleFilter(roleKey)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition capitalize ${
                    userRoleFilter === roleKey
                      ? 'bg-slate-900 text-amber-400 font-extrabold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {roleKey === 'all'
                    ? 'Semua Role'
                    : roleKey === 'student'
                    ? 'Siswa / Kandidat'
                    : roleKey === 'admin'
                    ? 'Admin Cabang'
                    : roleKey === 'investor'
                    ? 'Investor'
                    : 'Super Admin'}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Cari nama / email..."
                className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 rounded-xl text-xs text-slate-800"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-3">Pengguna & Email</th>
                  <th className="p-3">Hak Akses (Role)</th>
                  <th className="p-3">Cabang / Mitra</th>
                  <th className="p-3">No. HP</th>
                  <th className="p-3">Status Akun</th>
                  <th className="p-3 text-right">Tindakan Otoritas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{u.fullName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{u.email}</div>
                    </td>

                    <td className="p-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          u.role === 'superadmin'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : u.role === 'admin'
                            ? 'bg-blue-100 text-blue-900 border border-blue-200'
                            : u.role === 'investor'
                            ? 'bg-purple-100 text-purple-900 border border-purple-200'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                        }`}
                      >
                        {u.role === 'superadmin'
                          ? 'Super Admin'
                          : u.role === 'admin'
                          ? 'Admin Cabang'
                          : u.role === 'investor'
                          ? 'Investor / Pemodal'
                          : 'Siswa / Candidate'}
                      </span>
                    </td>

                    <td className="p-3 font-semibold text-slate-700">{u.branchLocation}</td>

                    <td className="p-3 font-mono text-slate-600">{u.phone}</td>

                    <td className="p-3">
                      <button
                        onClick={() => handleToggleUserStatus(u.id)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {u.status === 'active' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" /> Suspended
                          </>
                        )}
                      </button>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditUser(u)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                          title="Edit Data / Role Pengguna"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {u.role !== 'superadmin' && (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.fullName)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                            title="Hapus Akun Permanen"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- SUBTAB 2: GLOBAL SYSTEM SETTINGS --- */}
      {subTab === 'settings' && (
        <form onSubmit={handleSaveSystemSettings} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base font-serif">Konfigurasi Parameter Sistem Global</h3>
            <p className="text-xs text-slate-500">Atur setelan pendaftaran, gateway pembayaran, mode pemeliharaan, dan persyaratan otorisasi.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* System Info */}
            <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-900 font-serif text-sm border-b border-slate-200 pb-2">Identitas & Kontak Platform</h4>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nama Lembaga / Platform</label>
                <input
                  type="text"
                  value={sysSettings.siteTitle}
                  onChange={(e) => setSysSettings({ ...sysSettings, siteTitle: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Email Helpdesk Utama</label>
                  <input
                    type="email"
                    value={sysSettings.contactEmail}
                    onChange={(e) => setSysSettings({ ...sysSettings, contactEmail: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Hotline WA Operasional</label>
                  <input
                    type="text"
                    value={sysSettings.contactPhone}
                    onChange={(e) => setSysSettings({ ...sysSettings, contactPhone: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Registration & Payment Controls */}
            <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-900 font-serif text-sm border-b border-slate-200 pb-2">Otorisasi & Payment Gateway</h4>

              <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-900 block">Persetujuan Super Admin untuk LoA</span>
                  <span className="text-[11px] text-slate-500">Wajib verifikasi ttd direksi sebelum LoA terbit untuk siswa.</span>
                </div>
                <input
                  type="checkbox"
                  checked={sysSettings.requireSuperAdminLoaApproval}
                  onChange={(e) => setSysSettings({ ...sysSettings, requireSuperAdminLoaApproval: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                <div>
                  <span className="font-bold text-slate-900 block">Status Portal Pendaftaran Siswa Baru</span>
                  <span className="text-[11px] text-slate-500">Izinkan calon siswa membuat akun pendaftaran mandiri.</span>
                </div>
                <input
                  type="checkbox"
                  checked={sysSettings.registrationOpen}
                  onChange={(e) => setSysSettings({ ...sysSettings, registrationOpen: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Mode Environment Midtrans Payment</label>
                <select
                  value={sysSettings.paymentGatewayMode}
                  onChange={(e) => setSysSettings({ ...sysSettings, paymentGatewayMode: e.target.value as any })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 font-semibold"
                >
                  <option value="sandbox">Sandbox / Testing (Simulasi)</option>
                  <option value="production">Production Live Payment</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="bg-slate-950 hover:bg-slate-900 text-amber-400 font-extrabold px-6 py-3 rounded-2xl shadow-md transition text-xs flex items-center gap-2 border border-amber-500/30"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Simpan & Terapkan Konfigurasi Global</span>
            </button>
          </div>
        </form>
      )}

      {/* --- SUBTAB 3: CONTENT APPROVAL QUEUE --- */}
      {subTab === 'approvals' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base font-serif">Antrean Persetujuan Konten & Perubahan Data</h3>
            <p className="text-xs text-slate-500">Verifikasi dan setujui draft pengumuman, modul LMS baru, atau pembaruan biaya dari admin cabang sebelum dipublikasikan ke siswa.</p>
          </div>

          <div className="space-y-4">
            {pendingApprovals.map((item) => (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all ${
                  item.status === 'pending'
                    ? 'bg-amber-50/50 border-amber-300'
                    : item.status === 'approved'
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-red-50/40 border-red-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-950 text-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                        {item.contentType}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">{item.branch}</span>
                      <span className="text-[11px] text-slate-400 font-mono">• {item.submittedAt}</span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm font-serif">{item.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">{item.previewDetails}</p>

                    <p className="text-[11px] font-semibold text-slate-500">
                      Diajukan oleh: <span className="text-slate-800 font-bold">{item.submittedBy}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleApproveContent(item.id, false)}
                          className="bg-white hover:bg-red-50 text-red-600 border border-red-200 font-bold px-3.5 py-2 rounded-xl text-xs transition"
                        >
                          Tolak Draft
                        </button>
                        <button
                          onClick={() => handleApproveContent(item.id, true)}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-xs flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>Setujui & Terbitkan</span>
                        </button>
                      </>
                    ) : (
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-xl ${
                          item.status === 'approved' ? 'bg-emerald-200 text-emerald-900' : 'bg-red-200 text-red-900'
                        }`}
                      >
                        {item.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- SUBTAB WEBMASTER: WEBMASTER DASHBOARD & FITUR WEBSITE --- */}
      {subTab === 'webmaster' && <WebmasterDashboard />}

      {/* --- SUBTAB 4: AUDIT LOGS --- */}
      {subTab === 'audit_logs' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base font-serif">Audit Log Aktivitas Keamanan Sistem</h3>
            <p className="text-xs text-slate-500">Rekam jejak digital tindakan administratif super admin dan admin operasional cabang.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-3">Waktu & IP Address</th>
                  <th className="p-3">Aktor (Petugas)</th>
                  <th className="p-3">Tipe Aktivitas</th>
                  <th className="p-3">Rincian Perubahan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{log.timestamp}</div>
                      <div className="text-slate-400 text-[10px]">{log.ipAddress}</div>
                    </td>

                    <td className="p-3 font-sans">
                      <span className="font-bold text-slate-900 block">{log.actorName}</span>
                      <span className="text-[10px] text-slate-500 uppercase">{log.actorRole}</span>
                    </td>

                    <td className="p-3">
                      <span className="bg-slate-900 text-amber-400 font-bold px-2 py-0.5 rounded text-[10px]">
                        {log.actionType}
                      </span>
                    </td>

                    <td className="p-3 font-sans text-slate-700">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT USER */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 text-amber-900 rounded-xl">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base font-serif">
                    {editingUser ? 'Edit Hak Akses Pengguna' : 'Tambah Pengguna Baru'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Kelola kredensial dan kewenangan akun</p>
                </div>
              </div>
              <button onClick={() => setIsUserModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nama Lengkap Pengguna *</label>
                <input
                  type="text"
                  required
                  value={userFormData.fullName}
                  onChange={(e) => setUserFormData({ ...userFormData, fullName: e.target.value })}
                  placeholder="Drs. M. Soetomo"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Email Akun *</label>
                  <input
                    type="email"
                    required
                    value={userFormData.email}
                    onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                    placeholder="user@prospect.co.id"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">No. WhatsApp / Telp</label>
                  <input
                    type="text"
                    value={userFormData.phone}
                    onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
                    placeholder="081234567890"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Hak Akses (Role) *</label>
                  <select
                    value={userFormData.role}
                    onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value as UserRole })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-bold"
                  >
                    <option value="student">Siswa / Candidate</option>
                    <option value="admin">Admin Cabang Operasional</option>
                    <option value="investor">Investor / Pemodal</option>
                    <option value="superadmin">Super Admin (Direksi Pusat)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Cabang / Wilayah Mitra</label>
                  <input
                    type="text"
                    value={userFormData.branchLocation}
                    onChange={(e) => setUserFormData({ ...userFormData, branchLocation: e.target.value })}
                    placeholder="Cabang Jember"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Status Keaktifan Akun</label>
                <select
                  value={userFormData.status}
                  onChange={(e) => setUserFormData({ ...userFormData, status: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-semibold"
                >
                  <option value="active">Active (Dapat Login)</option>
                  <option value="suspended">Suspended (Dibekukan)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2.5 rounded-xl shadow-md transition"
                >
                  {editingUser ? 'Simpan Perubahan' : 'Buat Akun'}
                </button>
              </div>
            </form>
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
    </div>
  );
};
