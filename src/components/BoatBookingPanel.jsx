import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Euro } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';

const BoatBookingPanel = ({ boat }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setCurrentBooking } = useBooking();

  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 2,
    selectedExtras: [],
    needsCaptain: false
  });

  useEffect(() => {
    // If the boat comes with a captain, automatically select it.
    // This is a simplified example; real logic would involve ACF/boat data
    const captainExtra = boat.extras.find(e => e.id === 'captain');
    if (captainExtra && captainExtra.required) {
      setBookingData(prev => ({
        ...prev,
        needsCaptain: true,
        selectedExtras: [...new Set([...prev.selectedExtras, 'captain'])]
      }));
    }
  }, [boat.extras]);

  const calculateTotal = () => {
    const days = bookingData.checkIn && bookingData.checkOut 
      ? Math.ceil((new Date(bookingData.checkOut) - new Date(bookingData.checkIn)) / (1000 * 60 * 60 * 24))
      : 1;
    
    const basePrice = boat.pricePerDay * days;
    let extrasPrice = bookingData.selectedExtras.reduce((total, extraId) => {
      const extra = boat.extras.find(e => e.id === extraId);
      return total + (extra ? extra.price * days : 0);
    }, 0);
    
    // Ensure captain price is added if needsCaptain is true, even if not explicitly selected as extra
    const captainExtra = boat.extras.find(e => e.id === 'captain');
    if (bookingData.needsCaptain && captainExtra && !bookingData.selectedExtras.includes('captain')) {
        extrasPrice += captainExtra.price * days;
    }

    return basePrice + extrasPrice;
  };

  const handleExtraToggle = (extraId) => {
    setBookingData(prev => ({
      ...prev,
      selectedExtras: prev.selectedExtras.includes(extraId)
        ? prev.selectedExtras.filter(id => id !== extraId)
        : [...prev.selectedExtras, extraId]
    }));
  };

  const handleNeedsCaptainToggle = (checked) => {
    setBookingData(prev => {
      const updatedExtras = checked 
        ? [...new Set([...prev.selectedExtras, 'captain'])] // Add 'captain' if checked
        : prev.selectedExtras.filter(id => id !== 'captain'); // Remove 'captain' if unchecked
      return {
        ...prev,
        needsCaptain: checked,
        selectedExtras: updatedExtras
      };
    });
  };


  const handleBooking = () => {
    if (!user) {
      toast({
        title: t('error'),
        description: 'Necesitas iniciar sesión para realizar una reserva',
        variant: 'destructive'
      });
      navigate('/login');
      return;
    }

    if (!bookingData.checkIn || !bookingData.checkOut) {
      toast({
        title: t('error'),
        description: 'Por favor selecciona las fechas de entrada y salida',
        variant: 'destructive'
      });
      return;
    }
    
    const startDate = new Date(bookingData.checkIn);
    const endDate = new Date(bookingData.checkOut);
    if (startDate >= endDate) {
      toast({
        title: t('error'),
        description: 'La fecha de salida debe ser posterior a la fecha de entrada',
        variant: 'destructive'
      });
      return;
    }

    const total = calculateTotal();
    const deposit = Math.round(total * 0.2);
    
    const booking = {
      boatId: boat.id,
      boatName: boat.name,
      customerId: user.id,
      ownerId: 'owner-1', // Mock owner ID
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      guests: bookingData.guests,
      selectedExtras: bookingData.selectedExtras,
      needsCaptain: bookingData.needsCaptain,
      totalPrice: total,
      depositAmount: deposit,
      remainingAmount: total - deposit
    };

    setCurrentBooking(booking);
    navigate('/checkout');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="sticky top-24"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Reservar</span>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">€{boat.pricePerDay}</div>
              <div className="text-sm text-gray-600">{t('pricePerDay')}</div>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Dates */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                <Calendar className="h-4 w-4 inline mr-1" />
                Entrada
              </label>
              <Input
                type="date"
                value={bookingData.checkIn}
                onChange={(e) => setBookingData({...bookingData, checkIn: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                <Calendar className="h-4 w-4 inline mr-1" />
                Salida
              </label>
              <Input
                type="date"
                value={bookingData.checkOut}
                onChange={(e) => setBookingData({...bookingData, checkOut: e.target.value})}
              />
            </div>
          </div>

          {/* Guests */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              <Users className="h-4 w-4 inline mr-1" />
              Huéspedes
            </label>
            <Input
              type="number"
              min="1"
              max={boat.capacity}
              value={bookingData.guests}
              onChange={(e) => setBookingData({...bookingData, guests: parseInt(e.target.value)})}
            />
          </div>

          {/* Captain Required */}
          <div className="bg-yellow-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="needsCaptain"
                checked={bookingData.needsCaptain}
                onCheckedChange={handleNeedsCaptainToggle}
                disabled={boat.extras.find(e => e.id === 'captain')?.required} // Disable if captain is required by boat
              />
              <label htmlFor="needsCaptain" className="text-sm font-medium">
                Necesito patrón ({boat.extras.find(e => e.id === 'captain')?.price ? `€${boat.extras.find(e => e.id === 'captain').price}/día` : 'precio no especificado'})
              </label>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Obligatorio si no tienes titulación náutica
            </p>
          </div>

          {/* Extras */}
          <div>
            <h4 className="font-medium mb-3">Extras disponibles</h4>
            <div className="space-y-2">
              {boat.extras.filter(e => e.id !== 'captain').map((extra) => ( // Filter out captain from general extras list if handled separately
                <div key={extra.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={extra.id}
                      checked={bookingData.selectedExtras.includes(extra.id)}
                      onCheckedChange={() => handleExtraToggle(extra.id)}
                      disabled={extra.required}
                    />
                    <label htmlFor={extra.id} className="text-sm">
                      {extra.name}
                    </label>
                  </div>
                  <span className="text-sm font-medium">€{extra.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Total</span>
              <span className="text-xl font-bold text-blue-600">€{calculateTotal()}</span>
            </div>
            <div className="text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Depósito (20%)</span>
                <span>€{Math.round(calculateTotal() * 0.2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Restante (80%)</span>
                <span>€{calculateTotal() - Math.round(calculateTotal() * 0.2)}</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleBooking}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            <Euro className="h-4 w-4 mr-2" />
            {t('bookNow')}
          </Button>

          <p className="text-xs text-gray-600 text-center">
            El armador tiene 24h para aceptar tu solicitud
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BoatBookingPanel;