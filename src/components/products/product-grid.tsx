import { ProductCard } from "./product-card";
import type { Product } from "@/types/database";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-zinc-600">No inventory items found.</p>
        <p className="mt-1 text-sm text-zinc-500">Try adjusting your search or zone filter.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
