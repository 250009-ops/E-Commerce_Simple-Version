"use client";

import { useEffect } from "react";
import { mergeGuestCart } from "@/app/actions/cart";
import { getGuestCart, clearGuestCart } from "@/lib/cart/guest-cart";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useCart } from "@/context/cart-context";

export function GuestCartMerger() {
  const { refresh } = useCart();

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    let active = true;

    async function merge() {
      const guestItems = getGuestCart();
      if (guestItems.length === 0) return;

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !active) return;

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
