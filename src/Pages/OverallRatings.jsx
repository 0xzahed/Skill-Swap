import { motion as Motion } from "framer-motion";
import React from "react";
import { FaUsers, FaGraduationCap, FaHandshake, FaStar } from "react-icons/fa";

const stats = [
  {
    icon: FaUsers,
    number: "10K+",
    label: "Active Learners",
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50 text-blue-600",
  },
  {
    icon: FaGraduationCap,
    number: "500+",
    label: "Expert Tutors",
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-50 text-violet-600",
  },
  {
    icon: FaHandshake,
    number: "50K+",
    label: "Sessions Done",
    color: "from-pink-500 to-rose-500",
    bg: "bg-pink-50 text-pink-600",
  },
  {
    icon: FaStar,
    number: "4.9/5",
    label: "Average Rating",
    color: "from-yellow-400 to-orange-500",
    bg: "bg-yellow-50 text-yellow-600",
  },
];

const OverallRatings = () => {
  return (
    <section className="relative py-20 px-4 overflow-hidden bg-primary text-white">
      <div className="absolute inset-0 hero-grid opacity-20 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-white/60 text-sm font-semibold uppercase tracking-widest mb-3">
            Our impact
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-3">
            Numbers That Speak
          </h2>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Thousands of learners trust SkillSwap to level up their skills
          </p>
        </Motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map(({ icon: Icon, number, label, bg }, i) => (
            <Motion.div
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              viewport={{ once: true }}
              className="glass-card rounded-2xl p-6 text-center"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${bg}`}>
                <Icon size={22} />
              </div>
              <p className="text-3xl md:text-4xl font-black text-white mb-1">{number}</p>
              <p className="text-white/60 text-sm font-medium">{label}</p>
            </Motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OverallRatings;

