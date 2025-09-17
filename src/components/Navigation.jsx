import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Anchor, Menu, X, Globe, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, language, changeLanguage } = useLanguage();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const languages = [
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const RoleBadge = () =>
    isAuthenticated ? (
      <span className="px-2 py-1 text-xs rounded bg-blue-500/20 text-blue-200 border border-blue-400/30 capitalize">
        {user?.role ?? 'cliente'}
      </span>
    ) : null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div whileHover={{ rotate: 15 }} className="text-white">
              <Anchor className="h-7 w-7" />
            </motion.div>
            <span className="text-lg sm:text-xl font-bold text-white">Rent-Boats</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-white/90 hover:text-white transition-colors">{t('home') ?? 'Inicio'}</Link>
            <Link to="/search" className="text-white/90 hover:text-white transition-colors">{t('search') ?? 'Buscar'}</Link>
            <Link to="/captains" className="text-white/90 hover:text-white transition-colors">{t('captains') ?? 'Patrones'}</Link>

            {/* Idiomas */}
            <div className="relative group">
              <Button variant="ghost" size="sm" className="text-white/90 hover:text-white">
                <Globe className="h-4 w-4 mr-1" />
                {language?.toUpperCase?.() ?? 'ES'}
              </Button>
              <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute top-full right-0 mt-1 bg-white rounded-md shadow-lg transition-all duration-200">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-md last:rounded-b-md"
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Usuario */}
            {isAuthenticated ? (
              <>
                <RoleBadge />
                <Link to="/dashboard" className="text-white/90 hover:text-white transition-colors">
                  {t('dashboard') ?? 'Panel'}
                </Link>
                <Button variant="ghost" size="sm" className="text-white/90 hover:text-white" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-1" /> {t('logout') ?? 'Salir'}
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-white/90 hover:text-white">
                    {t('login') ?? 'Entrar'}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-white text-blue-600 hover:bg-blue-50">
                    {t('register') ?? 'Registrarse'}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Móvil: botón */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Móvil: menú */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block py-2 text-white/90 hover:text-white">{t('home') ?? 'Inicio'}</Link>
            <Link to="/search" onClick={() => setIsMenuOpen(false)} className="block py-2 text-white/90 hover:text-white">{t('search') ?? 'Buscar'}</Link>
            <Link to="/captains" onClick={() => setIsMenuOpen(false)} className="block py-2 text-white/90 hover:text-white">{t('captains') ?? 'Patrones'}</Link>

            {isAuthenticated ? (
              <>
                <RoleBadge />
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block py-2 text-white/90 hover:text-white">
                  {t('dashboard') ?? 'Panel'}
                </Link>
                <button onClick={handleLogout} className="block py-2 text-left text-white/90 hover:text-white">
                  <LogOut className="inline h-4 w-4 mr-1" /> {t('logout') ?? 'Salir'}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block py-2 text-white/90 hover:text-white">
                  {t('login') ?? 'Entrar'}
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block py-2 text-white/90 hover:text-white">
                  {t('register') ?? 'Registrarse'}
                </Link>
              </>
            )}

            <div className="pt-2 border-t border-white/10">
              <div className="flex gap-2 flex-wrap">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`px-2 py-1 rounded text-sm ${
                      language === lang.code ? 'bg-white text-blue-600' : 'bg-white/10 text-white'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
