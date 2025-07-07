"use client"

import type React from "react"
import { useState } from "react"
import { Edit3, Save, X, User, Hash, Users, AlertCircle } from "lucide-react"
import type { PassportData } from "./document-types"

interface PassportDataFormProps {
  initialData: PassportData
  onDataChange: (data: PassportData) => void
  passportDataSaved?: boolean // ✅ Add prop to track saved status
}

export default function PassportDataForm({
  initialData,
  onDataChange,
  passportDataSaved = false,
}: PassportDataFormProps) {
  const [formData, setFormData] = useState<PassportData>(initialData)
  const [isEditing, setIsEditing] = useState(false)

  // Check if form has any data (to determine if OCR worked)
  const hasOcrData = Object.values(initialData).some((value) => value && value.trim() !== "")

  // ✅ Validation function for required fields (family fields are NOT required)
  const validateRequiredFields = (): boolean => {
    const requiredFields = ["passport_number", "surname", "given_names", "date_of_birth", "nationality", "sex"]

    return requiredFields.every((field) => {
      const value = formData[field as keyof PassportData]
      return value && value.trim() !== ""
    })
  }

  const isFormValid = validateRequiredFields()

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

    if (!isFormValid) {
      alert("Please fill in all required fields (marked with *)")
      return
    }

    console.log("✅ Passport Form Submitted:", formData)
    onDataChange(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData(initialData)
    setIsEditing(false)
  }

  // ✅ Show form in editing mode if no OCR data OR if not saved yet
  const shouldShowEditForm = isEditing || !hasOcrData || !passportDataSaved

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
            {/* ✅ Show save status */}
            {hasOcrData && (
              <p className="text-blue-100 text-sm mt-1">
                {passportDataSaved ? "✅ Data saved successfully" : "⚠️ Please save the data to continue"}
              </p>
            )}
          </div>
          {!isEditing && hasOcrData && passportDataSaved && (
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
        {/* ✅ Show validation warning if form is not saved */}
        {hasOcrData && !passportDataSaved && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-amber-800 mb-1">Action Required</h3>
                <p className="text-sm text-amber-700">
                  Please review and save the passport details before proceeding to the next step.
                </p>
              </div>
            </div>
          </div>
        )}

        {shouldShowEditForm ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center">
                  <User className="w-4 h-4 mr-2 text-blue-600" />
                  Personal Details
                </h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Surname <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="surname"
                    value={formData.surname || ""}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter surname"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Given Names <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="given_names"
                    value={formData.given_names || ""}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter given names"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sex <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="sex"
                    value={formData.sex || ""}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="date_of_birth"
                    value={formData.date_of_birth || ""}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="DD/MM/YYYY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Place of Birth</label>
                  <input
                    type="text"
                    name="place_of_birth"
                    value={formData.place_of_birth || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter place of birth"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nationality <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality || ""}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter nationality"
                  />
                </div>
              </div>

              {/* Passport & Family Information */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center">
                  <Hash className="w-4 h-4 mr-2 text-blue-600" />
                  Passport Details
                </h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passport Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="passport_number"
                    value={formData.passport_number || ""}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter passport number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Issue</label>
                  <input
                    type="text"
                    name="date_of_issue"
                    value={formData.date_of_issue || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="DD/MM/YYYY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Expiry</label>
                  <input
                    type="text"
                    name="date_of_expiry"
                    value={formData.date_of_expiry || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="DD/MM/YYYY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Place of Issue</label>
                  <input
                    type="text"
                    name="place_of_issue"
                    value={formData.place_of_issue || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter place of issue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">File Number</label>
                  <input
                    type="text"
                    name="file_number"
                    value={formData.file_number || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter file number"
                  />
                </div>
              </div>
            </div>

            {/* ✅ Family Information Section - NOT MANDATORY */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center mb-4">
                <Users className="w-4 h-4 mr-2 text-blue-600" />
                Family Information <span className="text-xs text-gray-500 ml-2">(Optional)</span>
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Father's Name</label>
                  <input
                    type="text"
                    name="father_name"
                    value={formData.father_name || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter father's name (optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mother's Name</label>
                  <input
                    type="text"
                    name="mother_name"
                    value={formData.mother_name || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter mother's name (optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Spouse Name</label>
                  <input
                    type="text"
                    name="spouse_name"
                    value={formData.spouse_name || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter spouse name (optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter address (optional)"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              {hasOcrData && passportDataSaved && (
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
                disabled={!isFormValid}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 mr-2" />
                {hasOcrData && passportDataSaved ? "Save Changes" : "Save Details"}
              </button>
            </div>

            {/* ✅ Show validation message */}
            {!isFormValid && (
              <div className="text-sm text-red-600 text-center">Please fill in all required fields marked with *</div>
            )}
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Given Names</p>
                    <p className="font-semibold text-gray-900">{formData.given_names || "-"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Sex</p>
                    <p className="font-semibold text-gray-900">{formData.sex || "-"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Date of Birth</p>
                    <p className="font-semibold text-gray-900">{formData.date_of_birth || "-"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Place of Birth</p>
                    <p className="font-semibold text-gray-900">{formData.place_of_birth || "-"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Nationality</p>
                    <p className="font-semibold text-gray-900">{formData.nationality || "-"}</p>
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
                    <p className="font-semibold text-gray-900">{formData.passport_number || "-"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Date of Issue</p>
                    <p className="font-semibold text-gray-900">{formData.date_of_issue || "-"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Date of Expiry</p>
                    <p className="font-semibold text-gray-900">{formData.date_of_expiry || "-"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Place of Issue</p>
                    <p className="font-semibold text-gray-900">{formData.place_of_issue || "-"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">File Number</p>
                    <p className="font-semibold text-gray-900">{formData.file_number || "-"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Family Information Display */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center mb-4">
                <Users className="w-4 h-4 mr-2 text-blue-600" />
                Family Information
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Father's Name</p>
                  <p className="font-semibold text-gray-900">{formData.father_name || "-"}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Mother's Name</p>
                  <p className="font-semibold text-gray-900">{formData.mother_name || "-"}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Spouse Name</p>
                  <p className="font-semibold text-gray-900">{formData.spouse_name || "-"}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Address</p>
                  <p className="font-semibold text-gray-900">{formData.address || "-"}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
