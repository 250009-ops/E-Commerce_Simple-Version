import Link from "next/link";
import { getProducts, getCategories } from "@/lib/data/products";
import { ProductGrid } from "@/components/products/product-grid";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Shop All Products — Storefront",
};

type SearchParams = Promise<{ category?: string; search?: string; featured?: string }>;

export default async function ProductsPage({
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

  const title = params.search
    ? `Results for "${params.search}"`
    : params.category
      ? categories.find((c) => c.slug === params.category)?.name ?? "Products"
      : params.featured === "true"
        ? "Featured Products"
        : "All Products";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
        <aside className="lg:w-56 flex-shrink-0">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Categories
          </h2>
          <nav className="mt-4 space-y-1">
            <Link
              href="/products"
              className={cn(
                "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                !params.category
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-600 hover:bg-zinc-100"
              )}
            >
              All Products
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
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
              {products.length} {products.length === 1 ? "product" : "products"}
            </p>
          </div>
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}
