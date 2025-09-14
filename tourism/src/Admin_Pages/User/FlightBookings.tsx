import { useState, useMemo } from 'react';
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight, FiEdit, FiTrash2, FiCalendar, FiCreditCard, FiDollarSign } from 'react-icons/fi';

type FlightBooking = {
  id: string;
  passengerName: string;
  email: string;
  flightNumber: string;
  departure: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  bookingStatus: 'booked' | 'cancelled' | 'rescheduled';
  paymentStatus: 'paid' | 'pending' | 'refunded' | 'failed';
  paymentMethod: 'credit_card' | 'debit_card' | 'upi' | 'net_banking' | 'wallet';
  price: number;
  billingDate: string;
  invoiceNumber: string;
};

const FlightBookings = () => {
  // Sample flight booking data
  const initialBookings: FlightBooking[] = [
    {
      id: 'FB001',
      passengerName: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      flightNumber: 'AI-202',
      departure: 'Delhi (DEL)',
      destination: 'Mumbai (BOM)',
      departureDate: '2023-06-15',
      returnDate: '2023-06-20',
      status: 'confirmed',
      bookingStatus: 'booked',
      paymentStatus: 'paid',
      paymentMethod: 'credit_card',
      price: 7500,
      billingDate: '2023-06-10',
      invoiceNumber: 'INV-2023-001'
    },
    {
      id: 'FB002',
      passengerName: 'Priya Patel',
      email: 'priya.patel@example.com',
      flightNumber: 'SG-456',
      departure: 'Bangalore (BLR)',
      destination: 'Dubai (DXB)',
      departureDate: '2023-07-10',
      returnDate: '2023-07-25',
      status: 'confirmed',
      bookingStatus: 'booked',
      paymentStatus: 'paid',
      paymentMethod: 'upi',
      price: 22500,
      billingDate: '2023-07-05',
      invoiceNumber: 'INV-2023-002'
    },
    {
      id: 'FB003',
      passengerName: 'Amit Singh',
      email: 'amit.singh@example.com',
      flightNumber: 'UK-789',
      departure: 'Mumbai (BOM)',
      destination: 'London (LHR)',
      departureDate: '2023-08-05',
      returnDate: '2023-09-05',
      status: 'pending',
      bookingStatus: 'booked',
      paymentStatus: 'pending',
      paymentMethod: 'net_banking',
      price: 48500,
      billingDate: '2023-08-01',
      invoiceNumber: 'INV-2023-003'
    },
    {
      id: 'FB004',
      passengerName: 'Neha Gupta',
      email: 'neha.gupta@example.com',
      flightNumber: 'EM-321',
      departure: 'Chennai (MAA)',
      destination: 'Singapore (SIN)',
      departureDate: '2023-06-22',
      returnDate: '2023-06-30',
      status: 'confirmed',
      bookingStatus: 'booked',
      paymentStatus: 'paid',
      paymentMethod: 'debit_card',
      price: 18700,
      billingDate: '2023-06-18',
      invoiceNumber: 'INV-2023-004'
    },
    {
      id: 'FB005',
      passengerName: 'Vikram Joshi',
      email: 'vikram.joshi@example.com',
      flightNumber: 'QA-112',
      departure: 'Hyderabad (HYD)',
      destination: 'Doha (DOH)',
      departureDate: '2023-07-18',
      returnDate: '2023-07-25',
      status: 'cancelled',
      bookingStatus: 'cancelled',
      paymentStatus: 'refunded',
      paymentMethod: 'wallet',
      price: 16500,
      billingDate: '2023-07-15',
      invoiceNumber: 'INV-2023-005'
    },
    {
      id: 'FB006',
      passengerName: 'Ananya Reddy',
      email: 'ananya.reddy@example.com',
      flightNumber: 'AI-304',
      departure: 'Kolkata (CCU)',
      destination: 'Delhi (DEL)',
      departureDate: '2023-08-12',
      returnDate: '2023-08-15',
      status: 'confirmed',
      bookingStatus: 'booked',
      paymentStatus: 'paid',
      paymentMethod: 'credit_card',
      price: 6500,
      billingDate: '2023-08-10',
      invoiceNumber: 'INV-2023-006'
    },
    {
      id: 'FB007',
      passengerName: 'Karthik Malhotra',
      email: 'karthik.m@example.com',
      flightNumber: 'SG-890',
      departure: 'Goa (GOI)',
      destination: 'Bangalore (BLR)',
      departureDate: '2023-09-01',
      returnDate: '2023-09-03',
      status: 'pending',
      bookingStatus: 'booked',
      paymentStatus: 'failed',
      paymentMethod: 'debit_card',
      price: 4200,
      billingDate: '2023-08-28',
      invoiceNumber: 'INV-2023-007'
    },
  ];

  // State management
  const [bookings] = useState<FlightBooking[]>(initialBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof FlightBooking; direction: 'ascending' | 'descending' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter and sort bookings
  const filteredBookings = useMemo(() => {
    let result = [...bookings];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(booking =>
        booking.passengerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.departure.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(booking => booking.status === statusFilter);
    }
    
    // Apply payment filter
    if (paymentFilter !== 'all') {
      result = result.filter(booking => booking.paymentStatus === paymentFilter);
    }
    
    // Apply sorting
    if (sortConfig !== null) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [bookings, searchTerm, statusFilter, paymentFilter, sortConfig]);

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredBookings, itemsPerPage]);

  // Sort request
  const requestSort = (key: keyof FlightBooking) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Status badge component
  const StatusBadge = ({ status }: { status: FlightBooking['status'] }) => {
    const statusClasses = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Payment status badge component
  const PaymentStatusBadge = ({ status }: { status: FlightBooking['paymentStatus'] }) => {
    const statusClasses = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      refunded: 'bg-blue-100 text-blue-800',
      failed: 'bg-red-100 text-red-800'
    };
    
    const statusText = {
      paid: 'Paid',
      pending: 'Pending',
      refunded: 'Refunded',
      failed: 'Failed'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {statusText[status]}
      </span>
    );
  };

  // Payment method badge
  const PaymentMethodBadge = ({ method }: { method: FlightBooking['paymentMethod'] }) => {
    const methodClasses = {
      credit_card: 'bg-purple-100 text-purple-800',
      debit_card: 'bg-indigo-100 text-indigo-800',
      upi: 'bg-teal-100 text-teal-800',
      net_banking: 'bg-amber-100 text-amber-800',
      wallet: 'bg-gray-100 text-gray-800'
    };
    
    const methodText = {
      credit_card: 'Credit Card',
      debit_card: 'Debit Card',
      upi: 'UPI',
      net_banking: 'Net Banking',
      wallet: 'Wallet'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${methodClasses[method]}`}>
        {methodText[method]}
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

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Flight Bookings</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search bookings..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 w-full"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          
          {/* Status Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none w-full"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiDollarSign className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none w-full"
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('passengerName')}
              >
                <div className="flex items-center">
                  Passenger
                  {sortConfig?.key === 'passengerName' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Flight Details
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('departureDate')}
              >
                <div className="flex items-center">
                  <FiCalendar className="mr-1" />
                  Dates
                  {sortConfig?.key === 'departureDate' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('status')}
              >
                Status
                {sortConfig?.key === 'status' && (
                  <span className="ml-1">
                    {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Billing Info
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('price')}
              >
                Price
                {sortConfig?.key === 'price' && (
                  <span className="ml-1">
                    {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="font-medium text-gray-900">{booking.passengerName}</div>
                      <div className="text-sm text-gray-500">{booking.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <span className="font-medium">{booking.flightNumber}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-900">{booking.departure}</span>
                        <span className="mx-2">→</span>
                        <span className="text-gray-900">{booking.destination}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm">
                        <span className="font-medium">Depart:</span> {formatDate(booking.departureDate)}
                      </div>
                      {booking.returnDate && (
                        <div className="text-sm">
                          <span className="font-medium">Return:</span> {formatDate(booking.returnDate)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <StatusBadge status={booking.status} />
                      <div className="text-xs text-gray-500 mt-1">
                        {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <FiCreditCard className="text-gray-400 text-sm" />
                        <PaymentMethodBadge method={booking.paymentMethod} />
                      </div>
                      <PaymentStatusBadge status={booking.paymentStatus} />
                      <div className="text-xs text-gray-500">
                        {formatDate(booking.billingDate)}
                      </div>
                      <div className="text-xs font-mono">
                        {booking.invoiceNumber}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ₹{booking.price.toLocaleString('en-IN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button className="text-teal-600 hover:text-teal-900">
                        <FiEdit />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  No flight bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredBookings.length > itemsPerPage && (
        <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, filteredBookings.length)}
                </span>{' '}
                of <span className="font-medium">{filteredBookings.length}</span> results
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
                        ? 'z-10 bg-teal-600 border-teal-600 text-white'
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

export default FlightBookings;