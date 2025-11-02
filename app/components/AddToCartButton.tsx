'use client'

import { ShoppingCart } from 'lucide-react'
import { useCart } from '../store/cartStore'
import toast from 'react-hot-toast'

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    price: number
    images: string[]
    stock: number
  }
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCart((state: any) => state.addItem)

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || 'https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=800',
      quantity: 1,
    })
    toast.success('Added to cart!')
  }

  return (
    <button
      disabled={product.stock === 0}
      onClick={handleAddToCart}
      className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ShoppingCart className="w-5 h-5" />
      Add to Cart
    </button>
  )
}
