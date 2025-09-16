import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Anchor, Menu, X, Globe, User, LogOut, Ship } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    t,
    language,
    changeLanguage
  } = useLanguage();
  const {
    user,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: t('success'),
      description: 'Sesión cerrada correctamente'
    });
  };
  const languages = [{
    code: 'es',
    name: 'Español'
  }, {
    code: 'en',
    name: 'English'
  }, {
    code: 'de',
    name: 'Deutsch'
  }, {
    code: 'it',
    name: 'Italiano'
  }, {
    code: 'zh',
    name: '中文'
  }];
  return <nav className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div whileHover={{
            rotate: 15
          }} className="text-white">
              <Anchor className="h-8 w-8" />
            </motion.div>
            <span className="text-xl font-bold text-white">Rent&Boats</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-white hover:text-blue-200 transition-colors">
              {t('home')}
            </Link>
            <Link to="/search" className="text-white hover:text-blue-200 transition-colors">
              {t('search')}
            </Link>
            <Link to="/captains" className="text-white hover:text-blue-200 transition-colors">
              {t('captains')}
            </Link>
            {user && <Link to="/dashboard" className="text-white hover:text-blue-200 transition-colors">
                {t('dashboard')}
              </Link>}

            {/* Language Selector */}
            <div className="relative group">
              <Button variant="ghost" size="sm" className="text-white hover:text-blue-200">
                <Globe className="h-4 w-4 mr-1" />
                {language.toUpperCase()}
              </Button>
              <div className="absolute top-full right-0 mt-1 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {languages.map(lang => <button key={lang.code} onClick={() => changeLanguage(lang.code)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md">
                    {lang.name}
                  </button>)}
              </div>
            </div>

            {/* User Menu */}
            {user ? <div className="relative group">
                <Button variant="ghost" size="sm" className="text-white hover:text-blue-200">
                  <User className="h-4 w-4 mr-1" />
                  {user.name}
                </Button>
                <div className="absolute top-full right-0 mt-1 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-md">
                    {t('dashboard')}
                  </Link>
                  <button onClick={handleLogout} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-md">
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('logout')}
                  </button>
                </div>
              </div> : <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-white hover:text-blue-200">
                    {t('login')}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-white text-blue-600 hover:bg-blue-50">
                    {t('register')}
                  </Button>
                </Link>
              </div>}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && <motion.div initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: -20
      }} className="md:hidden bg-white rounded-lg mt-2 shadow-lg">
            <div className="px-4 py-2 space-y-2">
              <Link to="/" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
                {t('home')}
              </Link>
              <Link to="/search" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
                {t('search')}
              </Link>
              <Link to="/captains" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
                {t('captains')}
              </Link>
              {user ? <>
                  <Link to="/dashboard" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
                    {t('dashboard')}
                  </Link>
                  <button onClick={() => {
              handleLogout();
              setIsMenuOpen(false);
            }} className="block w-full text-left py-2 text-gray-700 hover:text-blue-600">
                    {t('logout')}
                  </button>
                </> : <>
                  <Link to="/login" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
                    {t('login')}
                  </Link>
                  <Link to="/register" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>
                    {t('register')}
                  </Link>
                </>}
            </div>
          </motion.div>}
      </div>
    </nav>;
};
export default Navigation;