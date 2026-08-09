"use client";

import { useEffect, useState } from "react";
import { getGuestCart } from "@/lib/cart/guest-cart";
import { getCartItemsFromIds } from "@/app/actions/cart";
import { CartContent } from "@/components/cart/cart-content";
import type { CartLineItem } from "@/types/database";

export function CartPageClient({
  serverItems,
  isLoggedIn,
}: {
  serverItems: CartLineItem[];
  isLoggedIn: boolean;
}) {
  const [guestItems, setGuestItems] = useState<CartLineItem[] | null>(null);

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

  if (isLoggedIn) {
    return <CartContent items={serverItems} />;
  }

  if (guestItems === null) {
    return (
      <div className="py-16 text-center text-zinc-600">Loading cart...</div>
    );
  }

  return <CartContent items={guestItems} />;
}
