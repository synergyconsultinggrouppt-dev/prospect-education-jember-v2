import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NewsArticle, WebsiteSettings } from '../../types';
import {
  Globe,
  Settings,
  Megaphone,
  Newspaper,
  Plus,
  Edit3,
  Trash2,
  Save,
  CheckCircle2,
  PhoneCall,
  Mail,
  MapPin,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  X,
  FileText,
} from 'lucide-react';

export const AdminWebsiteContentManager: React.FC = () => {
  const {
    websiteSettings,
    updateWebsiteSettings,
    websiteFeatures,
    toggleWebsiteFeature,
    news,
    addNewsArticle,
    updateNewsArticle,
    deleteNewsArticle,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'settings' | 'news' | 'features'>('settings');

  // Form state for website settings
  const [settingsForm, setSettingsForm] = useState<WebsiteSettings>({ ...websiteSettings });
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Modals for news
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newsForm, setNewsForm] = useState<Partial<NewsArticle>>({
    title: '',
    category: 'Pengumuman Resmi',
    summary: '',
    content: '',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    date: new Date().toISOString().split('T')[0],
    author: 'Tim Humas Prospect Jember',
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteSettings(settingsForm);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const handleOpenAddNews = () => {
    setEditingNewsId(null);
    setNewsForm({
      id: `news_${Date.now()}`,
      title: '',
      category: 'Pengumuman Resmi',
      summary: '',
      content: '',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
      date: new Date().toISOString().split('T')[0],
      author: 'Tim Humas Prospect Jember',
    });
    setIsNewsModalOpen(true);
  };

  const handleOpenEditNews = (article: NewsArticle) => {
    setEditingNewsId(article.id);
    setNewsForm({ ...article });
    setIsNewsModalOpen(true);
  };

  const handleDeleteNews = (id: string, title: string) => {
    if (confirm(`Hapus artikel berita/pengumuman '${title}'?`)) {
      deleteNewsArticle(id);
    }
  };

  const handleNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsForm.title || !newsForm.content) {
      alert('Judul dan isi konten berita wajib diisi.');
      return;
    }

    if (editingNewsId) {
      updateNewsArticle(editingNewsId, newsForm);
    } else {
      addNewsArticle({
        id: newsForm.id || `news_${Date.now()}`,
        title: newsForm.title || '',
        category: newsForm.category || 'Pengumuman Resmi',
        summary: newsForm.summary || '',
        content: newsForm.content || '',
        image: newsForm.image || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
        date: newsForm.date || new Date().toISOString().split('T')[0],
        author: newsForm.author || 'Tim Humas Prospect Jember',
      });
    }

    setIsNewsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-8 -translate-y-8">
          <Globe className="w-64 h-64 text-purple-300" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-purple-400/20 text-purple-300 px-3 py-1 rounded-full text-xs font-bold mb-2 backdrop-blur-xs border border-purple-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pengelola Konten Website & Portal Publik</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Manajemen Website & Pengumuman
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl mt-1">
              Atur teks banner running announcement, berita kegiatan pendaftaran, kontak resmi CS WhatsApp, serta toggle
              fitur publik untuk antarmuka pengunjung website.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'settings'
              ? 'bg-[#0F3D7A] text-amber-300 shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Pengaturan Teks & Kontak</span>
        </button>

        <button
          onClick={() => setActiveTab('news')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'news'
              ? 'bg-[#0F3D7A] text-amber-300 shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Newspaper className="w-4 h-4" />
          <span>Pengumuman & Berita ({news.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('features')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'features'
              ? 'bg-[#0F3D7A] text-amber-300 shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Toggle Fitur Publik</span>
        </button>
      </div>

      {/* TAB 1: WEBSITE SETTINGS FORM */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          {isSavedNotice && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Pengaturan website berhasil diperbarui dan dipublikasikan!</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lembaga / Website</label>
              <input
                type="text"
                value={settingsForm.siteName}
                onChange={(e) => setSettingsForm({ ...settingsForm, siteName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tagline Sub-Judul Utama</label>
              <input
                type="text"
                value={settingsForm.siteTagline}
                onChange={(e) => setSettingsForm({ ...settingsForm, siteTagline: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-600" /> Nomor CS / WhatsApp Helpdesk
              </label>
              <input
                type="text"
                value={settingsForm.csPhoneWhatsApp}
                onChange={(e) => setSettingsForm({ ...settingsForm, csPhoneWhatsApp: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-blue-600" /> Email Resmi Lembaga
              </label>
              <input
                type="email"
                value={settingsForm.contactEmail}
                onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-600" /> Alamat Kantor Cabang Jember
              </label>
              <input
                type="text"
                value={settingsForm.officeAddress}
                onChange={(e) => setSettingsForm({ ...settingsForm, officeAddress: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Running Banner Section */}
          <div className="p-5 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-900 flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-amber-600" /> Teks Banner Running Announcement
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-amber-900">
                <span>Status Aktif</span>
                <input
                  type="checkbox"
                  checked={settingsForm.emergencyBannerActive}
                  onChange={(e) => setSettingsForm({ ...settingsForm, emergencyBannerActive: e.target.checked })}
                  className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
                />
              </label>
            </div>
            <input
              type="text"
              value={settingsForm.emergencyBannerText}
              onChange={(e) => setSettingsForm({ ...settingsForm, emergencyBannerText: e.target.value })}
              placeholder="Teks pengumuman berjaalan di atas website..."
              className="w-full bg-white border border-amber-200 rounded-xl p-3 text-xs font-bold text-slate-800"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#0F3D7A] hover:bg-blue-900 text-amber-300 font-black px-6 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Website</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: NEWS & ANNOUNCEMENT LIST */}
      {activeTab === 'news' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
            <span className="font-bold text-xs text-slate-800">
              Daftar Pengumuman & Berita Kegiatan Prospect Jember ({news.length})
            </span>
            <button
              onClick={handleOpenAddNews}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Berita Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {news.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
                <div className="h-36 bg-slate-900 relative overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-80" />
                  <span className="absolute top-3 left-3 bg-purple-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block mb-1">{item.date} • {item.author}</span>
                    <h4 className="font-bold text-xs text-slate-800 line-clamp-2">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{item.summary}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEditNews(item)}
                      className="px-3 py-1 bg-blue-50 text-blue-900 rounded-lg text-xs font-bold hover:bg-blue-100 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteNews(item.id, item.title)}
                      className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FEATURE TOGGLES */}
      {activeTab === 'features' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-3">
            Saklar Status Fitur Website Publik (Realtime On/Off)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(websiteFeatures).map(([key, val]) => (
              <div
                key={key}
                onClick={() => toggleWebsiteFeature(key as keyof typeof websiteFeatures)}
                className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                  val ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div>
                  <span className="font-bold text-xs capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="block text-[10px] opacity-75">
                    {val ? 'Fitur Aktif di Website' : 'Fitur Nonaktif (Di-Hide)'}
                  </span>
                </div>
                {val ? (
                  <ToggleRight className="w-8 h-8 text-emerald-600 shrink-0" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-400 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit News Modal */}
      {isNewsModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-purple-900 p-5 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">{editingNewsId ? 'Edit Berita' : 'Tambah Berita / Pengumuman'}</h3>
              <button onClick={() => setIsNewsModalOpen(false)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleNewsSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Artikel / Pengumuman *</label>
                <input
                  type="text"
                  required
                  value={newsForm.title}
                  onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                <input
                  type="text"
                  value={newsForm.category}
                  onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ringkasan Singkat</label>
                <textarea
                  rows={2}
                  value={newsForm.summary}
                  onChange={(e) => setNewsForm({ ...newsForm, summary: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Isi Lengkap Artikel *</label>
                <textarea
                  rows={4}
                  required
                  value={newsForm.content}
                  onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Batal
                </button>
                <button type="submit" className="px-5 py-2 bg-purple-900 text-white font-bold text-xs rounded-xl">
                  Simpan Artikel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
