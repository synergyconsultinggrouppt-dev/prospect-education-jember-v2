import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DocumentRequest } from '../../types';
import {
  FileText,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Search,
  Eye,
  FileCheck,
  Send,
  Sparkles,
  ShieldCheck,
  Building2,
  Calendar,
  X,
  ChevronRight,
  Info,
  QrCode,
  Printer,
  Check,
  UserCheck,
  Layers,
  ArrowRight,
  Stamp,
  Award,
} from 'lucide-react';

export const DocumentRequestTracker: React.FC = () => {
  const { currentCandidate, documentRequests, addDocumentRequest, websiteSettings, t } = useApp();

  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [inspectRequest, setInspectRequest] = useState<DocumentRequest | null>(null);
  const [previewDocumentModal, setPreviewDocumentModal] = useState<DocumentRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [docType, setDocType] = useState<DocumentRequest['documentType']>('surat_keterangan_aktif');
  const [purpose, setPurpose] = useState('');
  const [notes, setNotes] = useState('');

  // Student specific requests
  const myCandidateId = currentCandidate?.id || 'CAND-001';
  const myCandidateName = currentCandidate?.fullName || 'Ahmad Subagyo';

  const myRequests = documentRequests.filter((r) => r.candidateId === myCandidateId || r.candidateName === myCandidateName);

  const filteredRequests = myRequests.filter((req) => {
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
    const matchesSearch =
      req.documentTypeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getDocTypeName = (type: DocumentRequest['documentType']) => {
    switch (type) {
      case 'surat_keterangan_aktif':
        return 'Surat Keterangan Aktif Pelatihan LKP Prospect';
      case 'transkrip_nilai':
        return 'Transkrip Nilai Akademik & Sertifikat Bahasa (TOCFL / JLPT)';
      case 'surat_rekomendasi':
        return 'Surat Rekomendasi Direktur LKP untuk Universitas / Beasiswa';
      case 'pengantar_visa':
        return 'Surat Keterangan & Jaminan Resmi Prospect Education Jember';
      case 'sertifikat_kelulusan':
        return 'Sertifikat Kelulusan & Kelakuan Baik LKP Prospect';
      case 'surat_pernyataan_ijin':
        return 'Surat Pernyataan Izin Orang Tua / Wali Legalisir LKP';
      default:
        return 'Surat / Dokumen Resmi LKP';
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose.trim()) return;

    addDocumentRequest({
      candidateId: myCandidateId,
      candidateName: myCandidateName,
      documentType: docType,
      documentTypeName: getDocTypeName(docType),
      purpose: purpose,
      notes: notes,
      estimatedCompletionDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      processedBy: 'Staf Administrasi Akademik LPK Prospect',
    });

    setShowNewRequestModal(false);
    setPurpose('');
    setNotes('');

    setToastMessage('Permohonan dokumen digital Anda telah berhasil diajukan dan sedang diproses!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const getStatusBadge = (status: DocumentRequest['status']) => {
    switch (status) {
      case 'submitted':
        return (
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold px-2.5 py-1 rounded-full">
            <Clock className="w-3 h-3 text-blue-600 animate-pulse" />
            <span>Diajukan (Antrean)</span>
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-full">
            <Info className="w-3 h-3 text-amber-600 animate-spin" />
            <span>Diproses Admin</span>
          </span>
        );
      case 'signed':
        return (
          <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-800 border border-purple-200 text-[10px] font-bold px-2.5 py-1 rounded-full">
            <UserCheck className="w-3 h-3 text-purple-600" />
            <span>TTD Pimpinan</span>
          </span>
        );
      case 'ready':
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Siap Diunduh</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-800 border border-red-200 text-[10px] font-bold px-2.5 py-1 rounded-full">
            <AlertCircle className="w-3 h-3 text-red-600" />
            <span>Ditolak / Perlu Revisi</span>
          </span>
        );
    }
  };

  const getProgressStep = (status: DocumentRequest['status']) => {
    switch (status) {
      case 'submitted':
        return 1;
      case 'processing':
        return 2;
      case 'signed':
        return 3;
      case 'ready':
        return 4;
      case 'rejected':
        return 0;
    }
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
            <p className="text-xs font-bold text-white">Layanan Surat Digital</p>
            <p className="text-[11px] text-slate-300">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-red-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-72 h-72 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/40 text-red-300 px-3.5 py-1 rounded-full text-xs font-bold shadow-2xs">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>{t('Layanan Permohonan Surat Digital & Transkrip', 'Digital Document Request Service')}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-serif text-white tracking-tight">
              Layanan Pengajuan Dokumen Resmi
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Ajukan Surat Keterangan Aktif Belajar, Transkrip Nilai Akademik, Surat Rekomendasi Beasiswa, hingga Surat Pengantar Visa secara digital. Pantau progres penerbitan dokumen Anda secara otomatis dan terverifikasi QR Code.
            </p>
          </div>

          <button
            onClick={() => setShowNewRequestModal(true)}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-3.5 rounded-2xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Buat Permohonan Dokumen Baru</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-4">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4 shadow-2xs">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari jenis surat, nomor permohonan, atau keperluan..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-red-800 focus:bg-white outline-none transition"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {['all', 'submitted', 'processing', 'signed', 'ready'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer capitalize ${
                  filterStatus === st
                    ? 'bg-red-800 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'all'
                  ? 'Semua Status'
                  : st === 'submitted'
                  ? 'Diajukan'
                  : st === 'processing'
                  ? 'Diproses'
                  : st === 'signed'
                  ? 'TTD Pimpinan'
                  : 'Siap Diunduh'}
              </button>
            ))}
          </div>
        </div>

        {/* Request List Cards */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Belum Ada Permohonan Dokumen</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Anda belum mengajukan permohonan surat atau sertifikat digital. Klik tombol di atas untuk mengajukan surat keterangan baru.
            </p>
            <button
              onClick={() => setShowNewRequestModal(true)}
              className="text-xs font-bold text-red-800 hover:underline cursor-pointer pt-2 inline-flex items-center gap-1"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Ajukan Surat Pertama Sekarang</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRequests.map((req) => {
              const currentStep = getProgressStep(req.status);

              return (
                <div
                  key={req.id}
                  className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 hover:border-red-300 transition shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header ID & Status */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono text-slate-400 font-bold block">
                          ID: {req.id}
                        </span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{req.requestDate}</span>
                        </span>
                      </div>
                      {getStatusBadge(req.status)}
                    </div>

                    {/* Document Title */}
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm font-serif line-clamp-2">
                        {req.documentTypeName}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                        <span className="font-bold text-slate-700">Keperluan:</span> {req.purpose}
                      </p>
                    </div>

                    {/* Visual Progress Steps Tracker */}
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-600">
                        <span>Otomatisasi Tracking Status:</span>
                        <span className="text-red-800 font-mono">
                          {currentStep === 4 ? 'Selesai 100%' : `Langkah ${currentStep} dari 4`}
                        </span>
                      </div>

                      {/* Step Indicator Bar */}
                      <div className="grid grid-cols-4 gap-1">
                        {[1, 2, 3, 4].map((step) => {
                          const isComplete = currentStep >= step;
                          const isCurrent = currentStep === step;

                          return (
                            <div
                              key={step}
                              className={`h-2 rounded-full transition-all ${
                                isComplete
                                  ? 'bg-red-800'
                                  : 'bg-slate-200'
                              } ${isCurrent ? 'ring-2 ring-red-400' : ''}`}
                            />
                          );
                        })}
                      </div>

                      <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wider pt-0.5">
                        <span className={currentStep >= 1 ? 'text-slate-800' : ''}>1. Diajukan</span>
                        <span className={currentStep >= 2 ? 'text-slate-800' : ''}>2. Diproses</span>
                        <span className={currentStep >= 3 ? 'text-slate-800' : ''}>3. TTD</span>
                        <span className={currentStep >= 4 ? 'text-emerald-700' : ''}>4. Siap</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setInspectRequest(req)}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Detail Tracking</span>
                    </button>

                    {req.status === 'ready' ? (
                      <button
                        onClick={() => setPreviewDocumentModal(req)}
                        className="text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 px-4 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Lihat & Unduh PDF</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-mono italic">
                        Est. Selesai: {req.estimatedCompletionDate || '1-2 Hari Kerja'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal 1: Create New Request */}
      {showNewRequestModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowNewRequestModal(false);
          }}
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 relative my-auto max-h-[88vh] overflow-y-auto flex flex-col">
            <button
              onClick={() => setShowNewRequestModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-3 bg-red-100 text-red-800 rounded-2xl">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base font-serif">
                  Pengajuan Permohonan Dokumen Digital
                </h3>
                <p className="text-xs text-slate-500">
                  Layanan penerbitan surat resmi & transkrip nilai terverifikasi LKP & Konsultan Prospect Jember
                </p>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              {/* Pemohon Info */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Pemohon (Siswa)</span>
                  <span className="font-bold text-slate-900">{myCandidateName}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">ID Registrasi</span>
                  <span className="font-mono font-bold text-red-800">{myCandidateId}</span>
                </div>
              </div>

              {/* Document Type Selector */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Jenis Dokumen / Surat Official *</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-red-800 cursor-pointer"
                >
                  <option value="surat_keterangan_aktif">
                    Surat Keterangan Aktif Pelatihan LKP Prospect
                  </option>
                  <option value="transkrip_nilai">
                    Transkrip Nilai Akademik & Sertifikat Kemampuan Bahasa (TOCFL / JLPT)
                  </option>
                  <option value="surat_rekomendasi">
                    Surat Rekomendasi Direktur LKP untuk Beasiswa / Universitas Taiwan/Jepang
                  </option>
                  <option value="pengantar_visa">
                    Surat Keterangan & Jaminan Resmi Prospect Education Jember
                  </option>
                  <option value="sertifikat_kelulusan">
                    Sertifikat Kelulusan & Kelakuan Baik LKP Prospect
                  </option>
                  <option value="surat_pernyataan_ijin">
                    Surat Pernyataan Izin Orang Tua / Wali Legalisir LKP
                  </option>
                </select>
              </div>

              {/* Purpose */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Tujuan & Keperluan Surat *</label>
                <textarea
                  required
                  rows={2}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Contoh: Lampiran Pengajuan Visa Beasiswa IFP Taiwan 1+4 di TETO Jakarta / Pembuatan Paspor di Kantor Imigrasi Jember..."
                  className="w-full border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-800"
                />
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Catatan Khusus / Spesifikasi Tambahan (Opsional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Perlu stempel basah / Bahasa Mandarin & Terjemahan..."
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-red-800"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-[11px] text-amber-900">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  Proses verifikasi dan penerbitan surat membutuhkan waktu <strong>1-2 hari kerja</strong>. Setelah disetujui pimpinan, file PDF resmi berstempel & bernomor surat akan tersedia di tab pengajuan ini.
                </p>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewRequestModal(false)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-red-800 hover:bg-red-900 text-white font-bold py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Permohonan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Detailed Tracking History */}
      {inspectRequest && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setInspectRequest(null);
          }}
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 relative my-auto max-h-[88vh] overflow-y-auto flex flex-col">
            <button
              onClick={() => setInspectRequest(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-3 bg-slate-900 text-amber-400 rounded-2xl">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">ID: {inspectRequest.id}</span>
                <h3 className="font-bold text-slate-900 text-base font-serif">Riwayat Tracking Status Permohonan</h3>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 font-serif">{inspectRequest.documentTypeName}</h4>
                <p className="text-slate-600">
                  <strong className="text-slate-800">Keperluan:</strong> {inspectRequest.purpose}
                </p>
                {inspectRequest.notes && (
                  <p className="text-slate-500 italic">
                    <strong>Catatan:</strong> {inspectRequest.notes}
                  </p>
                )}
                <div className="pt-2 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Diampu Oleh: <strong>{inspectRequest.processedBy || 'Staf Admin'}</strong></span>
                  {getStatusBadge(inspectRequest.status)}
                </div>
              </div>

              {/* Timeline Items */}
              <div className="space-y-1">
                <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Log Perjalanan Berkas:</h5>
                <div className="relative border-l-2 border-slate-200 ml-3 space-y-4 pt-2">
                  {inspectRequest.trackingHistory.map((item, idx) => (
                    <div key={idx} className="relative pl-5 space-y-0.5">
                      <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-red-800 border-2 border-white ring-2 ring-red-200" />
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{item.title}</span>
                        <span className="text-[10px] font-mono text-slate-400">{item.timestamp}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{item.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              {inspectRequest.status === 'ready' && (
                <button
                  onClick={() => {
                    const req = inspectRequest;
                    setInspectRequest(null);
                    setPreviewDocumentModal(req);
                  }}
                  className="px-4 py-2.5 bg-emerald-700 text-white font-bold rounded-xl text-xs hover:bg-emerald-800 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Lihat PDF Resmi</span>
                </button>
              )}
              <button
                onClick={() => setInspectRequest(null)}
                className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition ml-auto"
              >
                Tutup Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Official PDF Digital Document Viewer & Download */}
      {previewDocumentModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewDocumentModal(null);
          }}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 overflow-y-auto"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 relative my-auto max-h-[88vh] overflow-y-auto flex flex-col printable-content">
            <button
              onClick={() => setPreviewDocumentModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full cursor-pointer print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Document Letterhead Simulation */}
            <div className="border-2 border-slate-900 p-6 sm:p-8 space-y-6 bg-amber-50/10 rounded-2xl relative shadow-inner">
              {/* Kop Surat Header */}
              <div className="border-b-4 border-double border-slate-900 pb-4 text-center space-y-1">
                <div className="flex items-center justify-center gap-2 text-red-900 font-extrabold text-sm tracking-widest uppercase">
                  <Building2 className="w-5 h-5 text-red-800" />
                  <span>{websiteSettings?.siteName ? websiteSettings.siteName.toUpperCase() : 'PROSPECT EDUCATION CABANG JEMBER'}</span>
                </div>
                <h2 className="text-xl font-black font-serif text-slate-900 tracking-tight">
                  PROSPECT TAIWAN & JAPAN ACADEMIC CENTER
                </h2>
                <p className="text-[10px] text-slate-600 font-sans">
                  {websiteSettings?.officeAddress || 'Jl. Balung-Jenggawah, Wetan Kali, Balung Lor, Kec. Balung, Kabupaten Jember, Jawa Timur 68161'} | Telp/WA: {websiteSettings?.csPhoneWhatsApp || '0823-3455-4396'} | Email: {websiteSettings?.contactEmail || 'info@prospect-jember.id'}
                </p>
              </div>

              {/* Letter Title */}
              <div className="text-center space-y-1 py-2">
                <h3 className="font-extrabold text-slate-900 text-base font-serif uppercase underline decoration-2">
                  {previewDocumentModal.documentTypeName}
                </h3>
                <p className="text-[11px] font-mono font-bold text-slate-600">
                  Nomor: {previewDocumentModal.id}/SK-PROSPECT/VII/2026
                </p>
              </div>

              {/* Body Content */}
              <div className="space-y-4 text-xs text-slate-800 leading-relaxed font-serif">
                <p>
                  Yang bertanda tangan di bawah ini, {websiteSettings?.officialSignatoryTitle || 'Kepala Cabang Prospect Education Jember'} menerangkan dengan sebenarnya bahwa:
                </p>

                <div className="pl-4 space-y-1.5 font-mono text-[11px]">
                  <div className="grid grid-cols-3">
                    <span className="font-bold text-slate-600">Nama Lengkap</span>
                    <span className="col-span-2 font-bold text-slate-900">: {previewDocumentModal.candidateName}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-bold text-slate-600">Nomor Registrasi Siswa</span>
                    <span className="col-span-2 font-bold text-slate-900">: {previewDocumentModal.candidateId}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-bold text-slate-600">Program Studi / Pelatihan</span>
                    <span className="col-span-2 font-bold text-slate-900">: Prospect Taiwan IFP 1+4 & Intensive Mandarin</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-bold text-slate-600">Keperluan Dokumen</span>
                    <span className="col-span-2 font-bold text-slate-900">: {previewDocumentModal.purpose}</span>
                  </div>
                </div>

                <p>
                  Adalah benar-benar terdaftar sebagai peserta aktif {websiteSettings?.siteName || 'Prospect Education Cabang Jember'} Gelombang 2026. Yang bersangkutan memiliki rekam jejak akademik baik, tingkat kehadiran mencapai 98%, serta siap mengikuti prosedur beasiswa dan keagenan resmi.
                </p>

                <p>
                  Demikian surat keterangan ini diterbitkan secara sah untuk dipergunakan sebagaimana mestinya.
                </p>
              </div>

              {/* Signatures & Stamp */}
              <div className="pt-6 flex items-end justify-between text-xs">
                {/* QR Code Verification */}
                <div className="p-3 bg-white border border-slate-300 rounded-xl flex items-center gap-3">
                  <div className="w-14 h-14 bg-slate-900 text-white p-1 rounded flex items-center justify-center">
                    <QrCode className="w-12 h-12" />
                  </div>
                  <div className="text-[9px] font-mono space-y-0.5">
                    <span className="font-bold text-emerald-700 block">✓ TERVERIFIKASI DIGITAL</span>
                    <span className="text-slate-500 block">Sistem Otomasi LPK Jember</span>
                    <span className="text-slate-400 block">Kode: {previewDocumentModal.id}-VALID</span>
                  </div>
                </div>

                {/* Stamp & Sign */}
                <div className="text-center space-y-1 relative pr-4">
                  <p className="text-[11px] text-slate-600">Jember, {previewDocumentModal.requestDate.split(' ')[0]}</p>
                  <p className="font-bold text-slate-900 text-[11px]">{websiteSettings?.officialSignatoryTitle || 'Kepala Cabang Prospect Education Jember'}</p>

                  <div className="h-16 flex items-center justify-center relative my-1">
                    <div className="absolute opacity-80 rotate-[-12deg] flex items-center justify-center pointer-events-none">
                      <div className="w-20 h-20 rounded-full border-4 border-red-800 border-dashed flex items-center justify-center text-red-800 text-[8px] font-bold uppercase text-center p-1">
                        STEMPEL RESMI {websiteSettings?.siteName ? websiteSettings.siteName.toUpperCase() : 'PROSPECT EDUCATION JEMBER'}
                      </div>
                    </div>
                    <span className="font-serif italic text-slate-800 font-bold text-sm underline decoration-slate-400">
                      {websiteSettings?.officialSignatoryName || 'Rohim Egy, S.Pd.'}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-500 font-mono">{websiteSettings?.officialSignatoryTitle || 'Kepala Cabang Prospect Education Jember'}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 text-center text-[10px] text-slate-500 font-sans">
                Dokumen ini diterbitkan secara sah dan resmi oleh {websiteSettings?.siteName || 'Prospect Education Cabang Jember'}. Seluruh keabsahan dan verifikasi berkas berada sepenuhnya di bawah kewenangan Prospect Education tanpa memerlukan pengesahan lembaga luar.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Dokumen Sah Diterbitkan Resmi Oleh Prospect Education Jember</span>
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => window.print()}
                  className="flex-1 sm:flex-initial bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-3 rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak / Print</span>
                </button>

                <button
                  onClick={() => {
                    const fileContent = `SURAT KETERANGAN RESMI ${(websiteSettings?.siteName || 'PROSPECT EDUCATION CABANG JEMBER').toUpperCase()}\nAlamat: ${websiteSettings?.officeAddress || 'Jl. Balung-Jenggawah, Wetan Kali, Balung Lor, Kec. Balung, Kabupaten Jember, Jawa Timur 68161'}\nDokumen: ${previewDocumentModal.documentTypeName}\nNomor: ${previewDocumentModal.id}/SK-PROSPECT/VII/2026\nSiswa: ${previewDocumentModal.candidateName} (${previewDocumentModal.candidateId})\nKeperluan: ${previewDocumentModal.purpose}\nPenandatangan: ${websiteSettings?.officialSignatoryName || 'Rohim Egy, S.Pd.'} (${websiteSettings?.officialSignatoryTitle || 'Kepala Cabang Prospect Education Jember'})\n\nTerverifikasi Digital ${websiteSettings?.siteName || 'Prospect Education Cabang Jember'}`;
                    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `Dokumen_Resmi_${previewDocumentModal.documentTypeName.replace(/\s+/g, '_')}.txt`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                  }}
                  className="flex-1 sm:flex-initial bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-3 rounded-2xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Dokumen</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
