-- Seed categories and products (Unsplash image URLs)

INSERT INTO categories (name, slug, description) VALUES
  ('Electronics', 'electronics', 'Latest gadgets and tech accessories'),
  ('Clothing', 'clothing', 'Fashion for every occasion'),
  ('Home & Living', 'home-living', 'Furniture and decor for your space'),
  ('Sports', 'sports', 'Gear for active lifestyles')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, image_url, category_id, featured, stock)
SELECT
  p.name, p.slug, p.description, p.price, p.image_url,
  c.id, p.featured, p.stock
FROM (VALUES
  ('Wireless Headphones Pro', 'wireless-headphones-pro',
   'Premium noise-cancelling wireless headphones with 30-hour battery life and crystal-clear audio.',
   249.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop', 'electronics', true, 50),
  ('Smart Watch Series X', 'smart-watch-series-x',
   'Track fitness, receive notifications, and stay connected with this sleek smartwatch.',
   399.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop', 'electronics', true, 30),
  ('Minimalist Leather Backpack', 'minimalist-leather-backpack',
   'Handcrafted full-grain leather backpack with laptop compartment and water-resistant lining.',
   189.99, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop', 'clothing', true, 25),
  ('Organic Cotton T-Shirt', 'organic-cotton-t-shirt',
   'Soft, sustainable organic cotton tee available in multiple colors. Perfect everyday essential.',
   34.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop', 'clothing', false, 100),
  ('Ceramic Pour-Over Set', 'ceramic-pour-over-set',
   'Artisan ceramic dripper and carafe set for the perfect morning brew ritual.',
   64.99, 'https://images.unsplash.com/photo-1495474472287-4d89bcdd3335?w=800&h=800&fit=crop', 'home-living', true, 40),
  ('Scandinavian Desk Lamp', 'scandinavian-desk-lamp',
   'Adjustable LED desk lamp with warm dimmable light and minimalist Scandinavian design.',
   79.99, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop', 'home-living', false, 35),
  ('Yoga Mat Premium', 'yoga-mat-premium',
   'Extra-thick eco-friendly yoga mat with superior grip and carrying strap included.',
   49.99, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=800&fit=crop', 'sports', false, 60),
  ('Running Shoes Elite', 'running-shoes-elite',
   'Lightweight performance running shoes with responsive cushioning and breathable mesh upper.',
   129.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop', 'sports', true, 45),
  ('Portable Bluetooth Speaker', 'portable-bluetooth-speaker',
   'Waterproof portable speaker with 360° sound and 12-hour playtime.',
   89.99, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop', 'electronics', false, 55),
  ('Linen Throw Blanket', 'linen-throw-blanket',
   'Breathable stonewashed linen throw blanket in neutral tones for cozy comfort.',
   94.99, 'https://images.unsplash.com/photo-1555041469-a586c8df9fdb?w=800&h=800&fit=crop', 'home-living', false, 20),
  ('Denim Jacket Classic', 'denim-jacket-classic',
   'Timeless medium-wash denim jacket with modern fit and durable construction.',
   119.99, 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&h=800&fit=crop', 'clothing', false, 30),
  ('Fitness Resistance Bands', 'fitness-resistance-bands',
   'Set of 5 latex resistance bands with handles, door anchor, and carry bag.',
   29.99, 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800&h=800&fit=crop', 'sports', false, 80)
) AS p(name, slug, description, price, image_url, category_slug, featured, stock)
JOIN categories c ON c.slug = p.category_slug
ON CONFLICT (slug) DO NOTHING;
