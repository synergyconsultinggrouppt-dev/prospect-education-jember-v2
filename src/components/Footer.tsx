import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from './BrandLogo';
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
  Facebook,
  ShieldCheck,
  ArrowUpRight,
  Send,
  CheckCircle2,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
  };

  return (
    <footer role="contentinfo" className="bg-[#092852] text-slate-300 pt-12 pb-6 border-t-4 border-[#0F3D7A]">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        {/* Col 1: Brand & Office Info */}
        <div className="space-y-4">
          <BrandLogo variant="footer" onClick={() => setActiveTab('beranda')} />

          <p className="text-xs text-slate-300 leading-relaxed">
            LKP (Lembaga Kursus dan Pelatihan) & Konsultan Pendidikan resmi. Membantu pendaftaran program S1 Taiwan IFP 1+4 serta kerja Jepang, dengan pengurusan visa bekerja sama dengan VISA HUB INDONESIA.
          </p>

          <div className="inline-flex items-center gap-1.5 bg-[#0F3D7A] border border-blue-500/40 text-amber-300 px-3 py-1 rounded-full text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <span>LKP & KONSULTAN PENDIDIKAN • VISA HUB PARTNER</span>
          </div>
        </div>

        {/* Col 2: Alamat Kantor & Kontak */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-blue-900 pb-2">
            Alamat Kantor Jember
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" aria-hidden="true" />
              <span>Jl. Balung-Jenggawah, Wetan Kali, Balung Lor, Kec. Balung, Kabupaten Jember, Jawa Timur 68161</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
              <a href="https://wa.me/6282334554396" aria-label="Hubungi WhatsApp Kantor Jember" className="hover:text-emerald-300 transition focus-visible:ring-1 focus-visible:ring-emerald-400">
                0823-3455-4396 (Konsultasi WA)
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
              <span>info@prospecteducation.id</span>
            </li>
            <li className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400 shrink-0" aria-hidden="true" />
              <a href="https://www.prospecteducation.id" target="_blank" rel="noreferrer" aria-label="Kunjungi Website Resmi Prospect Education" className="hover:text-white transition focus-visible:ring-1 focus-visible:ring-blue-400">
                www.prospecteducation.id
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Quick Navigation */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-blue-900 pb-2">
            Program & Layanan
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            <li>
              <button onClick={() => setActiveTab('program')} className="hover:text-amber-300 transition flex items-center gap-1 text-left focus-visible:ring-1 focus-visible:ring-amber-400">
                <ArrowUpRight className="w-3 h-3 text-[#F59E0B] shrink-0" aria-hidden="true" /> Taiwan IFP 1+4 (1 Thn Bahasa + 4 Thn S1)
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('program')} className="hover:text-amber-300 transition flex items-center gap-1 text-left focus-visible:ring-1 focus-visible:ring-amber-400">
                <ArrowUpRight className="w-3 h-3 text-[#F59E0B] shrink-0" aria-hidden="true" /> Taiwan 4+1 (4 Thn S1 + 1 Thn S2)
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('program')} className="hover:text-amber-300 transition flex items-center gap-1 text-left focus-visible:ring-1 focus-visible:ring-amber-400">
                <ArrowUpRight className="w-3 h-3 text-[#F59E0B] shrink-0" aria-hidden="true" /> Magang Jepang IM Japan (Kemnaker)
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('program')} className="hover:text-amber-300 transition flex items-center gap-1 text-left focus-visible:ring-1 focus-visible:ring-amber-400">
                <ArrowUpRight className="w-3 h-3 text-[#F59E0B] shrink-0" aria-hidden="true" /> Tokutei Ginou SSW Jepang
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('layanan')} className="hover:text-amber-300 transition flex items-center gap-1 text-left focus-visible:ring-1 focus-visible:ring-amber-400 cursor-pointer">
                <ArrowUpRight className="w-3 h-3 text-[#F59E0B] shrink-0" aria-hidden="true" /> Pelatihan Bahasa Mandarin & Jepang
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Newsletter & Social Media */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-blue-900 pb-2">
            Langganan Info & Berita
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Dapatkan kabar program perkuliahan Taiwan, pendaftaran Jepang, & info kegiatan Jember langsung ke email Anda.
          </p>

          <form onSubmit={handleSubscribe} className="space-y-2 pt-1" aria-label="Formulir Langganan Buletin">
            {subscribed ? (
              <div className="bg-emerald-950/80 border border-emerald-600/50 text-emerald-300 p-2.5 rounded-xl text-xs flex items-center gap-2" role="status">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                <span>Terima kasih! Email Anda telah terdaftar untuk buletin berkala.</span>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" aria-hidden="true" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan email Anda..."
                    aria-label="Alamat email untuk langganan buletin"
                    className="w-full bg-[#0F3D7A] border border-blue-800 text-white rounded-xl pl-8 pr-3 py-2 text-xs focus:outline-hidden focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
                <button
                  type="submit"
                  aria-label="Daftar buletin"
                  className="bg-[#F59E0B] hover:bg-[#d97706] text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center justify-center gap-1.5 shrink-0 transition shadow-md focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  <Send className="w-3.5 h-3.5 text-slate-950" aria-hidden="true" />
                  <span>Daftar</span>
                </button>
              </div>
            )}
          </form>

          <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-900/80 space-y-1">
            <p>Jam Operasional Kantor Jember:</p>
            <p className="font-semibold text-slate-300">Senin - Sabtu (08:00 - 17:00 WIB)</p>
          </div>

          <div className="flex items-center gap-3 pt-1" role="group" aria-label="Tautan Media Sosial">
            <a
              href="https://instagram.com/prospect.education"
              target="_blank"
              rel="noreferrer"
              aria-label="Ikuti Instagram Prospect Education"
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-pink-700 flex items-center justify-center text-slate-200 transition focus-visible:ring-2 focus-visible:ring-pink-400"
              title="Instagram"
            >
              <Instagram className="w-4 h-4" aria-hidden="true" />
            </a>
            <a
              href="https://facebook.com/prospect.education"
              target="_blank"
              rel="noreferrer"
              aria-label="Ikuti Halaman Facebook Prospect Education"
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-blue-700 flex items-center justify-center text-slate-200 transition focus-visible:ring-2 focus-visible:ring-blue-400"
              title="Facebook"
            >
              <Facebook className="w-4 h-4" aria-hidden="true" />
            </a>
            <a
              href="https://wa.me/6282334554396"
              target="_blank"
              rel="noreferrer"
              aria-label="Hubungi WhatsApp Customer Service"
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-emerald-600 flex items-center justify-center text-slate-200 transition focus-visible:ring-2 focus-visible:ring-emerald-400"
              title="WhatsApp"
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <p>© 2026 Prospect Education Cabang Jember. Hak Cipta Dilindungi Undang-Undang.</p>
        <p className="text-slate-400 font-medium">Sistem Informasi Manajemen Terpadu (SIM) Cabang Jember</p>
      </div>
    </footer>
  );
};
