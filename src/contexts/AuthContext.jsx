import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const { toast } = useToast();

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleSession = useCallback(async (session) => {
    setSession(session);

    if (session?.user) {
      // 👇 sacamos los datos desde la tabla "perfiles"
      const { data: perfil, error } = await supabase
        .from('perfiles')
        .select('role, full_name, avatar_url')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error cargando perfil:', error.message);
      }

      setUser({
        ...session.user,
        role: perfil?.role || 'cliente', // 👈 ahora viene de la tabla perfiles
        full_name: perfil?.full_name || '',
        avatar_url: perfil?.avatar_url || '',
      });
    } else {
      setUser(null);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      await handleSession(session);
    };

    getSession()
