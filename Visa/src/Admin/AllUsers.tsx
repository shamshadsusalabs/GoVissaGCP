"use client"

import React, { useState, useEffect } from "react"
import { Search, Users, CreditCard, FileText, Mail, Phone, Eye, Download } from "lucide-react"

interface User {
  _id: string
  phoneNumber: string
  email?: string
  createdAt: string
  updatedAt: string
  visaCount: number
  totalPayments: number
  onlinePayments: number
  offlinePayments: number
  totalAmount: number
  visaApplications: VisaApplication[]
  paymentOrders: PaymentOrder[]
}

interface VisaApplication {
  _id: string
  visaId: string
  paymentId: string
  country: string
  travellers: string
  processingMode: string
  createdAt: string
}

interface PaymentOrder {
  _id: string
  orderId: string
  amount: string
  status: string
  paymentType: string
  paymentMethod: string
  country: string
  createdAt: number
  isPaymentVerified: boolean
}

interface UserDetailsModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ user, isOpen, onClose }) => {
  if (!isOpen || !user) return null

  const formatDate = (dateString: string | number) => {
    const date = typeof dateString === 'number' ? new Date(dateString * 1000) : new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatAmount = (amount: string) => {
    return `₹${parseInt(amount).toFixed(2)}`
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-bold text-gray-900">User Details</h3>
            <p className="text-sm text-gray-600 mt-1">
              {user.email || user.phoneNumber} - {user.visaCount} Applications
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* User Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                User Information
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">User ID:</span>
                  <span className="font-mono text-xs">{user._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span>{user.phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span>{user.email || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Joined:</span>
                  <span>{formatDate(user.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <CreditCard className="w-4 h-4 mr-2" />
                Payment Summary
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Applications:</span>
                  <span className="font-medium">{user.visaCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Online Payments:</span>
                  <span className="text-green-600 font-medium">{user.onlinePayments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Offline Payments:</span>
                  <span className="text-orange-600 font-medium">{user.offlinePayments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-bold text-blue-600">{formatAmount(user.totalAmount.toString())}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Visa Applications */}
          {user.visaApplications && user.visaApplications.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Visa Applications ({user.visaApplications.length})
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Visa ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Travellers</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Payment ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mode</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {user.visaApplications.map((visa) => (
                      <tr key={visa._id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-xs font-mono">{visa.visaId.substring(0, 12)}...</td>
                        <td className="px-4 py-2 text-sm font-medium">{visa.country}</td>
                        <td className="px-4 py-2 text-sm">{visa.travellers}</td>
                        <td className="px-4 py-2 text-xs font-mono">
                          {visa.paymentId && visa.paymentId !== 'undefined' ? visa.paymentId.substring(0, 12) + '...' : 'offline'}
                        </td>
                        <td className="px-4 py-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            visa.processingMode === 'online' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {visa.processingMode}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">{formatDate(visa.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payment Orders */}
          {user.paymentOrders && user.paymentOrders.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <CreditCard className="w-4 h-4 mr-2" />
                Payment Orders ({user.paymentOrders.length})
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Payment Type</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Verified</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {user.paymentOrders.map((payment) => (
                      <tr key={payment._id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-xs font-mono">{payment.orderId.substring(0, 12)}...</td>
                        <td className="px-4 py-2 text-sm font-bold text-green-600">{formatAmount(payment.amount)}</td>
                        <td className="px-4 py-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            payment.status === 'paid' 
                              ? 'bg-green-100 text-green-800' 
                              : payment.status === 'created'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm">{payment.country}</td>
                        <td className="px-4 py-2 text-sm capitalize">{payment.paymentType}</td>
                        <td className="px-4 py-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            payment.isPaymentVerified 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {payment.isPaymentVerified ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">{formatDate(payment.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

const AllUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(10)

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        user._id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredUsers(filtered)
    setCurrentPage(1)
  }, [searchTerm, users])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:5000/api/user/all-users-with-stats")
      
      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      const data = await response.json()
      setUsers(data.users || [])
      setFilteredUsers(data.users || [])
    } catch (err) {
      console.error("Error fetching users:", err)
      setError("Failed to fetch users. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (user: User) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatAmount = (amount: number) => {
    return `₹${amount.toFixed(2)}`
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const startIndex = (currentPage - 1) * usersPerPage
  const endIndex = startIndex + usersPerPage
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500 p-8">
          <Users className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <p className="text-xl font-semibold mb-2">Error Loading Users</p>
          <p>{error}</p>
          <button
            onClick={fetchUsers}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Users</h1>
          <p className="text-gray-600 mt-1">Manage and view all registered users</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2 inline" />
            Refresh
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by phone number, email, or user ID..."
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
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.reduce((sum, user) => sum + user.visaCount, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Online Payments</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.reduce((sum, user) => sum + user.onlinePayments, 0)}
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
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatAmount(users.reduce((sum, user) => sum + user.totalAmount, 0))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Info
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applications
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payments
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <Search className="h-12 w-12 text-gray-300" />
                      <p className="text-lg font-medium">No users found</p>
                      <p className="text-sm">Try adjusting your search criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user._id.substring(0, 12)}...
                        </div>
                        <div className="text-sm text-gray-500">User ID</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="flex items-center text-sm text-gray-900">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {user.phoneNumber}
                        </div>
                        {user.email && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                            {user.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{user.visaCount}</span>
                        <span className="text-sm text-gray-500 ml-1">applications</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="text-green-600 font-medium">{user.onlinePayments}</span>
                          <span className="text-gray-500"> online</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-orange-600 font-medium">{user.offlinePayments}</span>
                          <span className="text-gray-500"> offline</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-green-600">
                        {formatAmount(user.totalAmount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(user)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of{" "}
            {filteredUsers.length} users
          </div>
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* User Details Modal */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedUser(null)
        }}
      />
    </div>
  )
}

export default AllUsers
