"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ClipboardList, Search, User, Menu, X, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { getSessionUser, signOut } from "@/app/actions/auth";
import { useCart } from "@/context/cart-context";
import { cn } from "@/lib/utils";
import type { SessionUser } from "@/types/database";

const navLinks = [
  { href: "/inventory", label: "Inventory" },
  { href: "/inventory?category=zone-a-electronics", label: "Zone A" },
  { href: "/inventory?category=zone-b-apparel", label: "Zone B" },
  { href: "/inventory?category=zone-c-home", label: "Zone C" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getSessionUser().then(setUser);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/inventory?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold tracking-tight text-zinc-900">
            Warehouse<span className="text-amber-600">CP</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-zinc-900",
                  pathname === link.href ? "text-zinc-900" : "text-zinc-500"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100"
            aria-label="Search inventory"
          >
            <Search className="h-5 w-5" />
          </button>

          <Link
            href="/pick-list"
            className="relative rounded-lg p-2 text-zinc-600 hover:bg-zinc-100"
            aria-label="Pick list"
          >
            <ClipboardList className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-zinc-900">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/movements"
                className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100"
                aria-label="Stock movements"
              >
                <Truck className="h-5 w-5" />
              </Link>
              {user.isAdmin && (
                <Link
                  href="/admin"
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/auth/sign-in"
              className="hidden items-center gap-1 rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 sm:flex"
            >
              <User className="h-5 w-5" />
              <span className="text-sm font-medium">Sign in</span>
            </Link>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 md:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-zinc-200 px-4 py-3 sm:px-6">
          <form onSubmit={handleSearch} className="mx-auto flex max-w-xl gap-2">
            <input
              type="search"
              placeholder="Search inventory by SKU or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {mobileOpen && (
        <div className="border-t border-zinc-200 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-zinc-700"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/movements" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-zinc-700">
                  Stock Movements
                </Link>
                {user.isAdmin && (
                  <Link href="/admin" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-zinc-700">
                    Admin
                  </Link>
                )}
                <button onClick={handleSignOut} className="text-left text-sm font-medium text-zinc-700">
                  Sign out
                </button>
              </>
            ) : (
              <Link href="/auth/sign-in" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-zinc-700">
                Sign in
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
