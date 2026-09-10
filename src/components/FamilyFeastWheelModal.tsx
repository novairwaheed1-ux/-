import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ShoppingBag,
  Fish,
  Flame,
  Users,
  Award,
  Check,
} from 'lucide-react';
import { BranchType, DishItem } from '../types';
import {
  SEAFOOD_FAMILY_FEASTS,
  SYRIAN_FAMILY_FEASTS,
  FamilyFeastItem,
} from '../data/familyFeasts';
import { playReelSound } from '../utils/audio';

interface FamilyFeastWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBranch: BranchType;
  onAddToCart: (dish: DishItem) => void;
  onOrderWhatsApp?: (dish: DishItem) => void;
  onSelectDish: (dish: DishItem) => void;
}

// Atmospheric dynamic background gradients per feast (matching the video)
const SEAFOOD_THEMES = [
  {
    bg: 'from-[#021f26] via-[#063541] to-[#011217]',
    accent: '#22d3ee',
    glow: 'rgba(34, 211, 238, 0.35)',
  },
  {
    bg: 'from-[#052131] via-[#09354d] to-[#02131c]',
    accent: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.35)',
  },
  {
    bg: 'from-[#2e1304] via-[#461e07] to-[#180902]',
    accent: '#fb923c',
    glow: 'rgba(251, 146, 60, 0.35)',
  },
  {
    bg: 'from-[#290d14] via-[#3f131d] to-[#140407]',
    accent: '#f43f5e',
    glow: 'rgba(244, 63, 94, 0.35)',
  },
  {
    bg: 'from-[#201803] via-[#352907] to-[#0f0c01]',
    accent: '#facc15',
    glow: 'rgba(250, 204, 21, 0.35)',
  },
];

const SYRIAN_THEMES = [
  {
    bg: 'from-[#2d1204] via-[#451b07] to-[#170701]',
    accent: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.35)',
  },
  {
    bg: 'from-[#2a1702] via-[#412404] to-[#150a01]',
    accent: '#fbbf24',
    glow: 'rgba(251, 191, 36, 0.35)',
  },
  {
    bg: 'from-[#2b1003] via-[#431905] to-[#160601]',
    accent: '#f97316',
    glow: 'rgba(249, 115, 22, 0.35)',
  },
  {
    bg: 'from-[#1f1804] via-[#322707] to-[#0f0b01]',
    accent: '#eab308',
    glow: 'rgba(234, 179, 8, 0.35)',
  },
  {
    bg: 'from-[#27060a] via-[#3d0b10] to-[#130204]',
    accent: '#ef4444',
    glow: 'rgba(239, 68, 68, 0.35)',
  },
];

// Preload all family feast images in browser memory for instant sub-second display
const ALL_FEAST_IMAGES = [
  ...SEAFOOD_FAMILY_FEASTS.map((f) => f.image),
  ...SYRIAN_FAMILY_FEASTS.map((f) => f.image),
];
if (typeof window !== 'undefined') {
  ALL_FEAST_IMAGES.forEach((src) => {
    if (!src) return;
    const img = new Image();
    img.src = src;
  });
}

export const FamilyFeastWheelModal: React.FC<FamilyFeastWheelModalProps> = ({
  isOpen,
  onClose,
  initialBranch,
  onAddToCart,
}) => {
  const [currentBranch, setCurrentBranch] = useState<BranchType>(initialBranch);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isAddedAnim, setIsAddedAnim] = useState<boolean>(false);

  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragOffsetRef = useRef<number>(0);
  const lastMoveXRef = useRef<number>(0);
  const lastMoveTimeRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const hasDraggedRef = useRef<boolean>(false);
  const rafIdRef = useRef<number | null>(null);

  // Sync initial branch and ensure eager image warm-up when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentBranch(initialBranch);
      setActiveIndex(0);
      setDragOffset(0);
      dragOffsetRef.current = 0;
      setIsDragging(false);
      isDraggingRef.current = false;
      // Warm up image cache instantly
      ALL_FEAST_IMAGES.forEach((src) => {
        if (!src) return;
        const img = new Image();
        img.src = src;
      });
    }
  }, [isOpen, initialBranch]);

  // Clean up any pending animation frames
  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, []);

  const feasts: FamilyFeastItem[] = useMemo(() => {
    return currentBranch === 'seafood' ? SEAFOOD_FAMILY_FEASTS : SYRIAN_FAMILY_FEASTS;
  }, [currentBranch]);

  const totalDishes = feasts.length;
  const activeDish: FamilyFeastItem = feasts[activeIndex] || feasts[0];

  const currentThemes = currentBranch === 'seafood' ? SEAFOOD_THEMES : SYRIAN_THEMES;
  const activeTheme = currentThemes[activeIndex % currentThemes.length];

  // Rotate turntable directly to target index smoothly
  const rotateTo = useCallback(
    (targetIndex: number) => {
      playReelSound();
      const normalizedTarget = ((targetIndex % totalDishes) + totalDishes) % totalDishes;
      setActiveIndex(normalizedTarget);
      setDragOffset(0);
      dragOffsetRef.current = 0;
    },
    [totalDishes]
  );

  // Direct 1:1 physical swipe physics:
  // Dragging finger to the LEFT (deltaX < 0) slides the current dish to the left, pulling the next dish in!
  // Dragging finger to the RIGHT (deltaX > 0) slides the current dish to the right, pulling the previous dish in!
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    isDraggingRef.current = true;
    setIsDragging(true);
    hasDraggedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragOffsetRef.current = 0;
    setDragOffset(0);
    lastMoveXRef.current = e.clientX;
    lastMoveTimeRef.current = performance.now();
    velocityRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const now = performance.now();
    const dt = now - lastMoveTimeRef.current;
    const dx = e.clientX - lastMoveXRef.current;
    if (dt > 0) {
      velocityRef.current = dx / dt;
    }
    lastMoveXRef.current = e.clientX;
    lastMoveTimeRef.current = now;

    const deltaX = e.clientX - dragStartXRef.current;
    if (Math.abs(deltaX) > 4) {
      hasDraggedRef.current = true;
    }

    dragOffsetRef.current = deltaX;

    // Smooth 60/120fps direct 1:1 synchronization
    if (!rafIdRef.current) {
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        setDragOffset(dragOffsetRef.current);
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    isDraggingRef.current = false;
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    const deltaX = dragOffsetRef.current;
    const velocity = velocityRef.current; // px per ms

    // Natural momentum swipe:
    // Flicking left (deltaX < -35 or velocity < -0.3) brings the next dish (+1)
    // Flicking right (deltaX > 35 or velocity > 0.3) brings the previous dish (-1)
    if (deltaX < -35 || velocity < -0.3) {
      playReelSound();
      setActiveIndex((prev) => (prev + 1) % totalDishes);
    } else if (deltaX > 35 || velocity > 0.3) {
      playReelSound();
      setActiveIndex((prev) => (prev - 1 + totalDishes) % totalDishes);
    }
    setDragOffset(0);
    dragOffsetRef.current = 0;
  };

  const handlePointerCancel = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    isDraggingRef.current = false;
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    setDragOffset(0);
    dragOffsetRef.current = 0;
  };

  const handleBranchSwitch = (branch: BranchType) => {
    if (branch === currentBranch) return;
    playReelSound();
    setCurrentBranch(branch);
    setActiveIndex(0);
    setDragOffset(0);
    dragOffsetRef.current = 0;
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        playReelSound();
        setActiveIndex((prev) => (prev - 1 + totalDishes) % totalDishes);
      } else if (e.key === 'ArrowLeft') {
        playReelSound();
        setActiveIndex((prev) => (prev + 1) % totalDishes);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, totalDishes, onClose]);

  // Add to cart with tactile feedback
  const handleAdd = () => {
    playReelSound();
    setIsAddedAnim(true);
    setTimeout(() => setIsAddedAnim(false), 900);
    onAddToCart(activeDish);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/92 backdrop-blur-md select-none overflow-y-auto"
      >
        {/* Main Stage Shell with Dynamic Smooth Ambient Gradient */}
        <div
          className={`relative w-full sm:max-w-xl md:max-w-2xl min-h-screen sm:min-h-[720px] sm:max-h-[94vh] sm:rounded-3xl overflow-hidden flex flex-col justify-between text-white bg-gradient-to-b ${activeTheme.bg} transition-colors duration-500 shadow-2xl border border-white/10`}
        >
          {/* Ambient Lighting Glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 h-80 sm:h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-40"
            style={{ backgroundColor: activeTheme.accent }}
          />

          {/* Top Bar: Clean Branch Selector + Close Button */}
          <div className="relative z-30 flex items-center justify-between px-4 sm:px-6 pt-4 pb-2">
            {/* Branch Switcher Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/60 border border-white/15 backdrop-blur-md">
              <button
                type="button"
                onClick={() => handleBranchSwitch('seafood')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentBranch === 'seafood'
                    ? 'bg-cyan-400 text-stone-950 shadow-md font-black'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                <Fish className="w-3.5 h-3.5" />
                <span>صواني الأسماك</span>
              </button>

              <button
                type="button"
                onClick={() => handleBranchSwitch('syrian')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentBranch === 'syrian'
                    ? 'bg-amber-400 text-stone-950 shadow-md font-black'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>صواني السوري</span>
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-stone-200 hover:text-white transition-all cursor-pointer"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Clean Header: "منيو العائلات" Only + Active Dish Name (No emojis) */}
          <div className="relative z-30 text-center px-4 pt-1">
            <span className="inline-block text-xs font-bold tracking-wider uppercase text-amber-300/90 mb-0.5">
              منيو العائلات
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-md">
              {activeDish.name}
            </h2>
          </div>

          {/* 3D Cylindrical Revolving Banquet Stage: Platter Base Directly Under Dishes with Seamless Tactile Spin */}
          <div
            className="relative w-full h-[370px] sm:h-[420px] flex items-center justify-center my-auto overflow-hidden touch-none cursor-grab active:cursor-grabbing select-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
          >
            {/* Ambient Lighting Glow behind active front dish */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-40"
              style={{ backgroundColor: activeTheme.accent }}
            />

            {/* 3D Banquet Turntable Platform & Base Skirt (قاعدة وسماكة صينية المائدة الأسطوانية) */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ perspective: '850px' }}
            >
              {/* Turntable 3D Pedestal Base / Lower Cylinder Skirt showing solid wood thickness */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 translate-y-10 sm:translate-y-12 w-[340px] sm:w-[410px] h-[58px] sm:h-[68px] rounded-[50%] bg-gradient-to-b from-[#2b1007] via-[#120401] to-black shadow-[0_30px_50px_rgba(0,0,0,0.98)] border-b-2 border-amber-600/40 pointer-events-none"
              />

              {/* Circular 3D Turntable Disc with Inlaid Parquet Wood & Brass Inlays */}
              <div
                style={{
                  transform: `rotateX(54deg) rotate(${(activeIndex * 72) + ((-dragOffset / 140) * 72)}deg)`,
                  transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  willChange: 'transform',
                }}
                className="relative w-[340px] sm:w-[410px] h-[340px] sm:h-[410px] rounded-full"
              >
                <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)]">
                  <defs>
                    <linearGradient id="cylinderBrassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#92400e" />
                      <stop offset="25%" stopColor="#fef08a" />
                      <stop offset="50%" stopColor="#d97706" />
                      <stop offset="75%" stopColor="#fde047" />
                      <stop offset="100%" stopColor="#78350f" />
                    </linearGradient>

                    <radialGradient id="cylinderWalnut" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#541f0c" />
                      <stop offset="60%" stopColor="#351206" />
                      <stop offset="100%" stopColor="#1a0601" />
                    </radialGradient>

                    <radialGradient id="cylinderRosewood" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#783013" />
                      <stop offset="60%" stopColor="#4d1a08" />
                      <stop offset="100%" stopColor="#240a03" />
                    </radialGradient>

                    <linearGradient id="cylinderVarnish" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="20%" stopColor="rgba(255,255,255,0)" />
                      <stop offset="50%" stopColor="rgba(255,248,230,0.22)" />
                      <stop offset="80%" stopColor="rgba(255,255,255,0)" />
                    </linearGradient>
                  </defs>

                  {/* 12 Parquet Hardwood Wedges */}
                  {[...Array(12)].map((_, i) => {
                    const startDeg = i * 30;
                    const endDeg = (i + 1) * 30;
                    const rad1 = (startDeg * Math.PI) / 180;
                    const rad2 = (endDeg * Math.PI) / 180;
                    const r = 185;
                    const x1 = 200 + Math.cos(rad1) * r;
                    const y1 = 200 + Math.sin(rad1) * r;
                    const x2 = 200 + Math.cos(rad2) * r;
                    const y2 = 200 + Math.sin(rad2) * r;
                    return (
                      <path
                        key={`parquet-${i}`}
                        d={`M 200,200 L ${x1},${y1} A ${r},${r} 0 0,1 ${x2},${y2} Z`}
                        fill={i % 2 === 0 ? 'url(#cylinderWalnut)' : 'url(#cylinderRosewood)'}
                      />
                    );
                  })}

                  {/* Concentric Lathe-Turned Micro-Rings */}
                  {[45, 75, 105, 130, 150, 168, 180].map((r, i) => (
                    <circle
                      key={`turned-ring-${i}`}
                      cx="200"
                      cy="200"
                      r={r}
                      fill="none"
                      stroke={i % 2 === 0 ? '#100301' : '#6b2d13'}
                      strokeWidth="0.85"
                      opacity="0.6"
                    />
                  ))}

                  {/* 12 Brass Stringing Splines */}
                  {[...Array(12)].map((_, i) => {
                    const angle = (i * 30 * Math.PI) / 180;
                    const cos = Math.cos(angle);
                    const sin = Math.sin(angle);
                    return (
                      <line
                        key={`spline-${i}`}
                        x1={200 + cos * 45}
                        y1={200 + sin * 45}
                        x2={200 + cos * 182}
                        y2={200 + sin * 182}
                        stroke="url(#cylinderBrassGrad)"
                        strokeWidth="1.6"
                      />
                    );
                  })}

                  {/* Outer Brass Band & 24 Raised Rivets */}
                  <circle cx="200" cy="200" r="182" fill="none" stroke="url(#cylinderBrassGrad)" strokeWidth="3" />
                  <circle cx="200" cy="200" r="185" fill="none" stroke="#0e0301" strokeWidth="2" />
                  {[...Array(24)].map((_, i) => {
                    const angle = (i * 15 * Math.PI) / 180;
                    const cx = 200 + Math.cos(angle) * 182;
                    const cy = 200 + Math.sin(angle) * 182;
                    return (
                      <circle key={`rivet-${i}`} cx={cx} cy={cy} r="1.8" fill="#fef08a" stroke="#78350f" strokeWidth="0.5" />
                    );
                  })}

                  {/* Central 12-Point Islamic Geometric Star Medallion */}
                  <circle cx="200" cy="200" r="45" fill="#1b0601" stroke="url(#cylinderBrassGrad)" strokeWidth="2.4" />
                  {(() => {
                    const pts: string[] = [];
                    for (let step = 0; step < 24; step++) {
                      const rad = (step * 15 * Math.PI) / 180;
                      const dist = step % 2 === 0 ? 42 : 28;
                      pts.push(`${200 + Math.cos(rad) * dist},${200 + Math.sin(rad) * dist}`);
                    }
                    return (
                      <polygon points={pts.join(' ')} fill="url(#cylinderBrassGrad)" stroke="#78350f" strokeWidth="0.8" />
                    );
                  })()}
                  <circle cx="200" cy="200" r="12" fill="#f59e0b" stroke="#fef08a" strokeWidth="1" />

                  {/* High Gloss Lacquer Reflection */}
                  <circle cx="200" cy="200" r="184" fill="url(#cylinderVarnish)" />
                </svg>
              </div>
            </div>

            {/* The 5 Royal Platters Firmly Seated ON the Cylinder Turntable */}
            <div className="relative w-full max-w-lg h-full flex items-center justify-center pointer-events-none">
              {feasts.map((feast, index) => {
                const isDesktop = typeof window !== 'undefined' && window.innerWidth > 640;
                // Orbital radius positioned completely inside the cylinder turntable surface
                const orbitX = isDesktop ? 128 : 110;
                const orbitY = isDesktop ? 66 : 56;

                const angleStep = 360 / totalDishes;
                // When dragOffset < 0 (drag left), turntable rotates clockwise (+deg)
                const dragAngle = (-dragOffset / 140) * angleStep;
                const currentTurntableDeg = (activeIndex * angleStep) + dragAngle;

                // Dish angle relative to front center (0 deg is front closest to viewer)
                let angleDeg = (index * angleStep) - currentTurntableDeg;
                let normAngle = ((angleDeg % 360) + 360) % 360;
                if (normAngle > 180) normAngle -= 360;

                const rad = (normAngle * Math.PI) / 180;
                const posX = Math.sin(rad) * orbitX;
                const posY = Math.cos(rad) * orbitY;

                const absAngle = Math.abs(normAngle);
                const depth = Math.max(0, 1 - absAngle / 180);
                const isCenter = absAngle < 36;
                const scale = 0.74 + depth * 0.44; // 1.18 at front, 0.74 at back
                const opacity = Math.max(0.48, 0.65 + depth * 0.35);
                const zIndex = Math.round(15 + depth * 35);

                return (
                  <div
                    key={feast.id}
                    onClick={() => {
                      if (!hasDraggedRef.current) {
                        rotateTo(index);
                      }
                    }}
                    style={{
                      transform: `translate3d(${posX}px, ${posY}px, 0px) scale(${scale})`,
                      zIndex,
                      opacity,
                      transition: isDragging
                        ? 'none'
                        : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease',
                      willChange: 'transform, opacity',
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer pointer-events-auto"
                    title={feast.name}
                  >
                    {/* Dark Contact Shadow Pegged to the Turntable Base Wood */}
                    <div
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded-full bg-black/85 blur-[2.5px] pointer-events-none"
                      style={{
                        width: `${74 * scale}px`,
                        height: `${16 * scale}px`,
                      }}
                    />

                    {/* Royal Dish Platter Resting on the Turntable */}
                    <div className="relative flex flex-col items-center">
                      {/* Fresh Hot Steam Ribbon for Front Active Dish */}
                      {isCenter && (
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 pointer-events-none flex items-center justify-center gap-1 opacity-70">
                          <svg viewBox="0 0 44 24" className="w-11 h-6 text-amber-100/60">
                            <path
                              d="M 10,22 Q 14,14 10,8 Q 6,2 10,0"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              className="animate-pulse"
                            />
                            <path
                              d="M 22,24 Q 27,15 22,9 Q 17,3 22,0"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              className="animate-pulse"
                              style={{ animationDelay: '0.35s' }}
                            />
                            <path
                              d="M 34,22 Q 38,14 34,8 Q 30,2 34,0"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              className="animate-pulse"
                              style={{ animationDelay: '0.7s' }}
                            />
                          </svg>
                        </div>
                      )}

                      {/* Platter Body with Wooden Pedestal Base */}
                      <div
                        className="relative w-26 h-26 sm:w-30 sm:h-30 rounded-full p-1.5 flex items-center justify-center transition-all duration-300"
                        style={{
                          background: `radial-gradient(circle at 50% 50%, #fef3c7 0%, #d97706 40%, #78350f 85%, #290d05 100%)`,
                          boxShadow: isCenter
                            ? `0 20px 40px rgba(0, 0, 0, 0.95), 0 0 30px ${activeTheme.glow}`
                            : `0 8px 16px rgba(0, 0, 0, 0.65)`,
                        }}
                      >
                        {/* SVG Turned Wooden Rim & Golden Brass Bevel */}
                        <svg
                          viewBox="0 0 120 120"
                          className="absolute inset-0 w-full h-full pointer-events-none rounded-full"
                        >
                          <defs>
                            <linearGradient id={`goldRimBevel-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#fef08a" />
                              <stop offset="50%" stopColor="#b45309" />
                              <stop offset="100%" stopColor="#fde047" />
                            </linearGradient>
                            <linearGradient id={`platterWood-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
                              <stop offset="100%" stopColor="rgba(70,25,5,0.6)" />
                            </linearGradient>
                          </defs>

                          {/* Outer Hand-Carved Hardwood Rim with Chamfer */}
                          <circle cx="60" cy="60" r="58.5" fill="none" stroke={`url(#platterWood-${index})`} strokeWidth="2.2" />
                          <circle cx="60" cy="60" r="56.5" fill="none" stroke="#220701" strokeWidth="1.2" opacity="0.8" />

                          {/* Precision Lathe-Turned Concentric Grooves */}
                          {[55, 53.5, 52, 50, 48.5, 47].map((r, i) => (
                            <circle
                              key={`lathe-${i}`}
                              cx="60"
                              cy="60"
                              r={r}
                              fill="none"
                              stroke={i % 2 === 0 ? '#78350f' : '#b45309'}
                              strokeWidth="0.65"
                              opacity="0.45"
                            />
                          ))}

                          {/* Imperial Metallic Gold Leaf Beveled Rim */}
                          <circle
                            cx="60"
                            cy="60"
                            r="46"
                            fill="none"
                            stroke={`url(#goldRimBevel-${index})`}
                            strokeWidth="2.4"
                          />
                          <circle cx="60" cy="60" r="45" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.85" />
                          <circle cx="60" cy="60" r="43.5" fill="none" stroke="#160401" strokeWidth="1.8" opacity="0.6" />
                        </svg>

                        {/* Active Dish Ambient Aura Ring */}
                        {isCenter && (
                          <div
                            className="absolute -inset-1 rounded-full pointer-events-none animate-pulse"
                            style={{
                              border: `2px solid ${activeTheme.accent}`,
                            }}
                          />
                        )}

                        {/* High-Definition Razor-Sharp Food Image */}
                        <div className="relative w-full h-full rounded-full overflow-hidden shadow-inner flex items-center justify-center pointer-events-none bg-stone-950 border border-stone-800">
                          <img
                            src={feast.image}
                            alt={feast.name}
                            loading="eager"
                            decoding="async"
                            className="w-full h-full object-cover scale-108"
                            style={{
                              imageRendering: '-webkit-optimize-contrast',
                              filter: isCenter
                                ? 'contrast(1.18) brightness(1.05) saturate(1.22)'
                                : 'contrast(1.08) brightness(0.95) saturate(1.05)',
                            }}
                          />
                          {/* Inner shadow */}
                          <div className="absolute inset-0 rounded-full pointer-events-none ring-2 ring-inset ring-black/45" />
                          <div className="absolute inset-0 rounded-full pointer-events-none bg-gradient-to-t from-black/25 via-transparent to-white/10" />
                        </div>

                        {/* Front Dish Specialty Ribbon Tag */}
                        {isCenter && feast.badgeText && (
                          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-0.5 rounded-full text-[10px] font-black bg-stone-950/95 text-amber-300 border border-amber-400/60 shadow-xl flex items-center gap-1.5 z-40">
                            <Award className="w-3 h-3 text-amber-400 shrink-0" />
                            <span>{feast.badgeText}</span>
                            <span className="text-stone-400 text-[9px] font-normal">• {feast.servesCount}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Card: Pricing, Servings, Description & Add to Cart (Clean, Zero Buttons Clutter) */}
          <div className="relative z-30 px-4 sm:px-6 pb-4 sm:pb-6 pt-1 flex flex-col items-center text-center">
            {/* Pricing & Serves Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
              <div className="px-3.5 py-1 rounded-xl bg-white/15 border border-white/20 text-white text-base sm:text-lg font-black tracking-tight shadow-sm">
                <span>{activeDish.price.toLocaleString('ar-EG')}</span>
                <span className="text-xs font-bold mr-1 text-amber-300">ج.م</span>
              </div>

              <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-black/50 border border-white/15 text-xs font-bold text-stone-200">
                <Users className="w-3.5 h-3.5 text-cyan-300" />
                <span>{activeDish.servesCount}</span>
              </div>

              {activeDish.savingsText && (
                <div className="px-2.5 py-1 rounded-xl bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
                  <span>{activeDish.savingsText}</span>
                </div>
              )}
            </div>

            {/* Description of the feast */}
            <p className="text-xs sm:text-sm text-stone-200 line-clamp-2 max-w-lg mb-4 leading-relaxed">
              {activeDish.description}
            </p>

            {/* Single Full-Width Add to Cart Button */}
            <div className="w-full max-w-sm">
              <button
                type="button"
                onClick={handleAdd}
                className={`w-full py-3 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl active:scale-98 cursor-pointer ${
                  isAddedAnim
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white hover:bg-stone-100 text-stone-950'
                }`}
              >
                {isAddedAnim ? (
                  <>
                    <Check className="w-5 h-5 text-white" />
                    <span>تمت إضافة الوجبة إلى السلة</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 text-stone-900" />
                    <span>إضافة الوجبة إلى السلة</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
