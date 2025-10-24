import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const Service = ({ skills }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400" />);
    }
    return stars;
  };

  return (
    <div className="grid grid-cols-1 w-9/12 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mx-auto gap-4 p-4">
      {skills.map(({ skillId, skillName, image, rating, price }) => (
        <div
          key={skillId}
          className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-3 flex flex-col max-w-xs"
        >
          <div className="w-full h-40 mb-3 rounded-lg overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={image}
              alt={skillName}
            />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2 text-left">
            {skillName}
          </h3>

          <div className="flex items-center justify-between mb-3 w-full">
            <div className="text-xl font-bold text-gray-900">${price}</div>
            <div className="flex items-center gap-1">
              <div className="flex gap-1 text-xs">{renderStars(rating)}</div>
              <span className="text-gray-600 text-xs">({rating})</span>
            </div>
          </div>

          <Link to={`/skill/${skillId}`}>
            <button className="w-full py-2 text-base font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-all duration-300">
              View Details
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Service;
