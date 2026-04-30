import React, { createContext, useState, useContext, useEffect } from 'react';

// Crea il contesto di autenticazione
const AuthContext = createContext();

// Fornisci il contesto di autenticazione ai componenti figlio
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Inizializza lo stato di autenticazione da localStorage
    const savedState = localStorage.getItem('isLoggedIn');
    return savedState === 'true' || false;
  });
  const [username, setUsername] = useState(() => {
    // Inizializza lo stato dell'username da localStorage
    return localStorage.getItem('username') || null;
  });
  useEffect(() => {
    // Salva lo stato di autenticazione in localStorage quando cambia
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);
  useEffect(() => {
    // Salva l'username in localStorage quando cambia
    if (username) {
      localStorage.setItem('username', username);
    } else {
      localStorage.removeItem('username');
    }
  }, [username]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, username, setUsername }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook per utilizzare il contesto di autenticazione
export const useAuth = () => {
  
  return useContext(AuthContext);
};
