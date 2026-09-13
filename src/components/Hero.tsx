import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Flame, Waves, Award, ChevronLeft } from 'lucide-react';
import { BranchType } from '../types';
import { CategoryStories, CategoryStoryItem } from './CategoryStories';
import { playReelSound } from '../utils/audio';
import {
  grilledShrimpImg,
  grilledLambKoftaImg,
  arabicShawarmaBoxImg,
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
  secondaryGlow: string;
  actionText: string;
  isFeast?: boolean;
}

const HERO_HIGHLIGHTS: HeroHighlight[] = [
  {
    id: 'seafood-showcase',
    badge: 'طازج من البحر',
    badgeIcon: <Waves className="w-3.5 h-3.5 text-sky-300" />,
    title: 'منيو الأسماك والبحريات',
    subtitle: 'جمبري جامبو مقرمش • وجبات فيليه • كبدة ومخ بالوزن',
    image: grilledShrimpImg,
    branch: 'seafood',
    bgGradient: 'from-[#031b33] via-[#08335e] to-[#04192f]',
    accentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.65)',
    secondaryGlow: 'rgba(3, 105, 161, 0.45)',
    actionText: 'تصفح بحريات السلطان',
  },
  {
    id: 'grills-showcase',
    badge: 'مشوي على الفحم',
    badgeIcon: <Flame className="w-3.5 h-3.5 text-rose-300" />,
    title: 'مشويات وشاورما سورية',
    subtitle: 'كباب وطرب عالفحم • شاورما عربي • بروستد مقرمش',
    image: grilledLambKoftaImg,
    branch: 'syrian',
    bgGradient: 'from-[#2b0813] via-[#4a0d20] to-[#1c040b]',
    accentColor: '#fb7185',
    glowColor: 'rgba(251, 113, 133, 0.65)',
    secondaryGlow: 'rgba(159, 18, 57, 0.45)',
    actionText: 'تصفح مشويات السلطان',
  },
  {
    id: 'feasts-showcase',
    badge: 'وجبات وأوزان العائلة',
    badgeIcon: <Award className="w-3.5 h-3.5 text-amber-300" />,
    title: 'المنيو العائلي والأوزان',
    subtitle: 'شاورما عربي عائلي • بروستد 12 قطعة • كيلو جمبري وكباب',
    image: arabicShawarmaBoxImg,
    branch: 'syrian',
    bgGradient: 'from-[#2a1303] via-[#482406] to-[#1e0d02]',
    accentColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.65)',
    secondaryGlow: 'rgba(180, 83, 9, 0.45)',
    actionText: 'عرض وجبات العائلة التفاعلي ✨',
    isFeast: true,
  },
];

// Cinematic Stagger Animation Variants
const cinematicContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const cinematicItem = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const Hero: React.FC<HeroProps> = ({
  onSelectBranch,
  onExploreMenu,
  onSelectCategory,
  activeCategory,
  onOpenFeastWheel,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  // Passive high-performance scroll tracking for gentle parallax (works in window & simulated phone frames)
  useEffect(() => {
    let rafId: number | null = null;
    const handleScroll = (e: Event) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const target = e.target;
        let y = 0;
        if (target === document || target === window) {
          y = window.scrollY || document.documentElement.scrollTop || 0;
        } else if (target instanceof HTMLElement) {
          y = target.scrollTop;
        } else {
          y = window.scrollY || 0;
        }
        setScrollY(y);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true });
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Auto-cycle through the 3 showcases every 5.5 seconds smoothly
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_HIGHLIGHTS.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const activeHighlight = HERO_HIGHLIGHTS[currentSlide];

  // Calculated subtle parallax offsets (strictly bounded to avoid overflow/clipping)
  const parallaxBgY = Math.min(scrollY * 0.14, 24);
  const parallaxDishY = Math.max(-scrollY * 0.09, -16);
  const parallaxTextY = Math.min(scrollY * 0.05, 10);

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
      {/* 1. Cinematic Feather-light Landing Showcase Card with Scroll Parallax */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 mb-3">
        <div
          onClick={handleActionClick}
          className="group relative w-full rounded-3xl overflow-hidden cursor-pointer border border-white/15 shadow-xl transition-all duration-300 active:scale-[0.99] transform-gpu min-h-[145px] sm:min-h-[170px] flex items-center"
        >
          {/* Animated Background Gradient with subtle Scroll Parallax */}
          <motion.div
            key={activeHighlight.id}
            initial={{ opacity: 0.65 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              transform: `translate3d(0, ${parallaxBgY}px, 0)`,
              willChange: 'transform, opacity',
            }}
            className={`absolute inset-0 bg-gradient-to-l ${activeHighlight.bgGradient} scale-105`}
          />

          {/* Specular Light Shimmer Sweep Animation */}
          <div
            className="absolute -inset-full w-[200%] h-[200%] pointer-events-none opacity-20"
            style={{
              background:
                'linear-gradient(115deg, transparent 40%, rgba(255, 255, 255, 0.45) 50%, transparent 60%)',
              animation: 'heroShimmer 4.5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
            }}
          />

          {/* ========================================================
              3. RADIANT INITIAL GLOWING AURA BLOOM ON PAGE LOAD
             ======================================================== */}
          {/* Layer A: Wide Ambient Blooming Backdrop */}
          <motion.div
            key={`glow-wide-${activeHighlight.id}`}
            initial={{ scale: 0.35, opacity: 0 }}
            animate={{
              scale: [0.35, 1.35, 1.15],
              opacity: [0, 0.85, 0.55],
            }}
            transition={{
              duration: 1.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute -left-6 sm:left-2 top-1/2 -translate-y-1/2 w-56 sm:w-72 h-56 sm:h-72 rounded-full blur-3xl pointer-events-none"
            style={{ backgroundColor: activeHighlight.glowColor }}
          />

          {/* Layer B: Continuous Radiant Harmonic Breathing Core */}
          <motion.div
            animate={{
              scale: [1, 1.18, 1],
              opacity: [0.45, 0.7, 0.45],
            }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute -left-2 sm:left-6 top-1/2 -translate-y-1/2 w-36 sm:w-48 h-36 sm:h-48 rounded-full blur-xl pointer-events-none"
            style={{ backgroundColor: activeHighlight.secondaryGlow }}
          />

          {/* Main Card Content Grid (RTL: Text on Right, Interactive Food Plate on Left) */}
          <div className="relative z-10 w-full flex items-center justify-between p-3.5 sm:p-5 gap-3">
            {/* ========================================================
                1. CINEMATIC STAGGERED ENTRANCE TRANSITION FOR TEXTS
               ======================================================== */}
            <motion.div
              variants={cinematicContainer}
              initial="hidden"
              animate="visible"
              style={{
                transform: `translate3d(0, ${parallaxTextY}px, 0)`,
                willChange: 'transform',
              }}
              className="flex-1 text-right flex flex-col justify-center"
            >
              {/* Badge with gentle pulse & icon */}
              <motion.div variants={cinematicItem} className="flex items-center gap-1.5 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-white/15 border border-white/25 text-white shadow-xs backdrop-blur-sm">
                  {activeHighlight.badgeIcon}
                  <span>{activeHighlight.badge}</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-white/80">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>طعم السلطان</span>
                </span>
              </motion.div>

              {/* Headline with cinematic upward glide & smooth slide transition */}
              <motion.div variants={cinematicItem}>
                <AnimatePresence mode="wait">
                  <motion.h2
                    key={activeHighlight.title}
                    initial={{ opacity: 0, y: 14, filter: 'blur(3px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -10, filter: 'blur(2px)' }}
                    transition={{
                      duration: 0.45,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="text-base sm:text-xl md:text-2xl font-black text-white tracking-tight leading-snug drop-shadow-md"
                  >
                    {activeHighlight.title}
                  </motion.h2>
                </AnimatePresence>
              </motion.div>

              {/* Subtitle / Description with cinematic soft fade */}
              <motion.div variants={cinematicItem}>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={activeHighlight.subtitle}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="text-[11px] sm:text-xs text-white/85 font-medium line-clamp-1 sm:line-clamp-2 mt-0.5 max-w-sm drop-shadow-xs"
                  >
                    {activeHighlight.subtitle}
                  </motion.p>
                </AnimatePresence>
              </motion.div>

              {/* CTA Row & Interactive Slide Indicators */}
              <motion.div variants={cinematicItem} className="flex items-center gap-3 mt-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white text-stone-950 font-black text-xs shadow-md transition-transform duration-200 group-hover:scale-105 active:scale-98">
                  <span>{activeHighlight.actionText}</span>
                  <ChevronLeft className="w-3.5 h-3.5 text-stone-800 transition-transform duration-200 group-hover:-translate-x-1" />
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
              </motion.div>
            </motion.div>

            {/* ========================================================
                2. LEFT SIDE: 3D DISH STAGE WITH SCROLL PARALLAX & GLOW
               ======================================================== */}
            <div
              style={{
                transform: `translate3d(0, ${parallaxDishY}px, 0)`,
                willChange: 'transform',
              }}
              className="relative shrink-0 flex items-center justify-center pl-1 sm:pl-3"
            >
              {/* Rising Steam Effect on Plate */}
              <div className="absolute -top-4 sm:-top-5 left-1/2 -translate-x-1/2 pointer-events-none flex items-center justify-center gap-1 opacity-65">
                <svg viewBox="0 0 36 20" className="w-8 sm:w-10 h-5 text-white/75">
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

              {/* Floating Animated Food Disc with Initial Glowing Halo */}
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

                {/* Direct High-Gloss Halo Ring around dish rim */}
                <motion.div
                  key={`rim-glow-${activeHighlight.id}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0, 0.9, 0.4], scale: [0.8, 1.15, 1] }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="absolute -inset-1.5 rounded-full pointer-events-none"
                  style={{
                    boxShadow: `0 0 24px ${activeHighlight.glowColor}, inset 0 0 12px ${activeHighlight.glowColor}`,
                  }}
                />

                <div className="w-full h-full rounded-full overflow-hidden bg-stone-950 border-2 border-stone-900 shadow-inner">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeHighlight.image}
                      src={activeHighlight.image}
                      alt={activeHighlight.title}
                      loading="eager"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      initial={{ scale: 0.9, opacity: 0, rotate: -3 }}
                      animate={{ scale: 1.05, opacity: 1, rotate: 0 }}
                      exit={{ scale: 0.95, opacity: 0, rotate: 3 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
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
