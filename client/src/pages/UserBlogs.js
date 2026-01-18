import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import BlogCard from "../components/BlogCard";
import toast from "react-hot-toast";

const API = `${process.env.REACT_APP_API}`;

const UserBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const getUserBlogs = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        setBlogs([]);
        return;
      }

      setLoading(true);

      const { data } = await axios.get(
        `${API}/api/v1/nitzzy/user-blogs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data?.success) {
        setBlogs(data.Nitzzy || []);
      } else {
        setBlogs([]);
      }
    } catch (error) {
      console.error("Error fetching user blogs:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserBlogs();
  }, [location.pathname]); //refetch on navigation

  if (loading) {
    return (
      <h3 style={{ textAlign: "center", marginTop: "2rem" }}>
        Loading your blogs...
      </h3>
    );
  }

  return (
    <div>
      {blogs.length > 0 ? (
        blogs.map((blog) => (
          <BlogCard
            key={blog._id}
            id={blog._id}
            isUser={true}
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
