# Storefront — E-Commerce Platform

A modern, full-stack e-commerce platform built with Next.js, TypeScript, Tailwind CSS, and Vercel Postgres. Deploy everything to Vercel with a single stack — no external backend required.

## Tech Stack

| Technology | Version |
|---|---|
| Next.js (App Router) | 16.3.0 |
| React | 19.2.8 |
| TypeScript | ^5 |
| Tailwind CSS | ^4 |
| Vercel Postgres | latest |
| Lucide React | latest |

## Features

- **Home page** — Hero section, category grid, featured products
- **Product catalog** — Browse, search, and filter by category
- **Product detail** — Images, pricing, stock, add to cart
- **Shopping cart** — Guest (localStorage) and logged-in (Postgres) persistence
- **Checkout** — Shipping form, order creation, stock updates
- **Authentication** — Custom email/password auth with JWT session cookies
- **Order history** — View past orders
- **Admin panel** — Product management (requires admin account)

## Default Admin Login

Change these in production via environment variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD`):

```
Email: admin@store.com
Password: Admin123!
```

The init script creates this admin user automatically when you run `npm run db:init`.

## Demo Mode

The app works without `POSTGRES_URL` configured — it falls back to built-in demo product data and localStorage for the cart. Auth, checkout, and admin require the database.

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Vercel Postgres

**Option A — Vercel CLI / Dashboard**

1. Create a project at [vercel.com](https://vercel.com)
2. Add **Postgres** storage from the Storage tab (or Vercel Marketplace → Neon)
3. Copy the `POSTGRES_URL` connection string

**Option B — Local Postgres**

Use any local Postgres instance and set `POSTGRES_URL` accordingly.

### 3. Configure environment

```bash
cp .env.example .env.local
```

Fill in:

| Variable | Description |
|---|---|
| `POSTGRES_URL` | Postgres connection string |
| `AUTH_SECRET` | Random secret for JWT sessions (32+ chars) |
| `ADMIN_EMAIL` | Admin login email (default: `admin@store.com`) |
| `ADMIN_PASSWORD` | Admin login password (default: `Admin123!`) |

### 4. Initialize the database

```bash
npm run db:init
```

This runs `scripts/schema.sql`, `scripts/seed.sql`, and creates the default admin user.

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Sign in at `/auth/sign-in` with the admin credentials above, then visit `/admin`.

## Deploy to Vercel

### 1. Create Vercel Postgres

1. Push your code to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Go to **Storage** → **Create Database** → **Postgres** (or Neon via Marketplace)
4. Connect the database to your project — Vercel auto-sets `POSTGRES_URL`

### 2. Set environment variables

In Vercel project settings, add:

| Variable | Value |
|---|---|
| `POSTGRES_URL` | Auto-set by Vercel when storage is linked |
| `AUTH_SECRET` | Long random string (e.g. `openssl rand -base64 32`) |
| `ADMIN_EMAIL` | Your admin email |
| `ADMIN_PASSWORD` | Strong password for production |

### 3. Initialize database after first deploy

Run locally with production `POSTGRES_URL`, or use the Vercel Postgres SQL console:

```bash
POSTGRES_URL="your-production-url" AUTH_SECRET="your-secret" npm run db:init
```

Alternatively, run `scripts/schema.sql` and `scripts/seed.sql` in the SQL console, then create the admin user via the init script.

### 4. Deploy

Vercel runs `npm run build` automatically on push.

### Deploy checklist

- [ ] Postgres storage linked to Vercel project
- [ ] `POSTGRES_URL` set (auto from storage)
- [ ] `AUTH_SECRET` set to a strong random value
- [ ] `ADMIN_EMAIL` and `ADMIN_PASSWORD` set for production
- [ ] Database initialized via `npm run db:init`
- [ ] Admin login works at `/auth/sign-in`
- [ ] Test checkout end-to-end (order created, stock decrements, cart clears)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── actions/            # Server actions (auth, cart, orders)
│   ├── admin/              # Admin dashboard & product management
│   ├── auth/               # Sign in, sign up
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Checkout flow
│   ├── orders/             # Order history
│   └── products/           # Catalog & product detail
├── components/             # Reusable UI components
├── context/                # React context (cart)
├── lib/                    # DB client, auth, data layer
└── types/                  # TypeScript types
scripts/
├── schema.sql              # Database tables
├── seed.sql                # Categories & products seed data
└── init-db.mjs             # Full init (schema + seed + admin)
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `POSTGRES_URL` | Yes (for auth/orders) | Vercel Postgres connection string |
| `AUTH_SECRET` | Yes (for auth) | Secret for signing JWT session cookies |
| `ADMIN_EMAIL` | No | Admin account email (default: `admin@store.com`) |
| `ADMIN_PASSWORD` | No | Admin account password (default: `Admin123!`) |

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
npm run db:init   # Initialize database (schema + seed + admin)
```

## License

MIT
