import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProgramInfo, ProgramType } from '../../types';
import {
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  Users,
  CheckCircle2,
  Search,
  Sparkles,
  GraduationCap,
  X,
  Layers,
  Globe,
  DollarSign,
  Clock,
  ExternalLink,
} from 'lucide-react';

export const AdminProgramManager: React.FC = () => {
  const { programs, addProgram, updateProgram, deleteProgram, candidates } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<'Semua' | 'Taiwan' | 'Jepang'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<ProgramInfo>>({
    id: 'taiwan_ifp' as ProgramType,
    title: '',
    category: 'Taiwan',
    badge: 'Program Baru',
    shortDesc: '',
    fullDesc: '',
    duration: '1 Tahun Bahasa + 4 Tahun S1',
    estimatedCost: 'Rp 15.000.000',
    targetQuota: 50,
    enrolledCount: 0,
    requirements: ['Lulusan SMA/SMK/MA sederajat', 'Fotokopi KTP & Kartu Keluarga', 'Sehat Jasmani dan Rohani'],
    benefits: ['Tanpa Syarat TOCFL/Mandarin', 'Izin Magang Kerja Berbayar'],
    stages: ['Pendaftaran Online', 'Pembekalan di Prospect Jember', 'Pemberangkatan'],
    partnerUniversitiesOrCompanies: ['Universitas Mitra Taiwan / Perusahaan Jepang'],
    faqs: [{ question: 'Apakah ada syarat sertifikat bahasa?', answer: 'Tidak wajib, pembekalan akan diberikan dari dasar.' }],
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
  });

  const [reqInput, setReqInput] = useState('');
  const [benefitInput, setBenefitInput] = useState('');
  const [stageInput, setStageInput] = useState('');
  const [partnerInput, setPartnerInput] = useState('');

  const filteredPrograms = programs.filter((p) => {
    const matchCat = selectedCategory === 'Semua' || p.category === selectedCategory;
    const matchSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleOpenAddModal = () => {
    setEditingProgramId(null);
    setFormData({
      id: `prog_${Date.now()}` as ProgramType,
      title: '',
      category: 'Taiwan',
      badge: 'Program Baru 2026',
      shortDesc: '',
      fullDesc: '',
      duration: '1 - 4 Tahun',
      estimatedCost: 'Rp 15.000.000',
      targetQuota: 40,
      enrolledCount: 0,
      requirements: ['Lulusan SMA/SMK/MA sederajat (Usia 17 - 25 tahun)', 'Fotokopi KTP & KK'],
      benefits: ['Jaminan Magang Berbayar', 'Sertifikat Pembekalan Prospect'],
      stages: ['Pendaftaran Online', 'Pembekalan Bahasa di Jember', 'Keberangkatan'],
      partnerUniversitiesOrCompanies: ['Universitas Mitra Prospect Jember'],
      faqs: [{ question: 'Berapa lama proses persiapannya?', answer: 'Sekitar 3 - 6 bulan pembekalan intensif.' }],
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prog: ProgramInfo) => {
    setEditingProgramId(prog.id);
    setFormData({ ...prog });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus program '${title}'? Tindakan ini tidak dapat dibatalkan.`)) {
      deleteProgram(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.shortDesc) {
      alert('Judul dan deskripsi singkat wajib diisi.');
      return;
    }

    if (editingProgramId) {
      updateProgram(editingProgramId, formData);
    } else {
      addProgram(formData as ProgramInfo);
    }

    setIsModalOpen(false);
  };

  const handleAddArrayItem = (
    field: 'requirements' | 'benefits' | 'stages' | 'partnerUniversitiesOrCompanies',
    value: string,
    resetFn: (v: string) => void
  ) => {
    if (!value.trim()) return;
    const currentArr = formData[field] || [];
    setFormData({ ...formData, [field]: [...currentArr, value.trim()] });
    resetFn('');
  };

  const handleRemoveArrayItem = (
    field: 'requirements' | 'benefits' | 'stages' | 'partnerUniversitiesOrCompanies',
    index: number
  ) => {
    const currentArr = formData[field] || [];
    setFormData({ ...formData, [field]: currentArr.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-8 -translate-y-8">
          <BookOpen className="w-64 h-64 text-amber-300" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold mb-2 backdrop-blur-xs border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Modul Manajemen Kurikulum & Program Pelatihan</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Kelola Program Pelatihan & Beasiswa
            </h2>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl mt-1">
              Tambah program studi baru, perbarui persyaratan, ubah rincian biaya, atur kuota penerimaan, dan sesuaikan
              silabus latihan untuk Prospect Education Cabang Jember.
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
            <span>Tambah Program Baru</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(['Semua', 'Taiwan', 'Jepang'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0F3D7A] text-amber-300 shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'Semua' ? '🌐 Semua Program' : cat === 'Taiwan' ? '🇹🇼 Program Taiwan' : '🇯🇵 Program Jepang'}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari program pelatihan..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Program Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPrograms.map((prog) => {
          const enrolledCandidates = candidates.filter(
            (c) => c.selectedProgram === prog.id || c.programType === prog.id
          ).length;
          const fillPercentage = Math.min(100, Math.round(((prog.enrolledCount || enrolledCandidates) / prog.targetQuota) * 100));

          return (
            <div
              key={prog.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition"
            >
              {/* Program Header Image & Badge */}
              <div className="relative h-44 overflow-hidden bg-slate-900">
                <img
                  src={prog.image}
                  alt={prog.title}
                  className="w-full h-full object-cover opacity-85 hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent" />
                
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wide text-white shadow-xs ${
                      prog.category === 'Taiwan' ? 'bg-red-600' : 'bg-red-700'
                    }`}
                  >
                    {prog.category === 'Taiwan' ? '🇹🇼 TAIWAN' : '🇯🇵 JEPANG'}
                  </span>
                  <span className="bg-amber-400/90 backdrop-blur-xs text-slate-950 px-2.5 py-1 rounded-full text-[10px] font-bold">
                    {prog.badge}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-bold text-base leading-snug drop-shadow-sm">{prog.title}</h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{prog.shortDesc}</p>

                {/* Info Pills */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[9px]">DURASI</span>
                      <span className="font-bold text-slate-800">{prog.duration}</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="text-slate-400 block text-[9px]">ESTIMASI BIAYA</span>
                      <span className="font-bold text-emerald-700">{prog.estimatedCost}</span>
                    </div>
                  </div>
                </div>

                {/* Quota Progress */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" /> Kuota Terisi
                    </span>
                    <span className="text-blue-900 font-extrabold">
                      {prog.enrolledCount || enrolledCandidates} / {prog.targetQuota} Siswa ({fillPercentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${fillPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Requirements Summary */}
                <div className="space-y-1 bg-amber-50/50 p-3 rounded-xl border border-amber-100/60">
                  <span className="text-[10px] font-extrabold text-amber-900 block uppercase tracking-wider">
                    Persyaratan Utama ({prog.requirements?.length || 0})
                  </span>
                  <ul className="text-[11px] text-slate-700 space-y-1">
                    {prog.requirements?.slice(0, 2).map((req, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 truncate">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">ID: {prog.id}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(prog)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Program</span>
                    </button>
                    <button
                      onClick={() => handleDelete(prog.id, prog.title)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                      title="Hapus Program"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Program Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="bg-[#0F3D7A] p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-amber-300" />
                <h3 className="font-bold text-lg">
                  {editingProgramId ? '✏️ Edit Program Pelatihan' : '➕ Tambah Program Pelatihan Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Judul Program Pelatihan *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Contoh: Program Taiwan IFP 1+4 (S1 + Magang)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Wilayah / Negara *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as 'Taiwan' | 'Jepang' })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Taiwan">🇹🇼 Taiwan</option>
                    <option value="Jepang">🇯🇵 Jepang</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Badge / Label Unggulan</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Contoh: Program Unggulan 2026"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Durasi Studi & Pembekalan</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="Contoh: 1 Tahun Bahasa + 4 Tahun S1"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Perkiraan Biaya / Estimasi</label>
                  <input
                    type="text"
                    value={formData.estimatedCost}
                    onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                    placeholder="Contoh: Rp 15.000.000 (Bisa dicicil)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kuota Target Siswa (Orang)</label>
                  <input
                    type="number"
                    value={formData.targetQuota}
                    onChange={(e) => setFormData({ ...formData, targetQuota: parseInt(e.target.value) || 0 })}
                    placeholder="50"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Singkat (Ringkasan) *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.shortDesc}
                  onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                  placeholder="Deskripsi singkat yang tampil di kartu program..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Lengkap Program</label>
                <textarea
                  rows={3}
                  value={formData.fullDesc}
                  onChange={(e) => setFormData({ ...formData, fullDesc: e.target.value })}
                  placeholder="Detail penjelasan lengkap mengenai program pelatihan..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">URL Gambar Banner/Cover</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Requirements List Editor */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-800">Persyaratan Pendaftaran</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={reqInput}
                    onChange={(e) => setReqInput(e.target.value)}
                    placeholder="Tambah persyaratan baru..."
                    className="flex-1 bg-white border border-slate-200 rounded-xl p-2 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddArrayItem('requirements', reqInput, setReqInput)}
                    className="bg-[#0F3D7A] text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-blue-900"
                  >
                    Tambah
                  </button>
                </div>
                <ul className="space-y-1">
                  {formData.requirements?.map((req, idx) => (
                    <li key={idx} className="flex items-center justify-between text-xs bg-white p-2 rounded-xl border border-slate-200">
                      <span>• {req}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveArrayItem('requirements', idx)}
                        className="text-rose-600 hover:text-rose-800 font-bold"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits List Editor */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-800">Fasilitas & Keunggulan Program</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={benefitInput}
                    onChange={(e) => setBenefitInput(e.target.value)}
                    placeholder="Tambah keunggulan baru..."
                    className="flex-1 bg-white border border-slate-200 rounded-xl p-2 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddArrayItem('benefits', benefitInput, setBenefitInput)}
                    className="bg-[#0F3D7A] text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-blue-900"
                  >
                    Tambah
                  </button>
                </div>
                <ul className="space-y-1">
                  {formData.benefits?.map((ben, idx) => (
                    <li key={idx} className="flex items-center justify-between text-xs bg-white p-2 rounded-xl border border-slate-200">
                      <span>✓ {ben}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveArrayItem('benefits', idx)}
                        className="text-rose-600 hover:text-rose-800 font-bold"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0F3D7A] hover:bg-blue-900 text-amber-300 font-bold text-xs rounded-xl shadow-md transition"
                >
                  {editingProgramId ? 'Simpan Perubahan Program' : 'Publikasikan Program Baru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
