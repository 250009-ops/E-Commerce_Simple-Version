import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import {
  DEMO_CATEGORIES,
  DEMO_PRODUCTS,
  getDemoProductBySlug,
  getDemoProductById,
} from "@/lib/data/demo-data";
import type { Category, Product } from "@/types/database";

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) return DEMO_CATEGORIES;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error || !data?.length) return DEMO_CATEGORIES;
  return data;
}

export async function getProducts(options?: {
  category?: string;
  search?: string;
  featured?: boolean;
}): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return filterDemoProducts(options);
  }

  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*, categories(*)")
    .order("created_at", { ascending: false });

  if (options?.category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", options.category)
      .single();
    if (cat) query = query.eq("category_id", cat.id);
  }

  if (options?.featured) {
    query = query.eq("featured", true);
  }

  if (options?.search) {
    query = query.or(
      `name.ilike.%${options.search}%,description.ilike.%${options.search}%`
    );
  }

  const { data, error } = await query;
  if (error || !data?.length) return filterDemoProducts(options);
  return data.map(normalizeProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    return getDemoProductBySlug(slug) ?? null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return getDemoProductBySlug(slug) ?? null;
  }
  return normalizeProduct(data);
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    return getDemoProductById(id) ?? null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("id", id)
    .single();

  if (error || !data) {
    return getDemoProductById(id) ?? null;
  }
  return normalizeProduct(data);
}

function filterDemoProducts(options?: {
  category?: string;
  search?: string;
  featured?: boolean;
}): Product[] {
  let products = [...DEMO_PRODUCTS];

  if (options?.category) {
    products = products.filter((p) => p.categories?.slug === options.category);
  }
  if (options?.featured) {
    products = products.filter((p) => p.featured);
  }
  if (options?.search) {
    const q = options.search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }
  return products;
}

function normalizeProduct(row: Record<string, unknown>): Product {
  return {
    ...row,
    price: Number(row.price),
    stock: Number(row.stock),
    featured: Boolean(row.featured),
    categories: row.categories as Product["categories"],
  } as Product;
}
