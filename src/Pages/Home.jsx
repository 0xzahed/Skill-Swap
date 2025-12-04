import React from "react";
import { motion as Motion } from "framer-motion";
import Header from "../Components/Header/Header";
import HowItWork from "./HowItWork";
import { useLoaderData } from "react-router-dom";
import TopRatedTutors from "./TopRatedTutors";
import OverallRatings from "./OverallRatings";
import PopularSkills from "../Components/PopularSkills/PopularSkills";
import SmartSearch from "../Components/SmartSearch/SmartSearch";

const Home = () => {
  const skills = useLoaderData();

  return (
    <div>
      <Header></Header>

      {/* Smart Search Section */}
      <Motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-base-200 py-12"
      >
        <div className="max-w-7xl mx-auto px-4">
          <SmartSearch />
        </div>
      </Motion.div>

      <Motion.div
        id="services"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false }}
      >
        <PopularSkills skills={skills} />
      </Motion.div>
      <Motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false }}
      >
        <TopRatedTutors></TopRatedTutors>
      </Motion.div>
      <Motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false }}
      >
        <HowItWork></HowItWork>
      </Motion.div>
      <Motion.div>
        <OverallRatings></OverallRatings>
      </Motion.div>
    </div>
  );
};

export default Home;
