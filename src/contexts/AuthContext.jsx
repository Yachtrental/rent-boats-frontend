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
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('perfiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      // Console.log agregado para debug del perfil de usuario
      console.log('=== DEBUG: Perfil de usuario recuperado ===');
      console.log('ID del usuario:', userId);
      console.log('Email:', data.email || 'No disponible en perfil');
      console.log('Role:', data.role);
      console.log('Registro completo del perfil:', data);
      console.log('¿Es admin?:', data.role === 'admin');
      console.log('=========================================');

      setUser({ ...data, id: userId });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
    }
  };

  const signUp = async ({ email, password, full_name, role = 'cliente' }) => {
    try {
      // Validación
      if (!email || !password || !full_name) {
        throw new Error('Todos los campos son obligatorios');
      }

      // Registro en Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name, role }
        }
      });

      if (authError) throw authError;

      if (!authData.user?.id) {
        throw new Error('No se pudo crear el usuario');
      }

      // Crear perfil usando los campos correctos del esquema
      const { error: profileError } = await supabase
        .from('perfiles')
        .insert([
          {
            id: authData.user.id,
            full_name,
            role
          }
        ]);

      if (profileError) {
        console.error('Error creating profile:', profileError);
        await supabase.auth.signOut();
        throw new Error('Error al crear el perfil de usuario');
      }

      toast.success('¡Registro exitoso! Por favor verifica tu email.');
      return authData;
    } catch (error) {
      console.error('Error in signUp:', error);
      toast.error(error.message || 'Error al registrar usuario');
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

      // Forzar refresco del perfil tras login exitoso
      if (data.user?.id) {
        await fetchUserProfile(data.user.id);
      } else {
        // Fallback: obtener sesión actual si no hay user en data
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session?.user?.id) {
          await fetchUserProfile(sessionData.session.user.id);
        }
      }

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
    signOut,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
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
