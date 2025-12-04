import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import { FcGoogle } from "react-icons/fc";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaLock,
  FaImage,
} from "react-icons/fa";
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
        toast.success("Account created successfully!", { duration: 5000 });
        setLoading(false);
        navigate("/");
      })
      .catch((err) => {
        toast.error(err.message, { duration: 5000 });
        setLoading(false);
      });
  };

  const handleGoogleSignIn = () => {
    setLoading(true);

    googleSignIn()
      .then((result) => {
        console.log(result);
        toast.success("Account created successfully!", { duration: 5000 });
        setLoading(false);
        navigate("/");
      })
      .catch((err) => {
        toast.error(err.message, { duration: 5000 });
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <Toaster position="top-right" />

      <div className="w-full max-w-md bg-base-100 shadow-lg rounded-xl p-8 border border-base-300">
        <h1 className="text-2xl font-bold text-base-content text-center mb-6">
          Create an Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-primary" />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input input-bordered w-full pl-10 border-base-300 bg-base-100 text-base-content focus:border-primary"
            />
          </div>

          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-primary" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input input-bordered w-full pl-10 border-base-300 bg-base-100 text-base-content focus:border-primary"
            />
          </div>

          <div className="relative">
            <FaImage className="absolute left-3 top-3 text-primary" />
            <input
              type="text"
              placeholder="Photo URL"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              className="input input-bordered w-full pl-10 border-base-300 bg-base-100 text-base-content focus:border-primary"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-primary" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input input-bordered w-full pl-10 pr-10 border-base-300 bg-base-100 text-base-content focus:border-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/50 hover:text-primary"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="btn btn-outline border-base-300 w-full"
          >
            <FcGoogle className="mr-2" />
            Sign up with Google
          </button>

          <p className="text-center text-sm text-base-content/70">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="text-primary hover:text-primary-focus font-medium"
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
