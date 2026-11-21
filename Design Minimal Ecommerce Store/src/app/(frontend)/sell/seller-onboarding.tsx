'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

const steps = [
  { eyebrow: 'Welcome', title: 'Start with your point of view.' },
  { eyebrow: 'Your studio', title: 'Give your shop a name.' },
  { eyebrow: 'Your practice', title: 'Tell people what you make.' },
  { eyebrow: 'Fulfilment', title: 'Set up how you work.' },
  { eyebrow: 'Review', title: 'Your studio is ready.' },
]

const categories = ['Objects', 'Home', 'Desk', 'Audio', 'Wear', 'Print']

function Mark() {
  return (
    <Link href="/" className="flex items-center gap-2.5 text-sm font-semibold tracking-[-0.03em]">
      <span className="grid size-7 place-items-center rounded-full border border-current font-[var(--serif)] text-base italic text-[var(--amber)]">
        F
      </span>
      <span>form / function</span>
    </Link>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="grid gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--sage-dark)]">
      <span className="flex items-center justify-between">
        {label}
        {hint && <small className="normal-case tracking-normal text-black/40">{hint}</small>}
      </span>
      {children}
    </label>
  )
}

export default function SellerOnboarding() {
  const [step, setStep] = useState(0)
  const [shopName, setShopName] = useState('North Common')
  const [handle, setHandle] = useState('north-common')
  const [bio, setBio] = useState(
    'Small-run objects shaped by honest materials, quiet utility, and the landscapes of the north.',
  )
  const [category, setCategory] = useState('Objects')
  const [shipFrom, setShipFrom] = useState('Portland, Oregon')
  const [dispatch, setDispatch] = useState('2–3 business days')

  const completion = ((step + 1) / steps.length) * 100
  const initials = useMemo(
    () =>
      shopName
        .split(' ')
        .map((word) => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    [shopName],
  )

  const next = () => setStep((current) => Math.min(steps.length - 1, current + 1))
  const back = () => setStep((current) => Math.max(0, current - 1))

  return (
    <main className="min-h-screen bg-[var(--cream)] text-[var(--ink)]">
      <header className="flex h-[74px] items-center justify-between border-b border-black/10 px-5 sm:px-8 lg:px-12">
        <Mark />
        <div className="hidden items-center gap-3 text-xs text-black/55 sm:flex">
          <span>Already have a shop?</span>
          <Link
            href="/seller"
            className="rounded-full border border-black/15 px-4 py-2 font-medium text-[var(--ink)] transition hover:border-[var(--sage)] hover:bg-white/50"
          >
            Seller sign in
          </Link>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-74px)] lg:grid-cols-[minmax(0,1.05fr)_minmax(390px,.7fr)]">
        <section className="flex min-h-[680px] flex-col px-5 py-8 sm:px-10 lg:px-[clamp(48px,7vw,112px)] lg:py-12">
          <div className="mb-12 flex items-center gap-3">
            <span className="font-[var(--mono)] text-[10px] uppercase tracking-[0.16em] text-black/45">
              Step {String(step + 1).padStart(2, '0')} of {String(steps.length).padStart(2, '0')}
            </span>
            <div className="h-px flex-1 overflow-hidden bg-black/10">
              <div
                className="h-full bg-[var(--amber)] transition-[width] duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-[680px] flex-1 flex-col">
            <p className="mb-4 font-[var(--mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--amber)]">
              {steps[step].eyebrow}
            </p>
            <h1 className="max-w-[620px] text-[clamp(38px,5vw,68px)] leading-[0.98] font-medium tracking-[-0.055em]">
              {steps[step].title.split(' ').slice(0, -2).join(' ')}{' '}
              <em className="font-[var(--serif)] font-normal text-[var(--sage)]">
                {steps[step].title.split(' ').slice(-2).join(' ')}
              </em>
            </h1>

            <div className="mt-10 flex-1">
              {step === 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    [
                      '01',
                      'Independent by design',
                      'A considered marketplace for studios, not an endless feed.',
                    ],
                    [
                      '02',
                      'You set the rhythm',
                      'Control your editions, lead times, pricing, and availability.',
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
                      className="min-h-40 rounded-2xl border border-black/10 bg-white/45 p-5 transition hover:-translate-y-0.5 hover:bg-white/70"
                    >
                      <span className="font-[var(--mono)] text-[10px] text-[var(--amber)]">
                        {number}
                      </span>
                      <h2 className="mt-7 text-base font-semibold tracking-[-0.02em]">{title}</h2>
                      <p className="mt-2 text-sm leading-6 text-black/55">{copy}</p>
                    </article>
                  ))}
                </div>
              )}

              {step === 1 && (
                <div className="grid max-w-[570px] gap-6">
                  <Field label="Shop name" hint={`${shopName.length}/40`}>
                    <input
                      value={shopName}
                      maxLength={40}
                      onChange={(event) => setShopName(event.target.value)}
                      className="h-14 rounded-xl border border-black/15 bg-white/65 px-4 text-base normal-case tracking-normal outline-none transition focus:border-[var(--sage)] focus:ring-4 focus:ring-[var(--sage)]/10"
                    />
                  </Field>
                  <Field label="Shop address" hint="You can change this later">
                    <div className="flex h-14 items-center rounded-xl border border-black/15 bg-white/65 px-4 normal-case tracking-normal focus-within:border-[var(--sage)] focus-within:ring-4 focus-within:ring-[var(--sage)]/10">
                      <span className="text-sm text-black/35">formfunction.com/shop/</span>
                      <input
                        value={handle}
                        onChange={(event) =>
                          setHandle(
                            event.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9-]/g, '-')
                              .replace(/-+/g, '-'),
                          )
                        }
                        className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                      />
                    </div>
                  </Field>
                  <p className="flex gap-3 rounded-xl bg-[var(--sage-light)]/70 p-4 text-sm leading-6 text-[var(--sage-dark)]">
                    <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-[var(--sage)] text-[10px] text-white">
                      i
                    </span>
                    Choose a name that reflects your studio rather than a single product. Short,
                    distinct names are easiest to remember.
                  </p>
                </div>
              )}

              {step === 2 && (
                <div className="grid max-w-[620px] gap-7">
                  <Field label="Primary category">
                    <div className="flex flex-wrap gap-2 normal-case tracking-normal">
                      {categories.map((item) => (
                        <button
                          type="button"
                          key={item}
                          onClick={() => setCategory(item)}
                          className={`rounded-full border px-4 py-2.5 text-sm transition ${
                            category === item
                              ? 'border-[var(--sage)] bg-[var(--sage)] text-white'
                              : 'border-black/15 bg-white/45 hover:border-[var(--sage)]'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </Field>
                  <Field label="Studio introduction" hint={`${bio.length}/280`}>
                    <textarea
                      value={bio}
                      maxLength={280}
                      rows={5}
                      onChange={(event) => setBio(event.target.value)}
                      className="resize-none rounded-xl border border-black/15 bg-white/65 p-4 text-sm leading-6 normal-case tracking-normal outline-none transition focus:border-[var(--sage)] focus:ring-4 focus:ring-[var(--sage)]/10"
                    />
                  </Field>
                  <Field label="What best describes your practice?">
                    <select className="h-14 rounded-xl border border-black/15 bg-white/65 px-4 text-sm normal-case tracking-normal outline-none focus:border-[var(--sage)]">
                      <option>Independent studio</option>
                      <option>Small workshop</option>
                      <option>Designer / maker</option>
                      <option>Curated vintage</option>
                    </select>
                  </Field>
                </div>
              )}

              {step === 3 && (
                <div className="grid max-w-[600px] gap-6 sm:grid-cols-2">
                  <Field label="Ships from">
                    <input
                      value={shipFrom}
                      onChange={(event) => setShipFrom(event.target.value)}
                      className="h-14 rounded-xl border border-black/15 bg-white/65 px-4 text-sm normal-case tracking-normal outline-none focus:border-[var(--sage)]"
                    />
                  </Field>
                  <Field label="Typical dispatch">
                    <select
                      value={dispatch}
                      onChange={(event) => setDispatch(event.target.value)}
                      className="h-14 rounded-xl border border-black/15 bg-white/65 px-4 text-sm normal-case tracking-normal outline-none focus:border-[var(--sage)]"
                    >
                      <option>1 business day</option>
                      <option>2–3 business days</option>
                      <option>3–5 business days</option>
                      <option>Made to order</option>
                    </select>
                  </Field>
                  <div className="rounded-2xl border border-black/10 bg-white/50 p-5 sm:col-span-2">
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <h2 className="font-semibold tracking-[-0.02em]">Simple, secure payouts</h2>
                        <p className="mt-2 max-w-md text-sm leading-6 text-black/55">
                          Bank and tax details will be collected securely before your first payout.
                          For now, you can finish your shop setup.
                        </p>
                      </div>
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--sage-light)] text-[var(--sage-dark)]">
                        $
                      </span>
                    </div>
                    <div className="mt-5 grid gap-3 border-t border-black/10 pt-5 text-sm sm:grid-cols-3">
                      <p>
                        <b className="block">Every Friday</b>
                        <span className="text-black/45">Payout schedule</span>
                      </p>
                      <p>
                        <b className="block">8%</b>
                        <span className="text-black/45">Marketplace fee</span>
                      </p>
                      <p>
                        <b className="block">Protected</b>
                        <span className="text-black/45">Seller support</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="grid max-w-[620px] gap-4">
                  {[
                    ['Shop identity', shopName, 'Edit', 1],
                    ['Primary category', category, 'Edit', 2],
                    ['Ships from', shipFrom, 'Edit', 3],
                    ['Typical dispatch', dispatch, 'Edit', 3],
                  ].map(([label, value, action, target]) => (
                    <button
                      key={String(label)}
                      type="button"
                      onClick={() => setStep(Number(target))}
                      className="group flex items-center justify-between rounded-xl border border-black/10 bg-white/50 p-4 text-left transition hover:border-[var(--sage)]"
                    >
                      <span>
                        <small className="block font-[var(--mono)] text-[9px] uppercase tracking-[0.12em] text-black/40">
                          {label}
                        </small>
                        <b className="mt-1 block text-sm font-medium">{value}</b>
                      </span>
                      <span className="text-xs text-[var(--sage)] group-hover:underline">
                        {action}
                      </span>
                    </button>
                  ))}
                  <label className="mt-2 flex cursor-pointer items-start gap-3 rounded-xl bg-[var(--sage-light)]/55 p-4 text-sm leading-6">
                    <input type="checkbox" defaultChecked className="mt-1 accent-[var(--sage)]" />
                    <span>
                      I agree to the seller terms and confirm that the products I list are original,
                      accurately represented, and ready to fulfil.
                    </span>
                  </label>
                </div>
              )}
            </div>

            <div className="mt-10 flex items-center justify-between border-t border-black/10 pt-6">
              <button
                type="button"
                onClick={back}
                disabled={step === 0}
                className="text-sm font-medium text-black/55 transition hover:text-black disabled:invisible"
              >
                ← Back
              </button>
              {step < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={next}
                  className="flex h-12 items-center gap-8 rounded-full bg-[var(--walnut)] px-6 text-sm font-medium text-white transition hover:bg-[var(--walnut-dark)]"
                >
                  Continue <span className="text-[var(--amber)]">→</span>
                </button>
              ) : (
                <Link
                  href="/seller"
                  className="flex h-12 items-center gap-8 rounded-full bg-[var(--walnut)] px-6 text-sm font-medium text-white transition hover:bg-[var(--walnut-dark)]"
                >
                  Enter your workspace <span className="text-[var(--amber)]">→</span>
                </Link>
              )}
            </div>
          </div>
        </section>

        <aside className="relative hidden overflow-hidden bg-[var(--sage-dark)] p-10 text-[var(--cream)] lg:flex lg:flex-col">
          <div className="absolute -top-36 -right-28 size-[420px] rounded-full border border-white/8" />
          <div className="absolute -top-16 -right-12 size-64 rounded-full border border-white/8" />
          <p className="relative font-[var(--mono)] text-[10px] uppercase tracking-[0.18em] text-white/45">
            Your shop preview
          </p>
          <div className="relative my-auto rounded-[28px] bg-[var(--cream)] p-3 text-[var(--ink)] shadow-2xl shadow-black/20">
            <div className="overflow-hidden rounded-[20px] border border-black/8">
              <div className="flex items-center justify-between border-b border-black/8 px-5 py-4">
                <span className="text-xs font-semibold">form / function</span>
                <span className="font-[var(--mono)] text-[8px] uppercase tracking-widest text-black/40">
                  Studio
                </span>
              </div>
              <div className="grid min-h-[215px] place-items-center bg-[var(--paper)]">
                <span className="grid size-24 place-items-center rounded-full bg-[var(--sage)] text-3xl font-medium text-white shadow-lg">
                  {initials || 'NS'}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="font-[var(--mono)] text-[8px] uppercase tracking-[0.15em] text-[var(--amber)]">
                      {category} · {shipFrom}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.045em]">
                      {shopName || 'Your studio'}
                    </h2>
                  </div>
                  <span className="rounded-full border border-black/10 px-3 py-1.5 text-[9px]">
                    Follow
                  </span>
                </div>
                <p className="mt-4 line-clamp-3 text-xs leading-5 text-black/55">{bio}</p>
                <div className="mt-6 grid grid-cols-2 gap-2">
                  <div className="aspect-[4/3] rounded-lg bg-[#c8c0ae]" />
                  <div className="aspect-[4/3] rounded-lg bg-[#718171]" />
                </div>
              </div>
            </div>
          </div>
          <div className="relative flex items-center justify-between border-t border-white/10 pt-5 text-xs text-white/45">
            <span>Live preview</span>
            <span>formfunction.com/shop/{handle || 'your-shop'}</span>
          </div>
        </aside>
      </div>
    </main>
  )
}
