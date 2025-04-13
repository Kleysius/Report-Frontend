import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Home from "./pages/Home";
import ReportPage from "./pages/ReportPage";
import StatsPage from "./pages/StatsPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import siteJour from "./assets/Site-jour.png";
import siteNuit from "./assets/Site-nuit.png";

function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isRapport = location.pathname === "/rapport";

  return (
    <div className="relative min-h-screen flex flex-col text-gray-900 dark:text-white overflow-hidden">
      {/* 🖼️ Image de fond selon le thème */}
      <div className="fixed top-0 left-0 w-full h-screen -z-10 overflow-hidden">
        <img
          src={siteNuit}
          alt="Site industriel de nuit"
          className="w-full h-full object-cover absolute inset-0 transition-opacity duration-700 opacity-0 dark:opacity-100"
        />
        <img
          src={siteJour}
          alt="Site industriel de jour"
          className="w-full h-full object-cover absolute inset-0 transition-opacity duration-700 dark:opacity-0 opacity-100"
        />
        <div className="absolute inset-0 bg-white/20 dark:bg-black/40 backdrop-blur-sm" />
      </div>

      <Header />
      <main
        className={`flex-grow relative z-10 overflow-y-auto ${isHome || isRapport ? "flex items-center justify-center" : "px-4 py-6"
          }`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rapport" element={<ReportPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;