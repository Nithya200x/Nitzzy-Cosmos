import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const sendOtp = async () => {
    if (!email) {
      toast.error("Enter email");
      return;
    }

    try {
      await axios.post(
        "${process.env.REACT_APP_API}/api/v1/user/forgot-password/send-otp",
        { email }
      );
      toast.success("OTP sent to email");
      setOtpSent(true);
    } catch {
      toast.error("Failed to send OTP");
    }
  };

  const resetPassword = async () => {
    if (!otp || !newPassword) {
      toast.error("Fill all fields");
      return;
    }

    try {
      await axios.post(
        "${process.env.REACT_APP_API}/api/v1/user/forgot-password/reset",
        {
          email,
          otp,
          newPassword,
        }
      );
      toast.success("Password reset successful");
      navigate("/login");
    } catch {
      toast.error("Invalid or expired OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/5 p-8 rounded-xl border border-white/10">
        <h2 className="text-2xl text-center mb-6">Forgot Password</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-3 rounded bg-black/40 border border-white/10"
          onChange={(e) => setEmail(e.target.value)}
        />

        {!otpSent && (
          <button
            onClick={sendOtp}
            className="w-full py-3 bg-indigo-600 rounded"
          >
            Send OTP
          </button>
        )}

        {otpSent && (
          <>
            <input
              placeholder="Enter OTP"
              className="w-full mt-4 px-4 py-3 rounded bg-black/40 border border-white/10"
              onChange={(e) => setOtp(e.target.value)}
            />

            <input
              type="password"
              placeholder="New Password"
              className="w-full mt-4 px-4 py-3 rounded bg-black/40 border border-white/10"
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
              onClick={resetPassword}
              className="w-full mt-4 py-3 bg-green-600 rounded"
            >
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
