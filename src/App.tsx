import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import { CleanStorefront, CartItem } from './components/CleanStorefront';
import { HeroSunCarousel, HeroSlide } from './components/HeroSunCarousel';
import {
  FigmaCartDrawer,
  FigmaCartPage,
  FigmaCheckoutPage,
  TrackOrderModal,
  CommerceView,
} from './components/CommerceFlow';
import { SellerOnboarding } from './components/SellerOnboarding';
import { SellerDashboard } from './components/SellerDashboard';
import { PRODUCTS, Product } from './data/products';
import { soundEngine } from './utils/soundEngine';

type ActivePortalView = CommerceView | 'sell' | 'seller';

export function App() {
  const [stage, setStage] = useState<'intro' | 'main'>(() => {
    const params = new URLSearchParams(window.location.search);
    if (
      params.get('view') === 'store' ||
      params.get('view') === 'cart' ||
      params.get('view') === 'sell' ||
      params.get('view') === 'seller' ||
      params.get('product') ||
      params.get('checkout') ||
      params.get('q') ||
      params.get('cat')
    ) {
      return 'main';
    }
    return 'intro';
  });

  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem('syntaxwear-theme') === 'dark';
    } catch {
      return false;
    }
  });
  const [isBagOpen, setIsBagOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      document.documentElement.classList.toggle('dark', isDark);
      localStorage.setItem('syntaxwear-theme', isDark ? 'dark' : 'light');
    } catch {
      // Ignore storage errors
    }
  }, [isDark]);

  const handleToggleDark = () => {
    soundEngine.playClick(1.05);
    setIsDark((prev) => !prev);
  };
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState<boolean>(false);
  const [commerceView, setCommerceView] = useState<ActivePortalView>(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    if (viewParam === 'cart') return 'cart';
    if (viewParam === 'sell') return 'sell';
    if (viewParam === 'seller') return 'seller';
    const checkoutParam = params.get('checkout');
    const validCheckoutSteps = ['information', 'delivery', 'payment', 'review', 'success'];
    if (checkoutParam && validCheckoutSteps.includes(checkoutParam)) {
      return `checkout-${checkoutParam}` as CommerceView;
    }
    return null;
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('syntaxwear-cart');
      if (!saved) return [];
      const parsed = JSON.parse(saved) as Array<{
        productId: string;
        finishName: string;
        size?: string;
        quantity: number;
      }>;
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map((entry) => {
          const product = PRODUCTS.find((p) => p.id === entry.productId);
          if (!product || !entry.quantity || entry.quantity < 1) return null;
          return {
            product,
            finishName: entry.finishName || product.finishes[0]?.name || 'Standard',
            size: entry.size,
            quantity: entry.quantity,
          };
        })
        .filter(Boolean) as CartItem[];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      const serializable = cart.map((item) => ({
        productId: item.product.id,
        finishName: item.finishName,
        size: item.size,
        quantity: item.quantity,
      }));
      localStorage.setItem('syntaxwear-cart', JSON.stringify(serializable));
    } catch {
      // Ignore storage quota / privacy mode errors
    }
  }, [cart]);

  // Scroll progress & coordinates for the expanding circular dome transition
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [currentScrollY, setCurrentScrollY] = useState<number>(0);
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1440,
    height: typeof window !== 'undefined' ? window.innerHeight : 900,
  });

  // Lenis Weighted / Heavy Awwwards-grade Smooth Scroll Engine
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);

    const lenis = new Lenis({
      duration: 1.35, // Weighted inertia (Awwwards-grade heavy scroll feel)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth exponential deceleration
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.85, // Damped wheel response for grounded physical weight
      touchMultiplier: 1.5,
    });

    (window as any).__lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    lenis.on('scroll', ({ scroll }: { scroll: number }) => {
      const threshold = Math.round(window.innerHeight * 0.75);
      const progress = Math.min(1, Math.max(0, scroll / (threshold || 1)));
      setScrollProgress(progress);
      setCurrentScrollY(scroll);
    });

    const params = new URLSearchParams(window.location.search);
    if (
      params.get('view') === 'store' ||
      params.get('product') ||
      params.get('q') ||
      params.get('cat')
    ) {
      const targetY = Math.round(window.innerHeight * 0.75);
      setCurrentScrollY(targetY);
      setScrollProgress(1);
      lenis.scrollTo(targetY, { immediate: true });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as any).__lenis;
    };
  }, []);

  // Sync cart/checkout/seller view to URL params for shareable links & payment return URLs
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (commerceView === 'cart' || commerceView === 'sell' || commerceView === 'seller') {
        url.searchParams.set('view', commerceView);
        url.searchParams.delete('checkout');
      } else if (commerceView && commerceView.startsWith('checkout-')) {
        url.searchParams.delete('view');
        url.searchParams.set('checkout', commerceView.replace('checkout-', ''));
      } else {
        url.searchParams.delete('checkout');
        const currentView = url.searchParams.get('view');
        if (currentView === 'cart' || currentView === 'sell' || currentView === 'seller') {
          url.searchParams.delete('view');
        }
      }
      window.history.replaceState({}, '', url.toString());
    } catch {
      // Ignore history errors
    }
  }, [commerceView]);

  // Control Lenis scrolling state based on intro vs main stage and overlay state
  useEffect(() => {
    const lenis = (window as any).__lenis;
    if (lenis) {
      if (stage === 'intro') {
        lenis.stop();
        lenis.scrollTo(0, { immediate: true });
      } else if (isDetailOpen || isBagOpen || isTrackOrderOpen || commerceView !== null) {
        lenis.stop();
      } else {
        lenis.start();
      }
    }
  }, [stage, isDetailOpen, isBagOpen, isTrackOrderOpen, commerceView]);

  // Enter from Minimal Sage Green Intro Gate -> Always land cleanly on the Hero at scroll 0!
  const handleEnterFromIntro = () => {
    soundEngine.init();
    soundEngine.playClick(1.0);
    setStage('main');
    setCurrentScrollY(0);
    setScrollProgress(0);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
      lenis.start();
    }
  };

  // Scroll smoothly down to the store section using Lenis weighted scroll
  const handleScrollToStore = () => {
    soundEngine.playClick(1.0);
    const lenis = (window as any).__lenis;
    const targetY = Math.round(dimensions.height * 0.75);
    if (lenis) {
      lenis.scrollTo(targetY, { duration: 1.3 });
    } else {
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  // Scroll smoothly back up to the Hero section using Lenis weighted scroll
  const handleScrollToHero = () => {
    soundEngine.playClick(0.9);
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.4 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Return to the intro gate
  const handleReturnToIntro = () => {
    soundEngine.playClick(0.9);
    setStage('intro');
    setCurrentScrollY(0);
    setScrollProgress(0);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
      lenis.stop();
    }
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
      if (!updated[index]) return prev;
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        updated.splice(index, 1);
      } else {
        updated[index] = { ...updated[index], quantity: newQty };
      }
      return updated;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const expandDistance = Math.round(dimensions.height * 0.75);
  const isFullyExpanded = currentScrollY >= expandDistance;
  const isStarted = currentScrollY > 8;

  // Max radius needed to cover the entire viewport from bottom-center (50%, 102%)
  const maxRadius = Math.ceil(
    Math.sqrt(Math.pow(dimensions.width * 0.5, 2) + Math.pow(dimensions.height * 1.02, 2)) * 1.08
  );

  const expansionP = Math.min(1, Math.max(0, currentScrollY / (expandDistance || 1)));
  // Smooth power curve for gradual expansion from small circle to full view
  const currentRadius = Math.round(maxRadius * Math.pow(expansionP, 1.25));

  // During scroll < expandDistance: Store is held at top: 0 on screen so the circle expands across it.
  // Once scroll >= expandDistance: storeOffsetY = 0, so the store scrolls naturally with the scrollbar!
  const storeOffsetY = currentScrollY < expandDistance
    ? -(expandDistance - currentScrollY)
    : 0;

  // Circle center on the store element: exactly at the bottom-center of the screen
  const circleCenterY = Math.round(dimensions.height * 1.02);

  const dynamicClipPath = isFullyExpanded
    ? 'none'
    : isStarted
    ? `circle(${currentRadius}px at 50% ${circleCenterY}px)`
    : 'circle(0px at 50% ${circleCenterY}px)';

  return (
    <div className="relative min-h-[100dvh] w-full select-none sm:select-auto">
      {/* =====================================================================
          GLOBAL STATIONARY SAGE GREEN DOTTED BACKGROUND
          Stationary viewport layer: z-0 stays in front of body canvas,
          allowing the Hero and Store contents (z-10) to glide over it seamlessly!
      ====================================================================== */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundColor: '#546652',
          backgroundImage: 'radial-gradient(circle, rgba(246, 242, 234, 0.48) 1.6px, transparent 1.6px)',
          backgroundSize: '28px 28px',
          backgroundPosition: 'center center',
        }}
      />

      {/* =====================================================================
          ACT 1: MINIMAL SAGE GREEN DOTTED INTRO (NO VIDEOS — PURE MINIMALISM)
      ====================================================================== */}
      <AnimatePresence>
        {stage === 'intro' && (
          <motion.section
            key="minimal-sage-intro-gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
            onClick={handleEnterFromIntro}
            className="fixed inset-0 z-50 flex h-[100dvh] w-full cursor-pointer flex-col items-center justify-center overflow-hidden px-6 text-[#F6F2EA] select-none group"
            style={{
              backgroundColor: '#546652',
              backgroundImage: 'radial-gradient(circle, rgba(246, 242, 234, 0.48) 1.6px, transparent 1.6px)',
              backgroundSize: '28px 28px',
              backgroundPosition: 'center center',
            }}
          >
            {/* Center Lockup: Logo at the side of thissoftwarestore + tap to enter */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex items-center justify-center gap-3.5 sm:gap-4.5 transition-transform duration-300 group-hover:scale-[1.02]">
                <img
                  src="/images/thissoftware-emblem-transparent.png"
                  alt="SyntaxWear"
                  className="h-9 w-9 sm:h-12 sm:w-12 object-contain drop-shadow-sm"
                />
                <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.035em] text-[#F6F2EA]">
                  SyntaxWear
                </h1>
              </div>

              <div className="mt-5 sm:mt-6 flex items-center gap-2">
                <span className="font-mono text-xs sm:text-sm uppercase tracking-[0.24em] text-[#F6F2EA]/70 transition-colors duration-200 group-hover:text-[#F6F2EA]">
                  tap to enter
                </span>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* =====================================================================
          ACT 2 & 3: UNIFIED STORE EXPERIENCE (HERO AT TOP -> STORE DIRECTLY BELOW)
          ZERO SHOP LOCK — SCROLL FREELY DOWN TO SHOP & BACK UP TO HERO!
      ====================================================================== */}
      {stage === 'main' && (
        <main className="relative z-10 w-full">
          {/* 1. FIXED STATIONARY HERO SECTION (Zero movement, stays locked to viewport!) */}
          <section
            id="hero-section"
            className="fixed inset-0 h-[100dvh] w-full overflow-hidden bg-transparent z-0"
            style={{
              visibility: isFullyExpanded ? 'hidden' : 'visible',
              pointerEvents: isStarted ? 'none' : 'auto',
            }}
          >
            <HeroSunCarousel
              cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
              isMuted={isMuted}
              onToggleMute={handleToggleMute}
              isDark={isDark}
              onToggleDark={handleToggleDark}
              onOpenStore={handleScrollToStore}
              onOpenBag={() => setIsBagOpen(true)}
              onOpenSell={() => setCommerceView('sell')}
              onQuickAddSlide={(slide: HeroSlide, selectedSize: string) => {
                const matchedProduct =
                  PRODUCTS.find((p) => p.id === slide.productId) || PRODUCTS[0];
                handleAddToCart(
                  matchedProduct,
                  matchedProduct.finishes[0].name,
                  selectedSize
                );
              }}
            />
          </section>

          {/* 2. SCROLL TRACK SPACER FOR THE EXPANSION */}
          <div
            style={{ height: `${expandDistance}px` }}
            className="w-full pointer-events-none"
          />

          {/* 3. THE SINGLE STORE SECTION (Expands on top of Hero, then scrolls naturally) */}
          <div
            id="store-section"
            className="relative z-10 w-full"
            style={{
              transform: currentScrollY < expandDistance
                ? `translate3d(0, ${storeOffsetY}px, 0)`
                : 'none',
              clipPath: dynamicClipPath,
              WebkitClipPath: dynamicClipPath,
              visibility: isStarted ? 'visible' : 'hidden',
              opacity: isStarted ? 1 : 0,
              pointerEvents: isFullyExpanded ? 'auto' : isStarted ? 'auto' : 'none',
            }}
          >
            <CleanStorefront
              cart={cart}
              onAddToCart={handleAddToCart}
              onOpenBag={() => setIsBagOpen(true)}
              onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
              onOpenSell={() => setCommerceView('sell')}
              onOpenSellerDashboard={() => setCommerceView('seller')}
              isBagOpen={isBagOpen}
              onDetailOpenChange={setIsDetailOpen}
              isMuted={isMuted}
              onToggleMute={handleToggleMute}
              isDark={isDark}
              onToggleDark={handleToggleDark}
              onReplayDesertOrigin={handleReturnToIntro}
              onScrollToHero={handleScrollToHero}
            />
          </div>
        </main>
      )}

      {/* Figma Shopping Bag Drawer */}
      <FigmaCartDrawer
        isOpen={isBagOpen}
        isDark={isDark}
        items={cart}
        onClose={() => setIsBagOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onViewBag={() => {
          setIsBagOpen(false);
          setCommerceView('cart');
        }}
        onCheckout={() => {
          setIsBagOpen(false);
          setCommerceView('checkout-information');
        }}
      />

      {/* Figma Full Shopping Bag Page */}
      {commerceView === 'cart' && (
        <FigmaCartPage
          items={cart}
          isDark={isDark}
          onToggleDark={handleToggleDark}
          onContinueShopping={() => setCommerceView(null)}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveCartItem}
          onBeginCheckout={() => setCommerceView('checkout-information')}
        />
      )}

      {/* Figma Multi-Step Checkout Flow (Information -> Delivery -> Payment -> Review -> Success) */}
      {commerceView && commerceView.startsWith('checkout-') && (
        <FigmaCheckoutPage
          step={
            commerceView.replace('checkout-', '') as
              | 'information'
              | 'delivery'
              | 'payment'
              | 'review'
              | 'success'
          }
          items={cart}
          isDark={isDark}
          onToggleDark={handleToggleDark}
          onStepChange={(step) => setCommerceView(`checkout-${step}`)}
          onReturnToBag={() => setCommerceView('cart')}
          onReturnToStore={() => setCommerceView(null)}
          onClearCart={handleClearCart}
        />
      )}

      {/* Seller Onboarding Flow (?view=sell) */}
      {commerceView === 'sell' && (
        <SellerOnboarding
          isDark={isDark}
          onToggleDark={handleToggleDark}
          onReturnToStore={() => setCommerceView(null)}
          onOpenSellerDashboard={() => setCommerceView('seller')}
          onCompleteOnboarding={() => setCommerceView('seller')}
        />
      )}

      {/* Seller Workspace Dashboard (?view=seller) */}
      {commerceView === 'seller' && (
        <SellerDashboard
          isDark={isDark}
          onToggleDark={handleToggleDark}
          onReturnToStore={() => setCommerceView(null)}
          onOpenOnboarding={() => setCommerceView('sell')}
        />
      )}

      {/* Track Order & Past Receipts Modal */}
      <TrackOrderModal
        isOpen={isTrackOrderOpen}
        isDark={isDark}
        onClose={() => setIsTrackOrderOpen(false)}
      />
    </div>
  );
}

export default App;
