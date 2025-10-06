import { useState } from 'react';
import Layout from '../components/Layout';
import { Search, Loader, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { format } from 'date-fns';

const TransactionStatus = () => {
  const [collectId, setCollectId] = useState(''); // Changed from orderId to collectId
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transaction, setTransaction] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTransaction(null);

    try {
      // FIXED: Use collectId state variable instead of undefined collect_id
      const response = await api.get(`/transactions/status/${collectId}`);
      setTransaction(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Transaction not found');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
        return <CheckCircle className="text-green-600" size={48} />;
      case 'failed':
        return <XCircle className="text-red-600" size={48} />;
      case 'pending':
        return <Clock className="text-yellow-600" size={48} />;
      default:
        return <AlertCircle className="text-gray-600" size={48} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'dd MMM yyyy, hh:mm a');
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Check Transaction Status</h1>
        <p className="text-gray-600 mb-8">Enter collect ID to check payment status</p>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Collect ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={collectId}
                  onChange={(e) => setCollectId(e.target.value)}
                  placeholder="Enter Collect ID (e.g., 6808bc4888e4e3c149e757f1)"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
                <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search size={20} />
                  <span>Check Status</span>
                </>
              )}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 flex items-start">
            <AlertCircle className="mr-2 flex-shrink-0 mt-0.5" size={20} />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {transaction && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                {getStatusIcon(transaction.status)}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Transaction Details</h2>
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(transaction.status)}`}>
                {transaction.status?.toUpperCase() || 'PENDING'}
              </span>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Collect ID</p>
                  <p className="font-mono text-sm font-semibold break-all">
                    {transaction.collect_id || 'N/A'}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Custom Order ID</p>
                  <p className="font-mono text-sm font-semibold break-all">
                    {transaction.custom_order_id || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600 mb-1">Order Amount</p>
                  <p className="text-2xl font-bold text-blue-900">₹{transaction.order_amount || 0}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-600 mb-1">Transaction Amount</p>
                  <p className="text-2xl font-bold text-purple-900">₹{transaction.transaction_amount || 0}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Gateway</p>
                  <p className="text-lg font-semibold text-gray-900">{transaction.gateway_name || 'N/A'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">School ID</p>
                  <p className="font-mono text-sm font-semibold break-all">{transaction.school_id || 'N/A'}</p>
                </div>
              </div>

              {transaction.student_info && (
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                  <p className="text-sm font-semibold text-indigo-900 mb-3">Student Information</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-indigo-600">Name:</span>
                      <span className="font-semibold text-indigo-900">{transaction.student_info.name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-indigo-600">ID:</span>
                      <span className="font-semibold text-indigo-900">{transaction.student_info.id || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-indigo-600">Email:</span>
                      <span className="font-semibold text-indigo-900 break-all">{transaction.student_info.email || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}

              {transaction.payment_mode && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Payment Mode</p>
                    <p className="font-semibold text-gray-900 uppercase">{transaction.payment_mode}</p>
                  </div>
                  {transaction.bank_reference && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Bank Reference</p>
                      <p className="font-mono text-sm font-semibold break-all">{transaction.bank_reference}</p>
                    </div>
                  )}
                </div>
              )}

              {transaction.payment_details && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Payment Details</p>
                  <p className="font-semibold text-gray-900">{transaction.payment_details}</p>
                </div>
              )}

              {transaction.payment_time && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Payment Time</p>
                  <p className="font-semibold text-gray-900">{formatDate(transaction.payment_time)}</p>
                </div>
              )}

              {transaction.payment_message && (
                <div className={`p-4 rounded-lg ${
                  transaction.status?.toLowerCase() === 'success' 
                    ? 'bg-green-50 border border-green-100' 
                    : 'bg-blue-50 border border-blue-100'
                }`}>
                  <p className={`text-sm mb-1 ${
                    transaction.status?.toLowerCase() === 'success' 
                      ? 'text-green-600' 
                      : 'text-blue-600'
                  }`}>Message</p>
                  <p className={`font-semibold ${
                    transaction.status?.toLowerCase() === 'success' 
                      ? 'text-green-900' 
                      : 'text-blue-900'
                  }`}>{transaction.payment_message}</p>
                </div>
              )}

              {transaction.error_message && transaction.error_message !== 'NA' && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                  <p className="text-sm text-red-600 mb-1">Error Message</p>
                  <p className="font-semibold text-red-900">{transaction.error_message}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TransactionStatus;