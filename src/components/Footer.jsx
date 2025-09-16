import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-400 p-8 mt-auto">
            <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                    <p className="font-bold text-white mb-2">Rent-Boats</p>
                    <ul>
                        <li><Link to="/about" className="hover:text-white">Sobre nosotros</Link></li>
                        <li><Link to="/contact" className="hover:text-white">Contacto</Link></li>
                        <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
                    </ul>
                </div>
                <div>
                    <p className="font-bold text-white mb-2">Legal</p>
                    <ul>
                        <li><Link to="/terms" className="hover:text-white">Términos y Condiciones</Link></li>
                        <li><Link to="/privacy" className="hover:text-white">Política de Privacidad</Link></li>
                        <li><Link to="/cookies" className="hover:text-white">Política de Cookies</Link></li>
                    </ul>
                </div>
                <div>
                    <p className="font-bold text-white mb-2">Navegar</p>
                    <ul>
                        <li><Link to="/search" className="hover:text-white">Alquiler de barcos</Link></li>
                        <li><Link to="/destinations" className="hover:text-white">Destinos</Link></li>
                        <li><Link to="/flash-offers" className="hover:text-white">Ofertas Flash</Link></li>
                    </ul>
                </div>
                <div>
                    <p className="font-bold text-white mb-2">Social</p>
                </div>
            </div>
            <div className="text-center mt-8 border-t border-gray-800 pt-4">
                <p>&copy; {new Date().getFullYear()} Rent-Boats.com. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;