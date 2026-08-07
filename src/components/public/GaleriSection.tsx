import React, { useState } from 'react';
import { Image, Video, FileCheck, Plane, CheckCircle2 } from 'lucide-react';
import departure1 from '../../assets/images/taiwan_ifp_departure_1_1784770304337.jpg';
import departure2 from '../../assets/images/taiwan_ifp_departure_2_1784770318147.jpg';

export const GaleriSection: React.FC = () => {
  const [filter, setFilter] = useState<'All' | 'Foto' | 'Video' | 'Dokumentasi'>('All');

  const galleryItems = [
    {
      id: 101,
      title: 'Foto Keberangkatan Mahasiswa Taiwan IFP 1+4 di Gate Bandara Internasional (Siap Terbang ke Taiwan)',
      type: 'Dokumentasi',
      category: 'Keberangkatan Taiwan IFP 1+4',
      image: departure1,
      badge: 'Dokumentasi Resmi',
    },
    {
      id: 102,
      title: 'Pelepasan Rombongan Peserta Beasiswa S1 Taiwan IFP 1+4 di Terminal Keberangkatan Internasional',
      type: 'Dokumentasi',
      category: 'Keberangkatan Taiwan IFP 1+4',
      image: departure2,
      badge: 'Bandara Internasional',
    },
    {
      id: 1,
      title: 'Pelatihan Bahasa Jepang N5 & Mandarin Dasar di Kantor Prospect Education Jember',
      type: 'Foto',
      category: 'Kegiatan LKP & Konsultan',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      title: 'Orientasi Mahasiswa Baru Taiwan IFP 1+4 Angkatan 2026',
      type: 'Foto',
      category: 'Kampus Taiwan',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 3,
      title: 'Pelepasan Keberangkatan Peserta Magang IM Japan dari Jember',
      type: 'Dokumentasi',
      category: 'Keberangkatan',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 4,
      title: 'Wawancara User Perusahaan Tokutei Ginou SSW Food Processing',
      type: 'Video',
      category: 'Interview User',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 5,
      title: 'Penyerahan Surat Penerimaan (LoA) Resmi Kepada Peserta Jember',
      type: 'Dokumentasi',
      category: 'Pemberkasan',
      image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 6,
      title: 'Aktivitas Magang Industri Mahasiswa Taiwan 4+1 di Perusahaan',
      type: 'Foto',
      category: 'Internship',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const filtered = galleryItems.filter((item) => filter === 'All' || item.type === filter);

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold text-[#0F3D7A] uppercase tracking-widest bg-blue-50 border border-blue-200/80 px-3.5 py-1 rounded-full inline-block shadow-2xs">
            GALERI DOKUMENTASI
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
            Galeri Kegiatan & Keberangkatan
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Dokumentasi nyata kegiatan pelatihan, proses interview, pembekalan, dan keberangkatan peserta Prospect Education Cabang Jember.
          </p>

          {/* Filter Buttons */}
          <div className="flex justify-center items-center gap-2 pt-2">
            {(['All', 'Foto', 'Video', 'Dokumentasi'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  filter === cat
                    ? 'bg-[#0F3D7A] text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition group"
            >
              <div className="relative h-52 overflow-hidden bg-slate-900">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90"
                />
                <span className="absolute top-3 right-3 bg-black/60 text-amber-300 font-bold text-[10px] px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1">
                  {item.type === 'Foto' && <Image className="w-3 h-3" />}
                  {item.type === 'Video' && <Video className="w-3 h-3 text-red-400" />}
                  {item.type === 'Dokumentasi' && <FileCheck className="w-3 h-3 text-emerald-400" />}
                  <span>{item.category}</span>
                </span>
              </div>
              <div className="p-4">
                <p className="font-bold text-slate-900 text-xs leading-relaxed">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
