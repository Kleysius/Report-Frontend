import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PhotoIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import CustomDateInput from "./CustomDateInput";

const acvMachines = [
  { tag: "P211A", type: "p211" },
  { tag: "P211B", type: "p211" },
  { tag: "C823A", type: "vidange" },
  { tag: "C823B", type: "vidange" },
  { tag: "I520", type: "controle" },
  // autres classiques
  "C283",
  "C325A",
  "C325B",
  "C330A",
  "C330B",
  "C330C",
  "C674A",
  "C674B",
  "C821A",
  "C821B",
  "C821C",
  "C881",
  "C911A",
  "C911B",
  "C911C",
  "C922",
  "C931A",
  "C931B",
  "C931C",
  "C931D",
  "C934A",
  "C934B",
  "CT921",
  "I530",
  "P520",
  "P530",
  "P911A",
  "P911B",
  "P911C",
  "P911D",
].map((m) => (typeof m === "string" ? { tag: m, type: "classique" } : m));

const aceMachines = [
  { tag: "P470A", type: "pression" },
  { tag: "P470B", type: "pression" },
  // autres classiques
  "C204",
  "C213A",
  "C213B",
  "C214",
  "C431A",
  "C431B",
  "C431C",
  "C667",
  "C668",
  "P431A1",
  "P431A2",
  "P431B1",
  "P431B2",
  "P431C1",
  "P431C2",
  "P670",
].map((m) => (typeof m === "string" ? { tag: m, type: "classique" } : m));

const HeavyMachinesForm = ({ sector, data, setData }) => {
  const machines = sector === "AC/V" ? acvMachines : aceMachines;

  const handleChange = (tag, field, value) => {
    setData((prev) => ({
      ...prev,
      [tag]: { ...prev[tag], [field]: value },
    }));
  };

  const inputClass = "px-2 py-1 border rounded-md text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white transition-colors duration-500 ease-in-out";
  const inputSmall = `${inputClass} w-24`;
  const inputFull = `${inputClass} w-full`;
  const labelText = "text-sm min-w-fit whitespace-nowrap";

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-start mb-3">
        <button
          type="button"
          onClick={() => {
            const allRAS = machines.every((m) => {
              const current = data[m.tag];
              return ["classique", "p211", "vidange", "controle", "pression"].includes(m.type) && current?.ras === true;
            });

            const updated = {};
            machines.forEach((m) => {
              if (["classique", "p211", "vidange", "controle", "pression"].includes(m.type)) {
                updated[m.tag] = {
                  ...(data[m.tag] || {}),
                  ras: !allRAS,
                  comment: allRAS ? "" : data[m.tag]?.comment || "",
                };
              }
            });

            setData((prev) => ({ ...prev, ...updated }));
          }}
          className="px-2 py-1 text-sm font-medium bg-green-100 text-green-700 rounded hover:bg-green-200 dark:bg-green-900/40 dark:text-green-300 dark:hover:bg-green-900 transition"
        >
          {machines.every((m) => data[m.tag]?.ras) ? "♻️ Réinitialiser RAS" : "✅ Tout RAS"}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm text-left border-separate border-spacing-y-2 text-gray-800 dark:text-gray-200">
          <thead className="hidden sm:table-header-group">
            <tr>
              <th className="pl-2">Machine</th>
              <th className="pl-2">Observation / Mesure</th>
            </tr>
          </thead>
          <tbody>
            {machines.map((m) => (
              <tr
                key={m.tag}
                className="group hover:bg-gray-200 dark:hover:bg-gray-700 bg-gray-100 dark:bg-gray-800 transition-colors duration-500 ease-in-out"
              >
                <td className="w-[10%] py-2 pl-3 font-semibold rounded-l-md relative group border-r border-gray-300 dark:border-gray-600">
                  <span>{m.tag}</span>
                  <button
                    type="button"
                    onClick={() => document.getElementById(`image-${m.tag}`)?.click()}
                    className="absolute -top-1 -left-1 p-1 rounded-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 shadow group-hover:opacity-100 opacity-0 transition-opacity"
                    title="Ajouter une photo"
                  >
                    {data[m.tag]?.images?.length > 0 ? (
                      <span className="relative">
                        <PhotoIcon className="w-5 h-5 text-green-500" />
                        <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                          {data[m.tag].images.length}
                        </span>
                      </span>
                    ) : (
                      <PhotoIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                    )}
                  </button>

                  <input
                    id={`image-${m.tag}`}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      const readers = files.map((file) => new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(file);
                      }));

                      Promise.all(readers).then((images) => {
                        handleChange(m.tag, "images", [
                          ...(data[m.tag]?.images || []),
                          ...images,
                        ]);
                      });
                    }}
                    className="hidden"
                  />
                </td>

                <td className="py-2 px-2 sm:px-4 rounded-r-md">
                  <div className="flex flex-col gap-2">
                    {m.type === "p211" && (
                      <div className="flex flex-wrap gap-2">
                        <label className="flex items-center gap-2">
                          <span className={labelText}>Pression :</span>
                          <input type="text" placeholder="bar" value={data[m.tag]?.pression || ""} onChange={(e) => handleChange(m.tag, "pression", e.target.value)} className={inputSmall} />
                        </label>
                        <label className="flex items-center gap-2">
                          <span className={labelText}>Température :</span>
                          <input type="text" placeholder="°C" value={data[m.tag]?.temperature || ""} onChange={(e) => handleChange(m.tag, "temperature", e.target.value)} className={inputSmall} />
                        </label>
                        <label className="flex items-center gap-2">
                          <span className={labelText}>Heure :</span>
                          <input type="text" placeholder="hh:mm" value={data[m.tag]?.heure || ""} onChange={(e) => handleChange(m.tag, "heure", e.target.value)} className={inputSmall} />
                        </label>
                      </div>
                    )}

                    {m.type === "vidange" && (
                      <label className="flex flex-wrap items-center gap-2">
                        <span className={labelText}>Vidange entretoise faite le :</span>
                        <DatePicker
                          selected={data[m.tag]?.vidange ? new Date(data[m.tag].vidange) : null}
                          onChange={(date) => handleChange(m.tag, "vidange", date.toISOString().split("T")[0])}
                          dateFormat="dd/MM/yyyy"
                          customInput={<CustomDateInput />}
                        />
                      </label>
                    )}

                    {m.type === "controle" && (
                      <div className="flex flex-wrap gap-3">
                        {/* ✅ Circulation eau */}
                        <label className="inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={data[m.tag]?.circulation || false} onChange={(e) => handleChange(m.tag, "circulation", e.target.checked)} className="hidden" />
                          <span className={`px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${data[m.tag]?.circulation ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-300 dark:border-green-600" : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 border border-gray-300 dark:border-gray-600"}`}>
                            💧 Circulation d'eau OK
                          </span>
                        </label>

                        <label className="inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={data[m.tag]?.niveau || false} onChange={(e) => handleChange(m.tag, "niveau", e.target.checked)} className="hidden" />
                          <span className={`px-2 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${data[m.tag]?.niveau ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-300 dark:border-green-600" : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 border border-gray-300 dark:border-gray-600"}`}>
                            🛢️ Niveau d'huile garniture OK
                          </span>
                        </label>
                      </div>
                    )}

                    {m.type === "pression" && (
                      <label className="flex flex-wrap items-center gap-2">
                        <span className={labelText}>Pression :</span>
                        <input type="text" placeholder="bar" value={data[m.tag]?.pression || ""} onChange={(e) => handleChange(m.tag, "pression", e.target.value)} className={inputSmall} />
                      </label>
                    )}

                    {/* ✅ Observation complémentaire */}
                    {["p211", "vidange", "controle", "pression"].includes(m.type) && (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2">
                        <label className="inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={data[m.tag]?.ras || false} onChange={(e) => handleChange(m.tag, "ras", e.target.checked)} className="hidden" />
                          <span className={`px-2 py-1 rounded-full text-xs text-center font-medium transition-colors duration-200 ${data[m.tag]?.ras ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-300 dark:border-green-600" : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 border border-gray-300 dark:border-gray-600"}`}>
                            RAS
                          </span>
                        </label>
                        <textarea disabled={data[m.tag]?.ras} placeholder="Observation / Anomalie complémentaire" value={data[m.tag]?.comment || ""} onChange={(e) => handleChange(m.tag, "comment", e.target.value)} rows={1} className={`${inputFull} resize-none ${data[m.tag]?.ras ? "opacity-50 cursor-not-allowed" : ""}`} onInput={(e) => {
                          e.target.style.height = "auto";
                          e.target.style.height = `${e.target.scrollHeight}px`;
                        }} />
                      </div>
                    )}

                    {m.type === "classique" && (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2">
                        <label className="inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={data[m.tag]?.ras || false} onChange={(e) => handleChange(m.tag, "ras", e.target.checked)} className="hidden" />
                          <span className={`px-2 py-1 rounded-full text-xs text-center font-medium transition-colors duration-200 ${data[m.tag]?.ras ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-300 dark:border-green-600" : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 border border-gray-300 dark:border-gray-600"}`}>
                            RAS
                          </span>
                        </label>
                        <textarea disabled={data[m.tag]?.ras} placeholder="Observation / Anomalie" value={data[m.tag]?.comment || ""} onChange={(e) => handleChange(m.tag, "comment", e.target.value)} rows={1} className={`${inputFull} resize-none ${data[m.tag]?.ras ? "opacity-50 cursor-not-allowed" : ""}`} onInput={(e) => {
                          e.target.style.height = "auto";
                          e.target.style.height = `${e.target.scrollHeight}px`;
                        }} />
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HeavyMachinesForm;