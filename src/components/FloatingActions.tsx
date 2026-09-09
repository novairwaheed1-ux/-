import React from 'react';
import { motion } from 'motion/react';
import {
  Home,
  UtensilsCrossed,
  ShoppingBag,
  SlidersHorizontal,
  MessageCircle,
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
    <div className="fixed bottom-0 inset-x-0 z-40 flex justify-center pb-[max(0.5rem,env(safe-area-inset-bottom))] px-3 pointer-events-none select-none">
      <motion.nav
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto relative flex items-center justify-between w-full max-w-lg px-3 py-1.5 rounded-3xl bg-white text-stone-800 border border-black/10 shadow-[0_8px_30px_rgba(0,0,0,0.1)] transform-gpu"
      >
        {/* 1. Menu / المطبخ */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          id="nav-kitchen-btn"
          type="button"
          onClick={handleMenuClick}
          className="flex-1 flex flex-col items-center justify-center py-1 text-stone-700 hover:text-black transition-colors cursor-pointer group"
          title="قائمة الطعام"
        >
          <UtensilsCrossed className="w-5 h-5 text-stone-700 group-hover:text-black transition-transform" />
          <span className="text-[10px] font-black mt-0.5 text-stone-700 group-hover:text-black">
            المطبخ
          </span>
        </motion.button>

        {/* 2. Cart / السلة */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          id="nav-cart-btn"
          type="button"
          onClick={handleCartClick}
          className="relative flex-1 flex flex-col items-center justify-center py-1 text-stone-700 hover:text-black transition-colors cursor-pointer group"
          title="سلة الطلبات"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-stone-700 group-hover:text-black transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[17px] h-4 px-1 rounded-full bg-black text-white text-[9px] font-black font-mono flex items-center justify-center border border-white shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-black mt-0.5 text-stone-700 group-hover:text-black">
            السلة
          </span>
        </motion.button>

        {/* 3. CENTER: الرئيسية (Home) Elevated Circle */}
        <div className="relative -mt-6 flex flex-col items-center justify-center px-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            id="nav-center-home-btn"
            type="button"
            onClick={handleHomeClick}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-stone-900 via-black to-stone-900 text-white flex items-center justify-center shadow-[0_6px_20px_rgba(0,0,0,0.3)] border-3 border-white cursor-pointer select-none transition-transform"
            title="الرئيسية"
          >
            <Home className="w-6 h-6 text-white" />
          </motion.button>
          <span className="text-[10px] font-black mt-0.5 text-black">
            الرئيسية
          </span>
        </div>

        {/* 4. Large Prominent Admin Panel / لوحة الإدارة */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.94 }}
          id="nav-admin-btn"
          type="button"
          onClick={handleAdminClick}
          className="flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-2xl bg-stone-900 hover:bg-black text-white border border-stone-800 transition-all cursor-pointer group shadow-xs"
          title="لوحة إدارة المطعم"
        >
          <div className="relative">
            <SlidersHorizontal className="w-4.5 h-4.5 text-amber-400 group-hover:text-amber-300 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />
          </div>
          <span className="text-[10px] font-black mt-0.5 text-amber-400 group-hover:text-amber-300">
            لوحة الإدارة
          </span>
        </motion.button>

        {/* 5. Direct WhatsApp / تواصل واتساب */}
        <motion.a
          whileTap={{ scale: 0.94 }}
          id="nav-whatsapp-btn"
          href="https://wa.me/201097828052"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => playReelSound()}
          className="flex-1 flex flex-col items-center justify-center py-1 text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer group"
          title="طلب واتساب فوري"
        >
          <MessageCircle className="w-5 h-5 text-emerald-600 group-hover:text-emerald-700 transition-transform" />
          <span className="text-[10px] font-black mt-0.5 text-emerald-600 group-hover:text-emerald-700">
            واتساب
          </span>
        </motion.a>
      </motion.nav>
    </div>

  );
};
