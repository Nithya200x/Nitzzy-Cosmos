import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { authActions } from "../redux/store";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [inputs, setInputs] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setInputs((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/v1/user/login",
        inputs
      );
      if (data?.success) {
        localStorage.setItem("userId", data.user._id);
        dispatch(authActions.login());
        toast.success("Welcome back ✨");
        navigate("/");
      }
    } catch {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="
          w-full max-w-lg
          bg-white/5 backdrop-blur-xl
          border border-white/10
          rounded-2xl p-10
          shadow-[0_0_70px_rgba(124,58,237,0.35)]
        "
      >
        <h1 className="text-3xl font-heading text-center mb-2">
          Welcome Back ✨
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Log in to continue your journey
        </p>

        <div className="space-y-6">
          <input
            name="email"
            placeholder="Email address"
            onChange={handleChange}
            required
            className="w-full rounded-lg px-4 py-3
              bg-black/40 text-white
              border border-white/10
              focus:outline-none focus:border-indigo-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full rounded-lg px-4 py-3
              bg-black/40 text-white
              border border-white/10
              focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="mt-8 w-full py-3 rounded-xl
            bg-indigo-600 hover:bg-indigo-700
            font-semibold transition"
        >
          Sign In
        </button>

        <p className="text-center text-sm text-gray-400 mt-6">
          New to Nitzzy Cosmos?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-indigo-400 hover:underline cursor-pointer"
          >
            Create an account
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
