// src/contexts/AuthContext.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

axios.defaults.baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  // Dès qu'on a un token, on le configure dans axios et on récupère le profil
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios
        .get("/auth/me")
        .then((res) => {
          // on stocke maintenant id, role et username
          const { id, role, username } = res.data;
          setUser({ id, role, username });
        })
        .catch(() => {
          // Token invalide ou expiré : on nettoie tout
          setToken(null);
          setUser(null);
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
        });
    } else {
      // Pas de token : on s'assure que tout est propre
      setUser(null);
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Fonction de login : récupère le JWT, configure axios, puis get /me
  const login = async (username, password) => {
    // 1) Récupération du token
    const { data: auth } = await axios.post("/auth/login", {
      username,
      password,
    });
    localStorage.setItem("token", auth.token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;
    setToken(auth.token);

    // 2) On récupère le profil complet
    const { data: profile } = await axios.get("/auth/me");
    const { id, role, username: uname } = profile;
    setUser({ id, role, username: uname });
    return profile;
  };

  // Déconnexion : on vide le token et le header
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
