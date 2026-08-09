"use client";

import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingBag, Check } from "lucide-react";
import type { Product } from "@/types/database";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    await addItem(product.id, quantity);
    setLoading(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const outOfStock = product.stock <= 0;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="flex items-center rounded-lg border border-zinc-300">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="px-3 py-2 text-zinc-600 hover:bg-zinc-50"
          disabled={outOfStock}
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-12 text-center text-sm font-medium">{quantity}</span>
        <button
          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
          className="px-3 py-2 text-zinc-600 hover:bg-zinc-50"
          disabled={outOfStock}
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <Button
        onClick={handleAdd}
        disabled={loading || outOfStock}
        size="lg"
        className="flex-1 sm:flex-none"
      >
        {added ? (
          <>
            <Check className="h-4 w-4" /> Added!
          </>
        ) : outOfStock ? (
          "Out of Stock"
        ) : (
          <>
            <ShoppingBag className="h-4 w-4" /> Add to Cart
          </>
        )}
      </Button>
    </div>
  );
}
