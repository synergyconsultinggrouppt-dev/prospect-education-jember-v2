import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LMSModule, StudyResource } from '../../types';
import {
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  Video,
  FileText,
  Download,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  X,
  UploadCloud,
  HelpCircle,
  PlayCircle,
} from 'lucide-react';

export const AdminLMSManager: React.FC = () => {
  const {
    lmsModules,
    addLMSModule,
    updateLMSModule,
    deleteLMSModule,
    studyResources,
    addStudyResource,
    deleteStudyResource,
    programs,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'modules' | 'resources'>('modules');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  // Modals state
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);

  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);

  // Form states for LMS Module
  const [moduleForm, setModuleForm] = useState<Partial<LMSModule>>({
    id: `mod_${Date.now()}`,
    programId: 'taiwan_ifp',
    title: '',
    category: 'Bahasa Mandarin',
    description: '',
    durationMinutes: 45,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    isCompleted: false,
    progressPercent: 0,
    timeSpentMinutes: 0,
    quizQuestions: [
      {
        question: 'Bagaimana cara mengucapkan "Selamat Pagi" dalam Bahasa Mandarin?',
        options: ['Zǎo shang hǎo', 'Xià wǔ hǎo', 'Wǎn shang hǎo', 'Xiè xie'],
        correctAnswer: 0,
      },
    ],
  });

  // Form states for Resource PDF
  const [resourceForm, setResourceForm] = useState({
    title: '',
    category: 'E-Book / Modul',
    fileType: 'pdf' as const,
    fileSize: '4.5 MB',
    fileUrl: '#',
    description: '',
    programType: 'taiwan_ifp' as const,
  });

  const filteredModules = lmsModules.filter((m) => {
    const matchCat = selectedCategory === 'Semua' || m.category === selectedCategory;
    const matchSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredResources = studyResources.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAddModule = () => {
    setEditingModuleId(null);
    setModuleForm({
      id: `mod_${Date.now()}`,
      programId: 'taiwan_ifp',
      title: '',
      category: 'Bahasa Mandarin',
      description: '',
      durationMinutes: 45,
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      isCompleted: false,
      progressPercent: 0,
      timeSpentMinutes: 0,
      quizQuestions: [
        {
          question: 'Bagaimana mengucapkan "Terima Kasih" dalam Mandarin?',
          options: ['Xiè xie', 'Zàijiàn', 'Nǐ hǎo', 'Duì bu qǐ'],
          correctAnswer: 0,
        },
      ],
    });
    setIsModuleModalOpen(true);
  };

  const handleOpenEditModule = (mod: LMSModule) => {
    setEditingModuleId(mod.id);
    setModuleForm({ ...mod });
    setIsModuleModalOpen(true);
  };

  const handleDeleteModule = (id: string, title: string) => {
    if (confirm(`Hapus modul pembelajaran '${title}'?`)) {
      deleteLMSModule(id);
    }
  };

  const handleModuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleForm.title || !moduleForm.description) {
      alert('Judul dan deskripsi modul wajib diisi.');
      return;
    }

    if (editingModuleId) {
      updateLMSModule(editingModuleId, moduleForm);
    } else {
      addLMSModule(moduleForm as LMSModule);
    }

    setIsModuleModalOpen(false);
  };

  const handleResourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceForm.title) {
      alert('Judul materi wajib diisi.');
      return;
    }

    addStudyResource({
      title: resourceForm.title,
      category: resourceForm.category,
      fileType: resourceForm.fileType,
      fileSize: resourceForm.fileSize,
      fileUrl: resourceForm.fileUrl || '#',
      description: resourceForm.description,
      programType: resourceForm.programType,
    });

    setIsResourceModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-8 -translate-y-8">
          <Video className="w-64 h-64 text-sky-300" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-sky-400/20 text-sky-300 px-3 py-1 rounded-full text-xs font-bold mb-2 backdrop-blur-xs border border-sky-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Manajemen LMS & Kurikulum Pembelajaran Interaktif</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Kelola Modul Pembelajaran & E-Book
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl mt-1">
              Atur materi video interaktif, kuis latihan harian, e-book PDF downloadable, serta silabus persiapan
              keberangkatan Taiwan & Jepang untuk peserta Prospect Jember.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleOpenAddModule}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Tambah Modul Pembelajaran</span>
            </button>
            <button
              onClick={() => setIsResourceModalOpen(true)}
              className="bg-sky-500 hover:bg-sky-400 text-white font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer active:scale-95"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload PDF / E-Book</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs and Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('modules')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'modules'
                ? 'bg-[#0F3D7A] text-amber-300 shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Modul Pembelajaran & Video ({lmsModules.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'resources'
                ? 'bg-[#0F3D7A] text-amber-300 shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Modul PDF / E-Book Unduhan ({studyResources.length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari materi pembelajaran..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* MODULES TAB */}
      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredModules.map((mod) => (
            <div
              key={mod.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition"
            >
              <div className="bg-slate-900 p-4 text-white relative">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="bg-sky-500/20 text-sky-300 border border-sky-400/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    {mod.category}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" /> {mod.durationMinutes} Mins
                  </span>
                </div>
                <h3 className="font-bold text-sm leading-snug line-clamp-2">{mod.title}</h3>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{mod.description}</p>

                <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px]">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-indigo-600" /> Quiz Interaktif
                    </span>
                    <span className="font-bold text-indigo-900">{mod.quizQuestions?.length || 0} Soal</span>
                  </div>
                  {mod.videoUrl && (
                    <div className="flex items-center gap-1 text-emerald-700 font-bold truncate">
                      <PlayCircle className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Video Link Tersedia</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">ID: {mod.id}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModule(mod)}
                      className="p-1.5 bg-blue-50 text-blue-900 hover:bg-blue-100 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteModule(mod.id, mod.title)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Hapus Modul"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RESOURCES TAB */}
      {activeTab === 'resources' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-blue-900 flex justify-between items-center">
            <span>Daftar Dokumen PDF & Modul Cetak Pembekalan ({filteredResources.length})</span>
            <span className="text-[10px] text-slate-500 font-normal">Dapat diunduh oleh seluruh siswa LMS</span>
          </div>
          <div className="divide-y divide-slate-100">
            {filteredResources.map((res) => (
              <div key={res.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-red-50 text-red-600 rounded-2xl border border-red-100 shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {res.category}
                      </span>
                      <span className="text-[10px] text-slate-400">{res.fileSize}</span>
                      <span className="text-[10px] text-emerald-600 font-bold">
                        {res.downloadCount || 0}x Diunduh
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-800">{res.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{res.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteStudyResource(res.id)}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer shrink-0"
                  title="Hapus File"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Add/Edit Module */}
      {isModuleModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="bg-[#0F3D7A] p-5 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Video className="w-5 h-5 text-amber-300" />
                <span>{editingModuleId ? 'Edit Modul Pembelajaran' : 'Tambah Modul Pembelajaran Baru'}</span>
              </h3>
              <button onClick={() => setIsModuleModalOpen(false)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModuleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Modul Pembelajaran *</label>
                <input
                  type="text"
                  required
                  value={moduleForm.title}
                  onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                  placeholder="Contoh: Bahasa Mandarin Bab 1: Perkenalan Diri (Zì wǒ jiè shào)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Pembelajaran</label>
                  <select
                    value={moduleForm.category}
                    onChange={(e) => setModuleForm({ ...moduleForm, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
                  >
                    <option value="Bahasa Mandarin">🇹🇼 Bahasa Mandarin</option>
                    <option value="Bahasa Jepang">🇯🇵 Bahasa Jepang</option>
                    <option value="Budaya & Etos Kerja">🏛️ Budaya & Etos Kerja</option>
                    <option value="Orientasi Karir & Pembekalan">💼 Orientasi Karir</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Durasi Belajar (Menit)</label>
                  <input
                    type="number"
                    value={moduleForm.durationMinutes}
                    onChange={(e) => setModuleForm({ ...moduleForm, durationMinutes: parseInt(e.target.value) || 30 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi & Target Belajar *</label>
                <textarea
                  rows={3}
                  required
                  value={moduleForm.description}
                  onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                  placeholder="Penjelasan ringkas mengenai topik modul..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">URL Video Pembelajaran (Embed/YouTube)</label>
                <input
                  type="text"
                  value={moduleForm.videoUrl}
                  onChange={(e) => setModuleForm({ ...moduleForm, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModuleModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0F3D7A] text-amber-300 font-bold text-xs rounded-xl shadow-xs"
                >
                  Simpan Modul
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Add Resource PDF */}
      {isResourceModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-[#0F3D7A] p-5 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-sky-300" />
                <span>Upload Modul Pembelajaran PDF</span>
              </h3>
              <button onClick={() => setIsResourceModalOpen(false)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResourceSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Dokumen Modul *</label>
                <input
                  type="text"
                  required
                  value={resourceForm.title}
                  onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                  placeholder="Contoh: Modul Tata Bahasa Mandarin TOCFL Band A"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Dokumen</label>
                <input
                  type="text"
                  value={resourceForm.category}
                  onChange={(e) => setResourceForm({ ...resourceForm, category: e.target.value })}
                  placeholder="Contoh: E-Book Bahasa"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Keterangan / Deskripsi Ringkas</label>
                <textarea
                  rows={2}
                  value={resourceForm.description}
                  onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
                  placeholder="Panduan komprehensif kosakata dan percakapan..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsResourceModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Batal
                </button>
                <button type="submit" className="px-5 py-2 bg-[#0F3D7A] text-sky-200 font-bold text-xs rounded-xl">
                  Simpan & Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
