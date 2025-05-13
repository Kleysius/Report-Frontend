import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import Spinner from "../components/ui/Spinner";
import {
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const SECTORS = ["AC/V", "AC/E"];

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);

  const [sector, setSector] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [anomalyType, setAnomalyType] = useState("");

  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (sector) params.sector = sector;
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;
      if (anomalyType) params.anomalyType = anomalyType;

      const res = await axios.get("/admin/reports", { params });
      setReports(res.data.data);
      setPageCount(res.data.pages);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Erreur chargement rapports :", err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, sector, dateFrom, dateTo, anomalyType]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handlePageClick = ({ selected }) => setPage(selected + 1);
  const applyFilters = () => setPage(1);
  const handleExport = async () => {
    const qs = new URLSearchParams({
      page,
      limit,
      sector,
      dateFrom,
      dateTo,
      anomalyType,
      exportCsv: 1,
    }).toString();
  
    try {
      // 1) on demande un blob (le CSV)
      const res = await axios.get(`/admin/reports?${qs}`, {
        responseType: "blob",
      });
  
      // 2) on crée un URL pour le blob
      const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
  
      // 3) on simule un clic sur un <a download>
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "rapports.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
  
      // 4) on libère l’URL
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erreur export CSV :", err);
      alert("Impossible de télécharger le CSV.");
    }
  };  

  const requestDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };
  const confirmDelete = async () => {
    try {
      await axios.delete(`/reports/${deleteId}`);
      fetchReports();
    } catch (err) {
      console.error("Erreur suppression rapport :", err);
      alert("Impossible de supprimer le rapport ; consultez la console pour plus de détails.");
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  return (
    <section className="p-4 max-w-screen-lg mx-auto space-y-6">
      {/* En‑tête filtres */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 transition">
        {/* Ligne 1 : Titre */}
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Vue Agrégée des Rapports
        </h1>

        {/* Ligne 2 : Filtres */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 transition"
          >
            <option value="">Tous secteurs</option>
            {SECTORS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 transition"
          />

          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 transition"
          />

          <input
            type="text"
            placeholder="Filtrer par mot-clé"
            value={anomalyType}
            onChange={(e) => setAnomalyType(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 transition"
          />

          {/* on pousse le total ici en XL, sinon vide */}
          <div className="hidden xl:flex items-center text-sm text-gray-600 dark:text-gray-400">
            Total : {total}
          </div>
        </div>

        {/* Ligne 3 : Boutons et total (mobile & tablette) */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={applyFilters}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition"
          >
            Appliquer
          </button>
          <button
            onClick={handleExport}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
          >
            Exporter CSV
          </button>
          <div className="ml-auto text-sm text-gray-600 dark:text-gray-400 xl:hidden">
            Total : {total}
          </div>
        </div>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto rounded-xl shadow">
        <table className="min-w-full bg-white dark:bg-gray-800 transition">
          <thead className="bg-gray-100 dark:bg-gray-700 text-left">
            <tr>
              {[
                "Date",
                "Secteur",
                "Tournée",
                "Anomalies",
                "Sécurité",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center">
                  <Spinner size="h-10 w-10" />
                </td>
              </tr>
            ) : reports.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-4 text-center text-gray-500 dark:text-gray-400"
                >
                  Aucun rapport.
                </td>
              </tr>
            ) : (
              reports.map((r) => (
                <tr
                  key={r.id}
                  className="group border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                    {new Date(r.date).toLocaleString("fr-FR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm">{r.sector}</td>
                  <td className="px-4 py-3 text-sm">{r.tour}</td>
                  <td className="px-4 py-3 text-sm">{r.anomalies}</td>
                  <td className="px-4 py-3 text-sm">{r.security}</td>
                  <td className="px-4 py-3 text-sm whitespace-nowrap">
                    <div className="flex items-center gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <TrashIcon
                        className="w-5 h-5 text-red-600 hover:text-red-800 cursor-pointer"
                        onClick={() => requestDelete(r.id)}
                        title="Supprimer"
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex justify-center">
          <ReactPaginate
            breakLabel="…"
            nextLabel="Suiv >"
            previousLabel="< Préc"
            pageCount={pageCount}
            forcePage={page - 1}
            onPageChange={handlePageClick}
            containerClassName="flex gap-2 mt-4"
            pageClassName="px-3 py-1 rounded text-white hover:text-indigo-600 hover:bg-indigo-100 dark:hover:text-white dark:hover:bg-indigo-500 transition"
            activeClassName="bg-indigo-600 text-white"
            previousClassName="px-3 py-1 rounded text-white hover:text-indigo-600 hover:bg-indigo-100 dark:hover:text-white dark:hover:bg-indigo-500 transition"
            nextClassName="px-3 py-1 rounded text-white hover:text-indigo-600 hover:bg-indigo-100 dark:hover:text-white dark:hover:bg-indigo-500 transition"
            disabledClassName="opacity-50 cursor-not-allowed"
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
          />
        </div>
      )}

      {/* Modale suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md animate-slide-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={cancelDelete}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Confirmer la suppression
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Voulez-vous vraiment supprimer ce rapport ?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
