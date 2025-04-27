import { useState, useContext, useEffect } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const ROLE_TABS = [
  { key: "technician", label: "Technicien" },
  { key: "admin", label: "Admin" },
];

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [role, setRole] = useState("technician");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Si on est déjà connecté, on va directement sur /home
  useEffect(() => {
    if (user) {
      navigate("/home", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form.username, form.password);
      navigate("/home", { replace: true });
    } catch {
      setError("Identifiants invalides. Veuillez réessayer.");
    }
  };

  const primaryBg =
    role === "admin"
      ? "bg-indigo-600 hover:bg-indigo-700"
      : "bg-green-600 hover:bg-green-700";
  const focusRing =
    role === "admin" ? "focus:ring-indigo-500" : "focus:ring-green-500";
  const activeTabBg =
    role === "admin" ? "bg-indigo-600 text-white" : "bg-green-600 text-white";

  return (
    <div className="w-full max-w-md backdrop-blur-md bg-white/50 dark:bg-gray-800/80 dark:border dark:border-gray-600/20 shadow-xl rounded-xl transition-colors duration-500 ease-in-out">
      <div className="flex justify-center space-x-1">
        {ROLE_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setRole(tab.key);
              setError("");
            }}
            className={`flex-1 py-2 text-center font-medium rounded-t-lg transition focus:outline-none focus:ring-2 ${
              role === tab.key
                ? activeTabBg
                : "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-center mb-2 text-gray-800 dark:text-white">
          Connexion {role === "admin" ? "Admin" : "Technicien"}
        </h1>
        <p className="text-center text-sm text-gray-500 mb-4">
          Entrez vos identifiants pour vous connecter.
        </p>
        {error && (
          <p className="text-center text-md font-semibold text-red-600 mb-4">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Utilisateur"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className={`w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ${focusRing}`}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={`w-full p-3 pr-10 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ${focusRing}`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-800 dark:hover:text-indigo-600 focus:outline-none"
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>

          <button
            type="submit"
            className={`w-full py-3 ${primaryBg} text-white font-semibold rounded-lg transition focus:outline-none focus:ring-2 ${focusRing}`}
          >
            Se connecter en tant que {role === "admin" ? "Admin" : "Technicien"}
          </button>
        </form>
      </div>
    </div>
  );
}
