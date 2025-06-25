"use client"

import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { Users, FileText, CheckCircle, Clock, ArrowRight } from "lucide-react"
import DocumentUploader from "./document-uploader"
import DocumentReview from "./document-review"
import type { Document, PassportData, TravellerData } from "./document-types"

export default function UploadDocuments() {
  const params = useParams()
  const visaId = params?.visaId as string
  const travellersCount = Number.parseInt(params?.travellers as string) || 1
  const paymentId = params?.paymentId as string
   const country = params?.country  as string
  const [documents, setDocuments] = useState<Document[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [currentTraveller, setCurrentTraveller] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Store data for all travellers
  const [travellersData, setTravellersData] = useState<TravellerData[]>(
    Array.from({ length: travellersCount }, (_, index) => ({
      travellerIndex: index,
      uploadedFiles: {},
      ocrData: null,
      ocrError: null,
    })),
  )

  const [showReview, setShowReview] = useState(false)
  const [currentSide, setCurrentSide] = useState<"front" | "back">("front")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Get current traveller's data
  const currentTravellerData = travellersData[currentTraveller]

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(`https://govissa-872569311567.asia-south2.run.app/api/configurations/documents/${visaId}/documents-only`)
        const data = await response.json()
        if (data.success) {
          const docsWithSides = data.documents.map((doc: Document) => ({
            ...doc,
            requiresBothSides: ["passport", "aadhar card", "pan card", "driver license", "voter id"].includes(
              doc.name.toLowerCase(),
            ),
          }))
          setDocuments(docsWithSides)
        }
      } catch (error) {
        console.error("Error fetching documents:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (visaId) {
      fetchDocuments()
    }
  }, [visaId])

  const updateCurrentTravellerData = (updates: Partial<TravellerData>) => {
    setTravellersData((prev) =>
      prev.map((traveller, index) => (index === currentTraveller ? { ...traveller, ...updates } : traveller)),
    )
  }

  const handleFileChange = async (file: File | null) => {
    if (!file) return

    const currentDoc = documents[currentStep]
    const preview = URL.createObjectURL(file)

    const updatedFiles = {
      ...currentTravellerData.uploadedFiles,
      [currentDoc.id]: {
        ...currentTravellerData.uploadedFiles[currentDoc.id],
        [currentSide]: file,
        [`${currentSide}Preview`]: preview,
      },
    }

    updateCurrentTravellerData({ uploadedFiles: updatedFiles })

    // Check if this is passport front side
    if (currentDoc.name.toLowerCase() === "passport" && currentSide === "front") {
      try {
        setIsLoading(true)
        const formData = new FormData()
        formData.append("files", file)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000)

        const response = await fetch("https://govissagcp-872569311567.asia-south2.run.app/upload", {
          method: "POST",
          body: formData,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`OCR service responded with status: ${response.status}`)
        }

        const data = await response.json()
        console.log("🤖 OCR Data Received:", data)
        updateCurrentTravellerData({ ocrData: data, ocrError: null })
      } catch (error) {
        console.error("Error processing OCR:", error)

        let errorMessage = "An unexpected error occurred during OCR processing."
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            errorMessage = "OCR processing timed out. Please try again."
          } else if (error.message.includes("Failed to fetch")) {
            errorMessage = "Unable to connect to OCR service. Please check if the service is running and try again."
          } else {
            errorMessage = `OCR processing failed: ${error.message}`
          }
        }

        const emptyData = {
          extracted_text: "",
          passport_data: {
            dateOfExpiry: "",
            dateOfIssue: "",
            dob: "",
            fileNumber: "",
            givenName: "",
            nationality: "",
            passportNumber: "",
            placeOfBirth: "",
            placeOfIssue: "",
            sex: "",
            surname: "",
          },
        }

        updateCurrentTravellerData({
          ocrData: emptyData,
          ocrError: errorMessage,
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handlePassportDataChange = (data: PassportData) => {
    console.log("🔄 Passport Data Changed:", data)
    updateCurrentTravellerData({
      ocrData: currentTravellerData.ocrData
        ? {
            ...currentTravellerData.ocrData,
            passport_data: data,
          }
        : null,
    })
  }

  const handleNext = () => {
    const currentDoc = documents[currentStep]

    if (currentDoc.requiresBothSides && currentSide === "front") {
      setCurrentSide("back")
      return
    }

    if (currentStep < documents.length - 1) {
      setCurrentStep(currentStep + 1)
      setCurrentSide("front")
    } else {
      // Completed current traveller's documents
      if (currentTraveller < travellersCount - 1) {
        // Move to next traveller
        setCurrentTraveller(currentTraveller + 1)
        setCurrentStep(0)
        setCurrentSide("front")
      } else {
        // All travellers completed, show review
        setShowReview(true)
      }
    }
  }

  const handlePrevious = () => {
    const currentDoc = documents[currentStep]

    if (currentDoc.requiresBothSides && currentSide === "back") {
      setCurrentSide("front")
      return
    }

    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setCurrentSide(documents[currentStep - 1].requiresBothSides ? "back" : "front")
    } else if (currentTraveller > 0) {
      // Go back to previous traveller's last document
      setCurrentTraveller(currentTraveller - 1)
      setCurrentStep(documents.length - 1)
      setCurrentSide(documents[documents.length - 1].requiresBothSides ? "back" : "front")
    }
  }

  const handleRemoveFile = (docId: string, side: "front" | "back") => {
    const updatedFiles = { ...currentTravellerData.uploadedFiles }
    if (updatedFiles[docId]) {
      URL.revokeObjectURL(updatedFiles[docId][`${side}Preview`] || "")
      delete updatedFiles[docId][side]
      delete updatedFiles[docId][`${side}Preview`]
      if (Object.keys(updatedFiles[docId]).length === 0) {
        delete updatedFiles[docId]
      }
    }

    updateCurrentTravellerData({ uploadedFiles: updatedFiles })

    // Clear OCR data if removing passport front side
    if (documents[currentStep].name.toLowerCase() === "passport" && side === "front") {
      updateCurrentTravellerData({ ocrData: null, ocrError: null })
    }
  }

  const handleSubmitApplication = async () => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const formData = new FormData()

      // Get user data from localStorage
      const userString = localStorage.getItem("user")
      let userEmail = "abc@gmail.com" // default fallback
      let userPhone = "7070357583" // default fallback

      if (userString) {
        try {
          const user = JSON.parse(userString)
          userEmail = user.email || userEmail
          userPhone = user.phoneNumber || userPhone
        } catch (e) {
          console.error("Error parsing user data from localStorage:", e)
        }
      }

      // Add visa ID and basic info
      formData.append("visaId", visaId)
      formData.append("travellers", travellersCount.toString())
      formData.append("email", userEmail)
      formData.append("phone", userPhone)
       formData.append("country", country)
      formData.append("paymentId", paymentId)

      console.log("🚀 Data to be submitted:")
      console.log("visaId:", visaId)
      console.log("travellers:", travellersCount)
      console.log("email:", userEmail)
      console.log("phone:", userPhone)
      console.log("paymentId:", paymentId)

      // Add passport data for ALL travellers
      const allPassportData: { travellerIndex: number; passportNumber: string; surname: string; givenName: string; nationality: string; dob: string; placeOfBirth: string; sex: string; dateOfIssue: string; dateOfExpiry: string; placeOfIssue: string; fileNumber: string }[] = []
      travellersData.forEach((travellerData, index) => {
        if (travellerData?.ocrData?.passport_data) {
          const passportData = {
            travellerIndex: index,
            passportNumber: travellerData.ocrData.passport_data.passportNumber || "",
            surname: travellerData.ocrData.passport_data.surname || "",
            givenName: travellerData.ocrData.passport_data.givenName || "",
            nationality: travellerData.ocrData.passport_data.nationality || "",
            dob: travellerData.ocrData.passport_data.dob || "",
            placeOfBirth: travellerData.ocrData.passport_data.placeOfBirth || "",
            sex: travellerData.ocrData.passport_data.sex || "",
            dateOfIssue: travellerData.ocrData.passport_data.dateOfIssue || "",
            dateOfExpiry: travellerData.ocrData.passport_data.dateOfExpiry || "",
            placeOfIssue: travellerData.ocrData.passport_data.placeOfIssue || "",
            fileNumber: travellerData.ocrData.passport_data.fileNumber || "",
          }
          allPassportData.push(passportData)
          console.log(`passportData[${index}]:`, passportData)
        }
      })

      // Send passport data as array for all travellers
      formData.append("passportData", JSON.stringify(allPassportData))

      // Add documents for ALL travellers
      travellersData.forEach((travellerData, travellerIndex) => {
        documents.forEach((doc) => {
          const files = travellerData.uploadedFiles[doc.id]
          if (files) {
            if (files.front) {
              formData.append(`documents[${travellerIndex}][${doc.id}][front]`, files.front)
              console.log(`documents[${travellerIndex}][${doc.id}][front]:`, files.front.name)
            }
            if (files.back) {
              formData.append(`documents[${travellerIndex}][${doc.id}][back]`, files.back)
              console.log(`documents[${travellerIndex}][${doc.id}][back]:`, files.back.name)
            }
          }
        })
      })

      // Add document metadata for all travellers
      const documentMetadata = travellersData.map((travellerData, travellerIndex) => ({
        travellerIndex,
        documents: documents.map((doc) => ({
          id: doc.id,
          name: doc.name,
          sides: doc.requiresBothSides ? ["front", "back"] : ["front"],
          uploaded: {
            front: !!travellerData.uploadedFiles[doc.id]?.front,
            back: !!travellerData.uploadedFiles[doc.id]?.back,
          },
        })),
      }))

      formData.append("documentMetadata", JSON.stringify(documentMetadata))
      console.log("documentMetadata:", documentMetadata)

      console.log("🚀 Submitting visa application for", travellersCount, "travellers")

      const response = await fetch("https://govissa-872569311567.asia-south2.run.app/api/VisaApplication/apply-visa", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Server responded with status: ${response.status}`)
      }

      const result = await response.json()
      console.log("✅ Visa application submitted successfully:", result)

      setSubmitSuccess(true)
    } catch (error) {
      console.error("❌ Error submitting visa application:", error)
      setSubmitError(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <FileText className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h3 className="mt-6 text-xl font-semibold text-gray-900">Preparing Your Documents</h3>
          <p className="mt-2 text-gray-600">Setting up your personalized document checklist...</p>
        </div>
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">All Set!</h2>
          <p className="text-gray-600 mb-8">No additional documents are required for this visa application.</p>
          <button
            onClick={() => window.history.back()}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // Success screen
  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="text-center p-10 bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-lg">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
          <p className="text-gray-600 mb-2">
            Your visa application for{" "}
            <span className="font-semibold text-gray-900">
              {travellersCount} traveller{travellersCount > 1 ? "s" : ""}
            </span>{" "}
            has been submitted successfully.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            You will receive a confirmation email shortly with your application reference number.
          </p>
          <div className="space-y-3">
           
            <button
              onClick={() => window.history.back()}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (showReview) {
    return (
      <DocumentReview
        documents={documents}
        travellersData={travellersData}
        handleRemoveFile={(travellerIndex, docId, side) => {
          const travellerData = travellersData[travellerIndex]
          const updatedFiles = { ...travellerData.uploadedFiles }
          if (updatedFiles[docId]) {
            URL.revokeObjectURL(updatedFiles[docId][`${side}Preview`] || "")
            delete updatedFiles[docId][side]
            delete updatedFiles[docId][`${side}Preview`]
            if (Object.keys(updatedFiles[docId]).length === 0) {
              delete updatedFiles[docId]
            }
          }

          setTravellersData((prev) =>
            prev.map((traveller, index) =>
              index === travellerIndex ? { ...traveller, uploadedFiles: updatedFiles } : traveller,
            ),
          )
        }}
        handlePassportDataChange={(travellerIndex, data) => {
          setTravellersData((prev) =>
            prev.map((traveller, index) =>
              index === travellerIndex
                ? {
                    ...traveller,
                    ocrData: traveller.ocrData
                      ? {
                          ...traveller.ocrData,
                          passport_data: data,
                        }
                      : null,
                  }
                : traveller,
            ),
          )
        }}
        handleSubmitApplication={handleSubmitApplication}
        isSubmitting={isSubmitting}
        submitError={submitError}
        setShowReview={setShowReview}
        travellersCount={travellersCount}
      />
    )
  }

  const currentDocument = documents[currentStep]
  const progress = ((currentStep + 1) / documents.length) * 100
  const overallProgress =
    ((currentTraveller * documents.length + currentStep + 1) / (travellersCount * documents.length)) * 100
  const requiresBothSides = currentDocument.requiresBothSides
  const currentUploads = currentTravellerData.uploadedFiles[currentDocument.id] || {}
  const hasUploadedFile = !!currentUploads[currentSide] || !!currentUploads.front

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Document Upload</h1>
              <p className="text-gray-600 mt-1">
                Traveller {currentTraveller + 1} of {travellersCount} • {currentDocument.name}
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Users className="w-4 h-4" />
              <span>
                {travellersCount} Traveller{travellersCount > 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Progress for Multiple Travellers */}
        {travellersCount > 1 && (
          <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Overall Progress
              </h3>
              <span className="text-sm font-medium text-gray-600">{Math.round(overallProgress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Started</span>
              <span>In Progress</span>
              <span>Complete</span>
            </div>
          </div>
        )}

        {/* Travellers Navigation */}
        {travellersCount > 1 && (
          <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Travellers Status</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: travellersCount }, (_, index) => {
                const isCompleted = index < currentTraveller
                const isCurrent = index === currentTraveller
               

                return (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      isCompleted
                        ? "bg-green-50 border-green-200"
                        : isCurrent
                          ? "bg-blue-50 border-blue-300 ring-2 ring-blue-100"
                          : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            isCompleted
                              ? "bg-green-500 text-white"
                              : isCurrent
                                ? "bg-blue-500 text-white"
                                : "bg-gray-300 text-gray-600"
                          }`}
                        >
                          {isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
                        </div>
                        <span className="ml-3 font-medium text-gray-900">Traveller {index + 1}</span>
                      </div>
                      {isCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
                      {isCurrent && <Clock className="w-5 h-5 text-blue-500" />}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Current Traveller Progress */}
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Traveller {currentTraveller + 1} Progress</h3>
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep + 1} of {documents.length}
              {requiresBothSides && (
                <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded-full">
                  {currentSide === "front" ? "Front Side" : "Back Side"}
                </span>
              )}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <DocumentUploader
          currentDocument={currentDocument}
          currentSide={currentSide}
          setCurrentSide={setCurrentSide}
          currentUploads={currentUploads}
          handleFileChange={handleFileChange}
          handleRemoveFile={handleRemoveFile}
          ocrData={currentTravellerData.ocrData}
          ocrError={currentTravellerData.ocrError}
          handlePassportDataChange={handlePassportDataChange}
          travellerNumber={currentTraveller + 1}
        />

        {/* Action buttons */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0 && currentSide === "front" && currentTraveller === 0}
              className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              ← Previous
            </button>
            <button
              onClick={handleNext}
              disabled={!hasUploadedFile}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg flex items-center justify-center"
            >
              {currentTraveller === travellersCount - 1 && currentStep === documents.length - 1 ? (
                <>
                  Review All Documents
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
