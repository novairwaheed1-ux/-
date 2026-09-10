import React from 'react';
import { Smartphone, Monitor, Wifi, Battery, Signal } from 'lucide-react';

interface MobileFrameProps {
  isSimulated: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  isSimulated,
  onToggle,
  children,
}) => {
  if (!isSimulated) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-200">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-900 py-6 px-4 flex flex-col items-center justify-start transition-colors duration-200">
      {/* Top Simulator Controls Toolbar */}
      <div className="w-full max-w-sm mb-4 flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white dark:bg-stone-900 border border-black/10 dark:border-white/10 shadow-sm text-xs backdrop-blur-md">
        <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100">
          <Smartphone className="w-4 h-4 text-black dark:text-rose-400" />
          <span className="font-bold">معاينة فورية للموبايل (Mobile Preview)</span>
        </div>
        <button
          onClick={onToggle}
          className="flex items-center gap-1 px-3 py-1 rounded-xl bg-black hover:bg-stone-800 dark:bg-[#881337] dark:hover:bg-[#9f1239] dark:text-white text-white font-black text-[11px] transition-all shadow-xs cursor-pointer"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>شاشة كاملة</span>
        </button>
      </div>

      {/* Realistic Smartphone Mockup Bezel */}
      <div className="relative w-full max-w-[390px] h-[844px] rounded-[48px] border-[10px] border-black dark:border-stone-800 shadow-[0_25px_60px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col bg-white dark:bg-stone-950">
        {/* Phone Notch / Dynamic Island */}
        <div className="absolute top-0 inset-x-0 h-9 bg-black z-50 flex items-center justify-between px-7 text-[11px] font-bold text-white select-none">
          <span>9:41</span>
          <div className="w-24 h-4 rounded-full bg-stone-900 border border-white/20" />
          <div className="flex items-center gap-1.5 text-stone-300">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Inner Phone Viewport */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pt-9 pb-4 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100">
          {children}
        </div>

        {/* Bottom Home Indicator Bar */}
        <div className="absolute bottom-1 inset-x-0 h-4 flex items-center justify-center pointer-events-none z-50">
          <div className="w-32 h-1 rounded-full bg-black/40 dark:bg-white/40" />
        </div>
      </div>
    </div>
  );
};
