import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const navigate = useNavigate();

  // Handle Google login redirect
  const handleGoogleLogin = () => {
    toast.success("Please sign in using Google");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/5 p-8 rounded-xl border border-white/10 text-center">
        <h2 className="text-2xl mb-4">Forgot Password?</h2>

        <p className="text-gray-400 mb-6">
          This app uses Google Sign-In for secure access.
          <br />
          If you signed up using Google, please log in with Google again.
        </p>

        // Google sign-in option
        <div className="flex justify-center mb-6">
          <GoogleLogin
            onSuccess={() => handleGoogleLogin()}
            onError={() => toast.error("Google sign-in failed")}
          />
        </div>

        <p className="text-sm text-gray-400">
          If you created your account with email & password and forgot it,
          please contact support.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="mt-6 w-full py-3 bg-indigo-600 rounded"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
