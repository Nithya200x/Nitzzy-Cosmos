import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Trash = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrash = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(
        "http://localhost:8080/api/v1/nitzzy/trash",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBlogs(data.blogs || []);
    } catch (error) {
      toast.error("Failed to load trash");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  const restoreBlog = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:8080/api/v1/nitzzy/restore/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Blog restored");
      fetchTrash(); // 
    } catch {
      toast.error("Failed to restore blog");
    }
  };

  const permanentlyDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:8080/api/v1/nitzzy/permanent-delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Blog permanently deleted");
      fetchTrash(); 
    } catch {
      toast.error("Failed to delete blog");
    }
  };

  /* LOADING */
  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-400">
        Loading trash...
      </p>
    );
  }

  /* EMPTY */
  if (blogs.length === 0) {
    return (
      <div className="text-center mt-16 text-gray-400">
        <h2 className="text-2xl mb-2">🗑️ Trash is empty</h2>
        <p>No deleted blogs found.</p>
      </div>
    );
  }

  /* LIST */
  return (
    <div className="max-w-5xl mx-auto mt-10 px-4 text-white">
      <h1 className="text-3xl font-bold mb-6">🗑️ Trash</h1>

      <div className="space-y-6">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white/5 border border-white/10 rounded-xl p-5"
          >
            <h2 className="text-xl font-semibold mb-2">
              {blog.title}
            </h2>

            <p className="text-gray-400 mb-4">
              {blog.description}
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => restoreBlog(blog._id)}
                className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700"
              >
                Restore
              </button>

              <button
                onClick={() => permanentlyDelete(blog._id)}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
              >
                Delete permanently
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trash;
