import React from 'react';
import { motion } from 'framer-motion';
import { Anchor, Euro, Calendar, Users, TrendingUp, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { useToast } from '@/components/ui/use-toast';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const { getBookingsByOwner } = useBooking();
  const { toast } = useToast();
  
  const ownerBookings = getBookingsByOwner(user.id);

  // Mock data for owner's boats
  const ownerBoats = [
    {
      id: '1',
      name: 'Sea Ray Sundancer 350',
      location: 'Palma, Mallorca',
      status: 'active',
      bookings: 12,
      revenue: 5400
    },
    {
      id: '2',
      name: 'Princess V58',
      location: 'Ibiza Puerto',
      status: 'active',
      bookings: 8,
      revenue: 6000
    }
  ];

  const totalRevenue = ownerBoats.reduce((total, boat) => total + boat.revenue, 0);
  const totalBookings = ownerBoats.reduce((total, boat) => total + boat.bookings, 0);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Panel del Armador
            </h1>
            <p className="text-gray-600">
              Gestiona tu flota y maximiza tus ingresos
            </p>
          </div>
          <Button 
            onClick={() => toast({
              title: '🚧 Esta función aún no está implementada—¡pero no te preocupes! ¡Puedes solicitarla en tu próximo mensaje! 🚀'
            })}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Añadir Barco
          </Button>
        </div>
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
                  <Anchor className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Mis Barcos</p>
                  <p className="text-2xl font-bold text-gray-900">{ownerBoats.length}</p>
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
                  <Euro className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                  <p className="text-2xl font-bold text-gray-900">€{totalRevenue}</p>
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
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Reservas Totales</p>
                  <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
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
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Referidos</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* My Boats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Mi Flota</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ownerBoats.map((boat) => (
                <div key={boat.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{boat.name}</h3>
                    <p className="text-sm text-gray-600">{boat.location}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600">Reservas</p>
                      <p className="text-lg font-bold text-gray-900">{boat.bookings}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600">Ingresos</p>
                      <p className="text-lg font-bold text-green-600">€{boat.revenue}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {boat.status === 'active' ? 'Activo' : 'Inactivo'}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toast({
                        title: '🚧 Esta función aún no está implementada—¡pero no te preocupes! ¡Puedes solicitarla en tu próximo mensaje! 🚀'
                      })}
                    >
                      Gestionar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Reservas Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            {ownerBookings.length > 0 ? (
              <div className="space-y-4">
                {ownerBookings.filter(b => b.status === 'pending_confirmation_armador').map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{booking.boatName}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">{booking.guests} huéspedes</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="text-lg font-bold text-gray-900">€{booking.totalPrice}</p>
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => toast({
                          title: '🚧 Esta función aún no está implementada—¡pero no te preocupes! ¡Puedes solicitarla en tu próximo mensaje! 🚀'
                        })}
                      >
                        Aceptar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toast({
                          title: '🚧 Esta función aún no está implementada—¡pero no te preocupes! ¡Puedes solicitarla en tu próximo mensaje! 🚀'
                        })}
                      >
                        Rechazar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No hay reservas pendientes
                </h3>
                <p className="text-gray-600">
                  Las nuevas solicitudes de reserva aparecerán aquí
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Rendimiento del Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">+15%</p>
                <p className="text-sm text-gray-600">Ingresos vs mes anterior</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">85%</p>
                <p className="text-sm text-gray-600">Tasa de ocupación</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">4.8</p>
                <p className="text-sm text-gray-600">Valoración promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default OwnerDashboard;