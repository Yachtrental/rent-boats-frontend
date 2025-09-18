import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Users, Ship, UserCog, HandshakeIcon, Calendar, 
  CreditCard, FileText, BarChart2, Layout, Settings,
  Check, X, Edit2, Eye, EyeOff, Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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

// Componente para gestionar barcos
const BoatManagement = () => {
  const [boats, setBoats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBoats();
  }, []);

  const fetchBoats = async () => {
    try {
      const { data, error } = await supabase
        .from('barcos')
        .select('*, perfiles(nombre)');

      if (error) throw error;
      setBoats(data);
    } catch (error) {
      toast.error('Error al cargar barcos');
    } finally {
      setLoading(false);
    }
  };

  const approveBoat = async (id) => {
    try {
      const { error } = await supabase
        .from('barcos')
        .update({ estado: 'aprobado' })
        .eq('id', id);

      if (error) throw error;
      toast.success('Barco aprobado');
      fetchBoats();
    } catch (error) {
      toast.error('Error al aprobar barco');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Gestión de Barcos</h3>
      {loading ? (
        <div>Cargando barcos...</div>
      ) : (
        <div className="grid gap-4">
          {boats.map(boat => (
            <Card key={boat.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{boat.nombre}</p>
                  <p className="text-sm text-gray-600">Armador: {boat.perfiles?.nombre}</p>
                  <p className="text-sm text-gray-600">Estado: {boat.estado}</p>
                </div>
                <div className="flex gap-2">
                  {boat.estado === 'pendiente' && (
                    <>
                      <Button
                        onClick={() => approveBoat(boat.id)}
                        variant="outline"
                        size="sm"
                      >
                        <Check className="h-4 w-4" />
                        Aprobar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                      >
                        <X className="h-4 w-4" />
                        Rechazar
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Componente para gestionar documentos
const DocumentManagement = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const { data, error } = await supabase
          .from('documentos')
          .select('*, perfiles(nombre)');

        if (error) throw error;
        setDocs(data);
      } catch (error) {
        toast.error('Error al cargar documentos');
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, []);

  const validateDoc = async (id, status) => {
    try {
      const { error } = await supabase
        .from('documentos')
        .update({ estado: status })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Documento ${status === 'aprobado' ? 'aprobado' : 'rechazado'}`);
    } catch (error) {
      toast.error('Error al validar documento');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Documentación</h3>
      {loading ? (
        <div>Cargando documentos...</div>
      ) : (
        <div className="grid gap-4">
          {docs.map(doc => (
            <Card key={doc.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{doc.tipo}</p>
                  <p className="text-sm text-gray-600">Usuario: {doc.perfiles?.nombre}</p>
                  <p className="text-sm text-gray-600">Estado: {doc.estado}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => window.open(doc.url, '_blank')}
                    variant="outline"
                    size="sm"
                  >
                    <Eye className="h-4 w-4" />
                    Ver
                  </Button>
                  <Button
                    onClick={() => validateDoc(doc.id, 'aprobado')}
                    variant="outline"
                    size="sm"
                  >
                    <Check className="h-4 w-4" />
                    Aprobar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Componente mejorado de gestión de usuarios
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const updateUser = async (userId, updates) => {
    try {
      const { error } = await supabase
        .from('perfiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;
      toast.success('Usuario actualizado correctamente');
      fetchUsers();
      setEditingUser(null);
    } catch (error) {
      toast.error('Error al actualizar usuario');
    }
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.nombre?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Gestión de Usuarios</h3>
        <div className="relative w-64">
          <Input
            type="text"
            placeholder="Buscar usuarios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
          <Search className="h-4 w-4 absolute left-2 top-3 text-gray-400" />
        </div>
      </div>

      {loading ? (
        <div>Cargando usuarios...</div>
      ) : (
        <div className="grid gap-4">
          {filteredUsers.map(user => (
            <Card key={user.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{user.nombre}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-600">Rol: {user.role}</p>
                </div>
                <div className="flex gap-2">
                  <select
                    value={user.role}
                    onChange={(e) => updateUser(user.id, { role: e.target.value })}
                    className="border rounded p-1"
                  >
                    <option value="cliente">Cliente</option>
                    <option value="armador">Armador</option>
                    <option value="patron">Patrón</option>
                    <option value="colaborador">Colaborador</option>
                    <option value="admin">Admin</option>
                  </select>
                  <Button
                    onClick={() => setEditingUser(user)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de edición */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Nombre</label>
              <Input
                value={editingUser?.nombre || ''}
                onChange={(e) => setEditingUser({...editingUser, nombre: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Teléfono</label>
              <Input
                value={editingUser?.telefono || ''}
                onChange={(e) => setEditingUser({...editingUser, telefono: e.target.value})}
              />
            </div>
            <Button 
              onClick={() => updateUser(editingUser.id, {
                nombre: editingUser.nombre,
                telefono: editingUser.telefono
              })}
            >
              Guardar cambios
            </Button>
          </div>
        </DialogContent>
      </Dialog>
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
  { key: 'boats', label: 'Barcos', component: BoatManagement, icon: <Ship /> },
  { key: 'documents', label: 'Documentos', component: DocumentManagement, icon: <FileText /> },
  { key: 'captains', label: 'Patrones', component: () => <div>Gestión de patrones</div>, icon: <UserCog /> },
  { key: 'collaborators', label: 'Colaboradores', component: () => <div>Gestión de colaboradores</div>, icon: <HandshakeIcon /> },
  { key: 'bookings', label: 'Reservas', component: () => <div>Gestión de reservas</div>, icon: <Calendar /> },
  { key: 'payments', label: 'Pagos', component: () => <div>Gestión de pagos</div>, icon: <CreditCard /> },
  { key: 'content', label: 'Contenido', component: () => <div>Gestión de contenido</div>, icon: <Layout /> },
  { key: 'settings', label: 'Configuración', component: () => <div>Configuración</div>, icon: <Settings /> }
];

export const AdminDashboard = () => {
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
