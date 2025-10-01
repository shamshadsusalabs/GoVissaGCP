"use client"

import type React from "react"
import { CheckCircle, AlertTriangle, Users, FileText, Send, ArrowLeft, X } from "lucide-react"
import type { PassportData, TravellerData, Document } from "./document-types"
import PassportDataForm from "./passport-data-form"

interface DocumentReviewProps {
  documents: Document[]
  travellersData: TravellerData[]
  handleRemoveFile: (travellerIndex: number, docId: string, side: "front" | "back") => void
  handlePassportDataChange: (travellerIndex: number, data: PassportData) => void
  handleSubmitApplication: () => void
  isSubmitting: boolean
  submitError: string | null
  setShowReview: (show: boolean) => void
  travellersCount: number
}

export default function DocumentReview({
  documents,
  travellersData,
  handleRemoveFile,
  handlePassportDataChange,
  handleSubmitApplication,
  isSubmitting,
  submitError,
  setShowReview,
  travellersCount,
}: DocumentReviewProps) {
  const getDocumentIcon = (docName: string) => {
    const icons: Record<string, string> = {
      photo: "📷",
      passport: "🛂",
      "bank statement": "🏦",
      "aadhar card": "🆔",
      "pan card": "💳",
      "driver license": "🚗",
      "voter id": "🗳️",
      visa: "✈️",
      ticket: "🎫",
      "hotel booking": "🏨",
      "invitation letter": "✉️",
      "employment letter": "💼",
      "salary slip": "💰",
      "tax return": "🧾",
      insurance: "🛡️",
      "cover letter": "✉️",
    }
    return icons[docName.toLowerCase()] || "📄"
  }

  interface DocumentPreviewProps {
    side: string
    preview?: string
    file?: File
    onRemove: () => void
    fullWidth?: boolean
  }

  const DocumentPreview: React.FC<DocumentPreviewProps> = ({ side, preview, file, onRemove, fullWidth }) => {
    return (
      <div
        className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${fullWidth ? "md:col-span-2" : ""}`}
      >
        <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center">
            <FileText className="w-4 h-4 mr-2 text-blue-600" />
            {side}
          </h3>
          {file && (
            <button
              onClick={onRemove}
              className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {preview ? (
          <div className="p-4">
            <img
              src={preview || "/placeholder.svg"}
              alt={side}
              className="w-full h-auto object-contain rounded-lg max-h-80"
            />
          </div>
        ) : (
          <div className="flex justify-center items-center h-48 bg-gray-50">
            <div className="text-center">
              <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <span className="text-gray-500 text-sm">No {side} Uploaded</span>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Calculate completion stats
  const totalDocuments = documents.length * travellersCount
  const completedDocuments = travellersData.reduce((total, traveller) => {
    return total + Object.keys(traveller.uploadedFiles).length
  }, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <CheckCircle className="w-8 h-8 mr-3 text-green-600" />
                Review & Submit
              </h1>
              <p className="text-gray-600 mt-2">
                Review documents for all {travellersCount} traveller{travellersCount > 1 ? "s" : ""} before final
                submission
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                <Users className="w-4 h-4" />
                <span>
                  {travellersCount} Traveller{travellersCount > 1 ? "s" : ""}
                </span>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {completedDocuments} of {totalDocuments} documents uploaded
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Submit Error Display */}
        {submitError && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Submission Error</h3>
                <p className="text-red-700">{submitError}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            <div className="space-y-12">
              {travellersData.map((travellerData, travellerIndex) => (
                <div key={travellerIndex} className="border-b border-gray-200 pb-12 last:border-b-0 last:pb-0">
                  {/* Traveller Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg mr-4">
                        {travellerIndex + 1}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Traveller {travellerIndex + 1}</h2>
                        <p className="text-gray-600">Document Review</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Documents Uploaded</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {Object.keys(travellerData.uploadedFiles).length} of {documents.length}
                      </div>
                    </div>
                  </div>

                  {/* Documents Grid */}
                  <div className="space-y-8">
                    {documents.map((doc) => (
                      <div key={doc.id} className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                        <div className="flex items-center mb-6">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center text-xl mr-4">
                            {getDocumentIcon(doc.name)}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{doc.name}</h3>
                            {doc.description && <p className="text-gray-600 mt-1">{doc.description}</p>}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {doc.requiresBothSides ? (
                            <>
                              <DocumentPreview
                                side="Front Side"
                                preview={travellerData.uploadedFiles[doc.id]?.frontPreview}
                                file={travellerData.uploadedFiles[doc.id]?.front}
                                onRemove={() => handleRemoveFile(travellerIndex, doc.id, "front")}
                              />
                              <DocumentPreview
                                side="Back Side"
                                preview={travellerData.uploadedFiles[doc.id]?.backPreview}
                                file={travellerData.uploadedFiles[doc.id]?.back}
                                onRemove={() => handleRemoveFile(travellerIndex, doc.id, "back")}
                              />
                            </>
                          ) : (
                            <DocumentPreview
                              side="Document"
                              preview={travellerData.uploadedFiles[doc.id]?.frontPreview}
                              file={travellerData.uploadedFiles[doc.id]?.front}
                              onRemove={() => handleRemoveFile(travellerIndex, doc.id, "front")}
                              fullWidth
                            />
                          )}
                        </div>

                        {/* Show passport data form only for passport in review mode */}
                        {doc.name.toLowerCase() === "passport" && travellerData.ocrData && (
                          <div className="mt-8">
                            <PassportDataForm
                              initialData={travellerData.ocrData.data}
                              onDataChange={(data) => handlePassportDataChange(travellerIndex, data)}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <button
                  onClick={() => setShowReview(false)}
                  disabled={isSubmitting}
                  className="px-8 py-4 border border-gray-300 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Upload
                </button>
                <button
                  onClick={handleSubmitApplication}
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg flex items-center justify-center min-w-[200px]"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Submit Application for {travellersCount} Traveller{travellersCount > 1 ? "s" : ""}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
