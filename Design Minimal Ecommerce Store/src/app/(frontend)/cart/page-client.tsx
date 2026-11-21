'use client'

import Link from 'next/link'
import { useCart } from '../cart-context'

export default function CartPageClient() {
  const { items, subtotal, updateQuantity, removeItem } = useCart()
  const shipping = subtotal >= 200 ? 0 : 12

  return (
    <main className="cart-page">
      <header className="commerce-header">
        <Link href="/" className="brand">
          <span className="brand-mark">F</span>
          <span>form / function</span>
        </Link>
        <Link href="/">Continue shopping</Link>
      </header>
      <div className="cart-page-title">
        <p>
          Shopping bag / {items.length} line{items.length === 1 ? '' : 's'}
        </p>
        <h1>
          Your considered <em>edit.</em>
        </h1>
      </div>

      {items.length ? (
        <div className="cart-page-layout">
          <section className="cart-line-items">
            {items.map((item) => (
              <article key={item.id}>
                <img src={item.image} alt={item.name} />
                <div className="cart-line-copy">
                  <p>Object {String(item.id).padStart(2, '0')}</p>
                  <h2>{item.name}</h2>
                  <span>Standard finish · In stock</span>
                  <div>
                    <div className="cart-page-quantity">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button onClick={() => removeItem(item.id)}>Remove</button>
                  </div>
                </div>
                <strong>${item.price * item.quantity}</strong>
              </article>
            ))}
          </section>

          <aside className="order-summary">
            <p className="product-category">Order summary</p>
            <div>
              <span>Subtotal</span>
              <strong>${subtotal}</strong>
            </div>
            <div>
              <span>Estimated shipping</span>
              <strong>{shipping ? `$${shipping}` : 'Complimentary'}</strong>
            </div>
            <div className="order-summary-total">
              <span>Estimated total</span>
              <strong>${subtotal + shipping}</strong>
            </div>
            <Link href="/checkout/information">
              Begin checkout <span>→</span>
            </Link>
            <p>Taxes are calculated after you enter your shipping address.</p>
            <div className="cart-assurance">
              <span>Secure checkout</span>
              <span>30-day returns</span>
              <span>Two-year warranty</span>
            </div>
          </aside>
        </div>
      ) : (
        <section className="cart-page-empty">
          <span>0</span>
          <h2>Your bag is quiet.</h2>
          <p>Explore the collection and choose an object made to stay.</p>
          <Link href="/#shop">Explore the collection</Link>
        </section>
      )}
    </main>
  )
}
