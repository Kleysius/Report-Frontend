import { useState, useContext } from "react";
import axios from "axios";
import Spinner from "../components/ui/Spinner";
import { AuthContext } from "../contexts/AuthContext";

export default function MachineHistory() {
  const { token } = useContext(AuthContext);
  const [machineTag, setMachineTag] = useState("");
  const [data, setData] = useState({ classical: [], heavy: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchHistory = async () => {
    const tag = machineTag.trim();
    setError("");
    setMessage("");

    if (!tag) {
      setError("Veuillez saisir un numéro de machine.");
      return;
    }

    setLoading(true);
    try {
      if (token)
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const res = await axios.get(
        `/machines/${encodeURIComponent(tag)}/history`
      );
      const { classical, heavy } = res.data;

      if (classical.length + heavy.length === 0) {
        setMessage(`Aucune anomalie trouvée pour la machine ${tag}.`);
        setData({ classical: [], heavy: [] });
      } else {
        setData({ classical, heavy });
      }
    } catch (err) {
      console.error("Erreur fetchHistory:", err);
      if (err.response?.status === 404) {
        setError("Machine introuvable ou historique vide.");
      } else {
        setError("Impossible de charger l’historique. Vérifiez la console.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Numéro de machine"
            value={machineTag}
            onChange={(e) => setMachineTag(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <button
            onClick={fetchHistory}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? <Spinner size="h-5 w-5 text-white" /> : "Rechercher"}
          </button>
        </div>

        {error && (
          <div className="text-center text-red-500 font-semibold">
            {error}
          </div>
        )}
        {message && (
          <div className="text-center text-gray-700 dark:text-gray-300">
            {message}
          </div>
        )}

        <div className="space-y-10">
          {data.classical.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                Anomalies classiques
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-200 dark:bg-gray-700">
                      <th className="px-5 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                        Date
                      </th>
                      <th className="px-5 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                        Commentaire
                      </th>
                      <th className="px-5 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                        Hors tournée
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.classical.map((e, i) => (
                      <tr
                        key={i}
                        className={
                          i % 2 === 0
                            ? "bg-white dark:bg-gray-800"
                            : "bg-gray-50 dark:bg-gray-700"
                        }
                      >
                        <td className="px-5 py-3 text-sm text-gray-800 dark:text-gray-100">
                          {new Date(e.date).toLocaleString("fr-FR")}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-800 dark:text-gray-100">
                          {e.comment}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-800 dark:text-gray-100">
                          {e.out_of_tour ? "Oui" : "Non"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {data.heavy.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                Grosses machines
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-200 dark:bg-gray-700">
                      {[
                        "Date",
                        "Pression",
                        "Température",
                        "Heure",
                        "Vidange",
                        "Eau",
                        "Niveau huile",
                        "Observation",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.heavy.map((h, i) => (
                      <tr
                        key={i}
                        className={
                          i % 2 === 0
                            ? "bg-white dark:bg-gray-800"
                            : "bg-gray-50 dark:bg-gray-700"
                        }
                      >
                        <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">
                          {new Date(h.date).toLocaleString("fr-FR")}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">
                          {h.pression ?? "–"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">
                          {h.temperature ?? "–"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">
                          {h.heure ?? "–"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">
                          {h.vidange_date
                            ? new Date(h.vidange_date).toLocaleDateString(
                                "fr-FR"
                              )
                            : "–"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">
                          {h.controle_eau ? "✔️" : "–"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">
                          {h.controle_niveau_huile ? "✔️" : "–"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">
                          {h.observation ?? "–"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
