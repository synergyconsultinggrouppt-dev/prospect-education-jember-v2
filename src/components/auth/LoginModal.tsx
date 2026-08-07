import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
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
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: UserRole;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, initialRole = 'student' }) => {
  const { loginWithCredentials, setRole, setActiveTab, candidates = [] } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole === 'visitor' ? 'student' : initialRole);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  if (!isOpen) return null;

  const roleOptions: { id: UserRole; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'student',
      label: 'Siswa / Peserta',
      desc: 'Akses Portal LMS, Dokumen, & Status LoA',
      icon: <GraduationCap className="w-4 h-4 text-amber-500" />,
    },
    {
      id: 'admin',
      label: 'Admin Cabang Jember',
      desc: 'Verifikasi Berkas, Keuangan & WA Gateway',
      icon: <Building2 className="w-4 h-4 text-blue-500" />,
    },
    {
      id: 'superadmin',
      label: 'Super Admin Pusat',
      desc: 'Persetujuan Final, LoA & Kontrol System',
      icon: <Crown className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'investor',
      label: 'Investor / Mitras',
      desc: 'Laporan Dividen, Keuangan & Pertumbuhan',
      icon: <TrendingUp className="w-4 h-4 text-emerald-500" />,
    },
    {
      id: 'webmaster',
      label: 'Webmaster IT',
      desc: 'Konfigurasi Fitur & SEO Website',
      icon: <Globe className="w-4 h-4 text-purple-500" />,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#092852] via-[#0F3D7A] to-[#1653a1] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition cursor-pointer"
            aria-label="Tutup Modal Login"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-500/20 border border-amber-400/40 rounded-2xl flex items-center justify-center shadow-inner">
              <Lock className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-700/80 inline-block mb-1">
                🔒 OTENTIKASI RESMI PLATFORM
              </span>
              <h3 className="text-xl font-bold font-serif text-white">Masuk Ke Portal Terpadu</h3>
              <p className="text-xs text-slate-200 mt-0.5">
                Prospect Education Cabang Jember • Sistem Terproteksi Akun
              </p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-2xl flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300 animate-in shake duration-200">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Gagal Masuk Ke Akun</p>
                <p className="text-[11px] leading-relaxed mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {loginSuccess && (
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">Login Berhasil!</p>
                <p className="text-[11px]">Memverifikasi sesi hak akses pengguna...</p>
              </div>
            </div>
          )}

          {/* Role Choice Pills */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Pilih Role / Hak Akses Pengguna:
            </label>
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
                    <span className="truncate">{r.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Role Credential Hint */}
            <div className="mt-2.5 p-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                {selectedRole === 'student' && (
                  <p>
                    <strong>Siswa Baru wajib Mendaftar Online terlebih dahulu.</strong> Akun siswa terdaftar aktif menggunakan Username/Email pendaftaran dengan kata sandi default: <code className="bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-1 py-0.5 rounded font-mono font-bold">siswa123</code>.
                  </p>
                )}
                {selectedRole === 'admin' && (
                  <p>
                    Akses Admin Cabang Jember. Gunakan username: <code className="bg-blue-100 dark:bg-blue-900/60 text-blue-900 dark:text-blue-200 px-1 py-0.5 rounded font-mono font-bold">admin</code> & password: <code className="bg-blue-100 dark:bg-blue-900/60 text-blue-900 dark:text-blue-200 px-1 py-0.5 rounded font-mono font-bold">admin123</code>.
                  </p>
                )}
                {selectedRole === 'superadmin' && (
                  <p>
                    Akses Direksi / Super Admin Pusat. Gunakan username: <code className="bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-1 py-0.5 rounded font-mono font-bold">superadmin</code> & password: <code className="bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-1 py-0.5 rounded font-mono font-bold">super123</code>.
                  </p>
                )}
                {selectedRole === 'investor' && (
                  <p>
                    Akses Mitras / Investor. Gunakan username: <code className="bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 px-1 py-0.5 rounded font-mono font-bold">investor</code> & password: <code className="bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 px-1 py-0.5 rounded font-mono font-bold">investor123</code>.
                  </p>
                )}
                {selectedRole === 'webmaster' && (
                  <p>
                    Akses Tim IT Webmaster. Gunakan username: <code className="bg-purple-100 dark:bg-purple-900/60 text-purple-900 dark:text-purple-200 px-1 py-0.5 rounded font-mono font-bold">webmaster</code> & password: <code className="bg-purple-100 dark:bg-purple-900/60 text-purple-900 dark:text-purple-200 px-1 py-0.5 rounded font-mono font-bold">webmaster123</code>.
                  </p>
                )}
              </div>
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
                placeholder="Masukkan username atau email terdaftar..."
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
                  <span>Masuk Ke Sistem Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
              <span>Belum memiliki akun peserta?</span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setRole('visitor');
                  setActiveTab('pendaftaran');
                }}
                className="text-[#0F3D7A] dark:text-amber-400 font-bold hover:underline cursor-pointer"
              >
                Daftar Online Sekarang →
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
