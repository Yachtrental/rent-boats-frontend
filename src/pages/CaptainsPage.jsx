import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Award, Languages } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { allCaptains } from '@/data/captains';
import { useToast } from '@/components/ui/use-toast';

const CaptainsPage = () => {
    const { t } = useLanguage();
    const { toast } = useToast();

    return (
        <>
            <Helmet>
                <title>Nuestros Patrones - Rent-Boats.com</title>
                <meta name="description" content="Conoce a nuestros patrones profesionales y experimentados en las Islas Baleares. Elige el capitán perfecto para tu aventura náutica." />
            </Helmet>

            <div className="min-h-screen bg-gray-50">
                <Navigation />
                
                <div className="pt-20 pb-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-16"
                        >
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                Conoce a Nuestros Patrones
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Profesionales experimentados que harán de tu viaje una experiencia segura e inolvidable.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {allCaptains.map((captain, index) => (
                                <motion.div
                                    key={captain.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Card className="h-full flex flex-col boat-card">
                                        <CardHeader className="text-center">
                                            <div className="w-24 h-24 rounded-full mx-auto overflow-hidden border-4 border-white shadow-lg">
                                                <img  alt={`Foto de perfil de ${captain.name}`} src="https://images.unsplash.com/photo-1634475388370-b020e7135c23" />
                                            </div>
                                            <CardTitle className="mt-4">{captain.name}</CardTitle>
                                            <CardDescription className="flex items-center justify-center">
                                                <MapPin className="h-4 w-4 mr-1"/>
                                                {captain.location}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex-grow flex flex-col">
                                            <div className="flex justify-around items-center text-sm text-gray-700 border-t border-b py-3 mb-4">
                                                <div className="text-center">
                                                    <div className="font-bold">{captain.rating}</div>
                                                    <Star className="h-4 w-4 text-yellow-500 fill-current mx-auto"/>
                                                </div>
                                                <div className="text-center">
                                                    <div className="font-bold">{captain.experience}</div>
                                                    <p className="text-xs">Experiencia</p>
                                                </div>
                                            </div>

                                            <p className="text-gray-600 text-sm mb-4 flex-grow">{captain.bio}</p>
                                            
                                            <div className="space-y-3 mb-4">
                                                <div>
                                                    <h4 className="font-semibold text-sm mb-1 flex items-center"><Award className="h-4 w-4 mr-2 text-blue-600"/>Especialidades</h4>
                                                    <div className="flex flex-wrap gap-1">
                                                        {captain.specialties.map(spec => (
                                                            <Badge key={spec} variant="secondary">{spec}</Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-sm mb-1 flex items-center"><Languages className="h-4 w-4 mr-2 text-blue-600"/>Idiomas</h4>
                                                    <p className="text-sm text-gray-700">{captain.languages.join(', ')}</p>
                                                </div>
                                            </div>
                                            
                                            <Button 
                                                className="w-full mt-auto bg-blue-600 hover:bg-blue-700"
                                                onClick={() => toast({ title: t('featureNotImplemented') })}
                                            >
                                                Contactar con {captain.name.split(' ')[0]}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CaptainsPage;