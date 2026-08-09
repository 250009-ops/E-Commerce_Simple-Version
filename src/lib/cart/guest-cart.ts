"use client";

const GUEST_CART_KEY = "ecommerce_guest_cart";

import type { GuestCartItem } from "@/types/database";

export function getGuestCart(): GuestCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveGuestCart(items: GuestCartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

export function addToGuestCart(productId: string, quantity = 1): GuestCartItem[] {
  const cart = getGuestCart();
  const existing = cart.find((i) => i.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }
  saveGuestCart(cart);
  return cart;
}

export function updateGuestCartItem(
  productId: string,
  quantity: number
): GuestCartItem[] {
  let cart = getGuestCart();
  if (quantity <= 0) {
    cart = cart.filter((i) => i.productId !== productId);
  } else {
    const item = cart.find((i) => i.productId === productId);
    if (item) item.quantity = quantity;
  }
  saveGuestCart(cart);
  return cart;
}

export function removeFromGuestCart(productId: string): GuestCartItem[] {
  const cart = getGuestCart().filter((i) => i.productId !== productId);
  saveGuestCart(cart);
  return cart;
}

export function clearGuestCart(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(GUEST_CART_KEY);
}

export function getGuestCartCount(): number {
  return getGuestCart().reduce((sum, i) => sum + i.quantity, 0);
}
