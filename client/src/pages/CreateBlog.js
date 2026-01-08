import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const CreateBlog = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    image: "",
  });

  const handleChange = (e) =>
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (!inputs.title || !inputs.description) {
      toast.error("Title and description are required");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/v1/nitzzy/create-blog",
        {
          title: inputs.title,
          description: inputs.description,
          image: inputs.image,
          user: userId,
        }
      );

      if (data?.success) {
        toast.success("Blog published ✨");
        navigate("/my-blogs");
      }
    } catch {
      toast.error("Failed to create blog");
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
        {/* HEADER */}
        <h1 className="text-4xl font-heading text-center mb-3">
          Create a New Story
        </h1>
        <p className="text-center text-gray-400 mb-10">
          Share your thoughts with the Nitzzy Cosmos
        </p>

        {/* INPUTS */}
        <div className="space-y-8">
          {/* TITLE */}
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

          {/* DESCRIPTION */}
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

          {/* IMAGE */}
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

        {/* SUBMIT */}
        <button
          type="submit"
          className="
            mt-12 w-full py-4 rounded-xl
            bg-indigo-600 hover:bg-indigo-700
            text-white font-semibold text-lg
            transition
          "
        >
          Publish Blog
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
