import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingBag,
  Volume2,
  VolumeX,
  ArrowUpRight,
  Sparkles,
  X,
  Plus,
  Minus,
  Check,
  Compass,
  Cpu,
  Radio,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { PRODUCTS, Product } from '../data/products';
import { ProductIllustration } from './ProductIllustration';
import { soundEngine } from '../utils/soundEngine';

export interface CartItem {
  product: Product;
  finishName: string;
  size?: string;
  quantity: number;
}

interface CleanStorefrontProps {
  cart: CartItem[];
  onAddToCart: (product: Product, finishName: string, size?: string) => void;
  onUpdateQuantity: (index: number, delta: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onReplayDesertOrigin: () => void;
  isLockedStoreOnly: boolean;
}

const CATEGORIES = ['ALL', 'KEYBOARDS', 'AUDIO', 'APPAREL', 'OBJECTS'] as const;

export const CleanStorefront: React.FC<CleanStorefrontProps> = ({
  cart,
  onAddToCart,
  onUpdateQuantity,
  isMuted,
  onToggleMute,
  onReplayDesertOrigin,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('cat') || 'ALL';
  });
  const [searchQuery, setSearchQuery] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  });
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [selectedFinishIdx, setSelectedFinishIdx] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [isBagOpen, setIsBagOpen] = useState<boolean>(false);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Sync search & category to URL query params so refreshing keeps the shopper right where they are
  const handleCategoryChange = (cat: string) => {
    soundEngine.playClick(1.1);
    setSelectedCategory(cat);
    const url = new URL(window.location.href);
    url.searchParams.set('view', 'store');
    if (cat === 'ALL') url.searchParams.delete('cat');
    else url.searchParams.set('cat', cat);
    window.history.replaceState({}, '', url.toString());
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    const url = new URL(window.location.href);
    url.searchParams.set('view', 'store');
    if (!q.trim()) url.searchParams.delete('q');
    else url.searchParams.set('q', q);
    window.history.replaceState({}, '', url.toString());
  };

  const filteredProducts = PRODUCTS.filter((item) => {
    const matchesCategory =
      selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openProductSpotlight = (product: Product) => {
    soundEngine.playClick(0.95);
    setSelectedFinishIdx(0);
    setSelectedSize(product.sizes ? product.sizes[2] || 'L' : 'L');
    setActiveProduct(product);
    soundEngine.startProductMusic(product.soundscape);
  };

  const closeProductSpotlight = () => {
    soundEngine.playClick(0.85);
    setActiveProduct(null);
    soundEngine.stopProductMusic();
  };

  const cycleSpotlightProduct = (dir: 1 | -1) => {
    if (!activeProduct) return;
    const currentIndex = PRODUCTS.findIndex((p) => p.id === activeProduct.id);
    const nextIndex = (currentIndex + dir + PRODUCTS.length) % PRODUCTS.length;
    const nextProduct = PRODUCTS[nextIndex];
    soundEngine.playClick(1.15);
    setSelectedFinishIdx(0);
    setActiveProduct(nextProduct);
    soundEngine.startProductMusic(nextProduct.soundscape);
  };

  const triggerAdd = (product: Product, finishName: string, size?: string) => {
    soundEngine.playAddToBagChord();
    onAddToCart(product, finishName, size);
    setJustAddedId(product.id);
    setTimeout(() => setJustAddedId(null), 1300);
  };

  const totalBagCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalBagPrice = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <section
      id="thissoftware-clean-store"
      className="relative min-h-[100dvh] w-full bg-[#F6F2EA] text-[#2A1D15] transition-colors duration-700"
    >
      {/* Top Organic Sand-Leak Edge Where the Night Desert Meets the Clean Website */}
      <div className="pointer-events-none relative h-14 w-full overflow-hidden bg-gradient-to-b from-[#160E09] via-[#2A1D15]/45 to-transparent">
        <svg
          viewBox="0 0 1440 56"
          fill="none"
          preserveAspectRatio="none"
          className="h-full w-full"
        >
          <path
            d="M0 0 H1440 V18 C1310 42, 1180 8, 1020 28 C860 48, 720 12, 540 32 C360 52, 180 14, 0 34 Z"
            fill="#160E09"
          />
          <path
            d="M0 12 C240 44, 480 6, 720 32 C960 56, 1200 10, 1440 28 V56 H0 Z"
            fill="#F6F2EA"
            fillOpacity="0.95"
          />
        </svg>
      </div>

      {/* Sticky Architectural Store Navigation (Sage Green, Walnut Brown, Amber Glow) */}
      <header className="sticky top-0 z-30 border-b border-[#2A1D15]/10 bg-[#F6F2EA]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5 sm:px-8">
          {/* Brand Monolith Identity + Return to Desert Origin button */}
          <div className="flex items-center gap-3 sm:gap-5">
            <button
              onClick={() => {
                soundEngine.playClick(0.9);
                onReplayDesertOrigin();
              }}
              title="Re-experience the Desert to Silicon Origin Journey"
              className="group flex items-center gap-1.5 rounded-full border border-[#5C4331]/20 bg-[#EDE5D5] px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.18em] text-[#5C4331] transition-all hover:border-[#E59838] hover:bg-[#2A1D15] hover:text-[#F6F2EA] active:scale-95"
            >
              <Compass className="h-3.5 w-3.5 text-[#E59838] transition-transform duration-500 group-hover:rotate-45" />
              <span className="hidden sm:inline">DESERT ORIGIN</span>
              <span className="sm:hidden">ORIGIN</span>
            </button>

            <div className="flex items-center gap-3">
              <img
                src="/images/thissoftware-logo.jpg"
                alt="thissoftware"
                className="h-8 w-8 rounded-lg object-contain bg-black shadow-md border border-[#2A1D15]/10"
              />
              <div className="flex flex-col">
                <span className="font-display text-base font-extrabold tracking-[-0.04em] text-[#2A1D15] sm:text-xl">
                  thissoftwarestore
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#6B8068]">
                  SAND → SILICON → OBJECTS
                </span>
              </div>
            </div>
          </div>

          {/* Instant Search Input (Stays in Store Mode — Never Triggers Intro) */}
          <div className="relative hidden max-w-xs flex-1 md:block">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#5C4331]/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search keyboards, audio, 620gsm hoodies..."
              className="w-full rounded-full border border-[#2A1D15]/15 bg-[#EDE5D5]/75 py-2 pl-9 pr-8 text-xs text-[#2A1D15] placeholder-[#5C4331]/55 outline-none transition-all focus:border-[#6B8068] focus:bg-white focus:ring-2 focus:ring-[#6B8068]/20"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-[#5C4331] hover:text-[#2A1D15]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Right Controls: Sonic Toggle + Magnetic Bag Pill */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onToggleMute}
              className={`flex min-h-[40px] items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 ${
                !isMuted
                  ? 'border-[#6B8068]/40 bg-[#6B8068]/15 text-[#374236]'
                  : 'border-[#2A1D15]/15 bg-transparent text-[#5C4331]/70'
              }`}
            >
              {isMuted ? (
                <VolumeX className="h-3.5 w-3.5 text-[#5C4331]" />
              ) : (
                <Volume2 className="h-3.5 w-3.5 text-[#E59838]" />
              )}
              <span className="hidden sm:inline">
                {isMuted ? 'SOUND : OFF' : 'ATMOS : ON'}
              </span>
            </button>

            <button
              onClick={() => {
                soundEngine.playClick(1.05);
                setIsBagOpen(true);
              }}
              className="group relative flex min-h-[40px] items-center gap-2.5 rounded-full bg-[#2A1D15] px-4 py-2 text-xs font-medium text-[#F6F2EA] shadow-sm transition-all hover:bg-[#422F22] active:scale-95"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-[#E59838]" />
              <span className="font-mono text-[11px] tracking-[0.15em]">BAG</span>
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#6B8068] px-1.5 font-mono text-[10px] font-semibold text-white tabular-nums">
                {totalBagCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search & Category Filter Ribbon */}
        <div className="mx-auto max-w-7xl px-4 pb-3 sm:px-8">
          <div className="relative mb-2.5 md:hidden">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#5C4331]/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search hardware, headphones, hoodies..."
              className="w-full rounded-full border border-[#2A1D15]/15 bg-[#EDE5D5]/80 py-2 pl-9 pr-8 text-xs text-[#2A1D15] placeholder-[#5C4331]/60 outline-none focus:border-[#6B8068] focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C4331]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-0.5">
            <div className="flex items-center gap-1.5">
              {CATEGORIES.map((category) => {
                const active = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`relative rounded-full px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors whitespace-nowrap ${
                      active
                        ? 'text-[#F6F2EA]'
                        : 'text-[#5C4331] hover:bg-[#2A1D15]/5 hover:text-[#2A1D15]'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="activeCategoryPill"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        className="absolute inset-0 rounded-full bg-[#6B8068]"
                      />
                    )}
                    <span className="relative z-10">{category}</span>
                  </button>
                );
              })}
            </div>

            <div className="hidden items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-[#5C4331]/75 lg:flex">
              <span className="inline-block h-2 w-2 rounded-full bg-[#E59838] animate-pulse" />
              <span>SILICON FOUNDRY BATCH // 001 READY TO SHIP</span>
            </div>
          </div>
        </div>
      </header>

      {/* Editorial Oasis Banner (Casa di Solare Warmth × thissoftware Hardware) */}
      <div className="mx-auto max-w-7xl px-4 pt-8 pb-6 sm:px-8 sm:pt-12">
        <div className="relative overflow-hidden rounded-3xl border border-[#2A1D15]/10 bg-gradient-to-br from-[#2A1D15] via-[#3A281D] to-[#1E140E] p-6 text-[#F6F2EA] shadow-xl sm:p-10">
          {/* Warm Amber Glow Sunburst inside Banner */}
          <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[#E59838]/25 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-[#6B8068]/20 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#E59838]/40 bg-[#E59838]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-[#FFCC70]">
                <Cpu className="h-3 w-3 text-[#E59838]" />
                <span>FROM DESERT QUARTZ TO SILICON OBJECTS</span>
              </div>
              <h1 className="font-display text-2xl font-bold tracking-[-0.03em] text-[#F6F2EA] sm:text-4xl lg:text-5xl leading-[1.06]">
                Forged in the desert heat.{' '}
                <span className="font-serif-editorial italic font-normal text-[#E59838]">
                  Tuned for deep focus.
                </span>
              </h1>
              <p className="mt-3 max-w-xl text-xs leading-relaxed text-[#DDD0C3]/85 sm:text-sm">
                Every keyboard, headphone, and heavyweight garment begins as raw desert
                mineral—melted into custom silicon and dressed in tactile{' '}
                <span className="text-[#A9B9A5] font-medium">Sage Green</span>,{' '}
                <span className="text-[#D8C3A5] font-medium">Walnut Brown</span>, and{' '}
                <span className="text-[#FFCC70] font-medium">Amber Glow</span>. Tap any
                object to enter its acoustic room.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
                <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#A9B9A5]">
                  PALETTE DNA
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <span
                    className="h-4 w-4 rounded-full border border-white/30 bg-[#6B8068]"
                    title="Sage Green"
                  />
                  <span
                    className="h-4 w-4 rounded-full border border-white/30 bg-[#5C4331]"
                    title="Walnut Brown"
                  />
                  <span
                    className="h-4 w-4 rounded-full border border-white/30 bg-[#E59838]"
                    title="Amber Glow"
                  />
                  <span className="ml-1 font-mono text-[11px] text-[#F6F2EA]">
                    CASA SOLAR EDITION
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <main className="mx-auto max-w-7xl px-4 pb-24 sm:px-8">
        {filteredProducts.length === 0 ? (
          <div className="my-12 rounded-3xl border border-[#2A1D15]/10 bg-[#EDE5D5]/50 p-12 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#5C4331]">
              NO OBJECTS MATCHING "{searchQuery}"
            </p>
            <button
              onClick={() => {
                handleSearchChange('');
                handleCategoryChange('ALL');
              }}
              className="mt-4 rounded-full bg-[#6B8068] px-5 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white"
            >
              RESET FILTERS
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredProducts.map((product) => {
              const isAdded = justAddedId === product.id;
              return (
                <motion.article
                  layout
                  layoutId={`product-card-${product.id}`}
                  key={product.id}
                  onClick={() => openProductSpotlight(product)}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.985 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border border-[#2A1D15]/12 bg-[#EFE8E1]/90 p-5 shadow-sm transition-shadow hover:border-[#6B8068]/60 hover:shadow-xl"
                >
                  {/* Top Card Meta */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#5C4331]">
                        {product.index} // {product.code}
                      </span>
                      {product.badge && (
                        <span className="ml-2 inline-block rounded-full bg-[#6B8068]/20 px-2.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-[#374236]">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    {/* Sonic Identity Pill Indicator */}
                    <div className="flex items-center gap-1.5 rounded-full border border-[#2A1D15]/10 bg-[#F6F2EA] px-2.5 py-1 text-[9px] font-mono uppercase tracking-[0.15em] text-[#5C4331] group-hover:border-[#E59838] group-hover:bg-[#2A1D15] group-hover:text-[#FFCC70] transition-colors">
                      <Radio className="h-3 w-3 text-[#E59838]" />
                      <span>SONIC ID</span>
                    </div>
                  </div>

                  {/* Interactive Object Render Stage */}
                  <div className="relative my-4 flex h-52 w-full items-center justify-center rounded-2xl bg-gradient-to-b from-[#F6F2EA] to-[#E5DEC9]/65 p-4 overflow-hidden">
                    <div
                      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background:
                          'radial-gradient(circle at 50% 55%, rgba(229, 152, 56, 0.22), transparent 70%)',
                      }}
                    />
                    <motion.div
                      layoutId={`product-visual-${product.id}`}
                      className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-105"
                    >
                      <ProductIllustration product={product} />
                    </motion.div>

                    {/* Micro Chip Origin Stamp */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[9px] font-mono uppercase tracking-[0.16em] text-[#5C4331]/75">
                      <span>{product.chipOrigin.split('//')[0]}</span>
                      <span className="flex items-center gap-1 text-[#6B8068] font-semibold">
                        ENTER ROOM <ArrowUpRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>

                  {/* Title, Finish Dots & Quick Add */}
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <h2 className="font-display text-lg font-bold tracking-[-0.02em] text-[#2A1D15] group-hover:text-[#422F22]">
                        {product.name}
                      </h2>
                      <span className="font-mono text-base font-semibold text-[#2A1D15] tabular-nums">
                        ${product.price}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#5C4331] line-clamp-1">
                      {product.subtitle}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-[#2A1D15]/10 pt-3.5">
                      {/* Finish Swatches preview */}
                      <div className="flex items-center gap-1.5">
                        {product.finishes.map((f, i) => (
                          <span
                            key={f.name}
                            title={f.name}
                            className={`h-4 w-4 rounded-full border ${
                              i === 0
                                ? 'border-[#2A1D15] ring-2 ring-[#E59838]/50'
                                : 'border-black/20'
                            }`}
                            style={{ backgroundColor: f.hex }}
                          />
                        ))}
                        <span className="ml-1.5 font-mono text-[10px] text-[#5C4331]">
                          {product.finishes.length} FINISHES
                        </span>
                      </div>

                      {/* Instant 1-Tap Add Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerAdd(
                            product,
                            product.finishes[0].name,
                            product.sizes ? 'L' : undefined
                          );
                        }}
                        className={`flex min-h-[38px] items-center gap-1.5 rounded-full px-4 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] transition-all active:scale-95 ${
                          isAdded
                            ? 'bg-[#6B8068] text-white'
                            : 'bg-[#2A1D15] text-[#F6F2EA] hover:bg-[#6B8068]'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="h-3.5 w-3.5" /> ADDED
                          </>
                        ) : (
                          <>
                            <Plus className="h-3.5 w-3.5 text-[#E59838]" /> QUICK ADD
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}
      </main>

      {/* Seamless Product Spotlight Modal (Walnut Night Listening Room + Amber Glow + Per-Product Music) */}
      <AnimatePresence>
        {activeProduct && (
          <motion.div
            key="product-spotlight-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-[#160E09]/90 backdrop-blur-xl sm:items-center sm:p-6"
            onClick={closeProductSpotlight}
          >
            <motion.div
              layoutId={`product-card-${activeProduct.id}`}
              onClick={(e) => e.stopPropagation()}
              className="relative flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-y-auto rounded-t-3xl border border-[#E59838]/25 bg-[#1D130D] text-[#F6F2EA] shadow-2xl sm:rounded-3xl lg:grid lg:grid-cols-12"
            >
              {/* Ambient Amber Glow Spotlight behind the product */}
              <div className="pointer-events-none absolute -left-20 top-1/4 h-96 w-96 rounded-full bg-[#E59838]/20 blur-3xl" />
              <div className="pointer-events-none absolute right-10 bottom-10 h-72 w-72 rounded-full bg-[#6B8068]/15 blur-3xl" />

              {/* Left Column: Object Showcase + Live Sonic Soundscape Equalizer */}
              <div className="relative flex flex-col justify-between border-b border-white/10 bg-gradient-to-b from-[#271A12] to-[#160E09] p-6 lg:col-span-7 lg:border-b-0 lg:border-r lg:p-8">
                {/* Top Navigation inside Spotlight */}
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={closeProductSpotlight}
                    className="flex min-h-[42px] items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#EDE5D5] hover:border-[#E59838] hover:bg-white/10 active:scale-95"
                  >
                    <ArrowLeft className="h-3.5 w-3.5 text-[#E59838]" />
                    <span>BACK TO STORE</span>
                  </button>

                  {/* Next / Prev Product Switcher inside the dark spotlight room */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => cycleSpotlightProduct(-1)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#EDE5D5] hover:border-[#E59838]"
                      title="Previous Object"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => cycleSpotlightProduct(1)}
                      className="flex h-10 items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#EDE5D5] hover:border-[#E59838]"
                    >
                      <span>NEXT OBJECT</span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#E59838]" />
                    </button>
                  </div>
                </div>

                {/* Center Floating Product Visual */}
                <motion.div
                  key={`${activeProduct.id}-${selectedFinishIdx}`}
                  initial={{ scale: 0.94, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                  className="my-6 flex h-64 w-full items-center justify-center sm:h-80"
                >
                  <ProductIllustration
                    product={activeProduct}
                    finishIndex={selectedFinishIdx}
                    isHero
                  />
                </motion.div>

                {/* Live Per-Product Music Soundscape Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E59838]/30 bg-black/35 px-4 py-3 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    {/* Animated Amber Equalizer Bars */}
                    <div className="flex h-4 items-end gap-1">
                      {[0.6, 1, 0.75, 0.9, 0.5].map((h, i) => (
                        <motion.span
                          key={i}
                          animate={
                            isMuted
                              ? { height: '3px' }
                              : {
                                  height: ['4px', `${h * 16}px`, '5px'],
                                }
                          }
                          transition={{
                            duration: 0.7 + i * 0.15,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                          className="w-1 rounded-full bg-[#E59838]"
                        />
                      ))}
                    </div>
                    <div>
                      <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#A9B9A5]">
                        OBJECT SOUNDSCAPE // {activeProduct.bpm}
                      </div>
                      <div className="font-mono text-xs font-medium text-[#FFCC70]">
                        {activeProduct.soundtrackTitle}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={onToggleMute}
                    className="rounded-full border border-white/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#EDE5D5] hover:border-[#E59838]"
                  >
                    {isMuted ? 'UNMUTE TRACK' : 'MUTE TRACK'}
                  </button>
                </div>
              </div>

              {/* Right Column: Editorial Details, Finish/Size Swatches & Thumb-Zone Add to Bag */}
              <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-5">
                <div>
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.24em] text-[#A9B9A5]">
                    <span>{activeProduct.code}</span>
                    <span className="text-[#E59838]">{activeProduct.category}</span>
                  </div>

                  <h2 className="mt-2 font-display text-2xl font-bold tracking-[-0.03em] text-[#F6F2EA] sm:text-3xl">
                    {activeProduct.name}
                  </h2>

                  <div className="mt-2 font-mono text-2xl font-semibold text-[#FFCC70] tabular-nums">
                    ${activeProduct.price}
                  </div>

                  <p className="mt-4 text-xs leading-relaxed text-[#DDD0C3]/85 sm:text-sm">
                    {activeProduct.description}
                  </p>

                  {/* Finish Selector */}
                  <div className="mt-6">
                    <label className="block font-mono text-[10px] uppercase tracking-[0.22em] text-[#A9B9A5]">
                      FINISH //{' '}
                      <span className="text-white">
                        {activeProduct.finishes[selectedFinishIdx]?.name}
                      </span>
                    </label>
                    <div className="mt-2.5 flex flex-wrap gap-2.5">
                      {activeProduct.finishes.map((f, idx) => (
                        <button
                          key={f.name}
                          onClick={() => {
                            soundEngine.playClick(1 + idx * 0.08);
                            setSelectedFinishIdx(idx);
                          }}
                          className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs transition-all active:scale-95 ${
                            selectedFinishIdx === idx
                              ? 'border-[#E59838] bg-[#E59838]/15 text-white'
                              : 'border-white/15 bg-white/5 text-[#DDD0C3]/80 hover:border-white/30'
                          }`}
                        >
                          <span
                            className="h-3.5 w-3.5 rounded-full border border-white/40"
                            style={{ backgroundColor: f.hex }}
                          />
                          <span>{f.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size Selector for Apparel */}
                  {activeProduct.sizes && (
                    <div className="mt-5">
                      <label className="block font-mono text-[10px] uppercase tracking-[0.22em] text-[#A9B9A5]">
                        ARCHITECTURAL FIT SIZE
                      </label>
                      <div className="mt-2 flex gap-2">
                        {activeProduct.sizes.map((sz) => (
                          <button
                            key={sz}
                            onClick={() => {
                              soundEngine.playClick(1.1);
                              setSelectedSize(sz);
                            }}
                            className={`h-11 w-12 rounded-xl border font-mono text-xs font-semibold transition-all active:scale-95 ${
                              selectedSize === sz
                                ? 'border-[#6B8068] bg-[#6B8068] text-white'
                                : 'border-white/15 bg-white/5 text-[#DDD0C3]'
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Technical Specs Grid */}
                  <div className="mt-6 grid grid-cols-2 gap-2.5 border-t border-white/10 pt-5">
                    {activeProduct.specs.map((spec) => (
                      <div
                        key={spec.label}
                        className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5"
                      >
                        <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#A9B9A5]">
                          {spec.label}
                        </div>
                        <div className="mt-1 text-xs font-medium text-[#F6F2EA]">
                          {spec.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Thumb-Zone Docked Action Button */}
                <div className="mt-7 pt-2 safe-bottom">
                  <button
                    onClick={() =>
                      triggerAdd(
                        activeProduct,
                        activeProduct.finishes[selectedFinishIdx]?.name ||
                          activeProduct.finishes[0].name,
                        activeProduct.sizes ? selectedSize : undefined
                      )
                    }
                    className="flex min-h-[52px] w-full items-center justify-center gap-3 rounded-2xl bg-[#6B8068] px-6 py-4 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-lg shadow-[#6B8068]/25 transition-all hover:bg-[#859A81] active:scale-98"
                  >
                    {justAddedId === activeProduct.id ? (
                      <>
                        <Check className="h-4 w-4 text-[#FFCC70]" />
                        <span>ADDED TO YOUR OASIS BAG</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 text-[#FFCC70]" />
                        <span>
                          ADD TO BAG — ${activeProduct.price}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-Over Translucent Bag Drawer */}
      <AnimatePresence>
        {isBagOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsBagOpen(false)}
            className="fixed inset-0 z-50 bg-[#160E09]/70 backdrop-blur-md"
          >
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              className="ml-auto flex h-[100dvh] w-full max-w-md flex-col justify-between border-l border-[#2A1D15]/15 bg-[#F6F2EA] p-6 text-[#2A1D15] shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#2A1D15]/10 pb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src="/images/thissoftware-logo.jpg"
                      alt="thissoftware"
                      className="h-9 w-9 rounded-lg object-contain bg-black shadow-md border border-[#2A1D15]/10"
                    />
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6B8068]">
                        THISSOFTWARESTORE // DISPATCH
                      </span>
                      <h3 className="font-display text-xl font-bold">
                        Your Oasis Bag ({totalBagCount})
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsBagOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2A1D15]/15 hover:bg-[#2A1D15] hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="py-20 text-center">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#5C4331]">
                      YOUR BAG IS CURRENTLY EMPTY
                    </p>
                    <p className="mt-2 text-xs text-[#5C4331]/80">
                      Explore keyboards, studio headphones, and 620 GSM desert fleece.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 max-h-[60dvh] space-y-3 overflow-y-auto pr-1">
                    {cart.map((item, idx) => (
                      <div
                        key={`${item.product.id}-${item.finishName}-${item.size}`}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-[#2A1D15]/10 bg-[#EDE5D5]/70 p-3.5"
                      >
                        <div className="h-16 w-20 flex-shrink-0 rounded-xl bg-[#F6F2EA] p-1.5">
                          <ProductIllustration product={item.product} />
                        </div>
                        <div className="flex-1">
                          <div className="font-display text-sm font-bold text-[#2A1D15]">
                            {item.product.name}
                          </div>
                          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#5C4331]">
                            {item.finishName} {item.size ? `// SIZE ${item.size}` : ''}
                          </div>
                          <div className="mt-1 font-mono text-xs font-semibold text-[#2A1D15] tabular-nums">
                            ${item.product.price * item.quantity}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              soundEngine.playClick(0.9);
                              onUpdateQuantity(idx, -1);
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2A1D15]/20 hover:bg-[#2A1D15] hover:text-white"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-5 text-center font-mono text-xs tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => {
                              soundEngine.playClick(1.1);
                              onUpdateQuantity(idx, 1);
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2A1D15]/20 hover:bg-[#2A1D15] hover:text-white"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t border-[#2A1D15]/10 pt-4 safe-bottom">
                  <div className="mb-3 flex items-center justify-between font-mono text-xs uppercase tracking-[0.18em] text-[#5C4331]">
                    <span>ESTIMATED TOTAL</span>
                    <span className="text-base font-bold text-[#2A1D15] tabular-nums">
                      ${totalBagPrice} USD
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      soundEngine.playAddToBagChord();
                      alert(
                        'thissoftwarestore: Instant Checkout Ready! (Demo Order Confirmed)'
                      );
                    }}
                    className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[#2A1D15] py-4 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-[#F6F2EA] hover:bg-[#6B8068] transition-colors"
                  >
                    <span>PROCEED TO INSTANT CHECKOUT</span>
                    <ArrowUpRight className="h-4 w-4 text-[#E59838]" />
                  </button>
                </div>
              )}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

