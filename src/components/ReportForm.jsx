import { useState, useEffect, useReducer } from "react";
import axios from "axios";
import SnackbarAlert from "./SnackbarAlert";
import AnomalyRow from "./AnomalyRow";
import SafetyEventRow from "./SafetyEventRow";
import HeavyMachinesForm from "./HeavyMachinesForm";

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
  const [zone, setZone] = useState("");
  const [machines, setMachines] = useState([]);
  const [entries, dispatch] = useReducer(entriesReducer, [
    { machine: "", comment: "", images: [] },
  ]);
  const [safetyEvents, dispatchSafety] = useReducer(safetyEventsReducer, []);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [removingIndex, setRemovingIndex] = useState(null);
  const [removingSafetyIndex, setRemovingSafetyIndex] = useState(null);
  const [showSafety, setShowSafety] = useState(false);
  const [heavyData, setHeavyData] = useState({});

  // 🎯 Détection du jour pour la tournée des grosses machines
  // const today = new Date();
  // const dayOfWeek = today.getDay(); // 1 = lundi, 5 = vendredi
  // 🎯 Détection du jour pour la tournée des grosses machines
  const forceTestDay = 2; // 💡 DEBUG : 1 = lundi
  const currentDay = forceTestDay ?? new Date().getDay(); // Si forceTestDay est défini, on l’utilise
  const isHeavyMachinesDay = currentDay === 1 || currentDay === 5;
  const showHeavyForm = isHeavyMachinesDay && selectedSector;

  // 🔄 Récupération zone de tournée
  useEffect(() => {
    const api = import.meta.env.VITE_API_URL;
    if (!selectedSector) return;

    const fetchZone = async () => {
      try {
        const { data } = await axios.get(`${api}/zone-of-the-day`, {
          params: { sector: selectedSector },
        });
        setZone(data.zones || "Données non disponibles");
      } catch {
        setSnackbar({
          open: true,
          message: "Erreur de chargement de la zone.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchZone();
  }, [selectedSector]);

  // 🔄 Récupération des machines du secteur
  useEffect(() => {
    const api = import.meta.env.VITE_API_URL;
    if (!selectedSector) return;

    const fetchMachines = async () => {
      try {
        const { data } = await axios.get(
          `${api}/machines?sector=${selectedSector}`
        );
        setMachines(data);
      } catch {
        console.error("Erreur lors du chargement des machines.");
      }
    };

    fetchMachines();
  }, [selectedSector]);

  // 🔄 Récupération des données du rapport à éditer
  useEffect(() => {
    if (!editedReport) return;

    // Pré-remplissage
    if (editedReport.entries) dispatch({ type: "RESET" });
    dispatch({
      type: "INIT",
      payload: editedReport.entries.map((e) => ({
        machine: e.machine_tag,
        comment: e.comment,
        images: e.images,
        out_of_tour: e.out_of_tour === 1,
      })),
    });

    if (editedReport.safetyEvents?.length > 0) {
      dispatchSafety({ type: "RESET" });
      dispatchSafety({
        type: "INIT",
        payload: editedReport.safetyEvents.map((e) => ({
          type: e.type,
          description: e.description,
          images: e.images || [],
        })),
      });
      setShowSafety(true);
    }

    if (editedReport.heavyEntries) {
      const heavyMapped = {};
      editedReport.heavyEntries.forEach((entry) => {
        heavyMapped[entry.machine_tag] = {
          pression: entry.pression,
          temperature: entry.temperature,
          heure: entry.heure,
          vidange: entry.vidange_date,
          circulation: entry.controle_eau,
          niveau: entry.controle_niveau_huile,
          comment: entry.observation,
          images: entry.images || [],
        };
      });
      setHeavyData(heavyMapped);
    }

    setZone(editedReport.tour || "");
  }, [editedReport]);

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
    const method = editedReport ? "put" : "post";
    const url = editedReport
      ? `${api}/reports/${editedReport.id}`
      : `${api}/reports`;

    try {
      await axios[method](url, {
        sector: selectedSector,
        tour: zone,
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
        entries,
        safetyEvents,
        heavyEntries: heavyEntriesArray,
      });

      // 🧹 Reset
      dispatch({ type: "RESET" });
      dispatchSafety({ type: "RESET" });
      setShowSafety(false);
      setHeavyData({});
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Erreur lors de l'enregistrement du rapport.",
        severity: "error",
      });
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

      {imagePreview && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setImagePreview(null)}
        >
          <img
            src={imagePreview}
            alt="Aperçu en grand"
            className="max-w-3xl max-h-[80vh] rounded shadow-lg border border-gray-300 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()} // pour éviter que le clic ferme le modal
          />
        </div>
      )}
      {/* 📌 Tournée du jour */}
      <div className="max-w-xl mb-3 p-2 text-sm text-center font-semibold text-gray-800 dark:text-gray-300 rounded-md shadow-md border border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
        {loading ? "Chargement..." : "Tournée du jour : "}
        <br />
        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
          {zone}
        </span>
      </div>
      <div className="w-full max-w-3xl mx-auto mb-8 bg-white dark:bg-gray-900 shadow-md rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-500 ease-in-out">
        <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-lg py-3 px-5 rounded-t-lg border-b border-gray-300 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 transition-colors duration-500 ease-in-out">
          {/* 🏷️ Titre */}
          <span>Ajouter un Rapport</span>
        </div>

        {editedReport && (
          <div className="mx-3 mt-4 px-4 py-3 rounded-lg border border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10 text-yellow-700 dark:text-yellow-300 text-sm flex items-center justify-center gap-2 shadow-sm animate-fade-slide-down">
            <span>
              ✏️ Vous modifiez un rapport existant.{" "}
              <strong className="font-medium">
                N'oubliez pas d’enregistrer les modifications.
              </strong>
            </span>
          </div>
        )}

        {/* 📜 Formulaire */}
        <form onSubmit={handleSubmit} id="report-form">
          <div className="p-4">
            {/* 📝 Formulaire des anomalies */}
            {isHeavyMachinesDay ? (
              <>
                <HeavyMachinesForm
                  sector={selectedSector}
                  data={heavyData}
                  setData={setHeavyData}
                />

                {/* 🟡 Anomalies hors tournée */}
                {entries.some((e) => e.out_of_tour) && (
                  <>
                    <h3 className="text-sm font-semibold mt-6 mb-3 text-yellow-700 dark:text-yellow-400">
                      Hors tournée
                    </h3>

                    <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300 border-separate border-spacing-y-2">
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
                              setImagePreview={setImagePreview}
                              removingIndex={removingIndex}
                              setRemovingIndex={setRemovingIndex}
                              handleImageChange={handleImageChange}
                              canDelete={entries.length > 1}
                            />
                          ))}
                      </tbody>
                    </table>
                  </>
                )}
              </>
            ) : (
              <>
                <h3 className="text-sm font-semibold mb-4 text-gray-800 dark:text-gray-300">
                  Anomalies / Actions
                </h3>

                <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300 border-separate border-spacing-y-2">
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
                        setImagePreview={setImagePreview}
                        removingIndex={removingIndex}
                        setRemovingIndex={setRemovingIndex}
                        handleImageChange={handleImageChange}
                        canDelete={entries.length > 1}
                      />
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>

          {/* ⚠️ Formulaire des événements sécurité */}
          <div
            className={`transition-all duration-500 overflow-hidden ${
              showSafety ? "max-h-[500px] mt-2" : "max-h-0"
            }`}
          >
            <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-b-lg border-t border-red-200 dark:border-red-800 transition-colors duration-500 ease-in-out">
              <h3 className="text-sm font-semibold mb-4 text-red-800 dark:text-red-300">
                Sécurité
              </h3>
              <table className="w-full text-sm text-left text-gray-800 dark:text-gray-200 border-separate border-spacing-y-2">
                <thead className="hidden sm:table-header-group">
                  <tr className=" text-orange-800 dark:text-red-300 font-semibold">
                    <th className="pl-2">Type</th>
                    <th>Description</th>
                    <th>Image</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {[...safetyEvents].map((event, index) => (
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
                      canDelete={safetyEvents.length > 1}
                      setImagePreview={setImagePreview}
                      removingIndex={removingSafetyIndex}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="py-3 px-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-b-lg border-t border-gray-300 dark:border-gray-700 transition-colors duration-500 ease-in-out">
            {/* ➕ Groupe boutons "Ajouter" */}
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
              {/* 🚀 Bouton "Créer le rapport" */}
              <button
                type="submit"
                className="flex items-center gap-2 text-sm font-semibold bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-500"
              >
                {editedReport ? "💾 Enregistrer" : "Créer le rapport"}
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
