import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  User,
  ArrowRight,
  Tag,
  X,
  Share2,
  Check,
  Sparkles,
  Clock,
  BookOpen,
  ArrowLeft,
  Link,
} from 'lucide-react';

export const BeritaSection: React.FC = () => {
  const { news, setActiveTab, t } = useApp();
  const [selectedNews, setSelectedNews] = useState<(typeof news)[0] | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getShareUrl = () => window.location.href;

  const handleShareWhatsApp = (e: React.MouseEvent, item: (typeof news)[0]) => {
    e.stopPropagation();
    const text = `*${item.title}*\n\n${item.summary}\n\nBaca berita lengkapnya di Prospect Education Jember:`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + '\n' + getShareUrl())}`;
    window.open(waUrl, '_blank');
  };

  const handleShareFacebook = (e: React.MouseEvent, item: (typeof news)[0]) => {
    e.stopPropagation();
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`;
    window.open(fbUrl, '_blank');
  };

  const handleShareTwitter = (e: React.MouseEvent, item: (typeof news)[0]) => {
    e.stopPropagation();
    const text = `${item.title} - Prospect Education Jember`;
    const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(getShareUrl())}`;
    window.open(twUrl, '_blank');
  };

  const handleCopyLink = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(getShareUrl());
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="py-16 bg-white border-b border-slate-200" id="berita-section">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#0F3D7A] uppercase tracking-widest bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            BERITA & PENGUMUMAN
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
            {t('Kabar Terbaru & Agenda Kegiatan', 'Latest News & Events Schedule')}
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            {t(
              'Informasi terkini seputar gelombang pendaftaran, kelulusan visa, seminar edukasi, dan dokumentasi keberangkatan peserta asal Jember.',
              'Latest updates regarding intake waves, visa approvals, educational seminars, and departure photos for students from Jember.'
            )}
          </p>
        </div>

        {/* News Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item) => (
            <article
              key={item.id}
              onClick={() => setSelectedNews(item)}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden hover:shadow-xl hover:border-[#0F3D7A]/40 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-4">
                {/* Image Banner */}
                <div className="relative h-48 overflow-hidden bg-slate-900">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="bg-[#0F3D7A]/90 text-amber-300 font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs border border-blue-400/30 shadow-xs">
                      {item.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" /> Klik untuk membaca artikel
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
                      {item.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-amber-600" />
                      {item.author}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base group-hover:text-[#0F3D7A] transition font-serif leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                    {item.summary}
                  </p>
                </div>
              </div>

              {/* Card Footer: Read Action + Quick Social Share */}
              <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 mt-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F3D7A] group-hover:text-[#2563EB] group-hover:underline transition">
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>

                {/* Quick Share Buttons on Card */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleShareWhatsApp(e, item)}
                    className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition"
                    title="Bagikan ke WhatsApp"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.119.553 4.11 1.519 5.84L0 24l6.34-1.655C8.016 23.284 9.948 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.802 0-3.55-.48-5.072-1.388l-.363-.216-3.763.982.999-3.673-.238-.378C2.57 15.772 2 13.93 2 12 2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleShareFacebook(e, item)}
                    className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition"
                    title="Bagikan ke Facebook"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleShareTwitter(e, item)}
                    className="p-1.5 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-900 hover:text-white transition"
                    title="Bagikan ke Twitter / X"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleCopyLink(e, item.id)}
                    className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                    title="Salin Tautan Artikel"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Link className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Full Article Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden relative animate-in zoom-in-95 duration-200">
            {/* Header Image & Badge */}
            <div className="relative h-60 sm:h-72 bg-slate-950 overflow-hidden shrink-0">
              <img
                src={selectedNews.image}
                alt={selectedNews.title}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedNews(null)}
                className="absolute top-4 right-4 bg-slate-900/80 hover:bg-[#0F3D7A] text-white p-2 rounded-full backdrop-blur-md transition shadow-lg border border-white/20"
                aria-label="Tutup berita"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 space-y-2">
                <span className="bg-[#0F3D7A] text-amber-300 font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider inline-block border border-blue-400/30">
                  {selectedNews.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white font-serif leading-tight">
                  {selectedNews.title}
                </h2>
              </div>
            </div>

            {/* Article Content & Metadata */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 text-xs sm:text-sm">
              {/* Meta info & Quick Share Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-slate-500 border-b border-slate-100 pb-4 text-xs">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    <Calendar className="w-4 h-4 text-red-700" />
                    {selectedNews.date}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    <User className="w-4 h-4 text-amber-600" />
                    {selectedNews.author}
                  </span>
                </div>

                {/* Social Media Sharing Group */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold text-slate-400 mr-1 hidden sm:inline">Bagikan:</span>
                  <button
                    type="button"
                    onClick={(e) => handleShareWhatsApp(e, selectedNews)}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-xl transition shadow-2xs"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.119.553 4.11 1.519 5.84L0 24l6.34-1.655C8.016 23.284 9.948 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.802 0-3.55-.48-5.072-1.388l-.363-.216-3.763.982.999-3.673-.238-.378C2.57 15.772 2 13.93 2 12 2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                    </svg>
                    <span>WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleShareFacebook(e, selectedNews)}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-xl transition shadow-2xs"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>Facebook</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleShareTwitter(e, selectedNews)}
                    className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] px-3 py-1.5 rounded-xl transition shadow-2xs"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span>Twitter / X</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleCopyLink(e, 'modal-copy')}
                    className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] px-3 py-1.5 rounded-xl transition border border-slate-200"
                  >
                    {copiedId === 'modal-copy' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Link className="w-3.5 h-3.5 text-slate-500" />
                    )}
                    <span>{copiedId === 'modal-copy' ? 'Tautan Disalin!' : 'Salin Tautan'}</span>
                  </button>
                </div>
              </div>

              {/* Summary Lead Box */}
              {selectedNews.summary && (
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-2xl font-medium text-slate-800 text-xs sm:text-sm italic leading-relaxed">
                  "{selectedNews.summary}"
                </div>
              )}

              {/* Article Main Text */}
              <div className="space-y-4 text-slate-700 leading-relaxed font-normal whitespace-pre-line text-sm">
                {selectedNews.content}
              </div>

              {/* Social Media Share Banner inside Article Body */}
              <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-bold text-xs text-amber-300 flex items-center justify-center sm:justify-start gap-1.5">
                    <Share2 className="w-4 h-4" />
                    <span>Suka berita ini? Bagikan ke teman & keluarga!</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Bantu sebarkan informasi peluang beasiswa kuliah S1 Taiwan & kerja Jepang di Jember.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handleShareWhatsApp(e, selectedNews)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.119.553 4.11 1.519 5.84L0 24l6.34-1.655C8.016 23.284 9.948 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.802 0-3.55-.48-5.072-1.388l-.363-.216-3.763.982.999-3.673-.238-.378C2.57 15.772 2 13.93 2 12 2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                    </svg>
                    <span>WA Share</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleShareFacebook(e, selectedNews)}
                    className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>FB</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleShareTwitter(e, selectedNews)}
                    className="bg-slate-800 hover:bg-slate-700 text-white p-2.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span>X</span>
                  </button>
                </div>
              </div>

              {/* Verified Author Footer Seal */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0F3D7A] text-amber-300 font-black text-sm flex items-center justify-center font-serif shadow-xs">
                    PE
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">Redaksi Prospect Education Jember</h5>
                    <p className="text-[11px] text-slate-500">Official Media & PR LKP & Konsultan Pendidikan Prospect Jember</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedNews(null);
                    setActiveTab('pendaftaran');
                  }}
                  className="bg-[#0F3D7A] hover:bg-[#092852] text-amber-300 font-bold text-xs px-4 py-2 rounded-xl transition shrink-0"
                >
                  Daftar Program Now
                </button>
              </div>
            </div>

            {/* Modal Bottom Sticky Bar */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
              <button
                onClick={() => setSelectedNews(null)}
                className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Berita</span>
              </button>

              <span className="text-[11px] text-slate-500 font-medium">
                Prospect Education Jember • Official News Feed
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};


