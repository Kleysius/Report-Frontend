// src/pages/admin/AdminMachines.jsx
import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import Spinner from "../components/ui/Spinner";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

export default function AdminMachines() {
  const { token } = useContext(AuthContext);
  const [tours, setTours] = useState([]);
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState("machine_tag");

  const [expanded, setExpanded] = useState({});
  const [showAddFor, setShowAddFor] = useState(null);
  const [newTag, setNewTag] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // config axios
  useEffect(() => {
    if (token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    else delete axios.defaults.headers.common["Authorization"];
  }, [token]);

  // charger tours & machines
  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [tRes, mRes] = await Promise.all([
        axios.get("/tours/all"),
        axios.get("/machines/all"),
      ]);
      setTours(tRes.data);
      setMachines(mRes.data);
    } catch (err) {
      console.error("Erreur chargement :", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // visible + tri
  const visible = machines
    .filter((m) => m.machine_tag.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => String(a[sortKey]).localeCompare(String(b[sortKey])));

  const byTour = tours.map((t) => ({
    ...t,
    machines: visible.filter((m) => String(m.tour_id) === String(t.id)),
  }));

  // handlers
  const handleAdd = async (tourId) => {
    if (!newTag.trim()) return;
    await axios.post("/machines", { machine_tag: newTag, tour_id: tourId });
    setNewTag("");
    setShowAddFor(null);
    loadAll();
  };

  const handleUpdate = async (id) => {
    const m = machines.find((x) => x.id === id);
    await axios.put(`/machines/${id}`, {
      machine_tag: m.machine_tag,
      tour_id: m.tour_id,
    });
    setEditingId(null);
    loadAll();
  };

  const handleDelete = (id) => setConfirmDeleteId(id);
  const confirmDelete = async () => {
    await axios.delete(`/machines/${confirmDeleteId}`);
    setConfirmDeleteId(null);
    loadAll();
  };
  const cancelDelete = () => setConfirmDeleteId(null);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center p-10">
        <Spinner size="h-12 w-12" />
      </div>
    );
  }

  return (
    <section className="p-4 max-w-5xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow px-6 py-4 flex flex-col md:flex-row items-center gap-4">
        <h1 className="text-2xl font-bold flex-1 text-gray-800 dark:text-white">
          Gestion des machines
        </h1>
        <input
          type="text"
          placeholder="Rechercher un tag…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="md:w-1/3 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 transition"
        />
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 transition"
        >
          <option value="machine_tag">Trier par tag</option>
          <option value="tour_id">Trier par tournée</option>
        </select>
      </div>

      {/* ACCORDÉONS PAR TOUR */}
      <div className="space-y-2">
        {byTour.map((t) => (
          <div
            key={t.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden transition"
          >
            <button
              className="group w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              onClick={() =>
                setExpanded((prev) => ({ ...prev, [t.id]: !prev[t.id] }))
              }
            >
              <div className="flex items-center gap-2">
                {expanded[t.id] ? (
                  <ChevronDownIcon className="w-5 h-5 text-indigo-500" />
                ) : (
                  <ChevronRightIcon className="w-5 h-5 text-indigo-500" />
                )}
                <span className="font-semibold text-gray-800 dark:text-gray-100">
                  {t.day} ({t.machines.length})
                </span>
              </div>
              <PlusIcon
                className="w-6 h-6 text-green-600 hover:text-green-800 transition opacity-0 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAddFor(t.id);
                }}
                title="Ajouter une machine"
              />
            </button>

            {/* Formulaire ajouter */}
            {showAddFor === t.id && (
              <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Nouveau tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500 transition"
                />
                <button
                  onClick={() => handleAdd(t.id)}
                  className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                >
                  <PlusIcon className="w-5 h-5" />
                  Ajouter
                </button>
                <XMarkIcon
                  className="w-6 h-6 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer transition"
                  onClick={() => {
                    setShowAddFor(null);
                    setNewTag("");
                  }}
                />
              </div>
            )}

            {/* Liste machines */}
            {expanded[t.id] && (
              <ul className="px-6 py-4 space-y-2">
                {t.machines.length ? (
                  t.machines.map((m) => (
                    <li
                      key={m.id}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded-lg transition hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {editingId === m.id ? (
                        <input
                          type="text"
                          value={m.machine_tag}
                          onChange={(e) => {
                            const val = e.target.value;
                            setMachines((ms) =>
                              ms.map((x) =>
                                x.id === m.id ? { ...x, machine_tag: val } : x
                              )
                            );
                          }}
                          className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 transition"
                        />
                      ) : (
                        <span className="text-gray-800 dark:text-gray-100">
                          {m.machine_tag}
                        </span>
                      )}

                      <div className="flex items-center gap-3">
                        {editingId === m.id ? (
                          <>
                            <button
                              onClick={() => handleUpdate(m.id)}
                              className="ml-2 text-indigo-600 hover:text-indigo-800 transition"
                            >
                              Valider
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-gray-600 hover:text-gray-800 dark:hover:text-gray-300 transition"
                            >
                              Annuler
                            </button>
                          </>
                        ) : (
                          <>
                            <PencilIcon
                              className="w-5 h-5 text-gray-600 hover:text-indigo-600 transition cursor-pointer"
                              onClick={() => setEditingId(m.id)}
                            />
                            <TrashIcon
                              className="w-5 h-5 text-red-600 hover:text-red-800 transition cursor-pointer"
                              onClick={() => handleDelete(m.id)}
                            />
                          </>
                        )}
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-center py-2 text-gray-500">
                    Aucune machine
                  </li>
                )}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Modal suppression */}
      {confirmDeleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={cancelDelete}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Confirmer la suppression
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Supprimer la machine{" "}
              <strong>
                {machines.find((m) => m.id === confirmDeleteId)?.machine_tag}
              </strong>{" "}
              ?
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