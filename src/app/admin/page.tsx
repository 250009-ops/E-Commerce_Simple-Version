import Link from "next/link";
import { Package, Plus, Settings } from "lucide-react";
import { sql, isDatabaseConfigured } from "@/lib/db";
import { getProducts } from "@/lib/data/products";

export const metadata = {
  title: "Admin Dashboard — Storefront",
};

export default async function AdminPage() {
  const products = await getProducts();
  let orderCount = 0;

  if (isDatabaseConfigured()) {
    const { rows } = await sql`SELECT COUNT(*)::int AS count FROM orders`;
    orderCount = Number(rows[0]?.count ?? 0);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-zinc-900">Admin Dashboard</h1>
      <p className="mt-1 text-zinc-600">Manage your store</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <Package className="h-8 w-8 text-zinc-400" />
          <p className="mt-4 text-2xl font-bold text-zinc-900">{products.length}</p>
          <p className="text-sm text-zinc-600">Products</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <Settings className="h-8 w-8 text-zinc-400" />
          <p className="mt-4 text-2xl font-bold text-zinc-900">{orderCount}</p>
          <p className="text-sm text-zinc-600">Orders</p>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          <Package className="h-4 w-4" /> Manage Products
        </Link>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>
    </div>
  );
}
