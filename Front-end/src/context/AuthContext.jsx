import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Requirement: Check local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const pUser = JSON.parse(storedUser);
      setUser(pUser);
      axios.defaults.headers.common['x-user-id'] = pUser.id; // Rehydrate network identity
    }
    setLoading(false);
  }, []);

  const loginContext = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['x-user-id'] = userData.id; // Stamp outbound network calls globally
  };

  const logoutContext = () => {
    setUser(null);
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['x-user-id']; // Securely wipe header
  };

  return (
    <AuthContext.Provider value={{ user, loginContext, logoutContext, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
