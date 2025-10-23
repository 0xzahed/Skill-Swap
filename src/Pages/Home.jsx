import React from "react";
import Header from "../Components/Header/Header";
import Service from "./Service";
import HowItWork from "./HowItWork";
import { useLoaderData } from "react-router-dom";
import TopRatedTutors from "./TopRatedTutors";

const Home = () => {
  const skills = useLoaderData(); 
  console.log(skills);

  return (
    <div>
      <Header></Header>
      <div id="services">
        <Service skills={skills} />
      </div>
      <TopRatedTutors></TopRatedTutors>
      <HowItWork />
    </div>
  );
};

export default Home;
