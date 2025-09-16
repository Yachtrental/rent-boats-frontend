import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal, MapPin, Users, Euro } from 'lucide-react';
import { Helmet } from 'react-helmet';
import Navigation from '@/components/Navigation';
import BoatCard from '@/components/BoatCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { allBoats } from '@/data/boats';

const SearchResults = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
    capacity: searchParams.get('guests') || '',
    category: '',
    location: searchParams.get('destination') || ''
  });
  const [sortBy, setSortBy] = useState('price');
  const [showFilters, setShowFilters] = useState(false);

  const [filteredBoats, setFilteredBoats] = useState([]);

  useEffect(() => {
    let filtered = allBoats.filter(boat => {
      const matchesPrice = boat.pricePerDay >= filters.priceRange[0] && boat.pricePerDay <= filters.priceRange[1];
      const matchesCapacity = !filters.capacity || boat.capacity >= parseInt(filters.capacity);
      const matchesCategory = !filters.category || boat.category === filters.category;
      const matchesLocation = !filters.location || boat.location.toLowerCase().includes(filters.location.toLowerCase());
      
      return matchesPrice && matchesCapacity && matchesCategory && matchesLocation;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.pricePerDay - b.pricePerDay;
        case 'price-desc':
          return b.pricePerDay - a.pricePerDay;
        case 'rating':
          return b.rating - a.rating;
        case 'capacity':
          return b.capacity - a.capacity;
        default:
          return 0;
      }
    });

    setFilteredBoats(filtered);
  }, [filters, sortBy]);

  const handleBoatSelect = (boat) => {
    navigate(`/boat/${boat.id}`);
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 5000],
      capacity: '',
      category: '',
      location: ''
    });
    toast({
      title: t('success'),
      description: 'Filtros limpiados correctamente'
    });
  };

  return (
    <>
      <Helmet>
        <title>Buscar Barcos - Rent-Boats.com | Alquiler en Baleares</title>
        <meta name="description" content="Encuentra el barco perfecto para tu aventura en las Baleares. Filtra por precio, capacidad y ubicación. Más de 500 embarcaciones disponibles." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Resultados de Búsqueda
              </h1>
              <p className="text-gray-600">
                {filteredBoats.length} barcos encontrados
                {filters.location && ` en ${filters.location}`}
              </p>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-80">
                <Card className="sticky top-24">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Filter className="h-5 w-5 mr-2" />
                      Filtros
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className="lg:hidden"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  
                  <CardContent className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-3 block">
                        <Euro className="h-4 w-4 inline mr-1" />
                        Precio por día: €{filters.priceRange[0]} - €{filters.priceRange[1]}
                      </label>
                      <Slider
                        value={filters.priceRange}
                        onValueChange={(value) => setFilters({...filters, priceRange: value})}
                        max={5000}
                        min={0}
                        step={50}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        <Users className="h-4 w-4 inline mr-1" />
                        Capacidad mínima
                      </label>
                      <Select value={filters.capacity} onValueChange={(value) => setFilters({...filters, capacity: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Cualquier capacidad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Cualquier capacidad</SelectItem>
                          <SelectItem value="4">4+ personas</SelectItem>
                          <SelectItem value="6">6+ personas</SelectItem>
                          <SelectItem value="8">8+ personas</SelectItem>
                          <SelectItem value="10">10+ personas</SelectItem>
                          <SelectItem value="12">12+ personas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Tipo de embarcación
                      </label>
                      <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Todos los tipos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Todos los tipos</SelectItem>
                          <SelectItem value="Lancha">Lancha</SelectItem>
                          <SelectItem value="Velero">Velero</SelectItem>
                          <SelectItem value="Yate">Yate</SelectItem>
                          <SelectItem value="Catamarán">Catamarán</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        <MapPin className="h-4 w-4 inline mr-1" />
                        Ubicación
                      </label>
                      <Select value={filters.location} onValueChange={(value) => setFilters({...filters, location: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Todas las ubicaciones" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Todas las ubicaciones</SelectItem>
                          <SelectItem value="Palma, Mallorca">Palma, Mallorca</SelectItem>
                          <SelectItem value="Ibiza Puerto">Ibiza Puerto</SelectItem>
                          <SelectItem value="Mahón, Menorca">Mahón, Menorca</SelectItem>
                          <SelectItem value="Formentera">Formentera</SelectItem>
                          <SelectItem value="Alcudia, Mallorca">Alcudia, Mallorca</SelectItem>
                          <SelectItem value="San Antonio, Ibiza">San Antonio, Ibiza</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      variant="outline" 
                      onClick={clearFilters}
                      className="w-full"
                    >
                      Limpiar Filtros
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-600">
                    Mostrando {filteredBoats.length} resultados
                  </p>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price">Precio: menor a mayor</SelectItem>
                      <SelectItem value="price-desc">Precio: mayor a menor</SelectItem>
                      <SelectItem value="rating">Mejor valorados</SelectItem>
                      <SelectItem value="capacity">Mayor capacidad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {filteredBoats.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredBoats.map((boat, index) => (
                      <motion.div
                        key={boat.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <BoatCard boat={boat} onSelect={handleBoatSelect} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="text-gray-400 mb-4">
                      <MapPin className="h-16 w-16 mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No se encontraron barcos
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Intenta ajustar tus filtros para encontrar más opciones
                    </p>
                    <Button onClick={clearFilters}>
                      Limpiar Filtros
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchResults;