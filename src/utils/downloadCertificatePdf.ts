import { Candidate, LMSModule, WebsiteSettings } from '../types';

export const downloadCertificatePDF = (
  candidate: Candidate,
  modules: LMSModule[],
  settings?: WebsiteSettings
) => {
  const completedCount = modules.filter((m) => m.isCompleted).length;
  const totalCount = modules.length;
  const certNo =
    candidate.certificateNumber ||
    `CERT/PE-JBR/${candidate.selectedProgram ? candidate.selectedProgram.toUpperCase() : 'LMS'}/2026/088`;
  const issueDate = candidate.superAdminApprovalDate || candidate.registeredAt || '24 Juli 2026';

  const siteName = settings?.siteName || 'PROSPECT EDUCATION CABANG JEMBER';
  const officeAddress =
    settings?.officeAddress ||
    'Jl. Balung-Jenggawah, Wetan Kali, Balung Lor, Kec. Balung, Kabupaten Jember, Jawa Timur 68161';
  const csPhoneWhatsApp = settings?.csPhoneWhatsApp || '0823-3455-4396';
  const contactEmail = settings?.contactEmail || 'info@prospect-jember.id';
  const officialSignatoryName = settings?.officialSignatoryName || 'Rohim Egy, S.Pd.';
  const officialSignatoryTitle =
    settings?.officialSignatoryTitle || 'Kepala Cabang Prospect Education Jember';

  const programTitle =
    candidate.selectedProgram === 'taiwan_ifp'
      ? 'Program Taiwan IFP 1+4 (S1 Beasiswa Subsidized - 1 Thn Bahasa + 4 Thn S1)'
      : candidate.selectedProgram === 'taiwan_4_1'
      ? 'Program Taiwan 4+1 (4 Thn S1 + 1 Thn S2 Pascasarjana)'
      : candidate.selectedProgram === 'japan_im'
      ? 'Program Magang Kerja Jepang IM Japan (Kemnaker RI)'
      : candidate.selectedProgram === 'japan_ssw'
      ? 'Program Kerja Jepang Tokutei Ginou (SSW)'
      : 'Program Pembekalan & Orientasi Prospect Education';

  const nikStr = candidate.biodata?.nik || (candidate as any).nik || '-';
  const phoneStr = candidate.biodata?.phoneWA || (candidate as any).phoneWA || (candidate as any).phone || '-';
  const addressStr = candidate.biodata?.address
    ? `${candidate.biodata.address}${candidate.biodata.district ? ', Kec. ' + candidate.biodata.district : ''}${candidate.biodata.regency ? ', ' + candidate.biodata.regency : ''}`
    : (candidate as any).city || 'Jember';

  const certContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Sertifikat_Digital_${candidate.fullName.replace(/\s+/g, '_')}</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 6mm;
    }
    * {
      box-sizing: border-box;
    }
    body {
      font-family: 'Times New Roman', Georgia, serif;
      background-color: #ffffff;
      color: #0f172a;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .cert-container {
      border: 6px double #b45309;
      background: #ffffff;
      padding: 16px 24px;
      position: relative;
      border-radius: 8px;
    }
    .cert-border-inner {
      border: 2px solid #d97706;
      padding: 14px 20px;
      border-radius: 4px;
      background: linear-gradient(180deg, #fffdfa 0%, #ffffff 100%);
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #991b1b;
      padding-bottom: 8px;
      margin-bottom: 10px;
    }
    .org-title {
      font-size: 9pt;
      font-weight: bold;
      color: #7f1d1d;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-bottom: 2px;
      font-family: Arial, sans-serif;
    }
    .brand-title {
      font-size: 16pt;
      font-weight: bold;
      color: #991b1b;
      margin: 0;
      letter-spacing: -0.5px;
      text-transform: uppercase;
    }
    .subbrand {
      font-size: 8pt;
      color: #475569;
      font-family: Arial, sans-serif;
      margin-top: 2px;
      line-height: 1.3;
    }
    .cert-title-box {
      text-align: center;
      margin: 8px 0 6px 0;
    }
    .cert-main-title {
      font-size: 18pt;
      font-weight: bold;
      color: #b45309;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 0;
    }
    .cert-subtitle {
      font-size: 9pt;
      font-style: italic;
      color: #64748b;
      margin-top: 2px;
    }
    .cert-no {
      font-family: 'Courier New', Courier, monospace;
      font-size: 9pt;
      font-weight: bold;
      color: #0f172a;
      margin-top: 4px;
      display: inline-block;
      background: #f1f5f9;
      padding: 1px 10px;
      border-radius: 10px;
      border: 1px solid #cbd5e1;
    }
    .recipient-block {
      text-align: center;
      margin: 8px 0;
    }
    .p-lead {
      font-size: 9.5pt;
      color: #334155;
      margin: 0 0 4px 0;
    }
    .candidate-name {
      font-size: 20pt;
      font-weight: bold;
      color: #991b1b;
      border-bottom: 2px solid #b45309;
      display: inline-block;
      padding: 0 16px 2px 16px;
      margin: 2px 0 4px 0;
      text-transform: uppercase;
    }
    .candidate-meta {
      font-family: Arial, sans-serif;
      font-size: 8.5pt;
      color: #334155;
      background: #f8fafc;
      padding: 4px 10px;
      border-radius: 6px;
      display: inline-block;
      border: 1px solid #e2e8f0;
    }
    .statement {
      text-align: center;
      font-size: 9.5pt;
      line-height: 1.4;
      color: #1e293b;
      max-width: 95%;
      margin: 8px auto;
      font-family: Arial, sans-serif;
    }
    .summary-card {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 8px 12px;
      margin: 8px 0;
      font-family: Arial, sans-serif;
    }
    .summary-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
      margin-bottom: 6px;
    }
    .summary-card-title {
      font-size: 8.5pt;
      font-weight: bold;
      color: #991b1b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .summary-card-badge {
      font-size: 8pt;
      font-weight: bold;
      color: #15803d;
      background: #f0fdf4;
      padding: 2px 6px;
      border-radius: 8px;
      border: 1px solid #bbf7d0;
    }
    table.modules-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8pt;
    }
    table.modules-table th {
      background-color: #f8fafc;
      color: #334155;
      text-align: left;
      padding: 4px 6px;
      border: 1px solid #cbd5e1;
      font-weight: bold;
    }
    table.modules-table td {
      padding: 3px 6px;
      border: 1px solid #cbd5e1;
      color: #0f172a;
    }
    .footer-signatures {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 14px;
      font-family: Arial, sans-serif;
    }
    .sig-box {
      text-align: center;
      width: 200px;
    }
    .sig-title {
      font-size: 8pt;
      color: #64748b;
      margin-bottom: 25px;
    }
    .sig-name {
      font-size: 9pt;
      font-weight: bold;
      color: #0f172a;
      border-top: 1px solid #94a3b8;
      padding-top: 3px;
    }
    .seal-qr {
      text-align: center;
      background: #fffbe2;
      border: 2px dashed #d97706;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 7.5pt;
      color: #78350f;
    }
    @media print {
      body {
        background: none;
        padding: 0;
      }
      .cert-container {
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="cert-container">
    <div class="cert-border-inner">
      <!-- Kop Surat LKP -->
      <div class="header">
        <div class="org-title">LEMBAGA PELATIHAN KERJA (LPK) & KONSULTAN PENDIDIKAN</div>
        <div class="brand-title">${siteName}</div>
        <div class="subbrand">
          ${officeAddress}<br/>
          Email: ${contactEmail} • Website: prospect-jember.id
        </div>
      </div>

      <!-- Judul Sertifikat -->
      <div class="cert-title-box">
        <div class="cert-main-title">SERTIFIKAT KELULUSAN MATRIKULASI</div>
        <div class="cert-subtitle">Certificate of Completion & Orientation Program</div>
        <div class="cert-no">NO. SERI: ${certNo}</div>
      </div>

      <!-- Nama Recipient / Peserta -->
      <div class="recipient-block">
        <div class="p-lead">Diberikan kepada peserta pelatihan (This is to certify that):</div>
        <div class="candidate-name">${candidate.fullName.toUpperCase()}</div>
        <div class="candidate-meta">
          <strong>No. Registrasi:</strong> ${candidate.registrationNumber} &nbsp;|&nbsp; 
          <strong>NIK:</strong> ${nikStr} &nbsp;|&nbsp; 
          <strong>Program:</strong> ${programTitle}
        </div>
      </div>

      <!-- Pernyataan Kelulusan -->
      <div class="statement">
        Telah dinyatakan <strong>LULUS & MEMUASKAN</strong> dalam menyelesaikan seluruh rangkaian 
        <strong>Modul Pelatihan LMS & Pembekalan Vokasi / Budaya Kerja Luar Negeri</strong> 
        berjumlah <strong>${completedCount} dari ${totalCount} Modul Utama</strong> dengan Predikat 
        <strong>SANGAT MEMUASKAN (Grade A - Distinction)</strong> di ${siteName}.
      </div>

      <!-- PDF Summary Card -->
      <div class="summary-card">
        <div class="summary-card-header">
          <div class="summary-card-title">PDF Summary Card: Ringkasan Modul & Hasil Evaluasi</div>
          <div class="summary-card-badge">${completedCount}/${totalCount} Modul Selesai (${Math.round((completedCount / totalCount) * 100)}%)</div>
        </div>
        <table class="modules-table">
          <thead>
            <tr>
              <th style="width:30px; text-align:center;">No</th>
              <th>Nama Modul Pembelajaran</th>
              <th style="width:100px;">Tipe Konten</th>
              <th style="width:90px;">Durasi</th>
              <th style="width:120px; text-align:center;">Status Evaluasi</th>
            </tr>
          </thead>
          <tbody>
            ${modules
              .map(
                (m, idx) => `
              <tr>
                <td style="text-align:center; font-family:monospace;">${idx + 1}</td>
                <td><strong>${m.title}</strong></td>
                <td style="text-transform:uppercase; font-size:8pt;">${m.contentType}</td>
                <td>${m.durationMinutes} Menit</td>
                <td style="text-align:center; color:${m.isCompleted ? '#15803d' : '#b45309'}; font-weight:bold;">
                  ${m.isCompleted ? '✓ SELESAI' : 'PROSES'}
                </td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>

      <!-- Tanda Tangan & Legalisasi Digital -->
      <div class="footer-signatures">
        <div class="sig-box">
          <div class="sig-title">Tim Akademik & Instruktur Utama</div>
          <div class="sig-name">Siti Aminah, S.Pd.</div>
        </div>

        <div class="seal-qr">
          <div style="font-weight:bold; font-size:8.5pt; margin-bottom:2px; color:#78350f;">VERIFIKASI RESMI DIGITAL</div>
          <div>QR Verifikasi: ${candidate.id}</div>
          <div>Diterbitkan: ${issueDate}</div>
          <div style="font-weight:bold; color:#991b1b; margin-top:3px; text-transform:uppercase;">${siteName}</div>
        </div>

        <div class="sig-box">
          <div class="sig-title">${officialSignatoryTitle}</div>
          <div class="sig-name">${officialSignatoryName}</div>
        </div>
      </div>
    </div>
  </div>
  <script>
    window.addEventListener('DOMContentLoaded', function() {
      setTimeout(function() {
        window.print();
      }, 350);
    });
  </script>
</body>
</html>`;

  const blob = new Blob([certContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  const win = window.open(url, '_blank');
  if (win) {
    win.focus();
  } else {
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sertifikat_Digital_${candidate.fullName.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};
