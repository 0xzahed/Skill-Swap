import React from "react";
import { motion as Motion } from "framer-motion";
import Header from "../Components/Header/Header";
import Service from "./Service";
import HowItWork from "./HowItWork";
import { useLoaderData } from "react-router-dom";
import TopRatedTutors from "./TopRatedTutors";
import OverallRatings from "./OverallRatings";

const Home = () => {
  const skills = useLoaderData();
  console.log(skills);

  return (
    <div>
      <Header></Header>
      <Motion.div
        id="services"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false }}
      >
        <Service skills={skills}></Service>
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
