import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Euro, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';

/**
 * Reglas de duración:
 *  - Horas: 1h,2h,3h,4h,5h,6h
 *  - Medio día: 4h (medio_dia)
 *  - Día: 8h (dia)
 *  - Sunset: 2h (sunset)
 * Precio por hora estimado = pricePerDay / 8 (si no hay tarifa por hora)
 */
const DURATION_OPTIONS = [
  { value: '1h', label: '1 hora', hours: 1 },
  { value: '2h', label: '2 horas', hours: 2 },
  { value: '3h', label: '3 horas', hours: 3 },
  { value: '4h', label: '4 horas', hours: 4 },
  { value: '5h', label: '5 horas', hours: 5 },
  { value: '6h', label: '6 horas', hours: 6 },
  { value: 'medio_dia', label: 'Medio día (4h)', hours: 4 },
  { value: 'dia', label: 'Día completo (8h)', hours: 8 },
  { value: 'sunset', label: 'Sunset (2h)', hours: 2 },
];

const BoatBookingPanel = ({ boat }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setCurrentBooking } = useBooking();

  // Si el barco define tarifas por modalidad, úsalo. Si no, derivamos por hora.
  const hourPrice = useMemo(() => {
    if (boat?.pricePerHour && boat.pricePerHour > 0) return boat.pricePerHour;
    const perDay = Number(boat?.pricePerDay ?? 0);
    return perDay > 0 ? perDay / 8 : 0;
  }, [boat]);

  const [bookingData, setBookingData] = useState({
    date: '',
    startTime: '',
    modalidad: 'dia',
    guests: 2,
    selectedExtras: [],
    needsCaptain: false,
  });

  // Si el barco exige patrón, marcarlo
  useEffect(() => {
    const captainExtra = (boat?.extras ?? []).find((e) => e.id === 'captain');
    if (captainExtra?.required) {
      setBookingData((prev) => ({
        ...prev,
        needsCaptain: true,
        selectedExtras: [...new Set([...prev.selectedExtras, 'captain'])],
      }));
    }
  }, [boat]);

  const selectedOption = useMemo(
    () => DURATION_OPTIONS.find((o) => o.value === bookingData.modalidad) ?? DURATION_OPTIONS[7],
    [bookingData.modalidad]
  );

  const endTime = useMemo(() => {
    if (!bookingData.startTime) return '';
    const [h, m] = bookingData.startTime.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m || 0, 0, 0);
    d.setHours(d.getHours() + (selectedOption?.hours ?? 0));
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }, [bookingData.startTime, selectedOption]);

  const basePrice = useMemo(() => {
    if (!boat) return 0;
    // Si es día completo y hay pricePerDay, usarlo; si no, calcular por horas
    if (bookingData.modalidad === 'dia' && boat?.pricePerDay) return Number(boat.pricePerDay);
    // Cualquier otra modalidad: horas * pricePerHour (derivado si no existe atributo)
    return (selectedOption?.hours ?? 0) * hourPrice;
  }, [boat, bookingData.modalidad, selectedOption, hourPrice]);

  const extrasPrice = useMemo(() => {
    const extras = boat?.extras ?? [];
    let total = 0;
    bookingData.selectedExtras.forEach((id) => {
      const ex = extras.find((e) => e.id === id);
      if (!ex) return;
      // Precio del extra por bloque reservado: prorrateamos por horas si hace falta
      if (ex.perHour) {
        total += (selectedOption?.hours ?? 0) * Number(ex.price ?? 0);
      } else if (ex.perDay) {
        if (bookingData.modalidad === 'dia') total += Number(ex.price ?? 0);
        else total += Math.ceil((selectedOption?.hours ?? 0) / 8) * Number(ex.price ?? 0);
      } else {
        // precio fijo por reserva
        total += Number(ex.price ?? 0);
      }
    });

    // Si needsCaptain está activo, asegurar que sumamos patrón
    const captain = extras.find((e) => e.id === 'captain');
    if (bookingData.needsCaptain && captain && !bookingData.selectedExtras.includes('captain')) {
      // suponemos precio por bloque reservado
      if (captain.perHour) total += (selectedOption?.hours ?? 0) * Number(captain.price ?? 0);
      else if (captain.perDay) {
        if (bookingData.modalidad === 'dia') total += Number(captain.price ?? 0);
        else total += Math.ceil((selectedOption?.hours ?? 0) / 8) * Number(captain.price ?? 0);
      } else {
        total += Number(captain.price ?? 0);
      }
    }

    return total;
  }, [boat, bookingData.selectedExtras, bookingData.needsCaptain, bookingData.modalidad, selectedOption]);

  const total = basePrice + extrasPrice;

  const handleExtraToggle = (extraId) => {
    setBookingData((prev) => ({
      ...prev,
      selectedExtras: prev.selectedExtras.includes(extraId)
        ? prev.selectedExtras.filter((id) => id !== extraId)
        : [...prev.selectedExtras, extraId],
    }));
  };

  const handleNeedsCaptainToggle = (checked) => {
    setBookingData((prev) => {
      const updatedExtras = checked
        ? [...new Set([...prev.selectedExtras, 'captain'])]
        : prev.selectedExtras.filter((id) => id !== 'captain');
      return { ...prev, needsCaptain: checked, selectedExtras: updatedExtras };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: 'Inicia sesión para reservar',
        description: 'Necesitas acceder a tu cuenta para continuar con el pago.',
      });
      navigate('/login');
      return;
    }

    if (!bookingData.date || !bookingData.startTime) {
      toast({
        variant: 'destructive',
        title: 'Datos incompletos',
        description: 'Selecciona fecha y hora de inicio.',
      });
      return;
    }

    setCurrentBooking({
      boatId: boat?.id,
      boatName: boat?.name ?? boat?.title ?? 'Embarcación',
      date: bookingData.date,
      startTime: bookingData.startTime,
      endTime,
      modalidad: bookingData.modalidad,
      hours: selectedOption?.hours ?? 0,
      guests: bookingData.guests,
      selectedExtras: bookingData.selectedExtras,
      needsCaptain: bookingData.needsCaptain,
      totals: {
        basePrice,
        extrasPrice,
        total,
      },
    });

    navigate('/checkout');
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="sticky top-24">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Reservar</span>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">€{basePrice.toFixed(0)}</div>
              <div className="text-xs text-gray-500 flex items-center justify-end gap-1">
                <Clock className="h-3 w-3" /> {selectedOption?.label}
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Fecha + hora inicio */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Fecha
                </label>
                <Input
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => setBookingData((p) => ({ ...p, date: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Hora inicio
                </label>
                <Input
                  type="time"
                  value={bookingData.startTime}
                  onChange={(e) => setBookingData((p) => ({ ...p, startTime: e.target.value }))}
                />
              </div>
            </div>

            {/* Modalidad */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Duración</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={bookingData.modalidad}
                onChange={(e) => setBookingData((p) => ({ ...p, modalidad: e.target.value }))}
              >
                {DURATION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Hora fin estimada: <strong>{endTime || '--:--'}</strong></p>
            </div>

            {/* Pasajeros */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Pasajeros</label>
              <Input
                type="number"
                min={1}
                max={boat?.capacity ?? 12}
                value={bookingData.guests}
                onChange={(e) => setBookingData((p) => ({ ...p, guests: Number(e.target.value) }))}
              />
            </div>

            {/* Patrón */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="needsCaptain"
                checked={bookingData.needsCaptain}
                onCheckedChange={(checked) => handleNeedsCaptainToggle(!!checked)}
              />
              <label htmlFor="needsCaptain" className="text-sm">Necesito patrón</label>
            </div>
            <p className="text-xs text-gray-500 -mt-2 mb-2">Obligatorio si no tienes titulación náutica</p>

            {/* Extras */}
            {Array.isArray(boat?.extras) && boat.extras.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Extras</h4>
                <div className="space-y-2">
                  {boat.extras
                    .filter((e) => e.id !== 'captain')
                    .map((extra) => (
                      <div key={extra.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={extra.id}
                            checked={bookingData.selectedExtras.includes(extra.id)}
                            onCheckedChange={() => handleExtraToggle(extra.id)}
                          />
                          <label htmlFor={extra.id} className="text-sm">
                            {extra.name} {extra.perHour ? '(por hora)' : extra.perDay ? '(por día)' : ''}
                          </label>
                        </div>
                        <div className="text-sm text-gray-700 flex items-center gap-1">
                          <Euro className="h-4 w-4" />
                          {Number(extra.price ?? 0)}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Total */}
            <div className="flex items-center justify-between border-t pt-3">
              <span className="text-sm text-gray-700">Total estimado</span>
              <div className="text-xl font-semibold text-blue-600">€{total.toFixed(0)}</div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Continuar al pago
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BoatBookingPanel;

          <p className="text-xs text-gray-600 text-center">
            El armador tiene 24h para aceptar tu solicitud
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BoatBookingPanel;
