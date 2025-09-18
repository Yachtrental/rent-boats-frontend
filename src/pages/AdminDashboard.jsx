src\pages\AdminDashboard.jsx
@@ -1,9 +1,103 @@
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/customSupabaseClient";
import { Button } from "@/components/ui/button";
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

const AdminDashboard = () => {
  const [usuarios, setUsuarios] = useState([]);
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



@@ -182,35 +276,52 @@ const UserManagement = () => {
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
              Guardar cambios
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
// ...existing DashboardMetrics and MetricCard components...

const SECTIONS = [
  { key: 'dashboard', label: 'Dashboard', component: DashboardMetrics, icon: <BarChart2 /> },
  { key: 'users', label: 'Usuarios', component: UserManagement, icon: <Users /> },
  { key: 'boats', label: 'Barcos', component: BoatManagement, icon: <Ship /> },
  { key: 'documents', label: 'Documentos', component: DocumentManagement, icon: <FileText /> },
  // ...rest of the sections...
];

// ...existing AdminDashboard component...
  );
};

export default AdminDashboard;
