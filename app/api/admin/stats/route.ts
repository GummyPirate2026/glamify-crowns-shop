import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [productsCount, ordersCount, customersCount] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count({ where: { isAdmin: false } }),
    ])

    return NextResponse.json({
      products: productsCount,
      orders: ordersCount,
      customers: customersCount,
    })
  } catch (error) {
    return NextResponse.json(
      { products: 0, orders: 0, customers: 0 },
      { status: 200 }
    )
  }
}
