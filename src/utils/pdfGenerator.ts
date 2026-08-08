import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { Candidate, LMSModule } from '../types';

/**
 * Helper to format program titles in Indonesian
 */
const getProgramTitle = (programKey?: string): string => {
  switch (programKey) {
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

/**
 * Downloads a clean, beautifully formatted Letter of Acceptance (LoA) PDF document.
 */
export const downloadLoaPDF = async (candidate: Candidate): Promise<void> => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const margin = 15;
  const contentWidth = pageWidth - margin * 2; // 180mm

  // Colors
  const navyColor: [number, number, number] = [15, 61, 122]; // #0F3D7A
  const darkRedColor: [number, number, number] = [153, 27, 27]; // #991B1B
  const textDark: [number, number, number] = [15, 23, 42]; // #0F172A
  const textMuted: [number, number, number] = [71, 85, 105]; // #475569
  const bgLight: [number, number, number] = [248, 250, 252]; // #F8FAFC
  const borderGrey: [number, number, number] = [203, 213, 225]; // #CBD5E1

  // Outer Decorative Frame
  doc.setLineWidth(0.8);
  doc.setDrawColor(...darkRedColor);
  doc.rect(margin - 5, margin - 5, contentWidth + 10, 267);

  // Inner Fine Frame Line
  doc.setLineWidth(0.2);
  doc.setDrawColor(...navyColor);
  doc.rect(margin - 3, margin - 3, contentWidth + 6, 263);

  let y = margin + 5;

  // --- KOP SURAT / HEADER ---
  // Header background badge
  doc.setFillColor(...bgLight);
  doc.roundedRect(margin, y, contentWidth, 26, 3, 3, 'F');

  // Logo Badge Box
  doc.setFillColor(...navyColor);
  doc.roundedRect(margin + 2, y + 2, 22, 22, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('PE', margin + 13, y + 15, { align: 'center' });

  // Title Text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...darkRedColor);
  doc.text('PROSPECT EDUCATION', margin + 28, y + 8);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(217, 119, 6); // Amber-600
  doc.text('CABANG JEMBER - JAWA TIMUR', margin + 28, y + 13);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textMuted);
  doc.text('Jl. Balung-Jenggawah, Wetan Kali, Balung Lor, Kec. Balung, Kab. Jember', margin + 28, y + 18);
  doc.text('NIB: 1284000392019  |  WhatsApp: 0823-3455-4396  |  Website: prospect-jember.id', margin + 28, y + 22);

  y += 28;

  // Header Divider Lines
  doc.setLineWidth(0.8);
  doc.setDrawColor(...darkRedColor);
  doc.line(margin, y, margin + contentWidth, y);
  y += 1.5;
  doc.setLineWidth(0.2);
  doc.setDrawColor(...navyColor);
  doc.line(margin, y, margin + contentWidth, y);

  y += 8;

  // --- DOCUMENT METADATA TABLE ---
  const loaNum = candidate.loaNumber || `LOA/PE-JBR/2026/${candidate.registrationNumber.slice(-4) || '0088'}`;
  const issueDate = candidate.loaIssueDate || new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textDark);
  doc.text('Nomor Surat:', margin, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkRedColor);
  doc.text(loaNum, margin + 25, y);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textDark);
  doc.text('Tanggal Terbit:', margin + 110, y);
  doc.setFont('helvetica', 'normal');
  doc.text(issueDate, margin + 135, y);

  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textDark);
  doc.text('Perihal:', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text('Surat Keterangan Penerimaan (Letter of Acceptance / LoA)', margin + 25, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Lokasi:', margin + 110, y);
  doc.setFont('helvetica', 'normal');
  doc.text('Jember, Jawa Timur', margin + 135, y);

  y += 10;

  // --- SALUTATION ---
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...textDark);
  doc.text('Kepada Yth.', margin, y);
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(candidate.fullName, margin, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text('Peserta Pendaftaran Prospect Education Cabang Jember', margin, y);

  y += 8;
  doc.text('Dengan hormat,', margin, y);

  y += 6;
  const p1 = 'Berdasarkan hasil verifikasi administrasi dokumen, kelayakan berkas, dan persetujuan Manajemen Prospect Education Cabang Jember, bersama ini kami menyatakan bahwa peserta di bawah ini:';
  const splitP1 = doc.splitTextToSize(p1, contentWidth);
  doc.text(splitP1, margin, y);

  y += splitP1.length * 4.5 + 4;

  // --- CANDIDATE DETAIL BOX ---
  const boxHeight = 44;
  doc.setFillColor(...bgLight);
  doc.setDrawColor(...borderGrey);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, boxHeight, 3, 3, 'FD');

  let boxY = y + 6;
  const labels = [
    { label: 'Nama Lengkap Peserta', value: candidate.fullName, isBold: true },
    { label: 'Nomor Registrasi', value: candidate.registrationNumber, isCode: true },
    { label: 'NIK / No. KTP', value: candidate.biodata?.nik || '3509xxxxxxxxxxxx' },
    { label: 'Program Pilihan', value: getProgramTitle(candidate.selectedProgram), isProgram: true },
    { label: 'Status Penerimaan', value: 'RESMI DITERIMA (APPROVED)', isApproved: true },
  ];

  labels.forEach((item) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...textMuted);
    doc.text(item.label, margin + 5, boxY);

    doc.text(':', margin + 45, boxY);

    if (item.isApproved) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(4, 120, 87); // Emerald-700
    } else if (item.isCode) {
      doc.setFont('courier', 'bold');
      doc.setTextColor(...darkRedColor);
    } else if (item.isProgram) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...navyColor);
    } else if (item.isBold) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...textDark);
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...textDark);
    }

    const valSplit = doc.splitTextToSize(item.value, contentWidth - 55);
    doc.text(valSplit[0], margin + 48, boxY);
    boxY += 7.5;
  });

  y += boxHeight + 8;

  // --- STATEMENT BODY ---
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...textDark);

  const p2 = 'Secara resmi telah DITERIMA untuk mengikuti tahap pelatihan persiapan bahasa, pembentukan karakter, serta pengurusan dokumen keberangkatan di LKP & Konsultan Pendidikan Prospect Education Cabang Jember.';
  const splitP2 = doc.splitTextToSize(p2, contentWidth);
  doc.text(splitP2, margin, y);
  y += splitP2.length * 4.5 + 4;

  const p3 = 'Demikian Surat Keterangan Penerimaan ini diterbitkan secara sah dan resmi oleh Prospect Education untuk dipergunakan sebagaimana mestinya. Pengurusan visa luar negeri bekerja sama dengan VISA HUB INDONESIA.';
  const splitP3 = doc.splitTextToSize(p3, contentWidth);
  doc.text(splitP3, margin, y);

  y += splitP3.length * 4.5 + 16;

  // --- DUAL DIGITAL SIGNATURE & STAMP FOOTER ---
  const footerY = Math.max(y, 202);

  const colWidth = (contentWidth - 10) / 2; // 85mm each

  // COLUMN 1: CANDIDATE DIGITAL SIGNATURE (LEFT)
  const leftX = margin;
  doc.setFillColor(...bgLight);
  doc.setDrawColor(...borderGrey);
  doc.setLineWidth(0.3);
  doc.roundedRect(leftX, footerY, colWidth, 48, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...navyColor);
  doc.text('PIHAK II: PENERIMA (PESERTA)', leftX + 4, footerY + 6);

  const candSig = candidate.candidateSignature;

  if (candSig && candSig.isSigned) {
    // If drawn image available, embed image
    if (candSig.signatureDataUrl && candSig.signatureDataUrl.startsWith('data:image')) {
      try {
        doc.addImage(candSig.signatureDataUrl, 'PNG', leftX + 15, footerY + 9, 50, 15);
      } catch {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(...darkRedColor);
        doc.text(`[ TTD Digital: ${candidate.fullName} ]`, leftX + 4, footerY + 18);
      }
    } else {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...darkRedColor);
      doc.text(`[ TTD Digital: ${candidate.fullName} ]`, leftX + 4, footerY + 18);
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...textDark);
    doc.text(candidate.fullName, leftX + 4, footerY + 28);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...textMuted);
    doc.text(`NIK: ${candidate.biodata?.nik || '3509xxxxxxxxxxxx'}`, leftX + 4, footerY + 33);
    doc.text(`Tgl TTD: ${candSig.signedAt}`, leftX + 4, footerY + 37);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(4, 120, 87); // Emerald
    doc.text('[ TERTANDA TANGAN DIGITAL SAH ]', leftX + 4, footerY + 43);
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(...textMuted);
    doc.text('Belum Ditandatangani Digital oleh Peserta.', leftX + 4, footerY + 16);
    doc.text('Silakan klik button "Tanda Tangani LoA"', leftX + 4, footerY + 22);
    doc.text('pada Portal Peserta Prospect Education.', leftX + 4, footerY + 27);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...textDark);
    doc.text(candidate.fullName, leftX + 4, footerY + 38);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...darkRedColor);
    doc.text('[ STATUS: PENDING E-SIGN ]', leftX + 4, footerY + 43);
  }

  // COLUMN 2: ADMIN OFFICIAL DIGITAL SIGNATURE & STAMP (RIGHT)
  const rightX = margin + colWidth + 10;
  doc.setFillColor(...bgLight);
  doc.setDrawColor(...borderGrey);
  doc.setLineWidth(0.3);
  doc.roundedRect(rightX, footerY, colWidth, 48, 3, 3, 'FD');

  const adminSig = candidate.adminSignature;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...navyColor);
  doc.text('PIHAK I: PENYELENGGARA (PROSPECT)', rightX + 4, footerY + 6);

  // Official Stamp & Digital Seal Box
  doc.setDrawColor(...darkRedColor);
  doc.setLineWidth(0.4);
  doc.roundedRect(rightX + 4, footerY + 9, colWidth - 8, 14, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...darkRedColor);
  doc.text('[ STEMPEL & TTD DIGITAL RESMI ]', rightX + 6, footerY + 15);
  doc.setFont('courier', 'bold');
  doc.setFontSize(6.5);
  doc.text(adminSig?.approvalCode || `PE-JBR-ADM-${candidate.registrationNumber.slice(-4)}`, rightX + 6, footerY + 20);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...textDark);
  doc.text(adminSig?.signerName || 'Rohim Egy, S.Pd.', rightX + 4, footerY + 28);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...textMuted);
  doc.text(adminSig?.signerTitle || 'Kepala Cabang Prospect Education Jember', rightX + 4, footerY + 33);
  doc.text(`Tgl Approval: ${adminSig?.signedAt || issueDate}`, rightX + 4, footerY + 37);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(4, 120, 87);
  doc.text('[ VERIFIED & APPROVED BY ADMIN ]', rightX + 4, footerY + 43);

  // Dynamic QR Code Generation & Embedding
  const verificationUrl = typeof window !== 'undefined' ? `${window.location.origin}?verifyLoa=${encodeURIComponent(loaNum)}` : `https://prospect-jember.id?verifyLoa=${encodeURIComponent(loaNum)}`;
  try {
    const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
      width: 200,
      margin: 1,
      color: { dark: '#0F3D7A', light: '#FFFFFF' },
    });
    // Draw QR code image on right bottom of footer box
    doc.addImage(qrDataUrl, 'PNG', rightX + colWidth - 19, footerY + 25, 15, 15);
  } catch (qrErr) {
    console.error('Failed to generate QR in PDF:', qrErr);
  }

  // Bottom Security Bar with QR Verification Info
  doc.setFillColor(...navyColor);
  doc.roundedRect(margin, footerY + 50, contentWidth, 7, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text('VERIFIKASI KEASLIAN DOKUMEN TERINTEGRASI VIA QR CODE - PROSPECT EDUCATION JEMBER', margin + 4, footerY + 54.5);

  // File download trigger
  const safeName = candidate.fullName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  doc.save(`Surat_LoA_Prospect_${safeName}.pdf`);
};

/**
 * Downloads a complete Student Profile & Enrollment Proof PDF document.
 */
export const downloadStudentProfilePDF = (candidate: Candidate, lmsModules?: LMSModule[]): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  const navyColor: [number, number, number] = [15, 61, 122]; // #0F3D7A
  const textDark: [number, number, number] = [15, 23, 42];
  const textMuted: [number, number, number] = [71, 85, 105];
  const bgLight: [number, number, number] = [248, 250, 252];
  const borderGrey: [number, number, number] = [203, 213, 225];

  let y = margin;

  // Header Banner
  doc.setFillColor(...navyColor);
  doc.roundedRect(margin, y, contentWidth, 22, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('PROSPECT EDUCATION CABANG JEMBER', margin + 6, y + 9);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(224, 242, 254); // sky-100
  doc.text('DOKUMEN PROFIL PESERTA & BUKTI REGISTRASI RESMI', margin + 6, y + 15);

  y += 28;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...navyColor);
  doc.text('I. BIODATA UTAMA PESERTA', margin, y);

  y += 4;
  doc.setLineWidth(0.4);
  doc.setDrawColor(...navyColor);
  doc.line(margin, y, margin + contentWidth, y);

  y += 6;

  // Biodata Table Box
  const bioItems = [
    { label: 'Nama Lengkap', val: candidate.fullName },
    { label: 'Nomor Registrasi', val: candidate.registrationNumber },
    { label: 'NIK / No. KTP', val: candidate.biodata?.nik || '-' },
    { label: 'Nomor Telepon / WA', val: candidate.biodata?.phoneWA || '-' },
    { label: 'Email Aktif', val: candidate.biodata?.email || candidate.email || '-' },
    { label: 'Tempat, Tgl Lahir', val: candidate.biodata?.birthPlace && candidate.biodata?.birthDate ? `${candidate.biodata.birthPlace}, ${candidate.biodata.birthDate}` : '-' },
    { label: 'Jenis Kelamin / Agama', val: `${candidate.biodata?.gender || '-'} / ${candidate.biodata?.religion || '-'}` },
    { label: 'Pendidikan Terakhir', val: candidate.biodata?.education ? `${candidate.biodata.education} ${candidate.biodata.major ? '(' + candidate.biodata.major + ')' : ''}` : '-' },
    { label: 'Alamat Domisili', val: candidate.biodata?.address ? `${candidate.biodata.address}, ${candidate.biodata.district || ''}, ${candidate.biodata.regency || ''}` : 'Kabupaten Jember' },
    { label: 'Orang Tua / Wali', val: candidate.biodata?.parentName ? `${candidate.biodata.parentName} (${candidate.biodata.parentJob || 'Orang Tua'}) - HP: ${candidate.biodata.parentPhone || '-'}` : '-' },
  ];

  doc.setFillColor(...bgLight);
  doc.setDrawColor(...borderGrey);
  doc.setLineWidth(0.2);
  const bioBoxHeight = bioItems.length * 6.5 + 4;
  doc.roundedRect(margin, y, contentWidth, bioBoxHeight, 2, 2, 'FD');

  let bioY = y + 5;
  bioItems.forEach((item) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...textMuted);
    doc.text(item.label, margin + 4, bioY);

    doc.text(':', margin + 45, bioY);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textDark);
    const splitVal = doc.splitTextToSize(item.val, contentWidth - 52);
    doc.text(splitVal[0], margin + 48, bioY);

    bioY += 6.5;
  });

  y += bioBoxHeight + 10;

  // Section II: Program & Status Pendaftaran
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...navyColor);
  doc.text('II. PROGRAM & STATUS PENDAFTARAN', margin, y);

  y += 4;
  doc.line(margin, y, margin + contentWidth, y);

  y += 6;

  const isLoaActive = candidate.status === 'loa_issued' || candidate.status === 'lms_active' || candidate.status === 'graduated' || !!candidate.loaNumber;

  const progItems = [
    { label: 'Program Diterima', val: getProgramTitle(candidate.selectedProgram) },
    { label: 'Status Pendaftaran', val: candidate.status.toUpperCase() },
    { label: 'Status Dokumen LoA', val: isLoaActive ? 'TERBIT & RESMI (APPROVED)' : 'MENUNGGU HAK OTORISASI' },
    { label: 'Laporan Keuangan DP', val: candidate.payments && candidate.payments.length > 0 ? `LUNAS (Rp ${candidate.payments[0].amount.toLocaleString('id-ID')})` : 'BELUM DIBAYAR' },
  ];

  doc.setFillColor(...bgLight);
  const progBoxHeight = progItems.length * 7 + 4;
  doc.roundedRect(margin, y, contentWidth, progBoxHeight, 2, 2, 'FD');

  let progY = y + 5;
  progItems.forEach((item) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...textMuted);
    doc.text(item.label, margin + 4, progY);

    doc.text(':', margin + 45, progY);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textDark);
    const splitVal = doc.splitTextToSize(item.val, contentWidth - 52);
    doc.text(splitVal[0], margin + 48, progY);

    progY += 7;
  });

  y += progBoxHeight + 10;

  // Section III: LMS & Verifikasi Berkas
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...navyColor);
  doc.text('III. RINGKASAN VERIFIKASI DOKUMEN & LMS', margin, y);

  y += 4;
  doc.line(margin, y, margin + contentWidth, y);

  y += 6;

  const docCount = candidate.documents?.length || 0;
  const verifiedCount = candidate.documents?.filter((d) => d.status === 'verified').length || 0;
  const completedLms = lmsModules?.filter((m) => m.isCompleted).length || 0;
  const totalLms = lmsModules?.length || 0;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...borderGrey);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...textDark);
  doc.text(`- Verifikasi Dokumen Digital: ${verifiedCount} dari ${docCount} Dokumen Terverifikasi Admin`, margin + 5, y + 8);
  doc.text(`- Progres Pembelajaran LMS: ${completedLms} dari ${totalLms} Modul Diselesaikan`, margin + 5, y + 16);

  y += 32;

  // Footer / Sign Off
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...textMuted);
  doc.text(`Dicetak dari Portal Peserta Prospect Education Jember pada: ${new Date().toLocaleString('id-ID')}`, margin, y);

  y += 10;

  // Signature right
  const rightX = margin + 115;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...textDark);
  doc.text('Jember, ' + new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }), rightX, y);
  doc.setFont('helvetica', 'bold');
  doc.text('Prospect Education Cabang Jember', rightX, y + 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Rohim Egy, S.Pd.', rightX, y + 25);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...textMuted);
  doc.text('Kepala Cabang', rightX, y + 29);

  const safeName = candidate.fullName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  doc.save(`Profil_Peserta_Prospect_${safeName}.pdf`);
};
