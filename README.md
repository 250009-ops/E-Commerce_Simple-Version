# Warehouse Control Panel

A warehouse inventory and dispatch management app built with Next.js, TypeScript, Tailwind CSS, and Vercel Postgres. Monitor stock levels, manage pick lists, and track shipments — deploy everything to Vercel with a single stack.

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

- **Warehouse dashboard** — SKU counts, low stock alerts, pending shipments, recent movements
- **Inventory catalog** — Browse, search, and filter by zone/category with SKU and stock status
- **Item detail** — Stock levels, location, reserve to pick list
- **Pick list** — Guest (localStorage) and logged-in (Postgres) persistence
- **Dispatch** — Record outgoing stock and create shipment movements
- **Staff authentication** — Custom email/password auth with JWT session cookies
- **Stock movements** — View inbound/outbound history
- **Admin panel** — Inventory management (requires admin account)

## Default Admin Login

Change these in production via environment variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD`):

```
Email: admin@store.com
Password: Admin123!
```

The init script creates this admin user automatically when you run `npm run db:init`.

## Demo Mode (No Postgres Required)

The app works without `POSTGRES_URL` configured:

- Sign in with admin credentials (`admin@store.com` / `Admin123!`) — JWT sessions use a dev `AUTH_SECRET` fallback
- Browse demo warehouse inventory and dashboard stats
- Use pick list via localStorage (guest mode)
- Admin panel shows read-only demo data

Auth, dispatch, and persistent pick lists require Postgres for production use.

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Run in demo mode (no database)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in at `/auth/sign-in` with `admin@store.com` / `Admin123!`.

### 3. Optional — connect Postgres

**Option A — Vercel CLI / Dashboard**

1. Create a project at [vercel.com](https://vercel.com)
2. Add **Postgres** storage from the Storage tab
3. Copy the `POSTGRES_URL` connection string

**Option B — Local Postgres**

Use any local Postgres instance and set `POSTGRES_URL` accordingly.

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `POSTGRES_URL` | Postgres connection string |
| `AUTH_SECRET` | Random secret for JWT sessions (32+ chars; auto-fallback in dev) |
| `ADMIN_EMAIL` | Admin login email (default: `admin@store.com`) |
| `ADMIN_PASSWORD` | Admin login password (default: `Admin123!`) |

```bash
npm run db:init
npm run dev
```

## Deploy to Vercel

### Environment variables (production)

| Variable | Value |
|---|---|
| `POSTGRES_URL` | Auto-set by Vercel when storage is linked |
| `AUTH_SECRET` | Long random string (e.g. `openssl rand -base64 32`) |
| `ADMIN_EMAIL` | Your admin email |
| `ADMIN_PASSWORD` | Strong password for production |

Initialize the database after first deploy:

```bash
POSTGRES_URL="your-production-url" AUTH_SECRET="your-secret" npm run db:init
```

## Routes

| Route | Purpose |
|---|---|
| `/` | Warehouse dashboard |
| `/inventory` | Stock list (SKU, quantity, zone, status) |
| `/inventory/[slug]` | Item detail and movement history |
| `/pick-list` | Reserved items for dispatch |
| `/dispatch` | Record outgoing stock |
| `/movements` | Stock in/out history |
| `/admin` | Warehouse admin panel |
| `/auth/sign-in` | Staff sign in |

Legacy e-commerce routes (`/products`, `/cart`, `/checkout`, `/orders`) redirect automatically.

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
