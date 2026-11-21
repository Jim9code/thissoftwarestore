import type { Metadata } from 'next'
import SellerDashboard from './seller-dashboard'

export const metadata: Metadata = {
  title: 'Seller workspace — Form / Function',
  description: 'Manage products, orders, insights, and your Form / Function shop.',
}

export default function SellerPage() {
  return <SellerDashboard />
}
