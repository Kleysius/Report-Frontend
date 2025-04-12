import { useState } from "react";
import ReportPage from "./ReportPage";
import { BeakerIcon, BuildingOffice2Icon } from "@heroicons/react/24/solid";

const Home = () => {
  const [selectedSector, setSelectedSector] = useState(null);

  if (selectedSector) {
    return (
      <ReportPage
        selectedSector={selectedSector}
        onBack={() => setSelectedSector(null)}
      />
    );
  }

  return (
    <div className="flex items-center justify-center w-full px-4">
      <div className="max-w-md w-full p-8 text-center backdrop-blur-md bg-white/50 dark:bg-gray-800/80 border border-white/30 dark:border-gray-600/20 shadow-xl rounded-xl transition-colors duration-500 ease-in-out">
        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-4 tracking-tight">
          Rapport journalier lubrification
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Veuillez choisir votre secteur pour commencer :
        </p>

        <div className="flex flex-col gap-4">
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

        <p className="mt-6 text-sm text-gray-500">
          Propulsé par I-care & Kem One
        </p>
      </div>
    </div>
  );
};

export default Home;
