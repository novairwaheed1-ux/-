import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Fish, Flame, CheckCircle2, ChevronDown, Sparkles, ChevronLeft, Waves } from 'lucide-react';
import { DishItem, BranchType } from '../types';
import { FoodCard } from './FoodCard';
import { playReelSound } from '../utils/audio';
import { grilledShrimpImg, shawarmaWrapImg } from '../data/dishes';

interface MenuSectionProps {
  dishes: DishItem[];
  activeBranch: BranchType;
  onSelectBranch: (branch: BranchType) => void;
  onAddToCart: (dish: DishItem) => void;
  onSelectDish: (dish: DishItem) => void;
  onOrderWhatsApp: (dish: DishItem) => void;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  cartCount?: number;
  onOpenCart?: () => void;
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  onOpenFeastWheel?: () => void;
}

export const MenuSection: React.FC<MenuSectionProps> = React.memo(({
  dishes,
  activeBranch,
  onSelectBranch,
  onAddToCart,
  onSelectDish,
  onOrderWhatsApp,
  selectedCategory: externalSelectedCategory,
  onCategoryChange,
  onOpenFeastWheel,
}) => {
  const [internalCategory, setInternalCategory] = useState<string>('all');
  const currentCategory = externalSelectedCategory !== undefined ? externalSelectedCategory : internalCategory;

  const handleCategoryUpdate = (catId: string) => {
    playReelSound();
    if (onCategoryChange) {
      onCategoryChange(catId);
    } else {
      setInternalCategory(catId);
    }
  };

  const handleSelectBranchAndScroll = (branch: 'seafood' | 'syrian') => {
    playReelSound();
    onSelectBranch(branch);
    handleCategoryUpdate('all');
    // Smoothly and effortlessly scroll down to the dishes grid without touching the screen
    requestAnimationFrame(() => {
      setTimeout(() => {
        const target = document.getElementById('dishes-grid-anchor');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 40);
    });
  };

  const currentBranch: 'seafood' | 'syrian' =
    activeBranch === 'syrian' ? 'syrian' : 'seafood';

  // Sub-categories depending on branch
  const seafoodCategories = [
    { id: 'all', label: 'جميع الأصناف' },
    { id: 'meals', label: 'وجبات وبحريات' },
    { id: 'sandwiches', label: 'ساندوتشات كبدة وأسماك' },
    { id: 'casseroles', label: 'طواجن وأرز' },
    { id: 'appetizers', label: 'مقبلات وسلطات' },
  ];

  const syrianCategories = [
    { id: 'all', label: 'جميع الأصناف' },
    { id: 'grills', label: 'مشويات عالفحم' },
    { id: 'shawarma', label: 'شاورما عربي' },
    { id: 'crepes', label: 'كريب وساندوتشات' },
    { id: 'fatila', label: 'فتيلة السلطان' },
    { id: 'meals', label: 'بروستد ووجبات' },
    { id: 'sides', label: 'مقبلات وتومية' },
  ];

  const activeCategories = currentBranch === 'seafood' ? seafoodCategories : syrianCategories;

  // Ultra-fast memoized filter: 0ms overhead, perfectly scalable for 10,000+ users
  const displayedDishes = useMemo(() => {
    const inBranch = dishes.filter((d) => d.branch === currentBranch);
    if (currentCategory === 'all') return inBranch;
    return inBranch.filter((d) => d.category === currentCategory);
  }, [dishes, currentBranch, currentCategory]);

  return (
    <section id="menu-section" className="py-4 sm:py-7 relative select-none">
      <div className="max-w-4xl mx-auto px-3 sm:px-6">
        {/* Large Prominent Dual Branch Switcher Cards (قسم الأسماك وقسم السوري) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
          {/* 1. Seafood Branch Card */}
          <div
            id="tab-seafood-branch"
            onClick={() => handleSelectBranchAndScroll('seafood')}
            className={`group relative overflow-hidden rounded-3xl p-4 sm:p-5 transition-all duration-200 cursor-pointer border-2 select-none text-right flex flex-col justify-between min-h-[145px] sm:min-h-[160px] active:scale-[0.98] transform-gpu ${
              currentBranch === 'seafood'
                ? 'bg-gradient-to-l from-[#041d3b] via-[#0b3c6d] to-[#052449] border-sky-400 text-white shadow-xl shadow-sky-950/40 ring-2 ring-sky-400/50'
                : 'bg-sky-50/80 dark:bg-[#071a33] hover:bg-sky-100/90 dark:hover:bg-[#0c2a52] border-sky-300 dark:border-sky-800/80 hover:border-sky-400 dark:hover:border-sky-600 text-stone-900 dark:text-stone-100 shadow-xs'
            }`}
          >
            {/* Background Subtle Watermark Dish Image */}
            <div className="absolute left-0 top-0 bottom-0 w-36 sm:w-48 pointer-events-none overflow-hidden opacity-25 group-hover:opacity-35 transition-opacity">
              <img
                src={grilledShrimpImg}
                alt="أسماك وبحريات"
                className="w-full h-full object-cover object-center transform -scale-x-100"
                loading="eager"
              />
              <div
                className={`absolute inset-0 ${
                  currentBranch === 'seafood'
                    ? 'bg-gradient-to-r from-transparent to-[#0b3c6d]'
                    : 'bg-gradient-to-r from-transparent to-sky-50/90 dark:to-[#071a33]'
                }`}
              />
            </div>

            {/* Top Row: Icon + Status Pill */}
            <div className="relative z-10 flex items-center justify-between gap-2">
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105 shadow-xs ${
                  currentBranch === 'seafood'
                    ? 'bg-sky-500 text-white font-black shadow-md shadow-sky-950/50'
                    : 'bg-sky-200 dark:bg-sky-900/80 text-sky-800 dark:text-sky-200'
                }`}
              >
                <Fish className="w-6 h-6 sm:w-6.5 sm:h-6.5" />
              </div>

              <div className="flex items-center gap-1.5">
                {currentBranch === 'seafood' ? (
                  <span className="px-3 py-1 rounded-full bg-sky-400/25 border border-sky-300/40 text-sky-200 text-xs font-black flex items-center gap-1 shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-300" />
                    <span>المنيو المعروض حالياً</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-900/60 border border-sky-300/50 dark:border-sky-700/60 text-sky-800 dark:text-sky-200 text-xs font-bold group-hover:text-sky-900 dark:group-hover:text-white transition-colors">
                    اضغط لعرض المنيو
                  </span>
                )}
              </div>
            </div>

            {/* Middle: Titles & Details */}
            <div className="relative z-10 mt-2.5">
              <h3 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-2 flex-wrap">
                <span className={currentBranch === 'seafood' ? 'text-white drop-shadow-sm font-black' : 'text-sky-800 dark:text-sky-300 font-black'}>
                  منيو الأسماك والبحريات
                </span>
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  currentBranch === 'seafood'
                    ? 'bg-sky-400/25 text-sky-100 border border-sky-300/40'
                    : 'bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-200 border border-sky-300/40'
                }`}>
                  <Waves className="w-3 h-3 text-sky-400" />
                  <span>طازج من البحر</span>
                </span>
              </h3>
              <p
                className={`text-xs mt-1 font-medium leading-relaxed ${
                  currentBranch === 'seafood' ? 'text-sky-100' : 'text-sky-900/70 dark:text-sky-200/70'
                }`}
              >
                طواجن سي فود • جمبري جامبو • فيليه مقرمش • كبدة ومخ
              </p>
            </div>

            {/* Bottom: Direct Downward Indicator to Browse Below */}
            <div className="relative z-10 mt-3 pt-2 border-t border-sky-400/20 dark:border-sky-700/30 flex items-center justify-between text-xs">
              <span
                className={`flex items-center gap-1 text-[11px] font-black ${
                  currentBranch === 'seafood' ? 'text-sky-200' : 'text-sky-700 dark:text-sky-300'
                }`}
              >
                <span>{currentBranch === 'seafood' ? 'تصفح الأصناف والأسعار بالأسفل' : 'انقر للانتقال للمنيو والأسعار'}</span>
              </span>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:translate-y-0.5 ${
                  currentBranch === 'seafood' ? 'bg-sky-400/30 text-sky-200' : 'bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300'
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* 2. Syrian Branch Card */}
          <div
            id="tab-syrian-branch"
            onClick={() => handleSelectBranchAndScroll('syrian')}
            className={`group relative overflow-hidden rounded-3xl p-4 sm:p-5 transition-all duration-200 cursor-pointer border-2 select-none text-right flex flex-col justify-between min-h-[145px] sm:min-h-[160px] active:scale-[0.98] transform-gpu ${
              currentBranch === 'syrian'
                ? 'bg-gradient-to-l from-[#4c0519] via-[#6b1426] to-[#400313] border-rose-400 text-white shadow-md shadow-rose-950/20 ring-2 ring-rose-400/30'
                : 'bg-white dark:bg-stone-900 hover:bg-rose-50/40 dark:hover:bg-rose-950/30 border-stone-200 dark:border-stone-800 hover:border-rose-300 dark:hover:border-rose-700/60 text-stone-900 dark:text-stone-100 shadow-xs'
            }`}
          >
            {/* Background Subtle Watermark Dish Image */}
            <div className="absolute left-0 top-0 bottom-0 w-36 sm:w-48 pointer-events-none overflow-hidden opacity-25 group-hover:opacity-35 transition-opacity">
              <img
                src={shawarmaWrapImg}
                alt="مشويات وسوري"
                className="w-full h-full object-cover object-center transform -scale-x-100"
                loading="eager"
              />
              <div
                className={`absolute inset-0 ${
                  currentBranch === 'syrian'
                    ? 'bg-gradient-to-r from-transparent to-[#6b1426]'
                    : 'bg-gradient-to-r from-transparent to-white dark:to-stone-900'
                }`}
              />
            </div>

            {/* Top Row: Icon + Status Pill */}
            <div className="relative z-10 flex items-center justify-between gap-2">
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105 shadow-xs ${
                  currentBranch === 'syrian'
                    ? 'bg-rose-500 text-white font-black'
                    : 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300'
                }`}
              >
                <Flame className="w-6 h-6 sm:w-6.5 sm:h-6.5" />
              </div>

              <div className="flex items-center gap-1.5">
                {currentBranch === 'syrian' ? (
                  <span className="px-3 py-1 rounded-full bg-rose-400/25 border border-rose-300/40 text-rose-200 text-xs font-black flex items-center gap-1 shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-rose-300" />
                    <span>المنيو المعروض حالياً</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 text-xs font-bold group-hover:text-rose-800 dark:group-hover:text-rose-300 group-hover:border-rose-300 dark:group-hover:border-rose-700 transition-colors">
                    اضغط لعرض المنيو
                  </span>
                )}
              </div>
            </div>

            {/* Middle: Titles & Details */}
            <div className="relative z-10 mt-2.5">
              <h3 className="text-lg sm:text-xl font-black tracking-tight">
                منيو وأسعار القسم السوري والمشويات
              </h3>
              <p
                className={`text-xs mt-1 font-medium leading-relaxed ${
                  currentBranch === 'syrian' ? 'text-rose-100/90' : 'text-stone-500 dark:text-stone-400'
                }`}
              >
                مشويات عالفحم • شاورما عربي • كريب وساندوتشات • بروستد
              </p>
            </div>

            {/* Bottom: Direct Downward Indicator to Browse Below */}
            <div className="relative z-10 mt-3 pt-2 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs">
              <span
                className={`flex items-center gap-1 text-[11px] font-black ${
                  currentBranch === 'syrian' ? 'text-rose-200' : 'text-stone-600 dark:text-stone-400 group-hover:text-rose-700 dark:group-hover:text-rose-300'
                }`}
              >
                <span>{currentBranch === 'syrian' ? 'تصفح الأصناف والأسعار بالأسفل' : 'انقر للانتقال للمنيو والأسعار'}</span>
              </span>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:translate-y-0.5 ${
                  currentBranch === 'syrian' ? 'bg-rose-400/30 text-rose-200' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Anchor point for automatic smooth downward scroll */}
        <div id="dishes-grid-anchor" className="scroll-mt-4" />

        {/* VIP Family Feasts & Trays Interactive Wheel Trigger Button */}
        {onOpenFeastWheel && (
          <div className="mb-4">
            <button
              type="button"
              id="btn-open-feast-wheel"
              onClick={() => {
                playReelSound();
                onOpenFeastWheel();
              }}
              className={`group w-full relative overflow-hidden rounded-2xl py-2.5 px-4 flex items-center justify-between gap-3 border-2 transition-all duration-200 active:scale-[0.99] cursor-pointer shadow-xs ${
                currentBranch === 'seafood'
                  ? 'bg-gradient-to-r from-[#2c0510] via-[#480a1c] to-[#20030b] border-rose-500/50 text-white hover:border-rose-400'
                  : 'bg-gradient-to-r from-[#380914] via-[#520d1c] to-[#2e050f] border-rose-500/50 text-white hover:border-rose-400'
              }`}
            >
              {/* Right Side in RTL: Title "منيو العائلات" */}
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs bg-[#881337] text-white font-black"
                >
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black tracking-tight">
                    منيو العائلات
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white/15 text-rose-200 border border-white/20">
                    عرض تفاعلي
                  </span>
                </div>
              </div>

              {/* Left Side: Arrow */}
              <div className="flex items-center gap-1 text-xs font-bold text-stone-300 group-hover:text-white transition-colors">
                <span>تصفح</span>
                <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </div>
            </button>
          </div>
        )}

        {/* Sub-category Filter Pills with Fluid Native Momentum Scrolling */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar justify-start sm:justify-center scroll-smooth overscroll-x-contain">
          {activeCategories.map((cat) => {
            const isCatActive = currentCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryUpdate(cat.id)}
                className={`relative whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-black transition-colors cursor-pointer select-none shrink-0 ${
                  isCatActive
                    ? 'text-white'
                    : 'text-stone-800 dark:text-stone-300 hover:text-black dark:hover:text-white bg-white dark:bg-stone-900 border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30'
                }`}
              >
                {isCatActive && (
                  <motion.div
                    layoutId="activeCategorySlider"
                    transition={{ type: 'spring', stiffness: 550, damping: 28 }}
                    className={`absolute inset-0 rounded-full shadow-xs -z-10 ${
                      currentBranch === 'seafood'
                        ? 'bg-sky-600 shadow-sky-900/30'
                        : 'bg-[#7a172b] dark:bg-[#9f1239]'
                    }`}
                  />
                )}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Section Header: Category Title on Right, "عرض كافة الأصناف" on Left */}
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${currentBranch === 'seafood' ? 'bg-sky-500 shadow-xs shadow-sky-400' : 'bg-[#7a172b] dark:bg-[#fb7185]'}`} />
            <h2 className="text-sm sm:text-base font-black text-stone-900 dark:text-white">
              {currentBranch === 'seafood' ? (
                <span className="text-sky-600 dark:text-sky-400 text-base font-black">منيو الأسماك والبحريات</span>
              ) : (
                'مشويات وشاورما سورية'
              )}
            </h2>
          </div>

          {currentCategory !== 'all' && (
            <button
              type="button"
              onClick={() => {
                playReelSound();
                handleCategoryUpdate('all');
              }}
              className={`text-xs font-black hover:underline cursor-pointer ${
                currentBranch === 'seafood'
                  ? 'text-sky-600 dark:text-sky-400'
                  : 'text-[#7a172b] dark:text-[#fb7185]'
              }`}
            >
              عرض كافة الأصناف
            </button>
          )}
        </div>

        {/* Dishes Grid with Single Smooth Container Fade for Ultimate Performance */}
        <motion.div
          key={`${currentBranch}-${currentCategory}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5 transform-gpu"
        >
          {displayedDishes.map((dish) => (
            <FoodCard
              key={dish.id}
              dish={dish}
              onAddToCart={onAddToCart}
              onSelectDish={onSelectDish}
              onOrderWhatsApp={onOrderWhatsApp}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
});
