# System Patterns: Glamify Crowns Shop

## Architecture Overview

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Database**: SQLite with Prisma ORM
- **State Management**: Zustand (cart)
- **Styling**: Tailwind CSS
- **UI Feedback**: react-hot-toast
- **Icons**: lucide-react

### Application Structure
```
glamify-crowns-shop/
├── app/
│   ├── (routes)
│   │   ├── page.tsx              # Homepage
│   │   ├── products/
│   │   │   ├── page.tsx          # Product catalog
│   │   │   └── [id]/page.tsx    # Product detail
│   │   ├── cart/page.tsx         # Shopping cart
│   │   └── admin/
│   │       ├── page.tsx          # Admin dashboard
│   │       └── products/
│   │           ├── page.tsx      # Product management
│   │           └── new/page.tsx  # Create product
│   ├── api/
│   │   └── admin/
│   │       ├── products/route.ts      # CRUD operations
│   │       ├── products/[id]/route.ts # Single product ops
│   │       └── stats/route.ts         # Statistics
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   └── AddToCartButton.tsx
│   └── store/
│       └── cartStore.ts          # Cart state management
├── lib/
│   └── prisma.ts                 # Prisma client
└── prisma/
    ├── schema.prisma             # Database schema
    └── dev.db                    # SQLite database
```

## Key Technical Decisions

### 1. SQLite for Local Storage
**Why**: Simplicity and portability
- No separate database server required
- Single file database (`dev.db`)
- Perfect for self-hosting
- Easy backups (just copy the file)

**Trade-off**: SQLite doesn't support arrays or JSON natively
- Images stored as `|||`-separated strings
- Converted to arrays in API responses
- See "Image Storage Pattern" below

### 2. Server Components by Default
**Why**: Better performance and SEO
- Pages are Server Components unless marked `'use client'`
- Server Components for data fetching
- Client Components only for interactivity
- Reduces JavaScript bundle size

**Pattern**:
```typescript
// Server Component (default)
async function ProductPage() {
  const products = await prisma.product.findMany()
  return <div>...</div>
}

// Client Component (interactive)
'use client'
function AddToCartButton() {
  const onClick = () => { /* ... */ }
  return <button onClick={onClick}>...</button>
}
```

### 3. Base64 Image Storage
**Why**: Self-contained, no external dependencies
- Images stored directly in database
- No separate file storage needed
- Works with any hosting provider
- Simplifies deployment

**Constraint**: 10MB body size limit for uploads
- Configured in `next.config.js`
- Keep images under 5MB for best performance

## Critical Implementation Patterns

### Image Storage Pattern
```typescript
// Storage: Convert array to string for SQLite
const imagesString = imageArray.join('|||')
await prisma.product.create({
  data: { images: imagesString }
})

// Retrieval: Convert string back to array
const product = await prisma.product.findUnique({ where: { id } })
const productWithArrays = {
  ...product,
  images: product.images ? product.images.split('|||') : []
}
```

### Client/Server Component Split
**Server Components** (Data fetching):
- `/app/page.tsx` - Homepage
- `/app/products/page.tsx` - Product catalog
- `/app/products/[id]/page.tsx` - Product details
- `/app/admin/**/page.tsx` - Admin pages

**Client Components** (Interactivity):
- `/app/components/AddToCartButton.tsx` - Cart interactions
- `/app/admin/products/new/page.tsx` - Form handling
- `/app/store/cartStore.ts` - State management

### API Route Pattern
```typescript
// GET: Fetch and transform data
export async function GET() {
  const products = await prisma.product.findMany()
  return NextResponse.json(
    products.map(p => ({
      ...p,
      images: p.images.split('|||')
    }))
  )
}

// POST: Transform and store data
export async function POST(request: NextRequest) {
  const data = await request.json()
  const imagesString = data.images.join('|||')
  const product = await prisma.product.create({
    data: { ...data, images: imagesString }
  })
  return NextResponse.json(product)
}
```

### State Management with Zustand
```typescript
// Cart store with persistence
export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => { /* ... */ },
      removeItem: (id) => { /* ... */ },
      // ...
    }),
    { name: 'cart-storage' } // LocalStorage key
  )
)
```

## Database Schema

### Product Model
```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  description String
  price       Float
  images      String   // "img1|||img2|||img3"
  category    String
  stock       Int      @default(0)
  featured    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Key Relationships
- Product ↔ OrderItem (future)
- Order ↔ User (future)
- Order ↔ OrderItem (future)

## Component Relationships

### Homepage Flow
```
HomePage (Server)
  ├─> Navbar (Server)
  ├─> Hero Section
  ├─> Features Grid
  └─> Footer (Server)
```

### Product Browsing Flow
```
ProductsPage (Server)
  └─> ProductCard[] (Server)
        └─> Link to /products/[id]
```

### Product Detail Flow
```
ProductPage (Server)
  ├─> Product Images
  ├─> Product Info
  └─> AddToCartButton (Client)
        └─> useCart hook
```

### Admin Flow
```
AdminDashboard (Server)
  ├─> Stats Display
  └─> Link to Products Management

AdminProductsPage (Server)
  ├─> Product List
  └─> CRUD buttons

AdminNewProductPage (Client)
  ├─> Form with image upload
  └─> API call to /api/admin/products
```

## Critical Configurations

### Next.js Config
```javascript
// Increased for image uploads
experimental: {
  serverActions: {
    bodySizeLimit: '10mb'
  }
}
```

### Prisma Client Singleton
```typescript
// Prevents multiple instances in development
const globalForPrisma = global as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

## Performance Considerations

1. **Image Optimization**: Next.js Image component with automatic optimization
2. **Revalidation**: `revalidate = 60` on product pages
3. **Static Generation**: Homepage and product pages pre-rendered
4. **Client-Side Caching**: Cart persists in LocalStorage
5. **Minimal JavaScript**: Most pages are Server Components

## Error Handling Patterns

1. **API Routes**: Try-catch with appropriate status codes
2. **Form Validation**: Client-side before submission
3. **Database Errors**: Logged to console with details
4. **404 Handling**: `notFound()` for missing products
5. **Toast Notifications**: User feedback on actions
