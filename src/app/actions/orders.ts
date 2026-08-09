"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql, isDatabaseConfigured } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getProductById } from "@/lib/data/products";
import { clearUserCart } from "@/app/actions/cart";
import type { ShippingAddress } from "@/types/database";

export async function createOrder(
  items: { productId: string; quantity: number }[],
  shippingAddress: ShippingAddress
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  if (!isDatabaseConfigured()) {
    return {
      success: false,
      error:
        "Database is not configured. Set POSTGRES_URL and AUTH_SECRET in your environment.",
    };
  }

  const user = await getSession();
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

  const orderResult = await sql`
    INSERT INTO orders (user_id, status, total, shipping_address)
    VALUES (${user.id}, 'pending', ${total}, ${JSON.stringify(shippingAddress)})
    RETURNING id
  `;

  const order = orderResult.rows[0];
  if (!order) {
    return { success: false, error: "Failed to create order" };
  }

  for (const item of orderItems) {
    await sql`
      INSERT INTO order_items (order_id, product_id, quantity, price, product_name)
      VALUES (${order.id as string}, ${item.product_id}, ${item.quantity}, ${item.price}, ${item.product_name})
    `;
  }

  for (const item of orderItems) {
    const stockResult = await sql`
      UPDATE products
      SET stock = stock - ${item.quantity}
      WHERE id = ${item.product_id} AND stock >= ${item.quantity}
      RETURNING id
    `;
    if (stockResult.rows.length === 0) {
      return {
        success: false,
        error: `Insufficient stock for ${item.product_name}`,
      };
    }
  }

  await clearUserCart();
  revalidatePath("/orders");
  revalidatePath("/cart");
  revalidatePath("/products");

  return { success: true, orderId: order.id as string };
}

import type { Order, OrderItem } from "@/types/database";

export async function getUserOrders(): Promise<
  (Order & { order_items: OrderItem[] })[]
> {
  if (!isDatabaseConfigured()) return [];

  const user = await getSession();
  if (!user) return [];

  const { rows: orders } = await sql`
    SELECT * FROM orders
    WHERE user_id = ${user.id}
    ORDER BY created_at DESC
  `;

  if (orders.length === 0) return [];

  const result: (Order & { order_items: OrderItem[] })[] = [];

  for (const order of orders) {
    const { rows: items } = await sql`
      SELECT * FROM order_items WHERE order_id = ${order.id as string}
    `;
    result.push({
      id: order.id as string,
      user_id: order.user_id as string,
      status: order.status as Order["status"],
      total: Number(order.total),
      shipping_address: order.shipping_address as Order["shipping_address"],
      created_at: String(order.created_at),
      order_items: items.map((item) => ({
        id: item.id as string,
        order_id: item.order_id as string,
        product_id: item.product_id as string | null,
        quantity: Number(item.quantity),
        price: Number(item.price),
        product_name: item.product_name as string,
      })),
    });
  }

  return result;
}

export async function createProduct(formData: FormData) {
  if (!isDatabaseConfigured()) {
    return { error: "Database is not configured" };
  }

  const user = await getSession();
  if (!user) return { error: "Unauthorized" };
  if (!user.isAdmin) return { error: "Admin access required" };

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const imageUrl = formData.get("imageUrl") as string;
  const categoryId = formData.get("categoryId") as string;
  const stock = parseInt(formData.get("stock") as string, 10);
  const featured = formData.get("featured") === "on";

  try {
    await sql`
      INSERT INTO products (name, slug, description, price, image_url, category_id, stock, featured)
      VALUES (
        ${name}, ${slug}, ${description}, ${price},
        ${imageUrl || null}, ${categoryId || null}, ${stock}, ${featured}
      )
    `;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create product";
    return { error: message };
  }

  revalidatePath("/products");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(productId: string) {
  if (!isDatabaseConfigured()) return { error: "Not configured" };

  const user = await getSession();
  if (!user) return { error: "Unauthorized" };
  if (!user.isAdmin) return { error: "Admin access required" };

  await sql`DELETE FROM products WHERE id = ${productId}`;

  revalidatePath("/products");
  revalidatePath("/admin/products");
  return { success: true };
}
