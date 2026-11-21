import React, { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Sun, Moon } from 'lucide-react';
import { CartItem } from './CleanStorefront';
import { soundEngine } from '../utils/soundEngine';
import { AnimatedReceipt, downloadReceiptPng, type ReceiptData } from './AnimatedReceipt';

export type CommerceView =
  | null
  | 'cart'
  | 'checkout-information'
  | 'checkout-delivery'
  | 'checkout-payment'
  | 'checkout-review'
  | 'checkout-success';

type CheckoutStep = 'information' | 'delivery' | 'payment' | 'review' | 'success';

type CheckoutDetails = {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  deliveryMethod: 'standard' | 'express';
  paymentMethod: 'card' | 'transfer';
  paymentLast4: string;
  cardNumberDisplay: string;
  cardExpiry: string;
  cardCvc: string;
};

const INITIAL_CHECKOUT_DETAILS: CheckoutDetails = {
  email: '',
  firstName: '',
  lastName: '',
  address: '',
  apartment: '',
  city: '',
  region: '',
  postalCode: '',
  country: 'Nigeria',
  deliveryMethod: 'standard',
  paymentMethod: 'card',
  paymentLast4: '',
  cardNumberDisplay: '',
  cardExpiry: '',
  cardCvc: '',
};

const COUNTRY_GROUPS: Array<{ label: string; countries: string[] }> = [
  {
    label: 'Africa & Middle East',
    countries: [
      'Nigeria',
      'Ghana',
      'Kenya',
      'South Africa',
      'Egypt',
      'Morocco',
      'Rwanda',
      'Senegal',
      'United Arab Emirates',
      'Saudi Arabia',
    ],
  },
  {
    label: 'North America & UK',
    countries: ['United Kingdom', 'United States', 'Canada', 'Mexico'],
  },
  {
    label: 'Europe',
    countries: [
      'Germany',
      'France',
      'Netherlands',
      'Ireland',
      'Italy',
      'Spain',
      'Portugal',
      'Belgium',
      'Switzerland',
      'Sweden',
      'Norway',
      'Denmark',
      'Poland',
      'Austria',
    ],
  },
  {
    label: 'Asia-Pacific & South America',
    countries: [
      'Australia',
      'New Zealand',
      'Japan',
      'South Korea',
      'Singapore',
      'India',
      'Brazil',
      'Argentina',
    ],
  },
];

const TAX_RATES: Record<string, number> = {
  Nigeria: 0.075,
  Ghana: 0.125,
  Kenya: 0.16,
  'South Africa': 0.15,
  'United Kingdom': 0.2,
  'United States': 0.08,
  Canada: 0.13,
  Germany: 0.19,
  France: 0.2,
  Netherlands: 0.21,
  Ireland: 0.23,
  Italy: 0.22,
  Spain: 0.21,
  Australia: 0.1,
  'United Arab Emirates': 0.05,
};

function getEstimatedTaxRate(country: string): number {
  return TAX_RATES[country] ?? 0.05;
}

interface PromoRule {
  code: string;
  label: string;
  type: 'percent' | 'fixed';
  value: number;
}

const PROMO_RULES: Record<string, PromoRule> = {
  SYNTAX10: { code: 'SYNTAX10', label: '10% off batch order', type: 'percent', value: 10 },
  '404DROP': { code: '404DROP', label: '15% off launch edit', type: 'percent', value: 15 },
  BATCH001: { code: 'BATCH001', label: '$15 off order', type: 'fixed', value: 15 },
};

function readStoredPromoCode(): string {
  try {
    return window.sessionStorage.getItem('syntaxwear-promo') || '';
  } catch {
    return '';
  }
}

function saveStoredPromoCode(code: string) {
  try {
    if (code) window.sessionStorage.setItem('syntaxwear-promo', code);
    else window.sessionStorage.removeItem('syntaxwear-promo');
  } catch {
    // ignore storage errors
  }
}

function computePromoDiscount(subtotal: number, code: string): number {
  const rule = PROMO_RULES[code.toUpperCase()];
  if (!rule || subtotal <= 0) return 0;
  const raw =
    rule.type === 'percent' ? Math.round((subtotal * rule.value) / 100) : rule.value;
  return Math.min(subtotal, Math.max(0, raw));
}

function saveOrderToHistory(receipt: ReceiptData) {
  try {
    const raw = window.localStorage.getItem('syntaxwear-orders');
    const existing = raw ? (JSON.parse(raw) as ReceiptData[]) : [];
    const next = [receipt, ...existing.filter((o) => o.orderNumber !== receipt.orderNumber)].slice(
      0,
      20
    );
    window.localStorage.setItem('syntaxwear-orders', JSON.stringify(next));
  } catch {
    // ignore storage errors
  }
}

function readOrderHistory(): ReceiptData[] {
  try {
    const raw = window.localStorage.getItem('syntaxwear-orders');
    return raw ? (JSON.parse(raw) as ReceiptData[]) : [];
  } catch {
    return [];
  }
}

const STEP_ORDER: Array<'information' | 'delivery' | 'payment' | 'review'> = [
  'information',
  'delivery',
  'payment',
  'review',
];

function getItemImage(item: CartItem): string {
  return (
    item.product.finishes.find((f) => f.name === item.finishName)?.image ||
    item.product.image
  );
}

function getItemMeta(item: CartItem): string {
  const parts = [item.finishName];
  if (item.size) parts.push(item.size);
  return parts.join(' · ');
}

function CommerceBrand({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="commerce-brand">
      <span className="commerce-brand-mark">
        <img
          src="/images/thissoftware-emblem-transparent.png"
          alt="SyntaxWear"
          className="h-full w-full object-contain"
        />
      </span>
      <span>SyntaxWear</span>
    </button>
  );
}

/* ============================================================================
   1. SLIDE-OVER SHOPPING BAG DRAWER (Exact Figma Design)
============================================================================ */
interface FigmaCartDrawerProps {
  isOpen: boolean;
  isDark?: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (index: number, delta: number) => void;
  onRemoveItem: (index: number) => void;
  onViewBag: () => void;
  onCheckout: () => void;
}

export const FigmaCartDrawer: React.FC<FigmaCartDrawerProps> = ({
  isOpen,
  isDark = false,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onViewBag,
  onCheckout,
}) => {
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className={`cart-drawer-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        data-lenis-prevent
        className={`cart-drawer ${isDark ? 'commerce-dark' : ''} ${isOpen ? 'open' : ''}`}
        aria-label="Shopping bag"
      >
        <div className="cart-drawer-header">
          <div>
            <p>Shopping bag</p>
            <span>
              {count} object{count === 1 ? '' : 's'}
            </span>
          </div>
          <button type="button" onClick={onClose} aria-label="Close shopping bag">
            ×
          </button>
        </div>

        {items.length > 0 ? (
          <>
            <div className="cart-drawer-items" data-lenis-prevent>
              {items.map((item, index) => (
                <article
                  key={`${item.product.id}-${item.finishName}-${item.size || 'one'}`}
                >
                  <img src={getItemImage(item)} alt={item.product.name} />
                  <div>
                    <p>{item.product.name}</p>
                    <span>{getItemMeta(item)} · Ready to ship</span>
                    <div>
                      <div>
                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playClick(0.9);
                            onUpdateQuantity(index, -1);
                          }}
                          aria-label={`Decrease ${item.product.name} quantity`}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playClick(1.1);
                            onUpdateQuantity(index, 1);
                          }}
                          aria-label={`Increase ${item.product.name} quantity`}
                        >
                          +
                        </button>
                      </div>
                      <strong>${item.product.price * item.quantity}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playClick(0.85);
                        onRemoveItem(index);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="cart-drawer-footer">
              <div>
                <span>Subtotal</span>
                <strong>${subtotal}</strong>
              </div>
              <p>Taxes calculated at checkout. Shipping is complimentary over $200.</p>
              <button
                type="button"
                className="cart-drawer-checkout-btn"
                onClick={() => {
                  soundEngine.playAddToBagChord();
                  onCheckout();
                }}
              >
                Checkout <span>${subtotal}</span>
              </button>
              <button
                type="button"
                className="cart-drawer-viewbag-btn"
                onClick={() => {
                  soundEngine.playClick(1.0);
                  onViewBag();
                }}
              >
                View shopping bag
              </button>
            </div>
          </>
        ) : (
          <div className="cart-drawer-empty">
            <span>0</span>
            <h2>Your bag is quiet.</h2>
            <p>Add an object from the collection and it will wait for you here.</p>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick(0.95);
                onClose();
              }}
            >
              Continue exploring
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

/* ============================================================================
   2. FULL SHOPPING BAG PAGE (/cart Equivalent — Exact Figma Design)
============================================================================ */
interface FigmaCartPageProps {
  items: CartItem[];
  isDark?: boolean;
  onToggleDark?: () => void;
  onContinueShopping: () => void;
  onUpdateQuantity: (index: number, delta: number) => void;
  onRemoveItem: (index: number) => void;
  onBeginCheckout: () => void;
}

export const FigmaCartPage: React.FC<FigmaCartPageProps> = ({
  items,
  isDark = false,
  onToggleDark,
  onContinueShopping,
  onUpdateQuantity,
  onRemoveItem,
  onBeginCheckout,
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [promoCode, setPromoCode] = useState<string>(readStoredPromoCode);
  const [promoInput, setPromoInput] = useState<string>('');
  const [promoError, setPromoError] = useState<string>('');

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = computePromoDiscount(subtotal, promoCode);
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const shipping = discountedSubtotal >= 200 ? 0 : 12;

  const handleApplyPromo = (e: FormEvent) => {
    e.preventDefault();
    const cleaned = promoInput.trim().toUpperCase();
    if (!cleaned) return;
    if (!PROMO_RULES[cleaned]) {
      soundEngine.playClick(0.8);
      setPromoError('Invalid code. Try SYNTAX10, 404DROP, or BATCH001.');
      return;
    }
    soundEngine.playAddToBagChord();
    setPromoCode(cleaned);
    saveStoredPromoCode(cleaned);
    setPromoInput('');
    setPromoError('');
  };

  const handleRemovePromo = () => {
    soundEngine.playClick(0.9);
    setPromoCode('');
    saveStoredPromoCode('');
    setPromoError('');
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return (
    <div
      ref={scrollRef}
      data-lenis-prevent
      className={`commerce-shell ${isDark ? 'commerce-dark' : ''} fixed inset-0 z-[75] overflow-y-auto`}
    >
      <main className="cart-page">
        <header className="commerce-header">
          <CommerceBrand onClick={onContinueShopping} />
          <div className="commerce-header-actions">
            {onToggleDark && (
              <button
                type="button"
                className="commerce-theme-toggle"
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                onClick={() => {
                  soundEngine.playClick(1.0);
                  onToggleDark();
                }}
              >
                {isDark ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            )}
            <button
              type="button"
              className="commerce-header-action"
              onClick={() => {
                soundEngine.playClick(0.95);
                onContinueShopping();
              }}
            >
              Continue shopping
            </button>
          </div>
        </header>

        <div className="cart-page-title">
          <p>
            Shopping bag / {items.length} line{items.length === 1 ? '' : 's'}
          </p>
          <h1>
            Your considered <em>edit.</em>
          </h1>
        </div>

        {items.length > 0 ? (
          <div className="cart-page-layout">
            <section className="cart-line-items">
              {items.map((item, index) => (
                <article
                  key={`${item.product.id}-${item.finishName}-${item.size || 'one'}`}
                >
                  <img src={getItemImage(item)} alt={item.product.name} />
                  <div className="cart-line-copy">
                    <p>Item {String(item.product.index || index + 1).padStart(2, '0')}</p>
                    <h2>{item.product.name}</h2>
                    <span>{getItemMeta(item)} · In stock</span>
                    <div>
                      <div className="cart-page-quantity">
                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playClick(0.9);
                            onUpdateQuantity(index, -1);
                          }}
                          aria-label={`Decrease ${item.product.name} quantity`}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playClick(1.1);
                            onUpdateQuantity(index, 1);
                          }}
                          aria-label={`Increase ${item.product.name} quantity`}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.playClick(0.85);
                          onRemoveItem(index);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <strong>${item.product.price * item.quantity}</strong>
                </article>
              ))}
            </section>

            <aside className="order-summary">
              <p className="commerce-product-category">Order summary</p>
              <div>
                <span>Subtotal</span>
                <strong>${subtotal}</strong>
              </div>
              {discountAmount > 0 && (
                <div>
                  <span>Promo ({promoCode})</span>
                  <strong>−${discountAmount}</strong>
                </div>
              )}
              <div>
                <span>Estimated shipping</span>
                <strong>{shipping ? `$${shipping}` : 'Complimentary'}</strong>
              </div>
              <div className="order-summary-total">
                <span>Estimated total</span>
                <strong>${discountedSubtotal + shipping}</strong>
              </div>

              {promoCode ? (
                <div className="promo-applied-bar">
                  <span>
                    Code <b>{promoCode}</b> applied
                  </span>
                  <button type="button" onClick={handleRemovePromo}>
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="promo-code-form">
                  <input
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Promo code (e.g. SYNTAX10)"
                    aria-label="Promo code"
                  />
                  <button type="submit">Apply</button>
                </form>
              )}
              {promoError && <p className="promo-error-text">{promoError}</p>}

              <button
                type="button"
                className="order-summary-cta"
                onClick={() => {
                  soundEngine.playAddToBagChord();
                  onBeginCheckout();
                }}
              >
                Begin checkout <span>→</span>
              </button>
              <p>Taxes calculated at checkout based on your delivery country.</p>
              <div className="cart-assurance">
                <span>Secure checkout</span>
                <span>30-day returns</span>
                <span>Two-year warranty</span>
              </div>
            </aside>
          </div>
        ) : (
          <section className="cart-page-empty">
            <span>0</span>
            <h2>Your bag is quiet.</h2>
            <p>Explore the collection and choose an object made to stay.</p>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick(0.95);
                onContinueShopping();
              }}
            >
              Explore the collection
            </button>
          </section>
        )}
      </main>
    </div>
  );
};

/* ============================================================================
   3. MULTI-STEP CHECKOUT FLOW (/checkout/[step] + Success — Exact Figma Design)
============================================================================ */
interface FigmaCheckoutPageProps {
  step: CheckoutStep;
  items: CartItem[];
  isDark?: boolean;
  onToggleDark?: () => void;
  onStepChange: (step: CheckoutStep) => void;
  onReturnToBag: () => void;
  onReturnToStore: () => void;
  onClearCart: () => void;
}

export const FigmaCheckoutPage: React.FC<FigmaCheckoutPageProps> = ({
  step,
  items,
  isDark = false,
  onToggleDark,
  onStepChange,
  onReturnToBag,
  onReturnToStore,
  onClearCart,
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [details, setDetails] = useState<CheckoutDetails>(() => {
    try {
      const stored = window.localStorage.getItem('syntaxwear-checkout');
      if (stored) {
        return { ...INITIAL_CHECKOUT_DETAILS, ...(JSON.parse(stored) as Partial<CheckoutDetails>) };
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_CHECKOUT_DETAILS;
  });

  const [orderNumber, setOrderNumber] = useState<string>(() => {
    try {
      return window.sessionStorage.getItem('syntaxwear-last-order') || '';
    } catch {
      return '';
    }
  });
  const [lastReceipt, setLastReceipt] = useState<ReceiptData | null>(() => {
    try {
      const saved = window.sessionStorage.getItem('syntaxwear-last-receipt');
      return saved ? (JSON.parse(saved) as ReceiptData) : null;
    } catch {
      return null;
    }
  });
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [promoCode, setPromoCode] = useState<string>(readStoredPromoCode);
  const [promoInput, setPromoInput] = useState<string>('');
  const [promoError, setPromoError] = useState<string>('');

  useEffect(() => {
    try {
      const { cardCvc: _omitCvc, cardNumberDisplay: _omitNum, ...safePersist } = details;
      window.localStorage.setItem('syntaxwear-checkout', JSON.stringify(safePersist));
    } catch {
      // ignore storage errors
    }
  }, [details]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = computePromoDiscount(subtotal, promoCode);
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const shipping = details.deliveryMethod === 'express' ? 24 : discountedSubtotal >= 200 ? 0 : 12;
  const taxRate = getEstimatedTaxRate(details.country);
  const tax = Math.round(discountedSubtotal * taxRate * 100) / 100;
  const total = Math.round((discountedSubtotal + shipping + tax) * 100) / 100;
  const activeIndex = STEP_ORDER.indexOf(step as (typeof STEP_ORDER)[number]);

  const handleApplyPromo = (e: FormEvent) => {
    e.preventDefault();
    const cleaned = promoInput.trim().toUpperCase();
    if (!cleaned) return;
    if (!PROMO_RULES[cleaned]) {
      soundEngine.playClick(0.8);
      setPromoError('Invalid code. Try SYNTAX10, 404DROP, or BATCH001.');
      return;
    }
    soundEngine.playAddToBagChord();
    setPromoCode(cleaned);
    saveStoredPromoCode(cleaned);
    setPromoInput('');
    setPromoError('');
  };

  const handleRemovePromo = () => {
    soundEngine.playClick(0.9);
    setPromoCode('');
    saveStoredPromoCode('');
    setPromoError('');
  };

  const update = <K extends keyof CheckoutDetails>(field: K, value: CheckoutDetails[K]) => {
    setDetails((current) => ({ ...current, [field]: value }));
  };

  const handleStepSubmit = (event: FormEvent, nextStep: CheckoutStep) => {
    event.preventDefault();
    soundEngine.playClick(1.05);
    setError('');
    onStepChange(nextStep);
  };

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      setError('Your bag is empty. Add an item before placing your order.');
      return;
    }
    setError('');
    setIsPending(true);
    soundEngine.playAddToBagChord();

    window.setTimeout(() => {
      const generated = `SW-${100000 + Math.floor(Math.random() * 900000)}`;
      const dateLabel = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      })
        .format(new Date())
        .toUpperCase();

      const receiptSnapshot: ReceiptData = {
        orderNumber: generated,
        dateLabel,
        email: details.email,
        customerName: [details.firstName, details.lastName].filter(Boolean).join(' ') || undefined,
        shippingAddress: details.address
          ? `${details.address}, ${details.city}, ${details.region}, ${details.country}${
              details.postalCode ? ` ${details.postalCode}` : ''
            }`
          : details.country,
        deliveryLabel:
          details.deliveryMethod === 'express' ? 'Express Delivery' : 'Standard Delivery',
        paymentLast4:
          details.paymentMethod === 'transfer' ? 'BANK' : details.paymentLast4 || undefined,
        items: items.map((item) => ({
          name: item.product.name,
          meta: getItemMeta(item),
          quantity: item.quantity,
          unitPrice: item.product.price,
          lineTotal: item.product.price * item.quantity,
        })),
        subtotal,
        discountCode: promoCode || undefined,
        discountAmount: discountAmount > 0 ? discountAmount : undefined,
        tax: tax > 0 ? tax : undefined,
        shipping,
        total,
      };

      try {
        window.sessionStorage.setItem('syntaxwear-last-order', generated);
        window.sessionStorage.setItem('syntaxwear-last-receipt', JSON.stringify(receiptSnapshot));
      } catch {
        // ignore storage errors
      }
      saveOrderToHistory(receiptSnapshot);
      saveStoredPromoCode('');
      setPromoCode('');
      setOrderNumber(generated);
      setLastReceipt(receiptSnapshot);
      onClearCart();
      setIsPending(false);
      onStepChange('success');
    }, 450);
  };

  const summary = useMemo(
    () => (
      <aside className="checkout-summary">
        <p className="commerce-product-category">Your order</p>
        <div className="checkout-summary-items">
          {items.map((item, idx) => (
            <div key={`${item.product.id}-${item.finishName}-${item.size || idx}`}>
              <span>
                <img src={getItemImage(item)} alt={item.product.name} />
                <b>{item.quantity}</b>
              </span>
              <p>
                {item.product.name}
                <small>{getItemMeta(item)}</small>
              </p>
              <strong>${item.product.price * item.quantity}</strong>
            </div>
          ))}
        </div>

        {promoCode ? (
          <div className="promo-applied-bar" style={{ marginTop: 18 }}>
            <span>
              Code <b>{promoCode}</b> (−${discountAmount})
            </span>
            <button type="button" onClick={handleRemovePromo}>
              Remove
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyPromo} className="promo-code-form" style={{ marginTop: 18 }}>
            <input
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              placeholder="Promo code"
              aria-label="Promo code"
            />
            <button type="submit">Apply</button>
          </form>
        )}
        {promoError && <p className="promo-error-text">{promoError}</p>}

        <div className="checkout-totals">
          <p>
            <span>Subtotal</span>
            <strong>${subtotal.toFixed(2)}</strong>
          </p>
          {discountAmount > 0 && (
            <p>
              <span>Promo ({promoCode})</span>
              <strong>−${discountAmount.toFixed(2)}</strong>
            </p>
          )}
          <p>
            <span>Shipping</span>
            <strong>{shipping ? `$${shipping.toFixed(2)}` : 'Complimentary'}</strong>
          </p>
          <p>
            <span>
              Estimated tax ({details.country} · {Math.round(taxRate * 100)}%)
            </span>
            <strong>${tax.toFixed(2)}</strong>
          </p>
          <p>
            <span>Total</span>
            <strong>
              <small>USD</small> ${total.toFixed(2)}
            </strong>
          </p>
        </div>
      </aside>
    ),
    [
      details.country,
      discountAmount,
      items,
      promoCode,
      promoError,
      promoInput,
      shipping,
      subtotal,
      tax,
      taxRate,
      total,
    ]
  );

  if (step === 'success') {
    const activeReceipt: ReceiptData = lastReceipt || {
      orderNumber: orderNumber || 'SW-404100',
      dateLabel: new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      })
        .format(new Date())
        .toUpperCase(),
      email: details.email,
      deliveryLabel:
        details.deliveryMethod === 'express' ? 'Express Delivery' : 'Standard Delivery',
      items: items.map((item) => ({
        name: item.product.name,
        meta: getItemMeta(item),
        quantity: item.quantity,
        unitPrice: item.product.price,
        lineTotal: item.product.price * item.quantity,
      })),
      subtotal,
      shipping,
      total,
    };

    return (
      <div
        ref={scrollRef}
        data-lenis-prevent
        className="commerce-shell fixed inset-0 z-[75] overflow-y-auto"
      >
        <main className="checkout-success">
          <div className="checkout-success-grid">
            <div className="checkout-success-copy">
              <div className="checkout-success-mark">✓</div>
              <p className="commerce-section-index">Order received</p>
              <h1>
                Thank you.
                <br />
                <em>It’s being prepared.</em>
              </h1>
              <p>
                A confirmation has been sent to {details.email || 'your email'}. We’ll send
                tracking as soon as your pieces leave the studio.
              </p>
              {orderNumber && <strong>Order {orderNumber}</strong>}
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick(0.95);
                  onReturnToStore();
                }}
              >
                Return to the collection
              </button>
            </div>

            <div className="checkout-success-receipt">
              <AnimatedReceipt receipt={activeReceipt} />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      data-lenis-prevent
      className={`commerce-shell ${isDark ? 'commerce-dark' : ''} fixed inset-0 z-[75] overflow-y-auto`}
    >
      <main className="checkout-page">
        <header className="checkout-header">
          <CommerceBrand onClick={onReturnToStore} />
          <span>Secure checkout</span>
          <div className="commerce-header-actions">
            {onToggleDark && (
              <button
                type="button"
                className="commerce-theme-toggle"
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                onClick={() => {
                  soundEngine.playClick(1.0);
                  onToggleDark();
                }}
              >
                {isDark ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            )}
            <button
              type="button"
              className="commerce-header-action"
              onClick={() => {
                soundEngine.playClick(0.9);
                onReturnToBag();
              }}
            >
              Return to bag
            </button>
          </div>
        </header>

        <div className="checkout-progress">
          {STEP_ORDER.map((item, index) => (
            <button
              type="button"
              key={item}
              disabled={index > activeIndex}
              onClick={() => {
                if (index < activeIndex) {
                  soundEngine.playClick(0.95);
                  onStepChange(item);
                }
              }}
              className={index <= activeIndex ? 'active' : ''}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p>{item}</p>
            </button>
          ))}
        </div>

        <div className="checkout-layout">
          <section className="checkout-panel">
            {step === 'information' && (
              <form onSubmit={(event) => handleStepSubmit(event, 'delivery')}>
                <p className="commerce-section-index">Step 01 / Information</p>
                <h1>
                  Where should we
                  <br />
                  <em>send it?</em>
                </h1>
                <div className="checkout-fields">
                  <label className="wide">
                    Email
                    <input
                      type="email"
                      required
                      value={details.email}
                      onChange={(event) => update('email', event.target.value)}
                    />
                  </label>
                  <label>
                    First name
                    <input
                      required
                      value={details.firstName}
                      onChange={(event) => update('firstName', event.target.value)}
                    />
                  </label>
                  <label>
                    Last name
                    <input
                      required
                      value={details.lastName}
                      onChange={(event) => update('lastName', event.target.value)}
                    />
                  </label>
                  <label className="wide">
                    Address
                    <input
                      required
                      value={details.address}
                      onChange={(event) => update('address', event.target.value)}
                    />
                  </label>
                  <label className="wide">
                    Apartment, suite, etc. <span>Optional</span>
                    <input
                      value={details.apartment}
                      onChange={(event) => update('apartment', event.target.value)}
                    />
                  </label>
                  <label>
                    City
                    <input
                      required
                      value={details.city}
                      onChange={(event) => update('city', event.target.value)}
                    />
                  </label>
                  <label>
                    State / region
                    <input
                      required
                      value={details.region}
                      onChange={(event) => update('region', event.target.value)}
                    />
                  </label>
                  <label>
                    Postal code {details.country === 'Nigeria' && <span>Optional</span>}
                    <input
                      required={details.country !== 'Nigeria'}
                      value={details.postalCode}
                      onChange={(event) => update('postalCode', event.target.value)}
                    />
                  </label>
                  <label>
                    Country / region
                    <select
                      value={details.country}
                      onChange={(event) => update('country', event.target.value)}
                    >
                      {COUNTRY_GROUPS.map((group) => (
                        <optgroup key={group.label} label={group.label}>
                          {group.countries.map((countryName) => (
                            <option key={countryName} value={countryName}>
                              {countryName}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </label>
                </div>
                <button type="submit" className="checkout-next">
                  Continue to delivery <span>→</span>
                </button>
              </form>
            )}

            {step === 'delivery' && (
              <form onSubmit={(event) => handleStepSubmit(event, 'payment')}>
                <p className="commerce-section-index">Step 02 / Delivery</p>
                <h1>
                  Choose your
                  <br />
                  <em>pace.</em>
                </h1>
                <div className="delivery-options">
                  <label className={details.deliveryMethod === 'standard' ? 'active' : ''}>
                    <input
                      type="radio"
                      name="delivery"
                      value="standard"
                      checked={details.deliveryMethod === 'standard'}
                      onChange={() => {
                        soundEngine.playClick(1.05);
                        update('deliveryMethod', 'standard');
                      }}
                    />
                    <span>
                      <strong>Standard delivery</strong>
                      <small>3–5 business days · Tracked</small>
                    </span>
                    <b>{subtotal >= 200 ? 'Complimentary' : '$12'}</b>
                  </label>
                  <label className={details.deliveryMethod === 'express' ? 'active' : ''}>
                    <input
                      type="radio"
                      name="delivery"
                      value="express"
                      checked={details.deliveryMethod === 'express'}
                      onChange={() => {
                        soundEngine.playClick(1.05);
                        update('deliveryMethod', 'express');
                      }}
                    />
                    <span>
                      <strong>Express delivery</strong>
                      <small>1–2 business days · Priority</small>
                    </span>
                    <b>$24</b>
                  </label>
                </div>
                <div className="checkout-nav">
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick(0.9);
                      onStepChange('information');
                    }}
                  >
                    ← Back
                  </button>
                  <button type="submit" className="checkout-next">
                    Continue to payment <span>→</span>
                  </button>
                </div>
              </form>
            )}

            {step === 'payment' && (
              <form onSubmit={(event) => handleStepSubmit(event, 'review')}>
                <p className="commerce-section-index">Step 03 / Payment</p>
                <h1>
                  Securely
                  <br />
                  <em>handled.</em>
                </h1>

                <div className="delivery-options" style={{ marginBottom: 18 }}>
                  <label className={details.paymentMethod === 'card' ? 'active' : ''}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={details.paymentMethod === 'card'}
                      onChange={() => {
                        soundEngine.playClick(1.05);
                        update('paymentMethod', 'card');
                      }}
                    />
                    <span>
                      <strong>Debit / Credit Card</strong>
                      <small>Visa · Mastercard · Verve · Amex</small>
                    </span>
                    <b>INSTANT</b>
                  </label>
                  <label className={details.paymentMethod === 'transfer' ? 'active' : ''}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="transfer"
                      checked={details.paymentMethod === 'transfer'}
                      onChange={() => {
                        soundEngine.playClick(1.05);
                        update('paymentMethod', 'transfer');
                      }}
                    />
                    <span>
                      <strong>Bank Transfer / Paystack Instant</strong>
                      <small>NGN & International wire gateway ready</small>
                    </span>
                    <b>DIRECT</b>
                  </label>
                </div>

                {details.paymentMethod === 'card' ? (
                  <div className="payment-card">
                    <div>
                      <span>Credit or debit card</span>
                      <b>VISA · MC · VERVE · AMEX</b>
                    </div>
                    <label>
                      Card number
                      <input
                        inputMode="numeric"
                        required
                        pattern="[0-9 ]{15,19}"
                        placeholder="4242 4242 4242 4242"
                        value={details.cardNumberDisplay}
                        onChange={(event) => {
                          const digits = event.target.value.replace(/\D/g, '').slice(0, 16);
                          const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
                          update('cardNumberDisplay', formatted);
                          update('paymentLast4', digits.slice(-4));
                        }}
                      />
                    </label>
                    <div>
                      <label>
                        Expiration
                        <input
                          required
                          placeholder="MM / YY"
                          pattern="[0-9/ ]{5,7}"
                          value={details.cardExpiry}
                          onChange={(event) => update('cardExpiry', event.target.value)}
                        />
                      </label>
                      <label>
                        Security code
                        <input
                          required
                          inputMode="numeric"
                          pattern="[0-9]{3,4}"
                          placeholder="CVC"
                          value={details.cardCvc}
                          onChange={(event) =>
                            update('cardCvc', event.target.value.replace(/\D/g, '').slice(0, 4))
                          }
                        />
                      </label>
                    </div>
                    <p>
                      Payment details are used only to validate this checkout and are not stored in
                      your order record.
                    </p>
                  </div>
                ) : (
                  <div className="payment-card">
                    <div>
                      <span>Instant Transfer / Gateway Checkout</span>
                      <b>PAYSTACK · STRIPE</b>
                    </div>
                    <p style={{ marginTop: 0 }}>
                      After reviewing your order, authorization executes directly via your payment
                      provider and confirms immediately with your digital receipt.
                    </p>
                  </div>
                )}
                <div className="checkout-nav">
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick(0.9);
                      onStepChange('delivery');
                    }}
                  >
                    ← Back
                  </button>
                  <button type="submit" className="checkout-next">
                    Review order <span>→</span>
                  </button>
                </div>
              </form>
            )}

            {step === 'review' && (
              <div>
                <p className="commerce-section-index">Step 04 / Review</p>
                <h1>
                  One last
                  <br />
                  <em>look.</em>
                </h1>
                <div className="review-order-block">
                  <div>
                    <span>Contact</span>
                    <p>{details.email || 'Not provided'}</p>
                    <button type="button" onClick={() => onStepChange('information')}>
                      Edit
                    </button>
                  </div>
                  <div>
                    <span>Ship to</span>
                    <p>
                      {details.address
                        ? `${details.address}, ${details.city}, ${details.region}, ${details.country}${
                            details.postalCode ? ` ${details.postalCode}` : ''
                          }`
                        : details.country}
                    </p>
                    <button type="button" onClick={() => onStepChange('information')}>
                      Edit
                    </button>
                  </div>
                  <div>
                    <span>Delivery</span>
                    <p>
                      {details.deliveryMethod === 'express'
                        ? 'Express · 1–2 days'
                        : 'Standard · 3–5 days'}
                    </p>
                    <button type="button" onClick={() => onStepChange('delivery')}>
                      Edit
                    </button>
                  </div>
                  <div>
                    <span>Payment</span>
                    <p>
                      {details.paymentMethod === 'transfer'
                        ? 'Bank Transfer / Instant Gateway'
                        : `Card ending in ${details.paymentLast4 || '••••'}`}
                    </p>
                    <button type="button" onClick={() => onStepChange('payment')}>
                      Edit
                    </button>
                  </div>
                </div>
                {error && <p className="checkout-error">{error}</p>}
                <div className="checkout-nav">
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick(0.9);
                      onStepChange('payment');
                    }}
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    className="checkout-next"
                    disabled={isPending}
                    onClick={handlePlaceOrder}
                  >
                    <span>{isPending ? 'Placing order…' : `Place order · $${total.toFixed(2)}`}</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}
          </section>

          {summary}
        </div>
      </main>
    </div>
  );
};

/* ============================================================================
   4. ORDER TRACKING & RECEIPT LOOKUP MODAL
============================================================================ */
interface TrackOrderModalProps {
  isOpen: boolean;
  isDark?: boolean;
  onClose: () => void;
}

export const TrackOrderModal: React.FC<TrackOrderModalProps> = ({
  isOpen,
  isDark = false,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [orders, setOrders] = useState<ReceiptData[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<ReceiptData | null>(null);
  const [lookupError, setLookupError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const history = readOrderHistory();
    setOrders(history);
    setSelectedOrder(history[0] || null);
    setLookupError('');
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLookup = (e: FormEvent) => {
    e.preventDefault();
    const cleaned = query.trim().toUpperCase();
    if (!cleaned) return;
    const match = orders.find(
      (o) => o.orderNumber.toUpperCase() === cleaned || o.email.toLowerCase() === cleaned.toLowerCase()
    );
    if (!match) {
      soundEngine.playClick(0.8);
      setLookupError(`No local order matched "${cleaned}". Place an order or verify your order ID.`);
      return;
    }
    soundEngine.playClick(1.05);
    setLookupError('');
    setSelectedOrder(match);
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        data-lenis-prevent
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-xl max-h-[88dvh] overflow-y-auto border p-6 sm:p-8 shadow-2xl ${
          isDark
            ? 'border-white/15 bg-[#1B1815] text-[#F3F0E8]'
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
              SYNTAXWEAR DISPATCH
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight">
              Track order & receipts
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close order tracker"
            className={`text-lg ${
              isDark ? 'text-[#F3F0E8]/60 hover:text-[#F3F0E8]' : 'text-[#2A1D15]/60 hover:text-[#2A1D15]'
            }`}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleLookup} className="mt-5 flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Order ID (e.g. SW-404100) or email"
            className={`flex-1 border px-3.5 py-2.5 font-mono text-xs outline-none ${
              isDark
                ? 'border-white/18 bg-[#12100E] text-[#F3F0E8] placeholder:text-white/35 focus:border-[#FFCC70]'
                : 'border-[#2A1D15]/18 bg-white text-[#181614] placeholder:text-[#2A1D15]/40 focus:border-[#3E2417]'
            }`}
          />
          <button
            type="submit"
            className={`px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] ${
              isDark
                ? 'bg-[#FFCC70] text-[#181614] hover:bg-[#f0bd5e]'
                : 'bg-[#3E2417] text-[#F6F2EA] hover:bg-[#2C1910]'
            }`}
          >
            Lookup
          </button>
        </form>

        {lookupError && (
          <p className={`mt-2 font-mono text-[11px] ${isDark ? 'text-[#f87171]' : 'text-[#b9382c]'}`}>
            {lookupError}
          </p>
        )}

        {orders.length > 1 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span
              className={`font-mono text-[9px] uppercase tracking-[0.14em] ${
                isDark ? 'text-[#F3F0E8]/55' : 'text-[#2A1D15]/55'
              }`}
            >
              Recent:
            </span>
            {orders.slice(0, 4).map((ord) => (
              <button
                key={ord.orderNumber}
                type="button"
                onClick={() => {
                  soundEngine.playClick(1.0);
                  setSelectedOrder(ord);
                  setLookupError('');
                }}
                className={`border px-2.5 py-1 font-mono text-[10px] ${
                  selectedOrder?.orderNumber === ord.orderNumber
                    ? isDark
                      ? 'border-[#FFCC70] bg-[#FFCC70] text-[#181614]'
                      : 'border-[#3E2417] bg-[#3E2417] text-[#F6F2EA]'
                    : isDark
                    ? 'border-white/15 bg-[#12100E] text-[#F3F0E8]'
                    : 'border-[#2A1D15]/15 bg-white text-[#2A1D15]'
                }`}
              >
                {ord.orderNumber}
              </button>
            ))}
          </div>
        )}

        {selectedOrder ? (
          <div
            className={`mt-6 border p-5 space-y-5 ${
              isDark ? 'border-white/12 bg-[#12100E]' : 'border-[#2A1D15]/12 bg-white'
            }`}
          >
            <div
              className={`flex flex-wrap items-center justify-between gap-2 border-b pb-3 ${
                isDark ? 'border-white/10' : 'border-[#2A1D15]/10'
              }`}
            >
              <div>
                <div
                  className={`font-mono text-xs font-bold ${
                    isDark ? 'text-[#F3F0E8]' : 'text-[#181614]'
                  }`}
                >
                  {selectedOrder.orderNumber}
                </div>
                <div
                  className={`font-mono text-[10px] ${
                    isDark ? 'text-[#F3F0E8]/55' : 'text-[#2A1D15]/55'
                  }`}
                >
                  {selectedOrder.dateLabel} · {selectedOrder.deliveryLabel}
                </div>
              </div>
              <span
                className={`border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] ${
                  isDark
                    ? 'border-[#8da48b]/40 bg-[#4F5D4E]/25 text-[#c7d7c5]'
                    : 'border-[#4F5D4E]/30 bg-[#4F5D4E]/10 text-[#4F5D4E]'
                }`}
              >
                Preparing Dispatch
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center font-mono text-[9px] uppercase tracking-[0.1em]">
              <div
                className={`border-t-2 pt-2 font-semibold ${
                  isDark ? 'border-[#8da48b] text-[#F3F0E8]' : 'border-[#4F5D4E] text-[#181614]'
                }`}
              >
                01. Confirmed
              </div>
              <div className="border-t-2 border-[#C8822E] pt-2 text-[#C8822E] font-semibold">
                02. Batch QC
              </div>
              <div
                className={`border-t-2 pt-2 ${
                  isDark ? 'border-white/15 text-[#F3F0E8]/45' : 'border-[#2A1D15]/15 text-[#2A1D15]/45'
                }`}
              >
                03. Shipped
              </div>
            </div>

            {selectedOrder.shippingAddress && (
              <p className={`text-xs ${isDark ? 'text-[#F3F0E8]/75' : 'text-[#2A1D15]/75'}`}>
                <strong
                  className={`font-mono text-[10px] uppercase tracking-wider ${
                    isDark ? 'text-[#F3F0E8]/55' : 'text-[#2A1D15]/55'
                  }`}
                >
                  Destination:{' '}
                </strong>
                {selectedOrder.shippingAddress}
              </p>
            )}

            <div
              className={`space-y-1.5 border-t border-b py-3 font-mono text-xs ${
                isDark ? 'border-white/10' : 'border-[#2A1D15]/10'
              }`}
            >
              {selectedOrder.items.map((item, i) => (
                <div key={i} className="flex justify-between gap-2">
                  <span className="truncate">
                    {item.name} {item.meta ? `(${item.meta})` : ''} ×{item.quantity}
                  </span>
                  <span>${item.lineTotal.toFixed(2)}</span>
                </div>
              ))}
              <div
                className={`flex justify-between pt-2 font-bold ${
                  isDark ? 'text-[#F3F0E8]' : 'text-[#181614]'
                }`}
              >
                <span>Total Paid</span>
                <span>${selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick(1.05);
                  downloadReceiptPng(selectedOrder);
                }}
                className={`px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] ${
                  isDark
                    ? 'bg-[#FFCC70] text-[#181614] hover:bg-[#f0bd5e]'
                    : 'bg-[#3E2417] text-[#F6F2EA] hover:bg-[#2C1910]'
                }`}
              >
                Download PNG receipt ↓
              </button>
              <span
                className={`font-mono text-[10px] ${
                  isDark ? 'text-[#F3F0E8]/50' : 'text-[#2A1D15]/50'
                }`}
              >
                {selectedOrder.email}
              </span>
            </div>
          </div>
        ) : (
          <div
            className={`mt-6 border p-6 text-center ${
              isDark ? 'border-white/12 bg-[#12100E]' : 'border-[#2A1D15]/12 bg-white/60'
            }`}
          >
            <p
              className={`font-mono text-xs ${
                isDark ? 'text-[#F3F0E8]/65' : 'text-[#2A1D15]/65'
              }`}
            >
              No completed orders saved on this browser yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
