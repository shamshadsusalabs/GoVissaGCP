"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { FaUpload, FaTrash, FaArrowRight, FaArrowLeft, FaExclamationTriangle } from "react-icons/fa"
import { useDropzone } from "react-dropzone"

interface ImageData {
  preview: string
  file: File
}

interface ImageUploadProps {
  images: ImageData[]
  updateImages: (images: ImageData[]) => void
  nextStep: () => void
  prevStep: () => void
  existingImages?: string[]
  isUpdateMode?: boolean
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  updateImages,
  nextStep,
  prevStep,
  existingImages = [],
  isUpdateMode = false,
}) => {
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  // File validation constants - Increased for HD quality
  const MAX_FILE_SIZE = 15 * 1024 * 1024 // 15MB in bytes for HD images
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ALLOWED_FORMATS = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

  // Validate individual file
  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        return `${file.name} is too large. Maximum size allowed is 15MB.`
      }
      // Check file format
      if (!ALLOWED_FORMATS.includes(file.type.toLowerCase())) {
        return `${file.name} has unsupported format. Only JPEG, JPG, PNG, and WEBP are allowed.`
      }
      return null
    },
    [MAX_FILE_SIZE, ALLOWED_FORMATS],
  )

  // Handle file drop with validation
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setUploading(true)
      setErrors([])
      const newErrors: string[] = []
      const validFiles: File[] = []

      // Handle rejected files
      rejectedFiles.forEach((rejection) => {
        const { file, errors: rejectionErrors } = rejection
        rejectionErrors.forEach((error: any) => {
          if (error.code === "file-too-large") {
            newErrors.push(`${file.name} is too large. Maximum size allowed is 15MB.`)
          } else if (error.code === "file-invalid-type") {
            newErrors.push(`${file.name} has unsupported format. Only JPEG, JPG, PNG, and WEBP are allowed.`)
          }
        })
      })

      // Validate accepted files
      acceptedFiles.forEach((file) => {
        const error = validateFile(file)
        if (error) {
          newErrors.push(error)
        } else {
          validFiles.push(file)
        }
      })

      // Only allow 1 image
      if (validFiles.length > 1) {
        newErrors.push("Only 1 image is allowed. Please upload a single image.")
        setErrors(newErrors)
        setUploading(false)
        return
      }

      // Create image data for valid files
      if (validFiles.length > 0) {
        const newImages = validFiles.map((file) => ({
          preview: URL.createObjectURL(file),
          file: file,
        }))
        updateImages(newImages) // Replace existing images with the new one
      }

      // Set errors if any
      if (newErrors.length > 0) {
        setErrors(newErrors)
      }
      setUploading(false)
    },
    [updateImages, validateFile],
  )

  // Remove the image
  const removeImage = useCallback(() => {
    if (images.length > 0) {
      URL.revokeObjectURL(images[0].preview)
      updateImages([])
    }
    // Clear errors when removing image
    if (errors.length > 0) {
      setErrors([])
    }
  }, [images, updateImages, errors.length])

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors([])
  }, [])

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((image) => URL.revokeObjectURL(image.preview))
    }
  }, [images])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    disabled: images.length >= 1 || uploading,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    nextStep()
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Upload Country Image</h2>
      <form onSubmit={handleSubmit}>
        {/* File Requirements Info */}
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800 mb-2">File Requirements:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Maximum file size: 15MB</li>
            <li>• Supported formats: JPEG, JPG, PNG, WEBP</li>
            <li>• Only 1 image allowed</li>
          </ul>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-red-800 flex items-center">
                <FaExclamationTriangle className="mr-2" />
                Upload Errors:
              </h3>
              <button type="button" onClick={clearErrors} className="text-red-600 hover:text-red-800 text-sm underline">
                Clear
              </button>
            </div>
            <ul className="text-sm text-red-700 space-y-1">
              {errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Existing Image (for update mode) */}
        {isUpdateMode && existingImages.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-gray-700">Existing Image</h3>
            <div className="grid grid-cols-1 gap-4 mb-4">
              {existingImages.map((imageUrl, index) => (
                <div key={index} className="relative">
                  <img
                    src={imageUrl || "/placeholder.svg"}
                    alt={`Existing image`}
                    className="w-full h-auto max-h-96 object-contain rounded-lg border border-gray-200"
                    style={{ imageRendering: 'crisp-edges' }}
                  />
                  <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    Existing
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mb-4">Note: Existing image will be replaced if you upload a new one.</p>
          </div>
        )}

        {/* Upload Area */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload an image of the country (flag, landmark, etc.)
          </label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              images.length >= 1 || uploading
                ? "border-gray-300 bg-gray-100 cursor-not-allowed"
                : isDragReject
                  ? "border-red-300 bg-red-50"
                  : isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-blue-300 hover:border-blue-500"
            }`}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <div className="text-blue-600">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                Uploading...
              </div>
            ) : (
              <>
                <FaUpload className={`mx-auto text-3xl mb-2 ${isDragReject ? "text-red-400" : "text-gray-400"}`} />
                <p className={`text-sm ${isDragReject ? "text-red-600" : "text-gray-600"}`}>
                  {images.length >= 1
                    ? "Image already uploaded"
                    : isDragReject
                      ? "File is not supported"
                      : isDragActive
                        ? "Drop the image here..."
                        : "Drag & drop image here, or click to select"}
                </p>
                <p className="text-xs text-gray-400 mt-2">JPEG, JPG, PNG, WEBP • Max 15MB</p>
              </>
            )}
          </div>
        </div>

        {/* Uploaded Image Display */}
        {images.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-gray-700">Uploaded Image</h3>
            <div className="grid grid-cols-1 gap-4">
              {images.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img.preview || "/placeholder.svg"}
                    alt={`Country image`}
                    className="w-full h-auto max-h-96 object-contain rounded-lg border border-gray-200"
                    style={{ imageRendering: 'crisp-edges' }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <button
                      type="button"
                      onClick={removeImage}
                      className="bg-red-500 text-white p-2 rounded-full opacity-0 hover:opacity-100 transition-opacity hover:bg-red-600"
                      title="Remove image"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                  <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {(img.file.size / (1024 * 1024)).toFixed(1)}MB
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={images.length === 0 && !isUpdateMode && existingImages.length === 0}
          >
            Next <FaArrowRight className="ml-2" />
          </button>
        </div>
      </form>
    </div>
  )
}

export default ImageUpload
