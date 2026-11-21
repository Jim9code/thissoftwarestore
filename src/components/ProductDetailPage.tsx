import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Minus,
  ShoppingBag,
  Volume2,
  VolumeX,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Ruler,
  X,
  Sun,
  Moon,
} from 'lucide-react';
import { Product, PRODUCTS } from '../data/products';
import { soundEngine } from '../utils/soundEngine';

interface ProductReview {
  id: string;
  author: string;
  rating: number;
  headline: string;
  body: string;
  variantLabel?: string;
  createdAt: string;
}

interface ProductDetailPageProps {
  product: Product;
  initialFinishIdx?: number;
  onBackToStore: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, finishName: string, size?: string, quantity?: number) => void;
  onOpenBag: () => void;
  cartCount: number;
  isMuted: boolean;
  onToggleMute: () => void;
  isDark?: boolean;
  onToggleDark?: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  initialFinishIdx = 0,
  onBackToStore,
  onSelectProduct,
  onAddToCart,
  onOpenBag,
  cartCount,
  isMuted,
  onToggleMute,
  isDark = false,
  onToggleDark,
}) => {
  // Gallery state
  const galleryImages =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.image];
  const initialImgIdx = Math.max(
    0,
    galleryImages.indexOf(product.finishes[initialFinishIdx]?.image || product.image)
  );
  const [selectedImageIdx, setSelectedImageIdx] = useState<number>(initialImgIdx);

  // Configuration state
  const [selectedFinishIdx, setSelectedFinishIdx] = useState<number>(initialFinishIdx);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [justAdded, setJustAdded] = useState<boolean>(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);

  // Accordions state
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    details: true,
    materials: false,
    shipping: false,
    soundscape: false,
  });

  // Soundscape playback state
  const [isPlayingSoundscape, setIsPlayingSoundscape] = useState<boolean>(false);

  // Community reviews state (persisted per product)
  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    try {
      const saved = window.localStorage.getItem(`syntaxwear-reviews-${product.id}`);
      return saved ? (JSON.parse(saved) as ProductReview[]) : [];
    } catch {
      return [];
    }
  });
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [isWritingReview, setIsWritingReview] = useState<boolean>(false);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewAuthor, setReviewAuthor] = useState<string>('');
  const [reviewHeadline, setReviewHeadline] = useState<string>('');
  const [reviewBody, setReviewBody] = useState<string>('');

  // Reset image, config, and load product reviews when product changes
  useEffect(() => {
    const startFinishIdx = Math.min(initialFinishIdx, Math.max(0, product.finishes.length - 1));
    const startImg = product.finishes[startFinishIdx]?.image || product.image;
    const matchIdx = galleryImages.indexOf(startImg);
    setSelectedImageIdx(matchIdx !== -1 ? matchIdx : 0);
    setSelectedFinishIdx(startFinishIdx);
    setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : '');
    setQuantity(1);
    setJustAdded(false);
    setIsPlayingSoundscape(false);
    setIsSizeGuideOpen(false);
    setStarFilter(null);
    setIsWritingReview(false);
    try {
      const saved = window.localStorage.getItem(`syntaxwear-reviews-${product.id}`);
      setReviews(saved ? (JSON.parse(saved) as ProductReview[]) : []);
    } catch {
      setReviews([]);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  const toggleAccordion = (key: string) => {
    soundEngine.playClick(1.1);
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleThumbnailClick = (idx: number) => {
    soundEngine.playClick(1.05);
    setSelectedImageIdx(idx);
    if (idx < product.finishes.length) {
      setSelectedFinishIdx(idx);
    }
  };

  const handleFinishSelect = (idx: number) => {
    soundEngine.playClick(1.1);
    setSelectedFinishIdx(idx);
    const finishImg = product.finishes[idx]?.image;
    if (finishImg) {
      const matchIdx = galleryImages.indexOf(finishImg);
      if (matchIdx !== -1) {
        setSelectedImageIdx(matchIdx);
      }
    }
  };

  const handleSizeSelect = (size: string) => {
    soundEngine.playClick(1.1);
    setSelectedSize(size);
  };

  const maxStock = product.batchLeft ?? 20;
  const hasApparelSizeGuide = Boolean(
    product.sizes && product.sizes.some((s) => ['S', 'M', 'L', 'XL', 'XXL'].includes(s))
  );

  const handleQuantityDelta = (delta: number) => {
    soundEngine.playClick(0.9);
    setQuantity((prev) => Math.min(maxStock, Math.max(1, prev + delta)));
  };

  const handleAdd = () => {
    const finish = product.finishes[selectedFinishIdx]?.name || product.finishes[0]?.name;
    soundEngine.playAddToBagChord();
    onAddToCart(product, finish, selectedSize || undefined, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleToggleSoundscape = () => {
    if (isPlayingSoundscape) {
      soundEngine.stopProductMusic();
      setIsPlayingSoundscape(false);
    } else {
      soundEngine.startProductMusic(product.soundscape);
      setIsPlayingSoundscape(true);
    }
  };

  // 3 Curated Cross-sell products ("Objects that sit well together")
  const crossSellProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  const activeFinish = product.finishes[selectedFinishIdx] || product.finishes[0];

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;
  const filteredReviews =
    starFilter !== null ? reviews.filter((r) => r.rating === starFilter) : reviews;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    const author = reviewAuthor.trim();
    const body = reviewBody.trim();
    if (!author || !body) return;

    soundEngine.playAddToBagChord();
    const newReview: ProductReview = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      author,
      rating: reviewRating,
      headline: reviewHeadline.trim() || `${reviewRating}-star feedback`,
      body,
      variantLabel: [activeFinish?.name, selectedSize].filter(Boolean).join(' · ') || undefined,
      createdAt: new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }).format(new Date()),
    };

    const next = [newReview, ...reviews];
    setReviews(next);
    try {
      window.localStorage.setItem(`syntaxwear-reviews-${product.id}`, JSON.stringify(next));
    } catch {
      // Ignore storage quota errors
    }
    setReviewAuthor('');
    setReviewHeadline('');
    setReviewBody('');
    setReviewRating(5);
    setStarFilter(null);
    setIsWritingReview(false);
  };

  return (
    <div
      className={`relative min-h-[100dvh] w-full overflow-x-hidden selection:bg-[#546652] selection:text-[#F6F2EA] transition-colors duration-300 ${
        isDark ? 'bg-[#12100E] text-[#F6F2EA]' : 'bg-[#F6F2EA] text-[#2A1D15]'
      }`}
    >
      {/* Subtle Sand Linen Matrix Dotted Grid Pattern */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-70"
        style={{
          backgroundImage: `radial-gradient(circle, ${
            isDark ? 'rgba(246, 242, 234, 0.14)' : 'rgba(84, 102, 82, 0.18)'
          } 1.5px, transparent 1.5px)`,
          backgroundSize: '28px 28px',
          backgroundPosition: 'center center',
        }}
      />

      {/* =====================================================================
          STICKY TOP NAVIGATION BAR (Clean Linen Glass)
      ====================================================================== */}
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.48, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className={`sticky top-0 z-40 border-b backdrop-blur-xl transition-all ${
          isDark
            ? 'border-white/10 bg-[#12100E]/90'
            : 'border-[#2A1D15]/10 bg-[#F6F2EA]/92'
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-2 px-3.5 py-2.5 sm:px-8 sm:py-3">
          {/* Back to Collection / Store */}
          <button
            onClick={() => {
              soundEngine.playClick(0.9);
              onBackToStore();
            }}
            className={`group flex items-center gap-1.5 sm:gap-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em] sm:tracking-[0.2em] transition-colors shrink-0 ${
              isDark
                ? 'text-[#F6F2EA]/75 hover:text-[#F6F2EA]'
                : 'text-[#2A1D15]/75 hover:text-[#2A1D15]'
            }`}
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1 text-[#E59838]" />
            <span>
              <span className="hidden sm:inline">COLLECTION // </span>STORE
            </span>
          </button>

          {/* Center Brand Identity */}
          <div
            onClick={() => {
              soundEngine.playClick(0.9);
              onBackToStore();
            }}
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group min-w-0"
          >
            <img
              src="/images/thissoftware-emblem-transparent.png"
              alt="SyntaxWear"
              className="h-5 w-5 sm:h-6 sm:w-6 object-contain drop-shadow-sm transition-transform group-hover:scale-105 shrink-0"
            />
            <span
              className={`font-display text-sm sm:text-base font-extrabold tracking-[-0.035em] transition-colors truncate ${
                isDark
                  ? 'text-[#F6F2EA] group-hover:text-[#FFCC70]'
                  : 'text-[#2A1D15] group-hover:text-[#546652]'
              }`}
            >
              SyntaxWear
            </span>
          </div>

          {/* Right Action Cluster: Theme, Audio & Bag */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {onToggleDark && (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick(1.0);
                  onToggleDark();
                }}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border active:scale-95 transition-all ${
                  isDark
                    ? 'border-white/15 bg-white/10 text-[#F6F2EA] hover:bg-white/15'
                    : 'border-[#2A1D15]/15 bg-[#2A1D15]/5 text-[#2A1D15] hover:bg-[#2A1D15]/10'
                }`}
              >
                {isDark ? (
                  <Sun className="h-3.5 w-3.5 text-[#FFCC70]" />
                ) : (
                  <Moon className="h-3.5 w-3.5 text-[#2A1D15]" />
                )}
              </button>
            )}

            <button
              onClick={onToggleMute}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border active:scale-95 transition-all ${
                isDark
                  ? 'border-white/15 bg-white/10 text-[#F6F2EA] hover:bg-white/15'
                  : 'border-[#2A1D15]/15 bg-[#2A1D15]/5 text-[#2A1D15] hover:bg-[#2A1D15]/10'
              }`}
            >
              {isMuted ? (
                <VolumeX
                  className={`h-3.5 w-3.5 ${isDark ? 'text-[#F6F2EA]/50' : 'text-[#2A1D15]/50'}`}
                />
              ) : (
                <Volume2 className="h-3.5 w-3.5 text-[#E59838]" />
              )}
            </button>

            <button
              onClick={() => {
                soundEngine.playClick(1.05);
                onOpenBag();
              }}
              className={`group flex h-8 sm:h-9 items-center gap-1.5 sm:gap-2 rounded-full px-2.5 sm:px-3.5 font-mono text-[10px] uppercase tracking-wider shadow-sm active:scale-95 transition-all ${
                isDark
                  ? 'bg-[#F6F2EA] text-[#181614] hover:bg-white'
                  : 'bg-[#2A1D15] text-[#F6F2EA] hover:bg-[#1A120C]'
              }`}
            >
              <ShoppingBag
                className={`h-3.5 w-3.5 ${isDark ? 'text-[#C8822E]' : 'text-[#FFCC70]'}`}
              />
              <span className="hidden sm:inline">BAG</span>
              <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#FFCC70] px-1 text-[9px] font-bold text-[#2A1D15] tabular-nums">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* =====================================================================
          SECTION 1: HERO SHOWCASE & BUY BOX (Inspiration Image 1)
      ====================================================================== */}
      <main className="relative z-10 mx-auto max-w-[1400px] px-4 pt-4 pb-12 sm:px-8 sm:pt-7 sm:pb-16 lg:pb-24">
        {/* Breadcrumb line */}
        <nav
          className={`mb-4 sm:mb-5 flex flex-wrap items-center gap-1.5 sm:gap-2 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.16em] sm:tracking-[0.22em] ${
            isDark ? 'text-[#F6F2EA]/55' : 'text-[#2A1D15]/55'
          }`}
        >
          <span
            onClick={onBackToStore}
            className={`cursor-pointer transition-colors ${
              isDark ? 'hover:text-[#F6F2EA]' : 'hover:text-[#2A1D15]'
            }`}
          >
            COLLECTION
          </span>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span
            className={`font-semibold truncate max-w-[180px] sm:max-w-none ${
              isDark ? 'text-[#F6F2EA]' : 'text-[#2A1D15]'
            }`}
          >
            {product.name}
          </span>
        </nav>

        {/* 2-Column Split: Full-Height Gallery on Left / Purchase Suite on Right */}
        <div className="grid grid-cols-1 gap-7 sm:gap-10 lg:grid-cols-12 lg:items-stretch lg:gap-12 xl:gap-14">
          {/* LEFT: Multi-Angle Thumbnail Strip + Full-Height Primary Showcase */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-3 sm:gap-5 items-stretch lg:h-full">
            {/* Vertical Thumbnail Strip */}
            <div className="flex sm:flex-col gap-2.5 sm:gap-3 w-full sm:w-20 lg:w-[84px] shrink-0 overflow-x-auto no-scrollbar sm:overflow-visible pb-1 sm:pb-0">
              {galleryImages.map((imgSrc, idx) => {
                const isActive = selectedImageIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleThumbnailClick(idx)}
                    className={`relative flex h-16 w-16 sm:h-20 sm:w-20 lg:h-[84px] lg:w-[84px] shrink-0 items-center justify-center overflow-hidden rounded-xl border p-1 sm:p-1.5 transition-all ${
                      isDark ? 'bg-[#1D1916]' : 'bg-[#EFE9DF]'
                    } ${
                      isActive
                        ? isDark
                          ? 'border-[#FFCC70] shadow-sm ring-1 ring-[#FFCC70]'
                          : 'border-[#2A1D15] shadow-sm ring-1 ring-[#2A1D15]'
                        : isDark
                        ? 'border-white/15 opacity-70 hover:opacity-100 hover:border-white/40'
                        : 'border-[#2A1D15]/15 opacity-70 hover:opacity-100 hover:border-[#2A1D15]/40'
                    }`}
                  >
                    <img
                      src={imgSrc}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="h-full w-full object-cover rounded-lg"
                    />
                  </button>
                );
              })}
            </div>

            {/* Main Stage Image Container (Reaches exact top-to-bottom of right content on desktop) */}
            <motion.div
              key={`showcase-${product.id}`}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.62, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className={`relative flex-1 w-full aspect-square sm:aspect-[4/5] lg:aspect-auto lg:h-full lg:min-h-[680px] overflow-hidden rounded-xl sm:rounded-2xl border bg-[#1A1816] shadow-md ${
                isDark ? 'border-white/12' : 'border-[#2A1D15]/12'
              }`}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={galleryImages[selectedImageIdx]}
                  src={galleryImages[selectedImageIdx]}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 1.07 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 z-10 h-full w-full object-cover object-center select-none"
                  draggable={false}
                />
              </AnimatePresence>

              {/* Counter pill at bottom right (e.g. 01 / 04) */}
              <div className="absolute bottom-4 right-4 z-20 rounded-md border border-white/15 bg-black/55 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#F6F2EA] backdrop-blur-md">
                0{selectedImageIdx + 1} / 0{galleryImages.length}
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Editorial Buy Box Suite */}
          <motion.div
            key={`buybox-${product.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 flex flex-col justify-between"
          >
            <div>
              {/* Eyebrow: Object index & spec status */}
              <div
                className={`flex items-center justify-between border-b pb-3 font-mono text-[10px] uppercase tracking-[0.22em] ${
                  isDark
                    ? 'border-white/10 text-[#F6F2EA]/65'
                    : 'border-[#2A1D15]/10 text-[#2A1D15]/65'
                }`}
              >
                <span>
                  ITEM {product.index} // {product.category}
                </span>
                <div className="flex items-center gap-1.5 text-[#E59838]">
                  <span
                    className={`font-semibold ${isDark ? 'text-[#F6F2EA]' : 'text-[#2A1D15]'}`}
                  >
                    {product.rating
                      ? `★ ${product.rating} (${product.reviewsCount ?? 0})`
                      : product.specStatus}
                  </span>
                </div>
              </div>

              {/* Big Editorial Title */}
              <h1
                className={`mt-3 sm:mt-4 font-display text-[28px] sm:text-4xl lg:text-[42px] font-extrabold leading-[1.08] tracking-[-0.03em] ${
                  isDark ? 'text-[#F6F2EA]' : 'text-[#2A1D15]'
                }`}
              >
                {product.name}
              </h1>

              {/* Price + Discount Savings Badge */}
              <div className="mt-4 flex flex-wrap items-baseline gap-3">
                <span
                  className={`font-display text-2xl sm:text-3xl font-bold tracking-tight tabular-nums ${
                    isDark ? 'text-[#F6F2EA]' : 'text-[#2A1D15]'
                  }`}
                >
                  ${product.price}
                </span>
                {product.oldPrice && (
                  <span
                    className={`font-mono text-sm line-through tabular-nums ${
                      isDark ? 'text-[#F6F2EA]/45' : 'text-[#2A1D15]/45'
                    }`}
                  >
                    ${product.oldPrice}
                  </span>
                )}
                {product.discountPct && (
                  <span
                    className={`rounded-full bg-[#D4822B]/15 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${
                      isDark ? 'text-[#FFCC70]' : 'text-[#B66617]'
                    }`}
                  >
                    SAVE {product.discountPct}%
                  </span>
                )}
                <span
                  className={`font-mono text-[11px] uppercase tracking-[0.15em] ${
                    isDark ? 'text-[#F6F2EA]/55' : 'text-[#2A1D15]/55'
                  }`}
                >
                  · 4 interest-free payments of ${(product.price / 4).toFixed(2)}
                </span>
              </div>

              {/* Editorial Description */}
              <p
                className={`mt-5 text-sm sm:text-[15px] leading-relaxed ${
                  isDark ? 'text-[#F6F2EA]/80' : 'text-[#2A1D15]/80'
                }`}
              >
                {product.description}
              </p>

              {/* Signature Colourway Selector */}
              <div
                className={`mt-7 border-t pt-5 ${
                  isDark ? 'border-white/10' : 'border-[#2A1D15]/10'
                }`}
              >
                <div
                  className={`flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] ${
                    isDark ? 'text-[#F6F2EA]/70' : 'text-[#2A1D15]/70'
                  }`}
                >
                  <span>THEME COLOURWAYS</span>
                  <span
                    className={`font-semibold ${isDark ? 'text-[#F6F2EA]' : 'text-[#2A1D15]'}`}
                  >
                    {activeFinish.name}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  {product.finishes.map((finish, idx) => {
                    const isSelected = selectedFinishIdx === idx;
                    return (
                      <button
                        key={finish.name}
                        onClick={() => handleFinishSelect(idx)}
                        title={finish.name}
                        className={`group relative flex h-8 w-8 items-center justify-center rounded-full transition-transform ${
                          isSelected
                            ? isDark
                              ? 'scale-110 ring-2 ring-[#FFCC70] ring-offset-2 ring-offset-[#12100E]'
                              : 'scale-110 ring-2 ring-[#2A1D15] ring-offset-2 ring-offset-[#F6F2EA]'
                            : 'hover:scale-105'
                        }`}
                      >
                        <span
                          className={`h-full w-full rounded-full border shadow-inner ${
                            isDark ? 'border-white/20' : 'border-black/15'
                          }`}
                          style={{ backgroundColor: finish.hex }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Selector (If applicable) */}
              {product.sizes && product.sizes.length > 0 && (
                <div
                  className={`mt-6 border-t pt-5 ${
                    isDark ? 'border-white/10' : 'border-[#2A1D15]/10'
                  }`}
                >
                  <div
                    className={`flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] ${
                      isDark ? 'text-[#F6F2EA]/70' : 'text-[#2A1D15]/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span>SELECT SIZE</span>
                      {hasApparelSizeGuide && (
                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playClick(1.0);
                            setIsSizeGuideOpen(true);
                          }}
                          className={`inline-flex items-center gap-1 border-b pb-0.5 text-[9px] transition-colors ${
                            isDark
                              ? 'border-white/30 text-[#FFCC70] hover:border-[#C8822E] hover:text-[#F6F2EA]'
                              : 'border-[#2A1D15]/35 text-[#C8822E] hover:border-[#C8822E] hover:text-[#2A1D15]'
                          }`}
                        >
                          <Ruler className="h-3 w-3" />
                          <span>SIZE GUIDE</span>
                        </button>
                      )}
                    </div>
                    <span
                      className={`font-semibold ${isDark ? 'text-[#F6F2EA]' : 'text-[#2A1D15]'}`}
                    >
                      {selectedSize}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {product.sizes.map((size) => {
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          onClick={() => handleSizeSelect(size)}
                          className={`flex h-10 min-w-[48px] px-3 items-center justify-center rounded-lg border font-mono text-xs font-semibold uppercase tracking-wider transition-all ${
                            isSelected
                              ? isDark
                                ? 'border-[#FFCC70] bg-[#FFCC70] text-[#181614] shadow-sm'
                                : 'border-[#2A1D15] bg-[#2A1D15] text-[#F6F2EA] shadow-sm'
                              : isDark
                              ? 'border-white/20 bg-transparent text-[#F6F2EA] hover:border-white/50'
                              : 'border-[#2A1D15]/20 bg-transparent text-[#2A1D15] hover:border-[#2A1D15]/50'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Batch Availability Indicator */}
              {product.batchLeft && (
                <div
                  className={`mt-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] ${
                    isDark ? 'text-[#FFCC70]' : 'text-[#B66617]'
                  }`}
                >
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#D4822B] animate-pulse" />
                  <span>Only {product.batchLeft} units left in Batch 001</span>
                </div>
              )}

              {/* Quantity + Add to Bag Bar */}
              <div className="mt-5 sm:mt-6 flex items-center gap-2 sm:gap-3">
                {/* Stepper */}
                <div
                  className={`flex h-12 sm:h-14 items-center rounded-xl border px-1 sm:px-2 shrink-0 ${
                    isDark
                      ? 'border-white/20 bg-[#1B1815]'
                      : 'border-[#2A1D15]/20 bg-[#FAF7F2]'
                  }`}
                >
                  <button
                    onClick={() => handleQuantityDelta(-1)}
                    disabled={quantity <= 1}
                    className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center disabled:opacity-30 active:scale-95 ${
                      isDark
                        ? 'text-[#F6F2EA]/70 hover:text-[#F6F2EA]'
                        : 'text-[#2A1D15]/70 hover:text-[#2A1D15]'
                    }`}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span
                    className={`w-6 sm:w-8 text-center font-mono text-xs font-bold tabular-nums ${
                      isDark ? 'text-[#F6F2EA]' : 'text-[#2A1D15]'
                    }`}
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityDelta(1)}
                    disabled={quantity >= maxStock}
                    className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center disabled:opacity-30 active:scale-95 ${
                      isDark
                        ? 'text-[#F6F2EA]/70 hover:text-[#F6F2EA]'
                        : 'text-[#2A1D15]/70 hover:text-[#2A1D15]'
                    }`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Big Walnut Brown / Amber CTA Button */}
                <button
                  onClick={handleAdd}
                  className={`flex h-12 sm:h-14 flex-1 min-w-0 items-center justify-between gap-2 rounded-xl px-3.5 sm:px-6 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.12em] sm:tracking-[0.2em] shadow-md transition-all active:scale-[0.99] ${
                    isDark
                      ? 'bg-[#FFCC70] text-[#181614] hover:bg-[#f0bd5e]'
                      : 'bg-[#2A1D15] text-[#F6F2EA] hover:bg-[#1A120C]'
                  }`}
                >
                  <span className="truncate">{justAdded ? 'ADDED TO BAG ✓' : 'ADD TO BAG'}</span>
                  <span
                    className={`tabular-nums font-semibold shrink-0 ${
                      isDark ? 'text-[#181614]' : 'text-[#FFCC70]'
                    }`}
                  >
                    ${product.price * quantity}
                  </span>
                </button>
              </div>

              {/* 3-Point Commerce Guarantee Row */}
              <div
                className={`mt-5 sm:mt-6 grid grid-cols-3 gap-2.5 sm:gap-4 border-t pt-4 sm:pt-5 font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.08em] sm:tracking-[0.16em] ${
                  isDark
                    ? 'border-white/10 text-[#F6F2EA]/70'
                    : 'border-[#2A1D15]/10 text-[#2A1D15]/70'
                }`}
              >
                <div className="flex flex-col">
                  <span className="font-bold text-[#E59838]">01</span>
                  <span className="mt-0.5 leading-snug">Express 48h Dispatch</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[#E59838]">02</span>
                  <span className="mt-0.5 leading-snug">3 Theme Colourways</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[#E59838]">03</span>
                  <span className="mt-0.5 leading-snug">30-Day Studio Exchange</span>
                </div>
              </div>

              {/* Accordions */}
              <div
                className={`mt-8 border-t border-b divide-y ${
                  isDark
                    ? 'border-white/15 divide-white/10'
                    : 'border-[#2A1D15]/15 divide-[#2A1D15]/10'
                }`}
              >
                {/* 1. DETAILS */}
                <div className="py-4">
                  <button
                    onClick={() => toggleAccordion('details')}
                    className={`flex w-full items-center justify-between font-mono text-[11px] font-bold uppercase tracking-[0.2em] ${
                      isDark
                        ? 'text-[#F6F2EA] hover:text-[#FFCC70]'
                        : 'text-[#2A1D15] hover:text-[#546652]'
                    }`}
                  >
                    <span>DETAILS & SPECIFICATIONS</span>
                    {openAccordions.details ? (
                      <Minus className="h-3.5 w-3.5 text-[#E59838]" />
                    ) : (
                      <Plus className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openAccordions.details && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pt-3.5"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-[10px]">
                          {product.specs.map((spec) => (
                            <div
                              key={spec.label}
                              className={`flex flex-col rounded-lg border p-2.5 ${
                                isDark
                                  ? 'border-white/10 bg-[#1B1815]'
                                  : 'border-[#2A1D15]/10 bg-[#FAF7F2]'
                              }`}
                            >
                              <span
                                className={`tracking-[0.18em] ${
                                  isDark ? 'text-[#F6F2EA]/50' : 'text-[#2A1D15]/50'
                                }`}
                              >
                                {spec.label}
                              </span>
                              <span
                                className={`mt-0.5 font-semibold ${
                                  isDark ? 'text-[#F6F2EA]' : 'text-[#2A1D15]'
                                }`}
                              >
                                {spec.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 2. MATERIALS */}
                <div className="py-4">
                  <button
                    onClick={() => toggleAccordion('materials')}
                    className={`flex w-full items-center justify-between font-mono text-[11px] font-bold uppercase tracking-[0.2em] ${
                      isDark
                        ? 'text-[#F6F2EA] hover:text-[#FFCC70]'
                        : 'text-[#2A1D15] hover:text-[#546652]'
                    }`}
                  >
                    <span>MATERIALS & FINISHES</span>
                    {openAccordions.materials ? (
                      <Minus className="h-3.5 w-3.5 text-[#E59838]" />
                    ) : (
                      <Plus className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openAccordions.materials && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pt-3"
                      >
                        <p
                          className={`text-xs sm:text-[13px] leading-relaxed ${
                            isDark ? 'text-[#F6F2EA]/80' : 'text-[#2A1D15]/80'
                          }`}
                        >
                          {product.materialsInfo ||
                            'Selected for tactile durability and resilience. Engineered with pure natural pigments, anodized metal chassis, and zero unnecessary plastic laminates.'}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 3. SHIPPING & RETURNS */}
                <div className="py-4">
                  <button
                    onClick={() => toggleAccordion('shipping')}
                    className={`flex w-full items-center justify-between font-mono text-[11px] font-bold uppercase tracking-[0.2em] ${
                      isDark
                        ? 'text-[#F6F2EA] hover:text-[#FFCC70]'
                        : 'text-[#2A1D15] hover:text-[#546652]'
                    }`}
                  >
                    <span>SHIPPING & RETURNS</span>
                    {openAccordions.shipping ? (
                      <Minus className="h-3.5 w-3.5 text-[#E59838]" />
                    ) : (
                      <Plus className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openAccordions.shipping && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pt-3"
                      >
                        <p
                          className={`text-xs sm:text-[13px] leading-relaxed ${
                            isDark ? 'text-[#F6F2EA]/80' : 'text-[#2A1D15]/80'
                          }`}
                        >
                          {product.shippingInfo ||
                            'Orders dispatch within 24 hours via express carbon-neutral couriers. 30-day tactile in-studio trial with complimentary returns.'}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 4. OBJECT SOUNDSCAPE // AUDIO NOTE */}
                <div className="py-4">
                  <button
                    onClick={() => toggleAccordion('soundscape')}
                    className={`flex w-full items-center justify-between font-mono text-[11px] font-bold uppercase tracking-[0.2em] ${
                      isDark
                        ? 'text-[#F6F2EA] hover:text-[#FFCC70]'
                        : 'text-[#2A1D15] hover:text-[#546652]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-[#E59838]" />
                      <span>OBJECT SOUNDSCAPE // {product.bpm}</span>
                    </div>
                    {openAccordions.soundscape ? (
                      <Minus className="h-3.5 w-3.5 text-[#E59838]" />
                    ) : (
                      <Plus className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openAccordions.soundscape && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pt-3"
                      >
                        <div
                          className={`flex items-center justify-between rounded-xl border p-3.5 ${
                            isDark
                              ? 'border-white/15 bg-[#1B1815]'
                              : 'border-[#2A1D15]/15 bg-[#EFE9DF]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <button
                              onClick={handleToggleSoundscape}
                              className={`flex h-10 w-10 items-center justify-center rounded-full hover:scale-105 active:scale-95 transition-transform ${
                                isDark
                                  ? 'bg-[#FFCC70] text-[#181614]'
                                  : 'bg-[#2A1D15] text-[#FFCC70]'
                              }`}
                            >
                              {isPlayingSoundscape ? (
                                <VolumeX className="h-4 w-4" />
                              ) : (
                                <Volume2 className="h-4 w-4" />
                              )}
                            </button>
                            <div>
                              <div
                                className={`font-mono text-[9px] uppercase tracking-[0.2em] ${
                                  isDark ? 'text-[#F6F2EA]/60' : 'text-[#2A1D15]/60'
                                }`}
                              >
                                SYNTAXWEAR STUDIO NOTE
                              </div>
                              <div
                                className={`font-mono text-xs font-bold ${
                                  isDark ? 'text-[#F6F2EA]' : 'text-[#2A1D15]'
                                }`}
                              >
                                {product.soundtrackTitle}
                              </div>
                            </div>
                          </div>
                          <span className="font-mono text-[10px] text-[#E59838] uppercase tracking-wider font-semibold">
                            {isPlayingSoundscape ? 'PLAYING LIVE' : 'TAP TO LISTEN'}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* =====================================================================
          SECTION 2: COMMUNITY NOTES / REVIEWS ("Lived with. Well reviewed.")
      ====================================================================== */}
      <section
        className={`relative z-10 border-t bg-gradient-to-r ${
          isDark
            ? 'border-white/10 from-[#161310] via-[#15120F] to-[#1C1813]'
            : 'border-[#2A1D15]/10 from-[#F4F1E8] via-[#F4F1E8] to-[#E8E2D4]/75'
        }`}
      >
        <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-8 sm:py-24">
          {/* Header Row: Title Left, Dark Walnut CTA Right */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#C8822E]">
                COMMUNITY NOTES
              </div>
              <h2
                className={`mt-3 font-display text-4xl sm:text-5xl lg:text-[54px] font-medium tracking-[-0.04em] leading-[0.94] ${
                  isDark ? 'text-[#F6F2EA]' : 'text-[#181614]'
                }`}
              >
                Lived with.
                <br />
                <span className="font-serif-editorial italic font-normal text-[#C8822E]">
                  Well reviewed.
                </span>
              </h2>
            </div>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick(1.0);
                setIsWritingReview((prev) => !prev);
              }}
              className={`inline-flex w-fit items-center gap-6 px-6 py-4 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors active:scale-[0.99] ${
                isDark
                  ? 'bg-[#FFCC70] text-[#181614] hover:bg-[#f0bd5e]'
                  : 'bg-[#3E2417] text-[#F6F2EA] hover:bg-[#2C1910]'
              }`}
            >
              <span>{isWritingReview ? 'CLOSE FORM' : 'WRITE A REVIEW'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Two-Column Body: Breakdown Left, Reviews Feed Right */}
          <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[270px_1fr] lg:gap-16">
            {/* Left Rating Summary Column */}
            <div>
              <div
                className={`mb-10 h-[5px] w-14 ${isDark ? 'bg-[#FFCC70]' : 'bg-[#3E2417]'}`}
              />

              <div className="text-[19px] font-medium tracking-tight text-[#C8822E]">
                {totalReviews === 0 ? (
                  'No rating yet'
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <span>{averageRating.toFixed(1)}</span>
                    <span
                      className={`text-xs font-mono ${
                        isDark ? 'text-[#F6F2EA]/55' : 'text-[#2A1D15]/55'
                      }`}
                    >
                      / 5.0
                    </span>
                  </span>
                )}
              </div>

              <p
                className={`mt-1.5 font-mono text-[10px] tracking-[0.04em] ${
                  isDark ? 'text-[#F6F2EA]/55' : 'text-[#2A1D15]/55'
                }`}
              >
                Based on {totalReviews} customer {totalReviews === 1 ? 'review' : 'reviews'}
              </p>

              {/* 5-Star Distribution Bars */}
              <div className="mt-7 space-y-2.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviews.filter((r) => r.rating === star).length;
                  const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                  const isActiveFilter = starFilter === star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => {
                        soundEngine.playClick(0.95);
                        setStarFilter((curr) => (curr === star ? null : star));
                      }}
                      className={`group flex w-full items-center gap-3 text-left font-mono text-[10px] transition-opacity ${
                        starFilter !== null && !isActiveFilter ? 'opacity-45 hover:opacity-80' : ''
                      }`}
                    >
                      <span
                        className={`w-11 shrink-0 ${
                          isDark
                            ? 'text-[#F6F2EA]/60 group-hover:text-[#F6F2EA]'
                            : 'text-[#2A1D15]/60 group-hover:text-[#2A1D15]'
                        }`}
                      >
                        {star} star
                      </span>
                      <span
                        className={`relative h-[2px] flex-1 overflow-hidden ${
                          isDark ? 'bg-white/15' : 'bg-[#2A1D15]/14'
                        }`}
                      >
                        <span
                          className="absolute inset-y-0 left-0 bg-[#C8822E] transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </span>
                      <span
                        className={`w-4 shrink-0 text-right tabular-nums ${
                          isDark ? 'text-[#F6F2EA]/65' : 'text-[#2A1D15]/65'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Reviews List & Composer */}
            <div>
              <div
                className={`flex items-center justify-between gap-4 border-t border-b py-4 ${
                  isDark ? 'border-white/12' : 'border-[#2A1D15]/12'
                }`}
              >
                <div
                  className={`flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.14em] ${
                    isDark ? 'text-[#F6F2EA]/60' : 'text-[#2A1D15]/60'
                  }`}
                >
                  <span>ALL REVIEWS ({totalReviews})</span>
                  {starFilter !== null && (
                    <button
                      type="button"
                      onClick={() => setStarFilter(null)}
                      className={`text-[#C8822E] underline underline-offset-4 ${
                        isDark ? 'hover:text-[#F6F2EA]' : 'hover:text-[#2A1D15]'
                      }`}
                    >
                      FILTERED: {starFilter} STAR · CLEAR
                    </button>
                  )}
                </div>
              </div>

              {/* Inline Review Composer */}
              <AnimatePresence initial={false}>
                {isWritingReview && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    onSubmit={handleSubmitReview}
                    className="overflow-hidden"
                  >
                    <div
                      className={`mt-6 border p-6 sm:p-8 space-y-5 ${
                        isDark ? 'border-white/15 bg-[#1B1815]' : 'border-[#2A1D15]/14 bg-[#FAF7F2]'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <span
                          className={`font-mono text-[10px] uppercase tracking-[0.16em] ${
                            isDark ? 'text-[#F6F2EA]/65' : 'text-[#2A1D15]/65'
                          }`}
                        >
                          YOUR RATING
                        </span>
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <button
                              key={n}
                              type="button"
                              onClick={() => {
                                soundEngine.playClick(0.9 + n * 0.04);
                                setReviewRating(n);
                              }}
                              aria-label={`Rate ${n} star${n === 1 ? '' : 's'}`}
                              className="p-1 transition-transform hover:scale-110"
                            >
                              <Star
                                className={`h-4 w-4 ${
                                  n <= reviewRating
                                    ? 'fill-[#C8822E] text-[#C8822E]'
                                    : isDark
                                    ? 'text-white/25'
                                    : 'text-[#2A1D15]/25'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <label className="block space-y-1.5">
                          <span
                            className={`font-mono text-[9px] uppercase tracking-[0.16em] ${
                              isDark ? 'text-[#F6F2EA]/60' : 'text-[#2A1D15]/60'
                            }`}
                          >
                            NAME
                          </span>
                          <input
                            required
                            value={reviewAuthor}
                            onChange={(e) => setReviewAuthor(e.target.value)}
                            placeholder="Alex M."
                            className={`w-full border px-3.5 py-2.5 text-sm outline-none ${
                              isDark
                                ? 'border-white/18 bg-[#12100E] text-[#F6F2EA] placeholder:text-white/35 focus:border-[#FFCC70]'
                                : 'border-[#2A1D15]/18 bg-white/75 text-[#181614] placeholder:text-[#2A1D15]/40 focus:border-[#3E2417]'
                            }`}
                          />
                        </label>
                        <label className="block space-y-1.5">
                          <span
                            className={`font-mono text-[9px] uppercase tracking-[0.16em] ${
                              isDark ? 'text-[#F6F2EA]/60' : 'text-[#2A1D15]/60'
                            }`}
                          >
                            HEADLINE
                          </span>
                          <input
                            value={reviewHeadline}
                            onChange={(e) => setReviewHeadline(e.target.value)}
                            placeholder="Heavyweight drape & crisp print"
                            className={`w-full border px-3.5 py-2.5 text-sm outline-none ${
                              isDark
                                ? 'border-white/18 bg-[#12100E] text-[#F6F2EA] placeholder:text-white/35 focus:border-[#FFCC70]'
                                : 'border-[#2A1D15]/18 bg-white/75 text-[#181614] placeholder:text-[#2A1D15]/40 focus:border-[#3E2417]'
                            }`}
                          />
                        </label>
                      </div>

                      <label className="block space-y-1.5">
                        <span
                          className={`font-mono text-[9px] uppercase tracking-[0.16em] ${
                            isDark ? 'text-[#F6F2EA]/60' : 'text-[#2A1D15]/60'
                          }`}
                        >
                          REVIEW NOTE
                        </span>
                        <textarea
                          required
                          rows={3}
                          value={reviewBody}
                          onChange={(e) => setReviewBody(e.target.value)}
                          placeholder="How does it fit, feel, and wear day to day?"
                          className={`w-full resize-none border px-3.5 py-2.5 text-sm outline-none ${
                            isDark
                              ? 'border-white/18 bg-[#12100E] text-[#F6F2EA] placeholder:text-white/35 focus:border-[#FFCC70]'
                              : 'border-[#2A1D15]/18 bg-white/75 text-[#181614] placeholder:text-[#2A1D15]/40 focus:border-[#3E2417]'
                          }`}
                        />
                      </label>

                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <button
                          type="submit"
                          className={`inline-flex items-center gap-4 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.14em] ${
                            isDark
                              ? 'bg-[#FFCC70] text-[#181614] hover:bg-[#f0bd5e]'
                              : 'bg-[#3E2417] text-[#F6F2EA] hover:bg-[#2C1910]'
                          }`}
                        >
                          <span>SUBMIT REVIEW</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsWritingReview(false)}
                          className={`px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] ${
                            isDark
                              ? 'text-[#F6F2EA]/60 hover:text-[#F6F2EA]'
                              : 'text-[#2A1D15]/60 hover:text-[#2A1D15]'
                          }`}
                        >
                          CANCEL
                        </button>
                      </div>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Empty State vs Customer Review Cards */}
              {filteredReviews.length === 0 ? (
                <div className="py-14">
                  <p className={`text-sm ${isDark ? 'text-[#F6F2EA]/65' : 'text-[#2A1D15]/65'}`}>
                    No reviews in this view yet.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick(1.0);
                      if (starFilter !== null) {
                        setStarFilter(null);
                      } else {
                        setIsWritingReview(true);
                      }
                    }}
                    className={`mt-4 inline-block border-b pb-1 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors hover:border-[#C8822E] hover:text-[#C8822E] ${
                      isDark
                        ? 'border-[#F6F2EA]/60 text-[#F6F2EA]'
                        : 'border-[#2A1D15] text-[#181614]'
                    }`}
                  >
                    {starFilter !== null ? 'VIEW ALL REVIEWS' : 'BE THE FIRST TO SHARE YOURS'}
                  </button>
                </div>
              ) : (
                <div
                  className={`divide-y ${isDark ? 'divide-white/12' : 'divide-[#2A1D15]/12'}`}
                >
                  {filteredReviews.map((review) => (
                    <article key={review.id} className="py-7">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < review.rating
                                  ? 'fill-[#C8822E] text-[#C8822E]'
                                  : isDark
                                  ? 'text-white/20'
                                  : 'text-[#2A1D15]/20'
                              }`}
                            />
                          ))}
                        </div>
                        <span
                          className={`font-mono text-[10px] uppercase tracking-[0.1em] ${
                            isDark ? 'text-[#F6F2EA]/50' : 'text-[#2A1D15]/50'
                          }`}
                        >
                          {review.createdAt}
                        </span>
                      </div>

                      <h3
                        className={`mt-3 font-display text-base font-semibold ${
                          isDark ? 'text-[#F6F2EA]' : 'text-[#181614]'
                        }`}
                      >
                        {review.headline}
                      </h3>
                      <p
                        className={`mt-2 text-sm leading-relaxed ${
                          isDark ? 'text-[#F6F2EA]/78' : 'text-[#2A1D15]/78'
                        }`}
                      >
                        {review.body}
                      </p>

                      <div
                        className={`mt-3 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.12em] ${
                          isDark ? 'text-[#F6F2EA]/55' : 'text-[#2A1D15]/55'
                        }`}
                      >
                        <span
                          className={`font-medium ${isDark ? 'text-[#F6F2EA]' : 'text-[#181614]'}`}
                        >
                          {review.author}
                        </span>
                        {review.variantLabel && <span>· {review.variantLabel}</span>}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 3: OBJECTS THAT SIT WELL TOGETHER ("CONTINUE EXPLORING" left, heading right)
      ====================================================================== */}
      <section
        className={`relative z-10 border-t mx-auto max-w-[1400px] px-4 pt-16 pb-20 sm:px-8 sm:pt-24 sm:pb-28 ${
          isDark ? 'border-white/10' : 'border-[#2A1D15]/10'
        }`}
      >
        {/* Section Header: Kicker Left, Display Title Right */}
        <div className="mb-10 sm:mb-12 flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#C8822E]">
            CONTINUE EXPLORING
          </div>
          <h3
            className={`text-right font-display text-3xl sm:text-4xl lg:text-[46px] font-medium tracking-[-0.04em] leading-[1.02] ${
              isDark ? 'text-[#F6F2EA]' : 'text-[#181614]'
            }`}
          >
            Objects that sit well{' '}
            <span className="font-serif-editorial italic font-normal text-[#C8822E]">
              together.
            </span>
          </h3>
        </div>

        {/* Curated Cross-Sell Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8">
          {crossSellProducts.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                soundEngine.playClick(1.05);
                onSelectProduct(item);
              }}
              className="group flex flex-col cursor-pointer"
            >
              {/* Clean Rectangular Studio Frame */}
              <div
                className={`relative aspect-[4/3] w-full overflow-hidden ${
                  isDark ? 'bg-[#1B1815]' : 'bg-[#ECE8DE]'
                }`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>

              {/* Info Line below */}
              <div className="mt-3.5 flex flex-col">
                <div
                  className={`font-mono text-[9px] uppercase tracking-[0.18em] ${
                    isDark ? 'text-[#F6F2EA]/50' : 'text-[#2A1D15]/48'
                  }`}
                >
                  {item.category}
                </div>
                <div className="mt-1 flex items-baseline justify-between gap-4">
                  <h4
                    className={`font-display text-[15px] font-semibold tracking-tight transition-colors truncate ${
                      isDark
                        ? 'text-[#F6F2EA] group-hover:text-[#FFCC70]'
                        : 'text-[#181614] group-hover:text-[#546652]'
                    }`}
                  >
                    {item.name}
                  </h4>
                  <span
                    className={`font-mono text-[11px] font-normal tabular-nums shrink-0 ${
                      isDark ? 'text-[#F6F2EA]/65' : 'text-[#2A1D15]/60'
                    }`}
                  >
                    {item.price !== null ? `$${item.price}` : item.priceLabel}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          MINIMAL FOOTER
      ====================================================================== */}
      <footer
        className={`relative z-10 border-t px-4 py-8 sm:px-8 text-center font-mono text-[10px] uppercase tracking-[0.2em] ${
          isDark
            ? 'border-white/10 bg-[#0D0B09] text-[#F6F2EA]/65'
            : 'border-[#2A1D15]/10 bg-[#FAF7F2] text-[#2A1D15]/65'
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img
              src="/images/thissoftware-emblem-transparent.png"
              alt="SyntaxWear"
              className="h-5 w-5 object-contain"
            />
            <span className={`font-display font-bold ${isDark ? 'text-[#F6F2EA]' : 'text-[#2A1D15]'}`}>
              SyntaxWear
            </span>
          </div>
          <div>SYNTAXWEAR // S+404 LAUNCH CATALOGUE</div>
          <button
            onClick={() => {
              soundEngine.playClick(0.9);
              onBackToStore();
            }}
            className={`underline decoration-[#E59838] underline-offset-4 ${
              isDark ? 'hover:text-[#F6F2EA]' : 'hover:text-[#2A1D15]'
            }`}
          >
            RETURN TO COLLECTION ↑
          </button>
        </div>
      </footer>

      {/* =====================================================================
          SIZE GUIDE MODAL
      ====================================================================== */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
            onClick={() => setIsSizeGuideOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-lg border p-6 sm:p-8 shadow-2xl ${
                isDark
                  ? 'border-white/15 bg-[#1B1815] text-[#F6F2EA]'
                  : 'border-[#2A1D15]/15 bg-[#FAF7F2] text-[#181614]'
              }`}
            >
              <div
                className={`flex items-start justify-between gap-4 border-b pb-4 ${
                  isDark ? 'border-white/12' : 'border-[#2A1D15]/12'
                }`}
              >
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C8822E]">
                    SYNTAXWEAR FIT SPEC
                  </span>
                  <h4 className="mt-1 font-display text-2xl font-bold tracking-tight">
                    Oversized Boxy Fit Chart
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(false)}
                  aria-label="Close size guide"
                  className={`p-1.5 ${
                    isDark
                      ? 'text-[#F6F2EA]/60 hover:text-[#F6F2EA]'
                      : 'text-[#2A1D15]/60 hover:text-[#2A1D15]'
                  }`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p
                className={`mt-4 text-xs leading-relaxed ${
                  isDark ? 'text-[#F6F2EA]/75' : 'text-[#2A1D15]/75'
                }`}
              >
                Relaxed dropped-shoulder silhouette engineered for heavyweight cotton & fleece. Take your usual size for the intended boxy drape, or size down once for a closer standard fit.
              </p>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-left font-mono text-[11px]">
                  <thead>
                    <tr
                      className={`border-b uppercase ${
                        isDark ? 'border-white/15 text-[#F6F2EA]/55' : 'border-[#2A1D15]/15 text-[#2A1D15]/55'
                      }`}
                    >
                      <th className="py-2.5 pr-3">Size</th>
                      <th className="py-2.5 px-3">Chest (cm)</th>
                      <th className="py-2.5 px-3">Length (cm)</th>
                      <th className="py-2.5 pl-3">Shoulder (cm)</th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y ${isDark ? 'divide-white/10' : 'divide-[#2A1D15]/10'}`}
                  >
                    {[
                      ['S', '114', '69', '54'],
                      ['M', '120', '72', '57'],
                      ['L', '126', '75', '60'],
                      ['XL', '132', '78', '63'],
                      ['XXL', '138', '81', '66'],
                    ].map(([sz, chest, len, sh]) => (
                      <tr
                        key={sz}
                        className={
                          selectedSize === sz
                            ? isDark
                              ? 'bg-[#C8822E]/20 font-semibold'
                              : 'bg-[#C8822E]/10 font-semibold'
                            : ''
                        }
                      >
                        <td className="py-2.5 pr-3">{sz}</td>
                        <td className="py-2.5 px-3">{chest}</td>
                        <td className="py-2.5 px-3">{len}</td>
                        <td className="py-2.5 pl-3">{sh}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
