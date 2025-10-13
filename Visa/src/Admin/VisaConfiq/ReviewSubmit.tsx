"use client"

import type React from "react"
import {
  FaArrowLeft,
  FaCheck,
  FaGlobe,
  FaFileAlt,
  FaImages,
  FaTimesCircle,
  FaSpinner,
  FaEdit,
  FaSave,
} from "react-icons/fa"

interface ImageData {
  preview: string
  file: File
}

interface ReviewSubmitProps {
  config: {
    continent: string
    countryDetails: {
      name: string
      code: string
      embassyLocation: string
     applicationTips: string
    }
    visaTypes: unknown[]
    documents: unknown[]
    eligibility: string
    rejectionReasons: unknown[]
    images: ImageData[]
  }
  prevStep: () => void
  onSubmit: () => void
  onCancel: () => void
  isSubmitting?: boolean
  isUpdateMode?: boolean
}

const ReviewSubmit: React.FC<ReviewSubmitProps> = ({
  config,
  prevStep,
  onSubmit,
  onCancel,
  isSubmitting = false,
  isUpdateMode = false,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault()
    onCancel()
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        {isUpdateMode ? "Review Changes & Update" : "Review & Submit"}
      </h2>
      {isUpdateMode && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <FaEdit className="text-blue-600 mr-2" />
            <p className="text-blue-800 font-medium">
              You are updating an existing visa configuration. Review your changes below.
            </p>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center mb-4">
          <FaGlobe className="text-blue-500 mr-2" />
          <h3 className="text-xl font-medium">Country Details</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Country</p>
            <p className="font-medium">{config.countryDetails.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Country Code</p>
            <p className="font-medium">{config.countryDetails.code || "Not specified"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Embassy Location</p>
            <p className="font-medium">{config.countryDetails.embassyLocation || "Not specified"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Continent</p>
            <p className="font-medium">{config.continent}</p>
          </div>
        </div>
        {config.countryDetails.applicationTips && (
          <div className="mb-4">
            <p className="text-sm text-gray-500">Application Tips</p>
            <p className="whitespace-pre-line">{config.countryDetails.applicationTips}</p>
          </div>
        )}
      </div>

      <div className="mb-8">
        <div className="flex items-center mb-4">
          <FaFileAlt className="text-blue-500 mr-2" />
          <h3 className="text-xl font-medium">Visa Configuration</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Visa Types</p>
            <p className="text-2xl font-bold">{config.visaTypes.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Documents</p>
            <p className="text-2xl font-bold">{config.documents.length}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Rejection Reasons</p>
            <p className="text-2xl font-bold">{config.rejectionReasons.length}</p>
          </div>
        </div>
        {config.eligibility && (
          <div className="mb-4">
            <p className="text-sm text-gray-500">Eligibility Criteria</p>
            <p className="whitespace-pre-line">{config.eligibility}</p>
          </div>
        )}
      </div>

      {config.images.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <FaImages className="text-blue-500 mr-2" />
            <h3 className="text-xl font-medium">Uploaded Images ({config.images.length})</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {config.images.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img.preview || "/placeholder.svg"}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
                <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {(img.file.size / (1024 * 1024)).toFixed(1)}MB
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          disabled={isSubmitting}
          className="flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <div className="space-x-4">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="flex items-center px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FaTimesCircle className="mr-2" /> Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`flex items-center px-6 py-3 rounded-lg text-white transition-colors disabled:cursor-not-allowed ${
              isUpdateMode
                ? "bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400"
                : "bg-green-600 hover:bg-green-700 disabled:bg-green-400"
            }`}
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="mr-2 animate-spin" />
                {isUpdateMode ? "Updating..." : "Submitting..."}
              </>
            ) : (
              <>
                {isUpdateMode ? <FaSave className="mr-2" /> : <FaCheck className="mr-2" />}
                {isUpdateMode ? "Update Configuration" : "Submit Configuration"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReviewSubmit
