import Link from "next/link";
import { getUserOrders } from "@/app/actions/orders";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "My Orders — Storefront",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

type SearchParams = Promise<{ success?: string }>;

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const orders = await getUserOrders();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-zinc-900">My Orders</h1>

      {params.success && (
        <div className="mt-4 rounded-lg bg-green-50 p-4 text-sm text-green-700">
          Order placed successfully! Your order ID is{" "}
          <span className="font-mono font-medium">{params.success.slice(0, 8)}...</span>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-lg text-zinc-600">No orders yet</p>
          <Link href="/products" className="mt-4 inline-block">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-zinc-200 bg-white p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-zinc-500">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="mt-1 font-mono text-sm text-zinc-600">
                    #{order.id.slice(0, 8)}
                  </p>
                </div>
                <Badge className={statusColors[order.status] ?? ""}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
                <p className="text-lg font-semibold text-zinc-900">
                  {formatPrice(Number(order.total))}
                </p>
              </div>
              {order.order_items && order.order_items.length > 0 && (
                <ul className="mt-4 space-y-2 border-t border-zinc-100 pt-4">
                  {order.order_items.map((item: { id: string; product_name: string; quantity: number; price: number }) => (
                    <li key={item.id} className="flex justify-between text-sm">
                      <span className="text-zinc-600">
                        {item.product_name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        {formatPrice(Number(item.price) * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
