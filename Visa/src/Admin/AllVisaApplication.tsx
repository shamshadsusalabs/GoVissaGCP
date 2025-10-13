"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Eye, Edit, Users, CreditCard, Calendar, Phone, Mail, FileText, UserPlus, X, Download } from "lucide-react"

interface Document {
  url: string
  fileName: string
}

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
}

interface StatusEntry {
  label: string
  date: string
  rejectionReason?: string // ✅ Add optional rejection reason field
}

interface VisaApplication {
  _id: string
  visaId: string
  country: string
  paymentId: string
  paymentOrderId: string // ✅ Added paymentOrderId field
  travellers: string
  email: string
  phone: string
  documents: { [key: string]: Document }
  passportData: PassportData[]
  createdAt: string
  updatedAt: string
  __v: number
  statusHistory?: StatusEntry[]
  processingMode?: string // ✅ Added processingMode field
  employeeId?: string // ✅ Added employeeId field
}

interface Employee {
  _id: string
  name: string
  phoneNumber: string
  email: string
  isVerified: boolean
  visaIds: string[] // deprecated - keeping for backward compatibility
  applicationIds: string[] // new field for individual application assignments
  employeeId: string // ✅ Added employeeId field
  points: number
  createdAt: string
  updatedAt: string
  __v: number
}

interface ApiResponse {
  message: string
  data: VisaApplication[]
}


const AllVisaApplication: React.FC = () => {
  const navigate = useNavigate()
  const [applications, setApplications] = useState<VisaApplication[]>([])
  const [filteredApplications, setFilteredApplications] = useState<VisaApplication[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [rowsPerPage] = useState(5)
  const [openStatusDialog, setOpenStatusDialog] = useState(false)
  const [openAssignDialog, setOpenAssignDialog] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [selectedApp, setSelectedApp] = useState<VisaApplication | null>(null)
  const [loading, setLoading] = useState(true)
  const [employeesLoading, setEmployeesLoading] = useState(false)
  const [error, setError] = useState("")
  
  // ✅ NEW: Employee assignment management states
  const [openRemoveAssignDialog, setOpenRemoveAssignDialog] = useState(false)
  
  // ✅ NEW: Payment approval states
  const [openPaymentApprovalDialog, setOpenPaymentApprovalDialog] = useState(false)
  const [pendingPayments, setPendingPayments] = useState<any[]>([])
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [approvalLoading, setApprovalLoading] = useState(false)
  const [approvalNotes, setApprovalNotes] = useState("")
  const [visaConfigurations, setVisaConfigurations] = useState<any[]>([])
  const [paymentVisaDetails, setPaymentVisaDetails] = useState<any>(null)
  const [paymentOrders, setPaymentOrders] = useState<any[]>([]) // Store payment orders for traveller details

  // Predefined status options
  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "document_received", label: "Document Received" },
    { value: "document_verified", label: "Document Verified" },
    { value: "in_process_with_embassy", label: "In Process with Embassy" },
    { value: "visa_approved", label: "Visa Approved" },
    { value: "visa_rejected", label: "Visa Rejected" },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/VisaApplication/GetAll")
        const data: ApiResponse = await response.json()
        setApplications(data.data)
        setFilteredApplications(data.data)
        setLoading(false)
        
        // Also fetch employees to show assignment status
        fetchEmployees()
        
        // ✅ NEW: Fetch pending payments on page load
        fetchPendingPayments()
        
        // ✅ NEW: Fetch payment orders for traveller details
        fetchPaymentOrders()
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Failed to fetch visa applications")
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const fetchEmployees = async () => {
    try {
      setEmployeesLoading(true)
      const response = await fetch("http://localhost:5000/api/employee/getAll")
      const data = await response.json()
      
      // Check if data is directly an array or wrapped in an object
      const employeesArray = Array.isArray(data) ? data : (data.data || [])
      
      setEmployees(employeesArray)
      setFilteredEmployees(employeesArray)
    } catch (err) {
      setEmployees([])
      setFilteredEmployees([])
    } finally {
      setEmployeesLoading(false)
    }
  }

  const fetchPendingPayments = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      const response = await fetch("http://localhost:5000/api/payments/pending-approvals", {
        headers: {
          "Authorization": `Bearer ${token}` 
        }
      })
      const data = await response.json()
      if (data.success) {
        setPendingPayments(data.data)
        // Also fetch visa configurations for payment details
        fetchVisaConfigurations()
      }
    } catch (err) {
      // Error fetching pending payments
    }
  }

  // ✅ NEW: Fetch visa configurations
  const fetchVisaConfigurations = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/configurations/getAll")
      const data = await response.json()
      if (data.success && data.data) {
        setVisaConfigurations(data.data)
      }
    } catch (err) {
      // Error fetching visa configurations
    }
  }

  // ✅ NEW: Fetch payment orders for traveller details
  const fetchPaymentOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/payments/getAll")
      const data = await response.json()
      if (data.success && data.data) {
        setPaymentOrders(data.data)
      }
    } catch (err) {
      // Error fetching payment orders
    }
  }

  // ✅ NEW: Get visa details by visaId
  const getVisaDetailsByVisaId = (visaId: string) => {
    const visaConfig = visaConfigurations.find(config => config._id === visaId)
    if (visaConfig && visaConfig.countryDetails) {
      return {
        countryName: visaConfig.countryDetails.name || 'Unknown Country',
        countryCode: visaConfig.countryDetails.code || 'N/A',
        embassyLocation: visaConfig.countryDetails.embassyLocation || 'N/A',
        applicationTips: visaConfig.countryDetails.applicationTips || 'N/A',
        visaTypes: visaConfig.visaTypes || [],
        continent: visaConfig.continent || 'N/A'
      }
    }
    return null
  }

  // ✅ NEW: Get traveller details from payment order using paymentOrderId
  const getTravellerDetails = (paymentOrderId: string) => {
    const paymentOrder = paymentOrders.find(order => order._id === paymentOrderId)
    if (paymentOrder && paymentOrder.travellerDetails) {
      return paymentOrder.travellerDetails
    }
    return null
  }

  // ✅ NEW: Handle payment approval
  const handlePaymentApproval = async () => {
    if (!selectedPayment || !approvalNotes.trim()) {
      setError("Please provide approval notes")
      return
    }

    try {
      setApprovalLoading(true)
      const token = localStorage.getItem("accessToken")
      const adminId = localStorage.getItem("adminId") || "admin"

      const response = await fetch("http://localhost:5000/api/payments/approve-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId: selectedPayment.orderId,
          adminId: adminId,
          notes: approvalNotes,
          paymentType: selectedPayment.paymentType
        })
      })

      const data = await response.json()
      if (data.success) {
        setOpenPaymentApprovalDialog(false)
        setSelectedPayment(null)
        setApprovalNotes("")
        fetchPendingPayments() // Refresh the list
        setError("")
      } else {
        setError(data.message || "Payment approval failed")
      }
    } catch (err) {
      setError("Payment approval failed. Please try again.")
    } finally {
      setApprovalLoading(false)
    }
  }

  // ✅ NEW: Open payment approval dialog
  const openPaymentApprovalModal = (payment: any) => {
    setSelectedPayment(payment)
    // Get visa details for this payment
    const visaDetails = getVisaDetailsByVisaId(payment.visaId)
    setPaymentVisaDetails(visaDetails)
    setOpenPaymentApprovalDialog(true)
  }

  // ✅ Helper function to get visa type from visa configurations
  const getVisaTypeByVisaId = (visaId: string) => {
    const visaConfig = visaConfigurations.find(config => config._id === visaId)
    if (visaConfig && visaConfig.visaTypes && visaConfig.visaTypes.length > 0) {
      // Return the first visa type name, or empty if not available
      return visaConfig.visaTypes[0].name || ''
    }
    return ''
  }

  // ✅ Helper function to get document uploader info
  const getDocumentUploader = (application: VisaApplication) => {
    if (application.processingMode === "online") {
      return "Self"
    } else if (application.processingMode === "offline" && application.employeeId) {
      // Find employee by employeeId (not _id)
      const employee = employees.find(emp => emp.employeeId === application.employeeId)
      return employee ? employee.name : `Employee ID: ${application.employeeId}`
    }
    return "Unknown"
  }

  // ✅ Helper function to extract travel date from payment order selectedDate
  const getTravelDate = (application: VisaApplication) => {
    // First try to get travel date from payment order using paymentOrderId
    if (application.paymentOrderId) {
      const paymentOrder = paymentOrders.find(order => order._id === application.paymentOrderId)
      if (paymentOrder && paymentOrder.selectedDate) {
        // Format the selectedDate to a readable format
        const travelDate = new Date(paymentOrder.selectedDate)
        return travelDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        })
      }
    }
    
    // Fallback: Check if there's a travel date in documents
    if (application.documents) {
      // Look for common document names that might contain travel date
      const travelDoc = application.documents['travelItinerary'] || 
                       application.documents['flightTicket'] || 
                       application.documents['hotelBooking']
      
      if (travelDoc && travelDoc.fileName) {
        // Try to extract date from filename if it follows a pattern
        const dateMatch = travelDoc.fileName.match(/(\d{4}-\d{2}-\d{2}|\d{2}-\d{2}-\d{4}|\d{2}\/\d{2}\/\d{4})/)
        if (dateMatch) {
          return dateMatch[0]
        }
      }
    }
    
    // If no travel date found, return empty
    return ''
  }

  // ✅ NEW: Excel Export Function
  const exportToExcel = async () => {
    try {
      // Use all applications data for export
      const exportApplications = applications
      
      // Create CSV content with management format
      const headers = [
        'Application ID',
        'Order ID', 
        'Visa ID',
        'Country',
        'Visa Type',
        'Date Of Travel',
        'Email', 
        'Phone', 
        'Travellers',
        'Promo Code', 
        'Payment ID / Type', 
        'Status / Payment', 
        'Created Date',
        'Application Status',
        'Applicant Name',
        'Passport Number',
        'Nationality',
        'Document Uploader',
        'Query assigned at (DATE AND TIME)',
        'Remarks'
      ]
      
      const csvContent = [
        headers.join(','),
        ...exportApplications.map((application) => {
          const status = getLastStatus(application)
          const firstPassport = application.passportData?.[0] || {}
          
          // Only show data if available, no N/A or empty fallbacks
          const applicantName = (() => {
            const givenName = firstPassport.givenName || ''
            const surname = firstPassport.surname || ''
            const fullName = `${givenName} ${surname}`.trim()
            return fullName || ''
          })()
          
          const passportNumber = firstPassport.passportNumber || ''
          const nationality = firstPassport.nationality || ''
          const date = new Date(application.createdAt).toLocaleDateString()
          const visaType = getVisaTypeByVisaId(application.visaId)
          const travelDate = getTravelDate(application)
          const orderId = application.paymentOrderId || ''
          
          // Get promo code and payment details from payment order
          const paymentOrder = application.paymentOrderId ? 
            paymentOrders.find(order => order._id === application.paymentOrderId) : null
          
          const promoCode = paymentOrder?.promoCode || ''
          
          // Payment ID / Type - only show if data exists
          const paymentIdType = (() => {
            if (paymentOrder && paymentOrder.paymentType) {
              const paymentId = application.paymentId && application.paymentId !== 'undefined' ? 
                application.paymentId : ''
              const paymentType = paymentOrder.paymentType
              
              if (paymentType === 'offline') {
                return 'offline'
              } else if (paymentId) {
                return `${paymentId} / ${paymentType}`
              } else {
                return paymentType
              }
            }
            
            // Fallback to application payment data
            if (application.paymentId && application.paymentId !== 'undefined') {
              return `${application.paymentId} / online`
            }
            
            return 'offline'
          })()
          
          // Status / Payment - combine application status and payment status
          const statusPayment = (() => {
            if (paymentOrder && paymentOrder.status) {
              return `${status} / ${paymentOrder.status}`
            }
            return `${status} / offline`
          })()
          
          // Application Status - more detailed status
          const applicationStatus = (() => {
            if (status.toLowerCase() === 'pending') {
              return 'Pending Documents'
            }
            return status
          })()
          
          // Query assigned at - find assigned employee and assignment date
          const assignedEmployee = employees.find(emp => 
            emp.applicationIds && emp.applicationIds.includes(application._id)
          )
          const queryAssignedAt = assignedEmployee ? 
            `Assigned to ${assignedEmployee.name}` : ''
          
          // Document uploader info
          const documentUploader = getDocumentUploader(application)
          
          // Remarks - empty for now, can be filled later
          const remarks = ''
          
          return [
            `"${application._id}"`,
            `"${orderId}"`,
            `"${application.visaId}"`,
            `"${application.country}"`,
            `"${visaType}"`,
            `"${travelDate}"`,
            `"${application.email}"`,
            `"${application.phone}"`,
            `"${application.travellers}"`,
            `"${promoCode}"`,
            `"${paymentIdType}"`,
            `"${statusPayment}"`,
            `"${date}"`,
            `"${applicationStatus}"`,
            `"${applicantName}"`,
            `"${passportNumber}"`,
            `"${nationality}"`,
            `"${documentUploader}"`,
            `"${queryAssignedAt}"`,
            `"${remarks}"`
          ].join(',')
        })
      ].join('\n')

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `all_visa_applications_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      alert('Failed to export data. Please try again.')
    }
  }

  useEffect(() => {
    const filtered = applications.filter(
      (app) =>
        app.visaId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.phone.includes(searchTerm) ||
        app.paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.country.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredApplications(filtered)
  }, [searchTerm, applications])

  useEffect(() => {
    const filtered = (employees || []).filter(
      (employee) =>
        employee.name.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(employeeSearchTerm.toLowerCase()),
    )
    setFilteredEmployees(filtered)
  }, [employeeSearchTerm, employees])

  const getLastStatus = (app: VisaApplication) => {
    if (app.statusHistory && app.statusHistory.length > 0) {
      return app.statusHistory[app.statusHistory.length - 1].label
    }
    return "pending"
  }

  // ✅ Helper function to get user-friendly status display
  const getStatusDisplay = (status: string) => {
    const statusOption = statusOptions.find(option => option.value === status.toLowerCase())
    return statusOption ? statusOption.label : status
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "document_received":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "document_verified":
        return "bg-indigo-100 text-indigo-800 border-indigo-200"
      case "in_process_with_embassy":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "visa_approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "visa_rejected":
        return "bg-red-100 text-red-800 border-red-200"
      // Legacy status support
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleViewDetails = (app: VisaApplication) => {
    navigate(`/dashboard/VisaFullDeatils/${app._id}`)
  }

  const openStatusModal = (app: VisaApplication) => {
    setSelectedApp(app)
    const currentStatus = getLastStatus(app)
    setNewStatus(currentStatus)
    setRejectionReason("") // Reset rejection reason
    setOpenStatusDialog(true)
  }

  const openAssignModal = (app: VisaApplication) => {
    setSelectedApp(app)
    setOpenAssignDialog(true)
    setEmployeeSearchTerm("")
    if (employees.length === 0) {
      fetchEmployees()
    }
  }

  // ✅ NEW: Open remove assignment modal
  const openRemoveAssignModal = (app: VisaApplication) => {
    setSelectedApp(app)
    setOpenRemoveAssignDialog(true)
  }

  const handleStatusChange = async () => {
    if (!selectedApp) return

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

      const response = await fetch(
        `http://localhost:5000/api/VisaApplication/visa-status/${selectedApp._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        },
      )

      if (response.ok) {
        setApplications((prev) =>
          prev.map((app) =>
            app._id === selectedApp._id
              ? {
                  ...app,
                  statusHistory: [...(app.statusHistory || []), { 
                    label: newStatus, 
                    date: new Date().toISOString(),
                    rejectionReason: newStatus === "visa_rejected" ? rejectionReason : undefined
                  }],
                }
              : app,
          ),
        )
        setOpenStatusDialog(false)
        setRejectionReason("") // Reset rejection reason
        setError("") // Clear any previous errors
      } else {
        setError("Failed to update status")
      }
    } catch (err) {
      setError("Error updating status")
    }
  }

  const handleAssignEmployee = async (employeeId: string) => {
    try {
      if (!employeeId) {
        alert("Employee ID is missing. Please try again.")
        return
      }
      if (!selectedApp) {
        alert("No application selected.")
        return
      }

      // Use individual application _id for assignment
      const applicationId = selectedApp._id

      const response = await fetch(`http://localhost:5000/api/employee/addApplicationId/${employeeId}/add-application`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: applicationId }),
      })

      if (response.ok) {
        const responseData = await response.json()
        // Update the employee's applicationIds in local state
        setEmployees((prev) =>
          prev.map((emp) =>
            emp._id === employeeId
              ? { 
                  ...emp, 
                  applicationIds: emp.applicationIds ? 
                    [...emp.applicationIds.filter(id => id !== applicationId), applicationId] : 
                    [applicationId]
                }
              : emp,
          ),
        )
        setOpenAssignDialog(false)
        alert(`Application assigned successfully to ${responseData.assignedApplication ? responseData.assignedApplication.country : 'employee'}!`)
      } else {
        // Surface backend error message for easier debugging
        let message = "Failed to assign application"
        try {
          const errJson = await response.json()
          if (errJson?.message) message = errJson.message
        } catch (_) {
          // fallback to text if JSON parse fails
          try {
            const errText = await response.text()
            if (errText) message = errText
          } catch { /* ignore */ }
        }
        alert(message)
      }
    } catch (err) {
      alert("Error assigning application")
    }
  }

  // ✅ NEW: Handle remove assignment (removes applicationId from employee)
  const handleRemoveAssignment = async () => {
    try {
      if (!selectedApp) {
        alert("No application selected.")
        return
      }

      const applicationId = selectedApp._id
      
      // Find the currently assigned employee
      const assignedEmployee = employees.find(emp => 
        emp.applicationIds && emp.applicationIds.includes(applicationId)
      )

      if (!assignedEmployee) {
        alert("No employee found assigned to this application.")
        return
      }

      const response = await fetch(`http://localhost:5000/api/employee/removeApplicationId/${assignedEmployee._id}/remove-application`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: applicationId }),
      })

      if (response.ok) {
        // Update the employee's applicationIds in local state
        setEmployees((prev) =>
          prev.map((emp) =>
            emp._id === assignedEmployee._id
              ? { 
                  ...emp, 
                  applicationIds: emp.applicationIds ? 
                    emp.applicationIds.filter(id => id !== applicationId) : 
                    []
                }
              : emp,
          ),
        )

        setOpenRemoveAssignDialog(false)
        alert(`Application removed successfully from ${assignedEmployee.name}!`)
      } else {
        let message = "Failed to remove assignment"
        try {
          const errJson = await response.json()
          if (errJson?.message) message = errJson.message
        } catch (_) {
          try {
            const errText = await response.text()
            if (errText) message = errText
          } catch { /* ignore */ }
        }
        alert(message)
      }
    } catch (err) {
      alert("Error removing assignment")
    }
  }

  const paginatedData = filteredApplications.slice((page - 1) * rowsPerPage, page * rowsPerPage)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading visa applications...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500 p-8">
          <FileText className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <p className="text-xl font-semibold mb-2">Error Loading Data</p>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Visa Applications</h1>
        <div className="flex space-x-4">
          <button
            onClick={exportToExcel}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2 inline" />
            Excel Export
          </button>
          <button
            onClick={fetchPendingPayments}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <CreditCard className="w-4 h-4 mr-2 inline" />
            Payment Approvals ({pendingPayments.length})
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by Visa ID, Email, Phone, Payment ID, Country, or Application ID..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Travellers</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.reduce((sum, app) => sum + Number.parseInt(app.travellers), 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter((app) => getLastStatus(app).toLowerCase() === "pending").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Processed</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter((app) => getLastStatus(app).toLowerCase() !== "pending").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Application
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Travellers
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document Uploader
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((app) => {
                // Match employee applicationIds with individual application _id
                // Fallback to visaIds for backward compatibility during transition
                const assignedEmployee = (employees || []).find(emp => {
                  // First check applicationIds (new system)
                  if (emp.applicationIds && emp.applicationIds.includes(app._id)) {
                    return true;
                  }
                  // Fallback to visaIds (old system) - but only if no applicationIds exist
                  if ((!emp.applicationIds || emp.applicationIds.length === 0) && 
                      emp.visaIds && emp.visaIds.includes(app.visaId)) {
                    return true;
                  }
                  return false;
                })
                const isAssigned = !!assignedEmployee
                
                
                return (
                <tr key={app._id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{app.visaId.substring(0, 8)}...</div>
                      <div className="text-sm text-gray-500">ID: {app._id.substring(0, 8)}...</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{app.country}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="flex items-center text-sm text-gray-900">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {app.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {app.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      <div>
                        <span className="text-sm font-medium text-gray-900">{app.travellers}</span>
                        <span className="text-sm text-gray-500 ml-1">
                          traveller{Number.parseInt(app.travellers) > 1 ? "s" : ""}
                        </span>
                        {(() => {
                          // ✅ Get detailed breakdown from payment order
                          const travellerDetails = getTravellerDetails(app.paymentOrderId)
                          if (travellerDetails) {
                            return (
                              <div className="text-xs text-gray-500 mt-1">
                                {travellerDetails.adults}A, {travellerDetails.children}C, {travellerDetails.infants}I
                              </div>
                            )
                          }
                          return null
                        })()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-sm text-gray-900">
  {app.paymentId && app.paymentId !== "undefined" ? app.paymentId : "offline"}
</span>

                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(getLastStatus(app))}`}
                    >
                      {getStatusDisplay(getLastStatus(app))}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-gray-400" />
                      <span className={`text-sm font-medium ${
                        getDocumentUploader(app) === "Self" 
                          ? "text-green-700 bg-green-100 px-2 py-1 rounded-full" 
                          : "text-blue-700 bg-blue-100 px-2 py-1 rounded-full"
                      }`}>
                        {getDocumentUploader(app)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(app.createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(app)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => openStatusModal(app)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Status
                      </button>
                      {!isAssigned ? (
                        <button
                          onClick={() => openAssignModal(app)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                        >
                          <UserPlus className="w-4 h-4 mr-1" />
                          Assign
                        </button>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium text-blue-700 bg-blue-100 border border-blue-200">
                            <Users className="w-3 h-3 mr-1" />
                            {assignedEmployee?.name || 'Assigned'}
                          </span>
                          <button
                            onClick={() => openRemoveAssignModal(app)}
                            className="inline-flex items-center px-2 py-1 border border-transparent text-xs leading-4 font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                            title="Remove Assignment"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredApplications.length)} of{" "}
          {filteredApplications.length} results
        </div>
        <div className="flex space-x-2">
          {Array.from({ length: Math.ceil(filteredApplications.length / rowsPerPage) }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                page === i + 1
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Status Change Modal */}
      {openStatusDialog && selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Change Application Status</h2>
              <button
                onClick={() => setOpenStatusDialog(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="">Select Status</option>
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rejection Reason Field - Only show when visa_rejected is selected */}
              {newStatus === "visa_rejected" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Please provide the reason for rejection..."
                    rows={3}
                    required
                  />
                </div>
              )}

              <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                Current status: <strong className="text-gray-900">{getStatusDisplay(getLastStatus(selectedApp))}</strong>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                  {error}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setOpenStatusDialog(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusChange}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Employee Modal */}
      {openAssignDialog && selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Assign Employee</h2>
              <button
                onClick={() => setOpenAssignDialog(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg mb-4">
                  Assigning application: <strong className="text-gray-900">{selectedApp._id.substring(0, 12)}...</strong>
                  <br />
                  Visa ID: <strong className="text-gray-900">{selectedApp.visaId}</strong>
                  <br />
                  Country: <strong className="text-gray-900">{selectedApp.country}</strong>
                </div>

                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search employees by name or email..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={employeeSearchTerm}
                    onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto">
                {employeesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                ) : (filteredEmployees || []).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    {employeeSearchTerm ? "No employees found matching your search" : "No employees available"}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {(filteredEmployees || []).map((employee) => {
                      const alreadyAssigned = !!selectedApp && 
                        (employee.applicationIds && employee.applicationIds.includes(selectedApp._id))
                      return (
                        <div
                          key={employee._id}
                          onClick={() => {
                            if (alreadyAssigned) return
                            handleAssignEmployee(employee._id)
                          }}
                          className={`p-4 border border-gray-200 rounded-lg transition-colors duration-200 ${
                            alreadyAssigned
                              ? "bg-gray-50 cursor-not-allowed opacity-60"
                              : "hover:bg-gray-50 cursor-pointer"
                          }`}
                          title={alreadyAssigned ? "This application is already assigned to the employee" : "Assign to this employee"}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900">{employee.name}</div>
                              <div className="text-sm text-gray-500">{employee.email}</div>
                              <div className="text-sm text-gray-500">{employee.phoneNumber}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-500">
                                {(employee.applicationIds || employee.visaIds || []).length} application{(employee.applicationIds || employee.visaIds || []).length !== 1 ? "s" : ""} assigned
                              </div>
                              <div className="text-sm text-gray-500">{employee.points} points</div>
                              {employee.isVerified && <div className="text-xs text-green-600 font-medium">Verified</div>}
                              {alreadyAssigned && (
                                <div className="text-xs text-blue-600 font-medium mt-1">Already assigned</div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setOpenAssignDialog(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Assignment Modal */}
      {openRemoveAssignDialog && selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Remove Assignment</h2>
              <button
                onClick={() => setOpenRemoveAssignDialog(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to remove this application from the assigned employee?
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Application:</strong> {selectedApp.country}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  <strong>Email:</strong> {selectedApp.email}
                </p>
                {(() => {
                  const assignedEmployee = employees.find(emp => 
                    emp.applicationIds?.includes(selectedApp._id)
                  )
                  return assignedEmployee && (
                    <p className="text-sm text-gray-700 mt-1">
                      <strong>Assigned to:</strong> {assignedEmployee.name}
                    </p>
                  )
                })()}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setOpenRemoveAssignDialog(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveAssignment}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                Remove Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Approval Dialog */}
      {openPaymentApprovalDialog && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Approve Payment</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order ID
                </label>
                <p className="text-sm text-gray-900 bg-gray-100 p-2 rounded">
                  {selectedPayment.orderId}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Type
                </label>
                <p className="text-sm text-gray-900 bg-gray-100 p-2 rounded capitalize">
                  {selectedPayment.paymentType}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount Details
                </label>
                <div className="bg-gray-100 p-2 rounded space-y-1">
                  <p className="text-sm text-gray-900">Final Amount: ₹{(parseInt(selectedPayment.amount) / 100).toFixed(2)}</p>
                  {selectedPayment.originalAmount && (
                    <p className="text-sm text-gray-900">Original Amount: ₹{selectedPayment.originalAmount}</p>
                  )}
                  {selectedPayment.discountAmount && (
                    <p className="text-sm text-green-600">Discount: −₹{selectedPayment.discountAmount}</p>
                  )}
                  {selectedPayment.promoCode && (
                    <p className="text-sm text-blue-600">Promo Code: {selectedPayment.promoCode}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Details
                </label>
                <div className="bg-gray-100 p-2 rounded space-y-1">
                  <p className="text-sm text-gray-900">Email: {selectedPayment.email}</p>
                  <p className="text-sm text-gray-900">Phone: {selectedPayment.phone}</p>
                  <p className="text-sm text-gray-900">Country: {selectedPayment.country}</p>
                  <p className="text-sm text-gray-900">Travellers: {selectedPayment.travellers}</p>
                </div>
              </div>

              {/* Visa Configuration Details */}
              {paymentVisaDetails && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visa Configuration Details
                  </label>
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 space-y-2">
                    <p className="text-sm text-gray-900"><strong>Country:</strong> {paymentVisaDetails.countryName}</p>
                    <p className="text-sm text-gray-900"><strong>Country Code:</strong> {paymentVisaDetails.countryCode}</p>
                    <p className="text-sm text-gray-900"><strong>Continent:</strong> {paymentVisaDetails.continent}</p>
                    <p className="text-sm text-gray-900"><strong>Embassy Location:</strong> {paymentVisaDetails.embassyLocation}</p>
                    {paymentVisaDetails.applicationTips !== 'N/A' && (
                      <p className="text-sm text-gray-900"><strong>Application Tips:</strong> {paymentVisaDetails.applicationTips}</p>
                    )}
                    {paymentVisaDetails.visaTypes && paymentVisaDetails.visaTypes.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-900 font-medium">Available Visa Types:</p>
                        <div className="mt-1 space-y-1">
                          {paymentVisaDetails.visaTypes.slice(0, 3).map((visaType: any, index: number) => (
                            <div key={index} className="text-xs bg-white p-2 rounded border">
                              <p><strong>{visaType.name}</strong> ({visaType.category})</p>
                              <p>Fee: ₹{visaType.visaFee} | Processing: {visaType.processingTime}</p>
                              <p>Validity: {visaType.validity} | Stay: {visaType.stayDuration}</p>
                            </div>
                          ))}
                          {paymentVisaDetails.visaTypes.length > 3 && (
                            <p className="text-xs text-gray-500">+{paymentVisaDetails.visaTypes.length - 3} more visa types</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {selectedPayment.paymentType === "paylater" && selectedPayment.payLaterDetails && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Corporate Details
                  </label>
                  <div className="bg-gray-100 p-2 rounded space-y-1">
                    <p className="text-sm text-gray-900">Company: {selectedPayment.payLaterDetails.corporateName}</p>
                    <p className="text-sm text-gray-900">Email: {selectedPayment.payLaterDetails.corporateEmail}</p>
                    <p className="text-sm text-gray-900">Phone: {selectedPayment.payLaterDetails.corporatePhone}</p>
                    <p className="text-sm text-gray-900">Credit Limit: ₹{selectedPayment.payLaterDetails.creditLimit}</p>
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Approval Notes *
                </label>
                <textarea
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  rows={3}
                  placeholder="Enter approval notes..."
                  required
                />
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setOpenPaymentApprovalDialog(false)
                  setSelectedPayment(null)
                  setApprovalNotes("")
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePaymentApproval}
                disabled={approvalLoading || !approvalNotes.trim()}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {approvalLoading ? "Approving..." : "Approve Payment"}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Payment Approval List */}
      {pendingPayments.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Pending Payment Approvals</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Country
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingPayments.map((payment) => (
                    <tr key={payment.orderId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.orderId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                        {payment.paymentType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{(parseInt(payment.amount) / 100).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <p className="font-medium">{payment.email}</p>
                          <p className="text-gray-500">{payment.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          🌍 {payment.country}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(payment.createdAt * 1000).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openPaymentApprovalModal(payment)}
                          className="text-orange-600 hover:text-orange-900 font-semibold"
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AllVisaApplication