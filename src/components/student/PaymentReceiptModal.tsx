import React, { useRef } from 'react';
import { Candidate, PaymentRecord } from '../../types';
import logoImg from '../../assets/images/prospect_logo_1784769572843.jpg';
import {
  Printer,
  X,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  CreditCard,
  Receipt,
  Download,
} from 'lucide-react';

interface Props {
  candidate: Candidate;
  payment?: PaymentRecord;
  onClose: () => void;
}

export const PaymentReceiptModal: React.FC<Props> = ({ candidate, payment, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  // Close modal on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handlePrint = () => {
    window.print();
  };

  const amount = payment?.amount || 3000000;
  const invoiceNo = payment?.invoiceNo || 'INV/PE-JBR/2026/088';
  const paidAt = payment?.paidAt || new Date().toISOString().split('T')[0];
  const paymentMethodName = payment?.paymentMethod
    ? payment.paymentMethod.toUpperCase().replace('_', ' ')
    : 'MIDTRANS QRIS / VA';

  const getProgramTitle = () => {
    switch (candidate.selectedProgram) {
      case 'taiwan_ifp':
        return 'Taiwan IFP 1+4 (S1 Beasiswa International Foundation Program)';
      case 'taiwan_4_1':
        return 'Taiwan 4+1 (4 Tahun S1 + 1 Tahun S2 Pascasarjana)';
      case 'japan_im':
        return 'Magang Kerja Jepang IM Japan (Kemnaker RI)';
      case 'japan_ssw':
        return 'Tokutei Ginou SSW Jepang (Specified Skilled Worker)';
      default:
        return 'Program Pendidikan & Karir Luar Negeri Prospect Education';
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Kwitansi Bukti Pembayaran Digital Resmi"
        className="bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] my-auto flex flex-col overflow-hidden printable-content"
      >
        {/* Top Action Bar (Hidden when printing) */}
        <div className="print:hidden bg-slate-900 text-white p-4 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-600 text-white rounded-xl">
              <Receipt className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-bold text-sm">
                Kwitansi & Bukti Pembayaran Digital Resmi
              </h3>
              <p className="text-[11px] text-slate-400">
                Dokumen pembayaran sah dengan verifikasi Midtrans & Cap Digital LKP & Konsultan Pendidikan Prospect Education Cabang Jember.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              aria-label="Cetak Kwitansi atau Simpan PDF"
              className="bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-md flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:outline-hidden"
            >
              <Printer className="w-4 h-4 text-emerald-200" aria-hidden="true" />
              <span>Cetak / Simpan PDF</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Tutup modal kwitansi"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:outline-hidden"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Printable Content Body */}
        <div
          ref={printRef}
          className="p-6 sm:p-10 overflow-y-auto font-sans print:p-0 print:overflow-visible text-slate-900 space-y-6"
        >
          {/* Header / Letterhead */}
          <div className="border-b-4 border-double border-red-900 pb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-xl p-1 border-2 border-red-900 shadow-sm shrink-0">
                <img
                  src={logoImg}
                  alt="Prospect Education Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-red-900 font-serif tracking-tight leading-none">
                  PROSPECT EDUCATION
                </h1>
                <p className="text-xs font-bold text-amber-600 tracking-widest mt-0.5 uppercase">
                  CABANG JEMBER
                </p>
                <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                  Jl. Balung-Jenggawah, Wetan Kali, Balung Lor, Kec. Balung, Kab. Jember • WA: 0823-3455-4396
                </p>
              </div>
            </div>

            <div className="text-right text-[10px] font-sans font-bold text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 shrink-0 hidden sm:block">
              <p className="flex items-center justify-end gap-1 text-emerald-800 font-extrabold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                <span>LEGAL | AMAN | TERPERCAYA</span>
              </p>
              <p className="text-slate-500 font-normal mt-0.5">NIB: 1284000392019</p>
            </div>
          </div>

          {/* Title Banner */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between gap-4 border-l-4 border-emerald-500">
            <div>
              <span className="text-[10px] text-emerald-400 font-bold tracking-wider uppercase">
                BUKTI PEMBAYARAN RESMI (PAYMENT RECEIPT)
              </span>
              <h2 className="text-lg font-black font-serif tracking-wide text-amber-300">
                KWITANSI DIGITAL REGISTRASI
              </h2>
            </div>
            <div className="text-right font-mono text-xs">
              <p className="text-slate-400">Nomor Invoice:</p>
              <p className="font-bold text-emerald-400">{invoiceNo}</p>
            </div>
          </div>

          {/* Details Table Grid */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
              <div>
                <span className="text-slate-500 font-semibold block text-[11px]">Telah Diterima Dari:</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{candidate.fullName}</p>
                <p className="text-slate-600 font-mono text-[11px] mt-0.5">
                  No. Registrasi: {candidate.registrationNumber}
                </p>
                <p className="text-slate-600 text-[11px]">
                  NIK: {candidate.biodata?.nik || candidate.nik || '3509xxxxxxxxxxxx'}
                </p>
              </div>

              <div>
                <span className="text-slate-500 font-semibold block text-[11px]">Rincian Transaksi:</span>
                <p className="text-slate-700 font-medium mt-0.5">
                  Tanggal Lunas: <strong className="text-slate-900">{paidAt}</strong>
                </p>
                <p className="text-slate-700 font-medium">
                  Metode Bayar: <strong className="text-slate-900">{paymentMethodName}</strong>
                </p>
                <p className="text-slate-700 font-medium">
                  Gateway: <strong className="text-emerald-700 font-mono">MIDTRANS SETTLEMENT (LUNAS)</strong>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-slate-500 font-semibold block text-[11px]">Untuk Pembayaran:</span>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                <p className="font-bold text-slate-900 text-xs">
                  Uang Muka (DP) Pendaftaran & Matrikulasi Bahasa — {getProgramTitle()}
                </p>
                <p className="text-[11px] text-slate-500">
                  Meliputi biaya administrasi pendaftaran, seleksi berkas, pembuatan akun LMS, & matrikulasi persiapan di LPK Prospect Education Cabang Jember.
                </p>
              </div>
            </div>

            {/* Total Amount Box */}
            <div className="bg-emerald-50 border-2 border-emerald-300 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-wider block">
                  JUMLAH BIAYA DIBAYAR (TOTAL PAID):
                </span>
                <p className="text-2xl font-black text-emerald-900 font-mono">
                  Rp {amount.toLocaleString('id-ID')}
                </p>
              </div>

              <div className="bg-emerald-800 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" aria-hidden="true" />
                <span>LUNAS / VERIFIED</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-600 italic bg-amber-50 p-3 rounded-xl border border-amber-200">
              <strong>Terbilang:</strong> <i>"Tiga Juta Rupiah"</i>
            </div>
          </div>

          {/* Stamp & Signature Section */}
          <div className="pt-6 flex items-end justify-between font-sans border-t border-slate-200 text-xs">
            <div className="space-y-1 text-center">
              <div className="w-24 h-24 bg-slate-900 p-2 rounded-xl flex items-center justify-center text-amber-400 mx-auto border border-slate-300">
                <QrCode className="w-20 h-20" aria-hidden="true" />
              </div>
              <p className="text-[9px] text-slate-400 font-mono">
                Verifikasi Transaksi Midtrans ID: <br />
                {invoiceNo}
              </p>
            </div>

            <div className="text-center space-y-1">
              <p className="text-xs text-slate-600">Jember, {paidAt}</p>
              <p className="text-xs font-bold text-slate-900">Keuangan Prospect Education Jember</p>
              <div className="h-16 flex items-center justify-center">
                <span className="text-xs italic text-emerald-800 font-serif font-bold border-b-2 border-emerald-800 px-4">
                  [Stempel Digital & Konfirmasi Sistem]
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900">Ahmad Syafi'i</p>
              <p className="text-[10px] text-slate-500">Staf Keuangan LKP & Konsultan Prospect Education Jember</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 text-center text-[10px] text-slate-500 font-sans">
            Dokumen kwitansi ini diterbitkan secara sah dan resmi oleh LKP & Konsultan Pendidikan Prospect Education Cabang Jember.
          </div>
        </div>
      </div>
    </div>
  );
};
