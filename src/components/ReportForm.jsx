import { useState, useEffect, useReducer } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomDateInput from "./CustomDateInput";
import SnackbarAlert from "./SnackbarAlert";
import AnomalyRow from "./AnomalyRow";
import SafetyEventRow from "./SafetyEventRow";
import HeavyMachinesForm from "./HeavyMachinesForm";
import Spinner from "./ui/Spinner";

// 🎛 Reducer pour anomalies
const entriesReducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      return [...state, { machine: "", comment: "", images: [] }];
    case "ADD_OUT_OF_TOUR":
      return [
        ...state,
        { machine: "", comment: "", images: [], out_of_tour: true },
      ];
    case "UPDATE":
      return state.map((entry, index) =>
        index === action.index
          ? { ...entry, [action.field]: action.value }
          : entry
      );
    case "INIT":
      return action.payload;
    case "REMOVE":
      return state.filter((_, index) => index !== action.index);
    case "RESET":
      return [{ machine: "", comment: "", images: [] }];
    default:
      return state;
  }
};

// 🎛 Reducer pour événements sécurité
const safetyEventsReducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      return [...state, { type: "", description: "", images: [] }];
    case "UPDATE":
      return state.map((event, index) =>
        index === action.index
          ? { ...event, [action.field]: action.value }
          : event
      );
    case "INIT":
      return action.payload;
    case "REMOVE":
      return state.filter((_, index) => index !== action.index);
    case "RESET":
      return [];
    default:
      return state;
  }
};

const ReportForm = ({
  selectedSector,
  onReportCreated,
  editedReport,
  onEditDone,
}) => {
  // 📅 Sélection de la date du rapport
  const [reportDate, setReportDate] = useState(
    editedReport && editedReport.date ? new Date(editedReport.date) : new Date()
  );
  const [zone, setZone] = useState("");
  const [machines, setMachines] = useState([]);
  const [entries, dispatch] = useReducer(entriesReducer, [
    { machine: "", comment: "", images: [] },
  ]);
  const [safetyEvents, dispatchSafety] = useReducer(safetyEventsReducer, []);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [removingIndex, setRemovingIndex] = useState(null);
  const [removingSafetyIndex, setRemovingSafetyIndex] = useState(null);
  const [showSafety, setShowSafety] = useState(false);
  const [heavyData, setHeavyData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isDuplicating = Boolean(editedReport) && editedReport.id == null;
  const isEditing = Boolean(editedReport?.id);

  // 🎯 Détection du jour pour la tournée des grosses machines
  const currentDay = reportDate.getDay();
  const isHeavyMachinesDay = currentDay === 1 || currentDay === 5;
  const showHeavyForm = isHeavyMachinesDay && selectedSector;

  // 🔄 Récupération zone de tournée selon la date choisie
  useEffect(() => {
    const api = import.meta.env.VITE_API_URL;
    if (!selectedSector) return;

    const fetchZone = async () => {
      try {
        const { data } = await axios.get(`${api}/zone-of-the-day`, {
          params: {
            sector: selectedSector,
            date: reportDate.toISOString().split("T")[0],
          },
        });
        setZone(data.zones || data.message || "Données non disponibles");
      } catch {
        setZone("Erreur de chargement de la zone.");
      }
    };

    fetchZone();
  }, [selectedSector, reportDate]);

  // 🔄 Récupération des machines selon la date choisie
  useEffect(() => {
    const api = import.meta.env.VITE_API_URL;
    if (!selectedSector) return;

    const fetchMachines = async () => {
      try {
        const { data } = await axios.get(`${api}/machines`, {
          params: {
            sector: selectedSector,
            date: reportDate.toISOString().split("T")[0],
          },
        });
        setMachines(data);
      } catch {
        console.error("Erreur lors du chargement des machines.");
      }
    };

    fetchMachines();
  }, [selectedSector, reportDate]);

  // 🔄 Récupération des données du rapport à éditer ou dupliqué
  useEffect(() => {
    if (!editedReport) return;

    // 1️⃣ Anomalies classiques
    dispatch({ type: "RESET" });
    if (editedReport.entries?.length) {
      dispatch({
        type: "INIT",
        payload: editedReport.entries.map((e) => ({
          machine: e.machine_tag,
          comment: e.comment,
          images: e.images || [],
          out_of_tour: e.out_of_tour === 1,
        })),
      });
    }

    // 2️⃣ Événements sécurité
    dispatchSafety({ type: "RESET" });
    if (editedReport.safetyEvents?.length) {
      dispatchSafety({
        type: "INIT",
        payload: editedReport.safetyEvents.map((e) => ({
          type: e.type,
          description: e.description,
          images: e.images || [],
        })),
      });
      setShowSafety(true);
    } else {
      setShowSafety(false);
    }

    // 3️⃣ Grosses machines
    setHeavyData({});
    if (editedReport.heavyEntries?.length) {
      const heavyMapped = {};
      editedReport.heavyEntries.forEach((entry) => {
        heavyMapped[entry.machine_tag] = {
          pression: entry.pression || "",
          temperature: entry.temperature || "",
          heure: entry.heure || "",
          vidange: entry.vidange_date || "",
          circulation: entry.controle_eau || false,
          niveau: entry.controle_niveau_huile || false,
          comment: entry.observation || "",
          images: entry.images || [],
        };
      });
      setHeavyData(heavyMapped);
    }

    // 4️⃣ Tournée et date
    setZone(editedReport.tour || "");
    setReportDate(new Date(editedReport.date));
  }, [editedReport]);

  // 🔄 Gestion de l'animation de suppression de safetyEventRow
  useEffect(() => {
    if (safetyEvents.length === 0) {
      setShowSafety(false);
    }
  }, [safetyEvents]);

  // 📷 Gestion image pour anomalies
  const handleImageChange = (index, e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((images) => {
      dispatch({
        type: "UPDATE",
        index,
        field: "images",
        value: [...(entries[index]?.images || []), ...images],
      });
    });
  };

  const resetForm = () => {
    dispatch({ type: "RESET" });
    dispatchSafety({ type: "RESET" });
    setHeavyData({});
    setShowSafety(false);
    setReportDate(new Date());
    if (onEditDone) onEditDone(); // Désactive le mode édition
  };

  // 🚀 Soumission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasValidHeavyEntry = Object.values(heavyData).some((entry) =>
      Object.values(entry).some((val) => val && val !== "")
    );

    const hasValidClassicEntry = entries.some(
      (entry) => entry.machine && entry.comment
    );

    const hasValidSafety = safetyEvents.some(
      (event) => event.type && event.description
    );

    if (
      (showHeavyForm && !hasValidHeavyEntry && !hasValidSafety) ||
      (!showHeavyForm && !hasValidClassicEntry && !hasValidSafety)
    ) {
      return setSnackbar({
        open: true,
        message: "Veuillez remplir au moins une ligne.",
        severity: "error",
      });
    }

    // 🏋️ Formatage des données grosses machines
    const heavyEntriesArray = showHeavyForm
      ? Object.entries(heavyData).map(([tag, values]) => ({
          machine_tag: tag,
          pression: values.pression || null,
          temperature: values.temperature || null,
          heure: values.heure || null,
          vidange_date: values.vidange || null,
          controle_eau: values.circulation || null,
          controle_niveau_huile: values.niveau || null,
          observation: values.comment || null,
          images: values.images || [],
        }))
      : null;

    const api = import.meta.env.VITE_API_URL;
    const isEditing = editedReport && editedReport.id;
    const method = isEditing ? "put" : "post";
    const url = isEditing
      ? `${api}/reports/${editedReport.id}`
      : `${api}/reports`;

    setIsSubmitting(true);

    try {
      await axios[method](url, {
        sector: selectedSector,
        tour: zone,
        date: reportDate.toISOString(),
        entries: entries.map((entry) => ({
          ...entry,
          images: entry.images || [],
        })),
        safetyEvents,
        heavyEntries: heavyEntriesArray,
      });

      setSnackbar({
        open: true,
        message: editedReport
          ? "Modifications enregistrées !"
          : "Rapport ajouté !",
        severity: "success",
      });

      if (editedReport && onEditDone) {
        onEditDone();
      }

      onReportCreated({
        sector: selectedSector,
        date: reportDate.toISOString(),
        entries,
        safetyEvents,
        heavyEntries: heavyEntriesArray,
      });

      // 🧹 Reset
      dispatch({ type: "RESET" });
      dispatchSafety({ type: "RESET" });
      setShowSafety(false);
      setHeavyData({});
      setReportDate(new Date());
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Erreur lors de l'enregistrement du rapport.",
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* 🔔 Snackbar pour afficher les messages */}
      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />

      {/* 📌 Tournée du jour / sélectionnée */}
      <div className="max-w-xl mb-3 p-2 text-sm text-center font-semibold text-gray-800 dark:text-gray-300 rounded-md shadow-md border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 transition-colors duration-500 ease-in-out">
        Tournée du <strong>{reportDate.toLocaleDateString("fr-FR")}</strong> :
        <br />
        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
          {zone}
        </span>
      </div>

      <div className="w-full max-w-3xl mx-auto mb-8 bg-white dark:bg-gray-900 shadow-md rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-500 ease-in-out">
        <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-lg py-3 px-4 sm:px-5 rounded-t-lg border-b border-gray-300 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 transition-colors duration-500 ease-in-out">
          <span>Ajouter un Rapport</span>
          <div className="flex items-center gap-2">
            <label
              htmlFor="report-date"
              className="text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Date du rapport
            </label>
            <DatePicker
              id="report-date"
              selected={reportDate}
              onChange={(date) => setReportDate(date)}
              customInput={<CustomDateInput />}
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>

        {isEditing && (
          <div className="mx-3 mt-4 px-4 py-3 rounded-lg border border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10 text-yellow-700 dark:text-yellow-300 text-sm flex items-center justify-center gap-2 shadow-sm animate-fade-slide-down">
            <span>
              ✏️ Vous modifiez un rapport existant.{" "}
              <strong className="font-medium">
                N'oubliez pas d’enregistrer les modifications.
              </strong>
            </span>
          </div>
        )}

        {isDuplicating && (
          <div className="mx-3 mt-4 px-4 py-3 rounded-lg border border-green-400 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-300 text-sm flex items-center justify-center gap-2 shadow-sm animate-fade-slide-down">
            <span>
              📋 Vous dupliquez un ancien rapport.{" "}
              <strong className="font-medium">
                Pensez à ajuster la date et à enregistrer le nouveau rapport.
              </strong>
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} id="report-form">
          <div className="p-4 space-y-4">
            {isHeavyMachinesDay ? (
              <>
                <HeavyMachinesForm
                  sector={selectedSector}
                  data={heavyData}
                  setData={setHeavyData}
                />

                {entries.some((e) => e.out_of_tour) && (
                  <div>
                    <h3 className="text-sm font-semibold mt-6 mb-3 text-yellow-700 dark:text-yellow-400">
                      Hors tournée
                    </h3>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs sm:text-sm text-left text-gray-700 dark:text-gray-300 border-separate border-spacing-y-2">
                        <thead className="hidden sm:table-header-group">
                          <tr>
                            <th className="pl-2">Machine</th>
                            <th>Commentaire</th>
                            <th>Image</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {entries
                            .map((entry, index) => ({
                              ...entry,
                              originalIndex: index,
                            }))
                            .filter((entry) => entry.out_of_tour)
                            .map((entry) => (
                              <AnomalyRow
                                key={entry.originalIndex}
                                index={entry.originalIndex}
                                entry={entry}
                                machines={machines}
                                dispatch={dispatch}
                                removingIndex={removingIndex}
                                setRemovingIndex={setRemovingIndex}
                                handleImageChange={handleImageChange}
                                canDelete={entries.length > 1}
                              />
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div>
                <h3 className="text-sm font-semibold mb-4 text-gray-800 dark:text-gray-300">
                  Anomalies / Actions
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm text-left text-gray-700 dark:text-gray-300 border-separate border-spacing-y-2">
                    <thead className="hidden sm:table-header-group">
                      <tr>
                        <th className="pl-2">Machine</th>
                        <th>Commentaire</th>
                        <th>Image</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {entries.map((entry, index) => (
                        <AnomalyRow
                          key={index}
                          index={index}
                          entry={entry}
                          machines={machines}
                          dispatch={dispatch}
                          removingIndex={removingIndex}
                          setRemovingIndex={setRemovingIndex}
                          handleImageChange={handleImageChange}
                          canDelete={entries.length > 1}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* ⚠️ Sécurité */}
          <div
            className={`transition-all duration-500 overflow-hidden ${
              showSafety ? "max-h-[1000px] mt-2" : "max-h-0"
            }`}
          >
            <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-b-lg border-t border-red-200 dark:border-red-800">
              <h3 className="text-sm font-semibold mb-4 text-red-800 dark:text-red-300">
                Sécurité
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm text-left text-gray-800 dark:text-gray-200 border-separate border-spacing-y-2">
                  <thead className="hidden sm:table-header-group">
                    <tr className="text-orange-800 dark:text-red-300 font-semibold">
                      <th className="pl-2">Type</th>
                      <th>Description</th>
                      <th>Image</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {safetyEvents.map((event, index) => (
                      <SafetyEventRow
                        key={index}
                        index={index}
                        event={event}
                        onUpdate={(i, field, value) =>
                          dispatchSafety({
                            type: "UPDATE",
                            index: i,
                            field,
                            value,
                          })
                        }
                        onRemove={(i) => {
                          setRemovingSafetyIndex(i);
                          setTimeout(() => {
                            dispatchSafety({ type: "REMOVE", index: i });
                            setRemovingSafetyIndex(null);
                          }, 200);
                        }}
                        canDelete={safetyEvents.length > 0}
                        removingIndex={removingSafetyIndex}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 🔘 Boutons */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-b-lg border-t border-gray-300 dark:border-gray-700 py-3 px-4 sm:px-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-colors duration-500 ease-in-out">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <button
                type="button"
                onClick={() => dispatch({ type: "ADD" })}
                className="flex items-center gap-1 text-sm font-medium text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Anomalie
              </button>

              <button
                type="button"
                onClick={() => dispatch({ type: "ADD_OUT_OF_TOUR" })}
                className="flex items-center gap-1 text-sm font-medium text-yellow-700 dark:text-yellow-400 border border-yellow-400 dark:border-yellow-500 rounded-md px-3 py-1.5 hover:bg-yellow-100 dark:hover:bg-yellow-900 transition"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Hors tournée
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowSafety(true);
                  dispatchSafety({ type: "ADD" });
                }}
                className="flex items-center gap-1 text-sm font-medium text-red-700 dark:text-red-400 border border-red-300 dark:border-red-500 rounded-md px-3 py-1.5 hover:bg-red-100 dark:hover:bg-red-900 transition"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Sécurité
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2 rounded-md transition focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-500
                  ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
              >
                {isSubmitting ? (
                  <Spinner size="h-5 w-5" color="border-white" />
                ) : editedReport ? (
                  "💾 Enregistrer"
                ) : (
                  "Créer le rapport"
                )}
              </button>

              {editedReport && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300 border border-gray-400 dark:border-gray-600 rounded-md px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  ❌ Annuler
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default ReportForm;
