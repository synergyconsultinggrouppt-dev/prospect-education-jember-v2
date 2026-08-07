import React from 'react';
import { BrandLogo } from '../BrandLogo';
import rohimImg from '../../assets/images/rohim_egy_head_1784772518616.jpg';
import {
  Building,
  Target,
  Compass,
  FileText,
  Users,
  ShieldCheck,
  CheckCircle2,
  Award,
} from 'lucide-react';

export const CompanyProfileSection: React.FC = () => {
  const teamMembers = [
    {
      name: 'Rohim Egy',
      role: 'Kepala Cabang Jember',
      desc: 'Kepala Cabang Prospect Education Cabang Jember. Berpengalaman dalam pengelolaan program pendidikan internasional dan kerjasama luar negeri.',
      photo: rohimImg,
    },
    {
      name: 'Rina Kusuma, S.S., M.A.',
      role: 'Manajer Program Taiwan',
      desc: 'Alumnus Universitas Taiwan, spesialis bimbingan akademis IFP 1+4 & pengurusan beasiswa.',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Kenji Sato / Budi Santoso, S.Pd.',
      role: 'Kepala Instruktur LKP Bahasa Jepang',
      desc: 'Certified JLPT N1 Instructor, berpengalaman 8 tahun melatih calon peserta magang IM Japan & Tokutei Ginou SSW.',
      photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Siti Nurhaliza, S.E.',
      role: 'Manajer Administrasi & Pengurusan Visa',
      desc: 'Penanggung jawab verifikasi berkas, kelengkapan paspor, dan koordinasi visa bersama VISA HUB INDONESIA.',
      photo: 'https://images.unsplash.com/photo-1580894732413-a7235a92d416?auto=format&fit=crop&w=400&q=80',
    },
  ];

  const legalities = [
    { title: 'NIB (Nomor Induk Berusaha)', code: '1284000392019', desc: 'Resmi Terdaftar di OSS Republik Indonesia' },
    { title: 'Izin Lembaga Kursus & Pelatihan (LKP)', code: '421.9/LKP-PE/JBR/2025', desc: 'Dinas Pendidikan Kab. Jember' },
    { title: 'Mitra Pengurusan Visa Luar Negeri', code: 'VISA HUB INDONESIA', desc: 'Kerjasama Resmi Pengurusan Visa Pelajar & Kerja' },
    { title: 'Kerjasama Resmi Kampus & Industri', code: 'MoU 2026-TW-JP-08', desc: 'Terhubung dengan 15+ Partner Kampus & Organisasi Penyalur' },
  ];

  return (
    <section className="py-16 bg-slate-50 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <BrandLogo variant="large" />
          <span className="text-xs font-bold text-[#0F3D7A] uppercase tracking-widest bg-blue-50 border border-blue-200 px-3 py-1 rounded-full inline-block">
            COMPANY PROFILE
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
            Profil Prospect Education Cabang Jember
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            LKP (Lembaga Kursus dan Pelatihan) sekaligus Konsultan Pendidikan resmi yang berpusat di Jember, menyediakan pembekalan bahasa & budaya serta pengurusan visa luar negeri bekerja sama dengan VISA HUB INDONESIA.
          </p>
        </div>

        {/* Tentang Kami & Sejarah */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-blue-50 text-[#0F3D7A] rounded-xl flex items-center justify-center border border-blue-200">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-serif">Tentang Kami</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Prospect Education Cabang Jember adalah LKP (Lembaga Kursus dan Pelatihan) dan Konsultan Pendidikan Internasional yang hadir untuk memfasilitasi akses pendidikan tinggi di Taiwan (IFP 1+4 & S1) serta program kerja profesional di Jepang.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Dengan kantor operasional di Balung Lor, Jember, kami menyediakan pelayanan terpadu satu atap: konseling pendidikan, seleksi administrasi, pembekalan bahasa di LKP, serta pengurusan visa resmi luar negeri bekerja sama dengan VISA HUB INDONESIA.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center border border-amber-200">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-serif">Sejarah & Rekam Jejak</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Berawal dari komitmen memperluas akses pendidikan global bagi pemuda daerah, Prospect Education Cabang Jember secara konsisten memperluas jaringan kerjasama dengan universitas ternama Taiwan dan asosiasi penyalur resmi Jepang (Kemnaker & IM Japan).
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Hingga tahun 2026, lebih dari 180+ putra-putri Jember telah berhasil diberangkatkan dan kini tengah menempuh pendidikan S1 beasiswa di Taiwan maupun bekerja dengan gaji standar industri lokal di Jepang.
            </p>
          </div>
        </div>

        {/* Visi & Misi */}
        <div className="bg-gradient-to-r from-[#092852] via-[#0F3D7A] to-[#1653a1] text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-8 border border-blue-900">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl font-black text-amber-300 font-serif">Visi & Misi Perusahaan</h3>
            <p className="text-xs text-slate-300">
              Landasan utama dalam mengabdi bagi kemajuan pendidikan dan sumber daya manusia Indonesia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Target className="w-5 h-5" />
                <span className="text-base uppercase tracking-wider">VISI</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">
                "Menjadi lembaga konsultasi pendidikan dan penyaluran kerja internasional terdepan, terpercaya, dan paling transparan di Indonesia yang menghasilkan SDM unggul, berdaya saing global, dan berintegritas tinggi."
              </p>
            </div>

            <div className="bg-slate-900/80 p-6 rounded-2xl border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Compass className="w-5 h-5" />
                <span className="text-base uppercase tracking-wider">MISI</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Memberikan pelayanan informasi pendidikan Taiwan & kerja Jepang yang akurat, jujur, dan legal.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Menyelenggarakan pelatihan bahasa dan pembentukan karakter kerja yang disiplin dan profesional.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Membangun ekosistem sistem informasi manajemen digital yang efisien bagi peserta, manajemen, dan investor.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Legalitas Resmi Perusahaan */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <h3 className="text-2xl font-black text-slate-900 font-serif">Legalitas & Izin Resmi</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {legalities.map((item, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <FileText className="w-6 h-6 text-[#0F3D7A]" />
                <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
                <p className="text-xs font-mono font-bold text-[#0F3D7A] bg-blue-50 p-1.5 rounded text-center border border-blue-100">
                  {item.code}
                </p>
                <p className="text-[11px] text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tim & Struktur Organisasi */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Users className="w-6 h-6 text-[#0F3D7A]" />
            <h3 className="text-2xl font-black text-slate-900 font-serif">Struktur Tim Cabang Jember</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden group hover:shadow-md transition"
              >
                <div className="h-48 overflow-hidden bg-slate-200">
                  <img
                    src={member.photo}
                    alt={member.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-5 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{member.name}</h4>
                  <p className="text-xs font-bold text-[#0F3D7A] uppercase tracking-wider">{member.role}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{member.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
