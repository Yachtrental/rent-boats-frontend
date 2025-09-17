import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Euro, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useBooking } from '@/contexts/BookingContext';

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

export default function BoatBookingPanel({ boat }) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setCurrentBooking } = useBooking();

  const hourPrice = useMemo(() => {
    const perHour = Number(boat?.pricePerHour ?? 0);
    if (perHour > 0) return perHour;
    const perDay = Number(boat?.pricePerDay ?? boat?.precio_dia ?? 0);
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

  useEffect(() => {
    const captainExtra = (boat?.extras ?? []).find((e) => e.id === 'captain' || e.code === 'captain');
    if (captainExtra?.required) {
      setBookingData((prev) => ({
        ...prev,
        needsCaptain: true,
        selectedExtras: [...new Set([...prev.selectedExtras, captainExtra.id || 'captain'])],
      }));
    }
  }, [boat]);

  const selectedOption = useMemo(
    () => DURATION_OPTIONS.find((o) => o.value === bookingData.modalidad) ?? DURATION_OPTIONS.find(o => o.value === 'dia'),
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
    const perDay = Number(boat?.pricePerDay ?? boat?.precio_dia ?? 0);
    if (bookingData.modalidad === 'dia' && perDay > 0) return perDay;
    return (selectedOption?.hours ?? 0) * hourPrice;
  }, [boat, bookingData.modalidad, selectedOption, hourPrice]);

  const extrasPrice = useMemo(() => {
    const extras = boat?.extras ?? [];
    let total = 0;
    bookingData.selectedExtras.forEach((id) => {
      const ex = extras.find((e) => (e.id || e.code) === id);
      if (!ex) return;
      const price = Number(ex.price ?? 0);
      if (ex.perHour) total += (selectedOption?.hours ?? 0) * price;
      else if (ex.perDay) total += Math.ceil((selectedOption?.hours ?? 0) / 8) * price;
      else total += price;
    });
    // patrón obligado si marcado
    const cpt = extras.find((e) => e.id === 'captain' || e.code === 'captain');
    if (bookingData.needsCaptain && cpt && !bookingData.selectedExtras.includes(cpt.id || 'captain')) {
      const price = Number(cpt.price ?? 0);
      if (cpt.perHour) total += (selectedOption?.hours ?? 0) * price;
      else if (cpt.perDay) total += Math.ceil((selectedOption?.hours ?? 0) / 8) * price;
      else total += price;
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
      const captainId = (boat?.extras ?? []).find((e) => e.id === 'captain' || e.code === 'captain')?.id || 'captain';
      const updatedExtras = checked
        ? [...new Set([...prev.selectedExtras, captainId])]
        : prev.selectedExtras.filter((id) => id !== captainId);
      return { ...prev, needsCaptain: checked, selectedExtras: updatedExtras };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      toast({ title: 'Inicia sesión para reservar', description: 'Accede a tu cuenta para continuar.' });
      navigate('/login');
      return;
    }
    if (!bookingData.date || !bookingData.startTime) {
      toast({ variant: 'destructive', title: 'Datos incompletos', description: 'Selecciona fecha y hora de inicio.' });
      return;
    }

    setCurrentBooking({
      boatId: boat?.id,
      boatName: boat?.name ?? boat?.nombre ?? boat?.title ?? 'Embarcación',
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

    // Aquí NO llamamos a ninguna API. Simplemente vamos a /checkout (tu página de pago/resumen).
    navigate('/checkout');
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="sticky top-24">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Reservar</span>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">€{basePrice.toFixed(0)}</div>
              <div className="text-xs text-gray-500 flex items-center justify-end gap-1">
                <Clock className="h-3 w-3" /> {DURATION_OPTIONS.find(o => o.value === bookingData.modalidad)?.label}
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
              <p className="text-xs text-gray-500 mt-1">
                Hora fin estimada: <strong>{endTime || '--:--'}</strong>
              </p>
            </div>

            {/* Pasajeros */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Pasajeros</label>
              <Input
                type="number"
                min={1}
                max={boat?.capacity ?? boat?.capacidad ?? 12}
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
            <p className="text-xs text-gray-500 -mt-2 mb-2">Obligatorio si no tienes titulación náutica.</p>

            {/* Extras */}
            {Array.isArray(boat?.extras) && boat.extras.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Extras</h4>
                <div className="space-y-2">
                  {boat.extras
                    .filter((e) => (e.id || e.code) !== 'captain')
                    .map((extra) => {
                      const key = extra.id || extra.code;
                      return (
                        <div key={key} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={key}
                              checked={bookingData.selectedExtras.includes(key)}
                              onCheckedChange={() => handleExtraToggle(key)}
                            />
                            <label htmlFor={key} className="text-sm">
                              {extra.name || extra.nombre}{' '}
                              {extra.perHour ? '(por hora)' : extra.perDay ? '(por día)' : ''}
                            </label>
                          </div>
                          <div className="text-sm text-gray-700 flex items-center gap-1">
                            <Euro className="h-4 w-4" />
                            {Number(extra.price ?? extra.precio ?? 0)}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Total */}
            <div className="flex items-center justify-between border-t pt-3">
              <span className="text-sm text-gray-700">Total estimado</span>
              <div className="text-xl font-semibold text-blue-600">€{total.toFixed(0)}</div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Continuar
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
