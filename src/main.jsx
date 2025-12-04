import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RouterProvider } from "react-router-dom";
import router from "./Routes/Router.jsx";
import AuthProvider from "./providers/AuthProvider.jsx";
import ThemeProvider from "./providers/ThemeProvider.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router}></RouterProvider>
        <Toaster position="top-right" />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
