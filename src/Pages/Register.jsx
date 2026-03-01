import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaStar, FaUsers, FaGraduationCap } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { updateProfile } from "firebase/auth";
import { motion } from "framer-motion";

const perks = [
  { icon: FaUsers, text: "Join 10,000+ active learners" },
  { icon: FaGraduationCap, text: "500+ expert-verified tutors" },
  { icon: FaStar, text: "4.9/5 average rating" },
];

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { createUser, googleSignIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const validatePassword = (pw) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    return regex.test(pw)
      ? null
      : "Password must be 6+ characters with uppercase & lowercase";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validatePassword(password);
    if (err) { toast.error(err); return; }
    setLoading(true);
    createUser(email, password)
      .then((cred) => {
        if (name) return updateProfile(cred.user, { displayName: name });
      })
      .then(() => {
        toast.success("Account created! Welcome to SkillSwap 🎉");
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
      .then(() => {
        toast.success("Account created! Welcome to SkillSwap 🎉");
        setLoading(false);
        navigate("/");
      })
      .catch((err) => {
        toast.error(err.message);
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex bg-base-100">
      <Toaster position="top-right" />

      {/* Left — brand panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-primary p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-20" />
        <div className="relative">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white font-black">S</div>
            <span className="text-2xl font-black">SkillSwap</span>
          </Link>
          <h2 className="text-4xl font-black leading-tight mb-4">
            Start learning<br/>today — it's free.
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-sm leading-relaxed">
            Create your account and get instant access to 500+ expert-led sessions.
          </p>
          <div className="space-y-4">
            {perks.map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                  <Icon size={14} />
                </div>
                <p className="text-white/85 text-sm font-medium">{text}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-white/40 text-xs">
          © {new Date().getFullYear()} SkillSwap. All rights reserved.
        </p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-base-200 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-black text-sm">S</div>
            <span className="text-2xl font-black text-primary">SkillSwap</span>
          </Link>

          <h1 className="text-2xl font-black text-base-content mb-1">Create your account</h1>
          <p className="text-base-content/55 text-sm mb-7">Join thousands of learners today</p>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="btn btn-outline border-base-300 w-full rounded-xl mb-5 hover:border-primary hover:text-primary"
          >
            <FcGoogle size={20} /> Sign up with Google
          </button>

          <div className="divider text-base-content/30 text-xs my-0 mb-5">OR SIGN UP WITH EMAIL</div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-base-content/60 flex items-center gap-1.5">
                <FaUser size={11} /> Full Name
              </span>
              <input
                type="text"
                placeholder="Jane Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input input-bordered w-full bg-base-100 border-base-300 focus:border-primary text-sm"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-base-content/60 flex items-center gap-1.5">
                <FaEnvelope size={11} /> Email address
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input input-bordered w-full bg-base-100 border-base-300 focus:border-primary text-sm"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-base-content/60 flex items-center gap-1.5">
                <FaLock size={11} /> Password
              </span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 6 chars, uppercase & lowercase"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input input-bordered w-full pr-10 bg-base-100 border-base-300 focus:border-primary text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/40 hover:text-primary"
                >
                  {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full rounded-xl text-white"
            >
              {loading ? <span className="loading loading-spinner loading-sm" /> : "Create Account"}
            </button>
          </form>

          <p className="text-center text-xs text-base-content/55 mt-6">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-primary font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
