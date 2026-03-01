import React from "react";
import Home from "../Pages/Home";
import NavBar from "../Components/NavBar/NavBar";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../Components/Footer/Footer";
import { Toaster } from "react-hot-toast";
import AIChatbot from "../Components/AIChatbot/AIChatbot";

const Root = () => {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <div>
      <NavBar></NavBar>
      <main className={isHome ? "" : "pt-16"}>
        <Outlet></Outlet>
      </main>
      <Footer></Footer>
      <Toaster position="top-right" />
      <AIChatbot />
    </div>
  );
};

export default Root;
