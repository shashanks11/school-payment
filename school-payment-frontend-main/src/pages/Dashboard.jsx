import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Receipt, TrendingUp, Clock, CheckCircle, Plus, Search } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    pending: 0,
    cancelled: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/transactions?limit=1000');
      const transactions = response.data.data;

      const stats = {
        total: transactions.length,
        success: transactions.filter(t => t.status === 'success').length,
        pending: transactions.filter(t => t.status === 'pending').length,
        cancelled: transactions.filter(t => t.status === 'cancelled').length,
      };

      setStats(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Transactions',
      value: stats.total,
      icon: Receipt,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Successful',
      value: stats.success,
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Failed',
      value: stats.cancelled,
      icon: TrendingUp,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600 mb-8">Welcome back! Here's your overview.</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={stat.textColor} size={24} />
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/transactions"
              className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition text-center"
            >
              <Receipt className="mx-auto mb-2 text-blue-600" size={32} />
              <p className="font-medium text-gray-900">View Transactions</p>
              <p className="text-sm text-gray-500 mt-1">See all payment history</p>
            </a>
            <a
              href="/create-payment"
              className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition text-center"
            >
              <Plus className="mx-auto mb-2 text-green-600" size={32} />
              <p className="font-medium text-gray-900">Create Payment</p>
              <p className="text-sm text-gray-500 mt-1">Generate new payment link</p>
            </a>
            <a
              href="/transaction-status"
              className="p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition text-center"
            >
              <Search className="mx-auto mb-2 text-purple-600" size={32} />
              <p className="font-medium text-gray-900">Check Status</p>
              <p className="text-sm text-gray-500 mt-1">Track payment status</p>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;