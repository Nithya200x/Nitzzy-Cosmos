import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const CreateBlog = () => {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputs.title || !inputs.description) {
      toast.error("Title and description are required");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/nitzzy/create-blog`,
        {
          title: inputs.title,
          description: inputs.description,
          image: inputs.image,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data?.success) {
        toast.success("Blog published ✨");

        // clear form
        setInputs({
          title: "",
          description: "",
          image: "",
        });

        // navigate cleanly
        navigate("/my-blogs", { replace: true });
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to create blog"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="
          w-full max-w-4xl
          bg-white/5 backdrop-blur-xl
          border border-white/10
          rounded-2xl p-12
          shadow-[0_0_80px_rgba(124,58,237,0.35)]
        "
      >
        <h1 className="text-4xl font-heading text-center mb-3">
          Create a New Story
        </h1>

        <p className="text-center text-gray-400 mb-10">
          Share your thoughts with the Nitzzy Cosmos
        </p>

        <div className="space-y-8">
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Blog Title
            </label>
            <input
              name="title"
              value={inputs.title}
              onChange={handleChange}
              placeholder="Enter a captivating title"
              className="
                w-full rounded-xl px-4 py-3
                bg-black/40 text-white
                border border-white/10
                focus:outline-none focus:border-indigo-500
              "
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Blog Content
            </label>
            <textarea
              name="description"
              value={inputs.description}
              onChange={handleChange}
              rows={7}
              placeholder="Write your story here..."
              className="
                w-full rounded-xl px-4 py-3
                bg-black/40 text-white
                border border-white/10
                focus:outline-none focus:border-indigo-500
              "
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Cover Image (optional)
            </label>
            <input
              name="image"
              value={inputs.image}
              onChange={handleChange}
              placeholder="Paste image URL"
              className="
                w-full rounded-xl px-4 py-3
                bg-black/40 text-white
                border border-white/10
                focus:outline-none focus:border-indigo-500
              "
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`
            mt-12 w-full py-4 rounded-xl
            ${loading ? "bg-gray-600" : "bg-indigo-600 hover:bg-indigo-700"}
            text-white font-semibold text-lg
            transition
          `}
        >
          {loading ? "Publishing..." : "Publish Blog"}
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
