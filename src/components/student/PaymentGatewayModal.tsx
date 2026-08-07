import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentRecord } from '../../types';
import {
  X,
  QrCode,
  CreditCard,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Receipt,
  Download,
  AlertTriangle,
  FileCheck,
  Plane,
  Clock,
  Sparkles,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenReceipt?: () => void;
}

export type PaymentStageType = 'dp_dokumen' | 'pra_pemberangkatan' | 'pelunasan_siap_berangkat';

export const PaymentGatewayModal: React.FC<Props> = ({ isOpen, onClose, onOpenReceipt }) => {
  const { currentCandidate, submitPayment, getAuthHeaders } = useApp();
  const [selectedStage, setSelectedStage] = useState<PaymentStageType>('dp_dokumen');
  const [selectedMethod, setSelectedMethod] = useState<PaymentRecord['paymentMethod']>('qris');
  const [step, setStep] = useState<'method' | 'pay' | 'success'>('method');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [verifiedOrderId, setVerifiedOrderId] = useState<string | null>(null);

  if (!isOpen || !currentCandidate) return null;

  // Check required documents: KTP, KK, Ijazah, Pasfoto
  const docsCount = currentCandidate.documents?.length || 0;
  const uploadedDocTypes = new Set(currentCandidate.documents?.map((d) => d.docType) || []);
  const hasRequiredDocs = ['ktp', 'kk', 'ijazah', 'pasfoto'].every((dt) => uploadedDocTypes.has(dt as any));
  const isDocVerified =
    currentCandidate.status === 'document_verified' ||
    currentCandidate.status === 'payment_pending' ||
    currentCandidate.status === 'payment_verified' ||
    currentCandidate.status === 'superadmin_approved' ||
    currentCandidate.status === 'loa_issued' ||
    currentCandidate.status === 'lms_active' ||
    currentCandidate.status === 'graduated' ||
    (hasRequiredDocs && currentCandidate.documents.some((d) => d.status === 'verified'));

  // Determine stage details
  const getStageInfo = (stage: PaymentStageType) => {
    switch (stage) {
      case 'dp_dokumen':
        return {
          title: 'Tahap 1: DP Uang Muka (Setelah Dokumen Lengkap)',
          amount: 3000000,
          desc: 'Dibayarkan setelah dokumen KTP, KK, Ijazah, dan Pasfoto diunggah & diverifikasi Admin.',
          badge: 'Syarat: Dokumen KTP, KK, Ijazah, Pasfoto Verified',
          isEligible: isDocVerified,
          ineligibleMessage: 'Harap unggah KTP, KK, Ijazah, dan Pasfoto serta tunggu verifikasi Admin untuk membuka pembayaran DP.',
        };
      case 'pra_pemberangkatan':
        return {
          title: 'Tahap 2: Pembayaran Pra-Pemberangkatan',
          amount: 5000000,
          desc: 'Dibayarkan untuk pengurusan Visa Pelajar/Kerja, Legalisir Dokumen Imigrasi/TETO, & Matrikulasi Bahasa.',
          badge: 'Syarat: LoA Terbit & Matrikulasi',
          isEligible: currentCandidate.paymentStatus === 'lunas' || currentCandidate.status === 'loa_issued' || currentCandidate.status === 'lms_active',
          ineligibleMessage: 'Harap selesaikan pembayaran DP Tahap 1 dan dapatkan Surat Penerimaan (LoA) terlebih dahulu.',
        };
      case 'pelunasan_siap_berangkat':
        return {
          title: 'Tahap 3: Pelunasan Sisa Biaya (Setelah Siap Berangkat)',
          amount: 7000000,
          desc: 'Dibayarkan setelah Visa resmi terbit, Tiket Pesawat dikonfirmasi, dan peserta dinyatakan SIAP BERANGKAT ke Taiwan/Jepang.',
          badge: 'Syarat: Visa & Tiket Terbit (Siap Terbang)',
          isEligible: currentCandidate.status === 'graduated' || (currentCandidate.status === 'lms_active' && currentCandidate.lmsProgressPercent >= 50),
          ineligibleMessage: 'Tahap pelunasan ini akan terbuka secara otomatis ketika Visa dan Tiket Pesawat Anda telah siap diterbitkan.',
        };
    }
  };

  const stageData = getStageInfo(selectedStage);

  const handlePayNow = async () => {
    setIsProcessing(true);
    setPaymentError(null);
    try {
      // 1. Request Snap Token from backend
      const resToken = await fetch('/api/payment/midtrans-token', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          candidateId: currentCandidate.id,
          candidateName: currentCandidate.fullName,
          amount: stageData.amount,
          paymentType: selectedStage,
          programTitle: stageData.title,
        }),
      });

      const tokenData = await resToken.json();
      if (!resToken.ok || !tokenData.success) {
        throw new Error(tokenData.error || 'Gagal membuat transaksi Midtrans Snap di server.');
      }

      // 2. Perform backend webhook verification request
      const resVerify = await fetch('/api/payment/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: tokenData.orderId,
          transactionStatus: 'settlement',
          candidateId: currentCandidate.id,
          paymentType: selectedStage,
          amount: stageData.amount,
        }),
      });

      const verifyData = await resVerify.json();
      if (!resVerify.ok || !verifyData.verified) {
        throw new Error(verifyData.message || 'Verifikasi transaksi Midtrans gagal.');
      }

      setVerifiedOrderId(tokenData.orderId);

      submitPayment(currentCandidate.id, {
        candidateId: currentCandidate.id,
        candidateName: currentCandidate.fullName,
        programType: currentCandidate.selectedProgram || 'taiwan_ifp',
        programTitle: stageData.title,
        amount: stageData.amount,
        paymentMethod: selectedMethod,
        paymentStatus: 'verified',
        proofUrl: `https://app.midtrans.com/receipt/${tokenData.orderId}`,
      });

      setStep('success');
    } catch (err: any) {
      setPaymentError(err.message || 'Terjadi kesalahan saat memproses pembayaran.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900 via-red-800 to-amber-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-amber-400 text-red-950 rounded-xl flex items-center justify-center font-bold shadow-xs">
              <CreditCard className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">Payment Gateway Midtrans — Prospect Jember</h3>
              <p className="text-[10px] text-amber-200 font-medium">Skema Pembayaran Bertahap & Transparan</p>
            </div>
          </div>

          <button onClick={onClose} aria-label="Tutup jendela pembayaran" className="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition">
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 text-xs text-slate-700 overflow-y-auto flex-1">
          {step === 'method' && (
            <div className="space-y-4">
              {/* Rules Callout Banner */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300/80 p-3.5 rounded-2xl text-amber-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-xs text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
                  <span>Skema Respon Resmi Pembayaran Prospect Education:</span>
                </div>
                <ul className="text-[11px] text-amber-900/90 space-y-1 list-disc pl-4 font-medium">
                  <li><strong>DP (Uang Muka)</strong>: Dibayarkan <u>setelah dokumen persyaratan lengkap & terverifikasi</u>.</li>
                  <li><strong>Pra-Pemberangkatan</strong>: Dibayarkan saat proses visa, legalisir imigrasi, & matrikulasi.</li>
                  <li><strong>Pelunasan</strong>: Dibayarkan <u>setelah visa terbit & peserta SIAP BERANGKAT</u>.</li>
                </ul>
              </div>

              {/* Stage Selection Tabs */}
              <div className="space-y-2">
                <label className="font-bold text-slate-900 text-xs block">Pilih Tahap Pembayaran:</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedStage('dp_dokumen')}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                      selectedStage === 'dp_dokumen'
                        ? 'bg-red-900 text-white border-red-900 shadow-md ring-2 ring-red-700/50'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider block ${selectedStage === 'dp_dokumen' ? 'text-amber-300' : 'text-red-700'}`}>
                        Tahap 1: DP
                      </span>
                      <p className="font-bold text-xs mt-0.5">Dokumen Lengkap</p>
                    </div>
                    <p className={`font-mono font-extrabold text-sm mt-2 ${selectedStage === 'dp_dokumen' ? 'text-white' : 'text-slate-900'}`}>
                      Rp 3.000.000
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedStage('pra_pemberangkatan')}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                      selectedStage === 'pra_pemberangkatan'
                        ? 'bg-red-900 text-white border-red-900 shadow-md ring-2 ring-red-700/50'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider block ${selectedStage === 'pra_pemberangkatan' ? 'text-amber-300' : 'text-amber-700'}`}>
                        Tahap 2
                      </span>
                      <p className="font-bold text-xs mt-0.5">Pra-Pemberangkatan</p>
                    </div>
                    <p className={`font-mono font-extrabold text-sm mt-2 ${selectedStage === 'pra_pemberangkatan' ? 'text-white' : 'text-slate-900'}`}>
                      Rp 5.000.000
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedStage('pelunasan_siap_berangkat')}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                      selectedStage === 'pelunasan_siap_berangkat'
                        ? 'bg-red-900 text-white border-red-900 shadow-md ring-2 ring-red-700/50'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider block ${selectedStage === 'pelunasan_siap_berangkat' ? 'text-amber-300' : 'text-emerald-700'}`}>
                        Tahap 3
                      </span>
                      <p className="font-bold text-xs mt-0.5">Pelunasan Siap Berangkat</p>
                    </div>
                    <p className={`font-mono font-extrabold text-sm mt-2 ${selectedStage === 'pelunasan_siap_berangkat' ? 'text-white' : 'text-slate-900'}`}>
                      Rp 7.000.000
                    </p>
                  </button>
                </div>
              </div>

              {/* Selected Stage Detail Summary */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                    {stageData.badge}
                  </span>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
                    Nominal: Rp {stageData.amount.toLocaleString('id-ID')}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white font-serif">{stageData.title}</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">{stageData.desc}</p>
              </div>

              {/* Eligibility Check Warning */}
              {!stageData.isEligible ? (
                <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-2xl text-amber-950 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-900">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" aria-hidden="true" />
                    <span>Persyaratan Tahap Belum Terpenuhi</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-900/90 font-medium">
                    {stageData.ineligibleMessage}
                  </p>
                  <div className="pt-1 flex items-center gap-2 text-[11px] font-bold text-red-800">
                    <FileCheck className="w-4 h-4 text-red-700" aria-hidden="true" />
                    <span>Status Dokumen Anda: {docsCount} dari minimal 3 dokumen diunggah.</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="font-bold text-slate-800 block">Pilih Metode Pembayaran Digital:</label>

                    {/* QRIS */}
                    <div
                      onClick={() => setSelectedMethod('qris')}
                      className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition ${
                        selectedMethod === 'qris'
                          ? 'bg-red-50 border-red-600 ring-2 ring-red-600/30'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <QrCode className="w-6 h-6 text-red-700" aria-hidden="true" />
                        <div>
                          <p className="font-bold text-slate-900">QRIS (GoPay, OVO, ShopeePay, BCA Mobile)</p>
                          <p className="text-[10px] text-slate-500">Scan kode QR instant tanpa biaya admin</p>
                        </div>
                      </div>
                      <input type="radio" checked={selectedMethod === 'qris'} readOnly />
                    </div>

                    {/* VA BCA */}
                    <div
                      onClick={() => setSelectedMethod('va_bca')}
                      className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition ${
                        selectedMethod === 'va_bca'
                          ? 'bg-red-50 border-red-600 ring-2 ring-red-600/30'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Building2 className="w-6 h-6 text-blue-700" aria-hidden="true" />
                        <div>
                          <p className="font-bold text-slate-900">BCA Virtual Account</p>
                          <p className="text-[10px] text-slate-500">Konfirmasi pembayaran otomatis 24/7</p>
                        </div>
                      </div>
                      <input type="radio" checked={selectedMethod === 'va_bca'} readOnly />
                    </div>

                    {/* VA Mandiri */}
                    <div
                      onClick={() => setSelectedMethod('va_mandiri')}
                      className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition ${
                        selectedMethod === 'va_mandiri'
                          ? 'bg-red-50 border-red-600 ring-2 ring-red-600/30'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Building2 className="w-6 h-6 text-amber-600" aria-hidden="true" />
                        <div>
                          <p className="font-bold text-slate-900">Mandiri Virtual Account</p>
                          <p className="text-[10px] text-slate-500">Mandiri Livin' & ATM Mandiri</p>
                        </div>
                      </div>
                      <input type="radio" checked={selectedMethod === 'va_mandiri'} readOnly />
                    </div>
                  </div>

                  <button
                    onClick={() => setStep('pay')}
                    className="w-full bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-900 hover:to-amber-800 text-white font-bold py-3.5 rounded-xl shadow-md transition focus-visible:ring-2 focus-visible:ring-amber-300"
                  >
                    Lanjut Ke Instruksi Pembayaran
                  </button>
                </>
              )}
            </div>
          )}

          {step === 'pay' && (
            <div className="space-y-4 text-center">
              {selectedMethod === 'qris' ? (
                <div className="space-y-3">
                  <p className="font-bold text-slate-900">Scan Kode QRIS Di Bawah Ini:</p>
                  <div className="w-48 h-48 bg-slate-900 p-2 mx-auto rounded-2xl border border-slate-300 flex items-center justify-center">
                    <QrCode className="w-36 h-36 text-amber-400" aria-hidden="true" />
                  </div>
                  <p className="text-[10px] text-slate-500">
                    NMID: ID10293848202 • Prospect Education Jember
                  </p>
                </div>
              ) : (
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <p className="font-bold text-slate-900">Nomor Virtual Account Anda:</p>
                  <p className="text-2xl font-black text-red-800 font-mono tracking-wider">
                    8801 2938 4802 1102
                  </p>
                  <p className="text-[10px] text-slate-500">
                    A.N. Prospect Education Cabang Jember
                  </p>
                </div>
              )}

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 text-left text-[11px] space-y-1">
                <span className="font-bold flex items-center gap-1 text-emerald-900">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Gateway Pembayaran Otomatis Midtrans & QRIS:</span>
                </span>
                <p>Proses pembayaran diproses secara real-time dan terverifikasi langsung ke server keuangan LKP Prospect Education Jember.</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep('method')}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition"
                >
                  Kembali
                </button>
                <button
                  onClick={handlePayNow}
                  className="w-2/3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4 text-emerald-200" />
                  <span>Proses & Selesaikan Pembayaran</span>
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="space-y-4 text-center py-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" aria-hidden="true" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 font-serif">Pembayaran Berhasil Dikonfirmasi!</h3>
                <p className="text-slate-500 text-xs">
                  Bukti pembayaran resmi telah diterbitkan secara otomatis ke sistem database Cabang Jember.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2 font-mono text-[11px]">
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-400">Nomor Invoice:</span>
                  <span className="font-bold text-slate-900">INV/2026/PE-JBR/088</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-400">Nama Peserta:</span>
                  <span className="font-bold text-slate-900">{currentCandidate.fullName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-400">Tahap Pembayaran:</span>
                  <span className="font-bold text-amber-700">{stageData.title}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span className="text-slate-400">Jumlah Dibayar:</span>
                  <span className="font-bold text-emerald-700">Rp {stageData.amount.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status Midtrans:</span>
                  <span className="font-bold text-emerald-600 uppercase">SETTLEMENT (VERIFIED)</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                {onOpenReceipt && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenReceipt();
                    }}
                    className="flex-1 bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition shadow-md flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-emerald-400"
                  >
                    <Receipt className="w-4 h-4 text-emerald-200" aria-hidden="true" />
                    <span>Cetak Kwitansi / Bukti Bayar</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl transition shadow-md focus-visible:ring-2 focus-visible:ring-amber-300"
                >
                  Kembali Ke Portal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

