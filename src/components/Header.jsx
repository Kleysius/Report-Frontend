import { useState, useEffect } from "react";
import kemOneLogo from "../assets/logokemone2.jpg";
import icareLogo from "../assets/logoicare.png";

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // 🎚️ Fonction pour changer le mode clair/sombre
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return (
    <header className="m-4 backdrop-blur-md bg-white/50 dark:bg-gray-800/80 border border-white/30 dark:border-gray-600/20 shadow-xl rounded-xl text-gray-800 dark:text-white px-4 py-2 transition-colors duration-500 ease-in-out">
      <div className="h-18 flex items-center justify-between w-full mx-auto max-w-screen-xl">
        {/* 📅 Date dynamique */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
            {new Date().toLocaleDateString("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            })}
        </div>

        {/* 🏷️ Logos & Featuring */}
        <div className="flex items-center space-x-4">
          <a
            href="https://www.kemone.com/fr"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={kemOneLogo}
              alt="Kem One"
              className="h-14 w-auto rounded-lg hover:scale-105 transition-transform"
            />
          </a>

          <span className="text-2xl font-bold text-gray-600 dark:text-gray-300">
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 18L18 6M18 18L6 6" />
            </svg>
          </span>

          <a
            href="https://www.icareweb.com/fr/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={icareLogo}
              alt="I-care"
              className="h-14 w-auto rounded-lg hover:scale-105 transition-transform"
            />
          </a>
        </div>

        {/* 🔄 Dark Mode Switch */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="cursor-pointer transition hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
          title={isDarkMode ? "Passer en mode clair" : "Passer en mode sombre"}
        >
          {isDarkMode ? (
            <svg
              className="w-6 h-6 text-yellow-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M13 3a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0V3ZM6.343 4.929A1 1 0 0 0 4.93 6.343l1.414 1.414a1 1 0 0 0 1.414-1.414L6.343 4.929Zm12.728 1.414a1 1 0 0 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 1.414 1.414l1.414-1.414ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm-9 4a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H3Zm16 0a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2h-2ZM7.757 17.657a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414Zm9.9-1.414a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414l-1.414-1.414ZM13 19a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2Z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-gray-500 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M11.675 2.015a.998.998 0 0 0-.403.011C6.09 2.4 2 6.722 2 12c0 5.523 4.477 10 10 10 4.356 0 8.058-2.784 9.43-6.667a1 1 0 0 0-1.02-1.33c-.08.006-.105.005-.127.005h-.001l-.028-.002A5.227 5.227 0 0 0 20 14a8 8 0 0 1-8-8c0-.952.121-1.752.404-2.558a.996.996 0 0 0 .096-.428V3a1 1 0 0 0-.825-.985Z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
