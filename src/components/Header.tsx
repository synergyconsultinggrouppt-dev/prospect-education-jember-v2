import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';
import { NotificationBell } from './NotificationBell';
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation & click outside handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (mobileMenuOpen) setMobileMenuOpen(false);
        if (moreDropdownOpen) setMoreDropdownOpen(false);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMoreDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen, moreDropdownOpen]);

  // Primary navigation links shown directly on desktop/laptop navbar
  const primaryNavItems = [
    { id: 'beranda', label: t('Beranda', 'Home') },
    { id: 'company', label: t('Company Profile', 'Company Profile') },
    { id: 'program', label: t('Program', 'Programs') },
    { id: 'pendaftaran', label: t('Pendaftaran', 'Registration') },
    { id: 'lms', label: t('LMS Belajar', 'LMS Learning') },
    { id: 'layanan', label: t('Layanan', 'Services') },
    { id: 'berita', label: t('Berita', 'News') },
    { id: 'galeri', label: t('Galeri', 'Gallery') },
  ];

  // Secondary dropdown links under "Lainnya"
  const secondaryNavItems = [
    { id: 'faq', label: t('FAQ / Tanya Jawab', 'FAQ') },
    { id: 'kritiksaran', label: t('Kritik & Saran', 'Feedback') },
    { id: 'kontak', label: t('Hubungi Kami', 'Contact Us') },
  ];

  // All nav items for mobile drawer
  const allNavItems = [...primaryNavItems, ...secondaryNavItems];

  const handleNavClick = (id: string) => {
    if (id === 'lms' && currentRole === 'student') {
      setActiveTab('lms');
      return;
    }
    if (currentRole !== 'visitor' && id !== 'pendaftaran') {
      setRole('visitor');
    }
    setActiveTab(id);
    setMoreDropdownOpen(false);
  };

  const isSecondaryActive = secondaryNavItems.some((item) => item.id === activeTab);

  return (
    <header role="banner" className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-sm transition-colors duration-200">
      {/* Top Banner Contact Info */}
      <div className="bg-[#0F3D7A] text-white text-[10px] sm:text-xs py-1 px-3 sm:px-6 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 truncate text-slate-100">
            <span className="flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 text-[#F59E0B] shrink-0" aria-hidden="true" />
              <span className="truncate">Jl. Balung-Jenggawah, Wetan Kali, Balung Lor, Jember</span>
            </span>
            <span className="hidden lg:inline text-blue-300" aria-hidden="true">|</span>
            <span className="hidden lg:flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
              <span className="font-semibold text-amber-300">{t('LEGAL | AMAN | TERPERCAYA', 'LEGAL | SAFE | TRUSTED')}</span>
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href="https://wa.me/6282334554396"
              target="_blank"
              rel="noreferrer"
              aria-label="Hubungi WhatsApp 0823-3455-4396"
              className="flex items-center gap-1 bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-2.5 py-0.5 rounded font-medium transition text-[10px] sm:text-xs"
            >
              <Phone className="w-3 h-3" aria-hidden="true" />
              <span>WA: 0823-3455-4396</span>
            </a>
            <span className="text-slate-300 hidden sm:inline" aria-hidden="true">|</span>
            <span className="text-amber-300 font-medium hidden sm:inline">{t('Operasional 2026', 'Year 2026')}</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-3">
        {/* Brand Logo Header */}
        <BrandLogo
          onClick={() => {
            if (currentRole !== 'visitor') setRole('visitor');
            setActiveTab('beranda');
          }}
        />

        {/* Laptop & Desktop Navigation Menu (Visible from lg 1024px breakpoint) */}
        <nav aria-label="Navigasi Utama Platform" className="hidden lg:flex items-center gap-1 xl:gap-1.5">
          {primaryNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`px-2.5 xl:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#0F3D7A] focus-visible:outline-hidden ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/80 text-[#0F3D7A] dark:text-amber-300 font-bold border-b-2 border-[#0F3D7A] dark:border-amber-500 shadow-xs'
                    : 'text-slate-700 dark:text-slate-200 hover:text-[#0F3D7A] dark:hover:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {/* Secondary Dropdown Menu ("Lainnya") */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              aria-expanded={moreDropdownOpen}
              className={`flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isSecondaryActive
                  ? 'bg-blue-50 dark:bg-blue-950/80 text-[#0F3D7A] dark:text-amber-300 font-bold border-b-2 border-[#0F3D7A] dark:border-amber-500'
                  : 'text-slate-700 dark:text-slate-200 hover:text-[#0F3D7A] dark:hover:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{t('Lainnya', 'More')}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu Content */}
            {moreDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                {secondaryNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left px-4 py-2 text-xs font-medium transition cursor-pointer flex items-center justify-between ${
                      activeTab === item.id
                        ? 'bg-blue-50 dark:bg-blue-950/80 text-[#0F3D7A] dark:text-amber-300 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Action Buttons, Theme Toggle & Language Switcher */}
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

          <div className="hidden sm:flex items-center gap-2 shrink-0">
            {currentRole === 'visitor' ? (
              <button
                onClick={() => openLoginModal('student')}
                aria-label="Masuk Ke Akun Sistem"
                className="flex items-center gap-1.5 bg-[#0F3D7A] hover:bg-[#1653a1] text-amber-300 text-xs font-bold px-3 py-2 rounded-xl shadow-md border border-amber-400/30 transition cursor-pointer shrink-0"
              >
                <LogIn className="w-4 h-4 text-amber-300" aria-hidden="true" />
                <span>{t('Masuk / Login', 'Sign In')}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-medium shadow-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold truncate max-w-[120px]">
                    {currentUserSession?.fullName || (currentRole === 'student' ? currentCandidate?.fullName || 'Peserta' : currentRole.toUpperCase())}
                  </span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold uppercase border border-amber-500/30">
                    {currentRole}
                  </span>
                </div>

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
          </div>

          {/* Prominent & Highly Visible Mobile/Tablet Menu Button (Hidden on lg 1024px+) */}
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

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-navigation-drawer" className="lg:hidden bg-slate-900 dark:bg-slate-950 text-slate-100 border-t border-slate-800 p-4 space-y-3 animate-in slide-in-from-top duration-200">
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

          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-800" role="navigation" aria-label="Navigasi Seluler">
            {allNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  handleNavClick(item.id);
                  setMobileMenuOpen(false);
                }}
                aria-current={activeTab === item.id ? 'page' : undefined}
                className={`text-left px-3 py-2 rounded-md text-xs font-medium transition cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-[#0F3D7A] text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Quick Portal Menu Navigation for Mobile */}
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

          <div className="pt-1 flex flex-col gap-2">
            <button
              onClick={() => {
                setActiveTab('pendaftaran');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#F59E0B] text-slate-950 font-bold text-xs py-2.5 rounded-lg shadow-sm cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-slate-950" aria-hidden="true" />
              <span>{t('Daftar Online Sekarang', 'Apply Online Now')}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

