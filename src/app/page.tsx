import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProducts, getCategories } from "@/lib/data/products";
import { ProductGrid } from "@/components/products/product-grid";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getProducts({ featured: true }),
    getCategories(),
  ]);

  return (
    <>
      <section className="relative overflow-hidden bg-zinc-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-700 via-zinc-900 to-black opacity-80" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-widest text-zinc-400">
              New Collection 2026
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
              Curated products for modern living
            </h1>
            <p className="mt-6 text-lg text-zinc-300">
              Discover thoughtfully selected items across electronics, fashion, home, and sports.
              Free shipping on orders over $100.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-white text-zinc-900 hover:bg-zinc-100">
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/products?featured=true">
                <Button size="lg" variant="outline" className="border-zinc-600 text-white hover:bg-zinc-800">
                  Featured Items
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-zinc-900">Shop by Category</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group rounded-xl border border-zinc-200 bg-white p-6 text-center transition-shadow hover:shadow-md"
            >
              <h3 className="font-semibold text-zinc-900 group-hover:underline">
                {cat.name}
              </h3>
              <p className="mt-1 text-sm text-zinc-500 line-clamp-2">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-zinc-900">Featured Products</h2>
            <Link
              href="/products"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              View all →
            </Link>
          </div>
          <div className="mt-8">
            <ProductGrid products={featuredProducts.slice(0, 8)} />
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-zinc-50 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-zinc-900">Why Shop With Us</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            <div>
              <h3 className="font-semibold text-zinc-900">Free Shipping</h3>
              <p className="mt-2 text-sm text-zinc-600">
                On all orders over $100. Fast delivery to your doorstep.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900">Easy Returns</h3>
              <p className="mt-2 text-sm text-zinc-600">
                30-day hassle-free returns on all purchases.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900">Secure Checkout</h3>
              <p className="mt-2 text-sm text-zinc-600">
                Your data is protected with industry-standard encryption.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
