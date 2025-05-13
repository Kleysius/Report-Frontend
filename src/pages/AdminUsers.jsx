// src/pages/admin/AdminUsers.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../components/ui/Spinner";
import {
  TrashIcon,
  UserPlusIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "technician",
  });
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Chargement des utilisateurs
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/admin/users");
        setUsers(data);
      } catch (err) {
        console.error("Erreur chargement utilisateurs :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleCreate = async () => {
    if (!form.username.trim() || !form.password.trim()) return;
    setLoading(true);
    try {
      await axios.post("/admin/users", form);
      // rechargement
      const { data } = await axios.get("/admin/users");
      setUsers(data);
      setForm({ username: "", password: "", role: "technician" });
      setShowPassword(false);
    } catch (err) {
      console.error("Erreur création utilisateur :", err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`/admin/users/${deleteId}`);
      setUsers((u) => u.filter((x) => x.id !== deleteId));
    } catch (err) {
      console.error("Erreur suppression :", err);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Formulaire */}
      <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow transition-colors duration-500 ease-in-out">
        <h2 className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold text-lg py-3 px-4 sm:px-5 rounded-t-lg border-b border-gray-300 dark:border-gray-600 flex sm:flex-row sm:items-center justify-between gap-2 transition-colors duration-500 ease-in-out">
          Nouvel Utilisateur
          <UserPlusIcon className="w-6 h-6 dark:text-white" />
        </h2>
        <div className="space-y-4 p-4 sm:p-6">
          <p className="text-sm italic text-gray-500 dark:text-gray-400">
            Créez un nouvel utilisateur en remplissant les champs ci-dessous.
          </p>
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-500 ease-in-out"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full p-3 pr-10 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-500 ease-in-out"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-500 ease-in-out"
          >
            <option value="technician">Technicien</option>
            <option value="admin">Admin</option>
          </select>
          <button
            onClick={handleCreate}
            className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition"
          >
            <UserPlusIcon className="w-5 h-5" />
            Ajouter
          </button>
        </div>
      </div>

      {/* Liste + recherche */}
      <div className="lg:col-span-2 flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow transition-colors duration-500 ease-in-out">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Utilisateurs</h2>
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/3 p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-500 ease-in-out"
          />
        </div>

        {loading ? (
          <div className="flex-grow flex items-center justify-center p-10">
            <Spinner size="h-10 w-10" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700 transition-colors duration-500 ease-in-out">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Rôle
                  </th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filtered.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {u.username}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          u.role === "admin"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                            : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setDeleteId(u.id);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 text-red-600 hover:text-red-800 transition"
                        title="Supprimer"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                    >
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modale de confirmation suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md animate-slide-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-11/12 max-w-sm p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Confirmer la suppression
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Voulez-vous vraiment supprimer cet utilisateur ?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
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
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
