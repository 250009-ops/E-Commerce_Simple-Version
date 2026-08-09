"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getGuestCart, clearGuestCart } from "@/lib/cart/guest-cart";
import { getCartItemsFromIds } from "@/app/actions/cart";
import { createOrder } from "@/app/actions/orders";
import { formatPrice } from "@/lib/format";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { CartLineItem, ShippingAddress } from "@/types/database";

function CheckoutSummary({
  items,
  submitting,
  error,
}: {
  items: CartLineItem[];
  submitting: boolean;
  error: string | null;
}) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const total = subtotal + shipping;

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 h-fit">
      <h2 className="text-lg font-semibold text-zinc-900">Order Summary</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.product.id} className="flex justify-between text-sm">
            <span className="text-zinc-600">
              {item.product.name} × {item.quantity}
            </span>
            <span className="font-medium">
              {formatPrice(item.product.price * item.quantity)}
            </span>
          </li>
        ))}
      </ul>
      <dl className="mt-4 space-y-2 border-t border-zinc-200 pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-zinc-600">Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-zinc-600">Shipping</dt>
          <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
        </div>
        <div className="flex justify-between text-base font-semibold">
          <dt>Total</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>
      {error && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}
      <Button type="submit" size="lg" className="mt-6 w-full" disabled={submitting}>
        {submitting ? "Placing Order..." : "Place Order"}
      </Button>
    </div>
  );
}

export function CheckoutForm({
  isLoggedIn,
  serverItems,
  userEmail,
}: {
  isLoggedIn: boolean;
  serverItems: CartLineItem[];
  userEmail?: string;
}) {
  const router = useRouter();
  const [guestItems, setGuestItems] = useState<CartLineItem[] | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn) return;

    let active = true;

    async function loadGuestCart() {
      const guestCart = getGuestCart();
      const items =
        guestCart.length === 0
          ? []
          : await getCartItemsFromIds(guestCart);
      if (active) setGuestItems(items);
    }

    loadGuestCart();
    return () => {
      active = false;
    };
  }, [isLoggedIn]);

  const items = isLoggedIn ? serverItems : guestItems;

  if (!isLoggedIn && items === null) {
    return <div className="py-16 text-center text-zinc-600">Loading...</div>;
  }

  const cartItems = items ?? [];

  if (cartItems.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-zinc-600">Your cart is empty</p>
        <Button className="mt-4" onClick={() => router.push("/products")}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const shippingAddress: ShippingAddress = {
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      zip: formData.get("zip") as string,
      country: formData.get("country") as string,
    };

    const cartPayload = cartItems.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));

    const result = await createOrder(cartPayload, shippingAddress);

    if (result.success) {
      clearGuestCart();
      router.push(`/orders?success=${result.orderId}`);
    } else {
      setError(result.error ?? "Something went wrong");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Shipping Address</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-zinc-700">Full Name</label>
              <Input name="fullName" required />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-zinc-700">Email</label>
              <Input name="email" type="email" required defaultValue={userEmail} />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-zinc-700">Address</label>
              <Input name="address" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">City</label>
              <Input name="city" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">State</label>
              <Input name="state" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">ZIP Code</label>
              <Input name="zip" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-700">Country</label>
              <Input name="country" required defaultValue="United States" />
            </div>
          </div>
        </div>
      </div>
      <CheckoutSummary items={cartItems} submitting={submitting} error={error} />
    </form>
  );
}

