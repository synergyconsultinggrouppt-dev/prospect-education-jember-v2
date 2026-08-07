import React from 'react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../BrandLogo';
import {
  ShieldCheck,
  GraduationCap,
  ArrowRight,
  Sparkles,
  Building2,
  Users,
  Award,
  CheckCircle,
  Phone,
  Plane,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setActiveTab, setRole, t } = useApp();

  return (
    <section className="relative bg-gradient-to-br from-[#071E3D] via-[#0F3D7A] to-[#1E40AF] text-white overflow-hidden py-12 sm:py-16 md:py-20 border-b border-blue-900/50">
      {/* Background Subtle Radial Patterns & Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-sky-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Heading & CTAs */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-amber-300/40 text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="uppercase tracking-wider">{t('LEGAL | AMAN | TERPERCAYA - CABANG JEMBER', 'LEGAL | SAFE | TRUSTED - JEMBER BRANCH')}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight font-serif">
            {t('Wujudkan Impian', 'Realize Your Dream')} <br />
            <span className="text-amber-300 drop-shadow-xs">
              {t('Kuliah di Taiwan', 'Study in Taiwan')}
            </span>{' '}
            &{' '}
            <span className="text-sky-200">
              {t('Karier di Jepang', 'Career in Japan')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-100 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
            {t(
              'Sistem Informasi Terpadu Prospect Education Cabang Jember. Kemudahan pendaftaran online, verifikasi dokumen transparan, pembayaran digital otomatis, hingga pembelajaran online (LMS).',
              'Integrated Information System of Prospect Education Jember Branch. Seamless online registration, transparent document verification, automated digital payments, and online learning (LMS).'
            )}
          </p>

          {/* Key Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-semibold text-slate-100 max-w-xl mx-auto lg:mx-0 pt-1">
            <div className="flex items-center gap-2 justify-center lg:justify-start bg-white/5 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-xs">
              <CheckCircle className="w-4 h-4 text-amber-300 shrink-0" />
              <span>{t('Program Kuliah Taiwan IFP 1+4 (Tanpa Syarat TOCFL)', 'Taiwan IFP 1+4 Study Program')}</span>
            </div>
            <div className="flex items-center gap-2 justify-center lg:justify-start bg-white/5 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-xs">
              <CheckCircle className="w-4 h-4 text-amber-300 shrink-0" />
              <span>{t('Program Magang Jepang IM Japan (Kemnaker)', 'Japan Internship IM Japan (Ministry of Manpower)')}</span>
            </div>
            <div className="flex items-center gap-2 justify-center lg:justify-start bg-white/5 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-xs">
              <CheckCircle className="w-4 h-4 text-amber-300 shrink-0" />
              <span>{t('Program Kerja Tokutei Ginou SSW Jepang', 'Tokutei Ginou SSW Japan Work Program')}</span>
            </div>
            <div className="flex items-center gap-2 justify-center lg:justify-start bg-white/5 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-xs">
              <CheckCircle className="w-4 h-4 text-amber-300 shrink-0" />
              <span>{t('Pelatihan Bahasa & Pendampingan Keberangkatan', 'Language Training & Departure Assistance')}</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-3">
            <button
              onClick={() => {
                setActiveTab('pendaftaran');
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-amber-400 hover:bg-amber-300 active:scale-98 text-slate-950 font-extrabold text-sm px-7 py-3.5 rounded-xl shadow-lg hover:shadow-amber-400/20 transition-all cursor-pointer"
            >
              <GraduationCap className="w-5 h-5 text-slate-950" />
              <span>{t('Daftar Online Sekarang', 'Apply Online Now')}</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>

            <button
              onClick={() => setActiveTab('program')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 active:scale-98 text-white font-bold text-sm px-6 py-3.5 rounded-xl border border-white/30 backdrop-blur-sm transition shadow-sm cursor-pointer"
            >
              <span>{t('Lihat Detail Program', 'View Program Details')}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Visual Showcase Card */}
        <div className="lg:col-span-5 relative">
          <div className="bg-white/10 backdrop-blur-xl p-6 sm:p-7 rounded-3xl border border-white/20 shadow-2xl space-y-5 text-white">
            {/* Header badge inside card */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
              <BrandLogo variant="card" />
              <span className="text-[10px] bg-white/20 text-amber-300 font-extrabold px-3 py-1 rounded-full border border-amber-300/40">
                LOKASI BALUNG JEMBER
              </span>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/10 shadow-inner">
                <div className="flex items-center gap-2 text-amber-400 mb-1">
                  <Users className="w-4 h-4" />
                  <span className="text-[10px] uppercase font-bold text-slate-300">Total Peserta</span>
                </div>
                <p className="text-2xl font-black text-white">180+</p>
                <p className="text-[10px] text-slate-300">Aktif & Alumni Jember</p>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/10 shadow-inner">
                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                  <Award className="w-4 h-4" />
                  <span className="text-[10px] uppercase font-bold text-slate-300">Keberhasilan</span>
                </div>
                <p className="text-2xl font-black text-emerald-400">99.2%</p>
                <p className="text-[10px] text-slate-300">Lolos Visa & Campus</p>
              </div>
            </div>

            {/* Target Countries Card */}
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-white/10 space-y-2.5">
              <span className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Program Unggulan Resmi:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl text-slate-100">
                  <p className="font-bold text-amber-300 flex items-center justify-between">
                    <span>🇹🇼 Taiwan</span>
                    <span className="text-[9px] bg-sky-500/30 text-sky-200 px-1.5 py-0.5 rounded font-bold">IFP 1+4</span>
                  </p>
                  <p className="text-[10px] text-slate-300 mt-1">1 Thn Bahasa di Taiwan + 4 Thn S1</p>
                </div>

                <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl text-slate-100">
                  <p className="font-bold text-amber-300 flex items-center justify-between">
                    <span>🇯🇵 Jepang</span>
                    <span className="text-[9px] bg-rose-500/30 text-rose-200 px-1.5 py-0.5 rounded font-bold">SSW / IM</span>
                  </p>
                  <p className="text-[10px] text-slate-300 mt-1">Magang Kemnaker & Tokutei Ginou</p>
                </div>
              </div>
            </div>

            {/* Quick Contact Card */}
            <div className="pt-1 flex items-center justify-between text-xs text-slate-200 bg-slate-900/90 p-3.5 rounded-xl border border-white/10">
              <div>
                <p className="text-[10px] text-slate-300 font-medium">Konsultasi Tatap Muka / WA:</p>
                <p className="font-black text-emerald-400 text-sm">0823-3455-4396</p>
              </div>
              <a
                href="https://wa.me/6282334554396"
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg transition text-xs flex items-center gap-1.5 shadow-md"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Chat WA</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
