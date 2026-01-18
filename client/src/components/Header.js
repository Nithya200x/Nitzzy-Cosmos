import React, { useEffect, useRef, useState } from "react";
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
  const [user, setUser] = useState(reduxUser);

  //Hero only 
  const showHero = location.pathname === "/";

  // Hero animation
  const heroRef = useRef(null);
  const [heroVisible, setHeroVisible] = useState(false);

  // Sync user
  useEffect(() => {
    if (reduxUser) {
      setUser(reduxUser);
      localStorage.setItem("user", JSON.stringify(reduxUser));
    } else {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    }
  }, [reduxUser]);
  useEffect(() => {
    if (!showHero) {
      setHeroVisible(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0.6 }
    );

    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, [showHero]);

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

  const avatarSrc = user?.avatar
    ? user.avatar
    : `https://ui-avatars.com/api/?name=${user?.username || "User"}&background=6d28d9&color=fff`;

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur bg-black/40 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full overflow-hidden ring-2 ring-indigo-400/60">
              <img
                src={logo}
                alt="Nitzzy Cosmos Logo"
                className="h-full w-full object-cover"
              />
            </div>

            <span className="text-xl tracking-widest text-white">
              Nitzzy <span className="text-indigo-400">Cosmos</span>
            </span>
          </Link>

          {/* NAV */}
          <nav className="flex items-center gap-6 text-sm">
            {isLogin ? (
              <>
                <Link className={isActive("/")} to="/">All Blogs</Link>
                <Link className={isActive("/my-blogs")} to="/my-blogs">My Blogs</Link>
                <Link className={isActive("/create-blog")} to="/create-blog">Create</Link>

                <img
                  src={avatarSrc}
                  alt="avatar"
                  onClick={() => navigate("/profile")}
                  className="w-9 h-9 rounded-full object-cover cursor-pointer
                             ring-2 ring-indigo-400/40
                             hover:scale-105 transition"
                />

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-md border border-white/10 hover:bg-white/10"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className={isActive("/login")} to="/login">Login</Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-md bg-indigo-500 text-white hover:bg-indigo-600"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {showHero && (
  <section
    ref={heroRef}
    className="
      relative
      h-[85vh] md:h-[90vh]
      flex items-center justify-center
      text-center
      overflow-hidden
    "
  >
    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/80" />

    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.18),transparent_70%)]" />

    <div className="absolute inset-0 pointer-events-none">
      <div
        className="
          absolute -top-1/2 left-[-35%]
          w-[170%] h-[200%]
          bg-gradient-to-r
          from-transparent
          via-white/10
          to-transparent
          rotate-12
          animate-glossy-shine
        "
      />
    </div>

    <div
      className={`
        relative z-10 px-6
        transition-all duration-[1200ms] ease-out
        ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
      `}
    >
      <h1
        className="
          text-3xl md:text-5xl lg:text-6xl
          font-semibold
          tracking-wide
          text-white
          leading-tight
          drop-shadow-[0_0_35px_rgba(99,102,241,0.45)]
        "
      >
        Create worlds.
        <span className="block text-indigo-400 mt-2">
          Explore the cosmos.
        </span>
      </h1>

      <p
        className="
          mt-6
          text-gray-300
          text-sm md:text-base lg:text-lg
          max-w-xl mx-auto
        "
      >
        A place to write, share, and discover ideas beyond limits.
      </p>
    </div>
  </section>
)}
    </>
  );
};

export default Header;
