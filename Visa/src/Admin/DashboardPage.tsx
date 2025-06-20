"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  TrendingUp,
  TrendingDown,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react"

const DashboardPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [stats, setStats] = useState({
    totalApplications: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Define monthlyData before it's used
  const monthlyData = [
    { month: "Jan", applications: 85, approved: 68, rejected: 12 },
    { month: "Feb", applications: 92, approved: 74, rejected: 15 },
    { month: "Mar", applications: 108, approved: 89, rejected: 14 },
    { month: "Apr", applications: 95, approved: 78, rejected: 13 },
    { month: "May", applications: 115, approved: 95, rejected: 16 },
    { month: "Jun", applications: 128, approved: 105, rejected: 18 },
    { month: "Jul", applications: 142, approved: 118, rejected: 19 },
    { month: "Aug", applications: 135, approved: 112, rejected: 17 },
    { month: "Sep", applications: 156, approved: 128, rejected: 22 },
    { month: "Oct", applications: 148, approved: 122, rejected: 20 },
    { month: "Nov", applications: 167, approved: 138, rejected: 24 },
    { month: "Dec", applications: 152, approved: 125, rejected: 21 },
  ]

  const maxValue = Math.max(...monthlyData.map((d) => d.applications))

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/VisaApplication/stats")
        if (!response.ok) {
          throw new Error("Failed to fetch stats")
        }
        const data = await response.json()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const dashboardStats = [
    {
      title: "Total Applications",
      value: stats.totalApplications.toLocaleString(),
      change: "+0%", // You might want to calculate this based on previous period
      trend: "up",
      icon: <FileText className="w-6 h-6" />,
      color: "blue",
    },
    {
      title: "Approved Visas",
      value: stats.approved.toLocaleString(),
      change: "+0%", // You might want to calculate this based on previous period
      trend: "up",
      icon: <CheckCircle className="w-6 h-6" />,
      color: "green",
    },
    {
      title: "Pending Review",
      value: stats.pending.toLocaleString(),
      change: "+0%", // You might want to calculate this based on previous period
      trend: "down",
      icon: <Clock className="w-6 h-6" />,
      color: "yellow",
    },
    {
      title: "Rejected",
      value: stats.rejected.toLocaleString(),
      change: "+0%", // You might want to calculate this based on previous period
      trend: "up",
      icon: <XCircle className="w-6 h-6" />,
      color: "red",
    },
  ]

  const visaTypeData = [
    { type: "Tourist", count: 520, percentage: 42, color: "bg-blue-500" },
    { type: "Business", count: 380, percentage: 31, color: "bg-green-500" },
    { type: "Student", count: 210, percentage: 17, color: "bg-purple-500" },
    { type: "Work", count: 135, percentage: 10, color: "bg-orange-500" },
  ]

  const recentApplications = [
    { id: 1, name: "John Smith", visaType: "Tourist", date: "2024-06-15", status: "approved", country: "USA" },
    { id: 2, name: "Sarah Johnson", visaType: "Business", date: "2024-06-14", status: "pending", country: "UK" },
    { id: 3, name: "Mike Chen", visaType: "Student", date: "2024-06-13", status: "approved", country: "Canada" },
    { id: 4, name: "Emma Wilson", visaType: "Work", date: "2024-06-12", status: "rejected", country: "Australia" },
    { id: 5, name: "David Brown", visaType: "Tourist", date: "2024-06-11", status: "pending", country: "Germany" },
    { id: 6, name: "Lisa Garcia", visaType: "Business", date: "2024-06-10", status: "approved", country: "France" },
  ]

  const getStatColor = (color: string) => {
    const colors = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      yellow: "from-yellow-500 to-yellow-600",
      red: "from-red-500 to-red-600",
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <XCircle className="w-12 h-12 mx-auto" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your visa applications.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${getStatColor(stat.color)}`}>
                    <div className="text-white">{stat.icon}</div>
                  </div>
                  <div className={`flex items-center ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {stat.trend === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span className="ml-1 text-sm font-medium">{stat.change}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                  <p className="mt-1 text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Monthly Applications Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                    Monthly Applications Trend
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Application volume over the past 12 months</p>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-gray-600">Applications</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="h-80 flex items-end justify-between space-x-2">
                {monthlyData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center group">
                    <div className="w-full flex flex-col items-center space-y-1">
                      {/* Applications bar */}
                      <div
                        className="w-full bg-gradient-to-t from-blue-400 to-blue-500 rounded-t-md hover:from-blue-500 hover:to-blue-600 transition-all duration-300 relative group-hover:shadow-lg"
                        style={{ height: `${(data.applications / maxValue) * 200}px` }}
                        title={`${data.applications} applications`}
                      ></div>
                    </div>
                    <div className="mt-3 text-center">
                      <span className="text-xs text-gray-500 font-medium">{data.month}</span>
                      <div className="text-xs text-gray-400 mt-1">{data.applications}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Visa Types Distribution */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-blue-600" />
                Visa Types
              </h3>
              <p className="text-sm text-gray-600 mt-1">Distribution by category</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {visaTypeData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className={`w-4 h-4 rounded-full ${item.color} mr-3`}></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-900">{item.type}</span>
                          <span className="text-sm text-gray-600">{item.count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${item.color} transition-all duration-500`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-500 ml-3">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Applications Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-blue-600" />
                  Recent Applications
                </h3>
                <p className="text-sm text-gray-600 mt-1">Latest visa application submissions</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visa Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                          {application.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{application.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {application.visaType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{application.country}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(application.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}
                      >
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="inline-flex items-center text-blue-600 hover:text-blue-900 transition-colors duration-200">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage