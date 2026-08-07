import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  ArrowRight,
  Sparkles,
  PhoneCall,
  GraduationCap,
  BookOpen,
  Briefcase,
  DollarSign,
  FileCheck,
  CheckCircle2,
  Filter,
} from 'lucide-react';

export interface FAQItem {
  id: string;
  category: 'pendaftaran' | 'taiwan' | 'jepang' | 'kursus' | 'biaya';
  categoryLabel: string;
  question: string;
  answer: string;
  popular?: boolean;
  tags: string[];
}

export const FAQSection: React.FC = () => {
  const { setActiveTab, setRole, t } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openFaqIds, setOpenFaqIds] = useState<string[]>(['faq-1', 'faq-2']); // Default open top popular ones

  const faqData: FAQItem[] = [
    // 1. Pendaftaran & Syarat
    {
      id: 'faq-1',
      category: 'pendaftaran',
      categoryLabel: 'Pendaftaran & Syarat',
      popular: true,
      question: 'Apa saja syarat utama untuk mendaftar Program Taiwan & Magang Jepang di LKP Prospect Education Jember?',
      answer:
        'Syarat umum meliputi: (1) Pria/Wanita berumur 18–28 tahun (untuk Taiwan) dan 18–30 tahun (untuk Jepang), (2) Lulusan SMA/SMK/MA sederajat atau Paket C, (3) Sehat jasmani dan rohani (bebas TBC, Hepatitis B, Tattoo/Tindik berlebih, dan Buta Warna parsial/total untuk program teknis), (4) Memiliki e-KTP, Kartu Keluarga, Akta Kelahiran, dan Ijazah asli, serta (5) Berkomitmen mengikuti pelatihan bahasa Mandarin/Jepang hingga lulus seleksi.',
      tags: ['syarat', 'persyaratan', 'pendaftaran', 'ijazah', 'umur', 'paket C'],
    },
    {
      id: 'faq-2',
      category: 'pendaftaran',
      categoryLabel: 'Pendaftaran & Syarat',
      popular: true,
      question: 'Apakah lulusan Paket C, SMK Swasta, atau dari luar Kabupaten Jember bisa ikut mendaftar?',
      answer:
        'Sangat bisa! LKP Prospect Education Jember menerima peserta dari seluruh Indonesia. Lulusan Paket C bersertifikat resmi Kemendikbud diakui penuh untuk pendaftaran Program Taiwan IFP 1+4 maupun Magang Kerja Jepang. Warga Jember dan sekitarnya juga berhak mendapatkan subsidi potongan biaya pendaftaran khusus daerah.',
      tags: ['paket C', 'luar kota', 'ijazah', 'jember', 'syarat lulusan'],
    },
    {
      id: 'faq-3',
      category: 'pendaftaran',
      categoryLabel: 'Pendaftaran & Syarat',
      question: 'Bagaimana alur pendaftaran dari awal hingga pengurusan visa?',
      answer:
        'Alurnya sangat mudah: (1) Isi formulir pendaftaran online di website ini, (2) Upload berkas KTP dan Ijazah, (3) Tim Administrasi akan menghubungi Anda via WhatsApp untuk verifikasi & tes pemetaan kemampuan, (4) Mengikuti pembekalan bahasa & orientasi di LKP Prospect Jember, dan (5) Pengurusan visa resmi luar negeri diproses secara terpadu bekerja sama dengan VISA HUB INDONESIA.',
      tags: ['alur', 'tahapan', 'seleksi', 'visa hub', 'medical checkup'],
    },

    // 2. Program Perkuliahan Taiwan IFP 1+4
    {
      id: 'faq-4',
      category: 'taiwan',
      categoryLabel: 'Kuliah S1 Taiwan IFP 1+4',
      popular: true,
      question: 'Apa itu Program Taiwan IFP 1+4 dan bagaimana syarat sertifikat bahasanya?',
      answer:
        'Program IFP 1+4 (International Foundation Program) adalah jalur resmi perkuliahan S1 di Taiwan (1 tahun persiapan bahasa di Taiwan + 4 tahun S1). Program IFP 1+4 tidak memiliki beasiswa, namun tidak diwajibkan mempunyai sertifikat Mandarin (TOCFL). Siswa yang mendaftar hanya dibekali Bahasa Mandarin Basic, Bahasa Inggris Basic, dan Pengenalan Budaya Taiwan di Prospect Education Jember. Setelah pembekalan, siswa akan menerima Sertifikat Bahasa resmi dari Prospect Education (bukan sertifikat TOCFL). Bahasa Mandarin akademik akan dipelajari langsung saat 1 tahun pertama di Taiwan dan S1 di 4 tahun berikutnya.',
      tags: ['taiwan', 'ifp 1+4', 'tanpa tocfl', 'sertifikat prospect', '1+4'],
    },
    {
      id: 'faq-5',
      category: 'taiwan',
      categoryLabel: 'Kuliah S1 Taiwan IFP 1+4',
      question: 'Apakah program IFP 1+4 merupakan beasiswa dan apakah mahasiswa bisa bekerja sambil kuliah?',
      answer:
        'Program IFP 1+4 bukan beasiswa, melainkan jalur perkuliahan S1 dengan 1 tahun persiapan bahasa. Namun, mahasiswa mendapatkan Work Permit resmi di Taiwan untuk bekerja paruh waktu / magang legal hingga 20 jam/minggu (gaji NT$ 185-210/jam atau ~Rp 13,8 juta/bulan) untuk menutup biaya hidup dan kuliah.',
      tags: ['taiwan', 'ifp 1+4', 'magang legal', 'work permit', 'fasilitas'],
    },
    {
      id: 'faq-6',
      category: 'taiwan',
      categoryLabel: 'Kuliah S1 Taiwan IFP 1+4',
      question: 'Sertifikat bahasa apa yang didapatkan peserta dari LKP Prospect Education Jember?',
      answer:
        'Setelah menyelesaikan pembekalan Bahasa Mandarin Basic, Bahasa Inggris Basic, dan Orientasi Budaya Taiwan di LKP Prospect Education Jember, peserta diterbitkan Sertifikat Bahasa & Pembekalan Resmi dari Prospect Education. Peserta TIDAK diwajibkan tes TOCFL di Indonesia karena Bahasa Mandarin lanjutan akan dipelajari selama 1 tahun pertama langsung di kampus Taiwan.',
      tags: ['sertifikat prospect', 'pembekalan', 'mandarin basic', 'inggris basic'],
    },

    // 3. Magang & Pekerja Terampil Jepang
    {
      id: 'faq-7',
      category: 'jepang',
      categoryLabel: 'Magang & SSW Jepang',
      popular: true,
      question: 'Apa perbedaan antara Program Magang IM Japan dan Tokutei Ginou (SSW)?',
      answer:
        'Magang IM Japan difokuskan untuk pelatihan keterampilan kerja (3-5 tahun) dengan tunjangan subsidi modal usaha dari pemerintah Jepang saat pulang ke Indonesia hingga ¥600.000. Sedangkan Tokutei Ginou (Specified Skilled Worker / SSW) adalah status pekerja profesional berkeahlian dengan kontrak kerja langsung hingga 5 tahun, gaji setara warga lokal Jepang (Rp 18 - 28 juta/bulan), dan opsi perpanjangan visa permanen.',
      tags: ['jepang', 'im japan', 'ssw', 'tokutei ginou', 'gaji jepang'],
    },
    {
      id: 'faq-8',
      category: 'jepang',
      categoryLabel: 'Magang & SSW Jepang',
      question: 'Sektor pekerjaan apa saja yang tersedia untuk Tokutei Ginou (SSW) di Jepang?',
      answer:
        'Sektor populer meliputi: (1) Kaigo (Perawat Lansia/Caregiver), (2) Pengolahan Makanan & Minuman (Food Processing), (3) Pertanian & Peternakan, (4) Perhotelan & Restoran, serta (5) Manufaktur & Pengelasan. LKP Prospect Jember memfasilitasi ujian kelulusan materi bidang kerja (Skill Test) & sertifikasi JLPT N4 / JFT-Basic.',
      tags: ['ssw', 'kaigo', 'caregiver', 'makanan', 'sektor kerja'],
    },
    {
      id: 'faq-9',
      category: 'jepang',
      categoryLabel: 'Magang & SSW Jepang',
      question: 'Berapa potensi gaji bersih dan apakah disediakan asrama oleh perusahaan Jepang?',
      answer:
        'Gaji kotor berkisar antara ¥180.000 – ¥260.000 (sekitar Rp 18 – 27 Juta/bulan). Setelah dipotong pajak, asuransi kesehatan, dan sewa apato/asrama perusahaan, gaji bersih rata-rata adalah Rp 14 – 20 Juta/bulan. Tempat tinggal (Apato) sudah disiapkan oleh perusahaan penerima (Kumiai/AOT). Pengurusan visa kerja luar negeri diproses bersama VISA HUB INDONESIA.',
      tags: ['gaji bersih', 'apato', 'tempat tinggal', 'potongan', 'penghasilan'],
    },

    // 4. Kursus & Pembelajaran LMS
    {
      id: 'faq-10',
      category: 'kursus',
      categoryLabel: 'Kursus & LMS',
      popular: true,
      question: 'Bagaimana metode belajar bahasa di LKP Prospect Jember & akses fasilitas LMS?',
      answer:
        'Kami menerapkan metode Blended Learning: Pengajaran tatap muka di kelas LKP kampus Balung, Jember, dikombinasikan dengan portal LMS e-Learning online 24/7. Seluruh peserta pendaftar mendapatkan akun LMS gratis untuk mengakses video tutorial, latihan soal interaktif, e-book materi, dan tryout otomatis.',
      tags: ['kursus', 'lms', 'e-learning', 'aplikasi', 'modul digital'],
    },
    {
      id: 'faq-11',
      category: 'kursus',
      categoryLabel: 'Kursus & LMS',
      question: 'Berapa lama durasi pelatihan bahasa sampai siap terbang berangkat?',
      answer:
        'Rata-rata pelatihan intensif berlangsung 3 hingga 5 bulan. Pengurusan dokumen visa luar negeri, MCU final, dan pendaftaran ke kampus/perusahaan diproses secara sinergis bersama VISA HUB INDONESIA sehingga begitu kelas selesai, proses keberangkatan siap dilaksanakan.',
      tags: ['durasi', 'lama belajar', 'keberangkatan', 'visa hub'],
    },

    // 5. Biaya, Subsidi & Dana Talangan
    {
      id: 'faq-12',
      category: 'biaya',
      categoryLabel: 'Biaya & Subsidi',
      popular: true,
      question: 'Berapa total estimasi biaya dan apakah bisa diangsur selama pelatihan?',
      answer:
        'LKP Prospect Education Jember berkomitmen menghadirkan skema biaya yang transparan tanpa biaya tersembunyi (No Hidden Fees). Seluruh biaya pelatihan dapat diangsur secara bertahap dalam 3 - 4 tahap selama periode kelas berlangsung.',
      tags: ['biaya', 'cicilan', 'angsuran', 'rincian', 'transparan'],
    },
    {
      id: 'faq-13',
      category: 'biaya',
      categoryLabel: 'Biaya & Subsidi',
      question: 'Apakah ada kemudahan khusus atau subsidi biaya pendaftaran bagi warga Kabupaten Jember?',
      answer:
        'Ya! Dalam rangka peningkatan kualitas SDM daerah Jember, LKP Prospect memberikan potongan biaya registrasi sebesar Rp 500.000 - Rp 1.000.000 serta prioritas fasilitasi tempat tinggal di asrama pelatihan bagi warga dengan KTP Kabupaten Jember dan sekitarnya (Banyuwangi, Bondowoso, Situbondo, Lumajang).',
      tags: ['subsidi jember', 'beasiswa daerah', 'potongan', 'ktp jember'],
    },
  ];

  const categories = [
    { id: 'all', label: 'Semua Pertanyaan', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'pendaftaran', label: 'Pendaftaran & Syarat', icon: <FileCheck className="w-4 h-4" /> },
    { id: 'taiwan', label: 'Kuliah S1 Taiwan IFP 1+4', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'jepang', label: 'Magang & SSW Jepang', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'kursus', label: 'Kursus & LMS', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'biaya', label: 'Biaya & Subsidi', icon: <DollarSign className="w-4 h-4" /> },
  ];

  const filteredFaqs = useMemo(() => {
    return faqData.filter((item) => {
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchQuery =
        !query ||
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query));

      return matchCategory && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  const toggleFaq = (id: string) => {
    setOpenFaqIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExpandAll = () => {
    setOpenFaqIds(filteredFaqs.map((f) => f.id));
  };

  const handleCollapseAll = () => {
    setOpenFaqIds([]);
  };

  return (
    <section id="faq-section" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* Header Title Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200/80 text-[#0F3D7A] px-4 py-1.5 rounded-full text-xs font-extrabold shadow-2xs">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{t('Pusat Informasi & Jawaban Pertanyaan', 'Information Center & FAQ')}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black font-serif text-slate-900 tracking-tight leading-tight">
            Sering Ditanyakan (FAQ)
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Temukan jawaban lengkap mengenai syarat pendaftaran, rincian Beasiswa S1 Taiwan, program Pekerja Terampil Jepang (SSW), fasilitasi kelas LMS, hingga skema biaya & subsidi.
          </p>
        </div>

        {/* Search Bar & Category Filter Bar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
          {/* Real-time Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Cari kata kunci: 'syarat umur', 'beasiswa taiwan', 'gaji jepang', 'paket c'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0F3D7A] focus:bg-white transition shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 hover:bg-slate-300 w-5 h-5 rounded-full flex items-center justify-center font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-center flex-wrap gap-2 pt-2 border-t border-slate-100">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-xs transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#0F3D7A] text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Quick Stats & Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 gap-3">
            <div className="flex items-center gap-2 font-medium">
              <Filter className="w-4 h-4 text-[#0F3D7A]" />
              <span>
                Menampilkan <strong className="text-slate-900 font-mono">{filteredFaqs.length}</strong> pertanyaan
                {selectedCategory !== 'all' && ` pada kategori "${categories.find((c) => c.id === selectedCategory)?.label}"`}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExpandAll}
                className="text-[#0F3D7A] hover:text-blue-900 font-extrabold hover:underline cursor-pointer"
              >
                Buka Semua
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={handleCollapseAll}
                className="text-slate-600 hover:text-slate-800 font-bold hover:underline cursor-pointer"
              >
                Tutup Semua
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = openFaqIds.includes(faq.id);

              return (
                <div
                  key={faq.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'border-red-300 shadow-md ring-1 ring-red-200'
                      : 'border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-5 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-hidden"
                  >
                    <div className="space-y-1.5 pr-2">
                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase">
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md border border-slate-200">
                          {faq.categoryLabel}
                        </span>
                        {faq.popular && (
                          <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-md border border-amber-200 flex items-center gap-1 font-extrabold">
                            <Sparkles className="w-3 h-3 text-amber-700" /> FAQ Sering Ditanyakan
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-snug">
                        {faq.question}
                      </h3>
                    </div>

                    <span
                      className={`p-2 rounded-xl transition-all shrink-0 mt-1 ${
                        isOpen
                          ? 'bg-red-800 text-white rotate-180'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </span>
                  </button>

                  {/* Expandable Answer Box */}
                  {isOpen && (
                    <div className="p-5 pt-0 border-t border-slate-100 bg-slate-50/50 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed animate-in fade-in duration-150">
                      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-3">
                        <p className="whitespace-pre-line font-normal text-slate-800">{faq.answer}</p>

                        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500">
                          <span className="font-bold text-slate-400">Kata Kunci:</span>
                          {faq.tags.map((tag, idx) => (
                            <span key={idx} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-900 text-base">Tidak Ada Pertanyaan Cocok</h4>
              <p className="text-slate-500 text-xs max-w-md mx-auto">
                Pertanyaan dengan kata kunci "{searchQuery}" belum ditemukan. Coba gunakan kata kunci umum atau tanyakan langsung ke Admin WA.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-xs font-bold text-red-700 hover:underline cursor-pointer"
              >
                Reset Pencarian
              </button>
            </div>
          )}
        </div>

        {/* High Conversion CTA Banner at Bottom */}
        <div className="bg-gradient-to-br from-slate-950 via-red-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-amber-500/30 relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-3 relative z-10">
            <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-bold">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>Layanan Konsultasi Langsung LKP & Konsultan Pendidikan Prospect Jember</span>
            </span>

            <h3 className="text-2xl sm:text-3xl font-black font-serif text-white tracking-tight">
              Masih Ada Pertanyaan atau Ingin Cek Peluang Kelulusan Anda?
            </h3>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Tim Konsultan Pendidikan & Pemberangkatan Prospect Education Jember siap membantu verifikasi berkas, pemetaan beasiswa Taiwan, serta bimbingan seleksi magang Kerja Jepang secara GRATIS.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 relative z-10 pt-2">
            <a
              href="https://wa.me/6282334554396?text=Halo%20Admin%20Prospect%20Jember,%20saya%20ingin%20konsultasi%20mengenai%20Pendaftaran%20Beasiswa%20Taiwan%20/%20Magang%20Jepang"
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Konsultasi Gratis via WhatsApp (24 Jam)</span>
            </a>

            <button
              onClick={() => {
                setRole('visitor');
                setActiveTab('pendaftaran');
              }}
              className="bg-gradient-to-r from-red-800 via-red-700 to-amber-600 hover:from-red-900 hover:to-amber-700 text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Daftar Sekarang (Online)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-4 border-t border-red-900/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Tanpa Biaya Tersembunyi (Transparan)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Subsidi Biaya Khusus Warga Jember</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Jaminan Pembimbingan s.d. Terbang</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
