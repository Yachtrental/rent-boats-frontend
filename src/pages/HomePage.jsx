import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, Anchor, Star, Award, Shield } from 'lucide-react';
import { Helmet } from 'react-helmet';
import Navigation from '@/components/Navigation';
import BoatCard from '@/components/BoatCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { allBoats } from '@/data/boats';

const HomePage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: '2'
  });

  const featuredBoats = allBoats.slice(0, 3);

  const destinations = [
    'Palma, Mallorca',
    'Ibiza Puerto',
    'Mahón, Menorca',
    'Formentera',
    'Alcudia, Mallorca',
    'San Antonio, Ibiza'
  ];

  const handleSearch = () => {
    if (!searchData.destination) {
      toast({
        title: t('error'),
        description: 'Por favor selecciona un destino',
        variant: 'destructive'
      });
      return;
    }
    navigate(`/search?destination=${encodeURIComponent(searchData.destination)}&guests=${searchData.guests}`);
  };

  const handleBoatSelect = (boat) => {
    navigate(`/boat/${boat.id}`);
  };

  return (
    <>
      <Helmet>
        <title>Rent-Boats.com - Alquiler de Barcos en Baleares | Marketplace Náutico</title>
        <meta name="description" content="Descubre más de 500 barcos para alquilar en Mallorca, Ibiza, Menorca y Formentera. Reserva online con patrón incluido o sin él. ¡Tu aventura marítima te espera!" />
      </Helmet>

      <div className="min-h-screen">
        <Navigation />
        
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 hero-gradient"></div>
          <div className="absolute inset-0 bg-black/20"></div>
          
          {/* Floating elements */}
          <div className="absolute top-20 left-10 animate-float">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="text-white/30"
            >
              <Anchor className="h-16 w-16" />
            </motion.div>
          </div>
          
          <div className="absolute bottom-20 right-10 animate-float" style={{ animationDelay: '2s' }}>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="text-white/20"
            >
              <Anchor className="h-12 w-12" />
            </motion.div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                {t('heroTitle')}
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
                {t('heroSubtitle')}
              </p>

              {/* Search Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto shadow-2xl"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      Destino
                    </label>
                    <Select value={searchData.destination} onValueChange={(value) => setSearchData({...searchData, destination: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('searchPlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        {destinations.map((dest) => (
                          <SelectItem key={dest} value={dest}>{dest}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Entrada
                    </label>
                    <Input
                      type="date"
                      value={searchData.checkIn}
                      onChange={(e) => setSearchData({...searchData, checkIn: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Salida
                    </label>
                    <Input
                      type="date"
                      value={searchData.checkOut}
                      onChange={(e) => setSearchData({...searchData, checkOut: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      Huéspedes
                    </label>
                    <Select value={searchData.guests} onValueChange={(value) => setSearchData({...searchData, guests: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(12)].map((_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {i + 1} {i === 0 ? 'persona' : 'personas'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={handleSearch}
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                  size="lg"
                >
                  <Search className="h-5 w-5 mr-2" />
                  {t('searchButton')}
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                ¿Por qué elegir Rent-Boats?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                La plataforma líder en alquiler de barcos en las Islas Baleares
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  title: 'Reserva Segura',
                  description: 'Sistema de pago seguro con depósito del 20% y confirmación en 24h'
                },
                {
                  icon: Star,
                  title: 'Patrón Incluido',
                  description: 'Asignación automática de patrón si no tienes titulación náutica'
                },
                {
                  icon: Award,
                  title: 'Más de 500 Barcos',
                  description: 'La mayor flota de embarcaciones en Mallorca, Ibiza, Menorca y Formentera'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  <Card className="text-center p-8 h-full hover:shadow-lg transition-shadow">
                    <CardContent className="space-y-4">
                      <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <feature.icon className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Boats Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Barcos Destacados
              </h2>
              <p className="text-xl text-gray-600">
                Descubre nuestras embarcaciones más populares
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredBoats.map((boat, index) => (
                <motion.div
                  key={boat.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  <BoatCard boat={boat} onSelect={handleBoatSelect} />
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button 
                onClick={() => navigate('/search')}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Ver Todos los Barcos
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Anchor className="h-8 w-8" />
                  <span className="text-xl font-bold">Rent-Boats</span>
                </div>
                <p className="text-gray-400">
                  La plataforma líder en alquiler de barcos en las Islas Baleares
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Destinos</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Mallorca</li>
                  <li>Ibiza</li>
                  <li>Menorca</li>
                  <li>Formentera</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Servicios</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Alquiler con Patrón</li>
                  <li>Alquiler sin Patrón</li>
                  <li>Extras y Servicios</li>
                  <li>Seguro Incluido</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Soporte</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Centro de Ayuda</li>
                  <li>Contacto</li>
                  <li>Términos y Condiciones</li>
                  <li>Política de Privacidad</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p>&copy; 2024 Rent-Boats.com. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;