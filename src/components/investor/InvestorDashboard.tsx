import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NotificationBell } from '../NotificationBell';
import { InvestorPDFReportModal } from '../reports/InvestorPDFReportModal';
import {
  TrendingUp,
  DollarSign,
  PieChart as PieIcon,
  Users,
  Award,
  Download,
  ShieldCheck,
  Building2,
  FileCheck2,
  GraduationCap,
  BookOpen,
  Search,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const InvestorDashboard: React.FC = () => {
  const { candidates = [], financials = [], setActiveTab, setRole } = useApp();

  const [schoolCategoryFilter, setSchoolCategoryFilter] = useState<'ALL' | 'SMA' | 'SMK' | 'MA'>('ALL');
  const [schoolSearchQuery, setSchoolSearchQuery] = useState('');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const safeFinancials = financials || [];

  const totalRevenue = safeFinancials
    .filter((f) => f.type === 'income')
    .reduce((sum, f) => sum + (f.amount || f.totalRevenue || 0), 0) || 310000000;

  const totalExpense = safeFinancials
    .filter((f) => f.type === 'expense')
    .reduce((sum, f) => sum + (f.amount || f.totalExpenses || 0), 0) || 120000000;

  const netProfit = totalRevenue - totalExpense;

  const revenueGrowthData = [
    { month: 'Q1 2025', revenue: 120000000, profit: 45000000 },
    { month: 'Q2 2025', revenue: 180000000, profit: 70000000 },
    { month: 'Q3 2025', revenue: 240000000, profit: 95000000 },
    { month: 'Q4 2025', revenue: 310000000, profit: 130000000 },
    { month: 'Q1 2026', revenue: 420000000, profit: 180000000 },
    { month: 'Q2 2026', revenue: 580000000, profit: 250000000 },
  ];

  const programShareData = [
    { name: 'Taiwan IFP 1+4', value: 45, color: '#0F3D7A' },
    { name: 'Jepang IM Japan', value: 30, color: '#d97706' },
    { name: 'Jepang SSW', value: 15, color: '#059669' },
    { name: 'Taiwan 4+1', value: 10, color: '#2563eb' },
  ];

  // --- School Performance Metrics Calculation ---
  const defaultSchools = [
    {
      schoolName: 'SMA Negeri 2 Jember',
      category: 'SMA' as const,
      baseStudents: 14,
      avgLmsProgress: 82,
      verifiedRate: 92,
      topProgram: 'Taiwan IFP 1+4',
    },
    {
      schoolName: 'SMK Negeri 1 Balung',
      category: 'SMK' as const,
      baseStudents: 12,
      avgLmsProgress: 75,
      verifiedRate: 88,
      topProgram: 'Jepang SSW',
    },
    {
      schoolName: 'SMK Negeri 3 Jember',
      category: 'SMK' as const,
      baseStudents: 11,
      avgLmsProgress: 88,
      verifiedRate: 95,
      topProgram: 'Jepang IM Japan',
    },
    {
      schoolName: 'SMA Negeri 1 Tanggul',
      category: 'SMA' as const,
      baseStudents: 8,
      avgLmsProgress: 70,
      verifiedRate: 85,
      topProgram: 'Taiwan IFP 1+4',
    },
    {
      schoolName: 'MA Negeri 1 Jember',
      category: 'MA' as const,
      baseStudents: 7,
      avgLmsProgress: 78,
      verifiedRate: 90,
      topProgram: 'Taiwan 4+1',
    },
    {
      schoolName: 'SMK Negeri 2 Jember',
      category: 'SMK' as const,
      baseStudents: 9,
      avgLmsProgress: 84,
      verifiedRate: 91,
      topProgram: 'Jepang IM Japan',
    },
  ];

  const candidateSchoolMap = new Map<string, { count: number; totalLms: number; verifiedCount: number }>();

  candidates.forEach((cand) => {
    const schoolName = cand.biodata?.education || 'SMA/SMK Sederajat';
    const current = candidateSchoolMap.get(schoolName) || { count: 0, totalLms: 0, verifiedCount: 0 };
    current.count += 1;
    current.totalLms += cand.lmsProgressPercent || 0;
    if (
      cand.status === 'documents_uploaded' ||
      cand.status === 'document_verified' ||
      cand.status === 'loa_issued' ||
      cand.status === 'superadmin_approved' ||
      cand.status === 'lms_active'
    ) {
      current.verifiedCount += 1;
    }
    candidateSchoolMap.set(schoolName, current);
  });

  const processedSchools = defaultSchools.map((school) => {
    const dynamicData = candidateSchoolMap.get(school.schoolName);
    if (dynamicData && dynamicData.count > 0) {
      const totalCount = school.baseStudents + dynamicData.count;
      const combinedLms = Math.round((school.avgLmsProgress * school.baseStudents + dynamicData.totalLms) / totalCount);
      const combinedVerified = Math.min(
        100,
        Math.round((school.verifiedRate * school.baseStudents + (dynamicData.verifiedCount / dynamicData.count) * 100 * dynamicData.count) / totalCount)
      );
      return {
        ...school,
        totalStudents: totalCount,
        avgLmsProgress: combinedLms,
        verifiedRate: combinedVerified,
      };
    }
    return {
      ...school,
      totalStudents: school.baseStudents,
    };
  });

  candidateSchoolMap.forEach((val, name) => {
    if (!defaultSchools.some((s) => s.schoolName === name)) {
      const category: 'SMA' | 'SMK' | 'MA' = name.toUpperCase().includes('SMK')
        ? 'SMK'
        : name.toUpperCase().includes('MA')
        ? 'MA'
        : 'SMA';
      processedSchools.push({
        schoolName: name,
        category,
        baseStudents: 0,
        totalStudents: val.count,
        avgLmsProgress: val.count > 0 ? Math.round(val.totalLms / val.count) : 0,
        verifiedRate: val.count > 0 ? Math.round((val.verifiedCount / val.count) * 100) : 0,
        topProgram: 'Taiwan IFP 1+4',
      });
    }
  });

  const totalSchoolsCount = processedSchools.length;
  const totalStudentsFromSchools = processedSchools.reduce((acc, s) => acc + s.totalStudents, 0);
  const overallAvgLmsProgress = Math.round(
    processedSchools.reduce((acc, s) => acc + s.avgLmsProgress * s.totalStudents, 0) / (totalStudentsFromSchools || 1)
  );
  const overallVerifiedRate = Math.round(
    processedSchools.reduce((acc, s) => acc + s.verifiedRate * s.totalStudents, 0) / (totalStudentsFromSchools || 1)
  );

  const topSchool = [...processedSchools].sort((a, b) => b.totalStudents - a.totalStudents)[0] || {
    schoolName: '-',
    totalStudents: 0,
  };

  const smkCount = processedSchools.filter((s) => s.category === 'SMK').reduce((acc, s) => acc + s.totalStudents, 0);
  const smaCount = processedSchools.filter((s) => s.category === 'SMA').reduce((acc, s) => acc + s.totalStudents, 0);
  const maCount = processedSchools.filter((s) => s.category === 'MA').reduce((acc, s) => acc + s.totalStudents, 0);

  const filteredSchools = processedSchools.filter((s) => {
    const matchesCat = schoolCategoryFilter === 'ALL' || s.category === schoolCategoryFilter;
    const matchesSearch = s.schoolName.toLowerCase().includes(schoolSearchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-slate-800 bg-slate-50/50">
      {/* Executive Header */}
      <div className="bg-gradient-to-r from-[#0F3D7A] via-sky-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-sky-300/30 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-sky-950/80 border border-sky-400/30 text-sky-300 px-3 py-1 rounded-full text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>PORTAL EKSEKUTIF INVESTOR & STAKEHOLDER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-white">
            Laporan Kinerja Keuangan & Pertumbuhan Cabang Jember
          </h1>
          <p className="text-xs text-slate-200 max-w-xl">
            Ringkasan kaji dampak investasi, tingkat pengembalian (ROI), performa registrasi peserta, dan proyeksi arus kas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="bg-sky-950/90 p-1 rounded-2xl border border-sky-400/30">
            <NotificationBell />
          </div>
          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-5 py-3 rounded-xl shadow-xs transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>Unduh Laporan Laba Rugi (PDF)</span>
          </button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Pemasukan Gross
          </span>
          <p className="text-2xl font-black text-blue-900 font-mono">
            Rp {totalRevenue.toLocaleString('id-ID')}
          </p>
          <p className="text-[10px] text-emerald-600 font-bold">↑ +24.5% dari target kuartal</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Beban Operasional Cabang
          </span>
          <p className="text-2xl font-black text-slate-900 font-mono">
            Rp {totalExpense.toLocaleString('id-ID')}
          </p>
          <p className="text-[10px] text-slate-500">Termasuk Gaji LPK & Sewa Balung Lor</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Laba Bersih Operasional (Net)
          </span>
          <p className="text-2xl font-black text-emerald-600 font-mono">
            Rp {netProfit.toLocaleString('id-ID')}
          </p>
          <p className="text-[10px] text-emerald-700 font-bold">Laba Siap Dibatasi Pembagian Dividen</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Estimasi ROI & Margins
          </span>
          <p className="text-2xl font-black text-sky-700 font-mono">38.4%</p>
          <p className="text-[10px] text-slate-500">Pengembalian Modal Investasi Awal</p>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Growth Line Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base font-serif">Pertumbuhan Omset & Profitabilitas</h3>
              <p className="text-xs text-slate-500">Histori Kuartalan Cabang Jember 2025-2026</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Tren Positif
            </span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueGrowthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#991b1b" strokeWidth={3} name="Omset" />
                <Line type="monotone" dataKey="profit" stroke="#059669" strokeWidth={3} name="Profit Net" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Program Market Share Pie Chart */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base font-serif">Komposisi Peminat Program</h3>
            <p className="text-xs text-slate-500">Persentase Pendaftaran Peserta</p>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={programShareData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                  {programShareData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {programShareData.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }}></span>
                  <span className="text-slate-700 font-medium">{p.name}</span>
                </div>
                <span className="font-bold text-slate-900">{p.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dedicated Summary Card: High-Level School Performance Metrics */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/60 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-[#0F3D7A] px-3.5 py-1 rounded-full text-xs font-bold">
              <GraduationCap className="w-4 h-4 text-amber-500" />
              <span>DEDICATED SCHOOL ANALYTICS CARD</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
              Ringkasan Kinerja & Analytics Sekolah Asal (Feeder School Metrics)
            </h2>
            <p className="text-xs text-slate-500 max-w-2xl">
              Agregasi performa akademis, tingkat verifikasi berkas, dan distribusi pendaftaran calon peserta berdasarkan sekolah asal di wilayah Jember & Karesidenan Besuki.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-2xl text-xs shrink-0">
            <span className="font-bold text-slate-600 px-2">Kategori:</span>
            {(['ALL', 'SMA', 'SMK', 'MA'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSchoolCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold transition ${
                  schoolCategoryFilter === cat
                    ? 'bg-[#0F3D7A] text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'Semua' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Top High-Level Metrics Grid (4 Stat Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          <div className="bg-gradient-to-br from-blue-50/80 to-white p-5 rounded-2xl border border-blue-100 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Sekolah Mitra</span>
              <Building2 className="w-4 h-4 text-[#0F3D7A]" />
            </div>
            <p className="text-3xl font-black text-[#0F3D7A] font-mono">{totalSchoolsCount}</p>
            <p className="text-[10px] text-slate-500 font-medium">SMA/SMK/MA Se-Jember & Besuki</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50/80 to-white p-5 rounded-2xl border border-amber-100 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Kontributor Utama</span>
              <Award className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-lg font-black text-slate-900 truncate">{topSchool.schoolName}</p>
            <p className="text-[11px] text-amber-700 font-bold">{topSchool.totalStudents} Peserta Terdaftar</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50/80 to-white p-5 rounded-2xl border border-emerald-100 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Rata-Rata Progres LMS</span>
              <BookOpen className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-3xl font-black text-emerald-700 font-mono">{overallAvgLmsProgress}%</p>
            <p className="text-[10px] text-emerald-600 font-bold">↑ +12% Dibandingkan Periode Lalu</p>
          </div>

          <div className="bg-gradient-to-br from-indigo-50/80 to-white p-5 rounded-2xl border border-indigo-100 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tingkat Verifikasi Berkas</span>
              <FileCheck2 className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-3xl font-black text-indigo-900 font-mono">{overallVerifiedRate}%</p>
            <p className="text-[10px] text-indigo-600 font-bold">Siap Mengikuti LoA & Visa</p>
          </div>
        </div>

        {/* School Category Distribution Bar */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 relative z-10">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Komposisi Asal Peserta Menurut Jenis Sekolah:</span>
            <span className="text-slate-500">{totalStudentsFromSchools} Total Siswa Pipeline</span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
            <div
              className="bg-[#0F3D7A] h-full transition-all"
              style={{ width: `${(smkCount / (totalStudentsFromSchools || 1)) * 100}%` }}
              title={`SMK: ${smkCount} Peserta`}
            />
            <div
              className="bg-amber-500 h-full transition-all"
              style={{ width: `${(smaCount / (totalStudentsFromSchools || 1)) * 100}%` }}
              title={`SMA: ${smaCount} Peserta`}
            />
            <div
              className="bg-emerald-600 h-full transition-all"
              style={{ width: `${(maCount / (totalStudentsFromSchools || 1)) * 100}%` }}
              title={`MA: ${maCount} Peserta`}
            />
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px] pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#0F3D7A]" />
              <span className="font-semibold text-slate-700">SMK Kejuruan: {smkCount} ({Math.round((smkCount / (totalStudentsFromSchools || 1)) * 100)}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="font-semibold text-slate-700">SMA Umum: {smaCount} ({Math.round((smaCount / (totalStudentsFromSchools || 1)) * 100)}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600" />
              <span className="font-semibold text-slate-700">MA (Madrasah Aliyah): {maCount} ({Math.round((maCount / (totalStudentsFromSchools || 1)) * 100)}%)</span>
            </div>
          </div>
        </div>

        {/* Detailed Table of Feeder Schools */}
        <div className="space-y-3 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="font-bold text-slate-900 text-sm font-serif">
              Tabel Performa Sekolah Mitra & Asal Peserta ({filteredSchools.length})
            </h3>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Cari nama sekolah..."
                value={schoolSearchQuery}
                onChange={(e) => setSchoolSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F3D7A]"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">Nama Sekolah</th>
                  <th className="p-3.5 text-center">Kategori</th>
                  <th className="p-3.5 text-center">Jumlah Peserta</th>
                  <th className="p-3.5">Progres LMS Akademik</th>
                  <th className="p-3.5 text-center">Verifikasi Berkas</th>
                  <th className="p-3.5">Program Dominan</th>
                  <th className="p-3.5 text-right">Status Performa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredSchools.map((school, idx) => {
                  const statusBadge =
                    school.avgLmsProgress >= 80 && school.verifiedRate >= 85
                      ? { label: 'Sangat Tinggi', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' }
                      : school.avgLmsProgress >= 70
                      ? { label: 'Aktif', color: 'bg-blue-100 text-blue-800 border-blue-300' }
                      : { label: 'Berkembang', color: 'bg-amber-100 text-amber-800 border-amber-300' };

                  return (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="p-3.5 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-[#0F3D7A] shrink-0" />
                          <span>{school.schoolName}</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-center">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-mono font-bold text-[10px]">
                          {school.category}
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-bold text-slate-900 font-mono text-sm">
                        {school.totalStudents} Siswa
                      </td>
                      <td className="p-3.5">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-slate-600">{school.avgLmsProgress}% Complete</span>
                          </div>
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-600 h-full rounded-full"
                              style={{ width: `${school.avgLmsProgress}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 text-center font-bold font-mono text-emerald-700">
                        {school.verifiedRate}%
                      </td>
                      <td className="p-3.5">
                        <span className="bg-blue-50 text-[#0F3D7A] border border-blue-200 px-2 py-1 rounded-lg font-medium text-[11px]">
                          {school.topProgram}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge.color}`}
                        >
                          {statusBadge.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Operational Highlights for Investors */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base font-serif">Laporan Rekam Jejak Operasional Jember</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-slate-400 font-bold block">Tingkat Kelulusan Visa:</span>
            <p className="text-xl font-black text-emerald-600">99.2%</p>
            <p className="text-slate-500">
              Seluruh berkas pendaftaran diperiksa ketat sesuai regulasi TETO & Kedutaan Jepang.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-slate-400 font-bold block">Kapasitas Gedung LPK Balung:</span>
            <p className="text-xl font-black text-slate-900">80 Peserta / Angkatan</p>
            <p className="text-slate-500">Ruang kelas ber-AC, laboratorium bahasa, dan tempat tinggal asrama.</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-slate-400 font-bold block">Target Pertumbuhan 2026:</span>
            <p className="text-xl font-black text-amber-600">300 Peserta / Tahun</p>
            <p className="text-slate-500">Perluasan jaringan ke sekolah menengah & universitas se-Karesidenan Besuki.</p>
          </div>
        </div>
      </div>

      {/* Investor PDF Report Modal */}
      <InvestorPDFReportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        financials={safeFinancials}
        candidatesCount={candidates.length}
      />
    </div>
  );
};
