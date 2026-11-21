import { SoundscapeType } from '../utils/soundEngine';

export type StoreCategory =
  | 'ALL'
  | 'TOPS'
  | 'OUTERWEAR'
  | 'BOTTOMS'
  | 'ACCESSORIES'
  | 'TECH & DESK';

export type CollectionTag = '404' | 'TERMINAL' | 'SYNTAX' | 'LOADING' | 'CORE';

export interface ProductFinish {
  name: string;
  hex: string;
  accentHex: string;
  image: string;
}

export interface Product {
  id: string;
  index: string;
  code: string;
  name: string;
  subtitle: string;
  category: Exclude<StoreCategory, 'ALL'>;
  collectionTag: CollectionTag;
  price: number;
  oldPrice?: number;
  discountPct?: number;
  priceLabel: string;
  specStatus: string;
  isFlashDeal?: boolean;
  isDistressed?: boolean;
  hasModelLook?: boolean;
  batchLeft?: number;
  batchTotal?: number;
  image: string;
  gallery: string[];
  rating?: number;
  reviewsCount?: number;
  chipOrigin: string;
  soundscape: SoundscapeType;
  soundtrackTitle: string;
  bpm: string;
  description: string;
  editorialTagline?: string;
  materialNote?: string;
  craftDetails?: { label: string; value: string }[];
  materialsInfo?: string;
  shippingInfo?: string;
  specs: { label: string; value: string }[];
  finishes: ProductFinish[];
  sizes?: string[];
  badge?: string;
}

export interface PromoBannerSlide {
  id: string;
  eyebrow: string;
  title: string;
  accentTitle: string;
  copy: string;
  ctaLabel: string;
  discountBadge: string;
  bgTone: 'walnut' | 'sage' | 'peach';
  image: string;
  secondaryImage: string;
  filterCategory?: StoreCategory;
  filterCollection?: CollectionTag | 'ALL';
}

export interface QuickDealTile {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  tone: 'peach' | 'sage' | 'walnut' | 'sand';
  image: string;
  filterCategory?: StoreCategory;
  filterCollection?: CollectionTag | 'ALL';
  onlyFlash?: boolean;
  onlyDistressed?: boolean;
}

export interface SignatureCollectionCard {
  id: CollectionTag;
  title: string;
  subtitle: string;
  countLabel: string;
  image: string;
  featuredProductId: string;
}

export const PROMO_BANNERS: PromoBannerSlide[] = [
  {
    id: 'promo-404-drop',
    eyebrow: 'DISTRESSED LAUNCH DROP // BATCH 001',
    title: 'Wear the Code.',
    accentTitle: 'Distressed 404 Series',
    copy: 'Heavyweight 260 GSM distressed prints, syntax-highlighted blocks & 3 studio colourways — up to 25% off Launch Allocation.',
    ctaLabel: 'Shop 404 Distressed',
    discountBadge: 'UP TO -25% OFF',
    bgTone: 'walnut',
    image: '/images/lookbook/look-404.jpg',
    secondaryImage: '/images/products/tee-404-pitch.jpg',
    filterCollection: '404',
  },
  {
    id: 'promo-stack-bundle',
    eyebrow: 'DEVELOPER KIT // HOODIE + JOGGERS',
    title: 'Terminal Fleece',
    accentTitle: 'Full-Stack Uniform',
    copy: 'Pair >_ Terminal Heavyweight Fleece with Route Joggers or Tactical Outerwear. Built in Pitch Black, Botanical Sage & Warm Peach.',
    ctaLabel: 'Explore Outerwear & Hoodies',
    discountBadge: 'FLASH COMPILE -22%',
    bgTone: 'sage',
    image: '/images/lookbook/look-terminal.jpg',
    secondaryImage: '/images/products/jacket-shell-sage.jpg',
    filterCategory: 'OUTERWEAR',
  },
  {
    id: 'promo-syntax-studio',
    eyebrow: 'STUDIO EDITION // CODE + DESK HARDWARE',
    title: 'while(alive)',
    accentTitle: 'Create in Comfort',
    copy: 'From syntax-printed heavyweight tees to walnut-framed 65% mechanical keyboards & suede ANC studio headphones.',
    ctaLabel: 'Browse Tech & Syntax',
    discountBadge: 'LAUNCH ALLOCATION',
    bgTone: 'peach',
    image: '/images/lookbook/look-syntax.jpg',
    secondaryImage: '/images/products/desk-kbd-peach.jpg',
    filterCategory: 'TECH & DESK',
  },
];

export const QUICK_TILES: QuickDealTile[] = [
  {
    id: 'tile-flash',
    title: 'Flash Compile',
    subtitle: 'Up to 25% Off',
    badge: 'LIVE',
    tone: 'peach',
    image: '/images/products/tee-404-peach.jpg',
    onlyFlash: true,
  },
  {
    id: 'tile-distressed',
    title: '404 Distressed',
    subtitle: 'Grunge Stencil Ink',
    badge: '-25%',
    tone: 'walnut',
    image: '/images/lookbook/look-404.jpg',
    onlyDistressed: true,
  },
  {
    id: 'tile-syntax',
    title: 'Syntax Print',
    subtitle: 'while(alive) Drops',
    badge: 'CODE',
    tone: 'sage',
    image: '/images/products/tee-syntax-sage.jpg',
    filterCollection: 'SYNTAX',
  },
  {
    id: 'tile-outerwear',
    title: 'Shells & Hoodies',
    subtitle: 'Heavy 350–800 GSM',
    badge: 'HOT',
    tone: 'sand',
    image: '/images/products/jacket-shell-peach.jpg',
    filterCategory: 'OUTERWEAR',
  },
  {
    id: 'tile-bottoms',
    title: 'Route Joggers',
    subtitle: 'Fleece Taper Fit',
    badge: '-20%',
    tone: 'sage',
    image: '/images/products/joggers-404-sage.jpg',
    filterCategory: 'BOTTOMS',
  },
  {
    id: 'tile-desk',
    title: 'Desk & Audio',
    subtitle: 'KBD & Studio Cans',
    badge: 'NEW',
    tone: 'walnut',
    image: '/images/products/desk-kbd-pitch.jpg',
    filterCategory: 'TECH & DESK',
  },
];

export const SIGNATURE_COLLECTIONS: SignatureCollectionCard[] = [
  {
    id: '404',
    title: '404 Collection',
    subtitle: 'Distressed stencils. Error looks good on you.',
    countLabel: '4 PIECES',
    image: '/images/lookbook/look-404.jpg',
    featuredProductId: 'sw-404-distressed-tee',
  },
  {
    id: 'TERMINAL',
    title: 'Terminal Collection',
    subtitle: 'Type. Wear. Repeat. >_ Heavy fleece.',
    countLabel: '2 PIECES',
    image: '/images/lookbook/look-terminal.jpg',
    featuredProductId: 'sw-terminal-hoodie',
  },
  {
    id: 'SYNTAX',
    title: 'Syntax Collection',
    subtitle: 'Code in style. Multi-hue syntax ink.',
    countLabel: '2 PIECES',
    image: '/images/lookbook/look-syntax.jpg',
    featuredProductId: 'sw-while-alive-tee',
  },
  {
    id: 'LOADING',
    title: 'Loading Collection',
    subtitle: 'Progress never stops. 99% compiled.',
    countLabel: '2 PIECES',
    image: '/images/lookbook/look-loading.jpg',
    featuredProductId: 'sw-loading-99-tee',
  },
  {
    id: 'CORE',
    title: 'Core Collection',
    subtitle: 'Simple. Iconic. S+404 daily essentials.',
    countLabel: '4 PIECES',
    image: '/images/lookbook/look-core.jpg',
    featuredProductId: 'sw-git-commit-tee',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'sw-404-distressed-tee',
    index: '01',
    code: 'SW-404-TEE',
    name: '404 Distressed Oversized Tee',
    subtitle: 'Weathered 404 ROUTE_ERR Screenprint · 260 GSM',
    category: 'TOPS',
    collectionTag: '404',
    price: 48,
    oldPrice: 64,
    discountPct: 25,
    priceLabel: '$48',
    specStatus: 'DISTRESSED // -25%',
    isFlashDeal: true,
    isDistressed: true,
    hasModelLook: true,
    batchLeft: 4,
    batchTotal: 20,
    badge: '-25% DISTRESSED',
    rating: 4.9,
    reviewsCount: 94,
    chipOrigin: '260 GSM Heavy Combed Cotton',
    image: '/images/products/tee-404-pitch.jpg',
    gallery: [
      '/images/products/tee-404-pitch.jpg',
      '/images/lookbook/look-404.jpg',
      '/images/products/tee-404-sage.jpg',
      '/images/products/tee-404-peach.jpg',
    ],
    soundscape: 'hoodie-lofi',
    soundtrackTitle: 'Heavyweight 404 Static',
    bpm: '94 BPM',
    editorialTagline: 'Error looks sharp. Crackled 404 barcode ink on boxy heavyweight cotton.',
    materialNote: 'Screenprinted with cracked distressed plastisol ink cured softly into garment-washed 260 GSM cotton so every crease wears like an archive vintage piece.',
    craftDetails: [
      { label: 'FABRIC WEIGHT', value: '260 GSM Single Jersey' },
      { label: 'GRAPHIC', value: 'Distressed 404 // Route Err' },
      { label: 'SILHOUETTE', value: 'Boxy Drop Shoulder' },
    ],
    materialsInfo: '100% ring-spun heavyweight combed cotton (260 GSM). Pre-shrunk enzyme wash with thick 1.1" ribbed mock collar.',
    shippingInfo: 'Batch 001 ready-to-ship. Express dispatch within 48 hours with woven S+404 archive hangtag.',
    description: 'Statement distressed 404 barcode graphic anchored by our signature S+404 chest emblem. Cut boxy with dropped shoulders for clean everyday layering across all three SyntaxWear colourways.',
    specs: [
      { label: 'Collection', value: '404 Distressed' },
      { label: 'Fabric', value: '260 GSM Cotton' },
      { label: 'Print', value: 'Cracked Distress DTF' },
      { label: 'Batch', value: '4 of 20 remaining' },
    ],
    finishes: [
      { name: 'Pitch Black', hex: '#1C1C1E', accentHex: '#D4822B', image: '/images/products/tee-404-pitch.jpg' },
      { name: 'Botanical Sage', hex: '#546652', accentHex: '#A4B69E', image: '/images/products/tee-404-sage.jpg' },
      { name: 'Warm Peach', hex: '#D4822B', accentHex: '#E0953C', image: '/images/products/tee-404-peach.jpg' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'sw-while-alive-tee',
    index: '02',
    code: 'SW-SYNTAX-02',
    name: 'while(alive) Syntax Tee',
    subtitle: 'Syntax-Highlighted Code Loop Print · 250 GSM',
    category: 'TOPS',
    collectionTag: 'SYNTAX',
    price: 44,
    oldPrice: 55,
    discountPct: 20,
    priceLabel: '$44',
    specStatus: 'CODE EDITION // -20%',
    isFlashDeal: false,
    hasModelLook: true,
    batchLeft: 7,
    batchTotal: 24,
    badge: 'CODE PRINT',
    rating: 4.9,
    reviewsCount: 68,
    chipOrigin: '250 GSM Organic Cotton',
    image: '/images/products/tee-syntax-sage.jpg',
    gallery: [
      '/images/products/tee-syntax-sage.jpg',
      '/images/lookbook/look-syntax.jpg',
      '/images/products/tee-syntax-pitch.jpg',
      '/images/products/tee-syntax-peach.jpg',
    ],
    soundscape: 'hoodie-lofi',
    soundtrackTitle: 'Infinite Loop Ambience',
    bpm: '102 BPM',
    editorialTagline: 'while(alive) { create(); } — multi-pass syntax ink printed crisp into enzyme cotton.',
    materialNote: 'Four-pass spot-color screenprinting renders authentic IDE syntax highlighting directly across the upper chest without stiff rubbery backing.',
    craftDetails: [
      { label: 'FABRIC', value: '250 GSM Organic Jersey' },
      { label: 'PRINT STYLE', value: '4-Pass Syntax Spot Ink' },
      { label: 'MARKING', value: 'S+404 Woven Hem Flag' },
    ],
    materialsInfo: '100% organic combed cotton jersey at 250 GSM. Soft-hand discharge water-based syntax inks.',
    shippingInfo: 'Dispatched inside recyclable matte SyntaxWear sleeves within 48 hours.',
    description: 'Built for late-night commits and studio days alike. Features crisp IDE syntax highlighting across relaxed heavyweight cotton with our S+404 chest stamp.',
    specs: [
      { label: 'Collection', value: 'Syntax Collection' },
      { label: 'Graphic', value: 'while(alive) { create(); }' },
      { label: 'Fit', value: 'Relaxed Oversized' },
      { label: 'Colourways', value: 'Sage / Pitch / Peach' },
    ],
    finishes: [
      { name: 'Botanical Sage', hex: '#546652', accentHex: '#A4B69E', image: '/images/products/tee-syntax-sage.jpg' },
      { name: 'Pitch Black', hex: '#1C1C1E', accentHex: '#D4822B', image: '/images/products/tee-syntax-pitch.jpg' },
      { name: 'Warm Peach', hex: '#D4822B', accentHex: '#E0953C', image: '/images/products/tee-syntax-peach.jpg' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'sw-terminal-hoodie',
    index: '03',
    code: 'SW-TERM-HD',
    name: '>_ Terminal Heavy Hoodie',
    subtitle: 'Minimal Prompt Chest Print · 360 GSM Fleece',
    category: 'TOPS',
    collectionTag: 'TERMINAL',
    price: 92,
    oldPrice: 118,
    discountPct: 22,
    priceLabel: '$92',
    specStatus: 'FLASH DROP // -22%',
    isFlashDeal: true,
    hasModelLook: true,
    batchLeft: 3,
    batchTotal: 15,
    badge: '-22% FLASH',
    rating: 5.0,
    reviewsCount: 112,
    chipOrigin: '360 GSM Brushed Fleece',
    image: '/images/products/hoodie-terminal-pitch.jpg',
    gallery: [
      '/images/products/hoodie-terminal-pitch.jpg',
      '/images/lookbook/look-terminal.jpg',
      '/images/products/hoodie-terminal-sage.jpg',
      '/images/products/hoodie-terminal-peach.jpg',
      '/images/products/hoodie-detail.jpg',
    ],
    soundscape: 'desert-breeze',
    soundtrackTitle: 'Root Shell Hum',
    bpm: '78 BPM',
    editorialTagline: 'Type. Wear. Repeat. Double-lined hood with crisp >_ prompt insignia.',
    materialNote: 'Brushed 360 GSM cotton-rich loopback fleece paired with high-density matte >_ chest print and cuff sleeve specification text.',
    craftDetails: [
      { label: 'FLEECE', value: '360 GSM Heavy Brushed' },
      { label: 'CONSTRUCTION', value: 'Double-Lined Hood, No Drawcord' },
      { label: 'BRANDING', value: '>_ Prompt + Cuff Type' },
    ],
    materialsInfo: '85% combed cotton / 15% recycled polyester heavyweight 360 GSM fleece with zero-twist soft brushed interior.',
    shippingInfo: 'Priority Launch Dispatch with numbered Batch 001 garment bag.',
    description: 'Clean architectural silhouette anchored by an oversized double-layer hood and minimalist >_ terminal center print. Cozy enough for winter builds, sharp enough for any rotation.',
    specs: [
      { label: 'Collection', value: 'Terminal Collection' },
      { label: 'Weight', value: '360 GSM Heavyweight' },
      { label: 'Pockets', value: 'Concealed Kangaroo Pocket' },
      { label: 'Cuffs', value: '480 GSM Heavy Rib' },
    ],
    finishes: [
      { name: 'Pitch Black', hex: '#1C1C1E', accentHex: '#D4822B', image: '/images/products/hoodie-terminal-pitch.jpg' },
      { name: 'Botanical Sage', hex: '#546652', accentHex: '#A4B69E', image: '/images/products/hoodie-terminal-sage.jpg' },
      { name: 'Warm Peach', hex: '#D4822B', accentHex: '#E0953C', image: '/images/products/hoodie-terminal-peach.jpg' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'sw-404-shell-jacket',
    index: '04',
    code: 'SW-PUFFER-404',
    name: '404 Telemetry Puffer Jacket',
    subtitle: '800-Fill Silica Insulation · Matte Ripstop',
    category: 'OUTERWEAR',
    collectionTag: '404',
    price: 149,
    oldPrice: 199,
    discountPct: 25,
    priceLabel: '$149',
    specStatus: 'FLAGSHIP // -25%',
    isFlashDeal: true,
    isDistressed: false,
    batchLeft: 2,
    batchTotal: 10,
    badge: '-25% OUTERWEAR',
    rating: 4.9,
    reviewsCount: 54,
    chipOrigin: 'Micro-Ripstop 800-Fill Shell',
    image: '/images/products/jacket-shell-peach.jpg',
    gallery: [
      '/images/products/jacket-shell-peach.jpg',
      '/images/products/jacket-shell-sage.jpg',
      '/images/products/jacket-shell-pitch.jpg',
      '/images/products/jacket-detail.jpg',
    ],
    soundscape: 'desert-breeze',
    soundtrackTitle: '800-Fill Altitude Wind',
    bpm: '70 BPM',
    editorialTagline: 'Built for cold commutes. Stamped 404 // ROUTE_NOT_FOUND across baffled chest chambers.',
    materialNote: 'Featherlight water-repellent Japanese micro-ripstop shell baffling high-loft synthetic thermal insulation, embossed with raised tonal S+ badge.',
    craftDetails: [
      { label: 'SHELL', value: 'DWR Micro-Ripstop Nylon' },
      { label: 'LOFT', value: '800-Fill Thermal Baffles' },
      { label: 'HARDWARE', value: 'YKK Matte Dual Zipper' },
    ],
    materialsInfo: 'Water-resistant ripstop exterior, recycled blown-fiber 800-fill loft, fleece-lined handwarmer pockets and internal cord lock hem.',
    shippingInfo: 'Ships boxed flat in weather-sealed archival outer wrap within 48h.',
    description: 'Our statement winter outerwear silhouette featuring windproof stand collar, cropped boxy proportions, tonal chest patch and crisp 404 telemetry typography.',
    specs: [
      { label: 'Collection', value: '404 Series' },
      { label: 'Insulation', value: '800-Fill High Loft' },
      { label: 'Weatherproof', value: 'DWR Coated Ripstop' },
      { label: 'Allocation', value: '2 Left in Batch 001' },
    ],
    finishes: [
      { name: 'Warm Peach', hex: '#D4822B', accentHex: '#E0953C', image: '/images/products/jacket-shell-peach.jpg' },
      { name: 'Botanical Sage', hex: '#546652', accentHex: '#A4B69E', image: '/images/products/jacket-shell-sage.jpg' },
      { name: 'Pitch Black', hex: '#1C1C1E', accentHex: '#D4822B', image: '/images/products/jacket-shell-pitch.jpg' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'sw-loading-99-tee',
    index: '05',
    code: 'SW-LOAD-99',
    name: 'Loading... 99% Boxy Tee',
    subtitle: 'Progress Bar Streetwear Print · 250 GSM',
    category: 'TOPS',
    collectionTag: 'LOADING',
    price: 45,
    oldPrice: 56,
    discountPct: 20,
    priceLabel: '$45',
    specStatus: 'DROP 001 // -20%',
    hasModelLook: true,
    batchLeft: 8,
    batchTotal: 25,
    badge: '-20% DROP',
    rating: 4.8,
    reviewsCount: 41,
    chipOrigin: '250 GSM Heavy Jersey',
    image: '/images/products/tee-loading-peach.jpg',
    gallery: [
      '/images/products/tee-loading-peach.jpg',
      '/images/lookbook/look-loading.jpg',
      '/images/products/tee-loading-pitch.jpg',
      '/images/products/tee-loading-sage.jpg',
    ],
    soundscape: 'hoodie-lofi',
    soundtrackTitle: 'Compile Progress Pulse',
    bpm: '108 BPM',
    editorialTagline: 'Progress never stops. Perpetual 99% bar anchored on heavyweight pigment-washed tee.',
    materialNote: 'Matte tactile ink prints crisp progress bar geometry paired with high-contrast walnut/cream lettering across Warm Peach, Pitch Black & Sage.',
    craftDetails: [
      { label: 'GRAPHIC', value: 'Loading... 99% Meter' },
      { label: 'FABRIC', value: '250 GSM Pigment Cotton' },
      { label: 'FIT', value: 'Drop-Shoulder Box Cut' },
    ],
    materialsInfo: '100% heavyweight pigment-dyed cotton jersey, enzyme softened for worn-in drape.',
    shippingInfo: 'In stock — ships in 48 hours.',
    description: 'Every creator knows the feeling of hovering at 99%. Clean bold typography over a crisp vector progress track printed on pigment-dyed heavyweight cotton.',
    specs: [
      { label: 'Collection', value: 'Loading Collection' },
      { label: 'Weight', value: '250 GSM Cotton' },
      { label: 'Graphic', value: '99% Compile Bar' },
      { label: 'Neckline', value: 'Dense Rib Mock Crew' },
    ],
    finishes: [
      { name: 'Warm Peach', hex: '#D4822B', accentHex: '#E0953C', image: '/images/products/tee-loading-peach.jpg' },
      { name: 'Pitch Black', hex: '#1C1C1E', accentHex: '#D4822B', image: '/images/products/tee-loading-pitch.jpg' },
      { name: 'Botanical Sage', hex: '#546652', accentHex: '#A4B69E', image: '/images/products/tee-loading-sage.jpg' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'sw-git-commit-tee',
    index: '06',
    code: 'SW-COMMIT-01',
    name: 'git commit // Release Tee',
    subtitle: 'Branch Graph & S Emblem · 240 GSM',
    category: 'TOPS',
    collectionTag: 'CORE',
    price: 42,
    oldPrice: 52,
    discountPct: 19,
    priceLabel: '$42',
    specStatus: 'BESTSELLER // -19%',
    hasModelLook: true,
    badge: 'BESTSELLER',
    rating: 4.9,
    reviewsCount: 129,
    chipOrigin: '240 GSM Combed Jersey',
    image: '/images/products/tee-commit-sage.jpg',
    gallery: [
      '/images/products/tee-commit-sage.jpg',
      '/images/lookbook/look-core.jpg',
      '/images/products/tee-commit-pitch.jpg',
      '/images/products/tee-commit-peach.jpg',
      '/images/products/tshirt-detail.jpg',
    ],
    soundscape: 'hoodie-lofi',
    soundtrackTitle: 'Initial Merge Chime',
    bpm: '96 BPM',
    editorialTagline: 'git commit -m "initial release" — minimal branch diagram blended in tonal matte ink.',
    materialNote: 'Soft-touch tonal discharge print merges branch-node geometry with architectural contour lines for subtle geek elegance.',
    craftDetails: [
      { label: 'GRAPHIC', value: 'Git Branch Graph + Emblem' },
      { label: 'WEIGHT', value: '240 GSM Combed Jersey' },
      { label: 'STITCHING', value: 'Twin-Needle Hem' },
    ],
    materialsInfo: '100% long-staple combed cotton, breathable soft handfeel with structured collar retention.',
    shippingInfo: 'Ready for immediate dispatch.',
    description: 'Subtle tonal print combining our signature monogram with an abstract git commit branch history graph. Wearable anywhere without loud branding.',
    specs: [
      { label: 'Collection', value: 'Core Collection' },
      { label: 'Weight', value: '240 GSM Cotton' },
      { label: 'Graphic', value: 'git commit Branch Art' },
      { label: 'Fit', value: 'Relaxed Everyday' },
    ],
    finishes: [
      { name: 'Botanical Sage', hex: '#546652', accentHex: '#A4B69E', image: '/images/products/tee-commit-sage.jpg' },
      { name: 'Pitch Black', hex: '#1C1C1E', accentHex: '#D4822B', image: '/images/products/tee-commit-pitch.jpg' },
      { name: 'Warm Peach', hex: '#D4822B', accentHex: '#E0953C', image: '/images/products/tee-commit-peach.jpg' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'sw-long-sleeve-tee',
    index: '07',
    code: 'SW-LS-CODE',
    name: '</> Stack Code Long Sleeve',
    subtitle: 'Full Sleeve Code Typography & Globe · 240 GSM',
    category: 'TOPS',
    collectionTag: 'SYNTAX',
    price: 58,
    oldPrice: 72,
    discountPct: 19,
    priceLabel: '$58',
    specStatus: 'SLEEVE PRINT // -19%',
    badge: 'SLEEVE CODE',
    rating: 4.8,
    reviewsCount: 53,
    chipOrigin: '240 GSM Combed Cotton',
    image: '/images/products/ls-code-sage.jpg',
    gallery: [
      '/images/products/ls-code-sage.jpg',
      '/images/products/ls-code-peach.jpg',
      '/images/products/ls-code-pitch.jpg',
      '/images/products/longsleeve-pitch.jpg',
    ],
    soundscape: 'night-breeze',
    soundtrackTitle: 'Recursive Loom Loop',
    bpm: '98 BPM',
    editorialTagline: 'Sleeve-to-sleeve syntax specs: {def func():} down one arm, [0x404] down the other.',
    materialNote: 'Engineered cuffs hold sleeve prints sharply framed without twisting after repeated washes.',
    craftDetails: [
      { label: 'SLEEVES', value: 'Dual Code Spec Typography' },
      { label: 'CHEST', value: '</> Tag & Wireframe Globe' },
      { label: 'CUFFS', value: 'Dense 1x1 Elastic Rib' },
    ],
    materialsInfo: '100% ring-spun cotton 240 GSM jersey with multi-position crisp screenprint.',
    shippingInfo: 'Batch 001 in stock — ships within 48 hours.',
    description: 'Layered streetwear essential uniting subtle chest </> globe marking with dual technical sleeve code typography.',
    specs: [
      { label: 'Collection', value: 'Syntax Series' },
      { label: 'Weight', value: '240 GSM Cotton' },
      { label: 'Sleeve Artwork', value: 'Dual Code Columns' },
      { label: 'Neck', value: 'Taped Crew Neck' },
    ],
    finishes: [
      { name: 'Botanical Sage', hex: '#546652', accentHex: '#A4B69E', image: '/images/products/ls-code-sage.jpg' },
      { name: 'Warm Peach', hex: '#D4822B', accentHex: '#E0953C', image: '/images/products/ls-code-peach.jpg' },
      { name: 'Pitch Black', hex: '#1C1C1E', accentHex: '#D4822B', image: '/images/products/ls-code-pitch.jpg' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'sw-essential-hoodie',
    index: '08',
    code: 'SW-CORE-HD',
    name: 'S+404 Heavyweight Hoodie',
    subtitle: 'Core Emblem Pullover · 350 GSM Fleece',
    category: 'TOPS',
    collectionTag: 'CORE',
    price: 89,
    oldPrice: 110,
    discountPct: 19,
    priceLabel: '$89',
    specStatus: 'CORE STAPLE // -19%',
    badge: 'HEAVY 350 GSM',
    rating: 4.9,
    reviewsCount: 87,
    chipOrigin: '350 GSM French Terry Fleece',
    image: '/images/products/hoodie-sage.jpg',
    gallery: [
      '/images/products/hoodie-sage.jpg',
      '/images/products/hoodie-peach.jpg',
      '/images/products/hoodie-pitch.jpg',
      '/images/products/hoodie-bundle-studio.jpg',
      '/images/products/hoodie-detail.jpg',
    ],
    soundscape: 'desert-breeze',
    soundtrackTitle: 'Heavy Fleece Resonance',
    bpm: '76 BPM',
    editorialTagline: 'Clean front, raised chest embroidery, zero visual clutter.',
    materialNote: 'Triple-needle stitched seams paired with structured hood volume and brushed interior warmth.',
    craftDetails: [
      { label: 'FABRIC', value: '350 GSM Cotton/Poly Fleece' },
      { label: 'EMBLEM', value: 'High-Density S+404 Chest' },
      { label: 'DRAPE', value: 'Drop-Shoulder Relaxed' },
    ],
    materialsInfo: '80% organic combed cotton, 20% recycled poly fleece (~350 GSM).',
    shippingInfo: 'Bundle-eligible with 404 Route Joggers for instant full fit.',
    description: 'The clean daily architectural pullover in our three signature shades. Ideal for pairing under shells or standalone studio sessions.',
    specs: [
      { label: 'Collection', value: 'Core Collection' },
      { label: 'Weight', value: '350 GSM Fleece' },
      { label: 'Seams', value: 'Triple-Needle Reinforced' },
      { label: 'Colours', value: 'Sage / Peach / Pitch' },
    ],
    finishes: [
      { name: 'Botanical Sage', hex: '#546652', accentHex: '#A4B69E', image: '/images/products/hoodie-sage.jpg' },
      { name: 'Warm Peach', hex: '#D4822B', accentHex: '#E0953C', image: '/images/products/hoodie-peach.jpg' },
      { name: 'Pitch Black', hex: '#1C1C1E', accentHex: '#D4822B', image: '/images/products/hoodie-pitch.jpg' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'sw-404-joggers',
    index: '09',
    code: 'SW-JOG-404',
    name: '404 Route Fleece Joggers',
    subtitle: 'Distressed Thigh Stencil + </> Mark · 320 GSM',
    category: 'BOTTOMS',
    collectionTag: '404',
    price: 74,
    oldPrice: 92,
    discountPct: 20,
    priceLabel: '$74',
    specStatus: 'DISTRESSED // -20%',
    isDistressed: true,
    badge: '-20% BOTTOMS',
    rating: 4.8,
    reviewsCount: 62,
    chipOrigin: '320 GSM Brushed Fleece',
    image: '/images/products/joggers-404-sage.jpg',
    gallery: [
      '/images/products/joggers-404-sage.jpg',
      '/images/products/joggers-404-pitch.jpg',
      '/images/products/joggers-404-peach.jpg',
      '/images/products/joggers-pitch.jpg',
    ],
    soundscape: 'hoodie-lofi',
    soundtrackTitle: 'Heavy Cuff Cadence',
    bpm: '88 BPM',
    editorialTagline: 'Comfort meets street utility. Distressed 404 stencil on right thigh + </> mark.',
    materialNote: 'Custom deep welt pockets + metal-aglet tipped cords so heavy daily carry stays locked in.',
    craftDetails: [
      { label: 'FABRIC', value: '320 GSM Loopback Fleece' },
      { label: 'WAIST', value: 'Encased Elastic + Drawcord' },
      { label: 'GRAPHICS', value: 'Distressed 404 + </> Leg' },
    ],
    materialsInfo: '80% heavyweight combed cotton, 20% structured poly (~320 GSM).',
    shippingInfo: 'Ships ready to wear with subtle ankle rib tension.',
    description: 'Cut relaxed through the thigh with a clean ankle rib stack. Paired with distressed 404 thigh print and subtle S+404 branding.',
    specs: [
      { label: 'Collection', value: '404 Series' },
      { label: 'Weight', value: '320 GSM Fleece' },
      { label: 'Hardware', value: 'Matte Tipped Drawcord' },
      { label: 'Fit', value: 'Relaxed Tapered Stack' },
    ],
    finishes: [
      { name: 'Botanical Sage', hex: '#546652', accentHex: '#A4B69E', image: '/images/products/joggers-404-sage.jpg' },
      { name: 'Pitch Black', hex: '#1C1C1E', accentHex: '#D4822B', image: '/images/products/joggers-404-pitch.jpg' },
      { name: 'Warm Peach', hex: '#D4822B', accentHex: '#E0953C', image: '/images/products/joggers-404-peach.jpg' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: 'sw-signature-cap',
    index: '10',
    code: 'SW-CAP-05',
    name: 'S+404 Signature Twill Cap',
    subtitle: '3D Raised Chest-Match Embroidery · Unstructured',
    category: 'ACCESSORIES',
    collectionTag: 'CORE',
    price: 32,
    oldPrice: 40,
    discountPct: 20,
    priceLabel: '$32',
    specStatus: 'ACCESSORY // -20%',
    badge: '3D EMBROIDERY',
    rating: 4.9,
    reviewsCount: 79,
    chipOrigin: 'Washed Brushed Cotton Twill',
    image: '/images/products/cap-sage.jpg',
    gallery: [
      '/images/products/cap-sage.jpg',
      '/images/products/cap-pitch.jpg',
      '/images/products/cap-peach.jpg',
    ],
    soundscape: 'night-breeze',
    soundtrackTitle: 'Twill Stitch Pulse',
    bpm: '92 BPM',
    editorialTagline: 'Subtle brushed twill crown built with architectural low-profile curvature.',
    materialNote: 'Garment-washed 100% cotton twill molds cleanly to head shape with matte slider hardware.',
    craftDetails: [
      { label: 'CROWN', value: '6-Panel Low Profile' },
      { label: 'EMBROIDERY', value: 'High-Density S+404 Mark' },
      { label: 'CLOSURE', value: 'Matte Steel Tuck Buckle' },
    ],
    materialsInfo: '100% heavyweight brushed cotton twill (~290 GSM). Sweatband moisture-wicking cotton.',
    shippingInfo: 'Crush-safe crown box dispatch within 48h.',
    description: 'Clean everyday headwear featuring tonal eyelets and a crisp embroidered S+404 front mark across all three SyntaxWear shades.',
    specs: [
      { label: 'Collection', value: 'Core Accessories' },
      { label: 'Sizing', value: 'Adjustable One-Size' },
      { label: 'Fabric', value: 'Brushed Cotton Twill' },
      { label: 'Profile', value: 'Unstructured Dad/Skate' },
    ],
    finishes: [
      { name: 'Botanical Sage', hex: '#546652', accentHex: '#A4B69E', image: '/images/products/cap-sage.jpg' },
      { name: 'Pitch Black', hex: '#1C1C1E', accentHex: '#D4822B', image: '/images/products/cap-pitch.jpg' },
      { name: 'Warm Peach', hex: '#D4822B', accentHex: '#E0953C', image: '/images/products/cap-peach.jpg' },
    ],
    sizes: ['One Size'],
  },
  {
    id: 'sw-utility-tote',
    index: '11',
    code: 'SW-TOTE-06',
    name: 'Heavy Canvas Utility Tote',
    subtitle: '400 GSM Architect Carry · Fits 16" Laptop',
    category: 'ACCESSORIES',
    collectionTag: 'CORE',
    price: 38,
    oldPrice: 48,
    discountPct: 21,
    priceLabel: '$38',
    specStatus: 'CARRY // -21%',
    badge: '400 GSM CANVAS',
    rating: 4.9,
    reviewsCount: 51,
    chipOrigin: '400 GSM Reinforced Canvas',
    image: '/images/products/tote-peach.jpg',
    gallery: [
      '/images/products/tote-peach.jpg',
      '/images/products/tote-pitch.jpg',
      '/images/products/tote-sage.jpg',
    ],
    soundscape: 'hoodie-lofi',
    soundtrackTitle: 'Heavy Duck Canvas',
    bpm: '86 BPM',
    editorialTagline: 'Boxed gusset floor stands upright on your studio desk. Built for daily dev gear.',
    materialNote: 'Double-layered base, bar-tack stitched webbing handles and padded internal 16-inch sleeve.',
    craftDetails: [
      { label: 'CANVAS', value: '400 GSM Cotton Duck' },
      { label: 'CAPACITY', value: '22L + 16" Laptop Sleeve' },
      { label: 'HARDWARE', value: 'Antiqued Brass Rivets' },
    ],
    materialsInfo: '100% heavy organic duck canvas with internal key leash and zip pocket.',
    shippingInfo: 'In stock — ships flat.',
    description: 'Structured daily carry engineered for 16-inch workstations, mechanical keyboards, and field gear with bold S+404 typographic spec plate.',
    specs: [
      { label: 'Collection', value: 'Core Carry' },
      { label: 'Canvas', value: '400 GSM Heavy Duck' },
      { label: 'Fit', value: '16" MacBook + Peripherals' },
      { label: 'Print', value: 'Technical Spec Plate' },
    ],
    finishes: [
      { name: 'Warm Peach', hex: '#D4822B', accentHex: '#E0953C', image: '/images/products/tote-peach.jpg' },
      { name: 'Pitch Black', hex: '#1C1C1E', accentHex: '#D4822B', image: '/images/products/tote-pitch.jpg' },
      { name: 'Botanical Sage', hex: '#546652', accentHex: '#A4B69E', image: '/images/products/tote-sage.jpg' },
    ],
    sizes: ['Standard (22L)'],
  },
  {
    id: 'sw-tactile-kbd',
    index: '12',
    code: 'SW-KBD-65',
    name: 'Tactile Field 65% Keyboard',
    subtitle: 'CNC Timber & Gasket Mount · Hot-Swap',
    category: 'TECH & DESK',
    collectionTag: 'TERMINAL',
    price: 164,
    oldPrice: 200,
    discountPct: 18,
    priceLabel: '$164',
    specStatus: 'FLASH TECH // -18%',
    isFlashDeal: true,
    batchLeft: 5,
    batchTotal: 15,
    badge: '-18% FLASH TECH',
    rating: 5.0,
    reviewsCount: 44,
    chipOrigin: 'CNC Timber + Brass Weight',
    image: '/images/products/desk-kbd-pitch.jpg',
    gallery: [
      '/images/products/desk-kbd-pitch.jpg',
      '/images/products/desk-kbd-sage.jpg',
      '/images/products/desk-kbd-peach.jpg',
      '/images/products/keyboard-detail.jpg',
    ],
    soundscape: 'keyboard-rhodes',
    soundtrackTitle: 'Thock Switch Matrix',
    bpm: '120 BPM',
    editorialTagline: 'Deep thock acoustics machined into our three colorways. Built for terminal speed.',
    materialNote: 'Poron gasket-mounted FR4 plate housing pre-lubed tactile switches wrapped in PBT matte legends.',
    craftDetails: [
      { label: 'LAYOUT', value: '65% Compact QMK/VIA' },
      { label: 'MOUNT', value: 'Dual Silicone Gasket' },
      { label: 'CONNECT', value: 'Tri-Mode USB-C / 2.4G / BT' },
    ],
    materialsInfo: 'Machined frame, dye-sub PBT keycaps, brass bottom acoustic bar, 4000mAh Li-Po cell.',
    shippingInfo: 'Ships tuned and keycap-tested with coiled USB-C cable.',
    description: 'Pair your SyntaxWear uniform with a tuned mechanical instrument. Pre-loaded VIA macros match every developer workflow out of the box.',
    specs: [
      { label: 'Category', value: 'Tech & Desk' },
      { label: 'Switches', value: 'Syntax Tactile 55g' },
      { label: 'Firmware', value: 'Open QMK / VIA' },
      { label: 'Remaining', value: '5 Units in Batch' },
    ],
    finishes: [
      { name: 'Pitch Black', hex: '#1C1C1E', accentHex: '#D4822B', image: '/images/products/desk-kbd-pitch.jpg' },
      { name: 'Botanical Sage', hex: '#546652', accentHex: '#A4B69E', image: '/images/products/desk-kbd-sage.jpg' },
      { name: 'Warm Peach', hex: '#D4822B', accentHex: '#E0953C', image: '/images/products/desk-kbd-peach.jpg' },
    ],
    sizes: ['65% ANSI'],
  },
  {
    id: 'sw-focus-audio',
    index: '13',
    code: 'SW-ANC-09',
    name: 'Focus ANC Studio Cans',
    subtitle: 'Alcantara Cushions · 45h Spatial Focus',
    category: 'TECH & DESK',
    collectionTag: 'LOADING',
    price: 185,
    oldPrice: 225,
    discountPct: 18,
    priceLabel: '$185',
    specStatus: 'DESK AUDIO // -18%',
    badge: '45H FOCUS ANC',
    rating: 4.9,
    reviewsCount: 39,
    chipOrigin: '40mm Beryllium Driver',
    image: '/images/products/audio-cans-sage.jpg',
    gallery: [
      '/images/products/audio-cans-sage.jpg',
      '/images/products/audio-cans-peach.jpg',
      '/images/products/audio-cans-pitch.jpg',
      '/images/products/headphones-detail.jpg',
    ],
    soundscape: 'hoodie-lofi',
    soundtrackTitle: 'Deep Flow Silence',
    bpm: '72 BPM',
    editorialTagline: 'Lock out ambient noise at 99% flow. Tactile suede earpads across Sage, Peach & Pitch.',
    materialNote: 'Anodized CNC yoke arms paired with breathable Alcantara memory cushions and -44dB hybrid ANC.',
    craftDetails: [
      { label: 'DRIVER', value: '40mm Beryllium Dynamic' },
      { label: 'ANC', value: '-44dB Hybrid Spatial' },
      { label: 'BATTERY', value: '45 Hours + USB-C Fast' },
    ],
    materialsInfo: 'Bead-blasted aluminum yokes, Japanese micro-suede memory foam cushions, braided cable included.',
    shippingInfo: 'Ships in molded hardshell SyntaxWear travel case.',
    description: 'Studio headphones colour-matched to your SyntaxWear uniform. Neutral reference curve tuned for long coding marathons and spatial audio playback.',
    specs: [
      { label: 'Collection', value: 'Loading Series' },
      { label: 'Driver', value: '40mm Beryllium' },
      { label: 'Latency', value: 'USB-C Lossless + BT 5.4' },
      { label: 'Weight', value: '278g Feather Frame' },
    ],
    finishes: [
      { name: 'Botanical Sage', hex: '#546652', accentHex: '#A4B69E', image: '/images/products/audio-cans-sage.jpg' },
      { name: 'Warm Peach', hex: '#D4822B', accentHex: '#E0953C', image: '/images/products/audio-cans-peach.jpg' },
      { name: 'Pitch Black', hex: '#1C1C1E', accentHex: '#D4822B', image: '/images/products/audio-cans-pitch.jpg' },
    ],
    sizes: ['Studio Over-Ear'],
  },
];
