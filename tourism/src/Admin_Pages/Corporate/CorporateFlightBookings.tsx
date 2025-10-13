import { useState, useMemo } from 'react';
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight, FiEdit, FiTrash2, FiCalendar, FiBriefcase, FiCreditCard, FiDollarSign } from 'react-icons/fi';

type CorporateFlightBooking = {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  flightNumber: string;
  departure: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  passengers: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'group';
  price: number;
  corporateDiscount: number;
  billing: 'company' | 'personal' | 'split';
  paymentMethod: 'company-account' | 'credit-card' | 'invoice';
  bookingDate: string;
  approver: string;
  purpose: string;
};

const CorporateFlightBookings = () => {
  // Sample corporate flight booking data with billing info
  const initialBookings: CorporateFlightBooking[] = [
    {
      id: 'CFB001',
      companyName: 'Tech Solutions Inc.',
      contactPerson: 'Rahul Sharma',
      email: 'rahul@techsolutions.com',
      flightNumber: 'AI-202',
      departure: 'Delhi (DEL)',
      destination: 'Mumbai (BOM)',
      departureDate: '2023-06-15',
      returnDate: '2023-06-20',
      passengers: 5,
      status: 'group',
      price: 37500,
      corporateDiscount: 15,
      billing: 'company',
      paymentMethod: 'company-account',
      bookingDate: '2023-05-10',
      approver: 'Finance Department',
      purpose: 'Team offsite meeting'
    },
    {
      id: 'CFB002',
      companyName: 'Global Logistics',
      contactPerson: 'Priya Patel',
      email: 'priya@globallogistics.com',
      flightNumber: 'SG-456',
      departure: 'Bangalore (BLR)',
      destination: 'Dubai (DXB)',
      departureDate: '2023-07-10',
      returnDate: '2023-07-25',
      passengers: 3,
      status: 'confirmed',
      price: 67500,
      corporateDiscount: 10,
      billing: 'split',
      paymentMethod: 'credit-card',
      bookingDate: '2023-06-01',
      approver: 'Travel Desk',
      purpose: 'Client visit and contract signing'
    },
    {
      id: 'CFB003',
      companyName: 'MediCare Hospitals',
      contactPerson: 'Amit Singh',
      email: 'amit@medicare.com',
      flightNumber: 'UK-789',
      departure: 'Mumbai (BOM)',
      destination: 'London (LHR)',
      departureDate: '2023-08-05',
      returnDate: '2023-09-05',
      passengers: 8,
      status: 'group',
      price: 388000,
      corporateDiscount: 20,
      billing: 'company',
      paymentMethod: 'invoice',
      bookingDate: '2023-07-20',
      approver: 'CEO Office',
      purpose: 'Medical conference attendance'
    },
    {
      id: 'CFB004',
      companyName: 'FinEdge Capital',
      contactPerson: 'Neha Gupta',
      email: 'neha@finedge.com',
      flightNumber: 'EM-321',
      departure: 'Chennai (MAA)',
      destination: 'Singapore (SIN)',
      departureDate: '2023-06-22',
      returnDate: '2023-06-30',
      passengers: 2,
      status: 'confirmed',
      price: 37400,
      corporateDiscount: 10,
      billing: 'personal',
      paymentMethod: 'credit-card',
      bookingDate: '2023-05-15',
      approver: 'Manager',
      purpose: 'Investor meetings'
    },
    {
      id: 'CFB005',
      companyName: 'BuildRight Constructions',
      contactPerson: 'Vikram Joshi',
      email: 'vikram@buildright.com',
      flightNumber: 'QA-112',
      departure: 'Hyderabad (HYD)',
      destination: 'Doha (DOH)',
      departureDate: '2023-07-18',
      returnDate: '2023-07-25',
      passengers: 6,
      status: 'cancelled',
      price: 99000,
      corporateDiscount: 15,
      billing: 'company',
      paymentMethod: 'company-account',
      bookingDate: '2023-06-25',
      approver: 'HR Director',
      purpose: 'Project site visit - cancelled due to delay'
    },
    {
      id: 'CFB006',
      companyName: 'EduSmart Academy',
      contactPerson: 'Ananya Reddy',
      email: 'ananya@edusmart.com',
      flightNumber: 'AI-304',
      departure: 'Kolkata (CCU)',
      destination: 'Delhi (DEL)',
      departureDate: '2023-08-12',
      returnDate: '2023-08-15',
      passengers: 4,
      status: 'pending',
      price: 26000,
      corporateDiscount: 10,
      billing: 'company',
      paymentMethod: 'company-account',
      bookingDate: '2023-07-30',
      approver: 'Pending approval',
      purpose: 'Educational conference'
    },
  ];

  // State management
  const [bookings] = useState<CorporateFlightBooking[]>(initialBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [billingFilter, setBillingFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof CorporateFlightBooking; direction: 'ascending' | 'descending' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Get unique values for filters
  const companies = useMemo(() => Array.from(new Set(bookings.map(b => b.companyName))), [bookings]);

  // Filter and sort bookings
  const filteredBookings = useMemo(() => {
    let result = [...bookings];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(booking =>
        booking.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.departure.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.destination.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(booking => booking.status === statusFilter);
    }
    
    // Apply company filter
    if (companyFilter !== 'all') {
      result = result.filter(booking => booking.companyName === companyFilter);
    }
    
    // Apply billing filter
    if (billingFilter !== 'all') {
      result = result.filter(booking => booking.billing === billingFilter);
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
  }, [bookings, searchTerm, statusFilter, companyFilter, billingFilter, sortConfig]);

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredBookings, itemsPerPage]);

  // Sort request
  const requestSort = (key: keyof CorporateFlightBooking) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Status badge component
  const StatusBadge = ({ status }: { status: CorporateFlightBooking['status'] }) => {
    const statusClasses = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      group: 'bg-purple-100 text-purple-800'
    };
    
    const statusText = {
      confirmed: 'Confirmed',
      pending: 'Pending',
      cancelled: 'Cancelled',
      group: 'Group Booking'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {statusText[status]}
      </span>
    );
  };

  // Billing badge component
  const BillingBadge = ({ billing }: { billing: CorporateFlightBooking['billing'] }) => {
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

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Calculate final price after discount
  const calculateFinalPrice = (price: number, discount: number) => {
    return price - (price * discount / 100);
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
        <h2 className="text-2xl font-bold text-gray-800">Corporate Flight Bookings</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search corporate bookings..."
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
            <option value="group">Group Booking</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
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
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('companyName')}
              >
                <div className="flex items-center">
                  <FiBriefcase className="mr-1" />
                  Company
                  {sortConfig?.key === 'companyName' && (
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
                Contact Details
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
                onClick={() => requestSort('passengers')}
              >
                Passengers
                {sortConfig?.key === 'passengers' && (
                  <span className="ml-1">
                    {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('price')}
              >
                <div className="flex items-center">
                  <FiDollarSign className="mr-1" />
                  Price
                  {sortConfig?.key === 'price' && (
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
                    <div className="font-medium text-gray-900">{booking.companyName}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Booked on: {formatDate(booking.bookingDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="text-sm text-gray-900">{booking.contactPerson}</div>
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
                      <div className="text-xs text-gray-500 mt-1">
                        Purpose: {booking.purpose}
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
                    <div className="text-sm text-gray-900">
                      {booking.passengers}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(calculateFinalPrice(booking.price, booking.corporateDiscount))}
                      </div>
                      <div className="text-xs text-gray-500">
                        <span className="line-through">{formatCurrency(booking.price)}</span>
                        <span className="ml-1 text-green-600">({booking.corporateDiscount}% off)</span>
                      </div>
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
                      <div className="text-xs text-gray-500">
                        {booking.paymentMethod === 'company-account' ? 'Company account' : 
                         booking.paymentMethod === 'credit-card' ? 'Credit card' : 'Invoice'}
                      </div>
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
                  No corporate flight bookings found
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

export default CorporateFlightBookings;