"use server";

import { sql, isDatabaseConfigured } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getProductById } from "@/lib/data/products";
import type { CartLineItem, Category, Product } from "@/types/database";

type ProductRow = Record<string, unknown>;

function mapProductRow(row: ProductRow, category?: Category | null): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    description: row.description as string | null,
    price: Number(row.price),
    image_url: row.image_url as string | null,
    category_id: row.category_id as string | null,
    featured: Boolean(row.featured),
    stock: Number(row.stock),
    created_at: String(row.created_at),
    categories: category ?? null,
  };
}

export async function getCartItems(): Promise<CartLineItem[]> {
  if (!isDatabaseConfigured()) return [];

  const user = await getSession();
  if (!user) return [];

  const { rows } = await sql`
    SELECT
      ci.id AS cart_item_id,
      ci.quantity,
      p.*,
      c.id AS cat_id,
      c.name AS cat_name,
      c.slug AS cat_slug,
      c.description AS cat_description,
      c.created_at AS cat_created_at
    FROM cart_items ci
    JOIN products p ON p.id = ci.product_id
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE ci.user_id = ${user.id}
  `;

  return rows.map((row) => {
    const category = row.cat_id
      ? {
          id: row.cat_id as string,
          name: row.cat_name as string,
          slug: row.cat_slug as string,
          description: row.cat_description as string | null,
          created_at: String(row.cat_created_at),
        }
      : null;

    return {
      cartItemId: row.cart_item_id as string,
      quantity: Number(row.quantity),
      product: mapProductRow(row, category),
    };
  });
}

export async function getCartCount(): Promise<number> {
  if (!isDatabaseConfigured()) return 0;

  const user = await getSession();
  if (!user) return 0;

  const { rows } = await sql`
    SELECT COALESCE(SUM(quantity), 0)::int AS count
    FROM cart_items WHERE user_id = ${user.id}
  `;

  return Number(rows[0]?.count ?? 0);
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

export async function addCartItem(
  productId: string,
  quantity = 1
): Promise<void> {
  if (!isDatabaseConfigured()) return;

  const user = await getSession();
  if (!user) return;

  const existing = await sql`
    SELECT id, quantity FROM cart_items
    WHERE user_id = ${user.id} AND product_id = ${productId}
  `;

  if (existing.rows[0]) {
    await sql`
      UPDATE cart_items
      SET quantity = ${Number(existing.rows[0].quantity) + quantity}
      WHERE id = ${existing.rows[0].id as string}
    `;
  } else {
    await sql`
      INSERT INTO cart_items (user_id, product_id, quantity)
      VALUES (${user.id}, ${productId}, ${quantity})
    `;
  }
}

export async function updateCartItem(
  productId: string,
  quantity: number
): Promise<void> {
  if (!isDatabaseConfigured()) return;

  const user = await getSession();
  if (!user) return;

  if (quantity <= 0) {
    await sql`
      DELETE FROM cart_items
      WHERE user_id = ${user.id} AND product_id = ${productId}
    `;
  } else {
    await sql`
      UPDATE cart_items SET quantity = ${quantity}
      WHERE user_id = ${user.id} AND product_id = ${productId}
    `;
  }
}

export async function removeCartItem(productId: string): Promise<void> {
  if (!isDatabaseConfigured()) return;

  const user = await getSession();
  if (!user) return;

  await sql`
    DELETE FROM cart_items
    WHERE user_id = ${user.id} AND product_id = ${productId}
  `;
}

export async function mergeGuestCart(
  guestItems: { productId: string; quantity: number }[]
): Promise<void> {
  if (!isDatabaseConfigured() || guestItems.length === 0) return;

  const user = await getSession();
  if (!user) return;

  for (const item of guestItems) {
    const existing = await sql`
      SELECT id, quantity FROM cart_items
      WHERE user_id = ${user.id} AND product_id = ${item.productId}
    `;

    if (existing.rows[0]) {
      await sql`
        UPDATE cart_items
        SET quantity = ${Number(existing.rows[0].quantity) + item.quantity}
        WHERE id = ${existing.rows[0].id as string}
      `;
    } else {
      await sql`
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES (${user.id}, ${item.productId}, ${item.quantity})
      `;
    }
  }
}

export async function clearUserCart(): Promise<void> {
  if (!isDatabaseConfigured()) return;

  const user = await getSession();
  if (!user) return;

  await sql`DELETE FROM cart_items WHERE user_id = ${user.id}`;
}

export async function isUserLoggedIn(): Promise<boolean> {
  const user = await getSession();
  return Boolean(user);
}
