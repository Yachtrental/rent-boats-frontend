import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Anchor, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: "https://rent-boats.com/auth/callback",
          data: {
            full_name: formData.name,
            role: formData.role,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Cuenta creada",
        description:
          "Revisa tu correo y valida la cuenta para continuar.",
      });

      navigate("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la cuenta.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Registrarse - Rent-Boats.com</title>
        <meta
          name="description"
          content="Crea tu cuenta en Rent-Boats.com y comienza a alquilar barcos en las Islas Baleares. Únete a nuestra comunidad náutica."
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
              <div className="flex justify-center mb-4">
                <motion.div whileHover={{ rotate: 15 }} className="text-white">
                  <Anchor className="h-12 w-12" />
                </motion.div>
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Crear Cuenta
              </CardTitle>
              <p className="text-white/80">Únete a la comunidad Rent-Boats</p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-white/90 block mb-2">
                    <User className="h-4 w-4 inline mr-1" />
                    Nombre completo
                  </label>
                  <Input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-white/90 block mb-2">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email
                  </label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-white/90 block mb-2">
                    Tipo de cuenta
                  </label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData({ ...formData, role: value })
                    }
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Cliente</SelectItem>
                      <SelectItem value="owner">Armador</SelectItem>
                      <SelectItem value="captain">Patrón</SelectItem>
                      <SelectItem value="collaborator">Colaborador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-white/90 block mb-2">
                    <Lock className="h-4 w-4 inline mr-1" />
                    Contraseña
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          password: e.target.value,
                        })
                      }
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60 pr-10"
                      placeholder="Mínimo 6 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-white/90 block mb-2">
                    <Lock className="h-4 w-4 inline mr-1" />
                    Confirmar contraseña
                  </label>
                  <Input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    placeholder="Repite la contraseña"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-blue-600 hover:bg-white/90 font-semibold"
                  size="lg"
                >
                  {loading ? "Creando cuenta..." : "Crear Cuenta"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-white/80">
                  ¿Ya tienes cuenta?{" "}
                  <Link
                    to="/login"
                    className="text-white font-semibold hover:underline"
                  >
                    Inicia sesión aquí
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default Register;
