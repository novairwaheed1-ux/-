import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Award, Plus, Sparkles, Check, HeartPulse, Zap, Info } from 'lucide-react';
import { DishItem } from '../types';
import { playReelSound } from '../utils/audio';
import { animateAddToCart } from '../utils/cartAnimation';

interface FoodCardProps {
  dish: DishItem;
  onAddToCart: (dish: DishItem) => void;
  onSelectDish: (dish: DishItem) => void;
  onOrderWhatsApp?: (dish: DishItem) => void;
}

export const FoodCard: React.FC<FoodCardProps> = React.memo(({
  dish,
  onAddToCart,
  onSelectDish,
}) => {
  const [isAddedAnim, setIsAddedAnim] = useState(false);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);

  // 1. Mouse Parallax Dynamic Drop Shadow State
  const [mouseShadow, setMouseShadow] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // 2. Long-Press Nutrition Tooltip State
  const [showNutritionTooltip, setShowNutritionTooltip] = useState(false);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPressActiveRef = useRef(false);

  const activePrice =
    dish.sizes && dish.sizes.length > 0
      ? dish.sizes[selectedSizeIndex].price
      : dish.price;

  const isSeafood = dish.branch === 'seafood';

  // Mouse Parallax Calculation on MouseMove
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Relative offset from -1 to 1
    const offsetX = (e.clientX - centerX) / (rect.width / 2);
    const offsetY = (e.clientY - centerY) / (rect.height / 2);

    // Opposing shadow motion: if cursor goes left (-), shadow casts slightly right (+)
    const shadowX = Math.round(-offsetX * 14);
    const shadowY = Math.round(-offsetY * 14 + 10);

    setMouseShadow({ x: shadowX, y: shadowY });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setMouseShadow({ x: 0, y: 0 });
    // Cancel long press if mouse leaves
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    setShowNutritionTooltip(false);
  }, []);

  // Long-press detection on Dish Image
  const startLongPress = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    isLongPressActiveRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      isLongPressActiveRef.current = true;
      setShowNutritionTooltip(true);
      playReelSound();
    }, 450); // 450ms hold to trigger tooltip
  }, []);

  const clearLongPress = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const handleDishStageClick = useCallback((e: React.MouseEvent) => {
    if (isLongPressActiveRef.current) {
      e.stopPropagation();
      isLongPressActiveRef.current = false;
      return;
    }
    if (showNutritionTooltip) {
      e.stopPropagation();
      setShowNutritionTooltip(false);
    }
  }, [showNutritionTooltip]);

  // Package dish with currently chosen size when added to cart
  const handleAddWithSelectedSize = (e: React.MouseEvent) => {
    e.stopPropagation();
    playReelSound();
    setIsAddedAnim(true);
    setTimeout(() => setIsAddedAnim(false), 900);

    // Trigger flying animation
    const imgElement = document.getElementById(`foodcard-img-${dish.id}`) as HTMLImageElement;
    const btnElement = document.getElementById(`btn-cart-${dish.id}`) as HTMLElement;
    if (imgElement && dish.image) {
      animateAddToCart(imgElement, dish.image, btnElement);
    }

    if (dish.sizes && dish.sizes.length > 0) {
      const chosenSize = dish.sizes[selectedSizeIndex];
      onAddToCart({
        ...dish,
        price: chosenSize.price,
        name: `${dish.name} (${chosenSize.name})`,
      });
    } else {
      onAddToCart(dish);
    }
  };

  // Compute 3D Parallax Drop Shadow
  const dynamicShadowStyle = isHovered
    ? {
        boxShadow: `${mouseShadow.x}px ${mouseShadow.y}px 24px rgba(0, 0, 0, ${isSeafood ? 0.22 : 0.18}), 0 4px 12px rgba(0, 0, 0, 0.08)`,
        transform: `translate3d(${-mouseShadow.x * 0.15}px, ${-mouseShadow.y * 0.15}px, 0)`,
        transition: 'transform 0.12s ease-out, box-shadow 0.12s ease-out',
      }
    : {
        transition: 'transform 0.25s ease-out, box-shadow 0.25s ease-out',
      };

  return (
    <div
      id={`card-${dish.id}`}
      className="mobile-optimized-card group relative flex flex-col rounded-3xl select-none cursor-pointer transform-gpu transition-transform active:scale-[0.98]"
      onClick={() => {
        if (!showNutritionTooltip) {
          onSelectDish(dish);
        }
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Luxury Clean Card Shell with Dynamic Mouse Parallax Shadow */}
      <div 
        style={dynamicShadowStyle}
        className="relative flex flex-col h-full rounded-3xl p-3 sm:p-3.5 border border-black/[0.08] dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 bg-white dark:bg-stone-900 shadow-[0_2px_8px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
      >
        {/* Top Badges if any */}
        {dish.badge && (
          <div className="flex items-center justify-end z-10 mb-1">
            {dish.badge === 'bestseller' && (
              <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-black bg-[#881337] text-white shadow-2xs">
                <Award className="w-2.5 h-2.5" />
                <span>{dish.badgeText || 'الأكثر طلباً'}</span>
              </span>
            )}

            {dish.badge === 'signature' && (
              <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-black bg-[#6b1426] dark:bg-[#9f1239] text-white shadow-2xs">
                <Sparkles className="w-2.5 h-2.5 text-rose-200" />
                <span>{dish.badgeText || 'توقيع السلطان'}</span>
              </span>
            )}

            {dish.badge === 'hot' && (
              <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-black bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50">
                <Flame className="w-2.5 h-2.5" />
                <span>{dish.badgeText || 'حار'}</span>
              </span>
            )}
          </div>
        )}

        {/* Circular / Rounded Plate Stage with Lightweight Popout & Calmed Glowing Aura */}
        <div 
          className="food-popout-stage relative w-full h-32 sm:h-38 flex items-center justify-center my-1 z-10"
          onMouseDown={startLongPress}
          onMouseUp={clearLongPress}
          onMouseLeave={clearLongPress}
          onTouchStart={startLongPress}
          onTouchEnd={clearLongPress}
          onTouchCancel={clearLongPress}
          onClick={handleDishStageClick}
        >
          {/* Animated Nutrition & Calories Long-Press Tooltip */}
          <AnimatePresence>
            {showNutritionTooltip && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: -6 }}
                exit={{ opacity: 0, scale: 0.85, y: 4 }}
                transition={{ type: 'spring', stiffness: 450, damping: 26 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNutritionTooltip(false);
                }}
                className="absolute -top-6 inset-x-1 z-30 p-2.5 rounded-2xl bg-stone-900/95 dark:bg-stone-950/95 backdrop-blur-md text-white border border-amber-500/40 shadow-[0_12px_28px_rgba(0,0,0,0.5)] flex flex-col gap-1.5 pointer-events-auto"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-1">
                  <div className="flex items-center gap-1 text-[11px] font-black text-amber-300">
                    <HeartPulse className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                    <span>القيمة الغذائية للطبق</span>
                  </div>
                  <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-stone-300 font-bold">
                    انقر للإغلاق
                  </span>
                </div>

                {/* Nutrition Grid */}
                <div className="grid grid-cols-2 gap-1.5 text-center pt-0.5">
                  <div className="bg-white/5 rounded-xl p-1 border border-white/5">
                    <span className="text-[9px] text-stone-400 block font-medium">السعرات التقريبية</span>
                    <span className="text-xs font-black text-amber-200 flex items-center justify-center gap-0.5 mt-0.5">
                      <Zap className="w-3 h-3 text-amber-400" />
                      {dish.calories || 380} ك.سعرة
                    </span>
                  </div>

                  <div className="bg-white/5 rounded-xl p-1 border border-white/5">
                    <span className="text-[9px] text-stone-400 block font-medium">الحالة والطزاجة</span>
                    <span className="text-[10px] font-black text-emerald-300 block mt-0.5">
                      {isSeafood ? 'طازج يومياً 🐟' : 'فرن حجر وشواء 🔥'}
                    </span>
                  </div>
                </div>

                {/* Ingredients snippet */}
                {dish.ingredients && dish.ingredients.length > 0 && (
                  <div className="text-[9px] text-stone-300/90 leading-tight bg-black/30 p-1 rounded-lg">
                    <span className="font-bold text-amber-300/90">المكونات: </span>
                    <span>{dish.ingredients.slice(0, 3).join(' • ')}</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Luminous Glow Halo Layer (Calmed down, no intense blast on click) */}
          <div 
            className={`dish-glow-aura absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full blur-lg pointer-events-none transition-all duration-200 ${
              isSeafood
                ? 'bg-sky-400/20 shadow-[0_0_15px_4px_rgba(56,189,248,0.18)] group-active:opacity-0 group-active:shadow-none'
                : 'bg-amber-400/20 shadow-[0_0_15px_4px_rgba(245,158,11,0.18)] group-active:opacity-0 group-active:shadow-none'
            }`}
          />

          {/* Circular textured plate with subtle illuminated rim */}
          <div 
            className={`absolute w-26 h-26 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-[#1b140f] to-[#302219] border transition-all duration-200 ease-out shadow-inner ${
              isSeafood
                ? 'border-stone-200/50 dark:border-white/10 group-hover:border-sky-400/50 group-hover:shadow-[0_0_12px_rgba(56,189,248,0.25)] group-active:shadow-none group-active:border-stone-200/30'
                : 'border-stone-200/50 dark:border-white/10 group-hover:border-amber-400/50 group-hover:shadow-[0_0_12px_rgba(245,158,11,0.25)] group-active:shadow-none group-active:border-stone-200/30'
            } group-hover:scale-95 group-active:scale-95`} 
          />

          {/* Food Image: Hardware-accelerated with subtle physical popout and periodic 5s shimmer light sweep */}
          <div className="food-image-popout relative w-28 h-28 sm:w-34 sm:h-34 flex items-center justify-center pointer-events-none transform-gpu z-10 overflow-hidden rounded-full">
            <img
              id={`foodcard-img-${dish.id}`}
              src={dish.image}
              alt={dish.name}
              width={136}
              height={136}
              loading="eager"
              decoding="sync"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-contain rounded-full transition-all duration-200 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] group-hover:scale-108 group-hover:-translate-y-1.5 group-active:scale-98 group-active:translate-y-0 ${
                isSeafood
                  ? 'group-hover:drop-shadow-[0_4px_12px_rgba(56,189,248,0.3)] group-active:drop-shadow-none'
                  : 'group-hover:drop-shadow-[0_4px_12px_rgba(245,158,11,0.3)] group-active:drop-shadow-none'
              }`}
            />

            {/* Periodic 5-Second Shimmer Light Sweep Effect */}
            <div 
              className="absolute inset-0 pointer-events-none rounded-full overflow-hidden"
              aria-hidden="true"
            >
              <div 
                className="w-[140%] h-full bg-gradient-to-r from-transparent via-white/40 dark:via-white/25 to-transparent animate-dish-shimmer"
                style={{
                  animationDelay: `${((dish.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % 10) * 0.45}s`
                }}
              />
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="flex flex-col flex-1 z-10 mt-1">
          <h3 className={`text-xs sm:text-sm font-black text-stone-900 dark:text-stone-100 tracking-tight transition-colors line-clamp-1 ${
            isSeafood ? 'hover:text-sky-600 dark:hover:text-sky-400' : 'hover:text-[#7a172b] dark:hover:text-[#fb7185]'
          }`}>
            {dish.name}
          </h3>

          <p className="text-[10px] sm:text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1 leading-snug font-medium">
            {dish.description}
          </p>

          {/* Size Pills if sizes exist */}
          {dish.sizes && dish.sizes.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {dish.sizes.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playReelSound();
                    setSelectedSizeIndex(idx);
                  }}
                  className={`px-1.5 py-0.5 rounded-md text-[9px] font-black transition-all cursor-pointer ${
                    selectedSizeIndex === idx
                      ? isSeafood
                        ? 'bg-sky-600 text-white'
                        : 'bg-[#7a172b] dark:bg-[#9f1239] text-white'
                      : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {s.name} ({s.price} ج.م)
                </button>
              ))}
            </div>
          )}

          {/* Pricing & Add to Cart Action */}
          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-stone-100 dark:border-stone-800 gap-2">
            {/* Price Display */}
            <div className="flex items-baseline gap-1 text-right">
              <span className="font-mono text-sm font-black text-stone-900 dark:text-stone-100">
                {activePrice}
              </span>
              <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400">ج.م</span>
              {dish.originalPrice && dish.originalPrice > activePrice && (
                <span className="text-[10px] text-stone-400 dark:text-stone-500 line-through mr-1 font-mono">
                  {dish.originalPrice}
                </span>
              )}
            </div>

            {/* Clean Add to Cart Pill Button */}
            <button
              id={`btn-cart-${dish.id}`}
              type="button"
              onClick={handleAddWithSelectedSize}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full text-xs font-black transition-all shadow-xs cursor-pointer select-none active:scale-95 ${
                isAddedAnim
                  ? 'bg-emerald-600 text-white'
                  : isSeafood
                  ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-sm shadow-sky-900/20'
                  : 'bg-[#7a172b] hover:bg-[#641220] dark:bg-[#9f1239] dark:hover:bg-[#881337] text-white'
              }`}
            >
              {isAddedAnim ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold">تمت الإضافة</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold">إضافة</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

