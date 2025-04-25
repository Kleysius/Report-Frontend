// src/pages/DocsPage.jsx
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

const SECTIONS = [
  { id: "intro", title: "Introduction", file: "/docs/intro.md" },
  { id: "install", title: "Installation", file: "/docs/installation.md" },
  { id: "auth", title: "Authentification", file: "/docs/auth.md" },
  { id: "api", title: "API Endpoints", file: "/docs/api.md" },
  { id: "frontend", title: "Front-end", file: "/docs/frontend.md" },
  { id: "admin", title: "Fonctions Admin", file: "/docs/admin.md" },
];

export default function DocsPage() {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(SECTIONS[0].id);
  const [content, setContent] = useState("");

  // Charger la section active
  useEffect(() => {
    const sec = SECTIONS.find((s) => s.id === active);
    if (!sec) return;
    fetch(sec.file)
      .then((r) => r.text())
      .then((md) => setContent(md))
      .catch(console.error);
  }, [active]);

  // Scroll vers l’ancre si on a un hash
  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    el?.scrollIntoView({ behavior: "smooth" });
  }, [content, hash]);

  const filtered = SECTIONS.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex md:flex-col w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700">
        <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100">
            Documentation
          </h2>
        </div>

        <div className="p-3">
          <div className="relative mb-4">
            <MagnifyingGlassIcon className="absolute w-5 h-5 top-2 left-2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-9 pr-2 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
          <nav className="space-y-1">
            {filtered.map((sec) => (
              <button
                key={sec.id}
                onClick={() => {
                  setActive(sec.id);
                  window.location.hash = "";
                }}
                className={`block w-full text-left px-3 py-2 rounded-md transition ${
                  active === sec.id
                    ? "bg-indigo-100 dark:bg-indigo-700 font-semibold"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {sec.title}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden w-full flex items-center justify-between p-3 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
        <button
          onClick={() => navigate(-1)}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <h2 className="font-semibold">Docs</h2>
        {/* On pourrait ajouter un bouton pour afficher un menu mobile identique à la sidebar */}
        <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
          <Bars3Icon className="w-6 h-6" />
        </button>
      </div>

      {/* Contenu principal */}
      <main className="flex-1 overflow-y-auto p-6 prose prose-indigo dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </main>
    </div>
  );
}
