// Utility to generate and download official IFP 1+4 Program PDF Guide

export const downloadIFPGuidePDF = () => {
  const guideContent = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Panduan_Lengkap_Taiwan_IFP_1+4_Prospect_Education_Jember</title>
  <style>
    @page {
      size: A4;
      margin: 15mm;
    }
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      color: #1e293b;
      line-height: 1.5;
      font-size: 11pt;
      margin: 0;
      padding: 20px;
      background: #ffffff;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 3px double #991b1b;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    .brand {
      color: #991b1b;
      font-size: 18pt;
      font-weight: bold;
      letter-spacing: -0.5px;
    }
    .subbrand {
      font-size: 10pt;
      color: #64748b;
      font-weight: normal;
    }
    .badge {
      background: #991b1b;
      color: #fef08a;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 9pt;
      font-weight: bold;
      text-transform: uppercase;
    }
    .title-box {
      background: #f8fafc;
      border-left: 4px solid #991b1b;
      padding: 12px 16px;
      margin-bottom: 20px;
      border-radius: 0 8px 8px 0;
    }
    .title-box h1 {
      margin: 0 0 4px 0;
      font-size: 15pt;
      color: #0f172a;
    }
    .title-box p {
      margin: 0;
      font-size: 9.5pt;
      color: #475569;
    }
    .section-title {
      font-size: 12pt;
      font-weight: bold;
      color: #991b1b;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
      margin-top: 18px;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .grid {
      display: flex;
      gap: 15px;
      margin-bottom: 15px;
    }
    .col {
      flex: 1;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px;
    }
    ul, ol {
      margin: 0;
      padding-left: 20px;
    }
    li {
      margin-bottom: 6px;
      font-size: 10pt;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
      font-size: 9.5pt;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 8px;
      text-align: left;
    }
    th {
      background: #0f172a;
      color: #ffffff;
      font-weight: bold;
    }
    tr:nth-child(even) {
      background: #f1f5f9;
    }
    .benefit-tag {
      display: inline-block;
      background: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 8.5pt;
      margin-right: 4px;
      margin-bottom: 4px;
      font-weight: bold;
    }
    .footer {
      margin-top: 30px;
      border-top: 1px solid #e2e8f0;
      padding-top: 12px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 8.5pt;
      color: #64748b;
    }
    .stamp {
      text-align: right;
    }
    .stamp-box {
      border: 1px dashed #991b1b;
      padding: 8px 14px;
      display: inline-block;
      color: #991b1b;
      font-weight: bold;
      border-radius: 6px;
      margin-top: 8px;
      background: #fef2f2;
    }
    @media print {
      @page {
        size: A4 portrait;
        margin: 10mm;
      }
      body { padding: 0; background: #ffffff; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>

  <div className="no-print" style="background: #0f172a; color: white; padding: 12px 20px; border-radius: 8px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
    <div>
      <strong>📄 Dokumen Panduan Resmi (PDF Ready)</strong>
      <div style="font-size: 11px; color: #cbd5e1;">Aplikasi Siap Cetak / Simpan sebagai PDF dari Browser Anda</div>
    </div>
    <button onclick="window.print()" style="background: #dc2626; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer;">
      🖨️ Cetak / Simpan sebagai PDF
    </button>
  </div>

  <div class="header">
    <div>
      <div class="brand">PROSPECT EDUCATION</div>
      <div class="subbrand">Lembaga Pelatihan & Konsultan Pendidikan Luar Negeri — Cabang Jember</div>
    </div>
    <div class="badge">Official PDF Guide 2026</div>
  </div>

  <div class="title-box">
    <h1>🇹🇼 PANDUAN LENGKAP & SYARAT PROGRAM TAIWAN IFP 1+4</h1>
    <p>International Foundation Program (1 Tahun Persiapan Bahasa di Taiwan + 4 Tahun Perkuliahan S1 & Magang Industri Legal)</p>
  </div>

  <div class="section-title">1. Ringkasan & Struktur Program IFP 1+4</div>
  <p style="font-size: 10pt; color: #334155;">
    Program IFP 1+4 (International Foundation Program) merupakan jalur resmi Kementerian Pendidikan Taiwan untuk calon mahasiswa internasional. Program ini didesain khusus bagi lulusan SMA/SMK/MA tanpa syarat sertifikat bahasa Mandarin (TOCFL). Siswa dibekali Bahasa Mandarin Basic, Bahasa Inggris Basic, dan Pengenalan Budaya Taiwan di Prospect Education Jember hingga meraih Sertifikat Bahasa Resmi Prospect. Bahasa Mandarin akademik akan dipelajari selama 1 tahun pertama di Taiwan.
  </p>

  <div class="grid">
    <div class="col">
      <strong style="color: #991b1b; font-size: 10.5pt;">Tahun Ke-1: Persiapan Bahasa di Taiwan</strong>
      <p style="font-size: 9.5pt; margin: 4px 0 0 0; color: #475569;">
        Penguatan General Chinese & Academic Mandarin langsung di kampus Taiwan selama 1 tahun pertama.
      </p>
    </div>
    <div class="col">
      <strong style="color: #065f46; font-size: 10.5pt;">Tahun Ke-2 s/d Ke-5: Perkuliahan S1</strong>
      <p style="font-size: 9.5pt; margin: 4px 0 0 0; color: #475569;">
        Studi Sarjana S1 selama 4 tahun + Magang Industri Berbayar (Work-Study Permit resmi hingga 20 jam/minggu & full-time saat libur).
      </p>
    </div>
  </div>

  <div class="section-title">2. Persyaratan Utama Pendaftaran (Eligibility)</div>
  <ul>
    <li><strong>Pendidikan Minimal:</strong> Lulusan SMA / SMK / MA / Paket C sederajat (Usia 17 - 24 Tahun).</li>
    <li><strong>Rata-Rata Nilai Rapor:</strong> Minimal 70.0 (Semester 1 s/d 5 atau Nilai Ijazah).</li>
    <li><strong>Sertifikat Bahasa:</strong> Tidak diwajibkan sertifikat TOCFL. Peserta dibekali Bahasa Mandarin Basic, Inggris Basic, & Budaya Taiwan di Prospect Jember lalu mendapat Sertifikat Bahasa dari Prospect Education.</li>
    <li><strong>Kondisi Kesehatan:</strong> Bebas TBC, Hepatitis B, HIV, dan gangguan kesehatan berat (Lolos MCU).</li>
    <li><strong>Bebas Catatan Kriminal:</strong> Memiliki SKCK Aktif (Tujuan Luar Negeri).</li>
    <li><strong>Komitmen Pembekalan:</strong> Bersedia mengikuti pembekalan di Prospect Education Jember sebelum keberangkatan.</li>
  </ul>

  <div class="section-title">3. Berkas Persyaratan Administrasi (Dokumen Checklist)</div>
  <table>
    <thead>
      <tr>
        <th style="width: 5%;">No</th>
        <th style="width: 35%;">Nama Dokumen Fisik</th>
        <th style="width: 25%;">Jumlah Berkas</th>
        <th>Keterangan Tambahan</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>Ijazah / SKL SMA/SMK/MA</td>
        <td>Asli + 5 Lembar Legalisir</td>
        <td>Dilegalisir Sekolah / Dinas Pendidikan</td>
      </tr>
      <tr>
        <td>2</td>
        <td>Transkrip Nilai / Rapor Sem 1-5</td>
        <td>Asli + 3 Lembar Legalisir</td>
        <td>Dilegalisir Kepala Sekolah</td>
      </tr>
      <tr>
        <td>3</td>
        <td>KTP Peserta & Orang Tua</td>
        <td>3 Lembar Fotokopi</td>
        <td>Jelas & tidak terpotong</td>
      </tr>
      <tr>
        <td>4</td>
        <td>Kartu Keluarga (KK) & Akta Lahir</td>
        <td>Asli + 3 Lembar Fotokopi</td>
        <td>Dilegalisir Disdukcapil</td>
      </tr>
      <tr>
        <td>5</td>
        <td>SKCK Polda / Polres Aktif</td>
        <td>Asli + 2 Lembar Legalisir</td>
        <td>Keperluan: Kuliah ke Taiwan</td>
      </tr>
      <tr>
        <td>6</td>
        <td>Pasfoto Formal 3x4 & 4x6</td>
        <td>Masing-Masing 6 Lembar</td>
        <td>Background Putih, Kemeja Berkerah</td>
      </tr>
      <tr>
        <td>7</td>
        <td>Surat Izin Orang Tua Bermaterai</td>
        <td>1 Lembar Asli</td>
        <td>Materai Rp 10.000 Ditandatangani Ortus</td>
      </tr>
    </tbody>
  </table>

  <div class="section-title">4. Fasilitas & Keuntungan Utama</div>
  <div style="margin-bottom: 12px;">
    <span class="benefit-tag">🎓 1 Thn Persiapan Bahasa di Taiwan + 4 Thn S1</span>
    <span class="benefit-tag">📜 Sertifikat Bahasa & Pembekalan Resmi Prospect Education</span>
    <span class="benefit-tag">💼 Gaji Magang Industri Sesuai UMR Taiwan (NT$ 27.470/bln)</span>
    <span class="benefit-tag">🏠 Subsidi Asrama Mahasiswa Kampus</span>
    <span class="benefit-tag">✈️ Pendampingan Visa & Flight Jember - Taiwan</span>
    <span class="benefit-tag">📜 Ijazah S1 Diakui Internasional & Kemendikbudristek</span>
  </div>

  <div class="section-title">5. Alur Seleksi & Keberangkatan Cabang Jember</div>
  <ol>
    <td><strong>Pendaftaran & Verifikasi Berkas:</strong> Pengisian form & penyerahan berkas fisik di Kantor Balung Jember.</td>
    <td><strong>Pelatihan Bahasa Mandarin dasar:</strong> Pembekalan intensif di LKP Prospect Education Jember.</td>
    <td><strong>Penerbitan Surat Penerimaan (LoA):</strong> Resmi dikirimkan oleh Kampus Mitra Taiwan.</td>
    <td><strong>Pengurusan Visa Pelajar & Medical Check-Up:</strong> Proses visa bekerja sama dengan VISA HUB INDONESIA.</td>
    <td><strong>Pelepasan & Keberangkatan:</strong> Penerbangan ke Taiwan dari Bandara Internasional.</td>
  </ol>

  <div class="footer">
    <div>
      <strong>LKP & Konsultan Pendidikan Prospect Education Cabang Jember</strong><br>
      Mitra Pengurusan Visa: VISA HUB INDONESIA<br>
      Jl. Balung-Jenggawah, Wetan Kali, Balung Lor, Kec. Balung, Kabupaten Jember, Jawa Timur 68161<br>
      Hotline WhatsApp: 0823-3455-4396 | Website: prospect-jember.id
    </div>
    <div class="stamp">
      <div style="font-size: 8pt; color: #475569;">Disahkan oleh:</div>
      <div class="stamp-box">
        ROHIM EGY<br>
        <span style="font-size: 7.5pt; font-weight: normal; color: #64748b;">Kepala Cabang Prospect Jember</span>
      </div>
    </div>
  </div>

  <script>
    // Auto trigger print when loaded in a new tab if desired
    window.onload = function() {
      // setTimeout(() => window.print(), 500);
    }
  </script>
</body>
</html>
  `;

  // Create HTML blob and initiate download or open printable window
  const blob = new Blob([guideContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);

  // Open in a new tab formatted for PDF print/download
  const win = window.open(url, '_blank');
  if (win) {
    win.focus();
  } else {
    // Fallback direct download if popups are blocked
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Panduan_Lengkap_Taiwan_IFP_1+4_Prospect_Jember.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};
