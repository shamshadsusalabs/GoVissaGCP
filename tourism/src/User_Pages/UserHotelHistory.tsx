import { useState, useMemo } from 'react';
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight, FiEye, FiTrash2, FiCalendar, FiHome, FiStar, FiDollarSign } from 'react-icons/fi';

type HotelBooking = {
  id: string;
  hotelName: string;
  location: string;
  checkInDate: string;
  checkOutDate: string;
  rooms: number;
  guests: number;
  roomType: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'refunded' | 'failed';
  paymentMethod: 'credit_card' | 'debit_card' | 'upi' | 'net_banking' | 'wallet';
  price: number;
  bookingDate: string;
  rating: number;
  amenities: string[];
};

const UserHotelHistory = () => {
  // Sample hotel booking data for a single user
  const userHotels: HotelBooking[] = [
    {
      id: 'HB001',
      hotelName: 'Taj Mahal Palace',
      location: 'Mumbai, India',
      checkInDate: '2023-06-15',
      checkOutDate: '2023-06-20',
      rooms: 1,
      guests: 2,
      roomType: 'Deluxe Sea View',
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'credit_card',
      price: 45000,
      bookingDate: '2023-06-10',
      rating: 4.8,
      amenities: ['Free WiFi', 'Pool', 'Spa', 'Breakfast']
    },
    {
      id: 'HB002',
      hotelName: 'The Oberoi',
      location: 'New Delhi, India',
      checkInDate: '2023-07-10',
      checkOutDate: '2023-07-15',
      rooms: 2,
      guests: 4,
      roomType: 'Executive Suite',
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'upi',
      price: 68000,
      bookingDate: '2023-07-05',
      rating: 4.7,
      amenities: ['Free WiFi', 'Gym', 'Restaurant', 'Airport Shuttle']
    },
    {
      id: 'HB003',
      hotelName: 'Grand Hyatt',
      location: 'Goa, India',
      checkInDate: '2023-08-05',
      checkOutDate: '2023-08-10',
      rooms: 1,
      guests: 2,
      roomType: 'Premium Room',
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'net_banking',
      price: 32000,
      bookingDate: '2023-08-01',
      rating: 4.5,
      amenities: ['Beach Access', 'Pool', 'Spa', 'Breakfast']
    },
    {
      id: 'HB004',
      hotelName: 'ITC Gardenia',
      location: 'Bangalore, India',
      checkInDate: '2023-09-12',
      checkOutDate: '2023-09-15',
      rooms: 1,
      guests: 1,
      roomType: 'Business Room',
      status: 'cancelled',
      paymentStatus: 'refunded',
      paymentMethod: 'debit_card',
      price: 18000,
      bookingDate: '2023-09-10',
      rating: 4.6,
      amenities: ['Free WiFi', 'Gym', 'Workspace']
    },
  ];

  // State management
  const [bookings] = useState<HotelBooking[]>(userHotels);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof HotelBooking; direction: 'ascending' | 'descending' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter and sort bookings
  const filteredBookings = useMemo(() => {
    let result = [...bookings];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(booking =>
        booking.hotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.roomType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(booking => booking.status === statusFilter);
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
  }, [bookings, searchTerm, statusFilter, sortConfig]);

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

  // Rating stars
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        <FiStar className="text-yellow-400 fill-current" />
        <span className="ml-1 text-sm font-medium">{rating}</span>
      </div>
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

  // Stats summary
  const totalBookings = bookings.length;
//   const totalNights = bookings.reduce((sum, booking) => {
//     const checkIn = new Date(booking.checkInDate);
//     const checkOut = new Date(booking.checkOutDate);
//     const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
//     return sum + nights;
//   }, 0);
  const totalSpent = bookings.reduce((sum, booking) => sum + booking.price, 0);
  const upcomingStays = bookings.filter(b => 
    new Date(b.checkInDate) > new Date() && b.status !== 'cancelled'
  ).length;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* User Hotel Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-indigo-50 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
              <FiHome className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Total Stays</h3>
              <p className="text-3xl font-bold text-indigo-600">{totalBookings}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FiDollarSign className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Total Spent</h3>
              <p className="text-3xl font-bold text-green-600">₹{totalSpent.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-amber-50 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-100 text-amber-600 mr-4">
              <FiCalendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Upcoming Stays</h3>
              <p className="text-3xl font-bold text-amber-600">{upcomingStays}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <FiHome className="mr-2" /> My Hotel Bookings
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search hotels..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
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
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none w-full"
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
        </div>
      </div>

      {/* Hotel Bookings Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('hotelName')}
              >
                <div className="flex items-center">
                  Hotel
                  {sortConfig?.key === 'hotelName' && (
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
                Stay Details
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('checkInDate')}
              >
                <div className="flex items-center">
                  <FiCalendar className="mr-1" />
                  Dates
                  {sortConfig?.key === 'checkInDate' && (
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
                Booking Info
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
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="font-medium text-gray-900">{booking.hotelName}</div>
                      <div className="text-sm text-gray-500">{booking.location}</div>
                      {renderStars(booking.rating)}
                      <div className="text-xs text-gray-500 mt-1">
                        {booking.amenities.slice(0, 3).join(' • ')}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium">{booking.roomType}</div>
                      <div className="text-sm">
                        <span className="text-gray-900">{booking.rooms} {booking.rooms > 1 ? 'Rooms' : 'Room'}</span>
                        <span className="mx-2">•</span>
                        <span className="text-gray-900">{booking.guests} {booking.guests > 1 ? 'Guests' : 'Guest'}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {Math.ceil((new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) / (1000 * 60 * 60 * 24))} Nights
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm">
                        <span className="font-medium">Check-in:</span> {formatDate(booking.checkInDate)}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Check-out:</span> {formatDate(booking.checkOutDate)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Booked on: {formatDate(booking.bookingDate)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <StatusBadge status={booking.status} />
                      <PaymentStatusBadge status={booking.paymentStatus} />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg font-bold text-gray-900">
                      ₹{booking.price.toLocaleString('en-IN')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {booking.paymentMethod.replace('_', ' ').toUpperCase()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button 
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View Details"
                      >
                        <FiEye />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        title="Cancel Booking"
                        disabled={booking.status === 'cancelled'}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
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
                of <span className="font-medium">{filteredBookings.length}</span> bookings
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
                        ? 'z-10 bg-indigo-600 border-indigo-600 text-white'
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

export default UserHotelHistory;