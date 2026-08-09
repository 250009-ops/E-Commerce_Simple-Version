import Link from "next/link";
import { ArrowRight, AlertTriangle, Package, Truck } from "lucide-react";
import { getProducts } from "@/lib/data/products";
import {
  DEMO_MOVEMENTS,
  LOW_STOCK_THRESHOLD,
  extractSku,
} from "@/lib/data/demo-data";
import { ProductGrid } from "@/components/products/product-grid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { isDatabaseConfigured } from "@/lib/db";
import { sql } from "@/lib/db";

export default async function HomePage() {
  const products = await getProducts();
  const totalSkus = products.length;
  const lowStockItems = products.filter(
    (p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD
  );
  const outOfStockItems = products.filter((p) => p.stock <= 0);

  let pendingShipments = DEMO_MOVEMENTS.filter((m) => m.status === "pending").length;
  if (isDatabaseConfigured()) {
    try {
      const { rows } = await sql`
        SELECT COUNT(*)::int AS count FROM orders WHERE status IN ('pending', 'processing')
      `;
      pendingShipments = Number(rows[0]?.count ?? pendingShipments);
    } catch {
      // keep demo count
    }
  }

  const recentLowStock = lowStockItems.slice(0, 4);

  return (
    <>
      <section className="relative overflow-hidden bg-zinc-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-700/30 via-zinc-900 to-black opacity-90" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-widest text-amber-400/90">
              Warehouse Control Panel
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
              Real-time inventory &amp; dispatch operations
            </h1>
            <p className="mt-6 text-lg text-zinc-300">
              Monitor stock levels, manage pick lists, and track shipments across all warehouse zones.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/inventory">
                <Button size="lg" className="bg-amber-500 text-zinc-900 hover:bg-amber-400">
                  View Inventory <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/movements">
                <Button size="lg" variant="outline" className="border-zinc-600 text-white hover:bg-zinc-800">
                  Stock Movements
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <Package className="h-8 w-8 text-zinc-400" />
            <p className="mt-4 text-3xl font-bold text-zinc-900">{totalSkus}</p>
            <p className="text-sm text-zinc-600">Total SKUs</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
            <AlertTriangle className="h-8 w-8 text-amber-600" />
            <p className="mt-4 text-3xl font-bold text-amber-900">{lowStockItems.length}</p>
            <p className="text-sm text-amber-800">Low stock alerts</p>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <Package className="h-8 w-8 text-red-500" />
            <p className="mt-4 text-3xl font-bold text-red-900">{outOfStockItems.length}</p>
            <p className="text-sm text-red-800">Out of stock</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <Truck className="h-8 w-8 text-zinc-400" />
            <p className="mt-4 text-3xl font-bold text-zinc-900">{pendingShipments}</p>
            <p className="text-sm text-zinc-600">Pending shipments</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-zinc-900">Low stock alerts</h2>
              <Link href="/inventory?filter=low-stock" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
                View all →
              </Link>
            </div>
            {recentLowStock.length === 0 ? (
              <p className="mt-6 text-sm text-zinc-500">All items are above reorder threshold.</p>
            ) : (
              <ul className="mt-6 space-y-3">
                {recentLowStock.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/inventory/${item.slug}`}
                      className="flex items-center justify-between rounded-lg border border-amber-100 bg-amber-50/50 px-4 py-3 hover:bg-amber-50"
                    >
                      <div>
                        <p className="font-medium text-zinc-900">{extractSku(item.name)}</p>
                        <p className="text-sm text-zinc-600">{item.name.replace(/^SKU-[A-Z0-9-]+ — /, "")}</p>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800">
                        {item.stock} left
                      </Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-zinc-900">Recent movements</h2>
              <Link href="/movements" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
                View all →
              </Link>
            </div>
            <ul className="mt-6 space-y-3">
              {DEMO_MOVEMENTS.slice(0, 4).map((movement) => (
                <li
                  key={movement.id}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium capitalize text-zinc-900">
                      {movement.type} — {movement.quantity} units
                    </p>
                    <p className="text-xs text-zinc-500">{movement.item}</p>
                  </div>
                  <Badge
                    className={
                      movement.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : movement.status === "in-transit"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                    }
                  >
                    {movement.status.replace("-", " ")}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-zinc-900">Priority stock items</h2>
            <Link href="/inventory" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
              Full inventory →
            </Link>
          </div>
          <div className="mt-8">
            <ProductGrid products={products.filter((p) => p.featured).slice(0, 4)} />
          </div>
        </div>
      </section>
    </>
  );
}
