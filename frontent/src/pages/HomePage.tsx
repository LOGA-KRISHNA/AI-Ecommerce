import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Search, ShoppingCart, SlidersHorizontal, Star } from "lucide-react";
import Navbar from "../components/NavBar";
import { addCartItem } from "../services/cartService";
import { getCategories, getProducts } from "../services/productService";
import { showToast } from "../store/toastSlice";
import type { RootState } from "../store";
import type { TCategory, TProduct } from "../types";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

export function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = Boolean(token || localStorage.getItem("token"));

  const [products, setProducts] = useState<TProduct[]>([]);
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sort, setSort] = useState("newest");
  const [inStock, setInStock] = useState(false);
  const [loading, setLoading] = useState(true);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === categoryId),
    [categories, categoryId]
  );

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {
        dispatch(showToast({ type: "error", message: "Could not load categories" }));
      });
  }, [dispatch]);

  useEffect(() => {
    setLoading(true);
    getProducts({ q: query, categoryId, sort, inStock, size: 24 })
      .then((page) => setProducts(page.content))
      .catch(() => {
        dispatch(showToast({ type: "error", message: "Could not load products" }));
      })
      .finally(() => setLoading(false));
  }, [categoryId, dispatch, inStock, query, sort]);

  const handleAddToCart = async (productId: string) => {
    if (!isAuthenticated) {
      dispatch(showToast({ type: "error", message: "Login to add items to cart" }));
      navigate("/profile");
      return;
    }

    try {
      await addCartItem(productId, 1);
      dispatch(showToast({ type: "success", message: "Added to cart" }));
    } catch {
      dispatch(showToast({ type: "error", message: "Could not add item" }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />
      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_auto_auto]">
          <label className="flex h-11 items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3">
            <Search size={18} className="text-slate-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products"
              className="h-full w-full bg-transparent text-sm outline-none"
            />
          </label>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="h-11 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
            <option value="name">Name</option>
          </select>
          <label className="flex h-11 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(event) => setInStock(event.target.checked)}
            />
            In stock
          </label>
        </section>

        <section className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCategoryId("")}
            className={`rounded-md border px-3 py-2 text-sm ${categoryId === "" ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white"}`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setCategoryId(category.id)}
              className={`rounded-md border px-3 py-2 text-sm ${categoryId === category.id ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white"}`}
            >
              {category.name}
            </button>
          ))}
        </section>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">
              {selectedCategory ? selectedCategory.name : "Products"}
            </h1>
            <p className="text-sm text-slate-500">{products.length} items available</p>
          </div>
          <SlidersHorizontal size={22} className="text-slate-500" />
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-80 animate-pulse rounded-lg bg-slate-200" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-500">
            No products found.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <article key={product.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                <Link to={`/products/${product.id}`} className="block aspect-square bg-slate-100">
                  <img
                    src={product.imageUrls?.[0] || "/favicon.svg"}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </Link>
                <div className="flex min-h-52 flex-col gap-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link to={`/products/${product.id}`} className="font-semibold hover:text-blue-700">
                        {product.name}
                      </Link>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-500">{product.description}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-amber-600">
                      <Star size={16} fill="currentColor" />
                      {product.reviewsCount || 0}
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{currency.format(product.price)}</p>
                      <p className="text-xs text-slate-500">{product.stockQuantity} left</p>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      disabled={product.stockQuantity === 0}
                      className="inline-flex h-10 items-center gap-2 rounded-md bg-blue-700 px-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      <ShoppingCart size={17} />
                      Add
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default HomePage;
