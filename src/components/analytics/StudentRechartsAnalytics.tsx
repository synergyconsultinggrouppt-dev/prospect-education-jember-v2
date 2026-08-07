import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Candidate, LMSModule } from '../../types';
import { BookOpen, FileCheck2, Clock, Award, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  candidate: Candidate;
  lmsModules: LMSModule[];
}

export const StudentRechartsAnalytics: React.FC<Props> = ({ candidate, lmsModules }) => {
  // 1. Prepare LMS Modules Chart Data
  const lmsChartData = lmsModules.map((module) => {
    const progress = module.isCompleted
      ? 100
      : module.progressPercent ?? (module.isCompleted ? 100 : 30);
    const timeSpent = module.isCompleted
      ? module.durationMinutes
      : module.timeSpentMinutes ?? Math.round(module.durationMinutes * 0.3);

    // Truncate long title for X-Axis tick label
    const shortTitle =
      module.title.length > 18 ? module.title.substring(0, 16) + '...' : module.title;

    return {
      name: shortTitle,
      fullTitle: module.title,
      persentase: progress,
      durasiMenit: module.durationMinutes,
      waktuTerpakai: timeSpent,
      isCompleted: module.isCompleted,
    };
  });

  // Calculate Overall LMS Summary Metrics
  const totalModules = lmsModules.length;
  const completedModules = lmsModules.filter((m) => m.isCompleted).length;
  const overallProgressPercent = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
  const totalMinutesSpent = lmsChartData.reduce((sum, item) => sum + item.waktuTerpakai, 0);
  const totalDurationMinutes = lmsChartData.reduce((sum, item) => sum + item.durasiMenit, 0);

  // 2. Prepare Document Completeness Pie Chart Data
  const docs = candidate.documents || [];
  const verifiedCount = docs.filter((d) => d.status === 'verified').length;
  const pendingCount = docs.filter((d) => d.status === 'pending' || d.status === 'uploaded').length;
  const rejectedCount = docs.filter((d) => d.status === 'rejected').length;
  
  // Standard required documents total count (usually 6 primary documents)
  const requiredDocTotal = Math.max(6, docs.length);
  const missingCount = Math.max(0, requiredDocTotal - docs.length);

  const docCompletenessData = [
    { name: 'Terverifikasi (Valid)', value: verifiedCount, color: '#10B981' }, // Emerald
    { name: 'Pending Verifikasi', value: pendingCount, color: '#F59E0B' }, // Amber
    { name: 'Perlu Revisi', value: rejectedCount, color: '#EF4444' }, // Red
    { name: 'Belum Diunggah', value: missingCount, color: '#94A3B8' }, // Slate
  ].filter((item) => item.value > 0);

  const verifiedPercent = Math.round((verifiedCount / requiredDocTotal) * 100);

  return (
    <div className="space-y-6 my-6">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#0F3D7A]" />
            <span>Visualisasi Analytics & Grafik Progres Belajar</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Grafik real-time pencapaian modul bahasa dan kelengkapan berkas pendaftaran peserta Prospect Education.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>LMS Sync Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CHART 1: PROGRES BELAJAR BAHASA (MODUL LMS) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Progres Modul Bahasa & Waktu Belajar (Menit)</span>
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Pencapaian persentase kelulusan dan durasi aktif setiap modul
              </p>
            </div>
            <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold text-xs px-2.5 py-1 rounded-lg border border-amber-300 dark:border-amber-800">
              {completedModules} / {totalModules} Modul ({overallProgressPercent}%)
            </span>
          </div>

          {/* Recharts BarChart */}
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lmsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke="#10B981"
                  tick={{ fontSize: 10, fill: '#10B981' }}
                  unit="%"
                  domain={[0, 100]}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#0F3D7A"
                  tick={{ fontSize: 10, fill: '#0F3D7A' }}
                  unit="m"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl border border-amber-500/30 text-xs shadow-lg space-y-1">
                          <p className="font-bold text-amber-300">{data.fullTitle}</p>
                          <p className="text-emerald-400 font-medium">
                            Progres Kelulusan: <strong>{data.persentase}%</strong>
                          </p>
                          <p className="text-blue-300">
                            Waktu Belajar: <strong>{data.waktuTerpakai}</strong> / {data.durasiMenit} Menit
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Status: {data.isCompleted ? '✅ Lunas & Lulus' : '⏳ Sedang Dipelajari'}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px' }} />
                <Bar
                  yAxisId="left"
                  dataKey="persentase"
                  name="Pencapaian (%)"
                  fill="#10B981"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  yAxisId="right"
                  dataKey="waktuTerpakai"
                  name="Waktu Terpakai (Menit)"
                  fill="#0F3D7A"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-semibold">Total Durasi Belajar</span>
              <strong className="text-slate-800 dark:text-slate-200 font-mono text-sm">{totalMinutesSpent} / {totalDurationMinutes} Menit</strong>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-semibold">Status Sertifikasi</span>
              <strong className={overallProgressPercent === 100 ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>
                {overallProgressPercent === 100 ? 'Siap Klaim Sertifikat' : 'Dalam Proses Learning'}
              </strong>
            </div>
          </div>
        </div>

        {/* CHART 2: STATUS KELENGKAPAN DOKUMEN PESERTA */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-0.5">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-500" />
              <span>Status Kelengkapan Dokumen Berkas</span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Distribusi status verifikasi berkas persyaratan resmi
            </p>
          </div>

          {/* Recharts PieChart / Donut */}
          <div className="h-56 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={docCompletenessData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {docCompletenessData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0];
                      return (
                        <div className="bg-slate-900 text-white px-3 py-1.5 rounded-xl border border-slate-700 text-xs shadow-md">
                          <span className="font-bold" style={{ color: data.payload.color }}>
                            {data.name}:
                          </span>{' '}
                          <strong>{data.value} Berkas</strong>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Centered Donut Badge */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{verifiedPercent}%</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Valid</span>
            </div>
          </div>

          {/* Legend Badges */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0"></span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">Valid: <strong>{verifiedCount}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0"></span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">Pending: <strong>{pendingCount}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 shrink-0"></span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">Revisi: <strong>{rejectedCount}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-400 shrink-0"></span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">Belum Upload: <strong>{missingCount}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
