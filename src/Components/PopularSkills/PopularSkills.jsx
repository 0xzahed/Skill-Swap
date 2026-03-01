import React from "react";
import { Link } from "react-router-dom";
import { FaStar, FaUsers, FaClock } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";

const categoryColors = {
  Programming: "bg-blue-100 text-blue-700",
  Music: "bg-purple-100 text-purple-700",
  "Data Science": "bg-cyan-100 text-cyan-700",
  Marketing: "bg-pink-100 text-pink-700",
  Design: "bg-orange-100 text-orange-700",
  Language: "bg-green-100 text-green-700",
  Fitness: "bg-red-100 text-red-700",
  Business: "bg-yellow-100 text-yellow-700",
};

const PopularSkills = ({ skills = [] }) => {
  const popularSkills = skills.slice(0, 8);

  return (
    <section className="py-20 bg-base-200 relative overflow-hidden">
      {/* subtle bg pattern */}
      <div className="absolute inset-0 hero-grid opacity-50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="text-primary font-semibold text-sm uppercase tracking-widest mb-3"
          >
            What you'll learn
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-black text-base-content mb-4"
          >
            Popular <span className="text-primary">Skills</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-base-content/60 text-lg max-w-xl mx-auto"
          >
            Discover our most sought-after courses taught by verified experts
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularSkills.map((skill, index) => {
            const pillClass =
              categoryColors[skill.category] || "bg-primary/10 text-primary";
            return (
              <motion.div
                key={skill.skillId}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.07 }}
                viewport={{ once: true }}
              >
                <Link
                  to={`/skill/${skill.skillId}`}
                  className="flex flex-col bg-base-100 rounded-2xl overflow-hidden h-full border border-base-300 card-lift group"
                >
                  {/* Thumbnail */}
                  <div className="relative overflow-hidden h-44">
                    <img
                      src={skill.image}
                      alt={skill.skillName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* dark overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {/* category pill */}
                    <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-bold ${pillClass}`}>
                      {skill.category}
                    </span>
                    {/* hover CTA */}
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="flex items-center gap-1 bg-white text-primary text-xs font-bold px-3 py-1.5 rounded-full shadow">
                        View <FiArrowRight size={12} />
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-base font-bold text-base-content group-hover:text-primary transition-colors line-clamp-2 mb-2 min-h-[48px]">
                      {skill.skillName}
                    </h3>

                    {/* Provider */}
                    <p className="text-xs text-base-content/50 mb-3 truncate">
                      by {skill.providerName}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-base-content/60 mb-4">
                      <span className="flex items-center gap-1">
                        <FaStar className="text-yellow-400" />
                        <span className="font-semibold text-base-content">{skill.rating}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <FaUsers size={11} />
                        {skill.students?.toLocaleString()}
                      </span>
                      {skill.duration && (
                        <span className="flex items-center gap-1">
                          <FaClock size={11} />
                          {skill.duration}
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="mt-auto flex items-center justify-between border-t border-base-200 pt-3">
                      <span className="text-2xl font-black text-primary">
                        ${skill.price}
                      </span>
                      <span className="text-xs font-semibold text-base-content/40 uppercase tracking-wide">
                        per session
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <Link
            to="/service"
            className="btn btn-primary rounded-full px-10 text-white gap-2 group"
          >
            View All Skills
            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PopularSkills;
