import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Instagram,
  Facebook,
  Clock,
  Navigation,
  CheckCircle,
} from 'lucide-react';

export const KontakSection: React.FC = () => {
  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold text-[#0F3D7A] uppercase tracking-widest bg-blue-50 border border-blue-200/80 px-3.5 py-1 rounded-full inline-block shadow-2xs">
            HUBUNGI KAMI
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
            Lokasi Kantor & Layanan Informasi
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Kunjungi kantor resmi Prospect Education Cabang Jember untuk konsultasi langsung atau hubungi tim kami melalui WhatsApp dan kanal informasi digital.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Office Info Card */}
          <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[10px] font-extrabold text-[#0F3D7A] uppercase tracking-widest block">
                KANTOR OPERASIONAL
              </span>
              <h3 className="text-xl font-black text-slate-900 font-serif">Prospect Education Cabang Jember</h3>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-blue-50 text-[#0F3D7A] rounded-xl shrink-0 border border-blue-100">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Alamat Lengkap:</h4>
                  <p className="text-slate-600 leading-relaxed mt-0.5">
                    Jl. Balung-Jenggawah, Wetan Kali, Balung Lor, Kec. Balung, Kabupaten Jember, Jawa Timur 68161
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Telepon & WhatsApp Konsultasi:</h4>
                  <p className="text-emerald-700 font-bold text-sm mt-0.5">0823-3455-4396</p>
                  <p className="text-[10px] text-slate-400">Respon cepat hari kerja 08.00 - 17.00 WIB</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-amber-50 text-amber-800 rounded-xl shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Email Resmi:</h4>
                  <p className="text-slate-600 mt-0.5">info@prospecteducation.id</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-800 rounded-xl shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Website & Media Sosial:</h4>
                  <p className="text-slate-600 mt-0.5">www.prospecteducation.id</p>
                  <div className="flex items-center gap-3 pt-2">
                    <a
                      href="https://instagram.com/prospect.education"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-pink-700 font-bold hover:underline"
                    >
                      <Instagram className="w-3.5 h-3.5" /> @prospect.education
                    </a>
                    <a
                      href="https://facebook.com/prospect.education"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-blue-700 font-bold hover:underline"
                    >
                      <Facebook className="w-3.5 h-3.5" /> prospect.education
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <a
                href="https://wa.me/6282334554396"
                target="_blank"
                rel="noreferrer"
                className="w-full text-center bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition text-xs shadow-xs"
              >
                Chat Langsung via WhatsApp (0823-3455-4396)
              </a>
            </div>
          </div>

          {/* Right: Map Simulation & Office Hours */}
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
            <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-sm space-y-4 flex-1">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-sm font-serif">Google Maps Location Jember</h3>
                </div>
                <span className="text-[10px] bg-red-900 text-amber-300 font-bold px-2 py-0.5 rounded">
                  Balung Lor, Jember
                </span>
              </div>

              {/* Simulated Map Display */}
              <div className="relative h-64 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 flex items-center justify-center group">
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-800 opacity-90"></div>
                <div className="relative z-10 text-center space-y-2 p-6">
                  <MapPin className="w-10 h-10 text-red-500 mx-auto animate-bounce" />
                  <h4 className="font-bold text-white text-base">Kantor Prospect Education Jember</h4>
                  <p className="text-xs text-slate-300 max-w-md">
                    Jl. Balung-Jenggawah, Wetan Kali, Balung Lor, Kec. Balung, Kab. Jember (Dekat Alun-Alun Balung)
                  </p>
                  <a
                    href="https://maps.google.com/?q=Balung+Lor+Jember"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 bg-red-800 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-md mt-2"
                  >
                    <span>Buka Petunjuk Arah di Google Maps</span>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 font-medium block">Jam Operasional:</span>
                  <p className="font-bold text-slate-200 mt-0.5">Senin - Sabtu (08:00 - 17:00 WIB)</p>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 font-medium block">Konsultasi Tatap Muka:</span>
                  <p className="font-bold text-amber-300 mt-0.5">Gratis Setiap Hari Kerja</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
