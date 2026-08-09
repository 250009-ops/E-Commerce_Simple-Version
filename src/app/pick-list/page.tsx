import { getSession } from "@/lib/auth";
import { getCartItems } from "@/app/actions/cart";
import { CartPageClient } from "@/components/cart/cart-page-client";
import type { CartLineItem } from "@/types/database";

export const metadata = {
  title: "Pick List — Warehouse Control Panel",
};

export default async function PickListPage() {
  const user = await getSession();
  const serverItems: CartLineItem[] = user ? await getCartItems() : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-zinc-900">Pick List</h1>
      <p className="mb-8 text-sm text-zinc-600">
        Items reserved for outbound dispatch or internal transfer.
      </p>
      <CartPageClient serverItems={serverItems} isLoggedIn={!!user} />
    </div>
  );
}
