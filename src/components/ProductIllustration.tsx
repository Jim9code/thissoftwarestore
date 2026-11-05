import React from 'react';
import { Product } from '../data/products';

interface ProductIllustrationProps {
  product: Product;
  finishIndex?: number;
  className?: string;
  isHero?: boolean;
}

export const ProductIllustration: React.FC<ProductIllustrationProps> = ({
  product,
  finishIndex = 0,
  className = '',
  isHero = false,
}) => {
  const finish = product.finishes[finishIndex] || product.finishes[0];
  const primary = finish.hex;
  const accent = finish.accentHex;

  if (product.id === 'ts-k1-keyboard') {
    return (
      <svg
        viewBox="0 0 480 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full drop-shadow-2xl ${className}`}
      >
        <defs>
          <radialGradient id={`glow-${product.id}`} cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor={accent} stopOpacity={isHero ? '0.45' : '0.25'} />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`chassis-${product.id}`} x1="0" y1="0" x2="480" y2="300" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={primary} />
            <stop offset="100%" stopColor="#1E140E" />
          </linearGradient>
        </defs>
        {/* Ambient Underglow */}
        <ellipse cx="240" cy="215" rx="195" ry="42" fill={`url(#glow-${product.id})`} />
        {/* Shadow base */}
        <rect x="52" y="102" width="376" height="128" rx="18" fill="#120B07" opacity="0.55" />
        {/* CNC Walnut/Aluminum Frame */}
        <rect
          x="44"
          y="86"
          width="392"
          height="134"
          rx="16"
          fill={`url(#chassis-${product.id})`}
          stroke={accent}
          strokeWidth="1.5"
          strokeOpacity="0.45"
        />
        {/* Inner Plate */}
        <rect x="58" y="98" width="364" height="110" rx="10" fill="#18100B" />
        {/* Amber LED Accent Strip */}
        <rect x="68" y="92" width="84" height="3" rx="1.5" fill="#E59838" />
        {/* Keycaps Row 1 */}
        {Array.from({ length: 13 }).map((_, i) => (
          <rect
            key={`r1-${i}`}
            x={64 + i * 26.5}
            y={104}
            width={23}
            height={22}
            rx={4}
            fill={i === 0 || i === 12 ? accent : '#EDE5D5'}
            fillOpacity={i === 0 || i === 12 ? 0.9 : 0.88}
          />
        ))}
        {/* Keycaps Row 2 */}
        {Array.from({ length: 13 }).map((_, i) => (
          <rect
            key={`r2-${i}`}
            x={64 + i * 26.5}
            y={130}
            width={i === 0 ? 32 : 23}
            height={22}
            rx={4}
            fill={i > 0 && i < 11 ? '#D8C3A5' : primary}
          />
        ))}
        {/* Keycaps Row 3 */}
        {Array.from({ length: 12 }).map((_, i) => (
          <rect
            key={`r3-${i}`}
            x={64 + i * 28.5}
            y={156}
            width={i === 10 ? 42 : 25}
            height={22}
            rx={4}
            fill={i === 10 ? '#E59838' : '#CFC0AC'}
          />
        ))}
        {/* Spacebar & Bottom Modifiers */}
        <rect x="64" y="182" width="34" height="21" rx="4" fill="#6B8068" />
        <rect x="102" y="182" width="34" height="21" rx="4" fill="#5C4331" />
        <rect x="140" y="182" width="166" height="21" rx="4" fill={accent} />
        <rect x="310" y="182" width="34" height="21" rx="4" fill="#5C4331" />
        <rect x="348" y="182" width="68" height="21" rx="4" fill="#6B8068" />
        {/* Rotary Knob top right */}
        <circle cx="406" cy="115" r="11" fill="#E59838" stroke="#18100B" strokeWidth="2.5" />
      </svg>
    );
  }

  if (product.id === 'ts-h1-headphones') {
    return (
      <svg
        viewBox="0 0 480 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full drop-shadow-2xl ${className}`}
      >
        <defs>
          <radialGradient id={`glow-${product.id}`} cx="50%" cy="55%" r="50%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.4" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="240" cy="175" r="135" fill={`url(#glow-${product.id})`} />
        {/* Headband Arch */}
        <path
          d="M132 175 C132 72, 348 72, 348 175"
          stroke={primary}
          strokeWidth="18"
          strokeLinecap="round"
        />
        <path
          d="M142 165 C142 84, 338 84, 338 165"
          stroke={accent}
          strokeWidth="3"
          strokeOpacity="0.6"
          strokeLinecap="round"
        />
        {/* Stainless Telemetry Yoke Rods */}
        <rect x="126" y="160" width="6" height="45" rx="3" fill="#D8C3A5" />
        <rect x="348" y="160" width="6" height="45" rx="3" fill="#D8C3A5" />
        {/* Left & Right Ear Cushions */}
        <rect x="138" y="152" width="34" height="92" rx="17" fill="#2A1D15" />
        <rect x="308" y="152" width="34" height="92" rx="17" fill="#2A1D15" />
        {/* Left & Right Walnut/Sage Outer Cups */}
        <rect
          x="104"
          y="146"
          width="48"
          height="104"
          rx="24"
          fill={primary}
          stroke={accent}
          strokeWidth="2"
        />
        <rect
          x="328"
          y="146"
          width="48"
          height="104"
          rx="24"
          fill={primary}
          stroke={accent}
          strokeWidth="2"
        />
        {/* Acoustic Mesh vents */}
        <circle cx="128" cy="198" r="10" fill={accent} fillOpacity="0.85" />
        <circle cx="352" cy="198" r="10" fill={accent} fillOpacity="0.85" />
      </svg>
    );
  }

  if (product.id === 'ts-ap1-hoodie' || product.id === 'ts-ap2-jacket') {
    const isJacket = product.id === 'ts-ap2-jacket';
    return (
      <svg
        viewBox="0 0 480 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full drop-shadow-2xl ${className}`}
      >
        <ellipse cx="240" cy="260" rx="135" ry="26" fill="#160E09" opacity="0.28" />
        {/* Drop-shoulder architectural silhouette */}
        <path
          d="M175 68 L208 52 L272 52 L305 68 L382 118 L348 215 L312 195 L312 268 L168 268 L168 195 L132 215 L98 118 Z"
          fill={primary}
          stroke={accent}
          strokeWidth="1.5"
          strokeOpacity="0.5"
        />
        {/* Structured Hood or Collar */}
        {!isJacket ? (
          <path
            d="M192 64 C192 32, 288 32, 288 64 L268 88 L212 88 Z"
            fill={primary}
            stroke="#1E140E"
            strokeWidth="2"
          />
        ) : (
          <path d="M195 56 L240 86 L285 56 L270 46 L210 46 Z" fill="#2A1D15" />
        )}
        {/* Kangaroo Pocket or Field Cargo Pockets */}
        {!isJacket ? (
          <path
            d="M188 188 L292 188 L302 246 L178 246 Z"
            fill="#1E140E"
            fillOpacity="0.22"
            stroke={accent}
            strokeOpacity="0.4"
          />
        ) : (
          <>
            <rect x="182" y="112" width="44" height="52" rx="4" fill="#1E140E" fillOpacity="0.28" stroke={accent} strokeOpacity="0.45" />
            <rect x="254" y="112" width="44" height="52" rx="4" fill="#1E140E" fillOpacity="0.28" stroke={accent} strokeOpacity="0.45" />
            <line x1="240" y1="84" x2="240" y2="268" stroke="#1E140E" strokeWidth="2.5" />
          </>
        )}
        {/* Embedded NFC Silicon Thread Tag on Left Cuff */}
        <rect x="334" y="192" width="14" height="8" rx="2" fill="#E59838" />
        {/* Chest Minimalist Brand Stamp */}
        <rect x="202" y="122" width="32" height="6" rx="2" fill={accent} fillOpacity="0.85" />
      </svg>
    );
  }

  if (product.id === 'ts-ob1-lamp') {
    return (
      <svg
        viewBox="0 0 480 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full drop-shadow-2xl ${className}`}
      >
        <defs>
          <radialGradient id="solar-orb" cx="50%" cy="45%" r="48%">
            <stop offset="0%" stopColor="#FFF3D1" />
            <stop offset="40%" stopColor="#E59838" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#E59838" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Warm Solar Halo */}
        <circle cx="240" cy="142" r="115" fill="url(#solar-orb)" />
        {/* Monolith Stone Base */}
        <path
          d="M176 172 L304 172 L322 264 L158 264 Z"
          fill={primary}
          stroke={accent}
          strokeWidth="1.5"
        />
        {/* Glass Amber Diffuser Cylinder */}
        <rect
          x="188"
          y="78"
          width="104"
          height="98"
          rx="52"
          fill="#E59838"
          fillOpacity="0.85"
          stroke="#FFF3D1"
          strokeWidth="1.5"
        />
        {/* Solid Walnut Rotary Dial */}
        <circle cx="240" cy="218" r="18" fill="#2A1D15" stroke="#E59838" strokeWidth="2" />
        <line x1="240" y1="204" x2="240" y2="215" stroke="#E59838" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  // Default: ts-k2-numpad Macro Synth
  return (
    <svg
      viewBox="0 0 480 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full drop-shadow-2xl ${className}`}
    >
      <rect
        x="148"
        y="58"
        width="184"
        height="204"
        rx="20"
        fill={primary}
        stroke={accent}
        strokeWidth="2"
      />
      {/* Amber OLED Spectrum Screen */}
      <rect x="168" y="78" width="96" height="44" rx="6" fill="#160E09" />
      <path d="M178 108 L190 92 L202 104 L216 86 L230 102 L248 90" stroke="#E59838" strokeWidth="2.5" strokeLinecap="round" />
      {/* CNC Detented Rotary Wheel */}
      <circle cx="294" cy="100" r="22" fill="#E59838" stroke="#160E09" strokeWidth="3" />
      {/* 8 Programmable Mechanical Keys */}
      {Array.from({ length: 8 }).map((_, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        return (
          <rect
            key={i}
            x={168 + col * 37}
            y={140 + row * 48}
            width={31}
            height={38}
            rx={6}
            fill={i === 0 || i === 7 ? '#E59838' : '#EDE5D5'}
          />
        );
      })}
    </svg>
  );
};

