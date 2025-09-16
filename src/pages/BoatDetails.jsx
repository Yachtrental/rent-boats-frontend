import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import BoatInfo from '@/components/BoatInfo';
import BoatBookingPanel from '@/components/BoatBookingPanel';
import { useLanguage } from '@/contexts/LanguageContext';
import { allBoats } from '@/data/boats';

const BoatDetails = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [boat, setBoat] = useState(null);

  useEffect(() => {
    const foundBoat = allBoats.find(b => b.id === id);
    if (foundBoat) {
      const detailedBoatData = {
        ...foundBoat,
        description: 'Embarcación de lujo perfecta para disfrutar de las aguas cristalinas de las Baleares. Equipada con todas las comodidades para una experiencia inolvidable.',
        features: [
          'Cabina con aire acondicionado',
          'Cocina totalmente equipada',
          'Baño completo',
          'Zona de descanso',
          'Plataforma de baño',
          'Sistema de navegación GPS'
        ],
        extras: [
          { id: 'captain', name: 'Patrón profesional', price: 150, required: false },
          { id: 'snorkel', name: 'Equipo de snorkel', price: 25, required: false },
          { id: 'paddleboard', name: 'Paddle surf', price: 40, required: false },
          { id: 'cooler', name: 'Nevera con hielo', price: 15, required: false },
          { id: 'music', name: 'Sistema de música Bluetooth', price: 20, required: false },
          { id: 'catering', name: 'Catering básico', price: 80, required: false }
        ],
        images: [
          'Luxury boat exterior view',
          'Boat interior cabin',
          'Boat cockpit and helm',
          'Boat swimming platform'
        ],
        owner: {
          name: 'Marina Boats Baleares',
          rating: 4.9,
          boats: 12,
          responseTime: '2 horas'
        }
      };
      setBoat(detailedBoatData);
    } else {
      // Handle boat not found, maybe redirect
      navigate('/search');
    }
  }, [id, navigate]);
  
  if (!boat) {
    return <div>Cargando...</div>; // Or a proper loading spinner component
  }

  return (
    <>
      <Helmet>
        <title>{boat.name} - Alquiler en {boat.location} | Rent-Boats.com</title>
        <meta name="description" content={`Alquila ${boat.name} en ${boat.location}. ${boat.description} Desde €${boat.pricePerDay}/día.`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6"
            >
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('back')}
              </Button>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-2 gap-4"
                >
                  {boat.images.map((image, index) => (
                    <div key={index} className={`${index === 0 ? 'col-span-2' : ''} rounded-lg overflow-hidden`}>
                      <img   
                        alt={`${boat.name} - ${image}`}
                        className={`w-full object-cover ${index === 0 ? 'h-80' : 'h-40'}`}
                       src="https://images.unsplash.com/photo-1691845559876-88ee5f1cf962" />
                    </div>
                  ))}
                </motion.div>

                <BoatInfo boat={boat} />
              </div>

              <div className="lg:col-span-1">
                <BoatBookingPanel boat={boat} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BoatDetails;