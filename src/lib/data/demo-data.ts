import type { Category, Product } from "@/types/database";

export const LOW_STOCK_THRESHOLD = 10;

export const DEMO_CATEGORIES: Category[] = [
  {
    id: "demo-cat-1",
    name: "Zone A — Electronics",
    slug: "zone-a-electronics",
    description: "High-value electronics and components",
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-cat-2",
    name: "Zone B — Apparel",
    slug: "zone-b-apparel",
    description: "Clothing, uniforms, and textile stock",
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-cat-3",
    name: "Zone C — Home & Fixtures",
    slug: "zone-c-home",
    description: "Furniture, fixtures, and facility supplies",
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-cat-4",
    name: "Zone D — Sports & Outdoors",
    slug: "zone-d-sports",
    description: "Outdoor gear and athletic equipment",
    created_at: new Date().toISOString(),
  },
];

export const DEMO_PRODUCTS: Product[] = [
  {
    id: "demo-prod-1",
    name: "SKU-WH-1001 — Wireless Headphones Pro",
    slug: "wh-1001-wireless-headphones",
    description:
      "Premium noise-cancelling wireless headphones. Bin A-12, pallet rack 3.",
    price: 249.99,
    image_url:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
    category_id: "demo-cat-1",
    featured: true,
    stock: 50,
    created_at: new Date().toISOString(),
    categories: DEMO_CATEGORIES[0],
  },
  {
    id: "demo-prod-2",
    name: "SKU-WH-1002 — Smart Watch Series X",
    slug: "wh-1002-smart-watch",
    description:
      "Fitness tracking smartwatch with GPS. Bin A-14, secure cage.",
    price: 399.99,
    image_url:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop",
    category_id: "demo-cat-1",
    featured: true,
    stock: 8,
    created_at: new Date().toISOString(),
    categories: DEMO_CATEGORIES[0],
  },
  {
    id: "demo-prod-3",
    name: "SKU-WH-2001 — Leather Backpack",
    slug: "wh-2001-leather-backpack",
    description:
      "Full-grain leather backpack with laptop sleeve. Bin B-03.",
    price: 189.99,
    image_url:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop",
    category_id: "demo-cat-2",
    featured: true,
    stock: 25,
    created_at: new Date().toISOString(),
    categories: DEMO_CATEGORIES[1],
  },
  {
    id: "demo-prod-4",
    name: "SKU-WH-2002 — Organic Cotton T-Shirt",
    slug: "wh-2002-cotton-tshirt",
    description:
      "Bulk-pack organic cotton tees, assorted sizes. Bin B-07.",
    price: 34.99,
    image_url:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop",
    category_id: "demo-cat-2",
    featured: false,
    stock: 100,
    created_at: new Date().toISOString(),
    categories: DEMO_CATEGORIES[1],
  },
  {
    id: "demo-prod-5",
    name: "SKU-WH-3001 — Ceramic Pour-Over Set",
    slug: "wh-3001-pour-over-set",
    description:
      "Artisan ceramic dripper and carafe set. Bin C-02.",
    price: 64.99,
    image_url:
      "https://images.unsplash.com/photo-1495474472287-4d89bcdd3335?w=800&h=800&fit=crop",
    category_id: "demo-cat-3",
    featured: true,
    stock: 40,
    created_at: new Date().toISOString(),
    categories: DEMO_CATEGORIES[2],
  },
  {
    id: "demo-prod-6",
    name: "SKU-WH-3002 — Desk Lamp LED",
    slug: "wh-3002-desk-lamp",
    description:
      "Adjustable LED desk lamp. Bin C-05, overflow shelf.",
    price: 79.99,
    image_url:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop",
    category_id: "demo-cat-3",
    featured: false,
    stock: 5,
    created_at: new Date().toISOString(),
    categories: DEMO_CATEGORIES[2],
  },
  {
    id: "demo-prod-7",
    name: "SKU-WH-4001 — Yoga Mat Premium",
    slug: "wh-4001-yoga-mat",
    description:
      "Eco-friendly yoga mats with carrying strap. Bin D-01.",
    price: 49.99,
    image_url:
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=800&fit=crop",
    category_id: "demo-cat-4",
    featured: false,
    stock: 60,
    created_at: new Date().toISOString(),
    categories: DEMO_CATEGORIES[3],
  },
  {
    id: "demo-prod-8",
    name: "SKU-WH-4002 — Running Shoes Elite",
    slug: "wh-4002-running-shoes",
    description:
      "Performance running shoes, mixed sizes. Bin D-04.",
    price: 129.99,
    image_url:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop",
    category_id: "demo-cat-4",
    featured: true,
    stock: 45,
    created_at: new Date().toISOString(),
    categories: DEMO_CATEGORIES[3],
  },
  {
    id: "demo-prod-9",
    name: "SKU-WH-1003 — Bluetooth Speaker",
    slug: "wh-1003-bluetooth-speaker",
    description:
      "Waterproof portable speaker. Bin A-18.",
    price: 89.99,
    image_url:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop",
    category_id: "demo-cat-1",
    featured: false,
    stock: 55,
    created_at: new Date().toISOString(),
    categories: DEMO_CATEGORIES[0],
  },
  {
    id: "demo-prod-10",
    name: "SKU-WH-3003 — Linen Throw Blanket",
    slug: "wh-3003-linen-blanket",
    description:
      "Stonewashed linen throw blankets. Bin C-08.",
    price: 94.99,
    image_url:
      "https://images.unsplash.com/photo-1555041469-a586c8df9fdb?w=800&h=800&fit=crop",
    category_id: "demo-cat-3",
    featured: false,
    stock: 3,
    created_at: new Date().toISOString(),
    categories: DEMO_CATEGORIES[2],
  },
  {
    id: "demo-prod-11",
    name: "SKU-WH-2003 — Denim Jacket Classic",
    slug: "wh-2003-denim-jacket",
    description:
      "Medium-wash denim jackets, seasonal stock. Bin B-11.",
    price: 119.99,
    image_url:
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&h=800&fit=crop",
    category_id: "demo-cat-2",
    featured: false,
    stock: 30,
    created_at: new Date().toISOString(),
    categories: DEMO_CATEGORIES[1],
  },
  {
    id: "demo-prod-12",
    name: "SKU-WH-4003 — Resistance Bands Set",
    slug: "wh-4003-resistance-bands",
    description:
      "Set of 5 latex resistance bands with carry bag. Bin D-06.",
    price: 29.99,
    image_url:
      "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&h=800&fit=crop",
    category_id: "demo-cat-4",
    featured: false,
    stock: 80,
    created_at: new Date().toISOString(),
    categories: DEMO_CATEGORIES[3],
  },
];

export type DemoMovement = {
  id: string;
  type: "inbound" | "outbound" | "transfer";
  item: string;
  quantity: number;
  status: "pending" | "completed" | "in-transit";
  created_at: string;
};

export const DEMO_MOVEMENTS: DemoMovement[] = [
  {
    id: "mov-001",
    type: "outbound",
    item: "SKU-WH-1002 — Smart Watch Series X",
    quantity: 12,
    status: "pending",
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "mov-002",
    type: "inbound",
    item: "SKU-WH-2002 — Organic Cotton T-Shirt",
    quantity: 200,
    status: "completed",
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "mov-003",
    type: "transfer",
    item: "SKU-WH-3002 — Desk Lamp LED",
    quantity: 15,
    status: "in-transit",
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "mov-004",
    type: "outbound",
    item: "SKU-WH-4002 — Running Shoes Elite",
    quantity: 8,
    status: "completed",
    created_at: new Date(Date.now() - 259200000).toISOString(),
  },
];

export function getDemoProductBySlug(slug: string): Product | undefined {
  return DEMO_PRODUCTS.find((p) => p.slug === slug);
}

export function getDemoProductById(id: string): Product | undefined {
  return DEMO_PRODUCTS.find((p) => p.id === id);
}

export function getStockStatus(stock: number): "in-stock" | "low-stock" | "out-of-stock" {
  if (stock <= 0) return "out-of-stock";
  if (stock <= LOW_STOCK_THRESHOLD) return "low-stock";
  return "in-stock";
}

export function getStockStatusLabel(status: ReturnType<typeof getStockStatus>): string {
  switch (status) {
    case "in-stock":
      return "In Stock";
    case "low-stock":
      return "Low Stock";
    case "out-of-stock":
      return "Out of Stock";
  }
}

export function extractSku(name: string): string {
  const match = name.match(/SKU-[A-Z0-9-]+/);
  return match ? match[0] : name.slice(0, 12);
}
