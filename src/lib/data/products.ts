import { sql, isDatabaseConfigured } from "@/lib/db";
import {
  DEMO_CATEGORIES,
  DEMO_PRODUCTS,
  getDemoProductBySlug,
  getDemoProductById,
} from "@/lib/data/demo-data";
import type { Category, Product } from "@/types/database";

function mapCategory(row: Record<string, unknown>): Category {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    description: row.description as string | null,
    created_at: String(row.created_at),
  };
}

function mapProduct(row: Record<string, unknown>, category?: Category | null): Product {
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

export async function getCategories(): Promise<Category[]> {
  if (!isDatabaseConfigured()) return DEMO_CATEGORIES;

  try {
    const { rows } = await sql`SELECT * FROM categories ORDER BY name`;
    if (!rows.length) return DEMO_CATEGORIES;
    return rows.map(mapCategory);
  } catch {
    return DEMO_CATEGORIES;
  }
}

export async function getProducts(options?: {
  category?: string;
  search?: string;
  featured?: boolean;
}): Promise<Product[]> {
  if (!isDatabaseConfigured()) {
    return filterDemoProducts(options);
  }

  try {
    let rows;

    if (options?.category) {
      const result = await sql`
        SELECT p.*, c.id AS cat_id, c.name AS cat_name, c.slug AS cat_slug,
               c.description AS cat_description, c.created_at AS cat_created_at
        FROM products p
        LEFT JOIN categories c ON c.id = p.category_id
        WHERE c.slug = ${options.category}
        ORDER BY p.created_at DESC
      `;
      rows = result.rows;
    } else if (options?.featured) {
      const result = await sql`
        SELECT p.*, c.id AS cat_id, c.name AS cat_name, c.slug AS cat_slug,
               c.description AS cat_description, c.created_at AS cat_created_at
        FROM products p
        LEFT JOIN categories c ON c.id = p.category_id
        WHERE p.featured = true
        ORDER BY p.created_at DESC
      `;
      rows = result.rows;
    } else if (options?.search) {
      const pattern = `%${options.search}%`;
      const result = await sql`
        SELECT p.*, c.id AS cat_id, c.name AS cat_name, c.slug AS cat_slug,
               c.description AS cat_description, c.created_at AS cat_created_at
        FROM products p
        LEFT JOIN categories c ON c.id = p.category_id
        WHERE p.name ILIKE ${pattern} OR p.description ILIKE ${pattern}
        ORDER BY p.created_at DESC
      `;
      rows = result.rows;
    } else {
      const result = await sql`
        SELECT p.*, c.id AS cat_id, c.name AS cat_name, c.slug AS cat_slug,
               c.description AS cat_description, c.created_at AS cat_created_at
        FROM products p
        LEFT JOIN categories c ON c.id = p.category_id
        ORDER BY p.created_at DESC
      `;
      rows = result.rows;
    }

    if (!rows.length) return filterDemoProducts(options);
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
      return mapProduct(row, category);
    });
  } catch {
    return filterDemoProducts(options);
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isDatabaseConfigured()) {
    return getDemoProductBySlug(slug) ?? null;
  }

  try {
    const { rows } = await sql`
      SELECT p.*, c.id AS cat_id, c.name AS cat_name, c.slug AS cat_slug,
             c.description AS cat_description, c.created_at AS cat_created_at
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.slug = ${slug}
    `;

    if (!rows[0]) return getDemoProductBySlug(slug) ?? null;

    const row = rows[0];
    const category = row.cat_id
      ? {
          id: row.cat_id as string,
          name: row.cat_name as string,
          slug: row.cat_slug as string,
          description: row.cat_description as string | null,
          created_at: String(row.cat_created_at),
        }
      : null;
    return mapProduct(row, category);
  } catch {
    return getDemoProductBySlug(slug) ?? null;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!isDatabaseConfigured()) {
    return getDemoProductById(id) ?? null;
  }

  try {
    const { rows } = await sql`
      SELECT p.*, c.id AS cat_id, c.name AS cat_name, c.slug AS cat_slug,
             c.description AS cat_description, c.created_at AS cat_created_at
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.id = ${id}
    `;

    if (!rows[0]) return getDemoProductById(id) ?? null;

    const row = rows[0];
    const category = row.cat_id
      ? {
          id: row.cat_id as string,
          name: row.cat_name as string,
          slug: row.cat_slug as string,
          description: row.cat_description as string | null,
          created_at: String(row.cat_created_at),
        }
      : null;
    return mapProduct(row, category);
  } catch {
    return getDemoProductById(id) ?? null;
  }
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
