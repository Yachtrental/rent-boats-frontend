import React from "react";
import { useAuth } from "@/contexts/AuthContext";

// Importamos cada panel de dashboard
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import OwnerDashboard from "@/components/dashboard/OwnerDashboard";
import CaptainDashboard from "@/components/dashboard/CaptainDashboard";
import CollaboratorDashboard from "@/components/dashboard/CollaboratorDashboard";
import CustomerDashboard from "@/components/dashboard/CustomerDashboard";

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="p-6 text-center">Cargando...</p>;
  }

  if (!user) {
    return <p className="p-6 text-center">No has iniciado sesión</p>;
  }

  // 👇 switch por rol
  switch (user.role) {
    case "admin":
      return <AdminDashboard />;

    case "armador":
      return <OwnerDashboard />;

    case "patrón":
      return <CaptainDashboard />;

    case "colaborador":
      return <CollaboratorDashboard />;

    case "cliente":
    default:
      return <CustomerDashboard />;
  }
};

export default Dashboard;
