import React from 'react';
import logoImg from '../assets/images/prospect_logo_1784769572843.jpg';

interface BrandLogoProps {
  variant?: 'header' | 'footer' | 'large' | 'card' | 'icon-only';
  className?: string;
  onClick?: () => void;
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'header',
  className = '',
  onClick,
  showSubtitle = true,
}) => {
  if (variant === 'icon-only') {
    return (
      <div
        onClick={onClick}
        className={`relative bg-white p-1 rounded-xl shadow-xs border border-slate-200/80 dark:border-slate-700 overflow-hidden w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform cursor-pointer ${className}`}
      >
        <img
          src={logoImg}
          alt="Prospect Education Logo"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  if (variant === 'large') {
    return (
      <div onClick={onClick} className={`flex flex-col items-center text-center group cursor-pointer ${className}`}>
        <div className="relative p-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-3 max-w-[280px]">
          <img
            src={logoImg}
            alt="PROSPECT EDUCATION CABANG JEMBER"
            referrerPolicy="no-referrer"
            className="w-full h-auto object-contain transition-transform group-hover:scale-105"
          />
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div onClick={onClick} className={`flex items-center gap-3 cursor-pointer group ${className}`}>
        <div className="bg-white p-1.5 rounded-xl border border-amber-500/30 shadow-md shrink-0 w-12 h-12 flex items-center justify-center">
          <img
            src={logoImg}
            alt="PROSPECT EDUCATION CABANG JEMBER"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <h3 className="text-lg font-black text-white font-serif tracking-tight leading-tight group-hover:text-amber-300 transition-colors">
            PROSPECT EDUCATION
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
              CABANG JEMBER
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div onClick={onClick} className={`flex items-center gap-2.5 cursor-pointer group shrink-0 ${className}`}>
        <div className="bg-white p-1 rounded-xl shadow-xs border border-white/20 overflow-hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
          <img
            src={logoImg}
            alt="PROSPECT EDUCATION CABANG JEMBER"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-serif font-black text-sm sm:text-base text-white tracking-tight">
              PROSPECT EDUCATION
            </span>
          </div>
          <span className="text-[10px] text-amber-300 font-semibold block">
            Cabang Balung Jember
          </span>
        </div>
      </div>
    );
  }

  // Default 'header' variant: Ultra responsive for Android & PC
  return (
    <div onClick={onClick} className={`flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0 ${className}`}>
      <div className="relative bg-white p-1 rounded-xl shadow-xs border border-slate-200/80 dark:border-slate-700 overflow-hidden w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
        <img
          src={logoImg}
          alt="PROSPECT EDUCATION CABANG JEMBER"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain"
        />
        <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 border border-white dark:border-slate-900"></span>
        </span>
      </div>

      <div className="flex flex-col justify-center min-w-0">
        <div className="flex items-center gap-1.5 flex-nowrap">
          <span className="text-sm sm:text-base md:text-lg font-black text-[#0F3D7A] dark:text-white tracking-tight leading-none font-serif group-hover:text-blue-700 dark:group-hover:text-amber-300 transition-colors">
            PROSPECT
          </span>
          <span className="text-[9px] sm:text-[10px] md:text-xs font-black bg-[#0F3D7A] text-amber-300 px-1.5 py-0.5 rounded tracking-wider shadow-2xs leading-none">
            EDUCATION
          </span>
        </div>
        {showSubtitle && (
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide truncate">
              Cabang Jember
            </span>
            <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">•</span>
            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider hidden sm:inline">
              Resmi & Legal
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

