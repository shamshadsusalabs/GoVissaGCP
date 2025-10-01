import { useState, useMemo } from 'react';
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight, FiEdit, FiTrash2, FiHome, FiUser, FiCalendar, FiDollarSign, FiCreditCard } from 'react-icons/fi';

type HotelBooking = {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  hotelName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  totalAmount: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'checked-in' | 'checked-out';
  bookingStatus: 'booked' | 'cancelled' | 'modified';
  paymentStatus: 'paid' | 'pending' | 'refunded' | 'failed';
  paymentMethod: 'credit_card' | 'debit_card' | 'upi' | 'net_banking' | 'wallet';
  billingDate: string;
  invoiceNumber: string;
};

const HotelBookings = () => {
  // Sample hotel booking data
  const initialBookings: HotelBooking[] = [
    {
      id: 'HB001',
      guestName: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '+91 9876543210',
      hotelName: 'Taj Mahal Palace',
      roomType: 'Deluxe Sea View',
      checkIn: '2023-06-15',
      checkOut: '2023-06-20',
      nights: 5,
      adults: 2,
      children: 1,
      totalAmount: 42500,
      status: 'confirmed',
      bookingStatus: 'booked',
      paymentStatus: 'paid',
      paymentMethod: 'credit_card',
      billingDate: '2023-05-10',
      invoiceNumber: 'INV-HTL-2023-001'
    },
    {
      id: 'HB002',
      guestName: 'Priya Patel',
      email: 'priya.patel@example.com',
      phone: '+91 8765432109',
      hotelName: 'Oberoi Udaivilas',
      roomType: 'Luxury Suite',
      checkIn: '2023-07-10',
      checkOut: '2023-07-15',
      nights: 5,
      adults: 2,
      children: 0,
      totalAmount: 87500,
      status: 'checked-in',
      bookingStatus: 'booked',
      paymentStatus: 'paid',
      paymentMethod: 'upi',
      billingDate: '2023-06-01',
      invoiceNumber: 'INV-HTL-2023-002'
    },
    {
      id: 'HB003',
      guestName: 'Amit Singh',
      email: 'amit.singh@example.com',
      phone: '+91 7654321098',
      hotelName: 'Leela Palace',
      roomType: 'Executive Room',
      checkIn: '2023-08-05',
      checkOut: '2023-08-08',
      nights: 3,
      adults: 1,
      children: 0,
      totalAmount: 28500,
      status: 'pending',
      bookingStatus: 'booked',
      paymentStatus: 'pending',
      paymentMethod: 'net_banking',
      billingDate: '2023-07-20',
      invoiceNumber: 'INV-HTL-2023-003'
    },
    {
      id: 'HB004',
      guestName: 'Neha Gupta',
      email: 'neha.gupta@example.com',
      phone: '+91 6543210987',
      hotelName: 'ITC Grand Chola',
      roomType: 'Premium Room',
      checkIn: '2023-06-22',
      checkOut: '2023-06-25',
      nights: 3,
      adults: 2,
      children: 2,
      totalAmount: 32400,
      status: 'checked-out',
      bookingStatus: 'booked',
      paymentStatus: 'paid',
      paymentMethod: 'debit_card',
      billingDate: '2023-05-15',
      invoiceNumber: 'INV-HTL-2023-004'
    },
    {
      id: 'HB005',
      guestName: 'Vikram Joshi',
      email: 'vikram.joshi@example.com',
      phone: '+91 9432109876',
      hotelName: 'JW Marriott',
      roomType: 'Standard Room',
      checkIn: '2023-07-18',
      checkOut: '2023-07-20',
      nights: 2,
      adults: 2,
      children: 0,
      totalAmount: 15800,
      status: 'cancelled',
      bookingStatus: 'cancelled',
      paymentStatus: 'refunded',
      paymentMethod: 'wallet',
      billingDate: '2023-06-25',
      invoiceNumber: 'INV-HTL-2023-005'
    },
    {
      id: 'HB006',
      guestName: 'Ananya Reddy',
      email: 'ananya.reddy@example.com',
      phone: '+91 8321098765',
      hotelName: 'Hyatt Regency',
      roomType: 'King Suite',
      checkIn: '2023-08-12',
      checkOut: '2023-08-15',
      nights: 3,
      adults: 2,
      children: 1,
      totalAmount: 36750,
      status: 'confirmed',
      bookingStatus: 'booked',
      paymentStatus: 'paid',
      paymentMethod: 'credit_card',
      billingDate: '2023-07-28',
      invoiceNumber: 'INV-HTL-2023-006'
    },
    {
      id: 'HB007',
      guestName: 'Karthik Malhotra',
      email: 'karthik.m@example.com',
      phone: '+91 7210987654',
      hotelName: 'Radisson Blu',
      roomType: 'Executive Suite',
      checkIn: '2023-09-01',
      checkOut: '2023-09-03',
      nights: 2,
      adults: 1,
      children: 0,
      totalAmount: 14200,
      status: 'pending',
      bookingStatus: 'booked',
      paymentStatus: 'failed',
      paymentMethod: 'debit_card',
      billingDate: '2023-08-25',
      invoiceNumber: 'INV-HTL-2023-007'
    },
  ];

  // State management
  const [bookings] = useState<HotelBooking[]>(initialBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof HotelBooking; direction: 'ascending' | 'descending' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter and sort bookings
  const filteredBookings = useMemo(() => {
    let result = [...bookings];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(booking =>
        booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.phone.includes(searchTerm) ||
        booking.hotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.roomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
  const requestSort = (key: keyof HotelBooking) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Status badge component
  const StatusBadge = ({ status }: { status: HotelBooking['status'] }) => {
    const statusClasses = {
      confirmed: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      'checked-in': 'bg-green-100 text-green-800',
      'checked-out': 'bg-purple-100 text-purple-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-')}
      </span>
    );
  };

  // Booking status badge component
  const BookingStatusBadge = ({ status }: { status: HotelBooking['bookingStatus'] }) => {
    const statusClasses = {
      booked: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      modified: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Payment status badge component
  const PaymentStatusBadge = ({ status }: { status: HotelBooking['paymentStatus'] }) => {
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
  const PaymentMethodBadge = ({ method }: { method: HotelBooking['paymentMethod'] }) => {
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
        <h2 className="text-2xl font-bold text-gray-800">Hotel Bookings</h2>
        
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
              <option value="checked-in">Checked In</option>
              <option value="checked-out">Checked Out</option>
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
                onClick={() => requestSort('guestName')}
              >
                <div className="flex items-center">
                  <FiUser className="mr-1" />
                  Guest
                  {sortConfig?.key === 'guestName' && (
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
                <FiHome className="mr-1 inline" />
                Hotel Details
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('checkIn')}
              >
                <div className="flex items-center">
                  <FiCalendar className="mr-1" />
                  Stay Dates
                  {sortConfig?.key === 'checkIn' && (
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
                Guests
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
                onClick={() => requestSort('totalAmount')}
              >
                <div className="flex items-center">
                  <FiDollarSign className="mr-1" />
                  Amount
                  {sortConfig?.key === 'totalAmount' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
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
                      <div className="font-medium text-gray-900">{booking.guestName}</div>
                      <div className="text-sm text-gray-500">{booking.email}</div>
                      <div className="text-sm text-gray-500">{booking.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="font-medium text-gray-900">{booking.hotelName}</div>
                      <div className="text-sm text-gray-600">{booking.roomType}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm">
                        <span className="font-medium">Check-in:</span> {formatDate(booking.checkIn)}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Check-out:</span> {formatDate(booking.checkOut)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.nights} night{booking.nights !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm">
                        <span className="font-medium">Adults:</span> {booking.adults}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Children:</span> {booking.children}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <StatusBadge status={booking.status} />
                      <BookingStatusBadge status={booking.bookingStatus} />
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
                      ₹{booking.totalAmount.toLocaleString('en-IN')}
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
                <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                  No hotel bookings found
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

export default HotelBookings;