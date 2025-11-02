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
    // Convert images string to array for frontend
    const productsWithArrays = products.map((product: any) => ({
      ...product,
      images: product.images ? product.images.split('|||') : []
    }))
    return NextResponse.json(productsWithArrays)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    console.log('=== PRODUCT CREATION DEBUG ===')
    console.log('Received data:', JSON.stringify(data, null, 2))
    
    // Convert images array to comma-separated string for SQLite
    const imagesString = Array.isArray(data.images) 
      ? data.images.join('|||') 
      : ''
    
    console.log('Images string length:', imagesString.length)
    console.log('Images count:', data.images?.length || 0)
    
    const productData = {
      name: data.name,
      description: data.description,
      price: data.price,
      images: imagesString,
      category: data.category,
      stock: data.stock,
      featured: data.featured || false,
    }
    
    console.log('Creating product with data:', { ...productData, images: `${imagesString.length} chars` })
    
    const product = await prisma.product.create({
      data: productData,
    })
    
    console.log('Product created successfully:', product.id)
    
    // Convert images back to array for response
    const productWithArray = {
      ...product,
      images: product.images ? product.images.split('|||') : []
    }
    
    return NextResponse.json(productWithArray, { status: 201 })
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
