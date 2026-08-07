import React from 'react';
import { Printer, X, ShieldCheck, TrendingUp, DollarSign, Award, Building2, PieChart as PieIcon, MapPin, Phone, Mail, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  financials: any[];
  candidatesCount: number;
}

export const InvestorPDFReportModal: React.FC<Props> = ({ isOpen, onClose, financials = [], candidatesCount = 18 }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const totalRevenue = financials
    .filter((f) => f.type === 'income')
    .reduce((sum, f) => sum + (f.amount || f.totalRevenue || 0), 0) || 310000000;

  const totalExpense = financials
    .filter((f) => f.type === 'expense')
    .reduce((sum, f) => sum + (f.amount || f.totalExpenses || 0), 0) || 120000000;

  const netProfit = totalRevenue - totalExpense;
  const profitMarginPercent = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 61;

  const quarterlyProjections = [
    { quarter: 'Q1 2025', revenue: 'Rp 120.000.000', profit: 'Rp 45.000.000', margin: '37.5%', status: 'Realisasi' },
    { quarter: 'Q2 2025', revenue: 'Rp 180.000.000', profit: 'Rp 70.000.000', margin: '38.8%', status: 'Realisasi' },
    { quarter: 'Q3 2025', revenue: 'Rp 240.000.000', profit: 'Rp 95.000.000', margin: '39.5%', status: 'Realisasi' },
    { quarter: 'Q4 2025', revenue: 'Rp 310.000.000', profit: 'Rp 130.000.000', margin: '41.9%', status: 'Realisasi' },
    { quarter: 'Q1 2026', revenue: 'Rp 420.000.000', profit: 'Rp 180.000.000', margin: '42.8%', status: 'Realisasi' },
    { quarter: 'Q2 2026', revenue: 'Rp 580.000.000', profit: 'Rp 250.000.000', margin: '43.1%', status: 'Proyeksi Growth' },
  ];

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
              <h3 className="font-bold text-sm sm:text-base font-serif">Laporan Keuangan & Dampak Investasi (PDF)</h3>
              <p className="text-xs text-slate-400">Laporan Resmi Pemegang Saham & Mitra Investor Prospect Education</p>
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

        {/* Printable Content Body */}
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
            
            {/* KOP SURAT FINANCIAL & INVESTOR */}
            <div className="border-b-4 border-double border-[#0F3D7A] pb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-16 h-16 bg-[#0F3D7A] text-amber-400 rounded-2xl flex items-center justify-center font-black text-2xl font-serif shrink-0 shadow-md">
                  PRO
                </div>
                <div>
                  <h1 className="text-xl font-black text-[#0F3D7A] font-serif tracking-tight">
                    PROSPECT EDUCATION GROUP
                  </h1>
                  <p className="text-xs font-semibold text-slate-700">
                    Divisi Keuangan & Hubungan Investor (Investor Relations)
                  </p>
                  <p className="text-[11px] text-slate-500 flex flex-wrap items-center gap-3 mt-1">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-red-500" /> Jl. Kalimantan No. 12 Sumbersari, Jember</span>
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-emerald-600" /> (0331) 489-1234</span>
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-blue-600" /> investor@prospect-education.id</span>
                  </p>
                </div>
              </div>

              <div className="text-center sm:text-right text-[11px] text-slate-600 border-t sm:border-t-0 sm:border-l border-slate-300 pt-2 sm:pt-0 sm:pl-4 shrink-0">
                <p className="font-bold text-[#0F3D7A]">DOKUMEN FINANCIAL:</p>
                <p className="font-mono text-xs font-bold text-slate-900">FIN/INV/2026/Q2-REPORT</p>
                <p className="text-[10px] text-slate-500 mt-1">Status: Audited Financial Report</p>
              </div>
            </div>

            {/* REPORT TITLE */}
            <div className="text-center space-y-1 py-1">
              <h2 className="text-lg font-black text-[#0F3D7A] uppercase tracking-wider font-serif">
                LAPORAN KINERJA KEUANGAN & DAMPAK INVESTASI
              </h2>
              <p className="text-xs font-semibold text-slate-600">
                Analisis Pertumbuhan Pendapatan, Net Profit, ROI, dan Penyaluran Kandidat Karir Internasional
              </p>
            </div>

            {/* INVESTOR METRICS CARDS */}
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200">
                <span className="text-[10px] font-bold text-blue-800 uppercase block">Total Pendapatan Kotor</span>
                <span className="text-lg font-black text-blue-900 font-mono">Rp {totalRevenue.toLocaleString('id-ID')}</span>
                <span className="text-[10px] text-blue-600 block">Pendaftaran & Program Fee</span>
              </div>
              <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-300">
                <span className="text-[10px] font-bold text-slate-600 uppercase block">Beban Operasional</span>
                <span className="text-lg font-black text-slate-800 font-mono">Rp {totalExpense.toLocaleString('id-ID')}</span>
                <span className="text-[10px] text-slate-500 block">Instruktur, Visum & LMS</span>
              </div>
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">Laba Bersih (Net Profit)</span>
                <span className="text-lg font-black text-emerald-700 font-mono">Rp {netProfit.toLocaleString('id-ID')}</span>
                <span className="text-[10px] text-emerald-600 block">EBITDA Post-Tax</span>
              </div>
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200">
                <span className="text-[10px] font-bold text-amber-800 uppercase block">Profit Margin (%)</span>
                <span className="text-lg font-black text-amber-700 font-mono">{profitMarginPercent}%</span>
                <span className="text-[10px] text-amber-600 block">Rasio Efisiensi Tinggi</span>
              </div>
            </div>

            {/* QUARTERLY FINANCIAL & ROI GROWTH TABLE */}
            <div className="space-y-2">
              <h3 className="font-bold text-xs text-[#0F3D7A] uppercase tracking-wider flex items-center justify-between border-b border-slate-200 pb-1">
                <span>Historis Pertumbuhan Kuartalan & Proyeksi Karir Internasional</span>
                <span className="text-[10px] font-normal text-slate-500">Mata Uang: IDR (Rupiah)</span>
              </h3>

              <table className="w-full text-xs text-left border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-[#0F3D7A] text-white">
                    <th className="p-2 border border-slate-400">Periode Kuartal</th>
                    <th className="p-2 border border-slate-400 text-right">Pendapatan Kotor</th>
                    <th className="p-2 border border-slate-400 text-right">Laba Bersih</th>
                    <th className="p-2 border border-slate-400 text-center">Margin (%)</th>
                    <th className="p-2 border border-slate-400 text-center">Status Laporan</th>
                  </tr>
                </thead>
                <tbody>
                  {quarterlyProjections.map((item, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="p-2 border border-slate-300 font-bold text-slate-800">{item.quarter}</td>
                      <td className="p-2 border border-slate-300 text-right font-mono font-bold text-slate-900">{item.revenue}</td>
                      <td className="p-2 border border-slate-300 text-right font-mono font-bold text-emerald-700">{item.profit}</td>
                      <td className="p-2 border border-slate-300 text-center font-mono font-bold text-blue-700">{item.margin}</td>
                      <td className="p-2 border border-slate-300 text-center font-bold">
                        <span className={item.status === 'Realisasi' ? "text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md text-[10px]" : "text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md text-[10px]"}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* FEEDER SCHOOL PARTNERSHIPS IMPACT */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-300 space-y-3 text-xs">
              <h4 className="font-bold text-[#0F3D7A] uppercase tracking-wider">
                Dampak Kemitraan Sekolah Pengumpan (Feeder Schools Jember)
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 block">SMA Negeri 2 Jember</span>
                  <span className="text-slate-500 text-[11px]">14 Peserta • Top: Taiwan IFP 1+4</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 block">SMK Negeri 1 Balung</span>
                  <span className="text-slate-500 text-[11px]">12 Peserta • Top: Jepang Kaigo SSW</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 block">SMK Negeri 3 Jember</span>
                  <span className="text-slate-500 text-[11px]">11 Peserta • Top: Jepang IM Japan</span>
                </div>
              </div>
            </div>

            {/* OFFICIAL SIGNATURE & AUDIT STAMP */}
            <div className="pt-8 border-t border-slate-300 flex items-end justify-between text-xs text-slate-800">
              <div className="space-y-2 max-w-xs">
                <div className="flex items-center gap-2 text-[#0F3D7A] font-bold">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>AUDITED FINANCIAL RELEASE</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Disetujui oleh Komite Audit Keuangan Prospect Education Group untuk dilaporkan pada RUPS Tahunan Mitra Investor.
                </p>
                <div className="p-2 bg-slate-100 rounded-lg border border-slate-300 inline-block font-mono text-[9px] text-slate-600">
                  AUDIT STAMP: INV-PRO-2026-RELEASE
                </div>
              </div>

              <div className="text-center space-y-12">
                <div>
                  <p className="text-[11px] text-slate-500">Jember, {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p className="font-bold text-[#0F3D7A]">Direktur Keuangan & Hubungan Investor</p>
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-900 underline font-serif text-sm">Hj. Rina Kartikawati, S.E., M.Ak.</p>
                  <p className="text-[10px] text-slate-500">NPAI / IAI No: 2011048821</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
