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
  FiBriefcase,
  FiCreditCard,
  FiDollarSign
} from 'react-icons/fi';
import { FaCar, FaBus } from 'react-icons/fa';

type CorporateTransportBooking = {
  id: string;
  bookingType: 'bus' | 'taxi';
  passengerName: string;
  email: string;
  phone: string;
  company: string;
  employeeId: string;
  department: string;
  costCenter: string;
  pickupLocation: string;
  dropLocation: string;
  bookingDate: string;
  travelDate: string;
  vehicleDetails: string;
  seats: number;
  fare: number;
  corporateRate: boolean;
  discountApplied: number;
  billing: 'company' | 'personal' | 'split';
  paymentMethod: 'company-account' | 'credit-card' | 'debit-card' | 'upi' | 'wallet' | 'cash';
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'approved' | 'rejected';
  approver: string;
  purpose: string;
};

const CorporateTransportBookings = () => {
  // Sample corporate transport booking data
  const initialBookings: CorporateTransportBooking[] = [
    {
      id: 'CTB001',
      bookingType: 'bus',
      passengerName: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '+91 9876543210',
      company: 'Tech Solutions Inc.',
      employeeId: 'TSI-EMP-1024',
      department: 'Sales',
      costCenter: 'SALES-APAC',
      pickupLocation: 'Delhi, ISBT Kashmere Gate',
      dropLocation: 'Manali, Bus Stand',
      bookingDate: '2023-05-10',
      travelDate: '2023-06-15',
      vehicleDetails: 'Volvo AC Sleeper (HR-45-AB-1234)',
      seats: 2,
      fare: 3500,
      corporateRate: true,
      discountApplied: 15,
      billing: 'company',
      paymentMethod: 'company-account',
      status: 'approved',
      approver: 'Priya Patel (Manager)',
      purpose: 'Client meeting and sales pitch'
    },
    {
      id: 'CTB002',
      bookingType: 'taxi',
      passengerName: 'Priya Patel',
      email: 'priya.patel@example.com',
      phone: '+91 8765432109',
      company: 'Global Finance Corp',
      employeeId: 'GFC-EMP-2048',
      department: 'Finance',
      costCenter: 'FIN-GLOBAL',
      pickupLocation: 'Mumbai Airport (T2)',
      dropLocation: 'Juhu, Hotel Grand',
      bookingDate: '2023-06-01',
      travelDate: '2023-07-10',
      vehicleDetails: 'Toyota Innova (MH-01-AB-5678)',
      seats: 4,
      fare: 1200,
      corporateRate: true,
      discountApplied: 10,
      billing: 'company',
      paymentMethod: 'company-account',
      status: 'completed',
      approver: 'Amit Singh (Director)',
      purpose: 'Airport transfer for visiting executives'
    },
    {
      id: 'CTB003',
      bookingType: 'bus',
      passengerName: 'Amit Singh',
      email: 'amit.singh@example.com',
      phone: '+91 7654321098',
      company: 'Innovatech Solutions',
      employeeId: 'ITS-EMP-3072',
      department: 'Engineering',
      costCenter: 'ENG-PRODUCT',
      pickupLocation: 'Bangalore, Majestic Bus Stand',
      dropLocation: 'Chennai, CMBT',
      bookingDate: '2023-07-20',
      travelDate: '2023-08-05',
      vehicleDetails: 'Non-AC Seater (KA-05-AB-9012)',
      seats: 1,
      fare: 850,
      corporateRate: false,
      discountApplied: 0,
      billing: 'personal',
      paymentMethod: 'wallet',
      status: 'pending',
      approver: 'Pending approval',
      purpose: 'Tech conference attendance'
    },
    {
      id: 'CTB004',
      bookingType: 'taxi',
      passengerName: 'Neha Gupta',
      email: 'neha.gupta@example.com',
      phone: '+91 6543210987',
      company: 'Tech Solutions Inc.',
      employeeId: 'TSI-EMP-1025',
      department: 'Management',
      costCenter: 'MGMT-APAC',
      pickupLocation: 'Hyderabad, Hitech City',
      dropLocation: 'Hyderabad Airport',
      bookingDate: '2023-05-15',
      travelDate: '2023-06-22',
      vehicleDetails: 'Swift Dzire (TS-10-AB-3456)',
      seats: 3,
      fare: 650,
      corporateRate: true,
      discountApplied: 20,
      billing: 'split',
      paymentMethod: 'credit-card',
      status: 'cancelled',
      approver: 'CEO Office',
      purpose: 'Airport transfer - trip cancelled'
    },
    {
      id: 'CTB005',
      bookingType: 'bus',
      passengerName: 'Vikram Joshi',
      email: 'vikram.joshi@example.com',
      phone: '+91 9432109876',
      company: 'Global Finance Corp',
      employeeId: 'GFC-EMP-2049',
      department: 'HR',
      costCenter: 'HR-GLOBAL',
      pickupLocation: 'Jaipur, Sindhi Camp',
      dropLocation: 'Udaipur, RSRTC Depot',
      bookingDate: '2023-06-25',
      travelDate: '2023-07-18',
      vehicleDetails: 'AC Seater (RJ-14-AB-7890)',
      seats: 2,
      fare: 1100,
      corporateRate: true,
      discountApplied: 12,
      billing: 'company',
      paymentMethod: 'company-account',
      status: 'rejected',
      approver: 'HR Director',
      purpose: 'Recruitment drive - virtual option available'
    },
  ];

  // State management
  const [bookings] = useState<CorporateTransportBooking[]>(initialBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'bus' | 'taxi'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [billingFilter, setBillingFilter] = useState<string>('all');
  const [corporateRateFilter, setCorporateRateFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof CorporateTransportBooking; direction: 'ascending' | 'descending' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Get unique values for filters
  const companies = useMemo(() => Array.from(new Set(bookings.map(b => b.company))), [bookings]);
  const departments = useMemo(() => Array.from(new Set(bookings.map(b => b.department))), [bookings]);

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
        booking.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.costCenter.toLowerCase().includes(searchTerm.toLowerCase())
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
    
    // Apply company filter
    if (companyFilter !== 'all') {
      result = result.filter(booking => booking.company === companyFilter);
    }
    
    // Apply department filter
    if (departmentFilter !== 'all') {
      result = result.filter(booking => booking.department === departmentFilter);
    }
    
    // Apply billing filter
    if (billingFilter !== 'all') {
      result = result.filter(booking => booking.billing === billingFilter);
    }
    
    // Apply corporate rate filter
    if (corporateRateFilter !== 'all') {
      const filterValue = corporateRateFilter === 'yes';
      result = result.filter(booking => booking.corporateRate === filterValue);
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
  }, [bookings, searchTerm, typeFilter, statusFilter, companyFilter, departmentFilter, billingFilter, corporateRateFilter, sortConfig]);

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredBookings, itemsPerPage]);

  // Sort request
  const requestSort = (key: keyof CorporateTransportBooking) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Status badge component
  const StatusBadge = ({ status }: { status: CorporateTransportBooking['status'] }) => {
    const statusClasses = {
      confirmed: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-800',
      approved: 'bg-teal-100 text-teal-800',
      rejected: 'bg-pink-100 text-pink-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Billing badge component
  const BillingBadge = ({ billing }: { billing: CorporateTransportBooking['billing'] }) => {
    const billingClasses = {
      company: 'bg-indigo-100 text-indigo-800',
      personal: 'bg-gray-100 text-gray-800',
      split: 'bg-orange-100 text-orange-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${billingClasses[billing]}`}>
        {billing.charAt(0).toUpperCase() + billing.slice(1)}
      </span>
    );
  };

  // Payment method badge
  const PaymentBadge = ({ method }: { method: CorporateTransportBooking['paymentMethod'] }) => {
    const methodClasses = {
      'company-account': 'bg-purple-100 text-purple-800',
      'credit-card': 'bg-indigo-100 text-indigo-800',
      'debit-card': 'bg-blue-100 text-blue-800',
      upi: 'bg-teal-100 text-teal-800',
      wallet: 'bg-amber-100 text-amber-800',
      cash: 'bg-gray-100 text-gray-800'
    };
    
    const methodText = {
      'company-account': 'Company Account',
      'credit-card': 'Credit Card',
      'debit-card': 'Debit Card',
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
        <h2 className="text-2xl font-bold text-gray-800">Corporate Transport Bookings</h2>
        
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
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
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
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Company Filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiBriefcase className="text-gray-400" />
          </div>
          <select
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none w-full"
            value={companyFilter}
            onChange={(e) => {
              setCompanyFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Companies</option>
            {companies.map(company => (
              <option key={company} value={company}>{company}</option>
            ))}
          </select>
        </div>

        {/* Department Filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiUser className="text-gray-400" />
          </div>
          <select
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none w-full"
            value={departmentFilter}
            onChange={(e) => {
              setDepartmentFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Billing Filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiCreditCard className="text-gray-400" />
          </div>
          <select
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none w-full"
            value={billingFilter}
            onChange={(e) => {
              setBillingFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Billing Types</option>
            <option value="company">Company</option>
            <option value="personal">Personal</option>
            <option value="split">Split</option>
          </select>
        </div>

        {/* Corporate Rate Filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiDollarSign className="text-gray-400" />
          </div>
          <select
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none w-full"
            value={corporateRateFilter}
            onChange={(e) => {
              setCorporateRateFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Rate Types</option>
            <option value="yes">Corporate Rate</option>
            <option value="no">Standard Rate</option>
          </select>
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
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('company')}
              >
                <div className="flex items-center">
                  <FiBriefcase className="mr-1" />
                  Company
                  {sortConfig?.key === 'company' && (
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
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('fare')}
              >
                <div className="flex items-center">
                  <FiDollarSign className="mr-1" />
                  Fare
                  {sortConfig?.key === 'fare' && (
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
                Billing & Status
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
                      <div className="text-xs text-gray-400 mt-1">
                        ID: {booking.employeeId}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="font-medium text-gray-900">{booking.company}</div>
                      <div className="text-sm text-gray-600">{booking.department}</div>
                      <div className="text-xs text-gray-500">
                        CC: {booking.costCenter}
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
                      <div className="text-xs mt-1">
                        <span className="font-medium">Purpose:</span> {booking.purpose}
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {formatCurrency(booking.fare)}
                    </div>
                    {booking.corporateRate && (
                      <div className="text-xs text-green-600">
                        {booking.discountApplied}% corporate discount
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      {booking.seats} seat{booking.seats !== 1 ? 's' : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-2">
                      <BillingBadge billing={booking.billing} />
                      <StatusBadge status={booking.status} />
                      {booking.approver && (
                        <div className="text-xs text-gray-500 mt-1">
                          Approver: {booking.approver}
                        </div>
                      )}
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
                    <div className="text-xs text-gray-500 mt-2">
                      <PaymentBadge method={booking.paymentMethod} />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                  No corporate transport bookings found
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

export default CorporateTransportBookings;