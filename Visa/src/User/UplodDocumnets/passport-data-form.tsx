"use client"

import type React from "react"
import { useState } from "react"
import { Edit3, Save, X, User, Hash } from "lucide-react"
import type { PassportData } from "./document-types"

interface PassportDataFormProps {
  initialData: PassportData
  onDataChange: (data: PassportData) => void
}

export default function PassportDataForm({ initialData, onDataChange }: PassportDataFormProps) {
  const [formData, setFormData] = useState<PassportData>(initialData)
  const [isEditing, setIsEditing] = useState(false)

  // Check if form has any data (to determine if OCR worked)
  const hasOcrData = Object.values(initialData).some((value) => value.trim() !== "")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const updatedData = {
      ...formData,
      [name]: value,
    }
    setFormData(updatedData)
    console.log("📝 Form Field Updated:", { field: name, value, fullData: updatedData })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("✅ Passport Form Submitted:", formData)
    onDataChange(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData(initialData)
    setIsEditing(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center">
              <User className="w-5 h-5 mr-2" />
              Passport Information
            </h3>
            {!hasOcrData && (
              <p className="text-blue-100 text-sm mt-1">
                Please fill in the details manually by referring to the passport image
              </p>
            )}
          </div>
          {!isEditing && hasOcrData && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-white hover:text-blue-200 p-2 hover:bg-white/10 rounded-lg transition-all duration-200 flex items-center"
            >
              <Edit3 className="w-4 h-4 mr-1" />
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Always show form in editing mode if no OCR data, otherwise show view/edit toggle */}
        {isEditing || !hasOcrData ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center">
                  <User className="w-4 h-4 mr-2 text-blue-600" />
                  Personal Details
                </h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Surname</label>
                  <input
                    type="text"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter surname"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Given Name</label>
                  <input
                    type="text"
                    name="givenName"
                    value={formData.givenName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter given name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sex</label>
                  <select
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Place of Birth</label>
                  <input
                    type="text"
                    name="placeOfBirth"
                    value={formData.placeOfBirth}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter place of birth"
                  />
                </div>
              </div>

              {/* Passport Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center">
                  <Hash className="w-4 h-4 mr-2 text-blue-600" />
                  Passport Details
                </h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Passport Number</label>
                  <input
                    type="text"
                    name="passportNumber"
                    value={formData.passportNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter passport number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter nationality"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Issue</label>
                  <input
                    type="date"
                    name="dateOfIssue"
                    value={formData.dateOfIssue}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Expiry</label>
                  <input
                    type="date"
                    name="dateOfExpiry"
                    value={formData.dateOfExpiry}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Place of Issue</label>
                  <input
                    type="text"
                    name="placeOfIssue"
                    value={formData.placeOfIssue}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter place of issue"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              {hasOcrData && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 flex items-center"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {hasOcrData ? "Save Changes" : "Save Details"}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information Display */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center">
                  <User className="w-4 h-4 mr-2 text-blue-600" />
                  Personal Details
                </h4>

                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Surname</p>
                    <p className="font-semibold text-gray-900">{formData.surname || "-"}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Given Name</p>
                    <p className="font-semibold text-gray-900">{formData.givenName || "-"}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Sex</p>
                    <p className="font-semibold text-gray-900">{formData.sex || "-"}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Date of Birth</p>
                    <p className="font-semibold text-gray-900">{formData.dob || "-"}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Place of Birth</p>
                    <p className="font-semibold text-gray-900">{formData.placeOfBirth || "-"}</p>
                  </div>
                </div>
              </div>

              {/* Passport Information Display */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center">
                  <Hash className="w-4 h-4 mr-2 text-blue-600" />
                  Passport Details
                </h4>

                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Passport Number</p>
                    <p className="font-semibold text-gray-900">{formData.passportNumber || "-"}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Nationality</p>
                    <p className="font-semibold text-gray-900">{formData.nationality || "-"}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Date of Issue</p>
                    <p className="font-semibold text-gray-900">{formData.dateOfIssue || "-"}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Date of Expiry</p>
                    <p className="font-semibold text-gray-900">{formData.dateOfExpiry || "-"}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Place of Issue</p>
                    <p className="font-semibold text-gray-900">{formData.placeOfIssue || "-"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
