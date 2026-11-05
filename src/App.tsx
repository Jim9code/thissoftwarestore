import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wind,
  Sun,
  Moon,
  Cpu,
  ArrowDown,
  Volume2,
  VolumeX,
  FastForward,
  Sparkles,
  Layers,
} from 'lucide-react';
import { DesertSandCanvas } from './components/DesertSandCanvas';
import { CleanStorefront, CartItem } from './components/CleanStorefront';
import { HeroSunCarousel, HeroSlide } from './components/HeroSunCarousel';
import { PRODUCTS, Product } from './data/products';
import { ProductIllustration } from './components/ProductIllustration';
import { soundEngine } from './utils/soundEngine';

const STORE_LOCK_KEY = 'thissoftwarestore_entered_clean_store_v3';

export function App() {
  const [isLockedStoreOnly, setIsLockedStoreOnly] = useState<boolean>(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'store' || params.get('q') || params.get('cat')) {
      return true;
    }
    return sessionStorage.getItem(STORE_LOCK_KEY) === 'true';
  });

  const [stage, setStage] = useState<'intro' | 'storm' | 'journey' | 'store'>(
    () => (isLockedStoreOnly ? 'store' : 'intro')
  );

  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: PRODUCTS[0],
      finishName: PRODUCTS[0].finishes[0].name,
      quantity: 1,
    },
  ]);

  const journeyContainerRef = useRef<HTMLDivElement | null>(null);
  const introVideoRef = useRef<HTMLVideoElement | null>(null);

  // Sync back-button navigation
  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'origin') {
        sessionStorage.removeItem(STORE_LOCK_KEY);
        setIsLockedStoreOnly(false);
        setStage('journey');
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Track scroll depth across the 520vh cinematic viewport
  useEffect(() => {
    if (isLockedStoreOnly || stage !== 'journey') return;

    const handleScroll = () => {
      if (!journeyContainerRef.current) return;
      const journeyHeight = journeyContainerRef.current.offsetHeight - window.innerHeight;
      if (journeyHeight <= 0) return;

      const currentY = window.scrollY;
      const progress = Math.min(1, Math.max(0, currentY / journeyHeight));
      setScrollProgress(progress);
      soundEngine.setDesertAtmosphere(progress, false);

      // Lock into Clean Storefront once user reaches Act 5 threshold (progress >= 0.985)
      if (progress >= 0.985) {
        sessionStorage.setItem(STORE_LOCK_KEY, 'true');
        const url = new URL(window.location.href);
        url.searchParams.set('view', 'store');
        window.history.pushState({ view: 'store' }, '', url.toString());

        setIsLockedStoreOnly(true);
        setStage('store');
        soundEngine.setDesertAtmosphere(1, true);
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLockedStoreOnly, stage]);

  // Act 1 -> Act 2: Play the real Kling Sandstorm-to-Sun video on tap!
  const handleEnterFromIntro = () => {
    if (stage === 'storm') return;
    soundEngine.playSandstormSweep();
    setStage('storm');

    if (introVideoRef.current) {
      introVideoRef.current.currentTime = 0;
      introVideoRef.current.muted = isMuted;
      introVideoRef.current.play().catch(() => {
        // Fallback if browser requires muted playback
        if (introVideoRef.current) {
          introVideoRef.current.muted = true;
          introVideoRef.current.play().catch(() => {});
        }
      });
    }
  };

  const handleIntroVideoEnded = () => {
    setStage('journey');
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const handleSkipToStore = () => {
    soundEngine.playClick(1.1);
    sessionStorage.setItem(STORE_LOCK_KEY, 'true');
    const url = new URL(window.location.href);
    url.searchParams.set('view', 'store');
    window.history.pushState({ view: 'store' }, '', url.toString());
    setIsLockedStoreOnly(true);
    setStage('store');
    soundEngine.setDesertAtmosphere(1, true);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const handleReplayDesertOrigin = () => {
    sessionStorage.removeItem(STORE_LOCK_KEY);
    const url = new URL(window.location.href);
    url.searchParams.delete('view');
    url.searchParams.delete('q');
    url.searchParams.delete('cat');
    window.history.pushState({ view: 'origin' }, '', url.toString());
    setScrollProgress(0);
    setIsLockedStoreOnly(false);
    setStage('intro');
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleAddToCart = (product: Product, finishName: string, size?: string) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.product.id === product.id && i.finishName === finishName && i.size === size
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      }
      return [...prev, { product, finishName, size, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (index: number, delta: number) => {
    setCart((prev) => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        updated.splice(index, 1);
      } else {
        updated[index].quantity = newQty;
      }
      return updated;
    });
  };

  // Cinematic 9-Frame Scrollytelling Transitions:
  // 1. 0.00 - 0.18: Blazing Sun Zenith (`desert-sun-zenith.jpg`)
  // 2. 0.14 - 0.38: Vast Golden Dunes Horizon (`desert-day.jpg`)
  // 3. 0.30 - 0.52: Wind-Carved Rock Monolith at Sunset (`desert-rock.jpg`)
  // 4. 0.46 - 0.68: Same Rock Monolith at Night with Milky Way (`desert-rock-night.jpg`)
  // 5. 0.62 - 0.80: Cascading Quartz Sand Streams (`sand-cascade-macro.jpg`)
  // 6. 0.74 - 0.89: Molten Sand to Silicon Wafer Chip (`silicon-fusion.jpg`)
  // 7. 0.85 - 0.99: Levitating Hardware Exploded Assembly (`chip-product-assembly.jpg`)

  const sunZenithOpacity = Math.max(0, 1 - scrollProgress * 5.5);
  const dayDunesOpacity =
    scrollProgress < 0.1
      ? scrollProgress * 10
      : scrollProgress < 0.28
      ? 1
      : Math.max(0, 1 - (scrollProgress - 0.28) * 8);

  const rockDayOpacity =
    scrollProgress < 0.26
      ? 0
      : scrollProgress < 0.36
      ? (scrollProgress - 0.26) * 10
      : scrollProgress < 0.48
      ? 1
      : Math.max(0, 1 - (scrollProgress - 0.48) * 9);

  const rockNightOpacity =
    scrollProgress < 0.44
      ? 0
      : scrollProgress < 0.55
      ? (scrollProgress - 0.44) * 9
      : scrollProgress < 0.66
      ? 1
      : Math.max(0, 1 - (scrollProgress - 0.66) * 9);

  const sandCascadeOpacity =
    scrollProgress < 0.62
      ? 0
      : scrollProgress < 0.72
      ? (scrollProgress - 0.62) * 10
      : scrollProgress < 0.80
      ? 1
      : Math.max(0, 1 - (scrollProgress - 0.80) * 10);

  const siliconFusionOpacity =
    scrollProgress < 0.74
      ? 0
      : scrollProgress < 0.82
      ? (scrollProgress - 0.74) * 12
      : scrollProgress < 0.89
      ? 1
      : Math.max(0, 1 - (scrollProgress - 0.89) * 12);

  const chipAssemblyOpacity =
    scrollProgress < 0.85 ? 0 : Math.min(1, (scrollProgress - 0.85) * 8);

  return (
    <div className="relative min-h-[100dvh] w-full select-none sm:select-auto bg-[#160E09]">
      {/* GPU Particles (Sand grains, storm swirl, chip lattice) */}
      <DesertSandCanvas stage={stage} scrollProgress={scrollProgress} />

      {/* =====================================================================
          ACT 1 & 2: THE MOLDED SAND INTRO GATE + REAL KLING SANDSTORM-TO-SUN VIDEO
      ====================================================================== */}
      <AnimatePresence>
        {(stage === 'intro' || stage === 'storm') && !isLockedStoreOnly && (
          <motion.section
            key="act1-desert-intro-video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } }}
            onClick={handleEnterFromIntro}
            className={`fixed inset-0 z-40 flex h-[100dvh] w-full flex-col items-center justify-between overflow-hidden px-6 py-8 text-[#F6F2EA] select-none ${
              stage === 'intro' ? 'cursor-pointer' : 'pointer-events-none'
            }`}
          >
            {/* Seamless Kling 4.0 Video: Paused on Frame 0 ("thissoftwarestore" + "tap to enter"), Plays on Tap -> Reveals Sun Zenith */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#160E09]">
              <video
                ref={introVideoRef}
                src="/videos/kling_20261106_VIDEO_A_sudden_v_1345_0.mp4"
                poster="/images/desert-intro-molded.jpg"
                playsInline
                preload="auto"
                onEnded={handleIntroVideoEnded}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="relative z-10 my-auto" />
            <div className="relative z-10 h-6" />
          </motion.section>
        )}
      </AnimatePresence>

      {/* =====================================================================
          ACTS 2 -> 4: 9-FRAME PHOTOREALISTIC PARALLAX SCROLL JOURNEY
      ====================================================================== */}
      {!isLockedStoreOnly && (
        <div ref={journeyContainerRef} className="relative h-[520dvh] w-full">
          <div className="sticky top-0 flex h-[100dvh] w-full flex-col justify-between overflow-hidden">
            {/* Frame 1: Blazing Desert Sun Zenith (desert-sun-zenith.jpg) */}
            <div
              className="pointer-events-none absolute inset-0 transition-opacity duration-300"
              style={{ opacity: sunZenithOpacity }}
            >
              <img
                src="/images/desert-sun-zenith.jpg"
                alt="Blazing Desert Sun at Solar Zenith"
                className="h-full w-full object-cover"
                style={{
                  transform: `scale(${1 + scrollProgress * 0.25}) translateY(${scrollProgress * 60}px)`,
                }}
              />
            </div>

            {/* Frame 2: Vast Golden Sand Dunes Horizon (desert-day.jpg) */}
            <div
              className="pointer-events-none absolute inset-0 transition-opacity duration-300"
              style={{ opacity: dayDunesOpacity }}
            >
              <img
                src="/images/desert-day.jpg"
                alt="Daylight Desert Horizon"
                className="h-full w-full object-cover"
                style={{
                  transform: `scale(${1.08 - (scrollProgress - 0.1) * 0.15}) translateY(${-(scrollProgress - 0.15) * 40}px)`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#160E09] via-transparent to-transparent opacity-60" />
            </div>

            {/* Frame 3: Open-Air Desert Product Showcase Ground (desert-showcase.jpg) */}
            <div
              className="pointer-events-none absolute inset-0 transition-opacity duration-300"
              style={{ opacity: rockDayOpacity }}
            >
              <img
                src="/images/desert-showcase.jpg"
                alt="Open-Air Desert Product Showcase Ground"
                className="h-full w-full object-cover brightness-[1.03]"
                style={{
                  transform: `scale(${1.04 - (scrollProgress - 0.3) * 0.08})`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#160E09]/40 via-transparent to-[#160E09]/75" />
            </div>

            {/* Frame 4: Same Open-Air Desert Ground at Midnight (desert-showcase-night.jpg) */}
            <div
              className="pointer-events-none absolute inset-0 transition-opacity duration-300"
              style={{ opacity: rockNightOpacity }}
            >
              <img
                src="/images/desert-showcase-night.jpg"
                alt="Open-Air Desert Product Ground at Midnight under Milky Way"
                className="h-full w-full object-cover brightness-[1.06]"
                style={{
                  transform: `scale(${1.02 + (scrollProgress - 0.45) * 0.08})`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#160E09]/30 to-[#160E09]" />
            </div>

            {/* Frame 5: Cascading Quartz Sand Streams (sand-cascade-macro.jpg) */}
            <div
              className="pointer-events-none absolute inset-0 transition-opacity duration-300"
              style={{ opacity: sandCascadeOpacity }}
            >
              <img
                src="/images/sand-cascade-macro.jpg"
                alt="Cascading Quartz Sand Waterfall"
                className="h-full w-full object-cover brightness-[1.1] contrast-[1.08]"
                style={{
                  transform: `scale(${1.1 - (scrollProgress - 0.62) * 0.15}) translateY(${(scrollProgress - 0.62) * 35}px)`,
                }}
              />
              <div className="absolute inset-0 bg-black/45" />
            </div>

            {/* Frame 6: Molten Sand to Silicon Wafer Chip (silicon-fusion.jpg) */}
            <div
              className="pointer-events-none absolute inset-0 transition-opacity duration-300"
              style={{ opacity: siliconFusionOpacity }}
            >
              <img
                src="/images/silicon-fusion.jpg"
                alt="Molten Sand Fusing to Silicon Wafer"
                className="h-full w-full object-cover brightness-[1.12] contrast-[1.12]"
                style={{
                  transform: `scale(${1.08 - (scrollProgress - 0.74) * 0.16})`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#160E09] via-black/35 to-black/55" />
            </div>

            {/* Frame 7: Exploded Tech Hardware Assembly (chip-product-assembly.jpg) */}
            <div
              className="pointer-events-none absolute inset-0 transition-opacity duration-300"
              style={{ opacity: chipAssemblyOpacity }}
            >
              <img
                src="/images/chip-product-assembly.jpg"
                alt="Hardware Assembly around Silicon Core"
                className="h-full w-full object-cover brightness-[1.08]"
                style={{
                  transform: `scale(${1.05 - (scrollProgress - 0.85) * 0.08})`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#F6F2EA] via-black/20 to-black/60" />
            </div>

            {/* Slanted Diagonal Hero Product Carousel Floating Directly in Front of the Sun */}
            {stage === 'journey' && scrollProgress < 0.22 && (
              <div
                className="relative z-20 h-full w-full transition-opacity duration-300"
                style={{
                  opacity: sunZenithOpacity,
                  pointerEvents: scrollProgress < 0.14 ? 'auto' : 'none',
                }}
              >
                <HeroSunCarousel
                  cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
                  isMuted={isMuted}
                  onToggleMute={handleToggleMute}
                  onOpenStore={handleSkipToStore}
                  onQuickAddSlide={(slide: HeroSlide, selectedSize: string) => {
                    const matchedProduct =
                      PRODUCTS.find((p) => p.id === slide.productId) ||
                      (slide.id === 'headphones-sand'
                        ? PRODUCTS[1]
                        : slide.id === 'jacket-404'
                        ? PRODUCTS[4]
                        : PRODUCTS[2]);
                    handleAddToCart(
                      matchedProduct,
                      matchedProduct.finishes[0].name,
                      selectedSize
                    );
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          ACT 5: THE CLEAN COLORED E-COMMERCE STOREFRONT
          (Sage Green, Walnut Brown, Amber Glow — One-Way Locked!)
      ====================================================================== */}
      <CleanStorefront
        cart={cart}
        onAddToCart={handleAddToCart}
        onUpdateQuantity={handleUpdateQuantity}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onReplayDesertOrigin={handleReplayDesertOrigin}
        isLockedStoreOnly={isLockedStoreOnly}
      />
    </div>
  );
}

export default App;
