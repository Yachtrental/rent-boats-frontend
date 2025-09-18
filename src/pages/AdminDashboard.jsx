// AdminDashboard.jsx - Corregido para coincidir con el esquema real
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Users, Ship, UserCog, HandshakeIcon, Calendar, 
  CreditCard, FileText, BarChart2, Layout, Settings,
  Check, X, Edit2, Eye, EyeOff, Search, AlertCircle
} from 'lucide-react';

// Componente de métricas del dashboard
const DashboardMetrics = () => {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalBoats: 0,
    totalReservations: 0,
    totalPayments: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      console.log('🔄 Cargando métricas del dashboard...');
      
      // Consultas con el esquema real
      const [usersResult, boatsResult, reservationsResult, paymentsResult] = await Promise.all([
        supabase.from('perfiles').select('id, role', { count: 'exact' }).catch(err => {
          console.error('Error en consulta perfiles:', err);
          return { count: 0, data: [] };
        }),
        supabase.from('barcos').select('id, disponible', { count: 'exact' }).catch(err => {
          console.error('Error en consulta barcos:', err);
          return { count: 0, data: [] };
        }),
        supabase.from('reservas').select('id, estado', { count: 'exact' }).catch(err => {
          console.error('Error en consulta reservas:', err);
          return { count: 0, data: [] };
        }),
        supabase.from('pagos').select('id', { count: 'exact' }).catch(err => {
          console.error('Error en consulta pagos:', err);
          return { count: 0, data: [] };
        })
      ]);

      const totalUsers = usersResult.count || 0;
      const totalBoats = boatsResult.count || 0;
      const totalReservations = reservationsResult.count || 0;
      const totalPayments = paymentsResult.count || 0;

      setMetrics({
        totalUsers,
        totalBoats,
        totalReservations,
        totalPayments,
        loading: false,
        error: null
      });

      console.log('✅ Métricas cargadas:', { totalUsers, totalBoats, totalReservations, totalPayments });

    } catch (error) {
      console.error('❌ Error cargando métricas:', error);
      setMetrics(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Error cargando datos del dashboard' 
      }));
    }
  };

  const MetricCard = ({ title, value, icon, color = 'blue' }) => (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold text-${color}-600`}>
            {metrics.loading ? '...' : metrics.error ? '!' : value}
          </p>
        </div>
        <div className={`p-3 bg-${color}-100 rounded-full`}>
          {icon}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard de Administración</h2>
        <Button onClick={fetchMetrics} variant="outline" size="sm">
          🔄 Actualizar
        </Button>
      </div>
      
      {metrics.error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <p className="text-red-700">{metrics.error}</p>
          </div>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Usuarios" 
          value={metrics.totalUsers}
          icon={<Users className="h-6 w-6 text-blue-600" />}
          color="blue"
        />
        <MetricCard 
          title="Embarcaciones" 
          value={metrics.totalBoats}
          icon={<Ship className="h-6 w-6 text-green-600" />}
          color="green"
        />
        <MetricCard 
          title="Reservas" 
          value={metrics.totalReservations}
          icon={<Calendar className="h-6 w-6 text-purple-600" />}
          color="purple"
        />
        <MetricCard 
          title="Pagos" 
          value={metrics.totalPayments}
          icon={<CreditCard className="h-6 w-6 text-orange-600" />}
          color="orange"
        />
      </div>
    </div>
  );
};

// Gestión de usuarios - corregido para el esquema real
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log('🔄 Cargando usuarios desde tabla perfiles...');
      setError(null);
      
      const { data, error } = await supabase
        .from('perfiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error en consulta perfiles:', error);
        throw error;
      }
      
      setUsers(data || []);
      console.log('✅ Usuarios cargados:', data?.length || 0);
      if (data?.length > 0) {
        console.log('Primer usuario:', data[0]);
      }

    } catch (error) {
      console.error('❌ Error cargando usuarios:', error);
      setError(`Error al cargar usuarios: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      console.log('🔄 Actualizando role del usuario:', userId, 'a', newRole);
      
      const { error } = await supabase
        .from('perfiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      
      toast.success('Rol actualizado correctamente');
      fetchUsers();
      
    } catch (error) {
      console.error('❌ Error actualizando rol:', error);
      toast.error('Error al actualizar el rol');
    }
  };

  const updateUser = async (userId, updates) => {
    try {
      console.log('🔄 Actualizando usuario:', userId, updates);
      
      const { error } = await supabase
        .from('perfiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;
      
      toast.success('Usuario actualizado correctamente');
      setEditingUser(null);
      fetchUsers();
      
    } catch (error) {
      console.error('❌ Error actualizando usuario:', error);
      toast.error('Error al actualizar usuario');
    }
  };

  // Filtrar usuarios basado en el término de búsqueda
  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'armador': return 'bg-blue-100 text-blue-800';
      case 'patron': return 'bg-green-100 text-green-800';
      case 'proveedor': return 'bg-yellow-100 text-yellow-800';
      case 'colaborador': return 'bg-purple-100 text-purple-800';
      case 'cliente': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      admin: 'Administrador',
      armador: 'Armador',
      patron: 'Patrón',
      proveedor: 'Proveedor',
      colaborador: 'Colaborador',
      cliente: 'Cliente'
    };
    return roleNames[role] || role || 'Sin rol';
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p className="font-medium">Error al cargar usuarios</p>
          <p className="text-sm mt-2">{error}</p>
          <Button onClick={fetchUsers} className="mt-4">
            Reintentar
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Gestión de Usuarios</h3>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar usuarios..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <span className="text-sm text-gray-500">
            {filteredUsers.length} de {users.length} usuarios
          </span>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredUsers.map(user => (
          <Card key={user.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-medium">{user.full_name || 'Sin nombre'}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    {getRoleDisplayName(user.role)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">ID: {user.id}</p>
                {user.avatar_url && (
                  <p className="text-sm text-gray-600">📷 Avatar configurado</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Registrado: {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Fecha desconocida'}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingUser(user)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                
                <select
                  value={user.role || 'cliente'}
                  onChange={(e) => updateUserRole(user.id, e.target.value)}
                  className="text-xs border rounded px-2 py-1"
                >
                  <option value="cliente">Cliente</option>
                  <option value="armador">Armador</option>
                  <option value="patron">Patrón</option>
                  <option value="proveedor">Proveedor</option>
                  <option value="colaborador">Colaborador</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? 'No se encontraron usuarios con esa búsqueda' : 'No hay usuarios registrados'}
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
              <label className="text-sm font-medium">Nombre completo</label>
              <Input
                value={editingUser?.full_name || ''}
                onChange={(e) => setEditingUser({...editingUser, full_name: e.target.value})}
                placeholder="Nombre completo del usuario"
              />
            </div>
            <div>
              <label className="text-sm font-medium">URL del avatar</label>
              <Input
                value={editingUser?.avatar_url || ''}
                onChange={(e) => setEditingUser({...editingUser, avatar_url: e.target.value})}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Rol</label>
              <select
                value={editingUser?.role || 'cliente'}
                onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                className="w-full border rounded px-3 py-2"
              >
                <option value="cliente">Cliente</option>
                <option value="armador">Armador</option>
                <option value="patron">Patrón</option>
                <option value="proveedor">Proveedor</option>
                <option value="colaborador">Colaborador</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline"
                onClick={() => setEditingUser(null)}
              >
                Cancelar
              </Button>
              <Button 
                onClick={() => updateUser(editingUser.id, {
                  full_name: editingUser.full_name,
                  avatar_url: editingUser.avatar_url,
                  role: editingUser.role
                })}
              >
                Guardar cambios
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Gestión de embarcaciones - adaptado para el esquema real
const BoatManagement = () => {
  const [boats, setBoats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBoats();
  }, []);

  const fetchBoats = async () => {
    try {
      console.log('🔄 Cargando embarcaciones desde tabla barcos...');
      setError(null);
      
      const { data, error } = await supabase
        .from('barcos')
        .select(`
          *,
          perfiles:armador_id (
            full_name,
            role
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error en consulta barcos:', error);
        throw error;
      }
      
      setBoats(data || []);
      console.log('✅ Embarcaciones cargadas:', data?.length || 0);

    } catch (error) {
      console.error('❌ Error cargando embarcaciones:', error);
      setError(`Error al cargar embarcaciones: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleBoatAvailability = async (boatId, currentAvailability) => {
    try {
      console.log('🔄 Cambiando disponibilidad del barco:', boatId, 'a', !currentAvailability);
      
      const { error } = await supabase
        .from('barcos')
        .update({ disponible: !currentAvailability })
        .eq('id', boatId);

      if (error) throw error;
      
      toast.success(`Embarcación ${!currentAvailability ? 'habilitada' : 'deshabilitada'}`);
      fetchBoats();
      
    } catch (error) {
      console.error('❌ Error actualizando disponibilidad:', error);
      toast.error('Error al actualizar disponibilidad de la embarcación');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2">Cargando embarcaciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p className="font-medium">Error al cargar embarcaciones</p>
          <p className="text-sm mt-2">{error}</p>
          <Button onClick={fetchBoats} className="mt-4">
            Reintentar
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Gestión de Embarcaciones</h3>
        <Button onClick={fetchBoats} variant="outline" size="sm">
          🔄 Actualizar
        </Button>
      </div>
      
      <div className="grid gap-4">
        {boats.map(boat => (
          <Card key={boat.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-medium">{boat.nombre || 'Sin nombre'}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    boat.disponible 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {boat.disponible ? 'Disponible' : 'No disponible'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{boat.descripcion}</p>
                <p className="text-sm text-gray-600">
                  Armador: {boat.perfiles?.full_name || 'Desconocido'}
                </p>
                <p className="text-sm text-gray-600">
                  Capacidad: {boat.capacidad} personas | Precio: €{boat.precio_dia}/día
                </p>
                <p className="text-sm text-gray-600">
                  Depósito: €{boat.deposito_seguridad} | Ubicación: {boat.ubicacion || 'No especificada'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Registrado: {boat.created_at ? new Date(boat.created_at).toLocaleDateString() : 'Fecha desconocida'}
                </p>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  onClick={() => toggleBoatAvailability(boat.id, boat.disponible)}
                  variant="outline"
                  size="sm"
                  className={
                    boat.disponible 
                      ? "text-red-600 border-red-600 hover:bg-red-50" 
                      : "text-green-600 border-green-600 hover:bg-green-50"
                  }
                >
                  {boat.disponible ? (
                    <>
                      <X className="h-4 w-4 mr-1" />
                      Deshabilitar
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Habilitar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {boats.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No hay embarcaciones registradas
        </div>
      )}
    </div>
  );
};

// Componente principal del dashboard de admin
const AdminDashboard = () => {
  const { user, profile, loading } = useAuth();
  const [currentSection, setCurrentSection] = useState('dashboard');

  console.log('🔍 Estado de autenticación:', { 
    user: user?.email, 
    profile: profile, 
    loading,
    userRole: profile?.role
  });

  // Verificar que el usuario es admin - usando el campo correcto
  const isAdmin = profile?.role === 'admin';

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <p className="text-xl mb-4">Debes iniciar sesión para acceder al dashboard</p>
          <Button onClick={() => window.location.href = '/login'}>
            Ir al login
          </Button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-xl mb-2">Acceso denegado</p>
          <p className="text-gray-600 mb-4">No tienes permisos de administrador</p>
          <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded">
            <p>Usuario: {user?.email}</p>
            <p>Rol actual: {profile?.role || 'Sin rol asignado'}</p>
            <p className="mt-2 text-xs">Para acceder, necesitas el rol 'admin' en tu perfil</p>
          </div>
        </div>
      </div>
    );
  }

  const SECTIONS = [
    { key: 'dashboard', label: 'Dashboard', component: DashboardMetrics, icon: <BarChart2 className="h-5 w-5" /> },
    { key: 'users', label: 'Usuarios', component: UserManagement, icon: <Users className="h-5 w-5" /> },
    { key: 'boats', label: 'Embarcaciones', component: BoatManagement, icon: <Ship className="h-5 w-5" /> },
  ];

  const CurrentComponent = SECTIONS.find(section => section.key === currentSection)?.component || DashboardMetrics;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
            <p className="text-sm text-gray-600">
              Bienvenido, {profile?.full_name || user?.email}
            </p>
            <p className="text-xs text-gray-500">Rol: {profile?.role}</p>
          </div>
          
          <nav className="mt-6">
            {SECTIONS.map(section => (
              <button
                key={section.key}
                onClick={() => setCurrentSection(section.key)}
                className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                  currentSection === section.key 
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="mr-3">{section.icon}</span>
                {section.label}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Main content */}
        <div className="flex-1 p-8">
          <CurrentComponent />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
