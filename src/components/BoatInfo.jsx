import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Anchor, Star, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const BoatInfo = ({ boat }) => {
  const { toast } = useToast();
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{boat.name}</CardTitle>
              <div className="flex items-center text-gray-600 mt-2">
                <MapPin className="h-4 w-4 mr-1" />
                {boat.location}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="font-semibold ml-1">{boat.rating}</span>
                <span className="text-gray-600 ml-1">({boat.reviews} reseñas)</span>
              </div>
              <Badge className="mt-2">{boat.category}</Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <p className="text-gray-700">{boat.description}</p>

          {/* Specifications */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Users className="h-6 w-6 mx-auto text-blue-600 mb-2" />
              <div className="font-semibold">{boat.capacity}</div>
              <div className="text-sm text-gray-600">Personas</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Anchor className="h-6 w-6 mx-auto text-blue-600 mb-2" />
              <div className="font-semibold">{boat.length}m</div>
              <div className="text-sm text-gray-600">Eslora</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="font-semibold">{boat.engine}</div>
              <div className="text-sm text-gray-600">Motor</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="font-semibold">{boat.year}</div>
              <div className="text-sm text-gray-600">Año</div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Características</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {boat.features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <Shield className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Owner Info */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-3">Propietario</h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{boat.owner.name}</div>
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                  {boat.owner.rating} • {boat.owner.boats} barcos • Responde en {boat.owner.responseTime}
                </div>
              </div>
              <Button 
                variant="outline"
                onClick={() => toast({
                  title: t('featureNotImplemented')
                })}
              >
                Contactar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BoatInfo;