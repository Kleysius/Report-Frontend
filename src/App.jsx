import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import siteJour from "./assets/Site-jour.png";
import siteNuit from "./assets/Site-nuit.png";

function App() {
  return (
    <div className="relative min-h-screen flex flex-col text-gray-900 dark:text-white overflow-hidden">
      {/* 🖼️ Image de fond selon le thème */}
      <div className="fixed top-0 left-0 w-full h-screen -z-10 overflow-hidden">
        {/* 🌙 Image de nuit */}
        <img
          src={siteNuit}
          alt="Site industriel de nuit"
          className="w-full h-full object-cover absolute inset-0 transition-opacity duration-700 opacity-0 dark:opacity-100"
        />
        {/* ☀️ Image de jour */}
        <img
          src={siteJour}
          alt="Site industriel de jour"
          className="w-full h-full object-cover absolute inset-0 transition-opacity duration-700 dark:opacity-0 opacity-100"
        />

        {/* 🎨 Filtre flou par-dessus */}
        <div className="absolute inset-0 bg-white/20 dark:bg-black/40 backdrop-blur-sm" />
      </div>


      {/* 🧱 Contenu principal */}
      <Header />
      <main className="flex-grow flex items-center justify-center relative z-10 overflow-y-auto">
        <Home />
      </main>
      <Footer />

    </div>
  );
}

export default App;
