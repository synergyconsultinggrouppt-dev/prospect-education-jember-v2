import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserPlus,
  LogIn,
  FileText,
  GraduationCap,
  Upload,
  ShieldCheck,
  CreditCard,
  CheckCircle,
  FileCheck,
  BookOpen,
  Plane,
  Award,
  ArrowRight,
} from 'lucide-react';

export const PendaftaranFlowSection: React.FC = () => {
  const { setRole, setActiveTab } = useApp();

  const flowSteps = [
    { num: 1, title: 'Registrasi Akun', desc: 'Isi nama, email, dan nomor WhatsApp aktif Anda', icon: <UserPlus className="w-5 h-5 text-[#0F3D7A]" /> },
    { num: 2, title: 'Login Peserta', desc: 'Akses Portal Peserta Cabang Jember kapan saja', icon: <LogIn className="w-5 h-5 text-amber-600" /> },
    { num: 3, title: 'Mengisi Biodata', desc: 'Lengkapi NIK, alamat, pendidikan, dan data orang tua', icon: <FileText className="w-5 h-5 text-emerald-600" /> },
    { num: 4, title: 'Pilih Program', desc: 'Pilih Jalur Taiwan (IFP 1+4/4+1) atau Jepang (IM/SSW)', icon: <GraduationCap className="w-5 h-5 text-blue-600" /> },
    { num: 5, title: 'Upload Dokumen', desc: 'Unggah KTP, Ijazah/SKL, Pasfoto, & Paspor', icon: <Upload className="w-5 h-5 text-purple-600" /> },
    { num: 6, title: 'Verifikasi Admin', desc: 'Tim Admin Jember mengecek kelengkapan berkas', icon: <ShieldCheck className="w-5 h-5 text-emerald-700" /> },
    { num: 7, title: 'Pembayaran DP / Registrasi', desc: 'Online via Midtrans (QRIS, VA BCA/Mandiri/BRI)', icon: <CreditCard className="w-5 h-5 text-amber-700" /> },
    { num: 8, title: 'Persetujuan Manajemen Prospect Education', desc: 'Sign-off final penerimaan peserta resmi', icon: <CheckCircle className="w-5 h-5 text-emerald-800" /> },
    { num: 9, title: 'Download Surat Penerimaan (LoA)', desc: 'Cetak Surat Penerimaan Resmi bertanda QR Code', icon: <FileCheck className="w-5 h-5 text-[#0F3D7A]" /> },
    { num: 10, title: 'Akses Pembelajaran (LMS) & Departure', desc: 'Modul Bahasa Mandarin/Jepang, Video, Ujian & Sertifikat', icon: <BookOpen className="w-5 h-5 text-sky-600" /> },
  ];

  return (
    <section className="py-16 bg-slate-50 text-slate-800 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold text-[#0F3D7A] uppercase tracking-widest bg-blue-50 border border-blue-200/80 px-3.5 py-1 rounded-full inline-block shadow-2xs">
            ALUR SISTEM PENDAFTARAN
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
            10 Tahapan Mudah & Terstruktur
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Seluruh rangkaian pendaftaran dirancang secara transparan melalui sistem digital terpadu Prospect Education Cabang Jember.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {flowSteps.map((step) => (
            <div
              key={step.num}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-[#0F3D7A]/50 hover:shadow-md transition group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-[#0F3D7A] text-amber-300 font-extrabold text-xs flex items-center justify-center shadow-2xs">
                    {step.num < 10 ? `0${step.num}` : step.num}
                  </span>
                  <div className="p-2 bg-blue-50/80 rounded-xl group-hover:scale-110 transition border border-blue-100">
                    {step.icon}
                  </div>
                </div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#0F3D7A] transition">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Callout */}
        <div className="bg-gradient-to-r from-[#071E3D] via-[#0F3D7A] to-[#1E40AF] p-8 rounded-3xl border border-blue-400/30 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl text-white">
          <div className="space-y-2 max-w-2xl">
            <h3 className="text-xl font-extrabold text-white font-serif">
              Siap Memulai Pendaftaran Pertama Anda?
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed">
              Formulir dapat diisi dalam waktu kurang dari 3 menit. Dapatkan konsultasi gratis langsung dengan tim admin Cabang Jember.
            </p>
          </div>

          <button
            onClick={() => {
              setActiveTab('pendaftaran');
            }}
            className="shrink-0 flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-lg transition cursor-pointer"
          >
            <span>Mulai Registrasi Online</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>
      </div>
    </section>
  );
};
