import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Warehouse Control Panel</h3>
            <p className="mt-3 text-sm text-zinc-600">
              Inventory management, pick lists, and dispatch operations for modern warehouse teams.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Operations</h3>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600">
              <li><Link href="/inventory" className="hover:text-zinc-900">Inventory</Link></li>
              <li><Link href="/inventory?filter=low-stock" className="hover:text-zinc-900">Low Stock Alerts</Link></li>
              <li><Link href="/pick-list" className="hover:text-zinc-900">Pick List</Link></li>
              <li><Link href="/dispatch" className="hover:text-zinc-900">Dispatch</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Staff</h3>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600">
              <li><Link href="/auth/sign-in" className="hover:text-zinc-900">Sign In</Link></li>
              <li><Link href="/auth/sign-up" className="hover:text-zinc-900">Register</Link></li>
              <li><Link href="/movements" className="hover:text-zinc-900">Stock Movements</Link></li>
              <li><Link href="/admin" className="hover:text-zinc-900">Admin Panel</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">Support</h3>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600">
              <li><span>Contact: ops@warehouse.local</span></li>
              <li><span>24/7 dispatch monitoring</span></li>
              <li><span>Multi-zone inventory tracking</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-zinc-200 pt-6 text-center text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} Warehouse Control Panel. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
