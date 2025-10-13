import { useState } from 'react';
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight, FiEye, FiFileText, FiUser, FiHome } from 'react-icons/fi';

type CorporateHotelBooking = {
  id: string;
  bookingReference: string;
  packageName: string;
  employee: {
    name: string;
    department: string;
    employeeId: string;
  };
  hotelDetails: {
    name: string;
    chain?: string;
    location: string;
    city: string;
    country: string;
    checkInDate: string;
    checkOutDate: string;
    roomType: 'standard' | 'deluxe' | 'suite' | 'executive' | 'presidential';
    roomCount: number;
    amenities: string[];
  };
  bookingSource: 'portal' | 'travel_agent' | 'direct_hotel';
  payment: {
    method: 'credit_card' | 'corporate_account' | 'bank_transfer' | 'upi';
    amount: number;
    status: 'paid' | 'pending' | 'refunded' | 'failed';
    transactionId?: string;
  };
  bookingDate: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'checked_in' | 'checked_out';
  tripPurpose: string;
  approval: {
    status: 'approved' | 'pending' | 'rejected';
    approvedBy?: string;
    approvalDate?: string;
  };
  additionalServices: string[];
};

const CorporateHotelBookingsTable = () => {
  // Sample corporate hotel booking data
  const corporateHotels: CorporateHotelBooking[] = [
    {
      id: 'CHB2023-001',
      bookingReference: 'HTL-789456',
      packageName: 'Maldives Executive Retreat',
      employee: {
        name: 'Rahul Sharma',
        department: 'Senior Management',
        employeeId: 'EMP-1001'
      },
      hotelDetails: {
        name: 'St. Regis Maldives Vommuli Resort',
        chain: 'Marriott',
        location: 'Vommuli Island, Maldives',
        city: 'Male',
        country: 'Maldives',
        checkInDate: '2023-11-15',
        checkOutDate: '2023-11-22',
        roomType: 'suite',
        roomCount: 1,
        amenities: ['Ocean View', 'Private Pool', 'Butler Service', 'Spa Access']
      },
      bookingSource: 'travel_agent',
      payment: {
        method: 'corporate_account',
        amount: 350000,
        status: 'paid',
        transactionId: 'TX-789456123'
      },
      bookingDate: '2023-10-20',
      status: 'completed',
      tripPurpose: 'Leadership strategy retreat',
      approval: {
        status: 'approved',
        approvedBy: 'Priya Kapoor (CFO)',
        approvalDate: '2023-10-18'
      },
      additionalServices: ['Airport Transfer', 'Daily Breakfast', 'Late Check-out']
    },
    {
      id: 'CHB2023-002',
      bookingReference: 'HTL-321654',
      packageName: 'Europe Sales Conference',
      employee: {
        name: 'Neha Patel',
        department: 'Sales',
        employeeId: 'EMP-2045'
      },
      hotelDetails: {
        name: 'Frankfurt Marriott Hotel',
        chain: 'Marriott',
        location: 'Hamburger Allee 2, Frankfurt',
        city: 'Frankfurt',
        country: 'Germany',
        checkInDate: '2023-12-05',
        checkOutDate: '2023-12-12',
        roomType: 'executive',
        roomCount: 1,
        amenities: ['Executive Lounge Access', 'Free WiFi', 'Fitness Center']
      },
      bookingSource: 'portal',
      payment: {
        method: 'credit_card',
        amount: 120000,
        status: 'paid',
        transactionId: 'TX-321654987'
      },
      bookingDate: '2023-11-10',
      status: 'completed',
      tripPurpose: 'Annual sales conference attendance',
      approval: {
        status: 'approved',
        approvedBy: 'Vikram Singh (Sales Director)',
        approvalDate: '2023-11-08'
      },
      additionalServices: ['Conference Package', 'Daily Breakfast']
    },
    {
      id: 'CHB2023-003',
      bookingReference: 'HTL-987123',
      packageName: 'US Client Pitch',
      employee: {
        name: 'Amit Joshi',
        department: 'Business Development',
        employeeId: 'EMP-3056'
      },
      hotelDetails: {
        name: 'The Westin San Francisco',
        chain: 'Marriott',
        location: 'Market Street, San Francisco',
        city: 'San Francisco',
        country: 'USA',
        checkInDate: '2024-01-10',
        checkOutDate: '2024-01-18',
        roomType: 'deluxe',
        roomCount: 1,
        amenities: ['City View', 'Fitness Center', 'Business Center']
      },
      bookingSource: 'direct_hotel',
      payment: {
        method: 'corporate_account',
        amount: 180000,
        status: 'pending'
      },
      bookingDate: '2023-12-15',
      status: 'confirmed',
      tripPurpose: 'Client acquisition pitch for TechCo account',
      approval: {
        status: 'pending'
      },
      additionalServices: ['Meeting Room Access']
    },
    {
      id: 'CHB2023-004',
      bookingReference: 'HTL-456789',
      packageName: 'APAC Regional Meet',
      employee: {
        name: 'Priya Reddy',
        department: 'Marketing',
        employeeId: 'EMP-4023'
      },
      hotelDetails: {
        name: 'Marina Bay Sands',
        chain: 'Sands',
        location: '10 Bayfront Avenue, Singapore',
        city: 'Singapore',
        country: 'Singapore',
        checkInDate: '2023-11-28',
        checkOutDate: '2023-12-02',
        roomType: 'deluxe',
        roomCount: 2,
        amenities: ['Infinity Pool Access', 'SkyPark Entry', 'Casino Pass']
      },
      bookingSource: 'portal',
      payment: {
        method: 'upi',
        amount: 250000,
        status: 'paid',
        transactionId: 'TX-456789123'
      },
      bookingDate: '2023-11-05',
      status: 'completed',
      tripPurpose: 'Regional marketing team alignment',
      approval: {
        status: 'approved',
        approvedBy: 'Anjali Mehta (CMO)',
        approvalDate: '2023-11-03'
      },
      additionalServices: ['Team Dinner', 'City Tour']
    },
    {
      id: 'CHB2023-005',
      bookingReference: 'HTL-654321',
      packageName: 'Domestic Quarterly Review',
      employee: {
        name: 'Vikram Malhotra',
        department: 'Finance',
        employeeId: 'EMP-5012'
      },
      hotelDetails: {
        name: 'Taj Bengaluru',
        chain: 'Taj',
        location: '41/3, MG Road, Bengaluru',
        city: 'Bangalore',
        country: 'India',
        checkInDate: '2023-12-15',
        checkOutDate: '2023-12-17',
        roomType: 'standard',
        roomCount: 1,
        amenities: ['Free WiFi', 'Swimming Pool', 'Fitness Center']
      },
      bookingSource: 'portal',
      payment: {
        method: 'bank_transfer',
        amount: 25000,
        status: 'refunded',
        transactionId: 'TX-654321789'
      },
      bookingDate: '2023-11-28',
      status: 'cancelled',
      tripPurpose: 'Quarterly finance review (Cancelled due to illness)',
      approval: {
        status: 'approved',
        approvedBy: 'Rajiv Khanna (Finance Director)',
        approvalDate: '2023-11-25'
      },
      additionalServices: ['Flexi Booking']
    },
    {
      id: 'CHB2023-006',
      bookingReference: 'HTL-135790',
      packageName: 'Tech Summit Accommodation',
      employee: {
        name: 'Sanjay Gupta',
        department: 'IT',
        employeeId: 'EMP-6078'
      },
      hotelDetails: {
        name: 'Hyatt Regency Delhi',
        chain: 'Hyatt',
        location: 'Bhikaji Cama Place, Delhi',
        city: 'New Delhi',
        country: 'India',
        checkInDate: '2024-02-10',
        checkOutDate: '2024-02-15',
        roomType: 'executive',
        roomCount: 1,
        amenities: ['Club Lounge Access', 'Breakfast', 'Airport Transfer']
      },
      bookingSource: 'travel_agent',
      payment: {
        method: 'corporate_account',
        amount: 75000,
        status: 'paid',
        transactionId: 'TX-135790246'
      },
      bookingDate: '2023-12-20',
      status: 'confirmed',
      tripPurpose: 'Annual technology summit participation',
      approval: {
        status: 'approved',
        approvedBy: 'Naveen Reddy (CIO)',
        approvalDate: '2023-12-18'
      },
      additionalServices: ['Tech Summit Pass', 'Gala Dinner']
    }
  ];

  // State management
  const [bookings] = useState<CorporateHotelBooking[]>(corporateHotels);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.hotelDetails.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bookingReference.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || booking.employee.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const currentItems = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Status badge component
  const StatusBadge = ({ status }: { status: CorporateHotelBooking['status'] }) => {
    const statusClasses = {
      confirmed: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-800',
      checked_in: 'bg-purple-100 text-purple-800',
      checked_out: 'bg-indigo-100 text-indigo-800'
    };
    
    const statusText = {
      confirmed: 'Confirmed',
      pending: 'Pending',
      cancelled: 'Cancelled',
      completed: 'Completed',
      checked_in: 'Checked In',
      checked_out: 'Checked Out'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {statusText[status]}
      </span>
    );
  };

  // Approval status badge
  const ApprovalBadge = ({ status }: { status: CorporateHotelBooking['approval']['status'] }) => {
    const statusClasses = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Payment method badge
  const PaymentMethodBadge = ({ method }: { method: CorporateHotelBooking['payment']['method'] }) => {
    const methodClasses = {
      credit_card: 'bg-purple-100 text-purple-800',
      corporate_account: 'bg-blue-100 text-blue-800',
      bank_transfer: 'bg-teal-100 text-teal-800',
      upi: 'bg-indigo-100 text-indigo-800'
    };
    
    const methodText = {
      credit_card: 'Credit Card',
      corporate_account: 'Corporate Account',
      bank_transfer: 'Bank Transfer',
      upi: 'UPI'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${methodClasses[method]}`}>
        {methodText[method]}
      </span>
    );
  };

  // Booking source badge
  const BookingSourceBadge = ({ source }: { source: CorporateHotelBooking['bookingSource'] }) => {
    const sourceClasses = {
      portal: 'bg-green-100 text-green-800',
      travel_agent: 'bg-orange-100 text-orange-800',
      direct_hotel: 'bg-red-100 text-red-800'
    };
    
    const sourceText = {
      portal: 'Company Portal',
      travel_agent: 'Travel Agent',
      direct_hotel: 'Direct Hotel'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${sourceClasses[source]}`}>
        {sourceText[source]}
      </span>
    );
  };

  // Room type badge
  const RoomTypeBadge = ({ roomType }: { roomType: CorporateHotelBooking['hotelDetails']['roomType'] }) => {
    const typeColors = {
      standard: 'bg-gray-100 text-gray-800',
      deluxe: 'bg-blue-100 text-blue-800',
      suite: 'bg-purple-100 text-purple-800',
      executive: 'bg-amber-100 text-amber-800',
      presidential: 'bg-red-100 text-red-800'
    };
    
    const typeText = {
      standard: 'Standard',
      deluxe: 'Deluxe',
      suite: 'Suite',
      executive: 'Executive',
      presidential: 'Presidential'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[roomType]}`}>
        {typeText[roomType]}
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

  // Format duration
  const formatDuration = (checkIn: string, checkOut: string) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} night${diffDays !== 1 ? 's' : ''}`;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <FiHome className="mr-2" /> Corporate Hotel Bookings
      </h2>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search bookings..."
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
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="checked_in">Checked In</option>
              <option value="checked_out">Checked Out</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Department Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none w-full"
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Departments</option>
              <option value="Senior Management">Senior Management</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
              <option value="Business Development">Business Development</option>
              <option value="IT">IT</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Ref</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package & Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hotel Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stay Info</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-mono text-sm">{booking.bookingReference}</div>
                    <div className="text-xs text-gray-500">
                      {formatDate(booking.bookingDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="font-medium text-blue-600">{booking.packageName}</div>
                      <div className="text-sm font-medium mt-1">{booking.employee.name}</div>
                      <div className="text-xs text-gray-500">
                        {booking.employee.department} • {booking.employee.employeeId}
                      </div>
                      <div className="text-xs mt-1">
                        <span className="font-medium">Purpose:</span> {booking.tripPurpose}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="font-medium">{booking.hotelDetails.name}</div>
                      {booking.hotelDetails.chain && (
                        <div className="text-xs text-gray-500">
                          {booking.hotelDetails.chain}
                        </div>
                      )}
                      <div className="text-sm mt-1">
                        {booking.hotelDetails.location}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.hotelDetails.city}, {booking.hotelDetails.country}
                      </div>
                      {booking.hotelDetails.amenities.length > 0 && (
                        <div className="text-xs mt-1">
                          <span className="font-medium">Amenities:</span> {booking.hotelDetails.amenities.join(', ')}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="text-sm">
                        <span className="font-medium">Check-in:</span> {formatDate(booking.hotelDetails.checkInDate)}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Check-out:</span> {formatDate(booking.hotelDetails.checkOutDate)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDuration(booking.hotelDetails.checkInDate, booking.hotelDetails.checkOutDate)}
                      </div>
                      <div className="mt-1">
                        <RoomTypeBadge roomType={booking.hotelDetails.roomType} />
                      </div>
                      <div className="text-xs">
                        <span className="font-medium">Rooms:</span> {booking.hotelDetails.roomCount}
                      </div>
                      <BookingSourceBadge source={booking.bookingSource} />
                      <div className="text-xs mt-1">
                        <span className="font-medium">Approval:</span> 
                        <ApprovalBadge status={booking.approval.status} />
                      </div>
                      {booking.approval.approvedBy && (
                        <div className="text-xs text-gray-500">
                          {booking.approval.approvedBy}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-lg font-bold">
                        {formatCurrency(booking.payment.amount)}
                      </div>
                      <div className="mt-1">
                        <PaymentMethodBadge method={booking.payment.method} />
                      </div>
                      {booking.payment.transactionId && (
                        <div className="text-xs text-gray-500 mt-1">
                          {booking.payment.transactionId}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <StatusBadge status={booking.status} />
                      {booking.payment.status === 'refunded' && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Refund Processed
                        </span>
                      )}
                      {booking.additionalServices.length > 0 && (
                        <div className="text-xs mt-1">
                          <span className="font-medium">Services:</span> {booking.additionalServices.join(', ')}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <FiEye />
                      </button>
                      <button 
                        className="text-gray-600 hover:text-gray-900"
                        title="View Invoice"
                      >
                        <FiFileText />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  No hotel bookings found matching your criteria
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

export default CorporateHotelBookingsTable;