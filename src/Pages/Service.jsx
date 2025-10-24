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
      <div
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
      </div>

      {/* Skills cards */}
      <div className="grid grid-cols-1 w-9/12 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mx-auto gap-6 p-4">
        {skills.map(({ skillId, skillName, image, rating, price }) => (
          <div
            key={skillId}
          
            className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700"
          >
            <div className="p-8">
              <img
                className="rounded-t-lg w-full h-48 object-cover"
                src={image}
                alt={skillName}
              />
            </div>

            <div className="px-5 pb-5">
              <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white hover:text-blue-600 transition-colors duration-300">
                {skillName}
              </h5>

              <div className="flex items-center mt-2.5 mb-5">
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  {renderStars(rating)}
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm dark:bg-blue-200 dark:text-blue-800 ms-3">
                  {rating}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${price}
                </span>
                <Link to={`/skill/${skillId}`}>
                  <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-all duration-300">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Service;
