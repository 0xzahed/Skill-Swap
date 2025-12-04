import React from "react";
import { Link } from "react-router-dom";
import {
  FaStar,
  FaDollarSign,
  FaUsers,
  FaClock,
  FaPlayCircle,
  FaSignal,
} from "react-icons/fa";
import { motion } from "framer-motion";

const PopularSkills = ({ skills = [] }) => {
  // Show only first 8 skills for popular section
  const popularSkills = skills.slice(0, 8);

  return (
    <section className="py-16 bg-base-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-base-content mb-4"
          >
            Popular Skills
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base-content/70 text-lg"
          >
            Discover our most popular learning experiences
          </motion.p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularSkills.map((skill, index) => (
            <motion.div
              key={skill.skillId}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-base-100 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group h-full flex flex-col">
                {/* Image */}
                <div className="relative overflow-hidden h-44">
                  <img
                    src={skill.image}
                    alt={skill.skillName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-[#422AD5] text-white px-2 py-1 rounded-full text-xs font-medium">
                    {skill.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-base-content mb-2 group-hover:text-primary transition-colors line-clamp-2 min-h-[56px]">
                    {skill.skillName}
                  </h3>

                  {/* Stats */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <FaStar className="text-yellow-400 text-sm" />
                      <span className="font-semibold text-base-content text-sm">
                        {skill.rating}
                      </span>
                    </div>
                    <span className="text-base-content/60 text-xs">
                      ({skill.students?.toLocaleString()})
                    </span>
                  </div>

                  {/* Price & Button */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="text-primary font-bold text-xl">
                      ${skill.price}
                    </div>
                    <Link
                      to={`/skill/${skill.skillId}`}
                      className="btn btn-primary btn-sm rounded-lg"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/service"
            className="btn btn-outline btn-primary px-8 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg"
          >
            View All Skills →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularSkills;
