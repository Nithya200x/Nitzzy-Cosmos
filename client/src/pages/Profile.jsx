import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const presetAvatars = [
  "/avatars/cosmic1.jpg",
  "/avatars/cosmic2.jpg",
  "/avatars/cosmic3.jpg",
  "/avatars/cosmic4.jpg",
];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");


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

  // Select preset avatar
  const handlePresetAvatar = async (avatarUrl) => {
    try {
      if (!avatarUrl) return;

      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("avatar", avatarUrl);

      const { data } = await axios.put(
        "http://localhost:8080/api/v1/user/update-avatar",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = { ...user, avatar: data.avatar };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Avatar updated");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Avatar update failed");
    }
  };

  // Remove avatar
  const handleRemoveAvatar = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("avatar", "");

      await axios.put(
        "http://localhost:8080/api/v1/user/update-avatar",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = { ...user, avatar: "" };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Avatar removed");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Avatar removal failed");
    }
  };

  const avatarSrc =
    user?.avatar && user.avatar !== ""
      ? user.avatar
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          user?.username || "User"
        )}&background=6d28d9&color=fff`;

  if (!user) {
    return (
      <p className="text-center mt-24 text-white/60 tracking-wide animate-pulse">
        Loading profile...
      </p>
    );
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden
                 cosmos-nebula cosmos-stars
                 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/assets/cosmos-bg.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]" />

      <div className="relative z-10 max-w-4xl mx-auto mt-16 sm:mt-20 px-4 sm:px-6 text-white">
        {/* Header */}
        <div className="flex items-center gap-5 mb-6 sm:mb-8">
          <img
            src={avatarSrc}
            alt="avatar"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover
                       ring-2 ring-violet-500/40
                       shadow-[0_0_30px_rgba(139,92,246,0.6)]"
          />

          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-wide">
              Profile
            </h1>
            <p className="text-white/60">@{user.username}</p>
          </div>
        </div>

        {/* Preset Avatars */}
        <div className="flex gap-3 mb-6">
          {presetAvatars.map((av) => (
            <img
              key={av}
              src={av}
              alt="preset avatar"
              onClick={() => handlePresetAvatar(av)}
              className="w-10 h-10 rounded-full cursor-pointer
                         ring-1 ring-white/20
                         hover:scale-110 transition"
            />
          ))}
        </div>

        <button
          onClick={handleRemoveAvatar}
          className="text-sm text-red-400 hover:text-red-500 transition mb-6"
        >
          Remove avatar
        </button>

        {/* Profile Card */}
        <div
          className="bg-white/5 backdrop-blur-xl
                     border border-white/10
                     rounded-xl sm:rounded-2xl
                     p-5 sm:p-8
                     shadow-[0_0_40px_rgba(139,92,246,0.15)]
                     space-y-4 sm:space-y-5"
        >
          <p>
            <span className="text-white/60">Username:</span>{" "}
            {user.username}
          </p>
          <p>
            <span className="text-white/60">Email:</span>{" "}
            {user.email}
          </p>
          <p className="text-white/70">
            Joined: {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
