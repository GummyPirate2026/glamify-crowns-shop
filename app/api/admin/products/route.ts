import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Increase body size limit for image uploads
export const runtime = 'nodejs'
export const maxDuration = 30 // 30 seconds timeout
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    console.log('=== PRODUCT CREATION DEBUG ===')
    console.log('Received data:', JSON.stringify(data, null, 2))
    
    // PostgreSQL supports arrays natively - no conversion needed
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        images: Array.isArray(data.images) ? data.images : [],
        category: data.category,
        stock: data.stock,
        featured: data.featured || false,
      },
    })
    
    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error('=== ERROR CREATING PRODUCT ===')
    console.error('Error type:', error.constructor.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    console.error('Full error:', error)
    return NextResponse.json({ 
      error: 'Failed to create product',
      details: error.message 
    }, { status: 500 })
  }
}
