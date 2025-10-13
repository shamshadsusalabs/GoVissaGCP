"use client"

import { useState } from "react"
import { Globe, UserCheck, Building } from "lucide-react"

interface ProcessingModeModalProps {
  isOpen: boolean
  onClose: (mode: "online" | "offline", employeeId?: string) => void
}

export default function ProcessingModeModal({ isOpen, onClose }: ProcessingModeModalProps) {
  const [selectedMode, setSelectedMode] = useState<"online" | "offline" | null>(null)
  const [employeeId, setEmployeeId] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = () => {
    if (!selectedMode) {
      setError("Please select a processing mode")
      return
    }

    if (selectedMode === "offline" && !employeeId.trim()) {
      setError("Please enter Employee ID for offline processing")
      return
    }

    onClose(selectedMode, selectedMode === "offline" ? employeeId.trim() : undefined)
  }

  const handleModeSelect = (mode: "online" | "offline") => {
    setSelectedMode(mode)
    setError("")
    if (mode === "online") {
      setEmployeeId("")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Building className="w-6 h-6 mr-2" />
              Processing Mode
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-6 text-center">Choose how you would like to process your visa application</p>

          {/* Processing Mode Options */}
          <div className="space-y-4 mb-6">
            {/* Online Option */}
            <div
              onClick={() => handleModeSelect("online")}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selectedMode === "online"
                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                  : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                    selectedMode === "online" ? "bg-blue-500" : "bg-gray-100"
                  }`}
                >
                  <Globe className={`w-6 h-6 ${selectedMode === "online" ? "text-white" : "text-gray-500"}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Online Processing</h3>
                  <p className="text-sm text-gray-600">Process your application through our online system</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedMode === "online" ? "border-blue-500 bg-blue-500" : "border-gray-300"
                  }`}
                >
                  {selectedMode === "online" && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
              </div>
            </div>

            {/* Offline Option */}
            <div
              onClick={() => handleModeSelect("offline")}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selectedMode === "offline"
                  ? "border-green-500 bg-green-50 ring-2 ring-green-100"
                  : "border-gray-200 hover:border-green-300 hover:bg-green-50"
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                    selectedMode === "offline" ? "bg-green-500" : "bg-gray-100"
                  }`}
                >
                  <UserCheck className={`w-6 h-6 ${selectedMode === "offline" ? "text-white" : "text-gray-500"}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Offline Processing</h3>
                  <p className="text-sm text-gray-600">Process through our office with employee assistance</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedMode === "offline" ? "border-green-500 bg-green-500" : "border-gray-300"
                  }`}
                >
                  {selectedMode === "offline" && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
              </div>
            </div>
          </div>

          {/* Employee ID Input - Show only when offline is selected */}
          {selectedMode === "offline" && (
            <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={employeeId}
                onChange={(e) => {
                  setEmployeeId(e.target.value)
                  setError("")
                }}
                placeholder="Enter Employee ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
              <p className="text-xs text-gray-500 mt-2">
                Please enter the Employee ID who will assist with your application
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={!selectedMode}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
