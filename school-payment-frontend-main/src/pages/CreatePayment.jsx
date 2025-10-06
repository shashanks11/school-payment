import { useState } from 'react';
import Layout from '../components/Layout';
import { CreditCard, Loader, CheckCircle, ExternalLink } from 'lucide-react';
import api from '../services/api';

const CreatePayment = () => {
  const [formData, setFormData] = useState({
    school_id: '65b0e6293e9f76a9694d84b4',
    trustee_id: '65b0e552dd31950a9b41c5ba',
    amount: '',
    student_name: '',
    student_id: '',
    student_email: '',
    gateway_name: 'PhonePe',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentResult, setPaymentResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setPaymentResult(null);

    try {
      const payload = {
        school_id: formData.school_id,
        trustee_id: formData.trustee_id,
        amount: parseFloat(formData.amount),
        student_info: {
          name: formData.student_name,
          id: formData.student_id,
          email: formData.student_email,
        },
        gateway_name: formData.gateway_name,
      };

      const response = await api.post('/orders/create-payment', payload);
      setPaymentResult(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create payment');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      school_id: '65b0e6293e9f76a9694d84b4',
      trustee_id: '65b0e552dd31950a9b41c5ba',
      amount: '',
      student_name: '',
      student_id: '',
      student_email: '',
      gateway_name: 'PhonePe',
    });
    setPaymentResult(null);
    setError('');
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Payment</h1>
        <p className="text-gray-600 mb-8">Generate a new payment link for students</p>

        {paymentResult ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Link Created!</h2>
              <p className="text-gray-600">Share this link with the student to complete payment</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Order ID</p>
                <p className="font-mono text-sm font-semibold">{paymentResult.custom_order_id}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Collect Request ID</p>
                <p className="font-mono text-sm font-semibold">{paymentResult.collect_request_id}</p>
              </div>
              {paymentResult.payment_url && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Payment URL</p>
                  <a
                    href={paymentResult.payment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium break-all"
                  >
                    <span className="text-sm">Open Payment Page</span>
                    <ExternalLink size={16} />
                  </a>
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                onClick={resetForm}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Create Another Payment
              </button>
              <a
                href="/transactions"
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-center"
              >
                View Transactions
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School ID
                  </label>
                  <input
                    type="text"
                    name="school_id"
                    value={formData.school_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trustee ID
                  </label>
                  <input
                    type="text"
                    name="trustee_id"
                    value={formData.trustee_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="1000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                  min="1"
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student Name
                    </label>
                    <input
                      type="text"
                      name="student_name"
                      value={formData.student_name}
                      onChange={handleChange}
                      placeholder="Enter Your Name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Student ID
                      </label>
                      <input
                        type="text"
                        name="student_id"
                        value={formData.student_id}
                        onChange={handleChange}
                        placeholder="STU001"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Student Email
                      </label>
                      <input
                        type="email"
                        name="student_email"
                        value={formData.student_email}
                        onChange={handleChange}
                        placeholder="student@example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Gateway
                </label>
                <select
                  name="gateway_name"
                  value={formData.gateway_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="PhonePe">PhonePe</option>
                  <option value="Paytm">Paytm</option>
                  <option value="Razorpay">Razorpay</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    <span>Creating Payment...</span>
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    <span>Generate Payment Link</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CreatePayment;