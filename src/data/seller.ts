export type SellerProduct = {
  id: string;
  name: string;
  category: string;
  description?: string;
  price: number;
  stock: number;
  status: 'Live' | 'Draft' | 'Low stock';
  image: string;
  sales: number;
  revenue: number;
  views: number;
  conversion: number;
};

export type SellerOrder = {
  id: string;
  customer: string;
  email: string;
  address: string[];
  item: string;
  variant: string;
  total: number;
  status: 'Ready to ship' | 'Processing' | 'Shipped' | 'Delivered';
  date: string;
};

export type SellerFaq = {
  question: string;
  answer: string;
};

export type SellerShopProfile = {
  name: string;
  handle: string;
  primaryCategory: string;
  practiceType: string;
  tagline: string;
  story: string;
  announcement: string;
  location: string;
  email: string;
  instagram: string;
  dispatch: string;
  shippingPolicy: string;
  returnPolicy: string;
  customOrders: boolean;
  atmosphere: 'Sage' | 'Walnut' | 'Amber';
  logoUrl?: string;
  bannerUrl?: string;
};

export const SELLER_PROFILE_STORAGE_KEY = 'syntaxwear-seller-profile';
export const SELLER_PRODUCTS_STORAGE_KEY = 'syntaxwear-seller-products';
export const SELLER_ORDERS_STORAGE_KEY = 'syntaxwear-seller-orders';

export const DEFAULT_SELLER_PROFILE: SellerShopProfile = {
  name: 'North Common',
  handle: 'north-common',
  primaryCategory: 'Objects',
  practiceType: 'Independent studio',
  tagline:
    'Small-run objects and heavyweight garments shaped by honest materials, quiet utility, and daily ritual.',
  story:
    'North Common is an independent studio exploring the useful space between modular hardware, heavy fleece apparel, and everyday desk objects. Each edition is developed slowly and released in small batches on SyntaxWear.',
  announcement: 'Complimentary dispatch on studio orders over $120',
  location: 'Lagos / Portland',
  email: 'studio@northcommon.co',
  instagram: '@northcommon',
  dispatch: '2–3 business days',
  shippingPolicy:
    'Orders are packed plastic-free in kraft cartons and dispatched with tracked regional or DHL Express delivery within 2–3 business days.',
  returnPolicy:
    'Unworn garments and unused objects may be returned in their original packaging within 14 days of delivery.',
  customOrders: true,
  atmosphere: 'Sage',
};

export const INITIAL_SELLER_PRODUCTS: SellerProduct[] = [
  {
    id: 'NC-001',
    name: 'Monolith 65 Mechanical Deck',
    category: 'Desk',
    description:
      'CNC-milled gasket-mount 65% wireless mechanical keyboard with dye-sub PBT caps and botanical sage anodized finish.',
    price: 340,
    stock: 12,
    status: 'Live',
    sales: 18,
    revenue: 6120,
    views: 842,
    conversion: 4.2,
    image: '/images/products/desk-kbd-sage.jpg',
  },
  {
    id: 'NC-002',
    name: 'Solāre Studio Headphones',
    category: 'Audio',
    description:
      'Open-stage reference planar headphones tuned for long studio sessions with matte sage alloy cups and memory protein pads.',
    price: 420,
    stock: 4,
    status: 'Low stock',
    sales: 11,
    revenue: 4620,
    views: 604,
    conversion: 3.1,
    image: '/images/products/audio-cans-sage.jpg',
  },
  {
    id: 'NC-003',
    name: 'Field Study Heavy Hoodie',
    category: 'Wear',
    description:
      '520gsm French terry boxy hoodie enzyme-washed in Botanical Sage with tonal embroidery and double-lined hood.',
    price: 185,
    stock: 18,
    status: 'Live',
    sales: 24,
    revenue: 4440,
    views: 986,
    conversion: 4.6,
    image: '/images/products/hoodie-sage.jpg',
  },
  {
    id: 'NC-004',
    name: 'Utility Field Carry Tote',
    category: 'Objects',
    description:
      '18oz waxed cotton duck tote with gusseted laptop sleeve, brass rivets, and weatherproof base.',
    price: 118,
    stock: 0,
    status: 'Draft',
    sales: 0,
    revenue: 0,
    views: 112,
    conversion: 0,
    image: '/images/products/tote-sage.jpg',
  },
];

export const INITIAL_SELLER_ORDERS: SellerOrder[] = [
  {
    id: '#SW-4098',
    customer: 'Tunde Adeyemi',
    email: 'tunde.adeyemi@example.com',
    address: ['14 Admiralty Way, Lekki Phase 1', 'Lagos 105102', 'Nigeria'],
    item: 'Monolith 65 Mechanical Deck',
    variant: 'Botanical Sage · Qty 1',
    total: 340,
    status: 'Ready to ship',
    date: 'Today, 9:42',
  },
  {
    id: '#SW-4091',
    customer: 'Arthur Cole',
    email: 'arthur.cole@example.com',
    address: ['1847 SE Alder Street', 'Portland, OR 97214', 'United States'],
    item: 'Solāre Studio Headphones',
    variant: 'Botanical Sage · Qty 1',
    total: 420,
    status: 'Processing',
    date: 'Yesterday',
  },
  {
    id: '#SW-4084',
    customer: 'Nora Bell',
    email: 'nora.bell@example.com',
    address: ['22 Redchurch Street', 'London E2 7DP', 'United Kingdom'],
    item: 'Field Study Heavy Hoodie',
    variant: 'Botanical Sage · Size L · Qty 1',
    total: 185,
    status: 'Shipped',
    date: 'Nov 18',
  },
  {
    id: '#SW-4079',
    customer: 'Sam Rivera',
    email: 'sam.rivera@example.com',
    address: ['418 Queen Street West', 'Toronto, ON M5V 2A6', 'Canada'],
    item: 'Field Study Heavy Hoodie',
    variant: 'Botanical Sage · Size M · Qty 2',
    total: 370,
    status: 'Delivered',
    date: 'Nov 16',
  },
];

export const INITIAL_SELLER_FAQS: SellerFaq[] = [
  {
    question: 'How long does small-batch dispatch take?',
    answer:
      'In-stock studio garments and hardware ship within 2–3 business days with tracked regional or DHL Express delivery.',
  },
  {
    question: 'Can I request custom sizing or studio bulk editions?',
    answer:
      'Yes. Custom team runs and architectural desk editions can be requested directly from the studio profile when custom orders are enabled.',
  },
];

export function loadSellerProfile(): SellerShopProfile {
  try {
    const raw = localStorage.getItem(SELLER_PROFILE_STORAGE_KEY);
    if (!raw) return DEFAULT_SELLER_PROFILE;
    return { ...DEFAULT_SELLER_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SELLER_PROFILE;
  }
}

export function saveSellerProfile(profile: SellerShopProfile): void {
  try {
    localStorage.setItem(SELLER_PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadSellerProducts(): SellerProduct[] {
  try {
    const raw = localStorage.getItem(SELLER_PRODUCTS_STORAGE_KEY);
    if (!raw) return INITIAL_SELLER_PRODUCTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length >= 0 ? parsed : INITIAL_SELLER_PRODUCTS;
  } catch {
    return INITIAL_SELLER_PRODUCTS;
  }
}

export function saveSellerProducts(products: SellerProduct[]): void {
  try {
    localStorage.setItem(SELLER_PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadSellerOrders(): SellerOrder[] {
  try {
    const raw = localStorage.getItem(SELLER_ORDERS_STORAGE_KEY);
    if (!raw) return INITIAL_SELLER_ORDERS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SELLER_ORDERS;
  } catch {
    return INITIAL_SELLER_ORDERS;
  }
}

export function saveSellerOrders(orders: SellerOrder[]): void {
  try {
    localStorage.setItem(SELLER_ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // Ignore storage quota errors
  }
}
