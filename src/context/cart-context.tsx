"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  addCartItem,
  getCartCount,
  isUserLoggedIn,
  removeCartItem,
  updateCartItem,
} from "@/app/actions/cart";
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
    const loggedIn = await isUserLoggedIn();
    if (loggedIn) {
      setCount(await getCartCount());
    } else {
      setCount(getGuestCartCount());
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function loadCount() {
      const loggedIn = await isUserLoggedIn();
      if (!active) return;

      if (loggedIn) {
        setCount(await getCartCount());
      } else {
        setCount(getGuestCartCount());
      }
    }

    loadCount();
    return () => {
      active = false;
    };
  }, []);

  const addItem = useCallback(
    async (productId: string, quantity = 1) => {
      const loggedIn = await isUserLoggedIn();
      if (loggedIn) {
        await addCartItem(productId, quantity);
      } else {
        addToGuestCart(productId, quantity);
      }
      await refresh();
    },
    [refresh]
  );

  const updateItem = useCallback(
    async (productId: string, quantity: number) => {
      const loggedIn = await isUserLoggedIn();
      if (loggedIn) {
        await updateCartItem(productId, quantity);
      } else {
        updateGuestCartItem(productId, quantity);
      }
      await refresh();
    },
    [refresh]
  );

  const removeItem = useCallback(
    async (productId: string) => {
      const loggedIn = await isUserLoggedIn();
      if (loggedIn) {
        await removeCartItem(productId);
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
