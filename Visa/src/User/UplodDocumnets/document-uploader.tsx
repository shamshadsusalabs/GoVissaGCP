"use client"

import type React from "react"
import { useState } from "react"
import { Camera, Upload, FileText, AlertCircle, CheckCircle, X } from "lucide-react"
import PassportDataForm from "./passport-data-form"
import type { Document, PassportData, OCRResponse } from "./document-types"

interface DocumentUploaderProps {
  currentDocument: Document
  currentSide: "front" | "back"
  setCurrentSide: (side: "front" | "back") => void
  currentUploads: {
    front?: File
    back?: File
    frontPreview?: string
    backPreview?: string
  }
  handleFileChange: (file: File | null) => void
  handleRemoveFile: (docId: string, side: "front" | "back") => void
  ocrData: OCRResponse | null
  ocrError: string | null
  handlePassportDataChange: (data: PassportData) => void
  travellerNumber: number
  passportDataSaved?: boolean // ✅ Add this prop
}

export default function DocumentUploader({
  currentDocument,
  currentSide,
  setCurrentSide,
  currentUploads,
  handleFileChange,
  handleRemoveFile,
  ocrData,
  ocrError,
  handlePassportDataChange,
  travellerNumber,
  passportDataSaved = false, // ✅ Add this prop with default value
}: DocumentUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null)

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0])
    }
  }

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })
      setStream(mediaStream)
      setShowCamera(true)
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Unable to access camera. Please check permissions and try again.")
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setShowCamera(false)
  }

  const capturePhoto = () => {
    if (videoRef) {
      const canvas = document.createElement("canvas")
      canvas.width = videoRef.videoWidth
      canvas.height = videoRef.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(videoRef, 0, 0, canvas.width, canvas.height)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], `${currentDocument.name}-${currentSide}-${Date.now()}.jpg`, {
                type: "image/jpeg",
              })
              handleFileChange(file)
              stopCamera()
            }
          },
          "image/jpeg",
          0.95,
        )
      }
    }
  }

  const getDocumentIcon = (docName: string) => {
    const icons: Record<string, string> = {
      photo: "📷",
      passport: "🛂",
      "valid passport": "🛂",
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

  // Helper to detect passport-like document names
  const isPassportName = (name: string) => {
    const n = name.trim().toLowerCase()
    return n === "passport" || n === "valid passport"
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-8">
        {/* Document Header */}
        <div className="flex items-start mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center text-2xl mr-6">
            {getDocumentIcon(currentDocument.name)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                Traveller {travellerNumber}
              </span>
              {currentDocument.isMandatory && (
                <span className="bg-red-100 text-red-700 text-xs font-medium px-2.5 py-1 rounded-full">Required</span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentDocument.name}</h2>
            {currentDocument.description && <p className="text-gray-600 mb-3">{currentDocument.description}</p>}
            {currentDocument.example && (
              <p className="text-sm text-gray-500">
                <span className="font-medium">Example:</span> {currentDocument.example}
              </p>
            )}
          </div>
        </div>

        {/* Side toggle for documents requiring both sides */}
        {currentDocument.requiresBothSides && (
          <div className="mb-8">
            <div className="flex bg-gray-100 rounded-xl p-1 w-fit">
              <button
                onClick={() => setCurrentSide("front")}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentSide === "front" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Front Side
              </button>
              <button
                onClick={() => setCurrentSide("back")}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentSide === "back" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Back Side
              </button>
            </div>
          </div>
        )}

        {/* Accepted formats */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
          <div className="flex items-start">
            <FileText className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Accepted Formats</p>
              <p className="text-sm text-blue-700">{currentDocument.format}</p>
            </div>
          </div>
        </div>

        {/* OCR Error Display */}
        {ocrError && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-red-800 mb-1">OCR Processing Error</h3>
                <p className="text-sm text-red-700 mb-2">{ocrError}</p>
                <p className="text-xs text-red-600">
                  Don't worry! You can still continue and fill in the passport details manually.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Preview area - only show if not passport front side */}
        {(currentUploads[`${currentSide}Preview`] || currentUploads.frontPreview) &&
          !(isPassportName(currentDocument.name) && currentSide === "front") && (
            <div className="mb-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  {currentDocument.requiresBothSides
                    ? `${currentSide === "front" ? "Front Side" : "Back Side"}`
                    : "Document"}{" "}
                  Uploaded
                </h3>
                <button
                  onClick={() => handleRemoveFile(currentDocument.id, currentSide)}
                  className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex justify-center">
                <img
                  src={
                    currentUploads[`${currentSide || "/placeholder.svg"}Preview`] ||
                    currentUploads.frontPreview ||
                    "/placeholder.svg"
                  }
                  alt="Preview"
                  className="max-h-80 max-w-full object-contain rounded-lg shadow-md"
                />
              </div>
            </div>
          )}

        {/* Passport data form and image side by side */}
        {isPassportName(currentDocument.name) && currentSide === "front" && ocrData && (
          <div className="mb-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Left side - Passport Image */}
              <div className="order-2 xl:order-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Passport Reference
                </h3>
                {currentUploads.frontPreview ? (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <img
                      src={currentUploads.frontPreview || "/placeholder.svg"}
                      alt="Passport Front"
                      className="w-full h-auto object-contain rounded-lg max-h-96"
                    />
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-8 border-2 border-dashed border-gray-300 text-center">
                    <FileText className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-500">Upload passport image to see reference</p>
                  </div>
                )}
              </div>

              {/* Right side - Passport Form */}
              <div className="order-1 xl:order-2">
                <PassportDataForm
                  initialData={ocrData.data}
                  onDataChange={handlePassportDataChange}
                  passportDataSaved={passportDataSaved} // ✅ Pass the saved status
                />
              </div>
            </div>
          </div>
        )}

        {/* Camera view */}
        {showCamera && (
          <div className="mb-8 bg-gray-900 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                Camera View
              </h3>
              <button
                onClick={stopCamera}
                className="text-white hover:text-red-300 p-2 hover:bg-gray-800 rounded-lg transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col items-center">
              <video
                ref={(ref) => {
                  setVideoRef(ref)
                  if (ref && stream) {
                    ref.srcObject = stream
                    ref.play()
                  }
                }}
                className="w-full max-w-md h-auto rounded-lg mb-6 shadow-lg"
                autoPlay
                playsInline
              />
              <button
                onClick={capturePhoto}
                className="px-8 py-3 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-all duration-200 font-semibold shadow-lg flex items-center"
              >
                <Camera className="w-5 h-5 mr-2" />
                Capture Photo
              </button>
            </div>
          </div>
        )}

        {/* Upload area */}
        {!showCamera && (
          <div>
            {/* Upload method selection */}
            <div className="flex justify-center mb-6">
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setShowCamera(false)}
                  className={`px-6 py-3 rounded-lg flex items-center text-sm font-medium transition-all duration-200 ${
                    !showCamera ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File
                </button>
                <button
                  onClick={startCamera}
                  className={`px-6 py-3 rounded-lg flex items-center text-sm font-medium transition-all duration-200 ${
                    showCamera ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Use Camera
                </button>
              </div>
            </div>

            {/* Upload dropzone */}
            <label className="block">
              <div
                className={`relative flex flex-col items-center px-8 py-12 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
                  dragActive
                    ? "border-blue-400 bg-blue-50 scale-105"
                    : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                      dragActive ? "bg-blue-100" : "bg-gray-100"
                    }`}
                  >
                    <Upload
                      className={`w-8 h-8 transition-all duration-300 ${
                        dragActive ? "text-blue-600" : "text-gray-400"
                      }`}
                    />
                  </div>
                  <h3
                    className={`text-lg font-semibold mb-2 transition-all duration-300 ${
                      dragActive ? "text-blue-600" : "text-gray-900"
                    }`}
                  >
                    Drop your file here
                  </h3>
                  <p
                    className={`text-sm mb-4 transition-all duration-300 ${
                      dragActive ? "text-blue-600" : "text-gray-600"
                    }`}
                  >
                    or <span className="font-semibold">click to browse</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentDocument.requiresBothSides
                      ? `${currentSide === "front" ? "Front side" : "Back side"} of `
                      : ""}
                    {currentDocument.name}
                  </p>
                </div>
              </div>
              <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleInputChange} />
            </label>
          </div>
        )}
      </div>
    </div>
  )
}
