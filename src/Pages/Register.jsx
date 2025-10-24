import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { updateProfile } from "firebase/auth";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { createUser, googleSignIn } = useContext(AuthContext);
  const navigate = useNavigate();

  // password validation
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    return regex.test(password)
      ? null
      : "Password must be at least 6 characters with 1 uppercase and 1 lowercase letter";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const error = validatePassword(password);
    if (error) {
      toast.error(error);
      return;
    }

    setLoading(true);

    createUser(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (name || photoURL) {
          return updateProfile(user, { displayName: name, photoURL });
        }
      })
      .then(() => {
        toast.success("Account created successfully!");
        setLoading(false);
        navigate("/");
      })
      .catch((err) => {
        toast.error(err.message);
        setLoading(false);
      });
  };

  const handleGoogleSignIn = () => {
    setLoading(true);

    googleSignIn()
      .then((result) => {
        console.log(result);
        toast.success("Account created successfully!");
        setLoading(false);
        navigate("/");
      })
      .catch((err) => {
        toast.error(err.message);
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Toaster position="top-right" />

      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Create an Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg text-sm border border-gray-300"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-lg text-sm border border-gray-300"
          />

          <input
            type="text"
            placeholder="Photo URL"
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm border border-gray-300"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 pr-10 rounded-lg text-sm border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2.5 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FcGoogle className="mr-2" />
            Sign up with Google
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="text-purple-600 hover:text-purple-500 font-medium"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
