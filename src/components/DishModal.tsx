import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageCircle, ShoppingBag, Plus, Minus, Flame, CheckCircle, Clock, Sparkles, Check } from 'lucide-react';
import { DishItem, ExtraOption } from '../types';
import { SteamEffect } from './SteamEffect';

interface DishModalProps {
  dish: DishItem | null;
  onClose: () => void;
  onAddToCart: (dish: DishItem, quantity: number, notes: string) => void;
  onDirectWhatsApp: (dish: DishItem, quantity: number, notes: string) => void;
}

export const DishModal: React.FC<DishModalProps> = ({
  dish,
  onClose,
  onAddToCart,
  onDirectWhatsApp,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [selectedExtraIds, setSelectedExtraIds] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Reset state whenever a new dish is opened
  useEffect(() => {
    if (dish) {
      setQuantity(1);
      setSelectedSizeIndex(0);
      setSelectedExtraIds([]);
      setNotes('');
      setAddedSuccess(false);
    }
  }, [dish?.id]);

  const isSeafood = dish ? dish.branch === 'seafood' : false;

  const currentUnitPrice = dish
    ? dish.sizes && dish.sizes.length > 0
      ? dish.sizes[selectedSizeIndex]?.price ?? dish.price
      : dish.price
    : 0;

  const currentSizeName = dish
    ? dish.sizes && dish.sizes.length > 0
      ? dish.sizes[selectedSizeIndex]?.name ?? ''
      : ''
    : '';

  // Calculate sum of chosen extras
  const availableExtras: ExtraOption[] = dish?.availableExtras || [];
  const selectedExtras = availableExtras.filter((e) => selectedExtraIds.includes(e.id));
  const extrasUnitPrice = selectedExtras.reduce((sum, e) => sum + e.price, 0);

  const totalItemUnitPrice = currentUnitPrice + extrasUnitPrice;
  const grandTotal = totalItemUnitPrice * quantity;

  const toggleExtra = (extraId: string) => {
    setSelectedExtraIds((prev) =>
      prev.includes(extraId) ? prev.filter((id) => id !== extraId) : [...prev, extraId]
    );
  };

  const getPackagedDish = (): DishItem | null => {
    if (!dish) return null;

    let formattedName = dish.name;
    if (currentSizeName) {
      formattedName += ` (${currentSizeName})`;
    }
    if (selectedExtras.length > 0) {
      const extrasStr = selectedExtras.map((e) => `+ ${e.name}`).join('، ');
      formattedName += ` [إضافات: ${extrasStr}]`;
    }

    return {
      ...dish,
      price: totalItemUnitPrice,
      name: formattedName,
      selectedExtras,
    };
  };

  const handleAdd = () => {
    const pkg = getPackagedDish();
    if (!pkg) return;
    onAddToCart(pkg, quantity, notes);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 700);
  };

  const handleWhatsApp = () => {
    const pkg = getPackagedDish();
    if (!pkg) return;
    onDirectWhatsApp(pkg, quantity, notes);
  };

  return (
    <AnimatePresence>
      {dish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
          {/* Overlay dismiss */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 cursor-pointer"
            onClick={onClose}
          />

          <motion.div
            key={dish.id}
            initial={{ opacity: 0, scale: 0.9, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 25 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative w-full max-w-lg rounded-3xl border border-rose-900/40 overflow-hidden z-10 shadow-2xl bg-gradient-to-b from-[#180d11] via-[#12080b] to-[#0a0406]"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 z-40 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition-transform active:scale-90 cursor-pointer shadow-lg"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Top Dish Visual Stage */}
            <div className={`relative w-full h-64 sm:h-72 flex items-center justify-center overflow-hidden border-b border-white/10 ${
              isSeafood
                ? 'bg-radial from-[#072448] via-[#051a36] to-[#020e1e]'
                : 'bg-radial from-[#2a0e16] via-[#17080d] to-[#0d0407]'
            }`}>
              {/* White & Ambient Luminous Halo Light Radiating strictly behind plate */}
              <div
                className="absolute inset-0 pointer-events-none opacity-80 blur-3xl"
                style={{
                  background: isSeafood
                    ? 'radial-gradient(circle, rgba(255, 255, 255, 0.45) 0%, rgba(14, 165, 233, 0.35) 40%, transparent 80%)'
                    : 'radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(159, 18, 57, 0.35) 40%, transparent 80%)',
                }}
              />

              {/* Pedestal Base Ring */}
              <div className={`absolute bottom-6 w-56 h-12 rounded-full blur-md ${
                isSeafood
                  ? 'bg-gradient-to-r from-transparent via-sky-400/30 to-transparent'
                  : 'bg-gradient-to-r from-transparent via-[#881337]/25 to-transparent'
              }`} />

              {/* Rising Steam Effect */}
              {dish.hasSteam && (
                <div className="z-30 pointer-events-none">
                  <SteamEffect
                    intensity="high"
                    tint={isSeafood ? 'cool' : 'warm'}
                    className="bottom-12"
                  />
                </div>
              )}

              {/* Dish Image with floating breathing animation */}
              <motion.div
                animate={{
                  y: [0, -6, 0],
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative z-20 w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center"
              >
                <img
                  src={dish.image}
                  alt={dish.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain rounded-2xl drop-shadow-[0_15px_25px_rgba(0,0,0,0.85)] filter brightness-105"
                />
              </motion.div>

              {/* Top Branch Badge */}
              <div className="absolute top-4 right-4 z-30">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black border backdrop-blur-md shadow-md ${
                    isSeafood
                      ? 'bg-sky-950/90 text-sky-200 border-sky-500/50'
                      : 'bg-[#4c0519]/90 text-rose-200 border-rose-500/50'
                  }`}
                >
                  {isSeafood ? 'منيو الأسماك والبحريات' : 'الفرع السوري والمشويات'}
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 sm:p-6 max-h-[60vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {dish.name}
                  </h2>
                  <p className={`text-xs font-bold tracking-wide mt-0.5 ${isSeafood ? 'text-sky-300' : 'text-rose-300'}`}>
                    {dish.badgeText || (dish.branch === 'seafood' ? 'طازج من البحر يومياً' : 'مأكولات ومشويات سورية أصيلة')}
                  </p>
                </div>

                {/* Price */}
                <div className="text-left shrink-0">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">
                      {grandTotal}
                    </span>
                    <span className="text-xs font-bold text-rose-300/80">ج.م</span>
                  </div>
                  {quantity > 1 && (
                    <p className="text-[11px] text-slate-400 font-mono">
                      ({totalItemUnitPrice} ج.م للوجبة)
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2.5 font-medium">
                {dish.description}
              </p>

              {/* Sizes / Portions Picker */}
              {dish.sizes && dish.sizes.length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/10">
                  <span className="text-xs font-bold text-slate-200 block mb-2">
                    اختر الحجم أو الوزن المطلوب:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {dish.sizes.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedSizeIndex(idx)}
                        className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                          selectedSizeIndex === idx
                            ? 'bg-[#881337] text-white shadow-md shadow-rose-950/40 ring-2 ring-white'
                            : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                        }`}
                      >
                        <span>{s.name}</span>
                        <span className="text-xs font-black">{s.price} ج.م</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Extras Customization (الاضافات) */}
              {availableExtras.length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-rose-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                      <span>الإضافات والصوصات والمشروبات (اختياري):</span>
                    </span>
                    {selectedExtraIds.length > 0 && (
                      <span className="text-[11px] font-mono text-rose-300 font-bold">
                        +{extrasUnitPrice} ج.م إضافات
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {availableExtras.map((extra) => {
                      const isSelected = selectedExtraIds.includes(extra.id);
                      return (
                        <button
                          key={extra.id}
                          type="button"
                          onClick={() => toggleExtra(extra.id)}
                          className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-right border ${
                            isSelected
                              ? 'bg-rose-900/30 border-rose-500 text-white shadow-xs'
                              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                                isSelected
                                  ? 'bg-rose-600 border-rose-500 text-white'
                                  : 'border-white/30 bg-black/40'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="text-xs font-medium">{extra.name}</span>
                          </div>
                          <span className="text-rose-300 font-mono font-black text-xs mr-2">
                            +{extra.price} ج.م
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Ingredients & Secret Recipe details */}
              {dish.ingredients && dish.ingredients.length > 0 && (
                <div className="mt-3.5 pt-3 border-t border-white/10">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                    <span>المكونات وتتبيلة مطعم السلطان محمود:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {dish.ingredients.map((ing, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-lg text-xs bg-white/5 border border-white/10 text-slate-300 font-medium"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Special Specs */}
              <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-white/10 text-center">
                <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-slate-400 block">وقت التحضير</span>
                  <span className="text-xs font-bold text-white flex items-center justify-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-rose-300" />
                    {dish.prepTimeMinutes || 15} دقيقة
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-slate-400 block">السعرات</span>
                  <span className="text-xs font-bold text-white block mt-0.5">
                    {dish.calories || 450} سعرة
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-slate-400 block">الحرارة</span>
                  <span className="text-xs font-bold text-white flex items-center justify-center gap-1 mt-0.5">
                    <Flame className="w-3 h-3 text-red-400" />
                    {dish.spicyLevel === 0 ? 'بارد' : dish.spicyLevel === 1 ? 'معتدل' : 'حار'}
                  </span>
                </div>
              </div>

              {/* Special Instructions Note */}
              <div className="mt-3.5">
                <label className="text-xs text-slate-400 block mb-1">
                  ملاحظات خاصة للطلب (اختياري - مثلاً: بدون بصل، خبز محمص إضافي):
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="أضف ملاحظتك للمطعم هنا..."
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-400 transition-colors"
                />
              </div>

              {/* Counter and Order CTA */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 mt-5 pt-3 border-t border-white/10">
                {/* Quantity Counter */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-3 px-3 py-1.5 rounded-2xl bg-white/5 border border-white/15">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white active:scale-90 transition-all cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-6 text-center text-sm font-black text-white font-mono">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white active:scale-90 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={addedSuccess}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm text-white shadow-md active:scale-95 transition-all cursor-pointer ${
                    addedSuccess
                      ? 'bg-emerald-600'
                      : isSeafood
                      ? 'bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 shadow-sky-950/40'
                      : 'bg-gradient-to-r from-[#4c0519] to-[#881337] hover:from-[#5c0720] hover:to-[#9f1239]'
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>تمت الإضافة إلى السلة</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>إضافة للسلة ({grandTotal} ج.م)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
