'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState, useTransition, type FormEvent } from 'react'
import { useCart } from '../cart-context'
import { placeOrder } from './order-action'

type Details = {
  email: string
  firstName: string
  lastName: string
  address: string
  apartment: string
  city: string
  region: string
  postalCode: string
  country: string
  deliveryMethod: string
  paymentLast4: string
}

const initialDetails: Details = {
  email: '',
  firstName: '',
  lastName: '',
  address: '',
  apartment: '',
  city: '',
  region: '',
  postalCode: '',
  country: 'United States',
  deliveryMethod: 'standard',
  paymentLast4: '',
}

const stepOrder = ['information', 'delivery', 'payment', 'review']

export default function CheckoutFlow({ step }: { step: string }) {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const [details, setDetails] = useState<Details>(initialDetails)
  const [orderNumber, setOrderNumber] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const stored = window.localStorage.getItem('form-function-checkout')
    if (stored) setDetails({ ...initialDetails, ...(JSON.parse(stored) as Partial<Details>) })
    setOrderNumber(window.sessionStorage.getItem('form-function-last-order') ?? '')
  }, [])

  useEffect(() => {
    window.localStorage.setItem('form-function-checkout', JSON.stringify(details))
  }, [details])

  const shipping = details.deliveryMethod === 'express' ? 24 : subtotal >= 200 ? 0 : 12
  const total = subtotal + shipping
  const activeIndex = stepOrder.indexOf(step)

  const update = (field: keyof Details, value: string) =>
    setDetails((current) => ({ ...current, [field]: value }))

  const next = (event: FormEvent, route: string) => {
    event.preventDefault()
    router.push(route)
  }

  const summary = useMemo(
    () => (
      <aside className="checkout-summary">
        <p className="product-category">Your order</p>
        <div className="checkout-summary-items">
          {items.map((item) => (
            <div key={item.id}>
              <span>
                <img src={item.image} alt="" />
                <b>{item.quantity}</b>
              </span>
              <p>
                {item.name}
                <small>Standard finish</small>
              </p>
              <strong>${item.price * item.quantity}</strong>
            </div>
          ))}
        </div>
        <div className="checkout-totals">
          <p>
            <span>Subtotal</span>
            <strong>${subtotal}</strong>
          </p>
          <p>
            <span>Shipping</span>
            <strong>{shipping ? `$${shipping}` : 'Complimentary'}</strong>
          </p>
          <p>
            <span>Total</span>
            <strong>
              <small>USD</small> ${total}
            </strong>
          </p>
        </div>
      </aside>
    ),
    [items, shipping, subtotal, total],
  )

  if (step === 'success') {
    return (
      <main className="checkout-success">
        <div className="checkout-success-mark">✓</div>
        <p className="section-index">Order received</p>
        <h1>
          Thank you.
          <br />
          <em>It’s being prepared.</em>
        </h1>
        <p>
          A confirmation has been sent to your email. We’ll send tracking as soon as your objects
          leave the studio.
        </p>
        {orderNumber && <strong>Order {orderNumber}</strong>}
        <Link href="/">Return to the collection</Link>
      </main>
    )
  }

  return (
    <main className="checkout-page">
      <header className="checkout-header">
        <Link href="/" className="brand">
          <span className="brand-mark">F</span>
          <span>form / function</span>
        </Link>
        <span>Secure checkout</span>
        <Link href="/cart">Return to bag</Link>
      </header>
      <div className="checkout-progress">
        {stepOrder.map((item, index) => (
          <div className={index <= activeIndex ? 'active' : ''} key={item}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <p>{item}</p>
          </div>
        ))}
      </div>

      <div className="checkout-layout">
        <section className="checkout-panel">
          {step === 'information' && (
            <form onSubmit={(event) => next(event, '/checkout/delivery')}>
              <p className="section-index">Step 01 / Information</p>
              <h1>
                Where should we
                <br />
                <em>send it?</em>
              </h1>
              <div className="checkout-fields">
                <label className="wide">
                  Email
                  <input
                    type="email"
                    required
                    value={details.email}
                    onChange={(event) => update('email', event.target.value)}
                  />
                </label>
                <label>
                  First name
                  <input
                    required
                    value={details.firstName}
                    onChange={(event) => update('firstName', event.target.value)}
                  />
                </label>
                <label>
                  Last name
                  <input
                    required
                    value={details.lastName}
                    onChange={(event) => update('lastName', event.target.value)}
                  />
                </label>
                <label className="wide">
                  Address
                  <input
                    required
                    value={details.address}
                    onChange={(event) => update('address', event.target.value)}
                  />
                </label>
                <label className="wide">
                  Apartment, suite, etc. <span>Optional</span>
                  <input
                    value={details.apartment}
                    onChange={(event) => update('apartment', event.target.value)}
                  />
                </label>
                <label>
                  City
                  <input
                    required
                    value={details.city}
                    onChange={(event) => update('city', event.target.value)}
                  />
                </label>
                <label>
                  State / region
                  <input
                    required
                    value={details.region}
                    onChange={(event) => update('region', event.target.value)}
                  />
                </label>
                <label>
                  Postal code
                  <input
                    required
                    value={details.postalCode}
                    onChange={(event) => update('postalCode', event.target.value)}
                  />
                </label>
                <label>
                  Country
                  <select
                    value={details.country}
                    onChange={(event) => update('country', event.target.value)}
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                  </select>
                </label>
              </div>
              <button className="checkout-next">
                Continue to delivery <span>→</span>
              </button>
            </form>
          )}

          {step === 'delivery' && (
            <form onSubmit={(event) => next(event, '/checkout/payment')}>
              <p className="section-index">Step 02 / Delivery</p>
              <h1>
                Choose your
                <br />
                <em>pace.</em>
              </h1>
              <div className="delivery-options">
                <label className={details.deliveryMethod === 'standard' ? 'active' : ''}>
                  <input
                    type="radio"
                    name="delivery"
                    value="standard"
                    checked={details.deliveryMethod === 'standard'}
                    onChange={(event) => update('deliveryMethod', event.target.value)}
                  />
                  <span>
                    <strong>Standard delivery</strong>
                    <small>3–5 business days · Tracked</small>
                  </span>
                  <b>{subtotal >= 200 ? 'Complimentary' : '$12'}</b>
                </label>
                <label className={details.deliveryMethod === 'express' ? 'active' : ''}>
                  <input
                    type="radio"
                    name="delivery"
                    value="express"
                    checked={details.deliveryMethod === 'express'}
                    onChange={(event) => update('deliveryMethod', event.target.value)}
                  />
                  <span>
                    <strong>Express delivery</strong>
                    <small>1–2 business days · Priority</small>
                  </span>
                  <b>$24</b>
                </label>
              </div>
              <div className="checkout-nav">
                <Link href="/checkout/information">← Back</Link>
                <button className="checkout-next">
                  Continue to payment <span>→</span>
                </button>
              </div>
            </form>
          )}

          {step === 'payment' && (
            <form onSubmit={(event) => next(event, '/checkout/review')}>
              <p className="section-index">Step 03 / Payment</p>
              <h1>
                Securely
                <br />
                <em>handled.</em>
              </h1>
              <div className="payment-card">
                <div>
                  <span>Credit or debit card</span>
                  <b>VISA · MC · AMEX</b>
                </div>
                <label>
                  Card number
                  <input
                    inputMode="numeric"
                    required
                    pattern="[0-9 ]{15,19}"
                    placeholder="4242 4242 4242 4242"
                    onChange={(event) =>
                      update('paymentLast4', event.target.value.replace(/\D/g, '').slice(-4))
                    }
                  />
                </label>
                <div>
                  <label>
                    Expiration
                    <input required placeholder="MM / YY" pattern="[0-9/ ]{5,7}" />
                  </label>
                  <label>
                    Security code
                    <input required inputMode="numeric" pattern="[0-9]{3,4}" placeholder="CVC" />
                  </label>
                </div>
                <p>
                  Payment details are used only to validate this checkout and are not stored in your
                  order record.
                </p>
              </div>
              <div className="checkout-nav">
                <Link href="/checkout/delivery">← Back</Link>
                <button className="checkout-next">
                  Review order <span>→</span>
                </button>
              </div>
            </form>
          )}

          {step === 'review' && (
            <div>
              <p className="section-index">Step 04 / Review</p>
              <h1>
                One last
                <br />
                <em>look.</em>
              </h1>
              <div className="review-order-block">
                <div>
                  <span>Contact</span>
                  <p>{details.email || 'Not provided'}</p>
                  <Link href="/checkout/information">Edit</Link>
                </div>
                <div>
                  <span>Ship to</span>
                  <p>
                    {details.address}, {details.city}, {details.region} {details.postalCode}
                  </p>
                  <Link href="/checkout/information">Edit</Link>
                </div>
                <div>
                  <span>Delivery</span>
                  <p>
                    {details.deliveryMethod === 'express'
                      ? 'Express · 1–2 days'
                      : 'Standard · 3–5 days'}
                  </p>
                  <Link href="/checkout/delivery">Edit</Link>
                </div>
                <div>
                  <span>Payment</span>
                  <p>Card ending in {details.paymentLast4 || '••••'}</p>
                  <Link href="/checkout/payment">Edit</Link>
                </div>
              </div>
              {error && <p className="checkout-error">{error}</p>}
              <div className="checkout-nav">
                <Link href="/checkout/payment">← Back</Link>
                <button
                  className="checkout-next"
                  disabled={isPending}
                  onClick={() => {
                    setError('')
                    startTransition(async () => {
                      const result = await placeOrder(
                        items.map((item) => ({ id: item.id, quantity: item.quantity })),
                        details,
                      )
                      if (!result.success) {
                        setError(result.message)
                        return
                      }
                      if (result.orderNumber)
                        window.sessionStorage.setItem(
                          'form-function-last-order',
                          result.orderNumber,
                        )
                      clearCart()
                      router.push('/checkout/success')
                    })
                  }}
                >
                  {isPending ? 'Placing order…' : `Place order · $${total}`}
                  <span>→</span>
                </button>
              </div>
            </div>
          )}
        </section>
        {summary}
      </div>
    </main>
  )
}
