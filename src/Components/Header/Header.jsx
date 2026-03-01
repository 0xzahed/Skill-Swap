import React, { useEffect, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { IoStar } from "react-icons/io5";
import { FiArrowRight, FiPlay } from "react-icons/fi";

import AiImg from "../../assets/images/Ai.png";
import DataAnalystImg from "../../assets/images/data_analytics.png";
import MarketingImg from "../../assets/images/marketing.png";

const slides = [
  {
    image: AiImg,
    badge: "🤖 AI & Machine Learning",
    title: ["Master", "AI Skills"],
    subtitle:
      "Learn cutting-edge artificial intelligence from industry experts and land your dream role.",
  },
  {
    image: DataAnalystImg,
    badge: "📊 Data Science",
    title: ["Data Analytics", "Mastery"],
    subtitle:
      "Transform raw data into actionable insights with hands-on expert guidance.",
  },
  {
    image: MarketingImg,
    badge: "📣 Digital Marketing",
    title: ["Go Viral with", "Smart Marketing"],
    subtitle:
      "Boost your brand, grow your audience, and master modern marketing strategies.",
  },
];

const stats = [
  { value: "1 000+", label: "Active Learners" },
  { value: "50+",    label: "Expert Tutors" },
  { value: "4.8",    label: "Avg. Rating", icon: <IoStar className="text-yellow-400" /> },
];

const textVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const imageVariants = {
  hidden: { opacity: 0, x: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { delay: 0.25, duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, x: -40, scale: 0.95, transition: { duration: 0.35 } },
};

const Header = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <div className={`relative w-full min-h-[75vh] overflow-hidden hero-grid flex flex-col`}>
      {/* Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="blob absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl bg-primary" />
        <div className="blob blob-delay-2 absolute top-1/2 -right-40 w-[420px] h-[420px] rounded-full opacity-15 blur-3xl bg-primary" />
        <div className="blob blob-delay-4 absolute -bottom-20 left-1/3 w-[340px] h-[340px] rounded-full opacity-10 blur-3xl bg-primary" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-10 flex items-start pt-20 pb-6 lg:pt-24 lg:pb-6">
        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-8 items-center w-full">
          {/* Left */}
          <AnimatePresence mode="wait">
            <Motion.div
              key={`text-${current}`}
              className="space-y-6"
            >
              {/* Badge */}
              <Motion.span
                custom={0} variants={textVariants} initial="hidden" animate="visible" exit="exit"
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border border-primary/20 bg-primary/5 text-primary"
              >
                {slide.badge}
              </Motion.span>

              {/* Title */}
              <div className="space-y-1">
                {slide.title.map((line, i) => (
                  <Motion.h1
                    key={i}
                    custom={i + 1}
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={`text-4xl sm:text-5xl lg:text-6xl font-black leading-tight ${
                      i === 1 ? "text-primary" : "text-base-content"
                    }`}
                  >
                    {line}
                  </Motion.h1>
                ))}
              </div>

              {/* Subtitle */}
              <Motion.p
                custom={3} variants={textVariants} initial="hidden" animate="visible" exit="exit"
                className="text-base-content/65 text-lg max-w-lg leading-relaxed"
              >
                {slide.subtitle}
              </Motion.p>

              {/* CTAs */}
              <Motion.div
                custom={4} variants={textVariants} initial="hidden" animate="visible" exit="exit"
                className="flex flex-wrap gap-3 pt-2"
              >
                <Link
                  to="/service"
                  className="btn btn-primary text-white rounded-full px-7 gap-2 group"
                >
                  Explore Skills
                  <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/about"
                  className="btn btn-ghost rounded-full px-7 border border-base-300 gap-2 hover:border-primary hover:text-primary"
                >
                  <FiPlay size={14} />
                  Learn More
                </Link>
              </Motion.div>

              {/* Stats */}
              <Motion.div
                custom={5} variants={textVariants} initial="hidden" animate="visible" exit="exit"
                className="flex flex-wrap gap-6 pt-4"
              >
                {stats.map(({ value, label, icon }) => (
                  <div key={label} className="flex flex-col">
                    <span className="text-2xl font-black text-base-content flex items-center gap-1">
                      {value}{icon}
                    </span>
                    <span className="text-xs text-base-content/55 font-medium mt-0.5">{label}</span>
                  </div>
                ))}
              </Motion.div>
            </Motion.div>
          </AnimatePresence>

          {/* Right — image */}
          <AnimatePresence mode="wait">
            <Motion.div
              key={`img-${current}`}
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="hidden lg:flex justify-end items-center"
            >
              <div className="relative">
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-3xl bg-primary opacity-15 blur-2xl scale-110" />
                {/* Floating badges */}
                <div className="absolute -top-5 -left-5 bg-base-100 shadow-xl rounded-2xl px-4 py-2 flex items-center gap-2 border border-base-200 z-20">
                  <span className="text-xl">🏆</span>
                  <div>
                    <p className="text-xs font-bold text-base-content">Top Rated</p>
                    <p className="text-xs text-base-content/50">Course</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-base-100 shadow-xl rounded-2xl px-4 py-2 flex items-center gap-2 border border-base-200 z-20">
                  <span className="text-xl">🎓</span>
                  <div>
                    <p className="text-xs font-bold text-base-content">1000+ Students</p>
                    <p className="text-xs text-base-content/50">Enrolled</p>
                  </div>
                </div>
                <img
                  src={slide.image}
                  alt={slide.title.join(" ")}
                  className="relative w-full max-w-[960px] h-auto rounded-3xl shadow-2xl object-cover z-10"
                />
              </div>
            </Motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="relative z-10 flex justify-center gap-2 pb-8">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-400 ${
              i === current ? "w-8 bg-primary" : "w-2 bg-base-content/20 hover:bg-primary/40"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Scroll arrow */}
      <Motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-base-content/30 z-10"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </Motion.div>
    </div>
  );
};

export default Header;
