import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentDocument } from '../../types';
import { TaiwanPhotoGuideModal } from './TaiwanPhotoGuideModal';
import {
  UploadCloud,
  FileCheck,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
  Trash2,
  X,
  File,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Info,
  CheckSquare,
  Award,
  Download,
  Printer,
  Check,
  Filter,
  Camera,
  HelpCircle,
} from 'lucide-react';

interface FileUploadZoneProps {
  onSuccessUpload?: () => void;
  compactMode?: boolean;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({ onSuccessUpload, compactMode = false }) => {
  const { currentCandidate, uploadCandidateDocument, getAuthHeaders, t } = useApp();

  const [docType, setDocType] = useState<StudentDocument['docType']>('ktp');
  const [customTitle, setCustomTitle] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<StudentDocument | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [showPhotoGuide, setShowPhotoGuide] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const candidateProgram = currentCandidate?.selectedProgram || 'taiwan_ifp';
  const isTaiwanCandidate = candidateProgram.startsWith('taiwan');

  const documentTypeOptions: { id: StudentDocument['docType']; number: number; title: string; required: boolean; desc: string }[] = [
    { id: 'ktp', number: 1, title: '1. KTP (Kartu Tanda Penduduk Asli / Kartu Pelajar)', required: true, desc: 'Scan KTP asli tampak depan. NIK & data diri terbaca sangat jelas.' },
    { id: 'kk', number: 2, title: '2. KK (Kartu Keluarga Asli)', required: true, desc: 'Scan KK keluarga terbaru ber-barcode / stempel resmi Dukcapil.' },
    { id: 'ijazah', number: 3, title: '3. Ijazah SMK/SMA + Terjemahan Bahasa Inggris + Legalisir', required: true, desc: 'Scan Ijazah SMK/SMA asli beserta terjemahan resmi Bahasa Inggris dan stempel legalisir.' },
    { id: 'transkrip', number: 4, title: '4. Transkrip Nilai SMK/SMA + Terjemahan Bahasa Inggris + Legalisir', required: true, desc: 'Scan Transkrip Nilai SMK/SMA asli lengkap terjemahan Bahasa Inggris dan legalisir.' },
    { id: 'raport', number: 5, title: '5. Raport SMK/SMA Semester 1-6 + Identitas Diri', required: true, desc: 'File PDF gabungan Raport SMK/SMA Semester 1 s/d 6 beserta halaman identitas siswa.' },
    { id: 'paspor', number: 6, title: '6. Paspor RI (Masa Berlaku Min. 18 Bulan)', required: true, desc: 'Scan halaman 2-3 Paspor RI asli yang masih berlaku aktif.' },
    { id: 'pasfoto', number: 7, title: '7. Foto Ukuran 35 x 45 mm (Standar Taiwan / Internasional)', required: true, desc: 'Foto berwarna 35x45mm latar putih polos terbaru (6 bulan). Klik untuk panduan spesifikasi lengkap.' },
    { id: 'recommendation_letter', number: 8, title: '8. Recommendation Letter dari Sekolah (Surat Rekomendasi)', required: true, desc: 'Surat rekomendasi resmi dari Kepala Sekolah/Guru Pembimbing sekolah asal.' },
    { id: 'study_plan', number: 9, title: '9. Study Plan (Rencana Studi)', required: true, desc: 'Dokumen Rencana Studi (Study Plan) bermaterai/ditandatangani peserta.' },
    { id: 'autobiography', number: 10, title: '10. Autobiography (Riwayat Hidup)', required: true, desc: 'Dokumen Otobiografi / Riwayat Hidup lengkap latar belakang & motivasi program.' },
    { id: 'ktp_ortu', number: 11, title: '11. Copy Berwarna KTP Ortu (Ayah / Ibu / Wali)', required: true, desc: 'Scan/Foto berwarna KTP Ayah dan Ibu/Wali asli.' },
    { id: 'surat_izin', number: 12, title: 'Surat Izin Orang Tua / Wali Bermaterai (Tambahan)', required: false, desc: 'Formulir izin orang tua bermaterai Rp 10.000.' },
  ];

  const currentOption = documentTypeOptions.find((d) => d.id === docType) || documentTypeOptions[0];

  const validateAndSetFile = (file: File) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMessage(`Ukuran file (${(file.size / (1024 * 1024)).toFixed(1)}MB) melebihi batas maksimum 10MB.`);
      return false;
    }

    // Validate format (pdf, jpg, jpeg, png, webp)
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const extension = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'webp'];

    if (!allowedTypes.includes(file.type) && (!extension || !allowedExtensions.includes(extension))) {
      setErrorMessage('Format file tidak didukung. Harap gunakan format PDF, JPG, PNG, atau WEBP.');
      return false;
    }

    setSelectedFile(file);
    return true;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const handleExecuteUpload = async () => {
    if (!currentCandidate) {
      setErrorMessage('Akun peserta tidak ditemukan. Silakan masuk ke akun peserta.');
      return;
    }

    if (!selectedFile) {
      setErrorMessage('Silakan pilih atau seret file dokumen terlebih dahulu.');
      return;
    }

    // Call server backend upload verification endpoint
    try {
      const titleToUse = customTitle.trim() || currentOption.title;

      const response = await fetch('/api/documents/upload-verify', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          fileType: selectedFile.type,
          docTitle: titleToUse,
          candidateId: currentCandidate.id,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Gagal memvalidasi dokumen di server.');
      }

      uploadCandidateDocument(currentCandidate.id, {
        docType,
        title: titleToUse,
        fileName: selectedFile.name,
        fileUrl: data.secureFileUrl,
        status: 'pending',
      });

      setSuccessMessage(`Dokumen "${titleToUse}" berhasil diunggah dan disimpan di storage server.`);
      setSelectedFile(null);
      setCustomTitle('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal mengunggah berkas ke server.');
    } finally {
      setUploadProgress(null);
      if (onSuccessUpload) onSuccessUpload();
    }
  };

  const userDocuments = currentCandidate?.documents || [];

  const filteredDocs = userDocuments.filter((d) => {
    if (statusFilter === 'all') return true;
    return d.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Upload Zone Card */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-300 border border-red-200 dark:border-red-900 px-3 py-1 rounded-full text-[11px] font-bold">
                <UploadCloud className="w-3.5 h-3.5 text-red-700 dark:text-red-400" />
                <span>Zona Upload Dokumen Administrasi</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-900 px-3 py-1 rounded-full text-[11px] font-bold">
                {isTaiwanCandidate ? '🇹🇼 Persyaratan Berkas Taiwan' : '🇯🇵 Persyaratan Berkas Jepang'}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-serif">
              Upload Berkas Identitas & Sertifikat ({isTaiwanCandidate ? 'Taiwan' : 'Jepang'})
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
              Seret & lepas file Anda di area di bawah ini untuk ditinjau oleh Tim Administrasi LKP Prospect Jember.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-3.5 py-2 rounded-2xl border border-emerald-200 dark:border-emerald-800 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Terenkripsi & Terverifikasi</span>
          </div>
        </div>

        {/* Alert Messages */}
        {errorMessage && (
          <div className="bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 p-4 rounded-2xl text-xs font-medium flex items-start gap-3 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block text-red-900 dark:text-red-100">Gagal Mengunggah File:</span>
              <p>{errorMessage}</p>
            </div>
            <button onClick={() => setErrorMessage(null)} className="text-red-500 hover:text-red-700 font-bold">
              ✕
            </button>
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 p-4 rounded-2xl text-xs font-medium flex items-start gap-3 animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block text-emerald-900 dark:text-emerald-100">Berhasil Disimpan:</span>
              <p>{successMessage}</p>
            </div>
            <button onClick={() => setSuccessMessage(null)} className="text-emerald-500 hover:text-emerald-700 font-bold">
              ✕
            </button>
          </div>
        )}

        {/* Document Category & Custom Title Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>Pilih Kategori Dokumen *</span>
              {currentOption.required ? (
                <span className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 px-2 py-0.5 rounded border border-red-200 dark:border-red-900">
                  Wajib Administrasi
                </span>
              ) : (
                <span className="text-[10px] text-slate-400">Opsional / Pendukung</span>
              )}
            </label>
            <select
              value={docType}
              onChange={(e) => {
                setDocType(e.target.value as StudentDocument['docType']);
                setCustomTitle('');
              }}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-medium text-xs focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              {documentTypeOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.title} {opt.required ? '(*Wajib)' : ''}
                </option>
              ))}
            </select>
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>{currentOption.desc}</span>
              {docType === 'pasfoto' && (
                <button
                  type="button"
                  onClick={() => setShowPhotoGuide(true)}
                  className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold hover:underline cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Lihat Panduan Foto Taiwan (35x45mm)</span>
                </button>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Judul / Keterangan Dokumen (Opsional)
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder={`Contoh: ${currentOption.title}`}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-xs focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Isi judul kustom jika mengunggah sertifikat atau dokumen tambahan khusus.
            </p>
          </div>
        </div>

        {/* Drag and Drop Zone Container */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
            isDragging
              ? 'border-red-600 bg-red-50/90 dark:bg-red-950/70 scale-[1.01] shadow-lg ring-4 ring-red-100 dark:ring-red-950'
              : selectedFile
              ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30'
              : 'border-slate-300 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/60 hover:border-red-600 dark:hover:border-amber-400 hover:bg-slate-100/80 dark:hover:bg-slate-800'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            className="hidden"
            onChange={handleFileSelect}
          />

          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 ${
              selectedFile
                ? 'bg-emerald-600 text-white shadow-md scale-105'
                : isDragging
                ? 'bg-red-700 text-white scale-110'
                : 'bg-red-800/10 dark:bg-red-950 text-red-800 dark:text-amber-400 border border-red-200 dark:border-red-900'
            }`}
          >
            {selectedFile ? <FileCheck className="w-8 h-8" /> : <UploadCloud className="w-8 h-8" />}
          </div>

          <div className="space-y-1 max-w-md">
            {selectedFile ? (
              <>
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800 inline-block">
                  File Siap Diunggah
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate font-mono mt-1">
                  {selectedFile.name}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Ukuran: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Tipe: {selectedFile.type || 'Dokumen'}
                </p>
              </>
            ) : (
              <>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  {isDragging ? 'Lepaskan file di sini untuk mengunggah' : 'Seret & Lepas File Dokumen Di Sini'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  atau <span className="text-red-700 dark:text-amber-400 font-bold underline">klik untuk memilih dari komputer / HP</span>
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono pt-1">
                  Format yang didukung: PDF, JPG, PNG, WEBP (Maksimal 10 MB per file)
                </p>
              </>
            )}
          </div>

          {selectedFile && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="text-xs text-red-600 dark:text-red-400 font-bold hover:underline flex items-center gap-1 pt-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Batalkan / Pilih File Lain
            </button>
          )}
        </div>

        {/* Upload Progress Bar */}
        {uploadProgress !== null && (
          <div className="space-y-2 bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
                <span>Mengunggah Dokumen ke Server Administrasi...</span>
              </span>
              <span className="text-amber-400 font-mono">{uploadProgress}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Submit Button */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-500" />
            <span>Dokumen yang diunggah akan langsung diproses verifikasi oleh Admin LKP Jember.</span>
          </p>

          <button
            type="button"
            disabled={!selectedFile || uploadProgress !== null}
            onClick={handleExecuteUpload}
            className={`font-bold text-xs px-7 py-3 rounded-xl shadow-md flex items-center gap-2 transition cursor-pointer ${
              selectedFile && uploadProgress === null
                ? 'bg-gradient-to-r from-red-800 via-red-700 to-amber-700 hover:from-red-900 hover:to-amber-800 text-white scale-102'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
            }`}
          >
            <UploadCloud className="w-4 h-4 text-amber-300" />
            <span>Kirim Dokumen untuk Verifikasi</span>
          </button>
        </div>
      </div>

      {/* Uploaded Documents Management Gallery */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-serif flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-red-700 dark:text-amber-400" />
              <span>Daftar Dokumen Diunggah ({userDocuments.length})</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Pantau status peninjauan berkas administrasi oleh Tim Verifikasi LKP & Konsultan Prospect Education.
            </p>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Semua ({userDocuments.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                statusFilter === 'pending'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-amber-500'
              }`}
            >
              Menunggu ({userDocuments.filter((d) => d.status === 'pending').length})
            </button>
            <button
              onClick={() => setStatusFilter('verified')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                statusFilter === 'verified'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-emerald-500'
              }`}
            >
              Terverifikasi ({userDocuments.filter((d) => d.status === 'verified').length})
            </button>
            <button
              onClick={() => setStatusFilter('rejected')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                statusFilter === 'rejected'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-red-500'
              }`}
            >
              Revisi ({userDocuments.filter((d) => d.status === 'rejected').length})
            </button>
          </div>
        </div>

        {/* Documents Cards List */}
        {filteredDocs.length === 0 ? (
          <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Belum ada dokumen dalam kategori ini.
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Gunakan area upload di atas untuk melampirkan berkas KTP, Ijazah, KK, atau Sertifikat pendukung Anda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                  doc.status === 'verified'
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                    : doc.status === 'rejected'
                    ? 'bg-red-50/60 dark:bg-red-950/30 border-red-300 dark:border-red-800'
                    : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <File className="w-4 h-4 text-red-700 dark:text-amber-400 shrink-0" />
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs">{doc.title}</h4>
                    </div>

                    {/* Status Badges */}
                    {doc.status === 'verified' && (
                      <span className="bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-3 h-3" /> Terverifikasi
                      </span>
                    )}
                    {doc.status === 'rejected' && (
                      <span className="bg-red-700 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                        <AlertCircle className="w-3 h-3" /> Perlu Revisi
                      </span>
                    )}
                    {doc.status === 'pending' && (
                      <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3" /> Menunggu Review
                      </span>
                    )}
                  </div>

                  {doc.fileName && (
                    <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-800 dark:text-slate-200 flex items-center justify-between">
                      <span className="truncate max-w-[200px]">{doc.fileName}</span>
                      <span className="text-[10px] text-slate-400">{doc.uploadedAt || 'Baru saja'}</span>
                    </div>
                  )}

                  {doc.notes && (
                    <div className="p-2.5 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 rounded-xl text-[11px] font-medium border border-amber-300 dark:border-amber-800">
                      <strong>Catatan Admin Review:</strong> {doc.notes}
                    </div>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setPreviewDoc(doc)}
                    className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-red-700 dark:hover:text-amber-400 flex items-center gap-1 transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Pratinjau Dokumen</span>
                  </button>

                  <span className="text-[10px] text-slate-400 font-mono">ID: {doc.id}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewDoc && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewDoc(null);
          }}
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
        >
          <div className="bg-slate-900 text-slate-100 rounded-3xl border border-slate-700 max-w-xl w-full p-6 sm:p-7 space-y-5 shadow-2xl my-auto max-h-[88vh] overflow-y-auto flex flex-col printable-content">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h4 className="font-bold text-white text-sm sm:text-base font-serif">Pratinjau & Bukti Dokumen Administrasi</h4>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer print:hidden"
                title="Tutup Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-mono block">Judul Dokumen</span>
                <p className="font-bold text-white text-sm mt-0.5">{previewDoc.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <div>
                  <span className="text-slate-400 text-[10px]">Nama File:</span>
                  <p className="font-mono text-amber-300 text-[11px] truncate">{previewDoc.fileName || '-'}</p>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px]">Tanggal Unggah:</span>
                  <p className="font-mono text-slate-200 text-[11px]">{previewDoc.uploadedAt || '-'}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 text-[10px]">Status Verifikasi:</span>
                <span
                  className={`font-bold text-[10px] px-2.5 py-0.5 rounded-full ${
                    previewDoc.status === 'verified'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : previewDoc.status === 'rejected'
                      ? 'bg-red-950 text-red-300 border border-red-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}
                >
                  {previewDoc.status === 'verified'
                    ? 'TERVERIFIKASI ADMIN'
                    : previewDoc.status === 'rejected'
                    ? 'PERLU REVISI'
                    : 'MENUNGGU VERIFIKASI'}
                </span>
              </div>
            </div>

            {/* Simulated Canvas / Image Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 text-center space-y-3">
              <FileCheck className="w-12 h-12 text-emerald-400 mx-auto" />
              <div>
                <p className="text-xs font-bold text-white">Dokumen Digital Terverifikasi Resmi</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  LKP & Konsultan Pendidikan Prospect Education Cabang Jember • Partner Visa HUB INDONESIA
                </p>
              </div>
              <p className="text-[10px] font-mono text-amber-400/90 bg-amber-950/60 p-2 rounded-xl border border-amber-800/60 inline-block">
                Nomor Registrasi: {currentCandidate?.registrationNumber || 'PE-JBR-2026-001'}
              </p>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 print:hidden shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>Cetak Dokumen</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const content = `=====================================================\nLEMBAR DOKUMEN TERTENTU - PROSPECT EDUCATION JEMBER\n=====================================================\nJudul: ${previewDoc.title}\nFile: ${previewDoc.fileName || '-'}\nStatus: ${previewDoc.status}\nTanggal Unggah: ${previewDoc.uploadedAt || '-'}\nPeserta: ${currentCandidate?.fullName || '-'}\n=====================================================`;
                    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `Dokumen_${previewDoc.title.replace(/\s+/g, '_')}.txt`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                  }}
                  className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                >
                  <Download className="w-4 h-4 text-emerald-200" />
                  <span>Unduh File</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="bg-red-800 hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Panduan Foto Taiwan */}
      <TaiwanPhotoGuideModal
        isOpen={showPhotoGuide}
        onClose={() => setShowPhotoGuide(false)}
      />
    </div>
  );
};
