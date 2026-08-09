"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getProductById } from "@/lib/data/products";
import { clearUserCart } from "@/app/actions/cart";
import type { ShippingAddress } from "@/types/database";

export async function createOrder(
  items: { productId: string; quantity: number }[],
  shippingAddress: ShippingAddress
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: "Supabase is not configured. Please set up your environment variables." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be signed in to checkout." };
  }

  if (items.length === 0) {
    return { success: false, error: "Your cart is empty." };
  }

  let total = 0;
  const orderItems: {
    product_id: string;
    quantity: number;
    price: number;
    product_name: string;
  }[] = [];

  for (const item of items) {
    const product = await getProductById(item.productId);
    if (!product) {
      return { success: false, error: `Product not found: ${item.productId}` };
    }
    if (product.stock < item.quantity) {
      return { success: false, error: `Insufficient stock for ${product.name}` };
    }
    total += product.price * item.quantity;
    orderItems.push({
      product_id: product.id,
      quantity: item.quantity,
      price: product.price,
      product_name: product.name,
    });
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      status: "pending",
      total,
      shipping_address: shippingAddress,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { success: false, error: orderError?.message ?? "Failed to create order" };
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    orderItems.map((item) => ({
      order_id: order.id,
      ...item,
    }))
  );

  if (itemsError) {
    return { success: false, error: itemsError.message };
  }

  for (const item of orderItems) {
    const { error: stockError } = await supabase.rpc("decrement_product_stock", {
      p_product_id: item.product_id,
      p_quantity: item.quantity,
    });
    if (stockError) {
      return { success: false, error: stockError.message };
    }
  }

  await clearUserCart();
  revalidatePath("/orders");
  revalidatePath("/cart");
  revalidatePath("/products");

  return { success: true, orderId: order.id };
}

export async function getUserOrders() {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}

async function getSiteUrl() {
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  if (host) return `${protocol}://${host}`;
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function signIn(formData: FormData) {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured. Please set up your environment variables." };
  }

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirect") as string) || "/";

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect(redirectTo);
}

export async function signUp(formData: FormData) {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured. Please set up your environment variables." };
  }

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const siteUrl = await getSiteUrl();

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/auth/sign-in?message=Check your email to confirm your account");
}

export async function createProduct(formData: FormData) {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) return { error: "Admin access required" };

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const imageUrl = formData.get("imageUrl") as string;
  const categoryId = formData.get("categoryId") as string;
  const stock = parseInt(formData.get("stock") as string, 10);
  const featured = formData.get("featured") === "on";

  const { error } = await supabase.from("products").insert({
    name,
    slug,
    description,
    price,
    image_url: imageUrl || null,
    category_id: categoryId || null,
    stock,
    featured,
  });

  if (error) return { error: error.message };

  revalidatePath("/products");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(productId: string) {
  if (!isSupabaseConfigured()) return { error: "Not configured" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) return { error: "Admin access required" };

  const { error } = await supabase.from("products").delete().eq("id", productId);
  if (error) return { error: error.message };

  revalidatePath("/products");
  revalidatePath("/admin/products");
  return { success: true };
}
