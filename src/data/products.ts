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
  chipOrigin: string;
  soundscape: SoundscapeType;
  soundtrackTitle: string;
  bpm: string;
  description: string;
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
    chipOrigin: 'SILICON CORE: TS-M1 CORTEX // FORGED AT 1,420°C',
    soundscape: 'keyboard-rhodes',
    soundtrackTitle: 'DUNE RHODES & TACTILE SWITCHES',
    bpm: '84 BPM // WARM ANALOG',
    badge: 'FLAGSHIP DROP',
    description:
      'Milled from a solid block of kiln-dried American walnut and bead-blasted sage aluminum. Powered by our custom sand-fused TS-M1 low-latency wireless silicon chip with gasket-mounted desert quartz switches.',
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
    chipOrigin: 'SILICON CORE: TS-DSP9 ACOUSTIC ENGINE',
    soundscape: 'headphones-spatial',
    soundtrackTitle: 'STARLIT HORIZON SPATIAL ARPEGGIO',
    bpm: '96 BPM // SPATIAL',
    badge: 'BESTSELLER',
    description:
      'Engineered for dead-silent desert isolation and warm, sun-drenched analog fidelity. Features exposed stainless telemetry yokes, breathable sage acoustic mesh, and our custom TS-DSP9 spatial audio silicon.',
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
    chipOrigin: 'WOVEN NFC SILICON THREAD // VERIFIED ORIGIN',
    soundscape: 'hoodie-lofi',
    soundtrackTitle: 'NIGHT BREEZE VINYL & SUB-BASS',
    bpm: '72 BPM // LO-FI DRIFT',
    badge: '620 GSM HEAVY',
    description:
      'Structured like desert stone, soft like wind-worn linen. Cut in an architectural drop-shoulder silhouette from custom-milled 620 GSM organic cotton with an embedded waterproof NFC silicon authenticity chip in the cuff.',
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
    id: 'ts-ob1-lamp',
    index: '04',
    code: 'TS-O01 // AMBIENT INSTRUMENT',
    name: 'Amber Glow Horizon Desk Monolith',
    subtitle: 'Circadian Solar Lamp & Qi2 Magnetic Dock',
    category: 'OBJECTS',
    price: 260,
    chipOrigin: 'SILICON CORE: TS-LUX CIRCADIAN CONTROLLER',
    soundscape: 'monolith-drone',
    soundtrackTitle: 'WARM SOLAR DRONE // 432HZ',
    bpm: 'AMBIENT // CONTINUOUS',
    description:
      'Brings the exact color temperature of the golden desert hour to your desk. Rotate the solid walnut dial to shift smoothly from scorching midday clarity (4500K) to deep ember campfire glow (1800K).',
    specs: [
      { label: 'LIGHT ENGINE', value: 'Full-Spectrum Amber-to-Daylight LED' },
      { label: 'BODY', value: 'Carved Sandstone Base + Walnut Dial' },
      { label: 'CHARGING', value: '15W Qi2 MagSafe Wireless Pad' },
      { label: 'DIMMING', value: 'Stepless Hall-Effect Magnetic Rotary' },
    ],
    finishes: [
      { name: 'Amber Glow & Walnut', hex: '#E59838', accentHex: '#422F22' },
      { name: 'Sage Anodized', hex: '#546652', accentHex: '#E59838' },
    ],
  },
  {
    id: 'ts-ap2-jacket',
    index: '05',
    code: 'TS-W02 // STORM SHELL',
    name: 'Nomad Technical Field Overshirt',
    subtitle: 'Windproof Japanese Nylon & Walnut Horn Buttons',
    category: 'APPAREL',
    price: 245,
    chipOrigin: 'WOVEN NFC SILICON THREAD // WEATHER SHIELD',
    soundscape: 'hoodie-lofi',
    soundtrackTitle: 'SIROCCO WIND & TAPE ECHO',
    bpm: '78 BPM // TAPE DUB',
    description:
      'Built to transition from scorching afternoon heat to freezing desert night breezes. Crafted from breathable DWR-coated crinkle nylon with concealed magnetic cable routing for your studio headphones.',
    specs: [
      { label: 'SHELL', value: '3-Layer Japanese Taslan Crinkle Nylon' },
      { label: 'POCKETS', value: '4 Magnetic Storm-Flap Cargo Compartments' },
      { label: 'BUTTONS', value: 'Lathe-Turned Walnut & Matte Brass' },
      { label: 'WEIGHT', value: '380g Ultra-Packable Architecture' },
    ],
    finishes: [
      { name: 'Walnut Bark', hex: '#4A3425', accentHex: '#E59838' },
      { name: 'Desert Sage', hex: '#758A72', accentHex: '#2A1D15' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: 'ts-k2-numpad',
    index: '06',
    code: 'TS-K02 // MACRO SYNTH',
    name: 'Field Rotary Macro Pad & Audio DAC',
    subtitle: '32-Bit Hi-Fi DAC + 8 Programmable Keys + CNC Knob',
    category: 'KEYBOARDS',
    price: 195,
    chipOrigin: 'SILICON CORE: TS-DAC32 DUAL ESS SABRE',
    soundscape: 'keyboard-rhodes',
    soundtrackTitle: 'MODULAR ARPEGGIO & MECHANICAL PULSE',
    bpm: '110 BPM // PRECISION',
    badge: 'NEW OBJECT',
    description:
      'A pocket-sized command center for builders and sound designers. Combines an audiophile 32-bit headphone amplifier with 8 hot-swappable mechanical keys and a weighted amber-lit aluminum rotary encoder.',
    specs: [
      { label: 'DAC CHIP', value: 'TS-DAC32 Balanced 4.4mm + 3.5mm Out' },
      { label: 'ENCODER', value: '256-Step Detented CNC Brass Wheel' },
      { label: 'DISPLAY', value: 'Amber OLED Real-Time Spectrum Meter' },
      { label: 'FIRMWARE', value: 'Open QMK / VIA + Web Configurator' },
    ],
    finishes: [
      { name: 'Amber & Walnut', hex: '#E59838', accentHex: '#2A1D15' },
      { name: 'Sage Monolith', hex: '#6B8068', accentHex: '#F6F2EA' },
    ],
  },
];

