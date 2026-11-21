'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'

type View = 'overview' | 'products' | 'orders' | 'analytics' | 'store' | 'settings'
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
  | 'upload'

type Product = {
  id: string
  name: string
  category: string
  price: number
  stock: number
  status: 'Live' | 'Draft' | 'Low stock'
  image: string
  sales: number
  revenue: number
  views: number
  conversion: number
}

type ShopProfile = {
  name: string
  tagline: string
  story: string
  announcement: string
  location: string
  email: string
  instagram: string
  dispatch: string
  shippingPolicy: string
  returnPolicy: string
  customOrders: boolean
}

type SettingsSection = 'profile' | 'shipping' | 'payouts' | 'notifications' | 'support'

const initialProducts: Product[] = [
  {
    id: 'NC-001',
    name: 'Trestle Desk Tray',
    category: 'Desk',
    price: 148,
    stock: 12,
    status: 'Live',
    sales: 18,
    revenue: 2664,
    views: 842,
    conversion: 4.2,
    image:
      'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=500&q=85',
  },
  {
    id: 'NC-002',
    name: 'Quiet Arc Lamp',
    category: 'Home',
    price: 286,
    stock: 4,
    status: 'Low stock',
    sales: 11,
    revenue: 3146,
    views: 604,
    conversion: 3.1,
    image:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=500&q=85',
  },
  {
    id: 'NC-003',
    name: 'Field Notes Stand',
    category: 'Desk',
    price: 92,
    stock: 18,
    status: 'Live',
    sales: 9,
    revenue: 828,
    views: 486,
    conversion: 2.8,
    image:
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=500&q=85',
  },
  {
    id: 'NC-004',
    name: 'Common Bowl No. 2',
    category: 'Objects',
    price: 118,
    stock: 0,
    status: 'Draft',
    sales: 0,
    revenue: 0,
    views: 0,
    conversion: 0,
    image:
      'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=500&q=85',
  },
]

const orders = [
  {
    id: '#FF-4098',
    customer: 'Maya Chen',
    item: 'Trestle Desk Tray',
    total: 148,
    status: 'Ready to ship',
    date: 'Today, 9:42',
  },
  {
    id: '#FF-4091',
    customer: 'Arthur Cole',
    item: 'Quiet Arc Lamp',
    total: 286,
    status: 'Processing',
    date: 'Yesterday',
  },
  {
    id: '#FF-4084',
    customer: 'Nora Bell',
    item: 'Field Notes Stand',
    total: 184,
    status: 'Shipped',
    date: 'May 18',
  },
  {
    id: '#FF-4079',
    customer: 'Sam Rivera',
    item: 'Trestle Desk Tray',
    total: 148,
    status: 'Delivered',
    date: 'May 17',
  },
]

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
    chart: (
      <>
        <path d="M4 20V10m6 10V4m6 16v-7m5 7H2" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    close: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
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
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
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
  }
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
  )
}

const nav: { id: View; label: string; icon: IconName }[] = [
  { id: 'overview', label: 'Overview', icon: 'grid' },
  { id: 'products', label: 'Products', icon: 'box' },
  { id: 'orders', label: 'Orders', icon: 'orders' },
  { id: 'analytics', label: 'Analytics', icon: 'chart' },
  { id: 'store', label: 'Storefront', icon: 'store' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
]

function Status({ children }: { children: string }) {
  const color =
    children === 'Live' || children === 'Delivered' || children === 'Shipped'
      ? 'bg-[#dfe9dc] text-[#40543f]'
      : children === 'Low stock' || children === 'Ready to ship'
        ? 'bg-[#f5e5c9] text-[#875516]'
        : 'bg-black/6 text-black/55'
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${color}`}>
      {children}
    </span>
  )
}

function ProductDetail({
  product,
  onBack,
  onEdit,
  onDelete,
  onPreview,
}: {
  product: Product
  onBack: () => void
  onEdit: () => void
  onDelete: () => void
  onPreview: () => void
}) {
  const activity = [28, 42, 34, 55, 48, 68, 61, 82, 72, 92, 78, 88]
  const productOrders = orders.filter((order) => order.item === product.name)

  return (
    <section>
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-medium text-black/45 transition hover:text-black"
      >
        <span>←</span> Back to products
      </button>

      <div className="mt-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div className="flex items-center gap-4">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-[#ddd7ca]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              unoptimized
              sizes="80px"
              className="object-cover"
            />
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Status>{product.status}</Status>
              <span className="font-[var(--mono)] text-[9px] text-black/35">{product.id}</span>
            </div>
            <h2 className="text-3xl font-semibold tracking-[-0.045em]">{product.name}</h2>
            <p className="mt-1 text-xs text-black/45">
              {product.category} · ${product.price}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onDelete}
            className="flex h-10 items-center gap-2 rounded-full border border-[#a94b3f]/20 px-4 text-xs font-medium text-[#934339] transition hover:bg-[#a94b3f]/5"
          >
            <Icon name="trash" size={15} /> Delete
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="h-10 rounded-full border border-black/10 px-5 text-xs font-medium transition hover:bg-white"
          >
            Edit product
          </button>
          <button
            type="button"
            onClick={onPreview}
            className="flex h-10 items-center gap-2 rounded-full bg-[var(--walnut)] px-5 text-xs font-medium text-white"
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
          <article key={label} className="rounded-2xl border border-black/8 bg-white/55 p-5">
            <p className="text-xs text-black/40">{label}</p>
            <strong className="mt-5 block text-3xl tracking-[-0.05em]">{value}</strong>
            <p className="mt-2 text-[10px]">
              <span className="font-semibold text-[var(--sage)]">{change}</span>{' '}
              <span className="text-black/35">{context}</span>
            </p>
          </article>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.35fr_.65fr]">
        <article className="rounded-2xl border border-black/8 bg-white/55 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold tracking-[-0.02em]">Product performance</h3>
              <p className="mt-1 text-xs text-black/40">Views and sales momentum · last 30 days</p>
            </div>
            <select className="rounded-full border border-black/10 bg-transparent px-3 py-2 text-[10px] outline-none">
              <option>Last 30 days</option>
              <option>Last 7 days</option>
            </select>
          </div>
          <div className="mt-8 grid h-52 grid-cols-12 items-end gap-2 border-b border-black/10">
            {activity.map((height, index) => (
              <div key={index} className="group relative h-full">
                <div
                  className="absolute inset-x-0 bottom-0 rounded-t-sm bg-[var(--sage)]/70 transition group-hover:bg-[var(--amber)]"
                  style={{ height: `${height}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between font-[var(--mono)] text-[8px] uppercase tracking-wider text-black/30">
            <span>Apr 21</span>
            <span>May 05</span>
            <span>May 20</span>
          </div>
        </article>

        <div className="grid gap-4">
          <article className="rounded-2xl border border-black/8 bg-white/55 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">Inventory</h3>
                <p className="mt-1 text-xs text-black/40">Available to purchase</p>
              </div>
              <span
                className={`size-2 rounded-full ${product.stock <= 4 ? 'bg-[var(--amber)]' : 'bg-[var(--sage)]'}`}
              />
            </div>
            <strong className="mt-7 block text-4xl tracking-[-0.05em]">{product.stock}</strong>
            <p className="mt-1 text-xs text-black/40">units in stock</p>
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-black/5">
              <div
                className={`h-full rounded-full ${product.stock <= 4 ? 'bg-[var(--amber)]' : 'bg-[var(--sage)]'}`}
                style={{ width: `${Math.min(100, product.stock * 5)}%` }}
              />
            </div>
            <button
              type="button"
              onClick={onEdit}
              className="mt-5 text-xs font-medium text-[var(--sage)] hover:underline"
            >
              Update inventory
            </button>
          </article>
          <article className="rounded-2xl bg-[var(--sage-dark)] p-6 text-white">
            <p className="font-[var(--mono)] text-[9px] uppercase tracking-[0.15em] text-white/40">
              Listing health
            </p>
            <strong className="mt-4 block text-2xl tracking-[-0.04em]">Strong</strong>
            <p className="mt-2 text-xs leading-5 text-white/50">
              Complete details and clear photography are helping this object convert.
            </p>
            <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[86%] bg-[var(--amber)]" />
            </div>
          </article>
        </div>
      </div>

      <article className="mt-4 overflow-hidden rounded-2xl border border-black/8 bg-white/55">
        <div className="flex items-center justify-between border-b border-black/8 p-5">
          <div>
            <h3 className="font-semibold">Recent orders</h3>
            <p className="mt-1 text-xs text-black/40">Orders containing this product</p>
          </div>
          <span className="text-xs text-black/35">{productOrders.length || 'No'} recent</span>
        </div>
        {productOrders.length ? (
          productOrders.map((order) => (
            <div
              key={order.id}
              className="grid gap-3 border-b border-black/[0.06] p-4 last:border-0 sm:grid-cols-[90px_1fr_130px_90px] sm:items-center"
            >
              <b className="text-xs">{order.id}</b>
              <span>
                <b className="block text-xs font-medium">{order.customer}</b>
                <small className="text-[10px] text-black/40">{order.date}</small>
              </span>
              <Status>{order.status}</Status>
              <strong className="text-xs">${order.total}</strong>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-xs text-black/40">
            Orders for this product will appear here.
          </div>
        )}
      </article>
    </section>
  )
}

function ShopPreviewContent({
  profile,
  products,
  compact,
}: {
  profile: ShopProfile
  products: Product[]
  compact: boolean
}) {
  const liveProducts = products.filter((product) => product.status !== 'Draft').slice(0, 3)

  return (
    <div
      className={`mx-auto min-h-full overflow-hidden bg-[var(--cream)] text-[var(--ink)] shadow-2xl ${compact ? 'max-w-[390px] rounded-[30px] border-[8px] border-[var(--walnut-dark)]' : 'w-full'}`}
    >
      <div className="bg-[var(--walnut)] px-5 py-2 text-center font-[var(--mono)] text-[8px] uppercase tracking-[0.15em] text-white/75">
        {profile.announcement || 'Small-batch objects · Made with intention'}
      </div>
      <header className="flex h-16 items-center justify-between border-b border-black/8 px-5 sm:px-8">
        <span className="flex items-center gap-2.5">
          <b className="grid size-8 place-items-center rounded-full bg-[var(--sage)] text-[10px] text-white">
            NC
          </b>
          <strong className="text-sm tracking-[-0.03em]">{profile.name}</strong>
        </span>
        <nav
          className={`${compact ? 'hidden' : 'flex'} items-center gap-6 font-[var(--mono)] text-[8px] uppercase tracking-wider text-black/50`}
        >
          <span>Objects</span>
          <span>Studio</span>
          <span>Policies</span>
        </nav>
        <span className="rounded-full border border-black/10 px-3 py-2 text-[9px] font-medium">
          Follow
        </span>
      </header>

      <section
        className={`grid overflow-hidden bg-[var(--sage-light)] ${compact ? 'grid-cols-1' : 'min-h-[430px] md:grid-cols-[.82fr_1.18fr]'}`}
      >
        <div
          className={`flex flex-col justify-center p-7 ${compact ? 'min-h-72' : 'p-[clamp(32px,6vw,90px)]'}`}
        >
          <p className="font-[var(--mono)] text-[8px] uppercase tracking-[0.18em] text-[var(--amber)]">
            Independent studio · {profile.location}
          </p>
          <h1
            className={`mt-5 leading-[0.96] font-medium tracking-[-0.06em] ${compact ? 'text-5xl' : 'text-[clamp(48px,7vw,92px)]'}`}
          >
            Objects for
            <br /> a <em className="font-[var(--serif)] font-normal text-[var(--sage)]">
              quiet
            </em>{' '}
            life.
          </h1>
          <p className="mt-6 max-w-md text-sm leading-6 text-black/50">{profile.tagline}</p>
          <span className="mt-7 w-fit rounded-full bg-[var(--walnut)] px-5 py-3 text-[10px] font-medium text-white">
            Explore the collection →
          </span>
        </div>
        <div className={`relative ${compact ? 'h-72' : 'min-h-[430px]'}`}>
          <Image
            src={
              products[0]?.image ??
              'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85'
            }
            alt={`${profile.name} featured object`}
            fill
            unoptimized
            sizes={compact ? '390px' : '60vw'}
            className="object-cover"
          />
        </div>
      </section>

      <section className={`${compact ? 'p-6' : 'px-[clamp(24px,6vw,88px)] py-16'}`}>
        <div className={`${compact ? '' : 'flex items-end justify-between'}`}>
          <div>
            <p className="font-[var(--mono)] text-[8px] uppercase tracking-[0.18em] text-[var(--amber)]">
              The collection
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em]">
              Made to be{' '}
              <em className="font-[var(--serif)] font-normal text-[var(--sage)]">kept.</em>
            </h2>
          </div>
          {!compact && <p className="max-w-xs text-xs leading-5 text-black/45">{profile.story}</p>}
        </div>
        <div className={`mt-8 grid gap-4 ${compact ? 'grid-cols-1' : 'sm:grid-cols-3'}`}>
          {liveProducts.map((product) => (
            <article key={product.id}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[var(--paper)]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  unoptimized
                  sizes={compact ? '330px' : '30vw'}
                  className="object-cover"
                />
              </div>
              <div className="mt-3 flex items-start justify-between gap-3">
                <span>
                  <b className="block text-xs font-medium">{product.name}</b>
                  <small className="text-[9px] text-black/40">{product.category}</small>
                </span>
                <strong className="text-xs text-[var(--amber)]">${product.price}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className={`bg-[var(--sage-dark)] text-white ${compact ? 'p-7' : 'grid grid-cols-2 gap-16 px-[clamp(24px,7vw,100px)] py-16'}`}
      >
        <div>
          <p className="font-[var(--mono)] text-[8px] uppercase tracking-[0.18em] text-[var(--amber)]">
            The studio
          </p>
          <h2 className="mt-4 text-3xl tracking-[-0.05em]">
            About{' '}
            <em className="font-[var(--serif)] font-normal text-[var(--amber)]">{profile.name}</em>
          </h2>
        </div>
        <p className={`${compact ? 'mt-5' : ''} text-xs leading-6 text-white/55`}>
          {profile.story}
        </p>
      </section>

      <footer className="flex flex-col justify-between gap-4 bg-[var(--walnut-dark)] px-6 py-8 text-[10px] text-white/45 sm:flex-row">
        <span>© 2025 {profile.name}</span>
        <span>
          {profile.email} · {profile.instagram}
        </span>
      </footer>
    </div>
  )
}

const settingsCopy: Record<SettingsSection, { title: string; description: string }> = {
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
}

function SettingsDetail({
  section,
  onBack,
  onSave,
}: {
  section: SettingsSection
  onBack: () => void
  onSave: (message: string) => void
}) {
  const copy = settingsCopy[section]
  const fieldClass =
    'h-12 rounded-xl border border-black/10 bg-white/60 px-4 text-sm normal-case tracking-normal outline-none focus:border-[var(--sage)]'
  const labelClass = 'grid gap-2 text-[10px] font-semibold uppercase tracking-wider text-black/45'

  return (
    <section>
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-medium text-black/45 hover:text-black"
      >
        ← All settings
      </button>
      <div className="mt-6">
        <h2 className="text-3xl font-semibold tracking-[-0.045em]">{copy.title}</h2>
        <p className="mt-2 text-sm text-black/45">{copy.description}</p>
      </div>
      <div className="mt-7 max-w-3xl rounded-2xl border border-black/8 bg-white/55 p-5 sm:p-7">
        {section === 'profile' && (
          <div className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                Full name
                <input defaultValue="Avery Morgan" className={fieldClass} />
              </label>
              <label className={labelClass}>
                Account email
                <input type="email" defaultValue="avery@northcommon.co" className={fieldClass} />
              </label>
            </div>
            <div className="rounded-xl border border-black/8 bg-white/45 p-4">
              <p className="text-xs font-semibold">Shop collaborators</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <b className="grid size-9 place-items-center rounded-full bg-[#d8c7a8] text-[10px]">
                    AM
                  </b>
                  <span>
                    <b className="block text-xs">Avery Morgan</b>
                    <small className="text-[10px] text-black/40">Owner · Full access</small>
                  </span>
                </span>
                <a
                  href="mailto:?subject=Invitation to North Common on Form / Function"
                  className="rounded-full border border-black/10 px-4 py-2 text-[10px]"
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
                <input defaultValue="Portland, Oregon" className={fieldClass} />
              </label>
              <label className={labelClass}>
                Default dispatch time
                <select defaultValue="2–3 business days" className={fieldClass}>
                  <option>1 business day</option>
                  <option>2–3 business days</option>
                  <option>3–5 business days</option>
                </select>
              </label>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-black/45">
                Delivery regions
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {['United States', 'Canada', 'United Kingdom'].map((region) => (
                  <label
                    key={region}
                    className="flex items-center gap-3 rounded-xl border border-black/8 bg-white/45 p-4 text-xs"
                  >
                    <input type="checkbox" defaultChecked className="accent-[var(--sage)]" />
                    {region}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
        {section === 'payouts' && (
          <div className="space-y-5">
            <div className="rounded-2xl bg-[var(--sage-dark)] p-6 text-white">
              <p className="font-[var(--mono)] text-[9px] uppercase tracking-wider text-white/40">
                Connected payout account
              </p>
              <div className="mt-5 flex items-end justify-between">
                <span>
                  <b className="block text-lg">Business checking</b>
                  <small className="text-white/45">Ending in 2848 · Verified</small>
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-[9px]">Active</span>
              </div>
            </div>
            <label className={labelClass}>
              Payout schedule
              <select defaultValue="Every Friday" className={fieldClass}>
                <option>Every Friday</option>
                <option>Twice monthly</option>
                <option>Monthly</option>
              </select>
            </label>
            <a
              href="data:text/plain;charset=utf-8,Form%20%2F%20Function%20May%202025%20Marketplace%20Statement"
              download="form-function-may-2025-statement.txt"
              className="flex w-full items-center justify-between rounded-xl border border-black/8 p-4 text-left text-xs hover:bg-white"
            >
              May 2025 marketplace statement <span>Download ↓</span>
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
                className="flex cursor-pointer items-center justify-between gap-5 rounded-xl border border-black/[0.06] bg-white/35 p-4"
              >
                <span>
                  <b className="block text-xs">{title}</b>
                  <small className="mt-1 block text-[10px] text-black/40">{description}</small>
                </span>
                <input type="checkbox" defaultChecked className="accent-[var(--sage)]" />
              </label>
            ))}
          </div>
        )}
        {section === 'support' && (
          <div>
            <label className="flex h-12 items-center gap-3 rounded-xl border border-black/10 bg-white/60 px-4">
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
                  className="rounded-xl border border-black/8 p-4 text-xs open:bg-white"
                >
                  <summary className="cursor-pointer font-medium">{guide}</summary>
                  <p className="mt-3 text-[10px] leading-5 text-black/45">{answer}</p>
                </details>
              ))}
            </div>
            <a
              href="mailto:sellers@formfunction.co"
              className="mt-5 flex items-center justify-between rounded-xl bg-[var(--sage-light)]/55 p-4 text-xs"
            >
              Contact seller support <span>sellers@formfunction.co →</span>
            </a>
          </div>
        )}
        {section !== 'support' && (
          <div className="mt-7 flex justify-end border-t border-black/8 pt-5">
            <button
              type="button"
              onClick={() => onSave(`${copy.title} saved`)}
              className="rounded-full bg-[var(--walnut)] px-5 py-3 text-xs font-medium text-white"
            >
              Save changes
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default function SellerDashboard() {
  const [view, setView] = useState<View>('overview')
  const [mobileNav, setMobileNav] = useState(false)
  const [notifications, setNotifications] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(3)
  const [selectedOrder, setSelectedOrder] = useState<(typeof orders)[number] | null>(null)
  const [messageComposer, setMessageComposer] = useState(false)
  const [settingsSection, setSettingsSection] = useState<SettingsSection | null>(null)
  const [faqEditor, setFaqEditor] = useState(false)
  const [faqQuestion, setFaqQuestion] = useState('')
  const [editor, setEditor] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [products, setProducts] = useState(initialProducts)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null)
  const [storeTab, setStoreTab] = useState<'identity' | 'design' | 'policies'>('identity')
  const [storePreview, setStorePreview] = useState(false)
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [storeAtmosphere, setStoreAtmosphere] = useState('Sage')
  const [shopProfile, setShopProfile] = useState<ShopProfile>({
    name: 'North Common',
    tagline:
      'Small-run objects shaped by honest materials, quiet utility, and the landscapes of the north.',
    story:
      'North Common is an independent studio exploring the useful space between furniture, tools, and everyday ritual. Each object is developed slowly and produced in considered editions.',
    announcement: 'Complimentary shipping on orders over $200',
    location: 'Portland, Oregon',
    email: 'studio@northcommon.co',
    instagram: '@northcommon',
    dispatch: '2–3 business days',
    shippingPolicy:
      'Orders are packed plastic-free and dispatched with tracked delivery within 2–3 business days.',
    returnPolicy:
      'Unused objects may be returned in their original packaging within 14 days of delivery.',
    customOrders: true,
  })
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [toast, setToast] = useState('')

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          (filter === 'All' || product.status === filter) &&
          product.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [filter, products, search],
  )
  const selectedProduct = products.find((product) => product.id === selectedProductId) ?? null

  const updateShop = <K extends keyof ShopProfile>(field: K, value: ShopProfile[K]) => {
    setShopProfile((current) => ({ ...current, [field]: value }))
  }

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2400)
  }

  const selectView = (next: View) => {
    setView(next)
    if (next !== 'products') setSelectedProductId(null)
    if (next !== 'settings') setSettingsSection(null)
    setMobileNav(false)
  }

  const openEditor = (product: Product | null = null) => {
    setEditingProduct(product)
    setEditor(true)
  }

  const closeEditor = () => {
    setEditor(false)
    setEditingProduct(null)
  }

  const saveProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null
    const shouldPublish = submitter?.value === 'publish'
    const name = String(data.get('name') || 'Untitled object')
    const price = Number(data.get('price')) || 0
    const category = String(data.get('category') || 'Objects')
    const stock = Number(data.get('stock')) || 0
    if (editingProduct) {
      setProducts((current) =>
        current.map((product) =>
          product.id === editingProduct.id
            ? {
                ...product,
                name,
                category,
                price,
                stock,
                status: shouldPublish ? 'Live' : product.status,
              }
            : product,
        ),
      )
      showToast(shouldPublish ? 'Listing updated' : 'Product changes saved')
    } else {
      setProducts((current) => [
        {
          id: `NC-${String(current.length + 1).padStart(3, '0')}`,
          name,
          category,
          price,
          stock,
          status: shouldPublish ? 'Live' : 'Draft',
          image:
            'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=500&q=85',
          sales: 0,
          revenue: 0,
          views: 0,
          conversion: 0,
        },
        ...current,
      ])
      showToast(shouldPublish ? 'Product published' : 'Draft product added')
    }
    closeEditor()
    setView('products')
  }

  const deleteProduct = () => {
    if (!pendingDelete) return
    setProducts((current) => current.filter((product) => product.id !== pendingDelete.id))
    if (selectedProductId === pendingDelete.id) setSelectedProductId(null)
    showToast(`${pendingDelete.name} deleted`)
    setPendingDelete(null)
  }

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
    ]
    const csv = rows
      .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(','))
      .join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'form-function-orders.csv'
    link.click()
    URL.revokeObjectURL(url)
    showToast('Order CSV downloaded')
  }

  const copyShopLink = async () => {
    try {
      await navigator.clipboard.writeText('https://formfunction.com/shop/north-common')
      showToast('Shop link copied')
    } catch {
      showToast('Copy unavailable — select the URL above')
    }
  }

  const openNotification = (index: number) => {
    setUnreadNotifications((count) => Math.max(0, count - 1))
    setNotifications(false)
    if (index === 0) {
      setView('orders')
      setSelectedOrder(orders[0])
    } else if (index === 1) {
      setView('products')
      setSelectedProductId('NC-002')
    } else {
      setView('analytics')
    }
  }

  return (
    <main className="min-h-screen bg-[#f2f1eb] text-[#20251f]">
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col bg-[var(--walnut-dark)] text-white transition-transform duration-300 lg:translate-x-0 ${mobileNav ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-[76px] items-center justify-between border-b border-white/10 px-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-sm font-semibold tracking-[-0.03em]"
          >
            <span className="grid size-7 place-items-center rounded-full border border-white/60 font-[var(--serif)] text-base italic text-[var(--amber)]">
              F
            </span>
            <span>form / function</span>
          </Link>
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
            <span className="grid size-10 place-items-center rounded-lg bg-[var(--sage)] text-xs font-semibold">
              NC
            </span>
            <span className="min-w-0 flex-1">
              <b className="block truncate text-sm font-medium">North Common</b>
              <small className="block text-[10px] text-white/45">View storefront</small>
            </span>
            <Icon name="chevron" size={14} />
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-5">
          {nav.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => selectView(item.id)}
              className={`flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm transition ${view === item.id ? 'bg-white/10 text-white' : 'text-white/55 hover:bg-white/5 hover:text-white'}`}
            >
              <Icon name={item.icon} size={17} />
              {item.label}
              {item.id === 'orders' && (
                <span className="ml-auto rounded-full bg-[var(--amber)] px-2 py-0.5 text-[9px] font-bold text-[var(--walnut-dark)]">
                  2
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="m-4 rounded-xl bg-white/[0.06] p-4">
          <p className="text-xs font-medium">Your shop is live</p>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[82%] bg-[var(--amber)]" />
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
            <span className="grid size-9 place-items-center rounded-full bg-[#d8c7a8] text-xs font-semibold text-[var(--walnut)]">
              AM
            </span>
            <span className="flex-1">
              <b className="block text-xs font-medium">Avery Morgan</b>
              <small className="text-[10px] text-white/40">Owner</small>
            </span>
            <span className="text-white/40">•••</span>
          </button>
        </div>
      </aside>

      {mobileNav && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileNav(false)}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
        />
      )}

      <div className="min-h-screen lg:pl-[248px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-black/8 bg-[#f2f1eb]/90 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNav(true)}
              className="grid size-9 place-items-center rounded-full border border-black/10 lg:hidden"
              aria-label="Open menu"
            >
              <Icon name="menu" />
            </button>
            <div>
              <p className="font-[var(--mono)] text-[9px] uppercase tracking-[0.14em] text-black/35">
                Seller workspace
              </p>
              <h1 className="text-lg font-semibold capitalize tracking-[-0.03em]">{view}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden h-9 items-center gap-2 rounded-full border border-black/10 px-4 text-xs font-medium transition hover:bg-white sm:flex"
            >
              <Icon name="eye" size={15} /> View marketplace
            </Link>
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifications((open) => !open)}
                className="relative grid size-9 place-items-center rounded-full border border-black/10 transition hover:bg-white"
                aria-label="Notifications"
              >
                <Icon name="bell" size={17} />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 size-2 rounded-full border-2 border-[#f2f1eb] bg-[var(--amber)]" />
                )}
              </button>
              {notifications && (
                <div className="absolute top-12 right-0 w-80 rounded-2xl border border-black/10 bg-white p-2 shadow-2xl shadow-black/10">
                  <div className="flex items-center justify-between p-3">
                    <b className="text-sm">Notifications</b>
                    <button
                      type="button"
                      onClick={() => setUnreadNotifications(0)}
                      className="text-[10px] text-[var(--sage)]"
                    >
                      Mark all read
                    </button>
                  </div>
                  {[
                    ['New order received', 'Trestle Desk Tray · 8 min ago'],
                    ['Low stock', 'Only 4 Quiet Arc Lamps remain'],
                    ['Payout sent', '$486.68 is on the way'],
                  ].map(([title, copy], index) => (
                    <button
                      type="button"
                      key={title}
                      onClick={() => openNotification(index)}
                      className="flex w-full gap-3 rounded-xl p-3 text-left hover:bg-black/[0.03]"
                    >
                      <span
                        className={`mt-1 size-2 shrink-0 rounded-full ${index < unreadNotifications ? 'bg-[var(--amber)]' : 'bg-black/10'}`}
                      />
                      <span>
                        <b className="block text-xs">{title}</b>
                        <small className="mt-1 block text-[10px] text-black/45">{copy}</small>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => openEditor()}
              className="flex h-9 items-center gap-2 rounded-full bg-[var(--walnut)] px-4 text-xs font-medium text-white transition hover:bg-[var(--walnut-dark)]"
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
                  <p className="font-[var(--mono)] text-[10px] uppercase tracking-[0.16em] text-[var(--amber)]">
                    Tuesday, May 20
                  </p>
                  <h2 className="mt-2 text-[clamp(30px,4vw,48px)] leading-none font-medium tracking-[-0.055em]">
                    Good morning,{' '}
                    <em className="font-[var(--serif)] font-normal text-[var(--sage)]">Avery.</em>
                  </h2>
                  <p className="mt-3 text-sm text-black/45">
                    Your studio has 2 orders waiting for attention.
                  </p>
                </div>
                <select className="h-10 rounded-full border border-black/10 bg-transparent px-4 text-xs outline-none">
                  <option>Last 30 days</option>
                  <option>Last 7 days</option>
                  <option>This year</option>
                </select>
              </section>

              <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ['Gross sales', '$4,862', '+18.4%', 'vs. last period'],
                  ['Orders', '24', '+6', 'vs. last period'],
                  ['Shop views', '3,208', '+12.1%', 'vs. last period'],
                  ['Conversion', '3.8%', '+0.6%', 'vs. last period'],
                ].map(([label, value, change, context], index) => (
                  <article
                    key={label}
                    className="rounded-2xl border border-black/8 bg-white/55 p-5"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-black/45">{label}</p>
                      <span className="font-[var(--mono)] text-[9px] text-black/25">
                        0{index + 1}
                      </span>
                    </div>
                    <strong className="mt-7 block text-3xl tracking-[-0.05em]">{value}</strong>
                    <p className="mt-2 text-[10px]">
                      <span className="font-semibold text-[var(--sage)]">{change}</span>{' '}
                      <span className="text-black/35">{context}</span>
                    </p>
                  </article>
                ))}
              </section>

              <section className="grid gap-4 lg:grid-cols-[1.45fr_.75fr]">
                <article className="rounded-2xl border border-black/8 bg-white/55 p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold tracking-[-0.02em]">Sales overview</h3>
                      <p className="mt-1 text-xs text-black/40">Revenue over the last 30 days</p>
                    </div>
                    <b className="text-sm">$4,862.00</b>
                  </div>
                  <div className="mt-8 grid h-56 grid-cols-12 items-end gap-1.5 border-b border-black/10 sm:gap-3">
                    {[32, 46, 38, 58, 48, 72, 63, 88, 68, 78, 94, 84].map((height, index) => (
                      <div key={index} className="group relative h-full">
                        <div
                          className="absolute inset-x-0 bottom-0 rounded-t-sm bg-[var(--sage)]/75 transition hover:bg-[var(--amber)]"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex justify-between font-[var(--mono)] text-[8px] uppercase tracking-wider text-black/30">
                    <span>Apr 21</span>
                    <span>Apr 28</span>
                    <span>May 05</span>
                    <span>May 12</span>
                    <span>May 20</span>
                  </div>
                </article>
                <article className="rounded-2xl bg-[var(--sage-dark)] p-6 text-white">
                  <p className="font-[var(--mono)] text-[9px] uppercase tracking-[0.15em] text-white/40">
                    Next payout
                  </p>
                  <strong className="mt-6 block text-4xl tracking-[-0.05em]">$1,284.60</strong>
                  <p className="mt-2 text-xs text-white/45">Expected Friday, May 23</p>
                  <div className="mt-8 space-y-3 border-t border-white/10 pt-5 text-xs">
                    <p className="flex justify-between">
                      <span className="text-white/45">Gross sales</span>
                      <b>$1,396.30</b>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-white/45">Marketplace fee</span>
                      <b>−$111.70</b>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => selectView('analytics')}
                    className="mt-7 flex w-full items-center justify-between rounded-full border border-white/15 px-4 py-3 text-xs hover:bg-white/5"
                  >
                    View payout details <Icon name="arrow" size={15} />
                  </button>
                </article>
              </section>

              <section className="grid gap-4 lg:grid-cols-[1.45fr_.75fr]">
                <article className="rounded-2xl border border-black/8 bg-white/55">
                  <div className="flex items-center justify-between border-b border-black/8 p-5">
                    <div>
                      <h3 className="font-semibold">Recent orders</h3>
                      <p className="mt-1 text-xs text-black/40">Orders requiring your attention</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => selectView('orders')}
                      className="text-xs font-medium text-[var(--sage)] hover:underline"
                    >
                      View all
                    </button>
                  </div>
                  <div className="divide-y divide-black/[0.06]">
                    {orders.slice(0, 3).map((order) => (
                      <button
                        type="button"
                        key={order.id}
                        onClick={() => selectView('orders')}
                        className="grid w-full grid-cols-[1fr_auto] items-center gap-4 p-4 text-left hover:bg-white sm:grid-cols-[90px_1fr_110px_90px]"
                      >
                        <b className="text-xs">{order.id}</b>
                        <span>
                          <b className="block text-xs font-medium">{order.customer}</b>
                          <small className="text-[10px] text-black/40">{order.item}</small>
                        </span>
                        <Status>{order.status}</Status>
                        <strong className="text-right text-xs">${order.total}</strong>
                      </button>
                    ))}
                  </div>
                </article>
                <article className="rounded-2xl border border-black/8 bg-white/55 p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Shop checklist</h3>
                    <span className="text-xs text-black/35">4 of 6</span>
                  </div>
                  <div className="mt-5 space-y-1">
                    {[
                      ['Add your studio story', true],
                      ['Publish your first product', true],
                      ['Set shipping profiles', true],
                      ['Connect payout details', true],
                      ['Add a shop banner', false],
                      ['Invite a collaborator', false],
                    ].map(([label, done]) => (
                      <button
                        type="button"
                        key={String(label)}
                        onClick={() => !done && selectView('store')}
                        className="flex w-full items-center gap-3 rounded-lg p-2 text-left text-xs hover:bg-black/[0.03]"
                      >
                        <span
                          className={`grid size-5 place-items-center rounded-full border text-[10px] ${done ? 'border-[var(--sage)] bg-[var(--sage)] text-white' : 'border-black/15'}`}
                        >
                          {done ? '✓' : ''}
                        </span>
                        <span className={done ? 'text-black/40 line-through' : ''}>{label}</span>
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
              <ProductDetail
                product={selectedProduct}
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
                    <p className="mt-2 text-sm text-black/45">
                      {products.length} objects · $
                      {products.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()} total
                      revenue
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openEditor()}
                    className="flex h-10 items-center justify-center gap-2 rounded-full bg-[var(--walnut)] px-5 text-xs font-medium text-white"
                  >
                    <Icon name="plus" size={15} /> New product
                  </button>
                </div>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-1 overflow-x-auto rounded-full border border-black/8 bg-white/40 p-1">
                    {['All', 'Live', 'Draft', 'Low stock'].map((item) => (
                      <button
                        type="button"
                        key={item}
                        onClick={() => setFilter(item)}
                        className={`shrink-0 rounded-full px-3 py-2 text-[10px] font-medium ${filter === item ? 'bg-[var(--sage)] text-white' : 'text-black/45 hover:text-black'}`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                  <label className="flex h-10 items-center gap-2 rounded-full border border-black/10 bg-white/40 px-4 sm:w-64">
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
                        className="group overflow-hidden rounded-2xl border border-black/8 bg-white/55 transition hover:-translate-y-0.5 hover:border-[var(--sage)]/40 hover:shadow-xl hover:shadow-black/5"
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedProductId(product.id)}
                          className="relative block aspect-[4/3] w-full overflow-hidden bg-[#ddd7ca] text-left"
                          aria-label={`View details for ${product.name}`}
                        >
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            unoptimized
                            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            className="object-cover transition duration-500 group-hover:scale-[1.025]"
                          />
                          <span className="absolute top-3 left-3">
                            <Status>{product.status}</Status>
                          </span>
                          <span className="absolute right-3 bottom-3 rounded-full bg-[var(--cream)]/90 px-3 py-1.5 text-[10px] font-semibold backdrop-blur">
                            ${product.price}
                          </span>
                        </button>
                        <div className="p-5">
                          <button
                            type="button"
                            onClick={() => setSelectedProductId(product.id)}
                            className="w-full text-left"
                          >
                            <p className="font-[var(--mono)] text-[8px] uppercase tracking-[0.15em] text-black/35">
                              {product.id} · {product.category}
                            </p>
                            <h3 className="mt-2 text-lg font-semibold tracking-[-0.035em]">
                              {product.name}
                            </h3>
                          </button>
                          <div className="mt-5 grid grid-cols-3 border-y border-black/[0.07] py-4 text-xs">
                            <span>
                              <b className="block">{product.sales}</b>
                              <small className="text-[9px] text-black/35">Sold</small>
                            </span>
                            <span>
                              <b className="block">${product.revenue.toLocaleString()}</b>
                              <small className="text-[9px] text-black/35">Revenue</small>
                            </span>
                            <span>
                              <b className={product.stock <= 4 ? 'text-[var(--amber)]' : ''}>
                                {product.stock}
                              </b>
                              <small className="block text-[9px] text-black/35">In stock</small>
                            </span>
                          </div>
                          <div className="mt-4 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedProductId(product.id)}
                              className="flex h-9 flex-1 items-center justify-center gap-2 rounded-full bg-[var(--sage)] text-[10px] font-medium text-white"
                            >
                              View details <Icon name="arrow" size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => openEditor(product)}
                              className="grid size-9 place-items-center rounded-full border border-black/10 text-[10px] hover:bg-white"
                              aria-label={`Edit ${product.name}`}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setPendingDelete(product)}
                              className="grid size-9 place-items-center rounded-full border border-black/10 text-black/40 transition hover:border-[#a94b3f]/25 hover:bg-[#a94b3f]/5 hover:text-[#934339]"
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
                  <div className="mt-5 rounded-2xl border border-dashed border-black/10 bg-white/35 p-12 text-center">
                    <span className="mx-auto grid size-11 place-items-center rounded-full bg-[var(--sage-light)] text-[var(--sage-dark)]">
                      <Icon name="box" />
                    </span>
                    <p className="mt-4 text-sm font-medium">No products found</p>
                    <p className="mt-1 text-xs text-black/40">Try a different search or status.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearch('')
                        setFilter('All')
                      }}
                      className="mt-4 text-xs font-medium text-[var(--sage)] hover:underline"
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
              <p className="mt-2 text-sm text-black/45">Track, pack, and dispatch every order.</p>
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {[
                  ['Needs attention', '2', 'Ready to process'],
                  ['Shipping today', '1', 'Label and tracking due'],
                  ['Completed this month', '18', '$3,944 fulfilled'],
                ].map(([label, value, copy], index) => (
                  <article
                    key={label}
                    className={`rounded-2xl border p-5 ${index === 0 ? 'border-[var(--amber)]/25 bg-[#f5e5c9]/45' : 'border-black/8 bg-white/55'}`}
                  >
                    <p className="text-xs text-black/45">{label}</p>
                    <strong className="mt-4 block text-3xl tracking-[-0.05em]">{value}</strong>
                    <small className="mt-1 block text-[10px] text-black/35">{copy}</small>
                  </article>
                ))}
              </div>
              <div className="mt-4 overflow-hidden rounded-2xl border border-black/8 bg-white/55">
                <div className="flex items-center justify-between border-b border-black/8 p-5">
                  <div>
                    <h3 className="font-semibold">All orders</h3>
                    <p className="mt-1 text-xs text-black/40">Newest orders appear first</p>
                  </div>
                  <button
                    type="button"
                    onClick={exportOrders}
                    className="rounded-full border border-black/10 px-4 py-2 text-[10px] hover:bg-white"
                  >
                    Export
                  </button>
                </div>
                {orders.map((order) => (
                  <article
                    key={order.id}
                    className="grid gap-4 border-b border-black/[0.06] p-5 last:border-0 sm:grid-cols-[90px_1fr_140px_100px_auto] sm:items-center"
                  >
                    <b className="text-xs">{order.id}</b>
                    <div>
                      <p className="text-sm font-medium">{order.customer}</p>
                      <small className="text-[10px] text-black/40">
                        {order.item} · {order.date}
                      </small>
                    </div>
                    <Status>{order.status}</Status>
                    <strong className="text-xs">${order.total}.00</strong>
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="rounded-full border border-black/10 px-4 py-2 text-[10px] hover:bg-white"
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
              <p className="mt-2 text-sm text-black/45">
                Understand what people discover, save, and buy.
              </p>
              <div className="mt-7 grid gap-4 lg:grid-cols-3">
                {[
                  ['Revenue', '$12,840', 'This quarter'],
                  ['Average order', '$202', 'Across 63 orders'],
                  ['Returning customers', '28%', 'Up 4.2%'],
                ].map(([label, value, copy]) => (
                  <article
                    key={label}
                    className="rounded-2xl border border-black/8 bg-white/55 p-6"
                  >
                    <p className="text-xs text-black/40">{label}</p>
                    <strong className="mt-5 block text-4xl tracking-[-0.05em]">{value}</strong>
                    <small className="mt-2 block text-[10px] text-[var(--sage)]">{copy}</small>
                  </article>
                ))}
              </div>
              <div className="mt-4 grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
                <article className="rounded-2xl border border-black/8 bg-white/55 p-6">
                  <h3 className="font-semibold">Discovery</h3>
                  <p className="mt-1 text-xs text-black/40">Views by source</p>
                  <div className="mt-10 space-y-5">
                    {[
                      ['Marketplace search', 72],
                      ['Collections', 54],
                      ['Direct', 38],
                      ['Social', 24],
                    ].map(([label, width]) => (
                      <div key={String(label)}>
                        <div className="mb-2 flex justify-between text-xs">
                          <span>{label}</span>
                          <b>{width}%</b>
                        </div>
                        <div className="h-2 rounded-full bg-black/5">
                          <div
                            className="h-full rounded-full bg-[var(--sage)]"
                            style={{ width: `${width}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
                {products[0] ? (
                  <article className="rounded-2xl border border-black/8 bg-white/55 p-6">
                    <h3 className="font-semibold">Top product</h3>
                    <div className="relative mt-5 aspect-[4/3] overflow-hidden rounded-xl">
                      <Image
                        src={products[0].image}
                        alt={products[0].name}
                        fill
                        unoptimized
                        sizes="400px"
                        className="object-cover"
                      />
                    </div>
                    <h4 className="mt-4 text-sm font-medium">{products[0].name}</h4>
                    <p className="mt-1 text-xs text-black/40">
                      {products[0].sales} sold · ${products[0].revenue.toLocaleString()} revenue
                    </p>
                  </article>
                ) : (
                  <article className="grid min-h-72 place-items-center rounded-2xl border border-dashed border-black/10 bg-white/35 p-6 text-center">
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
                  <p className="mt-2 text-sm text-black/45">
                    Build the story customers see before they decide to buy.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStorePreview(true)}
                  className="flex h-10 items-center gap-2 rounded-full bg-[var(--walnut)] px-5 text-xs font-medium text-white transition hover:bg-[var(--walnut-dark)]"
                >
                  <Icon name="eye" size={15} /> Preview shop
                </button>
              </div>

              <div className="mt-7 grid gap-5 xl:grid-cols-[1fr_290px]">
                <div className="overflow-hidden rounded-2xl border border-black/8 bg-white/55">
                  <div className="flex overflow-x-auto border-b border-black/8 px-3 pt-3">
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
                            ? 'border-[var(--amber)] text-black'
                            : 'border-transparent text-black/40 hover:text-black'
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
                        <p className="mt-1 text-xs text-black/40">
                          Give customers enough context to remember and trust your studio.
                        </p>
                      </div>
                      <div className="flex flex-col gap-5 rounded-2xl bg-[var(--paper)]/70 p-5 sm:flex-row sm:items-center">
                        <input
                          id="shop-logo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) =>
                            event.target.files?.[0] && showToast('New shop logo selected')
                          }
                        />
                        <label
                          htmlFor="shop-logo-upload"
                          className="grid size-24 shrink-0 cursor-pointer place-items-center rounded-2xl border border-dashed border-black/15 bg-[var(--sage)] text-xl font-semibold text-white transition hover:border-[var(--amber)]"
                        >
                          NC
                        </label>
                        <div>
                          <b className="text-sm">Shop logo</b>
                          <p className="mt-1 text-xs leading-5 text-black/45">
                            Use a simple mark that stays clear at small sizes. Square PNG or JPG, at
                            least 600 × 600px.
                          </p>
                          <label
                            htmlFor="shop-logo-upload"
                            className="mt-3 block cursor-pointer text-xs font-medium text-[var(--sage)] hover:underline"
                          >
                            Replace image
                          </label>
                        </div>
                      </div>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <label className="grid gap-2 text-[10px] font-semibold uppercase tracking-wider text-black/45">
                          Shop name
                          <input
                            value={shopProfile.name}
                            maxLength={40}
                            onChange={(event) => updateShop('name', event.target.value)}
                            className="h-12 rounded-xl border border-black/10 bg-white/60 px-4 text-sm normal-case tracking-normal outline-none focus:border-[var(--sage)]"
                          />
                        </label>
                        <label className="grid gap-2 text-[10px] font-semibold uppercase tracking-wider text-black/45">
                          Studio location
                          <input
                            value={shopProfile.location}
                            onChange={(event) => updateShop('location', event.target.value)}
                            className="h-12 rounded-xl border border-black/10 bg-white/60 px-4 text-sm normal-case tracking-normal outline-none focus:border-[var(--sage)]"
                          />
                        </label>
                      </div>
                      <label className="grid gap-2 text-[10px] font-semibold uppercase tracking-wider text-black/45">
                        Short introduction
                        <textarea
                          value={shopProfile.tagline}
                          maxLength={180}
                          rows={3}
                          onChange={(event) => updateShop('tagline', event.target.value)}
                          className="resize-none rounded-xl border border-black/10 bg-white/60 p-4 text-sm leading-6 normal-case tracking-normal outline-none focus:border-[var(--sage)]"
                        />
                        <small className="text-right text-[9px] font-normal tracking-normal text-black/30">
                          {shopProfile.tagline.length}/180
                        </small>
                      </label>
                      <label className="grid gap-2 text-[10px] font-semibold uppercase tracking-wider text-black/45">
                        Full studio story
                        <textarea
                          value={shopProfile.story}
                          maxLength={700}
                          rows={6}
                          onChange={(event) => updateShop('story', event.target.value)}
                          className="resize-none rounded-xl border border-black/10 bg-white/60 p-4 text-sm leading-6 normal-case tracking-normal outline-none focus:border-[var(--sage)]"
                        />
                      </label>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <label className="grid gap-2 text-[10px] font-semibold uppercase tracking-wider text-black/45">
                          Customer contact email
                          <input
                            type="email"
                            value={shopProfile.email}
                            onChange={(event) => updateShop('email', event.target.value)}
                            className="h-12 rounded-xl border border-black/10 bg-white/60 px-4 text-sm normal-case tracking-normal outline-none focus:border-[var(--sage)]"
                          />
                        </label>
                        <label className="grid gap-2 text-[10px] font-semibold uppercase tracking-wider text-black/45">
                          Instagram
                          <input
                            value={shopProfile.instagram}
                            onChange={(event) => updateShop('instagram', event.target.value)}
                            className="h-12 rounded-xl border border-black/10 bg-white/60 px-4 text-sm normal-case tracking-normal outline-none focus:border-[var(--sage)]"
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  {storeTab === 'design' && (
                    <div className="space-y-7 p-5 sm:p-7">
                      <div>
                        <h3 className="font-semibold">Shop look & merchandising</h3>
                        <p className="mt-1 text-xs text-black/40">
                          Set the tone and choose what customers discover first.
                        </p>
                      </div>
                      <input
                        id="shop-banner-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) =>
                          event.target.files?.[0] && showToast('New shop banner selected')
                        }
                      />
                      <label
                        htmlFor="shop-banner-upload"
                        className="relative block aspect-[16/6] w-full cursor-pointer overflow-hidden rounded-2xl border border-dashed border-black/15 bg-[var(--paper)] text-left transition hover:border-[var(--sage)]"
                      >
                        <Image
                          src={products[0]?.image ?? initialProducts[0].image}
                          alt="Current shop banner"
                          fill
                          unoptimized
                          sizes="900px"
                          className="object-cover opacity-65"
                        />
                        <span className="absolute inset-0 grid place-items-center bg-black/15 text-center text-white">
                          <span>
                            <span className="mx-auto grid size-10 place-items-center rounded-full bg-white/90 text-black">
                              <Icon name="upload" />
                            </span>
                            <b className="mt-3 block text-xs">Replace shop banner</b>
                            <small className="mt-1 block text-[10px] text-white/70">
                              1800 × 900px recommended
                            </small>
                          </span>
                        </span>
                      </label>
                      <label className="grid gap-2 text-[10px] font-semibold uppercase tracking-wider text-black/45">
                        Announcement bar
                        <input
                          value={shopProfile.announcement}
                          maxLength={80}
                          onChange={(event) => updateShop('announcement', event.target.value)}
                          className="h-12 rounded-xl border border-black/10 bg-white/60 px-4 text-sm normal-case tracking-normal outline-none focus:border-[var(--sage)]"
                        />
                      </label>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-black/45">
                          Shop atmosphere
                        </p>
                        <div className="mt-3 flex gap-3">
                          {[
                            ['Sage', '#637363'],
                            ['Walnut', '#4a3026'],
                            ['Amber', '#d58b2b'],
                          ].map(([label, color]) => (
                            <button
                              key={label}
                              type="button"
                              onClick={() => setStoreAtmosphere(label)}
                              className={`flex items-center gap-2 rounded-full border px-3 py-2 text-[10px] ${storeAtmosphere === label ? 'border-[var(--sage)] bg-[var(--sage-light)]/45' : 'border-black/10'}`}
                            >
                              <span
                                className="size-4 rounded-full"
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
                            <p className="mt-1 text-xs text-black/40">
                              Your first three live products appear in the preview.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => selectView('products')}
                            className="text-xs text-[var(--sage)] hover:underline"
                          >
                            Manage products
                          </button>
                        </div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                          {products.slice(0, 3).map((product, index) => (
                            <article
                              key={product.id}
                              className="rounded-xl border border-black/8 bg-white/50 p-3"
                            >
                              <div className="relative aspect-square overflow-hidden rounded-lg">
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  unoptimized
                                  sizes="220px"
                                  className="object-cover"
                                />
                                <span className="absolute top-2 left-2 grid size-5 place-items-center rounded-full bg-[var(--walnut)] text-[8px] text-white">
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
                        <p className="mt-1 text-xs text-black/40">
                          Clear expectations reduce questions and make customers more comfortable
                          buying.
                        </p>
                      </div>
                      <label className="grid gap-2 text-[10px] font-semibold uppercase tracking-wider text-black/45">
                        Typical dispatch time
                        <select
                          value={shopProfile.dispatch}
                          onChange={(event) => updateShop('dispatch', event.target.value)}
                          className="h-12 rounded-xl border border-black/10 bg-white/60 px-4 text-sm normal-case tracking-normal outline-none focus:border-[var(--sage)]"
                        >
                          <option>1 business day</option>
                          <option>2–3 business days</option>
                          <option>3–5 business days</option>
                          <option>Made to order · 2–4 weeks</option>
                        </select>
                      </label>
                      <label className="grid gap-2 text-[10px] font-semibold uppercase tracking-wider text-black/45">
                        Shipping policy
                        <textarea
                          value={shopProfile.shippingPolicy}
                          rows={4}
                          onChange={(event) => updateShop('shippingPolicy', event.target.value)}
                          className="resize-none rounded-xl border border-black/10 bg-white/60 p-4 text-sm leading-6 normal-case tracking-normal outline-none focus:border-[var(--sage)]"
                        />
                      </label>
                      <label className="grid gap-2 text-[10px] font-semibold uppercase tracking-wider text-black/45">
                        Returns & exchanges
                        <textarea
                          value={shopProfile.returnPolicy}
                          rows={4}
                          onChange={(event) => updateShop('returnPolicy', event.target.value)}
                          className="resize-none rounded-xl border border-black/10 bg-white/60 p-4 text-sm leading-6 normal-case tracking-normal outline-none focus:border-[var(--sage)]"
                        />
                      </label>
                      <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-[var(--sage-light)]/55 p-4 text-xs leading-5">
                        <input
                          type="checkbox"
                          checked={shopProfile.customOrders}
                          onChange={(event) => updateShop('customOrders', event.target.checked)}
                          className="mt-1 accent-[var(--sage)]"
                        />
                        <span>
                          <b className="block">Accept custom order enquiries</b>
                          <small className="text-black/45">
                            Customers can contact you about dimensions, finishes, or small
                            commissions.
                          </small>
                        </span>
                      </label>
                      <div className="rounded-xl border border-black/8 bg-white/45 p-4">
                        <div className="flex items-center justify-between">
                          <span>
                            <b className="block text-xs">Frequently asked questions</b>
                            <small className="text-[10px] text-black/40">
                              Materials, care, packaging, and lead times
                            </small>
                          </span>
                          <button
                            type="button"
                            onClick={() => setFaqEditor(true)}
                            className="rounded-full border border-black/10 px-4 py-2 text-[10px] hover:bg-white"
                          >
                            Add question
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-black/8 bg-white/35 p-5">
                    <span className="text-[10px] text-black/35">
                      Changes appear instantly in preview
                    </span>
                    <button
                      type="button"
                      onClick={() => showToast('Storefront changes saved')}
                      className="rounded-full bg-[var(--walnut)] px-5 py-3 text-xs font-medium text-white"
                    >
                      Save storefront
                    </button>
                  </div>
                </div>

                <aside className="space-y-4">
                  <article className="rounded-2xl bg-[var(--sage-dark)] p-6 text-white">
                    <div className="flex items-center justify-between">
                      <p className="font-[var(--mono)] text-[9px] uppercase tracking-[0.15em] text-white/40">
                        Shop readiness
                      </p>
                      <b className="text-sm text-[var(--amber)]">88%</b>
                    </div>
                    <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[88%] bg-[var(--amber)]" />
                    </div>
                    <div className="mt-5 space-y-3 text-xs">
                      {[
                        ['Identity & story', true],
                        ['Contact details', true],
                        ['Shipping & returns', true],
                        ['Shop banner', false],
                        ['3 featured products', true],
                      ].map(([label, done]) => (
                        <p key={String(label)} className="flex items-center gap-2">
                          <span
                            className={`grid size-4 place-items-center rounded-full text-[8px] ${
                              done
                                ? 'bg-white/15 text-white'
                                : 'border border-white/20 text-white/30'
                            }`}
                          >
                            {done ? '✓' : ''}
                          </span>
                          <span className={done ? 'text-white/65' : 'text-white/35'}>{label}</span>
                        </p>
                      ))}
                    </div>
                  </article>
                  <article className="rounded-2xl border border-black/8 bg-white/55 p-5">
                    <h3 className="text-sm font-semibold">Public shop URL</h3>
                    <p className="mt-2 break-all font-[var(--mono)] text-[9px] leading-5 text-black/40">
                      formfunction.com/shop/north-common
                    </p>
                    <button
                      type="button"
                      onClick={copyShopLink}
                      className="mt-4 w-full rounded-full border border-black/10 py-2.5 text-[10px] font-medium hover:bg-white"
                    >
                      Copy shop link
                    </button>
                  </article>
                  <article className="rounded-2xl border border-[var(--amber)]/20 bg-[#f5e5c9]/45 p-5">
                    <p className="text-xs font-semibold">A complete shop converts better.</p>
                    <p className="mt-2 text-[10px] leading-5 text-black/45">
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
              <SettingsDetail
                section={settingsSection}
                onBack={() => setSettingsSection(null)}
                onSave={showToast}
              />
            ) : (
              <section>
                <h2 className="text-3xl font-semibold tracking-[-0.045em]">Settings</h2>
                <p className="mt-2 text-sm text-black/45">
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
                      className="flex items-center justify-between rounded-2xl border border-black/8 bg-white/55 p-5 text-left transition hover:border-[var(--sage)] hover:bg-white"
                    >
                      <span>
                        <b className="block text-sm">{title}</b>
                        <small className="mt-1 block text-xs text-black/40">{copy}</small>
                      </span>
                      <Icon name="chevron" size={16} />
                    </button>
                  ))}
                </div>
              </section>
            ))}
        </div>
      </div>

      {selectedOrder && (
        <div
          className="fixed inset-0 z-[76] flex justify-end bg-black/30 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Order ${selectedOrder.id}`}
        >
          <button
            type="button"
            className="absolute inset-0"
            onClick={() => {
              setSelectedOrder(null)
              setMessageComposer(false)
            }}
            aria-label="Close order details"
          />
          <aside className="relative flex h-full w-full max-w-lg flex-col overflow-y-auto bg-[var(--cream)] shadow-2xl">
            <header className="sticky top-0 z-10 flex h-[76px] items-center justify-between border-b border-black/10 bg-[var(--cream)] px-6">
              <div>
                <p className="font-[var(--mono)] text-[9px] uppercase tracking-wider text-[var(--amber)]">
                  Order detail
                </p>
                <h2 className="text-lg font-semibold">{selectedOrder.id}</h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedOrder(null)
                  setMessageComposer(false)
                }}
                className="grid size-9 place-items-center rounded-full border border-black/10"
                aria-label="Close order"
              >
                <Icon name="close" />
              </button>
            </header>
            <div className="flex-1 space-y-5 p-6">
              <div className="flex items-center justify-between rounded-2xl bg-[var(--sage-light)]/55 p-5">
                <span>
                  <small className="block text-[10px] text-black/40">Current status</small>
                  <b className="mt-1 block text-sm">{selectedOrder.status}</b>
                </span>
                <Status>{selectedOrder.status}</Status>
              </div>
              <article className="rounded-2xl border border-black/8 bg-white/55 p-5">
                <h3 className="text-sm font-semibold">Customer</h3>
                <p className="mt-4 text-sm">{selectedOrder.customer}</p>
                <p className="mt-1 text-xs text-black/40">
                  {selectedOrder.customer.toLowerCase().replace(' ', '.')}@example.com
                </p>
                <p className="mt-4 text-xs leading-5 text-black/50">
                  1847 SE Alder Street
                  <br />
                  Portland, OR 97214
                  <br />
                  United States
                </p>
              </article>
              <article className="rounded-2xl border border-black/8 bg-white/55 p-5">
                <h3 className="text-sm font-semibold">Items</h3>
                <div className="mt-4 flex items-center justify-between border-b border-black/8 pb-4">
                  <span>
                    <b className="block text-xs">{selectedOrder.item}</b>
                    <small className="text-[10px] text-black/40">Standard finish · Qty 1</small>
                  </span>
                  <strong className="text-xs">${selectedOrder.total}.00</strong>
                </div>
                <div className="mt-4 space-y-2 text-xs">
                  <p className="flex justify-between">
                    <span className="text-black/40">Shipping</span>
                    <b>Complimentary</b>
                  </p>
                  <p className="flex justify-between text-sm">
                    <span>Total</span>
                    <b>${selectedOrder.total}.00</b>
                  </p>
                </div>
              </article>
              <article className="rounded-2xl border border-black/8 bg-white/55 p-5">
                <h3 className="text-sm font-semibold">Order timeline</h3>
                <div className="mt-4 space-y-4 text-xs">
                  {[
                    ['Order received', selectedOrder.date],
                    ['Payment confirmed', 'A few moments later'],
                    ['Awaiting fulfilment', 'Current step'],
                  ].map(([event, date], index) => (
                    <p key={event} className="flex gap-3">
                      <span
                        className={`mt-0.5 size-2 rounded-full ${index === 2 ? 'bg-[var(--amber)]' : 'bg-[var(--sage)]'}`}
                      />
                      <span>
                        <b className="block">{event}</b>
                        <small className="text-[10px] text-black/35">{date}</small>
                      </span>
                    </p>
                  ))}
                </div>
              </article>
              {messageComposer && (
                <form
                  className="rounded-2xl border border-[var(--sage)]/20 bg-[var(--sage-light)]/45 p-5"
                  onSubmit={(event) => {
                    event.preventDefault()
                    showToast(`Message sent to ${selectedOrder.customer}`)
                    setMessageComposer(false)
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Message {selectedOrder.customer}</h3>
                    <button
                      type="button"
                      onClick={() => setMessageComposer(false)}
                      className="text-[10px] text-black/40"
                    >
                      Cancel
                    </button>
                  </div>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write an order update…"
                    className="mt-4 w-full resize-none rounded-xl border border-black/10 bg-white/70 p-3 text-xs leading-5 outline-none focus:border-[var(--sage)]"
                  />
                  <button
                    type="submit"
                    className="mt-3 rounded-full bg-[var(--sage)] px-4 py-2.5 text-[10px] font-medium text-white"
                  >
                    Send message
                  </button>
                </form>
              )}
            </div>
            <footer className="sticky bottom-0 grid grid-cols-2 gap-2 border-t border-black/10 bg-[var(--cream)] p-5">
              <button
                type="button"
                onClick={() => setMessageComposer(true)}
                className="rounded-full border border-black/10 px-4 py-3 text-xs font-medium"
              >
                Message customer
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast(`Shipping workflow started for ${selectedOrder.id}`)
                  setSelectedOrder({ ...selectedOrder, status: 'Shipped' })
                }}
                className="rounded-full bg-[var(--walnut)] px-4 py-3 text-xs font-medium text-white"
              >
                Create shipping label
              </button>
            </footer>
          </aside>
        </div>
      )}

      {faqEditor && (
        <div
          className="fixed inset-0 z-[78] grid place-items-center bg-black/35 p-5 backdrop-blur-sm"
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
            className="relative w-full max-w-lg rounded-3xl bg-[var(--cream)] p-6 shadow-2xl"
            onSubmit={(event) => {
              event.preventDefault()
              showToast('FAQ added to your storefront')
              setFaqQuestion('')
              setFaqEditor(false)
            }}
          >
            <p className="font-[var(--mono)] text-[9px] uppercase tracking-wider text-[var(--amber)]">
              Storefront FAQ
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">Add a question</h2>
            <label className="mt-6 grid gap-2 text-[10px] font-semibold uppercase tracking-wider text-black/45">
              Question
              <input
                required
                value={faqQuestion}
                onChange={(event) => setFaqQuestion(event.target.value)}
                placeholder="How should I care for this object?"
                className="h-12 rounded-xl border border-black/10 bg-white/60 px-4 text-sm normal-case tracking-normal outline-none focus:border-[var(--sage)]"
              />
            </label>
            <label className="mt-5 grid gap-2 text-[10px] font-semibold uppercase tracking-wider text-black/45">
              Answer
              <textarea
                required
                rows={5}
                placeholder="Share a clear, useful answer…"
                className="resize-none rounded-xl border border-black/10 bg-white/60 p-4 text-sm leading-6 normal-case tracking-normal outline-none focus:border-[var(--sage)]"
              />
            </label>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setFaqEditor(false)}
                className="rounded-full border border-black/10 px-5 py-3 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-[var(--walnut)] px-5 py-3 text-xs font-medium text-white"
              >
                Add question
              </button>
            </div>
          </form>
        </div>
      )}

      {storePreview && (
        <div
          className="fixed inset-0 z-[75] flex flex-col bg-[#deddd6]"
          role="dialog"
          aria-modal="true"
          aria-label="Shop preview"
        >
          <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-black/10 bg-[var(--cream)] px-4 sm:px-6">
            <div>
              <p className="font-[var(--mono)] text-[8px] uppercase tracking-[0.15em] text-[var(--amber)]">
                Live shop preview
              </p>
              <h2 className="mt-1 text-sm font-semibold">{shopProfile.name}</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden rounded-full border border-black/10 bg-white/50 p-1 sm:flex">
                {(['desktop', 'mobile'] as const).map((device) => (
                  <button
                    type="button"
                    key={device}
                    onClick={() => setPreviewDevice(device)}
                    className={`rounded-full px-4 py-2 text-[10px] capitalize ${
                      previewDevice === device
                        ? 'bg-[var(--sage)] text-white'
                        : 'text-black/40 hover:text-black'
                    }`}
                  >
                    {device}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setStorePreview(false)}
                className="grid size-9 place-items-center rounded-full border border-black/10 bg-white/50 hover:bg-white"
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
            />
          </div>
        </div>
      )}

      {editor && (
        <div
          className="fixed inset-0 z-[70] flex justify-end bg-black/30 backdrop-blur-sm"
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
            className="relative flex h-full w-full max-w-xl flex-col overflow-y-auto bg-[var(--cream)] shadow-2xl"
          >
            <header className="sticky top-0 z-10 flex h-[76px] items-center justify-between border-b border-black/10 bg-[var(--cream)] px-6">
              <div>
                <p className="font-[var(--mono)] text-[9px] uppercase tracking-wider text-[var(--amber)]">
                  Catalog
                </p>
                <h2 className="text-lg font-semibold">
                  {editingProduct ? `Edit ${editingProduct.name}` : 'Add a new product'}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeEditor}
                className="grid size-9 place-items-center rounded-full border border-black/10"
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
                className="grid aspect-[16/8] w-full cursor-pointer place-items-center rounded-2xl border border-dashed border-black/15 bg-white/45 text-center hover:border-[var(--sage)]"
              >
                <span>
                  <span className="mx-auto grid size-11 place-items-center rounded-full bg-[var(--sage-light)] text-[var(--sage-dark)]">
                    <Icon name="upload" />
                  </span>
                  <b className="mt-3 block text-xs">Add product photography</b>
                  <small className="mt-1 block text-[10px] text-black/40">
                    Drop up to 8 images here
                  </small>
                </span>
              </label>
              <label className="grid gap-2 text-[10px] font-semibold uppercase tracking-wider text-black/45">
                Product name
                <input
                  name="name"
                  required
                  defaultValue={editingProduct?.name}
                  placeholder="e.g. Common Bowl No. 3"
                  className="h-12 rounded-xl border border-black/10 bg-white/60 px-4 text-sm normal-case tracking-normal outline-none focus:border-[var(--sage)]"
                />
              </label>
              <label className="grid gap-2 text-[10px] font-semibold uppercase tracking-wider text-black/45">
                Description
                <textarea
                  name="description"
                  rows={4}
                  placeholder="Materials, process, and what makes this piece distinct…"
                  className="resize-none rounded-xl border border-black/10 bg-white/60 p-4 text-sm leading-6 normal-case tracking-normal outline-none focus:border-[var(--sage)]"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-[10px] font-semibold uppercase tracking-wider text-black/45">
                  Category
                  <select
                    name="category"
                    defaultValue={editingProduct?.category}
                    className="h-12 rounded-xl border border-black/10 bg-white/60 px-4 text-sm normal-case tracking-normal outline-none"
                  >
                    <option>Objects</option>
                    <option>Desk</option>
                    <option>Home</option>
                    <option>Wear</option>
                  </select>
                </label>
                <label className="grid gap-2 text-[10px] font-semibold uppercase tracking-wider text-black/45">
                  SKU
                  <input
                    name="sku"
                    defaultValue={editingProduct?.id}
                    placeholder="Auto-generated"
                    className="h-12 rounded-xl border border-black/10 bg-white/60 px-4 text-sm normal-case tracking-normal outline-none"
                  />
                </label>
                <label className="grid gap-2 text-[10px] font-semibold uppercase tracking-wider text-black/45">
                  Price, USD
                  <input
                    name="price"
                    required
                    min="0"
                    type="number"
                    defaultValue={editingProduct?.price}
                    placeholder="0.00"
                    className="h-12 rounded-xl border border-black/10 bg-white/60 px-4 text-sm normal-case tracking-normal outline-none focus:border-[var(--sage)]"
                  />
                </label>
                <label className="grid gap-2 text-[10px] font-semibold uppercase tracking-wider text-black/45">
                  Inventory
                  <input
                    name="stock"
                    min="0"
                    type="number"
                    defaultValue={editingProduct?.stock}
                    placeholder="0"
                    className="h-12 rounded-xl border border-black/10 bg-white/60 px-4 text-sm normal-case tracking-normal outline-none focus:border-[var(--sage)]"
                  />
                </label>
              </div>
              <label className="flex items-start gap-3 rounded-xl bg-[var(--sage-light)]/55 p-4 text-xs leading-5">
                <input type="checkbox" defaultChecked className="mt-1 accent-[var(--sage)]" />
                <span>
                  <b className="block">Track inventory</b>
                  <small className="text-black/45">
                    Hide the listing automatically when inventory reaches zero.
                  </small>
                </span>
              </label>
            </div>
            <footer className="sticky bottom-0 flex items-center justify-between border-t border-black/10 bg-[var(--cream)] p-5">
              <button
                type="button"
                onClick={closeEditor}
                className="px-3 py-2 text-xs text-black/45"
              >
                Cancel
              </button>
              <div className="flex gap-2">
                <button
                  type="submit"
                  name="intent"
                  value="draft"
                  className="rounded-full border border-black/10 px-5 py-3 text-xs font-medium hover:bg-white"
                >
                  {editingProduct ? 'Save changes' : 'Save draft'}
                </button>
                <button
                  type="submit"
                  name="intent"
                  value="publish"
                  className="rounded-full bg-[var(--walnut)] px-5 py-3 text-xs font-medium text-white"
                >
                  {editingProduct ? 'Update listing' : 'Publish'}
                </button>
              </div>
            </footer>
          </form>
        </div>
      )}

      {pendingDelete && (
        <div
          className="fixed inset-0 z-[80] grid place-items-center bg-black/35 p-5 backdrop-blur-sm"
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
          <div className="relative w-full max-w-md rounded-3xl bg-[var(--cream)] p-6 shadow-2xl sm:p-8">
            <span className="grid size-11 place-items-center rounded-full bg-[#a94b3f]/10 text-[#934339]">
              <Icon name="trash" />
            </span>
            <p className="mt-6 font-[var(--mono)] text-[9px] uppercase tracking-[0.15em] text-[#934339]">
              Delete product
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
              Remove {pendingDelete.name}?
            </h2>
            <p className="mt-3 text-sm leading-6 text-black/50">
              This removes the listing and its local dashboard history. Existing order records are
              kept. This action cannot be undone in this prototype.
            </p>
            <div className="mt-7 flex justify-end gap-2 border-t border-black/8 pt-5">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="rounded-full border border-black/10 px-5 py-3 text-xs font-medium hover:bg-white"
              >
                Keep product
              </button>
              <button
                type="button"
                onClick={deleteProduct}
                className="rounded-full bg-[#934339] px-5 py-3 text-xs font-medium text-white hover:bg-[#7e382f]"
              >
                Delete product
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed right-5 bottom-5 z-[90] flex items-center gap-3 rounded-full bg-[var(--walnut-dark)] px-5 py-3 text-xs text-white shadow-xl">
          <span className="grid size-5 place-items-center rounded-full bg-[var(--sage)] text-[10px]">
            ✓
          </span>
          {toast}
        </div>
      )}
    </main>
  )
}
