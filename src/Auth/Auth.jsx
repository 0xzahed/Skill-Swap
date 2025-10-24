import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../Components/NavBar/NavBar";

const Auth = () => {
  return (
    <div>
      <NavBar></NavBar>
      <Outlet />
    </div>
  );
};

export default Auth;
