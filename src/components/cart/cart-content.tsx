"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { extractSku } from "@/lib/data/demo-data";
import type { CartLineItem } from "@/types/database";

export function CartContent({ items }: { items: CartLineItem[] }) {
  const { updateItem, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-zinc-600">Your pick list is empty</p>
        <Link href="/inventory" className="mt-4 inline-block">
          <Button>Browse inventory</Button>
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="flex gap-4 rounded-xl border border-zinc-200 bg-white p-4"
          >
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-100">
              {item.product.image_url && (
                <Image
                  src={item.product.image_url}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              )}
            </div>
            <div className="flex flex-1 flex-col">
              <p className="font-mono text-xs text-zinc-500">{extractSku(item.product.name)}</p>
              <Link
                href={`/inventory/${item.product.slug}`}
                className="font-medium text-zinc-900 hover:underline"
              >
                {item.product.name.replace(/^SKU-[A-Z0-9-]+ — /, "")}
              </Link>
              <p className="mt-1 text-sm text-zinc-600">
                {formatPrice(item.product.price)}/unit
              </p>
              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="flex items-center rounded-lg border border-zinc-300">
                  <button
                    onClick={() =>
                      updateItem(item.product.id, item.quantity - 1)
                    }
                    className="px-2 py-1 text-zinc-600 hover:bg-zinc-50"
                    aria-label="Decrease"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateItem(item.product.id, item.quantity + 1)
                    }
                    className="px-2 py-1 text-zinc-600 hover:bg-zinc-50"
                    aria-label="Increase"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="text-zinc-400 hover:text-red-600"
                  aria-label="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="font-medium text-zinc-900">
              {formatPrice(item.product.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 h-fit">
        <h2 className="text-lg font-semibold text-zinc-900">Pick list summary</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-zinc-600">Items reserved</dt>
            <dd className="font-medium">{items.reduce((s, i) => s + i.quantity, 0)}</dd>
          </div>
          <div className="flex justify-between border-t border-zinc-200 pt-2 text-base">
            <dt className="font-semibold">Total value</dt>
            <dd className="font-semibold">{formatPrice(subtotal)}</dd>
          </div>
        </dl>
        <Link href="/dispatch" className="mt-6 block">
          <Button size="lg" className="w-full">
            Proceed to Dispatch
          </Button>
        </Link>
      </div>
    </div>
  );
}
