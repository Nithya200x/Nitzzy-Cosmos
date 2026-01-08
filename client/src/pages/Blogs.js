import React, { useEffect, useState } from "react";
import axios from "axios";
import BlogCard from "../components/BlogCard";
import logo from "../assets/Nitzzy_Cosmos_Logo.png";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);

  const getAllBlogs = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/v1/nitzzy/all-blogs"
      );
      if (data?.success) {
        setBlogs(data?.Nitzzy || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllBlogs();
  }, []);

  return (
    <div className="relative min-h-screen px-4 py-10">
      {/* WATERMARK */}
      <img
        src={logo}
        alt="Nitzzy Cosmos Watermark"
        className="
          pointer-events-none select-none
          fixed inset-0 m-auto
          w-[420px] opacity-[0.05]
          blur-[1px]
        "
      />

      <div className="relative z-10">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <BlogCard
              key={blog._id}
              id={blog._id}
              isUser={localStorage.getItem("userId") === blog?.user?._id}
              title={blog.title}
              description={blog.description}
              image={blog.image}
              username={blog?.user?.username}
              time={blog.createdAt}
            />
          ))
        ) : (
          <div className="text-center text-gray-300 mt-32">
            <h2 className="text-2xl font-semibold mb-2">
              No stories yet
            </h2>
            <p className="text-sm text-gray-400">
              Be the first to write beyond the stars ✨
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;
