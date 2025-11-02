# Technical Context: Glamify Crowns Shop

## Technology Stack

### Core Framework
- **Next.js 15.5.6**
  - App Router (not Pages Router)
  - React Server Components by default
  - API Routes for backend functionality
  - Built-in Image optimization

### Database & ORM
- **SQLite** (`dev.db` file)
  - Lightweight, file-based database
  - No separate server required
  - Perfect for self-hosting
- **Prisma 5.22.0**
  - Type-safe database client
  - Migration management
  - Schema-first development

### State Management
- **Zustand** with persistence middleware
  - Shopping cart state
  - LocalStorage integration
  - Minimal boilerplate

### Styling
- **Tailwind CSS 3.x**
  - Utility-first CSS
  - Custom configuration for brand colors
  - Responsive design utilities

### UI Components & Utilities
- **lucide-react**: Icon library
- **react-hot-toast**: Toast notifications
- **Next.js Image**: Optimized image loading

### Development Tools
- **TypeScript**: Type safety
- **ESLint**: Code linting
- **PostCSS**: CSS processing

## Development Setup

### Prerequisites
```bash
- Node.js 18+ 
- npm or yarn
- Git (for version control)
```

### Installation
```bash
cd glamify-crowns-shop
npm install
```

### Environment Variables
File: `.env.local`
```bash
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:3000"
STRIPE_SECRET_KEY="your-stripe-secret-key"
NEXT_PUBLIC_STRIPE_PUBLIC_KEY="your-stripe-public-key"
```

**Note**: Only `DATABASE_URL` is currently used. Others are placeholders for future features.

### Database Setup
```bash
# Generate Prisma Client
npx prisma generate

# Create/update database
npx prisma db push

# Optional: View database in GUI
npx prisma studio
```

### Admin User Setup
```bash
# Create first admin user (interactive prompts)
npm run create-admin

# Reset admin password (interactive prompts)
npm run reset-admin
```

**Note**: These scripts use bcrypt to hash passwords with 10 salt rounds.

### Running Development Server
```bash
npm run dev
```
Server runs at: `http://localhost:3000` (or 3001 if 3000 is occupied)

## Key Dependencies

### Production Dependencies
```json
{
  "@prisma/client": "^5.22.0",
  "bcryptjs": "^2.4.3",
  "lucide-react": "latest",
  "next": "15.5.6",
  "next-auth": "^4.24.5",
  "react": "latest",
  "react-dom": "latest",
  "react-hot-toast": "^2.4.1",
  "zustand": "^4.4.7"
}
```

### Development Dependencies
```json
{
  "@types/bcryptjs": "^2.4.6",
  "@types/node": "latest",
  "@types/react": "latest",
  "prisma": "^5.22.0",
  "tailwindcss": "^3.4.1",
  "typescript": "latest"
}
```

## Technical Constraints

### 1. SQLite Limitations
- **No Native Arrays**: Use `|||`-separated strings
- **No Native JSON**: Use string serialization
- **Single Writer**: Not suitable for high-concurrency writes
- **String Size**: Practical limit ~1GB per field (base64 images)

### 2. Next.js Body Size Limit
- **Default**: 1MB request body
- **Configured**: 10MB for image uploads
- **Recommendation**: Keep images under 5MB

### 3. Base64 Image Storage
- **Pro**: Self-contained, no external dependencies
- **Con**: ~33% larger than binary
- **Limit**: Affects payload size and database size

### 4. Client-Side State
- **Cart persists** in LocalStorage
- **Cleared** if user clears browser data
- **Not synced** across devices (future: server-side sessions)

## File Structure Conventions

### Naming Conventions
- **Components**: PascalCase (`ProductCard.tsx`)
- **Utilities**: camelCase (`prisma.ts`)
- **Routes**: lowercase with hyphens (`/products/[id]`)
- **API Routes**: `route.ts` (Next.js convention)

### Import Aliases
```typescript
import { prisma } from '@/lib/prisma'          // @/ = project root
import Component from '@/app/components/...'
```

## Database Management

### Schema Location
`prisma/schema.prisma`

### Making Schema Changes
```bash
# 1. Edit schema.prisma
# 2. Push changes to database
npx prisma db push

# 3. Regenerate client
npx prisma generate
```

### Viewing Data
```bash
npx prisma studio
```
Opens GUI at `http://localhost:5555`

## Build & Deployment

### Production Build
```bash
npm run build
```

### Starting Production Server
```bash
npm start
```

### Deployment Considerations
1. **Database**: Include `dev.db` or regenerate on server
2. **Environment**: Set production environment variables
3. **Images**: Consider migration to external storage for scale
4. **Static Assets**: Automatically optimized by Next.js

### Recommended Hosting
- **Vercel**: Native Next.js support, zero config
- **Netlify**: Good for static sites
- **Railway**: Easy database hosting
- **DigitalOcean**: Full control, manual setup

## Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm start            # Start production server

# Database
npx prisma generate  # Generate Prisma Client
npx prisma db push   # Update database schema
npx prisma studio    # Open database GUI

# Admin Management
npm run create-admin # Create new admin user
npm run reset-admin  # Reset admin password

# Code Quality
npm run lint         # Run ESLint
```

## Troubleshooting

### Database Connection Errors
```
Error: Invalid DATABASE_URL
```
**Solution**: Verify `.env.local` has `DATABASE_URL="file:./dev.db"`

### Port Already in Use
```
Port 3000 is in use
```
**Solution**: Next.js automatically tries 3001, 3002, etc.

### Prisma Client Not Generated
```
Cannot find module '@prisma/client'
```
**Solution**: Run `npx prisma generate`

### Image Upload Fails (500 Error)
```
Request body too large
```
**Solution**: Verify `next.config.js` has `bodySizeLimit: '10mb'`

### Server Component Error
```
Event handlers cannot be passed to Client Component props
```
**Solution**: Extract interactive elements to separate Client Component with `'use client'` directive

### NextAuth Session Error
```
[next-auth][error][JWT_SESSION_ERROR]
```
**Solution**: Verify `NEXTAUTH_SECRET` is set in `.env` file

### Admin User Not Found
```
No user found with this email
```
**Solution**: Run `npm run create-admin` to create an admin user first

### Password Hash Comparison Fails
```
bcrypt compare returns false
```
**Solution**: Ensure password was hashed with bcrypt.hash() when created, not stored as plain text

## Performance Optimization

### Already Implemented
1. Server Components for most pages
2. Image optimization via Next.js Image
3. Static generation where possible
4. Minimal client-side JavaScript
5. Cart state persisted locally

### Future Optimizations
1. Implement ISR (Incremental Static Regeneration)
2. Add caching headers
3. Lazy load images below fold
4. Implement virtual scrolling for large lists
5. Consider CDN for image delivery
