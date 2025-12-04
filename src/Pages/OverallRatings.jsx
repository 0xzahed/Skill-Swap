import { motion as Motion } from "framer-motion";
import React from "react";
import { FaUsers, FaGraduationCap, FaHandshake, FaStar } from "react-icons/fa";
const OverallRatings = () => {
  const stats = [
    { icon: <FaUsers />, number: "10K+", label: "Active Users" },
    { icon: <FaGraduationCap />, number: "500+", label: "Expert Tutors" },
    { icon: <FaHandshake />, number: "50K+", label: "Sessions Completed" },
    { icon: <FaStar />, number: "4.9/5", label: "Average Rating" },
  ];
  return (
    <div className="bg-base-100 px-4">
      <Motion.section
        className=" py-16 px-4"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false }}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-base-content mb-12">
            Our Impact in Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 shadow-xl p-20 rounded-lg bg-base-200">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl text-primary mb-2 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-base-content mb-2">
                  {stat.number}
                </div>
                <div className="text-base-content/70 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Motion.section>
    </div>
  );
};

export default OverallRatings;
