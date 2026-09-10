import React from 'react';
import { motion } from 'motion/react';
import { sultanChefLogoImg, sultanRestaurantCoverImg } from '../data/dishes';
import { MapPin } from 'lucide-react';
import { playReelSound } from '../utils/audio';

interface HeaderProps {
  onOpenCart?: () => void;
  cartCount?: number;
}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="relative w-full select-none overflow-hidden bg-stone-950 border-b border-white/10 shadow-sm">
      {/* 1. Official Restaurant Page Cover Photo as Background */}
      <div className="relative w-full h-32 sm:h-44 md:h-52 overflow-hidden">
        <img
          src={sultanRestaurantCoverImg}
          alt="غلاف صفحة مطعم السلطان محمود"
          loading="eager"
          decoding="async"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transform scale-102 filter brightness-95"
        />
        {/* Subtle Luxury Dark Gradient Vignette for Perfect Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-black/45 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
      </div>

      {/* 2. Restaurant Profile & Identity Details */}
      <div className="relative max-w-4xl mx-auto px-3.5 sm:px-6 -mt-10 sm:-mt-14 pb-3 flex items-end justify-between gap-3">
        <div className="flex items-end gap-3 sm:gap-4">
          {/* Circular Restaurant Logo Avatar with Golden Royal Ring */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={() => {
              playReelSound();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="relative w-19 h-19 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr from-[#4c0519] via-[#881337] to-[#9f1239] shadow-xl cursor-pointer shrink-0 group transform-gpu"
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-white border-2 border-stone-900 shadow-inner">
              <img
                src={sultanChefLogoImg}
                alt="شعار مطعم السلطان محمود"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="eager"
              />
            </div>
          </motion.div>

          {/* Name & Location */}
          <div className="pb-1 text-right">
            <h1 className="text-base sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
              مطعم السلطان محمود
            </h1>
            <p className="text-[11px] sm:text-xs text-stone-300 font-bold mt-0.5 flex items-center gap-1 drop-shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>ديروط • أسماك طازجة & مشويات سورية</span>
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

