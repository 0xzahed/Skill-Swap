import React from "react";
import { motion as Motion } from "framer-motion";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const Service = ({ skills }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FaStar key={`full-${i}`} className="w-4 h-4 text-yellow-300" />
      );
    }
    if (hasHalfStar) {
      stars.push(
        <FaStarHalfAlt key="half" className="w-4 h-4 text-yellow-300" />
      );
    }
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <FaRegStar key={`empty-${i}`} className="w-4 h-4 text-gray-200" />
      );
    }
    return stars;
  };

  return (
    <div className="bg-white w-full py-12">
      <Motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Popular Skills
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover and learn from our most sought-after skills offered by expert
          tutors
        </p>
      </Motion.div>

      {/* Skills cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
        {skills.map(({ skillId, skillName, image, rating, price }) => (
          <Motion.div
            key={skillId}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: false }}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="h-56">
              <img
                src={image}
                alt={skillName}
                className="w-full h-full object-cover rounded-t-xl"
              />
            </div>

            <div className="p-4">
              <Link to={`/skill/${skillId}`}>
                <h3 className="text-lg font-bold text-gray-900 mb-1 hover:text-[#422AD5] transition-colors duration-300">
                  {skillName}
                </h3>
              </Link>

              <div className="flex items-center mb-2">
                <div className="flex items-center space-x-1">
                  {renderStars(rating)}
                </div>
                <span className="text-yellow-500 ml-2 text-sm font-semibold">
                  {rating}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-[#422AD5] font-semibold text-lg">
                  ${price}
                </span>
                <Link to={`/skill/${skillId}`}>
                  <button className="bg-[#422AD5] text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[#3319B0] transition-colors duration-300">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          </Motion.div>
        ))}
      </div>
    </div>
  );
};

export default Service;
