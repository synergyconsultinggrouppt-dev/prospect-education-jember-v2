import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Candidate } from '../../types';
import {
  UserCheck,
  FileText,
  ShieldCheck,
  CreditCard,
  FileCheck,
  BookOpen,
  Globe,
  Plane,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Check,
  Calendar,
  Building2,
  PhoneCall,
} from 'lucide-react';

interface EnrollmentJourneyTrackerProps {
  candidate: Candidate;
  onNavigateTab: (tabKey: 'overview' | 'biodata' | 'documents' | 'payment' | 'loa' | 'lms' | 'chat') => void;
  onOpenPaymentModal: () => void;
}

export interface JourneyStage {
  id: number;
  key: string;
  titleId: string;
  titleEn: string;
  shortDescId: string;
  shortDescEn: string;
  icon: React.ElementType;
  isCompleted: boolean;
  isCurrent: boolean;
  statusBadgeId: string;
  statusBadgeEn: string;
  estimatedTimeId: string;
  estimatedTimeEn: string;
  checklistItems: {
    textId: string;
    textEn: string;
    completed: boolean;
  }[];
  actionLabelId?: string;
  actionLabelEn?: string;
  actionTab?: 'overview' | 'biodata' | 'documents' | 'payment' | 'loa' | 'lms' | 'chat';
  actionFunction?: 'paymentModal';
}

export const EnrollmentJourneyTracker: React.FC<EnrollmentJourneyTrackerProps> = ({
  candidate,
  onNavigateTab,
  onOpenPaymentModal,
}) => {
  const { t } = useApp();

  // Helper logic to compute stage completions based on candidate data
  const hasBiodata = !!candidate.biodata;
  const hasDocs = candidate.documents && candidate.documents.length >= 3;
  const isVerified =
    candidate.status === 'document_verified' ||
    candidate.status === 'payment_pending' ||
    candidate.status === 'payment_verified' ||
    candidate.status === 'superadmin_approved' ||
    candidate.status === 'loa_issued' ||
    candidate.status === 'lms_active' ||
    candidate.status === 'graduated';

  const isPaid = candidate.paymentStatus === 'lunas';
  const hasLoa = candidate.loaIssued || candidate.status === 'loa_issued' || candidate.status === 'lms_active' || candidate.status === 'graduated';
  const lmsActive = candidate.lmsProgressPercent > 0 || candidate.status === 'lms_active';
  const visaProcessing = hasLoa && isPaid;

  const stages: JourneyStage[] = [
    {
      id: 1,
      key: 'registration_biodata',
      titleId: '1. Registrasi & Biodata',
      titleEn: '1. Registration & Profile',
      shortDescId: 'Pengisian data identitas lengkap, NIK, dan sekolah asal',
      shortDescEn: 'Filling complete personal identity, NIK, & school origin',
      icon: UserCheck,
      isCompleted: hasBiodata,
      isCurrent: !hasBiodata,
      statusBadgeId: hasBiodata ? 'Selesai' : 'Perlu Diisi',
      statusBadgeEn: hasBiodata ? 'Completed' : 'Action Needed',
      estimatedTimeId: 'Hari ke-1',
      estimatedTimeEn: 'Day 1',
      checklistItems: [
        { textId: 'Registrasi akun portal Jember', textEn: 'Jember portal account registration', completed: true },
        { textId: 'Pengisian biodata pribadi & orang tua', textEn: 'Personal & parent biodata form', completed:hasBiodata },
        { textId: 'Pemilihan program studi (Taiwan/Jepang)', textEn: 'Program selection (Taiwan/Japan)', completed: true },
      ],
      actionLabelId: hasBiodata ? 'Lihat Biodata' : 'Isi Biodata Sekarang',
      actionLabelEn: hasBiodata ? 'View Profile' : 'Fill Profile Now',
      actionTab: 'biodata',
    },
    {
      id: 2,
      key: 'document_submission',
      titleId: '2. Upload Dokumen Berkas',
      titleEn: '2. Document Submission',
      shortDescId: 'Unggah scan KTP, KK, Ijazah/Transkrip, dan pasfoto formal',
      shortDescEn: 'Upload ID card, Family Card, Diploma/Transcript, & Photo',
      icon: FileText,
      isCompleted: hasDocs,
      isCurrent: hasBiodata && !hasDocs,
      statusBadgeId: hasDocs ? 'Lengkap' : hasBiodata ? 'Dalam Proses' : 'Menunggu',
      statusBadgeEn: hasDocs ? 'Complete' : hasBiodata ? 'In Progress' : 'Pending',
      estimatedTimeId: '1 - 3 Hari',
      estimatedTimeEn: '1 - 3 Days',
      checklistItems: [
        { textId: 'Upload Scan KTP / Kartu Pelajar', textEn: 'Upload ID Card scan', completed: candidate.documents.some((d) => d.docType === 'ktp') },
        { textId: 'Upload Scan Kartu Keluarga (KK)', textEn: 'Upload Family Card scan', completed: candidate.documents.some((d) => d.docType === 'kk') },
        { textId: 'Upload Ijazah / SKL / Transkrip Nilai', textEn: 'Upload Diploma / Transcript scan', completed: candidate.documents.some((d) => d.docType === 'ijazah' || d.docType === 'transkrip') },
        { textId: 'Upload Pasfoto Formal 3x4 (Background Putih)', textEn: 'Upload 3x4 Formal Photo', completed: candidate.documents.some((d) => d.docType === 'pasfoto') },
      ],
      actionLabelId: 'Kelola & Upload Berkas',
      actionLabelEn: 'Manage & Upload Files',
      actionTab: 'documents',
    },
    {
      id: 3,
      key: 'admin_verification',
      titleId: '3. Verifikasi Tim Jember',
      titleEn: '3. Verification & Interview',
      shortDescId: 'Pemeriksaan keabsahan dokumen oleh admin & asesmen kualifikasi',
      shortDescEn: 'Document authenticity review by admin & placement assessment',
      icon: ShieldCheck,
      isCompleted: isVerified,
      isCurrent: hasDocs && !isVerified,
      statusBadgeId: isVerified ? 'Terverifikasi' : hasDocs ? 'Progres Review' : 'Menunggu Berkas',
      statusBadgeEn: isVerified ? 'Verified' : hasDocs ? 'Under Review' : 'Awaiting Docs',
      estimatedTimeId: '1 - 2 Hari Kerja',
      estimatedTimeEn: '1 - 2 Business Days',
      checklistItems: [
        { textId: 'Pemeriksaan keabsahan dokumen fisik/digital', textEn: 'Physical & digital authenticity check', completed: isVerified },
        { textId: 'Verifikasi kesesuaian nilai & kualifikasi program', textEn: 'Grade & program qualification check', completed: isVerified },
        { textId: 'Wawancara kesiapan studi/kerja (Online/Offline)', textEn: 'Readiness interview (Online/Offline)', completed: isVerified },
      ],
      actionLabelId: 'Chat Admin Verifikasi',
      actionLabelEn: 'Chat Verification Admin',
      actionTab: 'chat',
    },
    {
      id: 4,
      key: 'payment_loa',
      titleId: '4. Pembayaran & Penerbitan LoA',
      titleEn: '4. Payment & LoA Issuance',
      shortDescId: 'Pembayaran DP pendaftaran & penerbitan Surat Penerimaan Resmi',
      shortDescEn: 'DP registration payment & official Acceptance Letter issuance',
      icon: CreditCard,
      isCompleted: isPaid && hasLoa,
      isCurrent: isVerified && (!isPaid || !hasLoa),
      statusBadgeId: isPaid && hasLoa ? 'LoA Terbit' : isPaid ? 'Verifikasi DP' : 'Menunggu DP',
      statusBadgeEn: isPaid && hasLoa ? 'LoA Issued' : isPaid ? 'DP Verified' : 'DP Pending',
      estimatedTimeId: '1 - 3 Hari',
      estimatedTimeEn: '1 - 3 Days',
      checklistItems: [
        { textId: 'Pembayaran DP registrasi via Midtrans QRIS/VA', textEn: 'Registration DP via Midtrans QRIS/VA', completed: isPaid },
        { textId: 'Persetujuan SuperAdmin Pusat Prospect', textEn: 'Prospect Head Office approval', completed: candidate.status === 'superadmin_approved' || hasLoa },
        { textId: 'Penerbitan Surat Penerimaan Resmi (LoA)', textEn: 'Official Acceptance Letter (LoA) issuance', completed: hasLoa },
      ],
      actionLabelId: hasLoa ? 'Buka Surat Penerimaan (LoA)' : 'Bayar DP Registrasi',
      actionLabelEn: hasLoa ? 'View Acceptance Letter (LoA)' : 'Pay Registration DP',
      actionTab: hasLoa ? 'loa' : undefined,
      actionFunction: hasLoa ? undefined : 'paymentModal',
    },
    {
      id: 5,
      key: 'lms_language_training',
      titleId: '5. Pelatihan Bahasa & LMS',
      titleEn: '5. Language Training & LMS',
      shortDescId: 'Kursus Mandarin/Jepang di LPK Balung Jember & modul LMS',
      shortDescEn: 'Mandarin/Japanese course at LPK Jember & LMS online modules',
      icon: BookOpen,
      isCompleted: candidate.lmsProgressPercent >= 80,
      isCurrent: hasLoa && candidate.lmsProgressPercent < 80,
      statusBadgeId: candidate.lmsProgressPercent >= 80 ? 'Lulus Kursus' : lmsActive ? 'Aktif Belajar' : 'Siap Mulai',
      statusBadgeEn: candidate.lmsProgressPercent >= 80 ? 'Course Passed' : lmsActive ? 'Active Learning' : 'Ready to Start',
      estimatedTimeId: '1 - 3 Bulan',
      estimatedTimeEn: '1 - 3 Months',
      checklistItems: [
        { textId: 'Pelatihan tatap muka/online Bahasa Mandarin & Jepang', textEn: 'In-person / online language training', completed: lmsActive },
        { textId: 'Pengerjaan kuis & modul LMS Prospect Jember', textEn: 'LMS Prospect Jember quizzes & modules', completed: candidate.lmsProgressPercent > 20 },
        { textId: 'Ujian Sertifikasi (TOCFL Taiwan / JLPT-JFT Jepang)', textEn: 'Certification exam (TOCFL / JLPT-JFT)', completed: candidate.lmsProgressPercent >= 80 },
      ],
      actionLabelId: 'Buka LMS Pembelajaran',
      actionLabelEn: 'Open LMS Learning',
      actionTab: 'lms',
    },
    {
      id: 6,
      key: 'visa_passport_process',
      titleId: '6. Pengurusan Visa & Paspor',
      titleEn: '6. Visa & Student Passport',
      shortDescId: 'Penerbitan Surat Pengantar Paspor, Legalisir TIPO/COE, & Visa',
      shortDescEn: 'Passport cover letter, TIPO/COE legalization, & Student Visa',
      icon: Globe,
      isCompleted: candidate.status === 'graduated',
      isCurrent: visaProcessing && candidate.status !== 'graduated',
      statusBadgeId: candidate.status === 'graduated' ? 'Visa Disetujui' : visaProcessing ? 'Proses Kedutaan' : 'Menunggu Syarat',
      statusBadgeEn: candidate.status === 'graduated' ? 'Visa Approved' : visaProcessing ? 'Embassy Process' : 'Awaiting Req',
      estimatedTimeId: '2 - 4 Minggu',
      estimatedTimeEn: '2 - 4 Weeks',
      checklistItems: [
        { textId: 'Pengurusan rekomendasi paspor dari Cabang Jember', textEn: 'Jember Branch passport recommendation letter', completed: visaProcessing },
        { textId: 'Penerbitan COE Jepang / Dokumen Visa Taiwan', textEn: 'Japan COE / Taiwan Student Visa documents', completed: visaProcessing },
        { textId: 'Legalisir dokumen di TETO / Kedutaan Jepang', textEn: 'Document legalization at TETO / Japan Embassy', completed: candidate.status === 'graduated' },
        { textId: 'Medical Checkup (MCU) rumah sakit rujukan', textEn: 'Medical Checkup at referral hospital', completed: visaProcessing },
      ],
      actionLabelId: 'Konsultasi Tim Visa Jember',
      actionLabelEn: 'Consult Jember Visa Team',
      actionTab: 'chat',
    },
    {
      id: 7,
      key: 'departure_placement',
      titleId: '7. Keberangkatan & Penempatan',
      titleEn: '7. Departure & Placement',
      shortDescId: 'Pembekalan final, penerbangan kelompok, & orientasi di kampus/perusahaan',
      shortDescEn: 'Final briefing, group flight, & university/company orientation',
      icon: Plane,
      isCompleted: candidate.status === 'graduated',
      isCurrent: false,
      statusBadgeId: candidate.status === 'graduated' ? 'Terbang & Resmi Study' : 'Jadwal Siap',
      statusBadgeEn: candidate.status === 'graduated' ? 'Enrolled Abroad' : 'Flight Pending',
      estimatedTimeId: 'Sesuai Intakes',
      estimatedTimeEn: 'Per Intake Date',
      checklistItems: [
        { textId: 'Pembekalan pra-keberangkatan di Kantor Jember', textEn: 'Pre-departure orientation at Jember Office', completed: candidate.status === 'graduated' },
        { textId: 'Tiket pesawat & grup pelepasan di bandara', textEn: 'Flight tickets & airport departure group', completed: candidate.status === 'graduated' },
        { textId: 'Penjemputan & orientasi tempat tinggal di Taiwan/Jepang', textEn: 'Airport pickup & dormitory check-in abroad', completed: candidate.status === 'graduated' },
      ],
      actionLabelId: 'Lihat Galeri Keberangkatan',
      actionLabelEn: 'View Departure Gallery',
      actionTab: 'overview',
    },
  ];

  // Selected stage for detail view
  const currentActiveStageIdx = stages.findIndex((s) => s.isCurrent) !== -1
    ? stages.findIndex((s) => s.isCurrent)
    : stages.findIndex((s) => !s.isCompleted) !== -1
    ? stages.findIndex((s) => !s.isCompleted)
    : 6;

  const [selectedStageIdx, setSelectedStageIdx] = useState<number>(currentActiveStageIdx);

  const completedStagesCount = stages.filter((s) => s.isCompleted).length;
  const progressPercent = Math.round((completedStagesCount / stages.length) * 100);

  const activeStage = stages[selectedStageIdx] || stages[0];

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
      {/* Header with overall percentage progress bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-[#0F3D7A] px-3 py-1 rounded-full text-[11px] font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{t('ALUR PROGRES PENDAFTARAN & KEBERANGKATAN', 'ENROLLMENT & DEPARTURE TRACKER')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
            {t('Peta Perjalanan Calon Peserta Jember', 'Your Student Journey Progress Map')}
          </h2>
          <p className="text-xs text-slate-600">
            {t(
              'Pantau setiap tahap dari upload berkas, verifikasi admin, pendaftaran visa, hingga siap terbang ke Taiwan / Jepang.',
              'Track every step from file upload, admin clearance, visa application, to final international flight.'
            )}
          </p>
        </div>

        {/* Overall Progress Indicator Badge */}
        <div className="bg-slate-900 text-white p-4 rounded-2xl border border-amber-500/30 flex items-center gap-4 shrink-0 shadow-sm">
          <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
            <svg className="w-14 h-14 transform -rotate-90">
              <circle cx="28" cy="28" r="22" stroke="currentColor" strokeWidth="4" className="text-slate-800" fill="transparent" />
              <circle
                cx="28"
                cy="28"
                r="22"
                stroke="currentColor"
                strokeWidth="4"
                className="text-amber-400 transition-all duration-700"
                fill="transparent"
                strokeDasharray={138}
                strokeDashoffset={138 - (138 * progressPercent) / 100}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute font-mono font-bold text-xs text-amber-300">{progressPercent}%</span>
          </div>

          <div className="text-xs space-y-0.5">
            <span className="text-slate-400 font-medium block">
              {t('Status Total:', 'Total Status:')}
            </span>
            <span className="text-sm font-bold text-white block">
              {completedStagesCount} / {stages.length} {t('Tahap Selesai', 'Stages Completed')}
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold block">
              {progressPercent === 100
                ? t('Siap Diberangkatkan!', 'Ready for Departure!')
                : t('Progres Berjalan Aktif', 'Active Processing')}
            </span>
          </div>
        </div>
      </div>

      {/* Stepper Pipeline (Horizontal Swipeable Track & Clean Responsive Flow) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            {t('Tahapan Alur Pendaftaran (Pilih Tahap):', 'Enrollment Journey Pipeline:')}
          </span>
          <span className="text-[11px] text-slate-500">
            {t('Tahap Sedang Berjalan:', 'Current Active:')}{' '}
            <span className="font-bold text-[#0F3D7A] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
              #{currentActiveStageIdx + 1} {stages[currentActiveStageIdx]?.titleId}
            </span>
          </span>
        </div>

        {/* Horizontal scrollable stepper track on mobile, responsive grid on desktop */}
        <div className="flex sm:grid sm:grid-cols-4 lg:grid-cols-7 gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-thin scrollbar-thumb-slate-300">
          {stages.map((stg, idx) => {
            const IconComp = stg.icon;
            const isSelected = selectedStageIdx === idx;

            return (
              <button
                key={stg.key}
                type="button"
                onClick={() => setSelectedStageIdx(idx)}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all duration-150 focus:outline-none shrink-0 w-[145px] sm:w-auto min-h-[96px] cursor-pointer ${
                  isSelected
                    ? 'bg-[#0F3D7A] text-white border-amber-400 shadow-md ring-2 ring-blue-400/50'
                    : stg.isCompleted
                    ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950 hover:bg-emerald-100'
                    : stg.isCurrent
                    ? 'bg-blue-50/90 border-blue-300 text-blue-950 hover:bg-blue-100'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {/* Status Icon & Step Number */}
                <div className="flex items-center justify-between mb-1.5 w-full">
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950'
                        : stg.isCompleted
                        ? 'bg-emerald-600 text-white'
                        : stg.isCurrent
                        ? 'bg-[#0F3D7A] text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {stg.isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : `#${idx + 1}`}
                  </span>

                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : stg.isCompleted
                        ? 'bg-emerald-200 text-emerald-900'
                        : stg.isCurrent
                        ? 'bg-blue-200 text-blue-900'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {t(stg.statusBadgeId, stg.statusBadgeEn)}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h4
                    className={`text-xs font-bold line-clamp-2 leading-snug ${
                      isSelected ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {t(stg.titleId, stg.titleEn)}
                  </h4>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Expanded Active Stage Detail Card - Clean, High Contrast, Readable */}
      <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 overflow-hidden shadow-lg space-y-0 animate-in fade-in duration-150">
        {/* Header bar */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-[#0F3D7A]/80 to-slate-900 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 font-bold flex items-center justify-center shrink-0 shadow-md">
              <activeStage.icon className="w-5 h-5 text-slate-950" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-white font-serif">
                  {t(activeStage.titleId, activeStage.titleEn)}
                </h3>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${
                    activeStage.isCompleted
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                      : activeStage.isCurrent
                      ? 'bg-amber-950/80 border-amber-400 text-amber-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  {t(activeStage.statusBadgeId, activeStage.statusBadgeEn)}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                {t(activeStage.shortDescId, activeStage.shortDescEn)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto text-xs bg-slate-950/90 px-3 py-1.5 rounded-xl border border-slate-700/60 text-slate-300 shrink-0">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {t('Estimasi Waktu:', 'Estimated Time:')}{' '}
              <strong className="text-white font-mono">{t(activeStage.estimatedTimeId, activeStage.estimatedTimeEn)}</strong>
            </span>
          </div>
        </div>

        {/* Checklist Section */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{t('Daftar Periksa & Dokumen Tahap Ini:', 'Stage Requirements Checklist:')}</span>
            </h4>
            <span className="text-[11px] text-slate-400">
              {activeStage.checklistItems.filter(i => i.completed).length} / {activeStage.checklistItems.length} Selesai
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {activeStage.checklistItems.map((item, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                  item.completed
                    ? 'bg-emerald-950/30 border-emerald-700/60 text-emerald-100'
                    : 'bg-slate-800/60 border-slate-700/70 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      item.completed ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {item.completed ? <Check className="w-3 h-3 stroke-[3]" /> : <Clock className="w-3 h-3" />}
                  </span>
                  <span className="text-xs font-medium leading-snug line-clamp-2">{t(item.textId, item.textEn)}</span>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase shrink-0 whitespace-nowrap ${
                    item.completed
                      ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-600/50'
                      : 'bg-slate-700/80 text-slate-300 border border-slate-600'
                  }`}
                >
                  {item.completed ? t('Selesai', 'Done') : t('Belum', 'Pending')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button Footer */}
        <div className="p-4 sm:p-5 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400 text-center sm:text-left">
            {t(
              'Butuh bantuan pengurusan dokumen atau konsultasi visa? Hubungi Admin Jember.',
              'Need assistance with documents or visa consultation? Contact Jember Office.'
            )}
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {activeStage.actionLabelId && (
              <button
                type="button"
                onClick={() => {
                  if (activeStage.actionFunction === 'paymentModal') {
                    onOpenPaymentModal();
                  } else if (activeStage.actionTab) {
                    onNavigateTab(activeStage.actionTab);
                  }
                }}
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer border border-amber-300"
              >
                <span>{t(activeStage.actionLabelId, activeStage.actionLabelEn || '')}</span>
                <ChevronRight className="w-4 h-4 text-slate-950" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
