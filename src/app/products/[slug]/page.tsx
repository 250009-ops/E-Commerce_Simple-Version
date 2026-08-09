import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProductBySlug } from "@/lib/data/products";
import { formatPrice } from "@/lib/format";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Badge } from "@/components/ui/badge";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return {
    title: product ? `${product.name} — Storefront` : "Product Not Found",
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/products"
        className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-zinc-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back to products
      </Link>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-100">
          {product.image_url ? (
            <Image
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
          {product.categories && (
            <Badge className="w-fit">{product.categories.name}</Badge>
          )}
          <h1 className="mt-3 text-3xl font-bold text-zinc-900 sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-4 text-2xl font-semibold text-zinc-900">
            {formatPrice(product.price)}
          </p>

          <p className="mt-6 text-zinc-600 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-4 text-sm text-zinc-500">
            {product.stock > 0 ? (
              <span className="text-green-700">
                {product.stock} in stock
              </span>
            ) : (
              <span className="text-red-600">Out of stock</span>
            )}
          </div>

          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
