import { useState, useEffect } from "react";
import ReportPage from "./ReportPage";
import { BeakerIcon, BuildingOffice2Icon } from "@heroicons/react/24/solid";

const SECTORS = [
  {
    id: "AC/V",
    label: "Secteur AC/V",
    Icon: BeakerIcon,
    btnClasses: "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500",
  },
  {
    id: "AC/E",
    label: "Secteur AC/E",
    Icon: BuildingOffice2Icon,
    btnClasses: "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500",
  },
];

export default function Home() {
  const [selectedSector, setSelectedSector] = useState(null);

  // Permet au header de resetHomePage()
  useEffect(() => {
    window.resetHomePage = () => {
      setSelectedSector(null);
      delete window.selectedSector;
    };
    return () => {
      delete window.resetHomePage;
      delete window.selectedSector;
    };
  }, []);

  // Expose pour le header
  useEffect(() => {
    window.selectedSector = selectedSector;
  }, [selectedSector]);

  if (selectedSector) {
    return <ReportPage selectedSector={selectedSector} />;
  }

  return (
    <main className="flex items-center justify-center">
      <section className="w-full max-w-md p-8 bg-white/50 dark:bg-gray-800/80 backdrop-blur-md border border-white/30 dark:border-gray-600/20 rounded-xl shadow-xl text-center transition">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 dark:text-white mb-4 tracking-tight">
          Rapport journalier lubrification
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-8">
          Veuillez choisir votre secteur pour commencer :
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SECTORS.map(({ id, label, Icon, btnClasses }) => (
            <button
              key={id}
              onClick={() => setSelectedSector(id)}
              className={`
                flex items-center justify-center gap-3 
                ${btnClasses} text-white font-semibold 
                py-3 px-5 rounded-lg shadow-lg focus:outline-none 
                focus:ring-4 transition-transform hover:scale-105
              `}
            >
              <Icon className="w-6 h-6" />
              {label}
            </button>
          ))}
        </div>

        <p className="mt-6 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Propulsé par{" "}
          <a
            href="https://www.icareweb.com/fr/"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            I-care
          </a>{" "}
          &amp;{" "}
          <a
            href="https://www.kemone.com/fr"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Kem One
          </a>
        </p>
      </section>
    </main>
  );
}
