import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calculator,
  DollarSign,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2,
  GraduationCap,
  Briefcase,
  PiggyBank,
  Download,
  MessageCircle,
  Info,
} from 'lucide-react';

export const CostEarningsCalculator: React.FC = () => {
  const { t, setActiveTab } = useApp();

  const [selectedProgram, setSelectedProgram] = useState<'taiwan_ifp' | 'japan_ssw' | 'japan_im'>('taiwan_ifp');
  const [lifestyleTier, setLifestyleTier] = useState<'hemat' | 'standar'>('standar');
  const [exchangeRateNTD] = useState(510); // IDR per NTD
  const [exchangeRateJPY] = useState(105); // IDR per JPY

  // Taiwan calculations
  const taiwanData = {
    programFee: 15000000,
    partTimeHoursPerWeek: 20,
    hourlyWageNTD: 190, // NTD per hour
    monthlyWorkIncomeNTD: 20 * 4 * 190, // ~15,200 NTD
    livingCostNTD: lifestyleTier === 'hemat' ? 7000 : 9500, // Dorm + Food
    scholarshipSupport: '100% Bebas SPP Tahun ke-1 (Foundation)',
    durationYears: 5,
  };

  const taiwanMonthlyIncomeIDR = taiwanData.monthlyWorkIncomeNTD * exchangeRateNTD;
  const taiwanMonthlyExpenseIDR = taiwanData.livingCostNTD * exchangeRateNTD;
  const taiwanNetSavingsMonthlyIDR = Math.max(0, taiwanMonthlyIncomeIDR - taiwanMonthlyExpenseIDR);
  const taiwanYearlySavingsIDR = taiwanNetSavingsMonthlyIDR * 12;

  // Japan SSW calculations
  const japanSswData = {
    programFee: 22000000,
    baseSalaryJPY: 210000,
    taxInsuranceJPY: 38000,
    livingCostJPY: lifestyleTier === 'hemat' ? 48000 : 62000,
    durationYears: 5,
  };

  const japanSswMonthlyGrossIDR = japanSswData.baseSalaryJPY * exchangeRateJPY;
  const japanSswMonthlyExpenseIDR = (japanSswData.taxInsuranceJPY + japanSswData.livingCostJPY) * exchangeRateJPY;
  const japanSswNetSavingsMonthlyIDR = japanSswMonthlyGrossIDR - japanSswMonthlyExpenseIDR;
  const japanSswYearlySavingsIDR = japanSswNetSavingsMonthlyIDR * 12;

  // Japan IM Japan calculations
  const japanImData = {
    programFee: 10000000, // Pelatihan awal LPK
    baseAllowanceJPY: 145000,
    livingCostJPY: lifestyleTier === 'hemat' ? 35000 : 45000,
    modalUsahaJPY: 800000, // Uang purna magang
    durationYears: 3,
  };

  const japanImMonthlyGrossIDR = japanImData.baseAllowanceJPY * exchangeRateJPY;
  const japanImMonthlyExpenseIDR = japanImData.livingCostJPY * exchangeRateJPY;
  const japanImNetSavingsMonthlyIDR = japanImMonthlyGrossIDR - japanImMonthlyExpenseIDR;
  const japanImTotalContractSavingsIDR = japanImNetSavingsMonthlyIDR * 36 + japanImData.modalUsahaJPY * exchangeRateJPY;

  const currentProgramInfo =
    selectedProgram === 'taiwan_ifp'
      ? {
          title: 'Taiwan IFP 1+4 (S1 Beasiswa)',
          category: 'Kuliah Gelar S1 Resmi',
          icon: GraduationCap,
          programFee: taiwanData.programFee,
          monthlyIncome: taiwanMonthlyIncomeIDR,
          monthlyExpense: taiwanMonthlyExpenseIDR,
          monthlySavings: taiwanNetSavingsMonthlyIDR,
          yearlySavings: taiwanYearlySavingsIDR,
          highlight: 'Ijazah S1 Diakui Internasional & Bebas Biaya Kuliah Tahun ke-1',
          currencyNote: '1 NT$ ≈ Rp 510',
        }
      : selectedProgram === 'japan_ssw'
      ? {
          title: 'Jepang Tokutei Ginou (SSW)',
          category: 'Pekerja Berketerampilan Khusus',
          icon: Briefcase,
          programFee: japanSswData.programFee,
          monthlyIncome: japanSswMonthlyGrossIDR,
          monthlyExpense: japanSswMonthlyExpenseIDR,
          monthlySavings: japanSswNetSavingsMonthlyIDR,
          yearlySavings: japanSswYearlySavingsIDR,
          highlight: 'Kontrak Kerja Langsung dengan Standar Gaji Setara Warga Jepang',
          currencyNote: '1 ¥ ≈ Rp 105',
        }
      : {
          title: 'Magang Kerja Jepang (IM Japan)',
          category: 'Kerjasama Resmi Kemnaker RI',
          icon: Building2,
          programFee: japanImData.programFee,
          monthlyIncome: japanImMonthlyGrossIDR,
          monthlyExpense: japanImMonthlyExpenseIDR,
          monthlySavings: japanImNetSavingsMonthlyIDR,
          yearlySavings: japanImTotalContractSavingsIDR / 3,
          highlight: 'Bonus Modal Usaha Mandiri ~Rp 84.000.000 saat tuntas 3 tahun',
          currencyNote: '1 ¥ ≈ Rp 105',
        };

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold text-[#0F3D7A] uppercase tracking-widest bg-blue-100/70 border border-blue-200 px-3.5 py-1 rounded-full inline-block">
            KALKULATOR TRANSPARANSI BIAYA & PENDAPATAN
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
            Simulasi Investasi Pendidikan vs Estimasi Penghasilan
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Hitung perkiraan biaya awal, estimasi uang saku atau gaji bulanan, biaya hidup asrama, dan potensi tabungan bersih secara terbuka sebelum mendaftar.
          </p>
        </div>

        {/* Calculator Main Box */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10 space-y-8">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center border-b border-slate-100 pb-6">
            {/* Program Tabs */}
            <div className="lg:col-span-8 space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Pilih Program yang Ingin Dihitung:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProgram('taiwan_ifp')}
                  className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 cursor-pointer ${
                    selectedProgram === 'taiwan_ifp'
                      ? 'bg-[#0F3D7A] text-white border-[#0F3D7A] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <GraduationCap className="w-5 h-5 shrink-0 text-amber-300" />
                  <div className="min-w-0">
                    <p className="font-bold text-xs truncate">Taiwan IFP 1+4</p>
                    <p className={`text-[10px] ${selectedProgram === 'taiwan_ifp' ? 'text-slate-200' : 'text-slate-500'}`}>Kuliah S1 Beasiswa</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedProgram('japan_ssw')}
                  className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 cursor-pointer ${
                    selectedProgram === 'japan_ssw'
                      ? 'bg-[#0F3D7A] text-white border-[#0F3D7A] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Briefcase className="w-5 h-5 shrink-0 text-emerald-400" />
                  <div className="min-w-0">
                    <p className="font-bold text-xs truncate">Jepang SSW</p>
                    <p className={`text-[10px] ${selectedProgram === 'japan_ssw' ? 'text-slate-200' : 'text-slate-500'}`}>Kerja Tokutei Ginou</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedProgram('japan_im')}
                  className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 cursor-pointer ${
                    selectedProgram === 'japan_im'
                      ? 'bg-[#0F3D7A] text-white border-[#0F3D7A] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Building2 className="w-5 h-5 shrink-0 text-sky-300" />
                  <div className="min-w-0">
                    <p className="font-bold text-xs truncate">Magang IM Japan</p>
                    <p className={`text-[10px] ${selectedProgram === 'japan_im' ? 'text-slate-200' : 'text-slate-500'}`}>Kemnaker RI</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Lifestyle selector */}
            <div className="lg:col-span-4 space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Gaya Hidup & Pengeluaran Makan/Asrama:
              </label>
              <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setLifestyleTier('hemat')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    lifestyleTier === 'hemat'
                      ? 'bg-[#0F3D7A] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Hemat & Masak Sendiri
                </button>
                <button
                  type="button"
                  onClick={() => setLifestyleTier('standar')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    lifestyleTier === 'standar'
                      ? 'bg-[#0F3D7A] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Standar Kampus / Asrama
                </button>
              </div>
            </div>
          </div>

          {/* Results Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Box 1: Biaya Awal Pelatihan */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                1. Estimasi Biaya Pelatihan di Jember
              </span>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                Rp {currentProgramInfo.programFee.toLocaleString('id-ID')}
              </p>
              <div className="space-y-1.5 text-xs text-slate-600">
                <p className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Dapat dicicil selama masa pelatihan LPK</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Termasuk bimbingan dokumen, paspor, & visa</span>
                </p>
              </div>
            </div>

            {/* Box 2: Pendapatan Bulanan */}
            <div className="bg-blue-50/60 p-6 rounded-2xl border border-blue-100 space-y-3">
              <span className="text-[11px] font-bold text-[#0F3D7A] uppercase tracking-wider block">
                2. Estimasi Penghasilan Bulanan
              </span>
              <p className="text-2xl sm:text-3xl font-black text-[#0F3D7A] font-mono">
                Rp {Math.round(currentProgramInfo.monthlyIncome).toLocaleString('id-ID')}
              </p>
              <div className="space-y-1 text-xs text-slate-600">
                <p>Pengeluaran Hidup: <strong className="text-slate-800">Rp {Math.round(currentProgramInfo.monthlyExpense).toLocaleString('id-ID')}</strong>/bln</p>
                <p className="text-[10px] text-slate-500 font-medium">({currentProgramInfo.currencyNote})</p>
              </div>
            </div>

            {/* Box 3: Potensi Tabungan Bersih */}
            <div className="bg-emerald-50/80 p-6 rounded-2xl border border-emerald-200 space-y-3">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                3. Potensi Tabungan Bersih / Bulan
              </span>
              <p className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono">
                Rp {Math.round(currentProgramInfo.monthlySavings).toLocaleString('id-ID')}
              </p>
              <div className="space-y-1 text-xs text-emerald-900">
                <p className="font-bold">Estimasi 1 Tahun: Rp {Math.round(currentProgramInfo.yearlySavings).toLocaleString('id-ID')}</p>
                <p className="text-[11px] text-emerald-800 font-medium">Bisa untuk remitansi keluarga atau tabungan masa depan.</p>
              </div>
            </div>
          </div>

          {/* Program Highlights & CTA */}
          <div className="bg-[#0C2340] text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-amber-300">Keunggulan Khusus Program {currentProgramInfo.title}:</p>
                <p className="text-xs sm:text-sm font-medium text-slate-200 mt-0.5">{currentProgramInfo.highlight}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 flex-wrap justify-center">
              <button
                type="button"
                onClick={() => setActiveTab('pendaftaran')}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-xs cursor-pointer"
              >
                Daftar Program Ini
              </button>
              <a
                href={`https://wa.me/6282334554396?text=${encodeURIComponent(
                  `Halo Admin Prospect Education Cabang Jember, saya tertarik berkonsultasi mengenai rincian biaya & estimasi penghasilan untuk program: ${currentProgramInfo.title}. Mohon informasinya.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Konsultasi WA</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
