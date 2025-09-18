import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Anchor } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, user } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await signIn(form.email, form.password);
      if (!error) {
        // 👇 redirección según rol en español
        switch (user?.role) {
          case 'admin':
            navigate('/dashboard/admin', { replace: true });
            break;
          case 'armador':
            navigate('/dashboard/owner', { replace: true });
            break;
          case 'patrón':
            navigate('/dashboard/captain', { replace: true });
            break;
          case 'colaborador':
            navigate('/dashboard/collaborator', { replace: true });
            break;
          case 'cliente':
          default:
            navigate('/dashboard/customer', { replace: true });
        }
      }
    } catch (err) {
      console.error('Error en login:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Entrar – Rent-Boats.com</title>
      </Helmet>

      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Anchor size={20}/> Iniciar sesión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Contraseña</label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-70"
                  >
                    {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Entrando…' : 'Entrar'}
              </Button>

              <p className="text-sm text-center">
                ¿No tienes cuenta?{' '}
                <Link to="/register" className="underline">Regístrate</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Login;
