'use server'

import { getPayloadClient } from '@/lib/payload'
import type { ReviewActionResult } from './Storefront'

const allowedProductKeys = new Set(['1', '2', '3', '4', '5', '6'])

const readString = (formData: FormData, field: string) => {
  const value = formData.get(field)
  return typeof value === 'string' ? value.trim() : ''
}

export async function submitReview(
  productKey: string,
  formData: FormData,
): Promise<ReviewActionResult> {
  const reviewerName = readString(formData, 'reviewerName')
  const email = readString(formData, 'email').toLowerCase()
  const title = readString(formData, 'title')
  const body = readString(formData, 'body')
  const rating = Number(readString(formData, 'rating'))
  const errors: Record<string, string> = {}

  if (!allowedProductKeys.has(productKey)) errors.productKey = 'Choose a valid product.'
  if (reviewerName.length < 2 || reviewerName.length > 60) errors.reviewerName = 'Enter your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) {
    errors.email = 'Enter a valid email address.'
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) errors.rating = 'Choose a rating.'
  if (title.length < 3 || title.length > 90) errors.title = 'Use 3–90 characters for the title.'
  if (body.length < 20 || body.length > 1200) errors.body = 'Use 20–1200 characters for the review.'

  if (Object.keys(errors).length > 0) {
    return { success: false, message: Object.values(errors)[0], errors }
  }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'reviews',
      overrideAccess: false,
      data: {
        productKey: productKey as '1' | '2' | '3' | '4' | '5' | '6',
        reviewerName,
        email,
        rating,
        title,
        body,
        verified: false,
        status: 'pending',
      },
    })

    return {
      success: true,
      message: 'Thank you. Your review was submitted and will appear after moderation.',
    }
  } catch {
    return {
      success: false,
      message: 'We could not submit your review right now. Please try again.',
    }
  }
}
