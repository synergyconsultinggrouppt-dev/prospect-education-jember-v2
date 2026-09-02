import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Trophy,
  Award,
  Medal,
  Crown,
  Sparkles,
  Flame,
  CheckCircle2,
  BookOpen,
  Clock,
  Zap,
  Target,
  HelpCircle,
  ChevronRight,
  Star,
  GraduationCap,
  TrendingUp,
  X,
  Info,
} from 'lucide-react';
import { ProgramType } from '../../types';

export interface LeaderboardStudent {
  id: string;
  rank?: number;
  fullName: string;
  registrationNumber: string;
  avatarUrl?: string;
  programType: ProgramType;
  programName: string;
  district: string;
  totalPoints: number;
  completedModulesCount: number;
  totalTimeMinutes: number;
  badgeTitle: string;
  streakDays: number;
  isCurrentUser?: boolean;
}

interface TopPerformersLeaderboardProps {
  onNavigateLMS?: () => void;
  compact?: boolean;
}

export const TopPerformersLeaderboard: React.FC<TopPerformersLeaderboardProps> = ({
  onNavigateLMS,
  compact = false,
}) => {
  const { currentCandidate, candidates, lmsModules, setActiveTab, t } = useApp();

  const defaultFilter = currentCandidate?.selectedProgram?.startsWith('taiwan')
    ? 'taiwan'
    : currentCandidate?.selectedProgram?.startsWith('japan')
    ? 'jepang'
    : 'all';
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'taiwan' | 'jepang'>(defaultFilter);
  const [showRulesModal, setShowRulesModal] = useState(false);

  // Calculate current user's actual LMS points
  const currentUserCompletedCount = lmsModules.filter((m) => m.isCompleted).length;
  const currentUserTimeSpent = lmsModules.reduce(
    (acc, m) => acc + (m.isCompleted ? m.durationMinutes : (m.timeSpentMinutes ?? Math.round(m.durationMinutes * 0.3))),
    0
  );
  // Base points: 150 XP per completed module + 1 XP per minute spent + 100 XP base bonus
  const currentUserPoints = currentUserCompletedCount * 150 + currentUserTimeSpent + (currentUserCompletedCount > 0 ? 100 : 50);

  // Default leaderboard benchmark list (combining current candidates & top alumni students)
  const allLeaderboardData: LeaderboardStudent[] = useMemo(() => {
    // Current logged-in candidate
    const currentUserItem: LeaderboardStudent = {
      id: currentCandidate?.id || 'CAND-CURRENT',
      fullName: currentCandidate?.fullName || 'Anda (Peserta)',
      registrationNumber: currentCandidate?.registrationNumber || 'PE-JBR-2026-0001',
      avatarUrl: currentCandidate?.avatarUrl,
      programType: currentCandidate?.selectedProgram || 'taiwan_ifp',
      programName: currentCandidate?.selectedProgram
        ? currentCandidate.selectedProgram.includes('taiwan')
          ? 'Beasiswa S1 Taiwan'
          : 'Magang Kerja Jepang'
        : 'Beasiswa S1 Taiwan',
      district: currentCandidate?.biodata?.district || 'Kabupaten Jember',
      totalPoints: currentUserPoints,
      completedModulesCount: currentUserCompletedCount,
      totalTimeMinutes: currentUserTimeSpent,
      badgeTitle: currentUserPoints > 500 ? 'Pelajar Handal' : currentUserPoints > 200 ? 'Peserta Rajin' : 'Peserta Baru',
      streakDays: currentUserCompletedCount > 0 ? 5 : 2,
      isCurrentUser: true,
    };

    // Benchmark students from LPK Prospect Jember
    const benchmarkStudents: LeaderboardStudent[] = [
      {
        id: 'BENCH-01',
        fullName: 'Budi Santoso',
        registrationNumber: 'PE-JBR-2026-0088',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        programType: 'taiwan_ifp',
        programName: 'Beasiswa S1 Taiwan',
        district: 'Kec. Balung, Jember',
        totalPoints: 1280,
        completedModulesCount: 8,
        totalTimeMinutes: 320,
        badgeTitle: 'Master Mandarin',
        streakDays: 14,
      },
      {
        id: 'BENCH-02',
        fullName: 'Dewi Lestari',
        registrationNumber: 'PE-JBR-2026-0092',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
        programType: 'japan_ssw',
        programName: 'Tokutei Ginou Jepang',
        district: 'Kec. Ambulu, Jember',
        totalPoints: 1120,
        completedModulesCount: 7,
        totalTimeMinutes: 285,
        badgeTitle: 'Caregiver Bintang 5',
        streakDays: 12,
      },
      {
        id: 'BENCH-03',
        fullName: 'Rizky Febrian',
        registrationNumber: 'PE-JBR-2026-0074',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        programType: 'japan_im',
        programName: 'Magang IM Japan',
        district: 'Kec. Sumbersari, Jember',
        totalPoints: 940,
        completedModulesCount: 6,
        totalTimeMinutes: 240,
        badgeTitle: 'Jawara N5 Kanji',
        streakDays: 9,
      },
      {
        id: 'BENCH-04',
        fullName: 'Siti Nurhaliza',
        registrationNumber: 'PE-JBR-2026-0102',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        programType: 'taiwan_4_1',
        programName: 'Taiwan 4+1 Industry',
        district: 'Kec. Tanggul, Jember',
        totalPoints: 850,
        completedModulesCount: 5,
        totalTimeMinutes: 210,
        badgeTitle: 'Cerdas Bopomofo',
        streakDays: 7,
      },
      {
        id: 'BENCH-05',
        fullName: 'Ahmad Fauzi',
        registrationNumber: 'PE-JBR-2026-0101',
        programType: 'taiwan_ifp',
        programName: 'Beasiswa S1 Taiwan',
        district: 'Kec. Kaliwates, Jember',
        totalPoints: 720,
        completedModulesCount: 4,
        totalTimeMinutes: 180,
        badgeTitle: 'Semangat Tinggi',
        streakDays: 5,
      },
      {
        id: 'BENCH-06',
        fullName: 'Hendra Wijaya',
        registrationNumber: 'PE-JBR-2026-0105',
        programType: 'japan_im',
        programName: 'Magang IM Japan',
        district: 'Kec. Ambulu, Jember',
        totalPoints: 650,
        completedModulesCount: 4,
        totalTimeMinutes: 165,
        badgeTitle: 'Pejuang Jepang',
        streakDays: 4,
      },
    ];

    // Combine current user if not already in benchmark list
    const combined = [currentUserItem, ...benchmarkStudents];

    // Sort descending by totalPoints
    combined.sort((a, b) => b.totalPoints - a.totalPoints);

    // Assign rank
    return combined.map((student, idx) => ({
      ...student,
      rank: idx + 1,
    }));
  }, [currentCandidate, currentUserPoints, currentUserCompletedCount, currentUserTimeSpent]);

  // Filtered leaderboard
  const filteredLeaderboard = useMemo(() => {
    if (selectedFilter === 'all') return allLeaderboardData;
    if (selectedFilter === 'taiwan') {
      return allLeaderboardData.filter((s) => s.programType.startsWith('taiwan'));
    }
    if (selectedFilter === 'jepang') {
      return allLeaderboardData.filter((s) => s.programType.startsWith('japan'));
    }
    return allLeaderboardData;
  }, [allLeaderboardData, selectedFilter]);

  // Current user's calculated rank position
  const currentUserRankInfo = useMemo(() => {
    return allLeaderboardData.find((s) => s.isCurrentUser);
  }, [allLeaderboardData]);

  const handleGoToLMS = () => {
    if (onNavigateLMS) {
      onNavigateLMS();
    } else {
      setActiveTab('lms');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-950 via-red-950 to-slate-900 text-white p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-3.5 py-1 rounded-full text-xs font-bold shadow-2xs">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{t('Papan Peringkat Peserta Terbaik', 'Top Performers Leaderboard')}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black font-serif text-white tracking-tight">
              Siswa Berprestasi LMS Prospect Jember
            </h3>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Akumulasi Poin Belajar (XP) diperoleh dari ketuntasan modul video, kelulusan ujian tryout, serta durasi aktivitas di portal e-Learning.
            </p>
          </div>

          {/* Current User Rank Highlight Card */}
          {currentUserRankInfo && (
            <div className="bg-slate-900/90 border border-amber-500/40 p-4 rounded-2xl shrink-0 flex items-center gap-4 shadow-xl">
              <div className="p-3 bg-amber-500/20 text-amber-300 border border-amber-400/40 rounded-xl text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Peringkat Anda</span>
                <span className="text-2xl font-black font-mono text-amber-300">#{currentUserRankInfo.rank}</span>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{currentUserRankInfo.totalPoints} XP Belajar</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {currentUserRankInfo.completedModulesCount} Modul Selesai • {currentUserRankInfo.totalTimeMinutes} mnt
                </div>
                <button
                  onClick={handleGoToLMS}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 hover:underline cursor-pointer pt-0.5"
                >
                  <span>Tambah Poin di LMS</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs & Modal Rules Button */}
      <div className="px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              selectedFilter === 'all'
                ? 'bg-red-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua Program
          </button>
          <button
            onClick={() => setSelectedFilter('taiwan')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              selectedFilter === 'taiwan'
                ? 'bg-red-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🇹🇼 Beasiswa Taiwan
          </button>
          <button
            onClick={() => setSelectedFilter('jepang')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              selectedFilter === 'jepang'
                ? 'bg-red-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🇯🇵 Magang / SSW Jepang
          </button>
        </div>

        <button
          onClick={() => setShowRulesModal(true)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-red-700 hover:underline cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-amber-600" />
          <span>Cara Kerja Poin (XP) & Hadiah</span>
        </button>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="px-6 pb-6 space-y-3">
        {/* Top 3 Podium Highlights for Desktop/Tablet */}
        {filteredLeaderboard.length >= 3 && selectedFilter === 'all' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 pt-2">
            {/* Rank 2 - Silver */}
            {filteredLeaderboard[1] && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-2 relative overflow-hidden order-2 sm:order-1 shadow-2xs hover:shadow-md transition">
                <div className="absolute top-2 left-2 bg-slate-200 text-slate-800 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Medal className="w-3 h-3 text-slate-500" /> #2 Silver
                </div>
                <div className="w-14 h-14 rounded-full mx-auto bg-slate-200 border-2 border-slate-300 overflow-hidden flex items-center justify-center font-bold text-slate-700 text-lg shadow-inner">
                  {filteredLeaderboard[1].avatarUrl ? (
                    <img src={filteredLeaderboard[1].avatarUrl} alt={filteredLeaderboard[1].fullName} className="w-full h-full object-cover" />
                  ) : (
                    filteredLeaderboard[1].fullName.charAt(0)
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">{filteredLeaderboard[1].fullName}</h4>
                  <p className="text-[10px] text-slate-500">{filteredLeaderboard[1].programName}</p>
                </div>
                <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 inline-block text-xs font-black text-slate-900 font-mono">
                  {filteredLeaderboard[1].totalPoints} XP
                </div>
              </div>
            )}

            {/* Rank 1 - Gold */}
            {filteredLeaderboard[0] && (
              <div className="bg-gradient-to-b from-amber-50 to-amber-100/60 border-2 border-amber-300 rounded-2xl p-5 text-center space-y-2 relative overflow-hidden order-1 sm:order-2 shadow-md transform sm:-translate-y-2">
                <div className="absolute top-2 left-2 bg-amber-400 text-amber-950 text-[10px] font-black px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                  <Crown className="w-3.5 h-3.5 text-amber-900" /> #1 JUARA
                </div>
                <div className="w-16 h-16 rounded-full mx-auto bg-amber-200 border-2 border-amber-400 overflow-hidden flex items-center justify-center font-bold text-amber-900 text-xl shadow-md ring-4 ring-amber-300/40">
                  {filteredLeaderboard[0].avatarUrl ? (
                    <img src={filteredLeaderboard[0].avatarUrl} alt={filteredLeaderboard[0].fullName} className="w-full h-full object-cover" />
                  ) : (
                    filteredLeaderboard[0].fullName.charAt(0)
                  )}
                </div>
                <div>
                  <h4 className="font-extrabold text-amber-950 text-sm sm:text-base truncate">{filteredLeaderboard[0].fullName}</h4>
                  <p className="text-[10px] text-amber-800 font-medium">{filteredLeaderboard[0].programName}</p>
                </div>
                <div className="bg-amber-400/30 text-amber-950 px-4 py-1.5 rounded-xl border border-amber-400/50 inline-block text-sm font-black font-mono">
                  🔥 {filteredLeaderboard[0].totalPoints} XP
                </div>
              </div>
            )}

            {/* Rank 3 - Bronze */}
            {filteredLeaderboard[2] && (
              <div className="bg-amber-900/5 border border-amber-800/20 rounded-2xl p-4 text-center space-y-2 relative overflow-hidden order-3 shadow-2xs hover:shadow-md transition">
                <div className="absolute top-2 left-2 bg-amber-800/20 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-800" /> #3 Bronze
                </div>
                <div className="w-14 h-14 rounded-full mx-auto bg-amber-800/20 border-2 border-amber-700/30 overflow-hidden flex items-center justify-center font-bold text-amber-900 text-lg shadow-inner">
                  {filteredLeaderboard[2].avatarUrl ? (
                    <img src={filteredLeaderboard[2].avatarUrl} alt={filteredLeaderboard[2].fullName} className="w-full h-full object-cover" />
                  ) : (
                    filteredLeaderboard[2].fullName.charAt(0)
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">{filteredLeaderboard[2].fullName}</h4>
                  <p className="text-[10px] text-slate-500">{filteredLeaderboard[2].programName}</p>
                </div>
                <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 inline-block text-xs font-black text-slate-900 font-mono">
                  {filteredLeaderboard[2].totalPoints} XP
                </div>
              </div>
            )}
          </div>
        )}

        {/* Detailed Leaderboard List */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 bg-white">
          {filteredLeaderboard.map((student) => {
            const isTop3 = student.rank && student.rank <= 3;

            return (
              <div
                key={student.id}
                className={`p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-colors ${
                  student.isCurrentUser
                    ? 'bg-amber-50/90 border-l-4 border-l-amber-500'
                    : 'hover:bg-slate-50/80'
                }`}
              >
                {/* Left: Rank & Student Details */}
                <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                  {/* Rank Number Badge */}
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-black text-xs font-mono shrink-0 ${
                      student.rank === 1
                        ? 'bg-amber-400 text-amber-950 shadow-xs ring-1 ring-amber-500/30'
                        : student.rank === 2
                        ? 'bg-slate-200 text-slate-800'
                        : student.rank === 3
                        ? 'bg-amber-800/20 text-amber-900'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    #{student.rank}
                  </div>

                  {/* Avatar */}
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center font-bold text-slate-700 shrink-0">
                    {student.avatarUrl ? (
                      <img src={student.avatarUrl} alt={student.fullName} className="w-full h-full object-cover" />
                    ) : (
                      student.fullName.charAt(0)
                    )}
                  </div>

                  {/* Student Names & Badges */}
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-1.5 flex-nowrap min-w-0">
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                        {student.fullName}
                      </h4>
                      {student.isCurrentUser && (
                        <span className="bg-amber-500 text-slate-950 text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase tracking-wider shrink-0 whitespace-nowrap">
                          Anda
                        </span>
                      )}
                      <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 hidden sm:inline-block shrink-0 whitespace-nowrap">
                        {student.badgeTitle}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 min-w-0 overflow-hidden">
                      <span className="font-mono text-slate-600 whitespace-nowrap break-keep shrink-0">
                        {student.registrationNumber}
                      </span>
                      <span className="text-slate-300 shrink-0">•</span>
                      <span className="truncate text-slate-600 font-medium">
                        {student.programName}
                      </span>
                      <span className="hidden lg:inline text-slate-400 shrink-0">
                        ({student.district})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Points & Modul Stats */}
                <div className="text-right shrink-0 space-y-0.5 pl-2">
                  <div className="text-xs sm:text-sm font-black text-slate-900 font-mono flex items-center justify-end gap-1 whitespace-nowrap">
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                    <span>{student.totalPoints} XP</span>
                  </div>

                  <div className="text-[10px] text-slate-500 flex items-center justify-end gap-1.5 whitespace-nowrap">
                    <span className="flex items-center gap-1 text-red-700 font-semibold">
                      <BookOpen className="w-3 h-3 shrink-0" />
                      {student.completedModulesCount} Modul
                    </span>
                    <span className="hidden sm:inline text-slate-300">•</span>
                    <span className="hidden sm:inline text-slate-400 font-mono">
                      {student.totalTimeMinutes} mnt
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Motivational Banner CTA */}
        <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="space-y-0.5 text-center sm:text-left">
              <h5 className="font-bold text-xs sm:text-sm">Tingkatkan Peringkat Anda Setiap Hari!</h5>
              <p className="text-[11px] text-slate-400">
                Selesaikan 1 modul video atau ikuti tryout online hari ini untuk memperoleh tambahan +150 XP.
              </p>
            </div>
          </div>

          <button
            onClick={handleGoToLMS}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition shadow-md flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>Buka Modul LMS</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Rules & Rewards Explanation Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setShowRulesModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-3 bg-amber-100 text-amber-900 rounded-2xl">
                <Trophy className="w-6 h-6 text-amber-700" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base font-serif">Sistem Poin Belajar (XP)</h3>
                <p className="text-xs text-slate-500">Aturan perolehan poin & penghargaan peserta LPK Prospect</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Selesaikan Modul Video / PDF (+150 XP)</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Dapatkan 150 Poin Pengalaman setiap kali menyelesaikan pembelajaran modul hingga tuntas 100%.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-amber-600" />
                  <span>Lulus Tryout Ujian Online (+200 XP)</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Skor tinggi pada kuis TOCFL Mandarin atau JLPT Jepang akan melipatgandakan perolehan poin Anda.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-red-600" />
                  <span>Durasi & Presensi Belajar (+1 XP/Menit)</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Setiap menit aktivitas nyata membaca panduan atau menonton video pembelajaran otomatis terakumulasi.
                </p>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-700" />
                  <span>Apresiasi Top 3 Setiap Bulan</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  3 Peserta dengan poin tertinggi berhak mendapatkan voucher subsidi biaya dokumen & rekomendasi prioritas seleksi wawancara universitas/perusahaan!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowRulesModal(false)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition text-xs cursor-pointer"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
