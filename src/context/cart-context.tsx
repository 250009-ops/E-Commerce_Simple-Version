"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  addToGuestCart,
  getGuestCart,
  getGuestCartCount,
  removeFromGuestCart,
  updateGuestCartItem,
} from "@/lib/cart/guest-cart";

type CartContextValue = {
  count: number;
  refresh: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setCount(getGuestCartCount());
      return;
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data } = await supabase
        .from("cart_items")
        .select("quantity")
        .eq("user_id", user.id);
      setCount(data?.reduce((sum, i) => sum + i.quantity, 0) ?? 0);
    } else {
      setCount(getGuestCartCount());
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function loadCount() {
      if (!isSupabaseConfigured()) {
        if (active) setCount(getGuestCartCount());
        return;
      }

      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!active) return;

        if (user) {
          const { data } = await supabase
            .from("cart_items")
            .select("quantity")
            .eq("user_id", user.id);
          setCount(data?.reduce((sum, i) => sum + i.quantity, 0) ?? 0);
        } else {
          setCount(getGuestCartCount());
        }
      } catch {
        if (active) setCount(getGuestCartCount());
      }
    }

    loadCount();
    return () => {
      active = false;
    };
  }, []);

  const addItem = useCallback(
    async (productId: string, quantity = 1) => {
      if (!isSupabaseConfigured()) {
        addToGuestCart(productId, quantity);
        await refresh();
        return;
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: existing } = await supabase
          .from("cart_items")
          .select("id, quantity")
          .eq("user_id", user.id)
          .eq("product_id", productId)
          .single();

        if (existing) {
          await supabase
            .from("cart_items")
            .update({ quantity: existing.quantity + quantity })
            .eq("id", existing.id);
        } else {
          await supabase.from("cart_items").insert({
            user_id: user.id,
            product_id: productId,
            quantity,
          });
        }
      } else {
        addToGuestCart(productId, quantity);
      }
      await refresh();
    },
    [refresh]
  );

  const updateItem = useCallback(
    async (productId: string, quantity: number) => {
      if (!isSupabaseConfigured()) {
        updateGuestCartItem(productId, quantity);
        await refresh();
        return;
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        if (quantity <= 0) {
          await supabase
            .from("cart_items")
            .delete()
            .eq("user_id", user.id)
            .eq("product_id", productId);
        } else {
          await supabase
            .from("cart_items")
            .update({ quantity })
            .eq("user_id", user.id)
            .eq("product_id", productId);
        }
      } else {
        updateGuestCartItem(productId, quantity);
      }
      await refresh();
    },
    [refresh]
  );

  const removeItem = useCallback(
    async (productId: string) => {
      if (!isSupabaseConfigured()) {
        removeFromGuestCart(productId);
        await refresh();
        return;
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await supabase
          .from("cart_items")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId);
      } else {
        removeFromGuestCart(productId);
      }
      await refresh();
    },
    [refresh]
  );

  return (
    <CartContext.Provider value={{ count, refresh, addItem, updateItem, removeItem }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export { getGuestCart };
