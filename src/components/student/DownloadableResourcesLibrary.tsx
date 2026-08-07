import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StudyResource, ProgramType } from '../../types';
import { ConfirmActionModal } from '../admin/ConfirmActionModal';
import {
  FileText,
  Download,
  Search,
  Filter,
  Upload,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Eye,
  Trash2,
  X,
  FileCode,
  HardDrive,
  UserCheck,
  Tag,
  Plus,
  ArrowDownToLine,
  ExternalLink,
  Printer,
  HelpCircle,
  Clock,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface DownloadableResourcesLibraryProps {
  compact?: boolean;
}

export const DownloadableResourcesLibrary: React.FC<DownloadableResourcesLibraryProps> = ({
  compact = false,
}) => {
  const {
    studyResources,
    addStudyResource,
    deleteStudyResource,
    incrementResourceDownloadCount,
    currentRole,
    currentCandidate,
    t,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const initialProgramFilter = currentCandidate?.selectedProgram?.startsWith('taiwan')
    ? 'taiwan'
    : currentCandidate?.selectedProgram?.startsWith('japan')
    ? 'japan'
    : 'all';
  const [selectedProgram, setSelectedProgram] = useState<string>(initialProgramFilter);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewResource, setPreviewResource] = useState<StudyResource | null>(null);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);
  const [deletingResource, setDeletingResource] = useState<StudyResource | null>(null);

  // New Resource Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<StudyResource['category']>('mandarin');
  const [newProgramType, setNewProgramType] = useState<ProgramType | 'all'>('all');
  const [newFileFormat, setNewFileFormat] = useState<'pdf' | 'docx' | 'zip'>('pdf');
  const [newFileSizeMb, setNewFileSizeMb] = useState<number>(3.5);
  const [newUploadedBy, setNewUploadedBy] = useState('Instruktur LPK Prospect Jember');
  const [newTags, setNewTags] = useState('pdf, modul, panduan');

  // Filtered list
  const filteredResources = useMemo(() => {
    return studyResources.filter((res) => {
      // Search
      const matchesSearch =
        res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        res.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());

      // Category
      const matchesCategory =
        selectedCategory === 'all' || res.category === selectedCategory;

      // Program
      const matchesProgram =
        selectedProgram === 'all' ||
        res.programType === 'all' ||
        res.programType === selectedProgram;

      return matchesSearch && matchesCategory && matchesProgram;
    });
  }, [studyResources, searchQuery, selectedCategory, selectedProgram]);

  // Overall Library Stats
  const totalFilesCount = studyResources.length;
  const totalDownloads = studyResources.reduce((acc, curr) => acc + curr.downloadCount, 0);
  const totalSizeMb = studyResources.reduce((acc, curr) => acc + curr.fileSizeMb, 0).toFixed(1);

  // Trigger Download
  const handleDownload = (resource: StudyResource) => {
    incrementResourceDownloadCount(resource.id);

    // Create virtual blob download link for demo
    const dummyText = `%PDF-1.4\n1 0 obj\n<< /Title (${resource.title}) /Author (${resource.uploadedBy}) /Subject (Modul Pembelajaran Prospect Jember) >>\nendobj\n... [Sistem PDF Offine LPK Prospect Jember]`;
    const blob = new Blob([dummyText], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resource.title.replace(/[^a-zA-Z0-9]/g, '_')}.${resource.fileFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccessToast(`Modul "${resource.title}" berhasil diunduh untuk akses offline!`);
    setTimeout(() => setDownloadSuccessToast(null), 4000);
  };

  // Submit New Upload
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const categoryLabelMap: Record<StudyResource['category'], string> = {
      mandarin: 'Bahasa Mandarin',
      japanese: 'Bahasa Jepang',
      worksheet: 'Lembar Kerja / Worksheet',
      visa_guide: 'Panduan Visa & Dokumen',
      general: 'Panduan Umum & Budaya',
    };

    addStudyResource({
      title: newTitle,
      description: newDesc,
      category: newCategory,
      categoryLabel: categoryLabelMap[newCategory],
      programType: newProgramType,
      fileFormat: newFileFormat,
      fileSizeMb: Number(newFileSizeMb) || 2.5,
      downloadUrl: '#',
      uploadedBy: newUploadedBy || 'Instruktur Prospect Jember',
      tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    // Reset Form
    setNewTitle('');
    setNewDesc('');
    setNewFileSizeMb(3.5);
    setNewTags('pdf, modul, panduan');
    setShowUploadModal(false);

    setDownloadSuccessToast('Modul PDF / Worksheet baru berhasil diunggah dan tersedia untuk siswa!');
    setTimeout(() => setDownloadSuccessToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {downloadSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white border border-amber-500/50 p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Berhasil Diunduh</p>
            <p className="text-[11px] text-slate-300">{downloadSuccessToast}</p>
          </div>
        </div>
      )}

      {/* Main Top Header Banner */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-red-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-3.5 py-1 rounded-full text-xs font-bold shadow-2xs">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>{t('Perpustakaan Digital Offline', 'Downloadable Resources Library')}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-serif text-white tracking-tight">
              Modul Panduan & Lembar Kerja (Worksheet PDF)
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Unduh panduan tata bahasa, buku latihan Kanji/Bopomofo, dan checklist persiapan berkas visa untuk dipelajari secara offline di mana saja tanpa koneksi internet.
            </p>
          </div>

          {/* Quick Stats Summary & Upload CTA */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-3.5 flex items-center gap-4 shadow-lg">
              <div className="text-center px-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Berkas</span>
                <span className="text-xl font-black font-mono text-amber-400">{totalFilesCount} File</span>
              </div>
              <div className="h-8 w-px bg-slate-700/80" />
              <div className="text-center px-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Unduhan</span>
                <span className="text-xl font-black font-mono text-emerald-400">{totalDownloads}x</span>
              </div>
              <div className="h-8 w-px bg-slate-700/80" />
              <div className="text-center px-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Penyimpanan</span>
                <span className="text-xl font-black font-mono text-slate-200">{totalSizeMb} MB</span>
              </div>
            </div>

            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-3.5 rounded-2xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Unggah Modul / Worksheet</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 shadow-2xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari modul PDF, worksheet Kanji/Bopomofo, kata kunci, atau instruktur..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-red-800 focus:bg-white outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Program Select Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-600 hidden sm:inline">Program Target:</span>
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 px-3 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-red-800 cursor-pointer"
            >
              <option value="all">Semua Program Target</option>
              <option value="taiwan_ifp">🇹🇼 Beasiswa Taiwan S1</option>
              <option value="japan_ssw">🇯🇵 Tokutei Ginou Jepang</option>
              <option value="japan_im">🇯🇵 Magang IM Japan</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-red-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua Modul
          </button>
          <button
            onClick={() => setSelectedCategory('mandarin')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              selectedCategory === 'mandarin'
                ? 'bg-red-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🇹🇼 Bahasa Mandarin
          </button>
          <button
            onClick={() => setSelectedCategory('japanese')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              selectedCategory === 'japanese'
                ? 'bg-red-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🇯🇵 Bahasa Jepang
          </button>
          <button
            onClick={() => setSelectedCategory('worksheet')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              selectedCategory === 'worksheet'
                ? 'bg-red-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            📝 Lembar Kerja (Worksheet)
          </button>
          <button
            onClick={() => setSelectedCategory('visa_guide')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              selectedCategory === 'visa_guide'
                ? 'bg-red-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ✈️ Panduan Visa & Dokumen
          </button>
          <button
            onClick={() => setSelectedCategory('general')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              selectedCategory === 'general'
                ? 'bg-red-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🌐 Umum & Budaya Kerja
          </button>
        </div>
      </div>

      {/* Grid of Downloadable Resources */}
      {filteredResources.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-slate-800 text-sm">Tidak Ada Materi Yang Sesuai Filter</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau pilih kategori lain di atas.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedProgram('all');
            }}
            className="text-xs font-bold text-red-800 hover:underline cursor-pointer pt-2"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResources.map((resource) => {
            const isPdf = resource.fileFormat === 'pdf';
            const isZip = resource.fileFormat === 'zip';

            return (
              <div
                key={resource.id}
                className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition group relative overflow-hidden"
              >
                {/* Top Badge & Delete Option */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {resource.categoryLabel}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {/* Format Tag */}
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase font-mono ${
                          isPdf
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : isZip
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {resource.fileFormat}
                      </span>

                      {/* Delete Button for Admins or Instruktur */}
                      <button
                        onClick={() => setDeletingResource(resource)}
                        title="Hapus materi ini"
                        className="p-1 text-slate-300 hover:text-red-600 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-3 rounded-2xl shrink-0 ${
                        isPdf
                          ? 'bg-red-50 text-red-700 border border-red-100'
                          : isZip
                          ? 'bg-amber-50 text-amber-700 border border-amber-100'
                          : 'bg-blue-50 text-blue-700 border border-blue-100'
                      }`}
                    >
                      <FileText className="w-6 h-6" />
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-red-800 transition line-clamp-2">
                        {resource.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {resource.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Tags & Meta */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  {/* Tags */}
                  {resource.tags && resource.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {resource.tags.map((tag, idx) => (
                        <span key={idx} className="text-[9px] text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded font-mono">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* File Metadata Info */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-slate-400" />
                      <span className="truncate max-w-[140px]">{resource.uploadedBy}</span>
                    </span>
                    <span className="font-mono text-slate-600">{resource.fileSizeMb} MB</span>
                  </div>

                  {/* Actions Buttons: Preview & Download */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => setPreviewResource(resource)}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Pratinjau</span>
                    </button>

                    <button
                      onClick={() => handleDownload(resource)}
                      className="w-full bg-red-800 hover:bg-red-900 text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh ({resource.downloadCount})</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload New Resource Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-3 bg-red-100 text-red-800 rounded-2xl">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base font-serif">Unggah Materi PDF / Worksheet</h3>
                <p className="text-xs text-slate-500">Formulir penambahan materi pembelajaran offline untuk siswa LPK Prospect</p>
              </div>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Judul Modul / Berkas PDF *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Modul Percakapan Mandarin TOCFL A2 (PDF)"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Deskripsi Singkat *</label>
                <textarea
                  required
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Penjelasan ringkas isi modul, topik tata bahasa, atau instruksi penggunaan lembar kerja..."
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Kategori Materi</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-800 bg-white"
                  >
                    <option value="mandarin">Bahasa Mandarin</option>
                    <option value="japanese">Bahasa Jepang</option>
                    <option value="worksheet">Lembar Kerja (Worksheet)</option>
                    <option value="visa_guide">Panduan Visa & Dokumen</option>
                    <option value="general">Umum & Budaya Kerja</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Program Target</label>
                  <select
                    value={newProgramType}
                    onChange={(e) => setNewProgramType(e.target.value as any)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-800 bg-white"
                  >
                    <option value="all">Semua Program</option>
                    <option value="taiwan_ifp">Beasiswa Taiwan S1</option>
                    <option value="japan_ssw">Tokutei Ginou Jepang</option>
                    <option value="japan_im">Magang IM Japan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Format Berkas</label>
                  <select
                    value={newFileFormat}
                    onChange={(e) => setNewFileFormat(e.target.value as any)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-800 bg-white"
                  >
                    <option value="pdf">PDF Document (.pdf)</option>
                    <option value="docx">Word Document (.docx)</option>
                    <option value="zip">ZIP Archive (.zip)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Ukuran File (MB)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={newFileSizeMb}
                    onChange={(e) => setNewFileSizeMb(parseFloat(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nama Pengunggah / Instruktur</label>
                <input
                  type="text"
                  value={newUploadedBy}
                  onChange={(e) => setNewUploadedBy(e.target.value)}
                  placeholder="Nama Instruktur atau Divisi LPK Prospect"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Tags / Kata Kunci (Dipisah Koma)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="kanji, stroke order, N5, latihan"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-red-800"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-red-800 hover:bg-red-900 text-white font-bold py-3 rounded-xl transition shadow-md"
                >
                  Publikasikan Materi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF / Document Interactive Preview Modal */}
      {previewResource && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setPreviewResource(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-3 bg-red-100 text-red-800 rounded-2xl">
                <FileText className="w-6 h-6" />
              </div>
              <div className="min-w-0 pr-8">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-red-50 text-red-800 border border-red-200 rounded-md">
                  Pratinjau Dokumen {previewResource.fileFormat.toUpperCase()}
                </span>
                <h3 className="font-bold text-slate-900 text-base font-serif truncate mt-1">
                  {previewResource.title}
                </h3>
              </div>
            </div>

            {/* Document Viewer Simulation */}
            <div className="bg-slate-900 rounded-2xl p-4 text-white space-y-4 shadow-inner">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>LPK Prospect Jember Secured Document</span>
                </span>
                <span className="font-mono text-amber-400">Halaman 1 dari 24</span>
              </div>

              <div className="bg-white text-slate-900 p-6 rounded-xl space-y-4 font-serif leading-relaxed text-xs shadow-md border border-slate-300">
                <div className="text-center space-y-1 border-b border-slate-200 pb-4">
                  <h2 className="text-base font-black uppercase text-red-900">{previewResource.title}</h2>
                  <p className="text-[10px] text-slate-500 font-sans">
                    Diterbitkan oleh {previewResource.uploadedBy} • Tanggal: {previewResource.uploadedAt}
                  </p>
                </div>

                <div className="space-y-2 font-sans">
                  <h4 className="font-bold text-slate-900 text-xs">RINGKASAN PANDUAN & ATURAN BELAJAR:</h4>
                  <p className="text-slate-600 text-[11px]">
                    {previewResource.description}
                  </p>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 mt-3">
                    <span className="font-bold text-red-900 text-[11px] block">Daftar Pokok Bahasan Modul:</span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-700 text-[11px]">
                      <li>Pengenalan tata bahasa & kosakata frekuensi tinggi.</li>
                      <li>Contoh percakapan kontekstual dunia kerja & universitas.</li>
                      <li>Lembar latihan mandiri (Worksheet) beserta kunci jawaban.</li>
                      <li>Tips lolos seleksi wawancara langsung bersama mitra luar negeri.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-xs text-slate-500">
                Ukuran file: <strong className="text-slate-800">{previewResource.fileSizeMb} MB</strong>
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setPreviewResource(null)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    handleDownload(previewResource);
                    setPreviewResource(null);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-red-800 hover:bg-red-900 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh File Offline</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deleting Resource */}
      <ConfirmActionModal
        isOpen={!!deletingResource}
        onClose={() => setDeletingResource(null)}
        onConfirm={() => {
          if (deletingResource) {
            deleteStudyResource(deletingResource.id);
            setDeletingResource(null);
          }
        }}
        title="Hapus Materi Perpustakaan Digital?"
        description={
          deletingResource ? (
            <span>
              Apakah Anda yakin ingin menghapus modul / worksheet <strong>"{deletingResource.title}"</strong>? Materi yang dihapus tidak dapat diunduh lagi oleh siswa.
            </span>
          ) : ''
        }
        confirmText="Ya, Hapus Materi"
        variant="danger"
        iconType="trash"
      />
    </div>
  );
};
