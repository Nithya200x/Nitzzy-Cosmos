import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const API = "${process.env.REACT_APP_API}";

const BlogDetails = () => {
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

 // get blog details
  const getBlogDetail = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${API}/api/v1/nitzzy/single-blog/${id}`
      );

      if (data?.success) {
        setInputs({
          title: data.Nitzzy.title || "",
          description: data.Nitzzy.description || "",
          image: data.Nitzzy.image || "",
        });
      }
    } catch {
      toast.error("Failed to load blog");
    }
  }, [id]);

  useEffect(() => {
    getBlogDetail();
  }, [getBlogDetail]);

  const handleChange = (e) =>
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));

 // update blog
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.put(
        `${API}/api/v1/nitzzy/update-blog/${id}`,
        inputs,
        {
          headers: {
            Authorization: `Bearer ${token}`, // 🔑 FIX
          },
        }
      );

      if (data?.success) {
        toast.success("Blog updated successfully");
        navigate("/my-blogs", { replace: true });
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10 shadow-[0_0_60px_rgba(124,58,237,0.25)]"
      >
        <h1 className="text-3xl font-heading text-center mb-8">
          Update Blog
        </h1>

        <div className="space-y-6">
          <input
            name="title"
            value={inputs.title}
            onChange={handleChange}
            placeholder="Blog title"
            className="w-full rounded-lg px-4 py-3 bg-black/40 text-white border border-white/10 focus:outline-none focus:border-indigo-500"
            required
          />

          <textarea
            name="description"
            value={inputs.description}
            onChange={handleChange}
            placeholder="Write your story..."
            rows={6}
            className="w-full rounded-lg px-4 py-3 bg-black/40 text-white border border-white/10 focus:outline-none focus:border-indigo-500"
            required
          />

          <input
            name="image"
            value={inputs.image}
            onChange={handleChange}
            placeholder="Image URL"
            className="w-full rounded-lg px-4 py-3 bg-black/40 text-white border border-white/10 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`
            mt-8 w-full py-3 rounded-xl
            ${loading ? "bg-gray-600" : "bg-indigo-600 hover:bg-indigo-700"}
            text-white font-semibold transition
          `}
        >
          {loading ? "Updating..." : "Update Blog"}
        </button>
      </form>
    </div>
  );
};

export default BlogDetails;
