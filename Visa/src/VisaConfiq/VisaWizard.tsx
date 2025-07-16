"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import ContinentSelection from "./ContinentSelection"
import CountryDetails from "./CountryDetails"
import VisaTypes from "./VisaTypes"
import DocumentRequirements from "./DocumentRequirements"
import EligibilityCriteria from "./EligibilityCriteria"
import RejectionReasons from "./RejectionReasons"
import ImageUpload from "./ImageUpload"
import ReviewSubmit from "./ReviewSubmit"

interface ImageData {
  preview: string
  file: File
}

interface VisaConfiguration {
  continent: string
  countryDetails: {
    name: string
    code: string
    embassyLocation: string
    generalRequirements: string
  }
  visaTypes: VisaType[]
  documents: DocumentRequirement[]
  eligibility: string
  rejectionReasons: RejectionReason[]
  images: ImageData[]
}

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

interface DocumentRequirement {
  id: string
  name: string
  description: string
  isMandatory: boolean
  example?: string
  format?: string
}

interface RejectionReason {
  id: string
  reason: string
  description: string
  frequency: "Rare" | "Occasional" | "Common"
}

const VisaWizard: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { id: configId } = useParams<{ id: string }>()
  const isUpdateMode = !!configId

  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [config, setConfig] = useState<VisaConfiguration>({
    continent: "",
    countryDetails: {
      name: "",
      code: "",
      embassyLocation: "",
      generalRequirements: "",
    },
    visaTypes: [],
    documents: [],
    eligibility: "",
    rejectionReasons: [],
    images: [],
  })

  const [existingImages, setExistingImages] = useState<string[]>([])

  // Function to determine where to navigate back
  const getBackNavigationPath = () => {
    // Check if there's a state indicating where user came from
    const fromPath = location.state?.from

    if (fromPath) {
      return fromPath
    }

    // Default navigation based on mode
    if (isUpdateMode) {
      return "/dashboard/VisaConfigList" // Go to list if updating
    } else {
      return "/visa-config-form" // Go to form if creating new
    }
  }

  // Function to handle existing images from server
  const handleExistingImages = (imageUrls: string[]) => {
    setExistingImages(imageUrls)
  }

  // Fetch existing configuration if in update mode
  useEffect(() => {
    if (isUpdateMode && configId) {
      fetchConfiguration(configId)
    }
  }, [configId, isUpdateMode])

  const fetchConfiguration = async (id: string) => {
    setIsLoading(true)
    setLoadError(null)

    try {
      const response = await fetch(`http://localhost:5000/api/configurations/getById/${id}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch configuration: ${response.status}`)
      }

      const result = await response.json()
      console.log("📥 Fetched configuration:", result)

      // Extract the actual data from the response
      const data = result.data || result

      // Transform the fetched data to match our component structure
      const transformedConfig: VisaConfiguration = {
        continent: data.continent || "",
        countryDetails: {
          name: data.countryDetails?.name || data.name || "",
          code: data.countryDetails?.code || data.code || "",
          embassyLocation: data.countryDetails?.embassyLocation || data.embassyLocation || "",
          generalRequirements: data.countryDetails?.generalRequirements || data.generalRequirements || "",
        },
        visaTypes:
          data.visaTypes?.map((vt: any) => ({
            id: vt.id || vt._id || Date.now().toString(),
            name: vt.name || "",
            code: vt.code || "",
            category: vt.category || "",
            processingTime: vt.processingTime || "",
            processingMethod: vt.processingMethod || "Standard",
            visaFee: vt.visaFee || 0,
            serviceFee: vt.serviceFee || 0,
            currency: vt.currency || "USD",
            validity: vt.validity || "",
            entries: vt.entries || "Single",
            stayDuration: vt.stayDuration || "",
            interviewRequired: vt.interviewRequired || false,
            biometricRequired: vt.biometricRequired || false,
            notes: vt.notes || "",
          })) || [],
        documents:
          data.documents?.map((doc: any) => ({
            id: doc.id || doc._id || Date.now().toString(),
            name: doc.name || "",
            description: doc.description || "",
            isMandatory: doc.isMandatory || false,
            example: doc.example || "",
            format: doc.format || "",
          })) || [],
        eligibility: data.eligibility || "",
        rejectionReasons:
          data.rejectionReasons?.map((reason: any) => ({
            id: reason.id || reason._id || Date.now().toString(),
            reason: reason.reason || "",
            description: reason.description || "",
            frequency: reason.frequency || "Occasional",
          })) || [],
        images: [], // Images will be handled separately for update mode
      }

      // Add this line after setting the transformed config
      if (data.images && Array.isArray(data.images)) {
        handleExistingImages(data.images)
      }

      console.log("🔄 Transformed config:", transformedConfig)
      setConfig(transformedConfig)
    } catch (error) {
      console.error("❌ Error fetching configuration:", error)
      setLoadError(error instanceof Error ? error.message : "Failed to load configuration")
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  const updateConfig = (key: keyof VisaConfiguration, value: unknown) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Reset wizard to first step
  const resetWizard = () => {
    setStep(1)
    setConfig({
      continent: "",
      countryDetails: {
        name: "",
        code: "",
        embassyLocation: "",
        generalRequirements: "",
      },
      visaTypes: [],
      documents: [],
      eligibility: "",
      rejectionReasons: [],
      images: [],
    })
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      const { images, continent, countryDetails, visaTypes, documents, eligibility, rejectionReasons } = config

      // Append each field individually
      formData.append("continent", continent)
      formData.append("countryDetails", JSON.stringify(countryDetails))
      formData.append("visaTypes", JSON.stringify(visaTypes))
      formData.append("documents", JSON.stringify(documents))
      formData.append("eligibility", eligibility)
      formData.append("rejectionReasons", JSON.stringify(rejectionReasons))

      // Append each image file
      images.forEach((image) => {
        formData.append("images", image.file)
      })

      console.log("📦 FormData being sent:")
      for (const pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(`${pair[0]}:`, pair[1].name, pair[1].type)
        } else {
          console.log(`${pair[0]}:`, pair[1])
        }
      }

      // Choose endpoint based on mode
      const url = isUpdateMode
        ? `http://localhost:5000/api/configurations/update/${configId}`
        : "http://localhost:5000/api/configurations/add"

      const method = isUpdateMode ? "PUT" : "POST"

      const response = await fetch(url, {
        method: method,
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("✅ Success:", result)

      // Show success message
      const action = isUpdateMode ? "updated" : "created"
      alert(`🎉 Visa configuration ${action} successfully!`)

      // Navigate back based on mode
      if (isUpdateMode) {
        navigate("/dashboard/VisaConfigList") // Navigate to list after update
      } else {
        resetWizard() // Reset for new creation
      }
    } catch (error) {
      console.error("❌ Error:", error)
      const action = isUpdateMode ? "update" : "submit"
      alert(`❌ Failed to ${action} configuration. Please check your connection and try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    const backPath = getBackNavigationPath()
    navigate(backPath)
  }

  const handleGoBack = () => {
    const backPath = getBackNavigationPath()
    navigate(backPath)
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <ContinentSelection
            continent={config.continent}
            setContinent={(val) => updateConfig("continent", val)}
            nextStep={nextStep}
          />
        )
      case 2:
        return (
          <CountryDetails
            details={config.countryDetails}
            updateDetails={(val) => updateConfig("countryDetails", val)}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )
      case 3:
        return (
          <VisaTypes
            visaTypes={config.visaTypes}
            updateVisaTypes={(val) => updateConfig("visaTypes", val)}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )
      case 4:
        return (
          <DocumentRequirements
            documents={config.documents}
            updateDocuments={(val) => updateConfig("documents", val)}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )
      case 5:
        return (
          <EligibilityCriteria
            eligibility={config.eligibility}
            updateEligibility={(val) => updateConfig("eligibility", val)}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )
      case 6:
        return (
          <RejectionReasons
            reasons={config.rejectionReasons}
            updateReasons={(val) => updateConfig("rejectionReasons", val)}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )
      case 7:
        return (
          <ImageUpload
            images={config.images}
            updateImages={(val) => updateConfig("images", val)}
            nextStep={nextStep}
            prevStep={prevStep}
            existingImages={existingImages}
            isUpdateMode={isUpdateMode}
          />
        )
      case 8:
        return (
          <ReviewSubmit
            config={config}
            prevStep={prevStep}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            isUpdateMode={isUpdateMode}
          />
        )
      default:
        return (
          <ContinentSelection
            continent={config.continent}
            setContinent={(val) => updateConfig("continent", val)}
            nextStep={nextStep}
          />
        )
    }
  }

  // Loading state for fetching existing configuration
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading Configuration...</h3>
            <p className="text-gray-600">Please wait while we fetch the visa configuration.</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state for failed fetch
  if (loadError) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Failed to Load Configuration</h3>
            <p className="text-gray-600 mb-4">{loadError}</p>
            <div className="space-x-4">
              <button
                onClick={() => fetchConfiguration(configId!)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Retry
              </button>
              <button
                onClick={handleGoBack}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {isUpdateMode ? "Updating Configuration..." : "Submitting Configuration..."}
            </h3>
            <p className="text-gray-600">Please wait while we process your visa configuration.</p>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-2">
          {isUpdateMode ? "Update Visa Configuration" : "Visa Configuration Wizard"}
        </h1>
        {isUpdateMode && (
          <p className="text-center text-gray-600 mb-4">
            Editing configuration for: <span className="font-semibold">{config.countryDetails.name}</span>
          </p>
        )}
        <div className="flex justify-center mb-8">
          <div className="steps flex overflow-x-auto py-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((stepNumber) => (
              <div key={stepNumber} className="step-item flex flex-col items-center mx-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors
                   ${
                     step === stepNumber
                       ? "bg-blue-600 text-white"
                       : step > stepNumber
                         ? "bg-green-500 text-white"
                         : "bg-gray-200 text-gray-700"
                   }`}
                >
                  {stepNumber}
                </div>
                <div className="text-xs mt-2 text-gray-600 text-center capitalize">
                  {stepNumber === 1 && "Continent"}
                  {stepNumber === 2 && "Country"}
                  {stepNumber === 3 && "Visa Types"}
                  {stepNumber === 4 && "Documents"}
                  {stepNumber === 5 && "Eligibility"}
                  {stepNumber === 6 && "Rejections"}
                  {stepNumber === 7 && "Images"}
                  {stepNumber === 8 && "Review"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {renderStep()}
    </div>
  )
}

export default VisaWizard
