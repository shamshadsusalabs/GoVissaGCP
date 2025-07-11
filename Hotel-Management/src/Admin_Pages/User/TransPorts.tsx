import { useState, useMemo } from 'react';
import { 
  FiSearch, 
  FiFilter, 
  FiChevronLeft, 
  FiChevronRight, 
  FiEdit, 
  FiTrash2, 
  FiCalendar, 
  FiUser, 
  FiMapPin,
  FiDollarSign,
  FiCreditCard
} from 'react-icons/fi';
import { FaCar, FaBus } from 'react-icons/fa';

type TransportBooking = {
  id: string;
  bookingType: 'bus' | 'taxi';
  passengerName: string;
  email: string;
  phone: string;
  pickupLocation: string;
  dropLocation: string;
  bookingDate: string;
  travelDate: string;
  vehicleDetails: string;
  seats: number;
  fare: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  paymentStatus: 'paid' | 'pending' | 'refunded' | 'failed';
  paymentMethod: 'credit_card' | 'debit_card' | 'upi' | 'wallet' | 'cash';
  billingDate: string;
  invoiceNumber: string;
};

const TransportBookings = () => {
  // Sample transport booking data with billing info
  const initialBookings: TransportBooking[] = [
    {
      id: 'TB001',
      bookingType: 'bus',
      passengerName: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '+91 9876543210',
      pickupLocation: 'Delhi, ISBT Kashmere Gate',
      dropLocation: 'Manali, Bus Stand',
      bookingDate: '2023-05-10',
      travelDate: '2023-06-15',
      vehicleDetails: 'Volvo AC Sleeper (HR-45-AB-1234)',
      seats: 2,
      fare: 3500,
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'upi',
      billingDate: '2023-05-10',
      invoiceNumber: 'INV-TB-2023-001'
    },
    {
      id: 'TB002',
      bookingType: 'taxi',
      passengerName: 'Priya Patel',
      email: 'priya.patel@example.com',
      phone: '+91 8765432109',
      pickupLocation: 'Mumbai Airport (T2)',
      dropLocation: 'Juhu, Hotel Grand',
      bookingDate: '2023-06-01',
      travelDate: '2023-07-10',
      vehicleDetails: 'Toyota Innova (MH-01-AB-5678)',
      seats: 4,
      fare: 1200,
      status: 'completed',
      paymentStatus: 'paid',
      paymentMethod: 'credit_card',
      billingDate: '2023-06-01',
      invoiceNumber: 'INV-TB-2023-002'
    },
    {
      id: 'TB003',
      bookingType: 'bus',
      passengerName: 'Amit Singh',
      email: 'amit.singh@example.com',
      phone: '+91 7654321098',
      pickupLocation: 'Bangalore, Majestic Bus Stand',
      dropLocation: 'Chennai, CMBT',
      bookingDate: '2023-07-20',
      travelDate: '2023-08-05',
      vehicleDetails: 'Non-AC Seater (KA-05-AB-9012)',
      seats: 1,
      fare: 850,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'wallet',
      billingDate: '2023-07-20',
      invoiceNumber: 'INV-TB-2023-003'
    },
    {
      id: 'TB004',
      bookingType: 'taxi',
      passengerName: 'Neha Gupta',
      email: 'neha.gupta@example.com',
      phone: '+91 6543210987',
      pickupLocation: 'Hyderabad, Hitech City',
      dropLocation: 'Hyderabad Airport',
      bookingDate: '2023-05-15',
      travelDate: '2023-06-22',
      vehicleDetails: 'Swift Dzire (TS-10-AB-3456)',
      seats: 3,
      fare: 650,
      status: 'cancelled',
      paymentStatus: 'refunded',
      paymentMethod: 'debit_card',
      billingDate: '2023-05-15',
      invoiceNumber: 'INV-TB-2023-004'
    },
    {
      id: 'TB005',
      bookingType: 'bus',
      passengerName: 'Vikram Joshi',
      email: 'vikram.joshi@example.com',
      phone: '+91 9432109876',
      pickupLocation: 'Jaipur, Sindhi Camp',
      dropLocation: 'Udaipur, RSRTC Depot',
      bookingDate: '2023-06-25',
      travelDate: '2023-07-18',
      vehicleDetails: 'AC Seater (RJ-14-AB-7890)',
      seats: 2,
      fare: 1100,
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'cash',
      billingDate: '2023-06-25',
      invoiceNumber: 'INV-TB-2023-005'
    },
  ];

  // State management
  const [bookings] = useState<TransportBooking[]>(initialBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'bus' | 'taxi'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof TransportBooking; direction: 'ascending' | 'descending' } | null>(null);
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
        booking.phone.includes(searchTerm) ||
        booking.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.dropLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.vehicleDetails.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(booking => booking.bookingType === typeFilter);
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
  }, [bookings, searchTerm, typeFilter, statusFilter, paymentFilter, sortConfig]);

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredBookings, itemsPerPage]);

  // Sort request
  const requestSort = (key: keyof TransportBooking) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Status badge component
  const StatusBadge = ({ status }: { status: TransportBooking['status'] }) => {
    const statusClasses = {
      confirmed: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Payment status badge component
  const PaymentStatusBadge = ({ status }: { status: TransportBooking['paymentStatus'] }) => {
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
  const PaymentMethodBadge = ({ method }: { method: TransportBooking['paymentMethod'] }) => {
    const methodClasses = {
      credit_card: 'bg-purple-100 text-purple-800',
      debit_card: 'bg-indigo-100 text-indigo-800',
      upi: 'bg-teal-100 text-teal-800',
      wallet: 'bg-amber-100 text-amber-800',
      cash: 'bg-gray-100 text-gray-800'
    };
    
    const methodText = {
      credit_card: 'Credit Card',
      debit_card: 'Debit Card',
      upi: 'UPI',
      wallet: 'Wallet',
      cash: 'Cash'
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

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Transport Bookings</h2>
        
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
          
          {/* Type Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {typeFilter === 'bus' ? <FaBus className="text-gray-400" /> : 
               typeFilter === 'taxi' ? <FaCar className="text-gray-400" /> : 
               <FiSearch className="text-gray-400" />}
            </div>
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none w-full"
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as 'all' | 'bus' | 'taxi');
                setCurrentPage(1);
              }}
            >
              <option value="all">All Types</option>
              <option value="bus">Bus</option>
              <option value="taxi">Taxi</option>
            </select>
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
              <option value="completed">Completed</option>
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
                onClick={() => requestSort('bookingType')}
              >
                Type
                {sortConfig?.key === 'bookingType' && (
                  <span className="ml-1">
                    {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('passengerName')}
              >
                <div className="flex items-center">
                  <FiUser className="mr-1" />
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
                <div className="flex items-center">
                  <FiMapPin className="mr-1" />
                  Route
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('travelDate')}
              >
                <div className="flex items-center">
                  <FiCalendar className="mr-1" />
                  Travel Date
                  {sortConfig?.key === 'travelDate' && (
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
                Vehicle Details
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('fare')}
              >
                Price
                {sortConfig?.key === 'fare' && (
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
                onClick={() => requestSort('status')}
              >
                Status
                {sortConfig?.key === 'status' && (
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
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      booking.bookingType === 'bus' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {booking.bookingType === 'bus' ? <FaBus /> : <FaCar />}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="font-medium text-gray-900">{booking.passengerName}</div>
                      <div className="text-sm text-gray-500">{booking.email}</div>
                      <div className="text-sm text-gray-500">{booking.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="text-sm">
                        <span className="font-medium">From:</span> {booking.pickupLocation}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">To:</span> {booking.dropLocation}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(booking.travelDate)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Booked on: {formatDate(booking.bookingDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{booking.vehicleDetails}</div>
                    <div className="text-xs text-gray-500">
                      {booking.seats} seat{booking.seats !== 1 ? 's' : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {formatCurrency(booking.fare)}
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
                    <StatusBadge status={booking.status} />
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
                <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500">
                  No transport bookings found
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

export default TransportBookings;