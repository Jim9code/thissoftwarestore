import { notFound } from 'next/navigation'
import CheckoutFlow from '../checkout-flow'
import { CartProvider } from '../../cart-context'

const steps = ['information', 'delivery', 'payment', 'review', 'success']

export function generateStaticParams() {
  return steps.map((step) => ({ step }))
}

export default async function CheckoutStepPage({ params }: { params: Promise<{ step: string }> }) {
  const { step } = await params
  if (!steps.includes(step)) notFound()
  return (
    <CartProvider>
      <CheckoutFlow step={step} />
    </CartProvider>
  )
}
