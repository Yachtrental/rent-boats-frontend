import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/customSupabaseClient";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const [usuarios, setUsuarios] = useState([]);
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
      </section>

      {/* Documentos */}
      <section>
        <h3 className="text-xl font-medium mb-3">Documentación subida</h3>
        <ul className="space-y-2">
          {docs.map((d) => (
            <li
              key={d.name}
              className="flex justify-between items-center border rounded p-2"
            >
              <span>{d.name}</span>
              <a
                className="underline text-blue-600"
                href={supabase.storage.from("documents").getPublicUrl(d.name).data.publicUrl}
                target="_blank"
                rel="noreferrer"
              >
                Ver
              </a>
            </li>
          ))}
          {!docs.length && (
            <li className="opacity-70">No hay documentos todavía</li>
          )}
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboard;
