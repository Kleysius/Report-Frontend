// src/App.jsx
import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import AuthProvider from "./contexts/AuthProvider";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/Home";
import ReportPage from "./pages/ReportPage";
import StatsPage from "./pages/StatsPage";
import Login from "./pages/Login";
import AdminMachines from "./pages/AdminMachines";
import AdminReports from "./pages/AdminReports";
import AdminUsers from "./pages/AdminUsers";
import MachineHistory from "./pages/MachineHistory";
import DocsPage from "./pages/DocsPage";

import Header from "./components/Header";
import Footer from "./components/Footer";
import siteJour from "./assets/Site-jour.png";
import siteNuit from "./assets/Site-nuit.png";

// Composant interne pour pouvoir gérer le background et centrer certaines routes
function AppLayout() {
  const location = useLocation();
  const centrer = ["/home", "/rapport", "/login", "/docs"].includes(
    location.pathname
  );

  return (
    <div className="relative min-h-screen flex flex-col text-gray-900 dark:text-white overflow-hidden">
      {/* Image de fond selon le thème */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <img
          src={siteNuit}
          alt="Site industriel de nuit"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-0 dark:opacity-100"
        />
        <img
          src={siteJour}
          alt="Site industriel de jour"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 dark:opacity-0 opacity-100"
        />
        <div className="absolute inset-0 bg-white/20 dark:bg-black/40 backdrop-blur-sm" />
      </div>

      <Header />

      <main
        className={`flex-grow relative z-10 overflow-y-auto ${
          centrer ? "flex items-center justify-center" : "px-4 py-6"
        }`}
      >
        <Routes>
          {/* Page d’accueil */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* Authentification publique */}
          <Route path="/login" element={<Login />} />

          {/* Documentation */}
          <Route path="/docs" element={<Navigate to="/docs/intro" replace />} />
          <Route path="/docs/:docId" element={<DocsPage />} />

          {/* Routes pour tout utilisateur connecté */}
          <Route element={<PrivateRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/rapport" element={<ReportPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/machine-history" element={<MachineHistory />} />
          </Route>

          {/* Routes réservées à l’admin */}
          <Route element={<PrivateRoute adminOnly />}>
            <Route path="/admin/machines" element={<AdminMachines />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>

          {/* Catch‑all → accueil */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

// Racine de l’app
export default function App() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}