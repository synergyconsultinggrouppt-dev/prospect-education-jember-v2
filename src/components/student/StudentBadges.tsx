import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  Lock,
  Sparkles,
  ShieldCheck,
  BookOpen,
  Video,
  CreditCard,
  FileCheck,
  Star,
  Share2,
  Download,
  X,
  Zap,
} from 'lucide-react';
import { Candidate } from '../../types';

export interface BadgeItem {
  id: string;
  title: string;
  category: 'Administrasi' | 'Akademik' | 'Kehadiran' | 'Sertifikasi';
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number; // 0 - 100%
  criteria: string;
  rewardPoints: number;
}

interface StudentBadgesProps {
  candidate?: Candidate;
}

export const StudentBadges: React.FC<StudentBadgesProps> = ({ candidate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activeBadgeModal, setActiveBadgeModal] = useState<BadgeItem | null>(null);

  // Dynamic status evaluation based on candidate data
  const isDocumentVerified = (candidate?.documents.length || 0) >= 2;
  const isPaid = candidate?.paymentStatus === 'lunas';
  const hasLoa = Boolean(candidate?.loaNumber);

  const badges: BadgeItem[] = [
    {
      id: 'badge-doc-verified',
      title: 'Dokumen Terverifikasi',
      category: 'Administrasi',
      description: 'Seluruh berkas persyaratan utama (KTP, Ijazah, KK, Pasfoto) berhasil diverifikasi Admin.',
      icon: 'FileCheck',
      unlocked: isDocumentVerified,
      unlockedAt: isDocumentVerified ? '15 Juli 2026' : undefined,
      progress: isDocumentVerified ? 100 : Math.min(100, (candidate?.documents.length || 0) * 25),
      criteria: 'Unggah & verifikasi minimal 2 dokumen utama di dashboard.',
      rewardPoints: 150,
    },
    {
      id: 'badge-payment-settled',
      title: 'Peserta Terkonfirmasi',
      category: 'Administrasi',
      description: 'Pembayaran DP pendaftaran & administrasi awal berhasil diproses Lunas via Payment Gateway.',
      icon: 'CreditCard',
      unlocked: isPaid,
      unlockedAt: isPaid ? '18 Juli 2026' : undefined,
      progress: isPaid ? 100 : 50,
      criteria: 'Lakukan pelunasan DP pendaftaran program.',
      rewardPoints: 200,
    },
    {
      id: 'badge-lms-module-1',
      title: 'Tuntas Modul Dasar Bahasa',
      category: 'Akademik',
      description: 'Menyelesaikan 100% materi & kuis dasar tata bahasa serta hiragana/katakana di LMS.',
      icon: 'BookOpen',
      unlocked: true,
      unlockedAt: '20 Juli 2026',
      progress: 100,
      criteria: 'Selesaikan seluruh materi & kuis Modul 1 LMS.',
      rewardPoints: 300,
    },
    {
      id: 'badge-perfect-attendance',
      title: 'Kehadiran Sempurna Live Class',
      category: 'Kehadiran',
      description: 'Mengikuti 5 sesi tatap muka online (Zoom/Meet) persiapan bahasa tanpa terputus.',
      icon: 'Video',
      unlocked: true,
      unlockedAt: '22 Juli 2026',
      progress: 100,
      criteria: 'Hadir penuh dalam 5 sesi Live Class berturut-turut.',
      rewardPoints: 250,
    },
    {
      id: 'badge-loa-received',
      title: 'Pemegang LoA Resmi',
      category: 'Sertifikasi',
      description: 'Menerima Letter of Acceptance (LoA) penerimaan resmi dari Prospect Education Cabang Jember.',
      icon: 'ShieldCheck',
      unlocked: hasLoa,
      unlockedAt: hasLoa ? '23 Juli 2026' : undefined,
      progress: hasLoa ? 100 : 0,
      criteria: 'Lulus verifikasi seleksi awal & diterbitkan nomor LoA.',
      rewardPoints: 500,
    },
    {
      id: 'badge-kaiwa-master',
      title: 'Master Percakapan (Kaiwa/Sprechen)',
      category: 'Akademik',
      description: 'Meraih nilai evaluasi percakapan di atas 90 pada simulasi wawancara kerja.',
      icon: 'Star',
      unlocked: false,
      progress: 70,
      criteria: 'Lulus Ujian Simulasi Mensetsu/Interview dengan nilai A.',
      rewardPoints: 400,
    },
  ];

  const filteredBadges = badges.filter((b) => {
    if (selectedCategory === 'Semua') return true;
    if (selectedCategory === 'Diraih') return b.unlocked;
    if (selectedCategory === 'Terkunci') return !b.unlocked;
    return b.category === selectedCategory;
  });

  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const totalPoints = badges
    .filter((b) => b.unlocked)
    .reduce((acc, b) => acc + b.rewardPoints, 0);

  const renderBadgeIcon = (iconName: string, unlocked: boolean) => {
    const props = { className: `w-7 h-7 ${unlocked ? 'text-amber-400' : 'text-slate-400'}` };
    switch (iconName) {
      case 'FileCheck':
        return <FileCheck {...props} />;
      case 'CreditCard':
        return <CreditCard {...props} />;
      case 'BookOpen':
        return <BookOpen {...props} />;
      case 'Video':
        return <Video {...props} />;
      case 'ShieldCheck':
        return <ShieldCheck {...props} />;
      case 'Star':
        return <Star {...props} />;
      default:
        return <Award {...props} />;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden border border-amber-500/20 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-bold">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>DIGITAL BADGE & MILESTONE REWARDS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-serif tracking-tight text-white">
              Lencana Pencapaian Siswa
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Dapatkan digital badge apresiasi atas kelengkapan berkas, progres belajar di LMS, dan keaktifan pada Live Class persiapan kerja luar negeri.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shrink-0">
            <div className="text-center px-3 border-r border-slate-800">
              <span className="text-2xl font-black font-mono text-amber-400">{unlockedCount} / {badges.length}</span>
              <p className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Badge Diraih</p>
            </div>
            <div className="text-center px-3">
              <span className="text-2xl font-black font-mono text-emerald-400">{totalPoints} XP</span>
              <p className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Total Poin Prestasi</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Category Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {['Semua', 'Diraih', 'Terkunci', 'Administrasi', 'Akademik', 'Kehadiran', 'Sertifikasi'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                selectedCategory === cat
                  ? 'bg-slate-950 text-amber-400 border-amber-500/40 shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <span className="text-xs font-semibold text-slate-500">
          Menampilkan <span className="font-bold text-slate-900">{filteredBadges.length}</span> lencana
        </span>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBadges.map((badge) => (
          <div
            key={badge.id}
            onClick={() => setActiveBadgeModal(badge)}
            className={`cursor-pointer rounded-3xl p-6 border transition-all duration-200 relative group ${
              badge.unlocked
                ? 'bg-gradient-to-b from-amber-500/5 via-white to-white border-amber-300 hover:border-amber-400 shadow-sm hover:shadow-md'
                : 'bg-slate-50 border-slate-200 opacity-80 hover:opacity-100'
            }`}
          >
            {/* Locked/Unlocked Pill */}
            <div className="flex items-center justify-between mb-4">
              <span
                className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  badge.unlocked
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-slate-200 text-slate-600 border border-slate-300'
                }`}
              >
                {badge.category}
              </span>

              {badge.unlocked ? (
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Diraih</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Terkunci</span>
                </span>
              )}
            </div>

            {/* Badge Hexagon/Circle Icon Frame */}
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border shadow-inner transition group-hover:scale-105 ${
                  badge.unlocked
                    ? 'bg-slate-950 border-amber-400 shadow-amber-500/20'
                    : 'bg-slate-200 border-slate-300'
                }`}
              >
                {renderBadgeIcon(badge.icon, badge.unlocked)}
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm font-serif line-clamp-1">{badge.title}</h3>
                <p className="text-[11px] font-bold text-amber-600 flex items-center gap-1 mt-0.5">
                  <Zap className="w-3 h-3 text-amber-500" /> +{badge.rewardPoints} XP Poin
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">{badge.description}</p>

            {/* Progress Bar */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-slate-500">Progres Milestones</span>
                <span className={badge.unlocked ? 'text-emerald-700' : 'text-slate-700'}>
                  {badge.progress}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    badge.unlocked ? 'bg-amber-500' : 'bg-slate-400'
                  }`}
                  style={{ width: `${badge.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Badge Detail Modal */}
      {activeBadgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setActiveBadgeModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3">
              <div
                className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center border shadow-xl ${
                  activeBadgeModal.unlocked
                    ? 'bg-slate-950 border-amber-400 shadow-amber-500/20'
                    : 'bg-slate-100 border-slate-300'
                }`}
              >
                {renderBadgeIcon(activeBadgeModal.icon, activeBadgeModal.unlocked)}
              </div>

              <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Kategori {activeBadgeModal.category}</span>
              </div>

              <h3 className="text-xl font-black font-serif text-slate-900">{activeBadgeModal.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{activeBadgeModal.description}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <p className="font-bold text-slate-800">Syarat Pembukaan (Criteria):</p>
              <p className="text-slate-600">{activeBadgeModal.criteria}</p>

              {activeBadgeModal.unlocked && activeBadgeModal.unlockedAt && (
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold text-emerald-800">
                  <span>Tanggal Diraih:</span>
                  <span>{activeBadgeModal.unlockedAt}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setActiveBadgeModal(null)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs transition"
              >
                Tutup Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
