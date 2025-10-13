import { useState, useMemo } from 'react';
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight, FiEdit, FiTrash2, FiBriefcase } from 'react-icons/fi';

type CorporateUser = {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  contactNumber: string;
  industry: string;
  registrationDate: string;
  status: 'active' | 'inactive' | 'pending' | 'verified';
  employeesCount: number;
};

const AllCorporateUsers = () => {
  // Sample corporate user data
  const initialCorporateUsers: CorporateUser[] = [
    {
      id: 'CU001',
      companyName: 'Tech Solutions Inc.',
      contactPerson: 'Rahul Sharma',
      email: 'rahul@techsolutions.com',
      contactNumber: '+91 9876543210',
      industry: 'Information Technology',
      registrationDate: '2023-01-15',
      status: 'verified',
      employeesCount: 150
    },
    {
      id: 'CU002',
      companyName: 'Green Energy Ltd.',
      contactPerson: 'Priya Patel',
      email: 'priya@greenenergy.com',
      contactNumber: '+91 8765432109',
      industry: 'Renewable Energy',
      registrationDate: '2023-02-20',
      status: 'active',
      employeesCount: 85
    },
    {
      id: 'CU003',
      companyName: 'Global Logistics',
      contactPerson: 'Amit Singh',
      email: 'amit@globallogistics.com',
      contactNumber: '+91 7654321098',
      industry: 'Transportation',
      registrationDate: '2023-03-10',
      status: 'pending',
      employeesCount: 200
    },
    {
      id: 'CU004',
      companyName: 'MediCare Hospitals',
      contactPerson: 'Neha Gupta',
      email: 'neha@medicare.com',
      contactNumber: '+91 6543210987',
      industry: 'Healthcare',
      registrationDate: '2023-04-05',
      status: 'verified',
      employeesCount: 300
    },
    {
      id: 'CU005',
      companyName: 'FinEdge Capital',
      contactPerson: 'Vikram Joshi',
      email: 'vikram@finedge.com',
      contactNumber: '+91 9432109876',
      industry: 'Financial Services',
      registrationDate: '2023-05-12',
      status: 'active',
      employeesCount: 50
    },
    {
      id: 'CU006',
      companyName: 'EduSmart Academy',
      contactPerson: 'Ananya Reddy',
      email: 'ananya@edusmart.com',
      contactNumber: '+91 8321098765',
      industry: 'Education',
      registrationDate: '2023-06-18',
      status: 'inactive',
      employeesCount: 30
    },
    {
      id: 'CU007',
      companyName: 'BuildRight Constructions',
      contactPerson: 'Karthik Malhotra',
      email: 'karthik@buildright.com',
      contactNumber: '+91 7210987654',
      industry: 'Construction',
      registrationDate: '2023-07-22',
      status: 'verified',
      employeesCount: 120
    },
    {
      id: 'CU008',
      companyName: 'FoodEssentials',
      contactPerson: 'Divya Iyer',
      email: 'divya@foodessentials.com',
      contactNumber: '+91 6109876543',
      industry: 'Food & Beverage',
      registrationDate: '2023-08-30',
      status: 'pending',
      employeesCount: 75
    },
  ];

  // State management
  const [corporateUsers] = useState<CorporateUser[]>(initialCorporateUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof CorporateUser; direction: 'ascending' | 'descending' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Get unique industries for filter dropdown
  const industries = useMemo(() => {
    const uniqueIndustries = new Set(initialCorporateUsers.map(user => user.industry));
    return Array.from(uniqueIndustries).sort();
  }, []);

  // Filter and sort corporate users
  const filteredCorporateUsers = useMemo(() => {
    let result = [...corporateUsers];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(user => {
        return (
          user.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.contactNumber.includes(searchTerm) ||
          user.industry.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(user => user.status === statusFilter);
    }
    
    // Apply industry filter
    if (industryFilter !== 'all') {
      result = result.filter(user => user.industry === industryFilter);
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
  }, [corporateUsers, searchTerm, statusFilter, industryFilter, sortConfig]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCorporateUsers.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCorporateUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredCorporateUsers, itemsPerPage]);

  // Sort request
  const requestSort = (key: keyof CorporateUser) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Status badge component
  const StatusBadge = ({ status }: { status: CorporateUser['status'] }) => {
    const statusClasses = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
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
        <h2 className="text-2xl font-bold text-gray-800">Corporate Users</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search companies..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 w-full"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          
          {/* Industry Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiBriefcase className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none w-full"
              value={industryFilter}
              onChange={(e) => {
                setIndustryFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Industries</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
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
              <option value="verified">Verified</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Corporate Users Table */}
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
                Contact Person
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('email')}
              >
                <div className="flex items-center">
                  Email
                  {sortConfig?.key === 'email' && (
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
                Contact Number
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('industry')}
              >
                <div className="flex items-center">
                  Industry
                  {sortConfig?.key === 'industry' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('registrationDate')}
              >
                <div className="flex items-center">
                  Registration Date
                  {sortConfig?.key === 'registrationDate' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('employeesCount')}
              >
                <div className="flex items-center">
                  Employees
                  {sortConfig?.key === 'employeesCount' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('status')}
              >
                <div className="flex items-center">
                  Status
                  {sortConfig?.key === 'status' && (
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
              currentItems.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                        <FiBriefcase className="text-teal-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.companyName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.contactPerson}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.contactNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.industry}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(user.registrationDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.employeesCount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={user.status} />
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
                  No corporate users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredCorporateUsers.length > itemsPerPage && (
        <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, filteredCorporateUsers.length)}
                </span>{' '}
                of <span className="font-medium">{filteredCorporateUsers.length}</span> results
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

export default AllCorporateUsers;