import React, { use } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { ThemeContext } from "../../providers/ThemeProvider";

const ThemeToggle = () => {
  const { theme, toggleTheme } = use(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-ghost btn-circle swap swap-rotate"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <FaMoon className="text-xl" />
      ) : (
        <FaSun className="text-xl" />
      )}
    </button>
  );
};

export default ThemeToggle;
