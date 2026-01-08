// client/src/pages/UserBlogs.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import BlogCard from "../components/BlogCard";

const API = "http://localhost:8080";

const UserBlogs = () => {
  const [blogs, setBlogs] = useState([]);

  const getUserBlogs = async () => {
    try {
      const id = localStorage.getItem("userId");
      if (!id) {
        // Not logged in — nothing to fetch
        setBlogs([]);
        return;
      }
      const { data } = await axios.get(`${API}/api/v1/nitzzy/user-blog/${id}`);
      if (data?.success) {
        setBlogs(data?.Nitzzy || []);
      } else {
        setBlogs([]);
      }
    } catch (error) {
      console.log("Error fetching user blogs:", error);
      setBlogs([]);
    }
  };

  useEffect(() => {
    getUserBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {blogs && blogs.length > 0 ? (
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
        <h3 style={{ textAlign: "center", marginTop: "2rem" }}>
          You haven't created a blog yet.
        </h3>
      )}
    </div>
  );
};

export default UserBlogs;
