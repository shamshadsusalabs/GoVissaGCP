"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  Edit,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  CreditCard,
  Globe,
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Mail,
} from "lucide-react"

interface PassportData {
  travellerIndex: number
  passport_number: string
  surname: string
  given_names: string
  nationality: string
  date_of_birth: string
  place_of_birth: string
  sex: string
  date_of_issue: string
  date_of_expiry: string
  place_of_issue: string
  file_number: string
  father_name: string
  mother_name: string
  spouse_name: string
  address: string
  _id: string
}

interface StatusHistory {
  label: string
  date: string
  rejectionReason?: string // ✅ Add optional rejection reason field
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

interface DashboardStats {
  total: number
  pending: number
  processing: number
  approved: number
  issued: number
  rejected: number
}

export default function VisaDashboard() {
  const [applications, setApplications] = useState<VisaApplication[]>([])
  const [filteredApplications, setFilteredApplications] = useState<VisaApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [countryFilter, setCountryFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    pending: 0,
    processing: 0,
    approved: 0,
    issued: 0,
    rejected: 0,
  })

  // Modal states
  const [openStatusDialog, setOpenStatusDialog] = useState(false)
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [selectedApp, setSelectedApp] = useState<VisaApplication | null>(null)
  const [newStatus, setNewStatus] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [error, setError] = useState("")

  // Predefined status options
  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "document_received", label: "Document Received" },
    { value: "document_verified", label: "Document Verified" },
    { value: "in_process_with_embassy", label: "In Process with Embassy" },
    { value: "visa_approved", label: "Visa Approved" },
    { value: "visa_rejected", label: "Visa Rejected" },
  ]

  // Fetch visa applications
  useEffect(() => {
    // Move calculateStats function inside useEffect
    const calculateStats = (apps: VisaApplication[]) => {
      const stats: DashboardStats = {
        total: apps.length,
        pending: 0,
        processing: 0,
        approved: 0,
        issued: 0,
        rejected: 0,
      }

      apps.forEach((app) => {
        const latestStatus = getLatestStatus(app).toLowerCase()

        if (latestStatus.includes("pending")) {
          stats.pending++
        } else if (latestStatus.includes("processing")) {
          stats.processing++
        } else if (latestStatus.includes("approved")) {
          stats.approved++
        } else if (latestStatus.includes("issued")) {
          stats.issued++
        } else if (latestStatus.includes("rejected")) {
          stats.rejected++
        }
      })

      return stats
    }

    const fetchVisaApplications = async () => {
      try {
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
          setStats(calculateStats(data.visaDetails))
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
  }, []) // Keep empty dependency array since calculateStats is now inside

  // Filter and search logic
  useEffect(() => {
    let filtered = applications

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((app) => {
        const applicantName = getApplicantName(app)
        const passportNumber = app.passportData[0]?.passport_number || ""
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
        return latestStatus.toLowerCase().includes(statusFilter.toLowerCase())
      })
    }

    // Country filter
    if (countryFilter !== "all") {
      filtered = filtered.filter((app) => app.country === countryFilter)
    }

    setFilteredApplications(filtered)
    setCurrentPage(1)
  }, [searchTerm, statusFilter, countryFilter, applications])

  // Helper functions
  const getApplicantName = (app: VisaApplication) => {
    if (app.passportData && app.passportData.length > 0) {
      const passport = app.passportData[0]
      return `${passport.given_names} ${passport.surname}`.trim()
    }
    return "N/A"
  }

  const getLatestStatus = (app: VisaApplication) => {
    if (app.statusHistory && app.statusHistory.length > 0) {
      return app.statusHistory[app.statusHistory.length - 1].label
    }
    return "Pending"
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentApplications = filteredApplications.slice(startIndex, endIndex)

  // Status update function
  const handleStatusChange = async () => {
    if (!selectedApp || !newStatus.trim()) return

    // Validate rejection reason if status is visa_rejected
    if (newStatus === "visa_rejected" && !rejectionReason.trim()) {
      setError("Rejection reason is required when rejecting a visa application")
      return
    }

    try {
      const requestBody: any = { label: newStatus }
      
      // Add rejection reason if status is visa_rejected
      if (newStatus === "visa_rejected" && rejectionReason.trim()) {
        requestBody.rejectionReason = rejectionReason.trim()
      }

      const response = await fetch(`http://localhost:5000/api/VisaApplication/visa-status/${selectedApp._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })

      if (response.ok) {
        const updatedApplications = applications.map((app) =>
          app._id === selectedApp._id
            ? {
                ...app,
                statusHistory: [...app.statusHistory, { 
                  label: newStatus, 
                  date: new Date().toISOString(),
                  rejectionReason: newStatus === "visa_rejected" ? rejectionReason : undefined
                }],
              }
            : app,
        )

        // Recalculate stats inline
        const newStats: DashboardStats = {
          total: updatedApplications.length,
          pending: 0,
          processing: 0,
          approved: 0,
          issued: 0,
          rejected: 0,
        }

        updatedApplications.forEach((app) => {
          const latestStatus = getLatestStatus(app).toLowerCase()

          if (latestStatus.includes("pending")) {
            newStats.pending++
          } else if (latestStatus.includes("processing")) {
            newStats.processing++
          } else if (latestStatus.includes("approved")) {
            newStats.approved++
          } else if (latestStatus.includes("issued")) {
            newStats.issued++
          } else if (latestStatus.includes("rejected")) {
            newStats.rejected++
          }
        })

        setApplications(updatedApplications)
        setStats(newStats)
        setOpenStatusDialog(false)
        setSelectedApp(null)
        setNewStatus("")
        setRejectionReason("")
        setError("")
      } else {
        console.error("Failed to update status")
        setError("Failed to update status")
      }
    } catch (err) {
      console.error("Error updating status:", err)
      setError("Error updating status")
    }
  }

  const uniqueStatuses = [...new Set(applications.map((app) => getLatestStatus(app)))]
  const uniqueCountries = [...new Set(applications.map((app) => app.country))]

  // View details handler
  const handleViewDetails = (app: VisaApplication) => {
    setSelectedApp(app)
    setOpenViewDialog(true)
  }

  // Document download handler
  const handleDocumentDownload = (url: string, fileName: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
        <div className="ml-3 text-lg text-gray-600">Loading visa applications...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Visa Applications Dashboard</h1>
          <p className="text-gray-600">Manage and track all visa applications</p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="flex items-center justify-center mb-2">
              <FileText className="h-5 w-5 text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-5 w-5 text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-5 w-5 text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.processing}</div>
            <div className="text-sm text-gray-600">Processing</div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="h-5 w-5 text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.approved}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="h-5 w-5 text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.issued}</div>
            <div className="text-sm text-gray-600">Issued</div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
            <div className="flex items-center justify-center mb-2">
              <XCircle className="h-5 w-5 text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.rejected}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Search and Filter Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by name, passport, email, or payment ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none"
                />
              </div>

              <div className="flex gap-3">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none bg-white min-w-[140px]"
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
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none bg-white min-w-[140px]"
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

            <div className="mt-4 text-gray-600 text-sm">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredApplications.length)} of{" "}
              {filteredApplications.length} applications
            </div>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Applicant
                    </div>
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Passport No.</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Country
                    </div>
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Payment ID
                    </div>
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Applied Date
                    </div>
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentApplications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-3">
                        <Search className="h-12 w-12 text-gray-300" />
                        <p className="text-lg font-medium">No applications found</p>
                        <p className="text-sm">Try adjusting your search or filter criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentApplications.map((app, index) => (
                    <tr
                      key={app._id}
                      className={`border-b border-gray-100 hover:bg-gray-50 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                            {getApplicantName(app).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{getApplicantName(app)}</div>
                            <div className="text-sm text-gray-500">{app.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {app.passportData[0]?.passport_number || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-700">{app.country}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded"> {app?.paymentId || "offline"}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(app.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded border bg-gray-100 text-gray-800 border-gray-200">
                          {getLatestStatus(app)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewDetails(app)}
                            className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </button>
                          <button
                            onClick={() => {
                              setSelectedApp(app)
                              setNewStatus("")
                              setOpenStatusDialog(true)
                            }}
                            className="inline-flex items-center px-3 py-1 bg-gray-600 text-white rounded text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Update
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Status Update Modal */}
        {openStatusDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Update Visa Status</h3>
                  <p className="text-sm text-gray-600 mt-1">Update status for {getApplicantName(selectedApp!)}</p>
                </div>
                <button
                  onClick={() => {
                    setOpenStatusDialog(false)
                    setRejectionReason("")
                    setError("")
                  }}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    New Status
                  </label>
                  <select
                    id="status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none"
                  >
                    <option value="">Select a status...</option>
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {newStatus === "visa_rejected" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rejection Reason *
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Please provide the reason for rejection..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 outline-none"
                    />
                  </div>
                )}

                {/* Application Details */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Application Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment ID:</span>
                      <span className="font-mono">{selectedApp?.paymentId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Country:</span>
                      <span>{selectedApp?.country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Travellers:</span>
                      <span>{selectedApp?.travellers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span>{selectedApp?.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span>{selectedApp?.phone}</span>
                    </div>
                  </div>
                </div>

                {selectedApp?.statusHistory && selectedApp.statusHistory.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status History</label>
                    <div className="max-h-32 overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-3 bg-gray-50">
                      {selectedApp.statusHistory.map((history, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="font-medium">{history.label}</span>
                          <span className="text-gray-500 text-xs">{new Date(history.date).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setOpenStatusDialog(false)
                    setRejectionReason("")
                    setError("")
                  }}
                  className="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusChange}
                  disabled={!newStatus.trim() || (newStatus === "visa_rejected" && !rejectionReason.trim())}
                  className="px-4 py-2 bg-gray-600 text-white rounded text-sm font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Details Modal */}
        {openViewDialog && selectedApp && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Application Details</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {getApplicantName(selectedApp)} - {selectedApp.country} Visa
                  </p>
                </div>
                <button
                  onClick={() => setOpenViewDialog(false)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Application Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Application ID:</span>
                        <span className="font-mono text-xs">{selectedApp._id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Visa ID:</span>
                        <span className="font-mono text-xs">{selectedApp.visaId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Country:</span>
                        <span className="font-medium">{selectedApp.country}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Travellers:</span>
                        <span>{selectedApp.travellers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment ID:</span>
                        <span className="font-mono text-xs">
                          {selectedApp.paymentId && selectedApp.paymentId !== 'undefined' ? selectedApp.paymentId : 'offline'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded border bg-gray-100 text-gray-800 border-gray-200">
                          {getLatestStatus(selectedApp)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="break-all">{selectedApp.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span>{selectedApp.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Applied Date:</span>
                        <span>{new Date(selectedApp.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Passport Information */}
                {selectedApp.passportData && selectedApp.passportData.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Passport Information
                    </h4>
                    <div className="space-y-4">
                      {selectedApp.passportData.map((passport, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-medium text-gray-800 mb-2">Traveller {index + 1}</h5>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Name:</span>
                              <p className="font-medium">{passport.given_names} {passport.surname}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Passport Number:</span>
                              <p className="font-mono">{passport.passport_number}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Nationality:</span>
                              <p>{passport.nationality}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Date of Birth:</span>
                              <p>{passport.date_of_birth}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Date of Issue:</span>
                              <p>{passport.date_of_issue}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Date of Expiry:</span>
                              <p>{passport.date_of_expiry}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documents */}
                {selectedApp.documents && Object.keys(selectedApp.documents).length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Download className="w-4 h-4 mr-2" />
                      Documents
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(selectedApp.documents).map(([key, docGroup]: [string, any]) => (
                        <div key={key} className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-medium text-gray-800 mb-2">Document Group: {key}</h5>
                          {Object.entries(docGroup).map(([docType, doc]: [string, any]) => (
                            <div key={docType} className="mb-2">
                              <p className="text-sm text-gray-600 capitalize mb-1">{docType}:</p>
                              <button
                                onClick={() => handleDocumentDownload(doc.url, doc.fileName)}
                                className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <Download className="h-3 w-3 mr-1" />
                                {doc.fileName}
                              </button>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status History */}
                {selectedApp.statusHistory && selectedApp.statusHistory.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Status History
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-2">
                        {selectedApp.statusHistory.map((history, index) => (
                          <div key={index} className="flex justify-between items-center text-sm py-2 border-b border-gray-200 last:border-b-0">
                            <span className="font-medium">{history.label}</span>
                            <span className="text-gray-500 text-xs">
                              {new Date(history.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => setOpenViewDialog(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
