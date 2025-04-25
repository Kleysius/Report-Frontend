// src/components/Footer.jsx
import { Link } from "react-router-dom";
import {
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";

export default function Footer() {
  const year = new Date().getFullYear();
  const version = import.meta.env.VITE_APP_VERSION;

  return (
    <footer className="backdrop-blur-md bg-white/60 dark:bg-gray-800/60 border-t border-gray-200 dark:border-gray-700 shadow-inner mt-12 transition-colors duration-500 ease-in-out">
      <div className="max-w-screen-xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Crédit et droits */}
        <div className="text-center sm:text-left">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Développé par{" "}
            <span className="font-semibold text-gray-800 dark:text-white">
              Thomas S.
            </span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            &copy; {year} — Tous droits réservés
          </p>
        </div>

        {/* Liens utiles */}
        <div className="flex flex-wrap items-center gap-4 text-gray-700 dark:text-gray-300">
          {/* Documentation interne */}
          <Link
            to="/docs/intro"
            className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            <DocumentTextIcon className="w-5 h-5" />
            Documentation
          </Link>

          {/* Support par e‑mail */}
          <a
            href="mailto:thomas.sebasti@icareweb.com"
            className="flex items-center gap-1 hover:text-green-600 dark:hover:text-green-400 transition"
          >
            <ChatBubbleLeftRightIcon className="w-5 h-5" />
            Support
          </a>

          {/* Version affichée */}
          {version && (
            <span className="ml-auto sm:ml-0 text-xs text-gray-500 dark:text-gray-500">
              v{version}
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}