import Link from "next/link";
import { Package, Plus, Settings, AlertTriangle } from "lucide-react";
import { sql, isDatabaseConfigured, isDemoMode } from "@/lib/db";
import { getProducts } from "@/lib/data/products";
import { LOW_STOCK_THRESHOLD } from "@/lib/data/demo-data";

export const metadata = {
  title: "Warehouse Admin — Control Panel",
};

export default async function AdminPage() {
  const products = await getProducts();
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD).length;
  let movementCount = 0;

  if (isDatabaseConfigured()) {
    const { rows } = await sql`SELECT COUNT(*)::int AS count FROM orders`;
    movementCount = Number(rows[0]?.count ?? 0);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-zinc-900">Warehouse Admin</h1>
      <p className="mt-1 text-zinc-600">Manage inventory, zones, and staff operations</p>

      {isDemoMode() && (
        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          Demo mode — inventory data is read-only. Connect Postgres to persist changes.
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <Package className="h-8 w-8 text-zinc-400" />
          <p className="mt-4 text-2xl font-bold text-zinc-900">{products.length}</p>
          <p className="text-sm text-zinc-600">Stock items (SKUs)</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <AlertTriangle className="h-8 w-8 text-amber-600" />
          <p className="mt-4 text-2xl font-bold text-amber-900">{lowStock}</p>
          <p className="text-sm text-amber-800">Low stock alerts</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <Settings className="h-8 w-8 text-zinc-400" />
          <p className="mt-4 text-2xl font-bold text-zinc-900">{movementCount}</p>
          <p className="text-sm text-zinc-600">Stock movements</p>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          <Package className="h-4 w-4" /> Manage inventory
        </Link>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          <Plus className="h-4 w-4" /> Add stock item
        </Link>
      </div>
    </div>
  );
}
