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
};

export const DEFAULT_LETTER_TEMPLATES: LetterTemplate[] = [
  {
    id: 'tpl-loa-01',
    title: 'Surat Keterangan Penerimaan Peserta (Letter of Acceptance / LoA)',
    code: 'LOA',
    category: 'LoA',
    subject: 'Surat Keterangan Penerimaan Peserta Didik Baru (Letter of Acceptance)',
    numberFormat: '{SEQ}/PROSPECT-JBR/LoA/{MM}/{YYYY}',
    bodyContent: `<p>Berdasarkan hasil seleksi berkas administrasi dan wawancara kualifikasi yang telah dilaksanakan oleh Tim Penerimaan LKP Prospect Education Jember, dengan ini menerangkan secara resmi bahwa:</p>

<table style="width:100%; border:1px solid #cbd5e1; margin:14px 0; border-collapse:collapse;">
  <tbody>
    <tr><td style="width:30%; padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">Nama Lengkap</td><td style="padding:8px; border:1px solid #cbd5e1;">{NAMA_SISWA}</td></tr>
    <tr><td style="padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">No. Registrasi / ID</td><td style="padding:8px; border:1px solid #cbd5e1;">{NOMOR_REGISTRASI}</td></tr>
    <tr><td style="padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">NIK / No. KTP</td><td style="padding:8px; border:1px solid #cbd5e1;">{NIK}</td></tr>
    <tr><td style="padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">Tempat, Tgl Lahir</td><td style="padding:8px; border:1px solid #cbd5e1;">{TEMPAT_LAHIR}, {TANGGAL_LAHIR}</td></tr>
    <tr><td style="padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">Pilihan Program</td><td style="padding:8px; border:1px solid #cbd5e1; font-weight:bold; color:#1e3a8a;">{PROGRAM}</td></tr>
    <tr><td style="padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">Alamat Asal</td><td style="padding:8px; border:1px solid #cbd5e1;">{ALAMAT_SISWA}</td></tr>
  </tbody>
</table>

<p>Dinyatakan <strong>LULUS SELEKSI & DITERIMA</strong> sebagai Peserta Didik Resmi pada LKP Prospect Education Cabang Jember untuk periode akademik 2026/2027.</p>

<p>Peserta yang bersangkutan diwajibkan untuk mengikuti seluruh tahapan pembekalan bahasa (Mandarin/Jepang), diklat vokasi intensif, serta melengkapi persyaratan dokumen keberangkatan sesuai jadwal yang ditetapkan lembaga.</p>`,
    signerName: 'Rohim Egy P., S.Pd., M.M.',
    signerTitle: 'Kepala Cabang Prospect Education Jember',
    signerNip: 'NIP. 19880412 201201 1 004',
    updatedAt: '2026-08-01',
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
    <tr><td style="padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">No. Registrasi</td><td style="padding:8px; border:1px solid #cbd5e1;">{NOMOR_REGISTRASI}</td></tr>
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
    id: 'tpl-rekomendasi-03',
    title: 'Surat Rekomendasi Kualifikasi & Penempatan Kerja',
    code: 'SK-REKOM',
    category: 'Rekomendasi',
    subject: 'Surat Rekomendasi Kualifikasi & Kelayakan Kerja',
    numberFormat: '{SEQ}/PROSPECT-JBR/SK-REKOM/{MM}/{YYYY}',
    bodyContent: `<p>LKP Prospect Education Jember memberikan <strong>REKOMENDASI KUALIFIKASI RESMI</strong> kepada peserta didik di bawah ini:</p>

<table style="width:100%; border:1px solid #cbd5e1; margin:14px 0; border-collapse:collapse;">
  <tbody>
    <tr><td style="width:30%; padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">Nama Lengkap</td><td style="padding:8px; border:1px solid #cbd5e1;">{NAMA_SISWA}</td></tr>
    <tr><td style="padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">No. Registrasi</td><td style="padding:8px; border:1px solid #cbd5e1;">{NOMOR_REGISTRASI}</td></tr>
    <tr><td style="padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">Program Pilihan</td><td style="padding:8px; border:1px solid #cbd5e1;">{PROGRAM}</td></tr>
    <tr><td style="padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">Kualifikasi Bahasa</td><td style="padding:8px; border:1px solid #cbd5e1;">Kompeten / Lulus Evaluasi Tahap Pembekalan</td></tr>
  </tbody>
</table>

<p>Berdasarkan penilaian rekam jejak kedisiplinan, kompetensi fisik & vokal, serta etika kerja selama diklat, peserta ini dinyatakan <strong>SANGAT REKOMENDED</strong> untuk mengikuti proses seleksi interview dengan mitra perusahaan/universitas penerima di luar negeri.</p>`,
    signerName: 'Rohim Egy P., S.Pd., M.M.',
    signerTitle: 'Kepala Cabang Prospect Education Jember',
    signerNip: 'NIP. 19880412 201201 1 004',
    updatedAt: '2026-08-03',
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
    <tr><td style="padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">NIK / Paspor</td><td style="padding:8px; border:1px solid #cbd5e1;">{NIK}</td></tr>
    <tr><td style="padding:8px; border:1px solid #cbd5e1; background:#f8fafc; font-weight:bold;">Program Tujuan</td><td style="padding:8px; border:1px solid #cbd5e1;">{PROGRAM}</td></tr>
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
