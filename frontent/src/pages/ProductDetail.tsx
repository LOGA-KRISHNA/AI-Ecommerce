import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, ShoppingCart, Star } from "lucide-react";
import Navbar from "../components/NavBar";
import { addCartItem } from "../services/cartService";
import { getProduct } from "../services/productService";
import { showToast } from "../store/toastSlice";
import type { RootState } from "../store";
import type { TProduct } from "../types";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = Boolean(token || localStorage.getItem("token"));
  const [product, setProduct] = useState<TProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getProduct(id)
      .then(setProduct)
      .catch(() => dispatch(showToast({ type: "error", message: "Product not found" })))
      .finally(() => setLoading(false));
  }, [dispatch, id]);

  const handleAdd = async () => {
    if (!product) return;
    if (!isAuthenticated) {
      dispatch(showToast({ type: "error", message: "Login to add items to cart" }));
      navigate("/profile");
      return;
    }

    try {
      await addCartItem(product.id, quantity);
      dispatch(showToast({ type: "success", message: "Added to cart" }));
      navigate("/cart");
    } catch {
      dispatch(showToast({ type: "error", message: "Could not add item" }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link to="/" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950">
          <ArrowLeft size={18} />
          Products
        </Link>

        {loading ? (
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-lg bg-slate-200" />
            <div className="h-96 animate-pulse rounded-lg bg-slate-200" />
          </div>
        ) : product ? (
          <section className="grid gap-8 lg:grid-cols-2">
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <img
                src={product.imageUrls?.[0] || "/favicon.svg"}
                alt={product.name}
                className="aspect-square w-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-sm font-medium text-blue-700">{product.category?.name}</p>
                <h1 className="mt-2 text-3xl font-semibold">{product.name}</h1>
                <div className="mt-3 flex items-center gap-2 text-sm text-amber-600">
                  <Star size={17} fill="currentColor" />
                  {product.reviewsCount || 0} reviews
                </div>
              </div>
              <p className="text-base leading-7 text-slate-600">{product.description}</p>
              <div className="flex flex-wrap gap-2">
                {product.tags?.map((tag) => (
                  <span key={tag} className="rounded-md bg-slate-200 px-2 py-1 text-xs text-slate-700">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-3xl font-semibold">{currency.format(product.price)}</p>
                <p className="mt-1 text-sm text-slate-500">{product.stockQuantity} in stock</p>
                <div className="mt-5 flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    max={Math.max(product.stockQuantity, 1)}
                    value={quantity}
                    onChange={(event) => setQuantity(Number(event.target.value))}
                    className="h-11 w-24 rounded-md border border-slate-200 px-3 outline-none"
                  />
                  <button
                    onClick={handleAdd}
                    disabled={product.stockQuantity === 0}
                    className="inline-flex h-11 items-center gap-2 rounded-md bg-blue-700 px-5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    <ShoppingCart size={18} />
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-500">
            Product not found.
          </div>
        )}
      </main>
    </div>
  );
}
