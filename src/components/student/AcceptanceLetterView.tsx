import React, { useState } from 'react';
import { Candidate, DigitalSignatureInfo } from '../../types';
import { useApp } from '../../context/AppContext';
import logoImg from '../../assets/images/prospect_logo_1784769572843.jpg';
import { downloadLoaPDF } from '../../utils/pdfGenerator';
import { DigitalSignatureModal } from './DigitalSignatureModal';
import { LoaVerificationModal } from '../LoaVerificationModal';
import {
  Printer,
  Award,
  Plane,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  Download,
  ExternalLink,
  FileText,
  Info,
  PenTool,
  Lock,
  FileCheck2,
} from 'lucide-react';

interface Props {
  candidate: Candidate;
}

export const AcceptanceLetterView: React.FC<Props> = ({ candidate }) => {
  const { signCandidateLoa, candidates = [] } = useApp();
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const getProgramTitle = () => {
    switch (candidate.selectedProgram) {
      case 'taiwan_ifp':
        return 'Program Taiwan IFP 1+4 (International Foundation Program S1 Beasiswa)';
      case 'taiwan_4_1':
        return 'Program Taiwan 4+1 (4 Tahun S1 + 1 Tahun S2 Pascasarjana)';
      case 'japan_im':
        return 'Program Magang Kerja Jepang IM Japan (Kemnaker RI)';
      case 'japan_ssw':
        return 'Program Kerja Jepang Tokutei Ginou (SSW Specified Skilled Worker)';
      default:
        return 'Program Pendidikan & Penyaluran Kerja Internasional';
    }
  };

  const handleSaveSignature = (sigInfo: Partial<DigitalSignatureInfo>) => {
    signCandidateLoa(candidate.id, sigInfo);
    showToast('Tanda tangan digital Anda berhasil dibubuhkan pada dokumen LoA!');
  };

  const generateLoaHtmlContent = () => {
    const programTitle = getProgramTitle();
    const loaNum = candidate.loaNumber || 'LOA/PE-JBR/2026/088';
    const issueDate = candidate.loaIssueDate || new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

    return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Letter of Acceptance (LoA) - ${candidate.fullName}</title>
  <style>
    @media print {
      @page {
        size: A4 portrait;
        margin: 10mm;
      }
      body { margin: 0; padding: 0; background: #fff; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      .no-print { display: none !important; }
      .loa-card { border: 2px solid #991b1b !important; box-shadow: none !important; padding: 24px !important; margin: 0 auto !important; width: 100% !important; max-width: 100% !important; box-sizing: border-box !important; }
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      background-color: #f1f5f9;
      color: #0f172a;
      padding: 20px;
      margin: 0;
    }
    .no-print-bar {
      max-width: 800px;
      margin: 0 auto 20px auto;
      background: #0f172a;
      color: #fff;
      padding: 16px 20px;
      border-radius: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: system-ui, -apple-system, sans-serif;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .btn-action {
      background: #b91c1c;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: bold;
      cursor: pointer;
      font-size: 13px;
      margin-left: 8px;
    }
    .btn-action:hover {
      background: #991b1b;
    }
    .loa-card {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      padding: 48px;
      border: 2px solid #991b1b;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      position: relative;
      border-radius: 12px;
    }
    .header-table { width: 100%; border-collapse: collapse; border-bottom: 3px solid #991b1b; padding-bottom: 16px; }
    .title-red { color: #991b1b; font-size: 24px; font-weight: 900; margin: 0; font-family: system-ui, sans-serif; letter-spacing: -0.5px; }
    .subtitle-amber { color: #d97706; font-size: 12px; font-weight: bold; letter-spacing: 2px; margin-top: 2px; font-family: system-ui, sans-serif; }
    .address { font-size: 11px; color: #475569; font-family: system-ui, sans-serif; margin-top: 4px; }
    .meta-table { width: 100%; margin-top: 24px; font-size: 13px; font-family: system-ui, sans-serif; color: #334155; }
    .content-body { margin-top: 24px; font-size: 14px; line-height: 1.8; text-align: justify; color: #1e293b; }
    .candidate-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 18px; font-family: system-ui, sans-serif; font-size: 13px; margin: 20px 0; }
    .candidate-row { display: flex; margin-bottom: 8px; }
    .candidate-row:last-child { margin-bottom: 0; }
    .candidate-label { width: 180px; color: #64748b; font-weight: 500; }
    .candidate-value { font-weight: bold; color: #0f172a; flex: 1; }
    .footer-table { width: 100%; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 24px; font-family: system-ui, sans-serif; }
  </style>
</head>
<body>
  <div class="no-print-bar no-print">
    <div>
      <strong style="display:block; font-size: 15px; color: #fbbf24;">LETTER OF ACCEPTANCE (LoA) RESMI</strong>
      <span style="font-size: 12px; color: #cbd5e1;">LKP & Konsultan Pendidikan Prospect Education Cabang Jember</span>
    </div>
    <div>
      <button class="btn-action" onclick="window.print()">Cetak / Simpan PDF</button>
    </div>
  </div>

  <div class="loa-card">
    <table class="header-table">
      <tr>
        <td style="vertical-align: middle;">
          <h1 class="title-red">PROSPECT EDUCATION</h1>
          <div class="subtitle-amber">CABANG JEMBER - JAWA TIMUR</div>
          <div class="address">Jl. Balung-Jenggawah, Wetan Kali, Balung Lor, Kec. Balung, Kab. Jember | WA: 0823-3455-4396</div>
        </td>
        <td style="text-align: right; vertical-align: top;">
          <div style="background: #ecfdf5; border: 1px solid #a7f3d0; padding: 8px 12px; border-radius: 8px; font-size: 11px; color: #047857; text-align: right; font-family: system-ui, sans-serif;">
            <strong>LEGAL | AMAN | TERPERCAYA</strong><br>
            <span>NIB: 1284000392019</span>
          </div>
        </td>
      </tr>
    </table>

    <table class="meta-table">
      <tr>
        <td><strong>Nomor Surat:</strong> <span style="font-family: monospace; font-weight: bold; color: #991b1b;">${loaNum}</span></td>
        <td style="text-align: right;"><strong>Tanggal Terbit:</strong> ${issueDate}</td>
      </tr>
      <tr>
        <td><strong>Perihal:</strong> Surat Keterangan Penerimaan (Letter of Acceptance / LoA)</td>
        <td style="text-align: right;"><strong>Lokasi:</strong> Jember, Jawa Timur</td>
      </tr>
    </table>

    <div class="content-body">
      <p>Kepada Yth.<br>
      <strong style="font-size: 16px; color: #0f172a;">${candidate.fullName}</strong><br>
      Peserta Pendaftaran Prospect Education Cabang Jember</p>

      <p>Dengan hormat,</p>

      <p>Berdasarkan hasil verifikasi administrasi dokumen, kelayakan berkas, dan persetujuan Manajemen Prospect Education Cabang Jember, bersama ini kami menyatakan bahwa peserta di bawah ini:</p>

      <div class="candidate-box">
        <div class="candidate-row">
          <span class="candidate-label">Nama Lengkap:</span>
          <span class="candidate-value">${candidate.fullName}</span>
        </div>
        <div class="candidate-row">
          <span class="candidate-label">Nomor Registrasi:</span>
          <span class="candidate-value" style="color: #991b1b; font-family: monospace;">${candidate.registrationNumber}</span>
        </div>
        <div class="candidate-row">
          <span class="candidate-label">NIK:</span>
          <span class="candidate-value" style="font-family: monospace;">${candidate.biodata?.nik || '3509xxxxxxxxxxxx'}</span>
        </div>
        <div class="candidate-row">
          <span class="candidate-label">Program Diterima:</span>
          <span class="candidate-value" style="color: #92400e;">${programTitle}</span>
        </div>
        <div class="candidate-row">
          <span class="candidate-label">Status Penerimaan:</span>
          <span class="candidate-value" style="color: #047857;">RESMI DITERIMA (APPROVED)</span>
        </div>
      </div>

      <p>Secara resmi telah <strong>DITERIMA</strong> untuk mengikuti tahap pelatihan persiapan bahasa, pembentukan karakter, serta pengurusan dokumen keberangkatan di LKP & Konsultan Pendidikan Prospect Education Cabang Jember.</p>

      <p>Demikian Surat Keterangan Penerimaan ini diterbitkan secara sah dan resmi oleh Prospect Education untuk dipergunakan sebagaimana mestinya. Pengurusan visa luar negeri bekerja sama dengan VISA HUB INDONESIA.</p>
    </div>

    <table class="footer-table">
      <tr>
        <td style="width: 50%; vertical-align: top; padding-right: 12px;">
          <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; font-family: system-ui, sans-serif;">
            <div style="font-size: 10px; font-weight: bold; color: #0f3d7a; text-transform: uppercase;">PIHAK II: PENERIMA (PESERTA)</div>
            ${
              candidate.candidateSignature?.isSigned
                ? `<div style="margin-top: 8px; border: 1px solid #e2e8f0; background: #fff; border-radius: 6px; padding: 6px; text-align: center;">
                    ${
                      candidate.candidateSignature.signatureDataUrl
                        ? `<img src="${candidate.candidateSignature.signatureDataUrl}" style="max-height: 48px; object-fit: contain;" />`
                        : `<span style="font-style: italic; font-family: serif; color: #0f3d7a; font-weight: bold; font-size: 15px;">${candidate.fullName}</span>`
                    }
                   </div>
                   <div style="margin-top: 8px;">
                     <strong style="font-size: 12px; color: #0f172a;">${candidate.fullName}</strong><br>
                     <span style="font-size: 10px; color: #64748b; font-family: monospace;">NIK: ${candidate.biodata?.nik || '3509xxxxxxxxxxxx'}</span><br>
                     <span style="font-size: 10px; color: #64748b;">Tgl TTD: ${candidate.candidateSignature.signedAt}</span><br>
                     <span style="font-size: 9px; color: #047857; font-weight: bold;">[ TERTANDA TANGAN DIGITAL SAH ]</span>
                   </div>`
                : `<div style="margin-top: 8px; color: #64748b; font-size: 11px; font-style: italic;">
                    Peserta belum membubuhkan tanda tangan digital pada dokumen ini.
                   </div>
                   <div style="margin-top: 8px;">
                     <strong style="font-size: 12px; color: #0f172a;">${candidate.fullName}</strong><br>
                     <span style="font-size: 10px; color: #991b1b; font-weight: bold;">[ STATUS: PENDING E-SIGN ]</span>
                   </div>`
            }
          </div>
        </td>
        <td style="width: 50%; vertical-align: top; padding-left: 12px;">
          <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; font-family: system-ui, sans-serif;">
            <div style="font-size: 10px; font-weight: bold; color: #0f3d7a; text-transform: uppercase;">PIHAK I: PENYELENGGARA (PROSPECT)</div>
            <div style="margin-top: 8px; border: 1px solid #991b1b; background: #fff5f5; border-radius: 6px; padding: 6px; text-align: center;">
              <span style="font-size: 10px; font-weight: bold; color: #991b1b;">[ STEMPEL & TTD DIGITAL RESMI ]</span><br>
              <span style="font-size: 9px; font-family: monospace; color: #991b1b; font-weight: bold;">${candidate.adminSignature?.approvalCode || `PE-JBR-ADM-${candidate.registrationNumber.slice(-4)}`}</span>
            </div>
            <div style="margin-top: 8px;">
              <strong style="font-size: 12px; color: #0f172a;">${candidate.adminSignature?.signerName || 'Rohim Egy, S.Pd.'}</strong><br>
              <span style="font-size: 10px; color: #64748b;">${candidate.adminSignature?.signerTitle || 'Kepala Cabang Prospect Education Jember'}</span><br>
              <span style="font-size: 10px; color: #64748b;">Tgl Terbit: ${candidate.adminSignature?.signedAt || issueDate}</span><br>
              <span style="font-size: 9px; color: #047857; font-weight: bold;">[ VERIFIED & APPROVED BY ADMIN ]</span>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
  };

  // Handler 0: Direct Download via jsPDF
  const handleDownloadJsPdf = async () => {
    try {
      await downloadLoaPDF(candidate);
      showToast('Surat LoA PDF berhasil diunduh secara langsung dengan QR Code verifikasi!');
    } catch (err) {
      console.error('Error generating jsPDF LoA:', err);
      showToast('Gagal memproses PDF, mencoba fallback pencetakan browser...');
      handlePrintDirect();
    }
  };

  // Handler 1: Direct Download HTML Document
  const handleDownloadDoc = () => {
    const htmlContent = generateLoaHtmlContent();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeName = candidate.fullName.toLowerCase().replace(/\s+/g, '_');
    link.download = `Surat_LoA_Penerimaan_Prospect_${safeName}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('File Surat LoA resmi berhasil diunduh! Buka file ini lalu pilih "Cetak / Simpan PDF" di browser.');
  };

  // Handler 2: Open Printable Window (bypasses iframe print restrictions)
  const handleOpenPrintWindow = () => {
    const htmlContent = generateLoaHtmlContent();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
      showToast('Jendela pencetakan khusus dibuka. Anda dapat langsung memilih "Save as PDF"!');
    } else {
      showToast('Silakan izinkan popup browser Anda untuk membuka jendela cetak.');
    }
  };

  // Handler 3: Window print fallback
  const handlePrintDirect = () => {
    showToast('Membuka dialog pencetakan browser...');
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div className="space-y-6">
      {/* Toast Banner */}
      {toastMsg && (
        <div className="bg-slate-900 text-white border border-amber-500/50 p-4 rounded-2xl shadow-xl flex items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-300">Modul Pencetakan & Download LoA</p>
              <p className="text-[11px] text-slate-300">{toastMsg}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="bg-slate-900 text-white p-5 rounded-3xl flex flex-col lg:flex-row items-center justify-between gap-4 shadow-md print:hidden border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white">Surat Penerimaan Resmi (Letter of Acceptance / LoA)</h3>
              <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                Dokumen Sah
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Pilih opsi di bawah untuk mengunduh berkas fisik/PDF atau mencetak Surat LoA pendaftaran Anda.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <button
            onClick={() => setIsSignatureModalOpen(true)}
            className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition shadow-md cursor-pointer border border-amber-300"
            title="Bubuhkan tanda tangan digital peserta pada dokumen LoA"
          >
            <PenTool className="w-4 h-4 text-slate-950" />
            <span>{candidate.candidateSignature?.isSigned ? 'Perbarui TTD Digital' : 'Tanda Tangani LoA Digital'}</span>
          </button>

          <button
            onClick={() => setIsVerificationModalOpen(true)}
            className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 bg-blue-900 hover:bg-blue-800 text-amber-300 font-bold text-xs px-3.5 py-2.5 rounded-xl transition shadow-sm cursor-pointer border border-blue-700"
            title="Cek keaslian dokumen via QR Code & Sertifikat Digital"
          >
            <QrCode className="w-4 h-4 text-amber-300" />
            <span>Verifikasi Keaslian QR</span>
          </button>

          <button
            onClick={handleDownloadJsPdf}
            className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition shadow-sm cursor-pointer border border-slate-700"
            title="Unduh dokumen LoA resmi sebagai file PDF siap cetak Rapi (A4)"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>Unduh PDF LoA (A4 Rapi)</span>
          </button>

          <button
            onClick={handleDownloadDoc}
            className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2.5 rounded-xl transition shadow-sm cursor-pointer"
            title="Unduh file dokumen fisik resmi LoA (.HTML)"
          >
            <FileText className="w-4 h-4 text-emerald-300" />
            <span>Format HTML</span>
          </button>

          <button
            onClick={handleOpenPrintWindow}
            className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 bg-indigo-800 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-2.5 rounded-xl transition shadow-sm cursor-pointer"
            title="Buka halaman cetak di jendela baru"
          >
            <ExternalLink className="w-4 h-4 text-indigo-300" />
            <span>Jendela Cetak</span>
          </button>

          <button
            onClick={handlePrintDirect}
            className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2.5 rounded-xl transition shadow-sm cursor-pointer"
            title="Cetak langsung menggunakan sistem print browser"
          >
            <Printer className="w-4 h-4 text-slate-300" />
            <span>Cetak Browser</span>
          </button>
        </div>
      </div>

      {/* Guidance Note */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-3 text-xs text-amber-900 print:hidden">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p>
          <strong>Petunjuk Cetak / Download:</strong> Jika tombol <em>Cetak Langsung</em> terhalang oleh sistem pratinjau browser, gunakan tombol <strong>Unduh File LoA</strong> atau <strong>Cetak di Jendela Baru</strong> untuk menyimpan dokumen sebagai PDF asli resolusi tinggi secara mudah!
        </p>
      </div>

      {/* Printable Letter Body */}
      <div
        id="printable-loa-container"
        className="bg-white p-8 sm:p-12 rounded-3xl border-2 border-red-900 shadow-xl text-slate-900 max-w-3xl mx-auto space-y-6 font-serif relative overflow-hidden"
      >
        {/* Background Watermark Logo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <Plane className="w-96 h-96 -rotate-12 text-red-900" />
        </div>

        {/* Letterhead Header */}
        <div className="border-b-4 border-red-900 pb-4 flex items-center justify-between gap-4">
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
              <h1 className="text-xl sm:text-2xl font-black text-red-900 tracking-tight leading-none font-sans">
                PROSPECT EDUCATION
              </h1>
              <p className="text-xs font-bold text-amber-600 tracking-widest mt-0.5 uppercase font-sans">
                CABANG JEMBER - JAWA TIMUR
              </p>
              <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                Jl. Balung-Jenggawah, Wetan Kali, Balung Lor, Kec. Balung, Kab. Jember • WA: 0823-3455-4396
              </p>
            </div>
          </div>

          <div className="text-right text-[10px] font-sans font-bold text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200 shrink-0 hidden sm:block">
            <p>LEGAL | AMAN | TERPERCAYA</p>
            <p className="text-slate-500 font-normal">NIB: 1284000392019</p>
          </div>
        </div>

        {/* Letter Metadata */}
        <div className="flex flex-col sm:flex-row justify-between text-xs font-sans space-y-1 sm:space-y-0 text-slate-700">
          <div>
            <p>
              <span className="font-bold">Nomor Surat:</span>{' '}
              <span className="font-mono font-bold text-red-900">{candidate.loaNumber || 'LOA/PE-JBR/2026/088'}</span>
            </p>
            <p>
              <span className="font-bold">Perihal:</span> Surat Keterangan Penerimaan Peserta (Letter of Acceptance)
            </p>
          </div>
          <div className="sm:text-right">
            <p>
              <span className="font-bold">Tanggal Terbit:</span>{' '}
              {candidate.loaIssueDate || new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p>
              <span className="font-bold">Lokasi:</span> Jember, Jawa Timur
            </p>
          </div>
        </div>

        {/* Statement Body */}
        <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-800">
          <p>
            Kepada Yth. <br />
            <strong className="text-slate-900 text-sm font-sans">{candidate.fullName}</strong> <br />
            Peserta Pendaftaran Prospect Education Cabang Jember
          </p>

          <p>Dengan hormat,</p>

          <p className="text-justify">
            Berdasarkan hasil verifikasi administrasi dokumen, kelayakan berkas, dan persetujuan Manajemen Prospect Education Cabang Jember, bersama ini kami menyatakan bahwa peserta di bawah ini:
          </p>

          {/* Candidate Detail Card */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-sans space-y-2 text-xs">
            <div className="grid grid-cols-3">
              <span className="text-slate-500 font-medium">Nama Lengkap:</span>
              <span className="col-span-2 font-bold text-slate-900">{candidate.fullName}</span>
            </div>
            <div className="grid grid-cols-3">
              <span className="text-slate-500 font-medium">Nomor Registrasi:</span>
              <span className="col-span-2 font-mono font-bold text-red-800">{candidate.registrationNumber}</span>
            </div>
            <div className="grid grid-cols-3">
              <span className="text-slate-500 font-medium">NIK:</span>
              <span className="col-span-2 font-mono text-slate-800">{candidate.biodata?.nik || '3509xxxxxxxxxxxx'}</span>
            </div>
            <div className="grid grid-cols-3">
              <span className="text-slate-500 font-medium">Program Diterima:</span>
              <span className="col-span-2 font-bold text-amber-800">{getProgramTitle()}</span>
            </div>
            <div className="grid grid-cols-3">
              <span className="text-slate-500 font-medium">Status Penerimaan:</span>
              <span className="col-span-2 text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> RESMI DITERIMA (APPROVED)
              </span>
            </div>
          </div>

          <p className="text-justify">
            Secara resmi telah <strong>DITERIMA</strong> untuk mengikuti tahap pelatihan persiapan bahasa, pembentukan karakter, serta pengurusan dokumen keberangkatan di LKP & Konsultan Pendidikan Prospect Education Cabang Jember.
          </p>

          <p className="text-justify">
            Demikian Surat Keterangan Penerimaan ini diterbitkan secara sah dan resmi oleh Prospect Education untuk dipergunakan sebagaimana mestinya. Pengurusan visa luar negeri bekerja sama dengan VISA HUB INDONESIA.
          </p>
        </div>

        {/* Dual Digital Signatures Section */}
        <div className="pt-6 border-t border-slate-200 font-sans grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Column 1: Candidate Digital Signature (Pihak II) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between space-y-3 relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pihak II: Penerima (Peserta)</span>
                {candidate.candidateSignature?.isSigned ? (
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> E-Sign Sah
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Belum Ditandatangani
                  </span>
                )}
              </div>

              {candidate.candidateSignature?.isSigned ? (
                <div className="space-y-2">
                  <div className="bg-white border border-slate-200 rounded-xl p-2.5 flex items-center justify-center min-h-[56px]">
                    {candidate.candidateSignature.signatureDataUrl ? (
                      <img
                        src={candidate.candidateSignature.signatureDataUrl}
                        alt="Tanda Tangan Digital Peserta"
                        className="max-h-12 object-contain"
                      />
                    ) : (
                      <span className="font-serif italic text-base text-[#0F3D7A] font-bold border-b border-red-800 px-3">
                        {candidate.fullName}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-900">{candidate.fullName}</p>
                    <p className="text-[10px] text-slate-500 font-mono">NIK: {candidate.biodata?.nik || '3509xxxxxxxxxxxx'}</p>
                    <p className="text-[10px] text-slate-500">
                      Tgl TTD: <span className="font-semibold">{candidate.candidateSignature.signedAt}</span>
                    </p>
                    <p className="text-[9px] text-slate-400 font-mono mt-0.5 truncate" title={candidate.candidateSignature.hashVerification}>
                      {candidate.candidateSignature.hashVerification}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-3 space-y-2">
                  <p className="text-xs text-slate-600 font-medium">
                    Peserta belum membubuhkan tanda tangan digital pada dokumen ini.
                  </p>
                  <button
                    onClick={() => setIsSignatureModalOpen(true)}
                    className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer border border-amber-300"
                  >
                    <PenTool className="w-3.5 h-3.5 text-slate-950" />
                    <span>Tanda Tangani LoA Sekarang</span>
                  </button>
                </div>
              )}
            </div>

            <p className="text-[9px] text-slate-400 text-center border-t border-slate-200/80 pt-1.5">
              Tanda Tangan Digital Terverifikasi UU ITE
            </p>
          </div>

          {/* Column 2: Admin Digital Signature (Pihak I) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between space-y-3 relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pihak I: Penyelenggara (Prospect)</span>
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Terverifikasi Admin
                </span>
              </div>

              <div className="space-y-2">
                {/* Stamp Badge */}
                <div className="border border-red-800/40 bg-red-50/50 rounded-xl p-2 text-center">
                  <p className="text-[10px] font-black text-red-900 tracking-wider">[ STEMPEL & TTD DIGITAL RESMI ]</p>
                  <p className="text-[9px] font-mono text-red-800 font-bold">
                    {candidate.adminSignature?.approvalCode || `PE-JBR-ADM-${candidate.registrationNumber.slice(-4)}`}
                  </p>
                </div>

                <div>
                  <p className="font-bold text-xs text-slate-900">
                    {candidate.adminSignature?.signerName || 'Rohim Egy, S.Pd.'}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {candidate.adminSignature?.signerTitle || 'Kepala Cabang Prospect Education Jember'}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Tanggal Terbit: <span className="font-semibold">{candidate.adminSignature?.signedAt || candidate.loaIssueDate || '22 Juli 2026'}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200/80 pt-1.5 text-[9px] text-slate-400">
              <span>NIB: 1284000392019</span>
              <span className="font-mono text-emerald-700 font-bold">[ OFFICIAL APPROVED ]</span>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Signature Modal */}
      <DigitalSignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        candidate={candidate}
        onSaveSignature={handleSaveSignature}
      />

      {/* LoA Dynamic QR Verification Modal */}
      <LoaVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        candidates={candidates}
        initialCandidateId={candidate.id}
        initialLoaNumber={candidate.loaNumber}
      />
    </div>
  );
};
