import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { BookingProvider } from '@/contexts/BookingContext';
import HomePage from '@/pages/HomePage';
import SearchResults from '@/pages/SearchResults';
import BoatDetails from '@/pages/BoatDetails';
import CaptainsPage from '@/pages/CaptainsPage';
import Dashboard from '@/pages/Dashboard';
import BookingCheckout from '@/pages/BookingCheckout';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import AdminDashboard from '@/pages/AdminDashboard';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BookingProvider>
          <Router>
            <Helmet>
              <title>Rent-Boats.com - Alquiler de Barcos en Baleares</title>
              <meta 
                name="description" 
                content="Marketplace líder para alquilar barcos en las Islas Baleares. Encuentra el barco perfecto para tu aventura marítima con patrón incluido o sin él." 
              />
              <meta 
                name="keywords" 
                content="alquiler barcos, baleares, mallorca, ibiza, menorca, formentera, charter, nautico" 
              />
              <meta 
                property="og:title" 
                content="Rent-Boats.com - Alquiler de Barcos en Baleares" 
              />
              <meta 
                property="og:description" 
                content="Marketplace líder para alquilar barcos en las Islas Baleares" 
              />
              <meta property="og:type" content="website" />
            </Helmet>
            
            <div className="min-h-screen">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/boat/:id" element={<BoatDetails />} />
                <Route path="/captains" element={<CaptainsPage />} />
                <Route path="/dashboard/*" element={<Dashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/checkout" element={<BookingCheckout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
              
              <Toaster />
            </div>
          </Router>
        </BookingProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
