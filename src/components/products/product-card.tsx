import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/database";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
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
        {product.featured && (
          <div className="absolute left-3 top-3">
            <Badge className="bg-zinc-900 text-white">Featured</Badge>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        {product.categories && (
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            {product.categories.name}
          </p>
        )}
        <h3 className="mt-1 font-medium text-zinc-900 group-hover:underline">
          {product.name}
        </h3>
        <p className="mt-auto pt-2 text-lg font-semibold text-zinc-900">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
