import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Storefront</h3>
            <p className="mt-3 text-sm text-zinc-600">
              Curated products for modern living. Quality you can trust, delivered to your door.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Shop</h3>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600">
              <li><Link href="/products" className="hover:text-zinc-900">All Products</Link></li>
              <li><Link href="/products?category=electronics" className="hover:text-zinc-900">Electronics</Link></li>
              <li><Link href="/products?category=clothing" className="hover:text-zinc-900">Clothing</Link></li>
              <li><Link href="/products?category=home-living" className="hover:text-zinc-900">Home & Living</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Account</h3>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600">
              <li><Link href="/auth/sign-in" className="hover:text-zinc-900">Sign In</Link></li>
              <li><Link href="/auth/sign-up" className="hover:text-zinc-900">Create Account</Link></li>
              <li><Link href="/orders" className="hover:text-zinc-900">Order History</Link></li>
              <li><Link href="/cart" className="hover:text-zinc-900">Shopping Cart</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Support</h3>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600">
              <li><span>Contact: support@storefront.com</span></li>
              <li><span>Free shipping over $100</span></li>
              <li><span>30-day returns</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-zinc-200 pt-6 text-center text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} Storefront. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
