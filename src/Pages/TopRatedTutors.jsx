import React, { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { FaStar, FaUsers, FaMedal } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const TopRatedTutors = () => {
  const [tutors, setTutors] = useState([]);

  useEffect(() => {
    fetch("/providers.json")
      .then((res) => res.json())
      .then((data) => setTutors(data))
      .catch((err) => console.error("Error loading tutors:", err));
  }, []);

  return (
    <section className="bg-base-100 py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-14">
          <Motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="text-primary font-semibold text-sm uppercase tracking-widest mb-3"
          >
            Meet your coaches
          </Motion.p>
          <Motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-black text-base-content mb-4"
          >
            Top Rated <span className="text-primary">Providers</span>
          </Motion.h2>
          <Motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-base-content/60 text-lg max-w-xl mx-auto"
          >
            Learn from industry professionals with proven track records and
            exceptional student reviews
          </Motion.p>
        </div>

        {/* Tutor grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tutors.map(({ id, name, skill, organization, rating, reviews, image }, idx) => (
            <Motion.div
              key={id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              viewport={{ once: true }}
              className="group relative bg-base-100 rounded-2xl border border-base-300 overflow-hidden card-lift flex flex-col"
            >
              {/* Top ranked badge */}
              {idx === 0 && (
                <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-yellow-400 text-yellow-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                  <FaMedal size={10} /> #1 Top
                </div>
              )}

              {/* Avatar area */}
              <div className="relative h-52 overflow-hidden bg-base-200">
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-base font-bold text-base-content mb-0.5 group-hover:text-primary transition-colors">
                  {name}
                </h3>
                <p className="text-xs text-base-content/50 mb-1 truncate">{organization}</p>
                <span className="skill-pill mb-3 self-start">{skill}</span>

                {/* Rating + reviews */}
                <div className="mt-auto flex items-center justify-between">
                  <span className="flex items-center gap-1 text-sm font-bold text-base-content">
                    <FaStar className="text-yellow-400" />
                    {rating}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-base-content/50">
                    <FaUsers size={11} />
                    {reviews} reviews
                  </span>
                </div>
              </div>
            </Motion.div>
          ))}
        </div>

        {/* CTA */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <Link
            to="/service"
            className="btn btn-outline btn-primary rounded-full px-10 gap-2 group"
          >
            Browse All Tutors
            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Motion.div>
      </div>
    </section>
  );
};

export default TopRatedTutors;
