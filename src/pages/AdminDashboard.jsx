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

// ...existing DashboardMetrics and MetricCard components...

const SECTIONS = [
  { key: 'dashboard', label: 'Dashboard', component: DashboardMetrics, icon: <BarChart2 /> },
  { key: 'users', label: 'Usuarios', component: UserManagement, icon: <Users /> },
  { key: 'boats', label: 'Barcos', component: BoatManagement, icon: <Ship /> },
  { key: 'documents', label: 'Documentos', component: DocumentManagement, icon: <FileText /> },
  // ...rest of the sections...
];

// ...existing AdminDashboard component...
