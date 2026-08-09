"use client";

import { ProductImage } from "@/components/ui/product-image";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { deleteProduct } from "@/app/actions/orders";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { extractSku, getStockStatus, getStockStatusLabel } from "@/lib/data/demo-data";
import type { Product } from "@/types/database";

export function AdminProductList({ products }: { products: Product[] }) {
  const handleDelete = async (id: string) => {
    if (!confirm("Remove this stock item from inventory?")) return;
    await deleteProduct(id);
    window.location.reload();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-zinc-900">Inventory items</h1>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="h-4 w-4" /> Add item
          </Button>
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-zinc-200">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50">
            <tr>
              <th className="px-4 py-3 font-medium text-zinc-600">Item</th>
              <th className="px-4 py-3 font-medium text-zinc-600">SKU</th>
              <th className="px-4 py-3 font-medium text-zinc-600">Zone</th>
              <th className="px-4 py-3 font-medium text-zinc-600">Qty</th>
              <th className="px-4 py-3 font-medium text-zinc-600">Status</th>
              <th className="px-4 py-3 font-medium text-zinc-600">Unit value</th>
              <th className="px-4 py-3 font-medium text-zinc-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {products.map((product) => {
              const status = getStockStatus(product.stock);
              return (
                <tr key={product.id} className="bg-white">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-zinc-100">
                        {product.image_url && (
                          <ProductImage
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        )}
                      </div>
                      <span className="font-medium text-zinc-900">
                        {product.name.replace(/^SKU-[A-Z0-9-]+ — /, "")}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{extractSku(product.name)}</td>
                  <td className="px-4 py-3">{product.categories?.name ?? "—"}</td>
                  <td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3">{getStockStatusLabel(status)}</td>
                  <td className="px-4 py-3">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-800"
                      aria-label="Delete item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
