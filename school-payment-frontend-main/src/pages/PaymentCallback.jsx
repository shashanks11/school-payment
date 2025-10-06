import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader, ArrowRight } from 'lucide-react';
import api from '../services/api';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Processing your payment...');

  useEffect(() => {
    const collectRequestId = searchParams.get('EdvironCollectRequestId');
    const paymentStatus = searchParams.get('status');

    // Call backend webhook to update status
    const updatePaymentStatus = async () => {
      if (!collectRequestId) {
        setStatus('failed');
        setMessage('Invalid payment response');
        return;
      }

      try {
        // Simulate webhook call to update database
        await api.post('/webhooks', {
          status: 200,
          order_info: {
            order_id: collectRequestId,
            order_amount: 0, // Backend will handle this
            transaction_amount: 0,
            gateway: 'PhonePe',
            bank_reference: 'AUTO_' + Date.now(),
            status: paymentStatus?.toLowerCase() || 'pending',
            payment_mode: 'online',
            payemnt_details: 'Completed via payment gateway',
            Payment_message: paymentStatus === 'SUCCESS' ? 'Payment successful' : 'Payment failed',
            payment_time: new Date().toISOString(),
            error_message: paymentStatus === 'FAILED' ? 'Payment failed' : 'NA',
          },
        });

        // Update UI based on status
        if (paymentStatus === 'SUCCESS') {
          setStatus('success');
          setMessage('Payment completed successfully!');
        } else if (paymentStatus === 'FAILED') {
          setStatus('failed');
          setMessage('Payment failed. Please try again.');
        } else {
          setStatus('pending');
          setMessage('Payment status is pending.');
        }
      } catch (error) {
        console.error('Error updating payment status:', error);
        setStatus('failed');
        setMessage('Failed to update payment status');
      }
    };

    updatePaymentStatus();

    // Auto redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate('/transactions');
    }, 5000);

    return () => clearTimeout(timer);
  }, [searchParams, navigate]);

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return (
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={48} />
          </div>
        );
      case 'failed':
        return (
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="text-red-600" size={48} />
          </div>
        );
      default:
        return (
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader className="text-blue-600 animate-spin" size={48} />
          </div>
        );
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {getStatusIcon()}

        <h1 className={`text-3xl font-bold text-center mb-4 ${getStatusColor()}`}>
          {status === 'success' && 'Payment Successful!'}
          {status === 'failed' && 'Payment Failed'}
          {status === 'pending' && 'Processing Payment'}
          {status === 'processing' && 'Updating Status...'}
        </h1>

        <p className="text-gray-600 text-center mb-6">{message}</p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-mono font-semibold text-gray-900">
                {searchParams.get('EdvironCollectRequestId') || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`font-semibold ${getStatusColor()}`}>
                {searchParams.get('status') || 'UNKNOWN'}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/transactions')}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <span>View All Transactions</span>
            <ArrowRight size={18} />
          </button>

          <button
            onClick={() => navigate('/create-payment')}
            className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            Create New Payment
          </button>
        </div>

        <p className="text-sm text-gray-500 text-center mt-6">
          Redirecting to transactions in 5 seconds...
        </p>
      </div>
    </div>
  );
};

export default PaymentCallback;