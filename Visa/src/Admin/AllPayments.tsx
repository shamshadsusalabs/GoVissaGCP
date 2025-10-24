import React, { useState, useEffect } from 'react';
import { FiSearch, FiDownload, FiEye, FiCreditCard, FiDollarSign } from 'react-icons/fi';

interface PaymentOrder {
  _id: string;
  orderId: string;
  paymentId?: string;
  amount: string;
  currency: string;
  status: string;
  receipt?: string;
  signature?: string;
  visaId?: string;
  country?: string;
  email?: string;
  phone?: string;
  selectedDate?: Date;
  travellers?: number;
  travellerDetails?: {
    adults: number;
    children: number;
    infants: number;
    total: number;
  };
  paymentType: string;
  paymentMethod: string;
  processingMode?: string;
  promoCode?: string;
  discountAmount?: number;
  originalAmount?: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: Date;
  adminApproval?: {
    isApproved: boolean;
    approvedBy?: string;
    approvedAt?: Date;
    notes?: string;
  };
  payLaterDetails?: {
    corporateName?: string;
    corporateEmail?: string;
    isApproved: boolean;
  };
  cashDetails?: {
    collectedBy?: string;
    receiptNumber?: string;
  };
}

const AllPayments: React.FC = () => {
  const [payments, setPayments] = useState<PaymentOrder[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<PaymentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentTypeFilter, setPaymentTypeFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState<PaymentOrder | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Statistics
  const [stats, setStats] = useState({
    totalPayments: 0,
    totalAmount: 0,
    onlinePayments: 0,
    offlinePayments: 0,
    pendingApprovals: 0,
    completedPayments: 0
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    filterPayments();
    calculateStats();
  }, [payments, searchTerm, statusFilter, paymentTypeFilter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/payments/getAll');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch payments: ${response.statusText}`);
      }
      
      const result = await response.json();
      setPayments(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const filterPayments = () => {
    let filtered = payments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(payment => 
        payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.phone?.includes(searchTerm) ||
        payment.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.paymentId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    // Payment type filter
    if (paymentTypeFilter !== 'all') {
      filtered = filtered.filter(payment => payment.paymentType === paymentTypeFilter);
    }

    setFilteredPayments(filtered);
  };

  const calculateStats = () => {
    const totalPayments = payments.length;
    const totalAmount = payments.reduce((sum, payment) => sum + parseFloat(payment.amount || '0'), 0);
    const onlinePayments = payments.filter(p => p.paymentType === 'online').length;
    const offlinePayments = payments.filter(p => p.paymentType !== 'online').length;
    const pendingApprovals = payments.filter(p => p.status === 'pending_approval').length;
    const completedPayments = payments.filter(p => ['paid', 'captured'].includes(p.status)).length;

    setStats({
      totalPayments,
      totalAmount,
      onlinePayments,
      offlinePayments,
      pendingApprovals,
      completedPayments
    });
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'created': 'bg-blue-100 text-blue-800',
      'paid': 'bg-green-100 text-green-800',
      'captured': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800',
      'offline': 'bg-yellow-100 text-yellow-800',
      'cash': 'bg-purple-100 text-purple-800',
      'paylater': 'bg-orange-100 text-orange-800',
      'pending_approval': 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const getPaymentTypeBadge = (type: string) => {
    const typeColors = {
      'online': 'bg-blue-100 text-blue-800',
      'offline': 'bg-orange-100 text-orange-800',
      'cash': 'bg-green-100 text-green-800',
      'paylater': 'bg-purple-100 text-purple-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[type as keyof typeof typeColors] || 'bg-gray-100 text-gray-800'}`}>
        {type.toUpperCase()}
      </span>
    );
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: string) => {
    return `₹${parseFloat(amount).toLocaleString('en-IN')}`;
  };

  const openPaymentModal = (payment: PaymentOrder) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold">Error Loading Payments</p>
          <p className="mt-2">{error}</p>
          <button 
            onClick={fetchPayments}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
        <p className="text-gray-600 mt-1">Manage all online and offline payments</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <FiCreditCard className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Payments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPayments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <FiDollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">{formatAmount(stats.totalAmount.toString())}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">ON</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Online</p>
              <p className="text-2xl font-bold text-blue-600">{stats.onlinePayments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-bold text-sm">OF</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Offline</p>
              <p className="text-2xl font-bold text-orange-600">{stats.offlinePayments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 font-bold text-sm">PA</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingApprovals}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold text-sm">✓</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completedPayments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Order ID, Email, Phone, Country..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="md:w-48">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="created">Created</option>
              <option value="paid">Paid</option>
              <option value="captured">Captured</option>
              <option value="failed">Failed</option>
              <option value="offline">Offline</option>
              <option value="cash">Cash</option>
              <option value="paylater">Pay Later</option>
              <option value="pending_approval">Pending Approval</option>
            </select>
          </div>

          {/* Payment Type Filter */}
          <div className="md:w-48">
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={paymentTypeFilter}
              onChange={(e) => setPaymentTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="cash">Cash</option>
              <option value="paylater">Pay Later</option>
            </select>
          </div>

          {/* Export Button */}
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center">
            <FiDownload className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {payment.orderId}
                      </div>
                      {payment.paymentId && (
                        <div className="text-sm text-gray-500">
                          Payment ID: {payment.paymentId}
                        </div>
                      )}
                      <div className="text-sm text-gray-500">
                        {payment.country} • {payment.travellers || payment.travellerDetails?.total || 0} travellers
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {payment.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatAmount(payment.amount)}
                      </div>
                      {payment.promoCode && (
                        <div className="text-sm text-green-600">
                          Promo: {payment.promoCode} (-₹{payment.discountAmount})
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPaymentTypeBadge(payment.paymentType)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(payment.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openPaymentModal(payment)}
                      className="text-blue-600 hover:text-blue-900 flex items-center"
                    >
                      <FiEye className="mr-1" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <FiCreditCard className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' || paymentTypeFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'No payments have been made yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Payment Details Modal */}
      {showModal && selectedPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Payment Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Order ID</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedPayment.orderId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payment ID</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedPayment.paymentId || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                    <p className="mt-1 text-sm text-gray-900">{formatAmount(selectedPayment.amount)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedPayment.status)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Payment Type</label>
                    <div className="mt-1">{getPaymentTypeBadge(selectedPayment.paymentType)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Country</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedPayment.country}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedPayment.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedPayment.phone}</p>
                  </div>
                </div>

                {selectedPayment.travellerDetails && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Traveller Details</label>
                    <p className="mt-1 text-sm text-gray-900">
                      Total: {selectedPayment.travellerDetails.total} 
                      (Adults: {selectedPayment.travellerDetails.adults}, 
                      Children: {selectedPayment.travellerDetails.children}, 
                      Infants: {selectedPayment.travellerDetails.infants})
                    </p>
                  </div>
                )}

                {selectedPayment.promoCode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Promo Code</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedPayment.promoCode} - Discount: ₹{selectedPayment.discountAmount}
                      {selectedPayment.originalAmount && (
                        <span className="text-gray-500"> (Original: ₹{selectedPayment.originalAmount})</span>
                      )}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Created At</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(selectedPayment.createdAt)}</p>
                  </div>
                  {selectedPayment.paidAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Paid At</label>
                      <p className="mt-1 text-sm text-gray-900">{formatDate(selectedPayment.paidAt)}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPayments;
