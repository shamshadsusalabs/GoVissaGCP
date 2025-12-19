"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native"
import { useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { MaterialIcons } from "@expo/vector-icons"

type VisaApplication = {
  _id: string
  visaId: string
  paymentId: string
  travellers: string
  country: string
  statusHistory: {
    label: string
    date: string
  }[]
  documents: Record<string, any>
  createdAt: string
  updatedAt: string
  processingMode?: string
}

export default function AppliedScreen() {
  const router = useRouter()
  const [applications, setApplications] = useState<VisaApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchApplications = async () => {
    try {
      const userString = await AsyncStorage.getItem("user")
      const accessToken = await AsyncStorage.getItem("accessToken")

      if (!userString || !accessToken) {
        throw new Error("User not authenticated")
      }

      const user = JSON.parse(userString)
      const phoneNumber = user.phoneNumber

      if (!phoneNumber) {
        throw new Error("Phone number not found")
      }

      const response = await fetch(`https://govisaa-872569311567.asia-south2.run.app/api/VisaApplication/by-phone/${phoneNumber}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch visa applications")
      }

      const data = await response.json()
      setApplications(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchApplications()
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "#10B981"
      case "rejected":
        return "#EF4444"
      case "pending":
        return "#F59E0B"
      case "processing":
        return "#3B82F6"
      default:
        return "#6B7280"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "check-circle"
      case "rejected":
        return "cancel"
      case "pending":
        return "schedule"
      case "processing":
        return "hourglass-empty"
      default:
        return "help"
    }
  }

  if (loading && !refreshing) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#000000" />
        <Text className="mt-4 text-gray-600 text-base">Loading visa applications...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-6">
        <View className="border border-gray-200 rounded-2xl p-8 items-center w-full max-w-md bg-white shadow-sm">
          <MaterialIcons name="error-outline" size={56} color="#EF4444" />
          <Text className="mt-4 text-xl font-bold text-gray-900">Error loading applications</Text>
          <Text className="mt-2 text-gray-600 text-center leading-5">{error}</Text>
          <TouchableOpacity onPress={fetchApplications} className="mt-6 px-6 py-3 bg-black rounded-xl">
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white px-6 pt-16 pb-6 border-b border-gray-100">
        <Text className="text-3xl font-bold text-gray-900">Your Applications</Text>
        <Text className="text-gray-500 mt-2 text-base">
          {applications.length} {applications.length === 1 ? "application" : "applications"} found
        </Text>
      </View>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#000000"]} />}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {applications.length === 0 ? (
          <View className="items-center justify-center py-16 px-4">
            <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-6">
              <MaterialIcons name="receipt" size={40} color="#9CA3AF" />
            </View>
            <Text className="text-gray-900 text-xl font-bold mb-2">No applications found</Text>
            <Text className="text-gray-500 text-center text-base leading-6">
              Start by creating a new visa application to see your progress here
            </Text>
          </View>
        ) : (
          applications.map((application, index) => {
            const paymentMode = application.processingMode === "offline" ? "Offline" : "Online"
            const latestStatus = application.statusHistory?.[application.statusHistory.length - 1]?.label || "Pending"
            const statusColor = getStatusColor(latestStatus)
            const statusIcon = getStatusIcon(latestStatus)

            return (
              <View
                key={application._id}
                className="bg-white rounded-2xl p-6 mb-5 border border-gray-100"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                {/* Status and Date Row */}
            <View className="mb-4">
  <View className="flex-row justify-between items-start flex-wrap">
    {/* LEFT: ICON + STATUS TEXT */}
    <View className="flex-shrink flex-row flex-wrap items-start max-w-[80%]">
      <MaterialIcons name={statusIcon} size={20} color={statusColor} />
      <Text
        className="ml-2 font-semibold text-base"
        style={{ color: statusColor }}
      >
        {latestStatus}
      </Text>
    </View>

    {/* RIGHT: DATE */}
    <Text className="text-gray-400 text-sm ml-2">
      {formatDate(application.createdAt)}
    </Text>
  </View>
</View>


                {/* Country and Visa ID */}
                <View className="mb-5">
                  <Text className="text-2xl font-bold text-gray-900 mb-1">{application.country}</Text>
                  <Text className="text-gray-500 text-sm">Visa ID: {application.visaId.slice(-8).toUpperCase()}</Text>
                </View>

                {/* Details Grid */}
                <View className="mb-6">
                  <View className="flex-row justify-between items-center py-3 border-b border-gray-50">
                    <View className="flex-row items-center">
                      <MaterialIcons name="people" size={18} color="#6B7280" />
                      <Text className="ml-2 text-gray-600 font-medium">Travellers</Text>
                    </View>
                    <Text className="font-semibold text-gray-900">{application.travellers}</Text>
                  </View>

                  <View className="flex-row justify-between items-center py-3 border-b border-gray-50">
                    <View className="flex-row items-center">
                      <MaterialIcons name="payment" size={18} color="#6B7280" />
                      <Text className="ml-2 text-gray-600 font-medium">Payment Mode</Text>
                    </View>
                    <Text className="font-semibold text-gray-900">{paymentMode}</Text>
                  </View>

                  {application.paymentId && (
                    <View className="flex-row justify-between items-center py-3">
                      <View className="flex-row items-center">
                        <MaterialIcons name="receipt-long" size={18} color="#6B7280" />
                        <Text className="ml-2 text-gray-600 font-medium">Payment ID</Text>
                      </View>
                      <Text className="font-semibold text-gray-900">
                        {application.paymentId.slice(-6).toUpperCase()}
                      </Text>
                    </View>
                  )}
                </View>

                {/* View Details Button */}
                <TouchableOpacity
                  className="bg-gray-900 rounded-xl py-4 flex-row items-center justify-center"
                  activeOpacity={0.8}
                  onPress={() => {
                    console.log("Navigating with ID:", application._id)
                    // Navigate to visa-status-tracker and pass the ID as a query parameter
                    router.push({
                      pathname: "/components/visa-status-tracker",
                      params: { id: application._id },
                    } as any)
                  }}
                >
                  <Text className="text-white font-semibold text-base mr-2">View Details</Text>
                  <MaterialIcons name="arrow-forward" size={18} color="white" />
                </TouchableOpacity>
              </View>
            )
          })
        )}
      </ScrollView>
    </View>
  )
}
