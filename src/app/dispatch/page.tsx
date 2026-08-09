import { getSession } from "@/lib/auth";
import { getCartItems } from "@/app/actions/cart";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import type { CartLineItem } from "@/types/database";

export const metadata = {
  title: "Dispatch — Warehouse Control Panel",
};

export default async function DispatchPage() {
  const user = await getSession();
  const serverItems: CartLineItem[] = user ? await getCartItems() : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-zinc-900">Stock Dispatch</h1>
      <p className="mb-8 text-sm text-zinc-600">
        Record outgoing stock and create a shipment movement.
      </p>
      <CheckoutForm
        isLoggedIn={!!user}
        serverItems={serverItems}
        userEmail={user?.email}
      />
    </div>
  );
}
