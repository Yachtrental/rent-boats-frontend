import React from 'react';
import { motion } from 'framer-motion';
import { Users, Euro, Award, TrendingUp, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const CollaboratorDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Mock data for collaborator
  const collaboratorData = {
    referrals: 8,
    activeReferrals: 5,
    totalCommissions: 1250,
    monthlyCommissions: 320,
    commissionRate: 7, // 5-10% escalated
    ranking: 3,
    level: 'Gold'
  };

  const referralLink = `https://rent-boats.com/ref/${user.id}`;

  const recentCommissions = [
    {
      id: '1',
      referralName: 'Marina Boats Mallorca',
      bookingId: 'RB-2024-001',
      amount: 45,
      date: '2024-02-10',
      status: 'paid'
    },
    {
      id: '2',
      referralName: 'Ibiza Yacht Charter',
      bookingId: 'RB-2024-002',
      amount: 60,
      date: '2024-02-08',
      status: 'pending'
    }
  ];

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: 'Enlace copiado',
      description: 'El enlace de referido se ha copiado al portapapeles'
    });
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Panel del Colaborador
        </h1>
        <p className="text-gray-600">
          Gestiona tus referidos y maximiza tus comisiones
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Referidos Totales</p>
                  <p className="text-2xl font-bold text-gray-900">{collaboratorData.referrals}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Referidos Activos</p>
                  <p className="text-2xl font-bold text-gray-900">{collaboratorData.activeReferrals}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Euro className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Comisiones Totales</p>
                  <p className="text-2xl font-bold text-gray-900">€{collaboratorData.totalCommissions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Award className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ranking</p>
                  <p className="text-2xl font-bold text-gray-900">#{collaboratorData.ranking}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Referral Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Tu Enlace de Referido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex-1 p-3 bg-gray-50 rounded-lg font-mono text-sm">
                {referralLink}
              </div>
              <Button onClick={copyReferralLink}>
                <LinkIcon className="h-4 w-4 mr-2" />
                Copiar
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Comparte este enlace para invitar nuevos armadores y ganar comisiones del {collaboratorData.commissionRate}%
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Commission Level */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Nivel de Comisión</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <Badge className="bg-yellow-100 text-yellow-800 text-lg px-3 py-1">
                  Nivel {collaboratorData.level}
                </Badge>
                <p className="text-sm text-gray-600 mt-1">
                  Comisión actual: {collaboratorData.commissionRate}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">€{collaboratorData.monthlyCommissions}</p>
                <p className="text-sm text-gray-600">Este mes</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Bronze (5%)</span>
                <span className="text-green-600">✓ Completado</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Silver (6%)</span>
                <span className="text-green-600">✓ Completado</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                <span className="font-medium">Gold (7%)</span>
                <span className="text-yellow-600">● Actual</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Platinum (8%)</span>
                <span className="text-gray-500">2 referidos más</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Diamond (10%)</span>
                <span className="text-gray-500">5 referidos más</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Commissions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Comisiones Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCommissions.map((commission) => (
                <div key={commission.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{commission.referralName}</h3>
                    <p className="text-sm text-gray-600">Reserva: {commission.bookingId}</p>
                    <p className="text-sm text-gray-600">{new Date(commission.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">€{commission.amount}</p>
                    <Badge className={commission.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {commission.status === 'paid' ? 'Pagado' : 'Pendiente'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Monthly Ranking */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Ranking Mensual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { position: 1, name: 'Ana Martínez', referrals: 12, commissions: 890 },
                { position: 2, name: 'Carlos López', referrals: 10, commissions: 750 },
                { position: 3, name: user.name, referrals: collaboratorData.activeReferrals, commissions: collaboratorData.monthlyCommissions, isUser: true },
                { position: 4, name: 'Laura García', referrals: 4, commissions: 280 },
                { position: 5, name: 'Miguel Ruiz', referrals: 3, commissions: 210 }
              ].map((collaborator) => (
                <div 
                  key={collaborator.position} 
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    collaborator.isUser ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      collaborator.position === 1 ? 'bg-yellow-500 text-white' :
                      collaborator.position === 2 ? 'bg-gray-400 text-white' :
                      collaborator.position === 3 ? 'bg-orange-500 text-white' :
                      'bg-gray-200 text-gray-700'
                    }`}>
                      {collaborator.position}
                    </div>
                    <div className="ml-3">
                      <p className={`font-medium ${collaborator.isUser ? 'text-blue-900' : 'text-gray-900'}`}>
                        {collaborator.name} {collaborator.isUser && '(Tú)'}
                      </p>
                      <p className="text-sm text-gray-600">{collaborator.referrals} referidos activos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">€{collaborator.commissions}</p>
                    <p className="text-sm text-gray-600">este mes</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CollaboratorDashboard;