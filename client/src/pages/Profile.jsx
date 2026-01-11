import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("Please login again");
          navigate("/login");
          return;
        }

        const { data } = await axios.get(
          "http://localhost:8080/api/v1/user/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(data.user);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!user) {
    return (
      <p className="text-center mt-24 text-white/60 tracking-wide animate-pulse">
        Loading profile...
      </p>
    );
  }

  return (
    /* 🌌 Cosmic Background Wrapper */
    <div
      className="min-h-screen relative overflow-hidden
                 cosmos-nebula cosmos-stars
                 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/assets/cosmos-bg.jpg')",
      }}
    >
      {/* Dark cinematic overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto mt-16 sm:mt-20 px-4 sm:px-6 text-white">
        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full
                       flex items-center justify-center
                       bg-gradient-to-br from-violet-500/20 to-indigo-500/20
                       text-violet-400 shadow-md
                       transition-transform duration-300
                       hover:scale-105"
          >
            👤
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-wide">
            Profile
          </h1>
        </div>

        {/* Profile Card */}
        <div
          className="bg-white/5 backdrop-blur-xl
                     border border-white/10
                     rounded-xl sm:rounded-2xl
                     p-5 sm:p-8
                     shadow-[0_0_40px_rgba(139,92,246,0.15)]
                     space-y-4 sm:space-y-5
                     transition-all duration-300
                     hover:shadow-[0_0_55px_rgba(139,92,246,0.25)]"
        >
          {/* Divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Details */}
          <p className="flex flex-col sm:flex-row sm:gap-2">
            <span className="text-white/60 text-sm sm:text-base">
              Username:
            </span>
            <span className="font-medium break-all">
              {user.username}
            </span>
          </p>

          <p className="flex flex-col sm:flex-row sm:gap-2">
            <span className="text-white/60 text-sm sm:text-base">
              Email:
            </span>
            <span className="font-medium break-all">
              {user.email}
            </span>
          </p>

          <p className="flex flex-col sm:flex-row sm:gap-2 text-white/70 text-sm sm:text-base">
            <span>Joined:</span>
            {new Date(user.createdAt).toLocaleDateString()}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
            <button
              onClick={() => navigate("/my-blogs")}
              className="w-full sm:w-auto
                         px-6 py-2.5 rounded-lg
                         bg-gradient-to-r from-indigo-500 to-violet-500
                         font-medium shadow-md
                         transition-all duration-200
                         hover:scale-[1.03] hover:shadow-lg
                         active:scale-95"
            >
              My Blogs
            </button>

            <button
              onClick={() => navigate("/trash")}
              className="w-full sm:w-auto
                         px-6 py-2.5 rounded-lg
                         bg-gradient-to-r from-red-500/90 to-rose-600/90
                         font-medium shadow-md
                         transition-all duration-200
                         hover:scale-[1.03] hover:shadow-lg
                         active:scale-95"
            >
              Trash
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
