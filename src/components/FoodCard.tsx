import React, { useState } from 'react';
import { MessageCircle, ShoppingBag, Eye, Flame, Award, Clock, PlusCircle } from 'lucide-react';
import { DishItem } from '../types';
import { SteamEffect } from './SteamEffect';

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
  const [isHovered, setIsHovered] = useState(false);
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col rounded-3xl transition-all duration-300 select-none cursor-pointer"
      onClick={() => onSelectDish(dish)}
    >
      {/* Pure White Border Backlight Aura - Radiates strictly from behind the card borders */}
      <div
        className={`absolute -inset-1 sm:-inset-1.5 rounded-[30px] bg-white pointer-events-none transition-all duration-300 -z-10 ${
          isHovered
            ? 'opacity-100 scale-102 blur-md'
            : 'opacity-0 scale-95 blur-none'
        }`}
        style={{
          boxShadow: '0 0 25px 8px rgba(255, 255, 255, 0.95), 0 0 45px 15px rgba(255, 255, 255, 0.65)',
        }}
      />

      {/* Luxury Warm Card Shell */}
      <div
        className={`relative flex flex-col h-full rounded-3xl p-5 overflow-visible transition-all duration-300 border bg-white/95 backdrop-blur-md ${
          isHovered
            ? 'border-white shadow-[0_20px_45px_-10px_rgba(78,54,34,0.18)] -translate-y-2'
            : 'border-[#e4dcce] hover:border-amber-300/80 shadow-[0_10px_30px_-10px_rgba(78,54,34,0.08)]'
        }`}
      >
        {/* Top Badges (Branch, Spicy, Bestseller) */}
        <div className="flex items-center justify-between gap-2 z-20">
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-black tracking-wide border shadow-2xs ${
              isSeafood
                ? 'bg-cyan-50 text-cyan-800 border-cyan-200/80'
                : 'bg-amber-50 text-amber-800 border-amber-200/80'
            }`}
          >
            {isSeafood ? 'قسم الأسماك والبحريات' : 'الفرع السوري والمشويات'}
          </span>

          {dish.badge === 'bestseller' && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs">
              <Award className="w-3 h-3" />
              <span>{dish.badgeText || 'الأكثر طلباً'}</span>
            </span>
          )}

          {dish.badge === 'signature' && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-xs">
              <Award className="w-3 h-3" />
              <span>{dish.badgeText || 'توقيع السلطان'}</span>
            </span>
          )}

          {dish.badge === 'chef-choice' && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
              <span>{dish.badgeText || 'اختيار الشيف'}</span>
            </span>
          )}

          {dish.badge === 'hot' && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-red-50 text-red-600 border border-red-200 shadow-2xs">
              <Flame className="w-3 h-3" />
              <span>{dish.badgeText || 'حار جداً'}</span>
            </span>
          )}

          {dish.badge === 'new' && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
              {dish.badgeText || 'جديد ومميز'}
            </span>
          )}
        </div>

        {/* Food Visual Stage with White Silhouette Backlight Glow */}
        <div className="food-popout-stage relative w-full h-52 sm:h-56 flex items-center justify-center my-2 z-20">
          {/* Intense Pure White Silhouette Backlight Aura Behind the Food - NOT on it */}
          <div className="white-backlight-aura" />

          {/* Grounding Shadow below plate */}
          <div
            className={`absolute bottom-3 w-40 h-7 rounded-full bg-[#5c4027]/25 blur-md pointer-events-none transition-all duration-300 ${
              isHovered ? 'scale-90 opacity-40' : 'scale-100 opacity-60'
            }`}
            style={{ zIndex: 2 }}
          />

          {/* High-Quality Rising Steam Effect */}
          {dish.hasSteam && (
            <div className="z-10 pointer-events-none">
              <SteamEffect intensity="medium" tint={isSeafood ? 'cool' : 'warm'} className="bottom-6" />
            </div>
          )}

          {/* Food Image with Pop-out & White Edge Contour Backlight */}
          <div className="food-image-popout relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
            <img
              src={dish.image}
              alt={dish.name}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-2xl transition-all duration-300"
            />
          </div>

          {/* Quick View Floating Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectDish(dish);
            }}
            className={`absolute bottom-2 left-2 px-2.5 py-1.5 rounded-xl backdrop-blur-md border border-amber-400/60 text-[#241a12] shadow-md transition-all duration-300 z-30 flex items-center gap-1.5 font-bold text-xs cursor-pointer ${
              isHovered
                ? 'opacity-100 scale-100 bg-amber-400 text-stone-950 shadow-amber-500/30'
                : 'opacity-90 scale-95 bg-white/95 text-stone-800'
            } hover:bg-amber-400 hover:text-stone-950 active:scale-95`}
            title="معاينة تفاصيل ومكونات الطبق"
          >
            <Eye className="w-3.5 h-3.5 text-amber-800" />
            <span>تفاصيل</span>
          </button>
        </div>

        {/* Content Details */}
        <div className="flex flex-col flex-1 z-20 mt-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base sm:text-lg font-black text-[#231811] tracking-wide hover:text-amber-700 transition-colors line-clamp-1">
              {dish.name}
            </h3>
          </div>

          <p className="text-xs text-[#66503e] mt-1 line-clamp-2 leading-relaxed min-h-[36px] font-medium">
            {dish.description}
          </p>

          {/* Size / Portion Selector with clear badges if dish has sizes */}
          {dish.sizes && dish.sizes.length > 0 && (
            <div className="mt-3 pt-2 border-t border-[#ede4d7]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-amber-900 font-bold">
                  الأحجام والأوزان:
                </span>
                <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                  اختر الحجم
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {dish.sizes.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSizeIndex(idx);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all cursor-pointer flex items-center gap-1 ${
                      selectedSizeIndex === idx
                        ? 'bg-amber-600 text-white shadow-xs ring-1 ring-amber-700'
                        : 'bg-[#f4efe7] hover:bg-[#ede5d8] text-[#4a3729] border border-[#ddcfbd]'
                    }`}
                  >
                    <span>{s.name}</span>
                    <span className="opacity-90 font-mono">({s.price} ج.م)</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Additions Indicator if Extras are Available */}
          {dish.availableExtras && dish.availableExtras.length > 0 && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onSelectDish(dish);
              }}
              className="flex items-center justify-between text-[11px] font-bold text-amber-950 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-200/90 rounded-xl px-2.5 py-1.5 mt-2.5 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1 text-amber-800">
                <PlusCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>إضافات وصوصات متوفرة</span>
              </span>
              <span className="text-amber-700 underline font-black">
                تخصيص +
              </span>
            </div>
          )}

          {/* Prep time & Calories Pill */}
          <div className="flex items-center gap-3 text-xs text-[#735c4b] mt-2.5 pt-2 border-t border-[#ede4d7]">
            {dish.prepTimeMinutes && (
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                {dish.prepTimeMinutes} دقيقة تحضير
              </span>
            )}
            {dish.calories && <span className="font-medium">{dish.calories} سعرة</span>}
          </div>

          {/* Pricing & Interactive Actions */}
          <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-[#ede4d7]">
            {/* Price display */}
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-amber-700 font-mono">
                  {activePrice}
                </span>
                <span className="text-xs font-bold text-amber-800">
                  ج.م
                </span>
                {dish.originalPrice && selectedSizeIndex === 0 && (
                  <span className="text-xs text-stone-400 line-through mr-1 font-semibold">
                    {dish.originalPrice} ج.م
                  </span>
                )}
              </div>
            </div>

            {/* Buttons Group */}
            <div className="flex items-center gap-2">
              {/* Direct WhatsApp Order */}
              <button
                id={`btn-wa-${dish.id}`}
                type="button"
                onClick={handleWhatsAppWithSelectedSize}
                className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-300 transition-all duration-200 active:scale-95 shadow-2xs cursor-pointer"
                title="طلب فوري عبر واتساب"
              >
                <MessageCircle className="w-4 h-4" />
              </button>

              {/* Add to Cart with feedback animation */}
              <button
                id={`btn-cart-${dish.id}`}
                type="button"
                onClick={handleAddWithSelectedSize}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-black transition-all duration-200 active:scale-95 shadow-sm cursor-pointer ${
                  isAddedAnim
                    ? 'bg-emerald-600 text-white scale-105'
                    : 'bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-white" />
                <span>{isAddedAnim ? 'تمت الإضافة ✓' : 'أضف للسلة'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
