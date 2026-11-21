import React, { useEffect, useMemo, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import {
  INITIAL_SELLER_FAQS,
  loadSellerOrders,
  loadSellerProducts,
  loadSellerProfile,
  saveSellerOrders,
  saveSellerProducts,
  saveSellerProfile,
  SellerFaq,
  SellerOrder,
  SellerProduct,
  SellerShopProfile,
} from '../data/seller';
import { soundEngine } from '../utils/soundEngine';

type View = 'overview' | 'products' | 'orders' | 'analytics' | 'store' | 'settings';
type SettingsSection = 'profile' | 'shipping' | 'payouts' | 'notifications' | 'support';
type IconName =
  | 'arrow'
  | 'bell'
  | 'box'
  | 'chart'
  | 'chevron'
  | 'close'
  | 'eye'
  | 'grid'
  | 'menu'
  | 'orders'
  | 'plus'
  | 'search'
  | 'settings'
  | 'store'
  | 'trash'
  | 'upload';

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const path: Record<IconName, React.ReactNode> = {
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
        <path d="M10 19h4" />
      </>
    ),
    box: (
      <>
        <path d="m4 7 8-4 8 4-8 4-8-4Z" />
        <path d="m4 7 8 4 8-4v10l-8 4-8-4V7Z" />
        <path d="M12 11v10" />
      </>
    ),
    chart: <path d="M4 20V10m6 10V4m6 16v-7m5 7H2" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    eye: (
      <>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    orders: (
      <>
        <path d="M6 3h12v18H6z" />
        <path d="M9 8h6M9 12h6M9 16h4" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
      </>
    ),
    store: (
      <>
        <path d="M4 10v10h16V10" />
        <path d="m3 10 2-6h14l2 6c-1 2-4 2-5 0-1 2-4 2-5 0-1 2-4 2-5 0-1 2-3 2-3 0Z" />
      </>
    ),
    trash: (
      <>
        <path d="M4 7h16M9 7V4h6v3m3 0-1 14H7L6 7" />
        <path d="M10 11v6m4-6v6" />
      </>
    ),
    upload: (
      <>
        <path d="M12 16V4m-5 5 5-5 5 5" />
        <path d="M4 15v5h16v-5" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {path[name]}
    </svg>
  );
}

const NAV_ITEMS: { id: View; label: string; icon: IconName }[] = [
  { id: 'overview', label: 'Overview', icon: 'grid' },
  { id: 'products', label: 'Products', icon: 'box' },
  { id: 'orders', label: 'Orders', icon: 'orders' },
  { id: 'analytics', label: 'Analytics', icon: 'chart' },
  { id: 'store', label: 'Storefront', icon: 'store' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

function StatusPill({ children, isDark }: { children: string; isDark?: boolean }) {
  const color =
    children === 'Live' || children === 'Delivered' || children === 'Shipped'
      ? isDark
        ? 'bg-[#2C3A2B] text-[#C5DEC1]'
        : 'bg-[#DFE9DC] text-[#40543F]'
      : children === 'Low stock' || children === 'Ready to ship'
      ? isDark
        ? 'bg-[#6F4B1A]/60 text-[#FFCC70]'
        : 'bg-[#F5E5C9] text-[#875516]'
      : isDark
      ? 'bg-white/10 text-[#F3F0E8]/70'
      : 'bg-black/[0.06] text-black/60';

  return (
    <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold ${color}`}>
      {children}
    </span>
  );
}

function ProductDetailPanel({
  product,
  orders,
  isDark,
  onBack,
  onEdit,
  onDelete,
  onPreview,
}: {
  product: SellerProduct;
  orders: SellerOrder[];
  isDark: boolean;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPreview: () => void;
}) {
  const activity = [28, 42, 34, 55, 48, 68, 61, 82, 72, 92, 78, 88];
  const productOrders = orders.filter((order) => order.item === product.name);
  const surfaceClass = isDark
    ? 'rounded-2xl border border-white/10 bg-[#1B1815]'
    : 'rounded-2xl border border-black/[0.08] bg-white/65';
  const mutedText = isDark ? 'text-[#F3F0E8]/50' : 'text-black/45';

  return (
    <section>
      <button
        type="button"
        onClick={onBack}
        className={`flex items-center gap-2 text-xs font-medium transition ${
          isDark ? 'text-[#F3F0E8]/60 hover:text-white' : 'text-black/45 hover:text-black'
        }`}
      >
        <span>←</span> Back to products
      </button>

      <div className="mt-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#DDD7CA]">
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <StatusPill isDark={isDark}>{product.status}</StatusPill>
              <span className={`font-mono text-[9px] ${mutedText}`}>{product.id}</span>
            </div>
            <h2 className="text-3xl font-semibold tracking-[-0.045em]">{product.name}</h2>
            <p className={`mt-1 text-xs ${mutedText}`}>
              {product.category} · ${product.price}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onDelete}
            className="flex h-10 items-center gap-2 rounded-full border border-[#A94B3F]/25 px-4 text-xs font-medium text-[#D0695C] transition hover:bg-[#A94B3F]/10"
          >
            <Icon name="trash" size={15} /> Delete
          </button>
          <button
            type="button"
            onClick={onEdit}
            className={`h-10 rounded-full border px-5 text-xs font-medium transition ${
              isDark
                ? 'border-white/15 hover:bg-white/10'
                : 'border-black/10 hover:bg-white'
            }`}
          >
            Edit product
          </button>
          <button
            type="button"
            onClick={onPreview}
            className={`flex h-10 items-center gap-2 rounded-full px-5 text-xs font-medium transition ${
              isDark ? 'bg-[#FFCC70] text-[#181614]' : 'bg-[#4A3026] text-white'
            }`}
          >
            <Icon name="eye" size={15} /> View listing
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ['Revenue', `$${product.revenue.toLocaleString()}`, '+14.8%', 'vs. last 30 days'],
          ['Units sold', String(product.sales), '+4', 'vs. last 30 days'],
          ['Product views', product.views.toLocaleString(), '+9.2%', 'vs. last 30 days'],
          ['Conversion', `${product.conversion}%`, '+0.4%', 'vs. last 30 days'],
        ].map(([label, value, change, context]) => (
          <article key={label} className={`${surfaceClass} p-5`}>
            <p className={`text-xs ${mutedText}`}>{label}</p>
            <strong className="mt-5 block text-3xl tracking-[-0.05em] tabular-nums">{value}</strong>
            <p className="mt-2 text-[10px]">
              <span className="font-semibold text-[#637363]">{change}</span>{' '}
              <span className={mutedText}>{context}</span>
            </p>
          </article>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <article className={`${surfaceClass} p-6`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold tracking-[-0.02em]">Product performance</h3>
              <p className={`mt-1 text-xs ${mutedText}`}>Views and sales momentum · last 30 days</p>
            </div>
            <select
              className={`rounded-full border bg-transparent px-3 py-2 text-[10px] outline-none ${
                isDark ? 'border-white/15 text-[#F3F0E8]' : 'border-black/10 text-[#1E231E]'
              }`}
            >
              <option className={isDark ? 'bg-[#1B1815]' : ''}>Last 30 days</option>
              <option className={isDark ? 'bg-[#1B1815]' : ''}>Last 7 days</option>
            </select>
          </div>
          <div
            className={`mt-8 grid h-52 grid-cols-12 items-end gap-2 border-b ${
              isDark ? 'border-white/10' : 'border-black/10'
            }`}
          >
            {activity.map((height, index) => (
              <div key={index} className="group relative h-full">
                <div
                  className="absolute inset-x-0 bottom-0 rounded-t-sm bg-[#637363]/75 transition group-hover:bg-[#D58B2B]"
                  style={{ height: `${height}%` }}
                />
              </div>
            ))}
          </div>
          <div
            className={`mt-3 flex justify-between font-mono text-[8px] uppercase tracking-wider ${mutedText}`}
          >
            <span>Apr 21</span>
            <span>May 05</span>
            <span>May 20</span>
          </div>
        </article>

        <div className="grid gap-4">
          <article className={`${surfaceClass} p-6`}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">Inventory</h3>
                <p className={`mt-1 text-xs ${mutedText}`}>Available to purchase</p>
              </div>
              <span
                className={`h-2 w-2 rounded-full ${
                  product.stock <= 4 ? 'bg-[#D58B2B]' : 'bg-[#637363]'
                }`}
              />
            </div>
            <strong className="mt-7 block text-4xl tracking-[-0.05em] tabular-nums">
              {product.stock}
            </strong>
            <p className={`mt-1 text-xs ${mutedText}`}>units in stock</p>
            <div
              className={`mt-5 h-1.5 overflow-hidden rounded-full ${
                isDark ? 'bg-white/10' : 'bg-black/5'
              }`}
            >
              <div
                className={`h-full rounded-full ${
                  product.stock <= 4 ? 'bg-[#D58B2B]' : 'bg-[#637363]'
                }`}
                style={{ width: `${Math.min(100, Math.max(4, product.stock * 5))}%` }}
              />
            </div>
            <button
              type="button"
              onClick={onEdit}
              className={`mt-5 text-xs font-medium hover:underline ${
                isDark ? 'text-[#A9B9A5]' : 'text-[#637363]'
              }`}
            >
              Update inventory
            </button>
          </article>

          <article className="rounded-2xl bg-[#3C493D] p-6 text-white">
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/45">
              Listing health
            </p>
            <strong className="mt-4 block text-2xl tracking-[-0.04em]">Strong</strong>
            <p className="mt-2 text-xs leading-5 text-white/60">
              Complete details and clear studio photography are helping this object convert.
            </p>
            <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[86%] bg-[#D58B2B]" />
            </div>
          </article>
        </div>
      </div>

      <article className={`${surfaceClass} mt-4 overflow-hidden`}>
        <div
          className={`flex items-center justify-between border-b p-5 ${
            isDark ? 'border-white/10' : 'border-black/[0.08]'
          }`}
        >
          <div>
            <h3 className="font-semibold">Recent orders</h3>
            <p className={`mt-1 text-xs ${mutedText}`}>Orders containing this product</p>
          </div>
          <span className={`text-xs ${mutedText}`}>{productOrders.length || 'No'} recent</span>
        </div>
        {productOrders.length ? (
          productOrders.map((order) => (
            <div
              key={order.id}
              className={`grid gap-3 border-b p-4 last:border-0 sm:grid-cols-[90px_1fr_130px_90px] sm:items-center ${
                isDark ? 'border-white/8' : 'border-black/[0.06]'
              }`}
            >
              <b className="text-xs">{order.id}</b>
              <span>
                <b className="block text-xs font-medium">{order.customer}</b>
                <small className={`text-[10px] ${mutedText}`}>{order.date}</small>
              </span>
              <StatusPill isDark={isDark}>{order.status}</StatusPill>
              <strong className="text-xs tabular-nums">${order.total}</strong>
            </div>
          ))
        ) : (
          <div className={`p-8 text-center text-xs ${mutedText}`}>
            Orders for this product will appear here.
          </div>
        )}
      </article>
    </section>
  );
}

function ShopPreviewContent({
  profile,
  products,
  compact,
  isDark,
}: {
  profile: SellerShopProfile;
  products: SellerProduct[];
  compact: boolean;
  isDark: boolean;
}) {
  const liveProducts = products.filter((product) => product.status !== 'Draft').slice(0, 3);
  const initials =
    profile.name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'NC';

  const atmosphereAccent =
    profile.atmosphere === 'Walnut'
      ? '#4A3026'
      : profile.atmosphere === 'Amber'
      ? '#B46C18'
      : '#637363';

  return (
    <div
      className={`mx-auto min-h-full overflow-hidden shadow-2xl ${
        isDark ? 'bg-[#161311] text-[#F3F0E8]' : 'bg-[#F3F0E8] text-[#1E231E]'
      } ${
        compact ? 'max-w-[390px] rounded-[30px] border-[8px] border-[#281C17]' : 'w-full'
      }`}
    >
      <div className="bg-[#4A3026] px-5 py-2 text-center font-mono text-[8px] uppercase tracking-[0.15em] text-white/80">
        {profile.announcement || 'Small-batch objects · Made with intention'}
      </div>
      <header
        className={`flex h-16 items-center justify-between border-b px-5 sm:px-8 ${
          isDark ? 'border-white/10' : 'border-black/10'
        }`}
      >
        <span className="flex items-center gap-2.5">
          {profile.logoUrl ? (
            <img
              src={profile.logoUrl}
              alt={profile.name}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <b
              className="grid h-8 w-8 place-items-center rounded-full text-[10px] text-white"
              style={{ backgroundColor: atmosphereAccent }}
            >
              {initials}
            </b>
          )}
          <strong className="text-sm tracking-[-0.03em]">{profile.name}</strong>
        </span>
        <nav
          className={`${compact ? 'hidden' : 'flex'} items-center gap-6 font-mono text-[8px] uppercase tracking-wider ${
            isDark ? 'text-[#F3F0E8]/55' : 'text-black/50'
          }`}
        >
          <span>Objects</span>
          <span>Studio</span>
          <span>Policies</span>
        </nav>
        <span
          className={`rounded-full border px-3 py-2 text-[9px] font-medium ${
            isDark ? 'border-white/15' : 'border-black/10'
          }`}
        >
          Follow
        </span>
      </header>

      <section
        className={`grid overflow-hidden ${
          isDark ? 'bg-[#222B22]' : 'bg-[#DFE5DB]'
        } ${compact ? 'grid-cols-1' : 'min-h-[430px] md:grid-cols-[0.82fr_1.18fr]'}`}
      >
        <div
          className={`flex flex-col justify-center p-7 ${
            compact ? 'min-h-72' : 'p-[clamp(32px,6vw,90px)]'
          }`}
        >
          <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-[#D58B2B]">
            {profile.practiceType} · {profile.location}
          </p>
          <h1
            className={`mt-5 leading-[0.96] font-medium tracking-[-0.06em] ${
              compact ? 'text-5xl' : 'text-[clamp(48px,7vw,92px)]'
            }`}
          >
            Objects for
            <br /> a{' '}
            <em className="font-serif italic font-normal" style={{ color: atmosphereAccent }}>
              quiet
            </em>{' '}
            life.
          </h1>
          <p
            className={`mt-6 max-w-md text-sm leading-6 ${
              isDark ? 'text-[#F3F0E8]/65' : 'text-black/55'
            }`}
          >
            {profile.tagline}
          </p>
          <span className="mt-7 w-fit rounded-full bg-[#4A3026] px-5 py-3 text-[10px] font-medium text-white">
            Explore the collection →
          </span>
        </div>
        <div className={`relative ${compact ? 'h-72' : 'min-h-[430px]'}`}>
          <img
            src={profile.bannerUrl || products[0]?.image || '/images/products/desk-kbd-sage.jpg'}
            alt={`${profile.name} featured object`}
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      <section className={`${compact ? 'p-6' : 'px-[clamp(24px,6vw,88px)] py-16'}`}>
        <div className={`${compact ? '' : 'flex items-end justify-between'}`}>
          <div>
            <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-[#D58B2B]">
              The collection
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
              Made to be <em className="font-serif italic font-normal text-[#637363]">kept.</em>
            </h2>
          </div>
          {!compact && (
            <p
              className={`max-w-xs text-xs leading-5 ${
                isDark ? 'text-[#F3F0E8]/55' : 'text-black/45'
              }`}
            >
              {profile.story}
            </p>
          )}
        </div>
        <div className={`mt-8 grid gap-4 ${compact ? 'grid-cols-1' : 'sm:grid-cols-3'}`}>
          {liveProducts.map((product) => (
            <article key={product.id}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#EBE7DC]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-3 flex items-start justify-between gap-3">
                <span>
                  <b className="block text-xs font-medium">{product.name}</b>
                  <small
                    className={`text-[9px] ${
                      isDark ? 'text-[#F3F0E8]/45' : 'text-black/40'
                    }`}
                  >
                    {product.category}
                  </small>
                </span>
                <strong className="text-xs text-[#D58B2B] tabular-nums">${product.price}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className={`bg-[#3C493D] text-white ${
          compact ? 'p-7' : 'grid grid-cols-2 gap-16 px-[clamp(24px,7vw,100px)] py-16'
        }`}
      >
        <div>
          <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-[#FFCC70]">
            The studio
          </p>
          <h2 className="mt-4 text-3xl tracking-[-0.05em]">
            About <em className="font-serif italic font-normal text-[#FFCC70]">{profile.name}</em>
          </h2>
        </div>
        <p className={`${compact ? 'mt-5' : ''} text-xs leading-6 text-white/65`}>
          {profile.story}
        </p>
      </section>

      <footer className="flex flex-col justify-between gap-4 bg-[#281C17] px-6 py-8 text-[10px] text-white/50 sm:flex-row">
        <span>© 2026 {profile.name} · Powered by SyntaxWear</span>
        <span>
          {profile.email} · {profile.instagram}
        </span>
      </footer>
    </div>
  );
}

const SETTINGS_COPY: Record<SettingsSection, { title: string; description: string }> = {
  profile: {
    title: 'Profile & access',
    description: 'Manage your seller identity and who can work in this shop.',
  },
  shipping: {
    title: 'Shipping & delivery',
    description: 'Set fulfilment defaults, shipping origin, and delivery regions.',
  },
  payouts: {
    title: 'Payouts & taxes',
    description: 'Review payout timing, bank details, and marketplace statements.',
  },
  notifications: {
    title: 'Notifications',
    description: 'Choose which shop events should reach you.',
  },
  support: {
    title: 'Seller support',
    description: 'Find answers and contact the marketplace team.',
  },
};

function SettingsDetailPanel({
  section,
  shopLocation,
  shopEmail,
  isDark,
  onBack,
  onSave,
}: {
  section: SettingsSection;
  shopLocation: string;
  shopEmail: string;
  isDark: boolean;
  onBack: () => void;
  onSave: (message: string) => void;
}) {
  const copy = SETTINGS_COPY[section];
  const fieldClass = `h-12 rounded-xl border px-4 text-sm normal-case tracking-normal outline-none transition ${
    isDark
      ? 'border-white/15 bg-[#12100E] text-[#F3F0E8] focus:border-[#859A81]'
      : 'border-black/10 bg-white/75 text-[#1E231E] focus:border-[#637363]'
  }`;
  const labelClass = `grid gap-2 text-[10px] font-semibold uppercase tracking-wider ${
    isDark ? 'text-[#F3F0E8]/55' : 'text-black/45'
  }`;
  const surfaceClass = isDark
    ? 'border-white/10 bg-[#1B1815]'
    : 'border-black/[0.08] bg-white/65';
  const mutedText = isDark ? 'text-[#F3F0E8]/55' : 'text-black/45';

  return (
    <section>
      <button
        type="button"
        onClick={onBack}
        className={`flex items-center gap-2 text-xs font-medium transition ${
          isDark ? 'text-[#F3F0E8]/60 hover:text-white' : 'text-black/45 hover:text-black'
        }`}
      >
        ← All settings
      </button>
      <div className="mt-6">
        <h2 className="text-3xl font-semibold tracking-[-0.045em]">{copy.title}</h2>
        <p className={`mt-2 text-sm ${mutedText}`}>{copy.description}</p>
      </div>

      <div className={`mt-7 max-w-3xl rounded-2xl border p-5 sm:p-7 ${surfaceClass}`}>
        {section === 'profile' && (
          <div className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                Full name
                <input defaultValue="Avery Morgan" className={fieldClass} />
              </label>
              <label className={labelClass}>
                Account email
                <input type="email" defaultValue={shopEmail} className={fieldClass} />
              </label>
            </div>
            <div
              className={`rounded-xl border p-4 ${
                isDark ? 'border-white/10 bg-[#12100E]' : 'border-black/[0.08] bg-white/55'
              }`}
            >
              <p className="text-xs font-semibold">Shop collaborators</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <b className="grid h-9 w-9 place-items-center rounded-full bg-[#D8C7A8] text-[10px] text-[#281C17]">
                    AM
                  </b>
                  <span>
                    <b className="block text-xs">Avery Morgan</b>
                    <small className={`text-[10px] ${mutedText}`}>Owner · Full access</small>
                  </span>
                </span>
                <a
                  href={`mailto:?subject=Invitation to manage your SyntaxWear Studio`}
                  className={`rounded-full border px-4 py-2 text-[10px] ${
                    isDark ? 'border-white/15 hover:bg-white/10' : 'border-black/10 hover:bg-white'
                  }`}
                >
                  Invite
                </a>
              </div>
            </div>
          </div>
        )}

        {section === 'shipping' && (
          <div className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                Shipping origin
                <input defaultValue={shopLocation} className={fieldClass} />
              </label>
              <label className={labelClass}>
                Default dispatch time
                <select defaultValue="2–3 business days" className={fieldClass}>
                  <option className={isDark ? 'bg-[#12100E]' : ''}>1 business day</option>
                  <option className={isDark ? 'bg-[#12100E]' : ''}>2–3 business days</option>
                  <option className={isDark ? 'bg-[#12100E]' : ''}>3–5 business days</option>
                </select>
              </label>
            </div>
            <div>
              <p
                className={`text-[10px] font-semibold uppercase tracking-wider ${mutedText}`}
              >
                Delivery regions
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-4">
                {['Nigeria', 'United States', 'Canada', 'United Kingdom'].map((region) => (
                  <label
                    key={region}
                    className={`flex items-center gap-3 rounded-xl border p-4 text-xs ${
                      isDark
                        ? 'border-white/10 bg-[#12100E]'
                        : 'border-black/[0.08] bg-white/55'
                    }`}
                  >
                    <input type="checkbox" defaultChecked className="accent-[#637363]" />
                    {region}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {section === 'payouts' && (
          <div className="space-y-5">
            <div className="rounded-2xl bg-[#3C493D] p-6 text-white">
              <p className="font-mono text-[9px] uppercase tracking-wider text-white/45">
                Connected payout account
              </p>
              <div className="mt-5 flex items-end justify-between">
                <span>
                  <b className="block text-lg">Studio settlement account</b>
                  <small className="text-white/55">Ending in 2848 · Verified</small>
                </span>
                <span className="rounded-full bg-white/15 px-3 py-1 text-[9px]">Active</span>
              </div>
            </div>
            <label className={labelClass}>
              Payout schedule
              <select defaultValue="Every Friday" className={fieldClass}>
                <option className={isDark ? 'bg-[#12100E]' : ''}>Every Friday</option>
                <option className={isDark ? 'bg-[#12100E]' : ''}>Twice monthly</option>
                <option className={isDark ? 'bg-[#12100E]' : ''}>Monthly</option>
              </select>
            </label>
            <a
              href="data:text/plain;charset=utf-8,SyntaxWear%20Studio%20Marketplace%20Statement"
              download="syntaxwear-studio-statement.txt"
              className={`flex w-full items-center justify-between rounded-xl border p-4 text-left text-xs transition ${
                isDark ? 'border-white/10 hover:bg-white/5' : 'border-black/[0.08] hover:bg-white'
              }`}
            >
              Monthly marketplace statement <span>Download ↓</span>
            </a>
          </div>
        )}

        {section === 'notifications' && (
          <div className="space-y-2">
            {[
              ['New orders', 'Immediately when a customer places an order'],
              ['Low inventory', 'When a product reaches five units'],
              ['Payout updates', 'When a payout is sent or needs attention'],
              ['Customer messages', 'When a shopper contacts your studio'],
              ['Weekly summary', 'A concise Monday performance report'],
            ].map(([title, description]) => (
              <label
                key={title}
                className={`flex cursor-pointer items-center justify-between gap-5 rounded-xl border p-4 ${
                  isDark
                    ? 'border-white/10 bg-[#12100E]'
                    : 'border-black/[0.06] bg-white/45'
                }`}
              >
                <span>
                  <b className="block text-xs">{title}</b>
                  <small className={`mt-1 block text-[10px] ${mutedText}`}>{description}</small>
                </span>
                <input type="checkbox" defaultChecked className="accent-[#637363]" />
              </label>
            ))}
          </div>
        )}

        {section === 'support' && (
          <div>
            <label
              className={`flex h-12 items-center gap-3 rounded-xl border px-4 ${
                isDark
                  ? 'border-white/15 bg-[#12100E]'
                  : 'border-black/10 bg-white/75'
              }`}
            >
              <Icon name="search" size={15} />
              <input
                placeholder="Search seller guides"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              />
            </label>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                [
                  'Preparing your first listing',
                  'Use clear titles, complete dimensions, honest lead times, and at least four useful photographs.',
                ],
                [
                  'Packaging fragile objects',
                  'Double-box delicate work, protect corners, and include care instructions inside the parcel.',
                ],
                [
                  'Understanding payouts',
                  'Eligible order funds are grouped into your selected payout schedule after fulfilment.',
                ],
                [
                  'Handling returns thoughtfully',
                  'Respond quickly, confirm condition, and keep the customer informed at each step.',
                ],
              ].map(([guide, answer]) => (
                <details
                  key={guide}
                  className={`rounded-xl border p-4 text-xs ${
                    isDark
                      ? 'border-white/10 open:bg-[#12100E]'
                      : 'border-black/[0.08] open:bg-white'
                  }`}
                >
                  <summary className="cursor-pointer font-medium">{guide}</summary>
                  <p className={`mt-3 text-[10px] leading-5 ${mutedText}`}>{answer}</p>
                </details>
              ))}
            </div>
            <a
              href="mailto:sellers@syntaxwear.store"
              className={`mt-5 flex items-center justify-between rounded-xl p-4 text-xs ${
                isDark ? 'bg-[#2C3A2B] text-[#F3F0E8]' : 'bg-[#DFE5DB]/65 text-[#1E231E]'
              }`}
            >
              Contact seller support <span>sellers@syntaxwear.store →</span>
            </a>
          </div>
        )}

        {section !== 'support' && (
          <div
            className={`mt-7 flex justify-end border-t pt-5 ${
              isDark ? 'border-white/10' : 'border-black/[0.08]'
            }`}
          >
            <button
              type="button"
              onClick={() => onSave(`${copy.title} saved`)}
              className={`rounded-full px-5 py-3 text-xs font-medium ${
                isDark ? 'bg-[#FFCC70] text-[#181614]' : 'bg-[#4A3026] text-white'
              }`}
            >
              Save changes
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

interface SellerDashboardProps {
  isDark?: boolean;
  onToggleDark?: () => void;
  onReturnToStore: () => void;
  onOpenOnboarding: () => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({
  isDark = false,
  onToggleDark,
  onReturnToStore,
  onOpenOnboarding,
}) => {
  const [view, setView] = useState<View>('overview');
  const [mobileNav, setMobileNav] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [orders, setOrders] = useState<SellerOrder[]>(() => loadSellerOrders());
  const [selectedOrder, setSelectedOrder] = useState<SellerOrder | null>(null);
  const [messageComposer, setMessageComposer] = useState(false);
  const [settingsSection, setSettingsSection] = useState<SettingsSection | null>(null);
  const [faqs, setFaqs] = useState<SellerFaq[]>(INITIAL_SELLER_FAQS);
  const [faqEditor, setFaqEditor] = useState(false);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [editor, setEditor] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SellerProduct | null>(null);
  const [products, setProducts] = useState<SellerProduct[]>(() => loadSellerProducts());
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<SellerProduct | null>(null);
  const [storeTab, setStoreTab] = useState<'identity' | 'design' | 'policies'>('identity');
  const [storePreview, setStorePreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [shopProfile, setShopProfile] = useState<SellerShopProfile>(() => loadSellerProfile());
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [toast, setToast] = useState('');

  useEffect(() => {
    saveSellerProfile(shopProfile);
  }, [shopProfile]);

  useEffect(() => {
    saveSellerProducts(products);
  }, [products]);

  useEffect(() => {
    saveSellerOrders(orders);
  }, [orders]);

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          (filter === 'All' || product.status === filter) &&
          product.name.toLowerCase().includes(search.toLowerCase())
      ),
    [filter, products, search]
  );

  const selectedProduct = products.find((product) => product.id === selectedProductId) ?? null;

  const shopInitials = useMemo(
    () =>
      shopProfile.name
        .trim()
        .split(/\s+/)
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'NC',
    [shopProfile.name]
  );

  const liveCount = products.filter((p) => p.status !== 'Draft').length;
  const totalRevenue = products.reduce((sum, item) => sum + item.revenue, 0);
  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'Ready to ship' || o.status === 'Processing'
  ).length;

  const updateShop = <K extends keyof SellerShopProfile>(
    field: K,
    value: SellerShopProfile[K]
  ) => {
    setShopProfile((current) => ({ ...current, [field]: value }));
  };

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2400);
  };

  const selectView = (next: View) => {
    soundEngine.playClick(1.0);
    setView(next);
    if (next !== 'products') setSelectedProductId(null);
    if (next !== 'settings') setSettingsSection(null);
    setMobileNav(false);
  };

  const openEditor = (product: SellerProduct | null = null) => {
    soundEngine.playClick(1.05);
    setEditingProduct(product);
    setEditor(true);
  };

  const closeEditor = () => {
    setEditor(false);
    setEditingProduct(null);
  };

  const saveProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const shouldPublish = submitter?.value === 'publish';
    const name = String(data.get('name') || 'Untitled object');
    const description = String(data.get('description') || '');
    const price = Number(data.get('price')) || 0;
    const category = String(data.get('category') || 'Objects');
    const stock = Number(data.get('stock')) || 0;

    if (editingProduct) {
      setProducts((current) =>
        current.map((product) =>
          product.id === editingProduct.id
            ? {
                ...product,
                name,
                description,
                category,
                price,
                stock,
                status: shouldPublish ? (stock <= 4 && stock > 0 ? 'Low stock' : 'Live') : product.status,
              }
            : product
        )
      );
      showToast(shouldPublish ? 'Listing updated' : 'Product changes saved');
    } else {
      setProducts((current) => [
        {
          id: `NC-${String(current.length + 1).padStart(3, '0')}`,
          name,
          description,
          category,
          price,
          stock,
          status: shouldPublish ? (stock <= 4 && stock > 0 ? 'Low stock' : 'Live') : 'Draft',
          image: '/images/products/cap-sage.jpg',
          sales: 0,
          revenue: 0,
          views: 0,
          conversion: 0,
        },
        ...current,
      ]);
      showToast(shouldPublish ? 'Product published' : 'Draft product added');
    }
    closeEditor();
    setView('products');
  };

  const deleteProduct = () => {
    if (!pendingDelete) return;
    setProducts((current) => current.filter((product) => product.id !== pendingDelete.id));
    if (selectedProductId === pendingDelete.id) setSelectedProductId(null);
    showToast(`${pendingDelete.name} deleted`);
    setPendingDelete(null);
  };

  const exportOrders = () => {
    const rows = [
      ['Order', 'Customer', 'Product', 'Total', 'Status', 'Date'],
      ...orders.map((order) => [
        order.id,
        order.customer,
        order.item,
        String(order.total),
        order.status,
        order.date,
      ]),
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'syntaxwear-studio-orders.csv';
    link.click();
    URL.revokeObjectURL(url);
    showToast('Order CSV downloaded');
  };

  const copyShopLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `https://syntaxwear.store/shop/${shopProfile.handle || 'north-common'}`
      );
      showToast('Shop link copied');
    } catch {
      showToast('Copy unavailable — select the URL above');
    }
  };

  const openNotification = (index: number) => {
    setUnreadNotifications((count) => Math.max(0, count - 1));
    setNotifications(false);
    if (index === 0) {
      setView('orders');
      setSelectedOrder(orders[0] ?? null);
    } else if (index === 1) {
      setView('products');
      setSelectedProductId(products[1]?.id ?? products[0]?.id ?? null);
    } else {
      setView('analytics');
    }
  };

  const surfaceClass = isDark
    ? 'border-white/10 bg-[#1B1815]'
    : 'border-black/[0.08] bg-white/65';
  const inputSurfaceClass = isDark
    ? 'border-white/15 bg-[#12100E] text-[#F3F0E8] placeholder:text-white/35 focus:border-[#859A81]'
    : 'border-black/10 bg-white/75 text-[#1E231E] placeholder:text-black/35 focus:border-[#637363]';
  const mutedText = isDark ? 'text-[#F3F0E8]/55' : 'text-black/45';
  const dividerClass = isDark ? 'border-white/10' : 'border-black/[0.08]';

  return (
    <div
      data-lenis-prevent
      className={`fixed inset-0 z-[70] overflow-y-auto transition-colors duration-300 ${
        isDark ? 'bg-[#12100E] text-[#F3F0E8]' : 'bg-[#F2F1EB] text-[#20251F]'
      }`}
    >
      {/* Left Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col bg-[#281C17] text-white transition-transform duration-300 lg:translate-x-0 ${
          mobileNav ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-[76px] items-center justify-between border-b border-white/10 px-6">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick(0.95);
              onReturnToStore();
            }}
            className="flex items-center gap-2.5 text-sm font-semibold tracking-[-0.03em] hover:text-[#FFCC70] transition-colors"
          >
            <img
              src="/images/thissoftware-emblem-transparent.png"
              alt="SyntaxWear"
              className="h-6 w-6 object-contain"
            />
            <span>SyntaxWear</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileNav(false)}
            className="lg:hidden"
            aria-label="Close menu"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="border-b border-white/10 px-5 py-5">
          <button
            type="button"
            onClick={() => setStorePreview(true)}
            className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-white/5"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#637363] text-xs font-semibold text-white">
              {shopInitials}
            </span>
            <span className="min-w-0 flex-1">
              <b className="block truncate text-sm font-medium">{shopProfile.name}</b>
              <small className="block text-[10px] text-white/50">View storefront</small>
            </span>
            <Icon name="chevron" size={14} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-5">
          {NAV_ITEMS.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => selectView(item.id)}
              className={`flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm transition ${
                view === item.id
                  ? 'bg-white/12 text-white font-medium'
                  : 'text-white/55 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon name={item.icon} size={17} />
              {item.label}
              {item.id === 'orders' && pendingOrdersCount > 0 && (
                <span className="ml-auto rounded-full bg-[#D58B2B] px-2 py-0.5 text-[9px] font-bold text-[#281C17]">
                  {pendingOrdersCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="m-4 rounded-xl bg-white/[0.06] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium">Your shop is live</p>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick(1.0);
                onOpenOnboarding();
              }}
              className="font-mono text-[9px] uppercase tracking-wider text-[#FFCC70] hover:underline"
            >
              Wizard
            </button>
          </div>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[82%] bg-[#D58B2B]" />
          </div>
          <p className="mt-2 text-[10px] leading-4 text-white/45">
            Complete 2 more steps to strengthen your shop.
          </p>
        </div>

        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={() => selectView('settings')}
            className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-white/5"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#D8C7A8] text-xs font-semibold text-[#4A3026]">
              AM
            </span>
            <span className="flex-1 min-w-0">
              <b className="block truncate text-xs font-medium">Avery Morgan</b>
              <small className="text-[10px] text-white/45">Owner</small>
            </span>
            <span className="text-white/45">•••</span>
          </button>
        </div>
      </aside>

      {mobileNav && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileNav(false)}
          className="fixed inset-0 z-40 bg-black/35 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Main Content Area */}
      <div className="min-h-full lg:pl-[248px]">
        <header
          className={`sticky top-0 z-30 flex h-[76px] items-center justify-between border-b px-5 backdrop-blur-xl sm:px-8 ${
            isDark
              ? 'border-white/10 bg-[#12100E]/90'
              : 'border-black/[0.08] bg-[#F2F1EB]/90'
          }`}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNav(true)}
              className={`grid h-9 w-9 place-items-center rounded-full border lg:hidden ${
                isDark ? 'border-white/15' : 'border-black/10'
              }`}
              aria-label="Open menu"
            >
              <Icon name="menu" />
            </button>
            <div>
              <p className={`font-mono text-[9px] uppercase tracking-[0.14em] ${mutedText}`}>
                Seller workspace
              </p>
              <h1 className="text-lg font-semibold capitalize tracking-[-0.03em]">{view}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick(1.0);
                onReturnToStore();
              }}
              className={`hidden h-9 items-center gap-2 rounded-full border px-4 text-xs font-medium transition sm:flex ${
                isDark
                  ? 'border-white/15 hover:bg-white/10'
                  : 'border-black/10 hover:bg-white'
              }`}
            >
              <Icon name="eye" size={15} /> View marketplace
            </button>

            {onToggleDark && (
              <button
                type="button"
                onClick={onToggleDark}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                className={`grid h-9 w-9 place-items-center rounded-full border transition ${
                  isDark
                    ? 'border-white/15 text-[#FFCC70] hover:bg-white/10'
                    : 'border-black/10 text-[#1E231E] hover:bg-white'
                }`}
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            )}

            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifications((open) => !open)}
                className={`relative grid h-9 w-9 place-items-center rounded-full border transition ${
                  isDark
                    ? 'border-white/15 hover:bg-white/10'
                    : 'border-black/10 hover:bg-white'
                }`}
                aria-label="Notifications"
              >
                <Icon name="bell" size={17} />
                {unreadNotifications > 0 && (
                  <span
                    className={`absolute top-1.5 right-1.5 h-2 w-2 rounded-full border-2 bg-[#D58B2B] ${
                      isDark ? 'border-[#12100E]' : 'border-[#F2F1EB]'
                    }`}
                  />
                )}
              </button>

              {notifications && (
                <div
                  className={`absolute top-12 right-0 w-80 rounded-2xl border p-2 shadow-2xl ${
                    isDark
                      ? 'border-white/12 bg-[#1B1815] text-[#F3F0E8]'
                      : 'border-black/10 bg-white text-[#1E231E]'
                  }`}
                >
                  <div className="flex items-center justify-between p-3">
                    <b className="text-sm">Notifications</b>
                    <button
                      type="button"
                      onClick={() => setUnreadNotifications(0)}
                      className={`text-[10px] ${
                        isDark ? 'text-[#A9B9A5]' : 'text-[#637363]'
                      }`}
                    >
                      Mark all read
                    </button>
                  </div>
                  {[
                    ['New order received', 'Monolith 65 Mechanical Deck · 8 min ago'],
                    ['Low stock', 'Only 4 Solāre Studio Headphones remain'],
                    ['Payout sent', '$1,284.60 is on the way'],
                  ].map(([title, copy], index) => (
                    <button
                      type="button"
                      key={title}
                      onClick={() => openNotification(index)}
                      className={`flex w-full gap-3 rounded-xl p-3 text-left ${
                        isDark ? 'hover:bg-white/5' : 'hover:bg-black/[0.03]'
                      }`}
                    >
                      <span
                        className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                          index < unreadNotifications
                            ? 'bg-[#D58B2B]'
                            : isDark
                            ? 'bg-white/15'
                            : 'bg-black/10'
                        }`}
                      />
                      <span>
                        <b className="block text-xs">{title}</b>
                        <small className={`mt-1 block text-[10px] ${mutedText}`}>{copy}</small>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => openEditor()}
              className={`flex h-9 items-center gap-2 rounded-full px-4 text-xs font-medium transition ${
                isDark
                  ? 'bg-[#FFCC70] text-[#181614] hover:bg-[#f0bd5e]'
                  : 'bg-[#4A3026] text-white hover:bg-[#281C17]'
              }`}
            >
              <Icon name="plus" size={15} /> <span className="hidden sm:inline">Add product</span>
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1480px] p-5 sm:p-8 lg:p-10">
          {view === 'overview' && (
            <div className="space-y-8">
              <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#D58B2B]">
                    Studio Overview · {shopProfile.name}
                  </p>
                  <h2 className="mt-2 font-display text-[clamp(30px,4vw,48px)] leading-none font-medium tracking-[-0.055em]">
                    Good evening,{' '}
                    <em
                      className={`font-serif italic font-normal ${
                        isDark ? 'text-[#A9B9A5]' : 'text-[#637363]'
                      }`}
                    >
                      Avery.
                    </em>
                  </h2>
                  <p className={`mt-3 text-sm ${mutedText}`}>
                    Your studio has {pendingOrdersCount} order
                    {pendingOrdersCount === 1 ? '' : 's'} waiting for attention.
                  </p>
                </div>
                <select
                  className={`h-10 rounded-full border bg-transparent px-4 text-xs outline-none ${
                    isDark ? 'border-white/15 text-[#F3F0E8]' : 'border-black/10 text-[#1E231E]'
                  }`}
                >
                  <option className={isDark ? 'bg-[#1B1815]' : ''}>Last 30 days</option>
                  <option className={isDark ? 'bg-[#1B1815]' : ''}>Last 7 days</option>
                  <option className={isDark ? 'bg-[#1B1815]' : ''}>This year</option>
                </select>
              </section>

              <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ['Gross sales', `$${totalRevenue.toLocaleString()}`, '+18.4%', 'vs. last period'],
                  ['Orders', String(orders.length * 6), '+6', 'vs. last period'],
                  ['Shop views', '3,208', '+12.1%', 'vs. last period'],
                  ['Conversion', '3.8%', '+0.6%', 'vs. last period'],
                ].map(([label, value, change, context], index) => (
                  <article key={label} className={`rounded-2xl border p-5 ${surfaceClass}`}>
                    <div className="flex items-center justify-between">
                      <p className={`text-xs ${mutedText}`}>{label}</p>
                      <span
                        className={`font-mono text-[9px] ${
                          isDark ? 'text-white/30' : 'text-black/30'
                        }`}
                      >
                        0{index + 1}
                      </span>
                    </div>
                    <strong className="mt-7 block text-3xl tracking-[-0.05em] tabular-nums">
                      {value}
                    </strong>
                    <p className="mt-2 text-[10px]">
                      <span className="font-semibold text-[#637363]">{change}</span>{' '}
                      <span className={mutedText}>{context}</span>
                    </p>
                  </article>
                ))}
              </section>

              <section className="grid gap-4 lg:grid-cols-[1.45fr_0.75fr]">
                <article className={`rounded-2xl border p-5 sm:p-6 ${surfaceClass}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold tracking-[-0.02em]">Sales overview</h3>
                      <p className={`mt-1 text-xs ${mutedText}`}>Revenue over the last 30 days</p>
                    </div>
                    <b className="text-sm tabular-nums">${totalRevenue.toLocaleString()}.00</b>
                  </div>
                  <div
                    className={`mt-8 grid h-56 grid-cols-12 items-end gap-1.5 border-b sm:gap-3 ${dividerClass}`}
                  >
                    {[32, 46, 38, 58, 48, 72, 63, 88, 68, 78, 94, 84].map((height, index) => (
                      <div key={index} className="group relative h-full">
                        <div
                          className="absolute inset-x-0 bottom-0 rounded-t-sm bg-[#637363]/75 transition hover:bg-[#D58B2B]"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div
                    className={`mt-3 flex justify-between font-mono text-[8px] uppercase tracking-wider ${mutedText}`}
                  >
                    <span>Wk 01</span>
                    <span>Wk 02</span>
                    <span>Wk 03</span>
                    <span>Wk 04</span>
                    <span>Today</span>
                  </div>
                </article>

                <article className="rounded-2xl bg-[#3C493D] p-6 text-white">
                  <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/45">
                    Next payout
                  </p>
                  <strong className="mt-6 block text-4xl tracking-[-0.05em] tabular-nums">
                    $1,284.60
                  </strong>
                  <p className="mt-2 text-xs text-white/55">Expected Friday</p>
                  <div className="mt-8 space-y-3 border-t border-white/10 pt-5 text-xs">
                    <p className="flex justify-between">
                      <span className="text-white/55">Gross sales</span>
                      <b>$1,396.30</b>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-white/55">Marketplace fee (8%)</span>
                      <b>−$111.70</b>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => selectView('analytics')}
                    className="mt-7 flex w-full items-center justify-between rounded-full border border-white/20 px-4 py-3 text-xs hover:bg-white/10"
                  >
                    View payout details <Icon name="arrow" size={15} />
                  </button>
                </article>
              </section>

              <section className="grid gap-4 lg:grid-cols-[1.45fr_0.75fr]">
                <article className={`rounded-2xl border ${surfaceClass}`}>
                  <div className={`flex items-center justify-between border-b p-5 ${dividerClass}`}>
                    <div>
                      <h3 className="font-semibold">Recent orders</h3>
                      <p className={`mt-1 text-xs ${mutedText}`}>
                        Orders requiring your attention
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => selectView('orders')}
                      className={`text-xs font-medium hover:underline ${
                        isDark ? 'text-[#A9B9A5]' : 'text-[#637363]'
                      }`}
                    >
                      View all
                    </button>
                  </div>
                  <div className={`divide-y ${isDark ? 'divide-white/8' : 'divide-black/[0.06]'}`}>
                    {orders.slice(0, 3).map((order) => (
                      <button
                        type="button"
                        key={order.id}
                        onClick={() => {
                          setView('orders');
                          setSelectedOrder(order);
                        }}
                        className={`grid w-full grid-cols-[1fr_auto] items-center gap-4 p-4 text-left sm:grid-cols-[90px_1fr_115px_90px] ${
                          isDark ? 'hover:bg-white/5' : 'hover:bg-white'
                        }`}
                      >
                        <b className="text-xs">{order.id}</b>
                        <span>
                          <b className="block text-xs font-medium">{order.customer}</b>
                          <small className={`text-[10px] ${mutedText}`}>{order.item}</small>
                        </span>
                        <StatusPill isDark={isDark}>{order.status}</StatusPill>
                        <strong className="text-right text-xs tabular-nums">
                          ${order.total}
                        </strong>
                      </button>
                    ))}
                  </div>
                </article>

                <article className={`rounded-2xl border p-5 ${surfaceClass}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Shop checklist</h3>
                    <span className={`text-xs ${mutedText}`}>4 of 6</span>
                  </div>
                  <div className="mt-5 space-y-1">
                    {[
                      ['Add your studio story', true],
                      ['Publish your first product', liveCount > 0],
                      ['Set shipping profiles', true],
                      ['Connect payout details', true],
                      ['Add a shop banner', Boolean(shopProfile.bannerUrl)],
                      ['Invite a collaborator', false],
                    ].map(([label, done]) => (
                      <button
                        type="button"
                        key={String(label)}
                        onClick={() => !done && selectView('store')}
                        className={`flex w-full items-center gap-3 rounded-lg p-2 text-left text-xs ${
                          isDark ? 'hover:bg-white/5' : 'hover:bg-black/[0.03]'
                        }`}
                      >
                        <span
                          className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px] ${
                            done
                              ? 'border-[#637363] bg-[#637363] text-white'
                              : isDark
                              ? 'border-white/20'
                              : 'border-black/15'
                          }`}
                        >
                          {done ? '✓' : ''}
                        </span>
                        <span className={`flex-1 ${done ? `${mutedText} line-through` : ''}`}>
                          {label}
                        </span>
                        {!done && <Icon name="chevron" size={13} />}
                      </button>
                    ))}
                  </div>
                </article>
              </section>
            </div>
          )}

          {view === 'products' &&
            (selectedProduct ? (
              <ProductDetailPanel
                product={selectedProduct}
                orders={orders}
                isDark={isDark}
                onBack={() => setSelectedProductId(null)}
                onEdit={() => openEditor(selectedProduct)}
                onDelete={() => setPendingDelete(selectedProduct)}
                onPreview={() => setStorePreview(true)}
              />
            ) : (
              <section>
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                  <div>
                    <h2 className="text-3xl font-semibold tracking-[-0.045em]">Products</h2>
                    <p className={`mt-2 text-sm ${mutedText}`}>
                      {products.length} objects · ${totalRevenue.toLocaleString()} total revenue
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openEditor()}
                    className={`flex h-10 items-center justify-center gap-2 rounded-full px-5 text-xs font-medium ${
                      isDark ? 'bg-[#FFCC70] text-[#181614]' : 'bg-[#4A3026] text-white'
                    }`}
                  >
                    <Icon name="plus" size={15} /> New product
                  </button>
                </div>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div
                    className={`flex gap-1 overflow-x-auto rounded-full border p-1 ${
                      isDark ? 'border-white/10 bg-[#1B1815]' : 'border-black/[0.08] bg-white/50'
                    }`}
                  >
                    {['All', 'Live', 'Draft', 'Low stock'].map((item) => (
                      <button
                        type="button"
                        key={item}
                        onClick={() => setFilter(item)}
                        className={`shrink-0 rounded-full px-3 py-2 text-[10px] font-medium transition ${
                          filter === item
                            ? 'bg-[#637363] text-white'
                            : isDark
                            ? 'text-[#F3F0E8]/60 hover:text-white'
                            : 'text-black/45 hover:text-black'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                  <label
                    className={`flex h-10 items-center gap-2 rounded-full border px-4 sm:w-64 ${
                      isDark
                        ? 'border-white/12 bg-[#1B1815]'
                        : 'border-black/10 bg-white/50'
                    }`}
                  >
                    <Icon name="search" size={15} />
                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search products"
                      className="min-w-0 flex-1 bg-transparent text-xs outline-none"
                    />
                  </label>
                </div>

                {filteredProducts.length ? (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredProducts.map((product) => (
                      <article
                        key={product.id}
                        className={`group overflow-hidden rounded-2xl border transition hover:-translate-y-0.5 hover:border-[#637363]/50 hover:shadow-xl ${surfaceClass}`}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedProductId(product.id)}
                          className="relative block aspect-[4/3] w-full overflow-hidden bg-[#DDD7CA] text-left"
                          aria-label={`View details for ${product.name}`}
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
                          />
                          <span className="absolute top-3 left-3">
                            <StatusPill isDark={false}>{product.status}</StatusPill>
                          </span>
                          <span className="absolute right-3 bottom-3 rounded-full bg-[#F3F0E8]/95 px-3 py-1.5 text-[10px] font-semibold text-[#1E231E] backdrop-blur">
                            ${product.price}
                          </span>
                        </button>
                        <div className="p-5">
                          <button
                            type="button"
                            onClick={() => setSelectedProductId(product.id)}
                            className="w-full text-left"
                          >
                            <p
                              className={`font-mono text-[8px] uppercase tracking-[0.15em] ${mutedText}`}
                            >
                              {product.id} · {product.category}
                            </p>
                            <h3 className="mt-2 text-lg font-semibold tracking-[-0.035em]">
                              {product.name}
                            </h3>
                          </button>
                          <div
                            className={`mt-5 grid grid-cols-3 border-y py-4 text-xs ${dividerClass}`}
                          >
                            <span>
                              <b className="block tabular-nums">{product.sales}</b>
                              <small className={`text-[9px] ${mutedText}`}>Sold</small>
                            </span>
                            <span>
                              <b className="block tabular-nums">
                                ${product.revenue.toLocaleString()}
                              </b>
                              <small className={`text-[9px] ${mutedText}`}>Revenue</small>
                            </span>
                            <span>
                              <b className={`tabular-nums ${product.stock <= 4 ? 'text-[#D58B2B]' : ''}`}>
                                {product.stock}
                              </b>
                              <small className={`block text-[9px] ${mutedText}`}>In stock</small>
                            </span>
                          </div>
                          <div className="mt-4 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedProductId(product.id)}
                              className="flex h-9 flex-1 items-center justify-center gap-2 rounded-full bg-[#637363] text-[10px] font-medium text-white hover:bg-[#546652]"
                            >
                              View details <Icon name="arrow" size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => openEditor(product)}
                              className={`grid h-9 w-12 place-items-center rounded-full border text-[10px] transition ${
                                isDark
                                  ? 'border-white/15 hover:bg-white/10'
                                  : 'border-black/10 hover:bg-white'
                              }`}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setPendingDelete(product)}
                              className={`grid h-9 w-9 place-items-center rounded-full border transition hover:border-[#A94B3F]/40 hover:bg-[#A94B3F]/10 hover:text-[#D0695C] ${
                                isDark
                                  ? 'border-white/15 text-[#F3F0E8]/55'
                                  : 'border-black/10 text-black/40'
                              }`}
                              aria-label={`Delete ${product.name}`}
                            >
                              <Icon name="trash" size={14} />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div
                    className={`mt-5 rounded-2xl border border-dashed p-12 text-center ${
                      isDark ? 'border-white/15 bg-[#1B1815]' : 'border-black/10 bg-white/45'
                    }`}
                  >
                    <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-[#DFE5DB] text-[#3C493D]">
                      <Icon name="box" />
                    </span>
                    <p className="mt-4 text-sm font-medium">No products found</p>
                    <p className={`mt-1 text-xs ${mutedText}`}>
                      Try a different search or status.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearch('');
                        setFilter('All');
                      }}
                      className={`mt-4 text-xs font-medium hover:underline ${
                        isDark ? 'text-[#A9B9A5]' : 'text-[#637363]'
                      }`}
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </section>
            ))}

          {view === 'orders' && (
            <section>
              <h2 className="text-3xl font-semibold tracking-[-0.045em]">Orders</h2>
              <p className={`mt-2 text-sm ${mutedText}`}>
                Track, pack, and dispatch every studio order.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {[
                  ['Needs attention', String(pendingOrdersCount), 'Ready to process'],
                  ['Shipping today', '1', 'Label and tracking due'],
                  ['Completed this month', '18', '$3,944 fulfilled'],
                ].map(([label, value, copy], index) => (
                  <article
                    key={label}
                    className={`rounded-2xl border p-5 ${
                      index === 0
                        ? isDark
                          ? 'border-[#D58B2B]/35 bg-[#D58B2B]/15'
                          : 'border-[#D58B2B]/25 bg-[#F5E5C9]/55'
                        : surfaceClass
                    }`}
                  >
                    <p className={`text-xs ${mutedText}`}>{label}</p>
                    <strong className="mt-4 block text-3xl tracking-[-0.05em] tabular-nums">
                      {value}
                    </strong>
                    <small className={`mt-1 block text-[10px] ${mutedText}`}>{copy}</small>
                  </article>
                ))}
              </div>

              <div className={`mt-4 overflow-hidden rounded-2xl border ${surfaceClass}`}>
                <div className={`flex items-center justify-between border-b p-5 ${dividerClass}`}>
                  <div>
                    <h3 className="font-semibold">All orders</h3>
                    <p className={`mt-1 text-xs ${mutedText}`}>Newest orders appear first</p>
                  </div>
                  <button
                    type="button"
                    onClick={exportOrders}
                    className={`rounded-full border px-4 py-2 text-[10px] transition ${
                      isDark
                        ? 'border-white/15 hover:bg-white/10'
                        : 'border-black/10 hover:bg-white'
                    }`}
                  >
                    Export CSV
                  </button>
                </div>

                {orders.map((order) => (
                  <article
                    key={order.id}
                    className={`grid gap-4 border-b p-5 last:border-0 sm:grid-cols-[95px_1fr_140px_100px_auto] sm:items-center ${dividerClass}`}
                  >
                    <b className="text-xs">{order.id}</b>
                    <div>
                      <p className="text-sm font-medium">{order.customer}</p>
                      <small className={`text-[10px] ${mutedText}`}>
                        {order.item} · {order.date}
                      </small>
                    </div>
                    <StatusPill isDark={isDark}>{order.status}</StatusPill>
                    <strong className="text-xs tabular-nums">${order.total}.00</strong>
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className={`rounded-full border px-4 py-2 text-[10px] transition ${
                        isDark
                          ? 'border-white/15 hover:bg-white/10'
                          : 'border-black/10 hover:bg-white'
                      }`}
                    >
                      View order
                    </button>
                  </article>
                ))}
              </div>
            </section>
          )}

          {view === 'analytics' && (
            <section>
              <h2 className="text-3xl font-semibold tracking-[-0.045em]">Analytics</h2>
              <p className={`mt-2 text-sm ${mutedText}`}>
                Understand what people discover, save, and buy.
              </p>

              <div className="mt-7 grid gap-4 lg:grid-cols-3">
                {[
                  ['Revenue', `$${totalRevenue.toLocaleString()}`, 'This quarter'],
                  ['Average order', '$278', `Across ${orders.length * 14} orders`],
                  ['Returning customers', '28%', 'Up 4.2%'],
                ].map(([label, value, copy]) => (
                  <article key={label} className={`rounded-2xl border p-6 ${surfaceClass}`}>
                    <p className={`text-xs ${mutedText}`}>{label}</p>
                    <strong className="mt-5 block text-4xl tracking-[-0.05em] tabular-nums">
                      {value}
                    </strong>
                    <small
                      className={`mt-2 block text-[10px] ${
                        isDark ? 'text-[#A9B9A5]' : 'text-[#637363]'
                      }`}
                    >
                      {copy}
                    </small>
                  </article>
                ))}
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
                <article className={`rounded-2xl border p-6 ${surfaceClass}`}>
                  <h3 className="font-semibold">Discovery</h3>
                  <p className={`mt-1 text-xs ${mutedText}`}>Views by source</p>
                  <div className="mt-10 space-y-5">
                    {[
                      ['Marketplace search', 72],
                      ['Collections', 54],
                      ['Direct links', 38],
                      ['Editorial drops', 24],
                    ].map(([label, width]) => (
                      <div key={String(label)}>
                        <div className="mb-2 flex justify-between text-xs">
                          <span>{label}</span>
                          <b>{width}%</b>
                        </div>
                        <div
                          className={`h-2 rounded-full ${
                            isDark ? 'bg-white/10' : 'bg-black/5'
                          }`}
                        >
                          <div
                            className="h-full rounded-full bg-[#637363]"
                            style={{ width: `${width}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </article>

                {products[0] ? (
                  <article className={`rounded-2xl border p-6 ${surfaceClass}`}>
                    <h3 className="font-semibold">Top product</h3>
                    <div className="relative mt-5 aspect-[4/3] overflow-hidden rounded-xl">
                      <img
                        src={products[0].image}
                        alt={products[0].name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <h4 className="mt-4 text-sm font-medium">{products[0].name}</h4>
                    <p className={`mt-1 text-xs ${mutedText}`}>
                      {products[0].sales} sold · ${products[0].revenue.toLocaleString()} revenue
                    </p>
                  </article>
                ) : (
                  <article
                    className={`grid min-h-72 place-items-center rounded-2xl border border-dashed p-6 text-center ${
                      isDark ? 'border-white/15 bg-[#1B1815]' : 'border-black/10 bg-white/45'
                    }`}
                  >
                    <span>
                      <Icon name="box" />
                      <b className="mt-3 block text-sm">No products yet</b>
                    </span>
                  </article>
                )}
              </div>
            </section>
          )}

          {view === 'store' && (
            <section>
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <h2 className="text-3xl font-semibold tracking-[-0.045em]">Storefront</h2>
                  <p className={`mt-2 text-sm ${mutedText}`}>
                    Build the story customers see before they decide to buy.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStorePreview(true)}
                  className={`flex h-10 items-center gap-2 rounded-full px-5 text-xs font-medium transition ${
                    isDark
                      ? 'bg-[#FFCC70] text-[#181614] hover:bg-[#f0bd5e]'
                      : 'bg-[#4A3026] text-white hover:bg-[#281C17]'
                  }`}
                >
                  <Icon name="eye" size={15} /> Preview shop
                </button>
              </div>

              <div className="mt-7 grid gap-5 xl:grid-cols-[1fr_290px]">
                <div className={`overflow-hidden rounded-2xl border ${surfaceClass}`}>
                  <div className={`flex overflow-x-auto border-b px-3 pt-3 ${dividerClass}`}>
                    {[
                      ['identity', 'Identity & story'],
                      ['design', 'Design & products'],
                      ['policies', 'Policies & trust'],
                    ].map(([id, label]) => (
                      <button
                        type="button"
                        key={id}
                        onClick={() => setStoreTab(id as typeof storeTab)}
                        className={`shrink-0 border-b-2 px-4 py-3 text-xs font-medium transition ${
                          storeTab === id
                            ? isDark
                              ? 'border-[#D58B2B] text-white'
                              : 'border-[#D58B2B] text-black'
                            : `border-transparent ${mutedText}`
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {storeTab === 'identity' && (
                    <div className="space-y-7 p-5 sm:p-7">
                      <div>
                        <h3 className="font-semibold">Shop identity</h3>
                        <p className={`mt-1 text-xs ${mutedText}`}>
                          Give customers enough context to remember and trust your studio.
                        </p>
                      </div>

                      <div
                        className={`flex flex-col gap-5 rounded-2xl p-5 sm:flex-row sm:items-center ${
                          isDark ? 'bg-[#12100E]' : 'bg-[#EBE7DC]/75'
                        }`}
                      >
                        <input
                          id="shop-logo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (!file) return;
                            const url = URL.createObjectURL(file);
                            updateShop('logoUrl', url);
                            showToast('New shop logo selected');
                          }}
                        />
                        <label
                          htmlFor="shop-logo-upload"
                          className="grid h-24 w-24 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-2xl border border-dashed border-black/15 bg-[#637363] text-xl font-semibold text-white transition hover:border-[#D58B2B]"
                        >
                          {shopProfile.logoUrl ? (
                            <img
                              src={shopProfile.logoUrl}
                              alt="Shop logo"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            shopInitials
                          )}
                        </label>
                        <div>
                          <b className="text-sm">Shop logo</b>
                          <p className={`mt-1 text-xs leading-5 ${mutedText}`}>
                            Use a simple mark that stays clear at small sizes. Square PNG or JPG, at
                            least 600 × 600px.
                          </p>
                          <label
                            htmlFor="shop-logo-upload"
                            className={`mt-3 block cursor-pointer text-xs font-medium hover:underline ${
                              isDark ? 'text-[#A9B9A5]' : 'text-[#637363]'
                            }`}
                          >
                            Replace image
                          </label>
                        </div>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <label className={`grid gap-2 text-[10px] font-semibold uppercase tracking-wider ${mutedText}`}>
                          Shop name
                          <input
                            value={shopProfile.name}
                            maxLength={40}
                            onChange={(event) => updateShop('name', event.target.value)}
                            className={`h-12 rounded-xl border px-4 text-sm normal-case tracking-normal outline-none ${inputSurfaceClass}`}
                          />
                        </label>
                        <label className={`grid gap-2 text-[10px] font-semibold uppercase tracking-wider ${mutedText}`}>
                          Studio location
                          <input
                            value={shopProfile.location}
                            onChange={(event) => updateShop('location', event.target.value)}
                            className={`h-12 rounded-xl border px-4 text-sm normal-case tracking-normal outline-none ${inputSurfaceClass}`}
                          />
                        </label>
                      </div>

                      <label className={`grid gap-2 text-[10px] font-semibold uppercase tracking-wider ${mutedText}`}>
                        Short introduction
                        <textarea
                          value={shopProfile.tagline}
                          maxLength={180}
                          rows={3}
                          onChange={(event) => updateShop('tagline', event.target.value)}
                          className={`resize-none rounded-xl border p-4 text-sm leading-6 normal-case tracking-normal outline-none ${inputSurfaceClass}`}
                        />
                        <small className="text-right text-[9px] font-normal tracking-normal">
                          {shopProfile.tagline.length}/180
                        </small>
                      </label>

                      <label className={`grid gap-2 text-[10px] font-semibold uppercase tracking-wider ${mutedText}`}>
                        Full studio story
                        <textarea
                          value={shopProfile.story}
                          maxLength={700}
                          rows={5}
                          onChange={(event) => updateShop('story', event.target.value)}
                          className={`resize-none rounded-xl border p-4 text-sm leading-6 normal-case tracking-normal outline-none ${inputSurfaceClass}`}
                        />
                      </label>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <label className={`grid gap-2 text-[10px] font-semibold uppercase tracking-wider ${mutedText}`}>
                          Customer contact email
                          <input
                            type="email"
                            value={shopProfile.email}
                            onChange={(event) => updateShop('email', event.target.value)}
                            className={`h-12 rounded-xl border px-4 text-sm normal-case tracking-normal outline-none ${inputSurfaceClass}`}
                          />
                        </label>
                        <label className={`grid gap-2 text-[10px] font-semibold uppercase tracking-wider ${mutedText}`}>
                          Instagram
                          <input
                            value={shopProfile.instagram}
                            onChange={(event) => updateShop('instagram', event.target.value)}
                            className={`h-12 rounded-xl border px-4 text-sm normal-case tracking-normal outline-none ${inputSurfaceClass}`}
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  {storeTab === 'design' && (
                    <div className="space-y-7 p-5 sm:p-7">
                      <div>
                        <h3 className="font-semibold">Shop look & merchandising</h3>
                        <p className={`mt-1 text-xs ${mutedText}`}>
                          Set the tone and choose what customers discover first.
                        </p>
                      </div>

                      <input
                        id="shop-banner-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (!file) return;
                          const url = URL.createObjectURL(file);
                          updateShop('bannerUrl', url);
                          showToast('New shop banner selected');
                        }}
                      />
                      <label
                        htmlFor="shop-banner-upload"
                        className="relative block aspect-[16/6] w-full cursor-pointer overflow-hidden rounded-2xl border border-dashed border-black/15 bg-[#EBE7DC] text-left transition hover:border-[#637363]"
                      >
                        <img
                          src={shopProfile.bannerUrl || products[0]?.image || '/images/products/desk-kbd-sage.jpg'}
                          alt="Current shop banner"
                          className="h-full w-full object-cover opacity-70"
                        />
                        <span className="absolute inset-0 grid place-items-center bg-black/25 text-center text-white">
                          <span>
                            <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-white/90 text-black">
                              <Icon name="upload" />
                            </span>
                            <b className="mt-3 block text-xs">Replace shop banner</b>
                            <small className="mt-1 block text-[10px] text-white/75">
                              1800 × 900px recommended
                            </small>
                          </span>
                        </span>
                      </label>

                      <label className={`grid gap-2 text-[10px] font-semibold uppercase tracking-wider ${mutedText}`}>
                        Announcement bar
                        <input
                          value={shopProfile.announcement}
                          maxLength={80}
                          onChange={(event) => updateShop('announcement', event.target.value)}
                          className={`h-12 rounded-xl border px-4 text-sm normal-case tracking-normal outline-none ${inputSurfaceClass}`}
                        />
                      </label>

                      <div>
                        <p className={`text-[10px] font-semibold uppercase tracking-wider ${mutedText}`}>
                          Shop atmosphere
                        </p>
                        <div className="mt-3 flex gap-3">
                          {(
                            [
                              ['Sage', '#637363'],
                              ['Walnut', '#4A3026'],
                              ['Amber', '#D58B2B'],
                            ] as const
                          ).map(([label, color]) => (
                            <button
                              key={label}
                              type="button"
                              onClick={() => updateShop('atmosphere', label)}
                              className={`flex items-center gap-2 rounded-full border px-3 py-2 text-[10px] ${
                                shopProfile.atmosphere === label
                                  ? isDark
                                    ? 'border-[#859A81] bg-[#2C3A2B] text-white'
                                    : 'border-[#637363] bg-[#DFE5DB]/60'
                                  : isDark
                                  ? 'border-white/15'
                                  : 'border-black/10'
                              }`}
                            >
                              <span
                                className="h-4 w-4 rounded-full"
                                style={{ backgroundColor: color }}
                              />
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-end justify-between">
                          <div>
                            <h4 className="text-sm font-semibold">Featured products</h4>
                            <p className={`mt-1 text-xs ${mutedText}`}>
                              Your first three live products appear in the shop preview.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => selectView('products')}
                            className={`text-xs hover:underline ${
                              isDark ? 'text-[#A9B9A5]' : 'text-[#637363]'
                            }`}
                          >
                            Manage products
                          </button>
                        </div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                          {products.slice(0, 3).map((product, index) => (
                            <article
                              key={product.id}
                              className={`rounded-xl border p-3 ${
                                isDark
                                  ? 'border-white/10 bg-[#12100E]'
                                  : 'border-black/[0.08] bg-white/55'
                              }`}
                            >
                              <div className="relative aspect-square overflow-hidden rounded-lg">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                                <span className="absolute top-2 left-2 grid h-5 w-5 place-items-center rounded-full bg-[#4A3026] text-[8px] text-white">
                                  {index + 1}
                                </span>
                              </div>
                              <b className="mt-3 block truncate text-[10px]">{product.name}</b>
                            </article>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {storeTab === 'policies' && (
                    <div className="space-y-7 p-5 sm:p-7">
                      <div>
                        <h3 className="font-semibold">Policies & customer trust</h3>
                        <p className={`mt-1 text-xs ${mutedText}`}>
                          Clear expectations reduce questions and make customers more comfortable
                          buying.
                        </p>
                      </div>

                      <label className={`grid gap-2 text-[10px] font-semibold uppercase tracking-wider ${mutedText}`}>
                        Typical dispatch time
                        <select
                          value={shopProfile.dispatch}
                          onChange={(event) => updateShop('dispatch', event.target.value)}
                          className={`h-12 rounded-xl border px-4 text-sm normal-case tracking-normal outline-none ${inputSurfaceClass}`}
                        >
                          <option className={isDark ? 'bg-[#12100E]' : ''}>1 business day</option>
                          <option className={isDark ? 'bg-[#12100E]' : ''}>2–3 business days</option>
                          <option className={isDark ? 'bg-[#12100E]' : ''}>3–5 business days</option>
                          <option className={isDark ? 'bg-[#12100E]' : ''}>
                            Made to order · 2–4 weeks
                          </option>
                        </select>
                      </label>

                      <label className={`grid gap-2 text-[10px] font-semibold uppercase tracking-wider ${mutedText}`}>
                        Shipping policy
                        <textarea
                          value={shopProfile.shippingPolicy}
                          rows={4}
                          onChange={(event) => updateShop('shippingPolicy', event.target.value)}
                          className={`resize-none rounded-xl border p-4 text-sm leading-6 normal-case tracking-normal outline-none ${inputSurfaceClass}`}
                        />
                      </label>

                      <label className={`grid gap-2 text-[10px] font-semibold uppercase tracking-wider ${mutedText}`}>
                        Returns & exchanges
                        <textarea
                          value={shopProfile.returnPolicy}
                          rows={4}
                          onChange={(event) => updateShop('returnPolicy', event.target.value)}
                          className={`resize-none rounded-xl border p-4 text-sm leading-6 normal-case tracking-normal outline-none ${inputSurfaceClass}`}
                        />
                      </label>

                      <label
                        className={`flex cursor-pointer items-start gap-3 rounded-xl p-4 text-xs leading-5 ${
                          isDark ? 'bg-[#2C3A2B]/55' : 'bg-[#DFE5DB]/60'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={shopProfile.customOrders}
                          onChange={(event) => updateShop('customOrders', event.target.checked)}
                          className="mt-1 accent-[#637363]"
                        />
                        <span>
                          <b className="block">Accept custom order enquiries</b>
                          <small className={mutedText}>
                            Customers can contact you about dimensions, finishes, or small
                            commissions.
                          </small>
                        </span>
                      </label>

                      <div
                        className={`rounded-xl border p-4 ${
                          isDark
                            ? 'border-white/10 bg-[#12100E]'
                            : 'border-black/[0.08] bg-white/50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <span>
                            <b className="block text-xs">
                              Frequently asked questions ({faqs.length})
                            </b>
                            <small className={`text-[10px] ${mutedText}`}>
                              Materials, care, packaging, and lead times
                            </small>
                          </span>
                          <button
                            type="button"
                            onClick={() => setFaqEditor(true)}
                            className={`rounded-full border px-4 py-2 text-[10px] ${
                              isDark
                                ? 'border-white/15 hover:bg-white/10'
                                : 'border-black/10 hover:bg-white'
                            }`}
                          >
                            Add question
                          </button>
                        </div>

                        {faqs.length > 0 && (
                          <div className="mt-4 space-y-2 border-t border-black/10 pt-3">
                            {faqs.map((f, idx) => (
                              <div key={idx} className="text-xs">
                                <p className="font-medium">{f.question}</p>
                                <p className={`text-[11px] ${mutedText}`}>{f.answer}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div
                    className={`flex items-center justify-between border-t p-5 ${
                      isDark
                        ? 'border-white/10 bg-white/[0.02]'
                        : 'border-black/[0.08] bg-white/40'
                    }`}
                  >
                    <span className={`text-[10px] ${mutedText}`}>
                      Changes appear instantly in preview
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        saveSellerProfile(shopProfile);
                        showToast('Storefront changes saved');
                      }}
                      className={`rounded-full px-5 py-3 text-xs font-medium ${
                        isDark ? 'bg-[#FFCC70] text-[#181614]' : 'bg-[#4A3026] text-white'
                      }`}
                    >
                      Save storefront
                    </button>
                  </div>
                </div>

                <aside className="space-y-4">
                  <article className="rounded-2xl bg-[#3C493D] p-6 text-white">
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/45">
                        Shop readiness
                      </p>
                      <b className="text-sm text-[#FFCC70]">88%</b>
                    </div>
                    <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[88%] bg-[#D58B2B]" />
                    </div>
                    <div className="mt-5 space-y-3 text-xs">
                      {[
                        ['Identity & story', Boolean(shopProfile.name && shopProfile.story)],
                        ['Contact details', Boolean(shopProfile.email)],
                        ['Shipping & returns', Boolean(shopProfile.shippingPolicy)],
                        ['Shop banner', Boolean(shopProfile.bannerUrl)],
                        ['3 featured products', liveCount >= 2],
                      ].map(([label, done]) => (
                        <p key={String(label)} className="flex items-center gap-2">
                          <span
                            className={`grid h-4 w-4 place-items-center rounded-full text-[8px] ${
                              done
                                ? 'bg-white/20 text-white'
                                : 'border border-white/25 text-white/35'
                            }`}
                          >
                            {done ? '✓' : ''}
                          </span>
                          <span className={done ? 'text-white/75' : 'text-white/40'}>{label}</span>
                        </p>
                      ))}
                    </div>
                  </article>

                  <article className={`rounded-2xl border p-5 ${surfaceClass}`}>
                    <h3 className="text-sm font-semibold">Public shop URL</h3>
                    <p className={`mt-2 break-all font-mono text-[9px] leading-5 ${mutedText}`}>
                      syntaxwear.store/shop/{shopProfile.handle || 'north-common'}
                    </p>
                    <button
                      type="button"
                      onClick={copyShopLink}
                      className={`mt-4 w-full rounded-full border py-2.5 text-[10px] font-medium transition ${
                        isDark
                          ? 'border-white/15 hover:bg-white/10'
                          : 'border-black/10 hover:bg-white'
                      }`}
                    >
                      Copy shop link
                    </button>
                  </article>

                  <article
                    className={`rounded-2xl border p-5 ${
                      isDark
                        ? 'border-[#D58B2B]/30 bg-[#D58B2B]/12'
                        : 'border-[#D58B2B]/25 bg-[#F5E5C9]/55'
                    }`}
                  >
                    <p className="text-xs font-semibold">A complete shop converts better.</p>
                    <p className={`mt-2 text-[10px] leading-5 ${mutedText}`}>
                      Clear policies, a studio story, and at least three products help customers buy
                      with confidence.
                    </p>
                  </article>
                </aside>
              </div>
            </section>
          )}

          {view === 'settings' &&
            (settingsSection ? (
              <SettingsDetailPanel
                section={settingsSection}
                shopLocation={shopProfile.location}
                shopEmail={shopProfile.email}
                isDark={isDark}
                onBack={() => setSettingsSection(null)}
                onSave={showToast}
              />
            ) : (
              <section>
                <h2 className="text-3xl font-semibold tracking-[-0.045em]">Settings</h2>
                <p className={`mt-2 text-sm ${mutedText}`}>
                  Account, fulfilment, payouts, and notifications.
                </p>

                <div className="mt-7 grid gap-3">
                  {(
                    [
                      [
                        'profile',
                        'Profile & access',
                        'Your name, email, password, and collaborators',
                      ],
                      [
                        'shipping',
                        'Shipping & delivery',
                        'Dispatch times, shipping regions, and rates',
                      ],
                      [
                        'payouts',
                        'Payouts & taxes',
                        'Bank account, tax details, and payout schedule',
                      ],
                      ['notifications', 'Notifications', 'Choose which shop events you hear about'],
                      ['support', 'Seller support', 'Guides, policies, and contact with our team'],
                    ] as const
                  ).map(([id, title, copy]) => (
                    <button
                      type="button"
                      key={id}
                      onClick={() => setSettingsSection(id)}
                      className={`flex items-center justify-between rounded-2xl border p-5 text-left transition ${surfaceClass} ${
                        isDark
                          ? 'hover:border-[#859A81] hover:bg-[#221E1A]'
                          : 'hover:border-[#637363] hover:bg-white'
                      }`}
                    >
                      <span>
                        <b className="block text-sm">{title}</b>
                        <small className={`mt-1 block text-xs ${mutedText}`}>{copy}</small>
                      </span>
                      <Icon name="chevron" size={16} />
                    </button>
                  ))}
                </div>
              </section>
            ))}
        </div>
      </div>

      {/* Order Detail Drawer */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-[76] flex justify-end bg-black/40 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Order ${selectedOrder.id}`}
        >
          <button
            type="button"
            className="absolute inset-0"
            onClick={() => {
              setSelectedOrder(null);
              setMessageComposer(false);
            }}
            aria-label="Close order details"
          />
          <aside
            className={`relative flex h-full w-full max-w-lg flex-col overflow-y-auto shadow-2xl ${
              isDark ? 'bg-[#171412] text-[#F3F0E8]' : 'bg-[#F3F0E8] text-[#1E231E]'
            }`}
          >
            <header
              className={`sticky top-0 z-10 flex h-[76px] items-center justify-between border-b px-6 ${
                isDark
                  ? 'border-white/10 bg-[#171412]'
                  : 'border-black/10 bg-[#F3F0E8]'
              }`}
            >
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wider text-[#D58B2B]">
                  Order detail
                </p>
                <h2 className="text-lg font-semibold">{selectedOrder.id}</h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedOrder(null);
                  setMessageComposer(false);
                }}
                className={`grid h-9 w-9 place-items-center rounded-full border ${
                  isDark ? 'border-white/15' : 'border-black/10'
                }`}
                aria-label="Close order"
              >
                <Icon name="close" />
              </button>
            </header>

            <div className="flex-1 space-y-5 p-6">
              <div
                className={`flex items-center justify-between rounded-2xl p-5 ${
                  isDark ? 'bg-[#2C3A2B]/65' : 'bg-[#DFE5DB]/60'
                }`}
              >
                <span>
                  <small className={`block text-[10px] ${mutedText}`}>Current status</small>
                  <b className="mt-1 block text-sm">{selectedOrder.status}</b>
                </span>
                <StatusPill isDark={isDark}>{selectedOrder.status}</StatusPill>
              </div>

              <article className={`rounded-2xl border p-5 ${surfaceClass}`}>
                <h3 className="text-sm font-semibold">Customer</h3>
                <p className="mt-4 text-sm">{selectedOrder.customer}</p>
                <p className={`mt-1 text-xs ${mutedText}`}>{selectedOrder.email}</p>
                <p className={`mt-4 text-xs leading-5 ${mutedText}`}>
                  {selectedOrder.address.map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < selectedOrder.address.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              </article>

              <article className={`rounded-2xl border p-5 ${surfaceClass}`}>
                <h3 className="text-sm font-semibold">Items</h3>
                <div
                  className={`mt-4 flex items-center justify-between border-b pb-4 ${dividerClass}`}
                >
                  <span>
                    <b className="block text-xs">{selectedOrder.item}</b>
                    <small className={`text-[10px] ${mutedText}`}>{selectedOrder.variant}</small>
                  </span>
                  <strong className="text-xs tabular-nums">${selectedOrder.total}.00</strong>
                </div>
                <div className="mt-4 space-y-2 text-xs">
                  <p className="flex justify-between">
                    <span className={mutedText}>Shipping</span>
                    <b>Complimentary</b>
                  </p>
                  <p className="flex justify-between text-sm">
                    <span>Total</span>
                    <b className="tabular-nums">${selectedOrder.total}.00</b>
                  </p>
                </div>
              </article>

              <article className={`rounded-2xl border p-5 ${surfaceClass}`}>
                <h3 className="text-sm font-semibold">Order timeline</h3>
                <div className="mt-4 space-y-4 text-xs">
                  {[
                    ['Order received', selectedOrder.date],
                    ['Payment confirmed', 'A few moments later'],
                    [
                      selectedOrder.status === 'Shipped'
                        ? 'Dispatched with tracking'
                        : 'Awaiting fulfilment',
                      selectedOrder.status === 'Shipped' ? 'Just now' : 'Current step',
                    ],
                  ].map(([event, date], index) => (
                    <p key={event} className="flex gap-3">
                      <span
                        className={`mt-0.5 h-2 w-2 rounded-full ${
                          index === 2 ? 'bg-[#D58B2B]' : 'bg-[#637363]'
                        }`}
                      />
                      <span>
                        <b className="block">{event}</b>
                        <small className={`text-[10px] ${mutedText}`}>{date}</small>
                      </span>
                    </p>
                  ))}
                </div>
              </article>

              {messageComposer && (
                <form
                  className={`rounded-2xl border p-5 ${
                    isDark
                      ? 'border-[#859A81]/30 bg-[#2C3A2B]/55'
                      : 'border-[#637363]/20 bg-[#DFE5DB]/50'
                  }`}
                  onSubmit={(event) => {
                    event.preventDefault();
                    showToast(`Message sent to ${selectedOrder.customer}`);
                    setMessageComposer(false);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Message {selectedOrder.customer}</h3>
                    <button
                      type="button"
                      onClick={() => setMessageComposer(false)}
                      className={`text-[10px] ${mutedText}`}
                    >
                      Cancel
                    </button>
                  </div>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write an order update…"
                    className={`mt-4 w-full resize-none rounded-xl border p-3 text-xs leading-5 outline-none ${inputSurfaceClass}`}
                  />
                  <button
                    type="submit"
                    className="mt-3 rounded-full bg-[#637363] px-4 py-2.5 text-[10px] font-medium text-white"
                  >
                    Send message
                  </button>
                </form>
              )}
            </div>

            <footer
              className={`sticky bottom-0 grid grid-cols-2 gap-2 border-t p-5 ${
                isDark
                  ? 'border-white/10 bg-[#171412]'
                  : 'border-black/10 bg-[#F3F0E8]'
              }`}
            >
              <button
                type="button"
                onClick={() => setMessageComposer(true)}
                className={`rounded-full border px-4 py-3 text-xs font-medium ${
                  isDark ? 'border-white/15' : 'border-black/10'
                }`}
              >
                Message customer
              </button>
              <button
                type="button"
                onClick={() => {
                  const updatedOrder: SellerOrder = { ...selectedOrder, status: 'Shipped' };
                  setSelectedOrder(updatedOrder);
                  setOrders((prev) =>
                    prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
                  );
                  showToast(`Shipping workflow started for ${selectedOrder.id}`);
                }}
                className={`rounded-full px-4 py-3 text-xs font-medium ${
                  isDark ? 'bg-[#FFCC70] text-[#181614]' : 'bg-[#4A3026] text-white'
                }`}
              >
                Create shipping label
              </button>
            </footer>
          </aside>
        </div>
      )}

      {/* FAQ Editor Modal */}
      {faqEditor && (
        <div
          className="fixed inset-0 z-[78] grid place-items-center bg-black/45 p-5 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Add frequently asked question"
        >
          <button
            type="button"
            className="absolute inset-0"
            onClick={() => setFaqEditor(false)}
            aria-label="Close FAQ editor"
          />
          <form
            className={`relative w-full max-w-lg rounded-3xl p-6 shadow-2xl ${
              isDark ? 'bg-[#1B1815] text-[#F3F0E8]' : 'bg-[#F3F0E8] text-[#1E231E]'
            }`}
            onSubmit={(event) => {
              event.preventDefault();
              setFaqs((prev) => [...prev, { question: faqQuestion, answer: faqAnswer }]);
              showToast('FAQ added to your storefront');
              setFaqQuestion('');
              setFaqAnswer('');
              setFaqEditor(false);
            }}
          >
            <p className="font-mono text-[9px] uppercase tracking-wider text-[#D58B2B]">
              Storefront FAQ
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Add a question</h2>
            <label
              className={`mt-6 grid gap-2 text-[10px] font-semibold uppercase tracking-wider ${mutedText}`}
            >
              Question
              <input
                required
                value={faqQuestion}
                onChange={(event) => setFaqQuestion(event.target.value)}
                placeholder="How should I care for this object?"
                className={`h-12 rounded-xl border px-4 text-sm normal-case tracking-normal outline-none ${inputSurfaceClass}`}
              />
            </label>
            <label
              className={`mt-5 grid gap-2 text-[10px] font-semibold uppercase tracking-wider ${mutedText}`}
            >
              Answer
              <textarea
                required
                rows={5}
                value={faqAnswer}
                onChange={(event) => setFaqAnswer(event.target.value)}
                placeholder="Share a clear, useful answer…"
                className={`resize-none rounded-xl border p-4 text-sm leading-6 normal-case tracking-normal outline-none ${inputSurfaceClass}`}
              />
            </label>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setFaqEditor(false)}
                className={`rounded-full border px-5 py-3 text-xs ${
                  isDark ? 'border-white/15' : 'border-black/10'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`rounded-full px-5 py-3 text-xs font-medium ${
                  isDark ? 'bg-[#FFCC70] text-[#181614]' : 'bg-[#4A3026] text-white'
                }`}
              >
                Add question
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Shop Preview Modal */}
      {storePreview && (
        <div
          className={`fixed inset-0 z-[75] flex flex-col ${
            isDark ? 'bg-[#0E0D0B]' : 'bg-[#DEDDD6]'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Shop preview"
        >
          <header
            className={`flex h-[68px] shrink-0 items-center justify-between border-b px-4 sm:px-6 ${
              isDark
                ? 'border-white/10 bg-[#171412] text-[#F3F0E8]'
                : 'border-black/10 bg-[#F3F0E8] text-[#1E231E]'
            }`}
          >
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-[#D58B2B]">
                Live shop preview
              </p>
              <h2 className="mt-1 text-sm font-semibold">{shopProfile.name}</h2>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`hidden rounded-full border p-1 sm:flex ${
                  isDark ? 'border-white/15 bg-white/5' : 'border-black/10 bg-white/55'
                }`}
              >
                {(['desktop', 'mobile'] as const).map((device) => (
                  <button
                    type="button"
                    key={device}
                    onClick={() => setPreviewDevice(device)}
                    className={`rounded-full px-4 py-2 text-[10px] capitalize ${
                      previewDevice === device
                        ? 'bg-[#637363] text-white'
                        : isDark
                        ? 'text-white/55 hover:text-white'
                        : 'text-black/45 hover:text-black'
                    }`}
                  >
                    {device}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setStorePreview(false)}
                className={`grid h-9 w-9 place-items-center rounded-full border ${
                  isDark
                    ? 'border-white/15 bg-white/10 hover:bg-white/20'
                    : 'border-black/10 bg-white/60 hover:bg-white'
                }`}
                aria-label="Close shop preview"
              >
                <Icon name="close" />
              </button>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto p-3 sm:p-6">
            <ShopPreviewContent
              profile={shopProfile}
              products={products}
              compact={previewDevice === 'mobile'}
              isDark={isDark}
            />
          </div>
        </div>
      )}

      {/* Add / Edit Product Slide-Over Drawer */}
      {editor && (
        <div
          className="fixed inset-0 z-[72] flex justify-end bg-black/40 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={editingProduct ? 'Edit product' : 'Add product'}
        >
          <button
            type="button"
            aria-label="Close product editor"
            onClick={closeEditor}
            className="absolute inset-0"
          />
          <form
            onSubmit={saveProduct}
            key={editingProduct?.id ?? 'new-product'}
            className={`relative flex h-full w-full max-w-xl flex-col overflow-y-auto shadow-2xl ${
              isDark ? 'bg-[#171412] text-[#F3F0E8]' : 'bg-[#F3F0E8] text-[#1E231E]'
            }`}
          >
            <header
              className={`sticky top-0 z-10 flex h-[76px] items-center justify-between border-b px-6 ${
                isDark
                  ? 'border-white/10 bg-[#171412]'
                  : 'border-black/10 bg-[#F3F0E8]'
              }`}
            >
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wider text-[#D58B2B]">
                  Catalog
                </p>
                <h2 className="text-lg font-semibold">
                  {editingProduct ? `Edit ${editingProduct.name}` : 'Add a new product'}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeEditor}
                className={`grid h-9 w-9 place-items-center rounded-full border ${
                  isDark ? 'border-white/15' : 'border-black/10'
                }`}
              >
                <Icon name="close" />
              </button>
            </header>

            <div className="flex-1 space-y-6 p-6">
              <input
                id="product-image-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(event) =>
                  event.target.files?.length &&
                  showToast(`${event.target.files.length} image selected`)
                }
              />
              <label
                htmlFor="product-image-upload"
                className={`grid aspect-[16/8] w-full cursor-pointer place-items-center rounded-2xl border border-dashed text-center transition hover:border-[#637363] ${
                  isDark ? 'border-white/15 bg-[#1B1815]' : 'border-black/15 bg-white/55'
                }`}
              >
                <span>
                  <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-[#DFE5DB] text-[#3C493D]">
                    <Icon name="upload" />
                  </span>
                  <b className="mt-3 block text-xs">Add product photography</b>
                  <small className={`mt-1 block text-[10px] ${mutedText}`}>
                    Drop up to 8 images here
                  </small>
                </span>
              </label>

              <label
                className={`grid gap-2 text-[10px] font-semibold uppercase tracking-wider ${mutedText}`}
              >
                Product name
                <input
                  name="name"
                  required
                  defaultValue={editingProduct?.name}
                  placeholder="e.g. Heavyweight Loop Tee"
                  className={`h-12 rounded-xl border px-4 text-sm normal-case tracking-normal outline-none ${inputSurfaceClass}`}
                />
              </label>

              <label
                className={`grid gap-2 text-[10px] font-semibold uppercase tracking-wider ${mutedText}`}
              >
                Description
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={editingProduct?.description}
                  placeholder="Materials, process, and what makes this piece distinct…"
                  className={`resize-none rounded-xl border p-4 text-sm leading-6 normal-case tracking-normal outline-none ${inputSurfaceClass}`}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label
                  className={`grid gap-2 text-[10px] font-semibold uppercase tracking-wider ${mutedText}`}
                >
                  Category
                  <select
                    name="category"
                    defaultValue={editingProduct?.category || 'Objects'}
                    className={`h-12 rounded-xl border px-4 text-sm normal-case tracking-normal outline-none ${inputSurfaceClass}`}
                  >
                    <option className={isDark ? 'bg-[#12100E]' : ''}>Objects</option>
                    <option className={isDark ? 'bg-[#12100E]' : ''}>Desk</option>
                    <option className={isDark ? 'bg-[#12100E]' : ''}>Audio</option>
                    <option className={isDark ? 'bg-[#12100E]' : ''}>Wear</option>
                    <option className={isDark ? 'bg-[#12100E]' : ''}>Home</option>
                  </select>
                </label>

                <label
                  className={`grid gap-2 text-[10px] font-semibold uppercase tracking-wider ${mutedText}`}
                >
                  SKU
                  <input
                    name="sku"
                    defaultValue={editingProduct?.id}
                    placeholder="Auto-generated"
                    className={`h-12 rounded-xl border px-4 text-sm normal-case tracking-normal outline-none ${inputSurfaceClass}`}
                  />
                </label>

                <label
                  className={`grid gap-2 text-[10px] font-semibold uppercase tracking-wider ${mutedText}`}
                >
                  Price, USD
                  <input
                    name="price"
                    required
                    min="0"
                    type="number"
                    defaultValue={editingProduct?.price}
                    placeholder="0.00"
                    className={`h-12 rounded-xl border px-4 text-sm normal-case tracking-normal outline-none ${inputSurfaceClass}`}
                  />
                </label>

                <label
                  className={`grid gap-2 text-[10px] font-semibold uppercase tracking-wider ${mutedText}`}
                >
                  Inventory
                  <input
                    name="stock"
                    min="0"
                    type="number"
                    defaultValue={editingProduct?.stock}
                    placeholder="0"
                    className={`h-12 rounded-xl border px-4 text-sm normal-case tracking-normal outline-none ${inputSurfaceClass}`}
                  />
                </label>
              </div>

              <label
                className={`flex items-start gap-3 rounded-xl p-4 text-xs leading-5 ${
                  isDark ? 'bg-[#2C3A2B]/55' : 'bg-[#DFE5DB]/60'
                }`}
              >
                <input type="checkbox" defaultChecked className="mt-1 accent-[#637363]" />
                <span>
                  <b className="block">Track inventory</b>
                  <small className={mutedText}>
                    Hide the listing automatically when inventory reaches zero.
                  </small>
                </span>
              </label>
            </div>

            <footer
              className={`sticky bottom-0 flex items-center justify-between border-t p-5 ${
                isDark
                  ? 'border-white/10 bg-[#171412]'
                  : 'border-black/10 bg-[#F3F0E8]'
              }`}
            >
              <button
                type="button"
                onClick={closeEditor}
                className={`px-3 py-2 text-xs ${mutedText}`}
              >
                Cancel
              </button>
              <div className="flex gap-2">
                <button
                  type="submit"
                  name="intent"
                  value="draft"
                  className={`rounded-full border px-5 py-3 text-xs font-medium ${
                    isDark
                      ? 'border-white/15 hover:bg-white/10'
                      : 'border-black/10 hover:bg-white'
                  }`}
                >
                  {editingProduct ? 'Save changes' : 'Save draft'}
                </button>
                <button
                  type="submit"
                  name="intent"
                  value="publish"
                  className={`rounded-full px-5 py-3 text-xs font-medium ${
                    isDark ? 'bg-[#FFCC70] text-[#181614]' : 'bg-[#4A3026] text-white'
                  }`}
                >
                  {editingProduct ? 'Update listing' : 'Publish'}
                </button>
              </div>
            </footer>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {pendingDelete && (
        <div
          className="fixed inset-0 z-[80] grid place-items-center bg-black/45 p-5 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Delete ${pendingDelete.name}`}
        >
          <button
            type="button"
            className="absolute inset-0"
            onClick={() => setPendingDelete(null)}
            aria-label="Cancel deletion"
          />
          <div
            className={`relative w-full max-w-md rounded-3xl p-6 shadow-2xl sm:p-8 ${
              isDark ? 'bg-[#1B1815] text-[#F3F0E8]' : 'bg-[#F3F0E8] text-[#1E231E]'
            }`}
          >
            <span className="grid h-11 w-11 place-items-center rounded-full bg-[#A94B3F]/15 text-[#D0695C]">
              <Icon name="trash" />
            </span>
            <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.15em] text-[#D0695C]">
              Delete product
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
              Remove {pendingDelete.name}?
            </h2>
            <p className={`mt-3 text-sm leading-6 ${mutedText}`}>
              This removes the listing and its local dashboard history. Existing order records are
              kept.
            </p>
            <div className={`mt-7 flex justify-end gap-2 border-t pt-5 ${dividerClass}`}>
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className={`rounded-full border px-5 py-3 text-xs font-medium ${
                  isDark
                    ? 'border-white/15 hover:bg-white/10'
                    : 'border-black/10 hover:bg-white'
                }`}
              >
                Keep product
              </button>
              <button
                type="button"
                onClick={deleteProduct}
                className="rounded-full bg-[#934339] px-5 py-3 text-xs font-medium text-white hover:bg-[#7E382F]"
              >
                Delete product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed right-5 bottom-5 z-[90] flex items-center gap-3 rounded-full bg-[#281C17] px-5 py-3 text-xs text-white shadow-xl">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-[#637363] text-[10px]">
            ✓
          </span>
          {toast}
        </div>
      )}
    </div>
  );
};
