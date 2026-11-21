import { unstable_cache } from 'next/cache'
import Storefront, { type Review } from './Storefront'
import { submitReview } from './review-actions'
import { getPayloadClient } from '@/lib/payload'
import { CartProvider } from './cart-context'

const getApprovedReviews = unstable_cache(
  async (): Promise<Review[]> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'reviews',
      overrideAccess: false,
      sort: '-createdAt',
      limit: 100,
      select: {
        productKey: true,
        reviewerName: true,
        rating: true,
        title: true,
        body: true,
        verified: true,
        createdAt: true,
      },
    })

    return result.docs.map((review) => ({
      id: String(review.id),
      productKey: review.productKey,
      reviewerName: review.reviewerName,
      rating: review.rating,
      title: review.title,
      body: review.body,
      verified: review.verified ?? false,
      createdAt: review.createdAt,
    }))
  },
  ['approved-reviews'],
  { tags: ['reviews'] },
)

export default async function HomePage() {
  const reviews = await getApprovedReviews()
  return (
    <CartProvider>
      <Storefront initialReviews={reviews} submitReviewAction={submitReview} />
    </CartProvider>
  )
}
