# Storefront — E-Commerce Platform

A modern, full-stack e-commerce platform built with Next.js, TypeScript, Tailwind CSS, and Supabase. Deploy the frontend to Vercel and use Supabase for database, authentication, and storage.

## Tech Stack

| Technology | Version |
|---|---|
| Next.js (App Router) | 16.3.0 |
| React | 19.2.8 |
| TypeScript | ^5 |
| Tailwind CSS | ^4 |
| Supabase JS | latest |
| Lucide React | latest |

## Features

- **Home page** — Hero section, category grid, featured products
- **Product catalog** — Browse, search, and filter by category
- **Product detail** — Images, pricing, stock, add to cart
- **Shopping cart** — Guest (localStorage) and logged-in (Supabase) persistence
- **Checkout** — Shipping form, order creation, stock updates
- **Authentication** — Sign up / sign in via Supabase Auth
- **Order history** — View past orders
- **Admin panel** — Product management (requires admin profile)

## Demo Mode

The app works without Supabase configured — it falls back to built-in demo product data and localStorage for the cart. Auth, checkout, and admin require Supabase.

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the migration file:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
3. Copy `.env.example` to `.env.local` and fill in your credentials:
   ```bash
   cp .env.example .env.local
   ```

### 3. Configure Auth (Supabase Dashboard)

- Go to **Authentication → URL Configuration**
- Set **Site URL** to `http://localhost:3000`
- Add redirect URL: `http://localhost:3000/auth/callback`

### 4. Create an admin user

After signing up, promote a user to admin in the SQL Editor:

```sql
UPDATE profiles SET is_admin = true WHERE id = 'your-user-uuid';
```

Find your user UUID in **Authentication → Users**.

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

### 1. Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** and run the full migration:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
   This creates tables, RLS policies, seed data, profile trigger, and the `decrement_product_stock` function used at checkout.
3. In **Authentication → URL Configuration**, set:
   - **Site URL**: `https://your-app.vercel.app` (replace with your Vercel domain)
   - **Redirect URLs**:
     - `https://your-app.vercel.app/auth/callback`
     - `http://localhost:3000/auth/callback` (for local dev)

### 2. Vercel project

1. Push your code to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add **Environment Variables** (Production, Preview, and Development):
   | Variable | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
4. Deploy (Vercel runs `npm run build` automatically)

### 3. Post-deploy

1. Sign up on your live site
2. Promote your account to admin in Supabase SQL Editor:
   ```sql
   UPDATE profiles SET is_admin = true WHERE id = 'your-user-uuid';
   ```
3. Verify: browse products, add to cart, sign in, checkout, view orders, access `/admin`

### Deploy checklist

- [ ] Migration `001_initial_schema.sql` applied in Supabase
- [ ] `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` set in Vercel
- [ ] Supabase Auth Site URL and redirect URL match your Vercel domain
- [ ] Admin user promoted via SQL
- [ ] Test checkout end-to-end (order created, stock decrements, cart clears)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── actions/            # Server actions (cart, orders, auth)
│   ├── admin/              # Admin dashboard & product management
│   ├── auth/               # Sign in, sign up, OAuth callback
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Checkout flow
│   ├── orders/             # Order history
│   └── products/           # Catalog & product detail
├── components/             # Reusable UI components
├── context/                # React context (cart)
├── lib/                    # Utilities, Supabase clients, data layer
└── types/                  # TypeScript types
supabase/
└── migrations/             # SQL schema, RLS policies, seed data
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes (for auth/orders) | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes (for auth/orders) | Supabase anonymous key |
| `NEXT_PUBLIC_SITE_URL` | No | Fallback for email confirmation redirects (defaults to request host) |

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## License

MIT
