import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, MessageCircle, Lock, ShoppingBag } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/dishes';

interface FloatingActionsProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onOpenMenu: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  cartCount,
  onOpenCart,
  onOpenAdmin,
  onOpenMenu,
}) => {
  const [badgeBump, setBadgeBump] = useState(false);

  // Trigger bounce animation on cart icon & badge whenever cartCount changes and > 0
  useEffect(() => {
    if (cartCount > 0) {
      setBadgeBump(true);
      const timer = setTimeout(() => setBadgeBump(false), 600);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  return (
    <div className="fixed bottom-3 sm:bottom-6 inset-x-0 z-40 flex justify-center px-3 pointer-events-none">
      <motion.nav
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="pointer-events-auto flex items-center gap-2 sm:gap-3 px-3.5 py-2 sm:px-4 sm:py-2 rounded-full bg-[#1b140f]/95 text-white border border-amber-500/40 shadow-2xl backdrop-blur-xl max-w-fit"
      >
        {/* 1. Open Menu Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          id="bottom-open-menu-btn"
          onClick={onOpenMenu}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-stone-950 text-xs font-black shadow-lg cursor-pointer transition-all shrink-0"
          title="فتح قائمة الطعام الكاملة"
        >
          <BookOpen className="w-4 h-4" />
          <span>تصفح المنيو</span>
        </motion.button>

        {/* 2. Persistent Cart Button - Shows ONLY order count & animated badge */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={badgeBump ? { scale: [1, 1.2, 0.95, 1.08, 1] } : { scale: 1 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          id="bottom-cart-btn"
          onClick={onOpenCart}
          className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-all cursor-pointer shrink-0 ${
            cartCount > 0
              ? 'bg-amber-500 text-stone-950 font-black shadow-lg shadow-amber-500/40 border border-amber-400'
              : 'bg-white/5 hover:bg-white/10 text-stone-300'
          }`}
          title="عرض سلة الطلبات"
        >
          <motion.div
            animate={badgeBump ? { rotate: [0, -14, 14, -8, 0] } : { rotate: 0 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
          >
            <ShoppingBag className="w-4 h-4" />
          </motion.div>

          {/* Number of orders ONLY */}
          <span className="text-xs font-black font-mono min-w-[16px] text-center">
            {cartCount}
          </span>
        </motion.button>

        {/* 3. WhatsApp Direct */}
        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          id="bottom-wa-btn"
          href={RESTAURANT_INFO.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shrink-0"
          title="محادثة واتساب مباشرة"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="hidden sm:inline">واتساب</span>
        </motion.a>

        {/* 4. Minimalist Admin Lock Icon */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          id="bottom-admin-btn"
          onClick={onOpenAdmin}
          className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-stone-400 hover:text-amber-300 transition-colors cursor-pointer shrink-0"
          title="تسجيل دخول الإدارة ولوحة التحكم"
        >
          <Lock className="w-3.5 h-3.5" />
        </motion.button>
      </motion.nav>
    </div>
  );
};
