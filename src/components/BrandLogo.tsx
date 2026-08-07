import React from 'react';
import logoImg from '../assets/images/prospect_logo_1784769572843.jpg';

interface BrandLogoProps {
  variant?: 'header' | 'footer' | 'large' | 'card';
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'header',
  className = '',
  onClick,
}) => {
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

  // Default 'header' or 'card' variant
  return (
    <div onClick={onClick} className={`flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0 ${className}`}>
      <div className="relative bg-white p-1 rounded-xl shadow-md border border-slate-200 overflow-hidden w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
        <img
          src={logoImg}
          alt="PROSPECT EDUCATION CABANG JEMBER"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain"
        />
      </div>

      <div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <h1 className="text-xs sm:text-base md:text-xl font-black text-[#0F3D7A] dark:text-amber-300 tracking-tight leading-none font-serif group-hover:text-[#2563EB] transition-colors">
            PROSPECT EDUCATION
          </h1>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="bg-[#0F3D7A] text-white text-[8px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded uppercase tracking-wider">
            CABANG JEMBER
          </span>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider hidden sm:inline">
            LEGAL | AMAN | TERPERCAYA
          </span>
        </div>
      </div>
    </div>
  );
};
