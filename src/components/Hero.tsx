import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ChevronDown, Flame, Fish, Award, ChevronLeft, Waves } from 'lucide-react';
import { BranchType } from '../types';
import { CategoryStories, CategoryStoryItem } from './CategoryStories';
import { playReelSound } from '../utils/audio';
import {
  grilledShrimpImg,
  grilledLambKoftaImg,
  seafoodCasseroleTajinImg,
} from '../data/dishes';

interface HeroProps {
  onSelectBranch?: (branch: BranchType) => void;
  onExploreMenu?: () => void;
  onSelectCategory?: (category: CategoryStoryItem) => void;
  activeCategory?: string;
  onOpenFeastWheel?: () => void;
}

interface HeroHighlight {
  id: string;
  badge: string;
  badgeIcon: React.ReactNode;
  title: string;
  subtitle: string;
  image: string;
  branch: BranchType;
  bgGradient: string;
  accentColor: string;
  glowColor: string;
  actionText: string;
  isFeast?: boolean;
}

const HERO_HIGHLIGHTS: HeroHighlight[] = [
  {
    id: 'seafood-showcase',
    badge: 'طازج من البحر',
    badgeIcon: <Waves className="w-3.5 h-3.5 text-sky-300" />,
    title: 'منيو الأسماك والبحريات',
    subtitle: 'جمبري جامبو • طواجن سي فود إسكندراني • كبدة ومخ',
    image: grilledShrimpImg,
    branch: 'seafood',
    bgGradient: 'from-[#031b33] via-[#08335e] to-[#04192f]',
    accentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.45)',
    actionText: 'تصفح بحريات السلطان',
  },
  {
    id: 'grills-showcase',
    badge: 'مشوي على الفحم',
    badgeIcon: <Flame className="w-3.5 h-3.5 text-rose-300" />,
    title: 'مشويات وشاورما سورية',
    subtitle: 'كباب حلبي • كفتة على الفحم • شاورما عربي بالثومية',
    image: grilledLambKoftaImg,
    branch: 'syrian',
    bgGradient: 'from-[#2b0813] via-[#4a0d20] to-[#1c040b]',
    accentColor: '#fb7185',
    glowColor: 'rgba(251, 113, 133, 0.45)',
    actionText: 'تصفح مشويات السلطان',
  },
  {
    id: 'feasts-showcase',
    badge: 'ولائم العائلات الكبرى',
    badgeIcon: <Award className="w-3.5 h-3.5 text-amber-300" />,
    title: 'صواني العائلات ولِمّة الأكيلة',
    subtitle: 'أضخم الصواني للّمة مع كرم الضيافة وأعلى توفير',
    image: seafoodCasseroleTajinImg,
    branch: 'seafood',
    bgGradient: 'from-[#2a1303] via-[#482406] to-[#1e0d02]',
    accentColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    actionText: 'عرض صواني العائلات التفاعلي 👑',
    isFeast: true,
  },
];

export const Hero: React.FC<HeroProps> = ({
  onSelectBranch,
  onExploreMenu,
  onSelectCategory,
  activeCategory,
  onOpenFeastWheel,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-cycle through the 3 showcases every 5.5 seconds smoothly
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_HIGHLIGHTS.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const activeHighlight = HERO_HIGHLIGHTS[currentSlide];

  const handleSlideSelect = (idx: number) => {
    playReelSound();
    setCurrentSlide(idx);
  };

  const handleActionClick = () => {
    playReelSound();
    if (activeHighlight.isFeast && onOpenFeastWheel) {
      onOpenFeastWheel();
    } else {
      if (onSelectBranch) {
        onSelectBranch(activeHighlight.branch);
      }
      if (onExploreMenu) {
        onExploreMenu();
      }
    }
  };

  return (
    <section className="relative pt-2 pb-1 select-none overflow-hidden">
      {/* 1. Feather-light Animated Landing Showcase Card */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 mb-3">
        <div
          onClick={handleActionClick}
          className="group relative w-full rounded-3xl overflow-hidden cursor-pointer border border-white/15 shadow-xl transition-all duration-300 active:scale-[0.99] transform-gpu min-h-[140px] sm:min-h-[165px] flex items-center"
        >
          {/* Animated Background Gradient Transition */}
          <motion.div
            key={activeHighlight.id}
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className={`absolute inset-0 bg-gradient-to-l ${activeHighlight.bgGradient}`}
          />

          {/* Specular Light Shimmer Sweep Animation */}
          <div
            className="absolute -inset-full w-[200%] h-[200%] pointer-events-none opacity-20"
            style={{
              background:
                'linear-gradient(115deg, transparent 40%, rgba(255, 255, 255, 0.4) 50%, transparent 60%)',
              animation: 'heroShimmer 4.5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
            }}
          />

          {/* Ambient Glowing Aura behind the food plate */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.35, 0.55, 0.35],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -left-4 sm:left-4 top-1/2 -translate-y-1/2 w-48 sm:w-60 h-48 sm:h-60 rounded-full blur-2xl pointer-events-none"
            style={{ backgroundColor: activeHighlight.accentColor }}
          />

          {/* Main Card Content Grid (RTL: Text on Right, Interactive Food Plate on Left) */}
          <div className="relative z-10 w-full flex items-center justify-between p-3.5 sm:p-5 gap-3">
            {/* Right Side (Text & Quick Action) */}
            <div className="flex-1 text-right flex flex-col justify-center">
              {/* Badge with gentle pulse & icon */}
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-white/15 border border-white/25 text-white shadow-xs backdrop-blur-sm">
                  {activeHighlight.badgeIcon}
                  <span>{activeHighlight.badge}</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-white/70">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>طعم السلطان</span>
                </span>
              </div>

              {/* Title with smooth text transition */}
              <AnimatePresence mode="wait">
                <motion.h2
                  key={activeHighlight.title}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="text-base sm:text-xl md:text-2xl font-black text-white tracking-tight leading-snug drop-shadow-md"
                >
                  {activeHighlight.title}
                </motion.h2>
              </AnimatePresence>

              {/* Subtitle / Description */}
              <p className="text-[11px] sm:text-xs text-white/80 font-medium line-clamp-1 sm:line-clamp-2 mt-0.5 max-w-sm drop-shadow-xs">
                {activeHighlight.subtitle}
              </p>

              {/* CTA Row & Interactive Indicator Pills */}
              <div className="flex items-center gap-3 mt-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white text-stone-950 font-black text-xs shadow-md transition-transform group-hover:scale-105">
                  <span>{activeHighlight.actionText}</span>
                  <ChevronLeft className="w-3.5 h-3.5 text-stone-800 transition-transform group-hover:-translate-x-1" />
                </div>

                {/* 3 Slide Step Indicators */}
                <div
                  className="flex items-center gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  {HERO_HIGHLIGHTS.map((h, idx) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => handleSlideSelect(idx)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        currentSlide === idx
                          ? 'w-5 bg-white shadow-xs'
                          : 'w-2 bg-white/35 hover:bg-white/60'
                      }`}
                      title={h.title}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Left Side: Floating 3D Appetizing Dish Stage */}
            <div className="relative shrink-0 flex items-center justify-center pl-1 sm:pl-3">
              {/* Rising Steam Effect on Plate */}
              <div className="absolute -top-4 sm:-top-5 left-1/2 -translate-x-1/2 pointer-events-none flex items-center justify-center gap-1 opacity-60">
                <svg viewBox="0 0 36 20" className="w-8 sm:w-10 h-5 text-white/70">
                  <path
                    d="M 8,18 Q 12,10 8,5 Q 4,0 8,-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    className="animate-pulse"
                  />
                  <path
                    d="M 18,20 Q 22,12 18,6 Q 14,0 18,-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    className="animate-pulse"
                    style={{ animationDelay: '0.4s' }}
                  />
                  <path
                    d="M 28,18 Q 32,10 28,5 Q 24,0 28,-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    className="animate-pulse"
                    style={{ animationDelay: '0.8s' }}
                  />
                </svg>
              </div>

              {/* Floating Animated Food Disc */}
              <motion.div
                animate={{
                  y: [0, -5, 0],
                  rotate: [0, 1.2, -1.2, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative w-22 h-22 sm:w-28 sm:h-28 rounded-full p-1 shadow-2xl bg-gradient-to-tr from-amber-600 via-amber-300 to-yellow-100 border border-amber-300/60"
              >
                {/* Contact drop shadow */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-4 rounded-full bg-black/60 blur-xs pointer-events-none" />

                <div className="w-full h-full rounded-full overflow-hidden bg-stone-950 border-2 border-stone-900 shadow-inner">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeHighlight.image}
                      src={activeHighlight.image}
                      alt={activeHighlight.title}
                      loading="eager"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      initial={{ scale: 0.92, opacity: 0 }}
                      animate={{ scale: 1.05, opacity: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Category Stories Tray with Native Momentum Scrolling */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-4xl mx-auto px-1 sm:px-4"
      >
        <CategoryStories
          activeCategory={activeCategory}
          onSelectCategory={(story) => {
            playReelSound();
            if (onSelectCategory) {
              onSelectCategory(story);
            }
          }}
        />
      </motion.div>
    </section>
  );
};
