import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to light
    const savedTheme = localStorage.getItem("skillswap-theme");
    return savedTheme || "light";
  });

  useEffect(() => {
    // Update document data-theme attribute for DaisyUI
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("skillswap-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
