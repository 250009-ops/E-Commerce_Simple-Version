"use server";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getProductById } from "@/lib/data/products";
import type { CartLineItem, Product } from "@/types/database";

export async function getCartItems(): Promise<CartLineItem[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isSupabaseConfigured()) {
    return [];
  }

  const { data } = await supabase
    .from("cart_items")
    .select("id, quantity, product_id, products(*, categories(*))")
    .eq("user_id", user.id);

  if (!data) return [];

  return data
    .filter((item) => item.products && !Array.isArray(item.products))
    .map((item) => {
      const raw = item.products as unknown as Record<string, unknown>;
      const product: Product = {
        id: raw.id as string,
        name: raw.name as string,
        slug: raw.slug as string,
        description: raw.description as string | null,
        price: Number(raw.price),
        image_url: raw.image_url as string | null,
        category_id: raw.category_id as string | null,
        featured: Boolean(raw.featured),
        stock: Number(raw.stock),
        created_at: raw.created_at as string,
        categories: raw.categories as Product["categories"],
      };
      return {
        cartItemId: item.id,
        quantity: item.quantity,
        product,
      };
    });
}

export async function getCartItemsFromIds(
  items: { productId: string; quantity: number }[]
): Promise<CartLineItem[]> {
  const results: CartLineItem[] = [];
  for (const item of items) {
    const product = await getProductById(item.productId);
    if (product) {
      results.push({ product, quantity: item.quantity });
    }
  }
  return results;
}

export async function mergeGuestCart(
  guestItems: { productId: string; quantity: number }[]
): Promise<void> {
  if (!isSupabaseConfigured() || guestItems.length === 0) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  for (const item of guestItems) {
    const { data: existing } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq("product_id", item.productId)
      .single();

    if (existing) {
      await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + item.quantity })
        .eq("id", existing.id);
    } else {
      await supabase.from("cart_items").insert({
        user_id: user.id,
        product_id: item.productId,
        quantity: item.quantity,
      });
    }
  }
}

export async function clearUserCart(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("cart_items").delete().eq("user_id", user.id);
}
