import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";

const Register = () => {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  // Handle input change
  const handleChange = (e) =>
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Manual registration (email + password)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputs.name || !inputs.email || !inputs.password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/user/register`,
        {
          username: inputs.name,
          email: inputs.email,
          password: inputs.password,
        }
      );

      if (data?.success) {
        toast.success("Account created successfully ✨");
        navigate("/login");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Registration failed"
      );
    }
  };

  // Google signup / login
  const handleGoogleSignup = async (credential) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/user/google-auth`,
        { credential }
      );

      if (data?.success) {
        // Save JWT
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Attach token globally
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.token}`;

        toast.success("Signed up with Google ✨");
        navigate("/");
      }
    } catch {
      toast.error("Google sign-up failed");
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
          Join Nitzzy Cosmos 🚀
        </h1>

        <p className="text-center text-gray-400 mb-8">
          Create your account and start writing beyond the stars
        </p>

        <div className="space-y-6">
          <input
            name="name"
            placeholder="Your name"
            onChange={handleChange}
            className="w-full rounded-lg px-4 py-3
              bg-black/40 text-white
              border border-white/10
              focus:outline-none focus:border-indigo-500"
          />

          <input
            name="email"
            type="email"
            placeholder="Email address"
            onChange={handleChange}
            className="w-full rounded-lg px-4 py-3
              bg-black/40 text-white
              border border-white/10
              focus:outline-none focus:border-indigo-500"
          />

          // Password input (optional if using Google)
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password (optional)"
              onChange={handleChange}
              className="w-full rounded-lg px-4 py-3 pr-16
                bg-black/40 text-white
                border border-white/10
                focus:outline-none focus:border-indigo-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2
                text-sm text-indigo-400 hover:text-indigo-300"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="mt-8 w-full py-3 rounded-xl
            bg-indigo-600 hover:bg-indigo-700
            text-white font-semibold transition"
        >
          Create Account
        </button>

        // Google sign up
        <div className="mt-6 flex justify-center">
          <GoogleLogin
            onSuccess={(res) => handleGoogleSignup(res.credential)}
            onError={() => toast.error("Google sign-up failed")}
          />
        </div>

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
