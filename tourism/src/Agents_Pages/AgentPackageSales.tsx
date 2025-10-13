import { useState, useMemo } from 'react';
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight, FiDollarSign, FiMapPin, FiHome, FiUsers } from 'react-icons/fi';

type PackageSale = {
  id: string;
  packageName: string;
  customerName: string;
  saleDate: string;
  destination: string;
  duration: string;
  hotels: string[];
  transport: string;
  totalPersons: number;
  packagePrice: number;
  commissionRate: number;
  commissionEarned: number;
  status: 'confirmed' | 'pending' | 'cancelled';
};

const AgentPackageSales = () => {
  // Sample package sale data
  const initialSales: PackageSale[] = [
    {
      id: 'PKG001',
      packageName: 'Golden Triangle Tour',
      customerName: 'Rahul Sharma',
      saleDate: '2023-05-10',
      destination: 'Delhi, Agra, Jaipur',
      duration: '5D/4N',
      hotels: ['Taj Palace Delhi', 'Oberoi Agra', 'Rambagh Palace Jaipur'],
      transport: 'AC Tempo Traveller',
      totalPersons: 4,
      packagePrice: 125000,
      commissionRate: 10,
      commissionEarned: 12500,
      status: 'confirmed'
    },
    {
      id: 'PKG002',
      packageName: 'Kerala Backwaters',
      customerName: 'Priya Patel',
      saleDate: '2023-05-15',
      destination: 'Cochin, Alleppey, Munnar',
      duration: '6D/5N',
      hotels: ['Taj Malabar Cochin', 'Punnamada Resort Alleppey', 'Fragrant Nature Munnar'],
      transport: 'Private Cab',
      totalPersons: 2,
      packagePrice: 68000,
      commissionRate: 12,
      commissionEarned: 8160,
      status: 'confirmed'
    },
    {
      id: 'PKG003',
      packageName: 'Ladakh Adventure',
      customerName: 'Amit Singh',
      saleDate: '2023-05-20',
      destination: 'Leh, Nubra Valley, Pangong',
      duration: '8D/7N',
      hotels: ['Grand Dragon Leh', 'Nubra Ethnic Camp', 'Pangong Resort'],
      transport: 'Innova Crysta',
      totalPersons: 6,
      packagePrice: 215000,
      commissionRate: 15,
      commissionEarned: 32250,
      status: 'pending'
    },
    {
      id: 'PKG004',
      packageName: 'Goa Beach Holiday',
      customerName: 'Neha Gupta',
      saleDate: '2023-05-25',
      destination: 'North Goa, South Goa',
      duration: '4D/3N',
      hotels: ['Taj Exotica Goa', 'Leela Goa'],
      transport: 'Self-Drive Car',
      totalPersons: 3,
      packagePrice: 75000,
      commissionRate: 8,
      commissionEarned: 6000,
      status: 'confirmed'
    },
    {
      id: 'PKG005',
      packageName: 'Shimla Manali',
      customerName: 'Vikram Joshi',
      saleDate: '2023-06-01',
      destination: 'Shimla, Manali',
      duration: '7D/6N',
      hotels: ['Oberoi Cecil Shimla', 'The Himalayan Manali'],
      transport: 'Volvo Bus + Local Cab',
      totalPersons: 5,
      packagePrice: 145000,
      commissionRate: 10,
      commissionEarned: 14500,
      status: 'confirmed'
    },
  ];

  const [sales] = useState<PackageSale[]>(initialSales);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter sales
  const filteredSales = useMemo(() => {
    let result = [...sales];
    
    if (searchTerm) {
      result = result.filter(sale =>
        sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.destination.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(sale => sale.status === statusFilter);
    }
    
    return result;
  }, [sales, searchTerm, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSales.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredSales, itemsPerPage]);

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

  // Status badge component
  const StatusBadge = ({ status }: { status: PackageSale['status'] }) => {
    const statusClasses = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    const statusText = {
      confirmed: 'Confirmed',
      pending: 'Pending',
      cancelled: 'Cancelled'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {statusText[status]}
      </span>
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Package Sales</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search package sales..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Sales Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Package & Customer
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <FiMapPin className="mr-1" />
                  Destination
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <FiHome className="mr-1" />
                  Hotels
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transport
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <FiUsers className="mr-1" />
                  Persons
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <FiDollarSign className="mr-1" />
                  Commission
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{sale.packageName}</div>
                    <div className="text-sm text-gray-500 mt-1">{sale.customerName}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Sold on: {formatDate(sale.saleDate)} | {sale.duration}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{sale.destination}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {sale.hotels.slice(0, 2).map(hotel => (
                        <div key={hotel} className="text-gray-900">{hotel}</div>
                      ))}
                      {sale.hotels.length > 2 && (
                        <div className="text-xs text-blue-600">+{sale.hotels.length - 2} more</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{sale.transport}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{sale.totalPersons}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(sale.commissionEarned)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {sale.commissionRate}% of {formatCurrency(sale.packagePrice)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={sale.status} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  No package sales found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredSales.length > itemsPerPage && (
        <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, filteredSales.length)}
                </span>{' '}
                of <span className="font-medium">{filteredSales.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
                    onClick={() => setCurrentPage(number)}
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
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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

export default AgentPackageSales;