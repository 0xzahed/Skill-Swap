import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Root from "../Root/Root";
import Home from "../Pages/Home";
import About from "../Pages/About";
import ContactUs from "../Pages/ContactUs";
import Service from "../Pages/Service";
import Auth from "../Auth/Auth";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import SkillDetails from "../Pages/SkillDetails";
import MyProfile from "../Pages/MyProfile";
import ForgotPassword from "../Pages/ForgotPassword";
import Error404 from "../Pages/Error404";
import MyBookings from "../Pages/MyBookings";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: Home,
        loader: () => fetch("/skills.json"),
      },
      // {
      //     path: 'home',
      //     Component: Home
      // },
      {
        path: "about",
        Component: About,
      },
      {
        path: "contact_us",
        Component: ContactUs,
      },
      {
        path: "service",
        Component: Service,
        loader: () => fetch("/skills.json"),
      },
      {
        path: "skill/:id",
        Component: SkillDetails,
      },
      {
        path: "profile",
        Component: MyProfile,
      },
      {
        path: "my-bookings",
        Component: MyBookings,
      },
      {
        path: "forgot-password",
        Component: ForgotPassword,
      },
      {
        path: "*",
        Component: Error404,
      },
    ],
  },
  {
    path: "auth",
    Component: Auth,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
      // {
      //   path: "*",
      //   Component: Error404,
      // },
    ],
  },
  {
    path: "*",
    Component: Error404,
  },
]);

export default router;
