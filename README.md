# Glamify Crowns Shop - Self-Hosted E-commerce Platform

A complete, self-hosted e-commerce platform built with Next.js 15, designed to replace your Etsy shop without listing fees. Features a beautiful UI, full admin panel, shopping cart, and payment integration.

## Features

- 🛍️ **Product Catalog** - Browse and search products with filtering
- 🛒 **Shopping Cart** - Add to cart with persistent storage
- 💳 **Stripe Integration** - Secure payment processing
- 👑 **Admin Dashboard** - Manage products, orders, and customers
- 📱 **Responsive Design** - Works perfectly on mobile and desktop
- 🎨 **Modern UI** - Built with Tailwind CSS
- 🔒 **Secure** - Built-in authentication and security

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **State Management**: Zustand
- **Payment**: Stripe
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (or use a hosted service like Supabase/Neon)
- Stripe account for payments

### Installation

1. **Install dependencies:**
   ```bash
   cd glamify-crowns-shop
   npm install
   ```

2. **Set up environment variables:**
   
   Update `.env.local` with your credentials:
   ```env
   # Database
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
   
   # Authentication
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Stripe
   STRIPE_SECRET_KEY="sk_test_..."
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY="pk_test_..."
   ```

3. **Set up the database:**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Setup Options

### Option 1: Local PostgreSQL
Install PostgreSQL locally and create a database.

### Option 2: Hosted Database (Recommended)
Use a free hosted PostgreSQL service:
- **Supabase**: https://supabase.com (Free tier includes PostgreSQL)
- **Neon**: https://neon.tech (Generous free tier)
- **Railway**: https://railway.app (Free tier available)

## Adding Products

### Method 1: Admin Panel (Recommended)
1. Navigate to `/admin`
2. Click "Manage Products"
3. Click "Add Product"
4. Fill in product details and image URLs
5. Click "Create Product"

### Method 2: Import from Etsy
Since direct scraping from Etsy is blocked, you'll need to manually copy your product information:
1. Visit your Etsy shop
2. Copy product names, descriptions, prices, and image URLs
3. Paste them into the admin panel

### Method 3: Using Prisma Studio
```bash
npm run prisma:studio
```
This opens a visual database editor where you can add products directly.

## Deployment to Vercel

1. **Push your code to GitHub**

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository
   - Add environment variables (same as .env.local)
   - Deploy!

3. **Set up database:**
   - Use a hosted PostgreSQL service (Supabase/Neon recommended)
   - Update DATABASE_URL in Vercel environment variables
   - Run migrations: `npm run prisma:migrate` locally with production DB URL

## Project Structure

```
glamify-crowns-shop/
├── app/
│   ├── admin/              # Admin dashboard
│   ├── api/                # API routes
│   ├── cart/               # Shopping cart page
│   ├── components/         # Reusable components
│   ├── products/           # Product listing & details
│   ├── store/              # State management
│   └── page.tsx            # Homepage
├── lib/                    # Utilities (Prisma client)
├── prisma/
│   └── schema.prisma       # Database schema
└── public/                 # Static assets
```

## Admin Panel

Access the admin dashboard at `/admin` to:
- Add/Edit/Delete products
- View orders
- Manage inventory
- Track sales

## Customization

### Colors
Edit `tailwind.config.ts` to change the color scheme:
```typescript
colors: {
  primary: '#d4af37',  // Gold
  secondary: '#000000', // Black
}
```

### Logo
Update the navbar in `app/components/Navbar.tsx`

### Content
Edit pages in the `app/` directory

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Secret key for authentication |
| `NEXTAUTH_URL` | Your site URL |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | Stripe public key |

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## Support

For issues or questions, create an issue in the repository.

## License

ISC License - Feel free to use this for your business!
