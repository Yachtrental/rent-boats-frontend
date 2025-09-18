import React, { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

const translations = {
  es: {
    // Navigation
    home: "Inicio",
    search: "Buscar",
    dashboard: "Panel",
    login: "Iniciar Sesión",
    register: "Registrarse",
    logout: "Cerrar Sesión",
    captains: "Patrones",

    // Home page
    heroTitle: "Descubre las Baleares desde el Mar",
    heroSubtitle:
      "Alquila el barco perfecto para tu aventura. Más de 500 embarcaciones disponibles en Mallorca, Ibiza, Menorca y Formentera.",
    searchPlaceholder: "Buscar destino...",
    searchButton: "Buscar Barcos",

    // Boat details
    boatDetails: "Detalles del Barco",
    capacity: "Capacidad",
    length: "Eslora",
    engine: "Motor",
    year: "Año",
    location: "Ubicación",
  },
  en: {
    home: "Home",
    search: "Search",
    dashboard: "Dashboard",
    login: "Login",
    register: "Register",
    logout: "Logout",
    captains: "Captains",
    heroTitle: "Discover the Balearic Islands from the Sea",
    heroSubtitle:
      "Rent the perfect boat for your adventure. Over 500 boats available in Mallorca, Ibiza, Menorca and Formentera.",
    searchPlaceholder: "Search destination...",
    searchButton: "Search Boats",
    boatDetails: "Boat Details",
    capacity: "Capacity",
    length: "Length",
    engine: "Engine",
    year: "Year",
    location: "Location",
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("es");

  // función de traducción segura
  const t = (key) => {
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    return key; // si no existe la traducción, devuelve la key tal cual
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
