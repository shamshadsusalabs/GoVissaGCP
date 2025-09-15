"use client"

import { useEffect, useState } from "react"
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { MaterialIcons } from "@expo/vector-icons"

interface StatusStep {
  id: number
  name: string
  status: "completed" | "current" | "pending"
  date: string
}

interface ApiStatus {
  label: string
  date: string
}

export default function VisaStatusTracker() {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  const [statusData, setStatusData] = useState<StatusStep[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [applicationInfo, setApplicationInfo] = useState<any>(null)

  useEffect(() => {
    if (!id) return

    const fetchStatus = async () => {
      try {
        const response = await fetch(`https://govisaa-872569311567.asia-south2.run.app/api/VisaApplication/visa/status/${id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch visa status")
        }

        const data = await response.json()
        console.log("API Response:", data) // Debug log

        // Store application info
        setApplicationInfo(data)

        // Transform API data to our format
        const transformedData =
          data.statusHistory?.map((step: ApiStatus, index: number) => ({
            id: index + 1,
            name: step.label,
            status: "completed" as const,
            date: new Date(step.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
          })) || []

        // Mark last step as current if there are steps
        if (transformedData.length > 0) {
          transformedData[transformedData.length - 1].status = "current"
        }

        setStatusData(transformedData)
        setError(null)
      } catch (error) {
        console.error("Error fetching visa status:", error)
        setError(error instanceof Error ? error.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
  }, [id])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#10B981"
      case "current":
        return "#3B82F6"
      case "pending":
        return "#9CA3AF"
      default:
        return "#9CA3AF"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "check-circle"
      case "current":
        return "radio-button-checked"
      case "pending":
        return "radio-button-unchecked"
      default:
        return "radio-button-unchecked"
    }
  }

  const calculateProgress = () => {
    if (statusData.length === 0) return 0
    const completedSteps = statusData.filter((step) => step.status === "completed").length
    return (completedSteps / statusData.length) * 100
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <View className="items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="mt-6 text-lg font-medium text-gray-700">Loading visa status...</Text>
          <Text className="mt-2 text-sm text-gray-500">Please wait while we fetch your application details</Text>
        </View>
      </View>
    )
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-6">
        <View className="bg-red-50 border border-red-100 rounded-3xl p-8 items-center w-full max-w-sm">
          <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
            <MaterialIcons name="error-outline" size={32} color="#DC2626" />
          </View>
          <Text className="text-xl font-bold text-red-800 mb-2">Oops! Something went wrong</Text>
          <Text className="text-red-600 text-center leading-5 mb-6">{error}</Text>
          <TouchableOpacity onPress={() => router.back()} className="bg-red-600 px-8 py-3 rounded-xl w-full">
            <Text className="text-white font-semibold text-center">Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  if (!statusData.length) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-6">
        <View className="items-center">
          <View className="w-20 h-20 bg-blue-50 rounded-full items-center justify-center mb-6">
            <MaterialIcons name="info-outline" size={40} color="#3B82F6" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-2">No Status Available</Text>
          <Text className="text-gray-600 text-center leading-6 mb-8">
            Status information is not yet available for this application. Please check back later.
          </Text>
          <TouchableOpacity onPress={() => router.back()} className="bg-gray-900 px-8 py-4 rounded-xl">
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const progress = calculateProgress()

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-16 pb-6">
        <View className="flex-row items-center mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-4 w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
          >
            <MaterialIcons name="arrow-back" size={20} color="#374151" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-900">Application Status</Text>
        </View>

        {/* Application Info Card */}
        {applicationInfo && (
          <View className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 mb-4">
            <View className="flex-row items-center mb-4">
              <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center mr-4">
                <MaterialIcons name="flight-takeoff" size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-white mb-1">
                  {applicationInfo.country || "Visa"} Application
                </Text>
                <Text className="text-blue-100 text-sm">Track your application progress</Text>
              </View>
            </View>

            <View className="space-y-2">
              {/* Visa ID */}
              <View className="flex-row justify-between items-center">
                <Text className="text-blue-100 font-medium">Application ID</Text>
                <Text className="text-white font-semibold">
                  {applicationInfo.visaId
                    ? applicationInfo.visaId.slice(-8).toUpperCase()
                    : applicationInfo._id
                      ? applicationInfo._id.slice(-8).toUpperCase()
                      : "N/A"}
                </Text>
              </View>

              {/* Payment ID */}
              {applicationInfo.paymentId && (
                <View className="flex-row justify-between items-center">
                  <Text className="text-blue-100 font-medium">Payment ID</Text>
                  <Text className="text-white font-semibold">{applicationInfo.paymentId.slice(-6).toUpperCase()}</Text>
                </View>
              )}

              {/* Travellers */}
              {applicationInfo.travellers && (
                <View className="flex-row justify-between items-center">
                  <Text className="text-blue-100 font-medium">Travellers</Text>
                  <Text className="text-white font-semibold">{applicationInfo.travellers}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Progress Bar */}
        <View className="bg-white rounded-xl p-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-semibold text-gray-900">Progress</Text>
            <Text className="text-sm font-medium text-blue-600">{Math.round(progress)}% Complete</Text>
          </View>
          <View className="w-full bg-gray-200 rounded-full h-3">
            <View
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </View>
          <Text className="text-xs text-gray-500 mt-2">
            {statusData.filter((s) => s.status === "completed").length} of {statusData.length} steps completed
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Timeline */}
        <View className="bg-white rounded-2xl p-6 mb-6">
          <Text className="text-xl font-bold text-gray-900 mb-6">Application Timeline</Text>

          <View className="relative">
            {statusData.map((step, index) => {
              const isLast = index === statusData.length - 1
              const statusColor = getStatusColor(step.status)
              const statusIcon = getStatusIcon(step.status)

              return (
                <View key={step.id} className="flex-row items-start mb-6">
                  {/* Timeline Line */}
                  {!isLast && (
                    <View
                      className="absolute left-6 bg-gray-200"
                      style={{
                        top: 48,
                        height: 32,
                        width: 2,
                        zIndex: 0,
                      }}
                    />
                  )}

                  {/* Status Circle */}
                  <View className="flex-shrink-0 mr-4 z-10">
                    <View
                      className="w-12 h-12 rounded-full items-center justify-center shadow-sm"
                      style={{
                        backgroundColor: step.status === "current" ? statusColor : "white",
                        borderWidth: 3,
                        borderColor: statusColor,
                      }}
                    >
                      <MaterialIcons
                        name={statusIcon}
                        size={20}
                        color={step.status === "current" ? "white" : statusColor}
                      />
                    </View>
                  </View>

                  {/* Step Details */}
                  <View className="flex-1 pt-2">
                    <View
                      className={`p-4 rounded-xl ${
                        step.status === "current"
                          ? "bg-blue-50 border border-blue-200"
                          : step.status === "completed"
                            ? "bg-green-50 border border-green-200"
                            : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <Text
                        className={`text-lg font-semibold mb-2 ${
                          step.status === "current"
                            ? "text-blue-700"
                            : step.status === "completed"
                              ? "text-green-700"
                              : "text-gray-700"
                        }`}
                      >
                        {step.name}
                      </Text>

                      {step.date && step.status !== "pending" && (
                        <View className="flex-row items-center">
                          <MaterialIcons name="schedule" size={16} color="#6B7280" />
                          <Text className="text-gray-600 text-sm ml-2">Completed on {step.date}</Text>
                        </View>
                      )}

                      {step.status === "current" && (
                        <View className="flex-row items-center">
                          <View className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse" />
                          <Text className="text-blue-600 text-sm font-medium">Currently being processed</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              )
            })}
          </View>
        </View>

        {/* Status Legend */}
        <View className="bg-white rounded-2xl p-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Status Guide</Text>
          <View className="space-y-4">
            <View className="flex-row items-center">
              <View className="w-6 h-6 rounded-full bg-green-500 mr-4 items-center justify-center">
                <MaterialIcons name="check" size={16} color="white" />
              </View>
              <View>
                <Text className="font-medium text-gray-900">Completed</Text>
                <Text className="text-sm text-gray-500">This step has been finished</Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <View className="w-6 h-6 rounded-full bg-blue-500 mr-4 items-center justify-center">
                <MaterialIcons name="radio-button-checked" size={16} color="white" />
              </View>
              <View>
                <Text className="font-medium text-gray-900">In Progress</Text>
                <Text className="text-sm text-gray-500">Currently being processed</Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <View className="w-6 h-6 rounded-full bg-gray-400 mr-4 items-center justify-center">
                <MaterialIcons name="radio-button-unchecked" size={16} color="white" />
              </View>
              <View>
                <Text className="font-medium text-gray-900">Pending</Text>
                <Text className="text-sm text-gray-500">Waiting to be processed</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
