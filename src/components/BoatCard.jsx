import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Anchor, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const BoatCard = ({ boat, onSelect }) => {
  const { t } = useLanguage();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="boat-card overflow-hidden cursor-pointer" onClick={() => onSelect(boat)}>
        <div className="relative">
          <img  
            alt={`${boat.name} - Barco de alquiler en ${boat.location}`}
            className="w-full h-48 object-cover"
           src="https://images.unsplash.com/photo-1454985471578-83a008ed7f88" />
          <div className="absolute top-4 left-4">
            <Badge className="bg-blue-600 text-white">
              {boat.category}
            </Badge>
          </div>
          <div className="absolute top-4 right-4">
            <div className="flex items-center bg-white/90 rounded-full px-2 py-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium ml-1">{boat.rating}</span>
            </div>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{boat.name}</h3>
              <div className="flex items-center text-gray-600 text-sm mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {boat.location}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {boat.capacity} personas
              </div>
              <div className="flex items-center">
                <Anchor className="h-4 w-4 mr-1" />
                {boat.length}m
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-blue-600">€{boat.pricePerDay}</span>
                <span className="text-gray-600 text-sm ml-1">{t('pricePerDay')}</span>
              </div>
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(boat);
                }}
              >
                {t('view')}
              </Button>
            </div>

            {boat.extras && boat.extras.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {boat.extras.slice(0, 3).map((extra, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {extra}
                  </Badge>
                ))}
                {boat.extras.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{boat.extras.length - 3} más
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BoatCard;