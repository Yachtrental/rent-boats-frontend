import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Users,
  Anchor,
  Ship,
  UserCog,
  HandshakeIcon,
  Calendar,
  CreditCard,
  FileText,
  BarChart2,
  Layout,
  Settings
} from 'lucide-react';

// DashboardMetrics Component with real data
const DashboardMetrics = () => {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalBoats: 0,
    totalBookings: 0,
    revenue: 0
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Fetch users count
        const { count: usersCount } = await supabase
          .from('perfiles')
          .select('*', { count: 'exact' });

        // Fetch boats count
        const { count: boatsCount } = await supabase
          .from('barcos')
          .select('*', { count: 'exact' });

        // Fetch bookings count
        const { count: bookingsCount } = await supabase
          .from('reservas')
          .select('*', { count: 'exact' });

        setMetrics({
          totalUsers: usersCount || 0,
          totalBoats: boatsCount || 0,
          totalBookings: bookingsCount || 0,
          revenue: 0 // TODO: Implement revenue calculation
        });
      } catch (error) {
        toast.error('Error al cargar métricas');
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard title="Usuarios" value={metrics.totalUsers} icon={<Users />} />
      <MetricCard title="Barcos" value={metrics.totalBoats} icon={<Ship />} />
      <MetricCard title="Reservas" value={metrics.totalBookings} icon={<Calendar />} />
      <MetricCard title="Ingresos" value={`${metrics.revenue}€`} icon={<CreditCard />} />
    </div>
  );
};

// UserManagement Component with real functionality
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('perfiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setUsers(data);
      } catch (error) {
        toast.error('Error al cargar usuarios');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const updateUserRole = async (userId, newRole) => {
    try {
      const { error } = await supabase
        .from('perfiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      toast.success('Rol actualizado correctamente');
    } catch (error) {
      toast.error('Error al actualizar rol');
    }
  };

  if (loading) return <div>Cargando usuarios...</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Gestión de Usuarios</h3>
      <div className="grid gap-4">
        {users.map(user => (
          <Card key={user.id} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{user.nombre}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <select
                value={user.role}
                onChange={(e) => updateUserRole(user.id, e.target.value)}
                className="border rounded p-1"
              >
                <option value="cliente">Cliente</option>
                <option value="armador">Armador</option>
                <option value="patron">Patrón</option>
                <option value="colaborador">Colaborador</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Helper components
const MetricCard = ({ title, value, icon }) => (
  <Card className="p-4">
    <div className="flex justify-between items-center">
      <div className="text-2xl text-gray-600">{icon}</div>
      <div className="text-right">
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </Card>
);

const SECTIONS = [
  { key: 'dashboard', label: 'Dashboard', component: DashboardMetrics, icon: <BarChart2 /> },
  { key: 'users', label: 'Usuarios', component: UserManagement, icon: <Users /> },
  { key: 'boats', label: 'Barcos', component: () => <div>Gestión de barcos</div>, icon: <Ship /> },
  { key: 'captains', label: 'Patrones', component: () => <div>Gestión de patrones</div>, icon: <UserCog /> },
  { key: 'collaborators', label: 'Colaboradores', component: () => <div>Gestión de colaboradores</div>, icon: <HandshakeIcon /> },
  { key: 'bookings', label: 'Reservas', component: () => <div>Gestión de reservas</div>, icon: <Calendar /> },
  { key: 'payments', label: 'Pagos', component: () => <div>Gestión de pagos</div>, icon: <CreditCard /> },
  { key: 'documents', label: 'Documentos', component: () => <div>Documentación</div>, icon: <FileText /> },
  { key: 'content', label: 'Contenido', component: () => <div>Gestión de contenido</div>, icon: <Layout /> },
  { key: 'settings', label: 'Configuración', component: () => <div>Configuración</div>, icon: <Settings /> }
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto mt-16 p-6 border rounded bg-white text-center">
        <h2 className="text-2xl font-semibold mb-2 text-red-600">Acceso denegado</h2>
        <p className="mb-4">Este panel es solo para administradores.</p>
      </div>
    );
  }

  const SectionComponent = SECTIONS.find(s => s.key === activeSection)?.component || DashboardMetrics;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Panel de Administración</h1>
        <nav className="flex flex-wrap gap-2">
          {SECTIONS.map(section => (
            <Button
              key={section.key}
              variant={activeSection === section.key ? 'default' : 'outline'}
              onClick={() => setActiveSection(section.key)}
              className="flex items-center gap-2"
            >
              {section.icon}
              {section.label}
            </Button>
          ))}
        </nav>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <SectionComponent />
      </div>
    </div>
  );
};

export default AdminDashboard;

/* Policies

create policy "Admins can read all profiles"
on perfiles for select
using (auth.user.role = 'admin');

create policy "Admins can update all profiles"
on perfiles for update
using (auth.user.role = 'admin');

*/
