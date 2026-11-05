import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Heart,
  Volume2,
  VolumeX,
  Instagram,
  Globe,
  Terminal,
  Sparkles,
} from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export interface HeroSlide {
  id: string;
  navLabel: string;
  headlineLine1: string;
  headlineLine2: string;
  description: string;
  image: string;
  price: number;
  oldPrice: number;
  sizes: string[];
  bottomCaptionLine1: string;
  bottomCaptionLine2: string;
  ambientTint: string;
  productId: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'jacket-404',
    navLabel: 'PUFFER JACKET',
    headlineLine1: 'Stand out',
    headlineLine2: 'Without trying',
    description:
      "It's not just about staying warm. Engineered with 404 // ROUTE_NOT_FOUND telemetry and 800-fill silica-shell insulation, this jacket wraps you in lightweight desert warmth.",
    image: '/images/carousel/jacket-404.png',
    price: 149,
    oldPrice: 199,
    sizes: ['36', '38', '40'],
    bottomCaptionLine1: 'Confidence,',
    bottomCaptionLine2: 'wrapped in warmth',
    ambientTint: 'rgba(215, 105, 18, 0.24)',
    productId: 'ts-hoodie-01',
  },
  {
    id: 'headphones-sand',
    navLabel: 'SAND HEADPHONES',
    headlineLine1: 'Pure silence',
    headlineLine2: 'Sculpted in sand',
    description:
      'Molded from compressed Sahara quartz sand composite with brushed bronze yokes and zero-noise acoustic chambers. Feel the desert horizon in spatial studio clarity.',
    image: '/images/carousel/headphones-sand.png',
    price: 249,
    oldPrice: 319,
    sizes: ['36', '38', '40'],
    bottomCaptionLine1: 'Silence,',
    bottomCaptionLine2: 'molded from silica',
    ambientTint: 'rgba(194, 142, 68, 0.22)',
    productId: 'ts-audio-01',
  },
  {
    id: 'tshirt-commit',
    navLabel: 'COMMIT TEE',
    headlineLine1: 'Ship clean',
    headlineLine2: 'Every commit',
    description:
      'Cut from heavyweight 320GSM unbleached desert ecru cotton with high-density walnut branch-graph print. Initial desert release compiled with zero errors.',
    image: '/images/carousel/tshirt-commit.png',
    price: 89,
    oldPrice: 129,
    sizes: ['36', '38', '40'],
    bottomCaptionLine1: 'Precision,',
    bottomCaptionLine2: 'woven in cotton',
    ambientTint: 'rgba(145, 108, 72, 0.22)',
    productId: 'ts-hoodie-02',
  },
];

interface HeroSunCarouselProps {
  cartCount: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenStore: () => void;
  onQuickAddSlide: (slide: HeroSlide, selectedSize: string) => void;
}

// Slanted diagonal carousel variants:
// Forward (direction > 0): Enters from bottom-right corner queue (x: +38vw, y: +28vh, scale: 0.22)
// -> Center stage in front of the Sun (x: 0, y: 0, scale: 1)
// -> Exits diagonally out through the top-left edge (x: -44vw, y: -26vh, scale: 0.42)
const slantedProductVariants = {
  enter: (direction: number) =>
    direction >= 0
      ? {
          x: '36vw',
          y: '26vh',
          scale: 0.22,
          rotate: 8,
          opacity: 0.85,
          filter: 'blur(2px)',
        }
      : {
          x: '-42vw',
          y: '-25vh',
          scale: 0.42,
          rotate: -8,
          opacity: 0,
          filter: 'blur(6px)',
        },
  center: {
    x: '0vw',
    y: '0vh',
    scale: 1,
    rotate: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: (direction: number) =>
    direction >= 0
      ? {
          x: '-42vw',
          y: '-25vh',
          scale: 0.42,
          rotate: -8,
          opacity: 0,
          filter: 'blur(6px)',
          transition: {
            duration: 0.78,
            ease: [0.22, 1, 0.36, 1],
          },
        }
      : {
          x: '36vw',
          y: '26vh',
          scale: 0.22,
          rotate: 8,
          opacity: 0,
          filter: 'blur(3px)',
          transition: {
            duration: 0.78,
            ease: [0.22, 1, 0.36, 1],
          },
        },
};

export const HeroSunCarousel: React.FC<HeroSunCarouselProps> = ({
  cartCount,
  isMuted,
  onToggleMute,
  onOpenStore,
  onQuickAddSlide,
}) => {
  const [[activeIndex, direction], setSlideState] = useState<[number, number]>([0, 1]);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({
    'jacket-404': '36',
    'headphones-sand': '36',
    'tshirt-commit': '36',
  });
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [justAdded, setJustAdded] = useState<boolean>(false);

  const currentSlide = HERO_SLIDES[activeIndex];
  const nextIndex = (activeIndex + 1) % HERO_SLIDES.length;
  const nextSlide = HERO_SLIDES[nextIndex];
  const currentSize = selectedSizes[currentSlide.id] || '36';

  const paginate = (newDirection: number) => {
    soundEngine.playClick(newDirection > 0 ? 1.15 : 0.92);
    setSlideState(([prevIdx]) => {
      const nextIdx = (prevIdx + newDirection + HERO_SLIDES.length) % HERO_SLIDES.length;
      return [nextIdx, newDirection];
    });
  };

  const selectSlideDirectly = (targetIdx: number) => {
    if (targetIdx === activeIndex) return;
    const dir = targetIdx > activeIndex ? 1 : -1;
    soundEngine.playClick(1.1);
    setSlideState([targetIdx, dir]);
  };

  const handleSizeSelect = (size: string) => {
    soundEngine.playClick(1.25);
    setSelectedSizes((prev) => ({ ...prev, [currentSlide.id]: size }));
  };

  const handleGetTheLook = () => {
    soundEngine.playAddToBagChord();
    onQuickAddSlide(currentSlide, currentSize);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative z-20 flex h-full w-full flex-col justify-between px-6 py-6 sm:px-12 sm:py-8 lg:px-16 lg:py-10 select-none overflow-hidden"
    >
      {/* Subtle Ambient Color Wash that shifts with each product while keeping the real Sun blazing in the center */}
      <div
        className="pointer-events-none absolute inset-0 transition-colors duration-700"
        style={{
          background: `radial-gradient(circle at 50% 34%, rgba(255, 250, 230, 0.04) 0%, ${currentSlide.ambientTint} 58%, rgba(28, 16, 8, 0.42) 100%)`,
        }}
      />

      {/* =====================================================================
          TOP NAVIGATION BAR (Matches Reference Layout)
      ====================================================================== */}
      <header className="relative z-30 flex w-full items-center justify-between">
        {/* Top-Left: Brand Crest + Name */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded bg-white/95 p-0.5 shadow-md">
            <img
              src="/images/thissoftware-logo.jpg"
              alt="thissoftware logo"
              className="h-full w-full object-contain"
            />
          </div>
          <span className="font-display text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-white drop-shadow-sm">
            THISSOFTWARE
          </span>
        </div>

        {/* Top-Center: Frosted Pill Navigation */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-white/15 bg-black/25 px-2.5 py-2 backdrop-blur-md shadow-lg">
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={slide.id}
                onClick={() => selectSlideDirectly(idx)}
                className={`rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] transition-all duration-300 ${
                  isActive
                    ? 'bg-white text-[#1F140C] shadow-sm'
                    : 'text-white/85 hover:bg-white/10 hover:text-white'
                }`}
              >
                {slide.navLabel}
              </button>
            );
          })}
          <button
            onClick={onOpenStore}
            className="rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/85 transition-all hover:bg-white/10 hover:text-white"
          >
            ALL PRODUCTS
          </button>
        </nav>

        {/* Top-Right: Circular Icon Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenStore}
            title="Open Store & Bag"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white/90 backdrop-blur-md transition hover:bg-black/50 active:scale-95"
          >
            <ShoppingCart className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-bold text-[#1F140C]">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              soundEngine.playClick(1.2);
              setLikedIds((prev) => ({ ...prev, [currentSlide.id]: !prev[currentSlide.id] }));
            }}
            title="Save to Wishlist"
            className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/15 backdrop-blur-md transition active:scale-95 ${
              likedIds[currentSlide.id]
                ? 'bg-white text-[#D9534F]'
                : 'bg-black/30 text-white/90 hover:bg-black/50'
            }`}
          >
            <Heart
              className="h-4 w-4"
              fill={likedIds[currentSlide.id] ? 'currentColor' : 'none'}
            />
          </button>

          <button
            onClick={onToggleMute}
            title={isMuted ? 'Unmute Desert Audio' : 'Mute Desert Audio'}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white/90 backdrop-blur-md transition hover:bg-black/50 active:scale-95"
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-white/60" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* =====================================================================
          MAIN 3-COLUMN HERO STAGE (Left Editorial, Center Sun Cutout, Right Price/Size)
      ====================================================================== */}
      <div className="relative z-20 my-auto grid grid-cols-1 items-center gap-6 md:grid-cols-12">
        {/* LEFT COLUMN: Arrows + Big Headline + Story Copy + "Get the look >" */}
        <div className="order-2 md:order-1 md:col-span-4 flex flex-col items-start text-left">
          {/* Circular < > Carousel Buttons */}
          <div className="mb-4 flex items-center gap-2.5">
            <button
              onClick={() => paginate(-1)}
              aria-label="Previous product"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white backdrop-blur-md transition hover:bg-white hover:text-[#1F140C] active:scale-90"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => paginate(1)}
              aria-label="Next product"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white backdrop-blur-md transition hover:bg-white hover:text-[#1F140C] active:scale-90"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id + '-text'}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.42, ease: 'easeOut' }}
              className="flex flex-col items-start"
            >
              <h1 className="font-display text-3xl sm:text-4xl lg:text-[46px] font-bold leading-[1.08] tracking-[-0.02em] text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.28)]">
                {currentSlide.headlineLine1}
                <br />
                {currentSlide.headlineLine2}
              </h1>

              <p className="mt-4 max-w-sm text-xs sm:text-[13px] leading-[1.6] text-white/85 drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
                {currentSlide.description}
              </p>

              <button
                onClick={handleGetTheLook}
                className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-2.5 text-xs font-semibold text-[#1F140C] shadow-[0_10px_28px_rgba(0,0,0,0.22)] transition-all hover:scale-105 hover:bg-[#FFF9F0] active:scale-95"
              >
                <span>{justAdded ? 'Added to bag ✓' : 'Get the look'}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CENTER COLUMN: Transparent Cutout Gliding Slanted in Front of the Blazing Sun */}
        <div className="order-1 md:order-2 md:col-span-4 relative flex flex-col items-center justify-center min-h-[290px] sm:min-h-[390px] lg:min-h-[440px]">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentSlide.id}
              custom={direction}
              variants={slantedProductVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="relative flex flex-col items-center justify-center"
            >
              {/* Gentle continuous levitation in front of the Sun */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative flex items-center justify-center"
              >
                {/* Warm Solar Rim Glow behind the cutout so it blends with the Sun */}
                <div
                  className="pointer-events-none absolute inset-6 rounded-full blur-2xl opacity-55"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(255, 238, 185, 0.55) 0%, rgba(235, 155, 56, 0.18) 60%, transparent 100%)',
                  }}
                />
                <img
                  src={currentSlide.image}
                  alt={currentSlide.navLabel}
                  draggable={false}
                  className="relative z-10 h-[260px] sm:h-[360px] lg:h-[420px] w-auto object-contain select-none"
                  style={{
                    filter:
                      'drop-shadow(0 22px 34px rgba(32, 16, 6, 0.42)) drop-shadow(0 0 28px rgba(255, 225, 155, 0.25))',
                  }}
                />
              </motion.div>

              {/* Floating Ground Contact Shadow (scales subtly as the product levitates) */}
              <motion.div
                animate={{
                  scaleX: [1, 0.88, 1],
                  opacity: [0.58, 0.4, 0.58],
                }}
                transition={{
                  duration: 4.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="mt-2 h-4 w-48 sm:w-60 rounded-[100%] bg-[#1E1006]/75 blur-md"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: Price + Struck Compare Price + Circular Size Selector */}
        <div className="order-3 md:col-span-4 flex flex-col items-start md:items-end justify-center text-left md:text-right">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id + '-price'}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.38, ease: 'easeOut' }}
              className="flex flex-col items-start md:items-end"
            >
              <div className="font-display text-3xl sm:text-4xl lg:text-[42px] font-semibold tracking-tight text-white drop-shadow-sm">
                ${currentSlide.price}
              </div>
              <div className="relative mt-0.5 font-display text-xl sm:text-2xl font-medium text-white/75">
                <span>${currentSlide.oldPrice}</span>
                <span className="absolute left-[-6%] right-[-6%] top-1/2 h-[2px] -translate-y-1/2 bg-white/90" />
              </div>

              <div className="mt-7 flex flex-col items-start md:items-end">
                <span className="mb-3 text-xs font-medium text-white/85 drop-shadow-sm">
                  Choose your size:
                </span>
                <div className="flex items-center gap-2.5">
                  {currentSlide.sizes.map((size) => {
                    const isSelected = currentSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => handleSizeSelect(size)}
                        className={`flex h-11 w-11 items-center justify-center rounded-full text-xs font-semibold transition-all duration-200 ${
                          isSelected
                            ? 'bg-white text-[#1F140C] shadow-[0_6px_20px_rgba(0,0,0,0.28)] scale-105'
                            : 'bg-black/30 text-white/85 border border-white/15 hover:bg-black/45 hover:text-white'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* =====================================================================
          BOTTOM BAR: Social Links (Left), Center Caption, Next-Slide Miniature Preview (Right)
      ====================================================================== */}
      <footer className="relative z-30 flex w-full items-end justify-between">
        {/* Bottom-Left: Minimal Icons */}
        <div className="hidden sm:flex items-center gap-5 text-white/80">
          <a
            href="#instagram"
            onClick={(e) => {
              e.preventDefault();
              soundEngine.playClick(1.0);
            }}
            className="transition hover:text-white hover:scale-110"
            aria-label="Instagram"
          >
            <Instagram className="h-4 w-4" />
          </a>
          <a
            href="#globe"
            onClick={(e) => {
              e.preventDefault();
              soundEngine.playClick(1.0);
            }}
            className="transition hover:text-white hover:scale-110"
            aria-label="Website"
          >
            <Globe className="h-4 w-4" />
          </a>
          <a
            href="#terminal"
            onClick={(e) => {
              e.preventDefault();
              soundEngine.playClick(1.0);
            }}
            className="transition hover:text-white hover:scale-110"
            aria-label="Developer Specs"
          >
            <Terminal className="h-4 w-4" />
          </a>
          <a
            href="#store"
            onClick={(e) => {
              e.preventDefault();
              onOpenStore();
            }}
            className="text-xs font-semibold tracking-wider transition hover:text-white"
          >
            Be
          </a>
        </div>

        {/* Bottom-Center: Two-Line Poetic Tagline underneath the Floating Shadow */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id + '-caption'}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="mx-auto text-center text-xs sm:text-sm font-medium leading-snug text-white/90 drop-shadow-sm"
          >
            <div>{currentSlide.bottomCaptionLine1}</div>
            <div>{currentSlide.bottomCaptionLine2}</div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom-Right: Miniature Floating Cutout of the NEXT Product in the Slanted Queue */}
        <div className="relative flex flex-col items-center">
          <motion.button
            key={nextSlide.id + '-preview'}
            initial={{ opacity: 0, x: 24, y: 16, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => paginate(1)}
            title={`Next: ${nextSlide.navLabel}`}
            className="group relative flex flex-col items-center focus:outline-none"
          >
            <img
              src={nextSlide.image}
              alt={`Next: ${nextSlide.navLabel}`}
              className="h-20 sm:h-24 w-auto object-contain transition-transform duration-300 group-hover:-translate-y-2 group-hover:scale-110"
              style={{
                filter: 'drop-shadow(0 10px 16px rgba(24, 12, 4, 0.45))',
              }}
            />
            <div className="mt-1 h-2 w-14 rounded-full bg-black/50 blur-[3px] transition-all duration-300 group-hover:w-12 group-hover:opacity-40" />
          </motion.button>
        </div>
      </footer>
    </motion.div>
  );
};
