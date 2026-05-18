// src/components/Navbar.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  LogOut, 
  LogIn,
  PackageCheck
} from "lucide-react";

import type { RootState } from "../store/index";
import { logout } from "../store/authSlice";
import { showToast } from "../store/toastSlice";
import httpService from "../httpService";
import { getCart } from "../services/cartService";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cognitoUrl, setCognitoUrl] = useState("");
  const [cartCount, setCartCount] = useState(0);

  // Redux & LocalStorage Auth State
  const token = useSelector((state: RootState) => state.auth.token);
  const localToken = localStorage.getItem("token");
  const isAuthenticated = Boolean(token || localToken);

  // Fetch Cognito Login URL on mount
  useEffect(() => {
    httpService.fetch({
      url: "/api/auth/url",
      options: { method: "GET" },
    })
    .then((res) => {
      setCognitoUrl(res.data.url);
    })
    .catch((err) => {
      console.error("Failed to fetch auth URL:", err);
    });
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setCartCount(0);
      return;
    }

    getCart()
      .then((cart) => setCartCount(cart.totalItems))
      .catch(() => setCartCount(0));
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (cognitoUrl) {
      window.location.href = cognitoUrl;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    dispatch(
      showToast({
        type: "success",
        message: "Logged out successfully",
      })
    );
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold tracking-tight text-gray-900">
            AIShop
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-full max-w-xl mx-8">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search AI powered products..."
              className="bg-transparent outline-none px-3 w-full text-sm"
            />
          </div>

          {/* Right Section Actions */}
          <div className="flex items-center gap-5">
            
            {isAuthenticated && (
              <Link to="/orders" className="relative hover:text-blue-600 transition">
                <PackageCheck size={22} />
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative hover:text-blue-600 transition">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold min-w-5 h-5 px-1 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile Link (Auth Only) */}
            {isAuthenticated && (
              <Link to="/profile" className="hidden md:block hover:text-blue-600 transition">
                <User size={22} />
              </Link>
            )}

            {/* Auth Button */}
            {!isAuthenticated ? (
              <button
                onClick={handleLogin}
                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                <LogIn size={18} />
                <span className="hidden md:block text-sm font-medium">Login</span>
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                <LogOut size={18} />
                <span className="hidden md:block text-sm font-medium">Logout</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-1">
              <Menu size={24} />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
