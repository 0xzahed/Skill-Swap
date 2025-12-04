import React, { useState, use } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signIn, googleSignIn } = use(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    signIn(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Login successful:", user);
        toast.success("Login successful!", { duration: 5000 });
        setLoading(false);
        navigate(from, { replace: true });
      })
      .catch((error) => {
        console.error("Login error:", error);
        const errorMessage = error.message || "Login failed. Please try again.";
        toast.error(errorMessage);
        setLoading(false);
      });
  };

  const handleGoogleSignIn = () => {
    setLoading(true);

    googleSignIn()
      .then((result) => {
        const user = result.user;
        console.log("Google sign-in successful:", user);
        toast.success("Login successful!", { duration: 5000 });
        setLoading(false);
        navigate(from, { replace: true });
      })
      .catch((error) => {
        console.error("Google sign-in error:", error);
        toast.error("Google sign-in failed. Please try again.");
        setLoading(false);
      });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <Toaster position="top-right" />

      <div className="w-full max-w-md bg-base-100 shadow-lg rounded-xl p-8 border border-base-300">
        <h1 className="text-2xl font-bold text-base-content text-center mb-6">
          Welcome back
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-base-content/80 mb-1 flex items-center gap-2"
            >
              <FaEnvelope className="text-primary" />
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input input-bordered w-full border-base-300 bg-base-100 text-base-content focus:border-primary"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-base-content/80 mb-1 flex items-center gap-2"
            >
              <FaLock className="text-primary" />
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input input-bordered w-full pr-10 border-base-300 bg-base-100 text-base-content focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/50 hover:text-primary"
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="checkbox checkbox-primary checkbox-sm"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 text-base-content/70"
              >
                Remember
              </label>
            </div>
            <Link
              to="/forgot-password"
              state={{ email }}
              className="text-primary hover:text-primary-focus font-medium"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="btn btn-outline border-base-300 w-full"
          >
            <FcGoogle className="mr-2" size={20} />
            Sign in with Google
          </button>

          <p className="text-center text-sm text-base-content/70">
            Don't have an account?{" "}
            <Link
              to="/auth/register"
              className="text-primary hover:text-primary-focus font-medium"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
