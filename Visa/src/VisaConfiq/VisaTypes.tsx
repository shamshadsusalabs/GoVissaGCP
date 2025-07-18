"use client"

import type React from "react"
import { useState } from "react"
import { FaPlus, FaTrash, FaArrowRight, FaArrowLeft, FaEdit, FaSave, FaTimes } from "react-icons/fa"

interface VisaType {
  id: string
  name: string
  code: string
  category: string
  processingTime: string
  processingMethod: string
  visaFee: number
  serviceFee: number
  currency: string
  validity: string
  entries: string
  stayDuration: string
  interviewRequired: boolean
  biometricRequired: boolean
  notes: string
}

interface VisaTypesProps {
  visaTypes: VisaType[]
  updateVisaTypes: (visaTypes: VisaType[]) => void
  nextStep: () => void
  prevStep: () => void
}

const VisaTypes: React.FC<VisaTypesProps> = ({ visaTypes, updateVisaTypes, nextStep, prevStep }) => {
  // State to hold the visa type currently being added or edited
  const [currentVisaType, setCurrentVisaType] = useState<VisaType | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    const checked = (e.target as HTMLInputElement).checked

    setCurrentVisaType((prev) => {
      if (!prev) return null // Should not happen if form is open
      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }
    })
  }

  // Helper function to format fee display
  const formatFee = (fee: number): string => {
    return fee.toFixed(2)
  }

  const handleAddOrUpdateVisaType = () => {
    if (!currentVisaType || !currentVisaType.name.trim()) {
      return // Prevent adding empty visa types
    }

    const visaFee =
      typeof currentVisaType.visaFee === "string"
        ? Number.parseFloat(currentVisaType.visaFee) || 0
        : currentVisaType.visaFee
    const serviceFee =
      typeof currentVisaType.serviceFee === "string"
        ? Number.parseFloat(currentVisaType.serviceFee) || 0
        : currentVisaType.serviceFee

    if (currentVisaType.id) {
      // Update existing visa type
      updateVisaTypes(
        visaTypes.map((vt) => (vt.id === currentVisaType.id ? { ...currentVisaType, visaFee, serviceFee } : vt)),
      )
    } else {
      // Add new visa type
      updateVisaTypes([
        ...visaTypes,
        {
          ...currentVisaType,
          id: Date.now().toString(), // Generate a unique ID for new visa types
          visaFee,
          serviceFee,
        },
      ])
    }
    // Reset form state
    setCurrentVisaType(null)
  }

  const handleEditVisaType = (id: string) => {
    const visaTypeToEdit = visaTypes.find((vt) => vt.id === id)
    if (visaTypeToEdit) {
      setCurrentVisaType(visaTypeToEdit)
    }
  }

  const handleCancelEdit = () => {
    setCurrentVisaType(null)
  }

  const handleRemoveVisaType = (id: string) => {
    updateVisaTypes(visaTypes.filter((vt) => vt.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    nextStep()
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Visa Types</h2>
      <form onSubmit={handleSubmit}>
        {visaTypes.length > 0 ? (
          <div className="mb-6 space-y-4">
            {visaTypes.map((visaType) => (
              <div key={visaType.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-lg">
                    {visaType.name}
                    {visaType.code && (
                      <span className="ml-2 text-sm bg-gray-200 px-2 py-1 rounded">{visaType.code}</span>
                    )}
                    {visaType.category && (
                      <span className="ml-2 text-sm bg-blue-100 px-2 py-1 rounded">{visaType.category}</span>
                    )}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => handleEditVisaType(visaType.id)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit visa type"
                    >
                      <FaEdit />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveVisaType(visaType.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove visa type"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Processing:</span> {visaType.processingTime || "N/A"}
                  </div>
                  <div>
                    <span className="text-gray-500">Fee:</span> {visaType.currency} {formatFee(visaType.visaFee)}
                  </div>
                  <div>
                    <span className="text-gray-500">Validity:</span> {visaType.validity || "N/A"}
                  </div>
                  <div>
                    <span className="text-gray-500">Entries:</span> {visaType.entries}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-6 text-gray-500 text-center py-4">No visa types added yet</div>
        )}

        {/* Form for adding/editing visa types */}
        {currentVisaType ? (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-4">{currentVisaType.id ? "Edit Visa Type" : "Add New Visa Type"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={currentVisaType.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                <input
                  type="text"
                  name="code"
                  value={currentVisaType.code}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={currentVisaType.category}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Processing Time</label>
                <input
                  type="text"
                  name="processingTime"
                  value={currentVisaType.processingTime}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Processing Method</label>
                <select
                  name="processingMethod"
                  value={currentVisaType.processingMethod}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Standard">Standard</option>
                  <option value="Express">Express</option>
                  <option value="Premium">Premium</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visa Fee</label>
                <div className="flex">
                  <select
                    name="currency"
                    value={currentVisaType.currency}
                    onChange={handleChange}
                    className="p-2 border border-gray-300 rounded-l-md border-r-0"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="AED">AED (د.إ)</option>
                  </select>
                  <input
                    type="number"
                    name="visaFee"
                    value={currentVisaType.visaFee}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="flex-1 p-2 border border-gray-300 rounded-r-md"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Fee</label>
                <input
                  type="number"
                  name="serviceFee"
                  value={currentVisaType.serviceFee}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Validity</label>
                <input
                  type="text"
                  name="validity"
                  value={currentVisaType.validity}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Entries</label>
                <select
                  name="entries"
                  value={currentVisaType.entries}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Single">Single</option>
                  <option value="Multiple">Multiple</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stay Duration</label>
                <input
                  type="text"
                  name="stayDuration"
                  value={currentVisaType.stayDuration}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="interviewRequired"
                    checked={currentVisaType.interviewRequired}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm">Interview Required</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="biometricRequired"
                    checked={currentVisaType.biometricRequired}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm">Biometrics Required</span>
                </label>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                name="notes"
                value={currentVisaType.notes}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
              >
                <FaTimes className="mr-2" /> Cancel
              </button>
              <button
                type="button"
                onClick={handleAddOrUpdateVisaType}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                {currentVisaType.id ? (
                  <>
                    <FaSave className="mr-2" /> Save Changes
                  </>
                ) : (
                  <>
                    <FaPlus className="mr-2" /> Add Visa Type
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() =>
              setCurrentVisaType({
                id: "", // Temporary ID for new item, will be replaced by Date.now().toString() on save
                name: "",
                code: "",
                category: "",
                processingTime: "",
                processingMethod: "Standard",
                visaFee: 0,
                serviceFee: 0,
                currency: "USD",
                validity: "",
                entries: "Single",
                stayDuration: "",
                interviewRequired: false,
                biometricRequired: false,
                notes: "",
              })
            }
            className="mb-6 flex items-center px-4 py-2 bg-green-600 text-white rounded-md"
          >
            <FaPlus className="mr-2" /> Add Visa Type
          </button>
        )}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <button type="submit" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md">
            Next <FaArrowRight className="ml-2" />
          </button>
        </div>
      </form>
    </div>
  )
}

export default VisaTypes
