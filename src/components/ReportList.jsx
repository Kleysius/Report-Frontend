import { useState } from "react";
import axios from "axios";
import {
  ChevronUpIcon,
  EyeIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import ExportPDF from "./ExportPDF";
import ReportDetailsModal from "./ReportDetailsModal";

// 📆 Fonction externe pour éviter la recréation dans chaque rendu
const formatDate = (dateString) =>
  new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString));

const ReportList = ({ reports, onRefresh, onEdit, selectedSector }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [sortOption, setSortOption] = useState("date_desc");

  const sortedReports = [...reports].sort((a, b) => {
    if (sortOption === "date_desc") return new Date(b.date) - new Date(a.date);
    if (sortOption === "date_asc") return new Date(a.date) - new Date(b.date);
    if (sortOption === "sector_asc") return a.sector.localeCompare(b.sector);
    if (sortOption === "sector_desc") return b.sector.localeCompare(a.sector);
    return 0;
  });

  const deleteReport = async () => {
    const api = import.meta.env.VITE_API_URL;
    if (!selectedReport) return;

    try {
      await axios.delete(`${api}/reports/${selectedReport.id}`);
      onRefresh();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    } finally {
      setModalOpen(false);
      setSelectedReport(null);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-900 shadow-md rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-500 ease-in-out">
      {/* 🏷️ Titre avec Toggle */}
      <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-lg py-3 px-5 rounded-t-lg border-b border-gray-300 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 transition-colors duration-500 ease-in-out">
        <div
          className="flex items-center justify-between w-full sm:w-auto cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>Liste des Rapports</span>
          <ChevronUpIcon
            className={`w-5 h-5 ml-2 text-gray-600 dark:text-gray-300 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {/* 🔽 Tri dans l'en-tête */}
        <div className="flex items-center gap-2 text-sm">
          <label htmlFor="sort" className="text-gray-700 dark:text-gray-300">
            Trier :
          </label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-2 py-1 rounded-md text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white transition-colors duration-500 ease-in-out"
          >
            <option value="date_desc">Date ↓</option>
            <option value="date_asc">Date ↑</option>
            <option value="sector_asc">Secteur A → Z</option>
            <option value="sector_desc">Secteur Z → A</option>
          </select>
        </div>
      </div>

      {/* 📜 Liste des rapports */}
      <div className="relative">
        <div
          className={`transition-all duration-300 ${
            isOpen
              ? "max-h-60 overflow-y-auto hide-scrollbar"
              : "max-h-0 overflow-hidden"
          }`}
        >
          {reports.length === 0 ? (
            <p className="p-3 text-sm text-gray-500 dark:text-gray-400">
              Aucun rapport trouvé.
            </p>
          ) : (
            <ul>
              {sortedReports.map((report) => {
                const classicPhotos = report.entries?.reduce(
                  (acc, e) =>
                    acc +
                    (Array.isArray(e.images)
                      ? e.images.length
                      : e.image
                      ? 1
                      : 0),
                  0
                );
                const safetyPhotos = report.safetyEvents?.reduce(
                  (acc, e) =>
                    acc +
                    (Array.isArray(e.images)
                      ? e.images.length
                      : e.image
                      ? 1
                      : 0),
                  0
                );
                const heavyPhotos = report.heavyEntries?.reduce(
                  (acc, e) =>
                    acc + (Array.isArray(e.images) ? e.images.length : 0),
                  0
                );
                const totalPhotos = classicPhotos + safetyPhotos + heavyPhotos;

                return (
                  <li
                    key={report.id}
                    className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm px-4 py-2 m-2 flex flex-col sm:flex-row sm:items-center sm:justify-between transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex-1 text-sm">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {report.sector}
                        <span className="text-xs ml-2 font-normal text-gray-500 dark:text-gray-400">
                          ({formatDate(report.date)})
                        </span>
                      </p>

                      <p className="text-gray-700 dark:text-gray-300 mt-1 flex flex-wrap items-center gap-2">
                        {/* ✅ Signalements classiques */}
                        {report.entries.filter(
                          (e) => !e.out_of_tour && e.machine_tag && e.comment
                        ).length > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300">
                            ✅{" "}
                            {
                              report.entries.filter(
                                (e) =>
                                  !e.out_of_tour && e.machine_tag && e.comment
                              ).length
                            }{" "}
                            signalement
                            {report.entries.filter(
                              (e) =>
                                !e.out_of_tour && e.machine_tag && e.comment
                            ).length > 1 && "s"}
                          </span>
                        )}

                        {/* 🟡 Machines hors tournée (avec au moins un commentaire saisi) */}
                        {report.entries.filter(
                          (e) => e.out_of_tour && e.comment
                        ).length > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400">
                            🟡{" "}
                            {
                              report.entries.filter(
                                (e) => e.out_of_tour && e.comment
                              ).length
                            }{" "}
                            hors tournée
                          </span>
                        )}

                        {/* ⚠️ Événements sécurité valides */}
                        {report.safetyEvents.filter(
                          (e) => e.type && e.description
                        ).length > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300">
                            ⚠{" "}
                            {
                              report.safetyEvents.filter(
                                (e) => e.type && e.description
                              ).length
                            }{" "}
                            sécurité
                          </span>
                        )}

                        {/* 🏋️ Relevés grosses machines : on affiche seulement si au moins un champ est rempli */}
                        {report.heavyEntries &&
                          report.heavyEntries.filter((entry) =>
                            Object.values(entry).some(
                              (val, key) =>
                                key !== "machine_tag" &&
                                val !== null &&
                                val !== undefined &&
                                val !== ""
                            )
                          ).length > 0 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                              🏋️{" "}
                              {
                                report.heavyEntries.filter((entry) =>
                                  Object.values(entry).some(
                                    (val, key) =>
                                      key !== "machine_tag" &&
                                      val !== null &&
                                      val !== undefined &&
                                      val !== ""
                                  )
                                ).length
                              }{" "}
                              relevé{report.heavyEntries.length > 1 && "s"}{" "}
                              grosses machines
                            </span>
                          )}

                        {totalPhotos > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                            🖼️ {totalPhotos} photo{totalPhotos > 1 && "s"}
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="ml-4 flex items-center gap-2">
                      {/* ✏️ Modifier le rapport (uniquement si le rapport a été enregistré) */}
                      <button
                        onClick={() => onEdit(report)}
                        title={
                          report.sector !== selectedSector
                            ? "Ce rapport appartient à un autre secteur"
                            : "Modifier"
                        }
                        disabled={report.sector !== selectedSector}
                        className={`p-1 rounded transition ${
                          report.sector !== selectedSector
                            ? "opacity-30 cursor-not-allowed"
                            : "hover:bg-yellow-100 dark:hover:bg-yellow-900/20"
                        }`}
                      >
                        <PencilIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      </button>

                      {/* 👁️ Détails du rapport */}
                      <button
                        onClick={() => setSelectedReport(report)}
                        title="Voir"
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                      >
                        <EyeIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </button>

                      {/* 📄 Exporter en PDF (uniquement si le rapport a été enregistré) */}
                      {report.id && (
                        <ExportPDF
                          reportData={{
                            sector: report.sector,
                            tour: report.tour,
                            entries: report.entries,
                            image: report.image,
                            date: report.date,
                            safetyEvents: report.safetyEvents,
                            heavyEntries: report.heavyEntries,
                          }}
                        />
                      )}

                      {/* 🗑️ Supprimer le rapport */}
                      <button
                        onClick={() => {
                          setSelectedReport(report);
                          setModalOpen(true);
                        }}
                        title="Supprimer"
                        disabled={report.sector !== selectedSector}
                        className={`p-1 rounded transition 
                      ${
                        report.sector !== selectedSector
                          ? "opacity-30 cursor-not-allowed"
                          : "hover:bg-red-100 dark:hover:bg-red-900/20"
                      }
                      `}
                      >
                        <TrashIcon className="w-5 h-5 text-red-600 dark:text-red-500" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        {/* Effet de dégradé bas si scrollable */}
        {isOpen && reports.length > 3 && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white dark:from-gray-900 to-transparent pointer-events-none" />
        )}
      </div>

      {/* 🚀 MODAL de confirmation */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-lg bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-96 border border-gray-300 dark:border-gray-700">
            <div className="px-5 py-3 border-b border-gray-300 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Confirmer la suppression
              </h3>
            </div>
            <div className="p-5">
              <p className="text-gray-700 dark:text-gray-300">
                Voulez-vous vraiment supprimer le rapport du secteur{" "}
                <strong>{selectedReport?.sector}</strong> du{" "}
                <strong>{formatDate(selectedReport?.date)}</strong> ?
              </p>
            </div>
            <div className="px-5 py-4 flex justify-end gap-2 border-t border-gray-300 dark:border-gray-700">
              <button
                onClick={() => {
                  setModalOpen(false);
                  setSelectedReport(null);
                }}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Annuler
              </button>
              <button
                onClick={deleteReport}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📜 Détails du rapport */}
      {selectedReport && !modalOpen && (
        <ReportDetailsModal
          report={selectedReport}
          onClose={() => {
            setSelectedReport(null);
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ReportList;
