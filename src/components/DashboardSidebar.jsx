import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Anchor, 
  Euro, 
  Users, 
  User, 
  BarChart3,
  Ship,
  Award
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const DashboardSidebar = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  const getMenuItems = () => {
    const baseItems = [
      { path: '/dashboard', icon: BarChart3, label: 'Resumen', roles: ['customer', 'owner', 'captain', 'collaborator'] },
      { path: '/dashboard/bookings', icon: Calendar, label: t('myBookings'), roles: ['customer', 'owner', 'captain'] },
    ];

    const roleSpecificItems = {
      owner: [
        { path: '/dashboard/boats', icon: Anchor, label: t('myBoats') },
        { path: '/dashboard/earnings', icon: Euro, label: t('earnings') },
        { path: '/dashboard/referrals', icon: Users, label: t('referrals') }
      ],
      captain: [
        { path: '/dashboard/assignments', icon: Ship, label: 'Asignaciones' }
      ],
      collaborator: [
        { path: '/dashboard/commissions', icon: Euro, label: 'Comisiones' },
        { path: '/dashboard/ranking', icon: Award, label: 'Ranking' }
      ]
    };

    const items = [...baseItems];
    if (roleSpecificItems[user.role]) {
      items.push(...roleSpecificItems[user.role].map(item => ({
        ...item,
        roles: [user.role]
      })));
    }

    items.push({ path: '/dashboard/profile', icon: User, label: 'Perfil', roles: ['customer', 'owner', 'captain', 'collaborator'] });

    return items.filter(item => item.roles.includes(user.role));
  };

  const menuItems = getMenuItems();

  return (
    <div className="fixed left-0 top-16 h-full w-64 bg-white shadow-lg border-r border-gray-200 z-40">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Panel de Control</h2>
          <p className="text-sm text-gray-600 capitalize">{user.role}</p>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 w-1 h-8 bg-blue-600 rounded-r"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default DashboardSidebar;