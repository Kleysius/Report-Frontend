import React, { useEffect } from "react";
import ImageUploadButton from "./ImageUploadButton";

const AnomalyRow = ({
  entry,
  index,
  machines,
  dispatch,
  setImagePreview,
  removingIndex,
  setRemovingIndex,
  handleImageChange,
  canDelete,
}) => {
  const isValid = entry.machine && entry.comment;

  useEffect(() => {
  const updateCoords = (e) => {
    const root = document.documentElement;
    root.style.setProperty("--hover-x", `${e.clientX}px`);
    root.style.setProperty("--hover-y", `${e.clientY}px`);
  };

  document.addEventListener("mousemove", updateCoords);
  return () => document.removeEventListener("mousemove", updateCoords);
}, []);


  return (
    <tr
      className={`transition-colors duration-500 ease-in-out min-h-[64px] ${
        removingIndex === index ? "animate-fade-out" : "animate-slide-fade-in"
      } ${
        isValid
          ? "bg-green-200 dark:bg-green-400/20"
          : "bg-gray-100 dark:bg-gray-800"
      }`}
    >
      <td
        className={`p-2 w-1/5 rounded-l-md border-l-4 ${
          entry.out_of_tour ? "border-yellow-500" : "border-transparent"
        }`}
      >
        {/* 🏷️ Machine */}
        <div className="flex items-center">
          {entry.out_of_tour ? (
            <input
              type="text"
              value={entry.machine}
              placeholder="Hors tournée"
              onChange={(e) =>
                dispatch({
                  type: "UPDATE",
                  index,
                  field: "machine",
                  value: e.target.value,
                })
              }
              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors duration-500 ease-in-out"
            />
          ) : (
            <select
              name={`machine-${index}`}
              value={entry.machine}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE",
                  index,
                  field: "machine",
                  value: e.target.value,
                })
              }
              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors duration-500 ease-in-out"
            >
              <option value="">Tag</option>
              {machines.map((m) => (
                <option key={m.id} value={m.machine_tag}>
                  {m.machine_tag}
                </option>
              ))}
            </select>
          )}
        </div>
      </td>

      <td className="pr-2 w-3/5">
        <div className="flex items-center">
          {/* 📝 Commentaire */}
          <textarea
            name={`comment-${index}`}
            value={entry.comment}
            onChange={(e) =>
              dispatch({
                type: "UPDATE",
                index,
                field: "comment",
                value: e.target.value,
              })
            }
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            rows="1"
            placeholder="Anomalie ou action..."
            className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm resize-none overflow-hidden min-h-[31px] dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors duration-500 ease-in-out"
          />
        </div>
      </td>

      <td className="w-1/5 align-center">
        <div className="relative flex items-center group">
          <ImageUploadButton
            entry={entry}
            index={index}
            onChange={handleImageChange}
            onPreview={setImagePreview}
            variant="anomaly"
            isValid={isValid}
          />

          {entry?.images?.length > 0 && (
            <div
              className="fixed z-50 hidden group-hover:flex gap-2 bg-white dark:bg-gray-900 p-2 rounded-md shadow-lg dark:shadow-black/40 border border-gray-300 dark:border-gray-700"
              style={{
                top: "calc(var(--hover-y, 0px) - 140px)",
                left: "calc(var(--hover-x, 0px) - 100px)",
              }}
            >
              {entry.images.slice(0, 6).map((imgSrc, i) => (
                <img
                  key={i}
                  src={imgSrc}
                  alt={`Aperçu ${i + 1}`}
                  className="w-22 h-28 object-cover rounded-md"
                />
              ))}
            </div>
          )}
        </div>
      </td>

      <td className="px-2 text-center rounded-r-md">
        {/* 🗑️ Supprimer */}
        <div className="flex items-center">
          {canDelete && (
            <button
              type="button"
              onClick={() => {
                setRemovingIndex(index);
                setTimeout(() => {
                  dispatch({ type: "REMOVE", index });
                  setRemovingIndex(null);
                }, 200);
              }}
              title="Supprimer cette ligne"
            >
              <svg
                className="w-6 h-6 text-red-700 hover:text-red-500 cursor-pointer transition"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                />
              </svg>
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default AnomalyRow;
