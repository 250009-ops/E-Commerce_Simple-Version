export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: string | null;
  featured: boolean;
  stock: number;
  created_at: string;
  categories?: Category | null;
};

export type Profile = {
  id: string;
  full_name: string | null;
  is_admin: boolean;
  created_at: string;
};

export type CartItem = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  products?: Product;
};

export type Order = {
  id: string;
  user_id: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  shipping_address: ShippingAddress;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  quantity: number;
  price: number;
  product_name: string;
};

export type ShippingAddress = {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export type GuestCartItem = {
  productId: string;
  quantity: number;
};

export type CartLineItem = {
  product: Product;
  quantity: number;
  cartItemId?: string;
};
