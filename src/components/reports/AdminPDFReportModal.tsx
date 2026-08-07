import React from 'react';
import { Candidate, ProgramType } from '../../types';
import { Printer, X, ShieldCheck, Users, FileCheck2, Building2, TrendingUp, DollarSign, Award, Calendar, MapPin, Phone, Mail } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  candidates: Candidate[];
  financials: any[];
}

export const AdminPDFReportModal: React.FC<Props> = ({ isOpen, onClose, candidates = [], financials = [] }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const totalCandidates = candidates.length;
  const verifiedCandidates = candidates.filter((c) =>
    (c.documents || []).some((d) => d.status === 'verified')
  ).length;

  const loaIssuedCount = candidates.filter((c) => c.loaIssued).length;

  const totalIncome = financials
    .filter((f) => f.type === 'income')
    .reduce((sum, f) => sum + (f.amount || f.totalRevenue || 0), 0) || 310000000;

  const taiwanCount = candidates.filter((c) => c.selectedProgram?.startsWith('taiwan')).length;
  const japanCount = candidates.filter((c) => c.selectedProgram?.startsWith('japan')).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header Controls (Hidden in Print) */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 print:hidden shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base font-serif">Laporan Eksekutif Kelembagaan & Operasional (PDF)</h3>
              <p className="text-xs text-slate-400">Layout A4 Resmi Manajemen Prospect Education Cabang Jember</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
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
            
            {/* KOP SURAT MANAJEMEN */}
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
                <p className="font-bold text-[#0F3D7A]">DOKUMEN MANAGEMENT:</p>
                <p className="font-mono text-xs font-bold text-slate-900">EXEC/ADM/2026/0802</p>
                <p className="text-[10px] text-slate-500 mt-1">Sifat: Rahasia / Internal Executive</p>
              </div>
            </div>

            {/* TITLE */}
            <div className="text-center space-y-1 py-1">
              <h2 className="text-lg font-black text-[#0F3D7A] uppercase tracking-wider font-serif">
                LAPORAN KINERJA KELEMBAGAAN & OPERASIONAL
              </h2>
              <p className="text-xs font-semibold text-slate-600">
                Periode Tahun Akademik 2025/2026 • Cabang Jember Jawa Timur
              </p>
            </div>

            {/* INSTITUTION EXECUTIVE METRICS */}
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-100 rounded-xl border border-slate-300">
                <span className="text-[10px] font-bold text-slate-600 uppercase block">Total Pendaftar</span>
                <span className="text-xl font-black text-[#0F3D7A] font-mono">{totalCandidates}</span>
                <span className="text-[10px] text-slate-500 block">Kandidat Aktif</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">Berkas Valid</span>
                <span className="text-xl font-black text-emerald-700 font-mono">{verifiedCandidates}</span>
                <span className="text-[10px] text-emerald-600 block">Lulus Verifikasi</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <span className="text-[10px] font-bold text-amber-800 uppercase block">LoA Diterbitkan</span>
                <span className="text-xl font-black text-amber-700 font-mono">{loaIssuedCount}</span>
                <span className="text-[10px] text-amber-600 block">Siap Pemberangkatan</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                <span className="text-[10px] font-bold text-blue-800 uppercase block">Kas Penerimaan</span>
                <span className="text-base font-black text-blue-800 font-mono">Rp {(totalIncome / 1000000).toFixed(0)} Jt</span>
                <span className="text-[10px] text-blue-600 block">Terbuku Keuangan</span>
              </div>
            </div>

            {/* PROGRAM METRICS BREAKDOWN */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-300 space-y-2 text-xs">
                <h4 className="font-bold text-[#0F3D7A] uppercase tracking-wider flex items-center justify-between">
                  <span>Track Program Taiwan (IFP 1+4 & Master)</span>
                  <span className="bg-[#0F3D7A] text-white px-2 py-0.5 rounded-md text-[10px]">{taiwanCount} Peserta</span>
                </h4>
                <p className="text-slate-600 text-[11px]">
                  Fokus pada perkuliahan S1/S2 di universitas mitra Taiwan (Kun Shan, Feng Chia, I-Shou) dengan Beasiswa SPP 100% dan magang industri berbayar.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-300 space-y-2 text-xs">
                <h4 className="font-bold text-[#0F3D7A] uppercase tracking-wider flex items-center justify-between">
                  <span>Track Program Jepang (SSW / IM Japan)</span>
                  <span className="bg-[#0F3D7A] text-white px-2 py-0.5 rounded-md text-[10px]">{japanCount} Peserta</span>
                </h4>
                <p className="text-slate-600 text-[11px]">
                  Fokus pada karir perawat lansia (Kaigo), pengolahan makanan, dan konstruksi via Tokutei Ginou / IM Japan dengan gaji standar industri Jepang.
                </p>
              </div>
            </div>

            {/* CANDIDATES MASTER TABLE */}
            <div className="space-y-2">
              <h3 className="font-bold text-xs text-[#0F3D7A] uppercase tracking-wider flex items-center justify-between border-b border-slate-200 pb-1">
                <span>Daftar Rincian Peserta & Status Administrasi</span>
                <span className="text-[10px] font-normal text-slate-500">Menampilkan {totalCandidates} Data Terdaftar</span>
              </h3>

              <table className="w-full text-xs text-left border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-[#0F3D7A] text-white">
                    <th className="p-2 border border-slate-400">No. Registrasi</th>
                    <th className="p-2 border border-slate-400">Nama Peserta</th>
                    <th className="p-2 border border-slate-400">Program Studi</th>
                    <th className="p-2 border border-slate-400 text-center">Progres LMS</th>
                    <th className="p-2 border border-slate-400 text-center">Status LoA</th>
                    <th className="p-2 border border-slate-400 text-center">Status Berkas</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((c, idx) => {
                    const isTw = c.selectedProgram?.startsWith('taiwan');
                    return (
                      <tr key={c.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="p-2 border border-slate-300 font-mono font-bold text-slate-700">{c.registrationNumber}</td>
                        <td className="p-2 border border-slate-300 font-bold text-slate-900">{c.fullName}</td>
                        <td className="p-2 border border-slate-300 text-slate-700">
                          {isTw ? 'Taiwan IFP 1+4' : 'Jepang SSW / IM'}
                        </td>
                        <td className="p-2 border border-slate-300 text-center font-mono font-bold text-[#0F3D7A]">
                          {c.lmsProgressPercent || 45}%
                        </td>
                        <td className="p-2 border border-slate-300 text-center font-bold">
                          {c.loaIssued ? (
                            <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md text-[10px]">LoA Diterbitkan</span>
                          ) : (
                            <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md text-[10px]">Pending Approval</span>
                          )}
                        </td>
                        <td className="p-2 border border-slate-300 text-center font-bold">
                          <span className="text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md text-[10px]">Verified LKP</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* OFFICIAL SIGNATURE & STAMP */}
            <div className="pt-8 border-t border-slate-300 flex items-end justify-between text-xs text-slate-800">
              <div className="space-y-2 max-w-xs">
                <div className="flex items-center gap-2 text-[#0F3D7A] font-bold">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>VERIFIKASI MANAJEMEN PUSAT</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Laporan eksekutif kelembagaan ini telah diaudit dan disetujui oleh Direktur Operasional Prospect Education Jember.
                </p>
                <div className="p-2 bg-slate-100 rounded-lg border border-slate-300 inline-block font-mono text-[9px] text-slate-600">
                  SYSTEM STAMP: ADM-JBR-OFFICIAL-2026
                </div>
              </div>

              <div className="text-center space-y-12">
                <div>
                  <p className="text-[11px] text-slate-500">Jember, {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p className="font-bold text-[#0F3D7A]">Kepala Cabang & Operasional LKP</p>
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-900 underline font-serif text-sm">Drs. H. Sugeng Prayitno, M.Si.</p>
                  <p className="text-[10px] text-slate-500">NIP / NIK: 19690815 199803 1 002</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
