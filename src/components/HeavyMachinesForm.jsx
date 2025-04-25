import React, { useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PhotoIcon } from "@heroicons/react/24/outline";
import CustomDateInput from "./CustomDateInput";

// Configuration des machines par secteur
const CONFIG = {
  "AC/V": [
    { tag: "P211A", type: "p211" },
    { tag: "P211B", type: "p211" },
    { tag: "C823A", type: "vidange" },
    { tag: "C823B", type: "vidange" },
    { tag: "I520", type: "controle" },
    { tag: "C283", type: "classique" },
    { tag: "C325A", type: "classique" },
    { tag: "C325B", type: "classique" },
    { tag: "C330A", type: "classique" },
    { tag: "C330B", type: "classique" },
    { tag: "C330C", type: "classique" },
    { tag: "C674A", type: "classique" },
    { tag: "C674B", type: "classique" },
    { tag: "C821A", type: "classique" },
    { tag: "C821B", type: "classique" },
    { tag: "C821C", type: "classique" },
    { tag: "C881", type: "classique" },
    { tag: "C911A", type: "classique" },
    { tag: "C911B", type: "classique" },
    { tag: "C911C", type: "classique" },
    { tag: "C922", type: "classique" },
    { tag: "C931A", type: "classique" },
    { tag: "C931B", type: "classique" },
    { tag: "C931C", type: "classique" },
    { tag: "C931D", type: "classique" },
    { tag: "C934A", type: "classique" },
    { tag: "C934B", type: "classique" },
    { tag: "CT921", type: "classique" },
    { tag: "I530", type: "classique" },
    { tag: "P520", type: "classique" },
    { tag: "P530", type: "classique" },
    { tag: "P911A", type: "classique" },
    { tag: "P911B", type: "classique" },
    { tag: "P911C", type: "classique" },
    { tag: "P911D", type: "classique" },
  ],
  "AC/E": [
    { tag: "P470A", type: "pression" },
    { tag: "P470B", type: "pression" },
    { tag: "C204", type: "classique" },
    { tag: "C213A", type: "classique" },
    { tag: "C213B", type: "classique" },
    { tag: "C214", type: "classique" },
    { tag: "C431A", type: "classique" },
    { tag: "C431B", type: "classique" },
    { tag: "C431C", type: "classique" },
    { tag: "C667", type: "classique" },
    { tag: "C668", type: "classique" },
    { tag: "P431A1", type: "classique" },
    { tag: "P431A2", type: "classique" },
    { tag: "P431B1", type: "classique" },
    { tag: "P431B2", type: "classique" },
    { tag: "P431C1", type: "classique" },
    { tag: "P431C2", type: "classique" },
    { tag: "P670", type: "classique" },
  ],
};

const FIELD_STYLES =
  "w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-900 dark:text-white transition-colors";
const CARD_STYLES =
  "bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md dark:hover:shadow-gray-700 transition-shadow flex flex-col border border-gray-300 dark:border-gray-600";

export default function HeavyMachinesForm({ sector, data, setData }) {
  const machines = useMemo(() => CONFIG[sector] || [], [sector]);

  const handleChange = (tag, field, value) => {
    setData((prev) => ({
      ...prev,
      [tag]: { ...prev[tag], [field]: value },
    }));
  };

  const allRas = useMemo(
    () => machines.every((m) => data[m.tag]?.ras),
    [machines, data]
  );

  const toggleAllRas = () => {
    const updated = {};
    machines.forEach(({ tag }) => {
      updated[tag] = {
        ...data[tag],
        ras: !allRas,
        comment: allRas ? "" : data[tag]?.comment || "",
      };
    });
    setData((prev) => ({ ...prev, ...updated }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={toggleAllRas}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          {allRas ? "Réinitialiser RAS" : "Tout RAS"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {machines.map(({ tag, type }) => {
          const entry = data[tag] || {};
          return (
            <div key={tag} className={CARD_STYLES}>
              {/* En-tête carte stylé */}
              <div className="w-full flex items-center justify-between bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-t-xl border-b border-gray-300 dark:border-gray-600">
                <div className="font-semibold text-lg">{tag}</div>
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById(`image-${tag}`)?.click()
                  }
                  title="Ajouter une photo"
                  className="p-1 rounded-full hover:bg-gray-300 transition"
                >
                  {entry.images?.length > 0 ? (
                    <span className="relative">
                      <PhotoIcon className="w-6 h-6 text-gray-600 dark:text-gray-300 dark:hover:text-gray-800 transition" />
                      <span className="absolute -top-1 -right-1 px-1 text-xs bg-green-600 text-white rounded-full">
                        {entry.images.length}
                      </span>
                    </span>
                  ) : (
                    <PhotoIcon className="w-6 h-6 text-gray-600 dark:text-gray-300 dark:hover:text-gray-800 transition" />
                  )}
                </button>
                <input
                  id={`image-${tag}`}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    Promise.all(
                      files.map(
                        (file) =>
                          new Promise((res) => {
                            const reader = new FileReader();
                            reader.onloadend = () => res(reader.result);
                            reader.readAsDataURL(file);
                          })
                      )
                    ).then((imgs) =>
                      handleChange(tag, "images", [
                        ...(entry.images || []),
                        ...imgs,
                      ])
                    );
                  }}
                />
              </div>

              {/* Champs dynamiques */}
              <div className="flex flex-col space-y-2 p-4">
                {type === "p211" && (
                  <>
                    <input
                      className={FIELD_STYLES}
                      placeholder="Pression (bar)"
                      value={entry.pression || ""}
                      onChange={(e) =>
                        handleChange(tag, "pression", e.target.value)
                      }
                    />
                    <input
                      className={FIELD_STYLES}
                      placeholder="Température (°C)"
                      value={entry.temperature || ""}
                      onChange={(e) =>
                        handleChange(tag, "temperature", e.target.value)
                      }
                    />
                    <input
                      className={FIELD_STYLES}
                      placeholder="Heure (HH:MM)"
                      value={entry.heure || ""}
                      onChange={(e) =>
                        handleChange(tag, "heure", e.target.value)
                      }
                    />
                  </>
                )}

                {type === "vidange" && (
                  <DatePicker
                    selected={entry.vidange ? new Date(entry.vidange) : null}
                    onChange={(date) =>
                      handleChange(
                        tag,
                        "vidange",
                        date.toISOString().split("T")[0]
                      )
                    }
                    dateFormat="dd/MM/yyyy"
                    customInput={<CustomDateInput />}
                  />
                )}

                {type === "controle" && (
                  <div className="flex flex-col space-y-2">
                    <label className="inline-flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={entry.circulation || false}
                        onChange={(e) =>
                          handleChange(tag, "circulation", e.target.checked)
                        }
                        className="form-checkbox rounded h-5 w-5 text-blue-600"
                      />
                      <span>Circulation eau OK</span>
                    </label>
                    <label className="inline-flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={entry.niveau || false}
                        onChange={(e) =>
                          handleChange(tag, "niveau", e.target.checked)
                        }
                        className="form-checkbox rounded h-5 w-5 text-blue-600"
                      />
                      <span>Niveau huile OK</span>
                    </label>
                  </div>
                )}

                {type === "pression" && (
                  <input
                    className={FIELD_STYLES}
                    placeholder="Pression (bar)"
                    value={entry.pression || ""}
                    onChange={(e) =>
                      handleChange(tag, "pression", e.target.value)
                    }
                  />
                )}

                {/* Observation / RAS */}
                <label className="flex flex-col space-y-1">
                  <div className="inline-flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={entry.ras || false}
                      onChange={(e) =>
                        handleChange(tag, "ras", e.target.checked)
                      }
                      className="form-checkbox rounded h-5 w-5 text-green-500"
                    />
                    <span>RAS</span>
                  </div>
                  <textarea
                    className={`${FIELD_STYLES} resize-none h-16 ${
                      entry.ras ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    placeholder="Observation / Anomalie"
                    value={entry.comment || ""}
                    disabled={entry.ras}
                    onChange={(e) =>
                      handleChange(tag, "comment", e.target.value)
                    }
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
