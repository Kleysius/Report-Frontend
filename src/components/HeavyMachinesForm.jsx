import React, { useMemo, useState } from "react";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  PhotoIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
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
    { tag: "C921", type: "classique" },
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
    { tag: "C490A", type: "classique" },
    { tag: "C490B", type: "classique" },
    { tag: "C499A", type: "classique" },
    { tag: "C499B", type: "classique" },
    { tag: "C667", type: "classique" },
    { tag: "C668", type: "classique" },
    { tag: "P670", type: "classique" },
  ],
};

const FIELD_STYLES =
  "w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-900 dark:text-white transition-colors duration-500 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400";
const CARD_STYLES =
  "bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md dark:hover:shadow-gray-700 transition-shadow flex flex-col border border-gray-300 dark:border-gray-600 transition-colors duration-500 ease-in-out";

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

  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (images, index = 0) => {
    setModalImages(images);
    setCurrentIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalImages([]);
    setCurrentIndex(0);
  };

  const deleteImage = (tag, indexToDelete) => {
    const updatedImages = (data[tag]?.images || []).filter(
      (_, i) => i !== indexToDelete
    );
    handleChange(tag, "images", updatedImages);
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
              <div className="w-full flex items-center justify-between bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-t-xl border-b border-gray-300 dark:border-gray-600 transition-colors duration-500 ease-in-out">
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

              {entry.images?.length > 0 && (
                <div className="flex flex-wrap gap-2 p-4">
                  {entry.images.map((img, index) => (
                    <div key={index} className="relative w-20 h-20">
                      <img
                        src={img}
                        alt={`Image ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
                        onClick={() => openModal(entry.images, index)}
                      />
                      <button
                        type="button"
                        onClick={() => deleteImage(tag, index)}
                        className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                        title="Supprimer l'image"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

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

      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        contentLabel="Image Preview"
        className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black bg-opacity-80"
        overlayClassName="fixed inset-0 z-40"
        ariaHideApp={false}
      >
        {modalImages.length > 0 && (
          <div className="relative max-w-full max-h-full w-full md:w-2/3 lg:w-1/2">
            <img
              src={modalImages[currentIndex]}
              alt={`Image ${currentIndex + 1}`}
              className="w-full h-auto rounded-xl shadow-lg max-h-[80vh] object-contain"
            />

            {/* Boutons de navigation */}
            {modalImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentIndex(
                      (prev) =>
                        (prev - 1 + modalImages.length) % modalImages.length
                    )
                  }
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-400/80 rounded-full p-2 hover:scale-105 transition"
                  aria-label="Image précédente"
                >
                  <ChevronLeftIcon className="w-6 h-6 text-black dark:text-white" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentIndex((prev) => (prev + 1) % modalImages.length)
                  }
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-400/80 rounded-full p-2 hover:scale-105 transition"
                  aria-label="Image suivante"
                >
                  <ChevronRightIcon className="w-6 h-6 text-black dark:text-white" />
                </button>
              </>
            )}

            <button
              type="button"
              onClick={closeModal}
              className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
              aria-label="Fermer"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
