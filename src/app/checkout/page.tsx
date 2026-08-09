import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getCartItems } from "@/app/actions/cart";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import type { CartLineItem } from "@/types/database";

export const metadata = {
  title: "Checkout — Storefront",
};

export default async function CheckoutPage() {
  let user = null;
  let serverItems: CartLineItem[] = [];

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
    serverItems = user ? await getCartItems() : [];
  }

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
