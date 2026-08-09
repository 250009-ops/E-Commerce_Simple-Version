"use client";

import { useEffect } from "react";
import { mergeGuestCart, isUserLoggedIn } from "@/app/actions/cart";
import { getGuestCart, clearGuestCart } from "@/lib/cart/guest-cart";
import { useCart } from "@/context/cart-context";

export function GuestCartMerger() {
  const { refresh } = useCart();

  useEffect(() => {
    let active = true;

    async function merge() {
      const guestItems = getGuestCart();
      if (guestItems.length === 0) return;

      const loggedIn = await isUserLoggedIn();
      if (!loggedIn || !active) return;

      await mergeGuestCart(guestItems);
      clearGuestCart();
      await refresh();
    }

    merge();
    return () => {
      active = false;
    };
  }, [refresh]);

  return null;
}
