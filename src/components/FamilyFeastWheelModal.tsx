import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ChevronRight,
  ChevronLeft,
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

export const FamilyFeastWheelModal: React.FC<FamilyFeastWheelModalProps> = ({
  isOpen,
  onClose,
  initialBranch,
  onAddToCart,
}) => {
  const [currentBranch, setCurrentBranch] = useState<BranchType>(initialBranch);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [isAddedAnim, setIsAddedAnim] = useState<boolean>(false);

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartAngleRef = useRef<number>(0);
  const lastMoveXRef = useRef<number>(0);
  const lastMoveTimeRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const hasDraggedRef = useRef<boolean>(false);

  // Sync initial branch when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentBranch(initialBranch);
      setActiveIndex(0);
      setRotationAngle(0);
      setIsDragging(false);
      isDraggingRef.current = false;
    }
  }, [isOpen, initialBranch]);

  const feasts: FamilyFeastItem[] = useMemo(() => {
    return currentBranch === 'seafood' ? SEAFOOD_FAMILY_FEASTS : SYRIAN_FAMILY_FEASTS;
  }, [currentBranch]);

  const totalDishes = feasts.length;
  const angleStep = 360 / totalDishes; // 72 degrees for 5 items

  const activeDish: FamilyFeastItem = feasts[activeIndex] || feasts[0];

  const currentThemes = currentBranch === 'seafood' ? SEAFOOD_THEMES : SYRIAN_THEMES;
  const activeTheme = currentThemes[activeIndex % currentThemes.length];

  // Rotate turntable to target index smoothly (shortest angular distance)
  const rotateTo = useCallback(
    (targetIndex: number) => {
      playReelSound();
      const normalizedTarget = ((targetIndex % totalDishes) + totalDishes) % totalDishes;
      setActiveIndex(normalizedTarget);

      setRotationAngle((prevAngle) => {
        const targetDeg = -normalizedTarget * angleStep;
        // Compute minimal angular step
        const diff = ((((targetDeg - prevAngle) % 360) + 540) % 360) - 180;
        return prevAngle + diff;
      });
    },
    [totalDishes, angleStep]
  );

  // Turn clockwise (brings item from the left to center, following hand dragging to the right)
  const turnRight = useCallback(() => {
    rotateTo(activeIndex + 1);
  }, [activeIndex, rotateTo]);

  // Turn counter-clockwise (brings item from the right to center, following hand dragging to the left)
  const turnLeft = useCallback(() => {
    rotateTo(activeIndex - 1);
  }, [activeIndex, rotateTo]);

  // Real-time direct-manipulation drag physics (0ms latency, silky smooth)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
    isDraggingRef.current = true;
    setIsDragging(true);
    hasDraggedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartAngleRef.current = rotationAngle;
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

    const totalDeltaX = e.clientX - dragStartXRef.current;
    if (Math.abs(totalDeltaX) > 5) {
      hasDraggedRef.current = true;
    }

    // 0.32 degrees per px gives a perfect natural 1:1 physical feel on the ring
    const newAngle = dragStartAngleRef.current + totalDeltaX * 0.32;
    setRotationAngle(newAngle);

    // Live update active dish as you spin
    const estimatedIndex = ((Math.round(-newAngle / angleStep) % totalDishes) + totalDishes) % totalDishes;
    if (estimatedIndex !== activeIndex) {
      setActiveIndex(estimatedIndex);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    const currentAngle = rotationAngle;
    const velocity = velocityRef.current; // pixels per ms

    // Gentle momentum flick detection without jarring snaps
    if (Math.abs(velocity) > 0.45) {
      const stepDirection = velocity > 0 ? 1 : -1;
      const nearestIdx = Math.round(-currentAngle / angleStep);
      rotateTo(nearestIdx - stepDirection);
    } else {
      // Natural magnetic snap to the nearest dish
      const nearestIdx = Math.round(-currentAngle / angleStep);
      rotateTo(nearestIdx);
    }
  };

  const handlePointerCancel = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    const nearestIdx = Math.round(-rotationAngle / angleStep);
    rotateTo(nearestIdx);
  };

  const handleBranchSwitch = (branch: BranchType) => {
    if (branch === currentBranch) return;
    playReelSound();
    setCurrentBranch(branch);
    setActiveIndex(0);
    setRotationAngle(0);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        turnRight();
      } else if (e.key === 'ArrowLeft') {
        turnLeft();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, turnRight, turnLeft, onClose]);

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

          {/* 3D Circular Turntable Base: Slender Annular Wooden Ring (حلقة خشبية رفيعة ممشوقة مع مركز مفرغ واسع وتفاصيل ميكروسكوبية) */}
          <div
            className="relative w-full h-[325px] sm:h-[385px] flex items-center justify-center my-auto overflow-hidden touch-none cursor-grab active:cursor-grabbing select-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
          >
            {/* Ambient Lighting shining directly through the hollow center of the wooden ring */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 sm:w-56 h-44 sm:h-56 rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-60"
              style={{ backgroundColor: activeTheme.accent }}
            />

            {/* Rotating Base: Physical Masterpiece Slender Hardwood Ring with Large Hollow Center */}
            <div
              style={{
                transform: `rotate(${rotationAngle}deg)`,
                transition: isDragging ? 'none' : 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="relative w-[320px] sm:w-[390px] h-[320px] sm:h-[390px] flex items-center justify-center pointer-events-none"
            >
              {/* Ultra-Detailed Masterpiece SVG Vector Slender Wooden Ring (Width 44px, Inner Hole R=118, Outer R=162) */}
              <svg
                viewBox="0 0 400 400"
                className="absolute inset-0 w-full h-full pointer-events-none"
              >
                <defs>
                  {/* Mask that cuts out the center to make it a true SLENDER HOLLOW RING (118px <= r <= 162px) */}
                  <mask id="slenderWoodRingMask">
                    <rect x="0" y="0" width="400" height="400" fill="black" />
                    <circle cx="200" cy="200" r="162" fill="white" />
                    <circle cx="200" cy="200" r="118" fill="black" />
                  </mask>

                  {/* 3D Drop Shadow filter cast by the wooden ring (both outward and into the hollow center) */}
                  <filter id="slenderWoodShadow" x="-25%" y="-25%" width="150%" height="150%">
                    <feDropShadow dx="0" dy="14" stdDeviation="16" floodColor="#000000" floodOpacity="0.88" />
                    <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#000000" floodOpacity="0.65" />
                  </filter>

                  {/* Deep radial wood tones across the 44px ring (Rosewood & American Walnut) */}
                  <radialGradient id="slenderHardwoodGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="29.5%" stopColor="#170502" />
                    <stop offset="31.5%" stopColor="#3d1609" />
                    <stop offset="33.5%" stopColor="#5c250e" />
                    <stop offset="35%" stopColor="#220803" />
                    <stop offset="37%" stopColor="#672c13" />
                    <stop offset="39%" stopColor="#43190a" />
                    <stop offset="40.5%" stopColor="#140401" />
                  </radialGradient>

                  {/* Specular Hand-Rubbed Varnish Gloss Sheen */}
                  <linearGradient id="ringVarnishGloss" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="26%" stopColor="rgba(255,255,255,0)" />
                    <stop offset="48%" stopColor="rgba(255,248,230,0.18)" />
                    <stop offset="52%" stopColor="rgba(255,255,255,0.25)" />
                    <stop offset="74%" stopColor="rgba(255,255,255,0)" />
                  </linearGradient>

                  {/* Imperial Metallic Brass / Gold Gradient for Inlays and Rivets */}
                  <linearGradient id="imperialBrassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="25%" stopColor="#fef08a" />
                    <stop offset="50%" stopColor="#b45309" />
                    <stop offset="75%" stopColor="#fde047" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>

                  {/* Inner wall 3D cylinder shadow (gives physical slab thickness looking into the hole) */}
                  <linearGradient id="innerWallShadow" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(0,0,0,0.9)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0.25)" />
                  </linearGradient>
                </defs>

                {/* THE 3D HARDWOOD SLENDER RING BODY (Rendered inside the ring mask with deep 3D drop shadow) */}
                <g filter="url(#slenderWoodShadow)" mask="url(#slenderWoodRingMask)">
                  {/* Rich exotic dark hardwood base tone */}
                  <rect x="0" y="0" width="400" height="400" fill="url(#slenderHardwoodGrad)" />

                  {/* 18 Concentric Wood Growth Rings tightly packed inside the 44px ring (Micro-Grooves) */}
                  {[
                    119, 121, 123, 125, 127, 130, 133, 136, 138, 142, 144, 147, 150, 153, 156, 158, 160, 161
                  ].map((r, i) => (
                    <circle
                      key={`ring-growth-${i}`}
                      cx="200"
                      cy="200"
                      r={r}
                      fill="none"
                      stroke={
                        i % 4 === 0
                          ? '#7a391a'
                          : i % 3 === 0
                          ? '#2a0e04'
                          : i % 2 === 0
                          ? '#5a250e'
                          : '#1b0702'
                      }
                      strokeWidth={i % 5 === 0 ? '1.3' : i % 3 === 0 ? '0.9' : '0.6'}
                      opacity={i % 2 === 0 ? '0.85' : '0.55'}
                    />
                  ))}

                  {/* 60 Realistic Quarter-Sawn Radial Grain Fibers & Flecks across the 44px ring */}
                  {[...Array(60)].map((_, i) => {
                    const angle = (i * 6 * Math.PI) / 180;
                    const rStart = 119 + (i % 3) * 1.2;
                    const rEnd = 161 - ((i + 1) % 3) * 1.2;
                    const x1 = 200 + Math.cos(angle) * rStart;
                    const y1 = 200 + Math.sin(angle) * rStart;
                    const x2 = 200 + Math.cos(angle) * rEnd;
                    const y2 = 200 + Math.sin(angle) * rEnd;
                    return (
                      <line
                        key={`ray-${i}`}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={i % 4 === 0 ? '#6c2f12' : i % 2 === 0 ? '#190601' : '#351206'}
                        strokeWidth={i % 6 === 0 ? '1.1' : '0.65'}
                        opacity={i % 3 === 0 ? '0.5' : '0.35'}
                      />
                    );
                  })}

                  {/* Precision-Milled Circular Dish Track (Centered at radius 140) */}
                  <circle cx="200" cy="200" r="142.5" fill="none" stroke="#140401" strokeWidth="1.2" opacity="0.8" />
                  <circle cx="200" cy="200" r="140" fill="none" stroke="#240a04" strokeWidth="4.5" opacity="0.7" />
                  <circle cx="200" cy="200" r="140" fill="none" stroke="#d97706" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.55" />
                  <circle cx="200" cy="200" r="137.5" fill="none" stroke="#140401" strokeWidth="1.2" opacity="0.8" />
                  <circle cx="200" cy="200" r="138" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.7" />

                  {/* 10 Masterpiece Radial Brass Inlay Splines Connecting Inner & Outer Rims */}
                  {[...Array(10)].map((_, i) => {
                    const angle = (i * 36 * Math.PI) / 180;
                    const cos = Math.cos(angle);
                    const sin = Math.sin(angle);
                    const x1 = 200 + cos * 121;
                    const y1 = 200 + sin * 121;
                    const x2 = 200 + cos * 159;
                    const y2 = 200 + sin * 159;
                    return (
                      <g key={`spline-${i}`}>
                        {/* Dark routed mortise groove */}
                        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#100301" strokeWidth="3.6" />
                        {/* Shimmering brass spline */}
                        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#imperialBrassGrad)" strokeWidth="1.9" />
                        {/* Razor-sharp specular centerline */}
                        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fef08a" strokeWidth="0.55" opacity="0.9" />
                        {/* Center stud on the dish line */}
                        <circle cx={200 + cos * 140} cy={200 + sin * 140} r="1.6" fill="#fde047" stroke="#78350f" strokeWidth="0.5" />
                      </g>
                    );
                  })}

                  {/* Outer Brass Inlay Band with 20 Studded Brass Rivets (Radius 154) */}
                  <circle cx="200" cy="200" r="154" fill="none" stroke="#120401" strokeWidth="4" opacity="0.9" />
                  <circle cx="200" cy="200" r="154" fill="none" stroke="url(#imperialBrassGrad)" strokeWidth="2.2" />
                  <circle cx="200" cy="200" r="154" fill="none" stroke="#fef08a" strokeWidth="0.6" opacity="0.95" />

                  {/* 20 Fine Raised Brass Rivet Heads along the outer ring band (18° intervals) */}
                  {[...Array(20)].map((_, i) => {
                    const angle = (i * 18 * Math.PI) / 180;
                    const cx = 200 + Math.cos(angle) * 154;
                    const cy = 200 + Math.sin(angle) * 154;
                    return (
                      <g key={`stud-outer-${i}`}>
                        <circle cx={cx} cy={cy} r="1.9" fill="#582408" />
                        <circle cx={cx} cy={cy} r="1.5" fill="url(#imperialBrassGrad)" />
                        <circle cx={cx - 0.3} cy={cy - 0.3} r="0.5" fill="#ffffff" opacity="0.9" />
                      </g>
                    );
                  })}

                  {/* Inner Brass Inlay Ring with dashed engraving (Radius 126) */}
                  <circle cx="200" cy="200" r="126" fill="none" stroke="#140501" strokeWidth="3.2" opacity="0.8" />
                  <circle cx="200" cy="200" r="126" fill="none" stroke="url(#imperialBrassGrad)" strokeWidth="1.8" />
                  <circle cx="200" cy="200" r="126" fill="none" stroke="#fef08a" strokeWidth="0.6" strokeDasharray="3 2" opacity="0.9" />

                  {/* 10 Fine Raised Brass Rivets on Inner Rim (36° intervals offset) */}
                  {[...Array(10)].map((_, i) => {
                    const angle = ((i * 36 + 18) * Math.PI) / 180;
                    const cx = 200 + Math.cos(angle) * 126;
                    const cy = 200 + Math.sin(angle) * 126;
                    return (
                      <g key={`stud-inner-${i}`}>
                        <circle cx={cx} cy={cy} r="1.7" fill="#582408" />
                        <circle cx={cx} cy={cy} r="1.3" fill="url(#imperialBrassGrad)" />
                        <circle cx={cx - 0.3} cy={cy - 0.3} r="0.4" fill="#ffffff" opacity="0.9" />
                      </g>
                    );
                  })}

                  {/* Diagonal High-Gloss Specular Varnish Sheen across the slender ring */}
                  <circle cx="200" cy="200" r="162" fill="url(#ringVarnishGloss)" />
                </g>

                {/* 3D BEVEL EDGES (Drawn cleanly over the mask boundary for maximum tactile sharpness) */}

                {/* Outer Rim 3D Bevel & Chamfer (Radius 162) */}
                <circle cx="200" cy="200" r="162" fill="none" stroke="#100301" strokeWidth="2.5" />
                <circle cx="200" cy="200" r="161.2" fill="none" stroke="rgba(255, 240, 200, 0.45)" strokeWidth="1" />

                {/* Inner Hole 3D Bevel, Wall Depth & Cast Shadow into the hollow center (Radius 118) */}
                <circle cx="200" cy="200" r="118.6" fill="none" stroke="rgba(255, 235, 185, 0.5)" strokeWidth="1" />
                <circle cx="200" cy="200" r="118" fill="none" stroke="#0e0201" strokeWidth="2.2" />
                <circle cx="200" cy="200" r="116.5" fill="none" stroke="url(#innerWallShadow)" strokeWidth="2.5" opacity="0.85" />
              </svg>

              {/* Dishes Arranged Around the Slender Wooden Ring */}
              {feasts.map((feast, index) => {
                // Baseline angle: index 0 is at 90° (bottom-center / front)
                const baseAngleDeg = index * angleStep + 90;
                const baseRad = (baseAngleDeg * Math.PI) / 180;
                const radius = window.innerWidth > 640 ? 136 : 112;

                const posX = Math.cos(baseRad) * radius;
                const posY = Math.sin(baseRad) * radius;

                // Relative angle to viewer (bottom = 90°)
                const currentAbsoluteDeg = (baseAngleDeg + rotationAngle) % 360;
                const normalizedViewerDeg = (currentAbsoluteDeg + 360) % 360;

                let degFromFront = Math.abs(normalizedViewerDeg - 90);
                if (degFromFront > 180) degFromFront = 360 - degFromFront;

                const isFrontDish = degFromFront < angleStep / 2;

                return (
                  <div
                    key={feast.id}
                    onClick={() => {
                      if (!hasDraggedRef.current) {
                        rotateTo(index);
                      }
                    }}
                    style={{
                      transform: `translate3d(${posX}px, ${posY}px, 0px)`,
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 pointer-events-auto"
                  >
                    {/* Counter-rotation Container:
                        Counter-rotates by -rotationAngle so the light wood dish & delicious food
                        remain visually upright as the turntable tray spins! */}
                    <div
                      style={{
                        transform: `rotate(${-rotationAngle}deg) scale(${isFrontDish ? (window.innerWidth > 640 ? 1.25 : 1.18) : 0.82})`,
                        transition: isDragging ? 'none' : 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                      className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${
                        isFrontDish ? 'z-30' : 'z-10 opacity-75 hover:opacity-100'
                      }`}
                    >
                      {/* Light Natural Wood Plate / Bowl (أطباق خشب فاتح) with Crisp Lathe Turn-Lines */}
                      <div
                        className="relative w-23 h-23 sm:w-27 sm:h-27 rounded-full p-2 flex items-center justify-center transition-all duration-300 shadow-xl"
                        style={{
                          background: `
                            radial-gradient(circle at 50% 50%, #f7e8d3 0%, #ebd3b0 38%, #d8b482 72%, #b98e57 100%)
                          `,
                          boxShadow: isFrontDish
                            ? `0 20px 40px rgba(0, 0, 0, 0.8), 0 0 28px ${activeTheme.glow}`
                            : `0 10px 22px rgba(0, 0, 0, 0.6)`,
                        }}
                      >
                        {/* Ultra-Sharp SVG Lathe Rings for the Light Wood Bowl */}
                        <svg
                          viewBox="0 0 100 100"
                          className="absolute inset-0 w-full h-full pointer-events-none rounded-full"
                        >
                          <defs>
                            <linearGradient id={`lightWoodBevel-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
                              <stop offset="100%" stopColor="rgba(120,60,10,0.5)" />
                            </linearGradient>
                          </defs>

                          {/* Outer wood rim bevel */}
                          <circle
                            cx="50"
                            cy="50"
                            r="48.5"
                            fill="none"
                            stroke={`url(#lightWoodBevel-${index})`}
                            strokeWidth="2"
                          />

                          {/* Concentric turned wood grooves */}
                          <circle cx="50" cy="50" r="45" fill="none" stroke="#a16207" strokeWidth="0.8" opacity="0.4" />
                          <circle cx="50" cy="50" r="42" fill="none" stroke="#78350f" strokeWidth="0.6" opacity="0.3" />

                          {/* Inner bowl recess shadow */}
                          <circle cx="50" cy="50" r="38" fill="none" stroke="#451a03" strokeWidth="1.8" opacity="0.4" />
                        </svg>

                        {/* Active Dish Crisp Golden Rim */}
                        {isFrontDish && (
                          <div
                            className="absolute -inset-0.5 rounded-full pointer-events-none"
                            style={{
                              border: `2.5px solid ${activeTheme.accent}`,
                            }}
                          />
                        )}

                        {/* Food Image inside Light Wood Bowl (Razor Sharp Presentation) */}
                        <div className="relative w-full h-full rounded-full overflow-hidden shadow-inner flex items-center justify-center pointer-events-none bg-stone-900 border border-stone-900/30">
                          <img
                            src={feast.image}
                            alt={feast.name}
                            loading="eager"
                            decoding="async"
                            className="w-full h-full object-cover scale-105"
                          />
                        </div>

                        {/* Front Dish Clean Tag (No emojis) */}
                        {isFrontDish && feast.badgeText && (
                          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-stone-950/95 text-amber-300 border border-amber-400/50 shadow-md flex items-center gap-1">
                            <Award className="w-2.5 h-2.5 text-amber-400" />
                            <span>{feast.badgeText}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Left & Right Smooth Navigation Arrows to Spin the Turntable (Follow hand naturally) */}
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={turnLeft}
              className="absolute left-2 sm:left-4 z-40 w-11 h-11 rounded-full bg-black/60 hover:bg-black/85 border border-white/25 text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-sm shadow-xl"
              title="السابق"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={turnRight}
              className="absolute right-2 sm:right-4 z-40 w-11 h-11 rounded-full bg-black/60 hover:bg-black/85 border border-white/25 text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-sm shadow-xl"
              title="التالي"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Card: Pricing, Servings, Description & Add to Cart (Clean, zero emojis) */}
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
            <p className="text-xs sm:text-sm text-stone-200 line-clamp-2 max-w-lg mb-3 leading-relaxed">
              {activeDish.description}
            </p>

            {/* Single Full-Width Add to Cart Button (No direct WhatsApp here) */}
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

            {/* Step Dots indicator */}
            <div className="flex items-center gap-1.5 mt-3">
              {feasts.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => rotateTo(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    i === activeIndex
                      ? 'w-6 bg-white'
                      : 'w-1.5 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`الوجبة ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
