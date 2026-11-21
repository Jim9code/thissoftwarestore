import type { Metadata } from 'next'
import SellerOnboarding from './seller-onboarding'

export const metadata: Metadata = {
  title: 'Open a shop — Form / Function',
  description: 'Create your seller profile and open your shop on Form / Function.',
}

export default function SellPage() {
  return <SellerOnboarding />
}
