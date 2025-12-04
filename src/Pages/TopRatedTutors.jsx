import React, { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

const TopRatedTutors = () => {
  const [tutors, setTutors] = useState([]);

  useEffect(() => {
    fetch("/providers.json")
      .then((res) => res.json())
      .then((data) => setTutors(data))
      .catch((error) => console.error("Error loading tutors:", error));
  }, []);

  return (
    <div className="bg-base-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-base-content mb-2">
            Top Rated Providers
          </h2>
          <p className="text-base-content/70">
            Learn from the best experts in their fields
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tutors.map(
            ({ id, name, skill, organization, rating, reviews, image }) => (
              <Motion.div
                key={id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: false }}
                className="bg-base-100 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-base-300"
              >
                <div className="h-56">
                  <img
                    src={image}
                    alt={name}
                    className="w-fit h-full mx-auto rounded-xl p-2"
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold text-base-content mb-1">
                    {name}
                  </h3>
                  <p className="text-sm text-base-content/70 mb-2">
                    {organization}
                  </p>
                  <p className="text-primary font-semibold text-sm mb-3">
                    {skill}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-base-content/60">
                      {reviews} Reviews
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-base-content">
                      <span className="text-yellow-500">
                        <FaStar></FaStar>{" "}
                      </span>
                      {rating}
                    </span>
                  </div>
                </div>
              </Motion.div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default TopRatedTutors;
