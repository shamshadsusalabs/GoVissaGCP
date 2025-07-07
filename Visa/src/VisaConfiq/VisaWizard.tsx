"use client"

import type React from "react"
import { useState } from "react"
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
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
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

      const response = await fetch("https://govissa-872569311567.asia-south2.run.app/api/configurations/add", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("✅ Success:", result)

      // Show success message
      alert("🎉 Visa configuration submitted successfully!")

      // Reset wizard to first step
      resetWizard()
    } catch (error) {
      console.error("❌ Error:", error)
      alert("❌ Failed to submit configuration. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
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
          />
        )
      case 8:
        return <ReviewSubmit config={config} prevStep={prevStep} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
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

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Submitting Configuration...</h3>
            <p className="text-gray-600">Please wait while we process your visa configuration.</p>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-2">Visa Configuration Wizard</h1>
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
