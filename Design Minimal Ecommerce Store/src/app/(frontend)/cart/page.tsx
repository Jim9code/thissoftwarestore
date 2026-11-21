import CartPageClient from './page-client'
import { CartProvider } from '../cart-context'

export default function CartPage() {
  return (
    <CartProvider>
      <CartPageClient />
    </CartProvider>
  )
}
