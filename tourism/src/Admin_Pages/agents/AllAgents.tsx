import { useState, useMemo } from 'react';
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight, FiEdit, FiTrash2, FiDollarSign, FiEye } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

type Entity = {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  contactNumber: string;
  category: string;
  registrationDate: string;
  status: 'active' | 'inactive' | 'pending' | 'verified';
  totalEarnings: number;
};

type Column = {
  key: keyof Entity;
  label: string;
  sortable?: boolean;
  render?: (value: any) => React.ReactNode;
};

const AllAgents = () => {
  const navigate = useNavigate();
  
  // Static agent data
  const initialData: Entity[] = [
    {
      id: 'AG001',
      name: 'Rahul Sharma',
      contactPerson: 'Regional Manager',
      email: 'rahul@realestate.com',
      contactNumber: '+91 9876543210',
      category: 'Real Estate',
      registrationDate: '2023-01-15',
      status: 'verified',
      totalEarnings: 1250000
    },
    {
      id: 'AG002',
      name: 'Priya Patel',
      contactPerson: 'Area Manager',
      email: 'priya@realestate.com',
      contactNumber: '+91 8765432109',
      category: 'Real Estate',
      registrationDate: '2023-02-20',
      status: 'active',
      totalEarnings: 980000
    },
    {
      id: 'AG003',
      name: 'Amit Singh',
      contactPerson: 'Regional Manager',
      email: 'amit@insurance.com',
      contactNumber: '+91 7654321098',
      category: 'Insurance',
      registrationDate: '2023-03-10',
      status: 'pending',
      totalEarnings: 750000
    },
    {
      id: 'AG004',
      name: 'Neha Gupta',
      contactPerson: 'Branch Manager',
      email: 'neha@finance.com',
      contactNumber: '+91 6543210987',
      category: 'Finance',
      registrationDate: '2023-01-25',
      status: 'verified',
      totalEarnings: 1100000
    },
    {
      id: 'AG005',
      name: 'Vikram Joshi',
      contactPerson: 'Area Manager',
      email: 'vikram@realestate.com',
      contactNumber: '+91 9432109876',
      category: 'Real Estate',
      registrationDate: '2023-04-05',
      status: 'inactive',
      totalEarnings: 650000
    },
  ];

  // Table columns configuration
  const columns: Column[] = [
    { key: 'name', label: 'Agent Name', sortable: true },
    { key: 'contactPerson', label: 'Supervisor', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'contactNumber', label: 'Contact Number', sortable: false },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'registrationDate', label: 'Registration Date', sortable: true },
    { 
      key: 'totalEarnings', 
      label: 'Total Earnings', 
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center">
          <FiDollarSign className="mr-1 text-green-600" />
          {new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(value)}
        </div>
      )
    },
    { key: 'status', label: 'Status', sortable: true }
  ];

  // Status filter options
  const statusOptions = [
    { value: 'verified', label: 'Verified' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' }
  ];

  // State management
  const [data] = useState<Entity[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Entity; direction: 'ascending' | 'descending' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Get unique categories for filter dropdown
  const categories = useMemo(() => {
    const uniqueCategories = new Set(initialData.map(item => item.category));
    return Array.from(uniqueCategories).sort();
  }, []);

  // Filter and sort data
  const filteredData = useMemo(() => {
    let result = [...data];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(item => {
        return (
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.contactNumber.includes(searchTerm) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(item => item.status === statusFilter);
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(item => item.category === categoryFilter);
    }
    
    // Apply sorting
    if (sortConfig !== null) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [data, searchTerm, statusFilter, categoryFilter, sortConfig]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredData, itemsPerPage]);

  // Sort request
  const requestSort = (key: keyof Entity) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Status badge component
  const StatusBadge = ({ status }: { status: Entity['status'] }) => {
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

  // Handle view details click
  const handleViewDetails = () => {
    navigate('/admin/agentIncomeDetails'); // Simple redirect without ID
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Agents</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search agents..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 w-full"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          
          {/* Category Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiFilter className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none w-full"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
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
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  onClick={() => column.sortable && requestSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.label}
                    {column.sortable && sortConfig?.key === column.key && (
                      <span className="ml-1">
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={`${item.id}-${column.key}`} className="px-6 py-4 whitespace-nowrap">
                      {column.render 
                        ? column.render(item[column.key]) 
                        : column.key === 'status' 
                          ? <StatusBadge status={item.status} /> 
                          : column.key === 'registrationDate'
                            ? formatDate(item.registrationDate)
                            : column.key === 'totalEarnings'
                              ? formatCurrency(item.totalEarnings)
                              : item[column.key]}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => handleViewDetails()}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <FiEye />
                      </button>
                      <button className="text-teal-600 hover:text-teal-900" title="Edit">
                        <FiEdit />
                      </button>
                      <button className="text-red-600 hover:text-red-900" title="Delete">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-sm text-gray-500">
                  No agents found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredData.length > itemsPerPage && (
        <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, filteredData.length)}
                </span>{' '}
                of <span className="font-medium">{filteredData.length}</span> results
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

export default AllAgents;