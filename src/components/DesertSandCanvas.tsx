import React, { useEffect, useRef } from 'react';

interface DesertSandCanvasProps {
  /** 'intro' = before tap; 'storm' = sandstorm transition; 'journey' = scrolling through sun -> stone -> night -> chip; 'store' = locked clean storefront */
  stage: 'intro' | 'storm' | 'journey' | 'store';
  /** 0.0 to 1.0 scroll progress through the desert journey */
  scrollProgress: number;
}

interface Grain {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  // Target coordinates on the Silicon Wafer / Chip grid
  chipOffsetX: number;
  chipOffsetY: number;
  // Color tint seed
  warmth: number;
}

export const DesertSandCanvas: React.FC<DesertSandCanvasProps> = ({
  stage,
  scrollProgress,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef(stage);
  const progressRef = useRef(scrollProgress);

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  useEffect(() => {
    progressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = width < 768;
    const PARTICLE_COUNT = isMobile ? 210 : 380;

    // Create particles with pre-calculated positions on a geometric Silicon Chip lattice
    const grains: Grain[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const gridSide = Math.ceil(Math.sqrt(PARTICLE_COUNT));
      const row = Math.floor(i / gridSide) - gridSide / 2;
      const col = (i % gridSide) - gridSide / 2;
      const spacing = isMobile ? 7.5 : 10.5;

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.3) * 1.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2.2 + 0.9,
        alpha: Math.random() * 0.65 + 0.25,
        chipOffsetX: col * spacing,
        chipOffsetY: row * spacing,
        warmth: Math.random(),
      };
    });

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const currentStage = stageRef.current;
      const p = progressRef.current;

      // In locked 'store' mode, only render subtle residual sand grains leaking at the very top edge
      if (currentStage === 'store') {
        for (let i = 0; i < 65; i++) {
          const g = grains[i];
          g.y += 0.6 + g.warmth * 0.8;
          g.x += Math.sin(g.y * 0.03 + i) * 0.35;
          if (g.y > 110) {
            g.y = -5;
            g.x = Math.random() * width;
          }
          const fade = Math.max(0, 1 - g.y / 110);
          ctx.fillStyle = `rgba(194, 155, 107, ${fade * 0.55})`;
          ctx.beginPath();
          ctx.arc(g.x, g.y, g.size * 0.85, 0, Math.PI * 2);
          ctx.fill();
        }
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const centerX = width / 2;
      const centerY = height * 0.52;

      // Determine active physics regime from stage & scrollProgress
      const isStorm = currentStage === 'storm';
      // Night breeze active around p: 0.32 -> 0.64
      const isNightBreeze = currentStage === 'journey' && p >= 0.30 && p < 0.64;
      // Sand leaking down around p: 0.60 -> 0.76
      const isLeaking = currentStage === 'journey' && p >= 0.58 && p < 0.77;
      // Sand gathering & melting into silicon chip around p: 0.72 -> 0.90
      const isChipFusion = currentStage === 'journey' && p >= 0.73 && p < 0.92;
      // Assembling outward into products around p: 0.90+
      const isProductBurst = currentStage === 'journey' && p >= 0.90;

      for (let i = 0; i < grains.length; i++) {
        const g = grains[i];

        if (isStorm) {
          // ferocious desert sandstorm sweeping right-to-left across the screen
          g.x -= 22 + g.warmth * 18;
          g.y += Math.sin(g.x * 0.015 + i) * 4.2;
          if (g.x < -20) {
            g.x = width + 20;
            g.y = Math.random() * height;
          }
          ctx.fillStyle = `rgba(228, 182, 120, ${Math.min(1, g.alpha + 0.35)})`;
          ctx.beginPath();
          ctx.ellipse(g.x, g.y, g.size * 4.5, g.size * 0.9, -0.08, 0, Math.PI * 2);
          ctx.fill();
          continue;
        }

        if (isChipFusion) {
          // Swirl golden silica sparks around the photorealistic TS-M1 processor cutout
          const angle = i * 0.25 + p * 18;
          const radius = 140 + (i % 7) * 28;
          const targetX = centerX + Math.cos(angle) * radius;
          const targetY = centerY + Math.sin(angle) * (radius * 0.65);

          g.x += (targetX - g.x) * 0.08;
          g.y += (targetY - g.y) * 0.08;

          ctx.fillStyle = `rgba(255, 200, 95, ${g.alpha * 0.75})`;
          ctx.beginPath();
          ctx.arc(g.x, g.y, g.size * 1.1, 0, Math.PI * 2);
          ctx.fill();
          continue;
        }

        if (isProductBurst) {
          // Disperse softly as the assembled product takes over
          const burstT = Math.min(1, (p - 0.90) / 0.09);
          const targetX = centerX + g.chipOffsetX * (1 + burstT * 3.5);
          const targetY = centerY + g.chipOffsetY * (1 + burstT * 2.5);
          g.x += (targetX - g.x) * 0.1;
          g.y += (targetY - g.y) * 0.1;

          ctx.fillStyle = `rgba(107, 128, 104, ${(1 - burstT) * 0.6})`;
          ctx.fillRect(g.x, g.y, g.size * 1.6, g.size * 1.6);
          continue;
        }

        if (isLeaking) {
          // Gravity leak: sand streams pouring down from the night desert floor into the website below
          const streamColumn = ((i % 9) + 1) * (width / 10);
          g.x += (streamColumn - g.x) * 0.025 + Math.sin(g.y * 0.04 + i) * 1.1;
          g.y += 5.5 + g.warmth * 5.0;

          if (g.y > height + 10) {
            g.y = -10;
            g.x = streamColumn + (Math.random() - 0.5) * 90;
          }

          ctx.fillStyle = `rgba(229, 152, 56, ${g.alpha * 0.85})`;
          ctx.beginPath();
          ctx.arc(g.x, g.y, g.size * 1.15, 0, Math.PI * 2);
          ctx.fill();
          continue;
        }

        if (isNightBreeze) {
          // Cool desert night breeze blowing horizontally across the starlit stone monument
          g.x += 3.4 + g.warmth * 2.8;
          g.y += Math.sin(g.x * 0.01 + i) * 0.9;
          if (g.x > width + 10) {
            g.x = -10;
            g.y = Math.random() * height;
          }
          // Mix of moonlit sage dust and amber embers
          ctx.fillStyle =
            i % 4 === 0
              ? `rgba(229, 152, 56, ${g.alpha * 0.85})`
              : `rgba(169, 185, 165, ${g.alpha * 0.55})`;
          ctx.beginPath();
          ctx.ellipse(g.x, g.y, g.size * 1.8, g.size * 0.8, 0.05, 0, Math.PI * 2);
          ctx.fill();
          continue;
        }

        // Default: Clear Vast Desert & Scorching Sun thermal dust drift
        g.x += g.vx + 0.65;
        g.y += g.vy - 0.18; // Subtle rising heat shimmer
        if (g.x > width + 10) g.x = -10;
        if (g.x < -10) g.x = width + 10;
        if (g.y < -10) g.y = height + 10;
        if (g.y > height + 10) g.y = -10;

        ctx.fillStyle = `rgba(245, 222, 185, ${g.alpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
    />
  );
};

