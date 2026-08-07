import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TopPerformersLeaderboard } from './TopPerformersLeaderboard';
import { DownloadableResourcesLibrary } from './DownloadableResourcesLibrary';
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
} from 'lucide-react';

interface LMSStudentViewProps {
  onOpenCertificate?: () => void;
}

export const LMSStudentView: React.FC<LMSStudentViewProps> = ({ onOpenCertificate }) => {
  const { lmsModules, toggleLMSModuleComplete, currentCandidate } = useApp();

  // Determine candidate target country (Taiwan vs Japan)
  const candidateProgram = currentCandidate?.selectedProgram || 'taiwan_ifp';
  const isTaiwanCandidate = candidateProgram.startsWith('taiwan');

  // Filter LMS modules strictly to target country (Taiwan vs Japan) so they don't overlap:
  // Taiwan pendaftar -> Hanya Bahasa Mandarin, Inggris, & Budaya Taiwan
  // Jepang pendaftar -> Hanya Materi Bahasa & Budaya Kerja Jepang
  const filteredModules = lmsModules.filter((m) => {
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

  const [activeModuleId, setActiveModuleId] = useState<string>(() => {
    return filteredModules[0]?.id || (isTaiwanCandidate ? 'lms-1' : 'lms-3');
  });

  // Quiz state
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const activeModule = filteredModules.find((m) => m.id === activeModuleId) || filteredModules[0];

  const completedModulesCount = filteredModules.filter((m) => m.isCompleted).length;
  const totalModules = filteredModules.length;
  const isFullyCompleted = completedModulesCount === totalModules && totalModules > 0;
  const progressPercent = totalModules > 0 ? Math.round((completedModulesCount / totalModules) * 100) : 0;

  const handleCompleteAllSim = () => {
    filteredModules.forEach((m) => {
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
      {/* Top Banner Progress */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 text-white p-6 rounded-3xl border border-amber-500/30 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/30">
              LMS - LEARNING MANAGEMENT SYSTEM
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
              {isTaiwanCandidate ? '🇹🇼 KURIKULUM TAIWAN (MANDARIN & S1)' : '🇯🇵 KURIKULUM JEPANG (JLPT & MAGANG)'}
            </span>
          </div>
          <h2 className="text-xl font-black font-serif">
            {isTaiwanCandidate ? 'Modul Pelatihan & Persiapan Beasiswa Taiwan' : 'Modul Pelatihan & Persiapan Magang Jepang'}
          </h2>
          <p className="text-xs text-slate-300">
            {isTaiwanCandidate
              ? 'Materi pembelajaran khusus pendaftar Taiwan: Bahasa Mandarin Basic (Bopomofo & Pinyin), Bahasa Inggris Basic, serta Pembelajaran Kebudayaan & Orientasi Kehidupan Taiwan.'
              : 'Materi pembelajaran khusus pendaftar Jepang: Bahasa Jepang N5 (Hiragana/Katakana/Kaiwa), Panduan Budaya Kerja & K3 Jepang, serta Simulasi Ujian Tokutei Ginou / IM Japan.'}
          </p>
        </div>

        {/* Circular / Progress Bar */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-center shrink-0 w-full sm:w-52">
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span className="text-slate-300">Progres Modul:</span>
            <span className="text-amber-400">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-amber-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            {completedModulesCount} dari {filteredModules.length} Modul Selesai
          </p>
        </div>
      </div>

      {/* Mobile Quick Module Selector */}
      <div className="lg:hidden bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2">
        <label htmlFor="lms-mobile-module-select" className="block text-xs font-bold text-amber-300 flex items-center justify-between">
          <span>📚 Pilih Modul Belajar ({filteredModules.length} Modul Available):</span>
          <span className="text-[10px] text-slate-400 font-normal">Tap untuk berpindah modul</span>
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
              Modul {idx + 1}: {m.title} ({m.isCompleted ? '✅ Selesai' : '⏳ Dalam Proses'})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Module Sidebar List */}
        <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center justify-between">
            <span>Daftar Modul Belajar</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {filteredModules.length} Modul {isTaiwanCandidate ? 'Taiwan' : 'Jepang'}
            </span>
          </h3>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredModules.map((m) => {
              const isActive = m.id === activeModuleId;
              const mProgress = m.isCompleted ? 100 : m.progressPercent ?? (m.isCompleted ? 100 : 30);
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
                      ? 'bg-red-50/90 border-red-700 ring-2 ring-red-600/30'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase">
                        {m.contentType === 'video' && (
                          <span className="text-red-700 flex items-center gap-1">
                            <Video className="w-3 h-3" /> Video Lesson
                          </span>
                        )}
                        {m.contentType === 'pdf' && (
                          <span className="text-blue-700 flex items-center gap-1">
                            <FileText className="w-3 h-3" /> PDF Guide
                          </span>
                        )}
                        {m.contentType === 'quiz' && (
                          <span className="text-amber-700 flex items-center gap-1">
                            <HelpCircle className="w-3 h-3" /> Ujian Tryout
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

                  {/* Visual Learning Progress Bar & Time Spent Statistic */}
                  <div className="space-y-1 pt-1 border-t border-slate-200/60">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" /> Waktu Belajar:
                      </span>
                      <span className="font-bold text-slate-800">
                        {mTimeSpent} / {m.durationMinutes} Mns
                      </span>
                    </div>

                    {/* Progress Bar */}
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

          {/* Quick Simulation toggle if not all completed */}
          {!isFullyCompleted && (
            <button
              onClick={handleCompleteAllSim}
              className="w-full text-center text-[10px] text-slate-500 hover:text-amber-800 bg-slate-100 hover:bg-amber-50 p-2 rounded-xl border border-dashed border-slate-300 transition font-bold"
              title="Klik untuk menandai seluruh modul selesai demi pengujian sertifikat"
            >
              ⚡ Tandai Semua Modul Selesai (Simulasi Uji Sertifikat)
            </button>
          )}

          {/* Certificate Download Card */}
          <div className="pt-3 border-t border-slate-100">
            {isFullyCompleted ? (
              <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-red-800 p-4 rounded-2xl border border-amber-300 text-white space-y-3.5 text-xs shadow-md">
                <div className="flex items-center gap-2 font-black text-amber-200">
                  <Award className="w-5 h-5 text-amber-300" />
                  <span className="text-sm">Sertifikat Kelulusan Tuntas (100%)</span>
                </div>
                <p className="text-[11px] text-amber-100/90 leading-relaxed">
                  Selamat! Seluruh {totalModules} modul pelatihan LMS telah Anda selesaikan dengan nilai memuaskan. Sertifikat digital resmi Anda siap diunduh.
                </p>
                <button
                  onClick={() => onOpenCertificate && onOpenCertificate()}
                  className="w-full bg-amber-300 hover:bg-amber-200 text-red-950 font-black py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-red-800" />
                  <span>Buka Pratinjau Sertifikat (PDF)</span>
                </button>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-amber-50 to-amber-100/80 p-4 rounded-2xl border border-amber-300 text-amber-950 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-amber-900">
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>Sertifikat Kelulusan LMS</span>
                  </div>
                  <span className="text-[10px] font-mono bg-amber-200 px-2 py-0.5 rounded-full text-amber-900">
                    {completedModulesCount}/{totalModules} Modul
                  </span>
                </div>
                <p className="text-[11px] text-amber-900/80 leading-relaxed">
                  Selesaikan {totalModules - completedModulesCount} modul tersisa untuk membuka Sertifikat Kelulusan Resmi Digital & PDF Summary Card.
                </p>
                <button
                  onClick={() => onOpenCertificate && onOpenCertificate()}
                  className="w-full bg-white hover:bg-amber-50 text-amber-900 font-bold py-2 rounded-xl border border-amber-300 transition text-xs flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-700" />
                  <span>Pratinjau Format Sertifikat</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Active Module Player / View Area */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          {activeModule ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-red-800 uppercase tracking-widest bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                      Modul Aktif
                    </span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600" />
                      Waktu Belajar: {activeModule.isCompleted ? activeModule.durationMinutes : (activeModule.timeSpentMinutes ?? Math.round(activeModule.durationMinutes * 0.3))} / {activeModule.durationMinutes} Mns
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 font-serif mt-1">
                    {activeModule.title}
                  </h3>
                </div>

                <button
                  onClick={() => toggleLMSModuleComplete(activeModule.id)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                    activeModule.isCompleted
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{activeModule.isCompleted ? 'Selesai Dibaca' : 'Tandai Selesai'}</span>
                </button>
              </div>

              {/* Active Module Visual Learning Progress Bar */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Timer className="w-4 h-4 text-red-600" /> Progres Pembelajaran Modul Ini:
                  </span>
                  <span className={activeModule.isCompleted ? 'text-emerald-700 font-extrabold' : 'text-amber-700 font-extrabold'}>
                    {activeModule.isCompleted ? '100% (Selesai)' : `${activeModule.progressPercent ?? 30}% (Sedang Dipelajari)`}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                  <div
                    className={`h-full transition-all duration-500 ${
                      activeModule.isCompleted
                        ? 'bg-emerald-600'
                        : 'bg-gradient-to-r from-red-600 to-amber-500'
                    }`}
                    style={{
                      width: `${activeModule.isCompleted ? 100 : (activeModule.progressPercent ?? 30)}%`,
                    }}
                  ></div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{activeModule.description}</p>

              {/* Video Player Render */}
              {activeModule.contentType === 'video' && (
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner">
                    <iframe
                      src={activeModule.videoEmbedUrl}
                      title={activeModule.title}
                      className="w-full h-full"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              )}

              {/* PDF Viewer Render */}
              {activeModule.contentType === 'pdf' && (
                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 text-center space-y-4">
                  <FileText className="w-16 h-16 text-blue-600 mx-auto" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Dokumen Modul PDF Pembelajaran</h4>
                    <p className="text-xs text-slate-500">
                      Buku panduan tata bahasa & kosakata siap cetak untuk hafalan harian.
                    </p>
                  </div>
                  <button
                    onClick={() => alert('Mengunduh Modul Pembelajaran PDF...')}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition inline-flex items-center gap-2 shadow-sm"
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
                    <h4 className="font-bold text-slate-900 text-sm">Ujian Tryout Online</h4>
                    <span className="text-xs font-bold text-amber-800">
                      Passing Grade: 70/100
                    </span>
                  </div>

                  {activeModule.quizQuestions.map((q, qIdx) => (
                    <div key={q.id} className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
                      <p className="font-bold text-slate-900 text-xs">
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
                                  ? 'bg-red-50 border-red-600 font-bold text-slate-900'
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
                            Jawaban Benar: Option {String.fromCharCode(65 + q.correctAnswerIndex)}
                          </p>
                          <p className="text-slate-600 text-[11px]">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}

                  {!quizSubmitted ? (
                    <button
                      onClick={() => handleSubmitQuiz(activeModule.quizQuestions!)}
                      className="w-full bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-900 hover:to-amber-800 text-white font-bold py-3 rounded-xl shadow-md transition text-xs"
                    >
                      Kirim & Hitung Nilai Ujian
                    </button>
                  ) : (
                    <div className="p-4 bg-white rounded-xl border border-slate-300 text-center space-y-2">
                      <p className="text-xs text-slate-500 font-bold">Hasil Skor Tryout Ujian Anda:</p>
                      <p
                        className={`text-3xl font-black ${
                          quizScore && quizScore >= 70 ? 'text-emerald-600' : 'text-red-600'
                        }`}
                      >
                        {quizScore} / 100
                      </p>
                      <p className="text-xs font-semibold text-slate-700">
                        {quizScore && quizScore >= 70
                          ? 'Selamat! Anda dinyatakan LULUS pada ujian ini.'
                          : 'Belum mencapai batas kelulusan. Silakan ulangi latihan.'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400">Pilih modul untuk memulai pembelajaran.</p>
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
