import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import Navbar from "../components/NavBar";
import { getAddresses } from "../services/addressService";
import { getCart, removeCartItem, updateCartItem } from "../services/cartService";
import { createOrder } from "../services/orderService";
import type { TAddress, TCart, TCreateOrderPayload } from "../types";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

const emptyCart: TCart = {
  items: [],
  totalItems: 0,
  subtotal: 0,
};

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<TCart>(emptyCart);
  const [addresses, setAddresses] = useState<TAddress[]>([]);
  const [form, setForm] = useState<TCreateOrderPayload>({
    shippingName: "",
    shippingCity: "",
    shippingState: "",
    shippingPincode: "",
  });
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const defaultAddress = useMemo(
    () => addresses.find((address) => address.isDefault) || addresses[0],
    [addresses]
  );

  useEffect(() => {
    Promise.all([getCart(), getAddresses()])
      .then(([cartData, addressData]) => {
        setCart(cartData);
        setAddresses(addressData);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!defaultAddress) return;
    setForm({
      shippingName: defaultAddress.name,
      shippingCity: defaultAddress.city,
      shippingState: defaultAddress.state,
      shippingPincode: defaultAddress.pincode,
    });
  }, [defaultAddress]);

  const updateQuantity = async (itemId: number, quantity: number) => {
    const updatedCart = await updateCartItem(itemId, Math.max(quantity, 0));
    setCart(updatedCart);
  };

  const removeItem = async (itemId: number) => {
    const updatedCart = await removeCartItem(itemId);
    setCart(updatedCart);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPlacingOrder(true);
    try {
      const order = await createOrder(form);
      navigate(`/orders?placed=${order.id}`);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <section className="rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-4">
            <h1 className="text-2xl font-semibold">Cart</h1>
          </div>

          {loading ? (
            <div className="p-6 text-slate-500">Loading cart...</div>
          ) : cart.items.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-slate-500">Your cart is empty.</p>
              <Link to="/" className="mt-4 inline-flex rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white">
                Browse products
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {cart.items.map((item) => (
                <div key={item.id} className="grid gap-4 p-4 sm:grid-cols-[96px_1fr_auto]">
                  <img
                    src={item.imageUrl || "/favicon.svg"}
                    alt={item.productName}
                    className="h-24 w-24 rounded-md object-cover"
                  />
                  <div>
                    <Link to={`/products/${item.productId}`} className="font-semibold hover:text-blue-700">
                      {item.productName}
                    </Link>
                    <p className="mt-1 text-sm text-slate-500">{currency.format(item.unitPrice)}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.availableStock} available</p>
                  </div>
                  <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                    <div className="flex h-10 items-center rounded-md border border-slate-200">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="grid h-10 w-10 place-items-center"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="grid h-10 w-10 place-items-center"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <p className="font-semibold">{currency.format(item.lineTotal)}</p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="grid h-9 w-9 place-items-center rounded-md border border-slate-200 text-red-600"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="text-lg font-semibold">Checkout</h2>
          <div className="mt-4 space-y-2 border-b border-slate-200 pb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Items</span>
              <span>{cart.totalItems}</span>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>{currency.format(cart.subtotal)}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <input
              value={form.shippingName}
              onChange={(event) => setForm({ ...form, shippingName: event.target.value })}
              placeholder="Full name"
              required
              className="h-11 w-full rounded-md border border-slate-200 px-3 text-sm outline-none"
            />
            <input
              value={form.shippingCity}
              onChange={(event) => setForm({ ...form, shippingCity: event.target.value })}
              placeholder="City"
              required
              className="h-11 w-full rounded-md border border-slate-200 px-3 text-sm outline-none"
            />
            <input
              value={form.shippingState}
              onChange={(event) => setForm({ ...form, shippingState: event.target.value })}
              placeholder="State"
              required
              className="h-11 w-full rounded-md border border-slate-200 px-3 text-sm outline-none"
            />
            <input
              value={form.shippingPincode}
              onChange={(event) => setForm({ ...form, shippingPincode: event.target.value })}
              placeholder="Pincode"
              required
              className="h-11 w-full rounded-md border border-slate-200 px-3 text-sm outline-none"
            />
            <button
              disabled={cart.items.length === 0 || placingOrder}
              className="h-11 w-full rounded-md bg-blue-700 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {placingOrder ? "Placing order..." : "Place order"}
            </button>
          </form>
        </aside>
      </main>
    </div>
  );
}
