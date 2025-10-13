import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
  LinearProgress,
 
} from '@mui/material';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// Sample data
const bookingData = [
  { name: 'Jan', hotels: 4000, flights: 2400, packages: 1800 },
  { name: 'Feb', hotels: 3000, flights: 1398, packages: 2200 },
  { name: 'Mar', hotels: 2000, flights: 9800, packages: 1500 },
  { name: 'Apr', hotels: 2780, flights: 3908, packages: 2100 },
  { name: 'May', hotels: 1890, flights: 4800, packages: 1900 },
  { name: 'Jun', hotels: 2390, flights: 3800, packages: 2500 },
];

const userDistributionData = [
  { name: 'Normal Users', value: 400 },
  { name: 'Corporate', value: 300 },
  { name: 'Agents', value: 200 },
  { name: 'Admins', value: 50 },
];

const revenueData = [
  { name: 'Hotels', value: 65 },
  { name: 'Flights', value: 25 },
  { name: 'Packages', value: 10 },
];

const recentBookings = [
  { id: 1, type: 'Hotel', user: 'John Doe', date: '2023-05-15', amount: '$250', status: 'Confirmed' },
  { id: 2, type: 'Flight', user: 'Acme Corp', date: '2023-05-14', amount: '$420', status: 'Completed' },
  { id: 3, type: 'Package', user: 'Travel Agent', date: '2023-05-13', amount: '$780', status: 'Pending' },
  { id: 4, type: 'Hotel', user: 'Jane Smith', date: '2023-05-12', amount: '$190', status: 'Cancelled' },
  { id: 5, type: 'Flight', user: 'Global Tours', date: '2023-05-11', amount: '$320', status: 'Confirmed' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface DashboardCardProps {
  title: string;
  value: string;
  change: string;
  icon: string;
}

// Dashboard Card Component
const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, change, icon }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h4">{value}</Typography>
          <Typography variant="h5">{icon}</Typography>
        </Box>
        <Typography variant="body2" color={change.startsWith('+') ? 'success.main' : 'error.main'}>
          {change} from last month
        </Typography>
      </CardContent>
    </Card>
  );
};

// Recent Bookings Table Component
const RecentBookingsTable: React.FC<{ data: typeof recentBookings }> = ({ data }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Booking ID</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>{row.user}</TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.amount}</TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Quick Actions Component
const QuickActions = () => (
  <Card sx={{ p: 2 }}>
    <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
      Quick Actions
    </Typography>
    <Stack direction="row" spacing={2}>
      <Button variant="contained" color="primary">
        Add New Booking
      </Button>
      <Button variant="outlined" color="secondary">
        Generate Report
      </Button>
      <Button variant="outlined">Send Notifications</Button>
      <Button variant="outlined">Manage Users</Button>
    </Stack>
  </Card>
);

// Revenue Progress Component
const RevenueProgress = () => (
  <Card sx={{ p: 2, mt: 2 }}>
    <Typography variant="h6" gutterBottom>
      Monthly Target Progress
    </Typography>
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" color="text.secondary">
        Hotel Bookings: 65% of target
      </Typography>
      <LinearProgress variant="determinate" value={65} color="primary" sx={{ height: 10, borderRadius: 5 }} />
    </Box>
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" color="text.secondary">
        Flight Bookings: 45% of target
      </Typography>
      <LinearProgress variant="determinate" value={45} color="secondary" sx={{ height: 10, borderRadius: 5 }} />
    </Box>
    <Box>
      <Typography variant="body2" color="text.secondary">
        Package Sales: 30% of target
      </Typography>
      <LinearProgress variant="determinate" value={30} color="warning" sx={{ height: 10, borderRadius: 5 }} />
    </Box>
  </Card>
);

// Main Dashboard Component
const AdminDashboard = () => {

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Dashboard Overview
      </Typography>

      {/* Quick Stats Row */}
      <Stack direction="row" spacing={3} sx={{ mb: 4 }} flexWrap="wrap">
        <Box flex={1} minWidth={220}>
          <DashboardCard title="Total Bookings" value="1,245" change="+12%" icon="📊" />
        </Box>
        <Box flex={1} minWidth={220}>
          <DashboardCard title="Revenue" value="$48,250" change="+18%" icon="💰" />
        </Box>
        <Box flex={1} minWidth={220}>
          <DashboardCard title="Active Users" value="856" change="+5%" icon="👥" />
        </Box>
        <Box flex={1} minWidth={220}>
          <DashboardCard title="Pending Actions" value="23" change="-2%" icon="⏳" />
        </Box>
      </Stack>

      {/* Main Content */}
      <Stack direction="row" spacing={3} sx={{ mb: 4 }} flexWrap="wrap">
        <Box flex={2} minWidth={480}>
          <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6" gutterBottom>
              Booking Trends (Last 6 Months)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bookingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="hotels" fill="#8884d8" name="Hotel Bookings" />
                <Bar dataKey="flights" fill="#82ca9d" name="Flight Bookings" />
                <Bar dataKey="packages" fill="#ffc658" name="Package Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        {/* User Distribution */}
        <Box flex={1} minWidth={350}>
          <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6" gutterBottom>
              User Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {userDistributionData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        {/* Revenue Breakdown */}
        <Box flex={1} minWidth={350}>
          <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6" gutterBottom>
              Revenue Breakdown
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={revenueData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                >
                  {revenueData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <RevenueProgress />
          </Box>
        </Box>

        {/* Recent Bookings */}
        <Box flex={2} minWidth={480}>
          <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6" gutterBottom>
              Recent Bookings
            </Typography>
            <RecentBookingsTable data={recentBookings} />
          </Box>
        </Box>
      </Stack>

      {/* Quick Actions */}
      <Box>
        <QuickActions />
      </Box>
    </Box>
  );
};

export default AdminDashboard;