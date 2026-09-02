import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';
import { NotificationBell } from './NotificationBell';
import { UserRole } from '../types';
import {
  Shield,
  Phone,
  Menu,
  X,
  GraduationCap,
  MapPin,
  CheckCircle2,
  UserCheck,
  Globe,
  Sun,
  Moon,
  ChevronDown,
  LogIn,
  LogOut,
  Lock,
  UserPlus,
  Building2,
  TrendingUp,
  Crown,
  Sparkles,
  Briefcase,
  KeyRound,
  Users,
  LayoutDashboard,
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
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const loginDropdownRef = useRef<HTMLDivElement>(null);
  const registerDropdownRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation & click outside handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (mobileMenuOpen) setMobileMenuOpen(false);
        if (moreDropdownOpen) setMoreDropdownOpen(false);
        if (loginDropdownOpen) setLoginDropdownOpen(false);
        if (registerDropdownOpen) setRegisterDropdownOpen(false);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMoreDropdownOpen(false);
      }
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
  }, [mobileMenuOpen, moreDropdownOpen, loginDropdownOpen, registerDropdownOpen]);

  // Primary navigation links shown directly on desktop/laptop navbar
  const primaryNavItems = [
    { id: 'beranda', label: t('Beranda', 'Home') },
    { id: 'company', label: t('Company Profile', 'Company Profile') },
    { id: 'program', label: t('Program', 'Programs') },
    { id: 'pendaftaran', label: t('Pendaftaran', 'Registration') },
    { id: 'lms', label: t('LMS Belajar', 'LMS Learning') },
    { id: 'kontak', label: t('Kontak', 'Contact') },
  ];

  // Secondary links placed inside the "Lainnya" (More) dropdown
  const secondaryNavItems = [
    { id: 'layanan', label: t('Layanan Terjemah & Dokumen', 'Translation & Docs') },
    { id: 'berita', label: t('Berita & Artikel', 'News & Articles') },
    { id: 'galeri', label: t('Galeri Dokumentasi', 'Photo Gallery') },
    { id: 'testimoni', label: t('Testimoni Alumni', 'Testimonials') },
    { id: 'faq', label: t('Tanya Jawab (FAQ)', 'FAQ') },
    { id: 'kritik', label: t('Kritik & Saran', 'Feedback') },
  ];

  // All combined items for mobile drawer
  const allNavItems = [
    ...primaryNavItems,
    ...secondaryNavItems,
  ];

  const handleNavClick = (tabId: string) => {
    if (currentRole !== 'visitor') {
      setRole('visitor');
    }
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);

    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isSecondaryActive = secondaryNavItems.some((item) => item.id === activeTab);

  const roleLoginOptions: { role: UserRole; title: string; subtitle: string; icon: React.ReactNode; color: string }[] = [
    {
      role: 'student',
      title: 'Portal Siswa / Peserta',
      subtitle: 'Akses LMS, Dokumen & LoA',
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
      subtitle: 'Persetujuan Final & Legalitas',
      icon: <Crown className="w-4 h-4 text-amber-400" />,
      color: 'hover:bg-amber-50 dark:hover:bg-amber-950/30',
    },
    {
      role: 'investor',
      title: 'Investor & Mitra Usaha',
      subtitle: 'Laporan Dividen & Keuangan',
      icon: <TrendingUp className="w-4 h-4 text-emerald-500" />,
      color: 'hover:bg-emerald-50 dark:hover:bg-emerald-950/30',
    },
    {
      role: 'webmaster',
      title: 'Webmaster IT',
      subtitle: 'Kontrol Sistem & Konfigurasi',
      icon: <Globe className="w-4 h-4 text-purple-500" />,
      color: 'hover:bg-purple-50 dark:hover:bg-purple-950/30',
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-200">
      {/* Top Emergency / Hotline / Official Verification Sub-Bar */}
      <div className="bg-gradient-to-r from-[#071E3D] via-[#0F3D7A] to-[#071E3D] text-slate-100 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[11px]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-amber-300 font-semibold tracking-wide">
              <Shield className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t('LKP Resmi Terdaftar Kemdikbud • Izin Operasional Jember', 'Officially Licensed LKP in Jember')}</span>
            </span>
            <span className="text-slate-400">•</span>
            <span className="flex items-center gap-1 text-slate-200">
              <MapPin className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              <span>Balung Lor, Jember, Jawa Timur</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/6282334554396?text=Halo%20Admin%20Prospect%20Education%20Jember,%20saya%20ingin%20konsultasi%20program"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-slate-200 hover:text-amber-300 font-medium transition cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
              <span>CS WhatsApp: 0823-3455-4396</span>
            </a>
            <span className="text-slate-500">|</span>
            <div className="flex items-center gap-1.5 text-emerald-300 font-semibold">
              <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t('Pendaftaran 2026 Dibuka', '2026 Intake Open')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between gap-2">
        {/* Brand Logo & Name */}
        <button
          onClick={() => handleNavClick('beranda')}
          aria-label="Kembali ke Beranda Prospect Education Jember"
          className="flex items-center gap-3 cursor-pointer group text-left shrink-0"
        >
          <div className="relative">
            <BrandLogo size="md" />
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 border border-white dark:border-slate-900"></span>
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-black text-base sm:text-lg tracking-tight text-[#0F3D7A] dark:text-white group-hover:text-amber-600 transition">
                PROSPECT
              </span>
              <span className="text-[10px] sm:text-xs font-bold bg-[#0F3D7A] text-amber-300 px-1.5 py-0.2 rounded tracking-wider shadow-xs">
                EDUCATION
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
              Cabang Jember • Jawa Timur
            </span>
          </div>
        </button>

        {/* Desktop Primary Navigation Menu */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5" role="navigation" aria-label="Navigasi Utama">
          {primaryNavItems.map((item) => {
            const isActive = currentRole === 'visitor' && activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-150 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0F3D7A] focus-visible:outline-hidden ${
                  isActive
                    ? 'bg-[#0F3D7A] text-amber-300 font-bold shadow-xs'
                    : 'text-slate-700 dark:text-slate-200 hover:text-[#0F3D7A] dark:hover:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {/* Secondary Links "Lainnya" Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              aria-expanded={moreDropdownOpen}
              aria-haspopup="true"
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-150 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0F3D7A] focus-visible:outline-hidden ${
                isSecondaryActive && currentRole === 'visitor'
                  ? 'bg-[#0F3D7A] text-amber-300 font-bold shadow-xs'
                  : 'text-slate-700 dark:text-slate-200 hover:text-[#0F3D7A] dark:hover:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{t('Lainnya', 'More')}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180 text-amber-400' : ''}`} />
            </button>

            {/* Dropdown Menu Popup */}
            {moreDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {t('Menu Tambahan', 'Additional Pages')}
                  </span>
                </div>
                {secondaryNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left px-3.5 py-2 text-xs transition cursor-pointer flex items-center justify-between ${
                      currentRole === 'visitor' && activeTab === item.id
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0F3D7A] dark:text-amber-300 font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{item.label}</span>
                    {currentRole === 'visitor' && activeTab === item.id && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Action Buttons, Auth Buttons, Theme Toggle & Language Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Notification Bell */}
          <NotificationBell />

          {/* Theme Toggle Button (Desktop & Tablet) */}
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
            title={theme === 'dark' ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
            className="hidden md:flex p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition items-center justify-center cursor-pointer shrink-0"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Language Toggle Switcher (Desktop & Tablet) */}
          <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs shrink-0" role="group" aria-label="Pilih Bahasa">
            <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 ml-1.5 mr-1" aria-hidden="true" />
            <button
              onClick={() => setLanguage('id')}
              aria-label="Bahasa Indonesia"
              aria-pressed={language === 'id'}
              className={`px-2 py-0.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0F3D7A] focus-visible:outline-hidden ${
                language === 'id'
                  ? 'bg-[#0F3D7A] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Bahasa Indonesia"
            >
              ID
            </button>
            <button
              onClick={() => setLanguage('en')}
              aria-label="English Language"
              aria-pressed={language === 'en'}
              className={`px-2 py-0.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#0F3D7A] focus-visible:outline-hidden ${
                language === 'en'
                  ? 'bg-[#0F3D7A] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="English"
            >
              EN
            </button>
          </div>

          {/* =========================================================================
              AUTH BUTTON GROUP (DAFTAR & LOGIN UNTUK SISWA, ADMIN, INVESTOR DLL)
             ========================================================================= */}
          {currentRole === 'visitor' ? (
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              {/* TOMBOL DAFTAR (WITH DROPDOWN: SISWA / INVESTOR) */}
              <div className="relative" ref={registerDropdownRef}>
                <button
                  type="button"
                  onClick={() => setRegisterDropdownOpen(!registerDropdownOpen)}
                  aria-expanded={registerDropdownOpen}
                  aria-haspopup="true"
                  className="flex items-center gap-1.5 bg-[#F59E0B] hover:bg-[#d97706] active:scale-95 text-slate-950 font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-md transition cursor-pointer border border-amber-600/30"
                >
                  <UserPlus className="w-4 h-4 text-slate-950" />
                  <span>{t('Daftar', 'Register')}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${registerDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {registerDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Pilihan Registrasi Baru
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setRegisterDropdownOpen(false);
                        openLoginModal('student', 'register');
                      }}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition cursor-pointer flex items-start gap-3"
                    >
                      <div className="p-1.5 bg-amber-100 dark:bg-amber-900/50 rounded-lg text-amber-700 dark:text-amber-300 mt-0.5">
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
                      <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg text-emerald-700 dark:text-emerald-300 mt-0.5">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">Daftar Mitra Investor</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Kemitraan Pemodal & Bagi Hasil</p>
                      </div>
                    </button>

                    <div className="p-2 border-t border-slate-100 dark:border-slate-800 mt-1">
                      <button
                        onClick={() => {
                          setRegisterDropdownOpen(false);
                          setActiveTab('pendaftaran');
                        }}
                        className="w-full text-center py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-[11px] font-bold transition cursor-pointer"
                      >
                        Form Pendaftaran Online 3 Langkah →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* TOMBOL LOGIN (WITH DROPDOWN: SISWA, ADMIN, SUPERADMIN, INVESTOR, WEBMASTER) */}
              <div className="relative" ref={loginDropdownRef}>
                <button
                  type="button"
                  onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                  aria-expanded={loginDropdownOpen}
                  aria-haspopup="true"
                  className="flex items-center gap-1.5 bg-[#0F3D7A] hover:bg-[#1653a1] active:scale-95 text-amber-300 font-bold text-xs px-3.5 py-2 rounded-xl shadow-md border border-amber-400/40 transition cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-amber-300" />
                  <span>{t('Masuk / Login', 'Sign In')}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${loginDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {loginDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3.5 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Pilih Portal Hak Akses
                      </span>
                      <span className="text-[9px] bg-blue-100 dark:bg-blue-900/60 text-[#0F3D7A] dark:text-amber-300 font-bold px-1.5 py-0.2 rounded">
                        5 Role Tersedia
                      </span>
                    </div>

                    <div className="space-y-0.5 px-1">
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

                    <div className="p-2 border-t border-slate-100 dark:border-slate-800 mt-1">
                      <button
                        onClick={() => {
                          setLoginDropdownOpen(false);
                          openLoginModal('student', 'login');
                        }}
                        className="w-full text-center py-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-[#0F3D7A] dark:text-amber-300 rounded-lg text-[11px] font-bold transition cursor-pointer"
                      >
                        ⚡ Buka Modal Login Lengkap →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* USER LOGGED IN STATE */
            <div className="flex items-center gap-2">
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
                <span className="font-bold truncate max-w-[120px]">
                  {currentUserSession?.fullName || (currentRole === 'student' ? currentCandidate?.fullName || 'Peserta' : currentRole.toUpperCase())}
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold uppercase border border-amber-500/30">
                  {currentRole}
                </span>
              </button>

              <button
                onClick={logout}
                title="Keluar dari Akun (Logout)"
                aria-label="Keluar dari Akun"
                className="flex items-center gap-1 bg-red-600/90 hover:bg-red-700 text-white text-xs font-bold px-2.5 py-2 rounded-xl transition cursor-pointer shrink-0 shadow-xs"
              >
                <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden xl:inline">Keluar</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle Button (Visible on mobile/tablet) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-[#0F3D7A] hover:bg-[#1653a1] active:scale-95 text-amber-300 font-bold text-xs rounded-xl shadow-md border border-amber-400/40 transition-all cursor-pointer shrink-0"
          >
            {mobileMenuOpen ? (
              <>
                <X className="w-5 h-5 text-amber-300" aria-hidden="true" />
                <span>TUTUP</span>
              </>
            ) : (
              <>
                <Menu className="w-5 h-5 text-amber-300" aria-hidden="true" />
                <span>MENU</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* =========================================================================
          MOBILE NAVIGATION DRAWER
         ========================================================================= */}
      {mobileMenuOpen && (
        <div id="mobile-navigation-drawer" className="lg:hidden bg-slate-900 dark:bg-slate-950 text-slate-100 border-t border-slate-800 p-4 space-y-4 animate-in slide-in-from-top duration-200 max-h-[85vh] overflow-y-auto">
          {/* Language & Theme Controls */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              <span>{t('Pilih Bahasa / Mode', 'Language / Theme')}</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
                className="p-1.5 rounded-lg bg-slate-800 text-amber-300 border border-slate-700 flex items-center gap-1 text-xs font-bold"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
                <span>{theme === 'dark' ? 'Terang' : 'Gelap'}</span>
              </button>

              <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700" role="group" aria-label="Pilih Bahasa Seluler">
                <button
                  onClick={() => setLanguage('id')}
                  aria-pressed={language === 'id'}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                    language === 'id' ? 'bg-[#0F3D7A] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ID
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  aria-pressed={language === 'en'}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                    language === 'en' ? 'bg-[#0F3D7A] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>

          {/* DEDICATED PORTAL MASUK & DAFTAR UNTUK MOBILE */}
          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Portal Masuk & Registrasi Terpadu</span>
              </span>
              <span className="text-[10px] text-slate-400">Pilih Role</span>
            </div>

            {/* Quick Registration Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openLoginModal('student', 'register');
                }}
                className="flex items-center justify-center gap-1.5 bg-[#F59E0B] text-slate-950 font-bold text-xs py-2 rounded-xl shadow-xs"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Daftar Siswa</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openLoginModal('investor', 'register');
                }}
                className="flex items-center justify-center gap-1.5 bg-emerald-600 text-white font-bold text-xs py-2 rounded-xl shadow-xs"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Daftar Investor</span>
              </button>
            </div>

            {/* Quick Role Login Buttons */}
            <div className="pt-1 space-y-1">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Masuk / Login Sebagai:
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openLoginModal('student', 'login');
                  }}
                  className="flex items-center gap-2 p-2 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-medium text-left border border-slate-800"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">Login Siswa</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openLoginModal('admin', 'login');
                  }}
                  className="flex items-center gap-2 p-2 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-medium text-left border border-slate-800"
                >
                  <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">Login Admin</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openLoginModal('superadmin', 'login');
                  }}
                  className="flex items-center gap-2 p-2 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-medium text-left border border-slate-800"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">Super Admin</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openLoginModal('investor', 'login');
                  }}
                  className="flex items-center gap-2 p-2 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-medium text-left border border-slate-800"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">Login Investor</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Links Grid */}
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-800" role="navigation" aria-label="Navigasi Seluler">
            {allNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  handleNavClick(item.id);
                  setMobileMenuOpen(false);
                }}
                aria-current={activeTab === item.id ? 'page' : undefined}
                className={`text-left px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                  activeTab === item.id && currentRole === 'visitor'
                    ? 'bg-[#0F3D7A] text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Quick Student Portal Submenu when Logged in */}
          {currentRole === 'student' && (
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Portal Peserta ({currentCandidate?.fullName?.split(' ')[0] || 'Siswa'})</span>
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
                  className="text-left px-2 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-lg text-[11px] font-medium"
                >
                  🎓 Ringkasan
                </button>
                <button
                  onClick={() => { setActiveTab('biodata'); setMobileMenuOpen(false); }}
                  className="text-left px-2 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-lg text-[11px] font-medium"
                >
                  👤 Biodata
                </button>
                <button
                  onClick={() => { setActiveTab('documents'); setMobileMenuOpen(false); }}
                  className="text-left px-2 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-lg text-[11px] font-medium"
                >
                  🛡️ Dokumen
                </button>
                <button
                  onClick={() => { setActiveTab('lms'); setMobileMenuOpen(false); }}
                  className="text-left px-2 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-lg text-[11px] font-bold border border-amber-500/30"
                >
                  📚 LMS Belajar
                </button>
                <button
                  onClick={() => { setActiveTab('loa'); setMobileMenuOpen(false); }}
                  className="text-left px-2 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-lg text-[11px] font-medium"
                >
                  📄 Surat LoA
                </button>
                <button
                  onClick={() => { setActiveTab('payment'); setMobileMenuOpen(false); }}
                  className="text-left px-2 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-lg text-[11px] font-medium"
                >
                  💳 Pembayaran
                </button>
              </div>
            </div>
          )}

          <div className="pt-1">
            <button
              onClick={() => {
                setActiveTab('pendaftaran');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#F59E0B] text-slate-950 font-extrabold text-xs py-2.5 rounded-xl shadow-sm cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-slate-950" aria-hidden="true" />
              <span>{t('Buka Form Pendaftaran Online', 'Open Online Registration Form')}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
