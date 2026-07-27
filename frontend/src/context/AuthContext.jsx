import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cek apakah ada data user di localStorage saat awal load
    const storedUser = localStorage.getItem("barbershop_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("barbershop_user", JSON.stringify(userData));
    localStorage.setItem("barbershop_token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("barbershop_user");
    localStorage.removeItem("barbershop_token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
