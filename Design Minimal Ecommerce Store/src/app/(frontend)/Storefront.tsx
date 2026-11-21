'use client'

import Link from 'next/link'
import { FormEvent, useMemo, useState, useTransition } from 'react'
import { useCart } from './cart-context'

type IconName = 'arrow' | 'bag' | 'heart' | 'menu' | 'pause' | 'play' | 'search' | 'spark' | 'x'

type Product = {
  id: number
  name: string
  category: string
  description: string
  price: number
  image: string
  colors: string[]
  tag?: string
}

export type Review = {
  id: string
  productKey: string
  reviewerName: string
  rating: number
  title: string
  body: string
  verified: boolean
  createdAt: string
}

export type ReviewActionResult = {
  success: boolean
  message: string
  errors?: Record<string, string>
}

const products: Product[] = [
  {
    id: 1,
    name: 'Monolith 65 Keyboard',
    category: 'Keyboards',
    description: 'CNC walnut frame · anodized sage plate',
    price: 340,
    image:
      'https://images.unsplash.com/photo-1536059540012-f2ed455bc0b1?auto=format&fit=crop&w=1200&q=85',
    colors: ['#bd741e', '#5f735f', '#402d24'],
    tag: 'New object',
  },
  {
    id: 2,
    name: 'Solāre Studio Headphones',
    category: 'Audio',
    description: '50mm beryllium drivers · walnut cups',
    price: 420,
    image:
      'https://images.unsplash.com/photo-1637780852590-8ab27248ec41?auto=format&fit=crop&w=1200&q=85',
    colors: ['#d49a47', '#e5ded0', '#677764'],
    tag: 'Bestseller',
  },
  {
    id: 3,
    name: 'Field Study Hoodie',
    category: 'Apparel',
    description: '620gsm organic cotton · garment dyed',
    price: 185,
    image:
      'https://images.unsplash.com/photo-1576188973526-0e5d7047b0cf?auto=format&fit=crop&w=1200&q=85',
    colors: ['#536552', '#4a3026', '#d4c4a9'],
  },
  {
    id: 4,
    name: 'Transit Puffer 01',
    category: 'Apparel',
    description: 'Recycled down · weatherproof ripstop',
    price: 149,
    image:
      'https://images.unsplash.com/photo-1677123718817-5a203404d638?auto=format&fit=crop&w=1200&q=85',
    colors: ['#c77020', '#2e2b28', '#d8d2c5'],
    tag: 'Limited',
  },
  {
    id: 5,
    name: 'Arc One Field Watch',
    category: 'Objects',
    description: 'Brushed steel · vegetable tanned leather',
    price: 265,
    image:
      'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=1200&q=85',
    colors: ['#7a4d35', '#a9aca5', '#1f2420'],
  },
  {
    id: 6,
    name: 'Stone Air Speaker',
    category: 'Audio',
    description: '360° spatial audio · woven acoustic shell',
    price: 295,
    image:
      'https://images.unsplash.com/photo-1547052178-7f2c5a20c332?auto=format&fit=crop&w=1200&q=85',
    colors: ['#d8d3c5', '#697768', '#c48028'],
  },
]

const categories = ['All', 'Keyboards', 'Audio', 'Apparel', 'Objects']

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <path d="M5 12h14M14 6l6 6-6 6" />,
    bag: (
      <>
        <path d="M5 8h14l-1 12H6L5 8Z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </>
    ),
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
    ),
    menu: (
      <>
        <path d="M4 7h16" />
        <path d="M4 17h16" />
      </>
    ),
    pause: (
      <>
        <path d="M9 7v10" />
        <path d="M15 7v10" />
      </>
    ),
    play: <path d="m9 7 8 5-8 5V7Z" />,
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    spark: (
      <>
        <path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" />
        <path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" />
      </>
    ),
    x: (
      <>
        <path d="m6 6 12 12" />
        <path d="M18 6 6 18" />
      </>
    ),
  }

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}

function Brand() {
  return (
    <a href="#top" className="brand" aria-label="Form and Function home">
      <span className="brand-mark">F</span>
      <span>form / function</span>
    </a>
  )
}

const detailImages: Record<string, string[]> = {
  Keyboards: [
    'https://images.unsplash.com/photo-1584727129739-cd30984745bc?auto=format&fit=crop&w=1400&q=88',
    'https://images.unsplash.com/photo-1627509493009-9249a2ad2459?auto=format&fit=crop&w=1400&q=88',
  ],
  Audio: [
    'https://images.unsplash.com/photo-1693621947585-7b7d94149af4?auto=format&fit=crop&w=1400&q=88',
    'https://images.unsplash.com/photo-1520170350707-b2da59970118?auto=format&fit=crop&w=1400&q=88',
  ],
  Apparel: [
    'https://images.unsplash.com/photo-1613422448762-c13f05ae758a?auto=format&fit=crop&w=1400&q=88',
    'https://images.unsplash.com/photo-1711527124424-463764d8d8e5?auto=format&fit=crop&w=1400&q=88',
  ],
  Objects: [
    'https://images.unsplash.com/photo-1582150264904-e0bea5ef0ad1?auto=format&fit=crop&w=1400&q=88',
    'https://images.unsplash.com/photo-1684573573596-38d19a0c0776?auto=format&fit=crop&w=1400&q=88',
  ],
}

function ProductDetail({
  product,
  cartCount,
  isFavorite,
  onBack,
  onAdd,
  onFavorite,
  onSelectProduct,
  onOpenBag,
  notify,
  toast,
  reviews,
  submitReviewAction,
}: {
  product: Product
  cartCount: number
  isFavorite: boolean
  onBack: () => void
  onAdd: (product: Product, quantity: number) => void
  onFavorite: (id: number) => void
  onSelectProduct: (product: Product) => void
  onOpenBag: () => void
  notify: (message: string) => void
  toast: string
  reviews: Review[]
  submitReviewAction: (productKey: string, formData: FormData) => Promise<ReviewActionResult>
}) {
  const [activeImage, setActiveImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedSize, setSelectedSize] = useState('M')
  const [quantity, setQuantity] = useState(1)
  const [openPanel, setOpenPanel] = useState('Details')
  const [reviewFilter, setReviewFilter] = useState(0)
  const [reviewFormOpen, setReviewFormOpen] = useState(false)
  const [reviewResult, setReviewResult] = useState<ReviewActionResult | null>(null)
  const [isSubmittingReview, startReviewTransition] = useTransition()
  const gallery = [product.image, ...(detailImages[product.category] ?? detailImages.Objects)]
  const finishNames = ['Amber', 'Sage', 'Walnut']
  const related = products.filter((item) => item.id !== product.id).slice(0, 3)
  const productReviews = reviews.filter((review) => review.productKey === String(product.id))
  const filteredReviews =
    reviewFilter === 0
      ? productReviews
      : productReviews.filter((review) => review.rating === reviewFilter)
  const averageRating =
    productReviews.length > 0
      ? productReviews.reduce((total, review) => total + review.rating, 0) / productReviews.length
      : 0

  const switchProduct = (item: Product) => {
    onSelectProduct(item)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="detail-page">
      <div className="announcement">
        <span>Edition 04 is live</span>
        <span className="announcement-rule" />
        <span>Complimentary shipping over $200</span>
      </div>
      <header className="detail-header">
        <Brand />
        <nav aria-label="Product navigation">
          <button onClick={onBack}>Shop</button>
          <a href="#materials">Materials</a>
          <a href="#related">Related</a>
        </nav>
        <button className="detail-bag" onClick={onOpenBag}>
          <Icon name="bag" />
          <span>Bag</span>
          <b>{cartCount}</b>
        </button>
      </header>

      <div className="detail-breadcrumb">
        <button onClick={onBack}>Collection</button>
        <span>/</span>
        <span>{product.category}</span>
        <span>/</span>
        <strong>{product.name}</strong>
      </div>

      <section className="product-detail">
        <div className="detail-gallery">
          <div className="detail-main-image">
            {product.tag && <span>{product.tag}</span>}
            <img src={gallery[activeImage]} alt={`${product.name}, view ${activeImage + 1}`} />
            <p>
              {String(activeImage + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}
            </p>
          </div>
          <div className="detail-thumbnails">
            {gallery.map((image, index) => (
              <button
                key={image}
                className={activeImage === index ? 'active' : ''}
                onClick={() => setActiveImage(index)}
                aria-label={`View product image ${index + 1}`}
              >
                <img src={image} alt="" />
              </button>
            ))}
          </div>
        </div>

        <aside className="detail-purchase">
          <div className="detail-label-row">
            <p className="product-category">
              Object {String(product.id).padStart(2, '0')} / {product.category}
            </p>
            <div className="rating" aria-label="Rated 4.9 out of 5">
              <span>★★★★★</span> 4.9 (38)
            </div>
          </div>
          <h1>{product.name}</h1>
          <div className="detail-price-row">
            <strong>${product.price}</strong>
            <span>or 4 payments of ${(product.price / 4).toFixed(2)}</span>
          </div>
          <p className="detail-intro">
            An everyday object reduced to its essentials. Tactile, durable, and designed to become
            more personal with use.
          </p>

          <div className="finish-picker">
            <div>
              <span>Finish</span>
              <strong>{finishNames[selectedColor] ?? `Finish ${selectedColor + 1}`}</strong>
            </div>
            <div className="finish-options">
              {product.colors.map((color, index) => (
                <button
                  key={color}
                  className={selectedColor === index ? 'active' : ''}
                  style={{ '--swatch': color } as React.CSSProperties}
                  onClick={() => setSelectedColor(index)}
                  aria-label={`Select ${finishNames[index] ?? `finish ${index + 1}`}`}
                />
              ))}
            </div>
          </div>

          {product.category === 'Apparel' && (
            <div className="size-picker">
              <div>
                <span>Size</span>
                <button onClick={() => notify('Our fit is relaxed. Choose your usual size.')}>
                  Size guide
                </button>
              </div>
              <div>
                {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                  <button
                    key={size}
                    className={selectedSize === size ? 'active' : ''}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="purchase-actions">
            <div className="quantity-picker">
              <button onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((value) => value + 1)}>+</button>
            </div>
            <button className="detail-add" onClick={() => onAdd(product, quantity)}>
              Add to bag <span>${product.price * quantity}</span>
            </button>
            <button
              className={`detail-favorite ${isFavorite ? 'active' : ''}`}
              onClick={() => onFavorite(product.id)}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Icon name="heart" />
            </button>
          </div>

          <div className="purchase-notes">
            <span>
              <b>01</b> Free shipping over $200
            </span>
            <span>
              <b>02</b> 30 day considered returns
            </span>
            <span>
              <b>03</b> Two year object warranty
            </span>
          </div>

          <div className="detail-accordions">
            {[
              ['Details', product.description],
              [
                'Materials',
                'Natural, traceable materials selected to patina rather than wear out.',
              ],
              [
                'Shipping & returns',
                'Dispatches in 1–2 days. Returns are accepted within 30 days.',
              ],
            ].map(([title, content]) => (
              <div className={openPanel === title ? 'open' : ''} key={title}>
                <button onClick={() => setOpenPanel(openPanel === title ? '' : title)}>
                  {title}
                  <span>{openPanel === title ? '−' : '+'}</span>
                </button>
                <p>{content}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="material-story" id="materials">
        <div className="material-copy">
          <p className="section-index">Material note / 01</p>
          <h2>
            Made for the way
            <br />
            you <em>actually live.</em>
          </h2>
          <p>
            Every surface is selected for touch, resilience, and the way it changes over time.
            Nothing is hidden beneath high-gloss finishes. The honest material is the final detail.
          </p>
          <dl>
            <div>
              <dt>Origin</dt>
              <dd>Small-batch workshop</dd>
            </div>
            <div>
              <dt>Finish</dt>
              <dd>Hand applied</dd>
            </div>
            <div>
              <dt>Designed for</dt>
              <dd>Daily use</dd>
            </div>
          </dl>
        </div>
        <div className="material-image">
          <img src={gallery[1]} alt={`Material detail of ${product.name}`} loading="lazy" />
          <span>Texture / tone / time</span>
        </div>
      </section>

      <section className="reviews-section" id="reviews">
        <div className="reviews-heading">
          <div>
            <p className="section-index">Community notes</p>
            <h2>
              Lived with.
              <br />
              <em>Well reviewed.</em>
            </h2>
          </div>
          <button onClick={() => setReviewFormOpen((value) => !value)}>
            {reviewFormOpen ? 'Close form' : 'Write a review'} <Icon name="arrow" />
          </button>
        </div>

        {reviewFormOpen && (
          <form
            className="review-form"
            onSubmit={(event) => {
              event.preventDefault()
              const form = event.currentTarget
              const formData = new FormData(form)
              setReviewResult(null)
              startReviewTransition(async () => {
                const result = await submitReviewAction(String(product.id), formData)
                setReviewResult(result)
                if (result.success) form.reset()
              })
            }}
          >
            <div className="review-form-intro">
              <p className="product-category">Share your experience</p>
              <h3>How is it fitting into your day?</h3>
              <p>Reviews are moderated before appearing publicly. Your email is never displayed.</p>
            </div>
            <div className="review-fields">
              <label>
                Your rating
                <select name="rating" required defaultValue="5">
                  <option value="5">★★★★★ — Excellent</option>
                  <option value="4">★★★★☆ — Very good</option>
                  <option value="3">★★★☆☆ — Good</option>
                  <option value="2">★★☆☆☆ — Fair</option>
                  <option value="1">★☆☆☆☆ — Not for me</option>
                </select>
              </label>
              <div>
                <label>
                  Name
                  <input name="reviewerName" required minLength={2} maxLength={60} />
                </label>
                <label>
                  Email
                  <input name="email" type="email" required maxLength={120} />
                </label>
              </div>
              <label>
                Review title
                <input name="title" required minLength={3} maxLength={90} />
              </label>
              <label>
                Your review
                <textarea name="body" required minLength={20} maxLength={1200} rows={5} />
              </label>
              <button type="submit" disabled={isSubmittingReview}>
                {isSubmittingReview ? 'Submitting…' : 'Submit for review'}
                <Icon name="arrow" />
              </button>
              {reviewResult && (
                <p className={reviewResult.success ? 'review-success' : 'review-error'}>
                  {reviewResult.message}
                </p>
              )}
            </div>
          </form>
        )}

        <div className="reviews-content">
          <aside className="rating-summary">
            <strong>{averageRating ? averageRating.toFixed(1) : '—'}</strong>
            <span>{averageRating ? '★★★★★' : 'No rating yet'}</span>
            <p>
              Based on {productReviews.length} customer review
              {productReviews.length === 1 ? '' : 's'}
            </p>
            <div className="rating-bars">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = productReviews.filter((review) => review.rating === rating).length
                const width = productReviews.length ? (count / productReviews.length) * 100 : 0
                return (
                  <button key={rating} onClick={() => setReviewFilter(rating)}>
                    <span>{rating} star</span>
                    <i>
                      <b style={{ width: `${width}%` }} />
                    </i>
                    <em>{count}</em>
                  </button>
                )
              })}
            </div>
          </aside>

          <div className="review-list">
            <div className="review-list-toolbar">
              <span>
                {reviewFilter ? `${reviewFilter}-star reviews` : 'All reviews'} (
                {filteredReviews.length})
              </span>
              {reviewFilter > 0 && <button onClick={() => setReviewFilter(0)}>Clear filter</button>}
            </div>
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                <article key={review.id}>
                  <div className="review-author">
                    <span>{review.reviewerName.slice(0, 1)}</span>
                    <p>
                      <strong>{review.reviewerName}</strong>
                      {review.verified && <small>Verified buyer</small>}
                    </p>
                  </div>
                  <div className="review-body">
                    <div>
                      <span>
                        {'★'.repeat(review.rating)}
                        {'☆'.repeat(5 - review.rating)}
                      </span>
                      <time>
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </time>
                    </div>
                    <h3>{review.title}</h3>
                    <p>{review.body}</p>
                  </div>
                </article>
              ))
            ) : (
              <div className="reviews-empty">
                <p>No reviews in this view yet.</p>
                <button onClick={() => setReviewFormOpen(true)}>Be the first to share yours</button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="related-products" id="related">
        <div>
          <p className="section-index">Continue exploring</p>
          <h2>
            Objects that sit well <em>together.</em>
          </h2>
        </div>
        <div className="related-grid">
          {related.map((item) => (
            <button key={item.id} onClick={() => switchProduct(item)}>
              <div>
                <img src={item.image} alt={item.name} loading="lazy" />
              </div>
              <span>{item.category}</span>
              <p>
                {item.name}
                <strong>${item.price}</strong>
              </p>
            </button>
          ))}
        </div>
      </section>

      <footer className="detail-footer">
        <Brand />
        <p>Considered objects for daily life.</p>
        <button onClick={onBack}>
          Return to collection <Icon name="arrow" />
        </button>
      </footer>

      <div className={`toast ${toast ? 'visible' : ''}`} role="status" aria-live="polite">
        <span>{toast}</span>
      </div>
    </main>
  )
}

export default function Storefront({
  initialReviews,
  submitReviewAction,
}: {
  initialReviews: Review[]
  submitReviewAction: (productKey: string, formData: FormData) => Promise<ReviewActionResult>
}) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [favorites, setFavorites] = useState<number[]>([])
  const { count: cartCount, addItem, setOpen: setCartOpen } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [soundOn, setSoundOn] = useState(false)
  const [toast, setToast] = useState('')
  const [email, setEmail] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const visibleProducts = useMemo(
    () =>
      products.filter((product) => {
        const categoryMatch = activeCategory === 'All' || product.category === activeCategory
        const searchMatch = `${product.name} ${product.description}`
          .toLowerCase()
          .includes(search.toLowerCase())
        return categoryMatch && searchMatch
      }),
    [activeCategory, search],
  )

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  const addToCart = (product: Product, quantity = 1) => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      },
      quantity,
    )
    notify(`${quantity} × ${product.name} added to your bag`)
  }

  const toggleFavorite = (id: number) => {
    setFavorites((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items, id],
    )
  }

  const subscribe = (event: FormEvent) => {
    event.preventDefault()
    if (!email) return
    notify('You’re on the list. Welcome in.')
    setEmail('')
  }

  if (selectedProduct) {
    return (
      <ProductDetail
        key={selectedProduct.id}
        product={selectedProduct}
        cartCount={cartCount}
        isFavorite={favorites.includes(selectedProduct.id)}
        onBack={() => {
          setSelectedProduct(null)
          window.setTimeout(() => document.querySelector('#shop')?.scrollIntoView(), 0)
        }}
        onAdd={addToCart}
        onFavorite={toggleFavorite}
        onSelectProduct={setSelectedProduct}
        onOpenBag={() => setCartOpen(true)}
        notify={notify}
        toast={toast}
        reviews={initialReviews}
        submitReviewAction={submitReviewAction}
      />
    )
  }

  return (
    <main id="top">
      <div className="announcement">
        <span>Edition 04 is live</span>
        <span className="announcement-rule" />
        <span>Complimentary shipping over $200</span>
      </div>

      <header className="site-header">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#shop">Shop</a>
          <a href="#story">About</a>
          <a href="#journal">Journal</a>
          <Link href="/sell">Sell with us</Link>
        </nav>
        <div className="header-actions">
          <Link className="seller-entry-button" href="/sell">
            <span>Sell with us</span>
            <b>↗</b>
          </Link>
          <button
            className="icon-button sound-button"
            onClick={() => setSoundOn((value) => !value)}
            aria-label={soundOn ? 'Pause ambient sound' : 'Play ambient sound'}
          >
            <Icon name={soundOn ? 'pause' : 'play'} size={16} />
          </button>
          <button className="bag-button" onClick={() => setCartOpen(true)}>
            <Icon name="bag" />
            <span>Bag</span>
            <b>{cartCount}</b>
          </button>
          <button
            className="icon-button mobile-menu-button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <Icon name={menuOpen ? 'x' : 'menu'} />
          </button>
        </div>
      </header>

      {menuOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <a href="#shop" onClick={() => setMenuOpen(false)}>
            Shop
          </a>
          <a href="#story" onClick={() => setMenuOpen(false)}>
            About
          </a>
          <a href="#journal" onClick={() => setMenuOpen(false)}>
            Journal
          </a>
          <Link href="/sell" onClick={() => setMenuOpen(false)}>
            Sell with us
          </Link>
        </nav>
      )}

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span>01</span> The daily uniform
          </p>
          <h1>
            Objects for a<br />
            quieter <em>life.</em>
          </h1>
          <p className="hero-description">
            Considered essentials for work, rest, and everything between. Made slowly, chosen
            deliberately.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#shop">
              Explore the collection <Icon name="arrow" />
            </a>
            <button
              className="text-button"
              onClick={() =>
                document.querySelector('#story')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Our approach <span>↘</span>
            </button>
            <Link className="text-button" href="/sell">
              Open a shop <span>↗</span>
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-orbit hero-orbit-one" />
          <div className="hero-orbit hero-orbit-two" />
          <p className="hero-note">
            Engineered warmth
            <br />
            without the weight
          </p>
          <div className="hero-image-wrap">
            <img
              src="https://images.unsplash.com/photo-1677123718817-5a203404d638?auto=format&fit=crop&w=1300&q=90"
              alt="Model wearing the orange Transit puffer jacket"
            />
          </div>
          <div className="hero-price">
            <span>Transit Puffer 01</span>
            <strong>$149</strong>
          </div>
        </div>

        <div className="scroll-cue">
          <span>Scroll to explore</span>
          <i />
        </div>
      </section>

      <section className="principles" id="story">
        <p className="section-index">02 / Our principles</p>
        <div className="principle-statement">
          <Icon name="spark" size={24} />
          <h2>
            Less noise.
            <br />
            More <em>meaning.</em>
          </h2>
        </div>
        <div className="principle-copy">
          <p>
            We collect useful things with presence: tactile materials, enduring shapes, and no
            unnecessary details.
          </p>
          <div className="principle-stats">
            <span>
              <strong>42</strong> purposeful objects
            </span>
            <span>
              <strong>08</strong> small-batch makers
            </span>
          </div>
        </div>
      </section>

      <section className="shop-section" id="shop">
        <div className="shop-heading">
          <div>
            <p className="section-index">03 / The collection</p>
            <h2>
              Made to be <em>kept.</em>
            </h2>
          </div>
          <p>Everyday pieces selected for their feel, function, and ability to age beautifully.</p>
        </div>

        <div className="shop-toolbar">
          <div className="category-list" role="tablist" aria-label="Product categories">
            {categories.map((category) => (
              <button
                key={category}
                className={activeCategory === category ? 'active' : ''}
                onClick={() => setActiveCategory(category)}
                role="tab"
                aria-selected={activeCategory === category}
              >
                {category}
              </button>
            ))}
          </div>
          <label className="search-field">
            <Icon name="search" size={16} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search objects"
              aria-label="Search products"
            />
            {search && (
              <button onClick={() => setSearch('')} aria-label="Clear search">
                <Icon name="x" size={14} />
              </button>
            )}
          </label>
        </div>

        {visibleProducts.length > 0 ? (
          <div className="product-grid">
            {visibleProducts.map((product, index) => {
              const isFavorite = favorites.includes(product.id)
              return (
                <article
                  className="product-card"
                  key={product.id}
                  style={{ '--delay': `${index * 70}ms` } as React.CSSProperties}
                  onClick={() => {
                    setSelectedProduct(product)
                    window.scrollTo(0, 0)
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      setSelectedProduct(product)
                      window.scrollTo(0, 0)
                    }
                  }}
                  tabIndex={0}
                >
                  <div className="product-image">
                    {product.tag && <span className="product-tag">{product.tag}</span>}
                    <button
                      className={`favorite-button ${isFavorite ? 'active' : ''}`}
                      onClick={(event) => {
                        event.stopPropagation()
                        toggleFavorite(product.id)
                      }}
                      aria-label={`${isFavorite ? 'Remove' : 'Add'} ${product.name} ${isFavorite ? 'from' : 'to'} favorites`}
                    >
                      <Icon name="heart" />
                    </button>
                    <img src={product.image} alt={product.name} loading="lazy" />
                    <button
                      className="quick-add"
                      onClick={(event) => {
                        event.stopPropagation()
                        addToCart(product)
                      }}
                    >
                      Quick add <Icon name="arrow" size={16} />
                    </button>
                  </div>
                  <div className="product-meta">
                    <p className="product-category">
                      {String(product.id).padStart(2, '0')} / {product.category}
                    </p>
                    <div className="product-title-row">
                      <h3>{product.name}</h3>
                      <strong>${product.price}</strong>
                    </div>
                    <p>{product.description}</p>
                    <div
                      className="product-swatches"
                      aria-label={`${product.colors.length} finishes`}
                    >
                      {product.colors.map((color) => (
                        <i key={color} style={{ background: color }} />
                      ))}
                      <span>{product.colors.length} finishes</span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="empty-state">
            <Icon name="search" size={28} />
            <h3>No objects found</h3>
            <p>Try a different search or browse the full collection.</p>
            <button
              onClick={() => {
                setSearch('')
                setActiveCategory('All')
              }}
            >
              View everything
            </button>
          </div>
        )}
      </section>

      <section className="sale-banner" id="offers">
        <div className="sale-banner-copy">
          <p className="section-index">Seasonal offer / Limited time</p>
          <h2>
            The daily reset.
            <br />
            <em>Save 20%.</em>
          </h2>
          <p>
            Build a calmer desk with any keyboard and audio pairing. The saving appears
            automatically in your bag.
          </p>
          <button
            onClick={() => {
              setActiveCategory('All')
              document.querySelector('#shop')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Shop the offer <Icon name="arrow" />
          </button>
          <span>Ends Sunday at midnight · Selected objects only</span>
        </div>
        <div className="sale-banner-image">
          <img
            src="https://images.unsplash.com/photo-1584727151652-d09b17ebf23f?auto=format&fit=crop&w=1600&q=88"
            alt="Mechanical keyboard on a warm walnut desk"
            loading="lazy"
          />
          <b>−20%</b>
        </div>
      </section>

      <section className="category-shop" id="journal">
        <div className="commerce-heading">
          <div>
            <p className="section-index">Shop by ritual</p>
            <h2>
              Find your <em>daily edit.</em>
            </h2>
          </div>
          <p>Curated starting points for the places and moments you return to most.</p>
        </div>
        <div className="category-cards">
          {[
            ['Desk', 'Keyboards', products[0].image, '6 objects'],
            ['Listen', 'Audio', products[1].image, '8 objects'],
            ['Wear', 'Apparel', products[3].image, '12 objects'],
          ].map(([label, category, image, count]) => (
            <button
              key={label}
              onClick={() => {
                setActiveCategory(category)
                document.querySelector('#shop')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <img src={image} alt="" loading="lazy" />
              <span>{count}</span>
              <div>
                <p>{label}</p>
                <strong>
                  Shop {category} <Icon name="arrow" />
                </strong>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="bundle-banner">
        <div className="bundle-products">
          <img src={products[1].image} alt="Solāre Studio Headphones" loading="lazy" />
          <img src={products[5].image} alt="Stone Air Speaker" loading="lazy" />
        </div>
        <div className="bundle-copy">
          <p className="section-index">Pairing 02 / Better together</p>
          <h2>
            Two ways to
            <br />
            <em>hear more.</em>
          </h2>
          <p>
            Solāre headphones and Stone Air speaker, paired for private focus and room-filling
            sound.
          </p>
          <div>
            <span>
              <s>$715</s> $645
            </span>
            <button
              onClick={() => {
                addToCart(products[1])
                addToCart(products[5])
              }}
            >
              Add the pair <Icon name="arrow" />
            </button>
          </div>
        </div>
      </section>

      <section className="commerce-promises">
        <div>
          <span>01</span>
          <strong>Complimentary shipping</strong>
          <p>On orders over $200</p>
        </div>
        <div>
          <span>02</span>
          <strong>Considered returns</strong>
          <p>30 days, no rush</p>
        </div>
        <div>
          <span>03</span>
          <strong>Object warranty</strong>
          <p>Two years as standard</p>
        </div>
        <div>
          <span>04</span>
          <strong>Human support</strong>
          <p>Real help, Monday–Friday</p>
        </div>
      </section>

      <section className="commerce-newsletter">
        <div>
          <p className="section-index">The quiet list</p>
          <h2>
            First access,
            <br />
            <em>better prices.</em>
          </h2>
        </div>
        <form onSubmit={subscribe}>
          <label htmlFor="email">
            Get private sale access and first notice of small-batch releases.
          </label>
          <div>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Your email address"
            />
            <button type="submit">
              Join the list <Icon name="arrow" />
            </button>
          </div>
        </form>
      </section>

      <footer>
        <Brand />
        <p>
          Considered objects for daily life.
          <br />
          Designed somewhere quiet.
        </p>
        <div className="footer-links">
          <a href="#shop">Shop</a>
          <a href="#story">About</a>
          <a href="#journal">Journal</a>
          <Link href="/sell">Open a shop</Link>
          <a href="#top">Instagram</a>
        </div>
        <div className="footer-bottom">
          <span>© 2025 Form / Function</span>
          <span>Privacy · Terms</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>

      <div className={`toast ${toast ? 'visible' : ''}`} role="status" aria-live="polite">
        <span>{toast}</span>
      </div>
    </main>
  )
}
