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
  ArrowUp,
  Heart,
} from 'lucide-react';
import { PRODUCTS, Product } from '../data/products';
import { ProductIllustration } from './ProductIllustration';
import { ProductDetailPage } from './ProductDetailPage';
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
  isLockedStoreOnly?: boolean;
  onScrollToHero?: () => void;
}

const CATEGORIES = ['ALL', 'KEYBOARDS', 'AUDIO', 'APPAREL', 'OBJECTS'] as const;

export const CleanStorefront: React.FC<CleanStorefrontProps> = ({
  cart,
  onAddToCart,
  onUpdateQuantity,
  isMuted,
  onToggleMute,
  onReplayDesertOrigin,
  onScrollToHero,
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
      className="relative min-h-[100dvh] w-full text-[#2A1D15] select-none sm:select-auto bg-[#F6F2EA]"
      style={{
        backgroundColor: '#F6F2EA',
        backgroundImage: 'radial-gradient(circle, rgba(42, 29, 21, 0.16) 1.4px, transparent 1.4px)',
        backgroundSize: '28px 28px',
      }}
    >
      {/* =====================================================================
          COLLECTION HEADER (Directly after Hero — Arranged Exactly Like Reference)
      ====================================================================== */}
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-4 sm:px-8 sm:pt-20">
        {/* Eyebrow */}
        <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-[#D4822B]">
          03 / THE COLLECTION
        </div>

        {/* Title & Narrative Row */}
        <div className="mt-3 flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-8">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-[62px] font-normal leading-[1.02] tracking-[-0.035em] text-[#2A1D15]">
            Made to be{' '}
            <span className="font-serif-editorial italic text-[#D4822B]">
              kept.
            </span>
          </h2>

          <p className="max-w-xs sm:max-w-sm text-xs sm:text-[13px] leading-relaxed text-[#2A1D15]/75 md:pb-1">
            Everyday pieces selected for their feel, function, and ability to age beautifully.
          </p>
        </div>

        {/* Filter & Search Bar Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A1D15]/15 pb-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`rounded-full px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-all whitespace-nowrap ${
                    active
                      ? 'bg-[#2A1D15] text-[#F6F2EA] shadow-sm font-semibold'
                      : 'text-[#2A1D15]/65 hover:text-[#2A1D15] hover:bg-[#2A1D15]/8'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Search Objects Input + Audio + Bag Access */}
          <div className="flex items-center gap-2.5">
            <div className="relative w-full sm:w-60 lg:w-68">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#2A1D15]/45" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search objects"
                className="w-full rounded-full border border-[#2A1D15]/15 bg-[#2A1D15]/5 py-2 pl-9 pr-8 font-sans text-xs text-[#2A1D15] placeholder-[#2A1D15]/40 outline-none transition-all focus:border-[#D4822B] focus:bg-[#2A1D15]/8"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2A1D15]/60 hover:text-[#2A1D15]"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            <button
              onClick={onToggleMute}
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2A1D15]/15 bg-[#2A1D15]/5 text-[#2A1D15] transition-all hover:bg-[#2A1D15]/12 active:scale-95 shrink-0"
            >
              {isMuted ? (
                <VolumeX className="h-3.5 w-3.5 text-[#2A1D15]/40" />
              ) : (
                <Volume2 className="h-3.5 w-3.5 text-[#D4822B]" />
              )}
            </button>

            <button
              onClick={() => {
                soundEngine.playClick(1.05);
                setIsBagOpen(true);
              }}
              className="group relative flex h-9 items-center gap-2 rounded-full border border-[#2A1D15]/20 bg-[#2A1D15] px-3.5 text-xs font-medium text-[#F6F2EA] shadow-sm transition-all hover:bg-[#2A1D15]/90 active:scale-95 shrink-0"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-[#FFCC70]" />
              <span className="font-mono text-[10px] tracking-wider hidden xs:inline">BAG</span>
              <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#FFCC70] px-1 font-mono text-[9px] font-bold text-[#1E140E] tabular-nums">
                {totalBagCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Product Display (Minimal Museum Catalog on Sand Linen Dotted Canvas) */}
      <main className="mx-auto max-w-7xl px-4 pt-10 pb-28 sm:px-8">
        {filteredProducts.length === 0 ? (
          <div className="my-16 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#2A1D15]/70">
              NO OBJECTS MATCHING "{searchQuery}"
            </p>
            <button
              onClick={() => {
                handleSearchChange('');
                handleCategoryChange('ALL');
              }}
              className="mt-4 rounded-full border border-[#2A1D15]/20 bg-[#2A1D15]/5 px-5 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#2A1D15] hover:bg-[#2A1D15]/10"
            >
              RESET FILTERS
            </button>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 sm:gap-x-12 lg:gap-x-16 gap-y-16 sm:gap-y-20"
          >
            {filteredProducts.map((product) => {
              const isAdded = justAddedId === product.id;
              return (
                <div
                  key={product.id}
                  onClick={() => openProductSpotlight(product)}
                  className="group flex flex-col justify-between cursor-pointer"
                >
                  {/* Real Product Image Container with Badges */}
                  <div className="relative flex h-64 sm:h-72 w-full items-center justify-center p-4">
                    {/* Top-Left Badge: NEW OBJECT / BESTSELLER */}
                    <div className="absolute top-2 left-2 z-10 rounded-full bg-[#2A1D15] px-3 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[#F6F2EA] shadow-sm">
                      {product.badge || (product.index === '01' ? 'NEW OBJECT' : 'BESTSELLER')}
                    </div>

                    {/* Top-Right Wishlist Heart Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        soundEngine.playClick(1.2);
                      }}
                      className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[#2A1D15]/15 bg-white/70 text-[#2A1D15] shadow-xs hover:bg-white transition-all active:scale-95"
                    >
                      <Heart className="h-3.5 w-3.5" />
                    </button>

                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain filter drop-shadow-xl transition-transform duration-500 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Minimal Product Information */}
                  <div className="mt-4 flex flex-col">
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-[#2A1D15]/60">
                      <span>{product.category}</span>
                      <span className="font-semibold text-[#D4822B] text-sm tabular-nums">
                        ${product.price}
                      </span>
                    </div>

                    <h3 className="mt-1 font-display text-base sm:text-lg font-medium tracking-tight text-[#2A1D15] group-hover:text-[#D4822B] transition-colors truncate">
                      {product.name}
                    </h3>

                    <p className="mt-1 text-xs text-[#2A1D15]/70 line-clamp-1">
                      {product.subtitle}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-[#2A1D15]/12 pt-3">
                      {/* Subtle Color Finish Indicators */}
                      <div className="flex items-center gap-1.5">
                        {product.finishes.map((f, i) => (
                          <span
                            key={f.name}
                            title={f.name}
                            className={`h-2.5 w-2.5 rounded-full border border-[#2A1D15]/25 ${
                              i === 0 ? 'ring-1 ring-[#D4822B]' : ''
                            }`}
                            style={{ backgroundColor: f.hex }}
                          />
                        ))}
                        <span className="ml-1 font-mono text-[9px] uppercase tracking-wider text-[#2A1D15]/50">
                          {product.finishes.length} finishes
                        </span>
                      </div>

                      {/* Minimal Quick Add Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerAdd(
                            product,
                            product.finishes[0].name,
                            product.sizes ? 'L' : undefined
                          );
                        }}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-[0.16em] transition-all active:scale-95 ${
                          isAdded
                            ? 'bg-[#D4822B] text-white font-semibold shadow-sm'
                            : 'border border-[#2A1D15]/20 bg-[#2A1D15]/5 text-[#2A1D15] hover:bg-[#2A1D15] hover:text-[#F6F2EA]'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="h-3 w-3" /> ADDED
                          </>
                        ) : (
                          <>
                            <Plus className="h-3 w-3 text-[#D4822B]" /> ADD
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* =====================================================================
          SECTION 4: MATERIAL STUDY / WALNUT (Inspiration Image 2)
      ====================================================================== */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-20">
        <div className="grid grid-cols-1 overflow-hidden rounded-3xl border border-white/10 shadow-2xl lg:grid-cols-12">
          {/* Left Column: Full Editorial Workspace / Keyboard Flatlay */}
          <div className="relative min-h-[340px] sm:min-h-[460px] lg:col-span-7 overflow-hidden bg-[#160E09]">
            {/* Journal Pill Badge */}
            <div className="absolute top-6 left-6 z-20 rounded-full bg-white/90 px-3.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#1E140E] shadow-sm backdrop-blur-md">
              JOURNAL 034
            </div>

            <img
              src="/images/products/keyboard-detail.jpg"
              alt="Material Study American Walnut Keyboard"
              className="h-full w-full object-cover object-center filter brightness-[0.95] contrast-[1.05] transition-transform duration-700 hover:scale-103"
            />
          </div>

          {/* Right Column: Soft Tinted Sage/Linen Editorial Content Box */}
          <div className="flex flex-col justify-between bg-[#E3E8E1] p-8 sm:p-12 lg:col-span-5 lg:p-14 text-[#2A1D15]">
            <div>
              {/* Eyebrow */}
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#D4822B]">
                MATERIAL STUDY / WALNUT
              </div>

              {/* Big Editorial Headline */}
              <h3 className="mt-5 font-display text-4xl sm:text-5xl lg:text-[52px] font-normal leading-[1.04] tracking-[-0.035em] text-[#2A1D15]">
                Built by<br />
                time,<br />
                finished by<br />
                <span className="font-serif-editorial italic text-[#D4822B]">
                  hand.
                </span>
              </h3>

              {/* Narrative Copy */}
              <p className="mt-6 text-xs sm:text-[13px] leading-relaxed text-[#2A1D15]/80">
                Why the grain, warmth, and quiet resilience of American walnut make it our material of choice for the objects closest to us.
              </p>
            </div>

            {/* Field Note Link */}
            <div className="mt-10 pt-4">
              <button
                onClick={() => {
                  soundEngine.playClick(1.0);
                  openProductSpotlight(PRODUCTS[0]);
                }}
                className="group inline-flex items-center gap-2 border-b border-[#2A1D15] pb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[#2A1D15] transition-colors hover:text-[#D4822B] hover:border-[#D4822B]"
              >
                <span>READ THE FIELD NOTE</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 5: OCCASIONAL DISPATCHES / NEWSLETTER (Inspiration Image 3)
      ====================================================================== */}
      <section className="relative z-10 w-full bg-[#D4822B] py-16 sm:py-24 text-[#2A1D15]">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          {/* Eyebrow */}
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#2A1D15]/75">
            OCCASIONAL DISPATCHES
          </div>

          <div className="mt-4 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 sm:gap-12">
            {/* Left: Big Headline */}
            <h3 className="font-display text-4xl sm:text-5xl lg:text-[62px] font-normal leading-[1.02] tracking-[-0.035em] text-[#2A1D15]">
              Notes on living<br />
              <span className="font-serif-editorial italic text-[#F6F2EA]">
                with less.
              </span>
            </h3>

            {/* Right: Narrative + Single Minimal Underline Form */}
            <div className="w-full max-w-md">
              <p className="text-xs sm:text-[13px] leading-relaxed text-[#2A1D15]/85">
                New objects, maker stories, and nothing else.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  soundEngine.playClick(1.2);
                  alert('Thank you for subscribing to thissoftwarestore occasional dispatches.');
                }}
                className="mt-6 flex items-center border-b border-[#2A1D15]/35 pb-2 transition-colors focus-within:border-[#2A1D15]"
              >
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  className="w-full bg-transparent font-sans text-xs sm:text-sm text-[#2A1D15] placeholder-[#2A1D15]/60 outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="ml-3 text-lg font-light text-[#2A1D15] transition-transform hover:translate-x-1 active:scale-95"
                >
                  →
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 6: ARCHITECTURAL DEEP WALNUT FOOTER (Inspiration Image 3)
      ====================================================================== */}
      <footer className="relative z-10 w-full bg-[#1A120C] pt-16 pb-10 text-[#F6F2EA]">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          {/* Main Footer Row */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8 pb-14 border-b border-white/10">
            {/* Left: Brand Emblem + Wordmark */}
            <div className="md:col-span-4 flex items-center gap-3">
              <img
                src="/images/thissoftware-emblem-transparent.png"
                alt="thissoftware"
                className="h-8 w-8 object-contain"
              />
              <span className="font-display text-lg font-medium tracking-tight text-[#F6F2EA]">
                thissoftwarestore
              </span>
            </div>

            {/* Center: Poetic Statement */}
            <div className="md:col-span-5 flex flex-col justify-center text-xs sm:text-[13px] leading-relaxed text-[#F6F2EA]/70">
              <p>Considered objects for daily life.</p>
              <p>Designed somewhere quiet.</p>
            </div>

            {/* Right: 2-Column Links */}
            <div className="md:col-span-3 grid grid-cols-2 gap-6 font-mono text-[10px] uppercase tracking-[0.22em] text-[#F6F2EA]/80">
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleCategoryChange('ALL')}
                  className="text-left hover:text-[#FFCC70] transition-colors"
                >
                  SHOP
                </button>
                <button
                  onClick={() => openProductSpotlight(PRODUCTS[0])}
                  className="text-left hover:text-[#FFCC70] transition-colors"
                >
                  JOURNAL
                </button>
              </div>
              <div className="flex flex-col gap-3">
                <a
                  href="#about"
                  onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#FFCC70] transition-colors"
                >
                  ABOUT
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#FFCC70] transition-colors"
                >
                  INSTAGRAM
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Baseline */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.2em] text-[#F6F2EA]/45">
            <div>© 2026 THISSOFTWARESTORE</div>
            <div className="flex items-center gap-4">
              <span className="hover:text-white transition-colors cursor-pointer">PRIVACY</span>
              <span>·</span>
              <span className="hover:text-white transition-colors cursor-pointer">TERMS</span>
            </div>
            <button
              onClick={() => {
                soundEngine.playClick(0.9);
                if (onScrollToHero) onScrollToHero();
                else window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#FFCC70] transition-colors"
            >
              BACK TO TOP ↑
            </button>
          </div>
        </div>
      </footer>

      {/* Architectural Detailed Page Experience (Directly Inspired by Casadisolare Spec) */}
      <AnimatePresence>
        {activeProduct && (
          <motion.div
            key={`product-detail-page-${activeProduct.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 overflow-y-auto bg-[#F6F2EA]"
          >
            <ProductDetailPage
              product={activeProduct}
              onBackToStore={closeProductSpotlight}
              onSelectProduct={(p) => {
                soundEngine.playClick(1.05);
                setActiveProduct(p);
                soundEngine.startProductMusic(p.soundscape);
              }}
              onAddToCart={(p, finish, size, qty = 1) => {
                for (let i = 0; i < qty; i++) {
                  onAddToCart(p, finish, size);
                }
              }}
              onOpenBag={() => setIsBagOpen(true)}
              cartCount={totalBagCount}
              isMuted={isMuted}
              onToggleMute={onToggleMute}
            />
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
            className="fixed inset-0 z-60 bg-[#160E09]/75 backdrop-blur-md"
          >
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              className="ml-auto flex h-[100dvh] w-full max-w-md flex-col justify-between border-l border-white/10 bg-[#1A120C] p-6 text-[#F6F2EA] shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src="/images/thissoftware-emblem-transparent.png"
                      alt="thissoftware"
                      className="h-9 w-9 object-contain"
                    />
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#FFCC70]">
                        THISSOFTWARESTORE // DISPATCH
                      </span>
                      <h3 className="font-display text-xl font-bold text-[#F6F2EA]">
                        Your Oasis Bag ({totalBagCount})
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsBagOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 hover:bg-white/10 text-white/70 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="py-20 text-center">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#F6F2EA]/60">
                      YOUR BAG IS CURRENTLY EMPTY
                    </p>
                    <p className="mt-2 text-xs text-[#F6F2EA]/40">
                      Explore keyboards, studio headphones, and 620 GSM desert fleece.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 max-h-[60dvh] space-y-3 overflow-y-auto pr-1">
                    {cart.map((item, idx) => (
                      <div
                        key={`${item.product.id}-${item.finishName}-${item.size}`}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5"
                      >
                        <div className="h-16 w-20 flex-shrink-0 rounded-xl bg-white/[0.03] p-1.5 flex items-center justify-center">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="h-full w-full object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-display text-sm font-bold text-[#F6F2EA]">
                            {item.product.name}
                          </div>
                          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#FFCC70]/80">
                            {item.finishName} {item.size ? `// SIZE ${item.size}` : ''}
                          </div>
                          <div className="mt-1 font-mono text-xs font-semibold text-[#FFCC70] tabular-nums">
                            ${item.product.price * item.quantity}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              soundEngine.playClick(0.9);
                              onUpdateQuantity(idx, -1);
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 hover:bg-white/10 text-white/70 hover:text-white"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-5 text-center font-mono text-xs tabular-nums text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => {
                              soundEngine.playClick(1.1);
                              onUpdateQuantity(idx, 1);
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 hover:bg-white/10 text-white/70 hover:text-white"
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
                <div className="border-t border-white/10 pt-4 safe-bottom">
                  <div className="mb-3 flex items-center justify-between font-mono text-xs uppercase tracking-[0.18em] text-[#F6F2EA]/70">
                    <span>ESTIMATED TOTAL</span>
                    <span className="text-base font-bold text-[#FFCC70] tabular-nums">
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
                    className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-[#FFCC70] py-4 font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#1E140E] hover:bg-[#FFE094] transition-colors"
                  >
                    <span>PROCEED TO INSTANT CHECKOUT</span>
                    <ArrowUpRight className="h-4 w-4 text-[#1E140E]" />
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

