import React from 'react';
import { Phone, MapPin, Clock, Fish, Flame } from 'lucide-react';
import { RESTAURANT_INFO, sultanChefLogoImg } from '../data/dishes';
import { playReelSound } from '../utils/audio';

interface FooterProps {
  onScrollToTop: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToTop }) => {
  return (
    <footer className="relative bg-[#0d0a08] border-t border-stone-800 pt-12 pb-28 sm:pb-14 text-stone-400 text-xs overflow-hidden select-none">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-10 w-72 h-72 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-orange-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 pb-10 border-b border-stone-800/80">
          {/* 1. Brand Col */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-amber-500/80 p-0.5 bg-amber-400 shrink-0">
                <img
                  src={sultanChefLogoImg}
                  alt="لوجو مطعم السلطان محمود الرسمي"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">
                  مطعم <span className="text-amber-400">السلطان محمود</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  {RESTAURANT_INFO.tagline}
                </p>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              طعم أصيل يجمع بين المأكولات البحرية الطازجة والمشويات والشاورما السورية على الفحم بديروط.
            </p>

            {/* Branches badges */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-cyan-950/60 text-cyan-300 border border-cyan-800/50 text-[10px] font-bold">
                <Fish className="w-3 h-3" />
                فرع الأسماك
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-950/60 text-amber-300 border border-amber-800/50 text-[10px] font-bold">
                <Flame className="w-3 h-3" />
                الفرع السوري
              </span>
            </div>
          </div>

          {/* 2. Working Hours & Branches Info Col */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide">
              أوقات العمل والفروع
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-slate-300 text-xs">
                <div className="p-1.5 rounded-lg bg-white/5 text-amber-400 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <span>{RESTAURANT_INFO.workingHours}</span>
              </div>

              <div className="flex items-start gap-2 text-slate-400 text-xs">
                <div className="p-1.5 rounded-lg bg-white/5 text-amber-400 shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="leading-relaxed">
                  ديروط • أول منزل أبو جبل (أسماك) • ميدان أبو جبل (سوري)
                </span>
              </div>
            </div>
          </div>

          {/* 3. The 2 Delivery Phone Numbers ONLY - Exactly 2 numbers */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-amber-400" />
              <span>أرقام الدليفري (رقمين فقط)</span>
            </h4>
            <div className="space-y-2">
              <a
                href="tel:01097828052"
                onClick={() => playReelSound()}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/40 transition-colors group cursor-pointer"
                title="اتصال مباشر بالرقم الأول"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Phone className="w-3 h-3" />
                  </div>
                  <span className="text-stone-300 text-xs font-medium group-hover:text-amber-300">
                    رقم الدليفري 1:
                  </span>
                </div>
                <span dir="ltr" className="text-amber-400 font-mono font-black text-xs sm:text-sm">
                  01097828052
                </span>
              </a>

              <a
                href="tel:01210789428"
                onClick={() => playReelSound()}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/40 transition-colors group cursor-pointer"
                title="اتصال مباشر بالرقم الثاني"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Phone className="w-3 h-3" />
                  </div>
                  <span className="text-stone-300 text-xs font-medium group-hover:text-amber-300">
                    رقم الدليفري 2:
                  </span>
                </div>
                <span dir="ltr" className="text-amber-400 font-mono font-black text-xs sm:text-sm">
                  01210789428
                </span>
              </a>
            </div>
          </div>

          {/* 4. Quick Navigation Shortcuts */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide">
              التنقل السريع
            </h4>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  playReelSound();
                  onScrollToTop();
                }}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-bold transition-all text-xs w-full cursor-pointer hover:border-white/30"
              >
                <span>الرجوع لأعلى الصفحة ↑</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right text-[11px] text-stone-500">
          <p>© {new Date().getFullYear()} مطعم السلطان محمود. جميع الحقوق محفوظة.</p>
          <p>ديروط - أول منزل أبو جبل | ميدان أبو جبل</p>
        </div>
      </div>
    </footer>
  );
};
