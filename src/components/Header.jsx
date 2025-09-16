import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { Ship, LogIn, UserPlus } from 'lucide-react';

const Header = () => {
    const { toast } = useToast();

    const handleAction = (featureName) => {
        toast({
            title: `${featureName} no implementado`,
            description: "🚧 ¡Esta función aún no está implementada, pero no te preocupes! ¡Puedes solicitarla en tu próximo mensaje! 🚀",
        });
    };

    return (
        <header className="bg-gray-900/80 backdrop-blur-sm text-white p-4 sticky top-0 z-50">
            <nav className="container mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-400">
                    <Ship className="h-6 w-6" />
                    <span>Rent-Boats</span>
                </Link>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => handleAction('Ser armador')}>Ser armador</Button>
                    <Link to="/login">
                        <Button variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white">
                            <LogIn className="mr-2 h-4 w-4" /> Iniciar sesión
                        </Button>
                    </Link>
                     <Link to="/register">
                        <Button className="bg-blue-500 hover:bg-blue-600">
                           <UserPlus className="mr-2 h-4 w-4" /> Registrarse
                        </Button>
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Header;