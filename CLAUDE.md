# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Zafta is a **production-ready Next.js 16 (App Router)** e-commerce platform for a boutique bakery specializing in artisanal cakes with a 30-year family legacy. The project is **85% complete** and features a full e-commerce system with admin panel, authentication, payment processing, and modern stack. Design focuses on warm, feminine branding with rose gold and burgundy aesthetics.

## Commands

### Development
```bash
bun dev              # Start development server on http://localhost:3000
bun run build        # Production build
bun start            # Start production server
```

### Code Quality
```bash
bun run lint         # Run Biome linter checks
bun run format       # Format code with Biome
```

**Note:** This project uses **Biome** (not ESLint/Prettier) for linting and formatting. Biome auto-organizes imports on save.

## Technology Stack

### Frontend
- **Framework:** Next.js 16 with App Router, TypeScript, React 19.2
- **Styling:** Tailwind CSS v4 with CSS variables
- **UI Components:** shadcn/ui (20 components installed)
- **Animations:** Framer Motion 12.23
- **State Management:** Zustand 5.0 (shopping cart)
- **Fonts:** Lust (serif, local) and Fredoka (sans, Google Fonts)
- **Compiler:** React Compiler enabled in `next.config.ts`
- **Package Manager:** Bun (not npm/yarn/pnpm)

### Backend & Database
- **ORM:** Prisma 6.18
- **Database:** PostgreSQL (Supabase)
- **Storage:** Supabase Storage (product images)
- **Authentication:** Clerk (with roles: SUPER_ADMIN, ADMIN, CUSTOMER)
- **Payments:** Wompi (Colombia)

### Code Quality
- **Linter/Formatter:** Biome 2.2 (not ESLint/Prettier)

## Architecture & Structure

### Current State
The project is **85% production-ready**:
- `src/app/` - Full Next.js App Router implementation with 28 routes (public site + admin panel + API)
- `src/components/` - 48 components (layout, sections, e-commerce, admin, UI)

### Path Aliases
- `@/*` maps to `./src/*` (configured in `tsconfig.json:22`)

### Design System

**Brand Colors (from requirements.md and src/app/globals.css):**
- Rose Gold: `#E5B097` → `hsl(19 60% 75%)`
- Rich Burgundy: `#80011F` → `hsl(346 98% 25%)`
- Midnight Navy: `#111C3B` → `hsl(224 55% 15%)`
- Ivory Cream: `#FFFBEF` → `hsl(45 100% 97%)`

**Typography (del BrandBook oficial):**
- **Lust** - Font Principal: Tipografía con alto contraste y gran presencia visual. Ideal para títulos.
  - Variante: Fine Display Regular Italic
  - Weights: 400 (regular), 600 (display)
  - Style: Italic
  - Fallbacks: Didot, Bodoni MT, Playfair Display, serif
- **Fredoka** - Font Secundaria: Perfecta para textos secundarios, redes sociales, etiquetas y descripciones.
  - Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- Apply via `font-serif` (Lust) and `font-sans` (Fredoka) utilities
- **IMPORTANTE:** Lust es una fuente comercial. Archivos deben estar en `public/fonts/lust/` (ver README en esa carpeta)

**Tone:** Warm, feminine, artisanal, memory-focused ("huele a recuerdos" not "2x1 urgente!")

### Implemented Routes

**Public Site** `src/app/(site)/`:
- `/inicio` ✅ - Hero carousel, product gallery, how to buy, Instagram section
- `/productos` ✅ - E-commerce product grid with filters
- `/nuestras-tortas` ✅ - Product catalog
- `/nuestra-historia` ✅ - Timeline with images (Fanny Wagner story)
- `/valores` ✅ - Values and purpose
- `/como-comprar` ✅ - Purchase steps, delivery info
- `/faq` ✅ - Accordion with common questions
- `/contacto` ✅ - Contact form
- `/instagram` ✅ - Instagram gallery
- `/checkout` ✅ - Shopping cart checkout flow
- `/pedido-confirmado/[id]` ✅ - Order confirmation page

**Admin Panel** `src/app/(admin)/admin/`:
- `/admin` ✅ - Dashboard with stats (products, orders, revenue)
- `/admin/productos` ✅ - Product management (CRUD)
- `/admin/productos/nuevo` ✅ - Create new product
- `/admin/productos/[id]/editar` ✅ - Edit product
- `/admin/pedidos` ✅ - Order management
- `/admin/pedidos/[id]` ✅ - Order detail view

**Authentication** `src/app/auth/`:
- `/auth/sign-in` ✅ - Login with Clerk
- `/auth/sign-up` ✅ - Registration with Clerk

**API Routes** `src/app/api/`:
- `/api/products` - Product CRUD operations
- `/api/orders` - Order management
- `/api/shipping/calculate` - Shipping cost calculation
- `/api/upload` - Image upload to Supabase Storage
- `/api/wompi/*` - Payment processing
- `/api/webhooks/*` - Clerk and Wompi webhooks
- `/api/auth/check-role` - Role verification

### Component Structure

**Layout Components** `src/components/layout/`:
- `Navigation.tsx` - Scroll-aware navbar with Clerk auth integration
- `Footer.tsx` - Site footer

**Section Components** `src/components/sections/`:
- `Hero.tsx` - Homepage hero with image carousel
- `HowToBuy.tsx`, `ProductGallery.tsx`, `InstagramSection.tsx`
- `OurStory.tsx` - Timeline with images
- `ValuesSection.tsx`, `FAQ.tsx`

**E-commerce Components** `src/components/cart/`, `src/components/checkout/`, `src/components/products/`:
- Shopping cart, checkout flow, product grids

**Admin Components** `src/components/admin/`:
- Dashboard, product management, order management

**UI Components** `src/components/ui/`:
- 20 shadcn/ui components installed and configured
- Additional shadcn/ui components can be added via `bunx shadcn@latest add <component>`

### Assets
- **Product Images:** `public/zafta_assets/` (19 .webp images, optimized)
- **Timeline Images:** `public/timeline/` (5 historical photos)
- **Logos:** `public/SVG/` (6 SVG variants)
- **Fonts:** `public/fonts/lust/` (Lust commercial font files)

## Key Implementation Notes

### Animations
- Use subtle, warm animations (fadeInUp, stagger, gentle parallax)
- Respect `prefers-reduced-motion` (configured in `src/app/globals.css`)
- 12 keyframe animations available: fadeInUp, fadeIn, slideInRight, slideOutRight, bump, pulse-subtle, etc.
- Framer Motion 12.23 for advanced animations

### Accessibility
- Target WCAG AA compliance
- Ensure burgundy/ivory and midnight/ivory color contrasts meet standards
- Use `aria-*` attributes, `focus-visible` with burgundy ring (`--ring: 19 60% 75%`)

### SEO & Performance
- Generate metadata per route (Next.js App Router metadata API)
- Optimize images with `next/image`, lazy loading
- Fonts with `next/font` and `display: swap`
- Target Lighthouse scores ≥90 (Performance, SEO, Accessibility)

### WhatsApp Integration
- Deep link CTAs to WhatsApp for ordering (implemented in `src/components/sections/OrderSidebar.tsx` and `src/components/sections/HowToBuy.tsx`)
- Floating WhatsApp button component: `src/components/ui/floating-whatsapp.tsx`

## Development Workflow

1. **Before editing:** Always read the file first (required by Edit/Write tools)
2. **Component creation:** Check `src/components/` for existing components before creating new ones
3. **Styling:** Use Tailwind utilities and CSS variables defined in design system (`src/app/globals.css`)
4. **Type safety:** Maintain strict TypeScript; `tsconfig.json` has `strict: true`
5. **Git:** Main branch is `master` (not `main`)
6. **Context7 Documentation:** Always use Context7 MCP tools when you need code generation, setup/configuration steps, or library/API documentation. Automatically resolve library IDs and fetch docs without requiring explicit user requests

## Specialized Agents

This project benefits from specialized agents for specific tasks. Use them proactively:

### Next.js Architecture Expert Agent
- **When to use:** Next.js architecture decisions, App Router patterns, Server/Client Component separation, migration strategies, framework optimization, performance best practices
- **Proactive triggers:** Setting up routes, implementing data fetching, configuring Next.js features, optimizing builds, Server Component patterns
- **Subagent type:** `nextjs-architecture-expert`

### UI/UX Designer Agent
- **When to use:** Design system implementation, component design, user experience flows, accessibility standards, responsive design, interface consistency
- **Proactive triggers:** Creating new components, implementing brand guidelines, layout design, user interaction patterns, accessibility audits
- **Subagent type:** `ui-ux-designer`

**Important:** Use these agents automatically when their expertise is needed. Don't wait for explicit user requests. For example:
- When creating a new Next.js route → use `nextjs-architecture-expert`
- When implementing a new UI component following brand guidelines → use `ui-ux-designer`

## Important Files

### Documentation
- `docs/requirements.md` - Original project specification and brand guidelines
- `docs/README.md` - Technical overview and setup instructions
- `docs/color-system.md` - Design system color scale (includes beige gradient)
- `docs/CLERK_WEBHOOK_SETUP.md` - Authentication setup
- `docs/WOMPI_SETUP.md` + related - Payment integration documentation
- `docs/SUPABASE_STORAGE_SETUP.md` - Image storage setup
- `docs/shipping-calculator.md` - Shipping cost calculation system

### Configuration
- `next.config.ts` - React Compiler enabled, image domains configured
- `biome.json` - Linter/formatter configuration
- `prisma/schema.prisma` - Database schema (Product, Order, UserMetadata models)
- `src/app/globals.css` - Complete design system (colors, typography, animations)
- `src/middleware.ts` - Clerk authentication + role-based route protection

### Core Files
- `src/lib/prisma.ts` - Prisma client singleton
- `src/store/cartStore.ts` - Zustand shopping cart state
- `src/components/ui/` - shadcn/ui components

## What's Left to Complete (15% remaining)

**High Priority:**
- [ ] Testimonials section in `/inicio` page
- [ ] Wompi payment testing and validation
- [ ] Contact form backend (email sending)

**Medium Priority:**
- [ ] Per-page metadata for SEO
- [ ] Sitemap.xml generation
- [ ] robots.txt
- [ ] Lighthouse audit and optimizations

**Low Priority:**
- [ ] Product seeding with real data
- [ ] Analytics integration (Vercel/Plausible)
- [ ] Error boundaries and loading states improvements
