import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
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
  ArrowDown,
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
    productId: 'ts-ap2-jacket',
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
    productId: 'ts-h1-headphones',
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
    productId: 'ts-ap1-hoodie',
  },
];

interface HeroSunCarouselProps {
  cartCount: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenStore: () => void;
  onQuickAddSlide: (slide: HeroSlide, selectedSize: string) => void;
}

export const HeroSunCarousel: React.FC<HeroSunCarouselProps> = ({
  cartCount,
  isMuted,
  onToggleMute,
  onOpenStore,
  onQuickAddSlide,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [outgoingSlide, setOutgoingSlide] = useState<HeroSlide | null>(null);
  const [slideDirection, setSlideDirection] = useState<number>(1);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({
    'jacket-404': '36',
    'headphones-sand': '36',
    'tshirt-commit': '36',
  });
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [justAdded, setJustAdded] = useState<boolean>(false);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const activeProductWrapRef = useRef<HTMLDivElement | null>(null);
  const activeProductFloatRef = useRef<HTMLDivElement | null>(null);
  const activeShadowRef = useRef<HTMLDivElement | null>(null);
  const outgoingProductWrapRef = useRef<HTMLDivElement | null>(null);
  const isAnimatingSlide = useRef<boolean>(false);

  const currentSlide = HERO_SLIDES[activeIndex];
  const nextIndex = (activeIndex + 1) % HERO_SLIDES.length;
  const nextSlide = HERO_SLIDES[nextIndex];
  const currentSize = selectedSizes[currentSlide.id] || '36';

  // =========================================================================
  // 1. MASTER GSAP MULTI-DIRECTIONAL ENTRANCE TIMELINE (Runs right after Video Ends)
  // =========================================================================
  useLayoutEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      // Immediately hide and offset all elements off-screen in their respective directions
      // so the user first sees the pure blazing sun when the video ends, then everything slides in!
      gsap.set('.gsap-ambient-wash', { autoAlpha: 0 });
      gsap.set(activeProductWrapRef.current, {
        x: '45vw',
        y: '35vh',
        scale: 0.18,
        rotation: 14,
        autoAlpha: 0,
      });
      gsap.set(activeShadowRef.current, { scaleX: 0.1, autoAlpha: 0 });
      gsap.set('.gsap-brand-left', { x: -160, y: -40, autoAlpha: 0 });
      gsap.set('.gsap-top-nav', { y: -130, scale: 0.88, autoAlpha: 0 });
      gsap.set('.gsap-top-nav-pill', { y: -30, autoAlpha: 0 });
      gsap.set('.gsap-top-right-icon', { x: 160, y: -40, scale: 0.6, autoAlpha: 0 });
      gsap.set('.gsap-left-arrow', { x: -180, scale: 0.6, autoAlpha: 0 });
      gsap.set('.gsap-left-headline-line', { x: -240, y: 28, skewX: 8, autoAlpha: 0 });
      gsap.set('.gsap-left-desc', { x: -200, y: 36, autoAlpha: 0 });
      gsap.set('.gsap-left-cta', { x: -160, y: 50, scale: 0.85, autoAlpha: 0 });
      gsap.set('.gsap-right-price', { x: 240, y: -20, autoAlpha: 0 });
      gsap.set('.gsap-right-size-label', { x: 180, y: 25, autoAlpha: 0 });
      gsap.set('.gsap-right-size-btn', { x: 190, y: 48, scale: 0.55, autoAlpha: 0 });
      gsap.set('.gsap-bottom-social', { x: -120, y: 85, autoAlpha: 0 });
      gsap.set('.gsap-bottom-caption', { y: 110, autoAlpha: 0 });
      gsap.set('.gsap-bottom-right-preview', {
        x: 190,
        y: 140,
        scale: 0.25,
        rotation: 16,
        autoAlpha: 0,
      });

      const tl = gsap.timeline({
        defaults: { ease: 'expo.out' },
        delay: 0.22, // Hold on the pure blazing sun for a beat after the video finishes
      });

      // Ambient color wash softly blooms in
      tl.to(
        '.gsap-ambient-wash',
        { autoAlpha: 1, duration: 1.5, ease: 'power2.out' },
        0
      );

      // 1. Center Product Cutout glides in along a slanted diagonal from Bottom-Right -> Center
      tl.to(
        activeProductWrapRef.current,
        {
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          autoAlpha: 1,
          duration: 1.45,
          ease: 'expo.out',
        },
        0.05
      );

      // Ground contact shadow expands beneath the floating cutout
      tl.to(
        activeShadowRef.current,
        { scaleX: 1, autoAlpha: 0.58, duration: 1.3, ease: 'expo.out' },
        0.2
      );

      // 2. Top-Left Brand Crest slides in from Top-Left (-X, -Y)
      tl.to(
        '.gsap-brand-left',
        { x: 0, y: 0, autoAlpha: 1, duration: 1.2 },
        0.15
      );

      // 3. Top-Center Frosted Capsule Nav drops down from Top Edge (-Y)
      tl.to(
        '.gsap-top-nav',
        { y: 0, scale: 1, autoAlpha: 1, duration: 1.25, ease: 'expo.out' },
        0.2
      );

      tl.to(
        '.gsap-top-nav-pill',
        { y: 0, autoAlpha: 1, duration: 0.85, stagger: 0.07, ease: 'power3.out' },
        0.34
      );

      // 4. Top-Right Circular Action Icons slide in from Right Edge (+X, -Y)
      tl.to(
        '.gsap-top-right-icon',
        {
          x: 0,
          y: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 1.1,
          stagger: 0.08,
          ease: 'back.out(1.5)',
        },
        0.24
      );

      // 5. Left Column: < > Arrow buttons + Headline + Copy + CTA slide in from Far Left (-X)
      tl.to(
        '.gsap-left-arrow',
        {
          x: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 1.05,
          stagger: 0.09,
          ease: 'back.out(1.5)',
        },
        0.3
      );

      tl.to(
        '.gsap-left-headline-line',
        {
          x: 0,
          y: 0,
          skewX: 0,
          autoAlpha: 1,
          duration: 1.25,
          stagger: 0.12,
          ease: 'expo.out',
        },
        0.38
      );

      tl.to(
        '.gsap-left-desc',
        { x: 0, y: 0, autoAlpha: 1, duration: 1.15, ease: 'power3.out' },
        0.54
      );

      tl.to(
        '.gsap-left-cta',
        { x: 0, y: 0, scale: 1, autoAlpha: 1, duration: 1.1, ease: 'back.out(1.5)' },
        0.66
      );

      // 6. Right Column: Price + Compare Price + Size Buttons slide in from Far Right (+X)
      tl.to(
        '.gsap-right-price',
        {
          x: 0,
          y: 0,
          autoAlpha: 1,
          duration: 1.2,
          stagger: 0.1,
          ease: 'expo.out',
        },
        0.4
      );

      tl.to(
        '.gsap-right-size-label',
        { x: 0, y: 0, autoAlpha: 1, duration: 1.05 },
        0.54
      );

      tl.to(
        '.gsap-right-size-btn',
        {
          x: 0,
          y: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 1.05,
          stagger: 0.09,
          ease: 'back.out(1.6)',
        },
        0.6
      );

      // 7. Bottom Bar: Socials from Bottom-Left, Caption from Bottom, Preview Cutout from Bottom-Right
      tl.to(
        '.gsap-bottom-social',
        {
          x: 0,
          y: 0,
          autoAlpha: 1,
          duration: 1.0,
          stagger: 0.07,
          ease: 'power3.out',
        },
        0.64
      );

      tl.to(
        '.gsap-bottom-caption',
        { y: 0, autoAlpha: 1, duration: 1.15, ease: 'expo.out' },
        0.68
      );

      tl.to(
        '.gsap-bottom-right-preview',
        {
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          autoAlpha: 1,
          duration: 1.3,
          ease: 'expo.out',
        },
        0.72
      );

      // Continuous subtle floating levitation loop on the center product
      gsap.to(activeProductFloatRef.current, {
        y: -11,
        duration: 2.3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // =========================================================================
  // AUTOMATIC 15-SECOND CAROUSEL ROTATION
  // Automatically advances through the hero objects on its own every 15s
  // =========================================================================
  useEffect(() => {
    const timer = setInterval(() => {
      const nextIdx = (activeIndex + 1) % HERO_SLIDES.length;
      triggerSlideTransition(nextIdx, 1);
    }, 15000);

    return () => clearInterval(timer);
  }, [activeIndex]);

  // =========================================================================
  // 2. GSAP SLANTED DIAGONAL TRANSITION & MULTI-DIRECTIONAL TEXT SLIDE ON CHANGE
  // =========================================================================
  const triggerSlideTransition = (targetIndex: number, dir: number) => {
    if (isAnimatingSlide.current || targetIndex === activeIndex) return;
    isAnimatingSlide.current = true;

    const prevSlide = HERO_SLIDES[activeIndex];
    setSlideDirection(dir);
    setOutgoingSlide(prevSlide);
    setActiveIndex(targetIndex);

    requestAnimationFrame(() => {
      if (!rootRef.current) {
        isAnimatingSlide.current = false;
        return;
      }

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { ease: 'expo.out' },
          onComplete: () => {
            setOutgoingSlide(null);
            isAnimatingSlide.current = false;
          },
        });

        // Outgoing center cutout glides out along the slanted vector:
        // If advancing (dir >= 0): Center -> Top-Left (-42vw, -25vh)
        // If reversing (dir < 0): Center -> Bottom-Right (+36vw, +26vh)
        if (outgoingProductWrapRef.current) {
          tl.fromTo(
            outgoingProductWrapRef.current,
            { x: 0, y: 0, scale: 1, rotation: 0, autoAlpha: 1 },
            {
              x: dir >= 0 ? '-42vw' : '36vw',
              y: dir >= 0 ? '-25vh' : '26vh',
              scale: dir >= 0 ? 0.42 : 0.22,
              rotation: dir >= 0 ? -8 : 8,
              autoAlpha: 0,
              duration: 0.85,
              ease: 'expo.out',
            },
            0
          );
        }

        // Incoming center cutout glides in along the slanted vector:
        // If advancing (dir >= 0): Bottom-Right Queue (+36vw, +26vh, scale 0.22) -> Center (0, 0, scale 1)
        // If reversing (dir < 0): Top-Left (-42vw, -25vh, scale 0.42) -> Center (0, 0, scale 1)
        if (activeProductWrapRef.current) {
          tl.fromTo(
            activeProductWrapRef.current,
            {
              x: dir >= 0 ? '36vw' : '-42vw',
              y: dir >= 0 ? '26vh' : '-25vh',
              scale: dir >= 0 ? 0.22 : 0.42,
              rotation: dir >= 0 ? 8 : -8,
              autoAlpha: 0.85,
            },
            {
              x: 0,
              y: 0,
              scale: 1,
              rotation: 0,
              autoAlpha: 1,
              duration: 0.92,
              ease: 'expo.out',
            },
            0
          );
        }

        // Left editorial text slides in from Left (-X)
        tl.fromTo(
          '.gsap-left-headline-line',
          { x: -75, y: 12, autoAlpha: 0 },
          { x: 0, y: 0, autoAlpha: 1, duration: 0.78, stagger: 0.07 },
          0.08
        );
        tl.fromTo(
          '.gsap-left-desc',
          { x: -60, y: 16, autoAlpha: 0 },
          { x: 0, y: 0, autoAlpha: 1, duration: 0.75 },
          0.16
        );

        // Right price & sizes slide in from Right (+X)
        tl.fromTo(
          '.gsap-right-price',
          { x: 75, y: -10, autoAlpha: 0 },
          { x: 0, y: 0, autoAlpha: 1, duration: 0.78, stagger: 0.06 },
          0.08
        );
        tl.fromTo(
          '.gsap-right-size-btn',
          { x: 55, y: 18, scale: 0.8, autoAlpha: 0 },
          { x: 0, y: 0, scale: 1, autoAlpha: 1, duration: 0.7, stagger: 0.06, ease: 'back.out(1.5)' },
          0.14
        );

        // Bottom caption slides up from Bottom (+Y)
        tl.fromTo(
          '.gsap-bottom-caption',
          { y: 34, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.75 },
          0.12
        );

        // Bottom-Right miniature preview slides in from Bottom-Right corner (+X, +Y)
        tl.fromTo(
          '.gsap-bottom-right-preview',
          { x: 75, y: 55, scale: 0.45, rotation: 10, autoAlpha: 0 },
          { x: 0, y: 0, scale: 1, rotation: 0, autoAlpha: 1, duration: 0.85 },
          0.12
        );
      }, rootRef);
    });
  };

  const paginate = (newDirection: number) => {
    soundEngine.playClick(newDirection > 0 ? 1.15 : 0.92);
    const nextIdx = (activeIndex + newDirection + HERO_SLIDES.length) % HERO_SLIDES.length;
    triggerSlideTransition(nextIdx, newDirection);
  };

  const selectSlideDirectly = (targetIdx: number) => {
    if (targetIdx === activeIndex) return;
    const dir = targetIdx > activeIndex ? 1 : -1;
    soundEngine.playClick(1.1);
    triggerSlideTransition(targetIdx, dir);
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
    <div
      ref={rootRef}
      className="relative z-20 flex h-full w-full flex-col justify-between px-6 py-6 sm:px-12 sm:py-8 lg:px-16 lg:py-10 select-none overflow-hidden"
    >
      {/* Subtle Luminous Ambient Lift that breathes gently with each product */}
      <div
        className="gsap-ambient-wash pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          background: 'radial-gradient(circle at 50% 38%, rgba(246, 242, 234, 0.06) 0%, transparent 68%)',
        }}
      />

      {/* =====================================================================
          TOP NAVIGATION BAR (Slides in from Left, Top, and Right)
      ====================================================================== */}
      <header className="relative z-30 flex w-full items-center justify-between">
        {/* Top-Left: Brand Crest + Name */}
        <div
          onClick={onOpenStore}
          className="gsap-brand-left flex items-center gap-2.5 cursor-pointer group"
          title="Explore Store"
        >
          <img
            src="/images/thissoftware-emblem-transparent.png"
            alt="thissoftware"
            className="h-7 w-7 object-contain drop-shadow-sm transition-transform group-hover:scale-105"
          />
          <span className="font-display text-base sm:text-lg font-extrabold tracking-[-0.035em] text-[#F6F2EA] group-hover:text-[#FFCC70] transition-colors">
            thissoftwarestore
          </span>
        </div>

        {/* Top-Center: Frosted Pill Navigation (Drops in from Top Edge) */}
        <nav className="gsap-top-nav hidden md:flex items-center gap-1 rounded-full border border-white/15 bg-black/25 px-2.5 py-2 backdrop-blur-md shadow-lg">
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={slide.id}
                onClick={() => selectSlideDirectly(idx)}
                className={`gsap-top-nav-pill rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors duration-300 ${
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
            className="gsap-top-nav-pill rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/85 transition-colors hover:bg-white/10 hover:text-white"
          >
            ALL PRODUCTS
          </button>
        </nav>

        {/* Top-Right: Circular Icon Controls (Slide in from Right Edge) */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenStore}
            title="Open Store & Bag"
            className="gsap-top-right-icon relative flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white/90 backdrop-blur-md transition hover:bg-black/50 active:scale-95"
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
            className={`gsap-top-right-icon flex h-9 w-9 items-center justify-center rounded-full border border-white/15 backdrop-blur-md transition active:scale-95 ${
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
            className="gsap-top-right-icon flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white/90 backdrop-blur-md transition hover:bg-black/50 active:scale-95"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4 text-white/60" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </header>

      {/* =====================================================================
          MAIN 3-COLUMN HERO STAGE (Left Editorial, Center Sun Cutout, Right Price/Size)
      ====================================================================== */}
      <div className="relative z-20 my-auto grid grid-cols-1 items-center gap-6 md:grid-cols-12">
        {/* LEFT COLUMN: Arrows + Big Headline + Story Copy + "Get the look >" (Slides in from Left) */}
        <div className="order-2 md:order-1 md:col-span-4 flex flex-col items-start text-left">
          <div className="mb-4 flex items-center gap-2.5">
            <button
              onClick={() => paginate(-1)}
              aria-label="Previous product"
              className="gsap-left-arrow flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white backdrop-blur-md transition hover:bg-white hover:text-[#1F140C] active:scale-90"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => paginate(1)}
              aria-label="Next product"
              className="gsap-left-arrow flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white backdrop-blur-md transition hover:bg-white hover:text-[#1F140C] active:scale-90"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-col items-start">
            <h1 className="font-display text-3xl sm:text-4xl lg:text-[46px] font-bold leading-[1.08] tracking-[-0.02em] text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.28)]">
              <span className="gsap-left-headline-line block">{currentSlide.headlineLine1}</span>
              <span className="gsap-left-headline-line block">{currentSlide.headlineLine2}</span>
            </h1>

            <p className="gsap-left-desc mt-4 max-w-sm text-xs sm:text-[13px] leading-[1.6] text-white/85 drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
              {currentSlide.description}
            </p>

            <button
              onClick={handleGetTheLook}
              className="gsap-left-cta mt-6 inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-2.5 text-xs font-semibold text-[#1F140C] shadow-[0_10px_28px_rgba(0,0,0,0.22)] transition-transform hover:scale-105 hover:bg-[#FFF9F0] active:scale-95"
            >
              <span>{justAdded ? 'Added to bag ✓' : 'Get the look'}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* CENTER COLUMN: Transparent Cutout Gliding Slanted in Front of the Blazing Sun */}
        <div className="order-1 md:order-2 md:col-span-4 relative flex flex-col items-center justify-center min-h-[290px] sm:min-h-[390px] lg:min-h-[440px]">
          {/* Outgoing Product Cutout (Gliding diagonally out during slide change) */}
          {outgoingSlide && (
            <div
              ref={outgoingProductWrapRef}
              key={outgoingSlide.id + '-outgoing-' + slideDirection}
              className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
            >
              <img
                src={outgoingSlide.image}
                alt={outgoingSlide.navLabel}
                draggable={false}
                className="h-[260px] sm:h-[360px] lg:h-[420px] w-auto object-contain select-none"
                style={{
                  filter: 'drop-shadow(0 22px 34px rgba(32, 16, 6, 0.42))',
                }}
              />
            </div>
          )}

          {/* Active Product Cutout (Glides diagonally in from Bottom-Right -> Center) */}
          <div
            ref={activeProductWrapRef}
            className="relative flex flex-col items-center justify-center will-change-transform"
          >
            <div ref={activeProductFloatRef} className="relative flex items-center justify-center">
              {/* Warm Soft Ambient Glow behind the cutout */}
              <div
                className="pointer-events-none absolute inset-6 rounded-full blur-2xl opacity-30"
                style={{
                  background:
                    'radial-gradient(circle, rgba(255, 238, 185, 0.4) 0%, rgba(235, 155, 56, 0.12) 60%, transparent 100%)',
                }}
              />
              <img
                src={currentSlide.image}
                alt={currentSlide.navLabel}
                draggable={false}
                className="relative z-10 h-[260px] sm:h-[360px] lg:h-[420px] w-auto object-contain select-none"
                style={{
                  filter:
                    'drop-shadow(0 20px 32px rgba(25, 35, 25, 0.35)) drop-shadow(0 0 20px rgba(255, 235, 180, 0.15))',
                }}
              />
            </div>

            {/* Floating Ground Contact Shadow */}
            <div
              ref={activeShadowRef}
              className="mt-2 h-4 w-48 sm:w-60 rounded-[100%] bg-[#1A2518]/45 blur-md"
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Price + Struck Compare Price + Circular Size Selector (Slides in from Right) */}
        <div className="order-3 md:col-span-4 flex flex-col items-start md:items-end justify-center text-left md:text-right">
          <div className="flex flex-col items-start md:items-end">
            <div className="gsap-right-price font-display text-3xl sm:text-4xl lg:text-[42px] font-semibold tracking-tight text-white drop-shadow-sm">
              ${currentSlide.price}
            </div>
            <div className="gsap-right-price relative mt-0.5 font-display text-xl sm:text-2xl font-medium text-white/75">
              <span>${currentSlide.oldPrice}</span>
              <span className="absolute left-[-6%] right-[-6%] top-1/2 h-[2px] -translate-y-1/2 bg-white/90" />
            </div>

            <div className="mt-7 flex flex-col items-start md:items-end">
              <span className="gsap-right-size-label mb-3 text-xs font-medium text-white/85 drop-shadow-sm">
                Choose your size:
              </span>
              <div className="flex items-center gap-2.5">
                {currentSlide.sizes.map((size) => {
                  const isSelected = currentSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => handleSizeSelect(size)}
                      className={`gsap-right-size-btn flex h-11 w-11 items-center justify-center rounded-full text-xs font-semibold transition-colors duration-200 ${
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
          </div>
        </div>
      </div>

      {/* =====================================================================
          BOTTOM BAR: Social Links (Bottom-Left), Center Caption (Bottom), Next-Slide Preview (Bottom-Right)
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
            className="gsap-bottom-social transition hover:text-white hover:scale-110"
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
            className="gsap-bottom-social transition hover:text-white hover:scale-110"
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
            className="gsap-bottom-social transition hover:text-white hover:scale-110"
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
            className="gsap-bottom-social text-xs font-semibold tracking-wider transition hover:text-white"
          >
            Be
          </a>
        </div>

        {/* Bottom-Center: Two-Line Poetic Tagline + Single Non-Overlapping Explore Store Cue */}
        <div className="gsap-bottom-caption mx-auto flex flex-col items-center text-center">
          <div className="text-xs sm:text-sm font-medium leading-snug text-white/90 drop-shadow-sm">
            <span>{currentSlide.bottomCaptionLine1}</span>{' '}
            <span className="text-white/70">{currentSlide.bottomCaptionLine2}</span>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              soundEngine.playClick(1.0);
              onOpenStore();
            }}
            className="mt-2 flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-[#FFCC70] hover:text-white hover:bg-white/10 transition-all cursor-pointer group"
          >
            <span>EXPLORE STORE</span>
            <ArrowDown className="h-3 w-3 animate-bounce text-[#FFCC70]" />
          </button>
        </div>

        {/* Bottom-Right: Miniature Floating Cutout of the NEXT Product in the Slanted Queue */}
        <div className="relative flex flex-col items-center">
          <button
            onClick={() => paginate(1)}
            title={`Next: ${nextSlide.navLabel}`}
            className="gsap-bottom-right-preview group relative flex flex-col items-center focus:outline-none will-change-transform"
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
          </button>
        </div>
      </footer>
    </div>
  );
};
