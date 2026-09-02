import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProgramInfo } from '../../types';
import { ProgramDetailModal } from './ProgramDetailModal';
import { downloadIFPGuidePDF } from '../../utils/downloadPdfGuide';
import {
  GraduationCap,
  Clock,
  ArrowRight,
  Globe,
  Sparkles,
  FileDown,
  FileText,
} from 'lucide-react';

interface ProgramsSectionProps {
  initialCategory?: 'All' | 'Taiwan' | 'Jepang';
}

export const ProgramsSection: React.FC<ProgramsSectionProps> = ({ initialCategory = 'All' }) => {
  const { programs, t } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Taiwan' | 'Jepang'>(initialCategory);
  const [activeModalProgram, setActiveModalProgram] = useState<ProgramInfo | null>(null);

  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const filteredPrograms = programs.filter(
    (p) => selectedCategory === 'All' || p.category === selectedCategory
  );

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold text-[#0F3D7A] uppercase tracking-widest bg-blue-50 border border-blue-200/80 px-3.5 py-1 rounded-full inline-block shadow-2xs">
            PROGRAM UNGGULAN
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
            Pilihan Program Pendidikan & Penyaluran Kerja
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Dua jalur utama menuju kesuksesan internasional: Perkuliahan S1 Taiwan IFP 1+4 (1 Thn Bahasa + 4 Thn S1) & Program Kerja Resmi di Jepang dengan garansi legalitas penuh dari Prospect Education Cabang Jember.
          </p>

          {/* Filter Tabs & PDF Guide Download Banner */}
          <div className="flex flex-col items-center gap-4 pt-4">
            <div className="flex justify-center items-center gap-2">
              {(['All', 'Taiwan', 'Jepang'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#0F3D7A] text-white shadow-md scale-105'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'All' ? 'Semua Program' : cat === 'Taiwan' ? '🇹🇼 Program Taiwan' : '🇯🇵 Program Jepang'}
                </button>
              ))}
            </div>

            {/* IFP 1+4 PDF Download CTA Banner */}
            <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-3.5 sm:p-4 max-w-xl w-full flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5 text-left">
                <div className="p-2 bg-[#0F3D7A] text-amber-300 rounded-xl shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">
                    {t('Panduan Syarat & Kurikulum Kuliah Taiwan IFP 1+4 (PDF)', 'Taiwan IFP 1+4 Program PDF Guide')}
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    {t('Unduh e-brosur lengkap rincian kuota, kurikulum, & syarat dokumen.', 'Download official e-brochure with details & checklist.')}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={downloadIFPGuidePDF}
                className="w-full sm:w-auto bg-[#0F3D7A] hover:bg-[#092852] text-amber-300 font-extrabold text-xs px-4 py-2.5 rounded-xl transition shadow-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <FileDown className="w-4 h-4 text-amber-300" />
                <span>{t('Unduh PDF Guide', 'Download PDF Guide')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Program Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPrograms.map((prog) => {
            const isTaiwanIFP = prog.category === 'Taiwan' || prog.id.includes('taiwan');

            return (
              <div
                key={prog.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                {/* Image & Badge */}
                <div className="relative h-52 overflow-hidden bg-slate-900">
                  <img
                    src={prog.image}
                    alt={prog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-[#0F3D7A]/90 text-amber-300 font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs shadow-xs">
                      {prog.badge}
                    </span>
                    <span className="bg-slate-900/90 text-white font-bold text-[10px] px-2.5 py-1 rounded-full backdrop-blur-xs">
                      {prog.category}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#0F3D7A] transition font-serif">
                      {prog.title}
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed">{prog.shortDesc}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-200/80 text-xs">
                    <div className="flex items-center justify-between text-slate-700 font-medium">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-[#0F3D7A]" /> Durasi:
                      </span>
                      <span className="font-bold text-slate-900">{prog.duration}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-700 font-medium">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <GraduationCap className="w-3.5 h-3.5 text-amber-600" /> Kuota Terisi:
                      </span>
                      <span className="font-bold text-emerald-700">
                        {prog.enrolledCount} / {prog.targetQuota} Peserta
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                    {isTaiwanIFP && (
                      <button
                        type="button"
                        onClick={downloadIFPGuidePDF}
                        className="bg-blue-50 hover:bg-blue-100 text-[#0F3D7A] font-bold text-xs py-2.5 px-3 rounded-xl border border-blue-200 transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                        title="Unduh Panduan Syarat IFP 1+4 PDF"
                      >
                        <FileDown className="w-3.5 h-3.5 text-[#0F3D7A]" />
                        <span>Panduan PDF</span>
                      </button>
                    )}

                    <button
                      onClick={() => setActiveModalProgram(prog)}
                      className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs py-2.5 rounded-xl transition text-center shadow-2xs cursor-pointer"
                    >
                      Detail Penjelasan
                    </button>

                    <button
                      onClick={() => setActiveModalProgram(prog)}
                      className="flex items-center justify-center gap-1.5 bg-[#0F3D7A] hover:bg-[#092852] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition shrink-0 cursor-pointer"
                    >
                      <span>Daftar</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Program Detail Modal */}
      <ProgramDetailModal
        program={activeModalProgram}
        onClose={() => setActiveModalProgram(null)}
      />
    </section>
  );
};
