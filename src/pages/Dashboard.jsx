import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navigation from '@/components/Navigation';
import DashboardSidebar from '@/components/DashboardSidebar';

// Dashboards por rol
import CustomerDashboard from '@/components/dashboard/CustomerDashboard';
import OwnerDashboard from '@/components/dashboard/OwnerDashboard';
import CaptainDashboard from '@/components/dashboard/CaptainDashboard';
import CollaboratorDashboard from '@/components/dashboard/CollaboratorDashboard';
import { AdminDashboard } from '@/pages/AdminDashboard';

import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const getDashboardComponent = () => {
    switch (user.role) {
      case 'cliente':
        return <CustomerDashboard />;
      case 'armador':
        return <OwnerDashboard />;
      case 'patrón':
        return <CaptainDashboard />;
      case 'colaborador':
        return <CollaboratorDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <CustomerDashboard />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Panel de Control - Rent-Boats.com</title>
        <meta
          name="description"
          content="Gestiona tus reservas, barcos y ganancias desde tu panel de control personalizado en Rent-Boats.com."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <div className="pt-16 flex">
          <DashboardSidebar />

          <main className="flex-1 ml-64">
            <div className="p-8">
              <Routes>
                <Route path="/" element={getDashboardComponent()} />
                <Route path="/bookings" element={getDashboardComponent()} />
                <Route path="/boats" element={getDashboardComponent()} />
                <Route path="/earnings" element={getDashboardComponent()} />
                <Route path="/referrals" element={getDashboardComponent()} />
                <Route path="/profile" element={getDashboardComponent()} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
