import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { 
  Search, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  Copy,
  Check,
  ArrowUpDown
} from 'lucide-react';
import api from '../services/api';
import { format } from 'date-fns';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Copy state
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, [page, limit, statusFilter, sortBy, sortOrder, startDate, endDate]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        sort: sortBy,
        order: sortOrder,
      };

      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const response = await api.get('/transactions', { params });
      setTransactions(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchTransactions();
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status) => {
    const styles = {
      success: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return styles[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'dd/MM/yyyy, h:mm a');
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <Layout>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Transaction History</h1>
            <p className="text-gray-600">View and manage all payment transactions</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={fetchTransactions}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <Download size={18} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Order ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search by Order ID..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">All Status</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Rows per page */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rows per page
              </label>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>

          {/* Date Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Apply Filters
            </button>
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('');
                setStartDate('');
                setEndDate('');
                setPage(1);
              }}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Table */}
<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
  <style>{`
    tbody tr {
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    tbody tr:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      z-index: 10;
    }
  `}</style>
  {loading ? (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  ) : transactions.length === 0 ? (
    <div className="text-center py-12">
      <p className="text-gray-500">No transactions found</p>
    </div>
  ) : (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase whitespace-nowrap">
                Sr.No
              </th>
              <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase whitespace-nowrap">
                Institute
              </th>
              <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase whitespace-nowrap">
                <button 
                  onClick={() => handleSort('createdAt')}
                  className="flex items-center space-x-1 hover:text-gray-700"
                >
                  <span>Date & Time</span>
                  <ArrowUpDown size={12} />
                </button>
              </th>
              <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase whitespace-nowrap">
                Order ID
              </th>
              <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase whitespace-nowrap">
                Edviron ID
              </th>
              <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase whitespace-nowrap">
                Order Amt
              </th>
              <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase whitespace-nowrap hidden lg:table-cell">
                Transaction Amt
              </th>
              <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase whitespace-nowrap hidden xl:table-cell">
                Payment Method
              </th>
              <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase whitespace-nowrap">
                Status
              </th>
              <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase whitespace-nowrap">
                Student Name
              </th>
              <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase whitespace-nowrap hidden lg:table-cell">
                Student ID
              </th>
              <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase whitespace-nowrap hidden xl:table-cell">
                Phone No.
              </th>
              <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase whitespace-nowrap hidden 2xl:table-cell">
                Vendor Amount
              </th>
              <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase whitespace-nowrap hidden 2xl:table-cell">
                Gateway
              </th>
              <th className="px-2 py-2 text-left text-[10px] font-medium text-gray-500 uppercase whitespace-nowrap hidden 2xl:table-cell">
                Capture Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction, index) => (
              <tr 
                key={transaction._id}
                className="hover:bg-gray-50 transition-all duration-200 cursor-pointer"
              >
                <td className="px-2 py-2 whitespace-nowrap text-[11px] text-gray-900">
                  {(page - 1) * limit + index + 1}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-[11px] text-blue-600 font-medium">
                  EDV DEMO SCHOOL
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-[11px] text-gray-900">
                  {formatDate(transaction.createdAt)}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-[11px]">
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-900">N/A</span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Copy size={12} />
                    </button>
                  </div>
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-[11px]">
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-900 font-mono">
                      {transaction.collect_id ? transaction.collect_id.substring(0, 15) + '...' : 'N/A'}
                    </span>
                    {transaction.collect_id && (
                      <button
                        onClick={() => copyToClipboard(transaction.collect_id, `collect-${transaction._id}`)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {copiedId === `collect-${transaction._id}` ? (
                          <Check size={12} className="text-green-500" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-[11px] text-gray-900 font-semibold">
                  ₹{transaction.order_amount || 0}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-[11px] text-gray-900 font-semibold hidden lg:table-cell">
                  ₹{transaction.order_amount || 0}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-[11px] text-gray-600 hidden xl:table-cell">
                  NA
                </td>
                <td className="px-2 py-2 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-[10px] font-semibold rounded ${getStatusBadge(transaction.status)}`}>
                    {transaction.status ? transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1) : 'Pending'}
                  </span>
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-[11px] text-gray-900">
                  {transaction.student_info?.name || 'test name'}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-[11px] text-gray-900 hidden lg:table-cell">
                  {transaction.student_info?.id || 's123456'}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-[11px] text-gray-900 hidden xl:table-cell">
                  0000000000
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-[11px] text-gray-600 hidden 2xl:table-cell">
                  NA
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-[11px] text-gray-600 hidden 2xl:table-cell">
                  NA
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-[11px] text-gray-600 hidden 2xl:table-cell">
                  NA
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination - unchanged */}
      <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
        <div className="text-sm text-gray-700">
          Showing {(page - 1) * limit + 1} to {Math.min(page * limit, pagination.total)} of {pagination.total} results
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="px-4 py-2 text-sm text-gray-700">
            Page {page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.totalPages}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </>
  )}
</div>
      </div>
    </Layout>
  );
};

export default Transactions;