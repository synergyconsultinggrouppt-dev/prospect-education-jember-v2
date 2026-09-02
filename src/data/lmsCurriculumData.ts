import { LMSModule } from '../types';

export const COMPREHENSIVE_LMS_MODULES: LMSModule[] = [
  // =========================================================================
  // TAIWAN TRACK - 3 BULAN INTENSIF PEMBEKALAN
  // =========================================================================

  // --- BULAN 1: FONDASI BAHASA, FONETIK & TATA BAHASA DASAR ---
  {
    id: 'tw-m1-01',
    programType: 'taiwan_ifp',
    language: 'Mandarin',
    monthLevel: 1,
    weekLabel: 'Bulan 1 • Minggu 1-2',
    title: 'Fondasi Fonetik Mandarin: Pinyin, Zhuyin (Bopomofo) & 4 Nada Dasar',
    description: 'Modul komprehensif menguasai sistem ejaan Pinyin, pengenalan simbol Zhuyin Fuhao (Bopomofo) yang dipakai di Taiwan, serta latihan 4 nada vokal (Shēngdiào) agar tidak salah arti saat berbicara di kampus.',
    contentType: 'video',
    videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/b9Mult_SkBo',
    durationMinutes: 60,
    timeSpentMinutes: 60,
    progressPercent: 100,
    isCompleted: true,
    vocabularyList: [
      { term: '你好', reading: 'Nǐ hǎo (ㄋㄧˇ ㄏㄠˇ)', meaning: 'Halo / Apa kabar', exampleSentence: '你好，我是印尼學生。 (Nǐ hǎo, wǒ shì Yìnní xuéshēng.)' },
      { term: '謝謝', reading: 'Xièxie (ㄒㄧㄝˋ ㄒㄧㄝ˙)', meaning: 'Terima kasih', exampleSentence: '謝謝老師的指導。 (Xièxie lǎoshī de zhǐdǎo.)' },
      { term: '不客氣', reading: 'Bú kèqi (ㄅㄨˊ ㄎㄜˋ ㄑㄧ˙)', meaning: 'Sama-sama / Terima kasih kembali', exampleSentence: '不客氣，別客氣。 (Bú kèqi, bié kèqi.)' },
      { term: '對不起', reading: 'Duìbuqǐ (ㄉㄨㄟˋ ㄅㄨ˙ ㄑㄧˇ)', meaning: 'Maaf / Mohon maaf', exampleSentence: '對不起，我遲到了。 (Duìbuqǐ, wǒ chídào le.)' },
      { term: '沒關係', reading: 'Méi guānxi (ㄇㄟˊ ㄍㄨㄢ ㄒㄧ˙)', meaning: 'Tidak apa-apa / Tidak masalah', exampleSentence: '沒關係，請進。 (Méi guānxi, qǐng jìn.)' },
      { term: '再見', reading: 'Zàijiàn (ㄗㄞˋ ㄐㄧㄢˋ)', meaning: 'Sampai jumpa / Selamat tinggal', exampleSentence: '明天見，再見！ (Míngtiān jiàn, zàijiàn!)' },
    ],
    keyGrammarPoints: [
      {
        pattern: 'Subjek + 是 (shì) + Objek',
        meaning: 'Pola kalimat penegasan identitas (Adalah / Yaitu)',
        explanation: 'Kata "是" (shì) digunakan seperti to-be dalam bahasa Inggris untuk menghubungkan subjek dengan kata benda identitasnya.',
        example: '我是印尼留學生。 (Wǒ shì Yìnní liúxuéshēng - Saya adalah mahasiswa perantau asal Indonesia).'
      },
      {
        pattern: '4 Nada Mandarin (聲調 Shēngdiào)',
        meaning: 'Nada 1 (Datar Tinggi: ā), Nada 2 (Naik: á), Nada 3 (Turun-Naik: ǎ), Nada 4 (Turun Tegas: à)',
        explanation: 'Perubahan nada akan mengubah arti kata sepenuhnya. Contoh: 媽 (mā = ibu), 麻 (má = rami), 馬 (mǎ = kuda), 罵 (mà = memarahi).',
        example: '請注意聲調變化。 (Qǐng zhùyì shēngdiào biànhuà - Harap perhatikan perubahan intonasi nada).'
      }
    ],
    practicalTips: [
      'Gunakan cermin saat melatih nada ke-3 (ǎ) agar dagu bergerak turun dan naik secara mantap.',
      'Di Taiwan, papan nama stasiun dan menu sering menggunakan karakter tradisional (繁體字 - Fántǐzì). Biasakan membaca karakter tradisional.',
      'Prospect Education Jember menyediakan modul cetak Bopomofo khusus untuk mempermudah penulisan keyboard HP sistem Taiwan.'
    ]
  },
  {
    id: 'tw-m1-02',
    programType: 'taiwan_ifp',
    language: 'Mandarin',
    monthLevel: 1,
    weekLabel: 'Bulan 1 • Minggu 3-4',
    title: 'Audio Listening & Dialog: Perkenalan Diri (自我介紹) & Angka/Hari',
    description: 'Latihan audio interaktif menyimak dan melafalkan kalimat perkenalan diri resmi di depan dosen/pengajar, menanyakan asal universitas, serta penguasaan angka, tanggal, dan mata uang NTD (New Taiwan Dollar).',
    contentType: 'audio',
    durationMinutes: 45,
    timeSpentMinutes: 45,
    progressPercent: 100,
    isCompleted: true,
    audioTranscript: [
      { speaker: 'Lǎoshī (Guru)', text: '請你簡單做個自我介紹，好嗎？', reading: 'Qǐng nǐ jiǎndān zuò ge zìwǒ jièshào, hǎo ma?', translation: 'Silakan kamu perkenalkan dirimu secara singkat, ya?' },
      { speaker: 'Dewi (Siswa)', text: '老師好！我叫 Dewi，我來自印尼東爪哇省任抹縣。', reading: 'Lǎoshī hǎo! Wǒ jiào Dewi, wǒ láizì Yìnní Dōng Zhǎowā Shěng Rènmǒ Xiàn.', translation: 'Halo Guru! Nama saya Dewi, saya berasal dari Kabupaten Jember, Jawa Timur, Indonesia.' },
      { speaker: 'Dewi (Siswa)', text: '我今年十九歲，很高興能參加台灣 IFP 1+4 國際專班。', reading: 'Wǒ jīnnián shíjiǔ suì, hěn gāoxìng néng cānjiā Táiwān IFP 1+4 guójì zhuānbān.', translation: 'Saya tahun ini berusia 19 tahun, sangat senang bisa mengikuti program khusus internasional Taiwan IFP 1+4.' },
      { speaker: 'Lǎoshī (Guru)', text: '很好！你的中文發音很標準，請繼續加油！', reading: 'Hěn hǎo! Nǐ de Zhōngwén fāyīn hěn biāozhǔn, qǐng jìxù jiāyóu!', translation: 'Bagus sekali! Pelafalan bahasa Mandarinmu sangat standar, silakan terus bersemangat!' },
    ],
    vocabularyList: [
      { term: '自我介紹', reading: 'Zìwǒ jièshào', meaning: 'Perkenalan diri', exampleSentence: '請開始你的自我介紹。 (Qǐng kāishǐ nǐ de zìwǒ jièshào.)' },
      { term: '名字', reading: 'Míngzi', meaning: 'Nama', exampleSentence: '你叫什麼名字？ (Nǐ jiào shénme míngzi?)' },
      { term: '歲', reading: 'Suì', meaning: 'Tahun usia / umur', exampleSentence: '我今年二十歲。 (Wǒ jīnnián èrshí suì.)' },
      { term: '新台幣', reading: 'Xīntáibì (NTD)', meaning: 'Mata uang Dollar Taiwan Baru', exampleSentence: '這本書三百元新台幣。 (Zhè běn shū sānbǎi yuán Xīntáibì.)' },
      { term: '星期 / 禮拜', reading: 'Xīngqī / Lǐbài', meaning: 'Minggu / Hari', exampleSentence: '今天星期一。 (Jīntiān xīngqīyī - Hari ini hari Senin.)' },
    ],
    keyGrammarPoints: [
      {
        pattern: '我叫 + [Nama], 我來自 + [Asal Daerah]',
        meaning: 'Rumus baku perkenalan diri',
        explanation: 'Format standar yang sopan saat memperkenalkan nama dan asal negara/daerah.',
        example: '我叫 Rizky，我來自印尼任抹。 (Wǒ jiào Rizky, wǒ láizì Yìnní Rènmǒ.)'
      }
    ],
    practicalTips: [
      'Gunakan sapaan 老師好 (Lǎoshī hǎo) kepada dosen dan 學長/學姐 (Xuécháng/Xuéjiě) kepada senior kampus di Taiwan.',
      'Sebutkan nama lengkap sesuai dengan paspor internasional.'
    ]
  },

  // --- BULAN 2: PERCAKAPAN LAPANGAN, BELANJA, KAMPUS & WAWANCARA ---
  {
    id: 'tw-m2-01',
    programType: 'taiwan_ifp',
    language: 'Mandarin',
    monthLevel: 2,
    weekLabel: 'Bulan 2 • Minggu 5-6',
    title: 'Percakapan Kampus, Belanja Pasar Malam & Navigasi Transportasi MRT/Bus',
    description: 'Panduan percakapan praktis bertanya arah, memesan makanan halal di kafetaria/pasar malam (Yèshì), membeli tiket MRT menggunakan kartu EasyCard (Yōuyóukǎ), serta interaksi di minimarket (7-Eleven/FamilyMart).',
    contentType: 'video',
    videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/5Wfl73JcO8E',
    durationMinutes: 50,
    timeSpentMinutes: 50,
    progressPercent: 100,
    isCompleted: true,
    audioTranscript: [
      { speaker: 'Siswa', text: '請問，這個有豬肉嗎？我不吃豬肉。', reading: 'Qǐngwèn, zhège yǒu zhūròu ma? Wǒ bù chī zhūròu.', translation: 'Permisi mau tanya, apakah makanan ini mengandung daging babi? Saya tidak makan daging babi.' },
      { speaker: 'Penjual', text: '這個是雞肉炒飯，沒有豬肉，可以放心吃。', reading: 'Zhège shì jīròu chǎofàn, méiyǒu zhūròu, kěyǐ fàngxīn chī.', translation: 'Ini nasi goreng ayam, tidak ada daging babi, bisa dinikmati dengan tenang.' },
      { speaker: 'Siswa', text: '好的，請給我一份，外帶，謝謝！', reading: 'Hǎo de, qǐng gěi wǒ yí fèn, wàidài, xièxie!', translation: 'Baiklah, tolong berikan saya satu porsi, dibungkus bawa pulang, terima kasih!' },
    ],
    vocabularyList: [
      { term: '清真 / 不吃豬肉', reading: 'Qīngzhēn / Bù chī zhūròu', meaning: 'Halal / Tidak makan babi', exampleSentence: '請問有清真認證嗎？ (Qǐngwèn yǒu qīngzhēn rènzhèng ma?)' },
      { term: '悠遊卡', reading: 'Yōuyóukǎ (EasyCard)', meaning: 'Kartu transportasi multifungsi Taiwan', exampleSentence: '我要加值悠遊卡五百元。 (Wǒ yào jiāzhí Yōuyóukǎ wǔbǎi yuán.)' },
      { term: '內用 / 外帶', reading: 'Nèiyòng / Wàidài', meaning: 'Makan di tempat / Dibungkus bawa pulang', exampleSentence: '你要內用還是外帶？ (Nǐ yào nèiyòng háishì wàidài?)' },
      { term: '捷運站', reading: 'Jiéyùn zhàn (MRT Station)', meaning: 'Stasiun kereta bawah tanah MRT', exampleSentence: '捷運站在哪裡？ (Jiéyùn zhàn zài nǎlǐ?)' },
    ],
    keyGrammarPoints: [
      {
        pattern: '請問 + [Pertanyaan] + 在哪裡 (zài nǎlǐ)?',
        meaning: 'Permisi menanyakan letak lokasi / fasilitas',
        explanation: 'Gunakan "請問" (Qǐngwèn) di awal kalimat untuk menunjukkan kesopanan tinggi.',
        example: '請問圖書館在哪裡？ (Qǐngwèn túshūguǎn zài nǎlǐ? - Permisi perpustakaan di mana ya?)'
      }
    ]
  },
  {
    id: 'tw-m2-02',
    programType: 'taiwan_ifp',
    language: 'Inggris',
    monthLevel: 2,
    weekLabel: 'Bulan 2 • Minggu 7-8',
    title: 'English for International Campus & Persiapan Wawancara Masuk Universitas',
    description: 'Simulasi wawancara resmi bersama Office of International Affairs (OIA) kampus Taiwan. Memahami motivasi studi, rencana akademik, dan etika saat sesi video conference.',
    contentType: 'pdf',
    durationMinutes: 40,
    timeSpentMinutes: 40,
    progressPercent: 100,
    isCompleted: true,
    vocabularyList: [
      { term: 'Study Plan', reading: '學習計畫 (Xuéxí jìhuà)', meaning: 'Rencana studi akademik', exampleSentence: 'My study plan focuses on Smart Manufacturing.' },
      { term: 'Scholarship', reading: '獎學金 (Jiǎngxuéjīn)', meaning: 'Beasiswa / Subsidi Kuliah', exampleSentence: 'I am applying for the international tuition waiver.' },
      { term: 'Career Goals', reading: '職涯目標 (Zhíyá mùbiāo)', meaning: 'Target karir masa depan', exampleSentence: 'I aim to become a bilingual professional engineer.' },
    ],
    keyGrammarPoints: [
      {
        pattern: 'I chose this program because [Reason] and I intend to [Goal]',
        meaning: 'Struktur jawaban wawancara motivasi akademik',
        explanation: 'Jawab dengan singkat, padat, dan percaya diri tanpa hafalan kaku.',
        example: 'I chose Taiwan IFP because it provides strong practical industry training alongside degree studies.'
      }
    ]
  },

  // --- BULAN 3: REGULASI IMIGRASI, ARC, ASURANSI & KEBERANGKATAN ---
  {
    id: 'tw-m3-01',
    programType: 'taiwan_ifp',
    language: 'Mandarin',
    monthLevel: 3,
    weekLabel: 'Bulan 3 • Minggu 9-10',
    title: 'Orientasi Hukum Taiwan: Kartu Izin Tinggal (ARC), Asuransi NHI & Izin Kerja',
    description: 'Panduan resmi pengurusan Alien Resident Certificate (ARC) di National Immigration Agency Taiwan, pendaftaran National Health Insurance (NHI), serta aturan legal kerja part-time mahasiswa (maksimal 20 jam/minggu saat kuliah).',
    contentType: 'video',
    videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/P6aY4TknJp4',
    durationMinutes: 45,
    timeSpentMinutes: 30,
    progressPercent: 75,
    isCompleted: false,
    practicalTips: [
      'Simpan bukti pendaftaran ARC dan fotokopi paspor di map dokumen terpisah saat tiba di Bandara Taoyuan (TPE).',
      'Jangan pernah bekerja part-time tanpa izin kerja resmi (Work Permit) yang diterbitkan oleh Kementerian Tenaga Kerja Taiwan (MOL).',
      'Kartu Asuransi Kesehatan NHI Taiwan menjamin biaya pengobatan dokter umum & spesialis dengan biaya sangat terjangkau.'
    ],
    vocabularyList: [
      { term: '居留證', reading: 'Jūliúzhèng (ARC)', meaning: 'Kartu Izin Tinggal Sementara Taiwan', exampleSentence: '請出示你的居留證。 (Qǐng chūshì nǐ de jūliúzhèng.)' },
      { term: '工作證', reading: 'Gōngzuòzhèng (Work Permit)', meaning: 'Surat Izin Kerja Mahasiswa', exampleSentence: '工讀需要申請工作證。 (Gōngdú xūyào shēnqǐng gōngzuòzhèng.)' },
      { term: '全民健保', reading: 'Quánmín jiànbǎo (NHI)', meaning: 'Asuransi Kesehatan Nasional Taiwan', exampleSentence: '健保卡去看醫生很方便。 (Jiànbǎokǎ qù kàn yīshēng hěn fāngbiàn.)' },
    ]
  },
  {
    id: 'tw-m3-02',
    programType: 'taiwan_ifp',
    language: 'Mandarin',
    monthLevel: 3,
    weekLabel: 'Bulan 3 • Minggu 11-12',
    title: 'Tryout Evaluasi Kelulusan & Uji Pemahaman Sertifikat Resmi Prospect Education',
    description: 'Ujian komprehensif 3 bulan pembekalan untuk menguji kesiapan bahasa, etika kampus, dan pemahaman regulasi sebelum pemberangkatan ke Taiwan.',
    contentType: 'quiz',
    durationMinutes: 40,
    timeSpentMinutes: 0,
    progressPercent: 0,
    isCompleted: false,
    quizQuestions: [
      {
        id: 'twq-1',
        question: 'Berapakah batasan jam kerja part-time legal bagi mahasiswa internasional di Taiwan selama semester perkuliahan aktif berlangsung?',
        options: ['Maksimal 20 jam per minggu', 'Maksimal 40 jam per minggu', 'Bebas tanpa batas waktu', 'Maksimal 5 jam per minggu'],
        correctAnswerIndex: 0,
        explanation: 'Berdasarkan regulasi Kementerian Tenaga Kerja Taiwan (MOL), mahasiswa pemegang Work Permit diizinkan bekerja legal maksimal 20 jam per minggu selama masa perkuliahan aktif (libur semester musim panas/dingin boleh full-time).'
      },
      {
        id: 'twq-2',
        question: 'Dokumen identitas resmi yang wajib diurus dalam 30 hari setelah tiba di Taiwan sebagai bukti izin tinggal legal adalah:',
        options: ['Alien Resident Certificate (居留證 / ARC)', 'Kartu SIM Prabayar Lokal', 'Kartu Member Supermarket', 'Surat Izin Mengemudi Internasional'],
        correctAnswerIndex: 0,
        explanation: 'ARC (Alien Resident Certificate / Jūliúzhèng) adalah kartu identitas izin tinggal wajib bagi warga asing yang tinggal lebih dari 180 hari di Taiwan.'
      },
      {
        id: 'twq-3',
        question: 'Bagaimanakah kebijakan sertifikat bahasa untuk pendaftar Program Taiwan IFP 1+4 di Prospect Education Jember?',
        options: [
          'Tidak wajib sertifikat TOCFL; cukup pembekalan intensif di Prospect Education Jember hingga meraih Sertifikat Pembekalan Resmi, lalu 1 tahun penguatan bahasa di Taiwan',
          'Wajib lulus ujian TOCFL Level B2 di Jakarta sebelum mendaftar',
          'Wajib memiliki sertifikat TOEFL iBT skor 90',
          'Tidak ada pelatihan bahasa sama sekali'
        ],
        correctAnswerIndex: 0,
        explanation: 'Program IFP 1+4 dirancang tanpa kewajiban sertifikat TOCFL di awal pendaftaran. Peserta dibekali bahasa Mandarin & orientasi di Prospect Education Jember, kemudian menjalani 1 tahun penguatan bahasa intensif langsung di kampus Taiwan sebelum masuk perkuliahan S1.'
      },
      {
        id: 'twq-4',
        question: 'Saat memesan makanan di Taiwan dan ingin memastikan makanan tidak mengandung daging babi, kalimat yang tepat adalah:',
        options: ['請問，這個有豬肉嗎？我不吃豬肉。 (Qǐngwèn, zhège yǒu zhūròu ma? Wǒ bù chī zhūròu.)', '我要吃牛肉麵。 (Wǒ yào chī niúròumiàn.)', '這杯飲料很甜。 (Zhè bēi yǐnliào hěn tián.)', '請算便宜一點。 (Qǐng suàn piányí yīdiǎn.)'],
        correctAnswerIndex: 0,
        explanation: 'Kalimat "請問，這個有豬肉嗎？我不吃豬肉。" berarti "Permisi, apakah ini mengandung babi? Saya tidak makan babi."'
      }
    ]
  },

  // =========================================================================
  // JAPAN TRACK - 3 BULAN INTENSIF PEMBEKALAN (IM JAPAN & SSW TOKUTEI GINOU)
  // =========================================================================

  // --- BULAN 1: HURUF HIRAGANA/KATAKANA, AISATSU & BUNPOU DASAR N5 ---
  {
    id: 'jp-m1-01',
    programType: 'japan_im',
    language: 'Jepang',
    monthLevel: 1,
    weekLabel: 'Bulan 1 • Minggu 1-2',
    title: 'Penguasaan Karakter Huruf Hiragana, Katakana & Pelafalan Standar (Hatsuon)',
    description: 'Modul fundamental menghafal 46 huruf Hiragana dan 46 huruf Katakana, aturan bunyi panjang (Chouon), konsonan ganda (Sokuon), dan pelafalan aksen Jepang standar untuk kesiapan magang dan kerja SSW.',
    contentType: 'video',
    videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/6p9Il_j0zjc',
    durationMinutes: 60,
    timeSpentMinutes: 60,
    progressPercent: 100,
    isCompleted: true,
    vocabularyList: [
      { term: 'おはようございます', reading: 'Ohayou gozaimasu', meaning: 'Selamat pagi (Sopan di tempat kerja)', exampleSentence: '皆さん、おはようございます！ (Minasan, ohayou gozaimasu!)' },
      { term: 'お疲れ様です', reading: 'Otsukaresama desu', meaning: 'Terima kasih atas kerja kerasnya (Salam kerja standar)', exampleSentence: '今日も一日お疲れ様でした。 (Kyou mo ichinichi otsukaresama deshita.)' },
      { term: '失礼します', reading: 'Shitsurei shimasu', meaning: 'Permisi / Mohon maaf (Saat masuk ruangan atasan)', exampleSentence: '失礼します、入ってもよろしいですか。 (Shitsurei shimasu, haitte mo yoroshii desu ka.)' },
      { term: 'かしこまりました', reading: 'Kashikomarimashita', meaning: 'Dimengerti / Siap laksanakan (Kepada atasan/klien)', exampleSentence: 'はい、かしこまりました。すぐに作業します。 (Hai, kashikomarimashita. Sugu ni sagyou shimasu.)' },
      { term: 'すみません', reading: 'Sumimasen', meaning: 'Maaf / Permisi / Terima kasih', exampleSentence: 'すみません、もう一度教えてください。 (Sumimasen, mou ichido oshiete kudasai.)' },
    ],
    keyGrammarPoints: [
      {
        pattern: 'KB1 は KB2 です (KB1 wa KB2 desu)',
        meaning: 'Pola kalimat penegasan (KB1 adalah KB2)',
        explanation: 'Partikel は (dibaca "wa") bertindak sebagai penanda topik utama kalimat.',
        example: 'わたしは プロスペクト・エデュケーションの じっしゅうせいです。 (Watashi wa Prospect Education no jisshuusei desu - Saya peserta magang Prospect Education).'
      },
      {
        pattern: 'KB1 は KB2 じゃありません / ではありません',
        meaning: 'Pola kalimat negatif dasar (KB1 bukan KB2)',
        explanation: 'Bentuk sangkalan sopan untuk menyatakan identitas/status.',
        example: 'わたしは がくせいじゃありません。 (Watashi wa gakusei ja arimasen - Saya bukan mahasiswa).'
      }
    ],
    practicalTips: [
      'Gunakan flashcard digital atau tulis tangan setiap hari 20 huruf hingga hafal tanpa ragu.',
      'Katakana wajib dikuasai untuk membaca nama alat teknis, istilah pabrik, menu makanan, dan nama paspor Anda.'
    ]
  },
  {
    id: 'jp-m1-02',
    programType: 'japan_ssw',
    language: 'Jepang',
    monthLevel: 1,
    weekLabel: 'Bulan 1 • Minggu 3-4',
    title: 'Audio Listening & Drill: Jikoshoukai (Perkenalan Diri) & Aisatsu Kerja',
    description: 'Sesi audio menyimak percakapan native, teknik membungkuk (Ojigi 15°, 30°, 45°), dan latihan melafalkan Jikoshoukai yang percaya diri di hadapan pewawancara industri Jepang.',
    contentType: 'audio',
    durationMinutes: 45,
    timeSpentMinutes: 45,
    progressPercent: 100,
    isCompleted: true,
    audioTranscript: [
      { speaker: 'Mensetsukan (Pewawancara)', text: 'では、自己紹介をお願いします。', reading: 'Dewa, jikoshoukai o onegai shimasu.', translation: 'Baiklah, silakan lakukan perkenalan diri Anda.' },
      { speaker: 'Hendra (Peserta)', text: '初めまして！私の名前は Hendra Wijaya と申します。インドネシアの東ジャワ州ジェンベルから参りました。', reading: 'Hajimemashite! Watashi no namae wa Hendra Wijaya to moushimasu. Indoneshia no Higashi Jawa-shuu Jenberu kara mairimashita.', translation: 'Senang bertemu dengan Anda! Nama saya Hendra Wijaya. Saya datang dari Jember, Jawa Timur, Indonesia.' },
      { speaker: 'Hendra (Peserta)', text: '年齢は二十二歳です。体力と真面目さには自信があります。一生懸命頑張りますので、よろしくお願いいたします！', reading: 'Nenrei wa nijuuni-sai desu. Tairyoku to majimesa ni wa jishin ga arimasu. Isshoukenmei gambarimasu node, yoroshiku onegai itashimasu!', translation: 'Usia saya 22 tahun. Saya percaya diri dengan ketahanan fisik dan kesungguhan kerja saya. Saya akan berusaha sekuat tenaga, mohon bimbingannya!' },
      { speaker: 'Mensetsukan (Pewawancara)', text: '元気な声で素晴らしいですね。どうぞ座ってください。', reading: 'Genki na koe de subarashii desu ne. Douzo suwatte kudasai.', translation: 'Suara yang bersemangat dan luar biasa. Silakan duduk.' },
    ],
    vocabularyList: [
      { term: '初めまして', reading: 'Hajimemashite', meaning: 'Senang berkenalan dengan Anda pertama kali', exampleSentence: '初めまして、ヘンドラです。 (Hajimemashite, Hendora desu.)' },
      { term: '一生懸命', reading: 'Isshoukenmei', meaning: 'Bersungguh-sungguh sekuat tenaga', exampleSentence: '一生懸命勉強します。 (Isshoukenmei benkyou shimasu.)' },
      { term: 'どうぞよろしくお願いいたします', reading: 'Douzo yoroshiku onegai itashimasu', meaning: 'Mohon bantuan dan bimbingan kerjasamanya', exampleSentence: 'これからどうぞよろしくお願いいたします。' },
    ],
    keyGrammarPoints: [
      {
        pattern: '名前 + と申します (to moushimasu)',
        meaning: 'Bentuk Kenjougo (Sangat Sopan / Merendah) untuk menyebutkan nama',
        explanation: 'Digunakan dalam suasana wawancara kerja resmi Jepang agar dinilai beradab tinggi.',
        example: 'Dewi と申します。 (Dewi to moushimasu - Saya dipanggil Dewi).'
      }
    ]
  },

  // --- BULAN 2: KOMUNIKASI LAPANGAN, PERINTAH KERJA & SIMULASI MENSETSU ---
  {
    id: 'jp-m2-01',
    programType: 'japan_im',
    language: 'Jepang',
    monthLevel: 2,
    weekLabel: 'Bulan 2 • Minggu 5-6',
    title: 'Percakapan Tempat Kerja: Menerima Instruksi Kerja (Shiji) & Istilah Teknis',
    description: 'Modul bahasa Jepang operasional untuk memahami perintah atasan di pabrik, gudang, pertanian, atau fasilitas lansia (Kaigo), serta cara meminta konfirmasi ulang bila belum mengerti.',
    contentType: 'video',
    videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/5hV9bX12y8g',
    durationMinutes: 55,
    timeSpentMinutes: 55,
    progressPercent: 100,
    isCompleted: true,
    audioTranscript: [
      { speaker: 'Koujou-chou (Kepala Pabrik)', text: 'ヘンドラ君、この部品をあちらの棚に運んでください。', reading: 'Hendora-kun, kono buhin o achira no tana ni hakonde kudasai.', translation: 'Hendra, tolong bawa komponen ini ke rak sebelah sana ya.' },
      { speaker: 'Hendra (Peserta)', text: 'はい、かしこまりました。あちらの青い棚ですね？', reading: 'Hai, kashikomarimashita. Achira no aoi tana desu ne?', translation: 'Baik, siap laksanakan. Di rak warna biru sebelah sana, benar?' },
      { speaker: 'Koujou-chou (Kepala Pabrik)', text: 'そうです。安全第一で作業してください。', reading: 'Sou desu. Anzen daiichi de sagyou shite kudasai.', translation: 'Benar. Bekerjalah dengan mengutamakan keselamatan kerja.' },
    ],
    vocabularyList: [
      { term: '安全第一', reading: 'Anzen Daiichi', meaning: 'Utamakan Keselamatan Kerja', exampleSentence: '工場では常に安全第一です。 (Koujou de wa tsuneni anzen daiichi desu.)' },
      { term: '確認します', reading: 'Kakunin shimasu', meaning: 'Saya konfirmasi / pastikan', exampleSentence: 'もう一度サイズを確認します。 (Mou ichido saizu o kakunin shimasu.)' },
      { term: '作業手順', reading: 'Sagyou tejun', meaning: 'SOP / Langkah Prosedur Kerja', exampleSentence: '作業手順書を守ってください。 (Sagyou tejunsho o mamotte kudasai.)' },
      { term: '保護具', reading: 'Hogogu (PPE)', meaning: 'Alat Pelindung Diri (Helm/Kacamata/Sarung Tangan)', exampleSentence: '必ず保護具を着用します。 (Kanarazu hogogu o chakuyou shimasu.)' },
    ],
    keyGrammarPoints: [
      {
        pattern: 'Kata Kerja Bentuk-Te + ください (kudasai)',
        meaning: 'Pola kalimat perintah sopan / instruksi',
        explanation: 'Atasan akan sering menggunakan pola ini dalam memberi instruksi harian.',
        example: 'ここにサインを書いてください。 (Koko ni sain o kaite kudasai - Tolong tulis tanda tangan di sini).'
      }
    ]
  },
  {
    id: 'jp-m2-02',
    programType: 'japan_ssw',
    language: 'Jepang',
    monthLevel: 2,
    weekLabel: 'Bulan 2 • Minggu 7-8',
    title: 'Panduan Wawancara Kerja (Mensetsu) & Latihan Soal Ujian Bidang SSW',
    description: 'Kumpulan tips menjawab pertanyaan jebakan user Jepang, etika duduk, kontak mata, intonasi suara, serta pembahasan kisi-kisi ujian keahlian Tokutei Ginou (SSW) bidang Pengolahan Makanan, Kaigo, dan Pertanian.',
    contentType: 'pdf',
    durationMinutes: 45,
    timeSpentMinutes: 45,
    progressPercent: 100,
    isCompleted: true,
    practicalTips: [
      'Ketuk pintu 3 kali sebelum masuk ruang wawancara, ucapkan "Shitsurei shimasu" saat membuka pintu.',
      'Tatap mata atau bagian hidung pewawancara dan pertahankan postur punggung tegak lurus.',
      'Jangan pernah memotong perkataan pewawancara; tunggu hingga kalimat selesai baru menjawab "Hai!" tegas.'
    ]
  },

  // --- BULAN 3: BUDAYA KAIZEN 5S, HORENSO, ATURAN HIDUP & KEBERANGKATAN ---
  {
    id: 'jp-m3-01',
    programType: 'japan_im',
    language: 'Jepang',
    monthLevel: 3,
    weekLabel: 'Bulan 3 • Minggu 9-10',
    title: 'Budaya Kerja Industri: Prinsip HORENSO & Metodologi Kaizen 5S Jepang',
    description: 'Pemahaman mendalam mengenai Houkoku (Lapor), Renraku (Komunikasi/Informasi), Soudan (Konsultasi), serta penerapan 5S (Seiri, Seiton, Seiso, Seiketsu, Shitsuke) dan aturan pemilahan sampah ketat di pemukiman Jepang.',
    contentType: 'video',
    videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/gLg41f9Z5z4',
    durationMinutes: 50,
    timeSpentMinutes: 40,
    progressPercent: 80,
    isCompleted: false,
    keyGrammarPoints: [
      {
        pattern: '報・連・相 (Hō-Ren-Sō)',
        meaning: 'Hōkoku (Lapor Cepat), Renraku (Beritahu Info), Sōdan (Konsultasi Masalah)',
        explanation: 'Fondasi utama komunikasi bisnis Jepang. Jangan menyembunyikan kesalahan sekecil apa pun.',
        example: '問題が起きたら、すぐに上司に報告・相談してください。'
      },
      {
        pattern: '5S (整理・整頓・清掃・清潔・躾)',
        meaning: 'Seiri (Ringkas), Seiton (Rapi), Seiso (Resik), Seiketsu (Rawat), Shitsuke (Rajin/Disiplin)',
        explanation: 'Metode standardisasi tempat kerja industri manufaktur dan pelayanan di Jepang.',
        example: '5Sの徹底により、無駄と事故を防止します。'
      }
    ],
    vocabularyList: [
      { term: '分別', reading: 'Bunbetsu', meaning: 'Pemilahan (terutama sampah daur ulang)', exampleSentence: 'ゴミの分別ルールを守りましょう。 (Gomi no bunbetsu ruuru o mamorimashou.)' },
      { term: '遅刻厳禁', reading: 'Chikoku Genkin', meaning: 'Dilarang Keras Terlambat (Wajib 10 menit lebih awal)', exampleSentence: '日本の職場は遅刻厳禁です。 (Nihon no shokuba wa chikoku genkin desu.)' },
      { term: '報告', reading: 'Houkoku', meaning: 'Laporan kerja kepada atasan', exampleSentence: '作業結果を報告します。 (Sagyou kekka o houkoku shimasu.)' },
    ]
  },
  {
    id: 'jp-m3-02',
    programType: 'japan_ssw',
    language: 'Jepang',
    monthLevel: 3,
    weekLabel: 'Bulan 3 • Minggu 11-12',
    title: 'Simulasi Tryout Ujian Akhir Kelulusan Pembekalan 3 Bulan (JLPT N5/SSW)',
    description: 'Tryout online berstandar nasional dan industri Jepang untuk menguji kosakata, tata bahasa, etika kerja, dan kesiapan mental sebelum keberangkatan.',
    contentType: 'quiz',
    durationMinutes: 45,
    timeSpentMinutes: 0,
    progressPercent: 0,
    isCompleted: false,
    quizQuestions: [
      {
        id: 'jpq-1',
        question: 'Dalam konsep komunikasi kerja Jepang "HORENSO", singkatan dari apakah istilah tersebut?',
        options: [
          'Houkoku (Lapor), Renraku (Informasi), Soudan (Konsultasi)',
          'Honki (Serius), Renshuu (Latihan), Souji (Bersih-bersih)',
          'Haitatsu (Antar), Renraku (Telepon), Sanka (Ikut)',
          'Hassou (Kirim), Rikai (Paham), Seikou (Sukses)'
        ],
        correctAnswerIndex: 0,
        explanation: 'Horenso merupakan prinsip komunikasi terpenting di Jepang: Houkoku (Melaporkan progres/kejadian), Renraku (Menghubungi/memberitahu fakta), dan Soudan (Berkonsultasi jika ada kendala atau keraguan).'
      },
      {
        id: 'jpq-2',
        question: 'Jika Anda tidak sengaja melakukan kesalahan pada barang produksi di tempat kerja Jepang, tindakan yang BENAR menurut etika kerja adalah:',
        options: [
          'Segera melapor dengan jujur kepada atasan/senpai (Houkoku) dan meminta maaf serta petunjuk perbaikan',
          'Menyembunyikan barang rusak agar tidak dimarahi',
          'Menyalahkan teman kerja yang lain',
          'Meninggalkan tempat kerja tanpa pamit'
        ],
        correctAnswerIndex: 0,
        explanation: 'Di Jepang, kejujuran dan kecepatan melapor (Houkoku) sangat dihargai. Menyembunyikan kesalahan dianggap sebagai pelanggaran integritas fatal.'
      },
      {
        id: 'jpq-3',
        question: 'Manakah urutan yang tepat untuk konsep 5S di lingkungan industri Jepang?',
        options: [
          'Seiri (Ringkas), Seiton (Rapi), Seiso (Resik), Seiketsu (Rawat), Shitsuke (Rajin)',
          'Salam, Senyum, Sapa, Sopan, Santun',
          'Speed, Safety, Skill, Saving, System',
          'Seiri, Shitsuke, Speed, Smart, Service'
        ],
        correctAnswerIndex: 0,
        explanation: '5S terdiri dari: Seiri (membuang barang tidak perlu), Seiton (menata tempat barang), Seiso (membersihkan alat kerja), Seiketsu (menjaga standar bersih), dan Shitsuke (membiasakan kedisiplinan).'
      },
      {
        id: 'jpq-4',
        question: 'Kapan salam "Otsukaresama desu" (お疲れ様です) paling tepat diucapkan?',
        options: [
          'Saat berpapasan dengan rekan kerja, setelah menyelesaikan tugas, atau saat mengakhiri jam kerja',
          'Hanya saat baru bangun tidur di pagi hari',
          'Saat meminta diskon di toko baju',
          'Saat pertama kali berkenalan dengan orang asing di jalan'
        ],
        correctAnswerIndex: 0,
        explanation: '"Otsukaresama desu" adalah ungkapan apresiasi atas jerih payah kerja yang diucapkan antar sesama rekan kerja dan atasan sepanjang hari di tempat kerja Jepang.'
      }
    ]
  }
];
