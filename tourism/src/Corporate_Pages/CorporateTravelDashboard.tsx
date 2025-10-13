import { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { FiUsers, FiDollarSign,  FiTrendingUp,  FiClock, FiBriefcase } from 'react-icons/fi';

// Define types for our data
type Booking = {
  id: number;
  type: 'flight' | 'hotel' | 'car' | 'train';
  employee: string;
  department: string;
  destination: string;
  date: string;
  cost: number;
  status: 'approved' | 'pending' | 'rejected';
  purpose: string;
};

type MonthlyStat = {
  month: string;
  flights: number;
  hotels: number;
  cars: number;
  trains: number;
  totalCost: number;
};

type DepartmentStat = {
  department: string;
  bookings: number;
  cost: number;
};

type UserTravelData = {
  totalBookings: number;
  totalCost: number;
  pendingApprovals: number;
  recentBookings: Booking[];
  monthlyStats: MonthlyStat[];
  departmentStats: DepartmentStat[];
  topEmployees: { name: string; bookings: number; cost: number }[];
};

const CorporateTravelDashboard = () => {
  const [userData, setUserData] = useState<UserTravelData>({
    totalBookings: 0,
    totalCost: 0,
    pendingApprovals: 0,
    recentBookings: [],
    monthlyStats: [],
    departmentStats: [],
    topEmployees: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');

  useEffect(() => {
    const fetchCorporateData = async () => {
      try {
        // Mock corporate travel data
        const mockData: UserTravelData = {
          totalBookings: 147,
          totalCost: 584200,
          pendingApprovals: 12,
          recentBookings: [
            { id: 1, type: 'flight', employee: 'Rahul Sharma', department: 'Sales', destination: 'New York', date: '2023-06-15', cost: 125000, status: 'approved', purpose: 'Client Meeting' },
            { id: 2, type: 'hotel', employee: 'Priya Patel', department: 'Marketing', destination: 'Paris', date: '2023-07-22', cost: 85000, status: 'approved', purpose: 'Conference' },
            { id: 3, type: 'car', employee: 'Amit Singh', department: 'Engineering', destination: 'Bangalore', date: '2023-08-10', cost: 12000, status: 'pending', purpose: 'Team Offsite' },
            { id: 4, type: 'train', employee: 'Neha Gupta', department: 'HR', destination: 'Delhi', date: '2023-08-18', cost: 8000, status: 'approved', purpose: 'Recruitment' },
            { id: 5, type: 'flight', employee: 'Vikram Joshi', department: 'Sales', destination: 'Dubai', date: '2023-09-05', cost: 98000, status: 'rejected', purpose: 'Client Pitch' },
          ],
          monthlyStats: [
            { month: 'Jan', flights: 8, hotels: 5, cars: 12, trains: 3, totalCost: 185000 },
            { month: 'Feb', flights: 12, hotels: 7, cars: 8, trains: 2, totalCost: 245000 },
            { month: 'Mar', flights: 15, hotels: 10, cars: 5, trains: 1, totalCost: 320000 },
            { month: 'Apr', flights: 6, hotels: 4, cars: 10, trains: 4, totalCost: 150000 },
            { month: 'May', flights: 18, hotels: 12, cars: 7, trains: 2, totalCost: 385000 },
            { month: 'Jun', flights: 10, hotels: 8, cars: 9, trains: 3, totalCost: 225000 },
          ],
          departmentStats: [
            { department: 'Sales', bookings: 42, cost: 210000 },
            { department: 'Marketing', bookings: 28, cost: 145000 },
            { department: 'Engineering', bookings: 35, cost: 95000 },
            { department: 'HR', bookings: 15, cost: 45000 },
            { department: 'Finance', bookings: 12, cost: 38000 },
            { department: 'Operations', bookings: 15, cost: 47000 },
          ],
          topEmployees: [
            { name: 'Rahul Sharma', bookings: 12, cost: 185000 },
            { name: 'Priya Patel', bookings: 8, cost: 125000 },
            { name: 'Amit Singh', bookings: 7, cost: 85000 },
            { name: 'Neha Gupta', bookings: 6, cost: 65000 },
            { name: 'Vikram Joshi', bookings: 5, cost: 98000 },
          ]
        };
        
        setUserData(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching corporate travel data:', error);
        setLoading(false);
      }
    };

    fetchCorporateData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const STATUS_COLORS = {
    approved: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    rejected: 'bg-red-100 text-red-800'
  };

  const travelTypeData = [
    { name: 'Flights', value: userData.monthlyStats.reduce((sum, month) => sum + month.flights, 0) },
    { name: 'Hotels', value: userData.monthlyStats.reduce((sum, month) => sum + month.hotels, 0) },
    { name: 'Car Rentals', value: userData.monthlyStats.reduce((sum, month) => sum + month.cars, 0) },
    { name: 'Trains', value: userData.monthlyStats.reduce((sum, month) => sum + month.trains, 0) },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  if (loading) {
    return <div className="text-center py-8">Loading corporate dashboard...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          <FiBriefcase className="mr-2" /> Corporate Travel Dashboard
        </h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => setTimeRange('monthly')} 
            className={`px-4 py-2 rounded-lg ${timeRange === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setTimeRange('quarterly')} 
            className={`px-4 py-2 rounded-lg ${timeRange === 'quarterly' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Quarterly
          </button>
          <button 
            onClick={() => setTimeRange('yearly')} 
            className={`px-4 py-2 rounded-lg ${timeRange === 'yearly' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Yearly
          </button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FiUsers className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Total Bookings</h3>
              <p className="text-3xl font-bold text-blue-600">{userData.totalBookings}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FiDollarSign className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Total Cost</h3>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(userData.totalCost)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <FiClock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Pending Approvals</h3>
              <p className="text-3xl font-bold text-yellow-600">{userData.pendingApprovals}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Bar Chart - Monthly Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Travel Spend Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userData.monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Line type="monotone" dataKey="totalCost" stroke="#8884d8" name="Total Cost" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Pie Chart - Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Travel Type Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={travelTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {travelTypeData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Department-wise Bookings</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userData.departmentStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" fill="#0088FE" name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Department-wise Spend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userData.departmentStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Bar dataKey="cost" fill="#00C49F" name="Cost" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Recent Bookings and Top Employees */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userData.recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{booking.employee}</div>
                      <div className="text-xs text-gray-500">{booking.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">{booking.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{booking.destination}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[booking.status]}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{formatCurrency(booking.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Employees */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Top Travelers</h3>
          <div className="space-y-4">
            {userData.topEmployees.map((employee, index) => (
              <div key={index} className="flex items-center justify-between p-3 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                    <span className="font-medium">{employee.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-medium">{employee.name}</div>
                    <div className="text-xs text-gray-500">{employee.bookings} bookings</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{formatCurrency(employee.cost)}</div>
                  <div className="text-xs text-gray-500">
                    <FiTrendingUp className="inline mr-1" />
                    {((employee.cost / userData.totalCost) * 100).toFixed(1)}% of total
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorporateTravelDashboard;