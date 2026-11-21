'use client'

import Link from 'next/link'
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type CartItem = {
  id: number
  name: string
  price: number
  image: string
  quantity: number
}

type CartProduct = Omit<CartItem, 'quantity'>

type CartContextValue = {
  items: CartItem[]
  count: number
  subtotal: number
  isOpen: boolean
  setOpen: (open: boolean) => void
  addItem: (product: CartProduct, quantity?: number) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setOpen] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('form-function-cart')
      if (stored) setItems(JSON.parse(stored) as CartItem[])
    } finally {
      setReady(true)
    }
  }, [])

  useEffect(() => {
    if (ready) window.localStorage.setItem('form-function-cart', JSON.stringify(items))
  }, [items, ready])

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((total, item) => total + item.quantity, 0)
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)

    return {
      items,
      count,
      subtotal,
      isOpen,
      setOpen,
      addItem: (product, quantity = 1) => {
        setItems((current) => {
          const existing = current.find((item) => item.id === product.id)
          if (existing) {
            return current.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
            )
          }
          return [...current, { ...product, quantity }]
        })
        setOpen(true)
      },
      removeItem: (id) => setItems((current) => current.filter((item) => item.id !== id)),
      updateQuantity: (id, quantity) =>
        setItems((current) =>
          quantity < 1
            ? current.filter((item) => item.id !== id)
            : current.map((item) => (item.id === id ? { ...item, quantity } : item)),
        ),
      clearCart: () => setItems([]),
    }
  }, [isOpen, items])

  return (
    <CartContext.Provider value={value}>
      {children}
      <div
        className={`cart-drawer-backdrop ${isOpen ? 'open' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside className={`cart-drawer ${isOpen ? 'open' : ''}`} aria-label="Shopping bag">
        <div className="cart-drawer-header">
          <div>
            <p>Shopping bag</p>
            <span>
              {value.count} object{value.count === 1 ? '' : 's'}
            </span>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close shopping bag">
            ×
          </button>
        </div>

        {items.length > 0 ? (
          <>
            <div className="cart-drawer-items">
              {items.map((item) => (
                <article key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div>
                    <p>{item.name}</p>
                    <span>Standard finish · Ready to ship</span>
                    <div>
                      <div>
                        <button onClick={() => value.updateQuantity(item.id, item.quantity - 1)}>
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => value.updateQuantity(item.id, item.quantity + 1)}>
                          +
                        </button>
                      </div>
                      <strong>${item.price * item.quantity}</strong>
                    </div>
                    <button onClick={() => value.removeItem(item.id)}>Remove</button>
                  </div>
                </article>
              ))}
            </div>
            <div className="cart-drawer-footer">
              <div>
                <span>Subtotal</span>
                <strong>${value.subtotal}</strong>
              </div>
              <p>Taxes calculated at checkout. Shipping is complimentary over $200.</p>
              <Link href="/checkout/information" onClick={() => setOpen(false)}>
                Checkout <span>${value.subtotal}</span>
              </Link>
              <Link href="/cart" onClick={() => setOpen(false)}>
                View shopping bag
              </Link>
            </div>
          </>
        ) : (
          <div className="cart-drawer-empty">
            <span>0</span>
            <h2>Your bag is quiet.</h2>
            <p>Add an object from the collection and it will wait for you here.</p>
            <button onClick={() => setOpen(false)}>Continue exploring</button>
          </div>
        )}
      </aside>
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
