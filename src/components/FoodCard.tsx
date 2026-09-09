import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageCircle, Flame, Award, Plus, Sparkles } from 'lucide-react';
import { DishItem } from '../types';
import { playReelSound } from '../utils/audio';

interface FoodCardProps {
  dish: DishItem;
  onAddToCart: (dish: DishItem) => void;
  onSelectDish: (dish: DishItem) => void;
  onOrderWhatsApp: (dish: DishItem) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  dish,
  onAddToCart,
  onSelectDish,
  onOrderWhatsApp,
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

  const handleWhatsAppWithSelectedSize = (e: React.MouseEvent) => {
    e.stopPropagation();
    playReelSound();
    if (dish.sizes && dish.sizes.length > 0) {
      const chosenSize = dish.sizes[selectedSizeIndex];
      onOrderWhatsApp({
        ...dish,
        price: chosenSize.price,
        name: `${dish.name} (${chosenSize.name})`,
      });
    } else {
      onOrderWhatsApp(dish);
    }
  };

  return (
    <div
      id={`card-${dish.id}`}
      className="mobile-optimized-card group relative flex flex-col rounded-3xl select-none cursor-pointer transform-gpu transition-transform active:scale-[0.98]"
      onClick={() => onSelectDish(dish)}
    >
      {/* Luxury Clean Card Shell */}
      <div className="relative flex flex-col h-full rounded-3xl p-3 sm:p-3.5 border border-black/[0.08] hover:border-black/20 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-all duration-200">
        {/* Top Badges if any */}
        {dish.badge && (
          <div className="flex items-center justify-end z-10 mb-1">
            {dish.badge === 'bestseller' && (
              <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500 text-white shadow-2xs">
                <Award className="w-2.5 h-2.5" />
                <span>{dish.badgeText || 'الأكثر طلباً'}</span>
              </span>
            )}

            {dish.badge === 'signature' && (
              <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-black bg-black text-white shadow-2xs">
                <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                <span>{dish.badgeText || 'توقيع السلطان'}</span>
              </span>
            )}

            {dish.badge === 'hot' && (
              <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-black bg-red-50 text-red-600 border border-red-200">
                <Flame className="w-2.5 h-2.5" />
                <span>{dish.badgeText || 'حار'}</span>
              </span>
            )}
          </div>
        )}

        {/* Circular / Rounded Plate Stage with Lightweight Popout */}
        <div className="food-popout-stage relative w-full h-32 sm:h-38 flex items-center justify-center my-1 z-10">
          {/* Circular textured dark plate container */}
          <div className="absolute w-26 h-26 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-[#1b140f] to-[#302219] border border-stone-200/50 shadow-inner group-hover:scale-102 transition-transform duration-200" />

          {/* Food Image: Hardware-accelerated with zero JS animation overhead */}
          <div className="food-image-popout relative w-28 h-28 sm:w-34 sm:h-34 flex items-center justify-center pointer-events-none transform-gpu">
            <img
              src={dish.image}
              alt={dish.name}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Content Details */}
        <div className="flex flex-col flex-1 z-10 mt-1">
          <h3 className="text-xs sm:text-sm font-black text-stone-900 tracking-tight hover:text-[#881a20] transition-colors line-clamp-1">
            {dish.name}
          </h3>

          <p className="text-[10px] sm:text-[11px] text-stone-500 mt-0.5 line-clamp-1 leading-snug font-medium">
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
                      ? 'bg-black text-white'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {s.name} ({s.price} ج.م)
                </button>
              ))}
            </div>
          )}

          {/* Pricing & Pill Add Button */}
          <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-stone-100 gap-1.5">
            {/* Direct WhatsApp Quick Order */}
            <button
              id={`btn-wa-${dish.id}`}
              type="button"
              onClick={handleWhatsAppWithSelectedSize}
              className="p-1.5 rounded-full bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 transition-colors cursor-pointer shrink-0 active:scale-90"
              title="طلب عبر واتساب"
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </button>

            {/* Pill Price Button */}
            <button
              id={`btn-cart-${dish.id}`}
              type="button"
              onClick={handleAddWithSelectedSize}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-full text-xs font-black transition-all shadow-xs cursor-pointer select-none active:scale-95 ${
                isAddedAnim
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-900 hover:bg-black text-white'
              }`}
            >
              <div className="w-3.5 h-3.5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Plus className="w-2.5 h-2.5 text-white" />
              </div>
              <span className="font-mono text-[11px] font-black">
                {isAddedAnim ? 'تمت الإضافة ✓' : `${activePrice} ج.م`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
