import { useState, useEffect, useContext, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import {
  HomeIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  Bars3Icon,
  XMarkIcon,
  Cog6ToothIcon,
  UsersIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";

const NAV_ITEMS = [
  { to: "/", label: "Accueil", Icon: HomeIcon },
  { to: "/stats", label: "Statistiques", Icon: ChartBarIcon },
  { to: "/machine-history", label: "Historique", Icon: ClipboardDocumentListIcon },
];

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const { pathname } = useLocation();
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") === "dark" ? "dark" : "light"
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const adminRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (adminRef.current && !adminRef.current.contains(e.target)) {
        setAdminMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <header className="sticky top-0 z-50 mb-4 backdrop-blur-md bg-white/60 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
        {/* Logo / Titre */}
        <Link to="/" className="flex items-center">
          <img
            src="/logo-kemone.png"
            alt="Kem One"
            className="h-8 filter dark:invert"
          />
        </Link>

        {/* Message de bienvenue */}
        {user && (
          <div className="hidden md:block text-gray-800 dark:text-gray-200 font-medium mx-6">
            Bonjour,{" "}
            <span className="font-semibold">{user.username}</span>{" "}
            👋
          </div>
        )}

        {/* Nav Desktop */}
        <nav className="hidden md:flex items-center space-x-6 text-gray-700 dark:text-gray-300">
          {user ? (
            <>
              {NAV_ITEMS.map(({ to, label, Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md transition ${
                    pathname === to
                      ? "bg-indigo-100 dark:bg-indigo-800 font-semibold"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              ))}

              {user.role === "admin" && (
                <div ref={adminRef} className="relative">
                  <button
                    onClick={() => setAdminMenuOpen((o) => !o)}
                    className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    <Cog6ToothIcon className="w-5 h-5" /> Admin
                  </button>
                  <div
                    className={`absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg transition-opacity duration-200 ${
                      adminMenuOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                    }`}
                  >
                    <Link
                      to="/admin/machines"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <ClipboardDocumentListIcon className="w-5 h-5 text-green-600" />{" "}
                      Machines
                    </Link>
                    <Link
                      to="/admin/reports"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <ChartBarIcon className="w-5 h-5 text-blue-600" />{" "}
                      Rapports
                    </Link>
                    <Link
                      to="/admin/users"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <UsersIcon className="w-5 h-5 text-purple-600" />{" "}
                      Utilisateurs
                    </Link>
                  </div>
                </div>
              )}

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                aria-label="Changer le thème"
              >
                {theme === "dark" ? (
                  <SunIcon className="w-6 h-6 text-yellow-400" />
                ) : (
                  <MoonIcon className="w-6 h-6 text-gray-600" />
                )}
              </button>

              {/* Déconnexion */}
              <button
                onClick={logout}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <span className="text-gray-600 dark:text-gray-400 italic">
              Bienvenue ! Veuillez vous connecter pour accéder à l'application.
            </span>
          )}
        </nav>

        {/* Burger Mobile */}
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition"
        >
          {mobileOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <nav className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="flex flex-col p-4 space-y-2">
            {user ? (
              <>
                {/* Message de bienvenue mobile */}
                <div className="px-3 py-2 text-gray-800 dark:text-gray-200 font-medium">
                  Bonjour, <span className="font-semibold">{user.username}</span> 👋
                </div>
                {NAV_ITEMS.map(({ to, label, Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    <Icon className="w-5 h-5" /> {label}
                  </Link>
                ))}
                {user.role === "admin" && (
                  <>
                    <Link
                      to="/admin/machines"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                      <ClipboardDocumentListIcon className="w-5 h-5 text-green-600" />{" "}
                      Gérer les machines
                    </Link>
                    <Link
                      to="/admin/reports"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                      <ChartBarIcon className="w-5 h-5 text-blue-600" />{" "}
                      Rapports
                    </Link>
                    <Link
                      to="/admin/users"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                      <UsersIcon className="w-5 h-5 text-purple-600" />{" "}
                      Utilisateurs
                    </Link>
                  </>
                )}
                <button
                  onClick={() => {
                    toggleTheme();
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  {theme === "dark" ? (
                    <SunIcon className="w-6 h-6 text-yellow-400" />
                  ) : (
                    <MoonIcon className="w-6 h-6 text-gray-600" />
                  )}
                  {theme === "dark" ? "Mode clair" : "Mode sombre"}
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition"
              >
                Se connecter
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
