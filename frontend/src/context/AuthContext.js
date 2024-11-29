import React, { createContext, useState, useEffect } from "react";
import api from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await api.get("/api/users/me", {
            headers: { "x-auth-token": token },
          });
          setUser(response.data);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchUser();
  }, []);

  const login = async (username, password) => {
    const response = await api.post("/api/users/login", { username, password });
    localStorage.setItem("token", response.data.token);
    setUser(response.data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
