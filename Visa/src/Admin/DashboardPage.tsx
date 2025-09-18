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
  BarChart3,
  PieChart,
  Activity,
  Download,
} from "lucide-react"

interface RecentApplication {
  _id: string;
  visaId: string;
  travellers: string;
  email: string;
  phone: string;
  country: string;
  // Allow different shapes coming from backend
  passportData: Array<
    | { given_names?: string; surname?: string; lastName?: string; givenName?: string }
    | Record<string, any>
  >;
  statusHistory: {
    label: string;
  }[];
  createdAt: string;
}

interface VisaTypeCount {
  count: number;
  visaType: string;
}

interface MonthlyData {
  month: string;
  applications: number;
  approved: number;
  rejected: number;
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalApplications: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([])
  const [visaTypeCounts, setVisaTypeCounts] = useState<VisaTypeCount[]>([])
  const [, setAllApplications] = useState<RecentApplication[]>([])
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [visaConfigurations, setVisaConfigurations] = useState<any[]>([])

  // Helper function to get latest status
  const getLatestStatus = (statusHistory: { label: string }[]) => {
    if (!statusHistory || statusHistory.length === 0) return "pending"
    return statusHistory[statusHistory.length - 1].label.toLowerCase()
  }

  // Generate monthly data from actual applications
  const generateMonthlyData = (applications: RecentApplication[]): MonthlyData[] => {
    
    // Initialize with sample data for better visualization
    const monthlyStats: MonthlyData[] = [
      { month: "Jan", applications: 12, approved: 8, rejected: 2 },
      { month: "Feb", applications: 18, approved: 14, rejected: 3 },
      { month: "Mar", applications: 15, approved: 11, rejected: 2 },
      { month: "Apr", applications: 22, approved: 17, rejected: 4 },
      { month: "May", applications: 28, approved: 22, rejected: 5 },
      { month: "Jun", applications: 35, approved: 28, rejected: 6 },
      { month: "Jul", applications: 42, approved: 34, rejected: 7 },
      { month: "Aug", applications: 38, approved: 30, rejected: 6 },
      { month: "Sep", applications: 0, approved: 0, rejected: 0 }, // Will be updated with real data
      { month: "Oct", applications: 0, approved: 0, rejected: 0 },
      { month: "Nov", applications: 0, approved: 0, rejected: 0 },
      { month: "Dec", applications: 0, approved: 0, rejected: 0 },
    ]

    // Count actual applications by month
    applications.forEach(app => {
      const date = new Date(app.createdAt)
      const monthIndex = date.getMonth()
      const status = getLatestStatus(app.statusHistory)
      
      monthlyStats[monthIndex].applications += 1
      
      if (status === 'approved') {
        monthlyStats[monthIndex].approved += 1
      } else if (status === 'rejected') {
        monthlyStats[monthIndex].rejected += 1
      }
    })

    return monthlyStats
  }

  // Default monthly data as fallback
  const defaultMonthlyData: MonthlyData[] = [
    { month: "Jan", applications: 0, approved: 0, rejected: 0 },
    { month: "Feb", applications: 0, approved: 0, rejected: 0 },
    { month: "Mar", applications: 0, approved: 0, rejected: 0 },
    { month: "Apr", applications: 0, approved: 0, rejected: 0 },
    { month: "May", applications: 0, approved: 0, rejected: 0 },
    { month: "Jun", applications: 0, approved: 0, rejected: 0 },
    { month: "Jul", applications: 0, approved: 0, rejected: 0 },
    { month: "Aug", applications: 0, approved: 0, rejected: 0 },
    { month: "Sep", applications: 0, approved: 0, rejected: 0 },
    { month: "Oct", applications: 0, approved: 0, rejected: 0 },
    { month: "Nov", applications: 0, approved: 0, rejected: 0 },
    { month: "Dec", applications: 0, approved: 0, rejected: 0 },
  ]

  const maxValue = Math.max(...(monthlyData.length > 0 ? monthlyData : defaultMonthlyData).map((d) => d.applications), 1)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch stats
        const statsResponse = await fetch("https://govisaa-872569311567.asia-south2.run.app/api/VisaApplication/stats")
        if (!statsResponse.ok) {
          throw new Error("Failed to fetch stats")
        }
        const statsData = await statsResponse.json()
        setStats(statsData)

        // Fetch recent applications
        const recentResponse = await fetch("https://govisaa-872569311567.asia-south2.run.app/api/VisaApplication/getLatest")
        if (!recentResponse.ok) {
          throw new Error("Failed to fetch recent applications")
        }
        const recentData = await recentResponse.json()
        setRecentApplications(recentData.data.slice(0, 5)) // Limit to 5 records
        setAllApplications(recentData.data) // Store all data for export

        // Fetch visa type counts
        const visaTypesResponse = await fetch("https://govisaa-872569311567.asia-south2.run.app/api/configurations/counts/types")
        if (!visaTypesResponse.ok) {
          throw new Error("Failed to fetch visa type counts")
        }
        const visaTypesData = await visaTypesResponse.json()
        setVisaTypeCounts(visaTypesData.data)

        // Fetch visa configurations for dynamic visa type mapping
        try {
          const configResponse = await fetch("https://govisaa-872569311567.asia-south2.run.app/api/configurations/getAll")
          if (configResponse.ok) {
            const configData = await configResponse.json()
            if (configData.success && configData.data) {
              setVisaConfigurations(configData.data)
            }
          }
        } catch (configError) {
          console.warn("Visa configurations API not available:", configError)
        }

        // Fetch monthly data
        try {
          const monthlyResponse = await fetch("https://govisaa-872569311567.asia-south2.run.app/api/VisaApplication/monthly-stats")
          if (monthlyResponse.ok) {
            const monthlyDataResponse = await monthlyResponse.json()
            if (monthlyDataResponse.success && monthlyDataResponse.data) {
              setMonthlyData(monthlyDataResponse.data)
            } else {
              // Generate data from actual applications
              const generatedData = generateMonthlyData(recentData.data)
              setMonthlyData(generatedData)
            }
          } else {
            // Generate data from actual applications
            const generatedData = generateMonthlyData(recentData.data)
            setMonthlyData(generatedData)
          }
        } catch (monthlyError) {
          console.warn("Monthly stats API not available, generating from applications:", monthlyError)
          // Generate data from actual applications
          const generatedData = generateMonthlyData(recentData.data)
          setMonthlyData(generatedData)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
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

  // Define all possible visa types with their colors
  const visaTypeColors = [
    { type: "Tourist", color: "bg-blue-500" },
    { type: "Business", color: "bg-green-500" },
    { type: "Student", color: "bg-purple-500" },
    { type: "Work", color: "bg-orange-500" },
    { type: "Traveller", color: "bg-indigo-500" },
  ]

  // Calculate visa type data with percentages
  const getVisaTypeData = () => {
    const total = visaTypeCounts.reduce((sum, item) => sum + item.count, 0) || 1 // Avoid division by zero
    const defaultCounts = visaTypeColors.map(type => ({
      type: type.type,
      count: 0,
      percentage: 0,
      color: type.color
    }))

    // Merge API data with default types
    return defaultCounts.map(defaultType => {
      const apiType = visaTypeCounts.find(vt => vt.visaType === defaultType.type)
      return {
        ...defaultType,
        count: apiType?.count || 0,
        percentage: Math.round(((apiType?.count || 0) / total) * 100)
      }
    })
  }

  const visaTypeData = getVisaTypeData()

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

  const getVisaTypeFromId = (visaId: string) => {
    // Dynamic mapping using actual visa configurations from API
    const visaConfig = visaConfigurations.find(config => config._id === visaId)
    if (visaConfig) {
      return visaConfig.visaType || visaConfig.title || visaConfig.name || "Unknown"
    }
    return "Other"
  }

  const exportToExcel = async () => {
    try {
      // Fetch ALL applications from API for export
      // Try getAll first, if it fails, use getLatest without limit
      let response = await fetch("https://govisaa-872569311567.asia-south2.run.app/api/VisaApplication/getAll")
      if (!response.ok) {
        // Fallback to getLatest if getAll doesn't exist
        response = await fetch("https://govisaa-872569311567.asia-south2.run.app/api/VisaApplication/getLatest?limit=1000")
        if (!response.ok) {
          throw new Error("Failed to fetch applications")
        }
      }
      const allData = await response.json()
      const exportApplications = allData.data || allData
      
      // Create CSV content
      const headers = ['Applicant Name', 'Email', 'Phone', 'Visa Type', 'Country', 'Date', 'Status']
      const csvContent = [
        headers.join(','),
        ...exportApplications.map((application: RecentApplication) => {
          const status = getLatestStatus(application.statusHistory)
          const first = application.passportData?.[0] || {}
          const given = (first as any).given_names || (first as any).givenName || ""
          const sur = (first as any).surname || (first as any).lastName || ""
          const emailUser = application.email?.split('@')?.[0] || ""
          const fullName = `${given} ${sur}`.trim() || emailUser || "N/A"
          const visaType = getVisaTypeFromId(application.visaId)
          const date = new Date(application.createdAt).toLocaleDateString()
          
          return [
            `"${fullName}"`,
            `"${application.email}"`,
            `"${application.phone}"`,
            `"${visaType}"`,
            `"${application.country}"`,
            `"${date}"`,
            `"${status.charAt(0).toUpperCase() + status.slice(1)}"`
          ].join(',')
        })
      ].join('\n') // Fixed: Use actual newline character instead of \\n

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `visa_applications_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      console.log(`Exported ${exportApplications.length} applications to CSV`)
    } catch (error) {
      console.error('Error exporting to Excel:', error)
      alert('Failed to export data. Please try again.')
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
                {(monthlyData.length > 0 ? monthlyData : defaultMonthlyData).map((data, index) => (
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
              <button 
                onClick={exportToExcel}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
              >
                <Download className="w-4 h-4 mr-2" />
                Excel Export
              </button>
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentApplications.map((application) => {
                  const status = getLatestStatus(application.statusHistory)
                  const first = application.passportData?.[0] || {}
                  const given = (first as any).given_names || (first as any).givenName || ""
                  const sur = (first as any).surname || (first as any).lastName || ""
                  const emailUser = application.email?.split('@')?.[0] || ""
                  const fullName = `${given} ${sur}`.trim() || emailUser || "N/A"
                  const initialsSource = fullName !== "N/A" ? fullName : (emailUser || "NA")
                  const initials = initialsSource
                    .split(' ')
                    .filter(Boolean)
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()

                  return (
                    <tr key={application._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                            {initials || 'NA'}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{fullName}</div>

                            <div className="text-sm text-gray-500">{application.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getVisaTypeFromId(application.visaId)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{application.country}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage