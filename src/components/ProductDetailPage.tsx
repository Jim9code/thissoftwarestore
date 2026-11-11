import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Minus,
  ShoppingBag,
  Heart,
  Volume2,
  VolumeX,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { Product, PRODUCTS } from '../data/products';
import { soundEngine } from '../utils/soundEngine';

interface ProductDetailPageProps {
  product: Product;
  onBackToStore: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, finishName: string, size?: string, quantity?: number) => void;
  onOpenBag: () => void;
  cartCount: number;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onBackToStore,
  onSelectProduct,
  onAddToCart,
  onOpenBag,
  cartCount,
  isMuted,
  onToggleMute,
}) => {
  // Gallery state
  const galleryImages =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.image, product.image, product.image];
  const [selectedImageIdx, setSelectedImageIdx] = useState<number>(0);

  // Configuration state
  const [selectedFinishIdx, setSelectedFinishIdx] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [justAdded, setJustAdded] = useState<boolean>(false);

  // Accordions state
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    details: true,
    materials: false,
    shipping: false,
    soundscape: false,
  });

  // Soundscape playback state
  const [isPlayingSoundscape, setIsPlayingSoundscape] = useState<boolean>(false);

  // Reset image and config when product changes
  useEffect(() => {
    setSelectedImageIdx(0);
    setSelectedFinishIdx(0);
    setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : '');
    setQuantity(1);
    setJustAdded(false);
    setIsPlayingSoundscape(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  const toggleAccordion = (key: string) => {
    soundEngine.playClick(1.1);
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleThumbnailClick = (idx: number) => {
    soundEngine.playClick(1.05);
    setSelectedImageIdx(idx);
  };

  const handleFinishSelect = (idx: number) => {
    soundEngine.playClick(1.1);
    setSelectedFinishIdx(idx);
  };

  const handleSizeSelect = (size: string) => {
    soundEngine.playClick(1.1);
    setSelectedSize(size);
  };

  const handleQuantityDelta = (delta: number) => {
    soundEngine.playClick(0.9);
    setQuantity((prev) => Math.max(1, prev + delta));
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

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#F6F2EA] text-[#2A1D15] selection:bg-[#546652] selection:text-[#F6F2EA]">
      {/* Subtle Sand Linen Matrix Dotted Grid Pattern */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-70"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(84, 102, 82, 0.18) 1.5px, transparent 1.5px)',
          backgroundSize: '28px 28px',
          backgroundPosition: 'center center',
        }}
      />

      {/* =====================================================================
          STICKY TOP NAVIGATION BAR (Clean Linen Glass)
      ====================================================================== */}
      <header className="sticky top-0 z-40 border-b border-[#2A1D15]/10 bg-[#F6F2EA]/92 backdrop-blur-xl transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-8">
          {/* Back to Collection / Store */}
          <button
            onClick={() => {
              soundEngine.playClick(0.9);
              onBackToStore();
            }}
            className="group flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#2A1D15]/75 hover:text-[#2A1D15] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1 text-[#E59838]" />
            <span>COLLECTION // STORE</span>
          </button>

          {/* Center Brand Identity */}
          <div
            onClick={() => {
              soundEngine.playClick(0.9);
              onBackToStore();
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <img
              src="/images/thissoftware-emblem-transparent.png"
              alt="thissoftware"
              className="h-6 w-6 object-contain drop-shadow-sm transition-transform group-hover:scale-105"
            />
            <span className="font-display text-base font-extrabold tracking-[-0.035em] text-[#2A1D15] group-hover:text-[#546652] transition-colors">
              thissoftwarestore
            </span>
          </div>

          {/* Right Action Cluster: Audio & Bag */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onToggleMute}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2A1D15]/15 bg-[#2A1D15]/5 text-[#2A1D15] hover:bg-[#2A1D15]/10 active:scale-95 transition-all"
            >
              {isMuted ? (
                <VolumeX className="h-3.5 w-3.5 text-[#2A1D15]/50" />
              ) : (
                <Volume2 className="h-3.5 w-3.5 text-[#E59838]" />
              )}
            </button>

            <button
              onClick={() => {
                soundEngine.playClick(1.05);
                onOpenBag();
              }}
              className="group flex h-9 items-center gap-2 rounded-full bg-[#2A1D15] px-3.5 font-mono text-[10px] uppercase tracking-wider text-[#F6F2EA] shadow-sm hover:bg-[#1A120C] active:scale-95 transition-all"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-[#FFCC70]" />
              <span className="hidden xs:inline">BAG</span>
              <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#FFCC70] px-1 text-[9px] font-bold text-[#2A1D15] tabular-nums">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================================
          SECTION 1: HERO SHOWCASE & BUY BOX (Inspiration Image 1)
      ====================================================================== */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 pt-6 pb-16 sm:px-8 sm:pt-8 lg:pb-24">
        {/* Breadcrumb line */}
        <nav className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#2A1D15]/55">
          <span
            onClick={onBackToStore}
            className="cursor-pointer hover:text-[#2A1D15] transition-colors"
          >
            COLLECTION
          </span>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-[#2A1D15] font-semibold truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </nav>

        {/* 2-Column Split: Gallery on Left / Purchase Suite on Right */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-16">
          {/* LEFT: Multi-Angle Thumbnail Strip + Large Primary Showcase */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 sm:gap-6 items-start">
            {/* Vertical Thumbnail Strip */}
            <div className="flex sm:flex-col gap-3 w-full sm:w-20 shrink-0 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
              {galleryImages.map((imgSrc, idx) => {
                const isActive = selectedImageIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleThumbnailClick(idx)}
                    className={`relative flex h-18 w-18 sm:h-20 sm:w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-[#EFE9DF] p-1.5 transition-all ${
                      isActive
                        ? 'border-[#2A1D15] shadow-sm ring-1 ring-[#2A1D15]'
                        : 'border-[#2A1D15]/15 opacity-70 hover:opacity-100 hover:border-[#2A1D15]/40'
                    }`}
                  >
                    <img
                      src={imgSrc}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="h-full w-full object-contain filter drop-shadow-sm"
                    />
                  </button>
                );
              })}
            </div>

            {/* Main Stage Image Container */}
            <div className="relative flex aspect-square sm:aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl sm:rounded-3xl border border-[#2A1D15]/10 bg-gradient-to-b from-[#FAF7F2] to-[#ECE5D8] p-6 sm:p-10 shadow-sm">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImageIdx}
                  src={galleryImages[selectedImageIdx]}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-10 max-h-[82%] max-w-[85%] object-contain filter drop-shadow-[0_24px_36px_rgba(42,29,21,0.22)] select-none"
                  draggable={false}
                />
              </AnimatePresence>

              {/* Ambient warmth backlight */}
              <div className="pointer-events-none absolute inset-10 rounded-full bg-[#E59838]/10 blur-3xl" />

              {/* Counter pill at bottom right (e.g. 01 / 03) */}
              <div className="absolute bottom-4 right-4 z-20 rounded-md border border-[#2A1D15]/15 bg-[#F6F2EA]/90 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#2A1D15]/75 backdrop-blur-md">
                0{selectedImageIdx + 1} / 0{galleryImages.length}
              </div>
            </div>
          </div>

          {/* RIGHT: Editorial Buy Box Suite */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Eyebrow: Object index & rating */}
              <div className="flex items-center justify-between border-b border-[#2A1D15]/10 pb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[#2A1D15]/65">
                <span>
                  OBJECT {product.index} // {product.category}
                </span>
                <div className="flex items-center gap-1 text-[#E59838]">
                  <span>★★★★★</span>
                  <span className="font-semibold text-[#2A1D15]">
                    {product.rating} ({product.reviewsCount})
                  </span>
                </div>
              </div>

              {/* Big Editorial Title */}
              <h1 className="mt-4 font-display text-3xl sm:text-4xl lg:text-[42px] font-extrabold leading-[1.08] tracking-[-0.03em] text-[#2A1D15]">
                {product.name}
              </h1>

              {/* Price & Installments */}
              <div className="mt-4 flex flex-wrap items-baseline gap-3">
                <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#2A1D15]">
                  ${product.price}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-[#2A1D15]/50">
                  or 4 payments of ${(product.price / 4).toFixed(2)} with Klarna
                </span>
              </div>

              {/* Editorial Description */}
              <p className="mt-5 text-sm sm:text-[15px] leading-relaxed text-[#2A1D15]/80">
                {product.description}
              </p>

              {/* Finish Selector */}
              <div className="mt-7 border-t border-[#2A1D15]/10 pt-5">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-[#2A1D15]/70">
                  <span>FINISH</span>
                  <span className="font-semibold text-[#2A1D15]">{activeFinish.name}</span>
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
                          isSelected ? 'scale-110 ring-2 ring-[#2A1D15] ring-offset-2' : 'hover:scale-105'
                        }`}
                      >
                        <span
                          className="h-full w-full rounded-full border border-black/15 shadow-inner"
                          style={{ backgroundColor: finish.hex }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Selector (If applicable) */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-6 border-t border-[#2A1D15]/10 pt-5">
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-[#2A1D15]/70">
                    <span>SIZE</span>
                    <span className="font-semibold text-[#2A1D15]">{selectedSize}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    {product.sizes.map((size) => {
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          onClick={() => handleSizeSelect(size)}
                          className={`flex h-10 w-12 items-center justify-center rounded-lg border font-mono text-xs font-semibold uppercase tracking-wider transition-all ${
                            isSelected
                              ? 'border-[#2A1D15] bg-[#2A1D15] text-[#F6F2EA] shadow-sm'
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

              {/* Quantity + Add to Bag + Wishlist Bar */}
              <div className="mt-7 flex items-center gap-2.5 sm:gap-3">
                {/* Stepper */}
                <div className="flex h-13 items-center rounded-xl border border-[#2A1D15]/20 bg-[#FAF7F2] px-2">
                  <button
                    onClick={() => handleQuantityDelta(-1)}
                    disabled={quantity <= 1}
                    className="flex h-9 w-9 items-center justify-center text-[#2A1D15]/70 hover:text-[#2A1D15] disabled:opacity-30 active:scale-95"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center font-mono text-xs font-bold tabular-nums text-[#2A1D15]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityDelta(1)}
                    className="flex h-9 w-9 items-center justify-center text-[#2A1D15]/70 hover:text-[#2A1D15] active:scale-95"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Big Walnut Brown Buy Button */}
                <button
                  onClick={handleAdd}
                  className="flex h-13 flex-1 items-center justify-between rounded-xl bg-[#2A1D15] px-6 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#F6F2EA] shadow-md transition-all hover:bg-[#1A120C] active:scale-[0.99]"
                >
                  <span>{justAdded ? 'ADDED TO BAG ✓' : 'ADD TO BAG'}</span>
                  <span className="text-[#FFCC70] tabular-nums font-semibold">
                    ${product.price * quantity}
                  </span>
                </button>

                {/* Wishlist Heart */}
                <button
                  onClick={() => {
                    soundEngine.playClick(1.2);
                    setIsLiked(!isLiked);
                  }}
                  title={isLiked ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  className={`flex h-13 w-13 items-center justify-center rounded-xl border transition-all active:scale-95 ${
                    isLiked
                      ? 'border-[#D9534F] bg-[#D9534F]/10 text-[#D9534F]'
                      : 'border-[#2A1D15]/20 bg-[#FAF7F2] text-[#2A1D15]/75 hover:border-[#2A1D15]/50'
                  }`}
                >
                  <Heart className="h-4 w-4" fill={isLiked ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* 3-Point Guarantee Micro Row */}
              <div className="mt-6 grid grid-cols-3 gap-2 border-t border-[#2A1D15]/10 pt-5 font-mono text-[9px] uppercase tracking-[0.16em] text-[#2A1D15]/70">
                <div className="flex flex-col">
                  <span className="font-bold text-[#E59838]">01</span>
                  <span>Free shipping over $150</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[#E59838]">02</span>
                  <span>30-day tactile trial</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[#E59838]">03</span>
                  <span>Two-year craft warranty</span>
                </div>
              </div>

              {/* Accordions */}
              <div className="mt-8 border-t border-[#2A1D15]/15 divide-y divide-[#2A1D15]/10">
                {/* 1. DETAILS */}
                <div className="py-4">
                  <button
                    onClick={() => toggleAccordion('details')}
                    className="flex w-full items-center justify-between font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#2A1D15] hover:text-[#546652]"
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
                              className="flex flex-col rounded-lg border border-[#2A1D15]/10 bg-[#FAF7F2] p-2.5"
                            >
                              <span className="text-[#2A1D15]/50 tracking-[0.18em]">
                                {spec.label}
                              </span>
                              <span className="mt-0.5 font-semibold text-[#2A1D15]">
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
                    className="flex w-full items-center justify-between font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#2A1D15] hover:text-[#546652]"
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
                        <p className="text-xs sm:text-[13px] leading-relaxed text-[#2A1D15]/80">
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
                    className="flex w-full items-center justify-between font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#2A1D15] hover:text-[#546652]"
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
                        <p className="text-xs sm:text-[13px] leading-relaxed text-[#2A1D15]/80">
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
                    className="flex w-full items-center justify-between font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#2A1D15] hover:text-[#546652]"
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
                        <div className="flex items-center justify-between rounded-xl border border-[#2A1D15]/15 bg-[#EFE9DF] p-3.5">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={handleToggleSoundscape}
                              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2A1D15] text-[#FFCC70] hover:scale-105 active:scale-95 transition-transform"
                            >
                              {isPlayingSoundscape ? (
                                <VolumeX className="h-4 w-4" />
                              ) : (
                                <Volume2 className="h-4 w-4" />
                              )}
                            </button>
                            <div>
                              <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#2A1D15]/60">
                                RECORDED AT 1,420°C
                              </div>
                              <div className="font-mono text-xs font-bold text-[#2A1D15]">
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
          </div>
        </div>
      </main>

      {/* =====================================================================
          SECTION 2: MID-PAGE EDITORIAL FEATURE / MATERIAL NOTE (Inspiration Image 2)
      ====================================================================== */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
        <div className="grid grid-cols-1 overflow-hidden rounded-3xl border border-[#2A1D15]/10 shadow-lg lg:grid-cols-12">
          {/* Left Box: Rich Brand Sage Green Block */}
          <div className="flex flex-col justify-between bg-[#546652] p-8 sm:p-12 lg:col-span-5 lg:p-16 text-[#F6F2EA]">
            <div>
              {/* Material Note Eyebrow */}
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#FFCC70]">
                MATERIAL NOTE // 01
              </div>

              {/* Big Editorial Headline with Italic Accent */}
              <h2 className="mt-6 font-display text-3xl sm:text-4xl lg:text-[46px] font-extrabold leading-[1.06] tracking-[-0.03em] text-[#F6F2EA]">
                Made for the<br />
                way<br />
                you{' '}
                <span className="font-serif-editorial italic font-normal text-[#FFCC70]">
                  actually
                </span>
                <br />
                live.
              </h2>

              {/* Narrative Copy */}
              <p className="mt-8 text-sm sm:text-[15px] leading-relaxed text-[#F6F2EA]/85">
                {product.materialNote ||
                  'Every surface is selected for touch, resilience, and the way it changes over time. Nothing is hidden beneath high-gloss finishes. The honest material is the final detail.'}
              </p>
            </div>

            {/* Micro Craft Specs */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/15 pt-6 font-mono text-[9px] uppercase tracking-[0.2em] text-[#F6F2EA]/75">
              {product.craftDetails?.map((item) => (
                <div key={item.label} className="flex flex-col">
                  <span className="text-[#FFCC70]/80">{item.label}</span>
                  <span className="mt-1 font-semibold text-[#F6F2EA]">{item.value}</span>
                </div>
              )) || (
                <>
                  <div className="flex flex-col">
                    <span className="text-[#FFCC70]/80">ORIGIN</span>
                    <span className="mt-1 font-semibold text-[#F6F2EA]">SMALL-BATCH FOUNDRY</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#FFCC70]/80">FINISH</span>
                    <span className="mt-1 font-semibold text-[#F6F2EA]">HAND APPLIED</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[#FFCC70]/80">DESIGNED FOR</span>
                    <span className="mt-1 font-semibold text-[#F6F2EA]">DAILY USE</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Box: Tinted Sage/Linen Backdrop with Artistic Angled Product View */}
          <div className="relative flex min-h-[380px] sm:min-h-[460px] lg:col-span-7 items-center justify-center bg-gradient-to-tr from-[#DCE3DA] via-[#E4EAE2] to-[#EFE9DF] p-8 sm:p-12 overflow-hidden">
            {/* Secondary Floating View */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              className="relative z-10 flex w-full max-w-lg items-center justify-center"
            >
              <img
                src={galleryImages[1] || product.image}
                alt={`${product.name} material detail`}
                className="max-h-[340px] sm:max-h-[420px] w-auto object-contain filter drop-shadow-[0_28px_40px_rgba(42,29,21,0.28)]"
              />
            </motion.div>

            {/* Bottom-right Micro Pill */}
            <div className="absolute bottom-6 right-6 z-20 rounded-full border border-[#2A1D15]/15 bg-[#F6F2EA]/85 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-[#2A1D15]/80 backdrop-blur-md">
              TEXTURE // TONE // TIME
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 3: OBJECTS THAT SIT WELL TOGETHER (Inspiration Image 3)
      ====================================================================== */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pt-10 pb-24 sm:px-8 sm:pt-14 sm:pb-32">
        {/* Section Header */}
        <div className="mb-10 sm:mb-12">
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#E59838]">
            CONTINUE EXPLORING
          </div>
          <h3 className="mt-3 font-display text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-[-0.03em] text-[#2A1D15] leading-[1.1]">
            Objects that sit well<br />
            <span className="font-serif-editorial italic font-normal text-[#E59838]">
              together.
            </span>
          </h3>
        </div>

        {/* 3-Column Curated Cross-Sell Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {crossSellProducts.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                soundEngine.playClick(1.05);
                onSelectProduct(item);
              }}
              className="group flex flex-col cursor-pointer"
            >
              {/* Photographic Box Container */}
              <div className="relative flex aspect-square sm:aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl border border-[#2A1D15]/10 bg-gradient-to-b from-[#FAF7F2] to-[#ECE5D8] p-6 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:border-[#2A1D15]/30">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-contain filter drop-shadow-md transition-transform duration-500 ease-out group-hover:scale-106"
                  loading="lazy"
                />
              </div>

              {/* Info Line below */}
              <div className="mt-4 flex flex-col">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#2A1D15]/55">
                  {item.category}
                </div>
                <div className="mt-1 flex items-baseline justify-between gap-3">
                  <h4 className="font-display text-base font-bold text-[#2A1D15] group-hover:text-[#546652] transition-colors truncate">
                    {item.name}
                  </h4>
                  <span className="font-mono text-xs font-semibold text-[#2A1D15] tabular-nums shrink-0">
                    ${item.price}
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
      <footer className="relative z-10 border-t border-[#2A1D15]/10 bg-[#FAF7F2] px-4 py-8 sm:px-8 text-center text-[#2A1D15]/65 font-mono text-[10px] uppercase tracking-[0.2em]">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img
              src="/images/thissoftware-emblem-transparent.png"
              alt="thissoftware"
              className="h-5 w-5 object-contain"
            />
            <span className="font-display font-bold text-[#2A1D15]">thissoftwarestore</span>
          </div>
          <div>OBJECTS BORN FROM SILICON & SAND // BATCH 001</div>
          <button
            onClick={() => {
              soundEngine.playClick(0.9);
              onBackToStore();
            }}
            className="hover:text-[#2A1D15] underline decoration-[#E59838] underline-offset-4"
          >
            RETURN TO COLLECTION ↑
          </button>
        </div>
      </footer>
    </div>
  );
};
