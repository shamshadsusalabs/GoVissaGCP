import { useState, useMemo } from 'react';
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight, FiEdit, FiTrash2, FiHome, FiUser, FiCalendar, FiDollarSign, FiBriefcase, FiCreditCard } from 'react-icons/fi';

type CorporateHotelBooking = {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  company: string;
  employeeId: string;
  department: string;
  costCenter: string;
  hotelName: string;
  roomType: string;
  corporateRate: boolean;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  totalAmount: number;
  billing: 'company' | 'personal' | 'split';
  paymentMethod: 'company-account' | 'credit-card' | 'invoice';
  status: 'confirmed' | 'pending' | 'cancelled' | 'checked-in' | 'checked-out' | 'approved' | 'rejected';
  bookingDate: string;
  approver: string;
  purpose: string;
};

const CorporateHotelBookings = () => {
  // Sample corporate hotel booking data
  const initialBookings: CorporateHotelBooking[] = [
    {
      id: 'CHB001',
      guestName: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '+91 9876543210',
      company: 'Tech Solutions Inc.',
      employeeId: 'TSI-EMP-1024',
      department: 'Sales',
      costCenter: 'SALES-APAC',
      hotelName: 'Taj Mahal Palace',
      roomType: 'Deluxe Sea View',
      corporateRate: true,
      checkIn: '2023-06-15',
      checkOut: '2023-06-20',
      nights: 5,
      adults: 2,
      children: 0,
      totalAmount: 38250, // Discounted corporate rate
      billing: 'company',
      paymentMethod: 'company-account',
      status: 'approved',
      bookingDate: '2023-05-10',
      approver: 'Priya Patel (Manager)',
      purpose: 'Client meeting and sales pitch'
    },
    {
      id: 'CHB002',
      guestName: 'Neha Gupta',
      email: 'neha.gupta@example.com',
      phone: '+91 8765432109',
      company: 'Global Finance Corp',
      employeeId: 'GFC-EMP-2048',
      department: 'Finance',
      costCenter: 'FIN-GLOBAL',
      hotelName: 'Oberoi Udaivilas',
      roomType: 'Luxury Suite',
      corporateRate: true,
      checkIn: '2023-07-10',
      checkOut: '2023-07-15',
      nights: 5,
      adults: 1,
      children: 0,
      totalAmount: 78750, // Discounted corporate rate
      billing: 'company',
      paymentMethod: 'company-account',
      status: 'checked-in',
      bookingDate: '2023-06-01',
      approver: 'Amit Singh (Director)',
      purpose: 'Regional financial review'
    },
    {
      id: 'CHB003',
      guestName: 'Vikram Joshi',
      email: 'vikram.joshi@example.com',
      phone: '+91 7654321098',
      company: 'Innovatech Solutions',
      employeeId: 'ITS-EMP-3072',
      department: 'Engineering',
      costCenter: 'ENG-PRODUCT',
      hotelName: 'Leela Palace',
      roomType: 'Executive Room',
      corporateRate: false,
      checkIn: '2023-08-05',
      checkOut: '2023-08-08',
      nights: 3,
      adults: 1,
      children: 0,
      totalAmount: 28500,
      billing: 'split',
      paymentMethod: 'credit-card',
      status: 'pending',
      bookingDate: '2023-07-20',
      approver: 'Pending approval',
      purpose: 'Tech conference attendance'
    },
    {
      id: 'CHB004',
      guestName: 'Priya Patel',
      email: 'priya.patel@example.com',
      phone: '+91 6543210987',
      company: 'Tech Solutions Inc.',
      employeeId: 'TSI-EMP-1025',
      department: 'Management',
      costCenter: 'MGMT-APAC',
      hotelName: 'ITC Grand Chola',
      roomType: 'Premium Room',
      corporateRate: true,
      checkIn: '2023-06-22',
      checkOut: '2023-06-25',
      nights: 3,
      adults: 1,
      children: 0,
      totalAmount: 25920, // Discounted corporate rate
      billing: 'company',
      paymentMethod: 'company-account',
      status: 'checked-out',
      bookingDate: '2023-05-15',
      approver: 'CEO Office',
      purpose: 'Leadership summit'
    },
    {
      id: 'CHB005',
      guestName: 'Amit Singh',
      email: 'amit.singh@example.com',
      phone: '+91 9432109876',
      company: 'Global Finance Corp',
      employeeId: 'GFC-EMP-2049',
      department: 'HR',
      costCenter: 'HR-GLOBAL',
      hotelName: 'JW Marriott',
      roomType: 'Standard Room',
      corporateRate: true,
      checkIn: '2023-07-18',
      checkOut: '2023-07-20',
      nights: 2,
      adults: 1,
      children: 0,
      totalAmount: 12640, // Discounted corporate rate
      billing: 'personal',
      paymentMethod: 'credit-card',
      status: 'rejected',
      bookingDate: '2023-06-25',
      approver: 'HR Director',
      purpose: 'Recruitment drive - rejected as virtual option available'
    },
  ];

  // State management
  const [bookings] = useState<CorporateHotelBooking[]>(initialBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [billingFilter, setBillingFilter] = useState<string>('all');
  const [corporateRateFilter, setCorporateRateFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof CorporateHotelBooking; direction: 'ascending' | 'descending' } | null>(null);
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
        booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.phone.includes(searchTerm) ||
        booking.hotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.roomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.costCenter.toLowerCase().includes(searchTerm.toLowerCase())
      );
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
  }, [bookings, searchTerm, statusFilter, companyFilter, departmentFilter, billingFilter, corporateRateFilter, sortConfig]);

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredBookings, itemsPerPage]);

  // Sort request
  const requestSort = (key: keyof CorporateHotelBooking) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Status badge component
  const StatusBadge = ({ status }: { status: CorporateHotelBooking['status'] }) => {
    const statusClasses = {
      confirmed: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      'checked-in': 'bg-green-100 text-green-800',
      'checked-out': 'bg-purple-100 text-purple-800',
      approved: 'bg-teal-100 text-teal-800',
      rejected: 'bg-pink-100 text-pink-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-')}
      </span>
    );
  };

  // Billing badge component
  const BillingBadge = ({ billing }: { billing: CorporateHotelBooking['billing'] }) => {
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
        <h2 className="text-2xl font-bold text-gray-800">Corporate Hotel Bookings</h2>
        
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
            <option value="checked-in">Checked In</option>
            <option value="checked-out">Checked Out</option>
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
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Billing & Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Guests/Room
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
                      <div className="font-medium text-gray-900">{booking.hotelName}</div>
                      <div className="text-sm text-gray-600">{booking.roomType}</div>
                      <div className="text-xs text-gray-500">
                        {booking.corporateRate ? (
                          <span className="text-green-600">Corporate Rate Applied</span>
                        ) : (
                          <span className="text-gray-500">Standard Rate</span>
                        )}
                      </div>
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
                      <div className="text-xs mt-1">
                        <span className="font-medium">Purpose:</span> {booking.purpose}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {formatCurrency(booking.totalAmount)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {booking.billing === 'company' ? 'Company paid' : 
                       booking.billing === 'personal' ? 'Personal paid' : 'Split payment'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {booking.paymentMethod === 'company-account' ? 'Company account' : 
                       booking.paymentMethod === 'credit-card' ? 'Credit card' : 'Invoice'}
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="font-medium text-gray-900">
                        {booking.adults + booking.children} Guest{booking.adults + booking.children !== 1 ? 's' : ''}
                      </div>
                      <div className="text-sm text-gray-600">
                        {booking.adults} Adult{booking.adults !== 1 ? 's' : ''}
                        {booking.children > 0 && (
                          <span>, {booking.children} Child{booking.children !== 1 ? 'ren' : ''}</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        1 Room ({booking.roomType})
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
                    <div className="text-xs text-gray-500 mt-2">
                      Booked on: {formatDate(booking.bookingDate)}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                  No corporate hotel bookings found
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

export default CorporateHotelBookings;