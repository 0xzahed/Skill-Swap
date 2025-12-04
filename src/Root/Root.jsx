import React from "react";
import Home from "../Pages/Home";
import NavBar from "../Components/NavBar/NavBar";
import { Outlet } from "react-router-dom";
import Footer from "../Components/Footer/Footer";
import { Toaster } from "react-hot-toast";
import AIChatbot from "../Components/AIChatbot/AIChatbot";

const Root = () => {
  return (
    <div>
      <NavBar></NavBar>
      <Outlet></Outlet>
      <Footer></Footer>
      <Toaster position="top-right" />
      <AIChatbot />
    </div>
  );
};

export default Root;
