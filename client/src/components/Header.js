import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../redux/store";
import toast from "react-hot-toast";

import logo from "../assets/Nitzzy_Cosmos_Logo.png";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLogin = useSelector((state) => state.auth.isLogin);
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(authActions.logout());
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path
      ? "text-indigo-400 border-b-2 border-indigo-400"
      : "text-gray-300 hover:text-white";

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-black/40 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Nitzzy Cosmos Logo"
            className="
              h-10 w-10 object-contain
              transition-all duration-300
              hover:scale-105
              hover:drop-shadow-[0_0_22px_rgba(124,58,237,0.9)]
            "
          />
          <span className="text-xl font-heading tracking-widest text-white">
            Nitzzy <span className="text-indigo-400">Cosmos</span>
          </span>
        </Link>

        {/* NAV */}
        <nav className="flex items-center gap-6 text-sm">
          {isLogin ? (
            <>
              <Link className={isActive("/")} to="/">
                All Blogs
              </Link>

              <Link className={isActive("/my-blogs")} to="/my-blogs">
                My Blogs
              </Link>

              <Link className={isActive("/create-blog")} to="/create-blog">
                Create Blog
              </Link>

              <Link className={isActive("/profile")} to="/profile">
                Profile
              </Link>

              <Link className={isActive("/trash")} to="/trash">
                Trash
              </Link>

              {/* ADMIN (future-ready, safe) */}
              {user?.role === "admin" && (
                <Link className={isActive("/admin")} to="/admin">
                  Admin
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 rounded-md border border-white/10 hover:bg-white/10 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className={isActive("/login")} to="/login">
                Login
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 rounded-md bg-indigo-500 text-white hover:bg-indigo-600 transition"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
