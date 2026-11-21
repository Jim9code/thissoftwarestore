import React, { useMemo, useState } from 'react';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import {
  loadSellerProfile,
  saveSellerProfile,
  SellerShopProfile,
} from '../data/seller';
import { soundEngine } from '../utils/soundEngine';

const STEPS = [
  { eyebrow: 'Welcome', title: 'Start with your point of view.' },
  { eyebrow: 'Your studio', title: 'Give your shop a name.' },
  { eyebrow: 'Your practice', title: 'Tell people what you make.' },
  { eyebrow: 'Fulfilment', title: 'Set up how you work.' },
  { eyebrow: 'Review', title: 'Your studio is ready.' },
];

const CATEGORIES = ['Objects', 'Home', 'Desk', 'Audio', 'Wear', 'Print'];

interface SellerOnboardingProps {
  isDark?: boolean;
  onToggleDark?: () => void;
  onReturnToStore: () => void;
  onCompleteOnboarding: (profile: SellerShopProfile) => void;
  onOpenSellerDashboard: () => void;
}

export const SellerOnboarding: React.FC<SellerOnboardingProps> = ({
  isDark = false,
  onToggleDark,
  onReturnToStore,
  onCompleteOnboarding,
  onOpenSellerDashboard,
}) => {
  const initialProfile = useMemo(() => loadSellerProfile(), []);

  const [step, setStep] = useState(0);
  const [shopName, setShopName] = useState(initialProfile.name);
  const [handle, setHandle] = useState(initialProfile.handle);
  const [bio, setBio] = useState(initialProfile.tagline);
  const [category, setCategory] = useState(initialProfile.primaryCategory || 'Objects');
  const [practiceType, setPracticeType] = useState(
    initialProfile.practiceType || 'Independent studio'
  );
  const [shipFrom, setShipFrom] = useState(initialProfile.location);
  const [dispatch, setDispatch] = useState(initialProfile.dispatch);
  const [termsAccepted, setTermsAccepted] = useState(true);

  const completion = ((step + 1) / STEPS.length) * 100;

  const initials = useMemo(
    () =>
      shopName
        .trim()
        .split(/\s+/)
        .map((word) => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'SW',
    [shopName]
  );

  const titleWords = STEPS[step].title.split(' ');
  const leadTitle = titleWords.slice(0, -2).join(' ');
  const tailTitle = titleWords.slice(-2).join(' ');

  const next = () => {
    soundEngine.playClick(1.1);
    setStep((current) => Math.min(STEPS.length - 1, current + 1));
  };

  const back = () => {
    soundEngine.playClick(0.95);
    setStep((current) => Math.max(0, current - 1));
  };

  const handleFinish = () => {
    if (!termsAccepted) return;
    soundEngine.playAddToBagChord();
    const updated: SellerShopProfile = {
      ...initialProfile,
      name: shopName.trim() || 'North Common',
      handle: handle.trim() || 'north-common',
      primaryCategory: category,
      practiceType,
      tagline: bio.trim() || initialProfile.tagline,
      location: shipFrom.trim() || 'Lagos / Portland',
      dispatch,
    };
    saveSellerProfile(updated);
    onCompleteOnboarding(updated);
  };

  const fieldInputClass = `h-14 rounded-xl border px-4 text-base normal-case tracking-normal outline-none transition ${
    isDark
      ? 'border-white/15 bg-[#1B1815] text-[#F3F0E8] placeholder:text-white/35 focus:border-[#859A81] focus:ring-4 focus:ring-[#859A81]/15'
      : 'border-black/15 bg-white/75 text-[#1E231E] placeholder:text-black/35 focus:border-[#637363] focus:ring-4 focus:ring-[#637363]/10'
  }`;

  return (
    <div
      data-lenis-prevent
      className={`fixed inset-0 z-[70] overflow-y-auto transition-colors duration-300 ${
        isDark ? 'bg-[#12100E] text-[#F3F0E8]' : 'bg-[#F3F0E8] text-[#1E231E]'
      }`}
    >
      {/* Top Bar */}
      <header
        className={`sticky top-0 z-20 flex h-[74px] items-center justify-between border-b px-5 backdrop-blur-md sm:px-8 lg:px-12 ${
          isDark
            ? 'border-white/10 bg-[#12100E]/92'
            : 'border-black/10 bg-[#F3F0E8]/92'
        }`}
      >
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick(0.95);
              onReturnToStore();
            }}
            className={`inline-flex items-center gap-2 text-xs font-medium transition-colors ${
              isDark
                ? 'text-[#F3F0E8]/75 hover:text-[#FFCC70]'
                : 'text-[#1E231E]/75 hover:text-[#1E231E]'
            }`}
          >
            <ArrowLeft className="h-3.5 w-3.5 text-[#D58B2B]" />
            <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-[0.16em]">
              Storefront
            </span>
          </button>

          <span
            className={`h-4 w-px ${isDark ? 'bg-white/15' : 'bg-black/15'}`}
            aria-hidden="true"
          />

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick(1.0);
              onReturnToStore();
            }}
            className="flex items-center gap-2.5 text-sm font-semibold tracking-[-0.03em]"
          >
            <img
              src="/images/thissoftware-emblem-transparent.png"
              alt="SyntaxWear"
              className="h-6 w-6 object-contain"
            />
            <span>SyntaxWear</span>
            <span
              className={`hidden md:inline font-mono text-[9px] uppercase tracking-[0.18em] ${
                isDark ? 'text-[#FFCC70]/85' : 'text-[#637363]'
              }`}
            >
              / Studio
            </span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {onToggleDark && (
            <button
              type="button"
              onClick={onToggleDark}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
                isDark
                  ? 'border-white/15 bg-white/8 text-[#FFCC70] hover:bg-white/15'
                  : 'border-black/15 bg-black/5 text-[#1E231E] hover:bg-black/10'
              }`}
            >
              {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
          )}

          <div
            className={`flex items-center gap-3 text-xs ${
              isDark ? 'text-[#F3F0E8]/60' : 'text-black/55'
            }`}
          >
            <span className="hidden sm:inline">Already have a shop?</span>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick(1.05);
                onOpenSellerDashboard();
              }}
              className={`rounded-full border px-4 py-2 font-medium transition ${
                isDark
                  ? 'border-white/20 text-[#F3F0E8] hover:border-[#FFCC70] hover:bg-white/10'
                  : 'border-black/15 text-[#1E231E] hover:border-[#637363] hover:bg-white/70'
              }`}
            >
              Seller sign in
            </button>
          </div>
        </div>
      </header>

      {/* Main Split Canvas */}
      <div className="grid min-h-[calc(100dvh-74px)] lg:grid-cols-[minmax(0,1.05fr)_minmax(390px,0.7fr)]">
        {/* Left Form Wizard */}
        <section className="flex min-h-[640px] flex-col px-5 py-8 sm:px-10 lg:px-[clamp(48px,7vw,112px)] lg:py-12">
          <div className="mb-10 sm:mb-12 flex items-center gap-3">
            <span
              className={`font-mono text-[10px] uppercase tracking-[0.16em] ${
                isDark ? 'text-[#F3F0E8]/55' : 'text-black/45'
              }`}
            >
              Step {String(step + 1).padStart(2, '0')} of {String(STEPS.length).padStart(2, '0')}
            </span>
            <div
              className={`h-px flex-1 overflow-hidden ${
                isDark ? 'bg-white/12' : 'bg-black/10'
              }`}
            >
              <div
                className="h-full bg-[#D58B2B] transition-[width] duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-[680px] flex-1 flex-col">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#D58B2B]">
              {STEPS[step].eyebrow}
            </p>
            <h1 className="max-w-[620px] font-display text-[clamp(36px,5vw,66px)] leading-[0.98] font-medium tracking-[-0.055em]">
              {leadTitle}{' '}
              <em
                className={`font-serif italic font-normal ${
                  isDark ? 'text-[#8FA88D]' : 'text-[#637363]'
                }`}
              >
                {tailTitle}
              </em>
            </h1>

            <div className="mt-10 flex-1">
              {step === 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    [
                      '01',
                      'Independent by design',
                      'A considered marketplace for makers & technical studios, not an endless feed.',
                    ],
                    [
                      '02',
                      'You set the rhythm',
                      'Control your limited batches, lead times, pricing, and colourway availability.',
                    ],
                    [
                      '03',
                      'Built for the work',
                      'Simple tools for products, orders, insights, and customer care.',
                    ],
                    [
                      '04',
                      'A fair partnership',
                      'Transparent 8% marketplace fee. No listing or monthly fees.',
                    ],
                  ].map(([number, title, copy]) => (
                    <article
                      key={number}
                      className={`min-h-40 rounded-2xl border p-5 transition hover:-translate-y-0.5 ${
                        isDark
                          ? 'border-white/12 bg-[#1B1815] hover:bg-[#231F1B]'
                          : 'border-black/10 bg-white/55 hover:bg-white/85'
                      }`}
                    >
                      <span className="font-mono text-[10px] text-[#D58B2B]">{number}</span>
                      <h2 className="mt-7 text-base font-semibold tracking-[-0.02em]">{title}</h2>
                      <p
                        className={`mt-2 text-sm leading-6 ${
                          isDark ? 'text-[#F3F0E8]/60' : 'text-black/55'
                        }`}
                      >
                        {copy}
                      </p>
                    </article>
                  ))}
                </div>
              )}

              {step === 1 && (
                <div className="grid max-w-[570px] gap-6">
                  <label
                    className={`grid gap-2 text-[11px] font-medium uppercase tracking-[0.12em] ${
                      isDark ? 'text-[#A9B9A5]' : 'text-[#3C493D]'
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      Shop name
                      <small
                        className={`normal-case tracking-normal ${
                          isDark ? 'text-white/45' : 'text-black/40'
                        }`}
                      >
                        {shopName.length}/40
                      </small>
                    </span>
                    <input
                      value={shopName}
                      maxLength={40}
                      onChange={(event) => setShopName(event.target.value)}
                      className={fieldInputClass}
                    />
                  </label>

                  <label
                    className={`grid gap-2 text-[11px] font-medium uppercase tracking-[0.12em] ${
                      isDark ? 'text-[#A9B9A5]' : 'text-[#3C493D]'
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      Shop address
                      <small
                        className={`normal-case tracking-normal ${
                          isDark ? 'text-white/45' : 'text-black/40'
                        }`}
                      >
                        You can change this later
                      </small>
                    </span>
                    <div
                      className={`flex h-14 items-center rounded-xl border px-4 normal-case tracking-normal transition ${
                        isDark
                          ? 'border-white/15 bg-[#1B1815] focus-within:border-[#859A81] focus-within:ring-4 focus-within:ring-[#859A81]/15'
                          : 'border-black/15 bg-white/75 focus-within:border-[#637363] focus-within:ring-4 focus-within:ring-[#637363]/10'
                      }`}
                    >
                      <span
                        className={`text-sm ${
                          isDark ? 'text-[#F3F0E8]/40' : 'text-black/35'
                        }`}
                      >
                        syntaxwear.store/shop/
                      </span>
                      <input
                        value={handle}
                        onChange={(event) =>
                          setHandle(
                            event.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9-]/g, '-')
                              .replace(/-+/g, '-')
                          )
                        }
                        className={`min-w-0 flex-1 bg-transparent text-sm outline-none ${
                          isDark ? 'text-[#F3F0E8]' : 'text-[#1E231E]'
                        }`}
                      />
                    </div>
                  </label>

                  <p
                    className={`flex gap-3 rounded-xl p-4 text-sm leading-6 ${
                      isDark
                        ? 'bg-[#2C3A2B]/65 text-[#DFE5DB]'
                        : 'bg-[#DFE5DB]/75 text-[#3C493D]'
                    }`}
                  >
                    <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#637363] text-[10px] font-semibold text-white">
                      i
                    </span>
                    Choose a name that reflects your studio rather than a single product. Short,
                    distinct names are easiest to remember.
                  </p>
                </div>
              )}

              {step === 2 && (
                <div className="grid max-w-[620px] gap-7">
                  <div
                    className={`grid gap-2 text-[11px] font-medium uppercase tracking-[0.12em] ${
                      isDark ? 'text-[#A9B9A5]' : 'text-[#3C493D]'
                    }`}
                  >
                    <span>Primary category</span>
                    <div className="flex flex-wrap gap-2 normal-case tracking-normal">
                      {CATEGORIES.map((item) => (
                        <button
                          type="button"
                          key={item}
                          onClick={() => {
                            soundEngine.playClick(1.15);
                            setCategory(item);
                          }}
                          className={`rounded-full border px-4 py-2.5 text-sm transition ${
                            category === item
                              ? 'border-[#637363] bg-[#637363] text-white'
                              : isDark
                              ? 'border-white/15 bg-[#1B1815] text-[#F3F0E8] hover:border-[#859A81]'
                              : 'border-black/15 bg-white/55 text-[#1E231E] hover:border-[#637363]'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label
                    className={`grid gap-2 text-[11px] font-medium uppercase tracking-[0.12em] ${
                      isDark ? 'text-[#A9B9A5]' : 'text-[#3C493D]'
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      Studio introduction
                      <small
                        className={`normal-case tracking-normal ${
                          isDark ? 'text-white/45' : 'text-black/40'
                        }`}
                      >
                        {bio.length}/280
                      </small>
                    </span>
                    <textarea
                      value={bio}
                      maxLength={280}
                      rows={5}
                      onChange={(event) => setBio(event.target.value)}
                      className={`resize-none rounded-xl border p-4 text-sm leading-6 normal-case tracking-normal outline-none transition ${
                        isDark
                          ? 'border-white/15 bg-[#1B1815] text-[#F3F0E8] focus:border-[#859A81] focus:ring-4 focus:ring-[#859A81]/15'
                          : 'border-black/15 bg-white/75 text-[#1E231E] focus:border-[#637363] focus:ring-4 focus:ring-[#637363]/10'
                      }`}
                    />
                  </label>

                  <label
                    className={`grid gap-2 text-[11px] font-medium uppercase tracking-[0.12em] ${
                      isDark ? 'text-[#A9B9A5]' : 'text-[#3C493D]'
                    }`}
                  >
                    <span>What best describes your practice?</span>
                    <select
                      value={practiceType}
                      onChange={(event) => setPracticeType(event.target.value)}
                      className={fieldInputClass}
                    >
                      <option className={isDark ? 'bg-[#1B1815] text-[#F3F0E8]' : ''}>
                        Independent studio
                      </option>
                      <option className={isDark ? 'bg-[#1B1815] text-[#F3F0E8]' : ''}>
                        Small workshop
                      </option>
                      <option className={isDark ? 'bg-[#1B1815] text-[#F3F0E8]' : ''}>
                        Designer / maker
                      </option>
                      <option className={isDark ? 'bg-[#1B1815] text-[#F3F0E8]' : ''}>
                        Streetwear label
                      </option>
                    </select>
                  </label>
                </div>
              )}

              {step === 3 && (
                <div className="grid max-w-[600px] gap-6 sm:grid-cols-2">
                  <label
                    className={`grid gap-2 text-[11px] font-medium uppercase tracking-[0.12em] ${
                      isDark ? 'text-[#A9B9A5]' : 'text-[#3C493D]'
                    }`}
                  >
                    <span>Ships from</span>
                    <input
                      value={shipFrom}
                      onChange={(event) => setShipFrom(event.target.value)}
                      className={fieldInputClass}
                    />
                  </label>

                  <label
                    className={`grid gap-2 text-[11px] font-medium uppercase tracking-[0.12em] ${
                      isDark ? 'text-[#A9B9A5]' : 'text-[#3C493D]'
                    }`}
                  >
                    <span>Typical dispatch</span>
                    <select
                      value={dispatch}
                      onChange={(event) => setDispatch(event.target.value)}
                      className={fieldInputClass}
                    >
                      <option className={isDark ? 'bg-[#1B1815] text-[#F3F0E8]' : ''}>
                        1 business day
                      </option>
                      <option className={isDark ? 'bg-[#1B1815] text-[#F3F0E8]' : ''}>
                        2–3 business days
                      </option>
                      <option className={isDark ? 'bg-[#1B1815] text-[#F3F0E8]' : ''}>
                        3–5 business days
                      </option>
                      <option className={isDark ? 'bg-[#1B1815] text-[#F3F0E8]' : ''}>
                        Made to order
                      </option>
                    </select>
                  </label>

                  <div
                    className={`rounded-2xl border p-5 sm:col-span-2 ${
                      isDark
                        ? 'border-white/12 bg-[#1B1815]'
                        : 'border-black/10 bg-white/55'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <h2 className="font-semibold tracking-[-0.02em]">
                          Simple, secure payouts
                        </h2>
                        <p
                          className={`mt-2 max-w-md text-sm leading-6 ${
                            isDark ? 'text-[#F3F0E8]/60' : 'text-black/55'
                          }`}
                        >
                          Bank and tax details are collected securely before your first payout
                          (USD, GBP, EUR, or NGN settlements). For now, finish your studio setup.
                        </p>
                      </div>
                      <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-full font-semibold ${
                          isDark
                            ? 'bg-[#2C3A2B] text-[#DFE5DB]'
                            : 'bg-[#DFE5DB] text-[#3C493D]'
                        }`}
                      >
                        $
                      </span>
                    </div>
                    <div
                      className={`mt-5 grid gap-3 border-t pt-5 text-sm sm:grid-cols-3 ${
                        isDark ? 'border-white/10' : 'border-black/10'
                      }`}
                    >
                      <p>
                        <b className="block">Every Friday</b>
                        <span className={isDark ? 'text-[#F3F0E8]/50' : 'text-black/45'}>
                          Payout schedule
                        </span>
                      </p>
                      <p>
                        <b className="block">8%</b>
                        <span className={isDark ? 'text-[#F3F0E8]/50' : 'text-black/45'}>
                          Marketplace fee
                        </span>
                      </p>
                      <p>
                        <b className="block">Protected</b>
                        <span className={isDark ? 'text-[#F3F0E8]/50' : 'text-black/45'}>
                          Seller support
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="grid max-w-[620px] gap-4">
                  {[
                    ['Shop identity', shopName || 'North Common', 'Edit', 1],
                    ['Primary category', category, 'Edit', 2],
                    ['Ships from', shipFrom || 'Lagos / Portland', 'Edit', 3],
                    ['Typical dispatch', dispatch, 'Edit', 3],
                  ].map(([label, value, action, target]) => (
                    <button
                      key={String(label)}
                      type="button"
                      onClick={() => {
                        soundEngine.playClick(1.0);
                        setStep(Number(target));
                      }}
                      className={`group flex items-center justify-between rounded-xl border p-4 text-left transition ${
                        isDark
                          ? 'border-white/12 bg-[#1B1815] hover:border-[#859A81]'
                          : 'border-black/10 bg-white/55 hover:border-[#637363]'
                      }`}
                    >
                      <span>
                        <small
                          className={`block font-mono text-[9px] uppercase tracking-[0.12em] ${
                            isDark ? 'text-[#F3F0E8]/45' : 'text-black/40'
                          }`}
                        >
                          {label}
                        </small>
                        <b className="mt-1 block text-sm font-medium">{value}</b>
                      </span>
                      <span
                        className={`text-xs group-hover:underline ${
                          isDark ? 'text-[#FFCC70]' : 'text-[#637363]'
                        }`}
                      >
                        {action}
                      </span>
                    </button>
                  ))}

                  <label
                    className={`mt-2 flex cursor-pointer items-start gap-3 rounded-xl p-4 text-sm leading-6 ${
                      isDark
                        ? 'bg-[#2C3A2B]/55 text-[#F3F0E8]'
                        : 'bg-[#DFE5DB]/60 text-[#1E231E]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-1 accent-[#637363]"
                    />
                    <span>
                      I agree to the seller terms and confirm that the products I list are original,
                      accurately represented, and ready to fulfil.
                    </span>
                  </label>
                </div>
              )}
            </div>

            {/* Step Navigation Footer */}
            <div
              className={`mt-10 flex items-center justify-between border-t pt-6 ${
                isDark ? 'border-white/12' : 'border-black/10'
              }`}
            >
              <button
                type="button"
                onClick={back}
                disabled={step === 0}
                className={`text-sm font-medium transition disabled:invisible ${
                  isDark
                    ? 'text-[#F3F0E8]/60 hover:text-white'
                    : 'text-black/55 hover:text-black'
                }`}
              >
                ← Back
              </button>

              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={next}
                  className={`flex h-12 items-center gap-8 rounded-full px-6 text-sm font-medium transition ${
                    isDark
                      ? 'bg-[#FFCC70] text-[#181614] hover:bg-[#f0bd5e]'
                      : 'bg-[#4A3026] text-white hover:bg-[#281C17]'
                  }`}
                >
                  Continue{' '}
                  <span className={isDark ? 'text-[#181614]' : 'text-[#D58B2B]'}>→</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!termsAccepted}
                  onClick={handleFinish}
                  className={`flex h-12 items-center gap-8 rounded-full px-6 text-sm font-medium transition disabled:opacity-45 ${
                    isDark
                      ? 'bg-[#FFCC70] text-[#181614] hover:bg-[#f0bd5e]'
                      : 'bg-[#4A3026] text-white hover:bg-[#281C17]'
                  }`}
                >
                  Enter your workspace{' '}
                  <span className={isDark ? 'text-[#181614]' : 'text-[#D58B2B]'}>→</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Right Live Shop Preview Rail */}
        <aside className="relative hidden overflow-hidden bg-[#3C493D] p-10 text-[#F3F0E8] lg:flex lg:flex-col">
          <div className="absolute -top-36 -right-28 h-[420px] w-[420px] rounded-full border border-white/10" />
          <div className="absolute -top-16 -right-12 h-64 w-64 rounded-full border border-white/10" />
          <p className="relative font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
            Your shop preview
          </p>

          <div
            className={`relative my-auto rounded-[28px] p-3 shadow-2xl shadow-black/25 ${
              isDark ? 'bg-[#191613] text-[#F3F0E8]' : 'bg-[#F3F0E8] text-[#1E231E]'
            }`}
          >
            <div
              className={`overflow-hidden rounded-[20px] border ${
                isDark ? 'border-white/10' : 'border-black/10'
              }`}
            >
              <div
                className={`flex items-center justify-between border-b px-5 py-4 ${
                  isDark ? 'border-white/10' : 'border-black/10'
                }`}
              >
                <span className="text-xs font-semibold">syntaxwear studio</span>
                <span
                  className={`font-mono text-[8px] uppercase tracking-widest ${
                    isDark ? 'text-white/45' : 'text-black/40'
                  }`}
                >
                  Studio
                </span>
              </div>

              <div
                className={`grid min-h-[215px] place-items-center ${
                  isDark ? 'bg-[#221E1A]' : 'bg-[#EBE7DC]'
                }`}
              >
                <span className="grid h-24 w-24 place-items-center rounded-full bg-[#637363] text-3xl font-medium text-white shadow-lg">
                  {initials}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-[#D58B2B]">
                      {category} · {shipFrom || 'Location'}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.045em]">
                      {shopName || 'Your studio'}
                    </h2>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1.5 text-[9px] ${
                      isDark ? 'border-white/15' : 'border-black/10'
                    }`}
                  >
                    Follow
                  </span>
                </div>
                <p
                  className={`mt-4 line-clamp-3 text-xs leading-5 ${
                    isDark ? 'text-[#F3F0E8]/60' : 'text-black/55'
                  }`}
                >
                  {bio}
                </p>
                <div className="mt-6 grid grid-cols-2 gap-2">
                  <div className="aspect-[4/3] overflow-hidden rounded-lg bg-[#C8C0AE]">
                    <img
                      src="/images/products/desk-kbd-sage.jpg"
                      alt="Studio preview tile 1"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="aspect-[4/3] overflow-hidden rounded-lg bg-[#718171]">
                    <img
                      src="/images/products/hoodie-sage.jpg"
                      alt="Studio preview tile 2"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-between border-t border-white/10 pt-5 text-xs text-white/55">
            <span>Live preview</span>
            <span>syntaxwear.store/shop/{handle || 'your-shop'}</span>
          </div>
        </aside>
      </div>
    </div>
  );
};
