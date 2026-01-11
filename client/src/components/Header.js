import React, { useEffect, useState } from "react";
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
  const reduxUser = useSelector((state) => state.auth.user);

  // Fallback user (for avatar sync)
  const [user, setUser] = useState(reduxUser);

  useEffect(() => {
    if (reduxUser) {
      setUser(reduxUser);
      localStorage.setItem("user", JSON.stringify(reduxUser));
    } else {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [reduxUser]);

  const handleLogout = () => {
    dispatch(authActions.logout());
    localStorage.removeItem("token");
  localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path
      ? "text-indigo-400 border-b-2 border-indigo-400"
      : "text-gray-300 hover:text-white";

  // Avatar source
  const avatarSrc = user?.avatar
    ? user.avatar
    : `https://ui-avatars.com/api/?name=${user?.username || "User"}&background=6d28d9&color=fff`;

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-black/40 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <div
            className="
              h-11 w-11 rounded-full overflow-hidden
              bg-black
              ring-2 ring-indigo-400/60
              shadow-[0_0_10px_rgba(99,102,241,0.6)]
              flex items-center justify-center
            "
          >
            <img
              src={logo}
              alt="Nitzzy Cosmos Logo"
              className="h-full w-full object-cover contrast-125 brightness-110"
            />
          </div>

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

              {/* Avatar → Profile */}
              <img
                src={avatarSrc}
                alt="avatar"
                onClick={() => navigate("/profile")}
                className="w-9 h-9 rounded-full object-cover
                           ring-2 ring-indigo-400/40
                           shadow-[0_0_10px_rgba(99,102,241,0.5)]
                           cursor-pointer hover:scale-105 transition"
              />

              {user?.role === "admin" && (
                <Link className={isActive("/admin")} to="/admin">
                  Admin
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="ml-2 px-4 py-2 rounded-md border border-white/10 hover:bg-white/10 transition"
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
