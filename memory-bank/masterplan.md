# Master Plan: Glamify Crowns Shop

> **Purpose**: Visual blueprint and single source of truth for the Glamify Crowns e-commerce platform. Use this document to verify memory bank accuracy and guide development decisions.

**Last Updated**: November 3, 2025  
**Current Phase**: MVP Complete - Production Deployed  
**Production URL**: https://glamify-crowns-shop-1mkaj2uhy-gummytrash2024-1555s-projects.vercel.app

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Database Schema](#database-schema)
3. [User Flows](#user-flows)
4. [Authentication System](#authentication-system)
5. [Component Architecture](#component-architecture)
6. [API Routes](#api-routes)
7. [Development Workflow](#development-workflow)
8. [MVP Scope & Boundaries](#mvp-scope--boundaries)
9. [Memory Bank Integration](#memory-bank-integration)
10. [Future Roadmap](#future-roadmap)

---

## System Architecture

### High-Level Architecture

```mermaid
graph TB
    subgraph "Client Browser"
        UI[Next.js UI]
        Cart[Zustand Cart Store]
        LocalStorage[LocalStorage]
    end
    
    subgraph "Next.js Server"
        Pages[Pages/Routes]
        API[API Routes]
        Auth[NextAuth.js]
        Middleware[Auth Middleware]
    end
    
    subgraph "Data Layer"
        Prisma[Prisma ORM]
        DB[(PostgreSQL Database)]
    end
    
    subgraph "External Services"
        Supabase[Supabase<br/>Database Host]
    end
    
    UI --> Pages
    UI --> API
    UI --> Cart
    Cart --> LocalStorage
    Pages --> Prisma
    API --> Prisma
    API --> Auth
    Middleware --> Auth
    Prisma --> DB
    DB --> Supabase
    
    style UI fill:#e1f5ff
    style Pages fill:#fff4e1
    style API fill:#ffe1e1
    style Auth fill:#e1ffe1
    style DB fill:#f0e1ff
    style Cart fill:#ffe1f5
```

### Technology Stack

```mermaid
graph LR
    subgraph "Frontend"
        A[Next.js 15]
        B[React 19]
        C[Tailwind CSS]
        D[TypeScript]
    end
    
    subgraph "State"
        E[Zustand]
        F[LocalStorage]
    end
    
    subgraph "Backend"
        G[Next.js API Routes]
        H[NextAuth.js 4.24.5]
        I[Prisma 5.22.0]
    end
    
    subgraph "Database"
        J[PostgreSQL]
        K[Supabase]
    end
    
    subgraph "DevOps"
        L[Vercel]
        M[Git/GitHub]
    end
    
    A --> B
    A --> C
    A --> D
    A --> E
    E --> F
    A --> G
    G --> H
    G --> I
    I --> J
    J --> K
    A --> L
    A --> M
```

### File Structure

```
glamify-crowns-shop/
├── app/                          # Next.js 15 App Router
│   ├── page.tsx                 # Homepage (/)
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   │
│   ├── products/                # Product pages
│   │   ├── page.tsx            # Catalog (/products)
│   │   └── [id]/               
│   │       └── page.tsx        # Detail (/products/[id])
│   │
│   ├── cart/                    # Shopping cart
│   │   └── page.tsx            # Cart page (/cart)
│   │
│   ├── admin/                   # Admin section
│   │   ├── page.tsx            # Dashboard (/admin)
│   │   ├── login/              
│   │   │   └── page.tsx        # Login (/admin/login)
│   │   └── products/           
│   │       ├── page.tsx        # Management (/admin/products)
│   │       └── new/            
│   │           └── page.tsx    # Create (/admin/products/new)
│   │
│   ├── api/                     # API Routes
│   │   ├── admin/              
│   │   │   ├── products/       
│   │   │   │   ├── route.ts    # GET/POST products
│   │   │   │   └── [id]/       
│   │   │   │       └── route.ts # GET/PUT/DELETE [id]
│   │   │   └── stats/          
│   │   │       └── route.ts    # Dashboard stats
│   │   └── auth/               
│   │       └── [...nextauth]/  # NextAuth.js
│   │
│   ├── components/              # Reusable components
│   │   ├── Navbar.tsx          
│   │   ├── Footer.tsx          
│   │   ├── ProductCard.tsx     
│   │   ├── AddToCartButton.tsx 
│   │   └── CrownIcon.tsx       
│   │
│   └── store/                   # State management
│       └── cartStore.ts         # Zustand cart store
│
├── lib/                         # Utilities
│   ├── prisma.ts               # Prisma client
│   └── auth.ts                 # Auth config
│
├── prisma/                      # Database
│   └── schema.prisma           # Schema definition
│
├── memory-bank/                 # Project documentation
│   ├── projectbrief.md         
│   ├── productContext.md       
│   ├── activeContext.md        
│   ├── systemPatterns.md       
│   ├── techContext.md          
│   ├── progress.md             
│   └── masterplan.md           # This file
│
├── scripts/                     # Admin scripts
│   ├── create-admin.ts         
│   └── reset-admin.ts          
│
├── types/                       # TypeScript types
│   └── next-auth.d.ts          
│
└── [config files]              # next.config.js, etc.
```

---

## Database Schema

### Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o{ Order : places
    Order ||--|{ OrderItem : contains
    Product ||--o{ OrderItem : "ordered in"
    
    User {
        string id PK
        string email UK
        string password
        string name
        boolean isAdmin
        datetime createdAt
        datetime updatedAt
    }
    
    Product {
        string id PK
        string name
        string description
        float price
        string[] images
        string category
        int stock
        boolean featured
        datetime createdAt
        datetime updatedAt
    }
    
    Order {
        string id PK
        string userId FK
        float total
        string status
        string shippingAddress
        string stripePaymentId
        datetime createdAt
        datetime updatedAt
    }
    
    OrderItem {
        string id PK
        string orderId FK
        string productId FK
        int quantity
        float price
        datetime createdAt
    }
```

### Database Models Detail

#### **User Model** (✅ Fully Implemented)
- **Purpose**: Admin authentication
- **Status**: Active in production
- **Fields**:
  - `id`: Unique identifier (CUID)
  - `email`: Login credential (unique)
  - `password`: Bcrypt hashed (10 salt rounds)
  - `name`: Display name (optional)
  - `isAdmin`: Admin flag (required: true)
  - `orders`: Relation to future orders
  - `createdAt`, `updatedAt`: Timestamps

#### **Product Model** (✅ Fully Implemented)
- **Purpose**: Product catalog
- **Status**: Active in production
- **Fields**:
  - `id`: Unique identifier (CUID)
  - `name`: Product name
  - `description`: Product description
  - `price`: Price as Float
  - `images`: Array of base64 strings (PostgreSQL native)
  - `category`: Product category
  - `stock`: Inventory count
  - `featured`: Featured product flag
  - `orderItems`: Relation to future order items
  - `createdAt`, `updatedAt`: Timestamps

#### **Order Model** (📋 Structure Ready - Not Used)
- **Purpose**: Customer orders (future)
- **Status**: Schema defined, not yet implemented
- **Fields**:
  - `id`: Unique identifier (CUID)
  - `userId`: Customer reference
  - `items`: Order items relation
  - `total`: Order total
  - `status`: Order status (pending/processing/shipped/delivered)
  - `shippingAddress`: JSON string
  - `stripePaymentId`: Payment reference (optional)
  - `createdAt`, `updatedAt`: Timestamps

#### **OrderItem Model** (📋 Structure Ready - Not Used)
- **Purpose**: Line items in orders (future)
- **Status**: Schema defined, not yet implemented
- **Fields**:
  - `id`: Unique identifier (CUID)
  - `orderId`: Order reference
  - `productId`: Product reference
  - `quantity`: Item quantity
  - `price`: Price at time of purchase
  - `createdAt`: Timestamp

### Database Technology

**PostgreSQL via Supabase**
- **Host**: AWS us-east-1
- **Features Used**:
  - Native array support (`String[]`)
  - ACID transactions
  - Connection pooling
  - Automatic backups
  - Point-in-time recovery
- **Advantages**:
  - Production-grade reliability
  - No workarounds needed for arrays
  - Excellent concurrent access
  - Easy to scale

---

## User Flows

### Customer Journey (Current MVP)

```mermaid
flowchart TD
    Start([Customer Visits Site]) --> Home[View Homepage]
    Home --> Browse[Browse Products]
    Browse --> Filter{Search/Filter<br/>Products?}
    Filter -->|Yes| Search[Filter by Category]
    Filter -->|No| ViewList[View Product List]
    Search --> ViewList
    
    ViewList --> SelectProduct[Click Product Card]
    SelectProduct --> ProductDetail[View Product Detail]
    
    ProductDetail --> CheckStock{Product<br/>In Stock?}
    CheckStock -->|No| OutOfStock[See Out of Stock]
    CheckStock -->|Yes| AddCart[Add to Cart]
    
    AddCart --> Toast[See Success Toast]
    Toast --> ContinueShopping{Continue<br/>Shopping?}
    ContinueShopping -->|Yes| Browse
    ContinueShopping -->|No| ViewCart[Go to Cart]
    
    OutOfStock --> ContinueShopping
    
    ViewCart --> ReviewCart[Review Cart Items]
    ReviewCart --> UpdateCart{Update<br/>Cart?}
    UpdateCart -->|Change Quantity| UpdateQty[Update Quantities]
    UpdateCart -->|Remove Item| RemoveItem[Remove Items]
    UpdateCart -->|Done| CheckoutFuture[Checkout<br/>Not Yet Implemented]
    
    UpdateQty --> ReviewCart
    RemoveItem --> ReviewCart
    
    CheckoutFuture -.->|Future| Payment[Payment Processing]
    
    style Start fill:#e1f5ff
    style Home fill:#e1f5ff
    style Browse fill:#e1f5ff
    style ViewCart fill:#ffe1e1
    style AddCart fill:#e1ffe1
    style CheckoutFuture fill:#ffffe1,stroke-dasharray: 5 5
    style Payment fill:#ffffe1,stroke-dasharray: 5 5
```

### Admin Workflow

```mermaid
flowchart TD
    AdminStart([Admin User]) --> Login[Navigate to /admin/login]
    Login --> EnterCreds[Enter Email & Password]
    EnterCreds --> Submit[Submit Form]
    
    Submit --> Verify{Valid<br/>Credentials?}
    Verify -->|No| LoginError[Show Error Message]
    LoginError --> EnterCreds
    
    Verify -->|Yes| CheckAdmin{isAdmin<br/>= true?}
    CheckAdmin -->|No| Unauthorized[Access Denied]
    CheckAdmin -->|Yes| CreateSession[Create JWT Session]
    
    CreateSession --> Dashboard[Admin Dashboard]
    
    Dashboard --> ViewStats[View Statistics]
    Dashboard --> ManageProducts[Manage Products]
    
    ManageProducts --> ProductList[View Product List]
    
    ProductList --> Action{Choose<br/>Action}
    Action -->|Create| NewProduct[Create New Product]
    Action -->|Edit| EditProduct[Edit Product]
    Action -->|Delete| DeleteProduct[Delete Product]
    
    NewProduct --> ProductForm[Fill Product Form]
    ProductForm --> UploadImages[Upload Images<br/>from Computer]
    UploadImages --> Preview[Preview Images]
    Preview --> SaveProduct[Save Product]
    SaveProduct --> Success[Success Toast]
    Success --> ProductList
    
    EditProduct --> LoadProduct[Load Product Data]
    LoadProduct --> ProductForm
    
    DeleteProduct --> ConfirmDelete{Confirm<br/>Delete?}
    ConfirmDelete -->|Yes| RemoveProduct[Remove from DB]
    ConfirmDelete -->|No| ProductList
    RemoveProduct --> Success
    
    Dashboard --> Logout[Logout<br/>Not Yet Implemented]
    Logout -.->|Future| Login
    
    style AdminStart fill:#ffe1e1
    style Dashboard fill:#e1ffe1
    style CreateSession fill:#e1f5ff
    style Success fill:#e1ffe1
    style Logout fill:#ffffe1,stroke-dasharray: 5 5
```

---

## Authentication System

### NextAuth.js Flow

```mermaid
sequenceDiagram
    participant Browser
    participant LoginPage
    participant NextAuth
    participant Database
    participant JWT
    
    Browser->>LoginPage: Navigate to /admin/login
    LoginPage->>Browser: Display login form
    
    Browser->>NextAuth: POST credentials (email, password)
    NextAuth->>Database: Find user by email
    
    alt User Not Found
        Database-->>NextAuth: null
        NextAuth-->>Browser: Error: Invalid credentials
    else User Found
        Database-->>NextAuth: User object
        NextAuth->>NextAuth: Check user.isAdmin === true
        
        alt Not Admin
            NextAuth-->>Browser: Error: Unauthorized
        else Is Admin
            NextAuth->>NextAuth: bcrypt.compare(password, user.password)
            
            alt Invalid Password
                NextAuth-->>Browser: Error: Invalid credentials
            else Valid Password
                NextAuth->>JWT: Create JWT token
                JWT-->>NextAuth: Signed token
                NextAuth->>Browser: Set session cookie
                NextAuth-->>Browser: Success + session data
                Browser->>Browser: Redirect to /admin
            end
        end
    end
```

### Authentication Components

```mermaid
graph TB
    subgraph "Authentication Layer"
        A[NextAuth.js API Route]
        B[Credentials Provider]
        C[JWT Strategy]
        D[Session Callbacks]
    end
    
    subgraph "Security"
        E[Bcrypt Hashing]
        F[10 Salt Rounds]
        G[Secure Cookies]
        H[CSRF Protection]
    end
    
    subgraph "Middleware"
        I[Auth Middleware]
        J[Route Protection]
        K[Session Validation]
    end
    
    subgraph "Admin Tools"
        L[create-admin script]
        M[reset-admin script]
    end
    
    A --> B
    B --> C
    C --> D
    B --> E
    E --> F
    D --> G
    A --> H
    
    A --> I
    I --> J
    I --> K
    
    E --> L
    E --> M
    
    style A fill:#e1ffe1
    style I fill:#ffe1e1
    style E fill:#e1f5ff
```

### Admin User Management

**Creating Admin Users**:
```bash
npm run create-admin
# Prompts for: email, password, name
# Hashes password with bcrypt (10 rounds)
# Creates user with isAdmin: true
```

**Resetting Admin Passwords**:
```bash
npm run reset-admin
# Prompts for: email, new password
# Hashes new password with bcrypt
# Updates user password in database
```

**Current Status**:
- ✅ Login flow functional
- ✅ JWT session management
- ✅ Password hashing (bcrypt)
- ✅ Admin flag validation
- ⚠️ Middleware configured but disabled for dev
- 📋 Logout UI not yet implemented
- 📋 Session checks needed in admin pages

---

## Component Architecture

### Component Hierarchy

```mermaid
graph TB
    subgraph "Root Layout"
        A[app/layout.tsx]
        A --> B[Navbar]
        A --> C[Page Content]
        A --> D[Footer]
    end
    
    subgraph "Homepage"
        E[app/page.tsx<br/>Server Component]
        E --> F[Hero Section]
        E --> G[Features Grid]
        E --> H[CTA Buttons]
    end
    
    subgraph "Products"
        I[app/products/page.tsx<br/>Server Component]
        I --> J[ProductCard<br/>Server Component]
        J --> K[Product Image]
        J --> L[Product Info]
        J --> M[Link to Detail]
        
        N[app/products/[id]/page.tsx<br/>Server Component]
        N --> O[Image Gallery]
        N --> P[Product Details]
        N --> Q[AddToCartButton<br/>Client Component]
    end
    
    subgraph "Cart"
        R[app/cart/page.tsx<br/>Server Component]
        R --> S[Cart Items List]
        R --> T[Update Quantity Buttons]
        R --> U[Remove Item Buttons]
        R --> V[Total Calculation]
    end
    
    subgraph "Admin"
        W[app/admin/page.tsx<br/>Server Component]
        W --> X[Stats Cards]
        W --> Y[Quick Links]
        
        Z[app/admin/login/page.tsx<br/>Client Component]
        Z --> AA[Login Form]
        
        AB[app/admin/products/new/page.tsx<br/>Client Component]
        AB --> AC[Product Form]
        AB --> AD[Image Upload]
        AB --> AE[Image Preview]
    end
    
    subgraph "State Management"
        AF[cartStore.ts<br/>Zustand]
        AF --> AG[addItem]
        AF --> AH[removeItem]
        AF --> AI[updateQuantity]
        AF --> AJ[clearCart]
    end
    
    Q --> AF
    T --> AF
    U --> AF
    
    style A fill:#e1f5ff
    style E fill:#fff4e1
    style I fill:#fff4e1
    style N fill:#fff4e1
    style R fill:#ffe1e1
    style W fill:#ffe1e1
    style Z fill:#e1ffe1
    style AB fill:#e1ffe1
    style AF fill:#f0e1ff
```

### Server vs Client Components

```mermaid
graph LR
    subgraph "Server Components"
        A[Pages for SEO]
        B[Data Fetching]
        C[Static Content]
        D[Layout Components]
    end
    
    subgraph "Client Components"
        E[Interactive Forms]
        F[State Management]
        G[Event Handlers]
        H[Browser APIs]
    end
    
    subgraph "Pattern"
        I[Default: Server]
        J['use client' directive]
    end
    
    A --> I
    B --> I
    C --> I
    D --> I
    
    E --> J
    F --> J
    G --> J
    H --> J
    
    style A fill:#fff4e1
    style E fill:#e1ffe1
    style I fill:#e1f5ff
```

**Server Components** (Default):
- All page.tsx files (except admin/login, admin/products/new)
- Navbar, Footer, ProductCard
- Layout components

**Client Components** ('use client'):
- AddToCartButton
- Cart page interactions
- Admin login form
- Admin product creation form
- Any component using:
  - useState, useEffect
  - Event handlers (onClick, onChange)
  - Browser APIs
  - Zustand store

---

## API Routes

### API Endpoint Map

```mermaid
graph TB
    subgraph "Admin Products API"
        A["/api/admin/products"]
        A -->|GET| B[List All Products]
        A -->|POST| C[Create Product]
        
        D["/api/admin/products/[id]"]
        D -->|GET| E[Get Single Product]
        D -->|PUT| F[Update Product]
        D -->|DELETE| G[Delete Product]
    end
    
    subgraph "Admin Stats API"
        H["/api/admin/stats"]
        H -->|GET| I[Dashboard Statistics]
    end
    
    subgraph "Authentication API"
        J["/api/auth/[...nextauth]"]
        J --> K[NextAuth.js Handlers]
        K --> L[POST: signIn]
        K --> M[POST: signOut]
        K --> N[GET: session]
        K --> O[GET: providers]
    end
    
    style A fill:#e1f5ff
    style D fill:#e1f5ff
    style H fill:#ffe1e1
    style J fill:#e1ffe1
```

### API Routes Detail

#### **GET /api/admin/products**
- **Purpose**: List all products
- **Response**: Array of product objects
- **Auth**: None (should be protected in production)
- **Data**: Includes images as String[] (PostgreSQL native)

#### **POST /api/admin/products**
- **Purpose**: Create new product
- **Body**: Product data with images
- **Images**: Base64 strings in array
- **Response**: Created product object
- **Validation**: Required fields checked

#### **GET /api/admin/products/[id]**
- **Purpose**: Get single product by ID
- **Params**: Product ID
- **Response**: Product object or 404
- **Usage**: Product detail pages

#### **PUT /api/admin/products/[id]**
- **Purpose**: Update existing product
- **Params**: Product ID
- **Body**: Updated product data
- **Response**: Updated product object

#### **DELETE /api/admin/products/[id]**
- **Purpose**: Delete product
- **Params**: Product ID
- **Response**: Success message
- **Cascade**: Deletes related data

#### **GET /api/admin/stats**
- **Purpose**: Dashboard statistics
- **Response**: 
  - Total products
  - Total revenue
  - Total orders
  - Customer count
- **Note**: Currently returns mock data for orders/customers

### API Response Pattern

All API routes follow this pattern:

```typescript
// Success Response
{
  data: Product | Product[] | Stats,
  success: true
}

// Error Response
{
  error: "Error message",
  success: false
}
```

---

## Development Workflow

### Setup Process

```mermaid
flowchart TD
    Start([New Developer]) --> Clone[Clone Repository]
    Clone --> Install[npm install]
    Install --> Env[Create .env file]
    
    Env --> SetupDB[Setup Database]
    SetupDB --> Generate[npx prisma generate]
    Generate --> Push[npx prisma db push]
    
    Push --> CreateAdmin[npm run create-admin]
    CreateAdmin --> EnterDetails[Enter Email, Password, Name]
    EnterDetails --> AdminCreated[Admin User Created]
    
    AdminCreated --> Dev[npm run dev]
    Dev --> Open[Open localhost:3000]
    
    Open --> Ready[Development Ready]
    
    style Start fill:#e1f5ff
    style Ready fill:#e1ffe1
```

### Common Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Production build
npm start                # Start production server

# Database
npx prisma generate      # Generate Prisma Client
npx prisma db push       # Push schema to database
npx prisma studio        # Open database GUI

# Admin Management
npm run create-admin     # Create new admin user
npm run reset-admin      # Reset admin password

# Code Quality
npm run lint             # Run ESLint
```

### Environment Variables

Required in `.env`:
```bash
# Database
DATABASE_URL="postgres://user:pass@host:5432/db?sslmode=require"

# Authentication
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Database Workflow

```mermaid
flowchart LR
    A[Edit schema.prisma] --> B[npx prisma db push]
    B --> C[npx prisma generate]
    C --> D[Restart Dev Server]
    D --> E[Changes Applied]
    
    style A fill:#ffe1e1
    style E fill:#e1ffe1
```

---

## MVP Scope & Boundaries

### ✅ What's Built (Current MVP)

```mermaid
mindmap
  root((Glamify Crowns<br/>MVP))
    Customer Features
      Homepage
        Hero Section
        Features Grid
        CTA Buttons
      Product Catalog
        Grid Display
        Product Cards
        Category Labels
      Product Details
        Image Gallery
        Full Information
        Stock Status
        Add to Cart
      Shopping Cart
        View Items
        Update Quantities
        Remove Items
        Calculate Total
        LocalStorage Persist
    Admin Features
      Authentication
        Login Page
        NextAuth.js
        Bcrypt Hashing
        JWT Sessions
        Admin Scripts
      Dashboard
        Statistics
        Quick Links
      Product Management
        List Products
        Create Products
        Edit Products
        Delete Products
        Image Upload
          File Selection
          Base64 Encoding
          Multiple Images
          Image Preview
    Technical
      Database
        PostgreSQL
        Prisma ORM
        Native Arrays
        Supabase Hosted
      Frontend
        Next.js 15
        React 19
        Tailwind CSS
        TypeScript
      State
        Zustand Cart
        LocalStorage
```

### ❌ What's NOT Built (Intentionally Excluded)

**Critical Missing** (Required for Production):
- ❌ Payment processing (Stripe integration)
- ❌ Order management system
- ❌ Customer accounts (non-admin users)
- ❌ Checkout flow
- ❌ Email notifications
- ❌ Tax calculation
- ❌ Shipping integration

**Nice-to-Have Missing** (Future Enhancement):
- ❌ Product search
- ❌ Advanced filtering
- ❌ Product variants (sizes, colors)
- ❌ Coupon/discount system
- ❌ Customer reviews
- ❌ Wishlist
- ❌ Related products
- ❌ Recently viewed

**Infrastructure Missing**:
- ❌ CDN for images
- ❌ Email service
- ❌ Error monitoring
- ❌ Analytics
- ❌ Rate limiting
- ❌ CAPTCHA

### Decision Log

**Why PostgreSQL over SQLite?**
- ✅ Production-grade reliability
- ✅ Native array/JSON support
- ✅ Better concurrent access
- ✅ Easy to scale
- ❌ Requires network connection

**Why Base64 Images in Database?**
- ✅ Self-contained, no external dependencies
- ✅ Simple implementation
- ✅ No CDN costs
- ❌ ~33% larger than binary
- ❌ Increases database size

**Why Client-Side Cart (LocalStorage)?**
- ✅ Fast, instant feedback
- ✅ No server requests
- ✅ Simple implementation
- ❌ Not synced across devices
- ❌ Lost if browser data cleared

**Why NextAuth.js?**
- ✅ Industry standard
- ✅ Flexible providers
- ✅ Built-in CSRF protection
- ✅ JWT strategy efficient
- ✅ Easy to extend

---

## Memory Bank Integration

### How to Use This Master Plan

**When Starting a Session**:
1. Read this master plan first
2. Then read all 6 memory bank files
3. Cross-reference for consistency
4. Proceed with task

**When Updating Memory Bank**:
1. Make code changes
2. Update relevant memory bank file(s)
3. Check this master plan for accuracy
4. Update master plan if architecture changed
5. Commit both changes together

**Memory Bank Files & Their Relationship to Master Plan**:

```mermaid
graph TB
    A[masterplan.md<br/>Visual Blueprint]
    
    A -.verifies.-> B[projectbrief.md<br/>What & Why]
    A -.verifies.-> C[productContext.md<br/>User Experience]
    A -.verifies.-> D[activeContext.md<br/>Current State]
    A -.verifies.-> E[systemPatterns.md<br/>How It Works]
    A -.verifies.-> F[techContext.md<br/>Technologies]
    A -.verifies.-> G[progress.md<br/>What's Done]
    
    B --> H{Consistent?}
    C --> H
    D --> H
    E --> H
    F --> H
    G --> H
    
    H -->|Yes| I[Memory Bank Accurate]
    H -->|No| J[Update Files]
    
    style A fill:#e1f5ff
    style I fill:#e1ffe1
    style J fill:#ffe1e1
```

### Consistency Checklist

Before updating memory bank, verify:

- [ ] System architecture matches diagrams
- [ ] Database schema matches ERD
- [ ] Component list is complete
- [ ] API routes are documented
- [ ] Technology stack is current
- [ ] MVP scope is accurate
- [ ] All features listed are implemented
- [ ] Decision log reflects reality

### When to Update Master Plan

Update this master plan when:
- ✅ Adding new features/components
- ✅ Changing database schema
- ✅ Modifying system architecture
- ✅ Adding/removing dependencies
- ✅ Changing development workflow
- ✅ Making architectural decisions
- ✅ Deploying to production
- ✅ Major refactoring

Do NOT update for:
- ❌ Minor bug fixes
- ❌ Small UI tweaks
- ❌ Copy/content changes
- ❌ Styling adjustments

---

## GitHub Issue Tracking

### Issue Management System

**Created**: November 3, 2025  
**Total Issues**: 22 (tracking all incomplete features)  
**Repository**: https://github.com/GummyPirate2026/glamify-crowns-shop

### Issue Tracking Workflow

```mermaid
flowchart TD
    Start([Start Development]) --> ReadMaster[Read Master Plan]
    ReadMaster --> CheckIssues[Check GitHub Issues]
    CheckIssues --> SelectIssue[Select Issue to Work On]
    
    SelectIssue --> Develop[Implement Feature]
    Develop --> Test[Test Implementation]
    Test --> Verify{Meets Acceptance<br/>Criteria?}
    
    Verify -->|No| Develop
    Verify -->|Yes| UpdateMemory[Update Memory Bank Files]
    
    UpdateMemory --> CheckMaster{Master Plan<br/>Needs Update?}
    CheckMaster -->|Yes| UpdateMaster[Update Master Plan]
    CheckMaster -->|No| CommitCode[Commit Code Changes]
    UpdateMaster --> CommitCode
    
    CommitCode --> CloseIssue[Close GitHub Issue]
    CloseIssue --> LinkCommit[Reference Commit in Issue]
    LinkCommit --> UpdateProgress[Update progress.md]
    
    UpdateProgress --> More{More Issues<br/>to Address?}
    More -->|Yes| CheckIssues
    More -->|No| Done([Development Complete])
    
    style Start fill:#e1f5ff
    style CloseIssue fill:#e1ffe1
    style Done fill:#e1ffe1
    style UpdateMemory fill:#ffe1e1
```

### Systematic Issue Closure Process

**Step-by-Step Workflow:**

1. **Before Starting Work**
   ```bash
   # View all open issues
   gh issue list
   
   # View issues by milestone
   gh issue list --milestone "Phase 2: E-commerce Essentials"
   
   # View issues by label
   gh issue list --label "priority: critical"
   ```

2. **During Development**
   - Reference issue number in commit messages: `git commit -m "feat: implement checkout flow (#5)"`
   - Check acceptance criteria in issue description
   - Update progress as you complete sub-tasks

3. **After Implementation**
   - Verify all acceptance criteria met
   - Update memory bank files (activeContext.md, progress.md)
   - Update master plan if architecture changed
   - Run tests if applicable

4. **Closing Issues**
   ```bash
   # Close issue with message
   gh issue close 5 --comment "Implemented checkout flow with all acceptance criteria met. See commit abc123."
   
   # Or close via commit message
   git commit -m "feat: implement checkout flow

   Closes #5
   
   - Added multi-step checkout page
   - Shipping address form with validation
   - Payment method selection
   - Order review step
   - Mobile responsive design"
   ```

5. **Cross-Reference Check**
   - Confirm feature is marked complete in `progress.md`
   - Confirm feature is removed from "Not Yet Implemented" in `progress.md`
   - Update roadmap checklist in master plan if applicable

### Issue-to-Feature Mapping

#### **Phase 2: E-commerce Essentials** (Milestone 1)

| Issue # | Feature | Priority | Memory Bank Impact |
|---------|---------|----------|-------------------|
| [#2](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/2) | Enable authentication middleware | Critical | Update activeContext.md, systemPatterns.md |
| [#3](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/3) | Add logout functionality | High | Update activeContext.md, progress.md |
| [#4](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/4) | Add session validation | High | Update systemPatterns.md |
| [#5](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/5) | Implement checkout flow | Critical | Update progress.md, master plan |
| [#6](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/6) | Integrate Stripe payments | Critical | Update techContext.md, progress.md |
| [#7](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/7) | Build order management | Critical | Update master plan, progress.md |

#### **Phase 3: Enhanced Features** (Milestone 2)

| Issue # | Feature | Priority | Memory Bank Impact |
|---------|---------|----------|-------------------|
| [#8](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/8) | Product search | High | Update progress.md |
| [#9](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/9) | Category filtering & sorting | High | Update progress.md |
| [#10](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/10) | Product variants system | Medium | Update master plan, schema diagram |
| [#11](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/11) | Review & rating system | Medium | Update master plan, schema diagram |
| [#12](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/12) | Wishlist feature | Low | Update progress.md |
| [#13](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/13) | Related products | Low | Update progress.md |
| [#14](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/14) | Recently viewed tracking | Low | Update progress.md |

#### **Phase 4: Business Tools** (Milestone 3)

| Issue # | Feature | Priority | Memory Bank Impact |
|---------|---------|----------|-------------------|
| [#15](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/15) | Discount/coupon system | Medium | Update master plan, schema diagram |
| [#16](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/16) | Inventory alerts | Medium | Update systemPatterns.md |
| [#17](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/17) | Sales analytics dashboard | Medium | Update progress.md |
| [#18](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/18) | Customer insights | Low | Update progress.md |

#### **Phase 5: Scale & Optimize** (Milestone 4)

| Issue # | Feature | Priority | Memory Bank Impact |
|---------|---------|----------|-------------------|
| [#19](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/19) | CDN for images | Medium | Update techContext.md, master plan |
| [#20](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/20) | Caching strategy | Medium | Update systemPatterns.md |
| [#21](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/21) | Performance optimization | Medium | Update techContext.md |
| [#22](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/22) | SEO improvements | Medium | Update techContext.md |
| [#23](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/23) | Multi-channel integration | Low | Update master plan |

### Automated Issue Closure

**Using Commit Messages:**
```bash
# These keywords automatically close issues when merged to main
git commit -m "fix: enable auth middleware

Closes #2
Fixes #2  
Resolves #2

All automatically close the issue"
```

**Using Pull Requests:**
```markdown
## Description
Enable authentication middleware for production

## Related Issue
Closes #2

## Changes
- Uncommented middleware protection
- Tested admin route protection
- Verified redirect behavior
```

### Progress Tracking Commands

```bash
# View all open issues
gh issue list

# View closed issues
gh issue list --state closed

# View issues by milestone
gh issue list --milestone "Phase 2: E-commerce Essentials"

# View issues by label
gh issue list --label "priority: critical"

# View your progress
gh issue list --assignee @me

# Check milestone progress
gh api repos/GummyPirate2026/glamify-crowns-shop/milestones
```

### Integration with Memory Bank Updates

**When Closing an Issue, Update These Files:**

1. **activeContext.md**
   - Remove from "Next Possible Steps" if listed
   - Add to "Recent Changes & Fixes" section
   - Update "What's Currently Working" if major feature

2. **progress.md**
   - Check checkbox in "Completed Features"
   - Remove from "Not Yet Implemented"
   - Add to "Recent Developments"
   - Update "Project Health" if milestone achieved

3. **systemPatterns.md** (if architecture changed)
   - Update architecture diagrams
   - Document new patterns
   - Update code examples

4. **techContext.md** (if tech stack changed)
   - Add new dependencies
   - Update setup instructions
   - Document new integrations

5. **master plan** (this file - if major change)
   - Update relevant diagrams
   - Update scope section
   - Update roadmap checkboxes

### Master Plan Update Triggers

Update this master plan when closing issues that involve:

✅ **Schema Changes** → Update Database ERD
- Issues: #10, #11, #15

✅ **New Pages/Routes** → Update File Structure
- Issues: #5, #7, #8, #17

✅ **New API Endpoints** → Update API Routes Map
- Issues: #5, #6, #7, #15, #17

✅ **Architecture Changes** → Update System Architecture
- Issues: #19, #20

✅ **Major Features** → Update MVP Scope Mind Map
- Issues: #5, #6, #7

### Quick Reference: Issue Status Check

```bash
# Before starting work session
gh issue list --milestone "Phase 2: E-commerce Essentials" --state open

# After completing feature
gh issue close <number> --comment "Feature complete. Updated memory bank."

# Verify closure
gh issue view <number>

# Check overall progress
gh issue list --state all | head -20
```

---

## Future Roadmap

### Phase 1: Complete MVP ✅
- [x] Product catalog
- [x] Shopping cart
- [x] Admin dashboard
- [x] Admin authentication
- [x] Image upload
- [x] Basic inventory

### Phase 2: E-commerce Essentials → [6 Open Issues](https://github.com/GummyPirate2026/glamify-crowns-shop/milestone/1)
- [ ] Enable authentication middleware ([#2](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/2))
- [ ] Add logout functionality ([#3](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/3))
- [ ] Add session validation ([#4](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/4))
- [ ] Implement checkout flow ([#5](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/5))
- [ ] Integrate Stripe payments ([#6](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/6))
- [ ] Build order management ([#7](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/7))

### Phase 3: Enhanced Features → [7 Open Issues](https://github.com/GummyPirate2026/glamify-crowns-shop/milestone/2)
- [ ] Product search ([#8](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/8))
- [ ] Category filtering & sorting ([#9](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/9))
- [ ] Product variants ([#10](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/10))
- [ ] Reviews & ratings ([#11](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/11))
- [ ] Wishlist ([#12](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/12))
- [ ] Related products ([#13](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/13))
- [ ] Recently viewed ([#14](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/14))

### Phase 4: Business Tools → [4 Open Issues](https://github.com/GummyPirate2026/glamify-crowns-shop/milestone/3)
- [ ] Discount/coupon system ([#15](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/15))
- [ ] Inventory alerts ([#16](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/16))
- [ ] Sales analytics ([#17](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/17))
- [ ] Customer insights ([#18](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/18))

### Phase 5: Scale & Optimize → [5 Open Issues](https://github.com/GummyPirate2026/glamify-crowns-shop/milestone/4)
- [ ] CDN for images ([#19](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/19))
- [ ] Caching strategy ([#20](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/20))
- [ ] Performance optimization ([#21](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/21))
- [ ] SEO improvements ([#22](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/22))
- [ ] Multi-channel integration ([#23](https://github.com/GummyPirate2026/glamify-crowns-shop/issues/23))
