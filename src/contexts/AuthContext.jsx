import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async ({ email, password, nombre, telefono, role = 'cliente' }) => {
    try {
      // 1. Registrar usuario en Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nombre, telefono, role }
        }
      });

      if (authError) throw authError;

      // 2. Crear perfil en la tabla perfiles
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('perfiles')
          .insert([
            {
              id: authData.user.id,
              email,
              nombre,
              telefono,
              role,
              created_at: new Date().toISOString()
            }
          ]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
          // Intentar revertir el registro de auth
          await supabase.auth.signOut();
          throw new Error('Error al crear el perfil');
        }

        toast.success('Registro exitoso! Por favor verifica tu email.');
        return authData;
      }
    } catch (error) {
      console.error('Error in signUp:', error);
      toast.error(error.message);
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return data;
    } catch (error) {
      toast.error('Error al iniciar sesión');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      toast.error('Error al cerrar sesión');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

-- Políticas para la tabla perfiles
create policy "Users can insert their own profile"
on perfiles for insert
with check (auth.uid() = id);

create policy "Users can read own profile"
on perfiles for select
using (auth.uid() = id);

create policy "Users can update own profile"
on perfiles for update
using (auth.uid() = id);

create table perfiles (
  id uuid references auth.users primary key,
  email text unique not null,
  nombre text,
  telefono text,
  role text default 'cliente',
  created_at timestamp with time zone default timezone('utc'::text, now())
);
