import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import {
  extractSku,
  getStockStatus,
  getStockStatusLabel,
} from "@/lib/data/demo-data";
import type { Product } from "@/types/database";

export function ProductCard({ product }: { product: Product }) {
  const status = getStockStatus(product.stock);

  return (
    <Link
      href={`/inventory/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-zinc-100">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-400">
            No image
          </div>
        )}
        <div className="absolute left-3 top-3 flex flex-col gap-1">
          {product.featured && (
            <Badge className="bg-amber-500 text-zinc-900">Priority</Badge>
          )}
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
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="font-mono text-xs text-zinc-500">{extractSku(product.name)}</p>
        {product.categories && (
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
            {product.categories.name}
          </p>
        )}
        <h3 className="mt-1 font-medium text-zinc-900 group-hover:underline">
          {product.name.replace(/^SKU-[A-Z0-9-]+ — /, "")}
        </h3>
        <div className="mt-auto flex items-center justify-between pt-2">
          <p className="text-sm font-semibold text-zinc-900">Qty: {product.stock}</p>
          <p className="text-sm text-zinc-500">{formatPrice(product.price)}/unit</p>
        </div>
      </div>
    </Link>
  );
}
