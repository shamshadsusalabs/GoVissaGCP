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
  currency: "INR" | "USD" // Keep for data, display will be '₹'
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
  selectedVisaType: VisaType
  setSelectedVisaType: (visaType: VisaType) => void
  selectedDate: string
  setSelectedDate: (date: string) => void
  setShowCalendar: (show: boolean) => void
}

const VisaDetailsCard: React.FC<VisaDetailsCardProps> = ({
  visaData,
  selectedVisaType,
  setSelectedVisaType,
  selectedDate,
  setSelectedDate,
  setShowCalendar,
}) => {
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
    const monthIndex = new Date(Date.parse(dateParts[1] + " 1, 2000")).getMonth()
    const day = Number.parseInt(dateParts[0])
    const year = Number.parseInt(dateParts[2])

    const targetDate = new Date(year, monthIndex, day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const diffTime = targetDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return `in ${diffDays} day${diffDays !== 1 ? "s" : ""}`
  }

  const visaDetailsCards = [
    { label: "Visa Type", value: selectedVisaType.name || "N/A", icon: "📱" },
    { label: "Length of Stay", value: selectedVisaType.stayDuration || "N/A", icon: "📅" },
    { label: "Validity", value: selectedVisaType.validity || "N/A", icon: "⏱️" },
    { label: "Entry", value: selectedVisaType.entries || "N/A", icon: "🚪" },
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

  const handleVisaTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const visaCode = e.target.value
    const newSelectedVisaType = visaData.visaTypes.find((vt) => vt.code === visaCode)
    if (newSelectedVisaType) {
      setSelectedVisaType(newSelectedVisaType)
    }
  }

  return (
    <div className="w-full rounded-2xl border border-gray-200 p-8 shadow-xl bg-white">
      <div className="p-0 mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">{visaData.country || "N/A"} Visa Information</h2>
      </div>
      <div className="p-0 space-y-10">
        {visaData.visaTypes.length > 1 && (
          <div className="mb-6">
            <label htmlFor="visa-category-select" className="mb-3 block text-gray-700 font-bold text-lg">
              Select Visa Category
            </label>
            <div className="relative">
              <select
                id="visa-category-select"
                onBlur={handleVisaTypeChange}
                onChange={handleVisaTypeChange}
                value={selectedVisaType.code}
                className="w-full p-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 bg-white text-gray-800 text-base transition-all duration-200"
              >
                <option value="">Select a visa category</option>
                {visaData.visaTypes.map((vt) => (
                  <option key={vt.code} value={vt.code}>
                    {vt.category} - {vt.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {visaDetailsCards.map((item, i) => (
            <div
              key={i}
              className="flex items-start space-x-4 bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 ease-in-out"
            >
              <span className="text-3xl mt-1 flex-shrink-0">{item.icon}</span>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">{item.label}</p>
                <p className="font-bold text-lg text-gray-800">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Processing Information</h3>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <p className="text-sm text-gray-600 mb-1">Processing Time</p>
              <p className="font-semibold text-gray-800 text-base">{selectedVisaType.processingTime || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Processing Method</p>
              <p className="font-semibold text-gray-800 text-base">{selectedVisaType.processingMethod || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Interview Required</p>
              <p className="font-semibold text-gray-800 text-base">
                {selectedVisaType.interviewRequired ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Biometric Required</p>
              <p className="font-semibold text-gray-800 text-base">
                {selectedVisaType.biometricRequired ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="w-3 h-3 rounded-full bg-blue-500 mr-3 flex-shrink-0"></span>
            Get a Guaranteed Visa on
          </h3>
          {guaranteeOptions.map((option, i) => (
            <div
              key={i}
              className={`border rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center transition-all duration-300 ease-in-out transform hover:-translate-y-1 ${
                selectedDate === option.date
                  ? "border-blue-600 bg-blue-50 shadow-lg"
                  : "border-gray-200 bg-white hover:bg-gray-50 hover:shadow-md"
              }`}
            >
              <div>
                <p className="text-lg font-bold text-gray-800 mt-2">{option.date}</p>
                <button
                  onClick={() => setShowCalendar(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center mt-2 font-medium"
                >
                  <span className="mr-2 text-base">👁</span> View Timeline
                </button>
              </div>
              <button
                onClick={() => setSelectedDate(option.date)}
                className={`px-6 py-3 rounded-lg text-base font-bold mt-4 sm:mt-0 transition-all duration-300 ease-in-out ${
                  selectedDate === option.date
                    ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {selectedDate === option.date ? "✓ Selected" : "Select"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VisaDetailsCard
