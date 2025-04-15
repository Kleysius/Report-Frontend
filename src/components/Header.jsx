import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  HomeIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  Bars3Icon,
  XMarkIcon
} from "@heroicons/react/24/outline";

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const navigate = useNavigate();
  const [activeSector, setActiveSector] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateSector = () => {
      setActiveSector(window.selectedSector || null);
    };

    updateSector();
    const observer = setInterval(updateSector, 500);
    return () => clearInterval(observer);
  }, []);

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
      <div className="flex items-center justify-between w-full mx-auto max-w-screen-xl">
        {/* 📅 Date dynamique */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {new Date().toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>

        {/* Rapport en cours */}
        {activeSector && (
          <div className="hidden md:flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-300">
            <ClipboardDocumentListIcon className="w-5 h-5 flex-shrink-0" />
            <div className="relative w-[158px] h-[20px]">
              <span className="typewriter absolute left-0 top-0">
                Rapport en cours : {activeSector}
              </span>
            </div>
          </div>
        )}

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-700 dark:text-gray-300">
          <button
            onClick={() => {
              navigate("/");
              if (window.resetHomePage) window.resetHomePage();
            }}
            className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            <HomeIcon className="w-5 h-5" />
            Accueil
          </button>

          <Link
            to="/stats"
            className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            <ChartBarIcon className="w-5 h-5" />
            Statistiques
          </Link>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="cursor-pointer transition hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
            title={isDarkMode ? "Passer en mode clair" : "Passer en mode sombre"}
          >
            {isDarkMode ? (
              <svg className="w-6 h-6 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 3a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0V3ZM6.343 4.929A1 1 0 0 0 4.93 6.343l1.414 1.414a1 1 0 0 0 1.414-1.414L6.343 4.929Zm12.728 1.414a1 1 0 0 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 1.414 1.414l1.414-1.414ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm-9 4a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H3Zm16 0a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2h-2ZM7.757 17.657a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414Zm9.9-1.414a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414l-1.414-1.414ZM13 19a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2Z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-500 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.675 2.015a.998.998 0 0 0-.403.011C6.09 2.4 2 6.722 2 12c0 5.523 4.477 10 10 10 4.356 0 8.058-2.784 9.43-6.667a1 1 0 0 0-1.02-1.33c-.08.006-.105.005-.127.005h-.001l-.028-.002A5.227 5.227 0 0 0 20 14a8 8 0 0 1-8-8c0-.952.121-1.752.404-2.558a.996.996 0 0 0 .096-.428V3a1 1 0 0 0-.825-.985Z" />
              </svg>
            )}
          </button>
        </div>

        {/* 🍔 Burger Menu */}
        <button
          className="md:hidden text-gray-700 dark:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
      </div>

      {/* 📱 Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 flex flex-col gap-4 text-sm font-medium text-gray-700 dark:text-gray-300 animate-fade-in-up">
          <button
            onClick={() => {
              navigate("/");
              if (window.resetHomePage) window.resetHomePage();
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <HomeIcon className="w-5 h-5" /> Accueil
          </button>

          <Link
            to="/stats"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <ChartBarIcon className="w-5 h-5" /> Statistiques
          </Link>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center gap-2 hover:text-yellow-500 dark:hover:text-yellow-300"
          >
            {isDarkMode ? "Mode clair" : "Mode sombre"}
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
