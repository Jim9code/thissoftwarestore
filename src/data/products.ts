import { SoundscapeType } from '../utils/soundEngine';

export interface ProductFinish {
  name: string;
  hex: string;
  accentHex: string;
}

export interface Product {
  id: string;
  index: string;
  code: string;
  name: string;
  subtitle: string;
  category: 'KEYBOARDS' | 'AUDIO' | 'APPAREL' | 'OBJECTS';
  price: number;
  image: string;
  gallery: string[];
  rating: number;
  reviewsCount: number;
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

export const PRODUCTS: Product[] = [
  {
    id: 'ts-k1-keyboard',
    index: '01',
    code: 'TS-K01 // FIELD BOARD',
    name: 'Monolith 65% Mechanical Keyboard',
    subtitle: 'CNC Walnut & Anodized Sage Aluminum Chassis',
    category: 'KEYBOARDS',
    price: 340,
    image: '/images/products/keyboard-center.png',
    gallery: [
      '/images/products/keyboard-center.png',
      '/images/products/keyboard-detail.jpg',
      '/images/cutouts/floor-keyboard-center.png',
    ],
    rating: 4.9,
    reviewsCount: 38,
    editorialTagline: 'Made for the way you actually create.',
    materialNote:
      'Every surface is selected for touch, acoustic resilience, and the honest way it ages over time. Milled from a single billet of American walnut with bead-blasted sage aluminum plates, keeping pure tactile resonance at the forefront.',
    craftDetails: [
      { label: 'ORIGIN', value: 'SMALL-BATCH FOUNDRY' },
      { label: 'FINISH', value: 'HAND-OILED WALNUT & ANODIZED SAGE' },
      { label: 'DESIGNED FOR', value: 'DEEP FOCUS WRITING & CODE' },
    ],
    materialsInfo:
      'Kiln-dried solid American black walnut casing, 6063 aerospace-grade aluminum top plate in matte sage, custom factory-lubed desert quartz switches (45g operating force), sound-absorbing Poron dampening foam, and PBT double-shot keycaps.',
    shippingInfo:
      'Free worldwide carbon-neutral express shipping on orders over $150. Shipped in 100% recyclable molded paper pulp packaging with a 30-day tactile in-studio trial and 2-year foundry warranty.',
    chipOrigin: 'SILICON CORE: TS-M1 CORTEX // FORGED AT 1,420°C',
    soundscape: 'keyboard-rhodes',
    soundtrackTitle: 'DUNE RHODES & TACTILE SWITCHES',
    bpm: '84 BPM // WARM ANALOG',
    badge: 'FLAGSHIP DROP',
    description:
      'An everyday object reduced to its essentials. Tactile, durable, and designed to become more personal with use. Milled from a solid block of kiln-dried American walnut and bead-blasted sage aluminum with gasket-mounted desert quartz switches.',
    specs: [
      { label: 'CHASSIS', value: 'CNC Walnut + 6063 Sage Aluminum' },
      { label: 'SILICON', value: 'TS-M1 Ultra-Low Latency (0.4ms)' },
      { label: 'SWITCHES', value: 'Lubed Desert Quartz Linear (45g)' },
      { label: 'BATTERY', value: '4,800mAh // 6 Weeks Amber Backlight' },
    ],
    finishes: [
      { name: 'Walnut & Sage', hex: '#5C4331', accentHex: '#6B8068' },
      { name: 'Dune Sandstone', hex: '#D8C3A5', accentHex: '#E59838' },
      { name: 'Obsidian Night', hex: '#231811', accentHex: '#E59838' },
    ],
  },
  {
    id: 'ts-h1-headphones',
    index: '02',
    code: 'TS-A01 // ACOUSTIC OASIS',
    name: 'Solare Studio Over-Ear Headphones',
    subtitle: '50mm Beryllium Drivers & Lambskin Walnut Cups',
    category: 'AUDIO',
    price: 420,
    image: '/images/products/headphones-sand.png',
    gallery: [
      '/images/products/headphones-sand.png',
      '/images/products/headphones-detail.jpg',
      '/images/carousel/headphones-sand.jpg',
    ],
    rating: 4.9,
    reviewsCount: 32,
    editorialTagline: 'Made for the way you actually live.',
    materialNote:
      'Every surface is selected for touch, resilience, and the way it changes over time. Nothing is hidden beneath high-gloss finishes. The honest material is the final detail.',
    craftDetails: [
      { label: 'ORIGIN', value: 'SMALL-BATCH WORKSHOP' },
      { label: 'FINISH', value: 'HAND APPLIED' },
      { label: 'DESIGNED FOR', value: 'DAILY USE' },
    ],
    materialsInfo:
      'Custom 50mm beryllium-vapor dome transducers, molded Sahara quartz composite shells, brushed stainless telemetry yokes, memory-foam earpads wrapped in perforated full-grain lambskin, and breathable sage acoustic mesh headband.',
    shippingInfo:
      'Free worldwide carbon-neutral express shipping. Includes molded linen hard travel vault, 3.5mm braided aux cable with 1/4" gold adapter, and USB-C ultra-fast charging cable. 30-day in-home trial.',
    chipOrigin: 'SILICON CORE: TS-DSP9 ACOUSTIC ENGINE',
    soundscape: 'headphones-spatial',
    soundtrackTitle: 'STARLIT HORIZON SPATIAL ARPEGGIO',
    bpm: '96 BPM // SPATIAL',
    badge: 'BESTSELLER',
    description:
      'An everyday object reduced to its essentials. Tactile, durable, and designed to become more personal with use. Engineered for dead-silent desert isolation and warm, sun-drenched analog fidelity with exposed stainless telemetry yokes.',
    specs: [
      { label: 'DRIVERS', value: '50mm Custom Beryllium Dome' },
      { label: 'NOISE CONTROL', value: '-46dB Adaptive Wind & Sand ANC' },
      { label: 'MATERIALS', value: 'Walnut Acoustic Chambers + Sage Mesh' },
      { label: 'CODEC', value: 'Lossless 24-bit / 192kHz Wireless' },
    ],
    finishes: [
      { name: 'Sage & Brushed Bronze', hex: '#6B8068', accentHex: '#E59838' },
      { name: 'Deep Walnut', hex: '#422F22', accentHex: '#D8C3A5' },
      { name: 'Raw Amber Sand', hex: '#C29B6B', accentHex: '#5C4331' },
    ],
  },
  {
    id: 'ts-ap1-hoodie',
    index: '03',
    code: 'TS-W01 // ARCHITECTURAL FLEECE',
    name: 'Dune Heavyweight Box Hoodie',
    subtitle: '620 GSM Organic Desert Cotton // Garment Dyed',
    category: 'APPAREL',
    price: 185,
    image: '/images/products/hoodies-folded.png',
    gallery: [
      '/images/products/hoodies-folded.png',
      '/images/products/hoodie-detail.jpg',
      '/images/cutouts/floor-hoodies-left.png',
    ],
    rating: 4.8,
    reviewsCount: 54,
    editorialTagline: 'Made for the way you actually rest.',
    materialNote:
      'Structured like desert stone, soft like wind-worn linen. Cut in an architectural drop-shoulder silhouette from custom-milled 620 GSM organic cotton with an embedded waterproof NFC silicon authenticity chip in the cuff.',
    craftDetails: [
      { label: 'ORIGIN', value: 'PORTUGUESE TEXTILE MILL' },
      { label: 'FINISH', value: 'BOTANICAL SAGE WASH' },
      { label: 'DESIGNED FOR', value: 'COLD MORNINGS & FOCUS' },
    ],
    materialsInfo:
      '620 GSM heavyweight 100% GOTS-certified organic cotton loopback French terry. Pre-shrunk with botanical sage & mineral wash, double-lined seamless crossover hood, and custom silicone dipped drawcord tips.',
    shippingInfo:
      'Complimentary delivery on all orders over $150. Free returns within 30 days of delivery. Machine wash cold with like colors, hang dry in shade.',
    chipOrigin: 'WOVEN NFC SILICON THREAD // VERIFIED ORIGIN',
    soundscape: 'hoodie-lofi',
    soundtrackTitle: 'NIGHT BREEZE VINYL & SUB-BASS',
    bpm: '72 BPM // LO-FI DRIFT',
    badge: '620 GSM HEAVY',
    description:
      'An everyday garment reduced to its essentials. Tactile, durable, and designed to become more personal with wear. Structured like desert stone, cut in an architectural boxy drape with embedded NFC tag.',
    specs: [
      { label: 'FABRIC WEIGHT', value: '620 GSM Brushed Loopback Cotton' },
      { label: 'FIT PROFILE', value: 'Architectural Boxy / Drop Shoulder' },
      { label: 'DYE PROCESS', value: 'Botanical Sage & Mineral Walnut Wash' },
      { label: 'HARDWARE', value: 'Embedded Silicon NFC Tag in Left Cuff' },
    ],
    finishes: [
      { name: 'Botanical Sage', hex: '#6B8068', accentHex: '#E59838' },
      { name: 'Roasted Walnut', hex: '#3E2B1E', accentHex: '#A9B9A5' },
      { name: 'Sunbleached Sand', hex: '#E3D7C3', accentHex: '#5C4331' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'ts-ap2-jacket',
    index: '04',
    code: 'TS-W02 // SILICA INSULATION',
    name: '404 Silica-Fill Puffer Jacket',
    subtitle: '800-Fill Desert Silica Warmth // Amber Glow',
    category: 'APPAREL',
    price: 310,
    image: '/images/products/jacket-404.png',
    gallery: [
      '/images/products/jacket-404.png',
      '/images/products/jacket-detail.jpg',
      '/images/carousel/jacket-404.jpg',
    ],
    rating: 5.0,
    reviewsCount: 29,
    editorialTagline: 'Made for the way you actually brave the elements.',
    materialNote:
      'Engineered with 404 // ROUTE_NOT_FOUND telemetry and 800-fill silica-treated insulation. This jacket wraps you in lightweight desert warmth without synthetic bulk, resisting cold desert gusts with ease.',
    craftDetails: [
      { label: 'ORIGIN', value: 'TECHNICAL ATELIER' },
      { label: 'FINISH', value: 'DWR WEATHERPROOF RIPSTOP' },
      { label: 'DESIGNED FOR', value: 'ALL-SEASON ADVENTURE' },
    ],
    materialsInfo:
      'Micro-ripstop nylon shell treated with eco-DWR water repellent, 800-fill RDS-certified white goose down treated with hydrophobic silica nanocoating, custom CNC anodized aluminum dual zippers.',
    shippingInfo:
      'Free worldwide insured express shipping. Packed in breathable organic cotton garment storage bag with 30-day exchange window.',
    chipOrigin: 'SILICA CORE: 404 ROUTE_NOT_FOUND TELEMETRY',
    soundscape: 'hoodie-lofi',
    soundtrackTitle: 'WARM DESERT TWILIGHT & SUB-BASS',
    bpm: '76 BPM // COCOON',
    badge: 'DESERT COAT',
    description:
      'An everyday technical layer reduced to its essentials. Tactile, durable, and designed to become more personal with wear. Engineered with 404 telemetry and 800-fill silica-treated insulation for lightweight desert warmth.',
    specs: [
      { label: 'SHELL', value: 'Lightweight Weatherproof Ripstop' },
      { label: 'INSULATION', value: '800-Fill Silica-Treated Warmth' },
      { label: 'HARDWARE', value: 'Custom CNC Anodized Zipper Pulls' },
      { label: 'ORIGIN', value: 'Initial Desert Release // Batch 001' },
    ],
    finishes: [
      { name: 'Amber Glow', hex: '#E59838', accentHex: '#2A1D15' },
      { name: 'Sage Bark', hex: '#6B8068', accentHex: '#FFCC70' },
      { name: 'Sand Dune', hex: '#D8C3A5', accentHex: '#5C4331' },
    ],
    sizes: ['36', '38', '40'],
  },
  {
    id: 'ts-ap3-tshirt',
    index: '05',
    code: 'TS-T01 // COMMIT RELEASE',
    name: 'Commit Heavyweight Boxy Tee',
    subtitle: '320 GSM Unbleached Desert Ecru Cotton',
    category: 'APPAREL',
    price: 89,
    image: '/images/products/tshirt-commit.png',
    gallery: [
      '/images/products/tshirt-commit.png',
      '/images/products/tshirt-detail.jpg',
      '/images/carousel/tshirt-commit.jpg',
    ],
    rating: 4.9,
    reviewsCount: 46,
    editorialTagline: 'Made for the way you actually build.',
    materialNote:
      'Cut from heavyweight 320 GSM unbleached desert ecru cotton with high-density walnut branch-graph graphic print. Initial desert release compiled with zero errors, built to hold its structured silhouette through years of wear.',
    craftDetails: [
      { label: 'ORIGIN', value: 'HERITAGE KNITTERS' },
      { label: 'FINISH', value: 'SILICA MINERAL INK' },
      { label: 'DESIGNED FOR', value: 'DAILY UNIFORM' },
    ],
    materialsInfo:
      '320 GSM long-staple organic combed cotton, non-toxic mineral dyes, 1.25" thick 1x1 rib collar that never rolls or sags, blind-stitched hem and sleeves.',
    shippingInfo:
      'Complimentary delivery on orders over $150. Free returns within 30 days. Pre-shrunk; machine wash cold, lay flat or hang to dry.',
    chipOrigin: 'GIT COMMIT -M INITIAL DESERT RELEASE',
    soundscape: 'hoodie-lofi',
    soundtrackTitle: 'SIROCCO WIND & TAPE ECHO',
    bpm: '78 BPM // TAPE DUB',
    badge: 'CORE DROP',
    description:
      'An everyday shirt reduced to its essentials. Tactile, durable, and designed to become more personal with wear. Cut from heavyweight 320 GSM unbleached desert ecru cotton with high-density walnut branch-graph print.',
    specs: [
      { label: 'FABRIC', value: '320 GSM 100% Combed Cotton' },
      { label: 'PRINT', value: 'High-Density Silica Mineral Ink' },
      { label: 'COLLAR', value: 'Thick 1.25" Ribbed Bound Neck' },
      { label: 'FIT', value: 'Relaxed Architectural Silhouette' },
    ],
    finishes: [
      { name: 'Dune Ecru', hex: '#D8C3A5', accentHex: '#5C4331' },
      { name: 'Sage Botanical', hex: '#6B8068', accentHex: '#F6F2EA' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'ts-core-chip',
    index: '06',
    code: 'TS-M01 // SILICA CORE',
    name: 'TS-M1 Silica Processor Core',
    subtitle: 'Custom RISC-V Neural Silicon // 1,420°C Forged',
    category: 'OBJECTS',
    price: 195,
    image: '/images/products/silicon-chip-core.png',
    gallery: [
      '/images/products/silicon-chip-core.png',
      '/images/products/chip-detail.jpg',
      '/images/chip-product-assembly.jpg',
    ],
    rating: 5.0,
    reviewsCount: 19,
    editorialTagline: 'Made for the way you actually engineer.',
    materialNote:
      'Pure desert quartz melted at 1,420°C into ultra-low latency RISC-V neural processor architecture with glowing golden "S" wind-carved emblem. The physical bridge between raw sand and high-performance computing.',
    craftDetails: [
      { label: 'ORIGIN', value: 'CLEANROOM FOUNDRY' },
      { label: 'FINISH', value: 'MOLTEN GOLD & QUARTZ' },
      { label: 'DESIGNED FOR', value: 'HARDWARE DEVELOPERS' },
    ],
    materialsInfo:
      'Photolithographically etched silica wafer, gold-plated bonding pads, thermally conductive sapphire ceramic substrate, hermetically sealed quartz crystal casing.',
    shippingInfo:
      'Shipped in anti-static conductive aluminum enclosure with serialized certificate of foundry authenticity and custom USB-C hardware debugging interface.',
    chipOrigin: 'SILICON CORE: TS-M1 DUAL RISC-V 3.2GHZ',
    soundscape: 'monolith-drone',
    soundtrackTitle: 'FUSED QUARTZ FREQUENCY // 432HZ',
    bpm: 'CONTINUOUS // RESONANCE',
    badge: 'CORE ENGINE',
    description:
      'An everyday computing artifact reduced to its essentials. Tactile, durable, and designed to become more personal with use. Pure desert quartz melted at 1,420°C into RISC-V neural processor architecture.',
    specs: [
      { label: 'ARCHITECTURE', value: 'Dual-Core TS-M1 64-Bit RISC-V' },
      { label: 'PROCESS', value: 'Sand-Fused Silica Micro-Lattice' },
      { label: 'EMBLEM', value: 'Molten Gold Wind-Carved S Insignia' },
      { label: 'COMPATIBILITY', value: 'Low-Latency Wireless & USB-C' },
    ],
    finishes: [
      { name: 'Molten Gold & Silicon', hex: '#FFCC70', accentHex: '#160E09' },
      { name: 'Obsidian Matte', hex: '#1E140E', accentHex: '#E59838' },
    ],
  },
];
