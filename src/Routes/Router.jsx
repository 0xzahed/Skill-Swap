import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Root from "../Root/Root";
import Home from "../Pages/Home";
import About from "../Pages/About";
import ContactUs from "../Pages/ContactUs";
import Service from "../Pages/Service";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: Home,
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
    ],
  },
]);

export default router;
