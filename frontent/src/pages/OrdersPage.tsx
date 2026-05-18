import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PackageCheck } from "lucide-react";
import Navbar from "../components/NavBar";
import { getOrders } from "../services/orderService";
import type { TOrder } from "../types";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

export default function OrdersPage() {
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const placedId = searchParams.get("placed");

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Orders</h1>
            <p className="text-sm text-slate-500">{orders.length} orders</p>
          </div>
          <PackageCheck size={26} className="text-blue-700" />
        </div>

        {placedId && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            Order #{placedId} placed successfully.
          </div>
        )}

        {loading ? (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-500">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-10 text-center">
            <p className="text-slate-500">No orders yet.</p>
            <Link to="/" className="mt-4 inline-flex rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white">
              Browse products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <article key={order.id} className="rounded-lg border border-slate-200 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <h2 className="font-semibold">Order #{order.id}</h2>
                    <p className="text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                      {order.status}
                    </span>
                    <p className="mt-2 font-semibold">{currency.format(order.totalAmount)}</p>
                  </div>
                </div>
                <div className="mt-3 divide-y divide-slate-100">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between gap-3 py-3 text-sm">
                      <div>
                        <Link to={`/products/${item.productId}`} className="font-medium hover:text-blue-700">
                          {item.productName}
                        </Link>
                        <p className="text-slate-500">Qty {item.quantity}</p>
                      </div>
                      <span>{currency.format(item.lineTotal)}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-sm text-slate-500">
                  {order.shippingName}, {order.shippingCity}, {order.shippingState} - {order.shippingPincode}
                </p>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
