import React from 'react';
import { HeroSunCarousel, HeroSlide } from './HeroSunCarousel';
import { soundEngine } from '../utils/soundEngine';

interface DesertScrollStageProps {
  stage: 'intro' | 'storm' | 'journey' | 'store';
  scrollProgress: number;
  cartCount: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenStore: () => void;
  onQuickAddSlide: (slide: HeroSlide, selectedSize: string) => void;
}

function clamp(val: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, val));
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export const DesertScrollStage: React.FC<DesertScrollStageProps> = ({
  stage,
  scrollProgress,
  cartCount,
  isMuted,
  onToggleMute,
  onOpenStore,
  onQuickAddSlide,
}) => {
  // ===========================================================================
  // 1. CONTINUOUS VERTICAL WORLD CAMERA (0.00 -> 0.25)
  //    No opacity crossfade between Hero & Desert! One 200vh vertical world
  //    that pans smoothly from the Upper Sky (0vh) down to the Desert Floor (-100vh).
  // ===========================================================================
  const cameraDescent = smoothstep(0.0, 0.24, scrollProgress);
  const worldTranslateY = -cameraDescent * 100; // Moves from 0vh to -100vh

  // ===========================================================================
  // 2. THE PHYSICAL SUN SETTING BEHIND THE HORIZON (0.00 -> 0.60)
  //    - At 0.00 (Hero): Sun is at the center of the Hero viewport (50vh).
  //    - As camera descends to the Desert Floor (0.00 -> 0.24): The Sun stays
  //      visible in the upper desert sky (around 18vh from top of desert view).
  //    - As user scrolls through 0.34 -> 0.58: The Sun physically sinks down
  //      from 18vh -> 62vh (dipping behind the desert horizon dunes at ~48vh!),
  //      turning the sky from Golden Day -> Fiery Sunset -> Starlit Night!
  // ===========================================================================
  const sunSetProgress = smoothstep(0.34, 0.58, scrollProgress);

  // Sun vertical position in viewport coordinates (vh from top of screen):
  // At scroll=0: 46vh (dead center behind the Hero jacket/headphones).
  // At scroll=0.24 (arrived at desert floor): 18vh (shining high in the desert sky above the S monolith).
  // At scroll=0.58 (sunset complete): 58vh (sunk below the distant dune horizon!).
  const sunViewportY =
    46 * (1 - cameraDescent) + 18 * cameraDescent + sunSetProgress * 40;

  // Sunset warmth peaks around sunSetProgress = 0.45..0.75, then Night takes over (0.50 -> 0.64)
  const sunsetGlow =
    smoothstep(0.32, 0.46, scrollProgress) * (1 - smoothstep(0.52, 0.63, scrollProgress));
  const nightMix = smoothstep(0.46, 0.62, scrollProgress);

  // ===========================================================================
  // 3. LATERAL PRODUCT SLIDE-IN ONTO THE FOREGROUND SAND (0.20 -> 0.38)
  // ===========================================================================
  const leftHoodiesSlide = smoothstep(0.18, 0.33, scrollProgress);
  const leftHoodiesX = (1 - leftHoodiesSlide) * -65; // vw

  const rightSlabSlide = smoothstep(0.2, 0.35, scrollProgress);
  const rightSlabX = (1 - rightSlabSlide) * 65; // vw

  const centerKeyboardSlide = smoothstep(0.22, 0.37, scrollProgress);
  const keyboardX = (1 - centerKeyboardSlide) * -45; // vw
  const keyboardY = (1 - centerKeyboardSlide) * 26; // vh

  // ===========================================================================
  // 4. ACT 4: QUARTZ SAND CASCADE -> TS-M1 SILICON CHIP CUTOUT (0.66 -> 0.99)
  // ===========================================================================
  const act4Enter = smoothstep(0.66, 0.76, scrollProgress);
  const sandCascadeOpacity = act4Enter * (1 - smoothstep(0.86, 0.95, scrollProgress));

  const chipReveal = smoothstep(0.72, 0.83, scrollProgress);
  const chipScale = 0.58 + chipReveal * 0.44 + smoothstep(0.88, 0.99, scrollProgress) * 0.22;
  const chipRotateX = (1 - chipReveal) * 36;
  const chipRotateZ = (1 - chipReveal) * -16;
  const assemblyProgress = smoothstep(0.82, 0.95, scrollProgress);

  // Lighting adjustments on the 'S' Monolith & floor products as the Sun sets into Night
  const monolithBrightness = 1.04 - sunsetGlow * 0.08 - nightMix * 0.44;
  const monolithContrast = 1.04 + sunsetGlow * 0.1 + nightMix * 0.14;
  const monolithSepia = sunsetGlow * 0.28;
  const productNightBrightness = 1.0 - nightMix * 0.24;

  return (
    <div className="fixed inset-0 z-10 h-[100dvh] w-full overflow-hidden bg-[#120B07]">
      {/* =====================================================================
          THE CONTINUOUS 200VH VERTICAL WORLD CONTAINER
          Top 100vh = Hero Sky (0vh .. 100vh)
          Bottom 100vh = Desert Horizon, 'S' Monolith & Floor (100vh .. 200vh)
          Pans smoothly from translateY(0vh) to translateY(-100vh) with ZERO fade cut!
      ====================================================================== */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[200dvh] w-full will-change-transform"
        style={{
          transform: `translate3d(0, ${worldTranslateY}dvh, 0)`,
        }}
      >
        {/* -------------------------------------------------------------------
            TOP HALF (0dvh -> 100dvh): HERO SKY PLATE
        -------------------------------------------------------------------- */}
        <div className="relative h-[100dvh] w-full overflow-hidden">
          <img
            src="/images/desert-sun-zenith.jpg"
            alt="Upper Desert Sky at Solar Zenith"
            className="h-full w-full object-cover object-center"
          />
        </div>

        {/* -------------------------------------------------------------------
            BOTTOM HALF (100dvh -> 200dvh): DESERT HORIZON, SETTING SUN,
            FULL 'S' MONOLITH & OPEN-AIR PRODUCT FLOOR
        -------------------------------------------------------------------- */}
        <div className="relative h-[100dvh] w-full overflow-hidden bg-[#160E09]">
          {/* A1. Daylight Desert Sky & Background (Upper half of desert-day.jpg) */}
          <img
            src="/images/desert-day.jpg"
            alt="Daylight Sahara Desert Dunes"
            className="absolute inset-0 h-full w-full object-cover object-center"
            style={{
              filter: `brightness(${1 - sunsetGlow * 0.18 - nightMix * 0.55}) saturate(${1 + sunsetGlow * 0.35 - nightMix * 0.3})`,
            }}
          />

          {/* A2. Sunset Crimson-Amber Sky Atmosphere (Blooms as the Sun touches the horizon) */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: sunsetGlow,
              background:
                'linear-gradient(180deg, rgba(45, 22, 18, 0.55) 0%, rgba(215, 85, 22, 0.52) 34%, rgba(255, 165, 60, 0.38) 52%, rgba(35, 16, 6, 0.25) 100%)',
            }}
          />

          {/* A3. Starlit Milky Way Night Sky (Reveals in the upper sky as the Sun sinks below the horizon) */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: nightMix,
              WebkitMaskImage:
                'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 42%, rgba(0,0,0,0.35) 56%, rgba(0,0,0,0) 72%)',
              maskImage:
                'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.92) 42%, rgba(0,0,0,0.35) 56%, rgba(0,0,0,0) 72%)',
            }}
          >
            <img
              src="/images/desert-night.jpg"
              alt="Starlit Sahara Night Sky"
              className="h-full w-full object-cover object-top"
            />
          </div>

          {/* A4. Night Moonlight Tint on the Foreground Dunes */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              opacity: nightMix * 0.62,
              background:
                'linear-gradient(180deg, rgba(8, 12, 24, 0.2) 0%, rgba(12, 10, 18, 0.55) 55%, rgba(16, 10, 6, 0.78) 100%)',
            }}
          />

          {/* A5. THE SETTING SUN ORB (Sinks down into the horizon at y ~ 46% of the desert scene!)
              Positioned BEHIND the dune horizon & BEHIND the 'S' Monolith so it physically sets! */}
          <div
            className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 will-change-transform"
            style={{
              top: `${16 + sunSetProgress * 42}%`,
              opacity: clamp(1 - smoothstep(0.54, 0.63, scrollProgress), 0, 1),
              // Clip the sun at the horizon line (y = 47% of the desert viewport) so it sinks BEHIND the dunes!
              WebkitMaskImage:
                'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 68%, rgba(0,0,0,0) 92%)',
              maskImage:
                'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 68%, rgba(0,0,0,0) 92%)',
            }}
          >
            {/* Outer Solar Corona & Anamorphic Horizontal Flare */}
            <div
              className="relative flex items-center justify-center"
              style={{
                transform: `scale(${1.15 - sunSetProgress * 0.22})`,
              }}
            >
              {/* Wide Golden-Crimson Sunset Halo */}
              <div
                className="h-[340px] w-[340px] sm:h-[480px] sm:w-[480px] rounded-full blur-3xl"
                style={{
                  background:
                    sunSetProgress > 0.35
                      ? 'radial-gradient(circle, rgba(255, 220, 140, 0.95) 0%, rgba(255, 115, 30, 0.65) 38%, rgba(190, 45, 12, 0.25) 68%, transparent 100%)'
                      : 'radial-gradient(circle, rgba(255, 248, 220, 0.95) 0%, rgba(255, 200, 105, 0.55) 42%, rgba(229, 152, 56, 0.18) 70%, transparent 100%)',
                }}
              />
              {/* Anamorphic Horizontal Solar Streak (Matching Clip #1 Sun) */}
              <div
                className="absolute h-[3px] w-[90vw] max-w-[1100px] blur-[1px]"
                style={{
                  opacity: 0.75 * (1 - sunSetProgress * 0.6),
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(255, 240, 200, 0.85) 35%, #FFFFFF 50%, rgba(255, 240, 200, 0.85) 65%, transparent 100%)',
                }}
              />
              {/* Blazing White-Gold Solar Core Disc */}
              <div
                className="absolute h-28 w-28 sm:h-40 sm:w-40 rounded-full"
                style={{
                  background:
                    sunSetProgress > 0.4
                      ? 'radial-gradient(circle, #FFFDF5 0%, #FFE094 48%, #FF7B24 85%, transparent 100%)'
                      : 'radial-gradient(circle, #FFFFFF 0%, #FFF7DC 58%, #FFD27D 90%, transparent 100%)',
                  boxShadow:
                    sunSetProgress > 0.4
                      ? '0 0 80px 28px rgba(255, 130, 35, 0.75)'
                      : '0 0 90px 35px rgba(255, 230, 165, 0.85)',
                }}
              />
            </div>
          </div>

          {/* A6. FOREGROUND DUNE OCCLUDER (Bottom 54% of desert-day.jpg)
              Sits IN FRONT OF the Setting Sun Orb so the Sun physically disappears BEHIND the dunes at the horizon! */}
          <div
            className="pointer-events-none absolute inset-0 z-15"
            style={{
              WebkitMaskImage:
                'linear-gradient(to bottom, transparent 0%, transparent 43%, rgba(0,0,0,0.6) 46.5%, rgba(0,0,0,1) 50%, rgba(0,0,0,1) 100%)',
              maskImage:
                'linear-gradient(to bottom, transparent 0%, transparent 43%, rgba(0,0,0,0.6) 46.5%, rgba(0,0,0,1) 50%, rgba(0,0,0,1) 100%)',
            }}
          >
            <img
              src="/images/desert-day.jpg"
              alt="Foreground Desert Dunes"
              className="h-full w-full object-cover object-center"
              style={{
                filter: `brightness(${1 - sunsetGlow * 0.14 - nightMix * 0.52}) contrast(${1 + nightMix * 0.12}) saturate(${1 + sunsetGlow * 0.22 - nightMix * 0.28})`,
              }}
            />
          </div>

          {/* A7. FULL COLOSSAL WIND-CARVED 'THISSOFTWARE' 'S' SANDSTONE MONOLITH CUTOUT
              Stands on top of the dune ridge in FULL view (never buried behind a cropped box!) */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-[31%] sm:bottom-[30%] z-20 flex flex-col items-center justify-end will-change-transform"
            style={{
              transform: `scale(${0.92 + smoothstep(0.1, 0.28, scrollProgress) * 0.08})`,
            }}
          >
            {/* Solar Backlight / Sunset Rim Halo behind the 'S' Monolith */}
            <div
              className="pointer-events-none absolute -inset-8 rounded-full blur-3xl"
              style={{
                background:
                  nightMix > 0.5
                    ? 'radial-gradient(circle, rgba(229, 152, 56, 0.26) 0%, rgba(107, 128, 104, 0.12) 55%, transparent 75%)'
                    : sunsetGlow > 0.2
                    ? 'radial-gradient(circle, rgba(255, 140, 40, 0.52) 0%, rgba(229, 152, 56, 0.22) 60%, transparent 78%)'
                    : 'radial-gradient(circle, rgba(255, 225, 150, 0.45) 0%, rgba(229, 152, 56, 0.16) 60%, transparent 78%)',
              }}
            />

            <img
              src="/images/cutouts/monolith-s-cutout.png"
              alt="Wind-Carved thissoftware S Sandstone Monolith"
              className="relative z-10 h-[32vh] sm:h-[40vh] lg:h-[45vh] w-auto object-contain select-none"
              style={{
                filter: `brightness(${monolithBrightness}) contrast(${monolithContrast}) sepia(${monolithSepia}) drop-shadow(0 24px 32px rgba(22, 11, 3, 0.65))`,
                WebkitMaskImage:
                  'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 88%, rgba(0,0,0,0) 100%)',
                maskImage:
                  'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 88%, rgba(0,0,0,0) 100%)',
              }}
            />
            {/* Soft Sand Dune Base Shadow under the Monolith */}
            <div className=" -mt-3 h-5 w-48 sm:w-72 rounded-[100%] bg-[#241306]/65 blur-md" />
          </div>

          {/* A8. LEFT SLIDING PRODUCT CUTOUT: 620GSM Hoodies on Desert Timber & Sandstone Slab */}
          <div
            onClick={() => {
              soundEngine.playClick(1.1);
              onOpenStore();
            }}
            title="Explore Heavyweight Hoodies in Store"
            className="pointer-events-auto cursor-pointer group absolute left-[2%] sm:left-[5%] lg:left-[7%] bottom-[7%] sm:bottom-[6%] z-30 flex flex-col items-center will-change-transform"
            style={{
              opacity: leftHoodiesSlide,
              transform: `translate3d(${leftHoodiesX}vw, 0, 0)`,
            }}
          >
            <div
              className="pointer-events-none absolute inset-4 rounded-full blur-2xl"
              style={{
                opacity: nightMix * 0.75 + sunsetGlow * 0.4,
                background: 'radial-gradient(circle, rgba(229, 152, 56, 0.48) 0%, transparent 70%)',
              }}
            />
            <img
              src="/images/cutouts/floor-hoodies-left.png"
              alt="Folded Heavyweight Boxy Hoodies on Sandstone Slab"
              className="relative z-10 w-[40vw] max-w-[185px] sm:w-[27vw] sm:max-w-[290px] lg:max-w-[350px] h-auto object-contain transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-[1.03]"
              style={{
                filter: `brightness(${productNightBrightness}) drop-shadow(0 18px 22px rgba(20, 10, 3, 0.72))`,
              }}
            />
            {/* Ground Contact Shadow in the Sand */}
            <div className="-mt-4 h-5 w-[82%] rounded-[100%] bg-[#1E0F04]/75 blur-md" />
          </div>

          {/* A9. RIGHT SLIDING PRODUCT CUTOUT: Sandstone Slab with Amber Puffer, Tees, Studio Headphones & Solar Lamp */}
          <div
            onClick={() => {
              soundEngine.playClick(1.15);
              onOpenStore();
            }}
            title="Explore Studio Headphones & Puffer Jacket in Store"
            className="pointer-events-auto cursor-pointer group absolute right-[2%] sm:right-[5%] lg:right-[7%] bottom-[7%] sm:bottom-[6%] z-30 flex flex-col items-center will-change-transform"
            style={{
              opacity: rightSlabSlide,
              transform: `translate3d(${rightSlabX}vw, 0, 0)`,
            }}
          >
            {/* Solar Lamp Golden Glow (Intensifies at Sunset & Night!) */}
            <div
              className="pointer-events-none absolute right-[6%] top-[10%] h-28 w-28 sm:h-40 sm:w-40 rounded-full blur-2xl"
              style={{
                opacity: 0.3 + sunsetGlow * 0.45 + nightMix * 0.7,
                background:
                  'radial-gradient(circle, rgba(255, 195, 90, 0.9) 0%, rgba(229, 152, 56, 0.4) 55%, transparent 75%)',
              }}
            />
            <img
              src="/images/cutouts/floor-slab-right.png"
              alt="Sandstone Slab with Amber Puffer, Studio Headphones, and Solar Lamp"
              className="relative z-10 w-[42vw] max-w-[195px] sm:w-[29vw] sm:max-w-[310px] lg:max-w-[375px] h-auto object-contain transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-[1.03]"
              style={{
                filter: `brightness(${productNightBrightness}) drop-shadow(0 20px 24px rgba(20, 10, 3, 0.75))`,
              }}
            />
            {/* Ground Contact Shadow in the Sand */}
            <div className="-mt-4 h-5 w-[84%] rounded-[100%] bg-[#1E0F04]/75 blur-md" />
          </div>

          {/* A10. CENTER-FOREGROUND SLIDING CUTOUT: CNC Walnut & Sage 65% Mechanical Keyboard */}
          <div
            onClick={() => {
              soundEngine.playClick(1.2);
              onOpenStore();
            }}
            title="Explore Monolith 65% Mechanical Keyboard in Store"
            className="pointer-events-auto cursor-pointer group absolute left-1/2 bottom-[2%] sm:bottom-[3%] z-30 flex -translate-x-1/2 flex-col items-center will-change-transform"
            style={{
              opacity: centerKeyboardSlide,
              transform: `translate3d(calc(-50% + ${keyboardX}vw), ${keyboardY}vh, 0)`,
            }}
          >
            <div
              className="pointer-events-none absolute inset-3 rounded-full blur-2xl"
              style={{
                opacity: nightMix * 0.8 + sunsetGlow * 0.35,
                background: 'radial-gradient(circle, rgba(229, 152, 56, 0.5) 0%, transparent 70%)',
              }}
            />
            <img
              src="/images/cutouts/floor-keyboard-center.png"
              alt="Monolith 65% CNC Walnut & Sage Mechanical Keyboard"
              className="relative z-10 w-[50vw] max-w-[225px] sm:w-[30vw] sm:max-w-[315px] lg:max-w-[370px] h-auto object-contain transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-[1.04]"
              style={{
                filter: `brightness(${productNightBrightness}) drop-shadow(0 20px 24px rgba(14, 7, 2, 0.82))`,
              }}
            />
            <div className="-mt-3 h-4 w-[86%] rounded-[100%] bg-[#1A0C03]/80 blur-md" />
          </div>
        </div>

        {/* -------------------------------------------------------------------
            SEAMLESS SKY BRIDGE AT 100dvh (Between Hero Sky & Desert Sky)
            Blends the horizon seam between the bottom of desert-sun-zenith.jpg
            and the top of desert-day.jpg so the 200dvh pan feels like ONE single sky!
        -------------------------------------------------------------------- */}
        <div
          className="pointer-events-none absolute inset-x-0 top-[82dvh] h-[36dvh] z-20"
          style={{
            background:
              'linear-gradient(180deg, rgba(208, 185, 148, 0) 0%, rgba(214, 192, 158, 0.92) 48%, rgba(218, 200, 172, 0.92) 55%, rgba(218, 200, 172, 0) 100%)',
          }}
        />
      </div>

      {/* =====================================================================
          HERO SUN SLANTED CAROUSEL (Rides inside the Top 100dvh of the World!)
      ====================================================================== */}
      {stage === 'journey' && scrollProgress < 0.25 && (
        <div
          className="relative z-30 h-full w-full will-change-transform"
          style={{
            transform: `translate3d(0, ${worldTranslateY}dvh, 0)`,
            pointerEvents: scrollProgress < 0.1 ? 'auto' : 'none',
          }}
        >
          <HeroSunCarousel
            cartCount={cartCount}
            isMuted={isMuted}
            onToggleMute={onToggleMute}
            onOpenStore={onOpenStore}
            onQuickAddSlide={onQuickAddSlide}
          />
        </div>
      )}

      {/* =====================================================================
          LAYER 3: ACT 4 — QUARTZ SAND CASCADE -> TS-M1 SILICON CHIP CUTOUT
          (0.66 -> 0.99: Sand leaks down and fuses into the glowing processor core)
      ====================================================================== */}
      {act4Enter > 0.005 && (
        <div
          className="pointer-events-none absolute inset-0 z-40 overflow-hidden"
          style={{ opacity: act4Enter }}
        >
          {/* Cascading Quartz Sand Streams */}
          <div
            className="absolute inset-0 will-change-transform"
            style={{
              opacity: sandCascadeOpacity,
              transform: `scale(${1.14 - (scrollProgress - 0.66) * 0.16})`,
            }}
          >
            <img
              src="/images/sand-cascade-macro.jpg"
              alt="Cascading Quartz Sand Streams"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#120B07]/70 via-black/45 to-[#120B07]/90" />
          </div>

          {/* Isolated TS-M1 Silicon Processor Cutout + Converging Hardware Cutouts */}
          {chipReveal > 0.01 && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ opacity: chipReveal }}
            >
              {/* Molten 1,420°C Silica Furnace Glow behind the Chip */}
              <div
                className="h-[55vw] w-[55vw] max-h-[460px] max-w-[460px] rounded-full blur-3xl"
                style={{
                  background:
                    'radial-gradient(circle, rgba(255, 190, 75, 0.55) 0%, rgba(229, 152, 56, 0.22) 50%, transparent 75%)',
                  transform: `scale(${0.8 + assemblyProgress * 0.4})`,
                }}
              />

              {/* Orbiting Hardware Cutouts Snapping into the Silicon Core */}
              {assemblyProgress > 0.02 && (
                <>
                  <img
                    src="/images/carousel/jacket-404.png"
                    alt="404 Puffer"
                    className="absolute h-28 sm:h-40 w-auto object-contain"
                    style={{
                      opacity: assemblyProgress * (1 - smoothstep(0.92, 0.98, scrollProgress)),
                      transform: `translate3d(${(1 - assemblyProgress) * -32}vw, ${(1 - assemblyProgress) * -18}vh, 0) scale(${0.5 + assemblyProgress * 0.4})`,
                      filter: 'drop-shadow(0 16px 28px rgba(0,0,0,0.65))',
                    }}
                  />
                  <img
                    src="/images/carousel/headphones-sand.png"
                    alt="Sand Headphones"
                    className="absolute h-28 sm:h-40 w-auto object-contain"
                    style={{
                      opacity: assemblyProgress * (1 - smoothstep(0.92, 0.98, scrollProgress)),
                      transform: `translate3d(${(1 - assemblyProgress) * 32}vw, ${(1 - assemblyProgress) * -16}vh, 0) scale(${0.5 + assemblyProgress * 0.4})`,
                      filter: 'drop-shadow(0 16px 28px rgba(0,0,0,0.65))',
                    }}
                  />
                  <img
                    src="/images/cutouts/floor-keyboard-center.png"
                    alt="Monolith Keyboard"
                    className="absolute h-24 sm:h-36 w-auto object-contain"
                    style={{
                      opacity: assemblyProgress * (1 - smoothstep(0.92, 0.98, scrollProgress)),
                      transform: `translate3d(0, ${(1 - assemblyProgress) * 26}vh, 0) scale(${0.5 + assemblyProgress * 0.4})`,
                      filter: 'drop-shadow(0 16px 28px rgba(0,0,0,0.65))',
                    }}
                  />
                </>
              )}

              {/* Center Cutout: TS-M1 SILICA CORE Processor */}
              <img
                src="/images/cutouts/silicon-chip-core.png"
                alt="TS-M1 Silica Core Processor"
                className="relative z-10 w-[64vw] max-w-[270px] sm:w-[42vw] sm:max-w-[360px] lg:max-w-[400px] h-auto object-contain will-change-transform"
                style={{
                  transform: `perspective(900px) rotateX(${chipRotateX}deg) rotateZ(${chipRotateZ}deg) scale(${chipScale})`,
                  filter:
                    'drop-shadow(0 28px 48px rgba(0, 0, 0, 0.85)) drop-shadow(0 0 36px rgba(229, 152, 56, 0.45))',
                }}
              />
            </div>
          )}

          {/* Warm Linen Storefront Threshold Dissolve (0.91 -> 0.985) */}
          <div
            className="absolute inset-0 bg-[#F6F2EA] pointer-events-none"
            style={{ opacity: smoothstep(0.91, 0.985, scrollProgress) }}
          />
        </div>
      )}
    </div>
  );
};
