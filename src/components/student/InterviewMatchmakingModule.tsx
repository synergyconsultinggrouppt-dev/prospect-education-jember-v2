import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Briefcase,
  Building2,
  Video,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
  Send,
  Printer,
  Search,
  ExternalLink,
  ShieldCheck,
  Globe2,
  Bot,
  UserCheck,
  Star,
  MapPin,
  CircleDollarSign,
  Languages,
} from 'lucide-react';

export const InterviewMatchmakingModule: React.FC = () => {
  const { currentCandidate } = useApp();
  const [activeTab, setActiveTab] = useState<'job_board' | 'ai_interview' | 'rirekisho' | 'schedule'>('job_board');

  const program = currentCandidate?.selectedProgram || 'taiwan_ifp';
  const isJapan = program.startsWith('japan');

  // Filter or search state for job board
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  // AI Interview Simulator State
  const [selectedScenario, setSelectedScenario] = useState<string>(isJapan ? 'jikoshoukai' : 'taiwan_intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswerText, setUserAnswerText] = useState('');
  const [interviewHistory, setInterviewHistory] = useState<
    { question: string; answer: string; feedback: string; score: number }[]
  >([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [completedScore, setCompletedScore] = useState<number | null>(null);

  // Applied Companies State
  const [appliedJobs, setAppliedJobs] = useState<string[]>(['job-1']);

  // Mock Jobs & Universities Catalog
  const jobsAndUniversities = [
    {
      id: 'job-1',
      title: isJapan ? 'Perawat Lansia (Kaigo) - Social Welfare Tokyo' : 'Kun Shan University (Tainan) - IFP 1+4 Teknik',
      entityName: isJapan ? 'Tokyo Welfare Group Inc.' : 'Kun Shan University of Science and Technology',
      location: isJapan ? 'Tokyo, Jepang' : 'Tainan, Taiwan',
      type: isJapan ? 'SSW / Tokutei Ginou' : 'IFP 1+4 Bachelor Degree',
      salaryOrScholarship: isJapan ? '¥ 185.000 - ¥ 210.000 / bulan' : 'Beasiswa Bebas SPP Thn 1 + Uang Saku',
      requirements: isJapan ? ['Sertifikat JLPT N4 / NAT-TEST 4Q', 'JFT-Basic A2', 'Lulus Skill Assessment Kaigo'] : ['Ijazah SMA/SMK Sederajat', 'Sertifikat Mandarin TOCFL A2', 'Rapor Min. 75'],
      quota: isJapan ? 15 : 25,
      appliedCount: 8,
      status: 'Open',
      badge: isJapan ? 'Gaji Tinggi + Lembur' : 'Beasiswa Full 100%',
    },
    {
      id: 'job-2',
      title: isJapan ? 'Pengolahan Makanan & Bento - Osaka Factory' : 'Feng Chia University (Taichung) - Bisnis & Manajemen',
      entityName: isJapan ? 'Kansai Food Products Co., Ltd.' : 'Feng Chia University',
      location: isJapan ? 'Osaka, Jepang' : 'Taichung, Taiwan',
      type: isJapan ? 'SSW Food Manufacturing' : 'IFP 1+4 Program',
      salaryOrScholarship: isJapan ? '¥ 175.000 - ¥ 195.000 / bulan' : 'Beasiswa SPP 50% - 100% + Asrama Free',
      requirements: isJapan ? ['Sertifikat N4 / JFT-Basic A2', 'Sertifikat Pengolahan Makanan (Shokuhin)'] : ['Nilai Rapor Rata-rata 80', 'Surat Rekomendasi Sekolah'],
      quota: isJapan ? 20 : 30,
      appliedCount: 14,
      status: 'Open',
      badge: 'Asrama Disediakan',
    },
    {
      id: 'job-3',
      title: isJapan ? 'Konstruksi & Scaffolding - Aichi Nagoya' : 'I-Shou University (Kaohsiung) - Teknologi Informasi',
      entityName: isJapan ? 'Nagoya Construction Association' : 'I-Shou University Taiwan',
      location: isJapan ? 'Nagoya, Aichi, Jepang' : 'Kaohsiung, Taiwan',
      type: isJapan ? 'IM Japan / SSW' : 'IFP 1+4 IT Specialist',
      salaryOrScholarship: isJapan ? '¥ 190.000 - ¥ 230.000 / bulan' : 'Subsidi Biaya Kuliah & Magang Industri',
      requirements: isJapan ? ['JLPT N4', 'Fisik Prima & Non-Tato'] : ['Ijazah IPA / Kejuruan IT', 'TOCFL A2/B1'],
      quota: isJapan ? 10 : 20,
      appliedCount: 6,
      status: 'Open',
      badge: 'Prospek Karir Cepat',
    },
  ];

  // AI Interview Questions database
  const interviewQuestionsJapan = [
    {
      q: '自己紹介をお願いします。(Hajimemashite. Jikoshoukai o onegaishimasu)',
      translation: 'Silakan perkenalkan diri Anda dalam Bahasa Jepang (Nama, Asal, Umur, Alasan ke Jepang).',
      tip: 'Mulai dengan "Hajimemashite", sebutkan nama lengkap, umur, asal Jember Indonesia, dan akhiri dengan "Yoroshiku onegaishimasu".',
    },
    {
      q: 'Why do you want to work in Japan? 日本で働きたい理由は何ですか？',
      translation: 'Apa alasan utama Anda ingin bekerja di Jepang?',
      tip: 'Tekankan etos kerja Jepang, ingin membantu keluarga, dan meningkatkan ketrampilan profesional.',
    },
    {
      q: 'Jika mengalami kesulitan bahasa saat kerja, apa yang akan Anda lakukan?',
      translation: 'Troubleshooting komunikasi di tempat kerja.',
      tip: 'Sampaikan bahwa Anda akan bertanya secara sopan (Sumimasen, mou ichido onegaishimasu) dan mencatat instruksi.',
    },
  ];

  const interviewQuestionsTaiwan = [
    {
      q: '請自我介紹一下 (Qǐng zìwǒ jièshào yīxià)',
      translation: 'Silakan lakukan perkenalan diri singkat dalam Bahasa Mandarin/Inggris.',
      tip: 'Sebutkan nama, latar belakang pendidikan di Indonesia, dan motivasi mengambil program IFP 1+4 di Taiwan.',
    },
    {
      q: 'Why choose Taiwan IFP 1+4 Program instead of studying locally?',
      translation: 'Mengapa Anda memilih kuliah & magang IFP 1+4 di Taiwan dibanding di Indonesia?',
      tip: 'Sebutkan keunggulan sistem pendidikan tinggi Taiwan, kesempatan magang di perusahaan teknologi, dan penguasaan Bahasa Mandarin.',
    },
  ];

  const activeQuestions = isJapan ? interviewQuestionsJapan : interviewQuestionsTaiwan;

  const handleApplyJob = (jobId: string, jobTitle: string) => {
    if (appliedJobs.includes(jobId)) return;
    setAppliedJobs((prev) => [...prev, jobId]);
    alert(`[LAMARAN TERKIRIM] Berhasil mendaftar ke ${jobTitle}! Tim Penyaluran Prospect Education Jember akan mereview berkas Anda.`);
  };

  const handleSendAIAnswer = () => {
    if (!userAnswerText.trim()) return;
    setIsSimulating(true);

    setTimeout(() => {
      const generatedScore = Math.floor(Math.random() * 15) + 82; // Score between 82-97
      const newHistoryItem = {
        question: activeQuestions[currentQuestionIndex].q,
        answer: userAnswerText,
        feedback: `Pengucapan & struktur kalimat Anda sangat baik (${generatedScore}/100). Etika sopan santun sudah sesuai dengan standar wawancara perusahaan ${isJapan ? 'Jepang' : 'Taiwan'}.`,
        score: generatedScore,
      };

      setInterviewHistory((prev) => [...prev, newHistoryItem]);
      setUserAnswerText('');
      setIsSimulating(false);

      if (currentQuestionIndex < activeQuestions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setCompletedScore(Math.round(interviewHistory.reduce((acc, curr) => acc + curr.score, generatedScore) / (interviewHistory.length + 1)));
      }
    }, 1200);
  };

  const handleResetInterview = () => {
    setCurrentQuestionIndex(0);
    setUserAnswerText('');
    setInterviewHistory([]);
    setCompletedScore(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0F3D7A] to-[#092852] text-white p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-bold">
            <Briefcase className="w-3.5 h-3.5 text-amber-400" />
            <span>PORTAL PENYALURAN & WAWANCARA KERJA / KULIAH</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-serif">
            Matching Mitrah {isJapan ? 'Jepang (SSW / IM Japan)' : 'Taiwan (IFP 1+4)'} & Simulasi AI
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Persiapkan karir internasional Anda dengan simulasi wawancara interaktif berbasis AI, pembuatan CV Rirekisho standar resmi, dan pendaftaran langsung ke mitra perusahaan/universitas penerima di {isJapan ? 'Jepang' : 'Taiwan'}.
          </p>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('job_board')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'job_board'
              ? 'bg-[#0F3D7A] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Building2 className="w-4 h-4 text-amber-400" />
          <span>Lowongan & Mitrah Penerima</span>
        </button>

        <button
          onClick={() => setActiveTab('ai_interview')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'ai_interview'
              ? 'bg-[#0F3D7A] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Bot className="w-4 h-4 text-emerald-400" />
          <span>Simulasi Wawancara AI</span>
        </button>

        <button
          onClick={() => setActiveTab('rirekisho')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'rirekisho'
              ? 'bg-[#0F3D7A] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <FileText className="w-4 h-4 text-blue-400" />
          <span>{isJapan ? 'Rirekisho (履歴書)' : 'CV & Resume Taiwan'}</span>
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'schedule'
              ? 'bg-[#0F3D7A] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>Jadwal Wawancara Saya</span>
        </button>
      </div>

      {/* TAB 1: JOB & UNIVERSITY MATCHING BOARD */}
      {activeTab === 'job_board' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder={`Cari kota, perusahaan, atau kampus ${isJapan ? 'Jepang' : 'Taiwan'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 pl-9 pr-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">Status Pendaftaran:</span>
              <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-lg text-xs font-bold border border-emerald-300 dark:border-emerald-800">
                LMS Aktif - Siap Wawancara
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobsAndUniversities.map((item) => {
              const isApplied = appliedJobs.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-md border border-amber-300 dark:border-amber-800">
                        {item.type}
                      </span>
                      <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                        {item.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">{item.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1 font-medium">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.entityName}</span>
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400">
                        <CircleDollarSign className="w-3.5 h-3.5 shrink-0" />
                        <span>{item.salaryOrScholarship}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Persyaratan Utama:</span>
                      <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5 list-disc list-inside">
                        {item.requirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Sisa Kuota: <strong className="text-slate-800 dark:text-white">{item.quota - item.appliedCount} orang</strong></span>
                      <span>Total Pendaftar: {item.appliedCount}</span>
                    </div>

                    <button
                      onClick={() => handleApplyJob(item.id, item.title)}
                      disabled={isApplied}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer ${
                        isApplied
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                          : 'bg-[#0F3D7A] hover:bg-[#092852] text-white shadow-xs'
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span>Sudah Mendaftar</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-amber-400" />
                          <span>Lamar Sekarang</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: AI INTERVIEW SIMULATOR */}
      {activeTab === 'ai_interview' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-emerald-500" />
                <span>Simulasi Wawancara AI Interaktif</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sistem AI akan menanyakan pertanyaan resmi pewawancara {isJapan ? 'Jepang' : 'Taiwan'} dan memberikan masukan tata bahasa & etika secara langsung.
              </p>
            </div>

            {completedScore !== null && (
              <button
                onClick={handleResetInterview}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-200 transition"
              >
                Ulangi Simulasi
              </button>
            )}
          </div>

          {completedScore !== null ? (
            <div className="bg-gradient-to-br from-emerald-950 to-slate-900 text-white p-8 rounded-3xl text-center space-y-4 border border-emerald-500/40">
              <Award className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
              <h4 className="text-2xl font-black font-serif">Simulasi Wawancara Selesai!</h4>
              <div className="text-4xl font-black text-amber-300 font-mono">{completedScore} / 100</div>
              <p className="text-xs text-emerald-200 max-w-lg mx-auto">
                Luar biasa! Skor kesiapan wawancara Anda sudah memenuhi standar ambang batas kelulusan wawancara user {isJapan ? 'Jepang (Minimal 80)' : 'Taiwan (Minimal 75)'}.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-4 py-2 rounded-xl text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Sertifikat Kesiapan Wawancara Diterbitkan di Portofolio</span>
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Question Box */}
              <div className="bg-slate-900 text-white p-6 rounded-2xl border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between text-xs text-amber-400 font-bold">
                  <span>Pertanyaan {currentQuestionIndex + 1} dari {activeQuestions.length}</span>
                  <span className="bg-amber-500/20 px-2.5 py-1 rounded-md">Simulasi AI Active</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white font-serif">
                  {activeQuestions[currentQuestionIndex].q}
                </h4>
                <p className="text-xs text-slate-300 italic">
                  Arti: {activeQuestions[currentQuestionIndex].translation}
                </p>
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-[11px] text-amber-200/90 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Tips Respon Terbaik:</strong> {activeQuestions[currentQuestionIndex].tip}</span>
                </div>
              </div>

              {/* Input Response */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Jawaban Anda (Dalam Bahasa {isJapan ? 'Jepang / Romaji' : 'Mandarin / Inggris'}):
                </label>
                <textarea
                  rows={4}
                  placeholder={isJapan ? 'Contoh: Hajimemashite. Watashi no namae wa... Jember kara kimashita.' : 'Type your answer here...'}
                  value={userAnswerText}
                  onChange={(e) => setUserAnswerText(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  onClick={handleSendAIAnswer}
                  disabled={isSimulating || !userAnswerText.trim()}
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSimulating ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      <span>Menganalisis Jawaban AI...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Kirim & Dapatkan Feedback AI</span>
                    </>
                  )}
                </button>
              </div>

              {/* History Feedback */}
              {interviewHistory.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Hasil Review Jawaban Sebelumnya:
                  </h4>
                  <div className="space-y-3">
                    {interviewHistory.map((item, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                        <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                          <span>Q: {item.question}</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-mono">Skor: {item.score}/100</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 italic">" {item.answer} "</p>
                        <p className="text-emerald-800 dark:text-emerald-300 font-medium bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                          🤖 <strong>Feedback AI:</strong> {item.feedback}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: RIREKISHO & CV GENERATOR */}
      {activeTab === 'rirekisho' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <span>{isJapan ? 'Generator Rirekisho Resmi (履歴書)' : 'CV & Resume Resmi Taiwan IFP'}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dokumen kurikulum vitae yang tersusun otomatis dari data pendaftaran Anda di Prospect Education Jember.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-300 dark:border-slate-800 space-y-6 max-w-3xl mx-auto font-sans">
            <div className="text-center border-b-2 border-slate-800 dark:border-slate-200 pb-4 space-y-1">
              <h2 className="text-xl font-bold tracking-widest text-slate-900 dark:text-white">
                {isJapan ? '履 歴 書 (RIREKISHO)' : 'TAIWAN IFP STUDENT RESUME'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Prospect Education Cabang Jember • Official Candidate Registry
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-800 dark:text-slate-200">
              <div className="md:col-span-2 space-y-2">
                <div><strong className="text-slate-500">Nama Lengkap:</strong> {currentCandidate?.fullName || '-'}</div>
                <div><strong className="text-slate-500">Nomor Registrasi:</strong> {currentCandidate?.registrationNumber || '-'}</div>
                <div><strong className="text-slate-500">Email Kontak:</strong> {currentCandidate?.email || '-'}</div>
                <div><strong className="text-slate-500">Nomor WA/HP:</strong> {currentCandidate?.biodata?.phoneWA || '-'}</div>
                <div><strong className="text-slate-500">Alamat Tempat Tinggal:</strong> {currentCandidate?.biodata?.address || 'Kabupaten Jember, Jawa Timur'}</div>
              </div>

              <div className="bg-slate-200 dark:bg-slate-800 h-32 rounded-xl flex items-center justify-center border border-slate-300 dark:border-slate-700 text-slate-400 text-center text-[10px]">
                {currentCandidate?.avatarUrl ? (
                  <img src={currentCandidate.avatarUrl} alt="Passfoto" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <span>Pasfoto Resm 3x4</span>
                )}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-md">
                Kualifikasi & Kemampuan Bahasa
              </h4>
              <div className="grid grid-cols-2 gap-3 p-2">
                <div><strong>Program Studi:</strong> {currentCandidate?.selectedProgram?.replace('_', ' ').toUpperCase()}</div>
                <div><strong>Tingkat Kelulusan LMS:</strong> {currentCandidate?.lmsProgressPercent || 0}% Modul Tuntas</div>
                <div><strong>Sertifikat Bahasa:</strong> {isJapan ? 'JLPT N4 / JFT-Basic A2 (In Progress)' : 'TOCFL Level A2 / B1'}</div>
                <div><strong>Status Dokumen:</strong> Verifikasi Berkas LKP Approved</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SCHEDULE & STATUS TRACKER */}
      {activeTab === 'schedule' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6">
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-500" />
              <span>Jadwal Wawancara & Seleksi Mitrah</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pantau jadwal wawancara langsung dengan pihak Kumiai / Perusahaan Jepang atau Dosen Penguji Universitas Taiwan.
            </p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/40 p-5 rounded-2xl border border-amber-200 dark:border-amber-800 flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-amber-900 dark:text-amber-200">Sesi Wawancara Terdekat:</h4>
              <p className="text-amber-800 dark:text-amber-300">
                Wawancara Online via Zoom dengan <strong>{isJapan ? 'Tokyo Welfare Group Inc.' : 'Kun Shan University Admissions'}</strong> dijadwalkan pada hari <strong>Kamis, 14 Agustus 2026 pukul 09:00 WIB</strong> di Ruang Multimedia Prospect Education Jember.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
