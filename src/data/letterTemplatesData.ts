import { LetterheadConfig, LetterTemplate, IssuedLetter } from '../types';

export const DEFAULT_LETTERHEAD_CONFIG: LetterheadConfig = {
  institutionName: 'LKP & CONSULTANT PROSPECT EDUCATION',
  institutionSubName: 'LEMBAGA PELATIHAN KERJA & KONSULTAN PENDIDIKAN TAIWAN - JEPANG',
  legalLicense: 'Izin Operasional Dinas Pendidikan No: 421.9/108/35.09/2024 | VIN Kemenaker: 2408350102',
  address: 'Jl. Kalimantan No. 36, Kampus Tegalboto, Sumbersari, Jember, Jawa Timur 68121',
  phone: '+62 331 321889',
  whatsapp: '+62 812-3456-7890',
  email: 'info@prospektus-education.id',
  website: 'https://prospektus-education.id',
  logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=200',
  sealUrl: '',
  headerLineStyle: 'double',
  primaryColor: '#1e3a8a',
  cityIssued: 'Jember',
  defaultSignerName: 'Rohim Egy P., S.Pd., M.M.',
  defaultSignerTitle: 'Kepala Cabang & Direktur Operasional',
  defaultSignerNip: 'NIP. 19880412 201201 1 004',
  signatureUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=RE',
  stempelUrl: '',
  enableQrVerification: true,
  qrPosition: 'bottom_footer',
  qrVerificationBaseUrl: 'https://prospektus-education.id/verify-letter',
  qrLabelText: 'VERIFIKASI KEASLIAN DOKUMEN',
  enableDigitalHash: true,
};

export const DEFAULT_LETTER_TEMPLATES: LetterTemplate[] = [
  {
    id: 'tpl-loa-01',
    title: 'Surat Keterangan Penerimaan Peserta (Letter of Acceptance / LoA)',
    code: 'LOA',
    category: 'LoA',
    subject: 'Surat Penerimaan Resmi Peserta Didik Baru (Letter of Acceptance)',
    numberFormat: '{SEQ}/PROSPECT-JBR/LoA/{MM}/{YYYY}',
    bodyContent: `<p>Berdasarkan hasil seleksi berkas administrasi dan wawancara kualifikasi yang telah dilaksanakan oleh Tim Penerimaan LKP Prospect Education Jember, dengan ini menerangkan secara resmi bahwa:</p>

<table style="width:100%; border:1px solid #cbd5e1; margin:14px 0; border-collapse:collapse;">
  <tbody>
    <tr><td style="width:30%; padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">Nama Lengkap</td><td style="padding:8px; border:1px solid #cbd5e1;">{NAMA_SISWA}</td></tr>
    <tr><td style="padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">No. Registrasi / ID</td><td style="padding:8px; border:1px solid #cbd5e1;">{NOMOR_REGISTRASI}</td></tr>
    <tr><td style="padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">NIK / No. Paspor</td><td style="padding:8px; border:1px solid #cbd5e1;">{NIK} / {NO_PASPOR}</td></tr>
    <tr><td style="padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">Tempat, Tgl Lahir</td><td style="padding:8px; border:1px solid #cbd5e1;">{TEMPAT_LAHIR}, {TANGGAL_LAHIR}</td></tr>
    <tr><td style="padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">Pilihan Program</td><td style="padding:8px; border:1px solid #cbd5e1; font-weight:bold; color:#1e3a8a;">{PROGRAM}</td></tr>
    <tr><td style="padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">Instansi/Univ. Tujuan</td><td style="padding:8px; border:1px solid #cbd5e1; font-weight:bold;">{UNIVERSITAS_TUJUAN} ({NEGARA_TUJUAN})</td></tr>
    <tr><td style="padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">Est. Keberangkatan</td><td style="padding:8px; border:1px solid #cbd5e1;">{TANGGAL_KEBERANGKATAN}</td></tr>
  </tbody>
</table>

<p>Dinyatakan <strong>LULUS SELEKSI & DITERIMA</strong> sebagai Peserta Didik Resmi pada LKP Prospect Education Cabang Jember untuk periode akademik {TAHUN_AKADEMIK}.</p>

<p>Peserta yang bersangkutan diwajibkan untuk mengikuti seluruh tahapan pembekalan bahasa, diklat vokasi intensif, serta melengkapi persyaratan dokumen keberangkatan sesuai jadwal yang ditetapkan lembaga.</p>`,
    signerName: 'Rohim Egy P., S.Pd., M.M.',
    signerTitle: 'Kepala Cabang Prospect Education Jember',
    signerNip: 'NIP. 19880412 201201 1 004',
    styleConfig: {
      fontFamily: 'georgia',
      fontSize: '11.5pt',
      lineHeight: '1.6',
      paddingTop: '32px',
      paddingBottom: '32px',
      paddingLeft: '36px',
      paddingRight: '36px',
      customCss: `/* Custom LoA Letter Styles */
.printable-content h2 { color: #1e3a8a; letter-spacing: 0.05em; }
.printable-content p { text-align: justify; margin-bottom: 0.8em; }
.printable-content table td { border-color: #cbd5e1; }`,
    },
    updatedAt: '2026-08-01',
  },
  {
    id: 'tpl-rekomendasi-03',
    title: 'Surat Rekomendasi Resmi (Paspor, Visa & Beasiswa)',
    code: 'SK-REKOM',
    category: 'Rekomendasi',
    subject: 'Surat Rekomendasi Kualifikasi & Penjaminan Dokumen Keberangkatan',
    numberFormat: '{SEQ}/PROSPECT-JBR/SK-REKOM/{MM}/{YYYY}',
    bodyContent: `<p>LKP Prospect Education Jember memberikan <strong>SURAT REKOMENDASI RESMI</strong> kepada peserta didik di bawah ini:</p>

<table style="width:100%; border:1px solid #cbd5e1; margin:14px 0; border-collapse:collapse;">
  <tbody>
    <tr><td style="width:30%; padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">Nama Lengkap</td><td style="padding:8px; border:1px solid #cbd5e1;">{NAMA_SISWA}</td></tr>
    <tr><td style="padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">No. Registrasi</td><td style="padding:8px; border:1px solid #cbd5e1;">{NOMOR_REGISTRASI}</td></tr>
    <tr><td style="padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">No. Paspor / NIK</td><td style="padding:8px; border:1px solid #cbd5e1;">{NO_PASPOR} / {NIK}</td></tr>
    <tr><td style="padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">Program & Tujuan</td><td style="padding:8px; border:1px solid #cbd5e1;">{PROGRAM} - {UNIVERSITAS_TUJUAN}</td></tr>
    <tr><td style="padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">Negara Tujuan</td><td style="padding:8px; border:1px solid #cbd5e1; font-weight:bold;">{NEGARA_TUJUAN}</td></tr>
    <tr><td style="padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">Jadwal Keberangkatan</td><td style="padding:8px; border:1px solid #cbd5e1;">{TANGGAL_KEBERANGKATAN}</td></tr>
  </tbody>
</table>

<p>Berdasarkan evaluasi akademik, kedisiplinan, serta kelayakan kompetensi bahasa, peserta di atas dinyatakan <strong>SANGAT REKOMENDED</strong> untuk diberikan kemudahan fasilitas pembuatan Paspor, Pengurusan Visa, maupun pendaftaran Beasiswa/Magang di negara {NEGARA_TUJUAN}.</p>`,
    signerName: 'Rohim Egy P., S.Pd., M.M.',
    signerTitle: 'Kepala Cabang Prospect Education Jember',
    signerNip: 'NIP. 19880412 201201 1 004',
    styleConfig: {
      fontFamily: 'serif',
      fontSize: '11pt',
      lineHeight: '1.65',
      paddingTop: '28px',
      paddingBottom: '28px',
      paddingLeft: '32px',
      paddingRight: '32px',
      customCss: `/* Custom Recommendation Letter Styles */
.printable-content p { text-align: justify; text-indent: 1.5em; }`,
    },
    updatedAt: '2026-08-03',
  },
  {
    id: 'tpl-kontrak-05',
    title: 'Surat Perjanjian & Kontrak Diklat Vokasi (Kontrak)',
    code: 'KONTRAK',
    category: 'Perjanjian',
    subject: 'Surat Perjanjian & Kontrak Pelatihan Vokasi serta Penempatan Kerja',
    numberFormat: '{SEQ}/PROSPECT-JBR/KONTRAK/{MM}/{YYYY}',
    bodyContent: `<p>Pada hari ini, <strong>{TANGGAL_SURAT}</strong> di {KOTA_PENERBITAN}, dibuat dan disepakati Surat Perjanjian Kontrak Diklat & Penempatan Kerja antara:</p>

<ol style="padding-left:18px; margin:10px 0;">
  <li><strong>PIHAK PERTAMA:</strong> LKP Prospect Education Jember bertindak sebagai Lembaga Diklat dan Konsultan Pengirim.</li>
  <li><strong>PIHAK KEDUA:</strong> Peserta Didik di bawah ini:</li>
</ol>

<table style="width:100%; border:1px solid #cbd5e1; margin:14px 0; border-collapse:collapse;">
  <tbody>
    <tr><td style="width:30%; padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">Nama Lengkap Siswa</td><td style="padding:8px; border:1px solid #cbd5e1;">{NAMA_SISWA}</td></tr>
    <tr><td style="padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">NIK / No. Paspor</td><td style="padding:8px; border:1px solid #cbd5e1;">{NIK} / {NO_PASPOR}</td></tr>
    <tr><td style="padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">Nama Orang Tua / Wali</td><td style="padding:8px; border:1px solid #cbd5e1;">{NAMA_ORANGTUA}</td></tr>
    <tr><td style="padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">Mulai Kontrak</td><td style="padding:8px; border:1px solid #cbd5e1;">{TANGGAL_MULAI_KONTRAK}</td></tr>
    <tr><td style="padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">Selesai Kontrak</td><td style="padding:8px; border:1px solid #cbd5e1;">{TANGGAL_SELESAI_KONTRAK}</td></tr>
    <tr><td style="padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">Target Negara & Univ</td><td style="padding:8px; border:1px solid #cbd5e1; font-weight:bold;">{NEGARA_TUJUAN} - {UNIVERSITAS_TUJUAN}</td></tr>
    <tr><td style="padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">Rencana Keberangkatan</td><td style="padding:8px; border:1px solid #cbd5e1;">{TANGGAL_KEBERANGKATAN}</td></tr>
  </tbody>
</table>

<p><strong>PASAL 1 - HAK & KEWAJIBAN:</strong> Pihak Kedua bersedia mengikuti seluruh regulasi kedisiplinan dan kurikulum pelatihan bahasa/vokasi yang diselenggarakan oleh Pihak Pertama demi kelancaran penerbitan visa dan penempatan kerja di negara tujuan.</p>`,
    signerName: 'Rohim Egy P., S.Pd., M.M.',
    signerTitle: 'Kepala Cabang Prospect Education Jember',
    signerNip: 'NIP. 19880412 201201 1 004',
    styleConfig: {
      fontFamily: 'garamond',
      fontSize: '11pt',
      lineHeight: '1.5',
      paddingTop: '24px',
      paddingBottom: '24px',
      paddingLeft: '30px',
      paddingRight: '30px',
      customCss: `/* Custom Legal Contract Styles */
.printable-content ol li { margin-bottom: 4px; }
.printable-content table td { font-size: 10.5pt; }`,
    },
    updatedAt: '2026-08-05',
  },
  {
    id: 'tpl-sk-aktif-02',
    title: 'Surat Keterangan Aktif Diklat & Pembelajaran',
    code: 'SK-AKTIF',
    category: 'Surat Keterangan',
    subject: 'Surat Keterangan Masih Aktif Mengikuti Diklat Vokasi Internasional',
    numberFormat: '{SEQ}/PROSPECT-JBR/SK-AKTIF/{MM}/{YYYY}',
    bodyContent: `<p>Yang bertanda tangan di bawah ini, Kepala LKP Prospect Education Jember menerangkan dengan sebenarnya bahwa:</p>

<table style="width:100%; border:1px solid #cbd5e1; margin:14px 0; border-collapse:collapse;">
  <tbody>
    <tr><td style="width:30%; padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">Nama Peserta</td><td style="padding:8px; border:1px solid #cbd5e1;">{NAMA_SISWA}</td></tr>
    <tr><td style="padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">No. Registrasi / Paspor</td><td style="padding:8px; border:1px solid #cbd5e1;">{NOMOR_REGISTRASI} / {NO_PASPOR}</td></tr>
    <tr><td style="padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">Program Diklat</td><td style="padding:8px; border:1px solid #cbd5e1;">{PROGRAM}</td></tr>
    <tr><td style="padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">Status Keaktifan</td><td style="padding:8px; border:1px solid #cbd5e1; font-weight:bold; color:#047857;">AKTIF MENGIKUTI KELAS & DIKLAT VOKASI</td></tr>
  </tbody>
</table>

<p>Adalah benar-benar peserta didik aktif di lembaga kami yang saat ini sedang menempuh diklat persiapan keberangkatan internasional. Surat keterangan ini diterbitkan untuk dipergunakan sebagai persyaratan pengurusan dokumen resmi (Paspor / Visa / Pengurusan Administrasi).</p>`,
    signerName: 'Rohim Egy P., S.Pd., M.M.',
    signerTitle: 'Kepala Cabang Prospect Education Jember',
    signerNip: 'NIP. 19880412 201201 1 004',
    updatedAt: '2026-08-02',
  },
  {
    id: 'tpl-visa-04',
    title: 'Surat Pengantar & Penjaminan Permohonan Visa',
    code: 'VISA-LETTER',
    category: 'Permohonan Visa',
    subject: 'Surat Pengantar & Penjaminan Permohonan Visa Resmi',
    numberFormat: '{SEQ}/PROSPECT-JBR/VISA/{MM}/{YYYY}',
    bodyContent: `<p>Kepada Yth.<br/><strong>Bagian Konsuler & Visa TECO / Kedutaan Besar / Instansi Terkait</strong></p>

<p>Dengan hormat, melalui surat resmi ini LKP Prospect Education Jember menerangkan bahwa:</p>

<table style="width:100%; border:1px solid #cbd5e1; margin:14px 0; border-collapse:collapse;">
  <tbody>
    <tr><td style="width:30%; padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">Nama Peserta</td><td style="padding:8px; border:1px solid #cbd5e1;">{NAMA_SISWA}</td></tr>
    <tr><td style="padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">NIK / No. Paspor</td><td style="padding:8px; border:1px solid #cbd5e1;">{NIK} / {NO_PASPOR}</td></tr>
    <tr><td style="padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">Program & Tujuan</td><td style="padding:8px; border:1px solid #cbd5e1;">{PROGRAM} - {UNIVERSITAS_TUJUAN}</td></tr>
    <tr><td style="padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">Tgl Keberangkatan</td><td style="padding:8px; border:1px solid #cbd5e1;">{TANGGAL_KEBERANGKATAN}</td></tr>
  </tbody>
</table>

<p>LKP Prospect Education bertindak sebagai lembaga diklat resmi pengirim yang menjamin penuh keabsahan dokumen serta komitmen keberangkatan peserta yang bersangkutan.</p>`,
    signerName: 'Rohim Egy P., S.Pd., M.M.',
    signerTitle: 'Kepala Cabang Prospect Education Jember',
    signerNip: 'NIP. 19880412 201201 1 004',
    updatedAt: '2026-08-04',
  }
];

export const DEFAULT_ISSUED_LETTERS: IssuedLetter[] = [
  {
    id: 'iss-001',
    letterNumber: '101/PROSPECT-JBR/LoA/08/2026',
    templateId: 'tpl-loa-01',
    templateTitle: 'Surat Keterangan Penerimaan Peserta (LoA)',
    candidateId: 'cand-001',
    candidateName: 'Budi Santoso',
    candidateRegNumber: 'REG-TW-2026-001',
    subject: 'Surat Keterangan Penerimaan Peserta Didik Baru (Letter of Acceptance)',
    issueDate: '2026-08-01',
    contentHtml: `<p>Surat penerimaan resmi untuk Budi Santoso program Taiwan IFP 1+4.</p>`,
    signerName: 'Rohim Egy P., S.Pd., M.M.',
    signerTitle: 'Kepala Cabang Prospect Education Jember',
    issuedBy: 'Admin Utama (Rohim Egy)',
    status: 'published',
    downloadCount: 4,
  }
];
