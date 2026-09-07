import React from 'react';
import { Phone, MessageCircle, MapPin, Clock, ShieldCheck, Heart, Waves, Flame } from 'lucide-react';
import { RESTAURANT_INFO, sultanChefLogoImg } from '../data/dishes';

interface FooterProps {
  onOpenAdmin: () => void;
  onScrollToTop: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onScrollToTop }) => {
  return (
    <footer className="relative bg-[#0d0a08] border-t border-[#2a1e15] pt-16 pb-28 sm:pb-16 text-stone-400 text-xs overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-10 w-72 h-72 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-orange-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-stone-800/80">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-500/80 p-0.5 bg-amber-400">
                <img
                  src={sultanChefLogoImg}
                  alt="لوجو مطعم السلطان محمود الرسمي"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">
                  مطعم <span className="text-amber-400">السلطان محمود</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  {RESTAURANT_INFO.tagline}
                </p>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              نحن نفخر بتقديم أفضل جودة وطعم أصيل يجمع بين نضارة مأكولات البحر المقرمشة والمشوية، وسحر الشاورما السورية والمشويات على الفحم الطبيعي في ديروط.
            </p>

            {/* Branches addresses */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">{RESTAURANT_INFO.branchesAddress}</span>
              </div>
            </div>

            {/* Branches badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-cyan-950/60 text-cyan-300 border border-cyan-800/50 text-[11px] font-bold">
                <Waves className="w-3.5 h-3.5" />
                فرع الأسماك والمأكولات البحرية
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-950/60 text-amber-300 border border-amber-800/50 text-[11px] font-bold">
                <Flame className="w-3.5 h-3.5" />
                الفرع السوري والشاورما
              </span>
            </div>
          </div>

          {/* Quick Contact & Delivery Phone Numbers Col */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide">
              أرقام الدليفري والتوصيل السريع
            </h4>
            <div className="space-y-2">
              {/* Primary WhatsApp / Call */}
              <a
                href={RESTAURANT_INFO.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:text-emerald-300 transition-colors font-bold text-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>واتساب رئيسي: {RESTAURANT_INFO.phoneDisplay}</span>
              </a>

              {/* Delivery list */}
              {RESTAURANT_INFO.deliveryNumbers.map((num, idx) => (
                <a
                  key={idx}
                  href={`tel:${num.replace(/\s+/g, '')}`}
                  className="flex items-center gap-2 text-slate-300 hover:text-amber-400 transition-colors font-bold text-xs"
                >
                  <div className="p-1 rounded-lg bg-amber-500/10 text-amber-400">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <span dir="ltr">{num}</span>
                </a>
              ))}

              <div className="flex items-center gap-2 text-slate-400 text-xs pt-1">
                <div className="p-1.5 rounded-lg bg-white/5 text-slate-400">
                  <Clock className="w-4 h-4" />
                </div>
                <span>{RESTAURANT_INFO.workingHours}</span>
              </div>
            </div>
          </div>

          {/* Admin & Shortcuts */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide">
              إدارة المطعم والموقع
            </h4>
            <div className="space-y-2">
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-bold transition-all text-xs w-full cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>لوحة تحكم إدارة المطعم</span>
              </button>

              <button
                onClick={onScrollToTop}
                className="text-slate-400 hover:text-white transition-colors block text-xs pt-2 cursor-pointer"
              >
                الرجوع لأعلى الصفحة ↑
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
          <p>© {new Date().getFullYear()} مطعم السلطان محمود (السوري والأسماك). جميع الحقوق محفوظة.</p>
          <p className="flex items-center justify-center gap-1">
            ديروط - أول منزل أبو جبل | ميدان أبو جبل
          </p>
        </div>
      </div>
    </footer>
  );
};
