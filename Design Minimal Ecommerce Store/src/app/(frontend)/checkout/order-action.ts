'use server'

import { getPayloadClient } from '@/lib/payload'

type CheckoutItem = { id: number; quantity: number }
type CheckoutDetails = {
  email: string
  firstName: string
  lastName: string
  address: string
  apartment?: string
  city: string
  region: string
  postalCode: string
  country: string
  deliveryMethod: string
  paymentLast4: string
}

export type OrderResult = {
  success: boolean
  message: string
  orderNumber?: string
}

const productKeys = new Set(['1', '2', '3', '4', '5', '6'])
const countries = new Set(['United States', 'Canada', 'United Kingdom'])

export async function placeOrder(
  items: CheckoutItem[],
  details: CheckoutDetails,
): Promise<OrderResult> {
  const cleanItems = items
    .filter((item) => productKeys.has(String(item.id)))
    .map((item) => ({
      productKey: String(item.id),
      quantity: Math.max(1, Math.min(10, Math.floor(Number(item.quantity) || 1))),
    }))

  if (!cleanItems.length) return { success: false, message: 'Your shopping bag is empty.' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) {
    return { success: false, message: 'Enter a valid email address.' }
  }
  if (
    !details.firstName?.trim() ||
    !details.lastName?.trim() ||
    !details.address?.trim() ||
    !details.city?.trim() ||
    !details.region?.trim() ||
    !details.postalCode?.trim() ||
    !countries.has(details.country)
  ) {
    return { success: false, message: 'Complete your shipping information.' }
  }
  if (!['standard', 'express'].includes(details.deliveryMethod)) {
    return { success: false, message: 'Choose a delivery method.' }
  }
  if (!/^\d{4}$/.test(details.paymentLast4)) {
    return { success: false, message: 'Confirm a valid card ending.' }
  }

  try {
    const payload = await getPayloadClient()
    const order = await payload.create({
      collection: 'orders',
      overrideAccess: false,
      data: {
        orderNumber: 'server-generated',
        status: 'received',
        customerEmail: details.email.toLowerCase().trim(),
        shipping: {
          firstName: details.firstName.trim(),
          lastName: details.lastName.trim(),
          address: details.address.trim(),
          apartment: details.apartment?.trim(),
          city: details.city.trim(),
          region: details.region.trim(),
          postalCode: details.postalCode.trim(),
          country: details.country as 'United States' | 'Canada' | 'United Kingdom',
        },
        deliveryMethod: details.deliveryMethod as 'standard' | 'express',
        paymentMethod: 'card',
        paymentLast4: details.paymentLast4,
        items: cleanItems.map((item) => ({
          ...item,
          name: 'server-validated',
          unitPrice: 0,
          lineTotal: 0,
        })),
        subtotal: 0,
        shippingTotal: 0,
        total: 0,
      },
    })

    return {
      success: true,
      message: 'Your order has been received.',
      orderNumber: order.orderNumber,
    }
  } catch {
    return { success: false, message: 'We could not place your order. Please try again.' }
  }
}
