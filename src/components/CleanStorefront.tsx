import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingBag,
  Volume2,
  VolumeX,
  ArrowUpRight,
  X,
  Plus,
  Check,
  Flame,
  ChevronLeft,
  ChevronRight,
  Clock,
  Tag,
  Sparkles,
  ArrowUpDown,
  PackageCheck,
  Store,
  Sun,
  Moon,
} from 'lucide-react';
import {
  PRODUCTS,
  PROMO_BANNERS,
  QUICK_TILES,
  SIGNATURE_COLLECTIONS,
  Product,
  StoreCategory,
  CollectionTag,
} from '../data/products';
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
  onOpenBag: () => void;
  onOpenTrackOrder?: () => void;
  onOpenSell?: () => void;
  onOpenSellerDashboard?: () => void;
  isBagOpen?: boolean;
  onDetailOpenChange?: (open: boolean) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isDark?: boolean;
  onToggleDark?: () => void;
  onReplayDesertOrigin: () => void;
  isLockedStoreOnly?: boolean;
  onScrollToHero?: () => void;
}

const CATEGORIES: StoreCategory[] = [
  'ALL',
  'TOPS',
  'OUTERWEAR',
  'BOTTOMS',
  'ACCESSORIES',
  'TECH & DESK',
];

const COLLECTION_FILTERS: (CollectionTag | 'ALL')[] = [
  'ALL',
  '404',
  'TERMINAL',
  'SYNTAX',
  'LOADING',
  'CORE',
];

function formatCountdown(totalSeconds: number) {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(hrs)}h : ${pad(mins)}m : ${pad(secs)}s`;
}

export const CleanStorefront: React.FC<CleanStorefrontProps> = ({
  cart,
  onAddToCart,
  onOpenBag,
  onOpenTrackOrder,
  onOpenSell,
  onOpenSellerDashboard,
  isBagOpen = false,
  onDetailOpenChange,
  isMuted,
  onToggleMute,
  isDark = false,
  onToggleDark,
  onScrollToHero,
}) => {
  const catalogGridRef = useRef<HTMLDivElement | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<StoreCategory>(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('cat') as StoreCategory | null;
    return cat && CATEGORIES.includes(cat) ? cat : 'ALL';
  });
  const [selectedCollection, setSelectedCollection] = useState<CollectionTag | 'ALL'>('ALL');
  const [onlyFlash, setOnlyFlash] = useState<boolean>(false);
  const [onlyDistressed, setOnlyDistressed] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  });

  const [promoIdx, setPromoIdx] = useState<number>(0);
  const [promoPaused, setPromoPaused] = useState<boolean>(false);
  const [flashSeconds, setFlashSeconds] = useState<number>(4 * 3600 + 28 * 60 + 42);

  const [activeProduct, setActiveProduct] = useState<Product | null>(() => {
    const params = new URLSearchParams(window.location.search);
    const prodId = params.get('product');
    return prodId ? PRODUCTS.find((p) => p.id === prodId) || null : null;
  });
  const [selectedFinishIdx, setSelectedFinishIdx] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'discount'>(
    'featured'
  );
  const [portalOrigin, setPortalOrigin] = useState<{
    x: number;
    y: number;
    maxRadius: number;
  }>({ x: 720, y: 450, maxRadius: 1800 });
  const productModalRef = React.useRef<HTMLDivElement | null>(null);
  const [cardFinishIndices, setCardFinishIndices] = useState<Record<string, number>>({});
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const [dispatchEmail, setDispatchEmail] = useState<string>('');
  const [dispatchSent, setDispatchSent] = useState<boolean>(false);
  const [activeLegalDoc, setActiveLegalDoc] = useState<'privacy' | 'terms' | null>(null);

  // Live flash countdown timer
  useEffect(() => {
    const timer = window.setInterval(() => {
      setFlashSeconds((prev) => (prev > 0 ? prev - 1 : 4 * 3600 + 28 * 60 + 42));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  // Auto-advance top editorial promo carousel unless paused
  useEffect(() => {
    if (promoPaused) return;
    const timer = window.setInterval(() => {
      setPromoIdx((prev) => (prev + 1) % PROMO_BANNERS.length);
    }, 6200);
    return () => window.clearInterval(timer);
  }, [promoPaused]);

  const scrollToCatalog = () => {
    if (catalogGridRef.current) {
      catalogGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCategoryChange = (cat: StoreCategory) => {
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

  const applyQuickFilter = ({
    category = 'ALL',
    collection = 'ALL',
    flash = false,
    distressed = false,
    shouldScroll = true,
  }: {
    category?: StoreCategory;
    collection?: CollectionTag | 'ALL';
    flash?: boolean;
    distressed?: boolean;
    shouldScroll?: boolean;
  }) => {
    soundEngine.playClick(1.08);
    setSelectedCategory(category);
    setSelectedCollection(collection);
    setOnlyFlash(flash);
    setOnlyDistressed(distressed);
    if (shouldScroll) scrollToCatalog();
  };

  const resetAllFilters = () => {
    soundEngine.playClick(0.95);
    setSelectedCategory('ALL');
    setSelectedCollection('ALL');
    setOnlyFlash(false);
    setOnlyDistressed(false);
    setSortBy('featured');
    handleSearchChange('');
  };

  const flashProducts = PRODUCTS.filter((p) => p.isFlashDeal);

  const filteredProducts = PRODUCTS.filter((item) => {
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    if (selectedCollection !== 'ALL' && item.collectionTag !== selectedCollection) return false;
    if (onlyFlash && !item.isFlashDeal) return false;
    if (onlyDistressed && !item.isDistressed) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.collectionTag.toLowerCase().includes(q)
      );
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'discount') return (b.discountPct ?? 0) - (a.discountPct ?? 0);
    return 0;
  });

  const openProductSpotlight = (
    product: Product,
    finishIdx = 0,
    sourceEl?: HTMLElement | null
  ) => {
    soundEngine.playClick(0.95);
    const vw = typeof window !== 'undefined' ? window.innerWidth || 1440 : 1440;
    const vh = typeof window !== 'undefined' ? window.innerHeight || 900 : 900;
    let x = Math.round(vw * 0.5);
    let y = Math.round(vh * 0.5);

    if (sourceEl && typeof window !== 'undefined') {
      const frame =
        (sourceEl.querySelector('[data-product-frame]') as HTMLElement | null) ||
        sourceEl;
      const rect = frame.getBoundingClientRect();
      x = Math.round(Math.max(16, Math.min(vw - 16, rect.left + rect.width / 2)));
      y = Math.round(Math.max(16, Math.min(vh - 16, rect.top + rect.height / 2)));
    }

    const maxRadius = Math.ceil(Math.hypot(Math.max(x, vw - x), Math.max(y, vh - y))) + 48;
    setPortalOrigin({ x, y, maxRadius });
    setSelectedFinishIdx(finishIdx);
    setActiveProduct(product);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('view', 'store');
      url.searchParams.set('product', product.id);
      window.history.replaceState({}, '', url.toString());
    } catch {
      // ignore history errors
    }
  };

  const closeProductSpotlight = () => {
    soundEngine.playClick(0.85);
    setActiveProduct(null);
    soundEngine.stopProductMusic();
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('product');
      window.history.replaceState({}, '', url.toString());
    } catch {
      // ignore history errors
    }
  };

  useEffect(() => {
    onDetailOpenChange?.(Boolean(activeProduct));
  }, [activeProduct, onDetailOpenChange]);

  useEffect(() => {
    if (!activeProduct) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isBagOpen) {
        closeProductSpotlight();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeProduct, isBagOpen]);

  const triggerAdd = (product: Product, finishName: string, size?: string) => {
    soundEngine.playAddToBagChord();
    onAddToCart(product, finishName, size);
    setJustAddedId(product.id);
    window.setTimeout(() => setJustAddedId(null), 1300);
  };

  const totalBagCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalBagPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const currentPromo = PROMO_BANNERS[promoIdx];
  const promoToneClasses: Record<'walnut' | 'sage' | 'peach', string> = {
    walnut: 'bg-[#1D1510] text-[#F6F2EA] border-[#D4822B]/25',
    sage: 'bg-[#2C3A2B] text-[#F6F2EA] border-[#A4B69E]/25',
    peach: 'bg-[#9E5619] text-[#F6F2EA] border-[#FFCC70]/30',
  };

  const renderProductCard = (product: Product, compactFlash = false) => {
    const isAdded = justAddedId === product.id;
    const activeFinishIdx = cardFinishIndices[product.id] ?? 0;
    const activeFinish = product.finishes[activeFinishIdx] || product.finishes[0];
    const cardImage = activeFinish?.image || product.image;
    const defaultSize = product.sizes
      ? product.sizes.includes('L')
        ? 'L'
        : product.sizes[0]
      : undefined;

    return (
      <div
        key={`${compactFlash ? 'flash-' : ''}${product.id}`}
        onClick={(e) => openProductSpotlight(product, activeFinishIdx, e.currentTarget)}
        className="group flex flex-col justify-between cursor-pointer"
      >
        {/* Full-Bleed Architectural Studio Frame */}
        <div
          data-product-frame
          className={`relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border bg-[#1B1917] shadow-sm transition-shadow duration-300 group-hover:shadow-md ${
            isDark ? 'border-white/12' : 'border-[#2A1D15]/12'
          }`}
        >
          {/* Top-Left Promo / Spec Badge */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex flex-wrap items-center gap-1 sm:gap-1.5 max-w-[calc(100%-1.5rem)]">
            {product.discountPct ? (
              <span className="rounded-full bg-[#D4822B] px-2 sm:px-2.5 py-0.5 font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-[#1E140E] shadow-sm">
                -{product.discountPct}%
              </span>
            ) : null}
            {product.isDistressed ? (
              <span className="rounded-full bg-[#1D1510]/85 px-2 sm:px-2.5 py-0.5 font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-[#FFCC70] backdrop-blur-sm">
                DISTRESSED
              </span>
            ) : product.hasModelLook ? (
              <span className="rounded-full bg-[#F6F2EA]/90 px-2 sm:px-2.5 py-0.5 font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-[#2A1D15] backdrop-blur-sm">
                STUDIO EDIT
              </span>
            ) : null}
          </div>

          <img
            src={cardImage}
            alt={`${product.name} — ${activeFinish.name}`}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Product Details & Swatches */}
        <div className="mt-2.5 sm:mt-3.5 flex flex-col">
          <div
            className={`flex items-center justify-between gap-1.5 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.12em] sm:tracking-[0.18em] ${
              isDark ? 'text-[#F6F2EA]/55' : 'text-[#2A1D15]/60'
            }`}
          >
            <span className="truncate min-w-0">
              {product.category} <span className="hidden sm:inline">· {product.collectionTag}</span>
            </span>
            <div className="flex items-baseline gap-1 sm:gap-1.5 shrink-0 tabular-nums">
              {product.oldPrice && (
                <span
                  className={`text-[9px] sm:text-[10px] line-through ${
                    isDark ? 'text-[#F6F2EA]/35' : 'text-[#2A1D15]/40'
                  }`}
                >
                  ${product.oldPrice}
                </span>
              )}
              <span
                className={`font-bold text-xs sm:text-sm ${
                  isDark ? 'text-[#FFCC70]' : 'text-[#D4822B]'
                }`}
              >
                ${product.price}
              </span>
            </div>
          </div>

          <h3
            className={`mt-1 font-display text-[13px] sm:text-[17px] font-semibold tracking-tight transition-colors truncate ${
              isDark
                ? 'text-[#F6F2EA] group-hover:text-[#FFCC70]'
                : 'text-[#2A1D15] group-hover:text-[#D4822B]'
            }`}
          >
            {product.name}
          </h3>

          <p
            className={`mt-0.5 text-[11px] sm:text-xs line-clamp-1 ${
              isDark ? 'text-[#F6F2EA]/65' : 'text-[#2A1D15]/70'
            }`}
          >
            {activeFinish.name} · {product.subtitle}
          </p>

          {/* Optional Flash Stock Depletion Meter */}
          {compactFlash && product.batchLeft && product.batchTotal && (
            <div className="mt-2 sm:mt-2.5">
              <div
                className={`flex items-center justify-between font-mono text-[8px] sm:text-[9px] uppercase tracking-wider ${
                  isDark ? 'text-[#F6F2EA]/65' : 'text-[#2A1D15]/65'
                }`}
              >
                <span>{product.batchLeft} left</span>
                <span>{Math.round((product.batchLeft / product.batchTotal) * 100)}%</span>
              </div>
              <div
                className={`mt-1 h-1.5 w-full overflow-hidden rounded-full ${
                  isDark ? 'bg-white/15' : 'bg-[#2A1D15]/10'
                }`}
              >
                <div
                  className="h-full rounded-full bg-[#D4822B]"
                  style={{
                    width: `${Math.max(12, Math.round((product.batchLeft / product.batchTotal) * 100))}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* 3-Colour Theme Swatches + Add Button */}
          <div
            className={`mt-2.5 sm:mt-3.5 flex items-center justify-between gap-2 border-t pt-2.5 sm:pt-3 ${
              isDark ? 'border-white/12' : 'border-[#2A1D15]/12'
            }`}
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              {product.finishes.map((f, i) => {
                const isSelected = activeFinishIdx === i;
                return (
                  <button
                    key={f.name}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      soundEngine.playClick(1.1);
                      setCardFinishIndices((prev) => ({
                        ...prev,
                        [product.id]: i,
                      }));
                    }}
                    title={f.name}
                    aria-label={`Preview ${f.name}`}
                    className={`h-3.5 w-3.5 rounded-full border transition-transform ${
                      isDark ? 'border-white/30' : 'border-[#2A1D15]/30'
                    } ${
                      isSelected
                        ? `scale-[1.15] ring-2 ring-[#D4822B] ring-offset-1 ${
                            isDark ? 'ring-offset-[#12100E]' : 'ring-offset-[#F6F2EA]'
                          }`
                        : 'hover:scale-110 opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: f.hex }}
                  />
                );
              })}
              {!compactFlash && (
                <span
                  className={`hidden sm:inline ml-0.5 font-mono text-[9px] uppercase tracking-wider ${
                    isDark ? 'text-[#F6F2EA]/50' : 'text-[#2A1D15]/55'
                  }`}
                >
                  3 colours
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerAdd(product, activeFinish.name, defaultSize);
              }}
              className={`flex items-center gap-1 rounded-full px-2.5 sm:px-3 py-1 font-mono text-[9px] uppercase tracking-[0.14em] sm:tracking-[0.16em] transition-all active:scale-95 shrink-0 ${
                isAdded
                  ? 'bg-[#D4822B] text-[#1E140E] font-bold shadow-sm'
                  : isDark
                  ? 'border border-white/20 bg-white/10 text-[#F6F2EA] hover:bg-[#FFCC70] hover:text-[#160E09]'
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
  };

  const hasActiveFilters =
    selectedCategory !== 'ALL' ||
    selectedCollection !== 'ALL' ||
    onlyFlash ||
    onlyDistressed ||
    searchQuery.trim().length > 0;

  return (
    <section
      id="thissoftware-clean-store"
      className={`relative min-h-[100dvh] w-full overflow-x-hidden select-none sm:select-auto transition-colors duration-300 ${
        isDark ? 'bg-[#12100E] text-[#F6F2EA]' : 'bg-[#F6F2EA] text-[#2A1D15]'
      }`}
      style={{
        backgroundColor: isDark ? '#12100E' : '#F6F2EA',
        backgroundImage: isDark
          ? 'radial-gradient(circle, rgba(246, 242, 234, 0.11) 1.3px, transparent 1.3px)'
          : 'radial-gradient(circle, rgba(42, 29, 21, 0.16) 1.4px, transparent 1.4px)',
        backgroundSize: '28px 28px',
      }}
    >
      {/* =====================================================================
          01 // STOREFRONT TOP HEADER & PROMOTIONAL BANNER CAROUSEL
      ====================================================================== */}
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-6 sm:px-8 sm:pt-16">
        {/* Top Eyebrow & Bag Utility Row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-[#D4822B] font-semibold">
              03 / SYNTAXWEAR FLAGSHIP FLOOR
            </span>
            <span
              className={`hidden md:inline-flex items-center gap-1.5 rounded-full border border-[#D4822B]/30 bg-[#D4822B]/10 px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${
                isDark ? 'text-[#FFCC70]' : 'text-[#B66617]'
              }`}
            >
              <Tag className="h-2.5 w-2.5" /> LAUNCH DROP · FREE EXPRESS DISPATCH $120+
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {onOpenSell && (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick(1.05);
                  onOpenSell();
                }}
                className={`hidden md:inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 font-mono text-[10px] uppercase tracking-wider transition-all active:scale-95 ${
                  isDark
                    ? 'border-[#FFCC70]/30 bg-[#FFCC70]/10 text-[#FFCC70] hover:bg-[#FFCC70]/20'
                    : 'border-[#546652]/30 bg-[#546652]/10 text-[#3C493D] hover:bg-[#546652]/18'
                }`}
              >
                <Store className="h-3.5 w-3.5 text-[#D4822B]" />
                <span>SELL WITH US</span>
              </button>
            )}

            {onOpenSellerDashboard && (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick(1.0);
                  onOpenSellerDashboard();
                }}
                className={`hidden lg:inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 font-mono text-[10px] uppercase tracking-wider transition-all active:scale-95 ${
                  isDark
                    ? 'border-white/15 bg-white/5 text-[#F6F2EA] hover:bg-white/12'
                    : 'border-[#2A1D15]/15 bg-[#2A1D15]/5 text-[#2A1D15] hover:bg-[#2A1D15]/12'
                }`}
              >
                <span>SELLER HUB</span>
              </button>
            )}

            {onOpenTrackOrder && (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick(1.0);
                  onOpenTrackOrder();
                }}
                className={`hidden sm:inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 font-mono text-[10px] uppercase tracking-wider transition-all active:scale-95 ${
                  isDark
                    ? 'border-white/15 bg-white/5 text-[#F6F2EA] hover:bg-white/12'
                    : 'border-[#2A1D15]/15 bg-[#2A1D15]/5 text-[#2A1D15] hover:bg-[#2A1D15]/12'
                }`}
              >
                <PackageCheck className="h-3.5 w-3.5 text-[#D4822B]" />
                <span>ORDERS</span>
              </button>
            )}

            {onToggleDark && (
              <button
                type="button"
                onClick={onToggleDark}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all active:scale-95 ${
                  isDark
                    ? 'border-white/15 bg-white/5 text-[#FFCC70] hover:bg-white/12'
                    : 'border-[#2A1D15]/15 bg-[#2A1D15]/5 text-[#2A1D15] hover:bg-[#2A1D15]/12'
                }`}
              >
                {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              </button>
            )}

            <button
              onClick={onToggleMute}
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all active:scale-95 ${
                isDark
                  ? 'border-white/15 bg-white/5 text-[#F6F2EA] hover:bg-white/12'
                  : 'border-[#2A1D15]/15 bg-[#2A1D15]/5 text-[#2A1D15] hover:bg-[#2A1D15]/12'
              }`}
            >
              {isMuted ? (
                <VolumeX
                  className={`h-3.5 w-3.5 ${isDark ? 'text-[#F6F2EA]/40' : 'text-[#2A1D15]/40'}`}
                />
              ) : (
                <Volume2 className="h-3.5 w-3.5 text-[#D4822B]" />
              )}
            </button>

            <button
              onClick={() => {
                soundEngine.playClick(1.05);
                onOpenBag();
              }}
              className={`flex h-9 items-center gap-2 rounded-full border px-4 text-xs font-medium shadow-sm transition-all active:scale-95 ${
                isDark
                  ? 'border-white/15 bg-[#F6F2EA] text-[#160E09] hover:bg-[#FFCC70]'
                  : 'border-[#2A1D15]/20 bg-[#2A1D15] text-[#F6F2EA] hover:bg-[#2A1D15]/90'
              }`}
            >
              <ShoppingBag
                className={`h-3.5 w-3.5 ${isDark ? 'text-[#B66617]' : 'text-[#FFCC70]'}`}
              />
              <span className="font-mono text-[10px] tracking-wider">BAG</span>
              <span
                className={`flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 font-mono text-[9px] font-bold tabular-nums ${
                  isDark ? 'bg-[#160E09] text-[#FFCC70]' : 'bg-[#FFCC70] text-[#1E140E]'
                }`}
              >
                {totalBagCount}
              </span>
              {totalBagPrice > 0 && (
                <span
                  className={`hidden sm:inline font-mono text-[10px] tabular-nums ${
                    isDark ? 'text-[#B66617]' : 'text-[#FFCC70]'
                  }`}
                >
                  · ${totalBagPrice}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Storefront Headline */}
        <div className="mt-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-6">
          <h2
            className={`font-display text-4xl sm:text-5xl lg:text-[60px] font-normal leading-[1.02] tracking-[-0.035em] ${
              isDark ? 'text-[#F6F2EA]' : 'text-[#2A1D15]'
            }`}
          >
            Wear the code,{' '}
            <span
              className={`font-serif-editorial italic ${
                isDark ? 'text-[#FFCC70]' : 'text-[#D4822B]'
              }`}
            >
              live the drop.
            </span>
          </h2>
          <p
            className={`max-w-sm text-xs sm:text-[13px] leading-relaxed ${
              isDark ? 'text-[#F6F2EA]/70' : 'text-[#2A1D15]/75'
            }`}
          >
            Distressed 404 streetwear, syntax-highlighted tees, heavyweight terminal hoodies & tactile desk hardware — every garment crafted in Pitch Black, Botanical Sage & Warm Peach.
          </p>
        </div>

        {/* TOP PROMO BANNER CAROUSEL (Jumia Commercial Energy × Clean Editorial Surface) */}
        <div
          onMouseEnter={() => setPromoPaused(true)}
          onMouseLeave={() => setPromoPaused(false)}
          className={`relative overflow-hidden rounded-3xl border shadow-xl transition-colors duration-500 ${promoToneClasses[currentPromo.bgTone]}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-6 p-5 sm:p-10 lg:px-12 lg:py-9">
            {/* Left Copy & Discount Banner CTA */}
            <div className="lg:col-span-7 flex flex-col items-start min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#FFCC70] px-3 py-1 font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.16em] sm:tracking-[0.18em] text-[#1E140E]">
                  {currentPromo.discountBadge}
                </span>
                <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.16em] sm:tracking-[0.2em] text-[#F6F2EA]/75">
                  {currentPromo.eyebrow}
                </span>
              </div>

              <h3 className="mt-3 sm:mt-4 font-display text-2xl sm:text-4xl lg:text-[46px] font-bold leading-[1.06] tracking-[-0.03em]">
                {currentPromo.title}{' '}
                <span className="font-serif-editorial italic font-normal text-[#FFCC70]">
                  {currentPromo.accentTitle}
                </span>
              </h3>

              <p className="mt-3 max-w-xl text-xs sm:text-sm leading-relaxed text-[#F6F2EA]/80">
                {currentPromo.copy}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={() =>
                    applyQuickFilter({
                      category: currentPromo.filterCategory ?? 'ALL',
                      collection: currentPromo.filterCollection ?? 'ALL',
                      distressed: currentPromo.id === 'promo-404-drop',
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-full bg-[#F6F2EA] px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#1E140E] shadow-sm transition-transform hover:scale-[1.02] active:scale-95"
                >
                  <span>{currentPromo.ctaLabel}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#D4822B]" />
                </button>

                {/* Carousel Prev / Next Controls */}
                <div className="flex items-center gap-1.5 ml-1">
                  <button
                    onClick={() => {
                      soundEngine.playClick(0.95);
                      setPromoIdx((prev) => (prev - 1 + PROMO_BANNERS.length) % PROMO_BANNERS.length);
                    }}
                    aria-label="Previous Promo Banner"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      soundEngine.playClick(1.05);
                      setPromoIdx((prev) => (prev + 1) % PROMO_BANNERS.length);
                    }}
                    aria-label="Next Promo Banner"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Visual Showcase: Architectural Concrete Edit + Studio Garment */}
            <div className="lg:col-span-5 flex items-center justify-center lg:justify-end gap-2.5 sm:gap-4 w-full overflow-visible">
              <div className="relative h-40 w-[44%] max-w-[160px] sm:h-56 sm:w-44 sm:max-w-none overflow-hidden rounded-2xl border border-white/15 bg-black/40 shadow-lg -rotate-2">
                <img
                  src={currentPromo.image}
                  alt={currentPromo.accentTitle}
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-2 left-2 rounded-md bg-black/65 px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider text-[#FFCC70] backdrop-blur-sm">
                  CONCRETE EDIT
                </span>
              </div>
              <div className="relative h-36 w-[48%] max-w-[176px] sm:h-52 sm:w-52 sm:max-w-none overflow-hidden rounded-2xl border border-white/15 bg-[#E7E0D3] shadow-lg rotate-2">
                <img
                  src={currentPromo.secondaryImage}
                  alt={currentPromo.title}
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-2 right-2 rounded-md bg-[#1D1510]/85 px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider text-[#F6F2EA]">
                  3 COLOURS
                </span>
              </div>
            </div>
          </div>

          {/* Slide Dots */}
          <div className="flex items-center justify-center gap-2 pb-4">
            {PROMO_BANNERS.map((banner, idx) => (
              <button
                key={banner.id}
                onClick={() => {
                  soundEngine.playClick(1.0);
                  setPromoIdx(idx);
                }}
                aria-label={`Promo slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  idx === promoIdx ? 'w-7 bg-[#FFCC70]' : 'w-2 bg-white/30 hover:bg-white/55'
                }`}
              />
            ))}
          </div>
        </div>

        {/* QUICK PROMO TILES STRIP (6 Clean Deal Shortcuts) */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {QUICK_TILES.map((tile) => (
            <button
              key={tile.id}
              onClick={() =>
                applyQuickFilter({
                  category: tile.filterCategory ?? 'ALL',
                  collection: tile.filterCollection ?? 'ALL',
                  flash: Boolean(tile.onlyFlash),
                  distressed: Boolean(tile.onlyDistressed),
                })
              }
              className={`group flex items-center gap-2 sm:gap-3 rounded-2xl border p-2 sm:p-2.5 text-left shadow-xs transition-all hover:border-[#D4822B] hover:shadow-md active:scale-[0.98] ${
                isDark
                  ? 'border-white/10 bg-[#1B1815]'
                  : 'border-[#2A1D15]/12 bg-[#FAF7F2]'
              }`}
            >
              <div
                className={`h-10 w-10 sm:h-12 sm:w-12 shrink-0 overflow-hidden rounded-xl border bg-[#1B1917] ${
                  isDark ? 'border-white/10' : 'border-[#2A1D15]/10'
                }`}
              >
                <img
                  src={tile.image}
                  alt={tile.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.08]"
                />
              </div>
              <div className="min-w-0 flex-1">
                <span
                  className={`inline-block rounded-sm bg-[#D4822B]/15 px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider ${
                    isDark ? 'text-[#FFCC70]' : 'text-[#B66617]'
                  }`}
                >
                  {tile.badge}
                </span>
                <div
                  className={`mt-0.5 truncate font-display text-xs font-bold transition-colors ${
                    isDark
                      ? 'text-[#F6F2EA] group-hover:text-[#FFCC70]'
                      : 'text-[#2A1D15] group-hover:text-[#D4822B]'
                  }`}
                >
                  {tile.title}
                </div>
                <div
                  className={`truncate font-mono text-[9px] ${
                    isDark ? 'text-[#F6F2EA]/55' : 'text-[#2A1D15]/60'
                  }`}
                >
                  {tile.subtitle}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* =====================================================================
          02 // FLASH COMPILE DEALS (Live Countdown Bar + Stock Progress)
      ====================================================================== */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8">
        <div
          className={`overflow-hidden rounded-3xl border shadow-sm ${
            isDark
              ? 'border-white/12 bg-[#191613]'
              : 'border-[#2A1D15]/12 bg-[#FAF7F2]'
          }`}
        >
          {/* Top Accent Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1D1510] px-5 py-3.5 sm:px-7 text-[#F6F2EA]">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4822B] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#1E140E]">
                <Flame className="h-3.5 w-3.5" /> FLASH COMPILE DEALS
              </span>
              <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm font-semibold tracking-wider text-[#FFCC70] tabular-nums">
                <Clock className="h-3.5 w-3.5" />
                <span>TIME LEFT: {formatCountdown(flashSeconds)}</span>
              </div>
            </div>

            <button
              onClick={() => applyQuickFilter({ flash: true })}
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#FFCC70] hover:text-white transition-colors"
            >
              FILTER ALL FLASH →
            </button>
          </div>

          {/* 4-Up Flash Product Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 p-4 sm:p-7">
            {flashProducts.map((product) => renderProductCard(product, true))}
          </div>
        </div>
      </div>

      {/* =====================================================================
          03 // SYNTAXWEAR SIGNATURE COLLECTIONS (Model Lookbook Grid)
      ====================================================================== */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8">
        <div className="rounded-3xl border border-[#2A1D15]/12 bg-[#161311] p-6 sm:p-8 text-[#F6F2EA] shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-[#FFCC70]">
                <Sparkles className="h-3 w-3" /> SYNTAXWEAR SIGNATURE COLLECTIONS
              </div>
              <h3 className="mt-1.5 font-display text-2xl sm:text-3xl font-bold tracking-tight">
                Distinct Designs.{' '}
                <span className="font-serif-editorial italic font-normal text-[#FFCC70]">
                  Concrete Studio Drops.
                </span>
              </h3>
            </div>
            <button
              onClick={() => applyQuickFilter({ collection: 'ALL' })}
              className="self-start sm:self-auto font-mono text-[10px] uppercase tracking-[0.18em] text-[#F6F2EA]/75 hover:text-[#FFCC70] transition-colors"
            >
              VIEW ALL DROPS →
            </button>
          </div>

          <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-3 pb-1 sm:grid sm:grid-cols-3 lg:grid-cols-5 sm:gap-4 sm:overflow-visible sm:pb-0">
            {SIGNATURE_COLLECTIONS.map((colCard) => {
              const isSelected = selectedCollection === colCard.id;
              return (
                <button
                  key={colCard.id}
                  onClick={() => applyQuickFilter({ collection: colCard.id })}
                  className={`group relative aspect-[4/5] w-[68vw] max-w-[220px] shrink-0 snap-start sm:w-full sm:max-w-none overflow-hidden rounded-2xl border text-left transition-all duration-300 ${
                    isSelected
                      ? 'border-[#FFCC70] ring-2 ring-[#FFCC70]/60'
                      : 'border-white/12 hover:border-[#FFCC70]/60'
                  }`}
                >
                  <img
                    src={colCard.image}
                    alt={colCard.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(to bottom, rgba(16,13,11,0.78) 0%, rgba(16,13,11,0.12) 45%, rgba(16,13,11,0.88) 100%)',
                    }}
                  />
                  <div className="absolute top-3 left-3 right-3">
                    <div className="font-display text-sm font-bold text-white leading-tight">
                      {colCard.title}
                    </div>
                    <div className="mt-0.5 text-[10px] leading-snug text-white/75 line-clamp-2">
                      {colCard.subtitle}
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="rounded-full bg-white/15 px-2.5 py-0.5 font-mono text-[8px] font-semibold uppercase tracking-wider text-[#FFCC70] backdrop-blur-sm">
                      {colCard.countLabel}
                    </span>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-white group-hover:bg-[#FFCC70] group-hover:text-[#1E140E] transition-colors">
                      <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* =====================================================================
          04 // DUAL SPLIT COMMERCIAL AD BANNERS
      ====================================================================== */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {/* Ad 1: Distressed Drop */}
          <div
            onClick={() => applyQuickFilter({ distressed: true })}
            className="group cursor-pointer overflow-hidden rounded-3xl border border-[#2A1D15]/15 bg-[#1D1510] p-5 sm:p-7 text-[#F6F2EA] shadow-md transition-all hover:shadow-lg"
          >
            <div className="flex items-center justify-between gap-3 sm:gap-4">
              <div className="min-w-0">
                <span className="rounded-full bg-[#D4822B] px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[#1E140E]">
                  DISTRESSED EDIT // -25%
                </span>
                <h4 className="mt-3 font-display text-xl sm:text-[26px] font-bold leading-tight">
                  404 Grunge Stencil{' '}
                  <span className="font-serif-editorial italic font-normal text-[#FFCC70]">
                    Tees & Joggers
                  </span>
                </h4>
                <p className="mt-1.5 text-xs text-[#F6F2EA]/75 max-w-xs">
                  Crackled archive plastisol prints cured on 260–320 GSM heavy cotton.
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFCC70] group-hover:translate-x-1 transition-transform">
                  <span>Shop Distressed</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </div>
              <div className="h-24 w-24 sm:h-32 sm:w-32 shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-[#E7E0D3]">
                <img
                  src="/images/products/tee-404-pitch.jpg"
                  alt="404 Distressed Series"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
                />
              </div>
            </div>
          </div>

          {/* Ad 2: Multi-Colour Fleece Bundle */}
          <div
            onClick={(e) => {
              soundEngine.playClick(1.05);
              openProductSpotlight(
                PRODUCTS.find((p) => p.id === 'sw-essential-hoodie') || PRODUCTS[0],
                0,
                e.currentTarget
              );
            }}
            className="group cursor-pointer overflow-hidden rounded-3xl border border-[#2A1D15]/15 bg-[#3D4E3C] p-5 sm:p-7 text-[#F6F2EA] shadow-md transition-all hover:shadow-lg"
          >
            <div className="flex items-center justify-between gap-3 sm:gap-4">
              <div className="min-w-0">
                <span className="rounded-full bg-[#F6F2EA] px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[#2A1D15]">
                  3 THEME COLOURWAYS
                </span>
                <h4 className="mt-3 font-display text-xl sm:text-[26px] font-bold leading-tight">
                  Sage, Peach & Pitch{' '}
                  <span className="font-serif-editorial italic font-normal text-[#FFCC70]">
                    Heavy Fleece
                  </span>
                </h4>
                <p className="mt-1.5 text-xs text-[#F6F2EA]/80 max-w-xs">
                  Every SyntaxWear silhouette available across all three studio-dyed shades.
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFCC70] group-hover:translate-x-1 transition-transform">
                  <span>Inspect Fleece Bundle</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </div>
              <div className="h-24 w-24 sm:h-32 sm:w-32 shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-[#E7E0D3]">
                <img
                  src="/images/products/hoodie-bundle-studio.jpg"
                  alt="SyntaxWear 3-Colour Fleece Stack"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          05 // MAIN FILTERABLE STORE CATALOGUE GRID
      ====================================================================== */}
      <div ref={catalogGridRef} className="mx-auto max-w-7xl px-4 pt-12 pb-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#D4822B]">
              FULL DROP CATALOGUE ({filteredProducts.length} PIECES)
            </div>
            <h3
              className={`mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tight ${
                isDark ? 'text-[#F6F2EA]' : 'text-[#2A1D15]'
              }`}
            >
              All SyntaxWear Releases
            </h3>
          </div>

          {/* Search + Sort Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search
                className={`pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 ${
                  isDark ? 'text-[#F6F2EA]/45' : 'text-[#2A1D15]/45'
                }`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search 404, while(alive), hoodie..."
                className={`w-full rounded-full border py-2 pl-9 pr-8 font-sans text-xs outline-none transition-all focus:border-[#D4822B] ${
                  isDark
                    ? 'border-white/15 bg-[#1B1815] text-[#F6F2EA] placeholder-[#F6F2EA]/45'
                    : 'border-[#2A1D15]/15 bg-[#FAF7F2] text-[#2A1D15] placeholder-[#2A1D15]/45'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange('')}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                    isDark
                      ? 'text-[#F6F2EA]/60 hover:text-white'
                      : 'text-[#2A1D15]/60 hover:text-[#2A1D15]'
                  }`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            <div className="relative flex items-center shrink-0">
              <ArrowUpDown className="pointer-events-none absolute left-3 h-3 w-3 text-[#D4822B]" />
              <select
                value={sortBy}
                onChange={(e) => {
                  soundEngine.playClick(1.0);
                  setSortBy(e.target.value as typeof sortBy);
                }}
                aria-label="Sort products"
                className={`w-full sm:w-auto appearance-none rounded-full border py-2 pl-8 pr-7 font-mono text-[10px] uppercase tracking-wider outline-none transition-all focus:border-[#D4822B] cursor-pointer ${
                  isDark
                    ? 'border-white/15 bg-[#1B1815] text-[#F6F2EA]'
                    : 'border-[#2A1D15]/15 bg-[#FAF7F2] text-[#2A1D15]'
                }`}
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills + Collection Vibe Pills */}
        <div
          className={`flex flex-col gap-3 border-b pb-4 ${
            isDark ? 'border-white/12' : 'border-[#2A1D15]/15'
          }`}
        >
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`rounded-full px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-all whitespace-nowrap ${
                    active
                      ? isDark
                        ? 'bg-[#FFCC70] text-[#160E09] shadow-sm font-semibold'
                        : 'bg-[#2A1D15] text-[#F6F2EA] shadow-sm font-semibold'
                      : isDark
                      ? 'text-[#F6F2EA]/70 hover:text-white hover:bg-white/10'
                      : 'text-[#2A1D15]/70 hover:text-[#2A1D15] hover:bg-[#2A1D15]/8'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className={`font-mono text-[9px] uppercase tracking-[0.18em] mr-1 ${
                  isDark ? 'text-[#F6F2EA]/50' : 'text-[#2A1D15]/50'
                }`}
              >
                VIBE:
              </span>
              {COLLECTION_FILTERS.map((col) => {
                const active = selectedCollection === col;
                return (
                  <button
                    key={col}
                    onClick={() => {
                      soundEngine.playClick(1.05);
                      setSelectedCollection(col);
                    }}
                    className={`rounded-md px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider transition-colors ${
                      active
                        ? 'bg-[#D4822B] text-[#1E140E] font-bold'
                        : isDark
                        ? 'bg-white/8 text-[#F6F2EA]/70 hover:bg-white/14'
                        : 'bg-[#2A1D15]/6 text-[#2A1D15]/65 hover:bg-[#2A1D15]/12'
                    }`}
                  >
                    {col === 'ALL' ? 'ALL SERIES' : `${col} SERIES`}
                  </button>
                );
              })}

              <button
                onClick={() => {
                  soundEngine.playClick(1.05);
                  setOnlyDistressed((prev) => !prev);
                }}
                className={`rounded-md px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider transition-colors ${
                  onlyDistressed
                    ? isDark
                      ? 'bg-[#FFCC70] text-[#160E09] font-bold'
                      : 'bg-[#2A1D15] text-[#FFCC70] font-bold'
                    : isDark
                    ? 'bg-white/8 text-[#F6F2EA]/70 hover:bg-white/14'
                    : 'bg-[#2A1D15]/6 text-[#2A1D15]/65 hover:bg-[#2A1D15]/12'
                }`}
              >
                DISTRESSED ONLY
              </button>
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className={`inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider hover:underline ${
                  isDark ? 'text-[#FFCC70]' : 'text-[#B66617]'
                }`}
              >
                <X className="h-3 w-3" /> CLEAR FILTERS
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Product Grid */}
      <main className="mx-auto max-w-7xl px-4 pt-8 pb-24 sm:px-8">
        {filteredProducts.length === 0 ? (
          <div className="my-16 text-center">
            <p
              className={`font-mono text-xs uppercase tracking-[0.2em] ${
                isDark ? 'text-[#F6F2EA]/70' : 'text-[#2A1D15]/70'
              }`}
            >
              NO SYNTAXWEAR PIECES MATCH CURRENT FILTERS
            </p>
            <button
              onClick={resetAllFilters}
              className={`mt-4 rounded-full border px-5 py-2 font-mono text-[11px] uppercase tracking-[0.18em] ${
                isDark
                  ? 'border-white/20 bg-white/8 text-[#F6F2EA] hover:bg-white/14'
                  : 'border-[#2A1D15]/20 bg-[#2A1D15]/5 text-[#2A1D15] hover:bg-[#2A1D15]/10'
              }`}
            >
              SHOW ALL {PRODUCTS.length} RELEASES
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3.5 gap-y-8 sm:gap-x-10 lg:gap-x-12 sm:gap-y-16">
            {filteredProducts.map((product) => renderProductCard(product, false))}
          </div>
        )}
      </main>

      {/* =====================================================================
          06 // MATERIAL STUDY EDITORIAL SECTION
      ====================================================================== */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-16">
        <div className="grid grid-cols-1 overflow-hidden rounded-3xl border border-white/10 shadow-2xl lg:grid-cols-12">
          <div className="relative min-h-[340px] sm:min-h-[440px] lg:col-span-7 overflow-hidden bg-[#160E09]">
            <div className="absolute top-6 left-6 z-20 rounded-full bg-white/90 px-3.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#1E140E] shadow-sm backdrop-blur-md">
              JOURNAL 034
            </div>
            <img
              src="/images/products/syntaxwear-material-study.jpg"
              alt="SyntaxWear Material Study — Heavyweight Streetwear Textiles"
              className="h-full w-full object-cover object-center filter brightness-[0.95] contrast-[1.05] transition-transform duration-700 hover:scale-[1.03]"
            />
          </div>

          <div
            className={`flex flex-col justify-between p-8 sm:p-12 lg:col-span-5 lg:p-14 transition-colors duration-300 ${
              isDark ? 'bg-[#1D221C] text-[#F6F2EA]' : 'bg-[#E3E8E1] text-[#2A1D15]'
            }`}
          >
            <div>
              <div
                className={`font-mono text-[10px] uppercase tracking-[0.24em] ${
                  isDark ? 'text-[#FFCC70]' : 'text-[#D4822B]'
                }`}
              >
                MATERIAL STUDY / SYNTAXWEAR
              </div>

              <h3
                className={`mt-5 font-display text-4xl sm:text-5xl lg:text-[52px] font-normal leading-[1.04] tracking-[-0.035em] ${
                  isDark ? 'text-[#F6F2EA]' : 'text-[#2A1D15]'
                }`}
              >
                Cut for<br />
                code,<br />
                built to<br />
                <span
                  className={`font-serif-editorial italic ${
                    isDark ? 'text-[#FFCC70]' : 'text-[#D4822B]'
                  }`}
                >
                  last.
                </span>
              </h3>

              <p
                className={`mt-6 text-xs sm:text-[13px] leading-relaxed ${
                  isDark ? 'text-[#F6F2EA]/75' : 'text-[#2A1D15]/80'
                }`}
              >
                Heavyweight 240–260 GSM combed cotton, 350–360 GSM brushed fleece, 800-fill ripstop shells & crackled distressed screenprint inks across Pitch Black, Botanical Sage & Warm Peach.
              </p>
            </div>

            <div className="mt-10 pt-4">
              <button
                onClick={(e) => openProductSpotlight(PRODUCTS[0], 0, e.currentTarget)}
                className={`group inline-flex items-center gap-2 border-b pb-1 font-mono text-[10px] uppercase tracking-[0.22em] transition-colors ${
                  isDark
                    ? 'border-[#F6F2EA] text-[#F6F2EA] hover:text-[#FFCC70] hover:border-[#FFCC70]'
                    : 'border-[#2A1D15] text-[#2A1D15] hover:text-[#D4822B] hover:border-[#D4822B]'
                }`}
              >
                <span>INSPECT 404 TEXTILE SPEC</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          07 // OCCASIONAL DISPATCHES / NEWSLETTER
      ====================================================================== */}
      <section className="relative z-10 w-full bg-[#D4822B] py-16 sm:py-24 text-[#2A1D15]">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#2A1D15]/75">
            OCCASIONAL DISPATCHES
          </div>

          <div className="mt-4 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 sm:gap-12">
            <h3 className="font-display text-4xl sm:text-5xl lg:text-[62px] font-normal leading-[1.02] tracking-[-0.035em] text-[#2A1D15]">
              Drop alerts &<br />
              <span className="font-serif-editorial italic text-[#F6F2EA]">
                early access.
              </span>
            </h3>

            <div className="w-full max-w-md">
              <p className="text-xs sm:text-[13px] leading-relaxed text-[#2A1D15]/85">
                Get notified on Batch 002 restocks, flash compile discount windows & private code drops.
              </p>

              {dispatchSent ? (
                <div className="mt-6 flex items-center gap-2 rounded-xl bg-[#2A1D15] px-4 py-3 font-mono text-xs text-[#FFCC70]">
                  <Check className="h-4 w-4" /> Subscribed ({dispatchEmail}) to Batch alerts.
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const cleaned = dispatchEmail.trim();
                    if (!cleaned) return;
                    soundEngine.playAddToBagChord();
                    try {
                      const raw = window.localStorage.getItem('syntaxwear-newsletter');
                      const list = raw ? (JSON.parse(raw) as string[]) : [];
                      if (!list.includes(cleaned)) {
                        window.localStorage.setItem(
                          'syntaxwear-newsletter',
                          JSON.stringify([cleaned, ...list].slice(0, 50))
                        );
                      }
                    } catch {
                      // ignore storage errors
                    }
                    setDispatchSent(true);
                  }}
                  className="mt-6 flex items-center border-b border-[#2A1D15]/35 pb-2 transition-colors focus-within:border-[#2A1D15]"
                >
                  <input
                    type="email"
                    required
                    value={dispatchEmail}
                    onChange={(e) => setDispatchEmail(e.target.value)}
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
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          08 // ARCHITECTURAL DEEP WALNUT FOOTER
      ====================================================================== */}
      <footer className="relative z-10 w-full bg-[#1A120C] pt-16 pb-10 text-[#F6F2EA]">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8 pb-14 border-b border-white/10">
            <div className="md:col-span-4 flex items-center gap-3">
              <img
                src="/images/thissoftware-emblem-transparent.png"
                alt="SyntaxWear"
                className="h-8 w-8 object-contain"
              />
              <span className="font-display text-lg font-medium tracking-tight text-[#F6F2EA]">
                SyntaxWear
              </span>
            </div>

            <div className="md:col-span-5 flex flex-col justify-center text-xs sm:text-[13px] leading-relaxed text-[#F6F2EA]/70">
              <p>Minimalist developer streetwear. S+404 Batch 001 Launch Store.</p>
              <p>Pitch Black · Botanical Sage · Warm Peach.</p>
            </div>

            <div className="md:col-span-3 grid grid-cols-2 gap-6 font-mono text-[10px] uppercase tracking-[0.22em] text-[#F6F2EA]/80">
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => applyQuickFilter({ category: 'TOPS' })}
                  className="text-left hover:text-[#FFCC70] transition-colors"
                >
                  TOPS
                </button>
                <button
                  onClick={() => applyQuickFilter({ category: 'OUTERWEAR' })}
                  className="text-left hover:text-[#FFCC70] transition-colors"
                >
                  OUTERWEAR
                </button>
                <button
                  onClick={() => applyQuickFilter({ category: 'TECH & DESK' })}
                  className="text-left hover:text-[#FFCC70] transition-colors"
                >
                  TECH & DESK
                </button>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => applyQuickFilter({ distressed: true })}
                  className="text-left hover:text-[#FFCC70] transition-colors"
                >
                  404 DISTRESSED
                </button>
                <button
                  onClick={() => applyQuickFilter({ flash: true })}
                  className="text-left hover:text-[#FFCC70] transition-colors"
                >
                  FLASH DEALS
                </button>
                {onOpenTrackOrder ? (
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick(1.0);
                      onOpenTrackOrder();
                    }}
                    className="text-left hover:text-[#FFCC70] transition-colors"
                  >
                    TRACK ORDER
                  </button>
                ) : (
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#FFCC70] transition-colors"
                  >
                    INSTAGRAM
                  </a>
                )}
                {onOpenSell && (
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick(1.05);
                      onOpenSell();
                    }}
                    className="text-left text-[#FFCC70] hover:text-white transition-colors"
                  >
                    OPEN A SHOP
                  </button>
                )}
                {onOpenSellerDashboard && (
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick(1.0);
                      onOpenSellerDashboard();
                    }}
                    className="text-left hover:text-[#FFCC70] transition-colors"
                  >
                    SELLER HUB
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.2em] text-[#F6F2EA]/45">
            <div>© 2026 SYNTAXWEAR // BATCH 001</div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick(1.0);
                  setActiveLegalDoc('privacy');
                }}
                className="hover:text-white transition-colors uppercase"
              >
                PRIVACY
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick(1.0);
                  setActiveLegalDoc('terms');
                }}
                className="hover:text-white transition-colors uppercase"
              >
                TERMS
              </button>
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

      {/* =====================================================================
          PRODUCT DETAIL MODAL (Tiny-Point Circular Iris Opening Transition)
      ====================================================================== */}
      <AnimatePresence>
        {activeProduct && (
          <motion.div
            key="product-detail-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-50 bg-[#1B1612]/40 backdrop-blur-sm pointer-events-none"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeProduct && (
          <motion.div
            ref={productModalRef}
            key="product-detail-portal"
            data-lenis-prevent
            initial={{
              clipPath: `circle(0px at ${portalOrigin.x}px ${portalOrigin.y}px)`,
            }}
            animate={{
              clipPath: `circle(${portalOrigin.maxRadius}px at ${portalOrigin.x}px ${portalOrigin.y}px)`,
            }}
            exit={{
              clipPath: `circle(0px at ${portalOrigin.x}px ${portalOrigin.y}px)`,
              transition: { duration: 0.58, ease: [0.55, 0, 0.2, 1] },
            }}
            transition={{ duration: 0.78, ease: [0.55, 0, 0.15, 1] }}
            className={`fixed inset-0 z-50 overflow-y-auto shadow-2xl ${
              isDark ? 'bg-[#12100E]' : 'bg-[#F6F2EA]'
            }`}
          >
            <ProductDetailPage
              product={activeProduct}
              initialFinishIdx={selectedFinishIdx}
              onBackToStore={closeProductSpotlight}
              onSelectProduct={(p) => {
                soundEngine.playClick(1.05);
                soundEngine.stopProductMusic();
                setSelectedFinishIdx(0);
                setActiveProduct(p);
                productModalRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                try {
                  const url = new URL(window.location.href);
                  url.searchParams.set('product', p.id);
                  window.history.replaceState({}, '', url.toString());
                } catch {
                  // ignore history errors
                }
              }}
              onAddToCart={(p, finish, size, qty = 1) => {
                for (let i = 0; i < qty; i++) {
                  onAddToCart(p, finish, size);
                }
              }}
              onOpenBag={onOpenBag}
              cartCount={totalBagCount}
              isMuted={isMuted}
              onToggleMute={onToggleMute}
              isDark={isDark}
              onToggleDark={onToggleDark}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          PRIVACY & TERMS MODAL
      ====================================================================== */}
      <AnimatePresence>
        {activeLegalDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
            onClick={() => setActiveLegalDoc(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
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
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#D4822B]">
                    SYNTAXWEAR // S+404
                  </span>
                  <h4 className="mt-1 font-display text-2xl font-bold tracking-tight">
                    {activeLegalDoc === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveLegalDoc(null)}
                  aria-label="Close legal modal"
                  className={`p-1.5 ${
                    isDark
                      ? 'text-[#F6F2EA]/60 hover:text-white'
                      : 'text-[#2A1D15]/60 hover:text-[#2A1D15]'
                  }`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div
                className={`mt-4 space-y-3 text-xs leading-relaxed ${
                  isDark ? 'text-[#F6F2EA]/75' : 'text-[#2A1D15]/80'
                }`}
              >
                {activeLegalDoc === 'privacy' ? (
                  <>
                    <p>
                      SyntaxWear collects only the shipping, contact, and order confirmation details needed to process your batch purchase and provide tracking updates.
                    </p>
                    <p>
                      Payment credentials are never stored in browser storage or local order logs; tokenized gateway references handle authorization when backend payment providers are connected.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      All Batch 001 releases ship within 24–72 business hours of confirmation across Nigeria, the UK, North America, Europe, and global courier destinations.
                    </p>
                    <p>
                      Unworn garments with original tags qualify for 30-day size exchanges or returns. Regional VAT/duties are calculated at checkout based on destination country.
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
