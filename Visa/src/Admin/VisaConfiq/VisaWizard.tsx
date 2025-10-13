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
    applicationTips: string
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
  expectedVisaDays: number
  interviewRequired: boolean
  biometricRequired: boolean
  notes: string
}

interface DocumentRequirement {
  id: string
  name: string
  description: string
  isMandatory: boolean
  sample?: string[]
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
  const [currentConfigId, setCurrentConfigId] = useState<string | null>(configId || null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string>("")

  const [config, setConfig] = useState<VisaConfiguration>({
    continent: "",
    countryDetails: {
      name: "",
      code: "",
      embassyLocation: "",
       applicationTips: "",
    },
    visaTypes: [],
    documents: [],
    eligibility: "",
    rejectionReasons: [],
    images: [],
  })

  const [existingImages, setExistingImages] = useState<string[]>([])

  const getBackNavigationPath = () => {
    const fromPath = location.state?.from
    if (fromPath) {
      return fromPath
    }
    if (isUpdateMode) {
      return "/dashboard/VisaConfigList"
    } else {
      return "/visa-config-form"
    }
  }

  const handleExistingImages = (imageUrls: string[]) => {
    setExistingImages(imageUrls)
  }

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

      const data = result.data || result

      const transformedConfig: VisaConfiguration = {
        continent: data.continent || "",
        countryDetails: {
          name: data.countryDetails?.name || data.name || "",
          code: data.countryDetails?.code || data.code || "",
          embassyLocation: data.countryDetails?.embassyLocation || data.embassyLocation || "",
           applicationTips: data.countryDetails?.applicationTips || data.applicationTips || "",
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
            expectedVisaDays: vt.expectedVisaDays || 7,
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
            sample: doc.sample || [],
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
        images: [],
      }

      if (data.images && Array.isArray(data.images)) {
        handleExistingImages(data.images)
      }

      console.log("🔄 Transformed config:", transformedConfig)
      setConfig(transformedConfig)

      // Always start from step 1 in update mode for better UX
      setStep(1)
    } catch (error) {
      console.error("❌ Error fetching configuration:", error)
      setLoadError(error instanceof Error ? error.message : "Failed to load configuration")
    } finally {
      setIsLoading(false)
    }
  }

  const saveStep = async (stepNumber: number, stepData: any) => {
    if (stepNumber === 7) {
      return await saveImages()
    }

    setIsSaving(true)
    setSaveMessage("")

    try {
      const response = await fetch("http://localhost:5000/api/configurations/save-step", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stepNumber,
          stepData,
          configId: currentConfigId,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to save step: ${response.status}`)
      }

      const result = await response.json()

      if (!currentConfigId && result.data._id) {
        setCurrentConfigId(result.data._id)
      }

      setSaveMessage(`✅ Step ${stepNumber} saved successfully`)
      setTimeout(() => setSaveMessage(""), 3000)

      return result.data
    } catch (error) {
      console.error("❌ Error saving step:", error)
      setSaveMessage(`❌ Failed to save step ${stepNumber}`)
      setTimeout(() => setSaveMessage(""), 5000)
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  const saveImages = async () => {
    if (config.images.length === 0) {
      return
    }

    setIsSaving(true)
    setSaveMessage("")

    try {
      const formData = new FormData()
      formData.append("configId", currentConfigId || "")
      formData.append("images", config.images[0].file)

      const response = await fetch("http://localhost:5000/api/configurations/save-images", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Failed to save images: ${response.status}`)
      }

      const result = await response.json()
      setSaveMessage("✅ Images saved successfully")
      setTimeout(() => setSaveMessage(""), 3000)

      return result.data
    } catch (error) {
      console.error("❌ Error saving images:", error)
      setSaveMessage("❌ Failed to save images")
      setTimeout(() => setSaveMessage(""), 5000)
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  const nextStep = async () => {
    try {
      let stepData = {}

      switch (step) {
        case 1:
          stepData = { continent: config.continent }
          break
        case 2:
          stepData = { countryDetails: config.countryDetails }
          break
        case 3:
          stepData = { visaTypes: config.visaTypes }
          break
        case 4:
          stepData = { documents: config.documents }
          break
        case 5:
          stepData = { eligibility: config.eligibility }
          break
        case 6:
          stepData = { rejectionReasons: config.rejectionReasons }
          break
        case 7:
          await saveStep(7, {})
          break
      }

      if (step < 7) {
        await saveStep(step, stepData)
      }

      setStep(step + 1)
    } catch (error) {
      console.error("Error saving step:", error)
      setStep(step + 1)
    }
  }

  const prevStep = () => setStep(step - 1)

  const updateConfig = (key: keyof VisaConfiguration, value: unknown) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const resetWizard = () => {
    setStep(1)
    setCurrentConfigId(null)
    setConfig({
      continent: "",
      countryDetails: {
        name: "",
        code: "",
        embassyLocation: "",
         applicationTips: "",
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
      if (!currentConfigId) {
        throw new Error("No configuration ID found")
      }

      const response = await fetch("http://localhost:5000/api/configurations/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          configId: currentConfigId,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("✅ Success:", result)

      const action = isUpdateMode ? "updated" : "created"
      alert(`🎉 Visa configuration ${action} successfully!`)

      if (isUpdateMode) {
        navigate("/dashboard/VisaConfigList")
      } else {
        resetWizard()
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
            configId={currentConfigId} // Fixed: Now properly typed as string | null
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

      {(isSaving || saveMessage) && (
        <div className="fixed top-4 right-4 z-40">
          <div
            className={`p-3 rounded-lg shadow-lg ${
              saveMessage.includes("✅")
                ? "bg-green-100 text-green-800"
                : saveMessage.includes("❌")
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
            }`}
          >
            {isSaving ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Saving...
              </div>
            ) : (
              saveMessage
            )}
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
                  onClick={() => setStep(stepNumber)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer hover:scale-105 hover:shadow-md
                    ${
                      step === stepNumber
                        ? "bg-blue-600 text-white"
                        : step > stepNumber
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  {stepNumber}
                </div>
                <div 
                  onClick={() => setStep(stepNumber)}
                  className="text-xs mt-2 text-gray-600 text-center capitalize cursor-pointer hover:text-blue-600 transition-colors"
                >
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
