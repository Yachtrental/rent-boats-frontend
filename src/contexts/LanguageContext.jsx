import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

const translations = {
  es: {
    // Navigation
    home: 'Inicio',
    search: 'Buscar',
    dashboard: 'Panel',
    login: 'Iniciar Sesión',
    register: 'Registrarse',
    logout: 'Cerrar Sesión',
    captains: 'Patrones',
    
    // Home page
    heroTitle: 'Descubre las Baleares desde el Mar',
    heroSubtitle: 'Alquila el barco perfecto para tu aventura. Más de 500 embarcaciones disponibles en Mallorca, Ibiza, Menorca y Formentera.',
    searchPlaceholder: 'Buscar destino...',
    searchButton: 'Buscar Barcos',
    
    // Boat details
    boatDetails: 'Detalles del Barco',
    capacity: 'Capacidad',
    length: 'Eslora',
    engine: 'Motor',
    year: 'Año',
    location: 'Ubicación',
    pricePerDay: 'por día',
    bookNow: 'Reservar Ahora',
    
    // Booking
    bookingDetails: 'Detalles de Reserva',
    dates: 'Fechas',
    guests: 'Huéspedes',
    extras: 'Extras',
    total: 'Total',
    deposit: 'Depósito (20%)',
    remaining: 'Restante (80%)',
    
    // Dashboard
    myBookings: 'Mis Reservas',
    myBoats: 'Mis Barcos',
    earnings: 'Ganancias',
    referrals: 'Referidos',
    
    // Status
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    completed: 'Completado',
    cancelled: 'Cancelado',
    
    // Common
    save: 'Guardar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Eliminar',
    view: 'Ver',
    back: 'Volver',
    next: 'Siguiente',
    previous: 'Anterior',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    
    // Features not implemented
    featureNotImplemented: '🚧 Esta función aún no está implementada—¡pero no te preocupes! ¡Puedes solicitarla en tu próximo mensaje! 🚀'
  },
  en: {
    // Navigation
    home: 'Home',
    search: 'Search',
    dashboard: 'Dashboard',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    captains: 'Captains',
    
    // Home page
    heroTitle: 'Discover the Balearics from the Sea',
    heroSubtitle: 'Rent the perfect boat for your adventure. Over 500 vessels available in Mallorca, Ibiza, Menorca and Formentera.',
    searchPlaceholder: 'Search destination...',
    searchButton: 'Search Boats',
    
    // Boat details
    boatDetails: 'Boat Details',
    capacity: 'Capacity',
    length: 'Length',
    engine: 'Engine',
    year: 'Year',
    location: 'Location',
    pricePerDay: 'per day',
    bookNow: 'Book Now',
    
    // Booking
    bookingDetails: 'Booking Details',
    dates: 'Dates',
    guests: 'Guests',
    extras: 'Extras',
    total: 'Total',
    deposit: 'Deposit (20%)',
    remaining: 'Remaining (80%)',
    
    // Dashboard
    myBookings: 'My Bookings',
    myBoats: 'My Boats',
    earnings: 'Earnings',
    referrals: 'Referrals',
    
    // Status
    pending: 'Pending',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    
    // Features not implemented
    featureNotImplemented: '🚧 This feature isn\'t implemented yet—but don\'t worry! You can request it in your next prompt! 🚀'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('es');

  const t = (key) => {
    return translations[language][key] || key;
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, t, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};