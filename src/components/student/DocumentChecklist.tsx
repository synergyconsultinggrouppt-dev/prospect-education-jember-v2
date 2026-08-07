import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TaiwanPhotoGuideModal } from './TaiwanPhotoGuideModal';
import {
  CheckSquare,
  Square,
  FileCheck2,
  FolderCheck,
  AlertCircle,
  Plus,
  Trash2,
  Printer,
  Sparkles,
  Info,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Camera,
} from 'lucide-react';

export interface PhysicalDocItem {
  id: string;
  category: 'identitas' | 'akademik' | 'legal_kesehatan' | 'foto_admin';
  titleId: string;
  titleEn: string;
  notePlaceholderId: string;
  required: boolean;
  status: 'ready' | 'in_progress' | 'pending';
  userNote?: string;
  isCustom?: boolean;
}

const DEFAULT_PHYSICAL_DOCS: PhysicalDocItem[] = [
  // Identitas & Wali
  {
    id: 'phys-ktp',
    category: 'identitas',
    titleId: '1. KTP (Kartu Tanda Penduduk Asli / Kartu Pelajar)',
    titleEn: '1. Original ID Card (KTP) / Student Card',
    notePlaceholderId: 'Contoh: KTP Asli siap di folder merah',
    required: true,
    status: 'pending',
  },
  {
    id: 'phys-kk',
    category: 'identitas',
    titleId: '2. KK (Kartu Keluarga Asli)',
    titleEn: '2. Original Family Card (KK)',
    notePlaceholderId: 'Contoh: KK Asli lembar terbaru Dukcapil',
    required: true,
    status: 'pending',
  },
  {
    id: 'phys-ktp-ortu',
    category: 'identitas',
    titleId: '11. Copy Berwarna KTP Ortu (Ayah / Ibu / Wali)',
    titleEn: '11. Colored Copy of Parents ID Card (Father & Mother)',
    notePlaceholderId: 'Contoh: Copy KTP Ayah & Ibu cetak warna',
    required: true,
    status: 'pending',
  },
  {
    id: 'phys-paspor',
    category: 'identitas',
    titleId: '6. Paspor RI (Masa Berlaku Min. 18 Bulan)',
    titleEn: '6. Original Passport (Min. 18 Months Validity)',
    notePlaceholderId: 'Contoh: Paspor aktif terbit Kanim Jember',
    required: true,
    status: 'pending',
  },
  {
    id: 'phys-pasfoto',
    category: 'foto_admin',
    titleId: '7. Foto Ukuran 35 x 45 mm (Standar Taiwan / Internasional)',
    titleEn: '7. Formal Passport Photo 35x45 mm (Taiwan Standard)',
    notePlaceholderId: 'Contoh: Background putih, kemeja gelap, tanpa kacamata',
    required: true,
    status: 'pending',
  },

  // Akademik & Dokumen Luar Negeri
  {
    id: 'phys-ijazah',
    category: 'akademik',
    titleId: '3. Ijazah SMK/SMA + Terjemahan Bahasa Inggris + Legalisir',
    titleEn: '3. High School Diploma + English Translation + Legalized',
    notePlaceholderId: 'Contoh: Ijazah Asli & Terjemahan bahasa Inggris di Map',
    required: true,
    status: 'pending',
  },
  {
    id: 'phys-transkrip',
    category: 'akademik',
    titleId: '4. Transkrip Nilai SMK/SMA + Terjemahan Bahasa Inggris + Legalisir',
    titleEn: '4. High School Transcript + English Translation + Legalized',
    notePlaceholderId: 'Contoh: Transkrip nilai SMA & terjemahan terlegalisir',
    required: true,
    status: 'pending',
  },
  {
    id: 'phys-raport',
    category: 'akademik',
    titleId: '5. Raport SMK/SMA Semester 1-6 + Identitas Diri',
    titleEn: '5. School Report Card Semester 1-6 + ID Page',
    notePlaceholderId: 'Contoh: Raport cetak lengkap semester 1-6',
    required: true,
    status: 'pending',
  },
  {
    id: 'phys-rekomendasi',
    category: 'akademik',
    titleId: '8. Recommendation Letter dari Sekolah (Surat Rekomendasi)',
    titleEn: '8. School Recommendation Letter',
    notePlaceholderId: 'Contoh: Surat Rekomendasi Kepala Sekolah Asli',
    required: true,
    status: 'pending',
  },
  {
    id: 'phys-study-plan',
    category: 'akademik',
    titleId: '9. Study Plan (Rencana Studi)',
    titleEn: '9. Study Plan Document',
    notePlaceholderId: 'Contoh: Rencana studi bahasa Inggris/Mandarin',
    required: true,
    status: 'pending',
  },
  {
    id: 'phys-autobiography',
    category: 'akademik',
    titleId: '10. Autobiography (Riwayat Hidup)',
    titleEn: '10. Autobiography Document',
    notePlaceholderId: 'Contoh: Dokumen riwayat hidup 200-500 kata',
    required: true,
    status: 'pending',
  },
];

export const DocumentChecklist: React.FC = () => {
  const { currentCandidate, t } = useApp();
  const candidateId = currentCandidate?.id || 'guest';

  // Load from LocalStorage
  const [items, setItems] = useState<PhysicalDocItem[]>(() => {
    const storageKey = `prospect_doc_checklist_${candidateId}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_PHYSICAL_DOCS;
      }
    }
    return DEFAULT_PHYSICAL_DOCS;
  });

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<PhysicalDocItem['category']>('identitas');
  const [isAdding, setIsAdding] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | PhysicalDocItem['category']>('all');
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  // Sync back to localstorage when items update
  useEffect(() => {
    const storageKey = `prospect_doc_checklist_${candidateId}`;
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, candidateId]);

  const toggleStatus = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus =
            item.status === 'pending'
              ? 'in_progress'
              : item.status === 'in_progress'
              ? 'ready'
              : 'pending';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const updateNote = (id: string, note: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, userNote: note } : item))
    );
  };

  const addCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: PhysicalDocItem = {
      id: `custom-${Date.now()}`,
      category: newCategory,
      titleId: newTitle.trim(),
      titleEn: newTitle.trim(),
      notePlaceholderId: 'Catatan dokumen fisik tambahan...',
      required: false,
      status: 'pending',
      isCustom: true,
    };

    setItems((prev) => [...prev, newItem]);
    setNewTitle('');
    setIsAdding(false);
  };

  const removeCustomItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const resetChecklist = () => {
    if (window.confirm(t('Apakah Anda yakin ingin mereset checklist dokumen fisik?', 'Reset physical document checklist?'))) {
      setItems(DEFAULT_PHYSICAL_DOCS);
    }
  };

  const totalRequired = items.filter((i) => i.required).length;
  const readyRequired = items.filter((i) => i.required && i.status === 'ready').length;
  const readyTotal = items.filter((i) => i.status === 'ready').length;
  const inProgressTotal = items.filter((i) => i.status === 'in_progress').length;
  const percentComplete = Math.round((readyTotal / items.length) * 100);

  const categories = [
    { key: 'all', labelId: 'Semua Dokumen', labelEn: 'All Documents' },
    { key: 'identitas', labelId: '1. KTP, KK & Akta', labelEn: '1. ID & Family' },
    { key: 'akademik', labelId: '2. Ijazah & Bahasa', labelEn: '2. Education' },
    { key: 'legal_kesehatan', labelId: '3. SKCK, MCU & Paspor', labelEn: '3. Legal & MCU' },
    { key: 'foto_admin', labelId: '4. Pasfoto & Surat Izin', labelEn: '4. Photos & Consent' },
  ];

  const filteredItems = items.filter((i) => {
    if (activeCategoryFilter === 'all') return true;
    return i.category === activeCategoryFilter;
  });

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 printable-content">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-[11px] font-bold border border-amber-200">
            <FolderCheck className="w-3.5 h-3.5 text-red-800" />
            <span>{t('DOKUMEN FISIK MAP MAPS & INTERVIEW', 'PHYSICAL FOLDER DOCUMENT ORGANIZER')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
            {t('Checklist Persiapan Berkas Fisik Peserta', 'Physical Document Gathering Checklist')}
          </h2>
          <p className="text-xs text-slate-600">
            {t(
              'Gunakan checklist ini untuk menandai fisik dokumen (Asli & Fotokopi) saat dikumpulkan di map folder sebelum diserahkan ke Kantor Prospect Education Cabang Jember.',
              'Track your physical paper documents (Originals & Copies) in your file folder before submitting to Jember Office.'
            )}
          </p>
        </div>

        {/* Progress Badge Card */}
        <div className="bg-slate-900 text-white p-4 rounded-2xl border border-amber-500/30 flex items-center gap-4 shrink-0 shadow-sm">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
              {t('Kesiapan Berkas Fisik:', 'Folder Preparedness:')}
            </span>
            <div className="text-2xl font-black font-mono text-amber-400">
              {readyTotal} <span className="text-xs text-slate-400 font-normal">/ {items.length} Ready</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-semibold block">
              {readyRequired === totalRequired
                ? t('Semua Wajib Siap!', 'All Required Ready!')
                : `${totalRequired - readyRequired} ${t('wajib belum', 'required pending')}`}
            </span>
          </div>

          <button
            onClick={() => setShowPhotoModal(true)}
            className="p-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition flex items-center justify-center gap-1.5 shrink-0 text-xs shadow-sm cursor-pointer"
            title="Spesifikasi Foto Taiwan 35x45mm"
          >
            <Camera className="w-4 h-4 text-slate-900" />
            <span className="hidden sm:inline">Panduan Foto Taiwan</span>
          </button>

          <button
            onClick={() => window.print()}
            className="p-3 bg-red-800 hover:bg-red-700 text-white rounded-xl transition flex items-center justify-center shrink-0 cursor-pointer"
            title={t('Cetak / Print Checklist', 'Print Checklist')}
          >
            <Printer className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{t('Progres Map Folder Berkas Jember', 'Jember Office Document Folder Readiness')}</span>
          </span>
          <span className="font-mono text-red-800">{percentComplete}% {t('Lengkap', 'Ready')}</span>
        </div>

        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-red-800 via-amber-600 to-emerald-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${percentComplete}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
            <span>{readyTotal} {t('Siap di Map', 'Ready in Folder')}</span>
          </span>

          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
            <span>{inProgressTotal} {t('Progres Urus', 'In Progress')}</span>
          </span>

          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-400 inline-block"></span>
            <span>{items.length - readyTotal - inProgressTotal} {t('Belum Ada', 'Pending')}</span>
          </span>
        </div>
      </div>

      {/* Category Tabs Filter */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategoryFilter(cat.key as any)}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                activeCategoryFilter === cat.key
                  ? 'bg-red-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t(cat.labelId, cat.labelEn)}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="text-xs font-bold text-red-800 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl border border-red-200 transition flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t('Tambah Dokumen Custom', 'Add Custom Document')}</span>
        </button>
      </div>

      {/* Add Custom Item Modal / Form */}
      {isAdding && (
        <form
          onSubmit={addCustomItem}
          className="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-3 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              {t('Tambah Dokumen Fisik Tambahan', 'Add Custom Physical Document')}
            </h4>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-amber-800 hover:text-amber-950 text-xs font-bold"
            >
              Batal
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="sm:col-span-2">
              <input
                type="text"
                required
                placeholder={t('Nama dokumen (contoh: Sertifikat Prestasi Olahraga / Piagam)', 'Document name')}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="identitas">KTP / Identitas</option>
                <option value="akademik">Ijazah / Akademik</option>
                <option value="legal_kesehatan">SKCK / MCU / Paspor</option>
                <option value="foto_admin">Pasfoto / Administrasi</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-red-800 hover:bg-red-900 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-xs"
            >
              {t('Simpan Ke Checklist', 'Save to Checklist')}
            </button>
          </div>
        </form>
      )}

      {/* Main Checklist Items List */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-2xl border transition-all space-y-2 ${
              item.status === 'ready'
                ? 'bg-emerald-50/60 border-emerald-300'
                : item.status === 'in_progress'
                ? 'bg-amber-50/60 border-amber-300'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Checkbox & Title */}
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => toggleStatus(item.id)}
                  className="mt-0.5 shrink-0 focus:outline-none"
                  title={t('Klik untuk ganti status', 'Click to toggle status')}
                >
                  {item.status === 'ready' ? (
                    <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : item.status === 'in_progress' ? (
                    <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
                      <Clock className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-lg border-2 border-slate-300 bg-white hover:border-red-600 transition" />
                  )}
                </button>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4
                      className={`text-xs sm:text-sm font-bold ${
                        item.status === 'ready'
                          ? 'line-through text-slate-500'
                          : 'text-slate-900'
                      }`}
                    >
                      {t(item.titleId, item.titleEn)}
                    </h4>

                    {item.required ? (
                      <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
                        {t('Wajib', 'Required')}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                        {t('Opsional', 'Optional')}
                      </span>
                    )}

                    {item.isCustom && (
                      <span className="text-[10px] text-purple-700 bg-purple-100 px-2 py-0.5 rounded font-bold">
                        Custom
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Action Selector */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => toggleStatus(item.id)}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-xl transition shadow-2xs ${
                    item.status === 'ready'
                      ? 'bg-emerald-600 text-white'
                      : item.status === 'in_progress'
                      ? 'bg-amber-500 text-white'
                      : 'bg-white border border-slate-300 text-slate-700 hover:border-red-600'
                  }`}
                >
                  {item.status === 'ready'
                    ? t('✓ Siap di Map', '✓ Ready in Folder')
                    : item.status === 'in_progress'
                    ? t('⏳ Dalam Proses', '⏳ In Progress')
                    : t('⚪ Belum Ada', '⚪ Pending')}
                </button>

                {item.isCustom && (
                  <button
                    type="button"
                    onClick={() => removeCustomItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-200 transition"
                    title={t('Hapus', 'Delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* User Note Field */}
            <div className="pl-9 pt-1">
              <input
                type="text"
                value={item.userNote || ''}
                onChange={(e) => updateNote(item.id, e.target.value)}
                placeholder={item.notePlaceholderId}
                className="w-full bg-white/80 border border-slate-200/80 rounded-xl px-3 py-1.5 text-[11px] text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-600"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info Box */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {t(
              'Serahkan map berkas fisik ke Admin Kantor Prospect Education Jember di Balung / Jember Kota pada jam kerja (08.00 - 16.00 WIB).',
              'Submit physical folder to Prospect Education Jember office during work hours (08.00 - 16.00 WIB).'
            )}
          </p>
        </div>

        <button
          onClick={resetChecklist}
          className="text-[11px] text-slate-400 hover:text-white underline shrink-0 cursor-pointer"
        >
          {t('Reset Checklist', 'Reset Checklist')}
        </button>
      </div>

      <TaiwanPhotoGuideModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
      />
    </div>
  );
};
