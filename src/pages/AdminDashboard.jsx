import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

// Componentes base para cada sección (puedes dividirlos en archivos luego)
const DashboardMetrics = () => <div>📈 Métricas y resumen general</div>;
const UserManagement = () => <div>🔐 Gestión de usuarios</div>;
const OwnerBoatManagement = () => <div>⛵ Gestión de armadores y barcos</div>;
const CaptainManagement = () => <div>👨‍✈️ Gestión de patrones</div>;
const CollaboratorManagement = () => <div>🤝 Gestión de colaboradores</div>;
const BookingManagement = () => <div>📅 Gestión de reservas</div>;
const PaymentManagement = () => <div>💳 Gestión de pagos</div>;
const DocumentationContracts = () => <div>� Documentación y contratos</div>;
const AnalyticsReports = () => <div>📊 Analítica y reportes</div>;
const ContentManagement = () => <div>🖼️ Gestión de contenido (CMS)</div>;
const AdvancedSettings = () => <div>⚙️ Configuración avanzada</div>;

const SECTIONS = [
  { key: "dashboard", label: "Dashboard", component: DashboardMetrics },
  { key: "users", label: "Usuarios", component: UserManagement },
  { key: "owners", label: "Armadores y Barcos", component: OwnerBoatManagement },
  { key: "captains", label: "Patrones", component: CaptainManagement },
  { key: "collaborators", label: "Colaboradores", component: CollaboratorManagement },
  { key: "bookings", label: "Reservas", component: BookingManagement },
  { key: "payments", label: "Pagos", component: PaymentManagement },
  { key: "docs", label: "Documentación y Contratos", component: DocumentationContracts },
  { key: "analytics", label: "Analítica y Reportes", component: AnalyticsReports },
  { key: "cms", label: "Contenido (CMS)", component: ContentManagement },
  { key: "settings", label: "Configuración", component: AdvancedSettings },
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");

  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-xl mx-auto mt-16 p-6 border rounded bg-white text-center">
        <h2 className="text-2xl font-semibold mb-2 text-red-600">Acceso denegado</h2>
        <p className="mb-4">Este panel es solo para administradores.</p>
      </div>
    );
  }

  const SectionComponent = SECTIONS.find(s => s.key === activeSection)?.component || DashboardMetrics;

  return (
    <div className="max-w-6xl mx-auto mt-8 p-4">
      <h2 className="text-3xl font-bold mb-6">Panel de Administración</h2>
      <nav className="flex flex-wrap gap-2 mb-8">
        {SECTIONS.map(section => (
          <Button
            key={section.key}
            variant={activeSection === section.key ? "default" : "outline"}
            onClick={() => setActiveSection(section.key)}
          >
            {section.label}
          </Button>
        ))}
      </nav>
      <div className="bg-white rounded shadow p-6 min-h-[300px]">
        <SectionComponent />
      </div>
    </div>
  );
};

export default AdminDashboard;
