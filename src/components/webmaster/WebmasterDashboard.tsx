import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WebmasterUser, NewsArticle, WebsiteFeatures } from '../../types';
import { NotificationBell } from '../NotificationBell';
import {
  Globe,
  Users,
  Sliders,
  Settings,
  Newspaper,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  Power,
  ShieldCheck,
  Search,
  Activity,
  BarChart2,
  FileText,
  AlertTriangle,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Eye,
  Check,
  X,
  Sparkles,
  Lock,
  Unlock,
  Radio,
  Image as ImageIcon,
} from 'lucide-react';

export const WebmasterDashboard: React.FC = () => {
  const {
    webmasters = [],
    websiteFeatures,
    websiteSettings,
    addWebmasterUser,
    updateWebmasterUser,
    deleteWebmasterUser,
    toggleWebsiteFeature,
    updateWebsiteSettings,
    news = [],
    addNewsArticle,
    deleteNewsArticle,
    updateNewsArticle,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'team' | 'features' | 'identity' | 'content' | 'logs'>('team');

  // Webmaster User Form State
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    roleType: 'Content Editor' as WebmasterUser['roleType'],
    assignedScope: 'Berita, Artikel & Banner',
  });

  // Edit Webmaster Modal State
  const [editingUser, setEditingUser] = useState<WebmasterUser | null>(null);

  // Settings Form State
  const [siteForm, setSiteForm] = useState({ ...websiteSettings });

  // News Form State
  const [isAddNewsModalOpen, setIsAddNewsModalOpen] = useState(false);
  const [newNewsForm, setNewNewsForm] = useState({
    title: '',
    category: 'Pengumuman' as NewsArticle['category'],
    author: 'Pengelola Website',
    summary: '',
    content: '',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    featured: false,
  });

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.fullName || !newUserForm.email) return;

    addWebmasterUser({
      fullName: newUserForm.fullName,
      email: newUserForm.email,
      phone: newUserForm.phone || '08123456789',
      roleType: newUserForm.roleType,
      status: 'active',
      assignedScope: newUserForm.assignedScope,
    });

    setNewUserForm({
      fullName: '',
      email: '',
      phone: '',
      roleType: 'Content Editor',
      assignedScope: 'Berita, Artikel & Banner',
    });
    setIsAddUserModalOpen(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteSettings(siteForm);
  };

  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNewsForm.title || !newNewsForm.summary) return;

    addNewsArticle({
      id: `news-${Date.now()}`,
      title: newNewsForm.title,
      category: newNewsForm.category,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      author: newNewsForm.author,
      summary: newNewsForm.summary,
      content: newNewsForm.content || newNewsForm.summary,
      image: newNewsForm.image,
      featured: newNewsForm.featured,
    });

    setNewNewsForm({
      title: '',
      category: 'Pengumuman',
      author: 'Pengelola Website',
      summary: '',
      content: '',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
      featured: false,
    });
    setIsAddNewsModalOpen(false);
  };

  const filteredWebmasters = webmasters.filter(
    (w) =>
      w.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.roleType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-10 bg-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Top Header Panel */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-indigo-800/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-indigo-900/80 border border-indigo-700/60 text-indigo-200 px-3 py-1 rounded-full text-xs font-bold">
                <Globe className="w-4 h-4 text-indigo-400" />
                <span>PENGELOLA WEBSITE & KONTROL FITUR</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-serif text-white tracking-tight">
                Dashboard Pengelola Website (Webmaster Portal)
              </h1>
              <p className="text-indigo-200/80 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Kelola tim pengelola website, aktifkan/nonaktifkan fitur website, sunting berita & galeri, serta atur identitas & meta SEO platform Prospect Education Jember.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="bg-slate-900/80 border border-indigo-800/60 px-3.5 py-2 rounded-2xl flex items-center gap-2.5 text-xs">
                <span className="p-1.5 sm:p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                </span>
                <div>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold block">Status Server</span>
                  <span className="font-bold text-emerald-400 text-xs sm:text-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online (99.9%)
                  </span>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-indigo-800/60 px-3.5 py-2 rounded-2xl flex items-center gap-2.5 text-xs">
                <span className="p-1.5 sm:p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                </span>
                <div>
                  <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold block">Tim Pengelola</span>
                  <span className="font-bold text-amber-300 text-xs sm:text-sm">{webmasters.length} User Aktif</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Features Status Pills */}
          <div className="mt-6 pt-6 border-t border-indigo-800/50 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
            <div className="bg-indigo-950/60 border border-indigo-800/40 p-2.5 rounded-xl flex items-center justify-between">
              <span className="text-slate-300 text-[11px]">Pendaftaran Online</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${websiteFeatures.onlineRegistration ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                {websiteFeatures.onlineRegistration ? 'ON' : 'OFF'}
              </span>
            </div>

            <div className="bg-indigo-950/60 border border-indigo-800/40 p-2.5 rounded-xl flex items-center justify-between">
              <span className="text-slate-300 text-[11px]">Sistem LMS</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${websiteFeatures.lmsLearningSystem ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                {websiteFeatures.lmsLearningSystem ? 'ON' : 'OFF'}
              </span>
            </div>

            <div className="bg-indigo-950/60 border border-indigo-800/40 p-2.5 rounded-xl flex items-center justify-between">
              <span className="text-slate-300 text-[11px]">Konsultan AI</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${websiteFeatures.aiConsultantAssistant ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                {websiteFeatures.aiConsultantAssistant ? 'ON' : 'OFF'}
              </span>
            </div>

            <div className="bg-indigo-950/60 border border-indigo-800/40 p-2.5 rounded-xl flex items-center justify-between">
              <span className="text-slate-300 text-[11px]">WhatsApp Helpdesk</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${websiteFeatures.whatsappHelpdesk ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                {websiteFeatures.whatsappHelpdesk ? 'ON' : 'OFF'}
              </span>
            </div>

            <div className="bg-indigo-950/60 border border-indigo-800/40 p-2.5 rounded-xl flex items-center justify-between">
              <span className="text-slate-300 text-[11px]">Banner Darurat</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${websiteFeatures.runningBanner ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-500/20 text-slate-400'}`}>
                {websiteFeatures.runningBanner ? 'ON' : 'OFF'}
              </span>
            </div>

            <div className="bg-indigo-950/60 border border-indigo-800/40 p-2.5 rounded-xl flex items-center justify-between">
              <span className="text-slate-300 text-[11px]">Pemeliharaan</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${websiteFeatures.maintenanceMode ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
                {websiteFeatures.maintenanceMode ? 'AKTIF' : 'NORMAL'}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('team')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
              activeTab === 'team'
                ? 'bg-indigo-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Tim Pengelola Website ({webmasters.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('features')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
              activeTab === 'features'
                ? 'bg-indigo-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Manajemen Fitur Website</span>
          </button>

          <button
            onClick={() => setActiveTab('identity')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
              activeTab === 'identity'
                ? 'bg-indigo-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Identitas & SEO Website</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
              activeTab === 'content'
                ? 'bg-indigo-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>CMS Berita & Konten ({news.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
              activeTab === 'logs'
                ? 'bg-indigo-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Log Sistem & Traffic Analytics</span>
          </button>
        </div>

        {/* TAB 1: USER PENGELOLA WEBSITE (WEBMASTER TEAM) */}
        {activeTab === 'team' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-serif">Daftar Tim Pengelola Website</h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Manajemen akun webmaster, content editor, SEO specialist, dan admin sistem website.
                </p>
              </div>

              <button
                onClick={() => setIsAddUserModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 bg-indigo-900 hover:bg-indigo-950 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Pengelola Baru</span>
              </button>
            </div>

            {/* Filter Search */}
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Cari nama, email, atau jabatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            {/* Webmaster Users Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-4">Pengelola Website</th>
                    <th className="p-4">Kontak / No. WA</th>
                    <th className="p-4">Jabatan / Role</th>
                    <th className="p-4">Akses & Scope</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Terakhir Aktif</th>
                    <th className="p-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredWebmasters.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition">
                      <td className="p-4">
                        <div className="font-bold text-slate-900">{user.fullName}</div>
                        <div className="text-[11px] text-slate-500">{user.email}</div>
                      </td>
                      <td className="p-4 font-mono text-[11px]">{user.phone}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
                          {user.roleType}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 font-medium">{user.assignedScope}</td>
                      <td className="p-4">
                        {user.status === 'active' ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3" /> Aktif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                            <XCircle className="w-3 h-3" /> Nonaktif
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-slate-500 text-[11px]">{user.lastActive}</td>
                      <td className="p-4 text-center space-x-1">
                        <button
                          onClick={() => {
                            const newStatus = user.status === 'active' ? 'inactive' : 'active';
                            updateWebmasterUser(user.id, { status: newStatus });
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                          title={user.status === 'active' ? 'Nonaktifkan User' : 'Aktifkan User'}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteWebmasterUser(user.id)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 transition cursor-pointer"
                          title="Hapus Pengelola"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: MANAJEMEN FITUR WEBSITE (FEATURE FLAGS) */}
        {activeTab === 'features' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-serif">Kontrol Sakelar Fitur Website</h3>
              <p className="text-slate-500 text-xs mt-0.5">
                Aktifkan atau nonaktifkan modul website secara langsung tanpa mengubah kode program.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1: Online Registration */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      Pendaftaran Online
                    </span>
                    <button
                      onClick={() => toggleWebsiteFeature('onlineRegistration')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        websiteFeatures.onlineRegistration ? 'bg-indigo-900' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          websiteFeatures.onlineRegistration ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Formulir Pendaftaran Online</h4>
                  <p className="text-xs text-slate-500">
                    Mengontrol ketersediaan formulir pendaftaran peserta baru beasiswa Taiwan & magang Jepang.
                  </p>
                </div>
                <div className="text-[11px] font-bold text-slate-700 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span>Status:</span>
                  <span className={websiteFeatures.onlineRegistration ? 'text-emerald-600 font-extrabold' : 'text-slate-400 font-semibold'}>
                    {websiteFeatures.onlineRegistration ? 'Pendaftaran BUKA (ON)' : 'Pendaftaran TUTUP (OFF)'}
                  </span>
                </div>
              </div>

              {/* Feature 2: LMS System */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded">
                      Learning System
                    </span>
                    <button
                      onClick={() => toggleWebsiteFeature('lmsLearningSystem')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        websiteFeatures.lmsLearningSystem ? 'bg-indigo-900' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          websiteFeatures.lmsLearningSystem ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Portal LMS e-Learning</h4>
                  <p className="text-xs text-slate-500">
                    Mengontrol akses siswa ke modul digital Mandarin TOCFL & Jepang JLPT serta sertifikat.
                  </p>
                </div>
                <div className="text-[11px] font-bold text-slate-700 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span>Status:</span>
                  <span className={websiteFeatures.lmsLearningSystem ? 'text-emerald-600 font-extrabold' : 'text-slate-400 font-semibold'}>
                    {websiteFeatures.lmsLearningSystem ? 'LMS AKTIF (ON)' : 'LMS NONAKTIF (OFF)'}
                  </span>
                </div>
              </div>

              {/* Feature 3: AI Consultant */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      Virtual Assistant
                    </span>
                    <button
                      onClick={() => toggleWebsiteFeature('aiConsultantAssistant')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        websiteFeatures.aiConsultantAssistant ? 'bg-indigo-900' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          websiteFeatures.aiConsultantAssistant ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Konsultan AI Virtual</h4>
                  <p className="text-xs text-slate-500">
                    Modul melayani pertanyaan calon peserta secara otomatis selama 24 jam di website.
                  </p>
                </div>
                <div className="text-[11px] font-bold text-slate-700 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span>Status:</span>
                  <span className={websiteFeatures.aiConsultantAssistant ? 'text-emerald-600 font-extrabold' : 'text-slate-400 font-semibold'}>
                    {websiteFeatures.aiConsultantAssistant ? 'AI Konsultan AKTIF' : 'AI Konsultan NONAKTIF'}
                  </span>
                </div>
              </div>

              {/* Feature 4: WA Helpdesk */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      WhatsApp Chat
                    </span>
                    <button
                      onClick={() => toggleWebsiteFeature('whatsappHelpdesk')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        websiteFeatures.whatsappHelpdesk ? 'bg-indigo-900' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          websiteFeatures.whatsappHelpdesk ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Tombol Chat WA Direct</h4>
                  <p className="text-xs text-slate-500">
                    Menampilkan floating button WhatsApp langsung ke Admin CS Prospect Education Jember.
                  </p>
                </div>
                <div className="text-[11px] font-bold text-slate-700 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span>Status:</span>
                  <span className={websiteFeatures.whatsappHelpdesk ? 'text-emerald-600 font-extrabold' : 'text-slate-400 font-semibold'}>
                    {websiteFeatures.whatsappHelpdesk ? 'Tombol WA Tampil' : 'Tombol WA Tersembunyi'}
                  </span>
                </div>
              </div>

              {/* Feature 5: Emergency Running Banner */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      Announcement Bar
                    </span>
                    <button
                      onClick={() => toggleWebsiteFeature('runningBanner')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        websiteFeatures.runningBanner ? 'bg-indigo-900' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          websiteFeatures.runningBanner ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Running Text Banner Darurat</h4>
                  <p className="text-xs text-slate-500">
                    Menampilkan pita pengumuman merah di bagian atas header website untuk informasi penting.
                  </p>
                </div>
                <div className="text-[11px] font-bold text-slate-700 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span>Status:</span>
                  <span className={websiteFeatures.runningBanner ? 'text-amber-600 font-extrabold' : 'text-slate-400 font-semibold'}>
                    {websiteFeatures.runningBanner ? 'Banner Aktif Tampil' : 'Banner Sembunyi'}
                  </span>
                </div>
              </div>

              {/* Feature 6: Maintenance Mode */}
              <div className="bg-red-50 p-5 rounded-2xl border border-red-200 space-y-3 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-800 bg-red-100 px-2 py-0.5 rounded flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Mode System
                    </span>
                    <button
                      onClick={() => toggleWebsiteFeature('maintenanceMode')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        websiteFeatures.maintenanceMode ? 'bg-red-700' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          websiteFeatures.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Mode Pemeliharaan (Maintenance)</h4>
                  <p className="text-xs text-slate-600">
                    Mengalihkan pengunjung website ke halaman pemberitahuan perbaikan sistem secara darurat.
                  </p>
                </div>
                <div className="text-[11px] font-bold text-slate-700 pt-2 border-t border-red-200 flex items-center justify-between">
                  <span>Status Mode:</span>
                  <span className={websiteFeatures.maintenanceMode ? 'text-red-700 font-extrabold' : 'text-emerald-700 font-bold'}>
                    {websiteFeatures.maintenanceMode ? 'DITUTUP (MAINTENANCE)' : 'SISTEM NORMAL'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PENGATURAN IDENTITAS & SEO WEBSITE */}
        {activeTab === 'identity' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-serif">Pengaturan Identitas & Meta SEO Website</h3>
              <p className="text-slate-500 text-xs mt-0.5">
                Sunting nama platform, tagline, teks banner darurat, kontak kantor Jember, serta kata kunci pencarian Google.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Nama Platform Website</label>
                  <input
                    type="text"
                    value={siteForm.siteName}
                    onChange={(e) => setSiteForm({ ...siteForm, siteName: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Tagline / Slogan Website</label>
                  <input
                    type="text"
                    value={siteForm.siteTagline}
                    onChange={(e) => setSiteForm({ ...siteForm, siteTagline: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Nomor WhatsApp CS Direct (Jember)</label>
                  <input
                    type="text"
                    value={siteForm.csPhoneWhatsApp}
                    onChange={(e) => setSiteForm({ ...siteForm, csPhoneWhatsApp: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Email Kontak Resmi</label>
                  <input
                    type="email"
                    value={siteForm.contactEmail}
                    onChange={(e) => setSiteForm({ ...siteForm, contactEmail: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Alamat Kantor LPK Prospect Jember</label>
                <textarea
                  rows={2}
                  value={siteForm.officeAddress}
                  onChange={(e) => setSiteForm({ ...siteForm, officeAddress: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Teks Running Banner Darurat Header</label>
                <textarea
                  rows={2}
                  value={siteForm.emergencyBannerText}
                  onChange={(e) => setSiteForm({ ...siteForm, emergencyBannerText: e.target.value })}
                  className="w-full p-3 bg-amber-50/80 border border-amber-300 rounded-xl text-xs text-amber-900 font-medium focus:ring-2 focus:ring-amber-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>Nama Pejabat / Penandatangan Surat Keterangan *</span>
                  </label>
                  <input
                    type="text"
                    value={siteForm.officialSignatoryName || ''}
                    onChange={(e) => setSiteForm({ ...siteForm, officialSignatoryName: e.target.value })}
                    placeholder="Contoh: Rohim Egy, S.Pd."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>Jabatan Pejabat Penandatangan *</span>
                  </label>
                  <input
                    type="text"
                    value={siteForm.officialSignatoryTitle || ''}
                    onChange={(e) => setSiteForm({ ...siteForm, officialSignatoryTitle: e.target.value })}
                    placeholder="Contoh: Kepala Cabang Prospect Education Jember"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Meta Description (SEO Google)</label>
                  <textarea
                    rows={3}
                    value={siteForm.metaDescription}
                    onChange={(e) => setSiteForm({ ...siteForm, metaDescription: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600"
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Meta Keywords (Pisahkan koma)</label>
                  <textarea
                    rows={3}
                    value={siteForm.metaKeywords}
                    onChange={(e) => setSiteForm({ ...siteForm, metaKeywords: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600"
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                className="bg-indigo-900 hover:bg-indigo-950 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-md cursor-pointer flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Perubahan Identitas & SEO Website</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: CMS BERITA & KONTEN WEBSITE */}
        {activeTab === 'content' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-serif">CMS Publikasi Berita & Artikel</h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  Tambah, sunting, dan hapus kabar berita keberangkatan, pengumuman beasiswa, serta agenda kegiatan.
                </p>
              </div>

              <button
                onClick={() => setIsAddNewsModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 bg-indigo-900 hover:bg-indigo-950 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tulis Berita Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <div key={item.id} className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="relative h-40 bg-slate-900">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 bg-indigo-900 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        {item.category}
                      </span>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="text-[10px] text-slate-400 font-semibold">{item.date} • {item.author}</div>
                      <h4 className="font-bold text-slate-900 text-xs line-clamp-2">{item.title}</h4>
                      <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">{item.summary}</p>
                    </div>
                  </div>

                  <div className="p-4 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500">ID: {item.id}</span>
                    <button
                      onClick={() => deleteNewsArticle(item.id)}
                      className="text-xs text-red-600 hover:text-red-800 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus Berita</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: LOG SISTEM & TRAFFIC ANALYTICS */}
        {activeTab === 'logs' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-serif">Log Aktivitas & Performa Website</h3>
              <p className="text-slate-500 text-xs mt-0.5">
                Riwayat perubahan yang dilakukan oleh pengelola website dan pemantauan latensi server.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-1">
                <span className="text-[10px] font-bold text-indigo-800 uppercase">Pengunjung Hari Ini</span>
                <div className="text-2xl font-black text-indigo-950">1,420 Visitor</div>
                <p className="text-[10px] text-slate-500">+18% dari pekan lalu (Organik Google)</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                <span className="text-[10px] font-bold text-emerald-800 uppercase">Respon Time Latensi</span>
                <div className="text-2xl font-black text-emerald-950">42 ms</div>
                <p className="text-[10px] text-slate-500">Cloud Run Deployment (Sangat Cepat)</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1">
                <span className="text-[10px] font-bold text-amber-800 uppercase">Konversi Pendaftar</span>
                <div className="text-2xl font-black text-amber-950">18.4%</div>
                <p className="text-[10px] text-slate-500">Pendaftar baru per 100 pengunjung</p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
                Log Aktivitas Pengelola Website Terbaru
              </h4>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-800 font-semibold">[LOG-902] Rizky Firmansyah (Head Webmaster) memperbarui Sakelar Fitur Website.</span>
                  <span className="text-slate-400 text-[10px]">Baru saja</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-800 font-semibold">[LOG-901] Anisa Rahmawati (Content Editor) mempublikasikan berita keberangkatan.</span>
                  <span className="text-slate-400 text-[10px]">2 Jam lalu</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-800 font-semibold">[LOG-900] Budi Santoso (SEO Specialist) memperbarui meta keywords portal.</span>
                  <span className="text-slate-400 text-[10px]">Kemarin</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: TAMBAH USER PENGELOLA WEBSITE */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-serif">Tambah User Pengelola Website</h3>
                <p className="text-xs text-slate-500">Berikan akses pengelolaan portal website kepada tim.</p>
              </div>
              <button onClick={() => setIsAddUserModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nama Lengkap Pengelola</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rahmat Hidayat, S.T."
                  value={newUserForm.fullName}
                  onChange={(e) => setNewUserForm({ ...newUserForm, fullName: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Email Resmi Pengelola</label>
                <input
                  type="email"
                  required
                  placeholder="rahmat.editor@prospect-jember.id"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nomor WhatsApp / Telp</label>
                <input
                  type="text"
                  placeholder="081234567890"
                  value={newUserForm.phone}
                  onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Jabatan / Spesialisasi Role</label>
                <select
                  value={newUserForm.roleType}
                  onChange={(e) => setNewUserForm({ ...newUserForm, roleType: e.target.value as any })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="Head Webmaster">Head Webmaster (Full System Control)</option>
                  <option value="Content Editor">Content Editor (Berita, Galeri & Banner)</option>
                  <option value="SEO Specialist">SEO Specialist (Meta & Analytics)</option>
                  <option value="System Admin">System Admin (Fitur & Server Logs)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Lingkup Tugas / Scope Akses</label>
                <input
                  type="text"
                  placeholder="Contoh: Berita, Galeri & Running Text Banner"
                  value={newUserForm.assignedScope}
                  onChange={(e) => setNewUserForm({ ...newUserForm, assignedScope: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-indigo-900 hover:bg-indigo-950 text-white font-bold py-2.5 rounded-xl transition shadow cursor-pointer"
                >
                  Simpan Pengelola
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: TULIS BERITA BARU */}
      {isAddNewsModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-serif">Tulis Berita Website Baru</h3>
                <p className="text-xs text-slate-500">Publikasikan pengumuman atau kabar keberangkatan.</p>
              </div>
              <button onClick={() => setIsAddNewsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNews} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Judul Berita</label>
                <input
                  type="text"
                  required
                  placeholder="Judul artikel berita..."
                  value={newNewsForm.title}
                  onChange={(e) => setNewNewsForm({ ...newNewsForm, title: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Kategori</label>
                  <select
                    value={newNewsForm.category}
                    onChange={(e) => setNewNewsForm({ ...newNewsForm, category: e.target.value as any })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-600"
                  >
                    <option value="Pengumuman">Pengumuman</option>
                    <option value="Artikel">Artikel</option>
                    <option value="Agenda">Agenda</option>
                    <option value="Prestasi">Prestasi</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Penulis / Author</label>
                  <input
                    type="text"
                    value={newNewsForm.author}
                    onChange={(e) => setNewNewsForm({ ...newNewsForm, author: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Ringkasan Berita (Singkat)</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ringkasan 2 kalimat untuk kartu berita..."
                  value={newNewsForm.summary}
                  onChange={(e) => setNewNewsForm({ ...newNewsForm, summary: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600"
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">URL Gambar Banner (Unsplash / Cloud)</label>
                <input
                  type="text"
                  value={newNewsForm.image}
                  onChange={(e) => setNewNewsForm({ ...newNewsForm, image: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddNewsModalOpen(false)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-indigo-900 hover:bg-indigo-950 text-white font-bold py-2.5 rounded-xl transition shadow cursor-pointer"
                >
                  Publikasikan Artikel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
