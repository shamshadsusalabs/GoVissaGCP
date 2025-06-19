import { useState, useMemo } from 'react';
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight, FiEdit, FiTrash2, FiUser } from 'react-icons/fi';

type User = {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'pending';
};

const AllUsers = () => {
  // Sample data
  const initialUsers: User[] = [
    {
      id: '1',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      contactNumber: '+91 9876543210',
      joinDate: '2023-05-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Priya Patel',
      email: 'priya.patel@example.com',
      contactNumber: '+91 8765432109',
      joinDate: '2023-06-20',
      status: 'active'
    },
    {
      id: '3',
      name: 'Amit Singh',
      email: 'amit.singh@example.com',
      contactNumber: '+91 7654321098',
      joinDate: '2023-07-10',
      status: 'inactive'
    },
    {
      id: '4',
      name: 'Neha Gupta',
      email: 'neha.gupta@example.com',
      contactNumber: '+91 6543210987',
      joinDate: '2023-08-05',
      status: 'pending'
    },
    {
      id: '5',
      name: 'Vikram Joshi',
      email: 'vikram.joshi@example.com',
      contactNumber: '+91 9432109876',
      joinDate: '2023-09-12',
      status: 'active'
    },
    {
      id: '6',
      name: 'Ananya Reddy',
      email: 'ananya.reddy@example.com',
      contactNumber: '+91 8321098765',
      joinDate: '2023-10-18',
      status: 'inactive'
    },
    {
      id: '7',
      name: 'Karthik Malhotra',
      email: 'karthik.m@example.com',
      contactNumber: '+91 7210987654',
      joinDate: '2023-11-22',
      status: 'active'
    },
    {
      id: '8',
      name: 'Divya Iyer',
      email: 'divya.iyer@example.com',
      contactNumber: '+91 6109876543',
      joinDate: '2023-12-30',
      status: 'pending'
    },
  ];

  // State management
  const [users] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'ascending' | 'descending' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let result = [...users];
    
    // Apply search filter
    if (searchTerm) {
        result = result.filter(user => {
          return (
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.contactNumber.includes(searchTerm)
          );
        });
      }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(user => user.status === statusFilter);
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
  }, [users, searchTerm, statusFilter, sortConfig]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredUsers, itemsPerPage]);

  // Sort request
  const requestSort = (key: keyof User) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Status badge component
  const StatusBadge = ({ status }: { status: User['status'] }) => {
    const statusClasses = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">All Users</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 w-full"
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
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none w-full"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('name')}
              >
                <div className="flex items-center">
                  Name
                  {sortConfig?.key === 'name' && (
                    <span className="ml-1">
                      {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
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
                onClick={() => requestSort('joinDate')}
              >
                <div className="flex items-center">
                  Join Date
                  {sortConfig?.key === 'joinDate' && (
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
                        <FiUser className="text-teal-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.contactNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(user.joinDate).toLocaleDateString()}
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
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredUsers.length > itemsPerPage && (
        <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
                </span>{' '}
                of <span className="font-medium">{filteredUsers.length}</span> results
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

export default AllUsers;