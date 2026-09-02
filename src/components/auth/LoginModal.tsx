import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, ProgramType } from '../../types';
import {
  Lock,
  User,
  KeyRound,
  ShieldCheck,
  X,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  Building2,
  TrendingUp,
  Globe,
  Crown,
  ArrowRight,
  UserPlus,
  LogIn,
  Phone,
  Mail,
  Briefcase,
  Coins,
  FileCheck,
  Send,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: UserRole;
  initialTab?: 'login' | 'register';
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'student',
  initialTab = 'login',
}) => {
  const {
    loginWithCredentials,
    setRole,
    setActiveTab,
    candidates = [],
    registerNewCandidate,
    addNotification,
    addAuditLog,
    t,
  } = useApp();

  const [activeModalTab, setActiveModalTab] = useState<'login' | 'register'>(initialTab);
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole === 'visitor' ? 'student' : initialRole);
  const [registerRoleType, setRegisterRoleType] = useState<'student' | 'investor'>('student');

  // Login Form States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Student Quick Register Form States
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentWA, setStudentWA] = useState('');
  const [studentProgram, setStudentProgram] = useState<ProgramType>('taiwan_ifp');
  const [registerSuccessMessage, setRegisterSuccessMessage] = useState<string | null>(null);

  // Investor Partnership Register Form States
  const [investorName, setInvestorName] = useState('');
  const [investorCompany, setInvestorCompany] = useState('');
  const [investorEmail, setInvestorEmail] = useState('');
  const [investorWA, setInvestorWA] = useState('');
  const [investorAmount, setInvestorAmount] = useState('Rp 50.000.000 - Rp 100.000.000');
  const [investorNotes, setInvestorNotes] = useState('');
  const [isInvestorSubmitting, setIsInvestorSubmitting] = useState(false);

  if (!isOpen) return null;

  const roleOptions: { id: UserRole; label: string; desc: string; demoUser: string; demoPass: string; icon: React.ReactNode }[] = [
    {
      id: 'student',
      label: 'Siswa / Peserta',
      desc: 'Akses Portal LMS, Dokumen & Status LoA',
      demoUser: 'bambang.prasetyo@gmail.com',
      demoPass: 'siswa123',
      icon: <GraduationCap className="w-4 h-4 text-amber-500" />,
    },
    {
      id: 'admin',
      label: 'Admin Cabang Jember',
      desc: 'Verifikasi Berkas, Keuangan & WA Gateway',
      demoUser: 'admin',
      demoPass: 'admin123',
      icon: <Building2 className="w-4 h-4 text-blue-500" />,
    },
    {
      id: 'superadmin',
      label: 'Super Admin Pusat',
      desc: 'Persetujuan Final, LoA & Kontrol System',
      demoUser: 'superadmin',
      demoPass: 'super123',
      icon: <Crown className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'investor',
      label: 'Investor / Mitras',
      desc: 'Laporan Dividen, Keuangan & Pertumbuhan',
      demoUser: 'investor',
      demoPass: 'investor123',
      icon: <TrendingUp className="w-4 h-4 text-emerald-500" />,
    },
    {
      id: 'webmaster',
      label: 'Webmaster IT',
      desc: 'Konfigurasi Fitur & SEO Website',
      demoUser: 'webmaster',
      demoPass: 'webmaster123',
      icon: <Globe className="w-4 h-4 text-purple-500" />,
    },
  ];

  const fillDemoCredentials = (roleId: UserRole) => {
    const roleOpt = roleOptions.find((r) => r.id === roleId);
    if (roleOpt) {
      setSelectedRole(roleId);
      setUsername(roleOpt.demoUser);
      setPassword(roleOpt.demoPass);
      setErrorMessage('');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Username/Email dan Kata Sandi wajib diisi!');
      setIsLoading(false);
      return;
    }

    try {
      const res = await loginWithCredentials(username, password, selectedRole);
      if (res.success) {
        setLoginSuccess(true);
        setTimeout(() => {
          setIsLoading(false);
          setLoginSuccess(false);
          onClose();
          // Navigate to role tab
          if (selectedRole === 'student') {
            setActiveTab('overview');
          } else if (selectedRole === 'admin' || selectedRole === 'superadmin') {
            setActiveTab('candidates');
          } else if (selectedRole === 'investor') {
            setActiveTab('financials');
          } else if (selectedRole === 'webmaster') {
            setActiveTab('features');
          }
        }, 800);
      } else {
        setIsLoading(false);
        setErrorMessage(res.message || 'Username atau Kata Sandi salah. Silakan periksa kembali.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err.message || 'Gagal terhubung ke sistem login.');
    }
  };

  const handleStudentQuickRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentEmail.trim() || !studentWA.trim()) {
      setErrorMessage('Mohon lengkapi Nama, Email, dan Nomor WhatsApp!');
      return;
    }

    try {
      const newCand = registerNewCandidate({
        fullName: studentName.trim(),
        email: studentEmail.trim().toLowerCase(),
        phoneWA: studentWA.trim(),
        programType: studentProgram,
      });

      setRegisterSuccessMessage(
        `Selamat ${newCand.fullName}! Akun peserta pendaftaran Anda telah berhasil dibuat dengan No. Registrasi ${newCand.registrationNumber}. Silakan lanjutkan melengkapi biodata dan unggah dokumen persyaratan.`
      );

      setTimeout(() => {
        onClose();
        setRole('student');
        setActiveTab('biodata');
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mendaftarkan peserta baru.');
    }
  };

  const handleInvestorRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!investorName.trim() || !investorEmail.trim() || !investorWA.trim()) {
      setErrorMessage('Nama Lengkap, Email, dan No. WhatsApp wajib diisi!');
      return;
    }

    setIsInvestorSubmitting(true);
    setErrorMessage('');

    setTimeout(() => {
      // Add notification for admin
      addNotification({
        title: 'Pengajuan Kemitraan Investor Baru',
        message: `Calon Mitra/Investor ${investorName} (${investorCompany || 'Individu'}) mengajukan minat kemitraan modal ${investorAmount}. Kontak WA: ${investorWA}`,
        type: 'financial',
        link: 'financials',
      });

      addAuditLog({
        actorName: investorName,
        actorRole: 'admin',
        actionCategory: 'user_management',
        actionDetails: `Pendaftaran kemitraan investor baru diajukan oleh ${investorName} (${investorEmail}, WA: ${investorWA}, Alokasi: ${investorAmount})`,
      });

      setIsInvestorSubmitting(false);
      setRegisterSuccessMessage(
        `Terima kasih Bapak/Ibu ${investorName}! Pengajuan kemitraan modal investor Anda telah berhasil kami terima. Tim Direksi & Manajemen Keuangan LKP Prospect Education Jember akan segera menghubungi Anda melalui WhatsApp di nomor ${investorWA}.`
      );

      setTimeout(() => {
        setRegisterSuccessMessage(null);
        onClose();
      }, 4000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden relative my-auto">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#071E3D] via-[#0F3D7A] to-[#1E40AF] p-5 sm:p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition cursor-pointer"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-amber-500/20 border border-amber-400/40 rounded-2xl flex items-center justify-center shadow-inner shrink-0">
              {activeModalTab === 'login' ? (
                <Lock className="w-6 h-6 text-amber-300" />
              ) : (
                <UserPlus className="w-6 h-6 text-amber-300" />
              )}
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-700/80 inline-block mb-1">
                {activeModalTab === 'login' ? 'PORTAL OTENTIKASI RESMI' : 'PENDAFTARAN RESMI TERPADU'}
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-serif text-white">
                {activeModalTab === 'login' ? 'Masuk Ke Akun Sistem' : 'Buat Akun / Daftar Baru'}
              </h3>
              <p className="text-xs text-slate-200 mt-0.5">
                Prospect Education Jember • Akses Siswa, Admin, Investor & Webmaster
              </p>
            </div>
          </div>

          {/* Tab Switcher: Masuk vs Daftar */}
          <div className="flex items-center bg-black/30 p-1 rounded-xl mt-4 border border-white/15">
            <button
              type="button"
              onClick={() => {
                setActiveModalTab('login');
                setErrorMessage('');
                setRegisterSuccessMessage(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeModalTab === 'login'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk (Login Akun)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveModalTab('register');
                setErrorMessage('');
                setRegisterSuccessMessage(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeModalTab === 'register'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Daftar / Registrasi Baru</span>
            </button>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto">
          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-2xl flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300 animate-in shake duration-200">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Perhatian</p>
                <p className="text-[11px] leading-relaxed mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {(loginSuccess || registerSuccessMessage) && (
            <div className="mb-4 p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-300 animate-in zoom-in-95 duration-150">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">{loginSuccess ? 'Login Berhasil!' : 'Pendaftaran Berhasil!'}</p>
                <p className="text-[11px] leading-relaxed mt-0.5">
                  {loginSuccess ? 'Memverifikasi sesi hak akses pengguna ke dashboard...' : registerSuccessMessage}
                </p>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 1: MASUK / LOGIN
             ========================================================================= */}
          {activeModalTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Role Selection Pills */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Pilih Hak Akses Pengguna:
                  </label>
                  <span className="text-[11px] text-[#0F3D7A] dark:text-amber-400 font-semibold">
                    Klik role di bawah
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {roleOptions.map((r) => {
                    const isSelected = selectedRole === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          setSelectedRole(r.id);
                          setErrorMessage('');
                        }}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition cursor-pointer text-xs font-semibold ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-950/80 border-[#0F3D7A] dark:border-amber-500 text-[#0F3D7A] dark:text-amber-300 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        <div className="shrink-0">{r.icon}</div>
                        <span className="truncate">{r.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Quick 1-Click Demo Account Autofill Button */}
                <div className="mt-2.5 p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Ingin coba akun demo {roleOptions.find((r) => r.id === selectedRole)?.label.split(' ')[0]}?</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials(selectedRole)}
                    className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-bold rounded-lg transition shadow-xs cursor-pointer shrink-0"
                  >
                    ⚡ Isi Demo
                  </button>
                </div>
              </div>

              {/* Username/Email Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Username / Alamat Email:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={
                      selectedRole === 'student'
                        ? 'Email siswa atau No. Registrasi...'
                        : `Username atau email ${selectedRole}...`
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-[#0F3D7A] dark:focus:ring-amber-500 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Kata Sandi (Password):
                  </label>
                  <span className="text-[10px] text-slate-400">Min. 6 Karakter</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi akun..."
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-[#0F3D7A] dark:focus:ring-amber-500 focus:outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Action Buttons */}
              <div className="pt-2 space-y-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#0F3D7A] hover:bg-[#1653a1] active:scale-[0.99] text-amber-300 font-bold py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
                      <span>Memverifikasi Akun...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Masuk Ke Portal {roleOptions.find((r) => r.id === selectedRole)?.label}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span>Belum punya akun?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModalTab('register');
                      setErrorMessage('');
                    }}
                    className="text-[#0F3D7A] dark:text-amber-400 font-bold hover:underline cursor-pointer"
                  >
                    Daftar Sekarang (Siswa / Investor) →
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* =========================================================================
              TAB 2: DAFTAR / REGISTRASI BARU
             ========================================================================= */}
          {activeModalTab === 'register' && (
            <div className="space-y-4">
              {/* Type Switcher: Daftar Siswa vs Daftar Investor */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRegisterRoleType('student');
                    setErrorMessage('');
                  }}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center gap-2.5 ${
                    registerRoleType === 'student'
                      ? 'bg-blue-50 dark:bg-blue-950/80 border-[#0F3D7A] dark:border-amber-500 text-[#0F3D7A] dark:text-amber-300 font-bold shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <GraduationCap className="w-5 h-5 text-amber-500 shrink-0" />
                  <div>
                    <p className="text-xs">Daftar Siswa Baru</p>
                    <p className="text-[10px] font-normal opacity-80">Kuliah Taiwan / Kerja Jepang</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRegisterRoleType('investor');
                    setErrorMessage('');
                  }}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center gap-2.5 ${
                    registerRoleType === 'investor'
                      ? 'bg-blue-50 dark:bg-blue-950/80 border-[#0F3D7A] dark:border-amber-500 text-[#0F3D7A] dark:text-amber-300 font-bold shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <TrendingUp className="w-5 h-5 text-emerald-500 shrink-0" />
                  <div>
                    <p className="text-xs">Daftar Mitra Investor</p>
                    <p className="text-[10px] font-normal opacity-80">Kemitraan Pemodal & ROI</p>
                  </div>
                </button>
              </div>

              {/* Sub-form 1: DAFTAR SISWA */}
              {registerRoleType === 'student' && (
                <form onSubmit={handleStudentQuickRegister} className="space-y-3.5 pt-1">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Nama Lengkap (Sesuai KTP/Ijazah):
                    </label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Contoh: Muhammad Farhan Pratama"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-[#0F3D7A] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Alamat Email Aktif:
                      </label>
                      <input
                        type="email"
                        required
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        placeholder="email.aktif@gmail.com"
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-[#0F3D7A] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Nomor WhatsApp:
                      </label>
                      <input
                        type="tel"
                        required
                        value={studentWA}
                        onChange={(e) => setStudentWA(e.target.value)}
                        placeholder="Contoh: 081234567890"
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-[#0F3D7A] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Pilihan Program Minat:
                    </label>
                    <select
                      value={studentProgram}
                      onChange={(e) => setStudentProgram(e.target.value as ProgramType)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0F3D7A] focus:outline-none"
                    >
                      <option value="taiwan_ifp">🇹🇼 Program Kuliah Taiwan IFP 1+4 (Tanpa Syarat TOCFL)</option>
                      <option value="taiwan_reguler">🇹🇼 Program Kuliah S1/S2 Reguler Taiwan</option>
                      <option value="japan_im">🇯🇵 Program Magang Jepang IM Japan (Kemnaker)</option>
                      <option value="japan_ssw">🇯🇵 Program Kerja Tokutei Ginou SSW Jepang</option>
                    </select>
                  </div>

                  <div className="pt-2 space-y-2">
                    <button
                      type="submit"
                      className="w-full bg-[#F59E0B] hover:bg-[#d97706] active:scale-[0.99] text-slate-950 font-extrabold py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
                    >
                      <GraduationCap className="w-4 h-4 text-slate-950" />
                      <span>Buat Akun Siswa & Masuk ke Biodata</span>
                      <ArrowRight className="w-4 h-4 text-slate-950" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setRole('visitor');
                        setActiveTab('pendaftaran');
                      }}
                      className="w-full text-center text-xs font-bold text-[#0F3D7A] dark:text-amber-400 hover:underline py-1 cursor-pointer"
                    >
                      Buka Formulir Pendaftaran Lengkap 3 Langkah →
                    </button>
                  </div>
                </form>
              )}

              {/* Sub-form 2: DAFTAR INVESTOR */}
              {registerRoleType === 'investor' && (
                <form onSubmit={handleInvestorRegister} className="space-y-3.5 pt-1">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300">
                    <strong>Peluang Kemitraan Modal LKP Prospect Jember:</strong> Bergabung menjadi mitra pemodal resmi dengan transparansi laporan keuangan real-time, dividen bagi hasil, dan jaminan legalitas institusi.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Nama Calon Investor / Mitra:
                      </label>
                      <input
                        type="text"
                        required
                        value={investorName}
                        onChange={(e) => setInvestorName(e.target.value)}
                        placeholder="Contoh: Hendra Wijaya, S.E."
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-[#0F3D7A] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Nama Perusahaan / Institusi:
                      </label>
                      <input
                        type="text"
                        value={investorCompany}
                        onChange={(e) => setInvestorCompany(e.target.value)}
                        placeholder="Opsional (Contoh: PT Surya Capital)"
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-[#0F3D7A] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Alamat Email:
                      </label>
                      <input
                        type="email"
                        required
                        value={investorEmail}
                        onChange={(e) => setInvestorEmail(e.target.value)}
                        placeholder="investor@perusahaan.com"
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-[#0F3D7A] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        No. WhatsApp / HP:
                      </label>
                      <input
                        type="tel"
                        required
                        value={investorWA}
                        onChange={(e) => setInvestorWA(e.target.value)}
                        placeholder="Contoh: 081298765432"
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-[#0F3D7A] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Rencana Alokasi Modal / Investasi:
                    </label>
                    <select
                      value={investorAmount}
                      onChange={(e) => setInvestorAmount(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0F3D7A] focus:outline-none"
                    >
                      <option value="Rp 25.000.000 - Rp 50.000.000">Rp 25.000.000 - Rp 50.000.000 (Paket Mitra Dasar)</option>
                      <option value="Rp 50.000.000 - Rp 100.000.000">Rp 50.000.000 - Rp 100.000.000 (Paket Mitra Utama)</option>
                      <option value="Rp 100.000.000 - Rp 250.000.000">Rp 100.000.000 - Rp 250.000.000 (Ekspansi Kelas Bahasa & Asrama)</option>
                      <option value="Diatas Rp 250.000.000">Diatas Rp 250.000.000+ (Mitra Strategis & Dana Talangan)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Catatan Tambahan / Minat Khusus (Opsional):
                    </label>
                    <textarea
                      rows={2}
                      value={investorNotes}
                      onChange={(e) => setInvestorNotes(e.target.value)}
                      placeholder="Tuliskan pertanyaan atau rencana kerjasama Anda..."
                      className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-[#0F3D7A] focus:outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isInvestorSubmitting}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isInvestorSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Mengirimkan Pengajuan...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Kirim Pengajuan Kemitraan Investor</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
