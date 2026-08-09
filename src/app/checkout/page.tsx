import { getSession } from "@/lib/auth";
import { getCartItems } from "@/app/actions/cart";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import type { CartLineItem } from "@/types/database";

export const metadata = {
  title: "Checkout — Storefront",
};

export default async function CheckoutPage() {
  const user = await getSession();
  const serverItems: CartLineItem[] = user ? await getCartItems() : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900">Checkout</h1>
      <CheckoutForm
        isLoggedIn={!!user}
        serverItems={serverItems}
        userEmail={user?.email}
      />
    </div>
  );
}
