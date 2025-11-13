"use client"

import type React from "react"
import { useState } from "react"
import { FaPlus, FaTrash, FaArrowRight, FaArrowLeft, FaEdit, FaSave, FaTimes, FaCopy } from "react-icons/fa"

interface RejectionReason {
  id: string
  reason: string
  description: string
  frequency: "Rare" | "Occasional" | "Common"
  configId?: string // Add optional configId for tracking source
}

interface RejectionReasonsProps {
  reasons: RejectionReason[]
  updateReasons: (reasons: RejectionReason[]) => void
  nextStep: () => void
  prevStep: () => void
}

const RejectionReasons: React.FC<RejectionReasonsProps> = ({ reasons, updateReasons, nextStep, prevStep }) => {
  // State to hold the reason currently being added or edited
  const [currentReason, setCurrentReason] = useState<RejectionReason | null>(null)
  
  // ✅ NEW: Template selection states
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [templates, setTemplates] = useState<RejectionReason[]>([])
  const [loadingTemplates, setLoadingTemplates] = useState(false)

  // ✅ NEW: Fetch available templates
  const fetchTemplates = async () => {
    setLoadingTemplates(true)
    try {
      const response = await fetch("https://govisaa-872569311567.asia-south2.run.app/api/configurations/first-five-rejections")
      if (!response.ok) {
        throw new Error("Failed to fetch templates")
      }
      const result = await response.json()
      
      if (result.success && result.data) {
        // ✅ NEW: Extract all unique rejection reasons from all templates
        const allReasons: RejectionReason[] = []
        const seenReasons = new Set<string>()
        
        Object.entries(result.data).forEach(([configId, rejectionReasons]) => {
          (rejectionReasons as RejectionReason[]).forEach(reason => {
            const normalizedReason = reason.reason.toLowerCase().trim()
            if (!seenReasons.has(normalizedReason)) {
              seenReasons.add(normalizedReason)
              allReasons.push({
                ...reason,
                configId // Track source for reference
              })
            }
          })
        })
        
        setTemplates(allReasons)
      }
    } catch (error) {
      console.error("Error fetching templates:", error)
    } finally {
      setLoadingTemplates(false)
    }
  }

  // ✅ NEW: Apply selected rejection reason
  const applyRejectionReason = (template: RejectionReason) => {
    // Check if reason already exists (case-insensitive)
    const normalizedTemplateReason = template.reason.toLowerCase().trim()
    const exists = reasons.some(reason => 
      reason.reason.toLowerCase().trim() === normalizedTemplateReason
    )
    
    if (exists) {
      alert(`Rejection reason "${template.reason}" already exists!`)
      return
    }
    
    // Add the rejection reason with a new ID
    const newReason: RejectionReason = {
      id: Date.now().toString(),
      reason: template.reason,
      description: template.description,
      frequency: template.frequency
    }
    
    updateReasons([...reasons, newReason])
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setCurrentReason((prev) => {
      if (!prev) return null // Should not happen if form is open
      return {
        ...prev,
        [name]: value,
      }
    })
  }

  const handleAddOrUpdateReason = () => {
    if (!currentReason || !currentReason.reason.trim()) {
      return // Prevent adding empty reasons
    }

    if (currentReason.id) {
      // Update existing reason
      updateReasons(reasons.map((r) => (r.id === currentReason.id ? { ...currentReason } : r)))
    } else {
      // Add new reason
      updateReasons([
        ...reasons,
        {
          ...currentReason,
          id: Date.now().toString(), // Generate a unique ID for new reasons
        },
      ])
    }
    // Reset form state
    setCurrentReason(null)
  }

  const handleEditReason = (id: string) => {
    const reasonToEdit = reasons.find((r) => r.id === id)
    if (reasonToEdit) {
      setCurrentReason(reasonToEdit)
    }
  }

  const handleCancelEdit = () => {
    setCurrentReason(null)
  }

  const handleRemoveReason = (id: string) => {
    updateReasons(reasons.filter((r) => r.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    nextStep()
  }

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case "Common":
        return "bg-red-100 text-red-800"
      case "Occasional":
        return "bg-yellow-100 text-yellow-800"
      case "Rare":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Common Rejection Reasons</h2>

      {/* ✅ NEW: Template Selector Section */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-blue-900 flex items-center">
            <FaCopy className="mr-2" />
            Use Existing Rejection Reasons
          </h3>
          <button
            type="button"
            onClick={() => {
              if (!showTemplateSelector) {
                fetchTemplates()
              }
              setShowTemplateSelector(!showTemplateSelector)
            }}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {showTemplateSelector ? "Hide Templates" : "Show Templates"}
          </button>
        </div>

        {showTemplateSelector && (
          <div className="space-y-4">
            {loadingTemplates ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Loading templates...</p>
              </div>
            ) : templates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((reason) => (
                  <div
                    key={reason.id}
                    className="p-4 border rounded-lg cursor-pointer transition-all duration-200 border-gray-200 hover:border-blue-300 hover:bg-blue-25"
                    onClick={() => applyRejectionReason(reason)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{reason.reason}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${getFrequencyColor(reason.frequency)}`}>
                        {reason.frequency}
                      </span>
                    </div>
                    {reason.description && (
                      <p className="text-sm text-gray-600 mb-2">{reason.description}</p>
                    )}
                    <div className="text-xs text-gray-500">
                      Click to add this rejection reason
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No rejection reason templates available
              </div>
            )}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {reasons.length > 0 ? (
          <div className="mb-6 space-y-4">
            {reasons.map((reason) => (
              <div key={reason.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{reason.reason}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded ${getFrequencyColor(reason.frequency)}`}>
                      {reason.frequency}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleEditReason(reason.id)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit reason"
                    >
                      <FaEdit />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveReason(reason.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove reason"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                {reason.description && <p className="text-sm text-gray-600">{reason.description}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-6 text-gray-500 text-center py-4">No rejection reasons added yet</div>
        )}

        {/* Form for adding/editing reasons */}
        {currentReason ? (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-4">
              {currentReason.id ? "Edit Rejection Reason" : "Add Rejection Reason"}
            </h3>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
                <input
                  type="text"
                  name="reason"
                  value={currentReason.reason}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g., Insufficient financial proof"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={currentReason.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Provide details about this rejection reason"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                <select
                  name="frequency"
                  value={currentReason.frequency}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Rare">Rare</option>
                  <option value="Occasional">Occasional</option>
                  <option value="Common">Common</option>
                </select>
              </div>
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
                onClick={handleAddOrUpdateReason}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                {currentReason.id ? (
                  <>
                    <FaSave className="mr-2" /> Save Changes
                  </>
                ) : (
                  <>
                    <FaPlus className="mr-2" /> Add Reason
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() =>
              setCurrentReason({
                id: "", // Temporary ID for new item
                reason: "",
                description: "",
                frequency: "Occasional",
              })
            }
            className="mb-6 flex items-center px-4 py-2 bg-green-600 text-white rounded-md"
          >
            <FaPlus className="mr-2" /> Add Rejection Reason
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

export default RejectionReasons
