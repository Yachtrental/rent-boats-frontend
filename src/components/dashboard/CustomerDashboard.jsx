import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Euro, MapPin, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { useToast } from '@/components/ui/use-toast';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const { getBookingsByUser } = useBooking();
  const { toast } = useToast();
  
  const userBookings = getBookingsByUser(user.id);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_confirmation_armador':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending_customer_confirmation':
        return 'bg-blue-100 text-blue-800';
      case 'pending_payment_final':
        return 'bg-orange-100 text-orange-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending_confirmation_armador':
        return 'Esperando confirmación del armador';
      case 'pending_customer_confirmation':
        return 'Pendiente de tu confirmación';
      case 'pending_payment_final':
        return 'Pendiente pago final';
      case 'confirmed':
        return 'Confirmado';
      case 'completed':
        return 'Completado';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ¡Bienvenido, {user.name}!
        </h1>
        <p className="text-gray-600">
          Gestiona tus reservas y descubre nuevas aventuras marítimas
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Reservas Totales</p>
                  <p className="text-2xl font-bold text-gray-900">{userBookings.length}</p>
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
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Reservas Confirmadas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {userBookings.filter(b => b.status === 'confirmed' || b.status === 'completed').length}
                  </p>
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
                  <p className="text-sm font-medium text-gray-600">Total Gastado</p>
                  <p className="text-2xl font-bold text-gray-900">
                    €{userBookings.reduce((total, booking) => total + (booking.totalPrice || 0), 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Mis Reservas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {userBookings.length > 0 ? (
              <div className="space-y-4">
                {userBookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{booking.boatName}</h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {booking.guests} huéspedes
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(booking.status)}>
                        {getStatusText(booking.status)}
                      </Badge>
                      <p className="text-lg font-bold text-gray-900 mt-2">
                        €{booking.totalPrice}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No tienes reservas aún
                </h3>
                <p className="text-gray-600 mb-4">
                  ¡Explora nuestra flota y reserva tu primera aventura marítima!
                </p>
                <Button 
                  onClick={() => toast({
                    title: '🚧 Esta función aún no está implementada—¡pero no te preocupes! ¡Puedes solicitarla en tu próximo mensaje! 🚀'
                  })}
                >
                  Explorar Barcos
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => toast({
                  title: '🚧 Esta función aún no está implementada—¡pero no te preocupes! ¡Puedes solicitarla en tu próximo mensaje! 🚀'
                })}
              >
                <Calendar className="h-6 w-6 mb-2" />
                Nueva Reserva
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => toast({
                  title: '🚧 Esta función aún no está implementada—¡pero no te preocupes! ¡Puedes solicitarla en tu próximo mensaje! 🚀'
                })}
              >
                <Clock className="h-6 w-6 mb-2" />
                Historial
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => toast({
                  title: '🚧 Esta función aún no está implementada—¡pero no te preocupes! ¡Puedes solicitarla en tu próximo mensaje! 🚀'
                })}
              >
                <Star className="h-6 w-6 mb-2" />
                Mis Reseñas
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => toast({
                  title: '🚧 Esta función aún no está implementada—¡pero no te preocupes! ¡Puedes solicitarla en tu próximo mensaje! 🚀'
                })}
              >
                <MapPin className="h-6 w-6 mb-2" />
                Soporte
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CustomerDashboard;