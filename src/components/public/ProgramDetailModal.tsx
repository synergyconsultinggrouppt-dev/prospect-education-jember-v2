import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProgramInfo } from '../../types';
import { downloadIFPGuidePDF } from '../../utils/downloadPdfGuide';
import {
  X,
  CheckCircle2,
  Clock,
  DollarSign,
  Building,
  GraduationCap,
  HelpCircle,
  ArrowRight,
  FileDown,
  FileText,
} from 'lucide-react';

interface Props {
  program: ProgramInfo | null;
  onClose: () => void;
}

export const ProgramDetailModal: React.FC<Props> = ({ program, onClose }) => {
  const { setRole, setActiveTab, setSelectedProgramId } = useApp();

  if (!program) return null;

  const handleRegisterClick = () => {
    setSelectedProgramId(program.id);
    setActiveTab('pendaftaran');
    onClose();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] my-auto flex flex-col overflow-hidden">
        {/* Header */}
        <div className="relative h-48 sm:h-56 overflow-hidden bg-slate-900 text-white">
          <img
            src={program.image}
            alt={program.title}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent p-6 flex flex-col justify-end">
            <span className="bg-red-800 text-amber-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md w-fit mb-2">
              {program.badge}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white font-serif">{program.title}</h2>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-xs sm:text-sm">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-medium text-[11px] block flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-red-700" /> Durasi Program
              </span>
              <p className="font-bold text-slate-900 mt-0.5">{program.duration}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-medium text-[11px] block flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Estimasi Biaya
              </span>
              <p className="font-bold text-slate-900 mt-0.5">{program.estimatedCost}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
              <span className="text-slate-400 font-medium text-[11px] block flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-amber-600" /> Kuota Terisi
              </span>
              <p className="font-bold text-slate-900 mt-0.5">
                {program.enrolledCount} / {program.targetQuota} Peserta
              </p>
            </div>
          </div>

          {/* Deskripsi */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 font-serif">Penjelasan Program</h3>
            <p className="text-slate-600 leading-relaxed">{program.fullDesc}</p>
          </div>

          {/* Keunggulan & Benefit */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 font-serif">Keunggulan & Fasilitas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {program.benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-2 bg-emerald-50/60 p-2.5 rounded-xl text-emerald-900 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Persyaratan */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 font-serif">Persyaratan Pendaftaran</h3>
            <ul className="space-y-1.5 text-slate-600">
              {program.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-700 shrink-0 mt-2"></span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tahapan Alur */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 font-serif">Tahapan Seleksi & Keberangkatan</h3>
            <div className="space-y-2">
              {program.stages.map((stage, i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="w-6 h-6 rounded-full bg-red-800 text-amber-300 text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="font-medium text-slate-800 text-xs">{stage}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mitra Kampus / Industri */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 font-serif flex items-center gap-2">
              <Building className="w-4 h-4 text-red-700" />
              <span>Mitra Universitas & Industri</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {program.partnerUniversitiesOrCompanies.map((partner, i) => (
                <span key={i} className="bg-slate-100 text-slate-800 px-3 py-1.5 rounded-lg font-medium text-xs border border-slate-200">
                  {partner}
                </span>
              ))}
            </div>
          </div>

          {/* FAQ */}
          {program.faqs.length > 0 && (
            <div className="space-y-2 pt-2">
              <h3 className="text-base font-bold text-slate-900 font-serif flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>Pertanyaan Sering Diajukan (FAQ)</span>
              </h3>
              <div className="space-y-2">
                {program.faqs.map((faq, i) => (
                  <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                    <p className="font-bold text-slate-900 text-xs">Q: {faq.question}</p>
                    <p className="text-slate-600 text-xs">A: {faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold text-xs transition"
            >
              Tutup
            </button>

            {program.category === 'Taiwan' && (
              <button
                type="button"
                onClick={downloadIFPGuidePDF}
                className="flex items-center gap-1.5 bg-red-100 hover:bg-red-200 text-red-900 font-bold text-xs px-3.5 py-2 rounded-xl border border-red-200 transition shadow-2xs"
                title="Download Brosur & Panduan Syarat IFP 1+4 PDF"
              >
                <FileDown className="w-4 h-4 text-red-700" />
                <span>Unduh Panduan PDF (IFP 1+4)</span>
              </button>
            )}
          </div>

          <button
            onClick={handleRegisterClick}
            className="flex items-center gap-2 bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-900 hover:to-amber-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition"
          >
            <span>Daftar Program Ini</span>
            <ArrowRight className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
