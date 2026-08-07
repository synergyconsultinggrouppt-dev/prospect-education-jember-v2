import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProgramType } from '../../types';
import {
  User,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Send,
  FileText,
  UploadCloud,
  FileCheck,
  AlertCircle,
  HelpCircle,
  Building2,
  Phone,
  Mail,
  MapPin,
  Check,
  Sparkles,
  Download,
  ExternalLink,
  Award,
  MessageSquare,
  Hash,
  Users,
  Clock,
  Lock,
  LogIn,
} from 'lucide-react';

interface DocumentUploadItem {
  id: string;
  nameKeyId: string;
  nameKeyEn: string;
  required: boolean;
  uploaded: boolean;
  fileName?: string;
  fileSize?: string;
}

export const RegistrationForm: React.FC = () => {
  const { registerCandidate, selectedProgramId, setActiveTab, setRole, updateCandidateBiodata, openLoginModal, t } = useApp();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const [form, setForm] = useState({
    fullName: '',
    nik: '',
    email: '',
    phoneWA: '',
    schoolOrigin: '',
    cityOrigin: 'Kab. Jember',
    parentName: '',
    parentPhone: '',
    selectedProgram: (selectedProgramId as ProgramType) || ('taiwan_ifp' as ProgramType),
    referralSource: 'Brosur / Spanduk Sekolah',
    termsAccepted: false,
  });

  // State for document uploads
  const [documents, setDocuments] = useState<DocumentUploadItem[]>([
    {
      id: 'doc-ktp',
      nameKeyId: 'Scan KTP / Kartu Pelajar (Elektronik)',
      nameKeyEn: 'ID Card / Student Card Scan',
      required: true,
      uploaded: false,
    },
    {
      id: 'doc-kk',
      nameKeyId: 'Scan Kartu Keluarga (KK)',
      nameKeyEn: 'Family Card Scan (KK)',
      required: true,
      uploaded: false,
    },
    {
      id: 'doc-ijazah',
      nameKeyId: 'Scan Ijazah / SKL / Transkrip Nilai Terakhir',
      nameKeyEn: 'High School Diploma / Transcript Scan',
      required: true,
      uploaded: false,
    },
    {
      id: 'doc-foto',
      nameKeyId: 'Pasfoto Formal 3x4 (Background Putih)',
      nameKeyEn: 'Formal Passport Photo 3x4 (White Background)',
      required: true,
      uploaded: false,
    },
    {
      id: 'doc-sertifikat',
      nameKeyId: 'Sertifikat Bahasa / Pembekalan Prospect (Opsional, Tanpa Wajib TOCFL)',
      nameKeyEn: 'Language / Prospect Training Certificate (Optional, No TOCFL Required)',
      required: false,
      uploaded: false,
    },
  ]);

  const [submittedCandidateId, setSubmittedCandidateId] = useState<string | null>(null);
  const [submittedRegNum, setSubmittedRegNum] = useState<string | null>(null);

  const handleSimulateUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              uploaded: true,
              fileName: file.name,
              fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            }
          : doc
      )
    );
  };

  const toggleUploadState = (id: string) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === id) {
          if (doc.uploaded) {
            return { ...doc, uploaded: false, fileName: undefined, fileSize: undefined };
          } else {
            return {
              ...doc,
              uploaded: true,
              fileName: `Dokumen_${doc.id.replace('doc-', '').toUpperCase()}.pdf`,
              fileSize: '1.2 MB',
            };
          }
        }
        return doc;
      })
    );
  };

  const markAllDocsReady = () => {
    setDocuments((prev) =>
      prev.map((doc) => ({
        ...doc,
        uploaded: true,
        fileName: doc.fileName || `Lampiran_${doc.id.replace('doc-', '').toUpperCase()}.pdf`,
        fileSize: doc.fileSize || '1.1 MB',
      }))
    );
  };

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.phoneWA) return;
    setCurrentStep(2);
  };

  const handleNextStep2 = () => {
    setCurrentStep(3);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.termsAccepted) return;

    const result = registerCandidate({
      fullName: form.fullName,
      email: form.email,
      phoneWA: form.phoneWA,
      selectedProgram: form.selectedProgram,
    });

    if (result) {
      setSubmittedCandidateId(result.id);
      setSubmittedRegNum(result.registrationNumber);

      // Save additional biodata into context
      updateCandidateBiodata(result.id, {
        fullName: form.fullName,
        nik: form.nik,
        email: form.email,
        phoneWA: form.phoneWA,
        schoolOrigin: form.schoolOrigin,
        address: `${form.cityOrigin}, Jawa Timur`,
        parentName: form.parentName,
        parentPhone: form.parentPhone,
      });
    } else {
      setSubmittedRegNum(`PE-JBR-2026-${Math.floor(100 + Math.random() * 900)}`);
    }
  };

  const getProgramTitle = (type: ProgramType) => {
    switch (type) {
      case 'taiwan_ifp':
        return '🇹🇼 Taiwan IFP 1+4 (1 Thn Bahasa di Taiwan + 4 Thn S1)';
      case 'taiwan_4_1':
        return '🇹🇼 Taiwan 4+1 (4 Thn S1 + 1 Thn S2 Pascasarjana)';
      case 'japan_im':
        return '🇯🇵 Jepang IM Japan (Program Magang Kemnaker RI)';
      case 'japan_ssw':
        return '🇯🇵 Jepang Tokutei Ginou SSW (Pekerja Terampil)';
      default:
        return 'Program Pendidikan / Kerja Luar Negeri';
    }
  };

  const requiredDocsCount = documents.filter((d) => d.required).length;
  const uploadedRequiredCount = documents.filter((d) => d.required && d.uploaded).length;

  const programOptions = [
    {
      id: 'taiwan_ifp',
      flag: '🇹🇼',
      title: 'Taiwan IFP 1+4',
      badge: '1 Thn Bahasa + 4 Thn S1',
      desc: 'Tanpa Syarat TOCFL! Dibekali Mandarin & Inggris Basic di Prospect Jember + 1 Thn Bahasa di Taiwan & 4 Thn S1',
      allowance: 'Gaji Magang Legal: NTD 27.470/bln (~Rp 14 Juta)',
    },
    {
      id: 'taiwan_4_1',
      flag: '🇹🇼',
      title: 'Taiwan 4+1 (S1 + S2)',
      badge: '4 Thn S1 + 1 Thn S2',
      desc: 'Program Akselerasi 4 Tahun Perkuliahan S1 + 1 Tahun Lanjutan Magister (S2) Pascasarjana Taiwan',
      allowance: 'Beasiswa SPP & Kesempatan Magang Industri',
    },
    {
      id: 'japan_im',
      flag: '🇯🇵',
      title: 'Jepang IM Japan',
      badge: 'Kemnaker RI (Subsidi)',
      desc: 'Program Magang Kerja Resmi Pemerintah Kemnaker RI & IM Japan',
      allowance: 'Tunjangan: 120.000-150.000 Yen/bln + Modal Usaha 600.000 Yen',
    },
    {
      id: 'japan_ssw',
      flag: '🇯🇵',
      title: 'Jepang Tokutei Ginou (SSW)',
      badge: 'Kerja Terampil Direct',
      desc: 'Visa Pekerja Terampil Sektor Manufaktur, Kaigo (Perawat), & Pengolahan Makanan',
      allowance: 'Gaji Pokok: 180.000-220.000 Yen/bln (~Rp 20 Juta)',
    },
  ];

  const generateProofDoc = () => {
    const proofHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Bukti Pendaftaran - ${form.fullName}</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 30px; background: #fff; color: #0f172a; }
    .card { border: 2px solid #991b1b; border-radius: 12px; padding: 24px; max-width: 650px; margin: 0 auto; }
    .title { color: #991b1b; font-size: 20px; font-weight: bold; margin-bottom: 4px; }
    .reg { background: #fef3c7; border: 1px solid #f59e0b; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 16px; font-weight: bold; color: #92400e; margin: 16px 0; text-align: center; }
    .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="title">PROSPECT EDUCATION CABANG JEMBER</div>
    <div style="font-size: 12px; color: #64748b;">TANDA BUKTI PENDAFTARAN ONLINE RESMI</div>
    <div class="reg">NOMOR REGISTRASI: ${submittedRegNum || 'PE-JBR-2026-REG'}</div>
    <div class="row"><span>Nama Pendaftar:</span> <strong>${form.fullName}</strong></div>
    <div class="row"><span>NIK:</span> <strong>${form.nik || '-'}</strong></div>
    <div class="row"><span>Email:</span> <strong>${form.email}</strong></div>
    <div class="row"><span>Nomor WhatsApp:</span> <strong>${form.phoneWA}</strong></div>
    <div class="row"><span>Program Dipilih:</span> <strong>${getProgramTitle(form.selectedProgram)}</strong></div>
    <div class="row"><span>Asal Sekolah:</span> <strong>${form.schoolOrigin || 'Sederajat'}</strong></div>
    <div class="row"><span>Tanggal Registrasi:</span> <strong>${new Date().toLocaleDateString('id-ID')}</strong></div>
    <div style="margin-top: 24px; font-size: 11px; color: #64748b; text-align: center;">
      Simpan bukti pendaftaran ini untuk ditunjukkan kepada Petugas Admin LKP & Konsultan Pendidikan Prospect Education Cabang Jember.
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([proofHtml], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bukti_Pendaftaran_Prospect_${form.fullName.toLowerCase().replace(/\s+/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="py-12 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Section Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2">
            <span className="text-xs font-bold text-red-800 dark:text-amber-300 uppercase tracking-widest bg-red-100 dark:bg-red-950/80 px-3.5 py-1 rounded-full border border-red-200 dark:border-red-900 inline-block">
              {t('FORMULIR PENDAFTARAN PESERTA BARU', 'NEW APPLICANT REGISTRATION FORM')}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-serif tracking-tight">
            {t('Pendaftaran Online Prospect Education Cabang Jember', 'Prospect Education Jember Online Registration')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-2xl mx-auto">
            {t(
              'Isi data diri lengkap, pilih program studi/kerja ke Taiwan atau Jepang, dan dapatkan akun Portal Peserta resmi secara langsung.',
              'Fill in your details, select Taiwan or Japan program, and get immediate access to your Student Portal account.'
            )}
          </p>
        </div>

        {/* Multi-Step Progress Indicator Component */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="relative flex items-center justify-between max-w-2xl mx-auto">
            {/* Background Line */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full z-0" />

            {/* Active Progress Line */}
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-red-800 to-amber-500 rounded-full transition-all duration-500 z-0"
              style={{
                width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%',
              }}
            />

            {/* Step 1 Badge */}
            <button
              onClick={() => currentStep > 1 && setCurrentStep(1)}
              disabled={currentStep < 1}
              className={`relative z-10 flex flex-col items-center gap-1 group focus:outline-none ${
                currentStep > 1 ? 'cursor-pointer' : ''
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-all duration-300 border-2 ${
                  currentStep > 1
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : currentStep === 1
                    ? 'bg-red-800 text-white border-amber-400 ring-4 ring-red-100 dark:ring-red-950 scale-105'
                    : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-300 dark:border-slate-700'
                }`}
              >
                {currentStep > 1 ? <Check className="w-5 h-5 text-white" /> : '1'}
              </div>
              <span
                className={`text-[11px] font-bold ${
                  currentStep === 1
                    ? 'text-red-900 dark:text-amber-300'
                    : currentStep > 1
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-slate-400'
                }`}
              >
                {t('1. Data Diri & Program', '1. Personal & Program')}
              </span>
            </button>

            {/* Step 2 Badge */}
            <button
              onClick={() => currentStep > 2 && setCurrentStep(2)}
              disabled={currentStep < 2}
              className={`relative z-10 flex flex-col items-center gap-1 group focus:outline-none ${
                currentStep > 2 ? 'cursor-pointer' : ''
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-all duration-300 border-2 ${
                  currentStep > 2
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : currentStep === 2
                    ? 'bg-red-800 text-white border-amber-400 ring-4 ring-red-100 dark:ring-red-950 scale-105'
                    : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-300 dark:border-slate-700'
                }`}
              >
                {currentStep > 2 ? <Check className="w-5 h-5 text-white" /> : '2'}
              </div>
              <span
                className={`text-[11px] font-bold ${
                  currentStep === 2
                    ? 'text-red-900 dark:text-amber-300'
                    : currentStep > 2
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-slate-400'
                }`}
              >
                {t('2. Syarat Dokumen', '2. Documentation')}
              </span>
            </button>

            {/* Step 3 Badge */}
            <div className="relative z-10 flex flex-col items-center gap-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-all duration-300 border-2 ${
                  submittedCandidateId
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : currentStep === 3
                    ? 'bg-red-800 text-white border-amber-400 ring-4 ring-red-100 dark:ring-red-950 scale-105'
                    : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-300 dark:border-slate-700'
                }`}
              >
                {submittedCandidateId ? <Check className="w-5 h-5 text-white" /> : '3'}
              </div>
              <span
                className={`text-[11px] font-bold ${
                  currentStep === 3 ? 'text-red-900 dark:text-amber-300' : 'text-slate-400'
                }`}
              >
                {t('3. Review & Kirim', '3. Review & Submit')}
              </span>
            </div>
          </div>
        </div>

        {/* Success Confirmation View */}
        {submittedCandidateId ? (
          <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-emerald-200 dark:border-emerald-800/60 shadow-xl text-center space-y-6 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner border border-emerald-300 dark:border-emerald-700">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-widest bg-emerald-100 dark:bg-emerald-950/80 px-3.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 inline-block">
                {t('PENDAFTARAN BERHASIL DISIMPAN', 'REGISTRATION SUCCESSFUL')}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-serif">
                {t('Selamat! Pendaftaran Anda Telah Terdaftar', 'Congratulations! Your Registration is Submitted')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
                {t(
                  'Sistem Prospect Education Cabang Jember telah menerbitkan nomor registrasi resmi Anda. Silakan masuk ke Portal Peserta untuk mengecek status seleksi, melakukan pembayaran awal, & mencetak Surat LoA.',
                  'Prospect Education Jember system has generated your official registration code. Proceed to Student Portal to track status, make initial fee payment, and download your LoA.'
                )}
              </p>
            </div>

            <div className="bg-slate-900 text-white p-6 rounded-2xl max-w-md mx-auto space-y-3 border border-amber-500/30 text-xs shadow-lg">
              <p className="text-slate-400 font-medium">{t('Nomor Registrasi Resmi:', 'Official Registration Number:')}</p>
              <p className="text-2xl font-mono font-black text-amber-400 tracking-wider">
                {submittedRegNum || 'PE-JBR-2026-901'}
              </p>
              <div className="pt-2 border-t border-slate-800 space-y-1.5 text-slate-300 text-left">
                <p>
                  • {t('Nama Pendaftar:', 'Applicant Name:')} <strong className="text-white">{form.fullName}</strong>
                </p>
                <p>
                  • {t('Program:', 'Program:')}{' '}
                  <strong className="text-amber-300">{getProgramTitle(form.selectedProgram)}</strong>
                </p>
                <p className="flex items-center gap-1.5 text-amber-300 bg-amber-950/80 p-2 rounded border border-amber-800/80 font-medium text-[11px]">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Status: <strong>Wajib Disetujui Admin Cabang Jember</strong></span>
                </p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl max-w-md mx-auto text-left text-xs text-amber-900 dark:text-amber-200 space-y-1">
              <p className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-amber-600" />
                <span>Ketentuan Login Portal Peserta:</span>
              </p>
              <p className="text-[11px] leading-relaxed">
                Pendaftaran Anda berhasil dicatat. Sesuai kebijakan, akun pendaftaran baru wajib disetujui & diverifikasi oleh Admin Cabang Jember terlebih dahulu sebelum Anda dapat melakukan login ke Portal LMS Peserta.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={generateProofDoc}
                type="button"
                className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-5 py-3.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Unduh Bukti Pendaftaran (.HTML)</span>
              </button>

              <button
                onClick={() => openLoginModal('student')}
                className="w-full sm:w-auto bg-gradient-to-r from-[#092852] to-[#0F3D7A] hover:bg-[#1653a1] text-amber-300 font-bold text-xs px-6 py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition cursor-pointer border border-amber-400/40"
              >
                <LogIn className="w-4 h-4 text-amber-300" />
                <span>{t('Login Ke Portal Peserta', 'Login to Student Portal')}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Main Multi-Step Form Card */
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6 text-xs text-slate-800 dark:text-slate-200">
            {/* Header Badge inside form */}
            <div className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-950 text-white p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-amber-500/30 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                  <ShieldCheck className="w-5 h-5 shrink-0" />
                </div>
                <div>
                  <span className="font-bold text-xs text-white block">
                    {t('Sistem Pendaftaran Resmi Prospect Education', 'Official Prospect Education Registration System')}
                  </span>
                  <span className="text-[11px] text-slate-300">
                    LKP & Konsultan Pendidikan • Visa Bekerjasama dengan VISA HUB INDONESIA
                  </span>
                </div>
              </div>
              <span className="text-[11px] bg-red-900 text-amber-200 px-3 py-1 rounded-lg font-mono font-bold border border-red-700 self-start sm:self-center">
                PE-JBR-2026
              </span>
            </div>

            {/* STEP 1: Data Diri & Program Choice */}
            {currentStep === 1 && (
              <form onSubmit={handleNextStep1} className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4 text-red-700 dark:text-amber-400" />
                    <span>{t('Langkah 1: Identitas Diri & Pilihan Program', 'Step 1: Personal Details & Program Choice')}</span>
                  </h3>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">* Wajib Diisi</span>
                </div>

                <div className="space-y-4">
                  {/* Nama Lengkap & NIK */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                        <span>{t('Nama Lengkap (Sesuai KTP / Ijazah) *', 'Full Name (As in ID / Diploma) *')}</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={form.fullName}
                          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                          placeholder={t('Contoh: Bagas Aditya Pratama', 'e.g. Bagas Aditya Pratama')}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600 text-xs sm:text-sm font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                        <span>{t('NIK (Nomor Induk Kependudukan)', 'ID Number (NIK)')}</span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {form.nik.length}/16 Digit
                        </span>
                      </label>
                      <div className="relative">
                        <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          maxLength={16}
                          value={form.nik}
                          onChange={(e) => setForm({ ...form, nik: e.target.value.replace(/\D/g, '') })}
                          placeholder="3509xxxxxxxxxxxx"
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white font-mono focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600 text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email & WhatsApp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-800 dark:text-slate-200">
                        {t('Alamat Email Aktif *', 'Active Email Address *')}
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="bagas@gmail.com"
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600 text-xs sm:text-sm font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-800 dark:text-slate-200">
                        {t('Nomor WhatsApp Aktif *', 'Active WhatsApp Number *')}
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={form.phoneWA}
                          onChange={(e) => setForm({ ...form, phoneWA: e.target.value })}
                          placeholder="082334554396"
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white font-mono focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600 text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Asal Sekolah & Kota/Kabupaten */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-800 dark:text-slate-200">
                        {t('Asal Sekolah / Lulusan', 'School / Institution Origin')}
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={form.schoolOrigin}
                          onChange={(e) => setForm({ ...form, schoolOrigin: e.target.value })}
                          placeholder={t('Contoh: SMKN 1 Jember / SMAN Balung', 'e.g. SMKN 1 Jember')}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600 text-xs sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-800 dark:text-slate-200">
                        {t('Kabupaten / Kota Domisili', 'Regency / City of Residence')}
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={form.cityOrigin}
                          onChange={(e) => setForm({ ...form, cityOrigin: e.target.value })}
                          placeholder="Kab. Jember"
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600 text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Kontak Orang Tua & Sumber Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-800 dark:text-slate-200">
                        {t('Nama & No. HP Orang Tua / Wali', 'Parent / Guardian Contact')}
                      </label>
                      <div className="relative">
                        <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={form.parentName}
                          onChange={(e) => setForm({ ...form, parentName: e.target.value })}
                          placeholder={t('Nama Orang Tua & No. HP', 'Parent Name & Phone')}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600 text-xs sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-800 dark:text-slate-200">
                        {t('Informasi Dari Mana?', 'How did you hear about us?')}
                      </label>
                      <select
                        value={form.referralSource}
                        onChange={(e) => setForm({ ...form, referralSource: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600 text-xs sm:text-sm"
                      >
                        <option value="Brosur / Spanduk Sekolah">Brosur / Spanduk Sekolah</option>
                        <option value="Instagram / TikTok">Instagram / TikTok Prospect</option>
                        <option value="Rekomendasi Alumni Jember">Rekomendasi Teman / Alumni Jember</option>
                        <option value="Kunjungan Tim Sosialisasi">Kunjungan Tim Sosialisasi LPK</option>
                      </select>
                    </div>
                  </div>

                  {/* Visual Program Cards Selection */}
                  <div className="space-y-2 pt-3">
                    <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-red-700 dark:text-amber-400" />
                        <span>{t('Pilih Program Studi / Magang Kerja *', 'Select Desired Program *')}</span>
                      </span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {programOptions.map((prog) => {
                        const isSelected = form.selectedProgram === prog.id;
                        return (
                          <div
                            key={prog.id}
                            onClick={() => setForm({ ...form, selectedProgram: prog.id as ProgramType })}
                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between space-y-2 ${
                              isSelected
                                ? 'bg-blue-50/90 dark:bg-blue-950/60 border-[#0F3D7A] dark:border-amber-500 shadow-md ring-2 ring-[#0F3D7A]/20'
                                : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{prog.flag}</span>
                                <span className="font-bold text-xs text-slate-900 dark:text-white">{prog.title}</span>
                              </div>
                              {isSelected && (
                                <span className="p-1 bg-[#0F3D7A] text-white rounded-full">
                                  <Check className="w-3 h-3" />
                                </span>
                              )}
                            </div>

                            <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full inline-block self-start border border-amber-300 dark:border-amber-800">
                              {prog.badge}
                            </span>

                            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">{prog.desc}</p>

                            <p className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold border-t border-slate-200 dark:border-slate-700/80 pt-1.5">
                              {prog.allowance}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="submit"
                    className="bg-[#0F3D7A] hover:bg-[#092852] text-amber-300 font-bold text-xs px-7 py-3.5 rounded-xl shadow-md flex items-center gap-2 transition cursor-pointer border border-blue-400/30"
                  >
                    <span>{t('Lanjut ke Step 2: Persyaratan Berkas', 'Next to Step 2: Documentation')}</span>
                    <ArrowRight className="w-4 h-4 text-amber-300" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: Syarat Dokumen & Upload Simulator */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-red-700 dark:text-amber-400" />
                    <span>{t('Langkah 2: Kelengkapan Berkas & Persyaratan', 'Step 2: Required Documents & File Checklist')}</span>
                  </h3>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
                      {uploadedRequiredCount} / {requiredDocsCount} {t('Dokumen Utama Siap', 'Core Files Ready')}
                    </span>

                    <button
                      onClick={markAllDocsReady}
                      type="button"
                      className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800 transition cursor-pointer"
                      title="Tandai semua berkas siap"
                    >
                      ✓ Tandai Semua Siap
                    </button>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                  {t(
                    'Lampirkan dokumen pendukung di bawah ini. Jika berkas belum lengkap saat ini, Anda tetap dapat mengirimkan pendaftaran dan melengkapinya nanti di Portal Peserta.',
                    'Attach required documents below. If any file is missing now, you can still submit and upload remaining files later in the Portal.'
                  )}
                </p>

                {/* Document checklist items */}
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        doc.uploaded
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700'
                          : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            doc.uploaded
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {doc.uploaded ? <FileCheck className="w-5 h-5" /> : <UploadCloud className="w-5 h-5" />}
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {t(doc.nameKeyId, doc.nameKeyEn)}
                            </span>
                            {doc.required ? (
                              <span className="text-[10px] font-bold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-950/80 px-2 py-0.5 rounded border border-red-200 dark:border-red-900">
                                {t('Wajib', 'Required')}
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">
                                {t('Opsional', 'Optional')}
                              </span>
                            )}
                          </div>
                          {doc.fileName ? (
                            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono flex items-center gap-1.5 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              <span>{doc.fileName}</span>
                              {doc.fileSize && <span className="text-slate-400 text-[10px]">({doc.fileSize})</span>}
                            </p>
                          ) : (
                            <p className="text-[11px] text-slate-400">Format PDF / JPG / PNG (Maks 5 MB)</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <label className="cursor-pointer bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:border-red-600 text-slate-700 dark:text-slate-200 hover:text-red-700 dark:hover:text-amber-300 font-bold text-[11px] px-3.5 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5">
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>{doc.uploaded ? t('Ubah File', 'Change File') : t('Upload File', 'Upload File')}</span>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            className="hidden"
                            onChange={(e) => handleSimulateUpload(doc.id, e)}
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => toggleUploadState(doc.id)}
                          className={`text-[11px] font-bold px-3 py-2 rounded-xl transition cursor-pointer ${
                            doc.uploaded
                              ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300'
                          }`}
                        >
                          {doc.uploaded ? t('Siap', 'Ready') : t('Tandai Siap', 'Mark Ready')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{t('Kembali ke Step 1', 'Back to Step 1')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNextStep2}
                    className="bg-gradient-to-r from-red-800 via-red-700 to-amber-700 hover:from-red-900 hover:to-amber-800 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md flex items-center gap-2 transition cursor-pointer"
                  >
                    <span>{t('Lanjut ke Step 3: Review', 'Next to Step 3: Review')}</span>
                    <ArrowRight className="w-4 h-4 text-amber-300" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Review & Final Submission */}
            {currentStep === 3 && (
              <form onSubmit={handleFinalSubmit} className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{t('Langkah 3: Konfirmasi & Review Pendaftaran', 'Step 3: Confirmation & Registration Review')}</span>
                  </h3>
                </div>

                {/* Review Card */}
                <div className="bg-slate-900 dark:bg-slate-950 text-slate-200 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-lg">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>{t('RINGKASAN DATA PENDAFTAR', 'APPLICANT SUMMARY')}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">LKP & KONSULTAN PENDIDIKAN PROSPECT</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-slate-400">{t('Nama Lengkap:', 'Full Name:')}</p>
                      <p className="font-bold text-white text-sm mt-0.5">{form.fullName}</p>
                    </div>

                    <div>
                      <p className="text-slate-400">{t('Program Dipilih:', 'Selected Program:')}</p>
                      <p className="font-bold text-amber-300 mt-0.5">{getProgramTitle(form.selectedProgram)}</p>
                    </div>

                    <div>
                      <p className="text-slate-400">{t('Kontak Email & WA:', 'Email & WA:')}</p>
                      <p className="font-semibold text-slate-200 mt-0.5">{form.email} • {form.phoneWA}</p>
                    </div>

                    <div>
                      <p className="text-slate-400">{t('NIK & Asal Sekolah:', 'NIK & School:')}</p>
                      <p className="font-semibold text-slate-200 mt-0.5">{form.nik || '-'} ({form.schoolOrigin || 'Sederajat'})</p>
                    </div>

                    <div>
                      <p className="text-slate-400">{t('Domisili & Orang Tua:', 'Residence & Guardian:')}</p>
                      <p className="font-semibold text-slate-200 mt-0.5">{form.cityOrigin} • Wali: {form.parentName || '-'}</p>
                    </div>

                    <div className="sm:col-span-2 pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-slate-400">{t('Status Lampiran Berkas:', 'Document Status:')}</span>
                      <span className="font-bold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-lg border border-emerald-800">
                        {documents.filter((d) => d.uploaded).length} / {documents.length} {t('Berkas Terlampir', 'Files Attached')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Terms Agreement Checkbox */}
                <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 p-4 rounded-2xl space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={form.termsAccepted}
                      onChange={(e) => setForm({ ...form, termsAccepted: e.target.checked })}
                      className="mt-1 rounded text-red-800 focus:ring-red-600 w-4 h-4 cursor-pointer"
                    />
                    <span className="text-xs text-slate-800 dark:text-amber-100 font-medium leading-relaxed">
                      {t(
                        'Saya menyatakan bahwa seluruh data & berkas yang diisikan adalah benar. Saya menyetujui ketentuan pendaftaran LKP & Konsultan Pendidikan Prospect Education Cabang Jember & siap mengikuti tahapan seleksi.',
                        'I declare that all submitted information is correct. I accept Prospect Education Jember policies and am ready for selection.'
                      )}
                    </span>
                  </label>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{t('Kembali ke Step 2', 'Back to Step 2')}</span>
                  </button>

                  <button
                    type="submit"
                    disabled={!form.termsAccepted}
                    className="bg-[#F59E0B] hover:bg-[#d97706] disabled:opacity-50 text-slate-950 font-black text-xs px-7 py-3.5 rounded-xl shadow-xl flex items-center gap-2 transition cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-slate-950" />
                    <span>{t('Kirim Pendaftaran & Dapatkan Portal', 'Submit Registration & Access Portal')}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
