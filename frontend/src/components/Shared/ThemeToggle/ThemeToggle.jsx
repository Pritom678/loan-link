import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

const ThemeToggle = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Get theme from localStorage or default to light
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className={`btn btn-ghost btn-circle transition-all duration-300 ${
        theme === "dark"
          ? "bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400"
          : "hover:bg-gray-100 text-gray-600"
      }`}
      aria-label="Toggle theme"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <FiMoon className="h-5 w-5 transition-transform duration-300 hover:rotate-12" />
      ) : (
        <FiSun className="h-5 w-5 transition-transform duration-300 hover:rotate-180" />
      )}
    </button>
  );
};

export default ThemeToggle;
