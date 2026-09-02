import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TopPerformersLeaderboard } from './TopPerformersLeaderboard';
import { DownloadableResourcesLibrary } from './DownloadableResourcesLibrary';
import { LMSAudioPlayer } from './LMSAudioPlayer';
import { LMSModule, QuizQuestion } from '../../types';
import {
  BookOpen,
  Video,
  FileText,
  HelpCircle,
  CheckCircle2,
  PlayCircle,
  Award,
  Download,
  Check,
  QrCode,
  Sparkles,
  Clock,
  Timer,
  Headphones,
  Compass,
  Calendar,
  Languages,
  CheckSquare,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';

interface LMSStudentViewProps {
  onOpenCertificate?: () => void;
}

export const LMSStudentView: React.FC<LMSStudentViewProps> = ({ onOpenCertificate }) => {
  const { lmsModules, toggleLMSModuleComplete, currentCandidate } = useApp();

  // Determine candidate target country (Taiwan vs Japan)
  const candidateProgram = currentCandidate?.selectedProgram || 'taiwan_ifp';
  const isTaiwanCandidate = candidateProgram.startsWith('taiwan');

  // Filter LMS modules strictly to target country (Taiwan vs Japan)
  const countryModules = lmsModules.filter((m) => {
    if (isTaiwanCandidate) {
      return (
        m.programType.startsWith('taiwan') ||
        m.language === 'Mandarin' ||
        m.language === 'Inggris'
      );
    } else {
      return (
        m.programType.startsWith('japan') ||
        m.language === 'Jepang'
      );
    }
  });

  const [selectedMonthFilter, setSelectedMonthFilter] = useState<'all' | 1 | 2 | 3>('all');

  const filteredModules = countryModules.filter((m) => {
    if (selectedMonthFilter === 'all') return true;
    return m.monthLevel === selectedMonthFilter;
  });

  const [activeModuleId, setActiveModuleId] = useState<string>(() => {
    return countryModules[0]?.id || (isTaiwanCandidate ? 'tw-m1-01' : 'jp-m1-01');
  });

  // Quiz state
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const activeModule = countryModules.find((m) => m.id === activeModuleId) || countryModules[0];

  const completedModulesCount = countryModules.filter((m) => m.isCompleted).length;
  const totalModules = countryModules.length;
  const isFullyCompleted = completedModulesCount === totalModules && totalModules > 0;
  const progressPercent = totalModules > 0 ? Math.round((completedModulesCount / totalModules) * 100) : 0;

  const handleCompleteAllSim = () => {
    countryModules.forEach((m) => {
      if (!m.isCompleted) {
        toggleLMSModuleComplete(m.id);
      }
    });
  };

  const handleSelectAnswer = (qId: string, optionIndex: number) => {
    setUserAnswers({ ...userAnswers, [qId]: optionIndex });
  };

  const handleSubmitQuiz = (questions: QuizQuestion[]) => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswerIndex) {
        correctCount += 1;
      }
    });
    const score = Math.round((correctCount / questions.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);

    if (score >= 70 && activeModule) {
      toggleLMSModuleComplete(activeModule.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Progress - Clean Institutional Navy Theme */}
      <div className="bg-[#0C2340] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/30">
              KURIKULUM PEMBEKALAN 3 BULAN
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 bg-blue-950/90 px-2.5 py-0.5 rounded-full border border-blue-800">
              {isTaiwanCandidate ? '🇹🇼 TAIWAN IFP 1+4 & S1 BEASISWA' : '🇯🇵 JEPANG SSW & IM JAPAN MAGANG'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif">
            {isTaiwanCandidate
              ? 'Pusat Pembekalan Bahasa Mandarin & Orientasi Studi Taiwan'
              : 'Pusat Pembekalan Bahasa Jepang (N5-N4) & K3 Industri'}
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            {isTaiwanCandidate
              ? 'Program intensif 3 bulan: Bulan 1 (Ejaan Bopomofo & Nada Mandarin), Bulan 2 (Percakapan Kampus & Wawancara OIA), dan Bulan 3 (Regulasi ARC, Izin Kerja & Evaluasi Resmi Prospect Education).'
              : 'Program intensif 3 bulan: Bulan 1 (Hiragana/Katakana & Aisatsu Kerja), Bulan 2 (Instruksi Pabrik & Wawancara Mensetsu), dan Bulan 3 (Kaizen 5S, Horenso & Tryout Ujian Kelulusan).'}
          </p>
        </div>

        {/* Circular / Progress Bar */}
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 text-center shrink-0 w-full sm:w-56 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-300">Total Progres 3 Bulan:</span>
            <span className="text-amber-400 font-mono text-sm">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-400">
            {completedModulesCount} dari {totalModules} Modul Pembekalan Tuntas
          </p>
        </div>
      </div>

      {/* 3-Month Stage Navigation Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-amber-600" /> Tahapan:
        </span>
        <button
          onClick={() => setSelectedMonthFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            selectedMonthFilter === 'all'
              ? 'bg-[#0F3D7A] text-white shadow-2xs'
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Semua Modul ({countryModules.length})
        </button>

        <button
          onClick={() => setSelectedMonthFilter(1)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            selectedMonthFilter === 1
              ? 'bg-[#0F3D7A] text-white shadow-2xs'
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Bulan 1: Fondasi Bahasa & Huruf
        </button>

        <button
          onClick={() => setSelectedMonthFilter(2)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            selectedMonthFilter === 2
              ? 'bg-[#0F3D7A] text-white shadow-2xs'
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Bulan 2: Percakapan & Wawancara
        </button>

        <button
          onClick={() => setSelectedMonthFilter(3)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            selectedMonthFilter === 3
              ? 'bg-[#0F3D7A] text-white shadow-2xs'
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Bulan 3: Budaya Kerja & Keberangkatan
        </button>
      </div>

      {/* Mobile Quick Module Selector */}
      <div className="lg:hidden bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
        <label htmlFor="lms-mobile-module-select" className="block text-xs font-bold text-amber-300 flex items-center justify-between">
          <span>📚 Pilih Modul Belajar ({filteredModules.length} Modul):</span>
          <span className="text-[10px] text-slate-400 font-normal">Tap untuk berpindah</span>
        </label>
        <select
          id="lms-mobile-module-select"
          value={activeModuleId}
          onChange={(e) => {
            setActiveModuleId(e.target.value);
            setQuizSubmitted(false);
          }}
          className="w-full bg-slate-950 text-white font-bold text-xs p-3 rounded-xl border border-amber-500/40 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
        >
          {filteredModules.map((m, idx) => (
            <option key={m.id} value={m.id}>
              [{m.weekLabel || `Modul ${idx + 1}`}] {m.title} ({m.isCompleted ? '✅ Selesai' : '⏳ Belajar'})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Module Sidebar List */}
        <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-900 text-sm">Daftar Modul Belajar</h3>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {filteredModules.length} Modul
            </span>
          </div>

          <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
            {filteredModules.map((m) => {
              const isActive = m.id === activeModuleId;
              const mProgress = m.isCompleted ? 100 : m.progressPercent ?? 30;
              const mTimeSpent = m.isCompleted
                ? m.durationMinutes
                : m.timeSpentMinutes ?? Math.round(m.durationMinutes * 0.3);

              return (
                <div
                  key={m.id}
                  onClick={() => {
                    setActiveModuleId(m.id);
                    setQuizSubmitted(false);
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex flex-col gap-2.5 ${
                    isActive
                      ? 'bg-blue-50/90 border-[#0F3D7A] ring-2 ring-blue-500/20'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase">
                        {m.contentType === 'video' && (
                          <span className="text-red-700 flex items-center gap-1 bg-red-50 px-1.5 py-0.5 rounded">
                            <Video className="w-3 h-3" /> Video Pelajaran
                          </span>
                        )}
                        {m.contentType === 'audio' && (
                          <span className="text-amber-700 flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded">
                            <Headphones className="w-3 h-3" /> Audio Lab
                          </span>
                        )}
                        {m.contentType === 'pdf' && (
                          <span className="text-blue-700 flex items-center gap-1 bg-blue-50 px-1.5 py-0.5 rounded">
                            <FileText className="w-3 h-3" /> Panduan Modul
                          </span>
                        )}
                        {m.contentType === 'quiz' && (
                          <span className="text-purple-700 flex items-center gap-1 bg-purple-50 px-1.5 py-0.5 rounded">
                            <HelpCircle className="w-3 h-3" /> Ujian Tryout
                          </span>
                        )}
                        {m.weekLabel && (
                          <span className="text-slate-500 text-[9px] font-medium">
                            {m.weekLabel}
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs leading-snug">{m.title}</h4>
                    </div>

                    {m.isCompleted ? (
                      <span className="p-1 bg-emerald-600 text-white rounded-full shrink-0 mt-0.5" title="Selesai (100%)">
                        <Check className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full shrink-0">
                        {mProgress}%
                      </span>
                    )}
                  </div>

                  {/* Learning Progress Bar & Time Spent */}
                  <div className="space-y-1 pt-1 border-t border-slate-200/60">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" /> Waktu Belajar:
                      </span>
                      <span className="font-bold text-slate-800 font-mono">
                        {mTimeSpent} / {m.durationMinutes} Mnt
                      </span>
                    </div>

                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          m.isCompleted
                            ? 'bg-emerald-500'
                            : mProgress > 0
                            ? 'bg-amber-500'
                            : 'bg-slate-300'
                        }`}
                        style={{ width: `${mProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Simulation toggle */}
          {!isFullyCompleted && (
            <button
              onClick={handleCompleteAllSim}
              className="w-full text-center text-[10px] text-slate-600 hover:text-amber-900 bg-slate-100 hover:bg-amber-50 p-2 rounded-xl border border-dashed border-slate-300 transition font-bold cursor-pointer"
              title="Klik untuk menandai seluruh modul selesai demi pengujian sertifikat"
            >
              ⚡ Tandai Semua Modul Selesai (Simulasi Buka Sertifikat)
            </button>
          )}

          {/* Certificate Download Card */}
          <div className="pt-3 border-t border-slate-100">
            {isFullyCompleted ? (
              <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-red-800 p-4 rounded-2xl border border-amber-300 text-white space-y-3 text-xs shadow-md">
                <div className="flex items-center gap-2 font-black text-amber-200">
                  <Award className="w-5 h-5 text-amber-300" />
                  <span className="text-sm">Sertifikat Kelulusan Tuntas (100%)</span>
                </div>
                <p className="text-[11px] text-amber-100/90 leading-relaxed">
                  Selamat! Seluruh {totalModules} modul pembekalan 3 bulan telah selesai. Sertifikat resmi digital Anda siap dicetak.
                </p>
                <button
                  onClick={() => onOpenCertificate && onOpenCertificate()}
                  className="w-full bg-amber-300 hover:bg-amber-200 text-slate-950 font-black py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-900" />
                  <span>Buka Sertifikat Kelulusan (PDF)</span>
                </button>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-amber-50 to-amber-100/80 p-4 rounded-2xl border border-amber-300 text-amber-950 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-amber-900">
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>Sertifikat Pembekalan LMS</span>
                  </div>
                  <span className="text-[10px] font-mono bg-amber-200 px-2 py-0.5 rounded-full text-amber-900 font-bold">
                    {completedModulesCount}/{totalModules} Modul
                  </span>
                </div>
                <p className="text-[11px] text-amber-900/80 leading-relaxed">
                  Selesaikan {totalModules - completedModulesCount} modul tersisa untuk mengklaim Sertifikat Kelulusan Resmi Digital.
                </p>
                <button
                  onClick={() => onOpenCertificate && onOpenCertificate()}
                  className="w-full bg-white hover:bg-amber-50 text-amber-900 font-bold py-2 rounded-xl border border-amber-300 transition text-xs flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-700" />
                  <span>Pratinjau Format Sertifikat</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Active Module Detail & Interactive Player */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          {activeModule ? (
            <div className="space-y-6">
              {/* Module Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-[#0F3D7A] uppercase tracking-wider bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
                      {activeModule.weekLabel || `Bulan ${activeModule.monthLevel || 1}`}
                    </span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600" />
                      Estimasi Belajar: {activeModule.durationMinutes} Menit
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 font-serif">
                    {activeModule.title}
                  </h3>
                </div>

                <button
                  onClick={() => toggleLMSModuleComplete(activeModule.id)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
                    activeModule.isCompleted
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-900 text-white hover:bg-slate-800 shadow-2xs'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{activeModule.isCompleted ? 'Sudah Tuntas (100%)' : 'Tandai Selesai'}</span>
                </button>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {activeModule.description}
              </p>

              {/* Audio Player & Interactive Lab */}
              {(activeModule.contentType === 'audio' || activeModule.audioTranscript || (activeModule.vocabularyList && activeModule.vocabularyList.length > 0)) && (
                <LMSAudioPlayer
                  title={activeModule.title}
                  language={activeModule.language}
                  transcript={activeModule.audioTranscript}
                  vocabulary={activeModule.vocabularyList}
                />
              )}

              {/* Video Player Render */}
              {activeModule.contentType === 'video' && activeModule.videoEmbedUrl && (
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner">
                    <iframe
                      src={activeModule.videoEmbedUrl}
                      title={activeModule.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              {/* Key Grammar Points Cards */}
              {activeModule.keyGrammarPoints && activeModule.keyGrammarPoints.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#0F3D7A]" />
                    <span>Poin Tata Bahasa & Pola Kalimat Utama (Bunpou / Yǔfǎ):</span>
                  </h4>

                  <div className="space-y-3">
                    {activeModule.keyGrammarPoints.map((gp, gIdx) => (
                      <div key={gIdx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#0F3D7A] text-white flex items-center justify-center text-[10px] font-bold">
                            {gIdx + 1}
                          </span>
                          <span className="font-extrabold text-[#0F3D7A] font-mono text-sm">{gp.pattern}</span>
                        </div>
                        <p className="text-slate-800 font-semibold">{gp.meaning}</p>
                        <p className="text-slate-600 text-[11px] leading-relaxed">{gp.explanation}</p>
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-[11px] font-mono text-slate-900">
                          <strong>Contoh:</strong> {gp.example}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Practical Tips */}
              {activeModule.practicalTips && activeModule.practicalTips.length > 0 && (
                <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2 text-xs text-amber-950">
                  <h5 className="font-bold flex items-center gap-1.5 text-amber-900">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span>Tips Praktis Lapangan & Pengingat Keberangkatan:</span>
                  </h5>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-900/90">
                    {activeModule.practicalTips.map((tip, tIdx) => (
                      <li key={tIdx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* PDF Viewer Render */}
              {activeModule.contentType === 'pdf' && (
                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 text-center space-y-4">
                  <FileText className="w-14 h-14 text-blue-600 mx-auto" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Dokumen Modul PDF Pembelajaran Resmi</h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                      Buku panduan tata bahasa, lembar kosakata, dan pedoman resmi Prospect Education Cabang Jember.
                    </p>
                  </div>
                  <button
                    onClick={() => alert('Mengunduh Modul Pembelajaran PDF...')}
                    className="bg-[#0F3D7A] hover:bg-blue-900 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition inline-flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh Modul Pembelajaran (PDF)</span>
                  </button>
                </div>
              )}

              {/* Quiz Render */}
              {activeModule.contentType === 'quiz' && activeModule.quizQuestions && (
                <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Ujian Tryout Online Persiapan Keberangkatan</h4>
                      <p className="text-[11px] text-slate-500">Standar Kelulusan (Passing Grade): 70 / 100 Poin</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                      {activeModule.quizQuestions.length} Butir Soal
                    </span>
                  </div>

                  {activeModule.quizQuestions.map((q, qIdx) => (
                    <div key={q.id} className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
                      <p className="font-bold text-slate-900 text-xs sm:text-sm">
                        {qIdx + 1}. {q.question}
                      </p>

                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = userAnswers[q.id] === optIdx;
                          return (
                            <div
                              key={optIdx}
                              onClick={() => !quizSubmitted && handleSelectAnswer(q.id, optIdx)}
                              className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-center gap-3 ${
                                isSelected
                                  ? 'bg-blue-50 border-[#0F3D7A] font-bold text-slate-900 ring-1 ring-blue-400'
                                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <span className="w-5 h-5 rounded-full border border-slate-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span>{opt}</span>
                            </div>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className="p-3 bg-slate-100 rounded-xl text-xs space-y-1">
                          <p className="font-bold text-slate-800">
                            Jawaban Benar: Pilihan {String.fromCharCode(65 + q.correctAnswerIndex)}
                          </p>
                          <p className="text-slate-600 text-[11px]">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}

                  {!quizSubmitted ? (
                    <button
                      onClick={() => handleSubmitQuiz(activeModule.quizQuestions!)}
                      className="w-full bg-[#0F3D7A] hover:bg-blue-900 text-white font-bold py-3 rounded-xl shadow-xs transition text-xs cursor-pointer"
                    >
                      Kirim Jawaban & Hitung Skor Kelulusan
                    </button>
                  ) : (
                    <div className="p-5 bg-white rounded-2xl border border-slate-300 text-center space-y-2">
                      <p className="text-xs text-slate-500 font-bold">Hasil Skor Ujian Tryout:</p>
                      <p
                        className={`text-3xl sm:text-4xl font-black font-mono ${
                          quizScore && quizScore >= 70 ? 'text-emerald-600' : 'text-red-600'
                        }`}
                      >
                        {quizScore} / 100
                      </p>
                      <p className="text-xs font-semibold text-slate-700">
                        {quizScore && quizScore >= 70
                          ? '🎉 Selamat! Anda dinyatakan LULUS pada tryout pembekalan ini dan modul otomatis terverifikasi.'
                          : 'Belum mencapai passing grade (70). Silakan ulangi materi dan latihan kembali.'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-10">Pilih modul untuk memulai pembelajaran.</p>
          )}
        </div>
      </div>

      {/* Top Performers Leaderboard Widget */}
      <TopPerformersLeaderboard />

      {/* Downloadable Resources Library */}
      <DownloadableResourcesLibrary />
    </div>
  );
};
