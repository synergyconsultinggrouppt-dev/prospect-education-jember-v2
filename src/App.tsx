import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AIConsultantModal } from './components/AIConsultantModal';
import { LoaVerificationModal } from './components/LoaVerificationModal';
import { LoginModal } from './components/auth/LoginModal';

// Public Sections
import { HeroSection } from './components/public/HeroSection';
import { CompanyProfileSection } from './components/public/CompanyProfileSection';
import { ProgramsSection } from './components/public/ProgramsSection';
import { PendaftaranFlowSection } from './components/public/PendaftaranFlowSection';
import { LayananSection } from './components/public/LayananSection';
import { TestimonialsSection } from './components/public/TestimonialsSection';
import { BeritaSection } from './components/public/BeritaSection';
import { GaleriSection } from './components/public/GaleriSection';
import { FAQSection } from './components/public/FAQSection';
import { KritikSaranSection } from './components/public/KritikSaranSection';
import { KontakSection } from './components/public/KontakSection';
import { RegistrationForm } from './components/public/RegistrationForm';

// Role Dashboards
import { StudentDashboard } from './components/student/StudentDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { InvestorDashboard } from './components/investor/InvestorDashboard';
import { WebmasterDashboard } from './components/webmaster/WebmasterDashboard';

export function App() {
  const {
    currentRole,
    setRole,
    activeTab,
    setActiveTab,
    websiteFeatures,
    websiteSettings,
    candidates = [],
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
    loginModalRole,
    loginModalInitialTab,
  } = useApp();
  const [verifyLoaQuery, setVerifyLoaQuery] = useState<string>('');
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  useEffect(() => {
    // Check if URL contains verifyLoa parameter (e.g. from QR Code scan)
    const urlParams = new URLSearchParams(window.location.search);
    const loaCode = urlParams.get('verifyLoa') || urlParams.get('loa');
    if (loaCode) {
      setVerifyLoaQuery(loaCode);
      setIsVerifyModalOpen(true);
    }
  }, []);

  // Dynamic SEO Meta
  const getSEOMeta = () => {
    if (currentRole === 'student') {
      return {
        title: 'Portal Peserta LMS & Biodata | Prospect Education Jember',
        description: 'Portal mandiri peserta Prospect Education Cabang Jember. Akses LMS modul pembelajaran bahasa, status dokumen, pembayaran digital, dan Surat LoA.'
      };
    }
    if (currentRole === 'admin' || currentRole === 'superadmin') {
      return {
        title: 'Dashboard Manajemen Admin | Prospect Education Jember',
        description: 'Sistem manajemen data peserta, verifikasi dokumen, rekapitulasi keuangan kas, dan persetujuan Surat LoA Prospect Education Jember.'
      };
    }
    if (currentRole === 'investor') {
      return {
        title: 'Portal Investor & Laporan Keuangan | Prospect Education Jember',
        description: 'Dashboard transparansi keuangan, dividen, dan perkembangan peserta Prospect Education Cabang Jember.'
      };
    }
    if (currentRole === 'webmaster') {
      return {
        title: 'Webmaster & System Control | Prospect Education Jember',
        description: 'Pengelola fitur publik, konfigurasi sistem, dan SEO website Prospect Education Jember.'
      };
    }

    switch (activeTab) {
      case 'taiwan':
        return {
          title: 'Program Kuliah & Beasiswa Taiwan | Prospect Education Jember',
          description: 'Informasi lengkap program Kuliah S1/S2 di Taiwan, jalur beasiswa, persiapan Bahasa Mandarin (TOCFL), dan jaminan legalitas berkas di Jember.'
        };
      case 'jepang':
        return {
          title: 'Program Kerja & Magang Jepang (Tokutei Ginou) | Prospect Jember',
          description: 'Program persiapan kerja dan magang di Jepang (SSW/Tokutei Ginou), pelatihan Bahasa Jepang JLPT/NAT-TEST, dan pendampingan visa kerja.'
        };
      case 'pendaftaran':
        return {
          title: 'Pendaftaran Online Resmi | Prospect Education Cabang Jember',
          description: 'Form pendaftaran calon peserta kuliah Taiwan & magang Jepang online. Mudah, cepat, dan terhubung langsung dengan Admin Jember.'
        };
      case 'lms':
        return {
          title: 'LMS Pembelajaran Mandarin & Jepang | Prospect Education Jember',
          description: 'Sistem Belajar Digital (LMS) interaktif untuk peserta Prospect Education Jember. Modul audio, latihan kosa kata, dan kuis online.'
        };
      case 'profil':
      case 'company':
        return {
          title: 'Profil Lembaga & Legalitas | Prospect Education Cabang Jember',
          description: 'Mengenal Profil Prospect Education Cabang Jember, struktur organisasi, izin operasional resmi, dan alamat kantor di Balung Lor, Jember.'
        };
      case 'berita':
        return {
          title: 'Berita & Pengumuman Terbaru | Prospect Education Jember',
          description: 'Kumpulan berita terkini, jadwal keberangkatan siswa ke Taiwan & Jepang, serta event sosialisasi pendidikan di Jember.'
        };
      case 'layanan':
        return {
          title: 'Layanan Terjemah & Pengurusan Dokumen | Prospect Jember',
          description: 'Jasa penerjemah tersumpah Mandarin/Jepang, legalisasi ijazah/transkrip, pengurusan paspor, dan konsolidasi berkas visa.'
        };
      case 'galeri':
        return {
          title: 'Galeri Kegiatan & Dokumentasi Siswa | Prospect Jember',
          description: 'Dokumentasi kelas belajar bahasa, pelepasan siswa ke bandara, suasana kampus di Taiwan, dan aktivitas kerja di Jepang.'
        };
      case 'kontak':
        return {
          title: 'Hubungi Alamat Kantor & CS WhatsApp | Prospect Jember',
          description: 'Alamat lengkap kantor Prospect Education Cabang Jember di Balung Lor, kontak WhatsApp fast response 0823-3455-4396, dan jam operasional.'
        };
      default:
        return {
          title: 'Prospect Education Cabang Jember | Kuliah Taiwan & Kerja Jepang Legal',
          description: 'Website Resmi Prospect Education Cabang Jember. Pusat Konsultasi Pendidikan Kuliah ke Taiwan, Program Magang Kerja ke Jepang, Kursus Bahasa Mandarin & Jepang, serta Layanan Dokumen Legal Terpercaya di Balung, Jember.'
        };
    }
  };

  const seo = getSEOMeta();

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-100 font-sans text-slate-800 flex flex-col justify-between selection:bg-[#0F3D7A] selection:text-amber-300">
      <Helmet>
        <title>{seo.title}</title>
        <meta name="title" content={seo.title} />
        <meta name="description" content={seo.description} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="twitter:title" content={seo.title} />
        <meta property="twitter:description" content={seo.description} />
      </Helmet>

      {/* Top Fixed Header Navigation */}
      <div>
        <Header />

        {/* Main Content View Switcher */}
        <main className="min-h-[80vh]">
          {/* Visitor / Public View */}
          {currentRole === 'visitor' && (
            <div>
              {(activeTab === 'home' || activeTab === 'beranda') && (
                <>
                  <HeroSection />
                  <CompanyProfileSection />
                  <ProgramsSection />
                  <PendaftaranFlowSection />
                  <LayananSection />
                  <TestimonialsSection />
                  <BeritaSection />
                  <GaleriSection />
                  <FAQSection />
                  <KritikSaranSection />
                  <KontakSection />
                </>
              )}

              {(activeTab === 'profil' || activeTab === 'company') && (
                <>
                  <CompanyProfileSection />
                  <KontakSection />
                </>
              )}

              {(activeTab === 'program' || activeTab === 'taiwan' || activeTab === 'jepang' || activeTab === 'programs') && (
                <>
                  <ProgramsSection />
                  <KontakSection />
                </>
              )}

              {activeTab === 'layanan' && (
                <>
                  <LayananSection />
                  <KontakSection />
                </>
              )}

              {activeTab === 'pendaftaran' && (
                <>
                  <PendaftaranFlowSection />
                  <RegistrationForm />
                </>
              )}

              {activeTab === 'lms' && (
                <div className="py-16 bg-slate-50 border-b border-slate-200">
                  <div className="max-w-7xl mx-auto px-4 space-y-12">
                    {/* LMS Banner */}
                    <div className="bg-gradient-to-r from-[#092852] via-[#0F3D7A] to-[#1653a1] text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-blue-400/30 text-center space-y-6 relative overflow-hidden">
                      <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                      
                      <span className="text-xs font-bold text-amber-300 uppercase tracking-widest bg-blue-950/80 px-4 py-1.5 rounded-full border border-blue-700 inline-block">
                        LEARNING MANAGEMENT SYSTEM (LMS)
                      </span>

                      <h2 className="text-3xl sm:text-4xl font-black font-serif tracking-tight text-white">
                        Sistem Pembelajaran & Persiapan Bahasa Online
                      </h2>

                      <p className="max-w-2xl mx-auto text-slate-200 text-sm leading-relaxed">
                        Fasilitas e-learning terpadu untuk calon peserta program Taiwan IFP 1+4 dan magang Jepang. Dilengkapi modul digital Mandarin Basic, Bahasa Inggris Basic, Pengenalan Budaya Taiwan, Bahasa Jepang (JLPT N5-N3), serta penerbitan Sertifikat Bahasa dari Prospect Education.
                      </p>

                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                          onClick={() => {
                            openLoginModal('student');
                          }}
                          className="bg-[#F59E0B] hover:bg-[#d97706] text-slate-950 font-black text-xs px-6 py-3.5 rounded-xl transition shadow-xl inline-flex items-center gap-2 cursor-pointer"
                        >
                          <span>Masuk Portal Peserta & Buka LMS</span>
                        </button>
                      </div>
                    </div>

                    {/* LMS Preview Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-800">
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                        <div className="w-10 h-10 bg-blue-50 text-[#0F3D7A] border border-blue-200 font-bold rounded-xl flex items-center justify-center font-serif">
                          01
                        </div>
                        <h3 className="font-bold text-base text-slate-900">Pembekalan Mandarin & Inggris Basic</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Pembekalan Mandarin Basic (Pinyin & Zhuyin), Inggris Basic, serta Budaya Taiwan di Prospect Education Jember hingga penerbitan Sertifikat Bahasa resmi (tanpa wajib TOCFL).
                        </p>
                      </div>

                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                        <div className="w-10 h-10 bg-amber-100 text-amber-800 font-bold rounded-xl flex items-center justify-center font-serif">
                          02
                        </div>
                        <h3 className="font-bold text-base text-slate-900">Modul Bahasa Jepang JLPT N5-N3</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Pembelajaran Hiragana, Katakana, Kanji, Tata Bahasa (Bunpou), serta percakapan sehari-hari (Kaiwa) khusus magang IM Japan & SSW.
                        </p>
                      </div>

                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                        <div className="w-10 h-10 bg-emerald-100 text-emerald-800 font-bold rounded-xl flex items-center justify-center font-serif">
                          03
                        </div>
                        <h3 className="font-bold text-base text-slate-900">Bank Soal & Tryout Otomatis</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Fitur simulasi ujian berbasis waktu dengan koreksi otomatis dan grafik perkembangan skor individual peserta.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(activeTab === 'testimoni' || activeTab === 'testimonials') && (
                <>
                  <TestimonialsSection />
                  <KontakSection />
                </>
              )}

              {activeTab === 'berita' && (
                <>
                  <BeritaSection />
                  <KontakSection />
                </>
              )}

              {activeTab === 'galeri' && (
                <>
                  <GaleriSection />
                  <KontakSection />
                </>
              )}

              {activeTab === 'faq' && (
                <>
                  <FAQSection />
                  <KontakSection />
                </>
              )}

              {(activeTab === 'kritik' || activeTab === 'kritik_saran' || activeTab === 'kritiksaran') && (
                <>
                  <KritikSaranSection />
                  <KontakSection />
                </>
              )}

              {activeTab === 'kontak' && <KontakSection />}
            </div>
          )}

          {/* Student / Peserta Role View */}
          {currentRole === 'student' && <StudentDashboard />}

          {/* Webmaster / Pengelola Website Role View */}
          {currentRole === 'webmaster' && <WebmasterDashboard />}

          {/* Admin & Super Admin Role View */}
          {(currentRole === 'admin' || currentRole === 'superadmin' || currentRole === 'super_admin') && <AdminDashboard />}

          {/* Investor / Pemodal Role View */}
          {currentRole === 'investor' && <InvestorDashboard />}
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* AI Virtual Consultant Assistant Modal */}
      <AIConsultantModal />

      {/* Global QR Code & LoA Verification Modal */}
      <LoaVerificationModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        candidates={candidates}
        initialLoaNumber={verifyLoaQuery}
      />

      {/* User Login & Password Authentication Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        initialRole={loginModalRole}
        initialTab={loginModalInitialTab}
      />
    </div>
  );
}

export default App;
