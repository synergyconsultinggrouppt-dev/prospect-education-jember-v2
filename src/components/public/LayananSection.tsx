import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageCircle,
  BookOpen,
  Languages,
  FileCheck2,
  Users2,
  PlaneTakeoff,
  CheckCircle2,
  PhoneCall,
} from 'lucide-react';

export const LayananSection: React.FC = () => {
  const { setRole, setActiveTab } = useApp();

  const services = [
    {
      title: 'Konsultasi Pendidikan & Karier Gratis',
      desc: 'Bimbingan tatap muka di kantor Jember atau via WhatsApp untuk membantu memilih jalur program terbaik sesuai minat dan bakat.',
      icon: <MessageCircle className="w-6 h-6 text-[#0F3D7A]" />,
      tag: 'Bebas Biaya',
    },
    {
      title: 'Pelatihan Bahasa Jepang (JLPT & JFT-Basic)',
      desc: 'Kelas intensif tata bahasa, Hiragana, Katakana, Kanji dasar, dan tryout soal JFT-Basic A2 / N4 khusus peserta magang & SSW.',
      icon: <Languages className="w-6 h-6 text-amber-600" />,
      tag: 'LKP Jember',
    },
    {
      title: 'Pelatihan Bahasa Mandarin & Bopomofo',
      desc: 'Penguasaan percakapan Mandarin harian, kosakata akademik, serta penulisan karakter Tradisional Taiwan.',
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      tag: 'Khusus Taiwan',
    },
    {
      title: 'Pengurusan Visa & Pengesahan Dokumen',
      desc: 'Bantuan legalisir ijazah serta proses pengurusan visa resmi luar negeri bekerja sama dengan VISA HUB INDONESIA.',
      icon: <FileCheck2 className="w-6 h-6 text-emerald-600" />,
      tag: 'VISA HUB Partner',
    },
    {
      title: 'Pendampingan Interview & Match User',
      desc: 'Simulasi wawancara dengan perwakilan kampus Taiwan atau user perusahaan Jepang untuk memastikan kelulusan 100%.',
      icon: <Users2 className="w-6 h-6 text-purple-600" />,
      tag: 'Simulasi 1-on-1',
    },
    {
      title: 'Pendampingan Keberangkatan & Orientasi',
      desc: 'Pelepasan resmi dari Jember, pendampingan di bandara, hingga penjemputan oleh tim representatif di Taiwan/Jepang.',
      icon: <PlaneTakeoff className="w-6 h-6 text-[#0F3D7A]" />,
      tag: 'Sampai Tujuan',
    },
  ];

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold text-[#0F3D7A] uppercase tracking-widest bg-blue-50 border border-blue-200/80 px-3.5 py-1 rounded-full inline-block shadow-2xs">
            LAYANAN CABANG JEMBER
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
            Pelayanan Pendampingan Komprehensif
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Kami tidak hanya mendaftarkan peserta, melainkan membimbing dari titik nol di Jember hingga sukses beradaptasi di Taiwan dan Jepang.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-100">{s.icon}</div>
                  <span className="text-[10px] font-extrabold text-[#0F3D7A] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full uppercase">
                    {s.tag}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base font-serif">{s.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{s.desc}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Termasuk dalam Paket Program</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Butuh Layanan Bimbingan Khusus?</h4>
              <p className="text-xs text-slate-500">Hubungi Hotline WA Layanan Cabang Jember di 0823-3455-4396</p>
            </div>
          </div>

          <a
            href="https://wa.me/6282334554396"
            target="_blank"
            rel="noreferrer"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-xs"
          >
            Konsultasi Sekarang
          </a>
        </div>
      </div>
    </section>
  );
};
