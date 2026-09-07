import React, { useEffect, useRef } from 'react';

interface SteamEffectProps {
  intensity?: 'light' | 'medium' | 'high';
  tint?: 'warm' | 'cool' | 'white';
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  maxSize: number;
  opacity: number;
  maxOpacity: number;
  rotation: number;
  rotationSpeed: number;
  life: number;
  maxLife: number;
  turbulenceFreq: number;
  turbulenceOffset: number;
}

export const SteamEffect: React.FC<SteamEffectProps> = ({
  intensity = 'high',
  tint = 'white',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isVisible = false;
    let animationFrameId: number;
    const particles: Particle[] = [];

    // Use IntersectionObserver to stop animating completely when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animationFrameId) {
          animationFrameId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    // Keep mobile light: cap DPR at 1 to prevent GPU memory saturation
    const dpr = 1;
    const width = canvas.clientWidth || 180;
    const height = canvas.clientHeight || 160;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Color configuration
    const rgb =
      tint === 'warm'
        ? { r: 255, g: 238, b: 210 }
        : tint === 'cool'
        ? { r: 215, g: 245, b: 255 }
        : { r: 255, g: 255, b: 255 };

    const spawnInterval = intensity === 'high' ? 8 : intensity === 'medium' ? 14 : 20;
    let frameCount = 0;

    const spawnParticle = () => {
      const spawnX = width * 0.5 + (Math.random() - 0.5) * (width * 0.35);
      const spawnY = height * 0.88 + (Math.random() - 0.5) * 10;
      const maxLife = 60 + Math.random() * 40;

      particles.push({
        x: spawnX,
        y: spawnY,
        vx: (Math.random() - 0.5) * 0.5,
        vy: 1.0 + Math.random() * 1.0,
        size: 12 + Math.random() * 10,
        maxSize: 38 + Math.random() * 24,
        opacity: 0,
        maxOpacity: 0.3 + Math.random() * 0.18,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        life: 0,
        maxLife,
        turbulenceFreq: 0.035 + Math.random() * 0.02,
        turbulenceOffset: Math.random() * 100,
      });
    };

    const render = () => {
      if (!isVisible) {
        animationFrameId = 0;
        return;
      }
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      // Max 18 particles for ultra smooth 60fps on mobile
      if (frameCount % spawnInterval === 0 && particles.length < 18) {
        spawnParticle();
      }

      // Update & Draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        const progress = p.life / p.maxLife;
        if (progress >= 1) {
          particles.splice(i, 1);
          continue;
        }

        const turbulence = Math.sin((p.life + p.turbulenceOffset) * p.turbulenceFreq) * 0.9;
        p.x += p.vx + turbulence * 0.4;
        p.y -= p.vy;
        p.rotation += p.rotationSpeed;

        const currentSize = p.size + (p.maxSize - p.size) * Math.pow(progress, 0.75);

        let currentOpacity = 0;
        if (progress < 0.2) {
          currentOpacity = (progress / 0.2) * p.maxOpacity;
        } else {
          currentOpacity = Math.pow(1 - progress, 1.4) * p.maxOpacity;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, currentSize);
        gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${currentOpacity})`);
        gradient.addColorStop(0.4, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${currentOpacity * 0.6})`);
        gradient.addColorStop(0.75, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${currentOpacity * 0.2})`);
        gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, currentSize, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    return () => {
      observer.disconnect();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [intensity, tint]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-30 overflow-visible flex items-end justify-center ${className}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-48 pointer-events-none filter blur-[1px]"
        style={{ width: '100%', height: '190px' }}
      />
    </div>
  );
};
