import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, MessageCircle, Phone, ShoppingBag, Sparkles, CheckCircle, ChefHat, Info } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem } from '../types';
import { RESTAURANT_INFO } from '../data/dishes';
import { HighConcurrencyOrderEngine } from '../utils/orderEngine';
import { playCelebrationChime } from '../utils/audio';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (dishId: string, delta: number) => void;
  onRemoveItem: (dishId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isOrdered, setIsOrdered] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 15 : 0;
  const total = subtotal + deliveryFee;

  const handleSendOrderWhatsApp = () => {
    if (items.length === 0) return;

    // Strict validation for Name and Delivery Address
    if (!customerName.trim()) {
      setFormError('يرجى إدخال اسمك الكريم لتأكيد الحجز');
      const input = document.getElementById('customer-name-input');
      if (input) input.focus();
      return;
    }

    if (!customerAddress.trim()) {
      setFormError('يرجى إدخال مكان التوصيل والعنوان بالتفصيل');
      const input = document.getElementById('customer-address-input');
      if (input) input.focus();
      return;
    }

    // Clear error
    setFormError(null);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    // Process via High-Concurrency 0ms Engine (handles 2000+ simultaneous orders)
    const { receipt, whatsappUrl } = HighConcurrencyOrderEngine.processOrder({
      items,
      subtotal,
      deliveryFee,
      total,
      customerName,
      customerPhone,
      customerAddress,
      orderNotes,
    });

    setConfirmedOrderId(receipt.orderId);
    setIsOrdered(true);
    playCelebrationChime();

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setIsOrdered(false);
      setConfirmedOrderId(null);
      onClearCart();
      onClose();
    }, 900);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
        {/* Backdrop click to dismiss */}
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="relative w-full max-w-md h-full bg-[#120e0b] border-l border-[#2e2217] flex flex-col shadow-2xl z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#2e2217] flex items-center justify-between bg-[#18120d]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-rose-400" />
              <h2 className="text-lg font-black text-white">سلة الطلبات</h2>
              <span className="px-2 py-0.5 rounded-full bg-rose-950/60 text-rose-200 border border-rose-800/50 text-xs font-bold">
                {items.length} أصناف
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>


          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10 text-slate-500">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-base font-bold text-white">سلتك فارغة حالياً</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  اختر أطباقك المفضلة من فرع الأسماك أو الفرع السوري واستمتع بأقوى طعم.
                </p>
                <button
                  onClick={onClose}
                  className="mt-5 px-5 py-2.5 rounded-xl bg-[#7a172b] hover:bg-[#641220] text-white text-xs font-bold transition-all"
                >
                  تصفح المنيو الآن
                </button>
              </div>
            ) : (
              items.map((item) => {
                return (
                  <div
                    key={item.dish.id}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                  >
                    {/* Dish Thumbnail */}
                    <img
                      src={item.dish.image}
                      alt={item.dish.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 object-cover rounded-xl border border-white/10 shrink-0"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                        {item.dish.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-rose-400 font-black">
                          {item.dish.price * item.quantity} ج.م
                        </span>
                      </div>
                      {item.notes && (
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          ملاحظة: {item.notes}
                        </p>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-xl border border-white/10 shrink-0">
                      <button
                        onClick={() => onUpdateQuantity(item.dish.id, -1)}
                        className="p-1 rounded-lg text-slate-400 hover:text-white"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.dish.id, 1)}
                        className="p-1 rounded-lg text-slate-400 hover:text-white"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => onRemoveItem(item.dish.id)}
                      className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                      title="حذف من السلة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}

            {/* Quick Customer Delivery Info form */}
            {items.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10 space-y-3 bg-black/40 p-3.5 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <span>بيانات التوصيل والتأكيد:</span>
                    <span className="text-[10px] text-rose-400 font-normal">(مطلوبة لإرسال الطلب)</span>
                  </span>
                </div>

                {/* Validation Error Banner */}
                {formError && (
                  <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/50 text-rose-300 text-xs font-bold flex items-center gap-2 animate-pulse">
                    <Info className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{formError}</span>
                  </div>
                )}

                <div>
                  <label htmlFor="customer-name-input" className="block text-[11px] font-bold text-slate-300 mb-1">
                    الاسم بالكامل <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="customer-name-input"
                    type="text"
                    required
                    placeholder="مثال: محمد أحمد"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl bg-white/5 border text-xs text-white placeholder:text-slate-500 focus:outline-none transition-all ${
                      !customerName.trim() && formError
                        ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-950/20'
                        : 'border-white/10 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30'
                    }`}
                  />
                </div>

                <div>
                  <label htmlFor="customer-phone-input" className="block text-[11px] font-bold text-slate-300 mb-1">
                    رقم الهاتف للتواصل
                  </label>
                  <input
                    id="customer-phone-input"
                    type="tel"
                    placeholder="مثال: 01012345678 (للتواصل مع المندوب)"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="customer-address-input" className="block text-[11px] font-bold text-slate-300 mb-1">
                    مكان التوصيل والعنوان بالتفصيل <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="customer-address-input"
                    type="text"
                    required
                    placeholder="مثال: ديروط - شارع البحر - بجوار البنك الأهلي - عمارة 4"
                    value={customerAddress}
                    onChange={(e) => {
                      setCustomerAddress(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl bg-white/5 border text-xs text-white placeholder:text-slate-500 focus:outline-none transition-all ${
                      !customerAddress.trim() && formError
                        ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-950/20'
                        : 'border-white/10 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30'
                    }`}
                  />
                </div>

                <div>
                  <label htmlFor="customer-notes-input" className="block text-[11px] font-bold text-slate-300 mb-1">
                    ملاحظات إضافية على الطلب
                  </label>
                  <input
                    id="customer-notes-input"
                    type="text"
                    placeholder="مثال: زيادة تومية، طحينة، بدون بصل، الخ..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-all"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer Summary & Order CTA */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0e1522] space-y-3">
              {/* Cost calculation */}
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>المجموع الفرعي:</span>
                  <span className="font-bold text-white">{subtotal} ج.م</span>
                </div>
                <div className="flex justify-between">
                  <span>خدمة التوصيل:</span>
                  <span className="font-bold text-white">15 ج.م</span>
                </div>
                <div className="flex justify-between text-base font-black text-rose-400 pt-2 border-t border-white/10">
                  <span>الإجمالي الكلي:</span>
                  <span>{total} ج.م</span>
                </div>
              </div>

              {/* Instant WhatsApp Order CTA */}
              <button
                id="cart-submit-wa"
                onClick={handleSendOrderWhatsApp}
                disabled={isOrdered}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/50 active:scale-95 transition-all"
              >
                {isOrdered ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-white animate-bounce" />
                    <span>تم توثيق الطلب #{confirmedOrderId} وجاري التحويل...</span>
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5" />
                    <span>إرسال الطلب فوراً عبر واتساب ({total} ج.م)</span>
                  </>
                )}
              </button>

              {/* Direct phone call alternative */}
              <div className="text-center pt-1">
                <a
                  href={RESTAURANT_INFO.callLink}
                  className="text-xs text-slate-400 hover:text-rose-300 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3 h-3 text-rose-400" />
                  <span>أو اطلب هاتفياً مباشرة: {RESTAURANT_INFO.phone}</span>
                </a>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
