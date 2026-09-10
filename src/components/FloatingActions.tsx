import React from 'react';
import { motion } from 'motion/react';
import {
  Home,
  UtensilsCrossed,
  ShoppingBag,
  SlidersHorizontal,
} from 'lucide-react';
import { playReelSound } from '../utils/audio';

interface FloatingActionsProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onOpenMenu: () => void;
  onScrollToTop?: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  cartCount,
  onOpenCart,
  onOpenAdmin,
  onOpenMenu,
  onScrollToTop,
}) => {
  const handleHomeClick = () => {
    playReelSound();
    if (onScrollToTop) {
      onScrollToTop();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleMenuClick = () => {
    playReelSound();
    onOpenMenu();
  };

  const handleCartClick = () => {
    playReelSound();
    onOpenCart();
  };

  const handleAdminClick = () => {
    playReelSound();
    onOpenAdmin();
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 flex justify-center pb-[max(0.75rem,env(safe-area-inset-bottom))] px-3 pointer-events-none select-none">
      <motion.nav
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto relative flex items-center justify-between w-full max-w-md sm:max-w-lg px-4 sm:px-6 py-2 rounded-3xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md text-stone-800 dark:text-stone-100 border border-stone-200 dark:border-stone-800 shadow-[0_12px_35px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_35px_rgba(0,0,0,0.6)] transform-gpu gap-1 sm:gap-2"
      >
        {/* 1. Menu / المطبخ (Enlarged) */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.93 }}
          id="nav-kitchen-btn"
          type="button"
          onClick={handleMenuClick}
          className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl text-stone-700 dark:text-stone-400 hover:text-black dark:hover:text-white hover:bg-stone-100/70 dark:hover:bg-white/5 transition-all cursor-pointer group min-h-[52px]"
          title="قائمة الطعام"
        >
          <UtensilsCrossed className="w-6 h-6 text-stone-700 dark:text-stone-400 group-hover:text-black dark:group-hover:text-white transition-transform group-hover:scale-110" />
          <span className="text-xs sm:text-[13px] font-black mt-1 text-stone-700 dark:text-stone-400 group-hover:text-black dark:group-hover:text-white">
            المطبخ
          </span>
        </motion.button>

        {/* 2. Cart / السلة (Enlarged) */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.93 }}
          id="nav-cart-btn"
          type="button"
          onClick={handleCartClick}
          className="relative flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl text-stone-700 dark:text-stone-400 hover:text-black dark:hover:text-white hover:bg-stone-100/70 dark:hover:bg-white/5 transition-all cursor-pointer group min-h-[52px]"
          title="سلة الطلبات"
        >
          <div className="relative">
            <ShoppingBag className="w-6 h-6 text-stone-700 dark:text-stone-400 group-hover:text-black dark:group-hover:text-white transition-transform group-hover:scale-110" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2.5 min-w-[20px] h-5 px-1.5 rounded-full bg-black dark:bg-amber-400 text-white dark:text-stone-950 text-[10px] font-black font-mono flex items-center justify-center border-2 border-white dark:border-stone-900 shadow-sm animate-pulse">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-xs sm:text-[13px] font-black mt-1 text-stone-700 dark:text-stone-400 group-hover:text-black dark:group-hover:text-white">
            السلة
          </span>
        </motion.button>

        {/* 3. CENTER: الرئيسية (Home) Prominent Elevated Circle (Enlarged) */}
        <div className="relative -mt-7 flex flex-col items-center justify-center px-1 sm:px-2">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            id="nav-center-home-btn"
            type="button"
            onClick={handleHomeClick}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-stone-900 via-black to-stone-900 text-white flex items-center justify-center shadow-[0_8px_25px_rgba(0,0,0,0.35)] dark:shadow-[0_8px_25px_rgba(0,0,0,0.7)] border-4 border-white dark:border-stone-900 cursor-pointer select-none transition-transform"
            title="الرئيسية"
          >
            <Home className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </motion.button>
          <span className="text-xs sm:text-[13px] font-black mt-1 text-black dark:text-stone-200">
            الرئيسية
          </span>
        </div>

        {/* 4. Admin Panel / لوحة الإدارة (Matched styling with other buttons) */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.93 }}
          id="nav-admin-btn"
          type="button"
          onClick={handleAdminClick}
          className="flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl text-stone-700 dark:text-stone-400 hover:text-black dark:hover:text-white hover:bg-stone-100/70 dark:hover:bg-white/5 transition-all cursor-pointer group min-h-[52px]"
          title="لوحة إدارة المطعم"
        >
          <div className="relative">
            <SlidersHorizontal className="w-6 h-6 text-stone-700 dark:text-stone-400 group-hover:text-black dark:group-hover:text-white transition-transform group-hover:scale-110" />
          </div>
          <span className="text-xs sm:text-[13px] font-black mt-1 text-stone-700 dark:text-stone-400 group-hover:text-black dark:group-hover:text-white whitespace-nowrap">
            لوحة الإدارة
          </span>
        </motion.button>
      </motion.nav>
    </div>
  );
};
