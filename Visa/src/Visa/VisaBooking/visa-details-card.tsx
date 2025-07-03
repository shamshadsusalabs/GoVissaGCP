"use client"

import type React from "react"

interface VisaType {
  name: string
  code: string
  category: string
  biometricRequired: boolean
  interviewRequired: boolean
  notes: string
  processingTime: string
  processingMethod: string
  visaFee: number
  serviceFee: number
  currency: "INR"
  validity: string
  entries: string
  stayDuration: string
}

interface VisaConfiguration {
  _id: string
  country: string
  countryCode: string
  embassyLocation: string
  visaTypes: VisaType[]
}

interface VisaDetailsCardProps {
  visaData: VisaConfiguration
  selectedDate: string
  setSelectedDate: (date: string) => void
  setShowCalendar: (show: boolean) => void
}

const VisaDetailsCard: React.FC<VisaDetailsCardProps> = ({
  visaData,
  selectedDate,
  setSelectedDate,
  setShowCalendar,
}) => {
  const visaType = visaData.visaTypes[0]
  const visaDetails = visaType

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
    return date.toLocaleDateString("en-US", options)
  }

  const getDaysDifference = (date: string): string => {
    const dateParts = date.split(" ")
    const month = new Date(Date.parse(dateParts[1] + " 1, 2012")).getMonth() + 1
    const day = Number.parseInt(dateParts[0])
    const year = Number.parseInt(dateParts[2])

    const selectedDate = new Date(year, month - 1, day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const diffTime = selectedDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return `in ${diffDays} day${diffDays !== 1 ? "s" : ""}`
  }

  const visaDetailsCards = [
    { label: "Visa Type", value: visaType.name || "N/A", icon: "📱" },
    { label: "Length of Stay", value: visaDetails.stayDuration || "N/A", icon: "📅" },
    { label: "Validity", value: visaDetails.validity || "N/A", icon: "⏱️" },
    { label: "Entry", value: visaDetails.entries || "N/A", icon: "🚪" },
  ]

  const guaranteeOptions = [
    {
      date: formatDate(new Date(new Date().setDate(new Date().getDate() + 4))),
      in: getDaysDifference(formatDate(new Date(new Date().setDate(new Date().getDate() + 4)))),
    },
    {
      date: formatDate(new Date(new Date().setDate(new Date().getDate() + 7))),
      in: getDaysDifference(formatDate(new Date(new Date().setDate(new Date().getDate() + 7)))),
    },
  ]

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{visaData.country || "N/A"} Visa Information</h2>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {visaDetailsCards.map((item, i) => (
          <div key={i} className="flex items-start space-x-3 bg-gray-50 rounded-lg p-3 border border-gray-100">
            <span className="text-2xl mt-1">{item.icon}</span>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">{item.label}</p>
              <p className="font-semibold text-gray-800">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Processing Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Processing Time</p>
            <p className="font-medium">{visaDetails.processingTime || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Processing Method</p>
            <p className="font-medium">{visaDetails.processingMethod || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Interview Required</p>
            <p className="font-medium">{visaDetails.interviewRequired ? "Yes" : "No"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Biometric Required</p>
            <p className="font-medium">{visaDetails.biometricRequired ? "Yes" : "No"}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
          Get a Guaranteed Visa on
        </h3>
        {guaranteeOptions.map((option, i) => (
          <div
            key={i}
            className={`border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center transition-all ${
              selectedDate === option.date
                ? "border-blue-500 bg-blue-50 shadow-blue-100 shadow-sm"
                : "border-gray-200 bg-white hover:bg-gray-50"
            }`}
          >
            <div>
              <p className="text-md font-medium text-gray-800 mt-2">{option.date}</p>
              <button
                onClick={() => setShowCalendar(true)}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center mt-1"
              >
                <span className="mr-1">👁</span> View Timeline
              </button>
            </div>
            <button
              onClick={() => setSelectedDate(option.date)}
              className={`px-4 py-2 rounded-md text-sm font-medium mt-3 sm:mt-0 transition-colors ${
                selectedDate === option.date
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {selectedDate === option.date ? "✓ Selected" : "Select"}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default VisaDetailsCard
