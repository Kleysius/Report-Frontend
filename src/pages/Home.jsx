import { useState, useEffect } from "react";
import ReportPage from "./ReportPage";
import { BeakerIcon, BuildingOffice2Icon } from "@heroicons/react/24/solid";

const Home = () => {
  const [selectedSector, setSelectedSector] = useState(null);

  useEffect(() => {
    window.resetHomePage = () => {
      setSelectedSector(null);
      window.selectedSector = null;
    };
    return () => {
      delete window.resetHomePage;
      delete window.selectedSector;
    };
  }, []);

  useEffect(() => {
    window.selectedSector = selectedSector;
  }, [selectedSector]);

  if (selectedSector) {
    return <ReportPage selectedSector={selectedSector} />;
  }

  return (
    <div className="flex items-center justify-center w-full px-4">
      <div className="w-full max-w-md sm:max-w-xl md:rounded-2xl lg:px-12 p-6 sm:p-8 text-center backdrop-blur-md bg-white/50 dark:bg-gray-800/80 border border-white/30 dark:border-gray-600/20 shadow-xl rounded-xl transition-colors duration-500 ease-in-out">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 dark:text-white mb-4 tracking-tight">
          Rapport journalier lubrification
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-8">
          Veuillez choisir votre secteur pour commencer :
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => setSelectedSector("AC/V")}
            className="flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-5 rounded-lg shadow-lg transition-transform hover:scale-105"
          >
            <BeakerIcon className="w-6 h-6" />
            Secteur AC/V
          </button>

          <button
            onClick={() => setSelectedSector("AC/E")}
            className="flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-5 rounded-lg shadow-lg transition-transform hover:scale-105"
          >
            <BuildingOffice2Icon className="w-6 h-6" />
            Secteur AC/E
          </button>
        </div>

        <p className="mt-6 text-xs sm:text-sm text-gray-500">
          Propulsé par {" "}
          <a
            href="https://www.icareweb.com/fr/"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            I-care
          </a> {" "}& {" "}
          <a
            href="https://www.kemone.com/fr"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Kem One
          </a>
        </p>
      </div>
    </div>
  );
};

export default Home;