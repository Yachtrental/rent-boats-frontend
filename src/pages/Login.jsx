import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Anchor, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';

const Login = () => {
  const { t } = useLanguage();
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [form, setForm] = useState({ 
    email: '', 
    password: '' 
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(form.email, form.password);
      if (!error) {
        // Redirección según rol
        switch (user?.role) {
          case 'admin':
            navigate('/dashboard/admin', { replace: true });
            break;
          case 'armador':
            navigate('/dashboard/owner', { replace: true });
            break;
          case 'patron':
            navigate('/dashboard/captain', { replace: true });
            break;
          case 'colaborador':
            navigate('/dashboard/collaborator', { replace: true });
            break;
          case 'cliente':
          default:
            navigate('/dashboard/customer', { replace: true });
        }
        toast({
          title: t('success'),
          description: 'Sesión iniciada correctamente'
        });
      }
    } catch (err) {
      console.error('Error en login:', err.message);
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Iniciar Sesión - Rent-Boats.com</title>
        <meta 
          name="description" 
          content="Inicia sesión en tu cuenta de Rent-Boats.com para gestionar tus reservas y acceder a tu panel de control." 
        />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 hero-gradient"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-md w-full"
        >
          <Card className="glass-effect border-white/20">
            <CardHeader className="text-center">
              <motion.div
                whileHover={{ rotate: 15 }}
                className="flex justify-center mb-4"
              >
                <Anchor className="h-12 w-12 text-white" />
              </motion.div>
              <CardTitle className="text-2xl font-bold text-white">
                Iniciar Sesión
              </CardTitle>
              <p className="text-white/80">
                Accede a tu cuenta de Rent-Boats
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-white/90 block mb-2">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email
                  </label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-white/90 block mb-2">
                    <Lock className="h-4 w-4 inline mr-1" />
                    Contraseña
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => setForm({...form, password: e.target.value})}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60 pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-blue-600 hover:bg-white/90 font-semibold"
                  size="lg"
                >
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-white/80">
                  ¿No tienes cuenta?{' '}
                  <Link to="/register" className="text-white font-semibold hover:underline">
                    Regístrate aquí
                  </Link>
                </p>
              </div>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => toast({
                    title: t('featureNotImplemented')
                  })}
                  className="text-white/80 text-sm hover:text-white hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default Login;