import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ZoomIn, ZoomOut, RotateCcw, MessageCircle, Phone, Fish, Flame, ShoppingBag, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import {
  seafoodMenuBoardImg,
  syrianMenuBoardImg,
  syrianShawarmaBroastedImg,
  sultanChefLogoImg,
  RESTAURANT_INFO,
} from '../data/dishes';
import { DishItem } from '../types';

interface MenuPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'seafood' | 'syrian';
  onAddToCart?: (dish: Partial<DishItem>) => void;
}

interface MenuBoard {
  id: string;
  title: string;
  branch: 'seafood' | 'syrian';
  image: string;
  badge: string;
  description: string;
  quickItems: { name: string; price: number }[];
}

export const MenuPhotoModal: React.FC<MenuPhotoModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'seafood',
  onAddToCart,
}) => {
  const MENU_BOARDS: MenuBoard[] = [
    {
      id: 'seafood-1',
      title: 'لوحة 1: الأسماك والبحريات والساندوتشات',
      branch: 'seafood',
      image: seafoodMenuBoardImg,
      badge: 'ديروط - أول منزل أبو جبل',
      description: 'وجبات كبدة وفيليه وجمبري وميكسات مع أرز وسلطة وعيش، وساندوتشات بحرية ومخ بانيه.',
      quickItems: [
        { name: 'وجبة جمبري مقرمش', price: 120 },
        { name: 'وجبة فيليه سمك', price: 75 },
        { name: 'وجبة كبدة إسكندراني', price: 75 },
        { name: 'وجبة ميكس جمبري وفيليه', price: 120 },
        { name: 'ساندوتش جمبري', price: 60 },
        { name: 'ساندوتش مخ بانيه', price: 60 },
        { name: 'ساندوتش كبدة', price: 25 },
        { name: 'ساندوتش فيليه', price: 35 },
      ],
    },
    {
      id: 'syrian-1',
      title: 'لوحة 2: المشويات والكريب وفتيلة السلطان',
      branch: 'syrian',
      image: syrianMenuBoardImg,
      badge: 'ديروط - ميدان أبو جبل',
      description: 'فراخ مشوية على الفحم، كفتة، كباب، طرب، كريب مقرمش، وفتيلة السلطان المميزة.',
      quickItems: [
        { name: 'فرخة مشوية على الفحم', price: 450 },
        { name: 'نصف فرخة مشوية فحم', price: 225 },
        { name: 'ربع كيلو كفتة مشوية', price: 150 },
        { name: 'كريب شاورما فراخ', price: 100 },
        { name: 'كريب زنجر حار', price: 100 },
        { name: 'كريب كريسبي', price: 100 },
        { name: 'فتيلة السلطان (3 قطع)', price: 140 },
        { name: 'فتيلة السلطان (6 قطع)', price: 250 },
      ],
    },
    {
      id: 'syrian-2',
      title: 'لوحة 3: الشاورما والبروستد والوجبات الغربي',
      branch: 'syrian',
      image: syrianShawarmaBroastedImg,
      badge: 'القسم السوري الأصيل',
      description: 'وجبات شاورما عربي سنجل ودوبل وعائلي، بروستد مقرمش 4 قطع، ووجبات زنجر وكريسبي.',
      quickItems: [
        { name: 'وجبة شاورما عربي سنجل', price: 130 },
        { name: 'وجبة شاورما عربي دوبل', price: 250 },
        { name: 'وجبة شاورما عربي عائلي', price: 450 },
        { name: 'وجبة بروستد 4 قطع', price: 220 },
        { name: 'وجبة كريسبي غربي 4 قطع', price: 200 },
        { name: 'شاورما فراخ صاج', price: 95 },
        { name: 'صاروخ شاورما فراخ', price: 120 },
        { name: 'فتة شاورما فراخ', price: 120 },
      ],
    },
    {
      id: 'syrian-3',
      title: 'لوحة 4: الساندوتشات والفتة والطلبات الخاصة',
      branch: 'syrian',
      image: syrianMenuBoardImg,
      badge: 'أصناف متنوعة ومقبلات',
      description: 'ساندوتشات زنجر، فاهيتا، شيش طاووق، شاورما بالكيلو، ساندوتشات بطاطس وتومية.',
      quickItems: [
        { name: 'ساندوتش زنجر حار', price: 100 },
        { name: 'ساندوتش كريسبي غربي', price: 100 },
        { name: 'ساندوتش شيش طاووق', price: 105 },
        { name: 'ساندوتش بطاطس موزاريلا', price: 55 },
        { name: 'باكت بطاطس فارم', price: 35 },
        { name: 'أرز بسمتي أصفر', price: 40 },
        { name: 'علبة تومية سورية', price: 6 },
        { name: 'ربع كيلو شاورما فراخ', price: 190 },
      ],
    },
  ];

  const initialIndex = initialTab === 'syrian' ? 1 : 0;
  const [currentBoardIndex, setCurrentBoardIndex] = useState<number>(initialIndex);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [addedItem, setAddedItem] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentBoard = MENU_BOARDS[currentBoardIndex];

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  const handleNextBoard = () => {
    setCurrentBoardIndex((prev) => (prev + 1) % MENU_BOARDS.length);
    handleResetZoom();
  };

  const handlePrevBoard = () => {
    setCurrentBoardIndex((prev) => (prev - 1 + MENU_BOARDS.length) % MENU_BOARDS.length);
    handleResetZoom();
  };

  const handleQuickAdd = (name: string, price: number, branch: 'seafood' | 'syrian') => {
    if (onAddToCart) {
      onAddToCart({
        id: `photo-item-${Date.now()}`,
        name,
        branch,
        price,
        description: `طلب مباشر من ${currentBoard.title}`,
        image: currentBoard.image,
        available: true,
      });
      setAddedItem(name);
      setTimeout(() => setAddedItem(null), 1500);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-6xl max-h-[94vh] bg-[#f9f5ed] border border-[#d9ccba] rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10"
        >
          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-[#231811] text-white border-b border-[#3d2a1e] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-rose-400 p-0.5 bg-[#881337] shadow-md">
                <img
                  src={sultanChefLogoImg}
                  alt="لوجو السلطان محمود"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-rose-200">
                  لوحات المنيو المصورة المعتمدة (الألواح الأربعة)
                </h3>
                <p className="text-[11px] text-stone-300">
                  مطعم السلطان محمود • ديروط
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Board Selector Tabs */}
          <div className="flex items-center gap-1.5 p-2 bg-[#1b130e] overflow-x-auto scrollbar-none border-b border-white/10">
            {MENU_BOARDS.map((board, idx) => (
              <button
                key={board.id}
                onClick={() => {
                  setCurrentBoardIndex(idx);
                  handleResetZoom();
                }}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentBoardIndex === idx
                    ? board.branch === 'seafood'
                      ? 'bg-sky-700 text-white shadow-md scale-102'
                      : 'bg-[#881337] text-white shadow-md scale-102'
                    : 'text-stone-400 hover:text-white bg-white/5'
                }`}
              >
                {board.branch === 'seafood' ? (
                  <Fish className="w-3.5 h-3.5" />
                ) : (
                  <Flame className="w-3.5 h-3.5" />
                )}
                <span>{board.title}</span>
              </button>
            ))}
          </div>

          {/* Sub Controls: Zoom and Navigation Arrows */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 bg-[#efe7d9] border-b border-[#ddcfbd] text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevBoard}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white text-stone-800 border border-stone-300 hover:bg-stone-100 font-bold transition-all cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
                <span>اللوحة السابقة</span>
              </button>

              <span className="font-bold text-stone-700">
                لوحة {currentBoardIndex + 1} من {MENU_BOARDS.length}
              </span>

              <button
                onClick={handleNextBoard}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white text-stone-800 border border-stone-300 hover:bg-stone-100 font-bold transition-all cursor-pointer"
              >
                <span>اللوحة التالية</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Zoom controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleZoomIn}
                className="p-1.5 rounded-lg bg-white text-stone-800 hover:bg-stone-100 border border-stone-300 transition-colors cursor-pointer"
                title="تكبير"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <span className="font-mono text-xs font-bold text-stone-700 min-w-[40px] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={handleZoomOut}
                className="p-1.5 rounded-lg bg-white text-stone-800 hover:bg-stone-100 border border-stone-300 transition-colors cursor-pointer"
                title="تصغير"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-1.5 rounded-lg bg-white text-stone-800 hover:bg-stone-100 border border-stone-300 transition-colors cursor-pointer"
                title="إعادة ضبط"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Body: Image View & Quick Items Sidebar */}
          <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
            {/* Image Canvas */}
            <div className="flex-1 bg-[#1a1410] relative flex items-center justify-center overflow-auto p-4 select-none">
              <motion.div
                style={{ scale: zoomLevel }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="relative max-w-full max-h-full flex items-center justify-center transition-transform origin-center"
              >
                <img
                  src={currentBoard.image}
                  alt={currentBoard.title}
                  referrerPolicy="no-referrer"
                  className="rounded-2xl max-h-[62vh] sm:max-h-[70vh] object-contain shadow-2xl border border-rose-900/30"
                />
              </motion.div>
            </div>

            {/* Quick Add Menu Sidebar */}
            <div className="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-r border-[#e2d8c9] flex flex-col max-h-[35vh] lg:max-h-full overflow-hidden">
              <div className="p-3 bg-[#f6efe4] border-b border-[#e5dcce]">
                <h4 className="text-xs font-black text-[#231811]">
                  طلب فوري من {currentBoard.title}
                </h4>
                <p className="text-[11px] text-stone-500">
                  {currentBoard.badge}
                </p>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
                {currentBoard.quickItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-xl bg-[#faf6f0] hover:bg-[#f3ebe0] border border-[#e8ded0] transition-colors"
                  >
                    <div className="text-right">
                      <span className="text-xs font-bold text-[#231811] block">
                        {item.name}
                      </span>
                      <span className="text-[11px] font-mono font-black text-rose-900">
                        {item.price} ج.م
                      </span>
                    </div>

                    <button
                      onClick={() => handleQuickAdd(item.name, item.price, currentBoard.branch)}
                      className="px-2.5 py-1 rounded-lg bg-[#7a172b] hover:bg-[#641220] active:scale-95 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {addedItem === item.name ? (
                        <>
                          <Check className="w-3 h-3 text-white" />
                          <span>تم!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3 h-3 text-white" />
                          <span>+ سلة</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              {/* Direct WhatsApp Call Footer */}
              <div className="p-3 bg-[#f8f3eb] border-t border-[#e2d8c9] flex items-center gap-2">
                <a
                  href={RESTAURANT_INFO.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>واتساب المطعم</span>
                </a>

                <a
                  href={RESTAURANT_INFO.callLink}
                  className="p-2 rounded-xl bg-[#231811] hover:bg-[#38261b] text-rose-300 transition-colors"
                  title="اتصال مباشر"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
