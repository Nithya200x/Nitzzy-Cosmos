import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputs.name || !inputs.email || !inputs.password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/v1/user/register",
        {
          username: inputs.name,
          email: inputs.email,
          password: inputs.password,
        }
      );

      if (data?.success) {
        toast.success("Account created successfully ✨");
        navigate("/login");
      } else {
        toast.error(data?.message || "Registration failed");
      }
    } catch {
      toast.error("Could not connect to backend");
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
        {/* TITLE */}
        <h1 className="text-3xl font-heading text-center mb-2">
          Join Nitzzy Cosmos 🚀
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Create your account and start writing beyond the stars
        </p>

        {/* INPUTS */}
        <div className="space-y-6">
          <input
            name="name"
            placeholder="Your name"
            onChange={handleChange}
            required
            className="
              w-full rounded-lg px-4 py-3
              bg-black/40 text-white
              border border-white/10
              focus:outline-none focus:border-indigo-500
            "
          />

          <input
            name="email"
            type="email"
            placeholder="Email address"
            onChange={handleChange}
            required
            className="
              w-full rounded-lg px-4 py-3
              bg-black/40 text-white
              border border-white/10
              focus:outline-none focus:border-indigo-500
            "
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="
              w-full rounded-lg px-4 py-3
              bg-black/40 text-white
              border border-white/10
              focus:outline-none focus:border-indigo-500
            "
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="
            mt-8 w-full py-3 rounded-xl
            bg-indigo-600 hover:bg-indigo-700
            text-white font-semibold
            transition
          "
        >
          Create Account
        </button>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-indigo-400 hover:underline cursor-pointer"
          >
            Sign in
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;
