import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ReportForm from "../components/ReportForm";
import ReportList from "../components/ReportList";

const ReportPage = ({ selectedSector, onBack }) => {
  const [reports, setReports] = useState([]);
  const [editedReport, setEditedReport] = useState(null);

  const handleEdit = (report) => {
    setEditedReport(report);
    window.scrollTo({ top: 0, behavior: "smooth" }); // remonter au formulaire
  };

  // 📥 Fonction de récupération centralisée
  const fetchReports = useCallback(async () => {
    const api = import.meta.env.VITE_API_URL;
    try {
      const { data } = await axios.get(`${api}/reports`);
      setReports(data);
    } catch (error) {
      console.error("Erreur lors du chargement des rapports :", error);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // 🛠 Lors de la création d’un rapport, on rafraîchit
  const handleReportCreated = () => {
    fetchReports();
  };

  return (
    <div className="w-full flex flex-col items-center justify-center text-gray-900 dark:text-white">
      {/* 🔙 Retour */}
      <button
        onClick={onBack}
        className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-2 mb-6 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-700 hover:text-white shadow-sm transition-colors duration-500 ease-in-out"
      >
        ⬅ Retour
      </button>

      <h1 className="text-2xl font-bold mb-6">
        Rapport journalier – {selectedSector}
      </h1>

      <ReportForm
        selectedSector={selectedSector}
        onReportCreated={handleReportCreated}
        editedReport={editedReport}
        onEditDone={() => setEditedReport(null)}
      />

      <ReportList
        reports={reports}
        onRefresh={fetchReports}
        onEdit={handleEdit}
        selectedSector={selectedSector}
      />
    </div>
  );
};

export default ReportPage;
