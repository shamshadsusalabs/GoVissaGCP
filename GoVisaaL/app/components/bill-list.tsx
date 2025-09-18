"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { View, Text, TouchableOpacity, ActivityIndicator, TextInput, FlatList, RefreshControl } from "react-native"
import { useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { MaterialIcons } from "@expo/vector-icons"

// Define types for our data
interface Payment {
  _id: string
  orderId: string
  amount: number
  currency: string
  status: string
  email: string
  phone: string
  selectedDate: string
  travellers: number
  createdAt: number
  paidAt?: string
  paymentId?: string
  country?: string
}

interface User {
  phoneNumber: string
}

const BillList: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const router = useRouter()

  // Get phone number and access token from AsyncStorage
  const getUserData = async (): Promise<{ phoneNumber: string; accessToken: string }> => {
    const userString = await AsyncStorage.getItem("user")
    const accessToken = await AsyncStorage.getItem("accessToken")

    if (!userString) {
      throw new Error("User not found in storage")
    }

    if (!accessToken) {
      throw new Error("Access token not found")
    }

    const user: User = JSON.parse(userString)
    return {
      phoneNumber: user.phoneNumber,
      accessToken: accessToken,
    }
  }

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true)
      const { phoneNumber, accessToken } = await getUserData()

      const response = await fetch(
        `https://govisaa-872569311567.asia-south2.run.app/api/payments/by-phone/${phoneNumber}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication failed. Please login again.")
        }
        throw new Error("Failed to fetch payments")
      }

      const data = await response.json()
      setPayments(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  const onRefresh = () => {
    setRefreshing(true)
    fetchPayments()
  }

  const handleInvoiceClick = (payment: Payment) => {
    // Navigate to bill screen with payment data using proper route
    console.log("Navigating to bill with payment:", payment._id)
    router.push({
      pathname: "/components/bill",
      params: {
        id: payment._id, // Changed from paymentId to id
        orderId: payment.orderId,
        amount: payment.amount.toString(),
        currency: payment.currency,
        status: payment.status,
        email: payment.email,
        phone: payment.phone,
        selectedDate: payment.selectedDate,
        travellers: payment.travellers.toString(),
        createdAt: payment.createdAt.toString(),
        paymentId: payment.paymentId || "",
        country: payment.country || "Unknown",
      },
    } as any)
  }

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment._id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string | number) => {
    if (typeof dateString === "number") {
      return new Date(dateString * 1000).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    }
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount / 100) // Assuming amount is in paisa
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return { bg: "bg-green-100", text: "text-green-800", border: "border-green-200" }
      case "created":
        return { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200" }
      case "failed":
        return { bg: "bg-red-100", text: "text-red-800", border: "border-red-200" }
      default:
        return { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-200" }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return "check-circle"
      case "created":
        return "schedule"
      case "failed":
        return "cancel"
      default:
        return "help"
    }
  }

  const StatusFilterButton = ({ status, label }: { status: string; label: string }) => {
    const isActive = statusFilter === status
    return (
      <TouchableOpacity
        onPress={() => setStatusFilter(status)}
        className={`px-4 py-2 rounded-full mr-2 mb-2 ${isActive ? "bg-blue-600" : "bg-gray-100"}`}
      >
        <Text className={`font-medium ${isActive ? "text-white" : "text-gray-700"}`}>{label}</Text>
      </TouchableOpacity>
    )
  }

  const renderPaymentCard = ({ item: payment }: { item: Payment }) => {
    const statusColors = getStatusColor(payment.status)
    const statusIcon = getStatusIcon(payment.status)

    return (
      <View
        className="bg-white rounded-2xl p-6 mb-4 border border-gray-100"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        {/* Header Row */}
        <View className="flex-row justify-between items-start mb-4">
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-900 mb-1">
              Order #{payment.orderId.slice(-8).toUpperCase()}
            </Text>
            <Text className="text-2xl font-bold text-gray-900">{formatCurrency(payment.amount, payment.currency)}</Text>
          </View>
          <View className={`px-3 py-1 rounded-full border ${statusColors.bg} ${statusColors.border}`}>
            <View className="flex-row items-center">
              <MaterialIcons name={statusIcon} size={16} color={statusColors.text.replace("text-", "#")} />
              <Text className={`ml-1 font-semibold text-xs uppercase ${statusColors.text}`}>{payment.status}</Text>
            </View>
          </View>
        </View>

        {/* Details Grid */}
        <View className="space-y-3 mb-5">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <MaterialIcons name="schedule" size={18} color="#6B7280" />
              <Text className="ml-2 text-gray-600 font-medium">Date</Text>
            </View>
            <Text className="font-semibold text-gray-900">{formatDate(payment.createdAt)}</Text>
          </View>

          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <MaterialIcons name="people" size={18} color="#6B7280" />
              <Text className="ml-2 text-gray-600 font-medium">Travellers</Text>
            </View>
            <Text className="font-semibold text-gray-900">{payment.travellers}</Text>
          </View>

          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <MaterialIcons name="email" size={18} color="#6B7280" />
              <Text className="ml-2 text-gray-600 font-medium">Email</Text>
            </View>
            <Text className="font-semibold text-gray-900 text-right flex-1 ml-4" numberOfLines={1}>
              {payment.email}
            </Text>
          </View>

          {payment.paymentId && (
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <MaterialIcons name="receipt-long" size={18} color="#6B7280" />
                <Text className="ml-2 text-gray-600 font-medium">Payment ID</Text>
              </View>
              <Text className="font-semibold text-gray-900">{payment.paymentId.slice(-8).toUpperCase()}</Text>
            </View>
          )}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          onPress={() => handleInvoiceClick(payment)}
          disabled={payment.status !== "paid"}
          className={`py-4 rounded-xl flex-row items-center justify-center ${
            payment.status === "paid" ? "bg-gray-900" : "bg-gray-200"
          }`}
          activeOpacity={0.8}
        >
          <MaterialIcons name="receipt" size={18} color={payment.status === "paid" ? "white" : "#9CA3AF"} />
          <Text className={`ml-2 font-semibold ${payment.status === "paid" ? "text-white" : "text-gray-500"}`}>
            {payment.status === "paid" ? "View Invoice" : "Invoice Unavailable"}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (loading && !refreshing) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600 text-base">Loading payment history...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-6">
        <View className="bg-red-50 border border-red-200 rounded-2xl p-8 items-center w-full max-w-md">
          <MaterialIcons name="error-outline" size={56} color="#DC2626" />
          <Text className="mt-4 text-xl font-bold text-red-800">Error loading payments</Text>
          <Text className="mt-2 text-red-600 text-center leading-5">{error}</Text>
          <TouchableOpacity onPress={fetchPayments} className="mt-6 px-6 py-3 bg-red-600 rounded-xl">
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-16 pb-6 border-b border-gray-100">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-3xl font-bold text-gray-900">Payment History</Text>
          <TouchableOpacity
            onPress={() => setShowFilters(!showFilters)}
            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
          >
            <MaterialIcons name="filter-list" size={20} color="#374151" />
          </TouchableOpacity>
        </View>

        <Text className="text-gray-500 text-base">
          {filteredPayments.length} {filteredPayments.length === 1 ? "payment" : "payments"} found
        </Text>
      </View>

      {/* Search and Filters */}
      <View className="bg-white px-6 py-4 border-b border-gray-100">
        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 mb-4">
          <MaterialIcons name="search" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search by Order ID, Email, or Payment ID"
            value={searchTerm}
            onChangeText={setSearchTerm}
            className="flex-1 ml-3 text-gray-900"
            placeholderTextColor="#9CA3AF"
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm("")}>
              <MaterialIcons name="clear" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Status Filters */}
        {showFilters && (
          <View className="mb-2">
            <Text className="text-sm font-medium text-gray-700 mb-3">Filter by Status</Text>
            <View className="flex-row flex-wrap">
              <StatusFilterButton status="all" label="All" />
              <StatusFilterButton status="paid" label="Paid" />
              <StatusFilterButton status="created" label="Created" />
              <StatusFilterButton status="failed" label="Failed" />
            </View>
          </View>
        )}
      </View>

      {/* Payment List */}
      {filteredPayments.length > 0 ? (
        <FlatList
          data={filteredPayments}
          renderItem={renderPaymentCard}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#3B82F6"]} />}
        />
      ) : (
        <View className="flex-1 items-center justify-center p-6">
          <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-6">
            <MaterialIcons name="receipt" size={40} color="#9CA3AF" />
          </View>
          <Text className="text-gray-900 text-xl font-bold mb-2">No payments found</Text>
          <Text className="text-gray-500 text-center text-base leading-6">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Your payment history will appear here once you make a payment"}
          </Text>
        </View>
      )}
    </View>
  )
}

export default BillList
