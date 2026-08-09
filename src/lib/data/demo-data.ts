import type { Category, Product } from "@/types/database";

export const DEMO_CATEGORIES: Category[] = [
  {
    id: "demo-cat-1",
    name: "Electronics",
    slug: "electronics",
    description: "Latest gadgets and tech accessories",
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-cat-2",
    name: "Clothing",
    slug: "clothing",
    description: "Fashion for every occasion",
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-cat-3",
    name: "Home & Living",
    slug: "home-living",
    description: "Furniture and decor for your space",
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-cat-4",
    name: "Sports",
    slug: "sports",
    description: "Gear for active lifestyles",
    created_at: new Date().toISOString(),
  },
];

export const DEMO_PRODUCTS: Product[] = [
  {
    id: "demo-prod-1",
    name: "Wireless Headphones Pro",
    slug: "wireless-headphones-pro",
    description:
      "Premium noise-cancelling wireless headphones with 30-hour battery life and crystal-clear audio.",
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
    name: "Smart Watch Series X",
    slug: "smart-watch-series-x",
    description:
      "Track fitness, receive notifications, and stay connected with this sleek smartwatch.",
    price: 399.99,
    image_url:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop",
    category_id: "demo-cat-1",
    featured: true,
    stock: 30,
    created_at: new Date().toISOString(),
    categories: DEMO_CATEGORIES[0],
  },
  {
    id: "demo-prod-3",
    name: "Minimalist Leather Backpack",
    slug: "minimalist-leather-backpack",
    description:
      "Handcrafted full-grain leather backpack with laptop compartment and water-resistant lining.",
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
    name: "Organic Cotton T-Shirt",
    slug: "organic-cotton-t-shirt",
    description:
      "Soft, sustainable organic cotton tee available in multiple colors. Perfect everyday essential.",
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
    name: "Ceramic Pour-Over Set",
    slug: "ceramic-pour-over-set",
    description:
      "Artisan ceramic dripper and carafe set for the perfect morning brew ritual.",
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
    name: "Scandinavian Desk Lamp",
    slug: "scandinavian-desk-lamp",
    description:
      "Adjustable LED desk lamp with warm dimmable light and minimalist Scandinavian design.",
    price: 79.99,
    image_url:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop",
    category_id: "demo-cat-3",
    featured: false,
    stock: 35,
    created_at: new Date().toISOString(),
    categories: DEMO_CATEGORIES[2],
  },
  {
    id: "demo-prod-7",
    name: "Yoga Mat Premium",
    slug: "yoga-mat-premium",
    description:
      "Extra-thick eco-friendly yoga mat with superior grip and carrying strap included.",
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
    name: "Running Shoes Elite",
    slug: "running-shoes-elite",
    description:
      "Lightweight performance running shoes with responsive cushioning and breathable mesh upper.",
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
    name: "Portable Bluetooth Speaker",
    slug: "portable-bluetooth-speaker",
    description:
      "Waterproof portable speaker with 360° sound and 12-hour playtime.",
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
    name: "Linen Throw Blanket",
    slug: "linen-throw-blanket",
    description:
      "Breathable stonewashed linen throw blanket in neutral tones for cozy comfort.",
    price: 94.99,
    image_url:
      "https://images.unsplash.com/photo-1555041469-a586c8df9fdb?w=800&h=800&fit=crop",
    category_id: "demo-cat-3",
    featured: false,
    stock: 20,
    created_at: new Date().toISOString(),
    categories: DEMO_CATEGORIES[2],
  },
  {
    id: "demo-prod-11",
    name: "Denim Jacket Classic",
    slug: "denim-jacket-classic",
    description:
      "Timeless medium-wash denim jacket with modern fit and durable construction.",
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
    name: "Fitness Resistance Bands",
    slug: "fitness-resistance-bands",
    description:
      "Set of 5 latex resistance bands with handles, door anchor, and carry bag.",
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

export function getDemoProductBySlug(slug: string): Product | undefined {
  return DEMO_PRODUCTS.find((p) => p.slug === slug);
}

export function getDemoProductById(id: string): Product | undefined {
  return DEMO_PRODUCTS.find((p) => p.id === id);
}
