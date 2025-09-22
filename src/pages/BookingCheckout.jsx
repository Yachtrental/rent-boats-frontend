import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, Shield, Calendar, Users, Euro, CheckCircle } from 'lucide-react';
import { Helmet } from 'react-helmet';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';

const BookingCheckout = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentBooking, createBooking } = useBooking();
  const { toast } = useToast();

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    acceptTerms: false
  });
  const [processing, setProcessing] = useState(false);

  if (!currentBooking || !user) {
    navigate('/');
    return null;
  }

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!paymentData.acceptTerms) {
      toast({
        title: t('error'),
        description: 'Debes aceptar los términos y condiciones',
        variant: 'destructive'
      });
      return;
    }

    setProcessing(true);
    // Mock payment processing
    setTimeout(() => {
      // Removed unused variable 'booking'
      createBooking(currentBooking);

      toast({
        title: t('success'),
        description: 'Reserva creada correctamente. El armador tiene 24h para confirmar.',
      });

      navigate('/dashboard');
      setProcessing(false);
    }, 2000);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  return (
    <>
      <Helmet>
        <title>Finalizar Reserva - Rent-Boats.com</title>
        <meta name="description" content="Completa tu reserva de forma segura. Pago del depósito del 20% para confirmar tu aventura marítima." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <div className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('back')}
              </Button>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Booking Summary */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Resumen de Reserva</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <img
                        alt={`${currentBooking.boatName} - Barco de alquiler`}
                        className="w-20 h-20 rounded-lg object-cover"
                        src="https://images.unsplash.com/photo-1454985471578-83a008ed7f88"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{currentBooking.boatName}</h3>
                        <p className="text-sm text-gray-600">Palma, Mallorca</p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm">Fechas</span>
                        </div>
                        <span className="text-sm font-medium">
                          {new Date(currentBooking.checkIn).toLocaleDateString()} - {new Date(currentBooking.checkOut).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm">Huéspedes</span>
                        </div>
                        <span className="text-sm font-medium">{currentBooking.guests} personas</span>
                      </div>

                      {currentBooking.needsCaptain && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Patrón incluido</span>
                          <span className="text-sm font-medium">Sí</span>
                        </div>
                      )}

                      {(currentBooking.selectedExtras && currentBooking.selectedExtras.length > 0) && (
                        <div>
                          <p className="text-sm font-medium mb-2">Extras seleccionados:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {currentBooking.selectedExtras.map((extra, index) => (
                              <li key={index}>• {extra}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Price Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Desglose de Precios</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Precio base</span>
                      <span>€{Math.round(currentBooking.totalPrice * 0.8)}</span>
                    </div>

                    {currentBooking.needsCaptain && (
                      <div className="flex justify-between">
                        <span>Patrón</span>
                        <span>€150</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Extras</span>
                      <span>€{Math.round(currentBooking.totalPrice * 0.2)}</span>
                    </div>

                    <div className="border-t pt-3">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>€{currentBooking.totalPrice}</span>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span>Depósito a pagar ahora (20%)</span>
                        <span className="font-semibold">€{currentBooking.depositAmount}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span>Restante a pagar después (80%)</span>
                        <span>€{currentBooking.remainingAmount}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Payment Form */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Información de Pago
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4" onSubmit={handlePayment}>
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Número de tarjeta</label>
                        <Input
                          type="text"
                          required
                          placeholder="1234 5678 9012 3456"
                          value={paymentData.cardNumber}
                          onChange={(e) => setPaymentData({ ...paymentData, cardNumber: formatCardNumber(e.target.value) })}
                          maxLength={19}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-2">Fecha de vencimiento</label>
                          <Input
                            type="text"
                            required
                            placeholder="MM/AA"
                            value={paymentData.expiryDate}
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, '');
                              if (value.length >= 2) {
                                value = value.substring(0, 2) + '/' + value.substring(2, 4);
                              }
                              setPaymentData({ ...paymentData, expiryDate: value });
                            }}
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-2">CVV</label>
                          <Input
                            type="text"
                            required
                            placeholder="123"
                            value={paymentData.cvv}
                            onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value.replace(/\D/g, '').substring(0, 3) })}
                            maxLength={3}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2">Nombre en la tarjeta</label>
                        <Input
                          type="text"
                          required
                          placeholder="Juan Pérez"
                          value={paymentData.cardName}
                          onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                        />
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <Shield className="h-5 w-5 text-green-600 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-green-800">Pago seguro</p>
                            <p className="text-xs text-green-600">Tu información está protegida con encriptación SSL</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="terms"
                          checked={paymentData.acceptTerms}
                          onCheckedChange={(checked) => setPaymentData({ ...paymentData, acceptTerms: Boolean(checked) })}
                        />
                        <label className="text-sm text-gray-700" htmlFor="terms">
                          Acepto los{' '}
                          <Button
                            type="button"
                            onClick={() =>
                              toast({
                                title:
                                  '🚧 Esta función aún no está implementada—¡pero no te preocupes! ¡Puedes solicitarla en tu próximo mensaje! 🚀',
                              })
                            }
                            className="text-blue-600 hover:underline"
                            variant="link"
                          >
                            términos y condiciones
                          </Button>
                          {' '}y la{' '}
                          <Button
                            type="button"
                            onClick={() =>
                              toast({
                                title:
                                  '🚧 Esta función aún no está implementada—¡pero no te preocupes! ¡Puedes solicitarla en tu próximo mensaje! 🚀',
                              })
                            }
                            className="text-blue-600 hover:underline"
                            variant="link"
                          >
                            política de privacidad
                          </Button>
                        </label>
                      </div>

                      <Button type="submit" disabled={processing} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                        {processing ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Procesando pago...
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Euro className="h-4 w-4 mr-2" />
                            Pagar Depósito €{currentBooking.depositAmount}
                          </div>
                        )}
                      </Button>

                      <div className="text-center">
                        <p className="text-xs text-gray-600">El armador tiene 24 horas para confirmar tu reserva</p>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                {/* Important Info */}
                <Card className="mt-6">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-gray-900 mb-1">Proceso de reserva:</p>
                        <ul className="text-gray-600 space-y-1">
                          <li>1. Pagas el depósito del 20% ahora</li>
                          <li>2. El armador confirma en 24h máximo</li>
                          <li>3. Pagas el 80% restante 48h antes de la salida</li>
                          <li>4. ¡Disfruta de tu aventura marítima!</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingCheckout;
