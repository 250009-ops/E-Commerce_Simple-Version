import { ProductImage } from "@/components/ui/product-image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProductBySlug } from "@/lib/data/products";
import { formatPrice } from "@/lib/format";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import {
  extractSku,
  getStockStatus,
  getStockStatusLabel,
} from "@/lib/data/demo-data";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return {
    title: product ? `${extractSku(product.name)} — Warehouse` : "Item Not Found",
  };
}

export default async function InventoryDetailPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const status = getStockStatus(product.stock);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/inventory"
        className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-zinc-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back to inventory
      </Link>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-100">
          {product.image_url ? (
            <ProductImage
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-400">
              No image available
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            {product.categories && (
              <Badge className="w-fit">{product.categories.name}</Badge>
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

          <p className="mt-3 font-mono text-sm text-zinc-500">{extractSku(product.name)}</p>
          <h1 className="mt-1 text-3xl font-bold text-zinc-900 sm:text-4xl">
            {product.name.replace(/^SKU-[A-Z0-9-]+ — /, "")}
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Unit value: {formatPrice(product.price)}
          </p>

          <p className="mt-6 text-zinc-600 leading-relaxed">
            {product.description}
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm">
            <div>
              <dt className="text-zinc-500">Quantity on hand</dt>
              <dd className="mt-1 text-lg font-semibold text-zinc-900">{product.stock}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Location</dt>
              <dd className="mt-1 font-medium text-zinc-900">
                {product.categories?.name ?? "Unassigned"}
              </dd>
            </div>
          </dl>

          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
