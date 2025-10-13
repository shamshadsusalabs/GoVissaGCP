import { useState, useMemo } from 'react';
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight, FiEye, FiTrash2, FiCalendar,  FiMapPin, FiUser, FiDollarSign } from 'react-icons/fi';
import { IoCarSport } from 'react-icons/io5';
type TransportBooking = {
  id: string;
  vehicleType: 'car' | 'bike' | 'suv' | 'minivan' | 'bus';
  serviceProvider: string;
  pickupLocation: string;
  dropLocation: string;
  bookingDate: string;
  tripDate: string;
  duration: string;
  distance: number; // in km
  driverName: string;
  driverContact: string;
  status: 'confirmed' | 'ongoing' | 'completed' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'refunded' | 'failed';
  paymentMethod: 'credit_card' | 'debit_card' | 'upi' | 'net_banking' | 'wallet';
  price: number;
  vehicleNumber: string;
  amenities: string[];
};

const UserTransportHistory = () => {
  // Sample transport booking data for a single user
  const userTransports: TransportBooking[] = [
    {
      id: 'TB001',
      vehicleType: 'car',
      serviceProvider: 'CityRide',
      pickupLocation: 'Delhi Airport',
      dropLocation: 'Connaught Place',
      bookingDate: '2023-06-10',
      tripDate: '2023-06-15',
      duration: '45 mins',
      distance: 15,
      driverName: 'Rahul Sharma',
      driverContact: '+91 98765 43210',
      status: 'completed',
      paymentStatus: 'paid',
      paymentMethod: 'upi',
      price: 650,
      vehicleNumber: 'DL1C AB1234',
      amenities: ['AC', 'Free WiFi', 'Water Bottle']
    },
    {
      id: 'TB002',
      vehicleType: 'suv',
      serviceProvider: 'Premium Cabs',
      pickupLocation: 'Home',
      dropLocation: 'Mumbai Airport',
      bookingDate: '2023-07-05',
      tripDate: '2023-07-10',
      duration: '2 hours',
      distance: 40,
      driverName: 'Vikram Singh',
      driverContact: '+91 87654 32109',
      status: 'completed',
      paymentStatus: 'paid',
      paymentMethod: 'credit_card',
      price: 2200,
      vehicleNumber: 'MH2D XY5678',
      amenities: ['AC', 'Charging Port', 'Newspaper']
    },
    {
      id: 'TB003',
      vehicleType: 'minivan',
      serviceProvider: 'Family Travels',
      pickupLocation: 'Bangalore Hotel',
      dropLocation: 'Mysore Palace',
      bookingDate: '2023-08-01',
      tripDate: '2023-08-05',
      duration: '3 hours 30 mins',
      distance: 150,
      driverName: 'Anil Kumar',
      driverContact: '+91 76543 21098',
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'net_banking',
      price: 4500,
      vehicleNumber: 'KA3E CD9012',
      amenities: ['AC', 'TV', 'Charging Ports', 'Cool Box']
    },
    {
      id: 'TB004',
      vehicleType: 'bike',
      serviceProvider: 'QuickRide',
      pickupLocation: 'Office',
      dropLocation: 'Home',
      bookingDate: '2023-09-10',
      tripDate: '2023-09-12',
      duration: '25 mins',
      distance: 8,
      driverName: 'Sunil Patel',
      driverContact: '+91 65432 10987',
      status: 'cancelled',
      paymentStatus: 'refunded',
      paymentMethod: 'wallet',
      price: 120,
      vehicleNumber: 'DL4F EF3456',
      amenities: ['Helmet', 'Raincoat']
    },
  ];

  // State management
  const [bookings] = useState<TransportBooking[]>(userTransports);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [vehicleFilter, setVehicleFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof TransportBooking; direction: 'ascending' | 'descending' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter and sort bookings
  const filteredBookings = useMemo(() => {
    let result = [...bookings];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(booking =>
        booking.serviceProvider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.dropLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(booking => booking.status === statusFilter);
    }
    
    // Apply vehicle type filter
    if (vehicleFilter !== 'all') {
      result = result.filter(booking => booking.vehicleType === vehicleFilter);
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
  }, [bookings, searchTerm, statusFilter, vehicleFilter, sortConfig]);

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
      ongoing: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    const statusText = {
      confirmed: 'Confirmed',
      ongoing: 'Ongoing',
      completed: 'Completed',
      cancelled: 'Cancelled'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {statusText[status]}
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

  // Vehicle type badge
  const VehicleTypeBadge = ({ type }: { type: TransportBooking['vehicleType'] }) => {
    const typeColors = {
      car: 'bg-gray-100 text-gray-800',
      bike: 'bg-orange-100 text-orange-800',
      suv: 'bg-purple-100 text-purple-800',
      minivan: 'bg-cyan-100 text-cyan-800',
      bus: 'bg-red-100 text-red-800'
    };
    
    const typeText = {
      car: 'Car',
      bike: 'Bike',
      suv: 'SUV',
      minivan: 'Minivan',
      bus: 'Bus'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[type]}`}>
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

  // Stats summary
  const totalBookings = bookings.length;
  const totalDistance = bookings.reduce((sum, booking) => sum + booking.distance, 0);
  const totalSpent = bookings.reduce((sum, booking) => sum + booking.price, 0);
//   const upcomingTrips = bookings.filter(b => 
//     new Date(b.tripDate) > new Date() && b.status !== 'cancelled'
//   ).length;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* User Transport Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-purple-50 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <IoCarSport className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Total Rides</h3>
              <p className="text-3xl font-bold text-purple-600">{totalBookings}</p>
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
        
        <div className="bg-blue-50 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FiMapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Distance Covered</h3>
              <p className="text-3xl font-bold text-blue-600">{totalDistance} km</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <IoCarSport className="mr-2" /> My Transport Bookings
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search rides..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-full"
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
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none w-full"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Vehicle Type Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IoCarSport className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none w-full"
              value={vehicleFilter}
              onChange={(e) => {
                setVehicleFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Vehicles</option>
              <option value="car">Car</option>
              <option value="bike">Bike</option>
              <option value="suv">SUV</option>
              <option value="minivan">Minivan</option>
              <option value="bus">Bus</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transport Bookings Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('serviceProvider')}
              >
                <div className="flex items-center">
                  Service
                  {sortConfig?.key === 'serviceProvider' && (
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
                Trip Details
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('tripDate')}
              >
                <div className="flex items-center">
                  <FiCalendar className="mr-1" />
                  Date & Time
                  {sortConfig?.key === 'tripDate' && (
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
                Driver & Vehicle
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
                      <div className="font-medium text-gray-900">{booking.serviceProvider}</div>
                      <VehicleTypeBadge type={booking.vehicleType} />
                      <div className="text-xs text-gray-500 mt-1">
                        Booked on: {formatDate(booking.bookingDate)}
                      </div>
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
                      <div className="text-xs text-gray-500 mt-1">
                        {booking.distance} km • {booking.duration}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium">
                        {formatDate(booking.tripDate)}
                      </div>
                      <StatusBadge status={booking.status} />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <FiUser className="text-gray-400 mr-1" />
                        <span className="text-sm">{booking.driverName}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.driverContact}
                      </div>
                      <div className="text-xs font-mono mt-1">
                        {booking.vehicleNumber}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.amenities.slice(0, 2).join(' • ')}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg font-bold text-gray-900">
                      ₹{booking.price.toLocaleString('en-IN')}
                    </div>
                    <PaymentStatusBadge status={booking.paymentStatus} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button 
                        className="text-purple-600 hover:text-purple-900"
                        title="View Details"
                      >
                        <FiEye />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        title="Cancel Booking"
                        disabled={booking.status === 'cancelled' || booking.status === 'completed'}
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
                of <span className="font-medium">{filteredBookings.length}</span> rides
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
                        ? 'z-10 bg-purple-600 border-purple-600 text-white'
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

export default UserTransportHistory;