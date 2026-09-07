import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown, Flame, Waves, Sparkles } from 'lucide-react';
import { sultanChefLogoImg } from '../data/dishes';
import { BranchType } from '../types';

interface HeroProps {
  onSelectBranch: (branch: BranchType) => void;
  onExploreMenu: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectBranch, onExploreMenu }) => {
  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pb-16 lg:pt-10 lg:pb-20">
      {/* Dynamic Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[500px] rounded-full bg-white/80 blur-[85px] pointer-events-none"
        />

        <div
          className="absolute top-8 right-[-5%] w-[480px] h-[480px] rounded-full bg-amber-400/20 blur-[110px] pointer-events-none"
        />
        <div
          className="absolute top-20 left-[-5%] w-[450px] h-[450px] rounded-full bg-orange-400/15 blur-[100px] pointer-events-none"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Animated Central Chef Emblem with Floating Ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="flex flex-col items-center justify-center mb-5"
          >
            <motion.div
              whileHover={{ scale: 1.08, rotate: 3 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 shadow-2xl shadow-amber-950/30"
            >
              <div className="absolute inset-0 rounded-full bg-amber-400/40 blur-md animate-pulse" />
              <div className="relative w-full h-full rounded-full overflow-hidden bg-white border-2 border-[#231811]">
                <img
                  src={sultanChefLogoImg}
                  alt="شعار مطعم السلطان محمود الرسمي"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Location & Authenticity Pill */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-amber-300/90 text-amber-950 text-xs font-black shadow-xs backdrop-blur-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
              <span>مطعم السلطان محمود بديروط • الأسماك والبحريات والمشويات السورية</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/15 border border-amber-500/50 text-amber-950 text-xs font-black shadow-xs backdrop-blur-md"
            >
              <Flame className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
              <span>مشويات على الفحم حية وشاورما سورية طازجة 100%</span>
            </motion.div>
          </div>

          {/* Main Title with #111323 border */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            style={{ borderColor: '#111323' }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#231811] tracking-tight leading-tight border-b-2 pb-3"
          >
            أشهى الأصناف بأصل الطعم السوري والبحري
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm sm:text-base text-[#5c4434] mt-3 leading-relaxed max-w-xl mx-auto font-medium"
          >
            قائمة الطعام الرسمية بأسعار ديروط المعتمدة: وجبات أسماك طازجة، مشويات على الفحم، شاورما وكريب سوري، وفتيلة السلطان المميزة.
          </motion.p>

          {/* Single clean primary scroll button (Eliminating clutter) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 flex justify-center"
          >
            <button
              onClick={onExploreMenu}
              className="group flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#231811] hover:bg-[#38261b] text-amber-300 font-black text-sm shadow-xl shadow-black/20 hover:scale-105 active:scale-95 transition-all duration-300 border border-amber-500/40"
            >
              <span>استعرض قائمة الطعام</span>
              <ArrowDown className="w-4 h-4 text-amber-400 group-hover:translate-y-1 transition-transform" />
            </button>
          </motion.div>
        </div>

        {/* Dual Branch Interactive Split Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10 sm:mt-12">
          {/* Seafood Branch Card */}
          <motion.div
            whileHover={{ scale: 1.025, y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            onClick={() => {
              onSelectBranch('seafood');
              onExploreMenu();
            }}
            className="relative cursor-pointer rounded-3xl p-6 sm:p-7 bg-white/95 border-2 border-amber-400/40 hover:border-amber-600 shadow-md hover:shadow-xl group overflow-visible transition-all duration-300"
          >
            {/* White Backlight Aura behind borders */}
            <div
              className="absolute -inset-1 rounded-[32px] bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md pointer-events-none -z-10"
              style={{
                boxShadow: '0 0 30px 8px rgba(255, 255, 255, 0.95), 0 0 50px 16px rgba(255, 255, 255, 0.7)',
              }}
            />

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-amber-700 font-black">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <Waves className="w-5 h-5" />
                </div>
                <span className="text-xs font-black">فرع الأسماك والبحريات</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
                طازج يومياً
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-[#231811] group-hover:text-amber-800 transition-colors">
              قسم الأسماك والبحريات والساندوتشات
            </h2>
            <p className="text-xs sm:text-sm text-[#664f3d] mt-1.5 leading-relaxed font-medium">
              ديروط - أول منزل أبو جبل (أمام حلواني الأندلس): وجبات جمبري، فيليه مقرمش، كبدة إسكندراني، ومخ بانيه.
            </p>
          </motion.div>

          {/* Syrian Branch Card */}
          <motion.div
            whileHover={{ scale: 1.025, y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
            onClick={() => {
              onSelectBranch('syrian');
              onExploreMenu();
            }}
            className="relative cursor-pointer rounded-3xl p-6 sm:p-7 bg-white/95 border-2 border-orange-400/40 hover:border-orange-600 shadow-md hover:shadow-xl group overflow-visible transition-all duration-300"
          >
            {/* White Backlight Aura behind borders */}
            <div
              className="absolute -inset-1 rounded-[32px] bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md pointer-events-none -z-10"
              style={{
                boxShadow: '0 0 30px 8px rgba(255, 255, 255, 0.95), 0 0 50px 16px rgba(255, 255, 255, 0.7)',
              }}
            />

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-orange-700 font-black">
                <div className="p-2 rounded-xl bg-orange-100 text-orange-800">
                  <Flame className="w-5 h-5" />
                </div>
                <span className="text-xs font-black">القسم السوري الأصيل</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-black">
                مشويات وشاورما
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-[#231811] group-hover:text-orange-800 transition-colors">
              القسم السوري (مشويات، شاورما، كريب، فتيلة)
            </h2>
            <p className="text-xs sm:text-sm text-[#664f3d] mt-1.5 leading-relaxed font-medium">
              ديروط - ميدان أبو جبل: فراخ مشوية على الفحم، كفتة، كباب، شاورما عربي، كريب محمص، وبروستد مقرمش.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
