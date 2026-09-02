import {
  ProgramInfo,
  Candidate,
  LMSModule,
  FinancialRecord,
  NewsArticle,
  ChatMessage,
  StudyResource,
  AttendanceRecord,
} from '../types';
import { COMPREHENSIVE_LMS_MODULES } from './lmsCurriculumData';
import departure1 from '../assets/images/taiwan_ifp_departure_1_1784770304337.jpg';

export const INITIAL_PROGRAMS: ProgramInfo[] = [
  {
    id: 'taiwan_ifp',
    title: 'Program Taiwan IFP 1+4 (International Foundation Program)',
    category: 'Taiwan',
    badge: 'Program Unggulan Taiwan',
    shortDesc: '1 Tahun Persiapan Bahasa Mandarin di Taiwan + 4 Tahun Perkuliahan S1 dengan Magang Industri Kerja Berbayar.',
    fullDesc: 'Program IFP 1+4 merupakan jalur resmi pendidikan tinggi ke Taiwan tanpa syarat TOEFL/IELTS maupun sertifikat Mandarin (TOCFL). Peserta yang mendaftar tidak diwajibkan memiliki sertifikat Mandarin dan hanya dibekali Bahasa Mandarin Basic, Bahasa Inggris Basic, serta Pengenalan Budaya Taiwan di Prospect Education Jember hingga meraih Sertifikat Bahasa & Pembekalan dari Prospect. Selanjutnya, peserta mengikuti 1 tahun penguatan bahasa Mandarin langsung di kampus Taiwan dilanjutkan 4 tahun perkuliahan Sarjana S1.',
    duration: '1 Tahun Bahasa di Taiwan + 4 Tahun S1',
    estimatedCost: 'Rp 15.000.000 (Bisa dicicil / Program Subsidi)',
    targetQuota: 50,
    enrolledCount: 38,
    requirements: [
      'Lulusan SMA/SMK/MA sederajat (Usia 17 - 25 tahun)',
      'Fotokopi KTP & Kartu Keluarga',
      'Ijazah & Transkrip Nilai Legalisir (Tanpa Wajib Sertifikat Mandarin/TOCFL)',
      'Paspor Aktif (Bisa dibantu pengurusannya)',
      'Pasfoto Background Putih (4x6)',
      'Surat Izin Orang Tua/Wali'
    ],
    benefits: [
      'Tanpa Syarat Sertifikat Mandarin (TOCFL) - Cukup Pembekalan Basic di Prospect Jember',
      'Memperoleh Sertifikat Bahasa & Pembekalan Resmi dari Prospect Education',
      '1 Tahun Penguatan Bahasa Mandarin Langsung di Kampus Taiwan + 4 Tahun Perkuliahan S1',
      'Izin Kerja Part-Time / Magang Berbayar hingga NT$ 27.470/bulan (~Rp 13,8 Juta)',
      'Ijazah Sarjana S1 Diakui Internasional & Kemendikbudristek RI'
    ],
    stages: [
      'Pendaftaran Online & Verifikasi Berkas Administrasi',
      'Pembekalan Bahasa Mandarin Basic, Inggris Basic, & Budaya Taiwan di Jember',
      'Penerbitan Sertifikat Bahasa & Pembekalan Resmi dari Prospect Education',
      'Wawancara Universitas & Penerbitan LoA (Surat Penerimaan)',
      '1 Tahun Persiapan Bahasa di Taiwan + 4 Tahun Perkuliahan S1'
    ],
    partnerUniversitiesOrCompanies: [
      'National Formosa University (NFU)',
      'Minghsin University of Science and Technology (MUST)',
      'Southern Taiwan University of Science and Technology (STUST)',
      'Cheng Shiu University (CSU)',
      'Kao Yuan University'
    ],
    faqs: [
      {
        question: 'Apakah harus bisa Bahasa Mandarin atau punya sertifikat TOCFL sebelum mendaftar?',
        answer: 'Sama sekali tidak wajib dan tidak diwajibkan mempunyai sertifikat TOCFL. Anda hanya dibekali Bahasa Mandarin Basic, Bahasa Inggris Basic, dan Pengenalan Budaya Taiwan di Prospect Education Jember hingga menerima Sertifikat Bahasa dari Prospect Education. Bahasa Mandarin harian & akademik akan dipelajari selama 1 tahun pertama di Taiwan.'
      },
      {
        question: 'Apakah program IFP 1+4 merupakan beasiswa?',
        answer: 'Program IFP 1+4 bukan beasiswa penuh, melainkan jalur perkuliahan S1 resmi dengan 1 tahun persiapan bahasa di Taiwan dan magang kerja industri berbayar legal untuk menutup biaya hidup & kuliah.'
      }
    ],
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'taiwan_4_1',
    title: 'Program Taiwan 4+1 (4 Tahun S1 + 1 Tahun S2)',
    category: 'Taiwan',
    badge: 'Jalur Akselerasi S1 + S2',
    shortDesc: '4 Tahun Perkuliahan S1 (Sarjana) di Taiwan + 1 Tahun Lanjutan Program Magister / S2 (Pascasarjana).',
    fullDesc: 'Program 4+1 memberikan kesempatan emas bagi mahasiswa untuk menyelesaikan pendidikan Sarjana/S1 selama 4 tahun dan langsung melanjutkan 1 tahun berikutnya untuk meraih gelar Magister/S2 Pascasarjana di universitas mitra Taiwan, dilengkapi dengan pembekalan bahasa dan peluang magang industri.',
    duration: '4 Tahun S1 + 1 Tahun S2',
    estimatedCost: 'Rp 18.000.000',
    targetQuota: 40,
    enrolledCount: 29,
    requirements: [
      'Lulusan SMA/SMK (diutamakan SMK Kejuruan / IPA)',
      'Nilai Rata-Rata Ijazah minimal 7.5',
      'Sehat Jasmani dan Rohani',
      'Paspor & Dokumen Identitas Lengkap'
    ],
    benefits: [
      'Penempatan Magang Industri Resmi di Perusahaan Teknologi/Manufaktur Taiwan',
      'Sertifikat Keahlian Tambahan dari Industri Taiwan',
      'Peluang Langsung Dikonversi Menjadi Pekerja Tetap Ber-Visa Kerja (ARC Kerja)'
    ],
    stages: [
      'Seleksi Administrasi & Wawancara',
      'Pelatihan Bahasa Mandarin & Budaya Kerja',
      'Penerbitan LoA & Pengurusan Visa',
      'Keberangkatan Ke Taiwan'
    ],
    partnerUniversitiesOrCompanies: [
      'Lunghwa University of Science and Technology',
      'Chien Hsin University of Science and Technology',
      'Kun Shan University'
    ],
    faqs: [
      {
        question: 'Berapa honor magang yang didapatkan?',
        answer: 'Honor magang sesuai dengan UMR Taiwan yang berlaku (sekitar NT$ 27.470+ / bulan).'
      }
    ],
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'japan_im',
    title: 'Program Magang Jepang IM Japan',
    category: 'Jepang',
    badge: 'Resmi Kemnaker RI',
    shortDesc: 'Program Magang Kerja Industri 3 - 5 Tahun di Jepang Kerjasama Kementerian Ketenagakerjaan RI dan IM Japan.',
    fullDesc: 'Program Magang IM Japan merupakan salah satu jalur favorit kerja ke Jepang dengan kepastian hukum, tunjangan melimpah, subsidi biaya, serta modal usaha (pemberian dana usaha mandiri hingga 600.000 Yen / ~Rp 60 Juta) saat menyelesaikan program magang.',
    duration: '3 - 5 Tahun Kontrak Kerja',
    estimatedCost: 'Rp 12.000.000 (Subsidi Program Kemenaker)',
    targetQuota: 60,
    enrolledCount: 52,
    requirements: [
      'Pria/Wanita Usia 18 - 26 Tahun',
      'Tinggi Badan Pria minimal 160 cm, Wanita minimal 150 cm',
      'TIDAK Bertato, Bertindik, Tidak Buta Warna',
      'Pendidikan minimal SMA/SMK/MA'
    ],
    benefits: [
      'Gaji Standar UMR Jepang (Rp 14.000.000 - Rp 22.000.000 / bulan)',
      'Tunjangan Modal Usaha Usai Magang hingga 600.000 Yen',
      'Asuransi Kesehatan & Ketenagakerjaan Penuh dari Pemerintah Jepang',
      'Sertifikat Kelulusan Resmi JITCO / OTIT'
    ],
    stages: [
      'Seleksi Fisik, Kesamaptaan & Matematika Dasar di Jember',
      'Pelatihan Bahasa Jepang N5 & N4 di LKP Prospect Education Jember',
      'Pelatihan Daerah (Pelda) & Pelatihan Pusat (Pelpus) Kemnaker',
      'Penerbitan CoE (Certificate of Eligibility) & Visa Kerja (Kerjasama VISA HUB INDONESIA)',
      'Pemberangkatan Ke Jepang'
    ],
    partnerUniversitiesOrCompanies: [
      'IM Japan Association',
      'OTIT (Organization for Technical Intern Training)',
      'Aichi Prefectural Manufacturing Coop',
      'Osaka Industrial Union'
    ],
    faqs: [
      {
        question: 'Apakah ada tes fisik dalam seleksi IM Japan?',
        answer: 'Ya, tes fisik meliputi lari 3km dalam 15 menit, push-up, sit-up, dan cek buta warna.'
      }
    ],
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'japan_ssw',
    title: 'Program Kerja Jepang Tokutei Ginou (SSW)',
    category: 'Jepang',
    badge: 'Visa Kerja Keahlian Khusus',
    shortDesc: 'Program Kerja Tenaga Ahli Terampil (Specified Skilled Worker) dengan Kontrak Profesional hingga 5 Tahun di Jepang.',
    fullDesc: 'Program Tokutei Ginou (SSW) ditujukan bagi pencari kerja yang memiliki keterampilan di bidang spesifik seperti Pengolahan Makanan (Food Processing), Perhotelan, Keperawatan/Lansia (Kaigo), Pertanian, dan Konstruksi. Dapatkan status pekerja penuh dengan hak dan gaji setara pekerja lokal Jepang.',
    duration: '5 Tahun Kontrak (Bisa Diperpanjang)',
    estimatedCost: 'Rp 20.000.000',
    targetQuota: 50,
    enrolledCount: 41,
    requirements: [
      'Pria/Wanita Usia 18 - 30 Tahun',
      'Lulus Ujian Bahasa Jepang minimal JFT-Basic A2 / JLPT N4',
      'Lulus Ujian Keahlian Bidang (Skill Exam SSW)',
      'Ijazah SMA/SMK/S1',
      'Paspor & Surat Keterangan Sehat MCU'
    ],
    benefits: [
      'Gaji Pokok Rp 18.000.000 - Rp 28.000.000 / bulan + Lembur',
      'Bebas Pindah Perusahaan (Job Change) dalam Bidang yang Sama',
      'Kontrak Kerja Langsung dengan Perusahaan Jepang (User Direct)',
      'Kesempatan Membawa Keluarga (untuk SSW Tipe 2)'
    ],
    stages: [
      'Pelatihan Bahasa Jepang JFT-Basic A2 / N4 di Jember',
      'Pelatihan & Tryout Ujian Keahlian SSW (Kaigo/Food Processing/dll)',
      'Matching User / Wawancara Perusahaan Jepang',
      'Penerbitan CoE & Visa Working SSW',
      'Keberangkatan & Penempatan Kerja'
    ],
    partnerUniversitiesOrCompanies: [
      'Zensho Holdings (Food Service)',
      'Sodexo Japan Caregiver Division',
      'Hokkaido Agriculture Union',
      'Nippon Express Logistics'
    ],
    faqs: [
      {
        question: 'Apakah ex-magang Jepang bisa mendaftar Tokutei Ginou?',
        answer: 'Bisa! Ex-magang (Jitco/Otit) 3 tahun bebas ujian bahasa & bidang jika melamar di bidang yang sama.'
      }
    ],
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'
  }
];

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'CAND-004',
    registrationNumber: 'PE-JBR-2026-0092',
    email: 'dewi.anggraini@gmail.com',
    fullName: 'Dewi Anggraini',
    selectedProgram: 'taiwan_ifp',
    status: 'registered',
    biodata: {
      nik: '3509125508030005',
      fullName: 'Dewi Anggraini',
      birthPlace: 'Jember',
      birthDate: '2003-05-18',
      gender: 'Perempuan',
      religion: 'Islam',
      address: 'Jl. Kalimantan No. 12, Sumbersari',
      district: 'Sumbersari',
      regency: 'Kabupaten Jember',
      phoneWA: '081234999888',
      email: 'dewi.anggraini@gmail.com',
      education: 'SMK Negeri 1 Jember',
      major: 'Akuntansi',
      parentName: 'Rahmat Hidayat',
      parentPhone: '081234111222',
      parentJob: 'Wiraswasta'
    },
    documents: [],
    payments: [],
    registeredAt: '2026-08-04',
    lmsProgressPercent: 0
  },
  {
    id: 'CAND-005',
    registrationNumber: 'PE-JBR-2026-0093',
    email: 'rizky.kurniawan@gmail.com',
    fullName: 'Rizky Kurniawan',
    selectedProgram: 'japan_ssw',
    status: 'registered',
    biodata: {
      nik: '3509121204020008',
      fullName: 'Rizky Kurniawan',
      birthPlace: 'Banyuwangi',
      birthDate: '2002-04-12',
      gender: 'Laki-Laki',
      religion: 'Islam',
      address: 'Jl. Gajah Mada No. 88, Kaliwates',
      district: 'Kaliwates',
      regency: 'Kabupaten Jember',
      phoneWA: '081333777555',
      email: 'rizky.kurniawan@gmail.com',
      education: 'SMA Negeri 1 Tanggul',
      major: 'IPS',
      parentName: 'Siti Rahayu',
      parentPhone: '081333111000',
      parentJob: 'PNS'
    },
    documents: [],
    payments: [],
    registeredAt: '2026-08-05',
    lmsProgressPercent: 0
  },
  {
    id: 'CAND-001',
    registrationNumber: 'PE-JBR-2026-0081',
    email: 'bambang.prasetyo@gmail.com',
    fullName: 'Bambang Prasetyo',
    selectedProgram: 'taiwan_ifp',
    status: 'loa_issued',
    biodata: {
      nik: '3509121508020003',
      fullName: 'Bambang Prasetyo',
      birthPlace: 'Jember',
      birthDate: '2002-08-15',
      gender: 'Laki-Laki',
      religion: 'Islam',
      address: 'Jl. Ahmad Yani No. 42, Patrang',
      district: 'Patrang',
      regency: 'Kabupaten Jember',
      phoneWA: '081234567890',
      email: 'bambang.prasetyo@gmail.com',
      education: 'SMA Negeri 2 Jember',
      major: 'MIPA',
      parentName: 'Suroso Prasetyo',
      parentPhone: '081298765432',
      parentJob: 'Wiraswasta'
    },
    documents: [
      { id: 'doc-1', docType: 'ktp', title: 'KTP Peserta', fileName: 'ktp_bambang.pdf', status: 'verified', uploadedAt: '2026-06-10' },
      { id: 'doc-2', docType: 'ijazah', title: 'Ijazah Legalisir', fileName: 'ijazah_sman2.pdf', status: 'verified', uploadedAt: '2026-06-10' },
      { id: 'doc-3', docType: 'paspor', title: 'Paspor Aktif', fileName: 'paspor_bambang.pdf', status: 'verified', uploadedAt: '2026-06-12' },
      { id: 'doc-4', docType: 'pasfoto', title: 'Pasfoto 4x6', fileName: 'pasfoto.jpg', status: 'verified', uploadedAt: '2026-06-10' }
    ],
    payments: [
      {
        id: 'PAY-1001',
        candidateId: 'CAND-001',
        candidateName: 'Bambang Prasetyo',
        programType: 'taiwan_ifp',
        programTitle: 'Program Taiwan IFP 1+4',
        amount: 3000000,
        paymentMethod: 'va_bca',
        paymentStatus: 'verified',
        paidAt: '2026-06-15 10:30',
        invoiceNo: 'INV/2026/06/001'
      }
    ],
    registeredAt: '2026-06-08',
    superAdminApprovalDate: '2026-06-18',
    loaNumber: 'LOA/PE-JBR/TW/2026/014',
    loaIssueDate: '2026-06-20',
    lmsProgressPercent: 65,
    adminSignature: {
      isSigned: true,
      signerName: 'Rohim Egy, S.Pd.',
      signerTitle: 'Kepala Cabang Prospect Education Jember',
      signedAt: '2026-06-20 09:15',
      approvalCode: 'PE-JBR-ADM-2026-014',
      hashVerification: 'SHA256:8F9A1B2C3D4E5F6A7B8C9D0E-ADMIN'
    },
    candidateSignature: {
      isSigned: true,
      signatureType: 'typed',
      signerName: 'Bambang Prasetyo',
      signerNik: '3509121508020003',
      signedAt: '2026-06-21 14:30',
      ipAddress: '180.252.112.45 (Terverifikasi Portal Peserta)',
      hashVerification: 'SHA256:CAND-001-BAMBANG-LOA-SIGNED-2026'
    }
  },
  {
    id: 'CAND-002',
    registrationNumber: 'PE-JBR-2026-0092',
    email: 'siti.rohmah@gmail.com',
    fullName: 'Siti Rohmah',
    selectedProgram: 'japan_ssw',
    status: 'payment_pending',
    biodata: {
      nik: '3509185203030001',
      fullName: 'Siti Rohmah',
      birthPlace: 'Balung',
      birthDate: '2003-03-12',
      gender: 'Perempuan',
      religion: 'Islam',
      address: 'Dusun Balung Lor, Balung',
      district: 'Balung',
      regency: 'Kabupaten Jember',
      phoneWA: '085712345678',
      email: 'siti.rohmah@gmail.com',
      education: 'SMK Negeri 1 Balung',
      major: 'Keperawatan',
      parentName: 'Mohammad Taufik',
      parentPhone: '085798765432',
      parentJob: 'Petani'
    },
    documents: [
      { id: 'doc-1', docType: 'ktp', title: 'KTP Peserta', fileName: 'ktp_siti.pdf', status: 'verified', uploadedAt: '2026-07-01' },
      { id: 'doc-2', docType: 'ijazah', title: 'Ijazah Legalisir', fileName: 'ijazah_smkn1.pdf', status: 'verified', uploadedAt: '2026-07-01' },
      { id: 'doc-3', docType: 'pasfoto', title: 'Pasfoto 4x6', fileName: 'pasfoto_siti.jpg', status: 'verified', uploadedAt: '2026-07-01' }
    ],
    payments: [],
    registeredAt: '2026-06-28',
    lmsProgressPercent: 10
  },
  {
    id: 'CAND-003',
    registrationNumber: 'PE-JBR-2026-0105',
    email: 'hendra.wijaya@gmail.com',
    fullName: 'Hendra Wijaya',
    selectedProgram: 'japan_im',
    status: 'lms_active',
    biodata: {
      nik: '3509201104010005',
      fullName: 'Hendra Wijaya',
      birthPlace: 'Ambulu',
      birthDate: '2001-04-11',
      gender: 'Laki-Laki',
      religion: 'Islam',
      address: 'Jl. Raya Ambulu No. 88',
      district: 'Ambulu',
      regency: 'Kabupaten Jember',
      phoneWA: '081333444555',
      email: 'hendra.wijaya@gmail.com',
      education: 'SMK Negeri 3 Jember',
      major: 'Teknik Mesin',
      parentName: 'Budi Wijaya',
      parentPhone: '081333999000',
      parentJob: 'Pedagang'
    },
    documents: [
      { id: 'doc-1', docType: 'ktp', title: 'KTP Peserta', fileName: 'ktp_hendra.pdf', status: 'verified', uploadedAt: '2026-05-10' },
      { id: 'doc-2', docType: 'ijazah', title: 'Ijazah Legalisir', fileName: 'ijazah_hendra.pdf', status: 'verified', uploadedAt: '2026-05-10' }
    ],
    payments: [
      {
        id: 'PAY-1002',
        candidateId: 'CAND-003',
        candidateName: 'Hendra Wijaya',
        programType: 'japan_im',
        programTitle: 'Program Magang Jepang IM Japan',
        amount: 2500000,
        paymentMethod: 'qris',
        paymentStatus: 'verified',
        paidAt: '2026-05-15 14:20',
        invoiceNo: 'INV/2026/05/012'
      }
    ],
    registeredAt: '2026-05-02',
    superAdminApprovalDate: '2026-05-20',
    loaNumber: 'LOA/PE-JBR/JP/2026/009',
    loaIssueDate: '2026-05-22',
    certificateNumber: 'CERT/PE-JBR/N5/2026/045',
    lmsProgressPercent: 92
  }
];

export const INITIAL_LMS_MODULES: LMSModule[] = COMPREHENSIVE_LMS_MODULES;

export const INITIAL_FINANCIAL_RECORDS: FinancialRecord[] = [
  {
    id: 'fin-01',
    period: 'Januari 2026',
    month: 'Januari',
    year: 2026,
    revenueTuition: 45000000,
    revenueRegistration: 15000000,
    totalRevenue: 60000000,
    expenseStaff: 20000000,
    expenseMarketing: 8000000,
    expenseFacility: 7000000,
    expenseVisaDoc: 5000000,
    totalExpenses: 40000000,
    netCashFlow: 20000000,
    activeStudents: 32,
    newRegistrations: 15
  },
  {
    id: 'fin-02',
    period: 'Februari 2026',
    month: 'Februari',
    year: 2026,
    revenueTuition: 52000000,
    revenueRegistration: 18000000,
    totalRevenue: 70000000,
    expenseStaff: 21000000,
    expenseMarketing: 9000000,
    expenseFacility: 7500000,
    expenseVisaDoc: 6000000,
    totalExpenses: 43500000,
    netCashFlow: 26500000,
    activeStudents: 38,
    newRegistrations: 18
  },
  {
    id: 'fin-03',
    period: 'Maret 2026',
    month: 'Maret',
    year: 2026,
    revenueTuition: 61000000,
    revenueRegistration: 22000000,
    totalRevenue: 83000000,
    expenseStaff: 22000000,
    expenseMarketing: 10000000,
    expenseFacility: 8000000,
    expenseVisaDoc: 7000000,
    totalExpenses: 47000000,
    netCashFlow: 36000000,
    activeStudents: 45,
    newRegistrations: 22
  },
  {
    id: 'fin-04',
    period: 'April 2026',
    month: 'April',
    year: 2026,
    revenueTuition: 70000000,
    revenueRegistration: 25000000,
    totalRevenue: 95000000,
    expenseStaff: 23000000,
    expenseMarketing: 11000000,
    expenseFacility: 8500000,
    expenseVisaDoc: 8000000,
    totalExpenses: 50500000,
    netCashFlow: 44500000,
    activeStudents: 52,
    newRegistrations: 25
  },
  {
    id: 'fin-05',
    period: 'Mei 2026',
    month: 'Mei',
    year: 2026,
    revenueTuition: 85000000,
    revenueRegistration: 28000000,
    totalRevenue: 113000000,
    expenseStaff: 24000000,
    expenseMarketing: 12000000,
    expenseFacility: 9000000,
    expenseVisaDoc: 9000000,
    totalExpenses: 54000000,
    netCashFlow: 59000000,
    activeStudents: 61,
    newRegistrations: 28
  },
  {
    id: 'fin-06',
    period: 'Juni 2026',
    month: 'Juni',
    year: 2026,
    revenueTuition: 98000000,
    revenueRegistration: 32000000,
    totalRevenue: 130000000,
    expenseStaff: 25000000,
    expenseMarketing: 14000000,
    expenseFacility: 10000000,
    expenseVisaDoc: 10000000,
    totalExpenses: 59000000,
    netCashFlow: 71000000,
    activeStudents: 74,
    newRegistrations: 32
  }
];

export const INITIAL_NEWS: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Dokumentasi Pelepasan & Keberangkatan Mahasiswa Taiwan IFP 1+4 Cabang Jember 2026',
    category: 'Pengumuman',
    date: '18 Juli 2026',
    author: 'Admin Jember',
    summary: 'Rombongan mahasiswa asal Jember penerima beasiswa S1 Taiwan IFP 1+4 resmi diberangkatkan melalui Bandara Internasional membawa paspor & boarding pass.',
    content: 'Selamat dan sukses kepada rombongan mahasiswa pendaftar Prospect Education Cabang Jember yang hari ini resmi berangkat menuju Taiwan untuk memulai program studi S1 International Foundation Program (IFP 1+4).\n\nPara mahasiswa telah menyelesaikan pembekalan bahasa Mandarin dasar serta pemberkasan visa pelajar di kantor Balung Jember. Seluruh rombongan siap menggapai cita-cita tinggi di universitas ternama Taiwan!',
    image: departure1,
    featured: true
  },
  {
    id: 'news-2',
    title: 'Pemberangkatan 12 Peserta Program Tokutei Ginou Jepang Asal Jember',
    category: 'Prestasi',
    date: '02 Juli 2026',
    author: 'Tim Operasional',
    summary: 'Selamat kepada 12 peserta angkatan V yang telah lolos visa Tokutei Ginou SSW bidang Food Processing & Keperawatan.',
    content: 'Sebanyak 12 calon tenaga kerja ahli terampil resmi dilepas oleh Kepala Cabang Prospect Education Jember menuju Kansai International Airport, Jepang. Seluruh peserta telah menyelesaikan pelatihan intensif di Balung Jember.',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'news-3',
    title: 'Sosialisasi Beasiswa Kuliah S1 & Magang Industri di Gedung Serbaguna Balung',
    category: 'Agenda',
    date: '28 Juli 2026',
    author: 'Humas Prospect',
    summary: 'Ikuti seminar tatap muka bersama perwakilan kampus Taiwan dan perusahaan Jepang di Jember.',
    content: 'Prospect Education Cabang Jember mengadakan seminar edukasi gratis untuk memberikan pemahaman mengenai peluang studi S1 berbeasiswa di Taiwan serta pekerjaan berizin resmi di Jepang.',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'
  }
];

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: 'msg-1',
    senderRole: 'admin',
    senderName: 'Customer Care Prospect Jember',
    message: 'Selamat datang di Sistem Informasi Prospect Education Cabang Jember! Ada yang bisa kami bantu mengenai dokumen atau proses pembayaran Anda?',
    timestamp: '10:00 AM'
  }
];

export const INITIAL_WEBMASTERS: import('../types').WebmasterUser[] = [
  {
    id: 'web-001',
    fullName: 'Rizky Firmansyah, S.Kom',
    email: 'webmaster@prospect-jember.id',
    phone: '081234567890',
    roleType: 'Head Webmaster',
    status: 'active',
    assignedScope: 'Full Control Portal & System Flags',
    createdAt: '2025-11-10',
    lastActive: 'Aktif (Baru Saja)',
  },
  {
    id: 'web-002',
    fullName: 'Anisa Rahmawati, S.I.Kom',
    email: 'editor.content@prospect-jember.id',
    phone: '085789123456',
    roleType: 'Content Editor',
    status: 'active',
    assignedScope: 'Berita, Artikel, Galeri & Banner',
    createdAt: '2026-01-15',
    lastActive: '2 jam lalu',
  },
  {
    id: 'web-003',
    fullName: 'Budi Santoso, M.T.',
    email: 'seo.specialist@prospect-jember.id',
    phone: '082198765432',
    roleType: 'SEO Specialist',
    status: 'active',
    assignedScope: 'Meta Data, Analytics & Ranking',
    createdAt: '2026-02-01',
    lastActive: 'Kemarin',
  },
];

export const INITIAL_WEBSITE_FEATURES: import('../types').WebsiteFeatures = {
  maintenanceMode: false,
  onlineRegistration: true,
  lmsLearningSystem: true,
  aiConsultantAssistant: true,
  whatsappHelpdesk: true,
  runningBanner: true,
  investorPortalAccess: true,
  liveClassCalendar: true,
  gallerySection: true,
};

export const INITIAL_WEBSITE_SETTINGS: import('../types').WebsiteSettings = {
  siteName: 'Prospect Education Cabang Jember',
  siteTagline: 'LKP & Konsultan Pendidikan - Program Taiwan IFP 1+4 & Kerja Jepang IM / SSW',
  emergencyBannerText: '📢 PENDAFTARAN PROGRAM TAIWAN IFP 1+4 & MAGANG JEPANG GELOMBANG UTAMA 2026 RESMI DIBUKA. DAPATKAN SUBSIDI BIAYA PELATIHAN KHUSUS WARGA JEMBER!',
  emergencyBannerActive: true,
  csPhoneWhatsApp: '082334554396',
  contactEmail: 'info@prospect-jember.id',
  officeAddress: 'Jl. Balung-Jenggawah, Wetan Kali, Balung Lor, Kec. Balung, Kabupaten Jember, Jawa Timur 68161',
  metaDescription: 'LKP (Lembaga Kursus dan Pelatihan) & Konsultan Pendidikan Resmi Jember untuk Program Taiwan IFP 1+4, 4+1, Magang IM Japan & Pekerja Terampil SSW Tokutei Ginou. Pengurusan Visa Luar Negeri bekerjasama dengan VISA HUB INDONESIA.',
  metaKeywords: 'lkp jember, konsultan pendidikan jember, visa hub indonesia, taiwan ifp 1+4, magang jepang jember, ssw tokutei ginou, prospect education',
  officialSignatoryName: 'Rohim Egy, S.Pd.',
  officialSignatoryTitle: 'Kepala Cabang Prospect Education Jember',
};

export const INITIAL_STUDY_RESOURCES: StudyResource[] = [
  {
    id: 'res-001',
    title: 'Panduan Percakapan & Kosakata Harian Mandarin TOCFL A1-A2 (PDF)',
    description: 'Buku panduan lengkap terjemahan kosakata Bopomofo/Pinyin, percakapan sehari-hari di kampus Taiwan, serta pola kalimat utama persiapan wawancara universitas.',
    category: 'mandarin',
    categoryLabel: 'Bahasa Mandarin',
    programType: 'taiwan_ifp',
    fileFormat: 'pdf',
    fileSizeMb: 3.4,
    downloadUrl: '#',
    uploadedBy: 'Laoshi Chen - Instruktur Utama Taiwan',
    uploadedAt: '2026-07-20',
    downloadCount: 142,
    tags: ['mandarin', 'tocfl', 'bopomofo', 'pinyin', 'taiwan'],
  },
  {
    id: 'res-002',
    title: 'Lembar Kerja Latihan Menulis Kanji & Katakana JLPT N5-N4 (PDF Worksheet)',
    description: 'Worksheet cetak mandiri berisi grid urutan garis coretan (stroke order) 100 Kanji dasar dan 50 tata bahasa penting untuk persiapan ujian JLPT & JFT-Basic.',
    category: 'worksheet',
    categoryLabel: 'Lembar Kerja / Worksheet',
    programType: 'japan_ssw',
    fileFormat: 'pdf',
    fileSizeMb: 4.8,
    downloadUrl: '#',
    uploadedBy: 'Sensei Tanaka - Instruktur Magang Jepang',
    uploadedAt: '2026-07-18',
    downloadCount: 198,
    tags: ['jepang', 'kanji', 'jlpt', 'worksheet', 'latihan'],
  },
  {
    id: 'res-003',
    title: 'Checklist Berkas & Panduan Visa Pelajar TETO Taiwan 2026 (PDF)',
    description: 'Panduan teknis alur legalisir ijazah di Kemendikbud, Kemenkumham, Kemenlu, serta contoh pengisian formulir visa pelajar di TETO Jakarta.',
    category: 'visa_guide',
    categoryLabel: 'Panduan Visa & Dokumen',
    programType: 'taiwan_ifp',
    fileFormat: 'pdf',
    fileSizeMb: 2.1,
    downloadUrl: '#',
    uploadedBy: 'Tim Administrasi Keberangkatan Jember',
    uploadedAt: '2026-07-15',
    downloadCount: 88,
    tags: ['visa', 'teto', 'legalisir', 'ijazah', 'persyaratan'],
  },
  {
    id: 'res-004',
    title: 'Buku Etika Kerja Industri & Budaya Kaizen 5S Jepang (PDF)',
    description: 'Buku panduan pengenalan budaya kerja perusahaan Jepang, keselamatan kerja (Anzen), Aisatsu, dan tata tertib tinggal di Apato.',
    category: 'general',
    categoryLabel: 'Panduan Umum & Budaya',
    programType: 'japan_im',
    fileFormat: 'pdf',
    fileSizeMb: 5.2,
    downloadUrl: '#',
    uploadedBy: 'Divisi Pelatihan Industri LPK Prospect',
    uploadedAt: '2026-07-10',
    downloadCount: 115,
    tags: ['kaizen', 'budaya kerja', 'jepang', 'apato', 'k3'],
  },
  {
    id: 'res-005',
    title: 'Paket Kuis & Soal Simulasi Choukai (Listening) TOCFL & JLPT N4 (ZIP)',
    description: 'Folder paket kompresi berisi soal tes simulasi mendengarkan beserta kunci jawaban dan lembar pembahasan dari instruktur.',
    category: 'worksheet',
    categoryLabel: 'Lembar Kerja / Worksheet',
    programType: 'all',
    fileFormat: 'zip',
    fileSizeMb: 12.5,
    downloadUrl: '#',
    uploadedBy: 'Tim Akademik & E-Learning',
    uploadedAt: '2026-07-05',
    downloadCount: 230,
    tags: ['choukai', 'listening', 'simulasi', 'soal', 'kuis'],
  },
];

export const INITIAL_AUDIT_LOGS: import('../types').AuditLogEntry[] = [
  {
    id: 'audit-101',
    actorName: 'Rohim Egy, S.Pd. (Kepala Cabang / Admin Utama)',
    actorRole: 'superadmin',
    actionCategory: 'student_update',
    actionDescription: 'Mengubah status pendaftaran siswa Ahmad Subagyo menjadi "Verified (Diverifikasi)" & menerbitkan LOA Beasiswa Taiwan.',
    targetEntity: 'Siswa: Ahmad Subagyo (ID: CAND-001)',
    timestamp: '2026-07-27 18:42:10',
    ipAddress: '180.252.122.45 (Jember HQ)',
    status: 'success',
    details: 'Diubah dari "Pending" ke "Verified". Berkas Ijazah & Paspor telah disetujui.',
  },
  {
    id: 'audit-102',
    actorName: 'Siti Rahmawati, S.Kom (Webmaster)',
    actorRole: 'webmaster',
    actionCategory: 'page_edit',
    actionDescription: 'Memperbarui Teks Banner Pengumuman Darurat & Kontak WhatsApp CS Portal.',
    targetEntity: 'Pengaturan Website (WebsiteSettings)',
    timestamp: '2026-07-27 16:15:22',
    ipAddress: '180.252.122.45 (Jember HQ)',
    status: 'success',
    details: 'Banner diaktifkan untuk Pendaftaran Gelombang Utama 2026.',
  },
  {
    id: 'audit-103',
    actorName: 'Laoshi Chen Mei-Ling (Instruktur)',
    actorRole: 'admin',
    actionCategory: 'resource_upload',
    actionDescription: 'Mengunggah file modul PDF baru "Panduan Percakapan & Kosakata Harian Mandarin TOCFL A1-A2".',
    targetEntity: 'Perpustakaan Digital (ID: res-001)',
    timestamp: '2026-07-26 14:08:44',
    ipAddress: '114.122.204.12 (Jember East)',
    status: 'success',
    details: 'Ukuran file: 3.4 MB, Format: PDF.',
  },
  {
    id: 'audit-104',
    actorName: 'Bambang Triyono, S.E. (Keuangan)',
    actorRole: 'finance',
    actionCategory: 'financial_edit',
    actionDescription: 'Memasukkan Rekap Laporan Keuangan Bulan Juli 2026 & Pencatatan Subdivisi Beasiswa.',
    targetEntity: 'Laporan Finansial (Juli 2026)',
    timestamp: '2026-07-25 11:30:00',
    ipAddress: '180.252.122.45 (Jember HQ)',
    status: 'success',
    details: 'Total Penerimaan: Rp 450.000.000, Total Pengeluaran: Rp 280.000.000.',
  },
  {
    id: 'audit-105',
    actorName: 'Siti Rahmawati, S.Kom (Webmaster)',
    actorRole: 'webmaster',
    actionCategory: 'security',
    actionDescription: 'Sistem mendeteksi percobaan login gagal dari perangkat tidak dikenal.',
    targetEntity: 'Portal Admin Panel Security',
    timestamp: '2026-07-24 23:12:05',
    ipAddress: '36.88.192.10 (Surabaya IP)',
    status: 'warning',
    details: 'Percobaan login 3x gagal untuk akun admin_backup. Blokir sementara diterapkan 15 menit.',
  },
  {
    id: 'audit-106',
    actorName: 'Rohim Egy, S.Pd. (Kepala Cabang / Admin Utama)',
    actorRole: 'superadmin',
    actionCategory: 'student_update',
    actionDescription: 'Mengubah status Budi Santoso menjadi "Berangkat (Departed)" ke Taiwan.',
    targetEntity: 'Siswa: Budi Santoso (ID: CAND-002)',
    timestamp: '2026-07-22 09:20:15',
    ipAddress: '180.252.122.45 (Jember HQ)',
    status: 'success',
    details: 'Penerbangan CI-752 Jakarta - Taipei.',
  },
];

export const INITIAL_DOCUMENT_REQUESTS: import('../types').DocumentRequest[] = [
  {
    id: 'DOC-REQ-101',
    candidateId: 'CAND-001',
    candidateName: 'Ahmad Subagyo',
    documentType: 'surat_keterangan_aktif',
    documentTypeName: 'Surat Keterangan Aktif Pelatihan LKP',
    purpose: 'Pengurusan Bebas Beban & Pengajuan Paspor di Kantor Imigrasi Jember',
    notes: 'Mohon dicantumkan nomor registrasi LKP resmi dan stempel basah.',
    requestDate: '2026-07-26 10:15:00',
    status: 'ready',
    estimatedCompletionDate: '2026-07-27',
    downloadUrl: '#download-surat-aktif-cand001',
    processedBy: 'Siti Rahmawati, S.Kom (Admin Akademik)',
    trackingHistory: [
      {
        status: 'submitted',
        title: 'Pengajuan Dikirimkan',
        note: 'Siswa membuat permohonan penerbitan Surat Keterangan Aktif Belajar.',
        timestamp: '2026-07-26 10:15:00',
      },
      {
        status: 'processing',
        title: 'Verifikasi & Pencetakan Draf',
        note: 'Staf akademik memeriksa keaktifan presensi dan menerbitkan draf nomor surat.',
        timestamp: '2026-07-26 14:30:00',
      },
      {
        status: 'signed',
        title: 'Penandatanganan Pimpinan LKP',
        note: 'Dokumen disetujui dan ditandatangani secara digital/stempel oleh Direktur LKP Prospect.',
        timestamp: '2026-07-27 09:00:00',
      },
      {
        status: 'ready',
        title: 'Dokumen Siap Diunduh',
        note: 'Surat Keterangan Aktif resmi berformat PDF berstempel telah diterbitkan & siap diunduh.',
        timestamp: '2026-07-27 11:20:00',
      },
    ],
  },
  {
    id: 'DOC-REQ-102',
    candidateId: 'CAND-001',
    candidateName: 'Ahmad Subagyo',
    documentType: 'transkrip_nilai',
    documentTypeName: 'Transkrip Nilai Akademik & Sertifikat Kemampuan Bahasa (TOCFL/JLPT)',
    purpose: 'Lampiran Berkas Beasiswa Taiwan IFP Universitas National Formosa',
    notes: 'Diperlukan terjemahan nilai bahasa Mandarin Bab 1-10.',
    requestDate: '2026-07-27 15:40:00',
    status: 'processing',
    estimatedCompletionDate: '2026-07-29',
    processedBy: 'Laoshi Chen Mei-Ling (Instruktur Mandarin)',
    trackingHistory: [
      {
        status: 'submitted',
        title: 'Pengajuan Dikirimkan',
        note: 'Permohonan transkrip nilai akademik berhasil masuk ke sistem admin.',
        timestamp: '2026-07-27 15:40:00',
      },
      {
        status: 'processing',
        title: 'Sedang Diproses Pengampu Nilai',
        note: 'Tim Kurikulum sedang merekapitulasi nilai evaluasi mingguan dan ujian simulasi.',
        timestamp: '2026-07-27 17:00:00',
      },
    ],
  },
];

export const INITIAL_PORTFOLIOS: import('../types').StudentPortfolio[] = [
  {
    candidateId: 'CAND-001',
    candidateName: 'Ahmad Subagyo',
    bioSummary: 'Peserta aktif Program Beasiswa Taiwan IFP 1+4 Universitas National Formosa (NFU). Memiliki disiplin tinggi, kompetensi bahasa Mandarin dasar-menengah (TOCFL A2), serta keahlian bidang Pemesinan Teknik & Pemrograman CNC.',
    careerGoals: 'Menyelesaikan pendidikan Sarjana Teknik Elektro / Industri di Taiwan dan berkarir sebagai Engineer Profesional di perusahaan manufaktur multinasional.',
    skills: [
      {
        id: 'sk-1',
        name: 'Bahasa Mandarin (TOCFL Band A2)',
        category: 'Bahasa',
        proficiency: 'Menengah',
        certificateTitle: 'Sertifikat Evaluasi TOCFL A2 LKP Prospect',
      },
      {
        id: 'sk-2',
        name: 'Bahasa Inggris Vokasional (TOEIC 650)',
        category: 'Bahasa',
        proficiency: 'Menengah',
        certificateTitle: 'TOEIC Official Score Report',
      },
      {
        id: 'sk-3',
        name: 'Pemesinan Komputer & CNC Milling',
        category: 'Teknis & Vokasi',
        proficiency: 'Mahir',
        certificateTitle: 'Sertifikat Kompetensi Mekanik BNSP',
      },
      {
        id: 'sk-4',
        name: 'Autocad & SolidWorks 3D Modeling',
        category: 'Teknis & Vokasi',
        proficiency: 'Menengah',
        certificateTitle: 'Pelatihan Vokasi SMK Jember',
      },
      {
        id: 'sk-5',
        name: 'Kepemimpinan & Komunikasi Lintas Budaya',
        category: 'Soft Skills',
        proficiency: 'Mahir',
        certificateTitle: 'Pelatihan Karakter LKP Prospect',
      },
    ],
    certificates: [
      {
        id: 'cert-101',
        title: 'Sertifikat Kelulusan Program Intensif Bahasa Mandarin Level A2',
        issuer: 'LKP Prospect Education Jember',
        issueDate: '2026-06-15',
        category: 'Sertifikat LKP',
        verifiedStatus: 'verified',
        fileUrl: '#cert-mandarin-a2',
      },
      {
        id: 'cert-102',
        title: 'Sertifikat Kompetensi Pengoperasian Mesin Perkakas (BNSP)',
        issuer: 'Badan Nasional Sertifikasi Profesi (BNSP RI)',
        issueDate: '2025-11-20',
        category: 'Vokasi & Keahlian',
        verifiedStatus: 'verified',
        fileUrl: '#cert-bnsp-mesin',
      },
      {
        id: 'cert-103',
        title: 'Juara 2 LKS (Lomba Kompetensi Siswa) SMK Se-Kabupaten Jember',
        issuer: 'Dinas Pendidikan Provinsi Jawa Timur',
        issueDate: '2025-05-10',
        category: 'Prestasi & Penghargaan',
        verifiedStatus: 'verified',
        fileUrl: '#cert-lks-jember',
      },
    ],
    shareCode: 'PORTFOLIO-AHMAD-NFU2026',
    isPublic: true,
    updatedAt: '2026-07-27 18:30:00',
  },
];

export const INITIAL_ATTENDANCES: AttendanceRecord[] = [
  {
    id: 'att-101',
    candidateId: 'cand-001',
    candidateName: 'Ahmad Subagyo',
    registrationNumber: 'REG-2026-TW001',
    className: 'Kelas Bahasa Mandarin Intensif Level A1 - Ruang 102',
    programType: 'taiwan_ifp',
    method: 'qr',
    date: new Date().toISOString().split('T')[0],
    checkInTime: '07:48:15',
    status: 'hadir',
    locationName: 'Gedung LKP Prospect Education Jember (Scan QR Terverifikasi)',
    coordinates: { lat: -8.1685, lng: 113.7170 },
    verifiedBySystem: true,
    notes: 'Presensi Scan QR Code di Pintu Masuk Lab Bahasa LKP',
  },
  {
    id: 'att-102',
    candidateId: 'cand-001',
    candidateName: 'Ahmad Subagyo',
    registrationNumber: 'REG-2026-TW001',
    className: 'Kelas Bahasa Mandarin Intensif Level A1 - Ruang 102',
    programType: 'taiwan_ifp',
    method: 'gps',
    date: '2026-08-05',
    checkInTime: '07:55:02',
    status: 'hadir',
    locationName: 'Kampus Prospect Education Jember (Radius GPS < 85 meter)',
    coordinates: { lat: -8.1687, lng: 113.7169 },
    verifiedBySystem: true,
    notes: 'Check-in GPS Lokasi Kampus Jember',
  },
  {
    id: 'att-103',
    candidateId: 'cand-002',
    candidateName: 'Siti Nurhaliza',
    registrationNumber: 'REG-2026-JP002',
    className: 'Kelas Bahasa Jepang Dasar (Shokyu N5) - Ruang 104',
    programType: 'japan_im',
    method: 'qr',
    date: new Date().toISOString().split('T')[0],
    checkInTime: '08:05:40',
    status: 'terlambat',
    locationName: 'Gedung LKP Prospect Education Jember (Scan QR)',
    coordinates: { lat: -8.1685, lng: 113.7170 },
    verifiedBySystem: true,
    notes: 'Terlambat 5 menit karena kendala lalu lintas Jember Kota',
  },
];




