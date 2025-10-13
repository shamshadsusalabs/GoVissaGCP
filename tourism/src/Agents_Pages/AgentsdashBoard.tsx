
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AgentsdashBoard = () => {
  // Static data - to be replaced with API data later
  const agentData = {
    name: "Rajesh Kumar",
    month: "April 2024",
    totalSales: 24,
    totalIncome: 185000,
    totalCommission: 37000,
    commissionRate: "20%",
    targets: {
      salesTarget: 30,
      incomeTarget: 250000,
    },
    breakdown: {
      flights: 8,
      hotels: 10,
      transports: 6,
      incomeByCategory: {
        flights: 80000,
        hotels: 75000,
        transports: 30000
      }
    },
    monthlyTrend: [12, 15, 18, 24], // Last 4 months sales
    topPackages: [
      { name: "Goa Summer Special", sales: 5, income: 45000 },
      { name: "Kashmir Family Package", sales: 4, income: 38000 },
      { name: "Dubai Luxury Tour", sales: 3, income: 32000 },
    ],
    performance: "Good", // Can be Poor, Average, Good, Excellent
    paymentStatus: {
      paid: 150000,
      pending: 35000
    }
  };

  // Calculate percentage for progress bars
  const performancePercentage = {
    Poor: 25,
    Average: 50,
    Good: 75,
    Excellent: 100,
  }[agentData.performance];

  // Data for bar chart (sales breakdown)
  const salesBarChartData = {
    labels: ['Flights', 'Hotels', 'Transports'],
    datasets: [
      {
        label: 'Number of Sales',
        data: [
          agentData.breakdown.flights, 
          agentData.breakdown.hotels, 
          agentData.breakdown.transports
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(234, 179, 8, 0.7)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(234, 179, 8, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Data for pie chart (income by category)
  const incomePieChartData = {
    labels: ['Flights', 'Hotels', 'Transports'],
    datasets: [
      {
        data: [
          agentData.breakdown.incomeByCategory.flights,
          agentData.breakdown.incomeByCategory.hotels,
          agentData.breakdown.incomeByCategory.transports
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(234, 179, 8, 0.7)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(234, 179, 8, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Data for line chart (monthly trend)
  const monthlyTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [
      {
        label: 'Monthly Sales Trend',
        data: agentData.monthlyTrend,
        borderColor: 'rgba(99, 102, 241, 1)',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Agent Income Dashboard</h1>
          <p className="text-gray-600">Detailed performance analytics for {agentData.name}</p>
        </div>
        <div className="text-right mt-2 md:mt-0">
          <p className="text-sm text-gray-500">Reporting Period</p>
          <p className="font-semibold">{agentData.month}</p>
        </div>
      </div>

      {/* Agent Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Performance Indicator */}
        <div className="md:col-span-2 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-blue-800">Performance Summary</h2>
            <span className={`px-2 py-1 text-xs rounded-full ${
              agentData.performance === 'Excellent' ? 'bg-green-100 text-green-800' :
              agentData.performance === 'Good' ? 'bg-blue-100 text-blue-800' :
              agentData.performance === 'Average' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
              {agentData.performance}
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2.5 flex-1 mr-2">
              <div 
                className={`h-2.5 rounded-full ${
                  agentData.performance === 'Excellent' ? 'bg-green-500' :
                  agentData.performance === 'Good' ? 'bg-blue-500' :
                  agentData.performance === 'Average' ? 'bg-yellow-500' : 'bg-red-500'
                }`} 
                style={{ width: `${performancePercentage}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-600">{performancePercentage}% of target</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div>
              <p className="text-sm text-gray-500">Sales Target</p>
              <p className="font-medium">{agentData.totalSales}/{agentData.targets.salesTarget}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Income Target</p>
              <p className="font-medium">₹{agentData.totalIncome.toLocaleString()}/₹{agentData.targets.incomeTarget.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Commission Card */}
        <div className="p-4 bg-purple-50 rounded-lg">
          <h3 className="text-sm font-medium text-purple-800 mb-1">Your Commission</h3>
          <p className="text-2xl font-bold text-purple-600">₹{agentData.totalCommission.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">{agentData.commissionRate} of total income</p>
          <div className="mt-3 pt-2 border-t border-purple-100">
            <p className="text-xs text-gray-500">Payment Status</p>
            <div className="flex justify-between text-sm">
              <span>Paid: ₹{agentData.paymentStatus.paid.toLocaleString()}</span>
              <span className="text-orange-500">Pending: ₹{agentData.paymentStatus.pending.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="text-sm font-medium text-green-800 mb-2">Quick Stats</h3>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-gray-500">Avg. Booking Value</p>
              <p className="font-medium">₹{(agentData.totalIncome/agentData.totalSales).toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Conversion Rate</p>
              <p className="font-medium">-</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total Sales Card */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Total Sales</h3>
          <p className="text-2xl font-bold text-blue-600">{agentData.totalSales}</p>
          <p className="text-sm text-gray-500">{((agentData.totalSales/agentData.targets.salesTarget)*100).toFixed(0)}% of target</p>
        </div>

        {/* Total Income Card */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Total Income</h3>
          <p className="text-2xl font-bold text-green-600">₹{agentData.totalIncome.toLocaleString()}</p>
          <p className="text-sm text-gray-500">{((agentData.totalIncome/agentData.targets.incomeTarget)*100).toFixed(0)}% of target</p>
        </div>

        {/* Monthly Trend Mini Graph */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">4-Month Trend</h3>
          <div className="h-[60px]">
            <Bar 
              data={monthlyTrendData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  y: { display: false },
                  x: { display: true }
                }
              }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {agentData.monthlyTrend[3] - agentData.monthlyTrend[2] >= 0 ? '↑' : '↓'} 
            {Math.abs(agentData.monthlyTrend[3] - agentData.monthlyTrend[2])} from last month
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sales Breakdown Bar Chart */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-gray-700 font-medium mb-3">Sales by Category</h3>
          <div className="h-64">
            <Bar 
              data={salesBarChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false }
                }
              }}
            />
          </div>
        </div>

        {/* Income Distribution Pie Chart */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-gray-700 font-medium mb-3">Income Distribution</h3>
          <div className="h-64">
            <Pie 
              data={incomePieChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'right' }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Packages */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Top Selling Packages</h3>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Income</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Share</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {agentData.topPackages.map((pkg, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{pkg.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pkg.sales}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{pkg.income.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full" 
                            style={{ width: `${(pkg.sales / agentData.totalSales * 100).toFixed(0)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{(pkg.sales / agentData.totalSales * 100).toFixed(0)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Recent Activity</h3>
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">3 new bookings today</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">Monthly target reminder</p>
                  <p className="text-xs text-gray-500">6 bookings remaining</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">₹15,000 commission received</p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
              </li>
            </ul>
            <button className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
              View all activity →
            </button>
          </div>
        </div>
      </div>

      {/* Note about API integration */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
        <p>Note: Currently showing static demo data. Real data will be loaded from API in production.</p>
      </div>
    </div>
  );
};

export default AgentsdashBoard;