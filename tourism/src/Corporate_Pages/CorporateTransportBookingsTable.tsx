import { useState } from 'react';
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight, FiEye, FiFileText, FiUser, FiTruck } from 'react-icons/fi';

type CorporateTransportBooking = {
  id: string;
  bookingReference: string;
  tripPurpose: string;
  employee: {
    name: string;
    department: string;
    employeeId: string;
  };
  transportDetails: {
    vehicleType: 'sedan' | 'suv' | 'minivan' | 'bus' | 'luxury' | 'tempo';
    serviceType: 'airport_transfer' | 'city_ride' | 'intercity' | 'event' | 'executive';
    provider: string;
    driver?: {
      name: string;
      contact: string;
    };
    pickup: {
      location: string;
      date: string;
      time: string;
    };
    dropoff: {
      location: string;
      date: string;
      time: string;
    };
    stops?: string[];
    specialRequirements?: string[];
  };
  bookingSource: 'portal' | 'travel_agent' | 'direct_provider';
  payment: {
    method: 'credit_card' | 'corporate_account' | 'bank_transfer' | 'upi';
    amount: number;
    status: 'paid' | 'pending' | 'refunded' | 'failed';
    transactionId?: string;
  };
  bookingDate: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'in_progress' | 'no_show';
  approval: {
    status: 'approved' | 'pending' | 'rejected';
    approvedBy?: string;
    approvalDate?: string;
  };
  additionalServices: string[];
};

const CorporateTransportBookingsTable = () => {
  // Sample corporate transport booking data
  const corporateTransports: CorporateTransportBooking[] = [
    {
      id: 'CTB2023-001',
      bookingReference: 'TRANS-789456',
      tripPurpose: 'Airport Transfer for Client Meeting',
      employee: {
        name: 'Rahul Sharma',
        department: 'Senior Management',
        employeeId: 'EMP-1001'
      },
      transportDetails: {
        vehicleType: 'luxury',
        serviceType: 'airport_transfer',
        provider: 'Meru Cabs',
        driver: {
          name: 'Vijay Kumar',
          contact: '+91 98765 43210'
        },
        pickup: {
          location: 'Taj Mahal Hotel, Mumbai',
          date: '2023-11-15',
          time: '09:00'
        },
        dropoff: {
          location: 'Chhatrapati Shivaji International Airport',
          date: '2023-11-15',
          time: '09:45'
        },
        specialRequirements: ['English Speaking Driver', 'Bottled Water']
      },
      bookingSource: 'portal',
      payment: {
        method: 'corporate_account',
        amount: 2500,
        status: 'paid',
        transactionId: 'TX-789456123'
      },
      bookingDate: '2023-11-10',
      status: 'completed',
      approval: {
        status: 'approved',
        approvedBy: 'Priya Kapoor (CFO)',
        approvalDate: '2023-11-08'
      },
      additionalServices: ['Meet & Greet', 'Flight Tracking']
    },
    {
      id: 'CTB2023-002',
      bookingReference: 'TRANS-321654',
      tripPurpose: 'Team Offsite Transportation',
      employee: {
        name: 'Neha Patel',
        department: 'HR',
        employeeId: 'EMP-2045'
      },
      transportDetails: {
        vehicleType: 'minivan',
        serviceType: 'event',
        provider: 'Corporate Cabs India',
        driver: {
          name: 'Ramesh Singh',
          contact: '+91 98765 12345'
        },
        pickup: {
          location: 'Office - Andheri East',
          date: '2023-12-05',
          time: '08:00'
        },
        dropoff: {
          location: 'Office - Andheri East',
          date: '2023-12-05',
          time: '20:00'
        },
        stops: [
          'Taj Lands End (Team Lunch)',
          'EsselWorld (Team Activity)'
        ],
        specialRequirements: ['12 Seater', 'AC']
      },
      bookingSource: 'travel_agent',
      payment: {
        method: 'credit_card',
        amount: 12000,
        status: 'paid',
        transactionId: 'TX-321654987'
      },
      bookingDate: '2023-11-25',
      status: 'completed',
      approval: {
        status: 'approved',
        approvedBy: 'Vikram Singh (HR Director)',
        approvalDate: '2023-11-22'
      },
      additionalServices: ['Full Day Package', 'Toll Included']
    },
    {
      id: 'CTB2023-003',
      bookingReference: 'TRANS-987123',
      tripPurpose: 'Intercity Travel for Client Visit',
      employee: {
        name: 'Amit Joshi',
        department: 'Sales',
        employeeId: 'EMP-3056'
      },
      transportDetails: {
        vehicleType: 'suv',
        serviceType: 'intercity',
        provider: 'Zoomcar',
        pickup: {
          location: 'Bangalore Office',
          date: '2024-01-10',
          time: '06:00'
        },
        dropoff: {
          location: 'Client Office, Chennai',
          date: '2024-01-10',
          time: '14:00'
        },
        specialRequirements: ['Self Drive', 'GPS Enabled']
      },
      bookingSource: 'direct_provider',
      payment: {
        method: 'corporate_account',
        amount: 8500,
        status: 'pending'
      },
      bookingDate: '2023-12-15',
      status: 'confirmed',
      approval: {
        status: 'approved',
        approvedBy: 'Sanjay Gupta (Sales Head)',
        approvalDate: '2023-12-12'
      },
      additionalServices: ['One Way Trip', 'Fuel Included']
    },
    {
      id: 'CTB2023-004',
      bookingReference: 'TRANS-456789',
      tripPurpose: 'Monthly Client Pickup Service',
      employee: {
        name: 'Priya Reddy',
        department: 'Client Services',
        employeeId: 'EMP-4023'
      },
      transportDetails: {
        vehicleType: 'sedan',
        serviceType: 'city_ride',
        provider: 'Ola Corporate',
        driver: {
          name: 'Arun Mehta',
          contact: '+91 98765 67890'
        },
        pickup: {
          location: 'Client Residence, South Mumbai',
          date: '2023-11-28',
          time: '08:30'
        },
        dropoff: {
          location: 'Client Office, Nariman Point',
          date: '2023-11-28',
          time: '09:15'
        }
      },
      bookingSource: 'portal',
      payment: {
        method: 'upi',
        amount: 1500,
        status: 'paid',
        transactionId: 'TX-456789123'
      },
      bookingDate: '2023-11-05',
      status: 'completed',
      approval: {
        status: 'approved',
        approvedBy: 'Anjali Mehta (CS Head)',
        approvalDate: '2023-11-03'
      },
      additionalServices: ['Monthly Package']
    },
    {
      id: 'CTB2023-005',
      bookingReference: 'TRANS-654321',
      tripPurpose: 'Conference Attendee Transport',
      employee: {
        name: 'Vikram Malhotra',
        department: 'Marketing',
        employeeId: 'EMP-5012'
      },
      transportDetails: {
        vehicleType: 'bus',
        serviceType: 'event',
        provider: 'Sharma Travels',
        pickup: {
          location: 'Hotel Grand Hyatt',
          date: '2023-12-15',
          time: '07:30'
        },
        dropoff: {
          location: 'Conference Center, Bandra Kurla Complex',
          date: '2023-12-15',
          time: '08:15'
        },
        stops: [
          'Hotel Taj Lands End',
          'Hotel Trident'
        ],
        specialRequirements: ['35 Seater', 'TV']
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
      // tripPurpose: 'Conference transport (Event cancelled)',
      approval: {
        status: 'approved',
        approvedBy: 'Rajiv Khanna (Marketing Director)',
        approvalDate: '2023-11-25'
      },
      additionalServices: ['Return Trip']
    },
    {
      id: 'CTB2023-006',
      bookingReference: 'TRANS-135790',
      tripPurpose: 'Executive Day Travel',
      employee: {
        name: 'Sanjay Gupta',
        department: 'IT',
        employeeId: 'EMP-6078'
      },
      transportDetails: {
        vehicleType: 'luxury',
        serviceType: 'executive',
        provider: 'BookMyChauffeur',
        driver: {
          name: 'Sunil Verma',
          contact: '+91 98765 24680'
        },
        pickup: {
          location: 'Executive Residence, Worli',
          date: '2024-02-10',
          time: '07:00'
        },
        dropoff: {
          location: 'Executive Residence, Worli',
          date: '2024-02-10',
          time: '19:00'
        },
        specialRequirements: ['Business Class Vehicle', 'WiFi', 'Newspaper']
      },
      bookingSource: 'travel_agent',
      payment: {
        method: 'corporate_account',
        amount: 15000,
        status: 'paid',
        transactionId: 'TX-135790246'
      },
      bookingDate: '2023-12-20',
      status: 'confirmed',
      approval: {
        status: 'approved',
        approvedBy: 'Naveen Reddy (CIO)',
        approvalDate: '2023-12-18'
      },
      additionalServices: ['12 Hour Package', 'Flexible Schedule']
    }
  ];

  // State management
  const [bookings] = useState<CorporateTransportBooking[]>(corporateTransports);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.transportDetails.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.tripPurpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bookingReference.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || booking.employee.department === departmentFilter;
    const matchesVehicleType = vehicleTypeFilter === 'all' || booking.transportDetails.vehicleType === vehicleTypeFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment && matchesVehicleType;
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
  const StatusBadge = ({ status }: { status: CorporateTransportBooking['status'] }) => {
    const statusClasses = {
      confirmed: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-800',
      in_progress: 'bg-purple-100 text-purple-800',
      no_show: 'bg-gray-100 text-gray-800'
    };
    
    const statusText = {
      confirmed: 'Confirmed',
      pending: 'Pending',
      cancelled: 'Cancelled',
      completed: 'Completed',
      in_progress: 'In Progress',
      no_show: 'No Show'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {statusText[status]}
      </span>
    );
  };

  // Approval status badge
  const ApprovalBadge = ({ status }: { status: CorporateTransportBooking['approval']['status'] }) => {
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
  const PaymentMethodBadge = ({ method }: { method: CorporateTransportBooking['payment']['method'] }) => {
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
  const BookingSourceBadge = ({ source }: { source: CorporateTransportBooking['bookingSource'] }) => {
    const sourceClasses = {
      portal: 'bg-green-100 text-green-800',
      travel_agent: 'bg-orange-100 text-orange-800',
      direct_provider: 'bg-red-100 text-red-800'
    };
    
    const sourceText = {
      portal: 'Company Portal',
      travel_agent: 'Travel Agent',
      direct_provider: 'Direct Provider'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${sourceClasses[source]}`}>
        {sourceText[source]}
      </span>
    );
  };

  // Vehicle type badge
  const VehicleTypeBadge = ({ vehicleType }: { vehicleType: CorporateTransportBooking['transportDetails']['vehicleType'] }) => {
    const typeColors = {
      sedan: 'bg-gray-100 text-gray-800',
      suv: 'bg-blue-100 text-blue-800',
      minivan: 'bg-purple-100 text-purple-800',
      bus: 'bg-amber-100 text-amber-800',
      luxury: 'bg-red-100 text-red-800',
      tempo: 'bg-green-100 text-green-800'
    };
    
    const typeText = {
      sedan: 'Sedan',
      suv: 'SUV',
      minivan: 'Minivan',
      bus: 'Bus',
      luxury: 'Luxury',
      tempo: 'Tempo'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[vehicleType]}`}>
        {typeText[vehicleType]}
      </span>
    );
  };

  // Service type badge
  const ServiceTypeBadge = ({ serviceType }: { serviceType: CorporateTransportBooking['transportDetails']['serviceType'] }) => {
    const typeColors = {
      airport_transfer: 'bg-blue-100 text-blue-800',
      city_ride: 'bg-green-100 text-green-800',
      intercity: 'bg-purple-100 text-purple-800',
      event: 'bg-amber-100 text-amber-800',
      executive: 'bg-red-100 text-red-800'
    };
    
    const typeText = {
      airport_transfer: 'Airport Transfer',
      city_ride: 'City Ride',
      intercity: 'Intercity',
      event: 'Event',
      executive: 'Executive'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[serviceType]}`}>
        {typeText[serviceType]}
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
        <FiTruck className="mr-2" /> Corporate Transport Bookings
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
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no_show">No Show</option>
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
              <option value="HR">HR</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Client Services">Client Services</option>
              <option value="IT">IT</option>
            </select>
          </div>

          {/* Vehicle Type Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiTruck className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none w-full"
              value={vehicleTypeFilter}
              onChange={(e) => {
                setVehicleTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Vehicle Types</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="minivan">Minivan</option>
              <option value="bus">Bus</option>
              <option value="luxury">Luxury</option>
              <option value="tempo">Tempo</option>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trip & Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transport Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
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
                      <div className="font-medium text-blue-600">{booking.tripPurpose}</div>
                      <div className="text-sm font-medium mt-1">{booking.employee.name}</div>
                      <div className="text-xs text-gray-500">
                        {booking.employee.department} • {booking.employee.employeeId}
                      </div>
                      <div className="mt-2">
                        <ServiceTypeBadge serviceType={booking.transportDetails.serviceType} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="font-medium">{booking.transportDetails.provider}</div>
                      <div className="mt-1">
                        <VehicleTypeBadge vehicleType={booking.transportDetails.vehicleType} />
                      </div>
                      {booking.transportDetails.driver && (
                        <div className="text-xs mt-2">
                          <span className="font-medium">Driver:</span> {booking.transportDetails.driver.name}
                          <div className="text-gray-500">{booking.transportDetails.driver.contact}</div>
                        </div>
                      )}
                      {booking.transportDetails.specialRequirements && booking.transportDetails.specialRequirements.length > 0 && (
                        <div className="text-xs mt-1">
                          <span className="font-medium">Requirements:</span> {booking.transportDetails.specialRequirements.join(', ')}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="text-sm">
                        <span className="font-medium">Pickup:</span> {booking.transportDetails.pickup.location}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(booking.transportDetails.pickup.date)} at {booking.transportDetails.pickup.time}
                      </div>
                      <div className="text-sm mt-2">
                        <span className="font-medium">Dropoff:</span> {booking.transportDetails.dropoff.location}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(booking.transportDetails.dropoff.date)} at {booking.transportDetails.dropoff.time}
                      </div>
                      {booking.transportDetails.stops && booking.transportDetails.stops.length > 0 && (
                        <div className="text-xs mt-2">
                          <span className="font-medium">Stops:</span> {booking.transportDetails.stops.join(' → ')}
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
                      <div className="mt-2">
                        <BookingSourceBadge source={booking.bookingSource} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <StatusBadge status={booking.status} />
                      <div className="mt-1">
                        <ApprovalBadge status={booking.approval.status} />
                      </div>
                      {booking.approval.approvedBy && (
                        <div className="text-xs text-gray-500">
                          {booking.approval.approvedBy}
                        </div>
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
                  No transport bookings found matching your criteria
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

export default CorporateTransportBookingsTable;