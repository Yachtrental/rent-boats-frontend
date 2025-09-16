import React from 'react';
import { motion } from 'framer-motion';
import { Ship, Calendar, Euro, MapPin, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const CaptainDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Mock data for captain assignments
  const assignments = [
    {
      id: '1',
      boatName: 'Sea Ray Sundancer 350',
      customerName: 'Juan Pérez',
      date: '2024-02-15',
      time: '09:00',
      duration: '8 horas',
      location: 'Palma, Mallorca',
      payment: 150,
      status: 'confirmed'
    },
    {
      id: '2',
      boatName: 'Princess V58',
      customerName: 'María García',
      date: '2024-02-18',
      time: '10:00',
      duration: '6 horas',
      location: 'Ibiza Puerto',
      payment: 150,
      status: 'pending'
    }
  ];

  const totalEarnings = assignments.reduce((total, assignment) => total + assignment.payment, 0);
  const confirmedAssignments = assignments.filter(a => a.status === 'confirmed').length;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Panel del Patrón
        </h1>
        <p className="text-gray-600">
          Gestiona tus asignaciones y horarios de navegación
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Ship className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Asignaciones</p>
                  <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Confirmadas</p>
                  <p className="text-2xl font-bold text-gray-900">{confirmedAssignments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Euro className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ingresos</p>
                  <p className="text-2xl font-bold text-gray-900">€{totalEarnings}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Horas Totales</p>
                  <p className="text-2xl font-bold text-gray-900">42h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Upcoming Assignments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Próximas Asignaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{assignment.boatName}</h3>
                    <p className="text-sm text-gray-600">Cliente: {assignment.customerName}</p>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(assignment.date).toLocaleDateString()} a las {assignment.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {assignment.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Clock className="h-4 w-4 mr-1" />
                      Duración: {assignment.duration}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={assignment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {assignment.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}
                    </Badge>
                    <p className="text-lg font-bold text-gray-900 mt-2">
                      €{assignment.payment}
                    </p>
                    {assignment.status === 'pending' && (
                      <Button 
                        size="sm" 
                        className="mt-2 bg-blue-600 hover:bg-blue-700"
                        onClick={() => toast({
                          title: '🚧 Esta función aún no está implementada—¡pero no te preocupes! ¡Puedes solicitarla en tu próximo mensaje! 🚀'
                        })}
                      >
                        Confirmar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Captain Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Mi Perfil de Patrón</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Información Personal</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Nombre:</span> {user.name}</p>
                  <p><span className="font-medium">Licencia:</span> Patrón de Yate</p>
                  <p><span className="font-medium">Experiencia:</span> 8 años</p>
                  <p><span className="font-medium">Idiomas:</span> Español, Inglés, Alemán</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Estadísticas</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Valoración:</span> 4.9/5 ⭐</p>
                  <p><span className="font-medium">Servicios completados:</span> 156</p>
                  <p><span className="font-medium">Disponibilidad:</span> Disponible</p>
                  <p><span className="font-medium">Zona de trabajo:</span> Baleares</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button 
                variant="outline"
                onClick={() => toast({
                  title: '🚧 Esta función aún no está implementada—¡pero no te preocupes! ¡Puedes solicitarla en tu próximo mensaje! 🚀'
                })}
              >
                Editar Perfil
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CaptainDashboard;