// AdminDashboard.jsx - Corregido para coincidir con el esquema real
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, testAdminAccess } from '@/lib/customSupabaseClient';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Users, Ship, Calendar, CreditCard, BarChart2, Check, X, Edit2, Eye, EyeOff, Search, AlertCircle } from 'lucide-react';

// Test admin access function call
const testAdminOnLoad = async () => {
  try {
    console.log('🔍 Testing admin access...');
    const result = await testAdminAccess();
    console.log('✅ Admin access test completed:', result);
    
    if (result.success) {
      console.log('🔑 Admin access verified:', result.data);
    } else {
      console.error('❌ Admin access failed:', result.error);
    }
  } catch (error) {
    console.error('🚨 Error testing admin access:', error);
  }
};

// En AdminDashboard.jsx o después del login
useEffect(() => {
  testAuthenticatedAdmin();
}, []);

// Componente de métricas del dashboard
const DashboardMetrics = () => {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalBoats: 0,
    totalReservations: 0,
    totalPayments: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      console.log('🔄 Cargando métricas del dashboard...');
      // Consultas con el esquema real
      const [usersResult, boatsResult, reservationsResult, paymentsResult] = await Promise.all([
        supabase.from('perfiles').select('id, role', { count: 'exact' }).catch(err => {
          console.error('Error en consulta perfiles:', err);
          return { count: 0, data: [] };
        }),
        supabase.from('barcos').select('id, disponible', { count: 'exact' }).catch(err => {
          console.error('Error en consulta barcos:', err);
          return { count: 0, data: [] };
        }),
        supabase.from('reservas').select('id, estado', { count: 'exact' }).catch(err => {
          console.error('Error en consulta reservas:', err);
          return { count: 0, data: [] };
        }),
        supabase.from('pagos').select('id', { count: 'exact' }).catch(err => {
          console.error('Error en consulta pagos:', err);
          return { count: 0, data: [] };
        })
      ]);
      
      const totalUsers = usersResult.count || 0;
      const totalBoats = boatsResult.count || 0;
      const totalReservations = reservationsResult.count || 0;
      const totalPayments = paymentsResult.count || 0;

      setMetrics({
        totalUsers,
        totalBoats,
        totalReservations,
        totalPayments,
        loading: false,
        error: null
      });
      
      console.log('✅ Métricas cargadas:', { totalUsers, totalBoats, totalReservations, totalPayments });
    } catch (error) {
      console.error('❌ Error cargando métricas:', error);
      setMetrics(prev => ({
        ...prev,
        loading: false,
        error: 'Error cargando datos del dashboard'
      }));
    }
  };

  const MetricCard = ({ title, value, icon }) => (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold">
            {metrics.loading ? '...' : metrics.error ? '!' : value}
          </p>
        </div>
        <div className="p-3 rounded-full bg-gray-50">
          {icon}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard de Administración</h2>
        <Button onClick={fetchMetrics} size="sm" variant="outline">
          🔄 Actualizar
        </Button>
      </div>
      
      {metrics.error && (
        <Card className="p-4 bg-red-50 border border-red-200">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <p className="text-red-700">{metrics.error}</p>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Usuarios"
          value={metrics.totalUsers}
          icon={<Users className="h-6 w-6 text-blue-600" />}
        />
        <MetricCard
          title="Embarcaciones"
          value={metrics.totalBoats}
          icon={<Ship className="h-6 w-6 text-green-600" />}
        />
        <MetricCard
          title="Reservas"
          value={metrics.totalReservations}
          icon={<Calendar className="h-6 w-6 text-purple-600" />}
        />
        <MetricCard
          title="Pagos"
          value={metrics.totalPayments}
          icon={<CreditCard className="h-6 w-6 text-orange-600" />}
        />
      </div>
    </div>
  );
};

// Main AdminDashboard component
const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Test admin access when component loads
  useEffect(() => {
    testAdminOnLoad();
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Acceso Restringido</h2>
          <p className="text-gray-600">Necesitas iniciar sesión para acceder al panel de administración.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-600 mt-2">Gestiona usuarios, embarcaciones y configuraciones del sistema</p>
        </div>

        <nav className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            📊 Resumen
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            👥 Usuarios
          </button>
          <button
            onClick={() => setActiveTab('boats')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'boats'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            🚤 Embarcaciones
          </button>
        </nav>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6">
            {activeTab === 'overview' && <DashboardMetrics />}
            {activeTab === 'users' && <div>User Management Component Here</div>}
            {activeTab === 'boats' && <div>Boat Management Component Here</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
