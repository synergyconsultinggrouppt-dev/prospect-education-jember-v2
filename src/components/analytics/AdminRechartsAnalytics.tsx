import React, { useState } from 'react';
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
  ComposedChart,
  Line,
} from 'recharts';
import { Candidate, ProgramType } from '../../types';
import { BarChart3, FileCheck, Users, ShieldCheck, PieChart as PieIcon, Sparkles } from 'lucide-react';

interface Props {
  candidates: Candidate[];
}

export const AdminRechartsAnalytics: React.FC<Props> = ({ candidates }) => {
  const [selectedTrackFilter, setSelectedTrackFilter] = useState<'all' | 'taiwan' | 'japan'>('all');

  const safeCandidates = candidates || [];

  // Filter candidates by program track
  const filteredCandidates = safeCandidates.filter((c) => {
    if (selectedTrackFilter === 'taiwan') return c.selectedProgram?.startsWith('taiwan');
    if (selectedTrackFilter === 'japan') return c.selectedProgram?.startsWith('japan');
    return true;
  });

  // 1. Calculate Aggregated LMS Progress by Program
  const programMap: Record<string, { title: string; count: number; totalProgress: number }> = {
    taiwan_ifp: { title: 'S1 Taiwan IFP 1+4', count: 0, totalProgress: 0 },
    taiwan_4_1: { title: 'S2 / Master Taiwan', count: 0, totalProgress: 0 },
    japan_ssw: { title: 'Kaigo Tokutei Ginou', count: 0, totalProgress: 0 },
    japan_im: { title: 'IM Japan Scaffolding', count: 0, totalProgress: 0 },
  };

  filteredCandidates.forEach((c) => {
    const prog = c.selectedProgram || 'taiwan_ifp';
    if (!programMap[prog]) {
      programMap[prog] = { title: prog.toUpperCase(), count: 0, totalProgress: 0 };
    }
    programMap[prog].count += 1;
    programMap[prog].totalProgress += c.lmsProgressPercent || (c.loaIssued ? 100 : 45);
  });

  const lmsAggregateData = Object.keys(programMap).map((key) => {
    const item = programMap[key];
    const avgProgress = item.count > 0 ? Math.round(item.totalProgress / item.count) : 0;
    return {
      programKey: key,
      programName: item.title,
      jumlahSiswa: item.count,
      rataRataProgres: avgProgress,
    };
  });

  // 2. Calculate Aggregated Document Completeness Status
  let totalVerifiedDocs = 0;
  let totalPendingDocs = 0;
  let totalRejectedDocs = 0;

  filteredCandidates.forEach((c) => {
    const docs = c.documents || [];
    docs.forEach((d) => {
      if (d.status === 'verified') totalVerifiedDocs += 1;
      else if (d.status === 'pending' || d.status === 'uploaded') totalPendingDocs += 1;
      else if (d.status === 'rejected') totalRejectedDocs += 1;
    });
  });

  // Calculate total missing documents assuming 6 standard required documents per candidate
  const totalExpectedDocs = filteredCandidates.length * 6;
  const currentTotalUploaded = totalVerifiedDocs + totalPendingDocs + totalRejectedDocs;
  const totalMissingDocs = Math.max(0, totalExpectedDocs - currentTotalUploaded);

  const docAggregatePieData = [
    { name: 'Terverifikasi (Valid)', value: totalVerifiedDocs, color: '#10B981' },
    { name: 'Pending Verifikasi', value: totalPendingDocs, color: '#F59E0B' },
    { name: 'Perlu Revisi (Ditolak)', value: totalRejectedDocs, color: '#EF4444' },
    { name: 'Belum Diunggah', value: totalMissingDocs, color: '#64748B' },
  ].filter((item) => item.value > 0);

  const overallDocVerifiedRate =
    totalExpectedDocs > 0 ? Math.round((totalVerifiedDocs / totalExpectedDocs) * 100) : 0;

  return (
    <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-xl space-y-6 my-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold mb-1">
            <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
            <span>EXECUTIVE MANAGEMENT ANALYTICS</span>
          </div>
          <h3 className="text-xl font-bold font-serif text-white">
            Monitoring Progres LMS & Verifikasi Dokumen Peserta
          </h3>
          <p className="text-xs text-slate-400">
            Data visualisasi agregat dari seluruh kandidat terdaftar di LKP Prospect Education Cabang Jember.
          </p>
        </div>

        {/* Track Filter Toggle */}
        <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => setSelectedTrackFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedTrackFilter === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Semua Program
          </button>
          <button
            onClick={() => setSelectedTrackFilter('taiwan')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedTrackFilter === 'taiwan'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Taiwan 🇹🇼
          </button>
          <button
            onClick={() => setSelectedTrackFilter('japan')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedTrackFilter === 'japan'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Jepang 🇯🇵
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CHART 1: RATA-RATA PROGRES MODUL LMS PER PROGRAM */}
        <div className="lg:col-span-7 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-amber-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Rata-Rata Progres Modul Bahasa per Program</span>
            </h4>
            <span className="text-[11px] font-bold text-slate-400">
              Total: {filteredCandidates.length} Peserta
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={lmsAggregateData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="programName" tick={{ fontSize: 10, fill: '#cbd5e1' }} interval={0} />
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
                  stroke="#F59E0B"
                  tick={{ fontSize: 10, fill: '#F59E0B' }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl border border-amber-500/40 text-xs shadow-xl space-y-1">
                          <p className="font-bold text-amber-300">{data.programName}</p>
                          <p className="text-emerald-400 font-medium">
                            Rata-Rata Progres Modul: <strong>{data.rataRataProgres}%</strong>
                          </p>
                          <p className="text-amber-400 font-medium">
                            Jumlah Peserta Terdaftar: <strong>{data.jumlahSiswa} Orang</strong>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="rataRataProgres"
                  name="Rata-Rata Progres LMS (%)"
                  fill="#10B981"
                  radius={[6, 6, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="jumlahSiswa"
                  name="Jumlah Peserta"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#F59E0B' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: PIE CHART STATUS KELENGKAPAN DOKUMEN AGREGAT */}
        <div className="lg:col-span-5 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-0.5">
            <h4 className="font-bold text-sm text-amber-300 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-amber-400" />
              <span>Status Kelengkapan Berkas Agregat</span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Total {currentTotalUploaded} dari {totalExpectedDocs} estimasi dokumen telah masuk
            </p>
          </div>

          <div className="h-52 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={docAggregatePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {docAggregatePieData.map((entry, index) => (
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

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-emerald-400 font-mono">{overallDocVerifiedRate}%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Valid Rate</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span>Valid: <strong className="text-white">{totalVerifiedDocs}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
              <span>Pending: <strong className="text-white">{totalPendingDocs}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0"></span>
              <span>Revisi: <strong className="text-white">{totalRejectedDocs}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500 shrink-0"></span>
              <span>Belum Upload: <strong className="text-white">{totalMissingDocs}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
