import { useState } from 'react';
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight, FiEye, FiFileText,  FiUser,  FiGlobe } from 'react-icons/fi';

type CorporateFlightBooking = {
  id: string;
  bookingReference: string;
  packageName: string;
  employee: {
    name: string;
    department: string;
    employeeId: string;
  };
  flightDetails: {
    airline: string;
    flightNumber: string;
    departure: string;
    destination: string;
    departureDate: string;
    returnDate: string;
    cabinClass: 'economy' | 'premium' | 'business' | 'first';
  };
  bookingSource: 'portal' | 'travel_agent' | 'direct_airline';
  payment: {
    method: 'credit_card' | 'corporate_account' | 'bank_transfer' | 'upi';
    amount: number;
    status: 'paid' | 'pending' | 'refunded' | 'failed';
    transactionId?: string;
  };
  bookingDate: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  tripPurpose: string;
  approval: {
    status: 'approved' | 'pending' | 'rejected';
    approvedBy?: string;
    approvalDate?: string;
  };
  additionalServices: string[];
};

const CorporateFlightBookingsTable = () => {
  // Sample corporate flight booking data
  const corporateFlights: CorporateFlightBooking[] = [
    {
      id: 'CFB2023-001',
      bookingReference: 'AIR-789456',
      packageName: 'Maldives Executive Retreat',
      employee: {
        name: 'Rahul Sharma',
        department: 'Senior Management',
        employeeId: 'EMP-1001'
      },
      flightDetails: {
        airline: 'Emirates',
        flightNumber: 'EK-502',
        departure: 'Delhi (DEL)',
        destination: 'Male (MLE)',
        departureDate: '2023-11-15',
        returnDate: '2023-11-22',
        cabinClass: 'business'
      },
      bookingSource: 'travel_agent',
      payment: {
        method: 'corporate_account',
        amount: 125000,
        status: 'paid',
        transactionId: 'TX-789456123'
      },
      bookingDate: '2023-10-20',
      status: 'confirmed',
      tripPurpose: 'Leadership strategy retreat',
      approval: {
        status: 'approved',
        approvedBy: 'Priya Kapoor (CFO)',
        approvalDate: '2023-10-18'
      },
      additionalServices: ['Lounge Access', 'Priority Boarding', 'Extra Baggage']
    },
    {
      id: 'CFB2023-002',
      bookingReference: 'AIR-321654',
      packageName: 'Europe Sales Conference',
      employee: {
        name: 'Neha Patel',
        department: 'Sales',
        employeeId: 'EMP-2045'
      },
      flightDetails: {
        airline: 'Lufthansa',
        flightNumber: 'LH-761',
        departure: 'Mumbai (BOM)',
        destination: 'Frankfurt (FRA)',
        departureDate: '2023-12-05',
        returnDate: '2023-12-12',
        cabinClass: 'premium'
      },
      bookingSource: 'portal',
      payment: {
        method: 'credit_card',
        amount: 89500,
        status: 'paid',
        transactionId: 'TX-321654987'
      },
      bookingDate: '2023-11-10',
      status: 'confirmed',
      tripPurpose: 'Annual sales conference attendance',
      approval: {
        status: 'approved',
        approvedBy: 'Vikram Singh (Sales Director)',
        approvalDate: '2023-11-08'
      },
      additionalServices: ['Seat Selection', 'Travel Insurance']
    },
    {
      id: 'CFB2023-003',
      bookingReference: 'AIR-987123',
      packageName: 'US Client Pitch',
      employee: {
        name: 'Amit Joshi',
        department: 'Business Development',
        employeeId: 'EMP-3056'
      },
      flightDetails: {
        airline: 'United Airlines',
        flightNumber: 'UA-48',
        departure: 'Bangalore (BLR)',
        destination: 'San Francisco (SFO)',
        departureDate: '2024-01-10',
        returnDate: '2024-01-18',
        cabinClass: 'business'
      },
      bookingSource: 'direct_airline',
      payment: {
        method: 'corporate_account',
        amount: 215000,
        status: 'pending'
      },
      bookingDate: '2023-12-15',
      status: 'pending',
      tripPurpose: 'Client acquisition pitch for TechCo account',
      approval: {
        status: 'pending'
      },
      additionalServices: ['Fast Track', 'Premium Meal']
    },
    {
      id: 'CFB2023-004',
      bookingReference: 'AIR-456789',
      packageName: 'APAC Regional Meet',
      employee: {
        name: 'Priya Reddy',
        department: 'Marketing',
        employeeId: 'EMP-4023'
      },
      flightDetails: {
        airline: 'Singapore Airlines',
        flightNumber: 'SQ-402',
        departure: 'Chennai (MAA)',
        destination: 'Singapore (SIN)',
        departureDate: '2023-11-28',
        returnDate: '2023-12-02',
        cabinClass: 'economy'
      },
      bookingSource: 'portal',
      payment: {
        method: 'upi',
        amount: 48500,
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
      additionalServices: []
    },
    {
      id: 'CFB2023-005',
      bookingReference: 'AIR-654321',
      packageName: 'Domestic Quarterly Review',
      employee: {
        name: 'Vikram Malhotra',
        department: 'Finance',
        employeeId: 'EMP-5012'
      },
      flightDetails: {
        airline: 'IndiGo',
        flightNumber: '6E-205',
        departure: 'Delhi (DEL)',
        destination: 'Bangalore (BLR)',
        departureDate: '2023-12-15',
        returnDate: '2023-12-17',
        cabinClass: 'economy'
      },
      bookingSource: 'portal',
      payment: {
        method: 'bank_transfer',
        amount: 18500,
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
      additionalServices: ['Flexi Ticket']
    }
  ];

  // State management
  const [bookings] = useState<CorporateFlightBooking[]>(corporateFlights);
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
      booking.flightDetails.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
  const StatusBadge = ({ status }: { status: CorporateFlightBooking['status'] }) => {
    const statusClasses = {
      confirmed: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-800'
    };
    
    const statusText = {
      confirmed: 'Confirmed',
      pending: 'Pending',
      cancelled: 'Cancelled',
      completed: 'Completed'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {statusText[status]}
      </span>
    );
  };

  // Approval status badge
  const ApprovalBadge = ({ status }: { status: CorporateFlightBooking['approval']['status'] }) => {
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
  const PaymentMethodBadge = ({ method }: { method: CorporateFlightBooking['payment']['method'] }) => {
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
  const BookingSourceBadge = ({ source }: { source: CorporateFlightBooking['bookingSource'] }) => {
    const sourceClasses = {
      portal: 'bg-green-100 text-green-800',
      travel_agent: 'bg-orange-100 text-orange-800',
      direct_airline: 'bg-red-100 text-red-800'
    };
    
    const sourceText = {
      portal: 'Company Portal',
      travel_agent: 'Travel Agent',
      direct_airline: 'Direct Airline'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${sourceClasses[source]}`}>
        {sourceText[source]}
      </span>
    );
  };

  // Cabin class badge
  const CabinClassBadge = ({ cabinClass }: { cabinClass: CorporateFlightBooking['flightDetails']['cabinClass'] }) => {
    const classColors = {
      economy: 'bg-gray-100 text-gray-800',
      premium: 'bg-blue-100 text-blue-800',
      business: 'bg-purple-100 text-purple-800',
      first: 'bg-amber-100 text-amber-800'
    };
    
    const classText = {
      economy: 'Economy',
      premium: 'Premium Economy',
      business: 'Business',
      first: 'First Class'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${classColors[cabinClass]}`}>
        {classText[cabinClass]}
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
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <FiGlobe className="mr-2" /> Corporate Flight Bookings
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flight Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Info</th>
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
                      <div className="flex items-center">
                        <span className="font-medium">{booking.flightDetails.airline}</span>
                        <span className="mx-2">•</span>
                        <span className="font-mono">{booking.flightDetails.flightNumber}</span>
                      </div>
                      <div className="text-sm mt-1">
                        <span className="text-gray-900">{booking.flightDetails.departure}</span>
                        <span className="mx-2">→</span>
                        <span className="text-gray-900">{booking.flightDetails.destination}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        <span className="font-medium">Depart:</span> {formatDate(booking.flightDetails.departureDate)}
                      </div>
                      {booking.flightDetails.returnDate && (
                        <div className="text-xs text-gray-500">
                          <span className="font-medium">Return:</span> {formatDate(booking.flightDetails.returnDate)}
                        </div>
                      )}
                      <div className="mt-1">
                        <CabinClassBadge cabinClass={booking.flightDetails.cabinClass} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <BookingSourceBadge source={booking.bookingSource} />
                      <div className="text-xs mt-2">
                        <span className="font-medium">Approval:</span> 
                        <ApprovalBadge status={booking.approval.status} />
                      </div>
                      {booking.approval.approvedBy && (
                        <div className="text-xs text-gray-500">
                          {booking.approval.approvedBy}
                        </div>
                      )}
                      {booking.additionalServices.length > 0 && (
                        <div className="text-xs mt-2">
                          <span className="font-medium">Services:</span> {booking.additionalServices.join(', ')}
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
                  No flight bookings found matching your criteria
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

export default CorporateFlightBookingsTable;