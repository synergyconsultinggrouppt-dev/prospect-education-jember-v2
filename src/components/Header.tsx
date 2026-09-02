import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';
import { NotificationBell } from './NotificationBell';
import { UserRole } from '../types';
import {
  ShieldCheck,
  Phone,
  Menu,
  X,
  GraduationCap,
  MapPin,
  Globe,
  Sun,
  Moon,
  ChevronDown,
  LogIn,
  LogOut,
  UserPlus,
  Building2,
  TrendingUp,
  Crown,
  Sparkles,
  Home,
  BookOpen,
  FileEdit,
  FileText,
  Newspaper,
  Image as ImageIcon,
  Star,
  HelpCircle,
  MessageSquare,
  Lock,
  User,
  ExternalLink,
  Plane,
  Briefcase,
  ChevronRight,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentRole,
    setRole,
    currentCandidate,
    language,
    setLanguage,
    theme,
    toggleTheme,
    t,
    openLoginModal,
    logout,
    currentUserSession,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);

  const loginDropdownRef = useRef<HTMLDivElement>(null);
  const registerDropdownRef = useRef<HTMLDivElement>(null);

  // Close menus on Escape and Click Outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setLoginDropdownOpen(false);
        setRegisterDropdownOpen(false);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (loginDropdownRef.current && !loginDropdownRef.current.contains(e.target as Node)) {
        setLoginDropdownOpen(false);
      }
      if (registerDropdownRef.current && !registerDropdownRef.current.contains(e.target as Node)) {
        setRegisterDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen, loginDropdownOpen, registerDropdownOpen]);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Complete List of All Public Menus
  const allNavItems = [
    {
      id: 'beranda',
      label: t('Beranda', 'Home'),
      icon: <Home className="w-3.5 h-3.5" />,
      badge: null,
      category: 'main',
    },
    {
      id: 'company',
      label: t('Profil Lembaga', 'Profile'),
      icon: <Building2 className="w-3.5 h-3.5" />,
      badge: t('Legal', 'Legal'),
      badgeColor: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300',
      category: 'main',
    },
    {
      id: 'taiwan',
      label: t('Kuliah Taiwan', 'Study Taiwan'),
      icon: <Plane className="w-3.5 h-3.5 text-sky-500" />,
      badge: 'IFP 1+4',
      badgeColor: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
      category: 'programs',
    },
    {
      id: 'jepang',
      label: t('Kerja Jepang', 'Work Japan'),
      icon: <Briefcase className="w-3.5 h-3.5 text-rose-500" />,
      badge: 'SSW / IM',
      badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300',
      category: 'programs',
    },
    {
      id: 'program',
      label: t('Semua Program', 'All Programs'),
      icon: <GraduationCap className="w-3.5 h-3.5" />,
      badge: null,
      category: 'programs',
    },
    {
      id: 'pendaftaran',
      label: t('Pendaftaran Online', 'Registration'),
      icon: <FileEdit className="w-3.5 h-3.5 text-amber-500" />,
      badge: t('Buka', 'Open'),
      badgeColor: 'bg-amber-400 text-slate-950 font-black',
      category: 'main',
    },
    {
      id: 'lms',
      label: t('LMS Belajar', 'LMS E-Learning'),
      icon: <BookOpen className="w-3.5 h-3.5 text-blue-500" />,
      badge: t('Digital', 'Digital'),
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
      category: 'main',
    },
    {
      id: 'layanan',
      label: t('Layanan Dokumen', 'Services & Docs'),
      icon: <FileText className="w-3.5 h-3.5 text-purple-500" />,
      badge: t('Terjemah', 'Translation'),
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
      category: 'info',
    },
    {
      id: 'berita',
      label: t('Berita & Info', 'News'),
      icon: <Newspaper className="w-3.5 h-3.5 text-amber-600" />,
      badge: null,
      category: 'info',
    },
    {
      id: 'galeri',
      label: t('Galeri Foto', 'Gallery'),
      icon: <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />,
      badge: null,
      category: 'info',
    },
    {
      id: 'testimoni',
      label: t('Testimoni', 'Testimonials'),
      icon: <Star className="w-3.5 h-3.5 text-amber-400" />,
      badge: 'Alumni',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
      category: 'info',
    },
    {
      id: 'faq',
      label: t('FAQ / Tanya Jawab', 'FAQ'),
      icon: <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />,
      badge: null,
      category: 'info',
    },
    {
      id: 'kritik',
      label: t('Kritik & Saran', 'Feedback'),
      icon: <MessageSquare className="w-3.5 h-3.5 text-rose-500" />,
      badge: null,
      category: 'info',
    },
    {
      id: 'kontak',
      label: t('Kontak & Lokasi', 'Contact'),
      icon: <Phone className="w-3.5 h-3.5 text-emerald-500" />,
      badge: 'Balung',
      badgeColor: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
      category: 'info',
    },
  ];

  // Specific role navigation options when logged into portals
  const roleNavItems = {
    student: [
      { id: 'overview', label: 'Ringkasan Portal', icon: <Home className="w-3.5 h-3.5" /> },
      { id: 'biodata', label: 'Biodata Diri', icon: <User className="w-3.5 h-3.5" /> },
      { id: 'documents', label: 'Verifikasi Berkas', icon: <FileText className="w-3.5 h-3.5" /> },
      { id: 'lms', label: 'LMS Pembelajaran', icon: <BookOpen className="w-3.5 h-3.5" /> },
      { id: 'loa', label: 'Surat LoA Resmi', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
      { id: 'payment', label: 'Status Keuangan', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    ],
    admin: [
      { id: 'candidates', label: 'Data Peserta', icon: <GraduationCap className="w-3.5 h-3.5" /> },
      { id: 'finance', label: 'Rekapitulasi Kas', icon: <TrendingUp className="w-3.5 h-3.5" /> },
      { id: 'loa', label: 'Surat LoA', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
      { id: 'investor_report', label: 'Laporan Investor', icon: <Building2 className="w-3.5 h-3.5" /> },
    ],
    superadmin: [
      { id: 'candidates', label: 'Data Peserta', icon: <GraduationCap className="w-3.5 h-3.5" /> },
      { id: 'finance', label: 'Kas Global', icon: <TrendingUp className="w-3.5 h-3.5" /> },
      { id: 'loa', label: 'Persetujuan LoA', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
      { id: 'investor_report', label: 'Laporan Direksi', icon: <Crown className="w-3.5 h-3.5" /> },
      { id: 'audit_logs', label: 'Audit Log', icon: <Lock className="w-3.5 h-3.5" /> },
    ],
    investor: [
      { id: 'financials', label: 'Laporan Keuangan', icon: <TrendingUp className="w-3.5 h-3.5" /> },
      { id: 'portfolio', label: 'Portofolio Modal', icon: <Building2 className="w-3.5 h-3.5" /> },
      { id: 'cashflow', label: 'Arus Kas & Dividen', icon: <Sparkles className="w-3.5 h-3.5" /> },
    ],
    webmaster: [
      { id: 'features', label: 'Kontrol Fitur', icon: <Globe className="w-3.5 h-3.5" /> },
      { id: 'seo', label: 'Konfigurasi SEO', icon: <Globe className="w-3.5 h-3.5" /> },
      { id: 'audit', label: 'Log Sistem', icon: <Lock className="w-3.5 h-3.5" /> },
    ],
  };

  const handleNavClick = (tabId: string) => {
    if (currentRole !== 'visitor') {
      setRole('visitor');
    }
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const roleLoginOptions: {
    role: UserRole;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      role: 'student',
      title: 'Portal Siswa / Peserta',
      subtitle: 'Akses LMS, Dokumen & LoA Resmi',
      icon: <GraduationCap className="w-4 h-4 text-amber-500" />,
      color: 'hover:bg-amber-50 dark:hover:bg-amber-950/30',
    },
    {
      role: 'admin',
      title: 'Admin Cabang Jember',
      subtitle: 'Verifikasi Berkas & Operasional',
      icon: <Building2 className="w-4 h-4 text-blue-500" />,
      color: 'hover:bg-blue-50 dark:hover:bg-blue-950/30',
    },
    {
      role: 'superadmin',
      title: 'Super Admin Pusat (Direksi)',
      subtitle: 'Persetujuan Final & Audit Lembaga',
      icon: <Crown className="w-4 h-4 text-amber-400" />,
      color: 'hover:bg-amber-50 dark:hover:bg-amber-950/30',
    },
    {
      role: 'investor',
      title: 'Investor & Mitra Usaha',
      subtitle: 'Laporan Dividen, Kas & ROI',
      icon: <TrendingUp className="w-4 h-4 text-emerald-500" />,
      color: 'hover:bg-emerald-50 dark:hover:bg-emerald-950/30',
    },
    {
      role: 'webmaster',
      title: 'Webmaster IT',
      subtitle: 'Kontrol Sistem & Konfigurasi SEO',
      icon: <Globe className="w-4 h-4 text-purple-500" />,
      color: 'hover:bg-purple-50 dark:hover:bg-purple-950/30',
    },
  ];

  // Role display label helpers
  const getRoleShortLabel = () => {
    switch (currentRole) {
      case 'student':
        return currentCandidate?.fullName ? currentCandidate.fullName.split(' ')[0] : 'Siswa';
      case 'admin':
        return 'Admin Jbr';
      case 'superadmin':
        return 'Direksi';
      case 'investor':
        return 'Investor';
      case 'webmaster':
        return 'Webmaster';
      default:
        return 'Visitor';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
      {/* =========================================================================
          1. TOP UTILITY / HOTLINE BAR (DESKTOP & LAPTOP ONLY - HIDDEN ON MOBILE)
         ========================================================================= */}
      <div className="bg-gradient-to-r from-[#071E3D] via-[#0F3D7A] to-[#071E3D] text-slate-100 text-xs py-1.5 px-4 sm:px-6 hidden lg:block border-b border-blue-900/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[11px]">
          {/* Left: Accreditation & Location */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-amber-300 font-bold tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
              <span>{t('LKP Resmi Terdaftar Kemdikbud • Izin Operasional Balung Jember', 'Official Licensed LKP in Jember')}</span>
            </span>
            <span className="text-blue-400/60">•</span>
            <span className="inline-flex items-center gap-1 text-slate-200 font-medium">
              <MapPin className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              <span>Jl. Balung Lor, Jember, Jawa Timur</span>
            </span>
          </div>

          {/* Right: WhatsApp Hotline, Language & Theme Controls */}
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/6282334554396?text=Halo%20Admin%20Prospect%20Education%20Jember,%20saya%20ingin%20konsultasi%20program"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-100 hover:text-amber-300 font-semibold transition cursor-pointer group"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <Phone className="w-3 h-3 text-emerald-400 group-hover:scale-110 transition-transform" aria-hidden="true" />
              <span>CS WA: 0823-3455-4396</span>
            </a>

            <span className="text-blue-400/60">|</span>

            {/* Language Switcher in Top Bar */}
            <div className="inline-flex items-center bg-blue-950/80 p-0.5 rounded-lg border border-blue-700/60 text-[10px]">
              <button
                onClick={() => setLanguage('id')}
                className={`px-1.5 py-0.5 rounded font-bold transition cursor-pointer ${
                  language === 'id' ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:text-white'
                }`}
              >
                ID
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-1.5 py-0.5 rounded font-bold transition cursor-pointer ${
                  language === 'en' ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            {/* Theme Toggle in Top Bar */}
            <button
              onClick={toggleTheme}
              aria-label="Ganti Tema"
              className="p-1 rounded-lg bg-blue-950/80 text-amber-300 hover:bg-blue-900 border border-blue-700/60 transition cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-3 h-3 text-amber-400" /> : <Moon className="w-3 h-3 text-slate-200" />}
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. MAIN HEADER BAR (RINGKAS, BERSIH, PROPORSIONAL DI SEMUA LAYAR)
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 md:px-6 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-2 w-full max-w-full overflow-hidden">
        {/* BRAND LOGO AREA */}
        <button
          onClick={() => handleNavClick('beranda')}
          aria-label="Kembali ke Beranda Prospect Education Jember"
          className="flex-1 min-w-0 max-w-full overflow-hidden text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0F3D7A] rounded-xl focus-visible:outline-hidden"
        >
          <BrandLogo variant="header" showSubtitle={true} />
        </button>

        {/* LOGGED IN ACTIVE ROLE PILL (DESKTOP) */}
        {currentRole !== 'visitor' && (
          <div className="hidden xl:flex items-center gap-2 bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-xs shrink-0">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-700 dark:text-slate-200 font-medium">
              Mode Portal:
            </span>
            <span className="font-extrabold text-[#0F3D7A] dark:text-amber-300 uppercase tracking-wide">
              {currentRole}
            </span>
            <button
              onClick={() => setRole('visitor')}
              className="ml-2 text-[11px] bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 px-2 py-0.5 rounded font-bold text-slate-800 dark:text-slate-100 transition cursor-pointer"
            >
              🌐 Lihat Web Publik
            </button>
          </div>
        )}

        {/* RIGHT CONTROLS: ELEGANT, NEVER OVERFLOWING */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Notification Bell */}
          <NotificationBell />

          {/* =====================================================================
              DESKTOP ONLY: DAFTAR & MASUK BUTTONS (LARGE SCREENS >= lg)
             ===================================================================== */}
          {currentRole === 'visitor' ? (
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              {/* TOMBOL DAFTAR (DROPDOWN) */}
              <div className="relative" ref={registerDropdownRef}>
                <button
                  type="button"
                  onClick={() => setRegisterDropdownOpen(!registerDropdownOpen)}
                  aria-expanded={registerDropdownOpen}
                  aria-haspopup="true"
                  className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-95 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl shadow-xs transition cursor-pointer border border-amber-500/40"
                >
                  <UserPlus className="w-3.5 h-3.5 text-slate-950" />
                  <span>{t('Daftar', 'Register')}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      registerDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {registerDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3.5 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Registrasi Akun Baru
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setRegisterDropdownOpen(false);
                        openLoginModal('student', 'register');
                      }}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition cursor-pointer flex items-start gap-3"
                    >
                      <div className="p-1.5 bg-amber-100 dark:bg-amber-900/50 rounded-lg text-amber-700 dark:text-amber-300 shrink-0 mt-0.5">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">Daftar Siswa Baru</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Kuliah Taiwan & Kerja Jepang</p>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setRegisterDropdownOpen(false);
                        openLoginModal('investor', 'register');
                      }}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition cursor-pointer flex items-start gap-3"
                    >
                      <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg text-emerald-700 dark:text-emerald-300 shrink-0 mt-0.5">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">Daftar Mitra Investor</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Kemitraan Pemodal & Bagi Hasil</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* TOMBOL MASUK / LOGIN (ROLE SELECTOR DROPDOWN) */}
              <div className="relative" ref={loginDropdownRef}>
                <button
                  type="button"
                  onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                  aria-expanded={loginDropdownOpen}
                  aria-haspopup="true"
                  className="flex items-center gap-1.5 bg-[#0F3D7A] hover:bg-[#1653a1] active:scale-95 text-amber-300 font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs border border-amber-400/40 transition cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-300" />
                  <span>{t('Masuk / Login', 'Login')}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      loginDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {loginDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3.5 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Pilih Portal Hak Akses
                      </span>
                      <span className="text-[9px] bg-blue-100 dark:bg-blue-900/60 text-[#0F3D7A] dark:text-amber-300 font-bold px-1.5 py-0.5 rounded">
                        5 Role
                      </span>
                    </div>

                    <div className="space-y-0.5 px-1.5">
                      {roleLoginOptions.map((opt) => (
                        <button
                          key={opt.role}
                          onClick={() => {
                            setLoginDropdownOpen(false);
                            openLoginModal(opt.role, 'login');
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-3 ${opt.color}`}
                        >
                          <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
                            {opt.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {opt.title}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                              {opt.subtitle}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* USER LOGGED IN CAPSULE (DESKTOP) */
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  if (currentRole === 'student') setActiveTab('overview');
                  else if (currentRole === 'admin' || currentRole === 'superadmin') setActiveTab('candidates');
                  else if (currentRole === 'investor') setActiveTab('financials');
                  else if (currentRole === 'webmaster') setActiveTab('features');
                }}
                className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-medium shadow-xs hover:border-amber-400 transition cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold truncate max-w-[130px]">
                  {currentUserSession?.fullName ||
                    (currentRole === 'student' ? currentCandidate?.fullName || 'Peserta' : currentRole.toUpperCase())}
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold uppercase border border-amber-500/30">
                  {currentRole}
                </span>
              </button>

              <button
                onClick={logout}
                title="Keluar dari Akun (Logout)"
                aria-label="Keluar dari Akun"
                className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-xl transition cursor-pointer shrink-0 shadow-xs"
              >
                <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Keluar</span>
              </button>
            </div>
          )}

          {/* =====================================================================
              MOBILE ONLY: USER LOGGED IN STATUS PILL (COMPACT & CLEAN)
             ===================================================================== */}
          {currentRole !== 'visitor' && (
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Buka Menu Akun Pengguna"
              className="lg:hidden flex items-center gap-1 bg-[#0F3D7A] text-amber-300 px-1.5 sm:px-2 py-1 rounded-lg border border-amber-400/40 text-[10px] sm:text-[11px] font-bold shadow-xs active:scale-95 transition shrink-0 max-w-[75px] truncate"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="truncate">{getRoleShortLabel()}</span>
            </button>
          )}

          {/* =====================================================================
              MOBILE ONLY: COMPACT LOGIN ACTION (IF VISITOR)
             ===================================================================== */}
          {currentRole === 'visitor' && (
            <button
              onClick={() => openLoginModal('student', 'login')}
              className="lg:hidden flex items-center gap-1 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[11px] px-2 py-1.5 rounded-xl shadow-xs active:scale-95 transition shrink-0"
            >
              <LogIn className="w-3 h-3 text-slate-950" />
              <span>Masuk</span>
            </button>
          )}

          {/* =====================================================================
              MOBILE ONLY: HAMBURGER MENU BUTTON (ALWAYS ACCESSIBLE, NEVER CUT OFF)
             ===================================================================== */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu lengkap'}
            className="lg:hidden w-8.5 h-8.5 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 active:scale-95 transition cursor-pointer shrink-0"
          >
            {mobileMenuOpen ? (
              <X className="w-4.5 h-4.5 text-amber-500" aria-hidden="true" />
            ) : (
              <Menu className="w-4.5 h-4.5 text-slate-800 dark:text-slate-100" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* =========================================================================
          3. FULL DESKTOP (PC) MULTI-MENU NAVBAR (CLEAR, ELEGANT & SPACIOUS)
         ========================================================================= */}
      <div className="hidden lg:block bg-slate-50/95 dark:bg-slate-950/90 border-t border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 py-1.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Complete Horizontal List of Menus */}
          <nav className="flex items-center flex-wrap gap-1 xl:gap-1.5" role="navigation" aria-label="Semua Menu Publik">
            {allNavItems.map((item) => {
              const isActive =
                currentRole === 'visitor' &&
                (activeTab === item.id ||
                  (item.id === 'taiwan' && activeTab === 'taiwan') ||
                  (item.id === 'jepang' && activeTab === 'jepang') ||
                  (item.id === 'beranda' && (activeTab === 'beranda' || activeTab === 'home')) ||
                  (item.id === 'company' && (activeTab === 'company' || activeTab === 'profil')));

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#0F3D7A] text-amber-300 shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-[#0F3D7A] dark:hover:text-amber-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="whitespace-nowrap">{item.label}</span>
                  {item.badge && !isActive && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold leading-none ${
                        item.badgeColor || 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick CS Badge */}
          <div className="hidden xl:flex items-center gap-2 shrink-0 text-xs font-semibold text-slate-600 dark:text-slate-300 pl-2 border-l border-slate-200 dark:border-slate-800">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              Balung, Jember
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. MOBILE LUXURY FULL DRAWER NAVIGATION (PREMIUM MODAL VIEW)
         ========================================================================= */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="lg:hidden fixed inset-x-0 top-14 bottom-0 bg-slate-950/98 backdrop-blur-2xl text-slate-100 z-50 flex flex-col overflow-hidden border-t border-slate-800/80 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {/* Drawer Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 overscroll-contain">
            {/* SECTION 1: LOGGED IN USER CARD / VISITOR AUTH & REGISTRATION */}
            {currentRole !== 'visitor' ? (
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-4 rounded-2xl border border-blue-900/40 space-y-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-sm border border-amber-400/30">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-white truncate max-w-[160px]">
                        {currentUserSession?.fullName ||
                          (currentRole === 'student' ? currentCandidate?.fullName || 'Peserta' : currentRole.toUpperCase())}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                          Portal: {currentRole}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar</span>
                  </button>
                </div>

                {/* Role Specific Navigation Grid */}
                {roleNavItems[currentRole as keyof typeof roleNavItems] && (
                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Navigasi Menu {currentRole.toUpperCase()}:
                    </p>
                    <div className="grid grid-cols-2 gap-1.5 text-xs">
                      {roleNavItems[currentRole as keyof typeof roleNavItems].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveTab(tab.id);
                            setMobileMenuOpen(false);
                          }}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition text-left ${
                            activeTab === tab.id
                              ? 'bg-[#0F3D7A] text-amber-300 border border-amber-400/50 shadow-xs'
                              : 'bg-slate-800/80 hover:bg-slate-800 text-slate-200'
                          }`}
                        >
                          <span className="shrink-0 text-amber-400">{tab.icon}</span>
                          <span className="truncate">{tab.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* VISITOR REGISTRATION & LOGIN ACTION CARDS */
              <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Pendaftaran & Portal Akun</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Balung, Jember</span>
                </div>

                {/* Main 2 Registration Action Cards */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openLoginModal('student', 'register');
                    }}
                    className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs py-2.5 rounded-xl shadow-xs active:scale-95 transition"
                  >
                    <GraduationCap className="w-4 h-4 text-slate-950" />
                    <span>Daftar Siswa</span>
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openLoginModal('investor', 'register');
                    }}
                    className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs active:scale-95 transition"
                  >
                    <TrendingUp className="w-4 h-4 text-white" />
                    <span>Daftar Investor</span>
                  </button>
                </div>

                {/* 1-Tap Login Roles Grid */}
                <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Masuk Portal Sebagai:
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openLoginModal('student', 'login');
                      }}
                      className="flex items-center gap-2 p-2 bg-slate-950 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-semibold text-left border border-slate-800 active:scale-95 transition"
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">Siswa / LMS</span>
                    </button>

                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openLoginModal('admin', 'login');
                      }}
                      className="flex items-center gap-2 p-2 bg-slate-950 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-semibold text-left border border-slate-800 active:scale-95 transition"
                    >
                      <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="truncate">Admin Jember</span>
                    </button>

                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openLoginModal('superadmin', 'login');
                      }}
                      className="flex items-center gap-2 p-2 bg-slate-950 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-semibold text-left border border-slate-800 active:scale-95 transition"
                    >
                      <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">Super Admin</span>
                    </button>

                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openLoginModal('investor', 'login');
                      }}
                      className="flex items-center gap-2 p-2 bg-slate-950 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-semibold text-left border border-slate-800 active:scale-95 transition"
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">Investor Mitra</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 2: PROGRAM PENDIDIKAN & PENDAFTARAN */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 px-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Program Pendidikan & Pendaftaran</span>
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleNavClick('taiwan')}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl text-xs font-bold transition text-left ${
                    activeTab === 'taiwan'
                      ? 'bg-[#0F3D7A] text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'bg-slate-900 text-slate-200 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <div className="p-1.5 rounded-xl bg-sky-500/20 text-sky-400 shrink-0">
                    <Plane className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-bold text-white">Kuliah Taiwan</p>
                    <p className="text-[10px] text-sky-300 font-medium">IFP 1+4 (Tanpa TOCFL)</p>
                  </div>
                </button>

                <button
                  onClick={() => handleNavClick('jepang')}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl text-xs font-bold transition text-left ${
                    activeTab === 'jepang'
                      ? 'bg-[#0F3D7A] text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'bg-slate-900 text-slate-200 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <div className="p-1.5 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-bold text-white">Kerja Jepang</p>
                    <p className="text-[10px] text-rose-300 font-medium">SSW / IM Japan</p>
                  </div>
                </button>

                <button
                  onClick={() => handleNavClick('pendaftaran')}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl text-xs font-bold transition text-left ${
                    activeTab === 'pendaftaran'
                      ? 'bg-[#0F3D7A] text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'bg-slate-900 text-slate-200 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                    <FileEdit className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-bold text-white">Daftar Online</p>
                    <p className="text-[10px] text-amber-300 font-medium">Form 3 Langkah</p>
                  </div>
                </button>

                <button
                  onClick={() => handleNavClick('lms')}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl text-xs font-bold transition text-left ${
                    activeTab === 'lms'
                      ? 'bg-[#0F3D7A] text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'bg-slate-900 text-slate-200 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <div className="p-1.5 rounded-xl bg-blue-500/20 text-blue-400 shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-bold text-white">LMS Digital</p>
                    <p className="text-[10px] text-blue-300 font-medium">E-Learning Siswa</p>
                  </div>
                </button>
              </div>
            </div>

            {/* SECTION 3: SEMUA MENU PUBLIK LENGKAP */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-1">
                {t('Semua Halaman & Informasi', 'All Pages & Information')}
              </span>
              <div className="grid grid-cols-2 gap-1.5" role="navigation" aria-label="Semua Menu Drawer">
                {allNavItems.map((item) => {
                  const isActive =
                    currentRole === 'visitor' &&
                    (activeTab === item.id ||
                      (item.id === 'beranda' && (activeTab === 'beranda' || activeTab === 'home')) ||
                      (item.id === 'company' && (activeTab === 'company' || activeTab === 'profil')));

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition text-left ${
                        isActive
                          ? 'bg-[#0F3D7A] text-amber-300 border border-amber-500/40 shadow-xs'
                          : 'bg-slate-900 text-slate-200 hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="p-1 rounded-lg bg-slate-800 shrink-0">
                          {item.icon}
                        </div>
                        <span className="truncate">{item.label}</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECTION 4: DIRECT WHATSAPP CS HOTLINE */}
            <a
              href="https://wa.me/6282334554396?text=Halo%20Admin%20Prospect%20Education%20Jember,%20saya%20ingin%20konsultasi%20program"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-500/40 rounded-2xl text-emerald-200 transition active:scale-98 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-xs">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Konsultasi CS WhatsApp</p>
                  <p className="text-[10px] text-emerald-300 font-semibold">0823-3455-4396 (Balung, Jember)</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-emerald-400" />
            </a>

            {/* SECTION 5: UTILITY CONTROLS (LANGUAGE & THEME) */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              {/* Language Selector */}
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setLanguage('id')}
                    className={`px-2.5 py-1 text-xs font-extrabold rounded-lg transition ${
                      language === 'id' ? 'bg-[#0F3D7A] text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    ID
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-2.5 py-1 text-xs font-extrabold rounded-lg transition ${
                      language === 'en' ? 'bg-[#0F3D7A] text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-slate-200 rounded-xl border border-slate-800 text-xs font-bold"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
                <span>{theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
