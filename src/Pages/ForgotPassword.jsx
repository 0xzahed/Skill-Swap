import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import toast, { Toaster } from "react-hot-toast";
import { FaArrowLeft, FaEnvelope } from "react-icons/fa";

const ForgotPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetPassword } = useContext(AuthContext);

  const [email, setEmail] = useState(location.state?.email || "");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);

    resetPassword(email)
      .then(() => {
        toast.success("Password reset email sent! Check your inbox.");
        setLoading(false);

        setTimeout(() => {
          window.open("https://mail.google.com", "_blank");
          navigate("/auth/login");
        }, 1500);
      })
      .catch((error) => {
        console.error("Password reset error:", error);
        if (error.code === "auth/user-not-found") {
          toast.error("No account found with this email address");
        } else if (error.code === "auth/invalid-email") {
          toast.error("Please enter a valid email address");
        } else {
          toast.error("Failed to send reset email. Please try again.");
        }
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Toaster position="top-right" />

      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <Link
          to="/auth/login"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <FaArrowLeft size={14} /> Back to Login
        </Link>

        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <FaEnvelope className="text-purple-600 text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
          <p className="text-gray-600 text-sm">
            Don't worry! Enter your email and we'll send you a reset link.
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Reset Email"}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link to="/auth/login" className="text-purple-600 hover:text-purple-500 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
