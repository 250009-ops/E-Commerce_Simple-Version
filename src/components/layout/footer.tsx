import Link from "next/link";

const footerLinks = [
  { href: "/inventory", label: "Inventory" },
  { href: "/pick-list", label: "Pick List" },
  { href: "/dispatch", label: "Dispatch" },
  { href: "/movements", label: "Stock Movements" },
  { href: "/admin", label: "Admin" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <Link href="/" className="text-sm font-bold tracking-tight text-zinc-900">
            Warehouse<span className="text-amber-600">CP</span>
          </Link>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-zinc-600">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-zinc-900">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-6 text-center text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} WarehouseCP. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
