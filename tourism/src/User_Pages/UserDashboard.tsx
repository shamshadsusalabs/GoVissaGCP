import  { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Define types for our data
type Booking = {
  id: number;
  type: string;
  destination: string;
  date: string;
};

type MonthlyStat = {
  month: string;
  flights: number;
  hotels: number;
  travels: number;
};

type UserTravelData = {
  flights: number;
  hotels: number;
  travels: number;
  recentBookings: Booking[];
  monthlyStats: MonthlyStat[];
};

const UserDashboard = () => {
  // Initialize state with proper typing
  const [userData, setUserData] = useState<UserTravelData>({
    flights: 0,
    hotels: 0,
    travels: 0,
    recentBookings: [],
    monthlyStats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch user travel data
    const fetchUserData = async () => {
      try {
        // Mock data with proper typing
        const mockData: UserTravelData = {
          flights: 12,
          hotels: 8,
          travels: 5,
          recentBookings: [
            { id: 1, type: 'flight', destination: 'New York', date: '2023-06-15' },
            { id: 2, type: 'hotel', destination: 'Paris', date: '2023-07-22' },
            { id: 3, type: 'travel', destination: 'Tokyo', date: '2023-08-10' },
          ],
          monthlyStats: [
            { month: 'Jan', flights: 1, hotels: 0, travels: 0 },
            { month: 'Feb', flights: 0, hotels: 1, travels: 0 },
            { month: 'Mar', flights: 2, hotels: 1, travels: 0 },
            { month: 'Apr', flights: 1, hotels: 0, travels: 1 },
            { month: 'May', flights: 3, hotels: 2, travels: 1 },
            { month: 'Jun', flights: 2, hotels: 1, travels: 2 },
          ]
        };
        
        setUserData(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  const pieData = [
    { name: 'Flights', value: userData.flights },
    { name: 'Hotels', value: userData.hotels },
    { name: 'Other Travel', value: userData.travels },
  ];

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Travel Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Total Flights</h3>
          <p className="text-4xl font-bold text-blue-600">{userData.flights}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Hotel Stays</h3>
          <p className="text-4xl font-bold text-green-600">{userData.hotels}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700">Other Travel</h3>
          <p className="text-4xl font-bold text-yellow-600">{userData.travels}</p>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Bar Chart - Monthly Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Travel Activity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userData.monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="flights" fill="#0088FE" name="Flights" />
                <Bar dataKey="hotels" fill="#00C49F" name="Hotels" />
                <Bar dataKey="travels" fill="#FFBB28" name="Other Travel" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Pie Chart - Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Travel Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((_entry, index) => (
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
      
      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userData.recentBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">{booking.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{booking.destination}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(booking.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;