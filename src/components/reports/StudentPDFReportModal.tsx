import React from 'react';
import { Candidate, LMSModule } from '../../types';
import { downloadStudentProfilePDF } from '../../utils/pdfGenerator';
import { Printer, X, ShieldCheck, FileCheck2, BookOpen, User, GraduationCap, Calendar, Award, MapPin, Mail, Phone, Download } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate;
  lmsModules: LMSModule[];
}

export const StudentPDFReportModal: React.FC<Props> = ({ isOpen, onClose, candidate, lmsModules }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const docs = candidate.documents || [];
  const verifiedDocsCount = docs.filter((d) => d.status === 'verified').length;
  const completedLmsCount = lmsModules.filter((m) => m.isCompleted).length;
  const lmsPercent = lmsModules.length > 0 ? Math.round((completedLmsCount / lmsModules.length) * 100) : 0;

  const isTaiwan = candidate.selectedProgram?.startsWith('taiwan');
  const programTitle = isTaiwan ? 'Program Kuliah & Magang Taiwan (IFP 1+4)' : 'Program Karir & Pemagangan Jepang (SSW / IM Japan)';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Modal Container */}
      <div className="bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Control Header - Hidden during Print */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 print:hidden shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base font-serif">Pratinjau Laporan Resmi Peserta (PDF)</h3>
              <p className="text-xs text-slate-400">Layout A4 disesuaikan untuk pencetakan dokumen fisik atau simpan PDF</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadStudentProfilePDF(candidate, lmsModules)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer border border-amber-300"
              title="Unduh Laporan PDF Resmi Peserta secara langsung"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>Unduh PDF Laporan (A4)</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>Cetak Browser</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Content Body */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6 print:p-0 print:overflow-visible font-sans">
          
          {/* Print Style Injector */}
          <style>{`
            @media print {
              body * {
                visibility: hidden;
              }
              .printable-report-area, .printable-report-area * {
                visibility: visible;
              }
              .printable-report-area {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                margin: 0;
                padding: 15mm;
                background: white !important;
                color: black !important;
                box-shadow: none !important;
              }
              .print\\:hidden {
                display: none !important;
              }
            }
          `}</style>

          <div className="printable-report-area space-y-6">
            
            {/* OFFICIAL LETTERHEAD (KOP SURAT RESMI) */}
            <div className="border-b-4 border-double border-[#0F3D7A] pb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-16 h-16 bg-[#0F3D7A] text-amber-400 rounded-2xl flex items-center justify-center font-black text-2xl font-serif shrink-0 shadow-md">
                  PRO
                </div>
                <div>
                  <h1 className="text-xl font-black text-[#0F3D7A] font-serif tracking-tight">
                    PROSPECT EDUCATION CABANG JEMBER
                  </h1>
                  <p className="text-xs font-semibold text-slate-700">
                    Lembaga Kursus & Pelatihan (LKP) Penyaluran Program Internasional
                  </p>
                  <p className="text-[11px] text-slate-500 flex flex-wrap items-center gap-3 mt-1">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-red-500" /> Jl. Kalimantan No. 12 Sumbersari, Jember</span>
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-emerald-600" /> (0331) 489-1234</span>
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-blue-600" /> info@prospect-education.id</span>
                  </p>
                </div>
              </div>

              <div className="text-center sm:text-right text-[11px] text-slate-600 border-t sm:border-t-0 sm:border-l border-slate-300 pt-2 sm:pt-0 sm:pl-4 shrink-0">
                <p className="font-bold text-[#0F3D7A]">NOMOR DOKUMEN LAPORAN:</p>
                <p className="font-mono text-xs font-bold text-slate-900">REP/STU/{candidate.registrationNumber || '2026-001'}</p>
                <p className="text-[10px] text-slate-500 mt-1">Tanggal Cetak: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>

            {/* REPORT TITLE */}
            <div className="text-center space-y-1 py-1">
              <h2 className="text-lg font-black text-[#0F3D7A] uppercase tracking-wider font-serif">
                LAPORAN PROGRES BELAJAR & VERIFIKASI PESERTA
              </h2>
              <p className="text-xs font-semibold text-slate-600">
                Laporan Hasil Evaluasi Modul LMS & Kelengkapan Berkas Administrasi
              </p>
            </div>

            {/* CANDIDATE IDENTITY BOX */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-300 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1.5 md:col-span-2">
                <div className="grid grid-cols-3">
                  <span className="text-slate-500 font-semibold">Nama Lengkap:</span>
                  <span className="col-span-2 font-bold text-slate-900">{candidate.fullName}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-slate-500 font-semibold">Nomor Registrasi:</span>
                  <span className="col-span-2 font-mono font-bold text-[#0F3D7A]">{candidate.registrationNumber}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-slate-500 font-semibold">Program Pilihan:</span>
                  <span className="col-span-2 font-bold text-slate-800">{programTitle}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-slate-500 font-semibold">Alamat / Asal:</span>
                  <span className="col-span-2 text-slate-800">{candidate.biodata?.address || 'Kabupaten Jember, Jawa Timur'}</span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="text-slate-500 font-semibold">Status Pendaftaran:</span>
                  <span className="col-span-2 font-bold text-emerald-700">
                    {candidate.loaIssued ? 'Surat Penerimaan (LoA) Diterbitkan' : 'Tahap Pembekalan LMS & Verifikasi'}
                  </span>
                </div>
              </div>

              {/* Photo Box */}
              <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-300 text-center space-y-2">
                {candidate.avatarUrl ? (
                  <img src={candidate.avatarUrl} alt="Foto Peserta" className="w-20 h-24 object-cover rounded-md border border-slate-200" />
                ) : (
                  <div className="w-20 h-24 bg-slate-200 rounded-md flex items-center justify-center text-slate-400 text-[10px]">
                    Pasfoto 3x4
                  </div>
                )}
                <span className="text-[10px] font-bold text-[#0F3D7A] uppercase">Peserta Terdaftar</span>
              </div>
            </div>

            {/* KEY SUMMARY METRICS */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">Progres LMS Bahasa</span>
                <span className="text-xl font-black text-emerald-700 font-mono">{lmsPercent}%</span>
                <span className="text-[10px] text-emerald-600 block">{completedLmsCount} / {lmsModules.length} Modul Selesai</span>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <span className="text-[10px] font-bold text-blue-800 uppercase block">Berkas Terverifikasi</span>
                <span className="text-xl font-black text-blue-700 font-mono">{verifiedDocsCount} Berkas</span>
                <span className="text-[10px] text-blue-600 block">Status Valid LKP Approved</span>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <span className="text-[10px] font-bold text-amber-800 uppercase block">Kelayakan Wawancara</span>
                <span className="text-xl font-black text-amber-700 font-mono">SIAP</span>
                <span className="text-[10px] text-amber-600 block">Memenuhi Standar Mitra</span>
              </div>
            </div>

            {/* LMS MODULES PROGRESS TABLE */}
            <div className="space-y-2">
              <h3 className="font-bold text-xs text-[#0F3D7A] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1">
                <BookOpen className="w-4 h-4 text-amber-500" />
                <span>Rincian Modul Pembelajaran LMS (Bahasa {isTaiwan ? 'Mandarin' : 'Jepang'})</span>
              </h3>
              <table className="w-full text-xs text-left border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-[#0F3D7A] text-white">
                    <th className="p-2 border border-slate-400">No.</th>
                    <th className="p-2 border border-slate-400">Modul Pembelajaran</th>
                    <th className="p-2 border border-slate-400">Bahasa</th>
                    <th className="p-2 border border-slate-400 text-center">Durasi</th>
                    <th className="p-2 border border-slate-400 text-center">Progres (%)</th>
                    <th className="p-2 border border-slate-400 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lmsModules.map((m, idx) => (
                    <tr key={m.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="p-2 border border-slate-300 font-bold text-slate-600 text-center">{idx + 1}</td>
                      <td className="p-2 border border-slate-300 font-bold text-slate-800">{m.title}</td>
                      <td className="p-2 border border-slate-300 text-slate-600">{m.language}</td>
                      <td className="p-2 border border-slate-300 text-center text-slate-600">{m.durationMinutes || 120} m</td>
                      <td className="p-2 border border-slate-300 text-center font-mono font-bold text-[#0F3D7A]">
                        {m.isCompleted ? '100%' : `${m.progressPercent || 30}%`}
                      </td>
                      <td className="p-2 border border-slate-300 text-center font-bold">
                        {m.isCompleted ? (
                          <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md text-[10px]">Lulus</span>
                        ) : (
                          <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md text-[10px]">Dalam Proses</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* DOCUMENT CHECKLIST STATUS TABLE */}
            <div className="space-y-2">
              <h3 className="font-bold text-xs text-[#0F3D7A] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 pb-1">
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
                <span>Audit Status Berkas Persyaratan Admin</span>
              </h3>
              <table className="w-full text-xs text-left border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-800 text-white">
                    <th className="p-2 border border-slate-400">Nama Dokumen Berkas</th>
                    <th className="p-2 border border-slate-400">Format File</th>
                    <th className="p-2 border border-slate-400 text-center">Tanggal Unggah</th>
                    <th className="p-2 border border-slate-400 text-center">Hasil Verifikasi Admin</th>
                  </tr>
                </thead>
                <tbody>
                  {docs.map((doc, idx) => (
                    <tr key={doc.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="p-2 border border-slate-300 font-bold text-slate-800">{doc.title}</td>
                      <td className="p-2 border border-slate-300 text-slate-500 uppercase text-[10px]">{doc.fileName ? doc.fileName.split('.').pop() : 'PDF / JPG'}</td>
                      <td className="p-2 border border-slate-300 text-center text-slate-600">{doc.uploadedAt || '02/08/2026'}</td>
                      <td className="p-2 border border-slate-300 text-center font-bold">
                        {doc.status === 'verified' ? (
                          <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md text-[10px]">Valid & Approved</span>
                        ) : doc.status === 'rejected' ? (
                          <span className="text-red-700 bg-red-100 px-2 py-0.5 rounded-md text-[10px]">Perlu Revisi</span>
                        ) : (
                          <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md text-[10px]">Pending Verifikasi</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* OFFICIAL STAMP & SIGNATURE BLOCK */}
            <div className="pt-6 border-t border-slate-300 flex items-end justify-between text-xs text-slate-800">
              <div className="space-y-2 max-w-xs">
                <div className="flex items-center gap-2 text-[#0F3D7A] font-bold">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>SISTEM VALIDASI DIGITAL PROSPECT</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Dokumen ini diterbitkan secara otomatis oleh Sistem Portal LKP Prospect Education Cabang Jember. Keabsahan laporan ini dilindungi kode QR verifikasi resmi.
                </p>
                <div className="p-2 bg-slate-100 rounded-lg border border-slate-300 inline-block font-mono text-[9px] text-slate-600">
                  HASH: SEC-PRO-2026-991A-JBR
                </div>
              </div>

              <div className="text-center space-y-12">
                <div>
                  <p className="text-[11px] text-slate-500">Jember, {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p className="font-bold text-[#0F3D7A]">Pimpinan LKP Prospect Education Jember</p>
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-900 underline font-serif text-sm">H. Bambang Widjaja, M.Ed.</p>
                  <p className="text-[10px] text-slate-500">NIP / NIK: 19780412 200501 1 003</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
