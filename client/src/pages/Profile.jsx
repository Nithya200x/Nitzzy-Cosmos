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
      <p className="text-center mt-10 text-gray-400">
        Loading profile...
      </p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 text-white">
      <h1 className="text-3xl font-bold mb-6">👤 Profile</h1>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
        <p>
          <span className="text-gray-400">Username:</span>{" "}
          <span className="font-semibold">{user.username}</span>
        </p>

        <p>
          <span className="text-gray-400">Email:</span>{" "}
          <span className="font-semibold">{user.email}</span>
        </p>

        <p>
          <span className="text-gray-400">Joined:</span>{" "}
          {new Date(user.createdAt).toLocaleDateString()}
        </p>

        <div className="flex gap-4 mt-6">
          <button
            onClick={() => navigate("/my-blogs")}
            className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700"
          >
            My Blogs
          </button>

          <button
            onClick={() => navigate("/trash")}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
          >
            Trash
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
