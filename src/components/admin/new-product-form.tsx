"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowLeft } from "lucide-react";
import { createProduct } from "@/app/actions/orders";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Category } from "@/types/database";

export function NewProductForm({ categories }: { categories: Category[] }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      return (await createProduct(formData)) ?? null;
    },
    null
  );

  return (
    <>
      <Link
        href="/admin/products"
        className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-zinc-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back to products
      </Link>

      <h1 className="text-3xl font-bold text-zinc-900">Add Product</h1>

      <form action={formAction} className="mt-8 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Name</label>
          <Input name="name" required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Slug</label>
          <Input name="slug" required placeholder="product-url-slug" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Description</label>
          <textarea
            name="description"
            rows={4}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Price ($)</label>
            <Input name="price" type="number" step="0.01" min="0" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">Stock</label>
            <Input name="stock" type="number" min="0" required defaultValue="0" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Image URL</label>
          <Input name="imageUrl" type="url" placeholder="https://images.unsplash.com/..." />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Category</label>
          <select
            name="categoryId"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
          >
            <option value="">None</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" className="rounded" />
          Featured product
        </label>

        {state?.error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.error}</p>
        )}

        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Creating..." : "Create Product"}
        </Button>
      </form>
    </>
  );
}
