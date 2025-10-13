import { useState } from 'react';
import { FiSearch, FiFilter, FiDollarSign, FiClock, FiCheckCircle, FiXCircle, FiRefreshCw, FiFileText, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

type RefundRecord = {
  bookingId: string;
  bookingType: 'flight' | 'hotel' | 'car' | 'package';
  employee: {
    name: string;
    department: string;
    employeeId: string;
  };
  originalAmount: number;
  cancellationDate: string;
  cancellationReason: string;
  refundStatus: 'processed' | 'pending' | 'rejected' | 'partially_refunded';
  refundAmount: number;
  refundMethod: 'original_payment' | 'corporate_credit' | 'bank_transfer';
  refundDate?: string;
  processedBy?: string;
  notes?: string;
};

const CorporateRefundTracker = () => {
  // Sample refund data for cancelled corporate bookings
  const refundData: RefundRecord[] = [
    {
      bookingId: 'FLT-789012',
      bookingType: 'flight',
      employee: {
        name: 'Rahul Sharma',
        department: 'Sales',
        employeeId: 'EMP-1001'
      },
      originalAmount: 45000,
      cancellationDate: '2023-11-15',
      cancellationReason: 'Client meeting postponed',
      refundStatus: 'processed',
      refundAmount: 40500, // 90% refund after penalty
      refundMethod: 'original_payment',
      refundDate: '2023-11-22',
      processedBy: 'Travel Desk (Priya K.)',
      notes: '10% cancellation fee applied as per policy'
    },
    {
      bookingId: 'HTL-345678',
      bookingType: 'hotel',
      employee: {
        name: 'Neha Patel',
        department: 'Marketing',
        employeeId: 'EMP-2045'
      },
      originalAmount: 32000,
      cancellationDate: '2023-12-01',
      cancellationReason: 'Event cancellation',
      refundStatus: 'pending',
      refundAmount: 32000,
      refundMethod: 'corporate_credit',
      notes: 'Awaiting hotel confirmation'
    },
    {
      bookingId: 'PKG-901234',
      bookingType: 'package',
      employee: {
        name: 'Amit Joshi',
        department: 'Engineering',
        employeeId: 'EMP-3056'
      },
      originalAmount: 125000,
      cancellationDate: '2023-10-28',
      cancellationReason: 'Visa rejection',
      refundStatus: 'partially_refunded',
      refundAmount: 100000,
      refundMethod: 'bank_transfer',
      refundDate: '2023-11-05',
      processedBy: 'Accounts (Vikram S.)',
      notes: '₹25,000 non-refundable deposit retained'
    },
    {
      bookingId: 'CAR-567890',
      bookingType: 'car',
      employee: {
        name: 'Priya Reddy',
        department: 'HR',
        employeeId: 'EMP-4023'
      },
      originalAmount: 15000,
      cancellationDate: '2023-12-10',
      cancellationReason: 'Alternative transport arranged',
      refundStatus: 'rejected',
      refundAmount: 0,
      refundMethod: 'original_payment',
      notes: 'Cancelled within 24 hours - no refund policy'
    },
    {
      bookingId: 'FLT-123456',
      bookingType: 'flight',
      employee: {
        name: 'Vikram Malhotra',
        department: 'Finance',
        employeeId: 'EMP-5012'
      },
      originalAmount: 68000,
      cancellationDate: '2023-11-30',
      cancellationReason: 'Route change',
      refundStatus: 'processed',
      refundAmount: 61200, // 90% refund
      refundMethod: 'original_payment',
      refundDate: '2023-12-07',
      processedBy: 'Travel Desk (Anjali M.)',
      notes: '10% airline processing fee deducted'
    }
  ];

  // State management
  const [refunds] = useState<RefundRecord[]>(refundData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter refunds
  const filteredRefunds = refunds.filter(refund => {
    const matchesSearch = 
      refund.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.bookingId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || refund.refundStatus === statusFilter;
    const matchesType = typeFilter === 'all' || refund.bookingType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredRefunds.length / itemsPerPage);
  const currentItems = filteredRefunds.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Refund status badge
  const RefundStatusBadge = ({ status }: { status: RefundRecord['refundStatus'] }) => {
    const statusClasses = {
      processed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
      partially_refunded: 'bg-blue-100 text-blue-800'
    };
    
    const statusIcons = {
      processed: <FiCheckCircle className="inline mr-1" />,
      pending: <FiClock className="inline mr-1" />,
      rejected: <FiXCircle className="inline mr-1" />,
      partially_refunded: <FiRefreshCw className="inline mr-1" />
    };
    
    const statusText = {
      processed: 'Processed',
      pending: 'Pending',
      rejected: 'Rejected',
      partially_refunded: 'Partial Refund'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {statusIcons[status]}
        {statusText[status]}
      </span>
    );
  };

  // Booking type badge
  const BookingTypeBadge = ({ type }: { type: RefundRecord['bookingType'] }) => {
    const typeClasses = {
      flight: 'bg-blue-100 text-blue-800',
      hotel: 'bg-purple-100 text-purple-800',
      car: 'bg-amber-100 text-amber-800',
      package: 'bg-teal-100 text-teal-800'
    };
    
    const typeText = {
      flight: 'Flight',
      hotel: 'Hotel',
      car: 'Car Rental',
      package: 'Package'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeClasses[type]}`}>
        {typeText[type]}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate refund percentage
  const getRefundPercentage = (original: number, refund: number) => {
    return original > 0 ? Math.round((refund / original) * 100) : 0;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <FiDollarSign className="mr-2" /> Corporate Refund Tracker
      </h2>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search refunds..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Status Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none w-full"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Status</option>
              <option value="processed">Processed</option>
              <option value="pending">Pending</option>
              <option value="partially_refunded">Partially Refunded</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFileText className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none w-full"
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Types</option>
              <option value="flight">Flights</option>
              <option value="hotel">Hotels</option>
              <option value="car">Car Rentals</option>
              <option value="package">Packages</option>
            </select>
          </div>
        </div>
      </div>

      {/* Refunds Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee & Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cancellation Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refund Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Processing Info</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((refund) => (
                <tr key={refund.bookingId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-mono text-sm">{refund.bookingId}</div>
                    <BookingTypeBadge type={refund.bookingType} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{refund.employee.name}</div>
                    <div className="text-xs text-gray-500">
                      {refund.employee.department} • {refund.employee.employeeId}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <span className="font-medium">Cancelled:</span> {formatDate(refund.cancellationDate)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {refund.cancellationReason}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <RefundStatusBadge status={refund.refundStatus} />
                    {refund.refundStatus === 'processed' && refund.refundDate && (
                      <div className="text-xs text-gray-500 mt-1">
                        Completed on {formatDate(refund.refundDate)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm">
                        <span className="font-medium">Original:</span> {formatCurrency(refund.originalAmount)}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Refunded:</span> {formatCurrency(refund.refundAmount)}
                      </div>
                      {refund.originalAmount > 0 && (
                        <div className="text-xs mt-1">
                          <span className="font-medium">Refund %:</span> {getRefundPercentage(refund.originalAmount, refund.refundAmount)}%
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="text-sm capitalize">
                        <span className="font-medium">Method:</span> {refund.refundMethod.replace('_', ' ')}
                      </div>
                      {refund.processedBy && (
                        <div className="text-xs text-gray-500 mt-1">
                          {refund.processedBy}
                        </div>
                      )}
                      {refund.notes && (
                        <div className="text-xs text-gray-500 mt-1">
                          <span className="font-medium">Notes:</span> {refund.notes}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No refund records found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredRefunds.length > itemsPerPage && (
        <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, filteredRefunds.length)}
                </span>{' '}
                of <span className="font-medium">{filteredRefunds.length}</span> refunds
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === number
                        ? 'z-10 bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {number}
                  </button>
                ))}
                
                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CorporateRefundTracker;