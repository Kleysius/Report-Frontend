import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ✅ Ajout ici
import "flowbite";
import "./index.css";
import App from "./App.jsx";

const isDarkMode = localStorage.getItem("darkMode") === "true";
if (isDarkMode) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter> {/* ✅ Wrap ici */}
      <App />
    </BrowserRouter>
  </StrictMode>
);