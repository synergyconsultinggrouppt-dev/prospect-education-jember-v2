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
  Plane,
  Briefcase,
  ChevronRight,
  Headphones,
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
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Public Menu Definitions grouped logically
  const publicMenuItems = [
    { id: 'beranda', label: t('Beranda', 'Home'), icon: <Home className="w-4 h-4" /> },
    { id: 'company', label: t('Profil Lembaga', 'Profile'), icon: <Building2 className="w-4 h-4" /> },
    { id: 'taiwan', label: t('Kuliah Taiwan (IFP 1+4)', 'Study Taiwan'), icon: <Plane className="w-4 h-4 text-sky-500" /> },
    { id: 'jepang', label: t('Kerja & Magang Jepang', 'Work Japan'), icon: <Briefcase className="w-4 h-4 text-rose-500" /> },
    { id: 'pendaftaran', label: t('Pendaftaran Online', 'Registration'), icon: <FileEdit className="w-4 h-4 text-amber-500" /> },
    { id: 'lms', label: t('LMS E-Learning', 'LMS E-Learning'), icon: <BookOpen className="w-4 h-4 text-blue-500" /> },
    { id: 'layanan', label: t('Layanan Dokumen', 'Services'), icon: <FileText className="w-4 h-4 text-purple-500" /> },
    { id: 'berita', label: t('Berita & Info', 'News'), icon: <Newspaper className="w-4 h-4 text-amber-600" /> },
    { id: 'galeri', label: t('Galeri Foto', 'Gallery'), icon: <ImageIcon className="w-4 h-4 text-emerald-600" /> },
    { id: 'testimoni', label: t('Testimoni Alumni', 'Testimonials'), icon: <Star className="w-4 h-4 text-amber-400" /> },
    { id: 'faq', label: t('FAQ / Tanya Jawab', 'FAQ'), icon: <HelpCircle className="w-4 h-4 text-indigo-500" /> },
    { id: 'kritik', label: t('Kritik & Saran', 'Feedback'), icon: <MessageSquare className="w-4 h-4 text-rose-500" /> },
    { id: 'kontak', label: t('Kontak & Lokasi', 'Contact'), icon: <Phone className="w-4 h-4 text-emerald-500" /> },
  ];

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

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-200">
      {/* =========================================================================
          1. TOP UTILITY BAR (HANYA MUNCUL DI DESKTOP / TABLET LEBAR)
         ========================================================================= */}
      <div className="bg-gradient-to-r from-[#071E3D] via-[#0F3D7A] to-[#071E3D] text-slate-100 text-xs py-1.5 px-4 sm:px-6 hidden lg:block border-b border-blue-900/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[11px]">
          {/* Left: Legal status & Location */}
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

          {/* Right: WA Hotline, Language & Theme Controls */}
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

            {/* Language Switcher */}
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

            {/* Theme Toggle */}
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
          2. MAIN HEADER BAR (BERSIH, LOGO UTUH, PROPORSIONAL DI SEMUA LAYAR)
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* BRAND LOGO AREA (SELALU UTUH & JELAS) */}
        <button
          onClick={() => handleNavClick('beranda')}
          aria-label="Kembali ke Beranda Prospect Education Jember"
          className="text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0F3D7A] rounded-xl focus-visible:outline-hidden shrink-0"
        >
          <BrandLogo variant="header" showSubtitle={true} />
        </button>

        {/* LOGGED IN ACTIVE ROLE PILL (DESKTOP) */}
        {currentRole !== 'visitor' && (
          <div className="hidden xl:flex items-center gap-2 bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-xs shrink-0">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-700 dark:text-slate-200 font-medium">Mode:</span>
            <span className="font-extrabold text-[#0F3D7A] dark:text-amber-300 uppercase tracking-wide">
              {currentRole}
            </span>
            <button
              onClick={() => {
                setRole('visitor');
                setActiveTab('beranda');
              }}
              className="ml-2 text-[11px] bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 px-2 py-0.5 rounded font-bold text-slate-800 dark:text-slate-100 transition cursor-pointer"
            >
              🌐 Web Publik
            </button>
          </div>
        )}

        {/* RIGHT CONTROLS */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Notification Bell (Hanya tampil di tablet & desktop agar mobile tetap bersih) */}
          <div className="hidden sm:block">
            <NotificationBell />
          </div>

          {/* =====================================================================
              DESKTOP ONLY: DAFTAR & MASUK BUTTONS (LAYAR >= lg)
             ===================================================================== */}
          {currentRole === 'visitor' ? (
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              {/* TOMBOL DAFTAR (DROPDOWN) */}
              <div className="relative" ref={registerDropdownRef}>
                <button
                  type="button"
                  onClick={() => setRegisterDropdownOpen(!registerDropdownOpen)}
                  aria-expanded={registerDropdownOpen}
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
              MOBILE ONLY: TOMBOL LOGIN CEPAT
             ===================================================================== */}
          {currentRole === 'visitor' ? (
            <button
              onClick={() => openLoginModal('student', 'login')}
              className="lg:hidden flex items-center gap-1 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs px-3 py-2 rounded-xl shadow-xs active:scale-95 transition shrink-0 border border-amber-500/50"
            >
              <LogIn className="w-3.5 h-3.5 text-slate-950" />
              <span>Masuk</span>
            </button>
          ) : (
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden flex items-center gap-1 bg-[#0F3D7A] text-amber-300 px-2.5 py-1.5 rounded-xl border border-amber-400/40 text-xs font-bold shadow-xs active:scale-95 transition shrink-0"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="capitalize">{currentRole}</span>
            </button>
          )}

          {/* =====================================================================
              MOBILE ONLY: TOMBOL HAMBURGER MENU (SANGAT MUDAH DIKLIK)
             ===================================================================== */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Buka Menu Lengkap"
            className="lg:hidden flex items-center justify-center p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 active:scale-95 transition cursor-pointer shrink-0"
          >
            <Menu className="w-5 h-5 text-slate-800 dark:text-slate-100" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          3. FULL DESKTOP MULTI-MENU NAVBAR (LAYAR BESAR >= lg)
         ========================================================================= */}
      <div className="hidden lg:block bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Complete Horizontal List of Menus */}
          <nav className="flex items-center flex-wrap gap-1 xl:gap-2" role="navigation" aria-label="Menu Navigasi Desktop">
            {publicMenuItems.map((item) => {
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
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#0F3D7A] text-amber-300 shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-[#0F3D7A] dark:hover:text-amber-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick CS Badge */}
          <div className="hidden xl:flex items-center gap-2 shrink-0 text-xs font-semibold text-slate-600 dark:text-slate-300 pl-3 border-l border-slate-200 dark:border-slate-800">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              Balung, Jember
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. MOBILE FULL-SCREEN MODAL DRAWER (STANDAR APLIKASI TINGGI, SOLID & RAPI)
         ========================================================================= */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="fixed inset-0 z-[99999] bg-slate-950 text-white flex flex-col h-[100dvh] w-screen overflow-hidden animate-in fade-in duration-200"
        >
          {/* Drawer Header Bar */}
          <div className="h-16 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-2">
              <BrandLogo variant="header" showSubtitle={false} />
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Tutup Menu"
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 px-3 py-1.5 rounded-xl border border-slate-700 active:scale-95 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
              <span className="text-xs font-bold text-white">Tutup</span>
            </button>
          </div>

          {/* Drawer Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 overscroll-contain pb-16">
            {/* 1. KARTU STATUS PENGGUNA ATAU AKSI DAFTAR/MASUK */}
            {currentRole !== 'visitor' ? (
              <div className="bg-gradient-to-br from-slate-900 to-blue-950 p-4 rounded-2xl border border-blue-800/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-base shadow-sm">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-white truncate max-w-[170px]">
                        {currentUserSession?.fullName ||
                          (currentRole === 'student' ? currentCandidate?.fullName || 'Peserta' : currentRole.toUpperCase())}
                      </p>
                      <span className="text-xs text-amber-300 font-bold uppercase tracking-wider block">
                        Portal: {currentRole}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar</span>
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setRole('visitor');
                      setActiveTab('beranda');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-[#0F3D7A] hover:bg-blue-700 text-amber-300 py-2.5 rounded-xl text-xs font-bold border border-amber-400/40 transition cursor-pointer"
                  >
                    <Globe className="w-4 h-4" />
                    <span>🌐 Buka Halaman Web Publik</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Pendaftaran & Portal Akun</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">Cabang Jember</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openLoginModal('student', 'register');
                    }}
                    className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs py-3 rounded-xl shadow-md active:scale-95 transition cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4 text-slate-950" />
                    <span>Daftar Siswa Baru</span>
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openLoginModal('student', 'login');
                    }}
                    className="flex items-center justify-center gap-1.5 bg-[#0F3D7A] hover:bg-[#1653a1] text-amber-300 font-bold text-xs py-3 rounded-xl shadow-md border border-amber-400/40 active:scale-95 transition cursor-pointer"
                  >
                    <LogIn className="w-4 h-4 text-amber-300" />
                    <span>Masuk Portal</span>
                  </button>
                </div>
              </div>
            )}

            {/* 2. PROGRAM PENDIDIKAN & KARIER LUAR NEGERI */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-amber-400" />
                  <span>Program Studi & Karier</span>
                </span>
              </div>

              <div className="space-y-1.5">
                <button
                  onClick={() => handleNavClick('taiwan')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left font-bold transition cursor-pointer border ${
                    activeTab === 'taiwan'
                      ? 'bg-[#0F3D7A] text-amber-300 border-amber-400/50'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-100 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-sky-500/20 text-sky-400 rounded-lg">
                      <Plane className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Kuliah di Taiwan (IFP 1+4)</p>
                      <p className="text-[11px] text-sky-300 font-normal">Program 1 Tahun Bahasa + 4 Tahun Sarjana (Tanpa TOCFL)</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>

                <button
                  onClick={() => handleNavClick('jepang')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left font-bold transition cursor-pointer border ${
                    activeTab === 'jepang'
                      ? 'bg-[#0F3D7A] text-amber-300 border-amber-400/50'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-100 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-500/20 text-rose-400 rounded-lg">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Kerja & Magang Jepang</p>
                      <p className="text-[11px] text-rose-300 font-normal">Tokutei Ginou (SSW) & Magang Resmi IM Japan</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>

                <button
                  onClick={() => handleNavClick('pendaftaran')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left font-bold transition cursor-pointer border ${
                    activeTab === 'pendaftaran'
                      ? 'bg-[#0F3D7A] text-amber-300 border-amber-400/50'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-100 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
                      <FileEdit className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Formulir Pendaftaran Online</p>
                      <p className="text-[11px] text-amber-300 font-normal">Registrasi Mudah 3 Langkah dengan Verifikasi Cepat</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>

                <button
                  onClick={() => handleNavClick('lms')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left font-bold transition cursor-pointer border ${
                    activeTab === 'lms'
                      ? 'bg-[#0F3D7A] text-amber-300 border-amber-400/50'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-100 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">LMS Pembelajaran Digital</p>
                      <p className="text-[11px] text-blue-300 font-normal">Akses Materi Mandarin & Jepang Siswa</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
              </div>
            </div>

            {/* 3. MENU INFORMASI & PROFIL LEMBAGA */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 px-1 block">
                Profil, Informasi & Layanan
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleNavClick('beranda')}
                  className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-bold transition text-left cursor-pointer border ${
                    activeTab === 'beranda'
                      ? 'bg-[#0F3D7A] text-amber-300 border-amber-400/50'
                      : 'bg-slate-900 text-slate-200 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <Home className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate">Beranda Utama</span>
                </button>

                <button
                  onClick={() => handleNavClick('company')}
                  className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-bold transition text-left cursor-pointer border ${
                    activeTab === 'company'
                      ? 'bg-[#0F3D7A] text-amber-300 border-amber-400/50'
                      : 'bg-slate-900 text-slate-200 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="truncate">Profil & Legalitas</span>
                </button>

                <button
                  onClick={() => handleNavClick('layanan')}
                  className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-bold transition text-left cursor-pointer border ${
                    activeTab === 'layanan'
                      ? 'bg-[#0F3D7A] text-amber-300 border-amber-400/50'
                      : 'bg-slate-900 text-slate-200 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="truncate">Layanan Dokumen</span>
                </button>

                <button
                  onClick={() => handleNavClick('berita')}
                  className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-bold transition text-left cursor-pointer border ${
                    activeTab === 'berita'
                      ? 'bg-[#0F3D7A] text-amber-300 border-amber-400/50'
                      : 'bg-slate-900 text-slate-200 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <Newspaper className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="truncate">Berita & Artikel</span>
                </button>

                <button
                  onClick={() => handleNavClick('galeri')}
                  className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-bold transition text-left cursor-pointer border ${
                    activeTab === 'galeri'
                      ? 'bg-[#0F3D7A] text-amber-300 border-amber-400/50'
                      : 'bg-slate-900 text-slate-200 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <ImageIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">Galeri Foto</span>
                </button>

                <button
                  onClick={() => handleNavClick('testimoni')}
                  className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-bold transition text-left cursor-pointer border ${
                    activeTab === 'testimoni'
                      ? 'bg-[#0F3D7A] text-amber-300 border-amber-400/50'
                      : 'bg-slate-900 text-slate-200 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <Star className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate">Testimoni Alumni</span>
                </button>

                <button
                  onClick={() => handleNavClick('faq')}
                  className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-bold transition text-left cursor-pointer border ${
                    activeTab === 'faq'
                      ? 'bg-[#0F3D7A] text-amber-300 border-amber-400/50'
                      : 'bg-slate-900 text-slate-200 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="truncate">FAQ / Tanya Jawab</span>
                </button>

                <button
                  onClick={() => handleNavClick('kritik')}
                  className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-bold transition text-left cursor-pointer border ${
                    activeTab === 'kritik'
                      ? 'bg-[#0F3D7A] text-amber-300 border-amber-400/50'
                      : 'bg-slate-900 text-slate-200 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="truncate">Kritik & Saran</span>
                </button>
              </div>
            </div>

            {/* 4. LOGIN KE MASING-MASING PORTAL (ROLE SELECTOR) */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 px-1 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Pintu Masuk Hak Akses Portal</span>
              </span>

              <div className="grid grid-cols-2 gap-2">
                {roleLoginOptions.map((opt) => (
                  <button
                    key={opt.role}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openLoginModal(opt.role, 'login');
                    }}
                    className="flex items-center gap-2 p-2.5 bg-slate-900 hover:bg-slate-800 rounded-xl text-left border border-slate-800 active:scale-95 transition cursor-pointer"
                  >
                    <div className="p-1.5 bg-slate-800 rounded-lg shrink-0">
                      {opt.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{opt.title.split(' ')[0]} {opt.title.split(' ')[1]}</p>
                      <p className="text-[10px] text-slate-400 truncate">Masuk Portal</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 5. KONTAK KANTOR BALUNG JEMBER & HOTLINE WHATSAPP */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                <Headphones className="w-4 h-4 text-emerald-400" />
                <span>Layanan Konsultasi & Lokasi Kantor</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                📍 Jl. Balung Lor, Balung, Kabupaten Jember, Jawa Timur 68161
              </p>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href="https://wa.me/6282334554396?text=Halo%20Admin%20Prospect%20Education%20Jember,%20saya%20ingin%20konsultasi%20program"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>CS WhatsApp</span>
                </a>

                <button
                  onClick={() => handleNavClick('kontak')}
                  className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2.5 rounded-xl border border-slate-700 transition cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Peta Lokasi</span>
                </button>
              </div>

              {/* Language & Theme Controls Inside Mobile Drawer */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-semibold">Bahasa:</span>
                  <div className="inline-flex bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
                    <button
                      onClick={() => setLanguage('id')}
                      className={`px-2 py-0.5 rounded font-bold transition cursor-pointer ${
                        language === 'id' ? 'bg-amber-400 text-slate-950' : 'text-slate-300'
                      }`}
                    >
                      ID
                    </button>
                    <button
                      onClick={() => setLanguage('en')}
                      className={`px-2 py-0.5 rounded font-bold transition cursor-pointer ${
                        language === 'en' ? 'bg-amber-400 text-slate-950' : 'text-slate-300'
                      }`}
                    >
                      EN
                    </button>
                  </div>
                </div>

                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs font-bold border border-slate-700 transition cursor-pointer"
                >
                  {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-200" />}
                  <span>{theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
