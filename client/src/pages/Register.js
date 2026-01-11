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

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // SEND OTP
  const sendOtp = async () => {
    if (!inputs.email) {
      toast.error("Please enter email first");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        "${process.env.REACT_APP_API}/api/v1/user/send-otp",
        { email: inputs.email }
      );
      toast.success("OTP sent to your email");
      setOtpSent(true);
    } catch {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // VERIFY OTP & REGISTER
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputs.name || !inputs.email || !inputs.password || !otp) {
      toast.error("Please fill all fields including OTP");
      return;
    }

    try {
      const { data } = await axios.post(
        "${process.env.REACT_APP_API}/api/v1/user/verify-otp",
        {
          username: inputs.name,
          email: inputs.email,
          password: inputs.password,
          otp,
        }
      );

      if (data?.success) {
        toast.success("Account created successfully ✨");
        navigate("/login");
      } else {
        toast.error(data?.message || "Registration failed");
      }
    } catch {
      toast.error("Invalid or expired OTP");
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
            required
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
            required
            className="w-full rounded-lg px-4 py-3
              bg-black/40 text-white
              border border-white/10
              focus:outline-none focus:border-indigo-500"
          />

          {/* Send OTP */}
          <button
            type="button"
            onClick={sendOtp}
            disabled={loading}
            className="w-full py-2 rounded-lg
              bg-indigo-500 hover:bg-indigo-600
              text-white font-medium transition"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

          {/* OTP Input */}
          {otpSent && (
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full rounded-lg px-4 py-3
                bg-black/40 text-white
                border border-white/10
                focus:outline-none focus:border-indigo-500"
            />
          )}

          {/* Password */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={handleChange}
              required
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
          Verify & Create Account
        </button>

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
