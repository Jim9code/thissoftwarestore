import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, RotateCcw, Check } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export interface ReceiptLineItem {
  name: string;
  meta?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface ReceiptData {
  orderNumber: string;
  dateLabel: string;
  email: string;
  customerName?: string;
  shippingAddress?: string;
  deliveryLabel: string;
  paymentLast4?: string;
  items: ReceiptLineItem[];
  subtotal: number;
  discountCode?: string;
  discountAmount?: number;
  tax?: number;
  shipping: number;
  total: number;
}

interface BarcodeBar {
  x: number;
  width: number;
}

/**
 * Generates a deterministic Code-128 style visual barcode pattern seeded by the order number.
 */
function generateBarcodeBars(seed: string, totalWidth = 220): { bars: BarcodeBar[]; viewWidth: number } {
  const safeSeed = seed || 'SW-SYNTAXWEAR-001';
  let hash = 2166136261;
  for (let i = 0; i < safeSeed.length; i++) {
    hash ^= safeSeed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  const nextRand = () => {
    hash ^= hash << 13;
    hash ^= hash >>> 17;
    hash ^= hash << 5;
    return (hash >>> 0) / 4294967296;
  };

  const bars: BarcodeBar[] = [];
  let cursor = 0;

  // Start guard
  bars.push({ x: cursor, width: 2 });
  cursor += 3.5;
  bars.push({ x: cursor, width: 1.5 });
  cursor += 3.5;

  while (cursor < totalWidth - 10) {
    const wChoice = nextRand();
    const gChoice = nextRand();
    const width = wChoice > 0.78 ? 3.2 : wChoice > 0.45 ? 2 : 1.1;
    const gap = gChoice > 0.7 ? 3.1 : gChoice > 0.35 ? 2 : 1.2;
    if (cursor + width > totalWidth - 8) break;
    bars.push({ x: cursor, width });
    cursor += width + gap;
  }

  // End guard
  bars.push({ x: totalWidth - 7, width: 1.5 });
  bars.push({ x: totalWidth - 3.5, width: 2.2 });

  return { bars, viewWidth: totalWidth };
}

function truncateText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let trimmed = text;
  while (trimmed.length > 3 && ctx.measureText(`${trimmed}…`).width > maxWidth) {
    trimmed = trimmed.slice(0, -1);
  }
  return `${trimmed}…`;
}

/**
 * Renders the thermal receipt (complete with top printer bar, dotted leaders, red PAID stamp,
 * and barcode) to a high-DPI offscreen canvas and triggers a clean PNG download.
 */
export async function downloadReceiptPng(receipt: ReceiptData): Promise<void> {
  if (typeof document === 'undefined') return;
  try {
    await document.fonts.ready;
  } catch {
    // Proceed cleanly if fonts.ready rejects
  }

  const scale = 2;
  const canvasWidth = 440;
  const paperWidth = 316;
  const paperX = (canvasWidth - paperWidth) / 2;
  const padX = 24;

  const rowHeight = 26;
  const hasDiscount = Boolean(receipt.discountAmount && receipt.discountAmount > 0);
  const hasTax = Boolean(receipt.tax && receipt.tax > 0);
  const extraRows = 1 + (hasDiscount ? 1 : 0) + (hasTax ? 1 : 0);
  const itemsBlockHeight = Math.max(1, receipt.items.length + extraRows) * rowHeight;
  const paperHeight = 320 + itemsBlockHeight;
  const canvasHeight = paperHeight + 92;

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth * scale;
  canvas.height = canvasHeight * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.scale(scale, scale);

  // Outer studio matte backdrop
  ctx.fillStyle = '#f5f4ef';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Soft ambient shadow behind receipt sheet
  ctx.save();
  ctx.shadowColor = 'rgba(20, 18, 14, 0.16)';
  ctx.shadowBlur = 32;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 18;
  ctx.fillStyle = '#faf8f2';
  ctx.fillRect(paperX, 46, paperWidth, paperHeight);
  ctx.restore();

  // Paper body fill + subtle warm top crease shadow
  const paperGrad = ctx.createLinearGradient(0, 46, 0, 46 + paperHeight);
  paperGrad.addColorStop(0, '#eeebe2');
  paperGrad.addColorStop(0.05, '#faf8f2');
  paperGrad.addColorStop(1, '#f6f3ea');
  ctx.fillStyle = paperGrad;
  ctx.fillRect(paperX, 46, paperWidth, paperHeight);

  // Sleek dark thermal printer slot bar at top
  const slotW = paperWidth + 32;
  const slotX = (canvasWidth - slotW) / 2;
  const slotY = 24;
  const slotH = 26;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 5;
  const slotGrad = ctx.createLinearGradient(0, slotY, 0, slotY + slotH);
  slotGrad.addColorStop(0, '#323538');
  slotGrad.addColorStop(0.35, '#1d1f21');
  slotGrad.addColorStop(1, '#101113');
  ctx.fillStyle = slotGrad;
  ctx.beginPath();
  ctx.roundRect(slotX, slotY, slotW, slotH, 6);
  ctx.fill();
  ctx.restore();

  // Printer LED dot
  ctx.save();
  ctx.fillStyle = '#22c55e';
  ctx.shadowColor = 'rgba(34, 197, 94, 0.85)';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(slotX + 16, slotY + slotH / 2, 2.7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Printer label
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '600 8px "DM Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('R E C E I P T', canvasWidth / 2, slotY + 16);

  // Dark recessed feed slit along printer lip
  ctx.fillStyle = '#070809';
  ctx.fillRect(paperX - 4, slotY + slotH - 3, paperWidth + 8, 4);

  // Receipt Typography
  let y = 84;
  ctx.fillStyle = '#181614';
  ctx.font = '700 17px "Manrope", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SYNTAXWEAR', canvasWidth / 2, y);

  y += 17;
  ctx.fillStyle = '#6f6a61';
  ctx.font = '500 9px "DM Mono", monospace';
  ctx.fillText('*** SALES RECEIPT ***', canvasWidth / 2, y);

  y += 14;
  ctx.fillStyle = '#8b857b';
  ctx.font = '400 8px "DM Mono", monospace';
  ctx.fillText(`${receipt.orderNumber}  ·  ${receipt.dateLabel}`, canvasWidth / 2, y);

  // Dashed divider 1
  y += 15;
  ctx.save();
  ctx.strokeStyle = 'rgba(24, 22, 20, 0.22)';
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(paperX + padX, y);
  ctx.lineTo(paperX + paperWidth - padX, y);
  ctx.stroke();
  ctx.restore();

  y += 22;

  const drawLeaderRow = (leftText: string, rightText: string) => {
    ctx.font = '400 10.5px "DM Mono", monospace';
    const maxLeftW = paperWidth - padX * 2 - 58;
    const label = truncateText(ctx, leftText, maxLeftW);

    ctx.fillStyle = '#2b2824';
    ctx.textAlign = 'left';
    ctx.fillText(label, paperX + padX, y);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#181614';
    ctx.fillText(rightText, paperX + paperWidth - padX, y);

    const leftWidth = ctx.measureText(label).width;
    const rightWidth = ctx.measureText(rightText).width;
    const dotsStart = paperX + padX + leftWidth + 6;
    const dotsEnd = paperX + paperWidth - padX - rightWidth - 6;

    if (dotsEnd > dotsStart + 8) {
      ctx.save();
      ctx.strokeStyle = 'rgba(24, 22, 20, 0.28)';
      ctx.lineWidth = 1;
      ctx.setLineDash([1.5, 3]);
      ctx.beginPath();
      ctx.moveTo(dotsStart, y - 2.5);
      ctx.lineTo(dotsEnd, y - 2.5);
      ctx.stroke();
      ctx.restore();
    }

    y += rowHeight;
  };

  receipt.items.forEach((item) => {
    const qtySuffix = item.quantity > 1 ? ` ×${item.quantity}` : '';
    const detail = item.meta ? ` (${item.meta})` : '';
    drawLeaderRow(`${item.name}${detail}${qtySuffix}`, `$${item.lineTotal.toFixed(2)}`);
  });

  if (hasDiscount && receipt.discountAmount) {
    drawLeaderRow(
      `Promo (${receipt.discountCode || 'DISCOUNT'})`,
      `-$${receipt.discountAmount.toFixed(2)}`
    );
  }

  drawLeaderRow(
    receipt.deliveryLabel || 'Shipping',
    receipt.shipping === 0 ? '$0.00' : `$${receipt.shipping.toFixed(2)}`
  );

  if (hasTax && receipt.tax) {
    drawLeaderRow('Estimated Tax', `$${receipt.tax.toFixed(2)}`);
  }

  // Dashed divider 2
  y -= 4;
  ctx.save();
  ctx.strokeStyle = 'rgba(24, 22, 20, 0.22)';
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(paperX + padX, y);
  ctx.lineTo(paperX + paperWidth - padX, y);
  ctx.stroke();
  ctx.restore();

  // TOTAL row
  y += 22;
  ctx.fillStyle = '#141210';
  ctx.font = '700 13px "Manrope", system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('TOTAL', paperX + padX, y);
  ctx.font = '700 13px "DM Mono", monospace';
  ctx.textAlign = 'right';
  ctx.fillText(`$${receipt.total.toFixed(2)}`, paperX + paperWidth - padX, y);

  // Tilted crimson PAID stamp
  y += 30;
  ctx.save();
  ctx.translate(canvasWidth / 2, y);
  ctx.rotate((-9 * Math.PI) / 180);
  ctx.strokeStyle = '#b9382c';
  ctx.lineWidth = 2;
  ctx.fillStyle = 'rgba(185, 56, 44, 0.06)';
  ctx.beginPath();
  ctx.roundRect(-34, -14, 68, 28, 4);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#b9382c';
  ctx.font = '700 13px "DM Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PAID', 0, 1);
  ctx.restore();

  // Dashed divider 3
  y += 28;
  ctx.save();
  ctx.strokeStyle = 'rgba(24, 22, 20, 0.22)';
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(paperX + padX, y);
  ctx.lineTo(paperX + paperWidth - padX, y);
  ctx.stroke();
  ctx.restore();

  // Thank you footer
  y += 22;
  ctx.fillStyle = '#181614';
  ctx.font = '700 9.5px "Manrope", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('THANK YOU FOR SHOPPING WITH US!', canvasWidth / 2, y);

  // Crisp Barcode
  y += 14;
  const barcodeWidth = paperWidth - padX * 2;
  const { bars } = generateBarcodeBars(receipt.orderNumber, barcodeWidth);
  const barcodeStartX = paperX + padX;
  ctx.fillStyle = '#181614';
  bars.forEach((bar) => {
    ctx.fillRect(barcodeStartX + bar.x, y, bar.width, 32);
  });

  // Trigger file download
  const filename = `SyntaxWear-Receipt-${receipt.orderNumber || 'Order'}.png`;
  const triggerDownload = (url: string, revoke: boolean) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (revoke) {
      window.setTimeout(() => URL.revokeObjectURL(url), 1500);
    }
  };

  if (canvas.toBlob) {
    await new Promise<void>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          triggerDownload(URL.createObjectURL(blob), true);
        } else {
          triggerDownload(canvas.toDataURL('image/png'), false);
        }
        resolve();
      }, 'image/png');
    });
  } else {
    triggerDownload(canvas.toDataURL('image/png'), false);
  }
}

interface AnimatedReceiptProps {
  receipt: ReceiptData;
}

export const AnimatedReceipt: React.FC<AnimatedReceiptProps> = ({ receipt }) => {
  const [printCycle, setPrintCycle] = useState(0);
  const [isPrinting, setIsPrinting] = useState(true);
  const [hasStamped, setHasStamped] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const { bars, viewWidth } = useMemo(
    () => generateBarcodeBars(receipt.orderNumber, 224),
    [receipt.orderNumber]
  );

  // Trigger subtle thermal printer sounds + transition printing -> stamped state
  useEffect(() => {
    setIsPrinting(true);
    setHasStamped(false);

    soundEngine.playReceiptPrint();

    const finishFeedTimer = window.setTimeout(() => {
      setIsPrinting(false);
    }, 1420);

    const stampTimer = window.setTimeout(() => {
      setHasStamped(true);
      soundEngine.playStampThud();
    }, 1540);

    return () => {
      window.clearTimeout(finishFeedTimer);
      window.clearTimeout(stampTimer);
    };
  }, [printCycle, receipt.orderNumber]);

  const handleDownload = async () => {
    soundEngine.playClick(1.08);
    await downloadReceiptPng(receipt);
    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 2600);
  };

  const handleReplay = () => {
    soundEngine.playClick(0.95);
    setPrintCycle((c) => c + 1);
  };

  return (
    <div className="receipt-printer-stage">
      {/* Matte Obsidian Receipt Printer Slot */}
      <div className="receipt-printer-slot" aria-hidden="true">
        <span
          className={`receipt-printer-led ${isPrinting ? 'printing' : 'ready'}`}
        />
        <span className="receipt-printer-label">RECEIPT</span>
        <div className="receipt-printer-mouth" />
      </div>

      {/* Clipped Chute Flush Beneath the Printer Mouth */}
      <div className="receipt-paper-chute">
        <motion.div
          key={`${receipt.orderNumber}-${printCycle}`}
          className="receipt-paper-sheet"
          initial={{ y: '-104%', rotateX: 4 }}
          animate={{
            y: ['-104%', '-78%', '-76%', '-52%', '-50%', '-25%', '-23%', '0%'],
            rotateX: [4, 2, 2, 1, 1, 0.5, 0.5, 0],
          }}
          transition={{
            duration: 1.42,
            times: [0, 0.14, 0.24, 0.42, 0.52, 0.72, 0.81, 1],
            ease: 'easeOut',
          }}
        >
          {/* Recessed slot overhang shadow on paper top */}
          <div className="receipt-top-crease" aria-hidden="true" />

          <div className="receipt-paper-inner">
            <header className="receipt-paper-header">
              <h2>SYNTAXWEAR</h2>
              <p>*** SALES RECEIPT ***</p>
              <span>
                {receipt.orderNumber} · {receipt.dateLabel}
              </span>
            </header>

            <div className="receipt-dashed-rule" />

            <ul className="receipt-line-list">
              {receipt.items.map((item, idx) => {
                const label = `${item.name}${item.meta ? ` (${item.meta})` : ''}${
                  item.quantity > 1 ? ` ×${item.quantity}` : ''
                }`;
                return (
                  <li key={`${item.name}-${idx}`} className="receipt-leader-row">
                    <span className="receipt-leader-name" title={label}>
                      {label}
                    </span>
                    <span className="receipt-leader-dots" aria-hidden="true" />
                    <span className="receipt-leader-price">
                      ${item.lineTotal.toFixed(2)}
                    </span>
                  </li>
                );
              })}

              {Boolean(receipt.discountAmount && receipt.discountAmount > 0) && (
                <li className="receipt-leader-row receipt-shipping-row">
                  <span className="receipt-leader-name">
                    Promo ({receipt.discountCode || 'DISCOUNT'})
                  </span>
                  <span className="receipt-leader-dots" aria-hidden="true" />
                  <span className="receipt-leader-price">
                    -${(receipt.discountAmount || 0).toFixed(2)}
                  </span>
                </li>
              )}

              <li className="receipt-leader-row receipt-shipping-row">
                <span className="receipt-leader-name">{receipt.deliveryLabel}</span>
                <span className="receipt-leader-dots" aria-hidden="true" />
                <span className="receipt-leader-price">
                  {receipt.shipping === 0 ? '$0.00' : `$${receipt.shipping.toFixed(2)}`}
                </span>
              </li>

              {Boolean(receipt.tax && receipt.tax > 0) && (
                <li className="receipt-leader-row receipt-shipping-row">
                  <span className="receipt-leader-name">Estimated Tax</span>
                  <span className="receipt-leader-dots" aria-hidden="true" />
                  <span className="receipt-leader-price">${(receipt.tax || 0).toFixed(2)}</span>
                </li>
              )}
            </ul>

            <div className="receipt-dashed-rule" />

            <div className="receipt-total-row">
              <span>TOTAL</span>
              <strong>${receipt.total.toFixed(2)}</strong>
            </div>

            {/* Tilted Ink PAID Stamp */}
            <div className="receipt-stamp-zone">
              <motion.div
                className="receipt-paid-stamp"
                initial={{ scale: 2.4, opacity: 0, rotate: -18 }}
                animate={
                  hasStamped
                    ? { scale: 1, opacity: 0.94, rotate: -9 }
                    : { scale: 2.4, opacity: 0, rotate: -18 }
                }
                transition={{
                  type: 'spring',
                  stiffness: 420,
                  damping: 22,
                }}
              >
                PAID
              </motion.div>
            </div>

            <div className="receipt-dashed-rule" />

            <p className="receipt-thank-you">THANK YOU FOR SHOPPING WITH US!</p>

            {/* Deterministic Code-128 style Barcode */}
            <div className="receipt-barcode-wrap" aria-label={`Order barcode ${receipt.orderNumber}`}>
              <svg
                viewBox={`0 0 ${viewWidth} 34`}
                className="receipt-barcode-svg"
                preserveAspectRatio="none"
              >
                {bars.map((bar, idx) => (
                  <rect
                    key={idx}
                    x={bar.x}
                    y={0}
                    width={bar.width}
                    height={34}
                    fill="#181614"
                  />
                ))}
              </svg>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Receipt Controls */}
      <div className="receipt-controls">
        <button
          type="button"
          onClick={handleDownload}
          className="receipt-download-btn"
        >
          {downloaded ? (
            <>
              <Check size={13} strokeWidth={2} />
              <span>Receipt saved</span>
            </>
          ) : (
            <>
              <Download size={13} strokeWidth={1.8} />
              <span>Download receipt</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleReplay}
          className="receipt-replay-btn"
          title="Reprint receipt animation"
        >
          <RotateCcw size={12} strokeWidth={1.8} />
          <span>Reprint</span>
        </button>
      </div>
    </div>
  );
};
