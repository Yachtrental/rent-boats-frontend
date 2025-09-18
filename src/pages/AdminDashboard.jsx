import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/customSupabaseClient";
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [docs, setDocs] = useState([]);

  // Cargar usuarios y documentos
  useEffect(() => {
    const cargarDatos = async () => {
      // 👥 Cargar perfiles con email y rol
      const { data: perfiles, error: errorPerfiles } = await supabase
        .from("perfiles")
        .select("id, role, full_name, avatar_url, created_at");

      if (!errorPerfiles) setUsuarios(perfiles);

      // 📂 Cargar documentos del bucket "documents"
      const { data: archivos, error: errorDocs } = await supabase.storage
        .from("documents")
        .list("", { limit: 100, sortBy: { column: "created_at", order: "desc" } });

      if (!errorDocs) setDocs(archivos || []);
    };

    cargarDatos();
  }, []);

  // Cambiar rol de un usuario
  const actualizarRol = async (id, nuevoRol) => {
    const { error } = await supabase
      .from("perfiles")
      .update({ role: nuevoRol })
      .eq("id", id);

    if (!error) {
      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: nuevoRol } : u))
      );
      alert("Rol actualizado correctamente ✅");
    } else {
      alert("Error al actualizar rol ❌");
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Panel de Administración</h2>

      {/* Gestión de usuarios */}
      <section>
        <h3 className="text-xl font-medium mb-3">Usuarios</h3>
        <div className="overflow-x-auto border rounded">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Nombre</th>
                <th className="p-2 text-left">Rol</th>
                <th className="p-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-2">{u.id.slice(0, 8)}...</td>
                  <td className="p-2">{u.full_name || "Sin nombre"}</td>
                  <td className="p-2 capitalize">{u.role}</td>
                  <td className="p-2 flex gap-2">
                    <select
                      className="border rounded px-2 py-1 text-sm"
                      value={u.role}
                      onChange={(e) => actualizarRol(u.id, e.target.value)}
                    >
                      <option value="cliente">Cliente</option>
                      <option value="armador">Armador</option>
                      <option value="patrón">Patrón</option>
                      <option value="colaborador">Colaborador</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
              {!usuarios.length && (
                <tr>
                  <td colSpan={4} className="p-3 text-center opacity-70">
                    No hay usuarios registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
