import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const BlogCard = ({
  title,
  description,
  image,
  username,
  time,
  id,
  isUser,
}) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/blog-details/${id}`);
  };

  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(
        `http://localhost:8080/api/v1/nitzzy/delete-blog/${id}`
      );
      if (data?.success) {
        toast.success("Blog deleted");
        window.location.reload();
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div
      className="
        group relative max-w-3xl mx-auto mb-10
        rounded-xl border border-white/10
        bg-white/5 backdrop-blur-xl
        shadow-[0_0_40px_rgba(124,58,237,0.08)]
        hover:shadow-[0_0_60px_rgba(124,58,237,0.25)]
        transition-all duration-300
      "
    >
      {/* EDIT / DELETE */}
      {isUser && (
        <div className="absolute top-4 right-4 flex gap-3 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={handleEdit}
            className="text-xs px-3 py-1 rounded bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/40"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-xs px-3 py-1 rounded bg-red-500/20 text-red-300 hover:bg-red-500/40"
          >
            Delete
          </button>
        </div>
      )}

      {/* CONTENT */}
      <div className="p-6">
        {/* AUTHOR */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-indigo-600/30 flex items-center justify-center text-indigo-300 font-bold">
            {username?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="text-sm text-white">{username}</p>
            <p className="text-xs text-gray-400">
              {new Date(time).toLocaleString()}
            </p>
          </div>
        </div>

        {/* IMAGE */}
        {image && (
          <img
            src={image}
            alt={title}
            onError={(e) => (e.target.style.display = "none")}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        )}

        {/* TEXT */}
        <h2 className="text-xl font-semibold text-white mb-2">
          {title}
        </h2>

        <p className="text-gray-300 text-sm line-clamp-3">
          {description}
        </p>

        <button
          onClick={() => navigate(`/blog-details/${id}`)}
          className="mt-4 text-sm text-indigo-400 hover:underline"
        >
          Read more →
        </button>
      </div>
    </div>
  );
};

export default BlogCard;
