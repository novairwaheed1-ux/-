import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Flame, Award, Plus, Sparkles, Check } from 'lucide-react';
import { DishItem } from '../types';
import { playReelSound } from '../utils/audio';

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

  const activePrice =
    dish.sizes && dish.sizes.length > 0
      ? dish.sizes[selectedSizeIndex].price
      : dish.price;

  const isSeafood = dish.branch === 'seafood';

  // Package dish with currently chosen size when added to cart
  const handleAddWithSelectedSize = (e: React.MouseEvent) => {
    e.stopPropagation();
    playReelSound();
    setIsAddedAnim(true);
    setTimeout(() => setIsAddedAnim(false), 900);

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

  return (
    <div
      id={`card-${dish.id}`}
      className="mobile-optimized-card group relative flex flex-col rounded-3xl select-none cursor-pointer transform-gpu transition-transform active:scale-[0.98]"
      onClick={() => onSelectDish(dish)}
    >
      {/* Luxury Clean Card Shell */}
      <div className="relative flex flex-col h-full rounded-3xl p-3 sm:p-3.5 border border-black/[0.08] dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 bg-white dark:bg-stone-900 shadow-[0_2px_8px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)] transition-all duration-200">
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

        {/* Circular / Rounded Plate Stage with Lightweight Popout */}
        <div className="food-popout-stage relative w-full h-32 sm:h-38 flex items-center justify-center my-1 z-10">
          {/* Circular textured dark plate container */}
          <div className="absolute w-26 h-26 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-[#1b140f] to-[#302219] border border-stone-200/50 dark:border-white/10 shadow-inner group-hover:scale-102 transition-transform duration-200" />

          {/* Food Image: Hardware-accelerated with zero JS animation overhead */}
          <div className="food-image-popout relative w-28 h-28 sm:w-34 sm:h-34 flex items-center justify-center pointer-events-none transform-gpu">
            <img
              src={dish.image}
              alt={dish.name}
              width={136}
              height={136}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-105"
            />
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
