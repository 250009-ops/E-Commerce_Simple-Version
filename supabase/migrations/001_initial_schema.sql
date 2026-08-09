-- E-Commerce Platform Schema
-- Run this in Supabase SQL Editor or via Supabase CLI

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  image_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  featured BOOLEAN DEFAULT FALSE,
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cart items (logged-in users)
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
  shipping_address JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  product_name TEXT NOT NULL
);

-- Decrement stock on checkout (bypasses admin-only product UPDATE policy)
CREATE OR REPLACE FUNCTION decrement_product_stock(p_product_id UUID, p_quantity INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE products
  SET stock = stock - p_quantity
  WHERE id = p_product_id AND stock >= p_quantity;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient stock or product not found';
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION decrement_product_stock(UUID, INTEGER) TO authenticated;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Categories: public read
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT USING (true);

-- Products: public read
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT USING (true);

-- Profiles: users can read/update own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Admins can manage products
CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Cart items: users manage own cart
CREATE POLICY "Users can view own cart"
  ON cart_items FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items"
  ON cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE USING (auth.uid() = user_id);

-- Orders: users manage own orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order items: users can view items for their orders
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert order items for own orders"
  ON order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

-- Seed data
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
