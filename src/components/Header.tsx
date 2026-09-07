import React from 'react';
import { motion } from 'motion/react';
import { sultanChefLogoImg } from '../data/dishes';
import { ShoppingBag } from 'lucide-react';

interface HeaderProps {
  onOpenCart?: () => void;
  cartCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCart,
  cartCount = 0,
}) => {
  return (
    <header className="relative bg-[#faf6f0] border-b border-[#e6ded2] py-2.5 sm:py-3 transition-colors sticky top-0 z-30 shadow-xs backdrop-blur-md bg-[#faf6f0]/95">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Placeholder to balance layout */}
        <div className="w-10 sm:w-16 hidden sm:block" />

        {/* Center: Restaurant Brand Crest */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="flex items-center gap-2.5 select-none mx-auto sm:mx-0"
        >
          {/* Brand Crest Logo */}
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full p-0.5 bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 shadow-md shadow-amber-950/20">
            <div className="relative w-full h-full rounded-full overflow-hidden bg-white border-2 border-[#231811]">
              <img
                src={sultanChefLogoImg}
                alt="شعار مطعم السلطان محمود الرسمي"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
                loading="eager"
              />
            </div>
          </div>

          <div className="text-right">
            <h1 className="text-base sm:text-xl font-black tracking-tight text-[#22170f] flex items-center gap-1">
              <span>مطعم</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-600 to-orange-600">
                السلطان محمود
              </span>
            </h1>
            <p className="text-[9px] sm:text-[11px] text-[#755d4a] font-bold">
              ديروط • بحريات ومشويات وشاورما
            </p>
          </div>
        </motion.div>

        {/* Right Side: Cart quick trigger (Shows ONLY order count number) */}
        {onOpenCart ? (
          <button
            onClick={onOpenCart}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer shadow-xs ${
              cartCount > 0
                ? 'bg-amber-500 text-stone-950 font-black shadow-md shadow-amber-500/30'
                : 'bg-stone-200/80 hover:bg-stone-300/80 text-stone-700'
            }`}
            title="سلة الطلبات"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="font-mono text-xs">{cartCount}</span>
          </button>
        ) : (
          <div className="w-10 sm:w-16 hidden sm:block" />
        )}
      </div>
    </header>
  );
};
