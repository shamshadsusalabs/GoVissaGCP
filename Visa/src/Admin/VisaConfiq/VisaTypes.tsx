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
  // Adult pricing (12+ years)
  visaFee: number
  serviceFee: number
  // Children pricing (6-12 years)
  childVisaFee: number
  childServiceFee: number
  // Young children pricing (0-6 years)
  youngChildVisaFee: number
  youngChildServiceFee: number
  currency: string
  validity: string
  entries: string
  stayDuration: string
  expectedVisaDays: number
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
  const formatFee = (fee: number | undefined): string => {
    return (fee || 0).toFixed(2)
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
    const childVisaFee =
      typeof currentVisaType.childVisaFee === "string"
        ? Number.parseFloat(currentVisaType.childVisaFee) || 0
        : currentVisaType.childVisaFee
    const childServiceFee =
      typeof currentVisaType.childServiceFee === "string"
        ? Number.parseFloat(currentVisaType.childServiceFee) || 0
        : currentVisaType.childServiceFee
    const youngChildVisaFee =
      typeof currentVisaType.youngChildVisaFee === "string"
        ? Number.parseFloat(currentVisaType.youngChildVisaFee) || 0
        : currentVisaType.youngChildVisaFee
    const youngChildServiceFee =
      typeof currentVisaType.youngChildServiceFee === "string"
        ? Number.parseFloat(currentVisaType.youngChildServiceFee) || 0
        : currentVisaType.youngChildServiceFee
    const expectedVisaDays =
      typeof currentVisaType.expectedVisaDays === "string"
        ? Number.parseInt(currentVisaType.expectedVisaDays) || 7
        : currentVisaType.expectedVisaDays

    if (currentVisaType.id) {
      // Update existing visa type
      updateVisaTypes(
        visaTypes.map((vt) => (vt.id === currentVisaType.id ? { 
          ...currentVisaType, 
          visaFee, 
          serviceFee, 
          childVisaFee,
          childServiceFee,
          youngChildVisaFee,
          youngChildServiceFee,
          expectedVisaDays 
        } : vt)),
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
          childVisaFee,
          childServiceFee,
          youngChildVisaFee,
          youngChildServiceFee,
          expectedVisaDays,
        },
      ])
    }
    // Reset form state
    setCurrentVisaType(null)
  }

  const handleEditVisaType = (id: string) => {
    const visaTypeToEdit = visaTypes.find((vt) => vt.id === id)
    if (visaTypeToEdit) {
      setCurrentVisaType({
        ...visaTypeToEdit,
        // Ensure new fields have default values for existing visa types
        childVisaFee: visaTypeToEdit.childVisaFee || 0,
        childServiceFee: visaTypeToEdit.childServiceFee || 0,
        youngChildVisaFee: visaTypeToEdit.youngChildVisaFee || 0,
        youngChildServiceFee: visaTypeToEdit.youngChildServiceFee || 0,
      })
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-500">Processing:</span> {visaType.processingTime || "N/A"}
                    </div>
                    <div>
                      <span className="text-gray-500">Validity:</span> {visaType.validity || "N/A"}
                    </div>
                    <div>
                      <span className="text-gray-500">Entries:</span> {visaType.entries}
                    </div>
                    <div>
                      <span className="text-gray-500">Expected Days:</span> {visaType.expectedVisaDays} days
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium text-gray-700">Age-based Pricing:</div>
                    <div>
                      <span className="text-blue-600 font-medium">Adult (12+ years):</span> {visaType.currency} {formatFee(visaType.visaFee)} + {formatFee(visaType.serviceFee)} service
                    </div>
                    <div>
                      <span className="text-green-600 font-medium">Child (6-12 years):</span> {visaType.currency} {formatFee(visaType.childVisaFee || 0)} + {formatFee(visaType.childServiceFee || 0)} service
                    </div>
                    <div>
                      <span className="text-orange-600 font-medium">Young Child (0-6 years):</span> {visaType.currency} {formatFee(visaType.youngChildVisaFee || 0)} + {formatFee(visaType.youngChildServiceFee || 0)} service
                    </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select
                  name="currency"
                  value={currentVisaType.currency}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="AED">AED (د.إ)</option>
                </select>
              </div>
            </div>
            
            {/* Age-based Pricing Section */}
            <div className="mb-4">
              <h4 className="text-lg font-medium text-gray-800 mb-4 border-b pb-2">Age-based Pricing</h4>
              
              {/* Adult Pricing (12+ years) */}
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h5 className="font-medium text-blue-800 mb-3">Adult Pricing (12+ years)</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adult Visa Fee</label>
                    <input
                      type="number"
                      name="visaFee"
                      value={currentVisaType.visaFee}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="e.g., 100.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adult Service Fee</label>
                    <input
                      type="number"
                      name="serviceFee"
                      value={currentVisaType.serviceFee}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="e.g., 25.00"
                    />
                  </div>
                </div>
              </div>

              {/* Child Pricing (6-12 years) */}
              <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <h5 className="font-medium text-green-800 mb-3">Child Pricing (6-12 years)</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Child Visa Fee</label>
                    <input
                      type="number"
                      name="childVisaFee"
                      value={currentVisaType.childVisaFee}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="e.g., 75.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Child Service Fee</label>
                    <input
                      type="number"
                      name="childServiceFee"
                      value={currentVisaType.childServiceFee}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="e.g., 20.00"
                    />
                  </div>
                </div>
              </div>

              {/* Young Child Pricing (0-6 years) */}
              <div className="mb-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h5 className="font-medium text-orange-800 mb-3">Young Child Pricing (0-6 years)</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Young Child Visa Fee</label>
                    <input
                      type="number"
                      name="youngChildVisaFee"
                      value={currentVisaType.youngChildVisaFee}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="e.g., 50.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Young Child Service Fee</label>
                    <input
                      type="number"
                      name="youngChildServiceFee"
                      value={currentVisaType.youngChildServiceFee}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="e.g., 15.00"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Visa Days</label>
                <input
                  type="number"
                  name="expectedVisaDays"
                  value={currentVisaType.expectedVisaDays}
                  onChange={handleChange}
                  min="1"
                  max="365"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g., 7, 15, 30"
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
                childVisaFee: 0,
                childServiceFee: 0,
                youngChildVisaFee: 0,
                youngChildServiceFee: 0,
                currency: "USD",
                validity: "",
                entries: "Single",
                stayDuration: "",
                expectedVisaDays: 7,
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
