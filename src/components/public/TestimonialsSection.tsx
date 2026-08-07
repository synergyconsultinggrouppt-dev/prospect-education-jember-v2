import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Quote,
  Star,
  GraduationCap,
  Building2,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Award,
  Users,
} from 'lucide-react';

export interface TestimonialItem {
  id: string;
  name: string;
  school: string;
  location: string;
  program: string;
  category: 'taiwan' | 'japan';
  currentRole: string;
  rating: number;
  year: string;
  quote: string;
  photoUrl?: string;
  verified: boolean;
}

const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 't-1',
    name: 'Ahmad Rizky Pratama',
    school: 'Alumni SMKN 2 Jember',
    location: 'Ambulu, Jember',
    program: 'Taiwan IFP 1+4 (S1 Beasiswa)',
    category: 'taiwan',
    currentRole: 'Mahasiswa Teknik Informatika - Feng Chia University, Taichung',
    rating: 5,
    year: 'Angkatan 2024',
    quote:
      'Proses bimbingan berkas dan kelas Mandarin di kantor Prospect Education Balung Jember sangat intensif. Dari nol bahasa Mandarin sampai lolos beasiswa S1 1+4 dan visa resmi terbit tanpa kendala.',
    verified: true,
  },
  {
    id: 't-2',
    name: 'Siti Nur Halizah',
    school: 'Alumni SMAN 1 Ambulu',
    location: 'Balung, Jember',
    program: 'Taiwan IFP 1+4 (S1 Beasiswa)',
    category: 'taiwan',
    currentRole: 'Mahasiswa Manajemen Bisnis - Lunghwa University of Science and Technology',
    rating: 5,
    year: 'Angkatan 2025',
    quote:
      'Awalnya bingung cari agen studi luar negeri yang legal. Prospect Education Cabang Jember transparan banget dari rincian biaya sampai pendampingan keberangkatan di bandara.',
    verified: true,
  },
  {
    id: 't-3',
    name: 'Bagus Setyawan',
    school: 'Alumni SMKN 5 Jember',
    location: 'Tanggul, Jember',
    program: 'Magang Jepang IM Japan',
    category: 'japan',
    currentRole: 'Teknisi Manufaktur - Otomotif Prefektur Aichi, Jepang',
    rating: 5,
    year: 'Angkatan 2023',
    quote:
      'Pelatihan disiplin dan Bahasa Jepang di LKP Prospect Jember bikin saya siap tempur tes seleksi. Sekarang sudah bekerja di Aichi dengan gaji yang sangat layak.',
    verified: true,
  },
  {
    id: 't-4',
    name: 'Dewi Anggraini',
    school: 'Alumni SMKN 1 Jember',
    location: 'Sumbersari, Jember',
    program: 'Tokutei Ginou SSW Jepang',
    category: 'japan',
    currentRole: 'Caregiver / Kaigo Specialist - Shizuoka Prefecture, Japan',
    rating: 5,
    year: 'Angkatan 2024',
    quote:
      'Ujian N4 dan JFT-Basic cepat lulus berkat pengajar yang ramah di Jember. Kontrak kerja langsung dikirim dari Jepang dan pengurusan COE dibantu penuh tim Prospect.',
    verified: true,
  },
  {
    id: 't-5',
    name: 'Dimas Wahyu Utomo',
    school: 'Alumni SMA Muhammadiyah 3 Jember',
    location: 'Kaliwates, Jember',
    program: 'Taiwan Program 4+1',
    category: 'taiwan',
    currentRole: 'Mahasiswa & Intern Industrial Engineering - Kun Shan University',
    rating: 5,
    year: 'Angkatan 2024',
    quote:
      'Kuliah S1 sambil magang resmi bergaji di Taiwan. Hasil magang bisa bantu bayar biaya hidup mandiri. Orang tua di Jember tenang karena lembaganya berizin resmi.',
    verified: true,
  },
  {
    id: 't-6',
    name: 'Fikri Haikal',
    school: 'Alumni SMKN 3 Jember',
    location: 'Mayang, Jember',
    program: 'Magang Jepang IM Japan',
    category: 'japan',
    currentRole: 'Pekerja Konstruksi Presisi - Osaka, Jepang',
    rating: 5,
    year: 'Angkatan 2025',
    quote:
      'Sangat merekomendasikan Prospect Education Cabang Jember bagi pemuda Jember & sekitarnya yang ingin mengubah masa depan ke Jepang atau Taiwan!',
    verified: true,
  },
];

export const TestimonialsSection: React.FC = () => {
  const { setRole, setActiveTab, setSelectedProgramId } = useApp();
  const [activeFilter, setActiveFilter] = useState<'all' | 'taiwan' | 'japan'>('all');

  const filteredTestimonials = TESTIMONIALS_DATA.filter((item) => {
    if (activeFilter === 'taiwan') return item.category === 'taiwan';
    if (activeFilter === 'japan') return item.category === 'japan';
    return true;
  });

  const handleConsult = () => {
    setRole('visitor');
    setActiveTab('pendaftaran');
  };

  return (
    <section className="py-16 bg-white text-slate-800 relative overflow-hidden border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200/80 px-4 py-1.5 rounded-full text-xs font-extrabold text-[#0F3D7A] shadow-2xs">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Kisah Sukses & Bukti Nyata Alumni</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif tracking-tight">
            Testimoni Putera-Puteri Jember di Taiwan & Jepang
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed">
            Dengarkan pengalaman langsung dari alumni SMA/SMK se-Kabupaten Jember yang telah berhasil berangkat kuliah beasiswa ke Taiwan dan bekerja karir profesional di Jepang bersama Prospect Education Cabang Jember.
          </p>

          {/* Filter Tabs */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-[#0F3D7A] text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua Testimoni ({TESTIMONIALS_DATA.length})
            </button>
            <button
              onClick={() => setActiveFilter('taiwan')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeFilter === 'taiwan'
                  ? 'bg-[#0F3D7A] text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
              <span>Kuliah Taiwan</span>
            </button>
            <button
              onClick={() => setActiveFilter('japan')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeFilter === 'japan'
                  ? 'bg-[#0F3D7A] text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Karir Jepang</span>
            </button>
          </div>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50/80 border border-slate-200/80 hover:border-[#0F3D7A]/50 p-6 rounded-2xl flex flex-col justify-between space-y-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group relative"
            >
              <Quote className="w-8 h-8 text-blue-200 absolute top-4 right-4 group-hover:text-amber-400 transition-colors" />

              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-slate-700 text-xs italic leading-relaxed font-normal">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-[#0F3D7A] transition">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">{item.school}</p>
                  </div>
                  {item.verified && (
                    <span className="flex items-center gap-1 text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 text-[11px] space-y-1">
                  <p className="font-bold text-[#0F3D7A] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                    <span>{item.location} • {item.year}</span>
                  </p>
                  <p className="text-slate-600 font-medium truncate">{item.currentRole}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner CTA */}
        <div className="bg-gradient-to-r from-[#071E3D] via-[#0F3D7A] to-[#1E40AF] p-6 sm:p-8 rounded-3xl border border-blue-400/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl text-white">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-bold text-white font-serif flex items-center justify-center md:justify-start gap-2">
              <Users className="w-5 h-5 text-amber-300" />
              <span>Ingin Menyusul Rekan-Rekan Alumni di Taiwan atau Jepang?</span>
            </h3>
            <p className="text-xs text-slate-200 max-w-xl">
              Konsultasikan minat dan kualifikasi Anda bersama tim Prospect Education Cabang Jember. Dapatkan panduan lengkap syarat dokumen, jadwal pendaftaran, dan skema beasiswa.
            </p>
          </div>

          <button
            onClick={handleConsult}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl flex items-center gap-2 shadow-lg transition-all shrink-0 cursor-pointer"
          >
            <span>Daftar / Konsultasi Gratis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
