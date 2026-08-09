import { getCategories } from "@/lib/data/products";
import { NewProductForm } from "@/components/admin/new-product-form";

export const metadata = {
  title: "Add Product — Admin",
};

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <NewProductForm categories={categories} />
    </div>
  );
}
