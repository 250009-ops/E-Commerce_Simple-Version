import Link from "next/link";
import { getProducts, getCategories } from "@/lib/data/products";
import { ProductGrid } from "@/components/products/product-grid";
import { cn } from "@/lib/utils";
import {
  extractSku,
  getStockStatus,
  getStockStatusLabel,
  LOW_STOCK_THRESHOLD,
} from "@/lib/data/demo-data";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Inventory — Warehouse Control Panel",
};

type SearchParams = Promise<{
  category?: string;
  search?: string;
  featured?: string;
  filter?: string;
}>;

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const products = await getProducts({
    category: params.category,
    search: params.search,
    featured: params.featured === "true",
  });
  const categories = await getCategories();

  const filteredProducts =
    params.filter === "low-stock"
      ? products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD)
      : products;

  const title = params.search
    ? `Results for "${params.search}"`
    : params.category
      ? categories.find((c) => c.slug === params.category)?.name ?? "Inventory"
      : params.featured === "true"
        ? "Priority stock items"
        : params.filter === "low-stock"
          ? "Low stock alerts"
          : "All inventory";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
        <aside className="lg:w-56 flex-shrink-0">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Zones / Categories
          </h2>
          <nav className="mt-4 space-y-1">
            <Link
              href="/inventory"
              className={cn(
                "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                !params.category && !params.filter
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-600 hover:bg-zinc-100"
              )}
            >
              All items
            </Link>
            <Link
              href="/inventory?filter=low-stock"
              className={cn(
                "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                params.filter === "low-stock"
                  ? "bg-amber-600 text-white"
                  : "text-zinc-600 hover:bg-zinc-100"
              )}
            >
              Low stock alerts
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/inventory?category=${cat.slug}`}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  params.category === cat.slug
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-600 hover:bg-zinc-100"
                )}
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-900">{title}</h1>
            <p className="mt-1 text-sm text-zinc-500">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "item" : "items"}
            </p>
          </div>

          <div className="mb-8 overflow-x-auto rounded-xl border border-zinc-200 lg:hidden">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-zinc-600">SKU</th>
                  <th className="px-4 py-3 font-medium text-zinc-600">Qty</th>
                  <th className="px-4 py-3 font-medium text-zinc-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredProducts.map((item) => {
                  const status = getStockStatus(item.stock);
                  return (
                    <tr key={item.id} className="bg-white">
                      <td className="px-4 py-3">
                        <Link href={`/inventory/${item.slug}`} className="font-medium hover:underline">
                          {extractSku(item.name)}
                        </Link>
                      </td>
                      <td className="px-4 py-3">{item.stock}</td>
                      <td className="px-4 py-3">
                        <Badge
                          className={
                            status === "low-stock"
                              ? "bg-amber-100 text-amber-800"
                              : status === "out-of-stock"
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                          }
                        >
                          {getStockStatusLabel(status)}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="hidden lg:block">
            <ProductGrid products={filteredProducts} />
          </div>
          <div className="lg:hidden">
            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </div>
    </div>
  );
}
