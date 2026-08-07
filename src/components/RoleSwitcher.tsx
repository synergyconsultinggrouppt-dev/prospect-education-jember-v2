import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  ShieldAlert,
  User,
  ShieldCheck,
  Crown,
  LineChart,
  Sparkles,
  Globe,
  Info,
  X,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Lock,
  Eye,
  Key,
  Users,
  FileText,
  CreditCard,
  Award,
  BookOpen,
  Settings,
  PieChart,
} from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { currentRole, setRole, candidates, currentCandidateId, setCurrentCandidateId, t, openLoginModal, currentUserSession } = useApp();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHidden, setIsHidden] = useState(() => {
    return localStorage.getItem('hide_role_switcher') === 'true';
  });
  const [showMatrixModal, setShowMatrixModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleHideSwitcher = (hidden: boolean) => {
    setIsHidden(hidden);
    localStorage.setItem('hide_role_switcher', hidden ? 'true' : 'false');
  };

  const roles: {
    id: UserRole;
    label: string;
    icon: React.ReactNode;
    color: string;
    badgeBg: string;
    desc: string;
    accessScope: string[];
  }[] = [
    {
      id: 'visitor',
      label: 'Public / Pengunjung',
      icon: <User className="w-3.5 h-3.5" aria-hidden="true" />,
      color: 'bg-slate-700 text-white',
      badgeBg: 'bg-slate-800 text-slate-200 border-slate-700',
      desc: 'Halaman publik, profil LKP & Konsultan, berita, galeri, & formulir pendaftaran online.',
      accessScope: ['Company Profile', 'Program Taiwan & Jepang', 'Formulir Pendaftaran', 'FAQ & Kontak'],
    },
    {
      id: 'student',
      label: 'Peserta / Student',
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-300" aria-hidden="true" />,
      color: 'bg-[#0F3D7A] text-white',
      badgeBg: 'bg-[#092852] text-amber-300 border-blue-800',
      desc: 'Portal peserta: kelola biodata, upload berkas, bayar biaya, unduh LoA, & akses LMS.',
      accessScope: ['Portal Peserta', 'Upload Dokumen', 'Kuitansi Pembayaran', 'Letter of Acceptance (LoA)', 'LMS Pembelajaran'],
    },
    {
      id: 'admin',
      label: 'Admin Operasional',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" aria-hidden="true" />,
      color: 'bg-emerald-800 text-white',
      badgeBg: 'bg-emerald-950 text-emerald-300 border-emerald-800',
      desc: 'Verifikasi berkas pendaftar, konfirmasi pembayaran, & kelola modul LMS.',
      accessScope: ['Verifikasi Berkas', 'Konfirmasi Pembayaran', 'Kelola Materi LMS', 'Status Seleksi Peserta'],
    },
    {
      id: 'webmaster',
      label: 'Pengelola Website',
      icon: <Globe className="w-3.5 h-3.5 text-indigo-300" aria-hidden="true" />,
      color: 'bg-indigo-900 text-white',
      badgeBg: 'bg-indigo-950 text-indigo-300 border-indigo-800',
      desc: 'Kelola tim webmaster, fitur aktif website, berita, galeri, & pengaturan SEO.',
      accessScope: ['Pengelola Website', 'Toggle Fitur Web', 'Editor Berita & Galeri', 'Pengaturan SEO & Kontak'],
    },
    {
      id: 'superadmin',
      label: 'Super Admin',
      icon: <Crown className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />,
      color: 'bg-amber-900 text-white',
      badgeBg: 'bg-amber-950 text-amber-300 border-amber-800',
      desc: 'Hak akses penuh: persetujuan LoA final, manajemen pengguna, keuangan, & audit log.',
      accessScope: ['Hak Akses Penuh (Root)', 'Persetujuan LoA Final', 'Manajemen Pengguna & Role', 'Audit Log & Keuangan'],
    },
    {
      id: 'investor',
      label: 'Investor / Pemodal',
      icon: <LineChart className="w-3.5 h-3.5 text-blue-300" aria-hidden="true" />,
      color: 'bg-blue-900 text-white',
      badgeBg: 'bg-blue-950 text-blue-300 border-blue-800',
      desc: 'Portal investor: grafik pendapatan LKP, cash flow, biaya operasional, & ROI.',
      accessScope: ['Laporan Keuangan LKP', 'Grafik Revenue & Cash Flow', 'Proyeksi Imbal Hasil (ROI)', 'Daftar Mitra Kampus'],
    },
  ];

  const handleRoleChange = (roleId: UserRole, roleName: string) => {
    if (roleId === 'visitor') {
      setRole('visitor');
      setToastMessage('Mode kembali ke Tampilan Publik');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    // Require Login if user session is not authenticated for this role
    if (!currentUserSession || currentUserSession.role !== roleId) {
      openLoginModal(roleId);
      setToastMessage(`🔒 Masukkan Kata Sandi untuk mengakses Role '${roleName}'`);
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }

    setRole(roleId);
    setToastMessage(`Hak akses diverifikasi untuk: ${roleName}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const activeRoleInfo = roles.find((r) => r.id === currentRole) || roles[0];

  if (isHidden) {
    return (
      <>
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => toggleHideSwitcher(false)}
            title="Klik untuk memilih hak akses (RBAC)"
            className="flex items-center gap-2 bg-slate-900/95 hover:bg-slate-950 text-amber-300 hover:text-white border border-amber-500/50 px-3 py-2 rounded-full shadow-2xl backdrop-blur-md text-xs font-bold transition transform hover:scale-105 cursor-pointer group"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
            <span>Akses Aktif: <strong className="text-white">{activeRoleInfo.label}</strong></span>
          </button>
        </div>

        {/* Permission Matrix Modal (accessible even if hidden if invoked) */}
        {showMatrixModal && (
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowMatrixModal(false);
            }}
            className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          >
            <div className="bg-slate-900 text-slate-100 rounded-3xl border border-slate-700 max-w-4xl w-full max-h-[88vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl my-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
                    <Key className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-amber-300">Matriks Hak Akses Pengguna (RBAC)</h2>
                    <p className="text-xs text-slate-400">Arsitektur Keamanan & Otorisasi Sistem Prospect Jember</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMatrixModal(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition"
                  aria-label="Tutup modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Permission Matrix Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950 text-slate-300 border-b border-slate-800">
                      <th className="p-3">Modul / Fitur</th>
                      <th className="p-3 text-center">Public</th>
                      <th className="p-3 text-center">Peserta</th>
                      <th className="p-3 text-center">Admin Jember</th>
                      <th className="p-3 text-center">Super Admin</th>
                      <th className="p-3 text-center">Investor</th>
                      <th className="p-3 text-center">Webmaster</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr>
                      <td className="p-3 font-medium text-slate-200">Company Profile & Taiwan/Jepang</td>
                      <td className="p-3 text-center text-emerald-400">✓ View</td>
                      <td className="p-3 text-center text-emerald-400">✓ View</td>
                      <td className="p-3 text-center text-emerald-400">✓ View</td>
                      <td className="p-3 text-center text-emerald-400">✓ Full</td>
                      <td className="p-3 text-center text-emerald-400">✓ View</td>
                      <td className="p-3 text-center text-emerald-400">✓ Edit</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-slate-200">Pendaftaran Online & Upload Berkas</td>
                      <td className="p-3 text-center text-emerald-400">✓ Daftar</td>
                      <td className="p-3 text-center text-emerald-400">✓ Kelola</td>
                      <td className="p-3 text-center text-emerald-400">✓ Verifikasi</td>
                      <td className="p-3 text-center text-emerald-400">✓ Full</td>
                      <td className="p-3 text-center text-slate-600">✕</td>
                      <td className="p-3 text-center text-slate-600">✕</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-slate-200">LMS & Modul Bahasa</td>
                      <td className="p-3 text-center text-amber-400">Demo</td>
                      <td className="p-3 text-center text-emerald-400">✓ Belajar</td>
                      <td className="p-3 text-center text-emerald-400">✓ Pantau</td>
                      <td className="p-3 text-center text-emerald-400">✓ Full</td>
                      <td className="p-3 text-center text-slate-600">✕</td>
                      <td className="p-3 text-center text-slate-600">✕</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-slate-200">Kuitansi Pembayaran Digital</td>
                      <td className="p-3 text-center text-slate-600">✕</td>
                      <td className="p-3 text-center text-emerald-400">✓ Bayar</td>
                      <td className="p-3 text-center text-emerald-400">✓ Verifikasi</td>
                      <td className="p-3 text-center text-emerald-400">✓ Full</td>
                      <td className="p-3 text-center text-amber-400">Laporan</td>
                      <td className="p-3 text-center text-slate-600">✕</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-slate-200">Persetujuan & Penerbitan LoA</td>
                      <td className="p-3 text-center text-slate-600">✕</td>
                      <td className="p-3 text-center text-emerald-400">✓ Unduh</td>
                      <td className="p-3 text-center text-amber-400">Review</td>
                      <td className="p-3 text-center text-emerald-400">✓ Approve</td>
                      <td className="p-3 text-center text-slate-600">✕</td>
                      <td className="p-3 text-center text-slate-600">✕</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {/* Top Floating Simulator Bar */}
      <div
        className="bg-slate-950 text-slate-100 border-b-2 border-[#0F3D7A] text-xs sticky top-0 z-50 shadow-xl transition-all"
        role="region"
        aria-label="Simulasi Hak Akses Pengguna RBAC"
      >
        {/* Toast Alert Banner */}
        {toastMessage && (
          <div className="bg-emerald-900/90 text-emerald-200 px-4 py-1.5 text-[11px] font-bold flex items-center justify-between border-b border-emerald-700 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-emerald-400 hover:text-white text-xs font-bold px-1"
            >
              ✕
            </button>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-2">
          {/* Left Title & Status Indicator */}
          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              <span className="font-bold text-slate-200 text-xs">Peralihan Hak Akses (RBAC)</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${activeRoleInfo.badgeBg}`}>
                Role: {activeRoleInfo.label}
              </span>
              <span className="hidden lg:inline-block text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-md border border-emerald-500/30">
                🔒 System Live Operational (Secure Session Authentication)
              </span>
            </div>

            <div className="flex items-center gap-1 md:hidden">
              <button
                onClick={() => setShowMatrixModal(true)}
                className="p-1 text-amber-400 hover:text-amber-300 font-bold text-[11px] flex items-center gap-1"
              >
                <Info className="w-3.5 h-3.5" /> Matriks
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 text-slate-400 hover:text-white"
                title={isExpanded ? 'Sembunyikan Opsi Role' : 'Tampilkan Opsi Role'}
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Role Buttons List */}
          {isExpanded && (
            <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto whitespace-nowrap pb-1 max-w-full no-scrollbar md:flex-wrap md:justify-start">
              {roles.map((r) => {
                const isActive = currentRole === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => handleRoleChange(r.id, r.label)}
                    title={r.desc}
                    aria-pressed={isActive}
                    aria-label={`Simulasi mode ${r.label}`}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? `${r.color} shadow-sm ring-2 ring-amber-400 scale-105`
                        : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {r.icon}
                    <span>{r.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Right Action Tools: Student Selector & Permission Matrix Button */}
          <div className="flex items-center gap-2 shrink-0">
            {currentRole === 'student' && (
              <div className="flex items-center gap-1.5 text-[11px] bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                <label htmlFor="student-selector" className="text-slate-400 font-medium">
                  Peserta:
                </label>
                <select
                  id="student-selector"
                  value={currentCandidateId}
                  onChange={(e) => setCurrentCandidateId(e.target.value)}
                  aria-label="Pilih akun peserta aktif"
                  className="bg-slate-950 text-amber-300 font-bold text-[11px] px-2 py-0.5 rounded border border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
                >
                  {candidates.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName.split(' ')[0]} ({c.id}) - {c.status}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={() => setShowMatrixModal(true)}
              className="hidden md:flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold px-3 py-1 rounded-lg transition cursor-pointer"
              title="Buka tabel lengkap matriks simulasi hak akses RBAC"
            >
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>Matriks Akses</span>
            </button>

            <button
              onClick={() => toggleHideSwitcher(true)}
              className="flex items-center gap-1 bg-slate-800 hover:bg-red-900/60 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-lg transition cursor-pointer"
              title="Sembunyikan bar controller untuk tampilan publik bersih"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Sembunyikan Bar Controller</span>
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden md:flex p-1 text-slate-400 hover:text-white"
              title={isExpanded ? 'Sembunyikan Panel Role' : 'Tampilkan Panel Role'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Permission Matrix Modal */}
      {showMatrixModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowMatrixModal(false);
          }}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
        >
          <div className="bg-slate-900 text-slate-100 rounded-3xl border border-slate-700 max-w-4xl w-full max-h-[88vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
                  <Key className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-serif">
                    Matriks Simulasi Hak Akses (Role-Based Access Control)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sistem Otentikasi & Otorisasi LKP & Konsultan Pendidikan Prospect Education Cabang Jember
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowMatrixModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Matrix Explanatory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.map((r) => {
                const isActive = currentRole === r.id;
                return (
                  <div
                    key={r.id}
                    className={`p-4 rounded-2xl border transition-all space-y-3 ${
                      isActive
                        ? 'bg-slate-800/90 border-amber-500 shadow-lg ring-1 ring-amber-500/50'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${r.color}`}>{r.icon}</div>
                        <span className="font-bold text-xs text-white">{r.label}</span>
                      </div>
                      {isActive && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-500/40">
                          Aktif
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed">{r.desc}</p>

                    <div className="space-y-1.5 pt-2 border-t border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Cakupan Fitur & Fitur Akses:
                      </span>
                      <ul className="space-y-1 text-[11px] text-slate-300">
                        {r.accessScope.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => {
                        handleRoleChange(r.id, r.label);
                        setShowMatrixModal(false);
                      }}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                          : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                      }`}
                    >
                      {isActive ? 'Sedang Digunakan' : `Simulasi Mode ${r.label}`}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Bottom Info Note */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <p>
                <strong>Catatan Integrasi:</strong> Fitur simulasi hak akses ini memungkinkan penguji (tester/admin/investor) untuk melihat tampilan antarmuka dari sudut pandang masing-masing aktor secara real-time tanpa memerlukan logout/login berulang.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
