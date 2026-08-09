import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProducts } from "@/lib/data/products";
import { AdminProductList } from "@/components/admin/admin-product-list";

export const metadata = {
  title: "Manage Inventory — Warehouse Admin",
};

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-zinc-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>
      <AdminProductList products={products} />
    </div>
  );
}
