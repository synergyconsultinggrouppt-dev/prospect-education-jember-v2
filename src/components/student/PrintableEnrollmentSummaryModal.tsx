import React, { useState } from 'react';
import { Candidate } from '../../types';
import { useApp } from '../../context/AppContext';
import { downloadStudentProfilePDF } from '../../utils/pdfGenerator';
import {
  Printer,
  X,
  ShieldCheck,
  FileCheck2,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  User,
  GraduationCap,
  Building2,
  Calendar,
  CreditCard,
  Award,
  Phone,
  Mail,
  MapPin,
  Download,
} from 'lucide-react';

interface PhysicalDocItem {
  id: string;
  category: string;
  titleId: string;
  titleEn: string;
  required: boolean;
  status: 'ready' | 'in_progress' | 'pending';
  userNote?: string;
}

const getPhysicalDocsForCandidate = (program?: string): PhysicalDocItem[] => {
  const isTaiwan = program?.startsWith('taiwan');
  if (isTaiwan) {
    return [
      { id: 'phys-ktp', category: 'Identitas', titleId: 'Fotokopi KTP Peserta & Orang Tua (3 Lembar)', titleEn: 'Copy of Student & Parents ID Card', required: true, status: 'pending' },
      { id: 'phys-kk', category: 'Identitas', titleId: 'Kartu Keluarga (KK) Asli & Fotokopi (3 Lembar)', titleEn: 'Original Family Card & 3 Copies', required: true, status: 'pending' },
      { id: 'phys-akta', category: 'Identitas', titleId: 'Akta Kelahiran Asli & Legalisir (2 Lembar)', titleEn: 'Original Birth Certificate & Legalized Copies', required: true, status: 'pending' },
      { id: 'phys-ijazah', category: 'Akademik', titleId: 'Ijazah / SKL SMA/SMK/S1 Asli & Legalisir (Syarat Beasiswa Taiwan)', titleEn: 'Original High School / S1 Diploma & Copies for Taiwan Scholarship', required: true, status: 'pending' },
      { id: 'phys-transkrip', category: 'Akademik', titleId: 'Transkrip Nilai / Rapor Semester 1-5 Legalisir', titleEn: 'Legalized Transcripts (Sem 1-5)', required: true, status: 'pending' },
      { id: 'phys-tocfl', category: 'Akademik', titleId: 'Sertifikat Bahasa Mandarin TOCFL A1-B2 / Surat Ket. Kursus', titleEn: 'TOCFL Chinese Proficiency Certificate (If available)', required: false, status: 'pending' },
      { id: 'phys-skck', category: 'Legal & Kesehatan', titleId: 'SKCK Polda / Polres Aktif (Tujuan Visa Pelajar Taiwan)', titleEn: 'Police Clearance (SKCK Taiwan Student Visa)', required: true, status: 'pending' },
      { id: 'phys-mcu', category: 'Legal & Kesehatan', titleId: 'Form Hasil Medical Check-Up (MCU) Fit RS Rujukan TETO Taiwan', titleEn: 'MCU Results TETO Taiwan Rujukan RS', required: true, status: 'pending' },
      { id: 'phys-foto34', category: 'Foto & Admin', titleId: 'Pasfoto Berwarna 3x4 Background Putih (6 Lembar)', titleEn: '3x4 Formal Photo White Background (6 Copies)', required: true, status: 'pending' },
      { id: 'phys-foto46', category: 'Foto & Admin', titleId: 'Pasfoto Berwarna 4x6 Background Putih (6 Lembar)', titleEn: '4x6 Formal Photo White Background (6 Copies)', required: true, status: 'pending' },
    ];
  }
  return [
    { id: 'phys-ktp', category: 'Identitas', titleId: 'Fotokopi KTP Peserta & Orang Tua (3 Lembar)', titleEn: 'Copy of Student & Parents ID Card', required: true, status: 'pending' },
    { id: 'phys-kk', category: 'Identitas', titleId: 'Kartu Keluarga (KK) Asli & Fotokopi (3 Lembar)', titleEn: 'Original Family Card & 3 Copies', required: true, status: 'pending' },
    { id: 'phys-akta', category: 'Identitas', titleId: 'Akta Kelahiran Asli & Legalisir (2 Lembar)', titleEn: 'Original Birth Certificate & Legalized Copies', required: true, status: 'pending' },
    { id: 'phys-ijazah', category: 'Akademik', titleId: 'Ijazah / SKL SMA/SMK Asli & Legalisir (Syarat Magang IM Japan / SSW)', titleEn: 'Original High School Diploma & Copies for Japan Internship', required: true, status: 'pending' },
    { id: 'phys-transkrip', category: 'Akademik', titleId: 'Transkrip Nilai / Rapor Semester 1-5 Legalisir', titleEn: 'Legalized Transcripts (Sem 1-5)', required: true, status: 'pending' },
    { id: 'phys-jlpt', category: 'Akademik', titleId: 'Sertifikat Bahasa Jepang JLPT N5-N3 / JFT-Basic / Ujian SSW', titleEn: 'Japanese Language Certificate JLPT/JFT/SSW', required: false, status: 'pending' },
    { id: 'phys-skck', category: 'Legal & Kesehatan', titleId: 'SKCK Polda / Polres Aktif (Tujuan Pemagangan Kemnaker & Jepang)', titleEn: 'Police Clearance (SKCK Overseas Japan)', required: true, status: 'pending' },
    { id: 'phys-mcu', category: 'Legal & Kesehatan', titleId: 'Hasil Medical Check-Up (MCU Fit Standar Imigrasi Jepang & OTIT)', titleEn: 'MCU Fit Japan Immigration & OTIT Standard', required: true, status: 'pending' },
    { id: 'phys-foto34', category: 'Foto & Admin', titleId: 'Pasfoto Berwarna Standar Kemnaker 3x4 (6 Lembar)', titleEn: '3x4 Formal Photo White Background (6 Copies)', required: true, status: 'pending' },
    { id: 'phys-foto46', category: 'Foto & Admin', titleId: 'Pasfoto Berwarna Standar Kemnaker 4x6 (6 Lembar)', titleEn: '4x6 Formal Photo White Background (6 Copies)', required: true, status: 'pending' },
  ];
};

interface Props {
  candidate: Candidate;
  onClose: () => void;
}

export const PrintableEnrollmentSummaryModal: React.FC<Props> = ({ candidate, onClose }) => {
  const { t, websiteSettings } = useApp();

  // Dynamic LKP institution settings
  const siteName = websiteSettings?.siteName || 'Prospect Education Cabang Jember';
  const officeAddress =
    websiteSettings?.officeAddress ||
    'Jl. Balung-Jenggawah, Wetan Kali, Balung Lor, Kec. Balung, Kabupaten Jember, Jawa Timur 68161';
  const csPhoneWhatsApp = websiteSettings?.csPhoneWhatsApp || '082334554396';
  const contactEmail = websiteSettings?.contactEmail || 'info@prospect-jember.id';
  const officialSignatoryName = websiteSettings?.officialSignatoryName || 'Rohim Egy, S.Pd.';
  const officialSignatoryTitle =
    websiteSettings?.officialSignatoryTitle || 'Kepala Cabang Prospect Education Jember';

  const defaultDocs = getPhysicalDocsForCandidate(candidate.selectedProgram);

  const [checklistItems] = useState<PhysicalDocItem[]>(() => {
    const storageKey = `prospect_doc_checklist_${candidate.id}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultDocs;
      }
    }
    return defaultDocs;
  });

  const handlePrint = () => {
    window.print();
  };

  const currentDateStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const readyCount = checklistItems.filter((i) => i.status === 'ready').length;

  // Formatting candidate input biodata
  const candidateNik = candidate.biodata?.nik || candidate.nik || '-';
  const candidatePhone = candidate.biodata?.phoneWA || candidate.phoneWA || candidate.phone || '-';
  const candidateEmail = candidate.biodata?.email || candidate.email || '-';
  const candidateTtl = candidate.biodata?.birthPlace && candidate.biodata?.birthDate
    ? `${candidate.biodata.birthPlace}, ${candidate.biodata.birthDate}`
    : '-';
  const candidateGender = candidate.biodata?.gender || '-';
  const candidateReligion = candidate.biodata?.religion || '-';
  const candidateEdu = candidate.biodata?.education
    ? `${candidate.biodata.education} ${candidate.biodata.major ? ' - ' + candidate.biodata.major : ''}`
    : '-';
  const candidateFullAddress = candidate.biodata?.address
    ? `${candidate.biodata.address}${candidate.biodata.district ? ', Kec. ' + candidate.biodata.district : ''}${candidate.biodata.regency ? ', ' + candidate.biodata.regency : ''}`
    : (candidate.city || 'Jember');
  const candidateParent = candidate.biodata?.parentName
    ? `${candidate.biodata.parentName} (${candidate.biodata.parentJob || 'Orang Tua/Wali'}) - HP: ${candidate.biodata.parentPhone || '-'}`
    : '-';

  const getProgramTitle = () => {
    switch (candidate.selectedProgram) {
      case 'taiwan_ifp':
        return 'Program Taiwan IFP 1+4 (S1 Beasiswa Subsidized)';
      case 'taiwan_4_1':
        return 'Program Taiwan 4+1 (4 Thn S1 + 1 Thn S2)';
      case 'japan_im':
        return 'Program Magang Kerja Jepang IM Japan (Kemnaker RI)';
      case 'japan_ssw':
        return 'Program Kerja Jepang Tokutei Ginou (SSW)';
      default:
        return 'Program Pembekalan & Orientasi Prospect Education';
    }
  };

  const latestPayment = candidate.payments && candidate.payments.length > 0 ? candidate.payments[0] : null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
    >
      {/* Modal Card */}
      <div className="bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] my-auto flex flex-col overflow-hidden printable-content">
        {/* Top Control Bar (Hidden on Print) */}
        <div className="print:hidden bg-slate-900 text-white p-4 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-800 text-amber-300 rounded-xl">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">
                Pratinjau Cetak Berkas & Checklist Peserta
              </h3>
              <p className="text-[11px] text-slate-400">
                Dokumen resmi siap cetak / PDF dengan data input peserta & profil lembaga.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => downloadStudentProfilePDF(candidate)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-2.5 rounded-xl transition shadow-md flex items-center gap-1.5 cursor-pointer border border-amber-300"
              title="Unduh dokumen profil lengkap peserta sebagai file PDF A4 Rapi"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>Unduh PDF Profil (A4)</span>
            </button>

            <button
              onClick={() => {
                const summaryTxt = `${siteName.toUpperCase()}\nALAMAT: ${officeAddress}\nTELEPON: ${csPhoneWhatsApp} | EMAIL: ${contactEmail}\n========================================\nRINGKASAN REGISTRASI & CHECKLIST DOKUMEN FISIK\n========================================\nNomor Pendaftaran: ${candidate.registrationNumber}\nNama Lengkap: ${candidate.fullName}\nNIK: ${candidateNik}\nProgram: ${getProgramTitle()}\nNo. HP/WA: ${candidatePhone}\nAlamat: ${candidateFullAddress}\nTanggal Daftar: ${candidate.registrationDate || candidate.registeredAt || currentDateStr}\n========================================\nDokumen Siap: ${readyCount} dari ${checklistItems.length} berkas`;
                const blob = new Blob([summaryTxt], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `Checklist_Berkas_${candidate.fullName.replace(/\s+/g, '_')}.txt`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }}
              className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs px-3 py-2.5 rounded-xl transition shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-emerald-200" />
              <span>Unduh Ringkasan TXT</span>
            </button>

            <button
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>Cetak Browser</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Container */}
        <div className="p-6 sm:p-10 overflow-y-auto font-sans print:p-0 print:overflow-visible text-slate-900 space-y-6">
          {/* Print Header / Kop Surat Resmi */}
          <div className="border-b-4 border-double border-red-900 pb-4 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xl sm:text-2xl font-black text-red-900 font-serif tracking-tight uppercase">
                {siteName}
              </div>
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Lembaga Pelatihan Kerja (LPK) & Konsultan Pendidikan Luar Negeri
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {officeAddress}
                <br />
                Hotline / WA: <strong className="text-slate-900">{csPhoneWhatsApp}</strong> | Email: <strong className="text-slate-900">{contactEmail}</strong> | Website: <strong className="text-slate-900">prospect-jember.id</strong>
              </p>
            </div>

            <div className="text-right shrink-0">
              <div className="inline-block bg-red-900 text-amber-300 font-black text-[10px] px-3 py-1 rounded-lg uppercase tracking-wider">
                FORMULIR REGISTRASI FISIK
              </div>
              <p className="text-[11px] text-slate-500 font-mono pt-1">
                Dicetak: {currentDateStr}
              </p>
            </div>
          </div>

          {/* Document Title Banner */}
          <div className="bg-slate-50 border-l-4 border-red-900 p-3.5 rounded-r-2xl space-y-0.5">
            <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wide">
              LEMBAR BUKTI PENDAFTARAN & CHECKLIST DOKUMEN FISIK PESERTA
            </h2>
            <p className="text-xs text-slate-600">
              Dokumen resmi lampiran pendaftaran calon peserta di {siteName}.
            </p>
          </div>

          {/* Candidate Profile Details Grid */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-red-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <User className="w-4 h-4 text-red-800" />
              <span>I. BIODATA & DATA REGISTRASI PESERTA</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs pt-1">
              <div className="flex border-b border-slate-100 pb-1">
                <span className="w-40 font-semibold text-slate-500 shrink-0">Nama Lengkap:</span>
                <span className="font-bold text-slate-900 uppercase">{candidate.fullName}</span>
              </div>

              <div className="flex border-b border-slate-100 pb-1">
                <span className="w-40 font-semibold text-slate-500 shrink-0">Nomor Registrasi:</span>
                <span className="font-mono font-bold text-red-900">{candidate.registrationNumber}</span>
              </div>

              <div className="flex border-b border-slate-100 pb-1">
                <span className="w-40 font-semibold text-slate-500 shrink-0">NIK KTP:</span>
                <span className="font-mono font-bold text-slate-900">{candidateNik}</span>
              </div>

              <div className="flex border-b border-slate-100 pb-1">
                <span className="w-40 font-semibold text-slate-500 shrink-0">Program Pilihan:</span>
                <span className="font-bold text-slate-900 text-red-900">
                  {getProgramTitle()}
                </span>
              </div>

              <div className="flex border-b border-slate-100 pb-1">
                <span className="w-40 font-semibold text-slate-500 shrink-0">Tempat, Tanggal Lahir:</span>
                <span className="font-bold text-slate-900">{candidateTtl}</span>
              </div>

              <div className="flex border-b border-slate-100 pb-1">
                <span className="w-40 font-semibold text-slate-500 shrink-0">Jenis Kelamin / Agama:</span>
                <span className="font-bold text-slate-900">{candidateGender} / {candidateReligion}</span>
              </div>

              <div className="flex border-b border-slate-100 pb-1">
                <span className="w-40 font-semibold text-slate-500 shrink-0">Pendidikan Terakhir:</span>
                <span className="font-bold text-slate-900">{candidateEdu}</span>
              </div>

              <div className="flex border-b border-slate-100 pb-1">
                <span className="w-40 font-semibold text-slate-500 shrink-0">No. Telepon / WhatsApp:</span>
                <span className="font-mono font-bold text-slate-900">{candidatePhone}</span>
              </div>

              <div className="flex border-b border-slate-100 pb-1">
                <span className="w-40 font-semibold text-slate-500 shrink-0">Email Peserta:</span>
                <span className="font-mono font-bold text-slate-900">{candidateEmail}</span>
              </div>

              <div className="flex border-b border-slate-100 pb-1">
                <span className="w-40 font-semibold text-slate-500 shrink-0">Alamat Lengkap:</span>
                <span className="font-bold text-slate-900">{candidateFullAddress}</span>
              </div>

              <div className="flex border-b border-slate-100 pb-1 md:col-span-2">
                <span className="w-40 font-semibold text-slate-500 shrink-0">Data Orang Tua / Wali:</span>
                <span className="font-bold text-slate-900">{candidateParent}</span>
              </div>

              <div className="flex border-b border-slate-100 pb-1">
                <span className="w-40 font-semibold text-slate-500 shrink-0">Tanggal Daftar:</span>
                <span className="font-bold text-slate-900">{candidate.registrationDate || candidate.registeredAt || currentDateStr}</span>
              </div>

              <div className="flex border-b border-slate-100 pb-1">
                <span className="w-40 font-semibold text-slate-500 shrink-0">Status Verifikasi Berkas:</span>
                <span
                  className={`font-bold uppercase ${
                    candidate.status === 'verified' || candidate.status === 'document_verified' || candidate.status === 'superadmin_approved'
                      ? 'text-emerald-700'
                      : candidate.status === 'action_needed' || candidate.status === 'revision_requested'
                      ? 'text-red-700'
                      : 'text-amber-700'
                  }`}
                >
                  {candidate.status === 'verified' || candidate.status === 'document_verified' || candidate.status === 'superadmin_approved'
                    ? '✓ TERVERIFIKASI ADMIN'
                    : candidate.status === 'action_needed' || candidate.status === 'revision_requested'
                    ? '⚠️ PERLU REVISI BERKAS'
                    : '⏳ DALAM PROSES VERIFIKASI'}
                </span>
              </div>
            </div>
          </div>

          {/* Enrollment Progress Journey Breakdown */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-red-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <GraduationCap className="w-4 h-4 text-red-800" />
              <span>II. STATUS PROSES TAHAPAN PENDAFTARAN & PEMBAYARAN</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">1. Form Biodata</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Terisi Lengkap
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">2. Uang Muka (DP)</span>
                <span
                  className={`font-bold flex items-center gap-1 ${
                    latestPayment?.paymentStatus === 'verified' || latestPayment?.paymentStatus === 'paid'
                      ? 'text-emerald-700'
                      : 'text-amber-700'
                  }`}
                >
                  {latestPayment?.paymentStatus === 'verified' || latestPayment?.paymentStatus === 'paid' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Lunas (Rp {(latestPayment.amount || 3000000).toLocaleString('id-ID')})
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5 text-amber-600" /> Dalam Proses / Pending
                    </>
                  )}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">3. Surat Acceptance / LoA</span>
                <span
                  className={`font-bold flex items-center gap-1 ${
                    candidate.loaIssued ? 'text-emerald-700' : 'text-slate-500'
                  }`}
                >
                  {candidate.loaIssued ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Penerbitan Resmi
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> Menunggu Verifikasi
                    </>
                  )}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">4. Map Folder Fisik</span>
                <span className="font-bold text-slate-900 font-mono">
                  {readyCount} / {checklistItems.length} Dokumen Ready
                </span>
              </div>
            </div>
          </div>

          {/* Physical Document Checklist Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1">
              <h3 className="text-xs font-bold text-red-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-red-800" />
                <span>III. CHECKLIST KELENGKAPAN BERKAS FISIK PESERTA</span>
              </h3>
              <span className="text-[10px] text-slate-600 font-mono font-bold">
                Kesiapan Map: {Math.round((readyCount / checklistItems.length) * 100)}%
              </span>
            </div>

            <table className="w-full text-left text-xs border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-900 text-white font-bold text-[11px]">
                  <th className="p-2 border border-slate-300 w-8 text-center">No</th>
                  <th className="p-2 border border-slate-300">Nama Dokumen Persyaratan Fisik</th>
                  <th className="p-2 border border-slate-300 w-24">Kategori</th>
                  <th className="p-2 border border-slate-300 w-20 text-center">Sifat</th>
                  <th className="p-2 border border-slate-300 w-32 text-center">Status Kelengkapan</th>
                  <th className="p-2 border border-slate-300">Catatan Peserta / Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {checklistItems.map((item, index) => (
                  <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="p-2 border border-slate-300 text-center font-mono">{index + 1}</td>
                    <td className="p-2 border border-slate-300 font-semibold text-slate-900">
                      {item.titleId}
                    </td>
                    <td className="p-2 border border-slate-300 text-slate-600 font-medium">
                      {item.category}
                    </td>
                    <td className="p-2 border border-slate-300 text-center">
                      {item.required ? (
                        <span className="font-bold text-red-700">Wajib</span>
                      ) : (
                        <span className="text-slate-500">Opsional</span>
                      )}
                    </td>
                    <td className="p-2 border border-slate-300 text-center font-bold">
                      {item.status === 'ready' ? (
                        <span className="text-emerald-700 font-black">[ ✓ SIAP DI MAP ]</span>
                      ) : item.status === 'in_progress' ? (
                        <span className="text-amber-700">[ ⏳ PROSES ]</span>
                      ) : (
                        <span className="text-slate-400">[ ⚪ BELUM ]</span>
                      )}
                    </td>
                    <td className="p-2 border border-slate-300 text-slate-600 text-[11px] italic">
                      {item.userNote || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Official Signatures & Stamp Area */}
          <div className="pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-xs text-slate-800">
            <div className="space-y-16 text-center">
              <div>
                <p className="font-semibold text-slate-600">Calon Mahasiswa / Peserta</p>
                <p className="text-[10px] text-slate-400">(Tanda tangan & Nama Terang)</p>
              </div>
              <div className="border-b border-slate-400 w-52 mx-auto font-bold text-slate-900 pb-1 uppercase">
                ({candidate.fullName})
              </div>
            </div>

            <div className="space-y-10 text-center relative">
              <div>
                <p className="font-semibold text-slate-600">Jember, {currentDateStr}</p>
                <p className="font-bold text-red-900">{officialSignatoryTitle}</p>
              </div>

              {/* Stamp Seal Simulation */}
              <div className="relative border border-dashed border-red-800 p-2 w-48 mx-auto bg-red-50/50 rounded-xl text-red-900 font-bold text-[10px] uppercase">
                <div className="text-[8px] tracking-widest text-red-700">TERVERIFIKASI RESMI</div>
                {officialSignatoryName.toUpperCase()}
                <div className="text-[8px] font-normal text-slate-600">{siteName}</div>
              </div>

              <div className="border-b border-slate-400 w-52 mx-auto font-bold text-slate-900 pb-1">
                ({officialSignatoryName})
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-4 text-center text-[10px] text-slate-500 border-t border-slate-200">
            Dokumen resmi ini dicetak secara otomatis dan disahkan oleh {siteName}. Pengurusan administrasi & visa luar negeri bekerjasama dengan VISA HUB INDONESIA.
          </div>
        </div>
      </div>
    </div>
  );
};
