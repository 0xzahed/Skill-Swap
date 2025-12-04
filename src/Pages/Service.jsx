import React, { useMemo, useState } from "react";
import { motion as Motion } from "framer-motion";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaSearch,
  FaFilter,
  FaBookOpen,
  FaUsers,
} from "react-icons/fa";
import { Link, useLoaderData } from "react-router-dom";

const Service = () => {
  const skills = useLoaderData() || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minRating, setMinRating] = useState(0);
  const [sortOption, setSortOption] = useState("featured");

  const categories = useMemo(() => {
    const uniqueCategories = new Set();
    skills.forEach((skill) => {
      if (skill?.category) {
        uniqueCategories.add(skill.category);
      }
    });
    return ["All", ...uniqueCategories];
  }, [skills]);

  const filteredSkills = useMemo(() => {
    return skills
      .filter((skill) => {
        const query = searchTerm.trim().toLowerCase();
        if (!query) return true;
        const nameMatch = skill?.skillName?.toLowerCase().includes(query);
        const providerMatch = skill?.providerName
          ?.toLowerCase()
          .includes(query);
        return nameMatch || providerMatch;
      })
      .filter((skill) => {
        if (selectedCategory === "All") return true;
        return skill?.category === selectedCategory;
      })
      .filter((skill) => {
        const ratingValue = Number(skill?.rating) || 0;
        return ratingValue >= minRating;
      })
      .sort((a, b) => {
        switch (sortOption) {
          case "priceLowHigh":
            return (a.price || 0) - (b.price || 0);
          case "priceHighLow":
            return (b.price || 0) - (a.price || 0);
          case "ratingHighLow":
            return (b.rating || 0) - (a.rating || 0);
          default:
            return 0;
        }
      });
  }, [skills, searchTerm, selectedCategory, minRating, sortOption]);

  const renderStars = (rating = 0) => {
    const safeRating = Number(rating) || 0;
    const stars = [];
    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating % 1 !== 0;

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
    const remainingStars = 5 - Math.ceil(safeRating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <FaRegStar key={`empty-${i}`} className="w-4 h-4 text-gray-200" />
      );
    }
    return stars;
  };

  return (
    <div className="bg-base-100 w-full">
      <section className="relative overflow-hidden bg-linear-to-br from-primary via-primary to-primary-focus text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,#fff3,transparent_55%)]"></div>
        <div className="max-w-7xl mx-auto px-4 py-16 relative z-10 grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <p className="uppercase tracking-[0.35em] text-xs font-semibold text-white/70">
              Skill marketplace
            </p>
            <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
              Book live sessions with top tutors, across any skill you can
              imagine.
            </h1>
            <p className="text-base md:text-lg text-white/80">
              Compare offers, check real reviews, and secure your spot in
              minutes. Filters below help you find the perfect mentor faster.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#catalog"
                className="btn btn-lg bg-white text-primary hover:bg-white/90 border-0 rounded-full"
              >
                <FaBookOpen className="mr-2" />
                Explore catalog
              </a>
              <a
                href="#filters"
                className="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-primary rounded-full"
              >
                <FaFilter className="mr-2" />
                Advanced filters
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            {[
              {
                label: "Expert tutors",
                value: "120+",
              },
              {
                label: "Weekly sessions",
                value: "2.4K",
              },
              {
                label: "Avg. rating",
                value: "4.8 / 5",
              },
              {
                label: "Countries",
                value: "18",
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-3xl bg-white/10 backdrop-blur-md p-6 border border-white/20"
              >
                <p className="text-3xl font-bold">{value}</p>
                <p className="text-sm uppercase tracking-widest text-white/70">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="py-12">
        <Motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-base-content mb-4">
            Popular Skills
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Discover and learn from our most sought-after skills offered by
            expert tutors
          </p>
        </Motion.div>

        <div id="filters" className="max-w-7xl mx-auto px-4 mb-10">
          <div className="bg-base-100 border border-base-300 rounded-3xl shadow-sm p-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-base-content/80 flex items-center gap-2">
                  <FaSearch className="text-primary" />
                  Search
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder='Try "Python" or "Photography"'
                  className="input input-bordered border-base-300 bg-base-100 text-base-content focus:border-primary"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-base-content/80">
                  Minimum Rating
                </span>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="select select-bordered border-base-300 bg-base-100 text-base-content focus:border-primary"
                >
                  <option value={0}>All ratings</option>
                  <option value={3}>3.0+ stars</option>
                  <option value={4}>4.0+ stars</option>
                  <option value={4.5}>4.5+ stars</option>
                </select>
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-base-content/80">
                  Sort By
                </span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="select select-bordered border-base-300 bg-base-100 text-base-content focus:border-primary"
                >
                  <option value="featured">Featured</option>
                  <option value="priceLowHigh">Price: Low to High</option>
                  <option value="priceHighLow">Price: High to Low</option>
                  <option value="ratingHighLow">Rating: High to Low</option>
                </select>
              </label>

              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-base-content/80">
                  Categories
                </span>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`btn btn-sm rounded-full transition-colors ${
                        selectedCategory === category
                          ? "btn-primary"
                          : "btn-outline border-base-300 text-base-content hover:border-primary hover:text-primary"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-base-content/70">
              <p className="flex items-center gap-2">
                <FaUsers className="text-primary" />
                Showing{" "}
                <span className="font-semibold text-base-content">
                  {filteredSkills.length}
                </span>{" "}
                {filteredSkills.length === 1 ? "skill" : "skills"}
              </p>
              {selectedCategory !== "All" && (
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="text-primary font-medium hover:underline"
                >
                  Clear category filter
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Skills cards */}
        <div id="catalog" className="max-w-7xl mx-auto px-4">
          {filteredSkills.length === 0 ? (
            <div className="rounded-3xl bg-base-200 p-10 text-center text-base-content/70">
              <FaSearch className="text-5xl text-primary mx-auto mb-4 opacity-50" />
              <p className="text-lg font-semibold text-base-content mb-2">
                No skills found
              </p>
              No skills match your filters yet. Try adjusting your search to
              discover more tutors.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredSkills.map(
                ({ skillId, skillName, image, rating, price }) => (
                  <Motion.div
                    key={skillId}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: false }}
                    className="bg-base-100 border border-base-300 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group h-full flex flex-col"
                  >
                    <div className="h-44">
                      <img
                        src={image}
                        alt={skillName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-4 flex flex-col flex-grow">
                      <Link to={`/skill/${skillId}`}>
                        <h3 className="text-lg font-bold text-base-content mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2 min-h-[56px]">
                          {skillName}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          <FaStar className="text-yellow-400 text-sm" />
                          <span className="text-yellow-500 text-sm font-semibold">
                            {rating}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-primary font-bold text-xl">
                          ${price}
                        </span>
                        <Link to={`/skill/${skillId}`}>
                          <button className="btn btn-primary btn-sm rounded-lg">
                            View Details
                          </button>
                        </Link>
                      </div>
                    </div>
                  </Motion.div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Service;
