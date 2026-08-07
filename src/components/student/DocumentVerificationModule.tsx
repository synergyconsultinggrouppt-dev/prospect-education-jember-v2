import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentDocument } from '../../types';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Upload,
  FileText,
  Search,
  Filter,
  Eye,
  Download,
  Printer,
  History,
  FileCheck2,
  Sparkles,
  ChevronRight,
  Info,
  X,
  UserCheck,
  Building2,
  Calendar,
  AlertTriangle,
  QrCode,
  Lock,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';

export interface ExtendedDocumentRequirement {
  docType: StudentDocument['docType'];
  title: string;
  category: 'identitas' | 'akademik' | 'legal';
  required: boolean;
  description: string;
  agencyStandardNote: string;
}

const DOCUMENT_REQUIREMENTS: ExtendedDocumentRequirement[] = [
  {
    docType: 'ktp',
    title: '1. KTP (Kartu Tanda Penduduk Asli / Kartu Pelajar)',
    category: 'identitas',
    required: true,
    description: 'Scan KTP asli berwarna. NIK, Nama, dan Tanggal Lahir harus terbaca dengan jelas.',
    agencyStandardNote: 'Diverifikasi terhadap database kependudukan kementrian & biodata pendaftaran.',
  },
  {
    docType: 'kk',
    title: '2. KK (Kartu Keluarga Asli)',
    category: 'identitas',
    required: true,
    description: 'Scan Kartu Keluarga asli lembar terbaru ber-barcode / stempel Dukcapil.',
    agencyStandardNote: 'Diverifikasi untuk penjaminan data keluarga & penanggung jawab.',
  },
  {
    docType: 'ijazah',
    title: '3. Ijazah SMK/SMA + Terjemahan Bahasa Inggris + Legalisir',
    category: 'akademik',
    required: true,
    description: 'Scan Ijazah SMA/SMK/S1 asli beserta terjemahan Bahasa Inggris dan stempel legalisir.',
    agencyStandardNote: 'Diverifikasi kelayakan nilai & kesesuaian syarat beasiswa/program kerja luar negeri.',
  },
  {
    docType: 'transkrip',
    title: '4. Transkrip Nilai SMK/SMA + Terjemahan Bahasa Inggris + Legalisir',
    category: 'akademik',
    required: true,
    description: 'Scan Transkrip Nilai SMK/SMA asli lengkap terjemahan Bahasa Inggris dan stempel legalisir.',
    agencyStandardNote: 'Diperiksa untuk evaluasi rata-rata nilai standar penerimaan universitas / mitra.',
  },
  {
    docType: 'raport',
    title: '5. Raport SMK/SMA Semester 1-6 + Identitas Diri',
    category: 'akademik',
    required: true,
    description: 'Scan gabungan PDF Raport SMK/SMA Semester 1 s/d 6 beserta lembar identitas siswa.',
    agencyStandardNote: 'Diverifikasi rekam jejak akademik siswa selama masa sekolah.',
  },
  {
    docType: 'paspor',
    title: '6. Paspor RI (Masa Berlaku Min. 18 Bulan)',
    category: 'identitas',
    required: true,
    description: 'Scan halaman identitas paspor (halaman 2-3). Wajib memiliki masa berlaku aktif min. 18 bulan.',
    agencyStandardNote: 'Diverifikasi untuk pengajuan visa TETO Taiwan / Imigrasi negara tujuan.',
  },
  {
    docType: 'pasfoto',
    title: '7. Foto Ukuran 35 x 45 mm (Standar Taiwan / Internasional)',
    category: 'identitas',
    required: true,
    description: 'Foto berwarna 35x45mm latar belakang putih polos, wajah lurus tanpa kacamata, telinga terlihat, pakaian formal gelap.',
    agencyStandardNote: 'Pemeriksaan ketat spesifikasi foto visa TETO Taiwan standar internasional.',
  },
  {
    docType: 'recommendation_letter',
    title: '8. Recommendation Letter dari Sekolah (Surat Rekomendasi)',
    category: 'akademik',
    required: true,
    description: 'Surat rekomendasi resmi dari Kepala Sekolah / Guru Pembimbing sekolah asal.',
    agencyStandardNote: 'Diverifikasi legalitas rekomendasi karakter & prestasi siswa.',
  },
  {
    docType: 'study_plan',
    title: '9. Study Plan (Rencana Studi)',
    category: 'akademik',
    required: true,
    description: 'Dokumen Rencana Studi (Study Plan) berisi motivasi & tujuan pendidikan.',
    agencyStandardNote: 'Diverifikasi keselarasan tujuan studi dengan jurusan yang dipilih.',
  },
  {
    docType: 'autobiography',
    title: '10. Autobiography (Riwayat Hidup / Otobiografi)',
    category: 'akademik',
    required: true,
    description: 'Dokumen Otobiografi / Riwayat Hidup pendaftaran yang ditulis secara rinci.',
    agencyStandardNote: 'Diverifikasi sebagai kelengkapan berkas pendaftaran universitas mitra.',
  },
  {
    docType: 'ktp_ortu',
    title: '11. Copy Berwarna KTP Ortu (Ayah / Ibu / Wali)',
    category: 'identitas',
    required: true,
    description: 'Scan / Foto berwarna KTP Ayah dan Ibu / Wali pendaftar.',
    agencyStandardNote: 'Diverifikasi untuk data sponsor keuangan & surat penjaminan.',
  },
  {
    docType: 'surat_izin',
    title: 'Surat Izin Orang Tua / Wali Bermaterai (Opsional Tambahan)',
    category: 'legal',
    required: false,
    description: 'Surat persetujuan orang tua/wali bermaterai Rp 10.000.',
    agencyStandardNote: 'Verifikasi kelengkapan tanda tangan basah & kesediaan ikutan program.',
  },
];

export const DocumentVerificationModule: React.FC = () => {
  const { currentCandidate, uploadCandidateDocument, t } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending' | 'rejected' | 'missing'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'identitas' | 'akademik' | 'legal'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [previewDoc, setPreviewDoc] = useState<{
    req: ExtendedDocumentRequirement;
    doc?: StudentDocument;
  } | null>(null);

  const [timelineDoc, setTimelineDoc] = useState<{
    req: ExtendedDocumentRequirement;
    doc?: StudentDocument;
  } | null>(null);

  const [uploadModalReq, setUploadModalReq] = useState<ExtendedDocumentRequirement | null>(null);
  const [showVerificationSummaryModal, setShowVerificationSummaryModal] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const candidateDocs = currentCandidate?.documents || [];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const candidateProgram = currentCandidate?.selectedProgram || 'taiwan_ifp';
  const isTaiwanCandidate = candidateProgram.startsWith('taiwan');

  const activeRequirements: ExtendedDocumentRequirement[] = DOCUMENT_REQUIREMENTS.map((req) => {
    if (req.docType === 'ijazah') {
      return {
        ...req,
        title: isTaiwanCandidate ? 'Ijazah / SKL SMA/SMK/S1 (Taiwan IFP 1+4)' : 'Ijazah / SKL SMA/SMK (Magang/Kerja Jepang)',
        agencyStandardNote: isTaiwanCandidate
          ? 'Diverifikasi kelayakan nilai & kesesuaian syarat Kuliah S1 Taiwan IFP 1+4 (Tanpa Wajib Sertifikat TOCFL).'
          : 'Diverifikasi kelayakan nilai & kesesuaian syarat Magang IM Japan / SSW Tokutei Ginou.',
      };
    }
    if (req.docType === 'paspor') {
      return {
        ...req,
        agencyStandardNote: isTaiwanCandidate
          ? 'Diverifikasi untuk pengajuan Visa Pelajar ke Kantor TETO Taiwan & Kantor Imigrasi.'
          : 'Diverifikasi untuk pengajuan Visa Magang/Kerja ke Kantor Imigrasi Jepang.',
      };
    }
    return req;
  });

  const getDoc = (docType: StudentDocument['docType']) => {
    return candidateDocs.find((d) => d.docType === docType);
  };

  // Calculations
  const totalRequired = activeRequirements.filter((r) => r.required).length;
  const verifiedCount = activeRequirements.filter((r) => {
    const doc = getDoc(r.docType);
    return doc?.status === 'verified';
  }).length;
  const pendingCount = activeRequirements.filter((r) => {
    const doc = getDoc(r.docType);
    return doc?.status === 'pending';
  }).length;
  const rejectedCount = activeRequirements.filter((r) => {
    const doc = getDoc(r.docType);
    return doc?.status === 'rejected';
  }).length;
  const missingCount = activeRequirements.filter((r) => {
    const doc = getDoc(r.docType);
    return !doc;
  }).length;

  const verificationPercentage = Math.round((verifiedCount / totalRequired) * 100);

  let overallAgencyStatus: { label: string; bg: string; text: string; border: string; icon: any } = {
    label: 'Lolos Verifikasi Agensi (Verified)',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    icon: ShieldCheck,
  };

  if (rejectedCount > 0) {
    overallAgencyStatus = {
      label: 'Perlu Revisi Dokumen',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      icon: AlertTriangle,
    };
  } else if (verificationPercentage < 100) {
    overallAgencyStatus = {
      label: 'Verifikasi Berkas Dalam Proses',
      bg: 'bg-sky-50',
      text: 'text-sky-800',
      border: 'border-sky-200',
      icon: Clock,
    };
  }

  // Filtered Requirements
  const filteredRequirements = activeRequirements.filter((req) => {
    const doc = getDoc(req.docType);

    // Status filter
    if (statusFilter === 'verified' && doc?.status !== 'verified') return false;
    if (statusFilter === 'pending' && doc?.status !== 'pending') return false;
    if (statusFilter === 'rejected' && doc?.status !== 'rejected') return false;
    if (statusFilter === 'missing' && doc) return false;

    // Category filter
    if (categoryFilter !== 'all' && req.category !== categoryFilter) return false;

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = req.title.toLowerCase().includes(q);
      const matchFileName = doc?.fileName?.toLowerCase().includes(q);
      if (!matchTitle && !matchFileName) return false;
    }

    return true;
  });

  const handleSimulatedUpload = (req: ExtendedDocumentRequirement) => {
    if (!currentCandidate) return;
    const sampleFileName = `${req.docType}_${currentCandidate.fullName.toLowerCase().replace(/\s+/g, '_')}_2026.pdf`;
    uploadCandidateDocument(currentCandidate.id, {
      docType: req.docType,
      title: req.title,
      fileName: sampleFileName,
      fileUrl: '#',
    });
    setUploadModalReq(null);
    triggerToast(`Dokumen ${req.title} berhasil diunggah! Petugas agensi akan memverifikasi berkas Anda.`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white border border-emerald-500/50 p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Modul Verifikasi Dokumen Agensi</p>
            <p className="text-[11px] text-slate-300">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Main Agency Verification Header */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-3.5 py-1 rounded-full text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t('Modul Verifikasi Berkas LKP & Konsultan Prospect', 'LKP & Consultant Document Verification Module')}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-serif text-white tracking-tight">
              Status Legalitas & Verifikasi Berkas
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Pantau status pengesahan dokumen fisik dan digital oleh Tim Legal LKP & Konsultan Pendidikan Prospect Education Cabang Jember bersama VISA HUB INDONESIA untuk permohonan Program Taiwan IFP / Visa Kerja Jepang.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
              <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                <UserCheck className="w-4 h-4 text-indigo-400" />
                <span>Petugas Verifikator: <strong className="text-white">Bpk. Hendra Wijaya, S.Pd.</strong></span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 font-mono text-[11px]">
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>ID Verifikasi: <strong className="text-amber-400">VERIF-{currentCandidate?.id || 'CAND-001'}</strong></span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/90 backdrop-blur-md p-5 rounded-2xl border border-slate-700 space-y-3 w-full lg:w-80 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Kemajuan Verifikasi</span>
              <span className="text-lg font-black text-emerald-400 font-mono">{verificationPercentage}%</span>
            </div>

            <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-500 rounded-full"
                style={{ width: `${verificationPercentage}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-700/60">
              <div>
                <span className="text-slate-400 block">Terverifikasi</span>
                <strong className="text-emerald-400 font-bold font-mono">{verifiedCount} dari {totalRequired}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Status Agensi</span>
                <strong className="text-amber-300 font-bold text-[10px] truncate block">
                  {overallAgencyStatus.label}
                </strong>
              </div>
            </div>

            <button
              onClick={() => setShowVerificationSummaryModal(true)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer mt-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Surat Verifikasi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stat Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Terverifikasi</span>
            <strong className="text-lg font-black text-slate-900 font-mono">{verifiedCount} Dokumen</strong>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex items-center gap-3">
          <div className="p-3 bg-sky-50 text-sky-700 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Menunggu Review</span>
            <strong className="text-lg font-black text-slate-900 font-mono">{pendingCount} Dokumen</strong>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Perlu Revisi</span>
            <strong className="text-lg font-black text-amber-900 font-mono">{rejectedCount} Dokumen</strong>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex items-center gap-3">
          <div className="p-3 bg-slate-100 text-slate-600 rounded-xl">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Belum Diunggah</span>
            <strong className="text-lg font-black text-slate-900 font-mono">{missingCount} Dokumen</strong>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'Semua Status' },
              { id: 'verified', label: 'Terverifikasi' },
              { id: 'pending', label: 'Menunggu Review' },
              { id: 'rejected', label: 'Perlu Revisi' },
              { id: 'missing', label: 'Belum Diunggah' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  statusFilter === f.id
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama dokumen..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-bold text-[11px] shrink-0">Kategori Dokumen:</span>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {[
              { id: 'all', label: 'Semua Kategori' },
              { id: 'identitas', label: 'Dokumen Identitas' },
              { id: 'akademik', label: 'Dokumen Akademik' },
              { id: 'legal', label: 'Dokumen Legal & Izin' },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setCategoryFilter(c.id as any)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  categoryFilter === c.id
                    ? 'bg-indigo-50 text-indigo-900 border border-indigo-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Document Verification Cards Grid */}
      {filteredRequirements.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center space-y-2">
          <FileText className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">Tidak ada dokumen yang sesuai filter</h3>
          <p className="text-xs text-slate-500">Coba ubah kata kunci pencarian atau kategori filter status.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRequirements.map((req) => {
            const doc = getDoc(req.docType);

            return (
              <div
                key={req.docType}
                className={`bg-white border rounded-3xl p-5 space-y-4 transition-all shadow-2xs flex flex-col justify-between ${
                  doc?.status === 'verified'
                    ? 'border-emerald-200 hover:border-emerald-400'
                    : doc?.status === 'rejected'
                    ? 'border-amber-300 bg-amber-50/20'
                    : doc?.status === 'pending'
                    ? 'border-sky-200'
                    : 'border-slate-200'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Bar Status & Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                          {req.category}
                        </span>
                        {req.required ? (
                          <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                            Wajib
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                            Opsional
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm font-serif">
                        {req.title}
                      </h3>
                    </div>

                    {/* Status Pill */}
                    {doc?.status === 'verified' && (
                      <span className="bg-emerald-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1 shrink-0 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Terverifikasi</span>
                      </span>
                    )}

                    {doc?.status === 'rejected' && (
                      <span className="bg-amber-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1 shrink-0 shadow-2xs animate-pulse">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
                        <span>Perlu Revisi</span>
                      </span>
                    )}

                    {doc?.status === 'pending' && (
                      <span className="bg-sky-700 text-white text-[11px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1 shrink-0 shadow-2xs">
                        <Clock className="w-3.5 h-3.5 text-sky-300" />
                        <span>Menunggu Review</span>
                      </span>
                    )}

                    {!doc && (
                      <span className="bg-slate-200 text-slate-600 text-[11px] font-bold px-2.5 py-1 rounded-xl shrink-0">
                        Belum Diunggah
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {req.description}
                  </p>

                  {/* File Upload details if available */}
                  {doc ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-700">
                        <span className="truncate max-w-[200px] font-bold">{doc.fileName}</span>
                        <span className="text-[10px] text-slate-400">{doc.uploadedAt || 'Terbaru'}</span>
                      </div>

                      {/* Agency Verification Remarks */}
                      <div className="pt-2 border-t border-slate-200/80 text-[11px] space-y-1">
                        <span className="font-bold text-slate-700 flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-500" />
                          <span>Catatan Petugas Verifikasi Agensi:</span>
                        </span>
                        <p className={`p-2 rounded-xl text-[11px] font-sans ${
                          doc.status === 'verified'
                            ? 'bg-emerald-100/60 text-emerald-900 border border-emerald-200'
                            : doc.status === 'rejected'
                            ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300'
                            : 'bg-sky-100/60 text-sky-900 border border-sky-200'
                        }`}>
                          {doc.notes || req.agencyStandardNote}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-3 text-[11px] text-slate-500 space-y-1">
                      <strong className="text-slate-700 block">Standar Verifikasi Agensi:</strong>
                      <p className="text-slate-600 italic">{req.agencyStandardNote}</p>
                    </div>
                  )}
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {doc && (
                      <>
                        <button
                          onClick={() => setPreviewDoc({ req, doc })}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3 py-2 rounded-xl transition flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Pratinjau</span>
                        </button>

                        <button
                          onClick={() => setTimelineDoc({ req, doc })}
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold text-xs px-3 py-2 rounded-xl transition flex items-center gap-1 cursor-pointer"
                        >
                          <History className="w-3.5 h-3.5 text-indigo-700" />
                          <span>Audit Trail</span>
                        </button>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => setUploadModalReq(req)}
                    className={`font-bold text-xs px-4 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer ${
                      doc?.status === 'verified'
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        : doc?.status === 'rejected'
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black'
                        : 'bg-slate-900 hover:bg-slate-800 text-amber-400'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{doc ? 'Unggah Ulang' : 'Unggah File'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: Document Preview & Verification Details */}
      {previewDoc && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewDoc(null);
          }}
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 relative my-auto max-h-[88vh] overflow-y-auto flex flex-col printable-content">
            <button
              onClick={() => setPreviewDoc(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full cursor-pointer print:hidden"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 shrink-0">
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base font-serif">
                  Pratinjau Dokumen Verifikasi Agensi
                </h3>
                <p className="text-xs text-slate-500">{previewDoc.req.title}</p>
              </div>
            </div>

            {/* Document Mock Viewer Box */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 text-center space-y-3 relative overflow-hidden shadow-inner">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
                <FileText className="w-8 h-8" />
              </div>

              <div>
                <p className="font-bold text-sm text-white font-mono">{previewDoc.doc?.fileName || 'Scan_Dokumen.pdf'}</p>
                <p className="text-[11px] text-slate-400">Diunggah: {previewDoc.doc?.uploadedAt || 'Terbaru'}</p>
              </div>

              <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold font-mono">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>STEMPEL VERIFIKASI RESMI LKP & KONSULTAN PROSPECT</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <p><strong>Kategori:</strong> {previewDoc.req.category}</p>
              <p><strong>Status Agensi:</strong>{' '}
                <span className="font-bold text-emerald-700">
                  {previewDoc.doc?.status === 'verified' ? 'Terverifikasi Sah' : 'Menunggu Review'}
                </span>
              </p>
              <p><strong>Catatan Verifikator:</strong> {previewDoc.doc?.notes || previewDoc.req.agencyStandardNote}</p>
            </div>

            <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 print:hidden shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-3.5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4 text-slate-600" />
                  <span>Cetak</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const content = `HASIL VERIFIKASI AGENSI LPK PROSPECT EDUCATION JEMBER\nDokumen: ${previewDoc.req.title}\nStatus: ${previewDoc.doc?.status || 'Menunggu Review'}\nSiswa: ${currentCandidate?.fullName || '-'}`;
                    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `Hasil_Verifikasi_${previewDoc.req.docType}.txt`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                  }}
                  className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh File</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="bg-slate-900 text-white font-bold px-4 py-2.5 rounded-xl hover:bg-slate-800 transition cursor-pointer text-xs"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Audit Trail Timeline Modal */}
      {timelineDoc && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setTimelineDoc(null);
          }}
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 relative my-auto max-h-[88vh] overflow-y-auto flex flex-col">
            <button
              onClick={() => setTimelineDoc(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 shrink-0">
              <div className="p-3 bg-indigo-100 text-indigo-900 rounded-2xl">
                <History className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base font-serif">
                  Riwayat Audit Verifikasi Agensi
                </h3>
                <p className="text-xs text-slate-500">{timelineDoc.req.title}</p>
              </div>
            </div>

            {/* Timeline Steps */}
            <div className="space-y-4 relative pl-6 border-l-2 border-indigo-200 text-xs">
              <div className="relative">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 bg-emerald-600 rounded-full border-2 border-white" />
                <p className="font-bold text-slate-900">1. Unggah Berkas Digital Siswa</p>
                <p className="text-[11px] text-slate-500">
                  Dokumen berhasil diunggah oleh peserta melalui Portal Siswa LPK Prospect.
                </p>
                <span className="text-[10px] text-slate-400 font-mono">{timelineDoc.doc?.uploadedAt || '2026-07-27 10:00:00'}</span>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 bg-emerald-600 rounded-full border-2 border-white" />
                <p className="font-bold text-slate-900">2. Pemeriksaan Keamanan System & OCR</p>
                <p className="text-[11px] text-slate-500">
                  Format file PDF/JPG terkonfirmasi valid & lulus uji kejelasan resolusi minimum.
                </p>
              </div>

              <div className="relative">
                <div className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 border-white ${
                  timelineDoc.doc?.status === 'verified' ? 'bg-emerald-600' : 'bg-amber-500'
                }`} />
                <p className="font-bold text-slate-900">3. Verifikasi Legalitas Officer Agensi</p>
                <p className="text-[11px] text-slate-500">
                  Diperiksa oleh Bpk. Hendra Wijaya, S.Pd. (Divisi Berkas & Visa LPK Prospect Jember).
                </p>
                <p className="text-[10px] text-emerald-800 font-mono font-bold bg-emerald-50 p-1.5 rounded-lg mt-1">
                  Status: {timelineDoc.doc?.status === 'verified' ? 'Lolos Verifikasi Legalisir' : 'Dalam Review Agensi'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setTimelineDoc(null)}
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition cursor-pointer text-xs shrink-0"
            >
              Tutup Audit Trail
            </button>
          </div>
        </div>
      )}

      {/* MODAL 3: Simulated File Upload Modal */}
      {uploadModalReq && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setUploadModalReq(null);
          }}
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 relative my-auto max-h-[88vh] overflow-y-auto flex flex-col">
            <button
              onClick={() => setUploadModalReq(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 shrink-0">
              <div className="p-3 bg-amber-100 text-amber-900 rounded-2xl">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base font-serif">
                  Unggah Dokumen Berkas
                </h3>
                <p className="text-xs text-slate-500">{uploadModalReq.title}</p>
              </div>
            </div>

            <div className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl p-6 text-center space-y-2 transition cursor-pointer bg-slate-50">
              <Upload className="w-8 h-8 text-amber-600 mx-auto" />
              <p className="font-bold text-slate-800 text-xs">Pilih File dari Perangkat Anda (PDF / JPG / PNG)</p>
              <p className="text-[10px] text-slate-400">Ukuran maksimal 5MB per dokumen</p>
            </div>

            <div className="pt-2 flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setUploadModalReq(null)}
                className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition cursor-pointer text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleSimulatedUpload(uploadModalReq)}
                className="w-1/2 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold py-3 rounded-xl transition shadow-md cursor-pointer text-xs"
              >
                Simpan & Unggah
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Printable Official Agency Verification Summary Sheet */}
      {showVerificationSummaryModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowVerificationSummaryModal(false);
          }}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 overflow-y-auto"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 relative my-auto max-h-[88vh] overflow-y-auto flex flex-col text-slate-900 printable-content">
            <button
              onClick={() => setShowVerificationSummaryModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full cursor-pointer print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Official Letterhead */}
            <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black font-serif text-slate-900 tracking-wider">
                  LKP & KONSULTAN PENDIDIKAN PROSPECT EDUCATION JEMBER
                </h2>
                <p className="text-xs text-slate-600">Lembaga Kursus & Pelatihan, Konsultan Pendidikan, & Mitra Visa (VISA HUB INDONESIA)</p>
                <p className="text-[10px] text-slate-500">Jl. Balung-Jenggawah, Wetan Kali, Balung Lor, Kec. Balung, Kabupaten Jember, Jawa Timur 68161 | Telp/WA: 0823-3455-4396</p>
              </div>

              <div className="w-12 h-12 bg-amber-400 rounded-2xl flex items-center justify-center font-black font-serif text-slate-950 text-xl border border-slate-900">
                PE
              </div>
            </div>

            {/* Document Title */}
            <div className="text-center space-y-1">
              <h3 className="font-bold text-sm uppercase tracking-wider font-serif underline">
                SURAT KETERANGAN HASIL VERIFIKASI BERKAS AGENSI
              </h3>
              <p className="text-xs font-mono text-slate-500">Nomor: 882/VERIF-DOC/LPK-PE/VII/2026</p>
            </div>

            {/* Candidate Details */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">Nama Peserta:</span>
                <strong className="text-slate-900 font-bold">{currentCandidate?.fullName || 'Ahmad Subagyo'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">ID Registrasi:</span>
                <strong className="text-slate-900 font-mono font-bold">{currentCandidate?.id || 'CAND-001'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Program Tujuan:</span>
                <strong className="text-indigo-900 font-bold">
                  {currentCandidate?.selectedProgram === 'taiwan_ifp'
                    ? 'Taiwan IFP 1+4 (1 Thn Bahasa + 4 Thn S1 NFU)'
                    : 'Taiwan 4+1 / Program Kerja'}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Status Verifikasi:</span>
                <strong className="text-emerald-700 font-bold">{overallAgencyStatus.label}</strong>
              </div>
            </div>

            {/* Verification Table */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs font-serif uppercase tracking-wider">
                Daftar Hasil Verifikasi Berkas Fisik & Digital:
              </h4>

              <table className="w-full text-xs text-left border border-slate-300 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                  <tr>
                    <th className="p-2 border-r border-slate-300">No</th>
                    <th className="p-2 border-r border-slate-300">Nama Dokumen</th>
                    <th className="p-2 border-r border-slate-300">Kategori</th>
                    <th className="p-2">Status Agensi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {DOCUMENT_REQUIREMENTS.map((req, idx) => {
                    const doc = getDoc(req.docType);
                    return (
                      <tr key={req.docType}>
                        <td className="p-2 border-r border-slate-200 text-center font-mono">{idx + 1}</td>
                        <td className="p-2 border-r border-slate-200 font-bold">{req.title}</td>
                        <td className="p-2 border-r border-slate-200 capitalize">{req.category}</td>
                        <td className="p-2 font-bold">
                          {doc?.status === 'verified' ? (
                            <span className="text-emerald-700 font-bold">Sah (Verified)</span>
                          ) : (
                            <span className="text-slate-500">Dalam Proses</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Signature Block */}
            <div className="pt-6 flex justify-between items-end text-xs border-t border-slate-200">
              <div className="space-y-1 font-mono text-[10px] text-slate-500">
                <QrCode className="w-8 h-8 text-slate-800" />
                <p>Otentikasi Digital LKP Prospect Jember</p>
                <p>Dicetak Pada: {new Date().toLocaleDateString('id-ID')}</p>
              </div>

              <div className="text-center space-y-12">
                <p className="text-[11px] text-slate-600">Jember, {new Date().toLocaleDateString('id-ID')}</p>
                <div>
                  <p className="font-bold text-slate-900 text-xs font-serif underline">Bpk. Hendra Wijaya, S.Pd.</p>
                  <p className="text-[10px] text-slate-500">Divisi Verifikasi Dokumen & Visa Partner</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 text-center text-[10px] text-slate-500 font-sans">
              Dokumen hasil verifikasi ini diterbitkan secara sah dan resmi oleh LKP & Konsultan Pendidikan Prospect Education Cabang Jember. Pengurusan visa bekerja sama dengan VISA HUB INDONESIA.
            </div>

            <div className="pt-2 flex justify-end gap-2 print:hidden shrink-0">
              <button
                type="button"
                onClick={() => window.print()}
                className="bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-800 transition flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Cetak / Simpan PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
