"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Edit, ChevronLeft, ChevronRight, X, User, CreditCard, Globe, Calendar } from "lucide-react"

interface PassportData {
  travellerIndex: number
  passportNumber: string
  surname: string
  givenName: string
  nationality: string
  dob: string
  placeOfBirth: string
  sex: string
  dateOfIssue: string
  dateOfExpiry: string
  placeOfIssue: string
  fileNumber: string
  _id: string
}

interface StatusHistory {
  label: string
  date: string
}

interface VisaApplication {
  _id: string
  visaId: string
  paymentId: string
  travellers: string
  email: string
  phone: string
  country: string
  documents: any
  passportData: PassportData[]
  statusHistory: StatusHistory[]
  createdAt: string
  updatedAt: string
}

interface ApiResponse {
  message: string
  user: {
    _id: string
    name: string
    email: string
    phoneNumber: string
    visaCount: number
  }
  visaDetails: VisaApplication[]
}

export default function AllVisaIssued() {
  const [applications, setApplications] = useState<VisaApplication[]>([])
  const [filteredApplications, setFilteredApplications] = useState<VisaApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [countryFilter, setCountryFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Modal states
  const [openStatusDialog, setOpenStatusDialog] = useState(false)
  const [selectedApp, setSelectedApp] = useState<VisaApplication | null>(null)
  const [newStatus, setNewStatus] = useState("")

  // Fetch visa applications
  useEffect(() => {
    const fetchVisaApplications = async () => {
      try {
        // Get employee ID from localStorage
        const employeeData = localStorage.getItem("employee")
        if (!employeeData) {
          console.error("No employee data found in localStorage")
          return
        }

        const employee = JSON.parse(employeeData)
        const employeeId = employee.id

        const response = await fetch(`http://localhost:5000/api/employee/getByUserId/${employeeId}/visas`)
        if (response.ok) {
          const data: ApiResponse = await response.json()
          setApplications(data.visaDetails)
          setFilteredApplications(data.visaDetails)
        } else {
          console.error("Failed to fetch visa applications")
        }
      } catch (error) {
        console.error("Error fetching visa applications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchVisaApplications()
  }, [])

  // Filter and search logic
  useEffect(() => {
    let filtered = applications

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((app) => {
        const applicantName = getApplicantName(app)
        const passportNumber = app.passportData[0]?.passportNumber || ""
        return (
          applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          passportNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.paymentId.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => {
        const latestStatus = getLatestStatus(app)
        return latestStatus === statusFilter
      })
    }

    // Country filter
    if (countryFilter !== "all") {
      filtered = filtered.filter((app) => app.country === countryFilter)
    }

    setFilteredApplications(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchTerm, statusFilter, countryFilter, applications])

  // Helper functions
  const getApplicantName = (app: VisaApplication) => {
    if (app.passportData && app.passportData.length > 0) {
      const passport = app.passportData[0]
      return `${passport.givenName} ${passport.surname}`.trim()
    }
    return "N/A"
  }

  const getLatestStatus = (app: VisaApplication) => {
    if (app.statusHistory && app.statusHistory.length > 0) {
      return app.statusHistory[app.statusHistory.length - 1].label
    }
    return "Unknown"
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentApplications = filteredApplications.slice(startIndex, endIndex)

  // Status update function
  const handleStatusChange = async () => {
    if (!selectedApp || !newStatus.trim()) return

    try {
      const response = await fetch(`http://localhost:5000/api/VisaApplication/visa-status/${selectedApp._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newStatus }),
      })

      if (response.ok) {
        setApplications((prev) =>
          prev.map((app) =>
            app._id === selectedApp._id
              ? {
                  ...app,
                  statusHistory: [...app.statusHistory, { label: newStatus, date: new Date().toISOString() }],
                }
              : app,
          ),
        )
        setOpenStatusDialog(false)
        setSelectedApp(null)
        setNewStatus("")
      } else {
        console.error("Failed to update status")
      }
    } catch (err) {
      console.error("Error updating status:", err)
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "rejected":
        return "bg-rose-100 text-rose-800 border-rose-200"
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "payment sucesfully":
      case "payment successfully":
        return "bg-violet-100 text-violet-800 border-violet-200"
      case "issued":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  const uniqueStatuses = [...new Set(applications.map((app) => getLatestStatus(app)))]
  const uniqueCountries = [...new Set(applications.map((app) => app.country))]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <div className="ml-3 text-lg text-gray-600">Loading visa applications...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="container mx-auto space-y-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Visa Applications Dashboard</h1>
          <p className="text-gray-600 text-lg">Manage and track all visa applications efficiently</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Search and Filter Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by name, passport, email, or payment ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-white/50 outline-none backdrop-blur-sm"
                />
              </div>

              <div className="flex gap-3">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white min-w-[160px] shadow-sm"
                  >
                    <option value="all">All Status</option>
                    {uniqueStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <select
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white min-w-[160px] shadow-sm"
                >
                  <option value="all">All Countries</option>
                  {uniqueCountries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Summary */}
            <div className="mt-4 text-white/90 text-sm">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredApplications.length)} of{" "}
              {filteredApplications.length} applications
            </div>
          </div>

          {/* Table Section */}
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-100">
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 bg-gray-50/50 rounded-l-lg">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Applicant
                      </div>
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 bg-gray-50/50">Passport No.</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 bg-gray-50/50">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Country
                      </div>
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 bg-gray-50/50">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Payment ID
                      </div>
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 bg-gray-50/50">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Applied Date
                      </div>
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 bg-gray-50/50">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 bg-gray-50/50 rounded-r-lg">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentApplications.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <Search className="h-8 w-8 text-gray-400" />
                          </div>
                          <p className="text-lg font-medium">No applications found</p>
                          <p className="text-sm">Try adjusting your search or filter criteria</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentApplications.map((app, index) => (
                      <tr
                        key={app._id}
                        className={`border-b border-gray-50 hover:bg-blue-50/30 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {getApplicantName(app).charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{getApplicantName(app)}</div>
                              <div className="text-sm text-gray-500">{app.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                            {app.passportData[0]?.passportNumber || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-sm"></div>
                            <span className="font-medium text-gray-700">{app.country}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="font-mono text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-md">
                            {app.paymentId}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-gray-600">
                          {new Date(app.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeColor(
                              getLatestStatus(app),
                            )}`}
                          >
                            {getLatestStatus(app)}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <button
                            onClick={() => {
                              setSelectedApp(app)
                              setNewStatus("")
                              setOpenStatusDialog(true)
                            }}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Update
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors shadow-sm"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors shadow-sm"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Update Modal */}
        {openStatusDialog && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Update Visa Status</h3>
                  <p className="text-sm text-gray-600 mt-1">Update status for {getApplicantName(selectedApp!)}</p>
                </div>
                <button
                  onClick={() => setOpenStatusDialog(false)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none p-2 hover:bg-white rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                <div>
                  <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-3">
                    Enter New Status
                  </label>
                  <input
                    type="text"
                    id="status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    placeholder="e.g., Approved, Rejected, Processing..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 placeholder-gray-400"
                  />
                </div>

                {/* Application Details */}
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-5 rounded-xl border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Application Details
                  </h4>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200/50">
                      <span className="font-medium text-gray-600">Payment ID:</span>
                      <span className="font-mono bg-white px-2 py-1 rounded text-purple-700">
                        {selectedApp?.paymentId}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200/50">
                      <span className="font-medium text-gray-600">Country:</span>
                      <span className="font-semibold text-gray-900">{selectedApp?.country}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200/50">
                      <span className="font-medium text-gray-600">Travellers:</span>
                      <span className="font-semibold text-gray-900">{selectedApp?.travellers}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200/50">
                      <span className="font-medium text-gray-600">Email:</span>
                      <span className="text-blue-600">{selectedApp?.email}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="font-medium text-gray-600">Phone:</span>
                      <span className="font-semibold text-gray-900">{selectedApp?.phone}</span>
                    </div>
                  </div>
                </div>

                {selectedApp?.statusHistory && selectedApp.statusHistory.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Status History</label>
                    <div className="max-h-40 overflow-y-auto space-y-2 border border-gray-200 rounded-xl p-3 bg-gray-50">
                      {selectedApp.statusHistory.map((history, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100"
                        >
                          <span className="font-medium text-gray-900">{history.label}</span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {new Date(history.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50/50">
                <button
                  onClick={() => setOpenStatusDialog(false)}
                  className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusChange}
                  disabled={!newStatus.trim()}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
