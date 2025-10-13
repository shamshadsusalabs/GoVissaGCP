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
  // Adult pricing (12+ years)
  visaFee: number
  serviceFee: number
  // Children pricing (6-12 years)
  childVisaFee: number
  childServiceFee: number
  // Young children pricing (0-6 years)
  youngChildVisaFee: number
  youngChildServiceFee: number
  currency: "INR" | "USD"
  validity: string
  entries: string
  stayDuration: string
  expectedVisaDays?: number
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
  setShowCalendar,
}) => {
  const visaDetailsCards = [
    { label: "Visa Type", value: selectedVisaType.name || "N/A", icon: "📱" },
    { label: "Length of Stay", value: selectedVisaType.stayDuration || "N/A", icon: "📅" },
    { label: "Validity", value: selectedVisaType.validity || "N/A", icon: "⏱️" },
    { label: "Entry", value: selectedVisaType.entries || "N/A", icon: "🚪" },
  ]

  const handleVisaTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const visaCode = e.target.value
    const newSelectedVisaType = visaData.visaTypes.find((vt) => vt.code === visaCode)
    if (newSelectedVisaType) {
      setSelectedVisaType(newSelectedVisaType)
    }
  }

  return (
    <div className="w-full rounded-2xl border border-gray-200 p-4 sm:p-6 lg:p-8 shadow-xl bg-white">
      <div className="p-0 mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{visaData.country || "N/A"} Visa Information</h2>
      </div>

      <div className="p-0 space-y-8 sm:space-y-10">
        {visaData.visaTypes.length > 1 && (
          <div className="mb-6">
            <label htmlFor="visa-category-select" className="mb-3 block text-gray-700 font-bold text-base sm:text-lg">
              Select Visa Category
            </label>
            <div className="relative">
              <select
                id="visa-category-select"
                onBlur={handleVisaTypeChange}
                onChange={handleVisaTypeChange}
                value={selectedVisaType.code}
                className="w-full p-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 bg-white text-gray-800 text-sm sm:text-base transition-all duration-200"
              >
                <option value="">Select a visa category</option>
                {visaData.visaTypes.map((vt) => (
                  <option key={vt.code} value={vt.code}>
                    {vt.category} - {vt.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📅</span>
            <span className="font-semibold text-lg sm:text-xl text-gray-800">Travel Date</span>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                When do you plan to travel?
              </label>
              <button
                onClick={() => setShowCalendar(true)}
                className={`w-full p-3 border rounded-lg text-left transition-all duration-200 ease-in-out ${
                  selectedDate
                    ? "border-green-500 bg-green-50 text-green-800"
                    : "border-gray-300 bg-white text-gray-500 hover:border-blue-300"
                }`}
              >
                {selectedDate || "Select travel date"}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <h3 className="font-bold text-lg sm:text-xl text-gray-800">Visa Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {visaDetailsCards.map((card, index) => (
              <div key={index} className="bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-200">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-xl sm:text-2xl">{card.icon}</span>
                  <span className="font-semibold text-sm sm:text-base text-gray-700">{card.label}</span>
                </div>
                <p className="text-sm sm:text-base text-gray-900 font-medium">{card.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <h3 className="font-bold text-lg sm:text-xl text-gray-800">Processing Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-blue-50 p-4 sm:p-5 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-xl sm:text-2xl">⏱️</span>
                <span className="font-semibold text-sm sm:text-base text-blue-800">Processing Time</span>
              </div>
              <p className="text-sm sm:text-base text-blue-900 font-medium">{selectedVisaType.processingTime || "N/A"}</p>
            </div>
            <div className="bg-green-50 p-4 sm:p-5 rounded-xl border border-green-200">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-xl sm:text-2xl">🔄</span>
                <span className="font-semibold text-sm sm:text-base text-green-800">Processing Method</span>
              </div>
              <p className="text-sm sm:text-base text-green-900 font-medium">{selectedVisaType.processingMethod || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <h3 className="font-bold text-lg sm:text-xl text-gray-800">Requirements</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className={`p-4 sm:p-5 rounded-xl border ${
              selectedVisaType.biometricRequired
                ? "bg-orange-50 border-orange-200"
                : "bg-gray-50 border-gray-200"
            }`}>
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-xl sm:text-2xl">👆</span>
                <span className={`font-semibold text-sm sm:text-base ${
                  selectedVisaType.biometricRequired ? "text-orange-800" : "text-gray-700"
                }`}>Biometric Required</span>
              </div>
              <p className={`text-sm sm:text-base font-medium ${
                selectedVisaType.biometricRequired ? "text-orange-900" : "text-gray-900"
              }`}>
                {selectedVisaType.biometricRequired ? "Yes" : "No"}
              </p>
            </div>
            <div className={`p-4 sm:p-5 rounded-xl border ${
              selectedVisaType.interviewRequired
                ? "bg-red-50 border-red-200"
                : "bg-gray-50 border-gray-200"
            }`}>
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-xl sm:text-2xl">👥</span>
                <span className={`font-semibold text-sm sm:text-base ${
                  selectedVisaType.interviewRequired ? "text-red-800" : "text-gray-700"
                }`}>Interview Required</span>
              </div>
              <p className={`text-sm sm:text-base font-medium ${
                selectedVisaType.interviewRequired ? "text-red-900" : "text-gray-900"
              }`}>
                {selectedVisaType.interviewRequired ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <h3 className="font-bold text-lg sm:text-xl text-gray-800">Fees by Age Group</h3>
          
          {/* Adults (12+ years) */}
          <div className="space-y-3">
            <h4 className="font-semibold text-base text-gray-700">Adults (12+ years)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-yellow-50 p-4 sm:p-5 rounded-xl border border-yellow-200">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-xl sm:text-2xl">💰</span>
                  <span className="font-semibold text-sm sm:text-base text-yellow-800">Government Fee</span>
                </div>
                <p className="text-sm sm:text-base text-yellow-900 font-bold">₹ {selectedVisaType.visaFee?.toLocaleString() || "N/A"}</p>
              </div>
              <div className="bg-blue-50 p-4 sm:p-5 rounded-xl border border-blue-200">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-xl sm:text-2xl">💼</span>
                  <span className="font-semibold text-sm sm:text-base text-blue-800">Service Fee</span>
                </div>
                <p className="text-sm sm:text-base text-blue-900 font-bold">₹ {selectedVisaType.serviceFee?.toFixed(2) || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Children (6-12 years) */}
          <div className="space-y-3">
            <h4 className="font-semibold text-base text-gray-700">Children (6-12 years)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-green-50 p-4 sm:p-5 rounded-xl border border-green-200">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-xl sm:text-2xl">💰</span>
                  <span className="font-semibold text-sm sm:text-base text-green-800">Government Fee</span>
                </div>
                <p className="text-sm sm:text-base text-green-900 font-bold">₹ {selectedVisaType.childVisaFee?.toLocaleString() || "N/A"}</p>
              </div>
              <div className="bg-purple-50 p-4 sm:p-5 rounded-xl border border-purple-200">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-xl sm:text-2xl">💼</span>
                  <span className="font-semibold text-sm sm:text-base text-purple-800">Service Fee</span>
                </div>
                <p className="text-sm sm:text-base text-purple-900 font-bold">₹ {selectedVisaType.childServiceFee?.toFixed(2) || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Young Children (0-6 years) */}
          <div className="space-y-3">
            <h4 className="font-semibold text-base text-gray-700">Young Children (0-6 years)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-pink-50 p-4 sm:p-5 rounded-xl border border-pink-200">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-xl sm:text-2xl">💰</span>
                  <span className="font-semibold text-sm sm:text-base text-pink-800">Government Fee</span>
                </div>
                <p className="text-sm sm:text-base text-pink-900 font-bold">₹ {selectedVisaType.youngChildVisaFee?.toLocaleString() || "N/A"}</p>
              </div>
              <div className="bg-orange-50 p-4 sm:p-5 rounded-xl border border-orange-200">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-xl sm:text-2xl">💼</span>
                  <span className="font-semibold text-sm sm:text-base text-orange-800">Service Fee</span>
                </div>
                <p className="text-sm sm:text-base text-orange-900 font-bold">₹ {selectedVisaType.youngChildServiceFee?.toFixed(2) || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default VisaDetailsCard
