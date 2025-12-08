"use client"

import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { Users, FileText, CheckCircle, Clock, ArrowRight, Loader2 } from "lucide-react" // 👈 Loader2 add
import DocumentUploader from "./document-uploader"
import DocumentReview from "./document-review"
import ProcessingModeModal from "./processing-mode-modal"
import type { Document, PassportData, TravellerData, OCRResponse } from "./document-types"

export default function UploadDocuments() {
  const params = useParams()
  const visaId = params?.visaId as string
  const travellersCount = Number.parseInt(params?.travellers as string) || 1
  const paymentId = params?.paymentId as string
  const country = params?.country as string

  const [documents, setDocuments] = useState<Document[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [currentTraveller, setCurrentTraveller] = useState(0)
  const [currentSide, setCurrentSide] = useState<"front" | "back">("front")

  const [isLoading, setIsLoading] = useState(true)
  const [isInitializingProgress, setIsInitializingProgress] = useState(true)

  // ⭐ Next button ke liye step save loader
  const [isSavingStep, setIsSavingStep] = useState(false)

  // Processing mode
  const [showProcessingModal, setShowProcessingModal] = useState(true)
  const [processingMode, setProcessingMode] = useState<"online" | "offline" | null>(null)
  const [employeeId, setEmployeeId] = useState<string>("")

  // All travellers data
  const [travellersData, setTravellersData] = useState<TravellerData[]>(
    Array.from({ length: travellersCount }, (_, index) => ({
      travellerIndex: index,
      uploadedFiles: {},
      ocrData: null,
      ocrError: null,
      passportDataSaved: false,
    })),
  )

  const [showReview, setShowReview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Current traveller data
  const currentTravellerData = travellersData[currentTraveller]

  // 👉 processing mode select hone ke baad
  const handleProcessingModeSelect = (mode: "online" | "offline", empId?: string) => {
    setProcessingMode(mode)
    setEmployeeId(empId || "")
    setShowProcessingModal(false)
  }

  const updateCurrentTravellerData = (updates: Partial<TravellerData>) => {
    setTravellersData((prev) =>
      prev.map((traveller, index) => (index === currentTraveller ? { ...traveller, ...updates } : traveller)),
    )
  }

  // ============================
  //   EXISTING APPLICATION LOAD
  // ============================
  const hydrateFromExistingApplication = (app: any, docsWithSides: Document[]) => {
    if (!app) return

    // 1) processing mode restore
    if (app.processingMode) {
      setProcessingMode(app.processingMode)
      setShowProcessingModal(false)
    }
    if (app.employeeId) {
      setEmployeeId(app.employeeId)
    }

    const newTravellers: TravellerData[] = Array.from({ length: travellersCount }, (_, index) => ({
      travellerIndex: index,
      uploadedFiles: {},
      ocrData: null,
      ocrError: null,
      passportDataSaved: false,
    }))

    // 2) documents -> uploadedFiles + preview
    const docsFromDb = app.documents || {}

    Object.entries(docsFromDb).forEach(([key, value]) => {
      // key format: "0_<docId>"
      const [idxStr, ...docIdParts] = key.split("_")
      const travellerIndex = Number.parseInt(idxStr)
      const docId = docIdParts.join("_")

      if (Number.isNaN(travellerIndex) || travellerIndex < 0 || travellerIndex >= travellersCount) return

      const sides: any = value
      const fileEntry: any = {}

      if (sides.front?.url) {
        // 👇 DB se aaya URL => preview ke liye use kar rahe hain
        fileEntry.frontPreview = sides.front.url
      }
      if (sides.back?.url) {
        fileEntry.backPreview = sides.back.url
      }

      if (Object.keys(fileEntry).length > 0) {
        newTravellers[travellerIndex].uploadedFiles[docId] = fileEntry
      }
    })

    // 3) passportData -> ocrData
    const passportDataArr = app.passportData || []
    passportDataArr.forEach((p: any) => {
      const travellerIndex = p.travellerIndex ?? 0
      if (travellerIndex < 0 || travellerIndex >= travellersCount) return

      const { travellerIndex: _ti, ...restPassport } = p

      const pd: PassportData = {
        passport_number: restPassport.passport_number || "",
        surname: restPassport.surname || "",
        given_names: restPassport.given_names || "",
        date_of_birth: restPassport.date_of_birth || "",
        date_of_issue: restPassport.date_of_issue || "",
        date_of_expiry: restPassport.date_of_expiry || "",
        place_of_birth: restPassport.place_of_birth || "",
        place_of_issue: restPassport.place_of_issue || "",
        nationality: restPassport.nationality || "",
        sex: restPassport.sex || "",
        father_name: restPassport.father_name || "",
        mother_name: restPassport.mother_name || "",
        spouse_name: restPassport.spouse_name || "",
        address: restPassport.address || "",
        file_number: restPassport.file_number || "",
      }

      newTravellers[travellerIndex].ocrData = {
        success: true,
        filename: "",
        data: pd,
        timestamp: app.updatedAt || new Date().toISOString(),
      }
      newTravellers[travellerIndex].passportDataSaved = true
    })

    setTravellersData(newTravellers)

    // 4) find next step (first incomplete doc/side)
    let nextTravellerIndex = 0
    let nextStep = 0
    let nextSide: "front" | "back" = "front"
    let allComplete = true

    outer: for (let t = 0; t < travellersCount; t++) {
      for (let d = 0; d < docsWithSides.length; d++) {
        const doc = docsWithSides[d]
        const files = newTravellers[t].uploadedFiles[doc.id] || {}
        const hasFront = !!files.front || !!files.frontPreview
        const hasBack = !!files.back || !!files.backPreview

        if (doc.requiresBothSides) {
          if (!hasFront) {
            nextTravellerIndex = t
            nextStep = d
            nextSide = "front"
            allComplete = false
            break outer
          }
          if (!hasBack) {
            nextTravellerIndex = t
            nextStep = d
            nextSide = "back"
            allComplete = false
            break outer
          }
        } else {
          if (!hasFront) {
            nextTravellerIndex = t
            nextStep = d
            nextSide = "front"
            allComplete = false
            break outer
          }
        }
      }
    }

    if (allComplete) {
      // sab done hai -> direct review
      setCurrentTraveller(travellersCount - 1)
      setCurrentStep(docsWithSides.length - 1)
      setCurrentSide(docsWithSides[docsWithSides.length - 1].requiresBothSides ? "back" : "front")
      setShowReview(true)
    } else {
      setCurrentTraveller(nextTravellerIndex)
      setCurrentStep(nextStep)
      setCurrentSide(nextSide)
    }
  }

  // Docs config + existing progress fetch
  useEffect(() => {
    const fetchDocsAndProgress = async () => {
      if (!visaId) return
      setIsLoading(true)
      setIsInitializingProgress(true)

      try {
        // 1) fetch documents config
        const response = await fetch(
          `http://localhost:5000/api/configurations/documents/${visaId}/documents-only`,
        )
        const data = await response.json()

        if (data.success) {
          const docsWithSides: Document[] = data.documents.map((doc: Document) => ({
            ...doc,
            requiresBothSides: [
              "passport",
              "valid passport",
              "aadhar card",
              "pan card",
              "driver license",
              "voter id",
            ].includes(doc.name.toLowerCase()),
          }))
          setDocuments(docsWithSides)

          // 2) fetch existing visa application (by paymentId) for restore
          if (paymentId) {
            try {
              const appRes = await fetch(
                `http://localhost:5000/api/VisaApplication/by-payment/${paymentId}`,
              )

              if (appRes.ok) {
                const appJson = await appRes.json()

                // ✅ agar final submit ho chuka hai to direct success screen
                if (appJson.meta?.isFinalSubmit) {
                  setSubmitSuccess(true)
                }

                const app = appJson.visaApplication || appJson
                if (app && app.documents && !appJson.meta?.isFinalSubmit) {
                  // sirf tab hi restore karo jab final submit nahi hua
                  hydrateFromExistingApplication(app, docsWithSides)
                }
              }
            } catch (e) {
              console.error("Failed to load existing visa application:", e)
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch documents:", error)
      } finally {
        setIsLoading(false)
        setIsInitializingProgress(false)
      }
    }

    if (visaId && !showProcessingModal) {
      fetchDocsAndProgress()
    }
  }, [visaId, showProcessingModal, paymentId])

  // ============================
  //      FILE / OCR HANDLING
  // ============================
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

    const isPassportName = (name: string) => {
      const n = name.trim().toLowerCase()
      return n === "passport" || n === "valid passport"
    }

    if (isPassportName(currentDoc.name) && currentSide === "front") {
      updateCurrentTravellerData({ passportDataSaved: false })

      try {
        setIsLoading(true)
        const formData = new FormData()
        formData.append("file", file)

        const ocrUrls = ["https://govissagcpocr-872569311567.asia-south2.run.app/extract"]

        const warmupIfPossible = async (extractUrl: string) => {
          try {
            const base = extractUrl.replace(/\/extract$/, "")
            await fetch(`${base}/warmup`, { method: "GET", mode: "cors", credentials: "omit" })
          } catch (_) {}
        }

        let response: Response | null = null
        let lastError: Error | null = null

        for (const url of ocrUrls) {
          try {
            await warmupIfPossible(url)
            response = await fetch(url, {
              method: "POST",
              body: formData,
              mode: "cors",
              credentials: "omit",
            })

            if (response.ok) {
              break
            } else {
              if (response.status >= 500) {
                await new Promise((r) => setTimeout(r, 800))
                await warmupIfPossible(url)
                response = await fetch(url, {
                  method: "POST",
                  body: formData,
                  mode: "cors",
                  credentials: "omit",
                })
                if (response.ok) break
              }
              response = null
            }
          } catch (error) {
            lastError = error as Error
            response = null
          }
        }

        if (!response) {
          throw new Error(
            `Unable to connect to OCR service. Please ensure the OCR service is running. Last error: ${lastError?.message}`,
          )
        }

        const ocrResponse: OCRResponse = await response.json()

        const defaultPassportData: PassportData = {
          passport_number: ocrResponse.data.passport_number || "",
          surname: ocrResponse.data.surname || "",
          given_names: ocrResponse.data.given_names || "",
          date_of_birth: ocrResponse.data.date_of_birth || "",
          date_of_issue: ocrResponse.data.date_of_issue || "",
          date_of_expiry: ocrResponse.data.date_of_expiry || "",
          place_of_birth: ocrResponse.data.place_of_birth || "",
          place_of_issue: ocrResponse.data.place_of_issue || "",
          nationality: ocrResponse.data.nationality || "",
          sex: ocrResponse.data.sex || "",
          father_name: ocrResponse.data.father_name || "",
          mother_name: ocrResponse.data.mother_name || "",
          spouse_name: ocrResponse.data.spouse_name || "",
          address: ocrResponse.data.address || "",
          file_number: ocrResponse.data.file_number || "",
        }

        const processedOcrData: OCRResponse = {
          ...ocrResponse,
          data: defaultPassportData,
        }

        updateCurrentTravellerData({ ocrData: processedOcrData, ocrError: null })
      } catch (error) {
        let errorMessage = "OCR processing failed. You can continue and fill the passport details manually."

        if (error instanceof Error) {
          if (error.message.includes("Failed to fetch")) {
            errorMessage = "Unable to connect to OCR service. Please continue and fill the passport details manually."
          } else {
            errorMessage = `OCR processing failed: ${error.message}. Please continue and fill the passport details manually.`
          }
        }

        const emptyOcrData: OCRResponse = {
          success: false,
          filename: file.name,
          data: {
            passport_number: "",
            surname: "",
            given_names: "",
            date_of_birth: "",
            date_of_issue: "",
            date_of_expiry: "",
            place_of_birth: "",
            place_of_issue: "",
            nationality: "",
            sex: "",
            father_name: "",
            mother_name: "",
            spouse_name: "",
            address: "",
            file_number: "",
          },
          timestamp: new Date().toISOString(),
        }

        updateCurrentTravellerData({
          ocrData: emptyOcrData,
          ocrError: errorMessage,
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handlePassportDataChange = (data: PassportData) => {
    updateCurrentTravellerData({
      ocrData: currentTravellerData.ocrData
        ? {
            ...currentTravellerData.ocrData,
            data: data,
          }
        : null,
      passportDataSaved: true,
    })
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

    const name = documents[currentStep].name.trim().toLowerCase()
    if ((name === "passport" || name === "valid passport") && side === "front") {
      updateCurrentTravellerData({ ocrData: null, ocrError: null, passportDataSaved: false })
    }
  }

  // ⭐ STEP-BY-STEP SAVE – ab loader ke saath
  const saveCurrentStep = async () => {
    const currentDocument = documents[currentStep]
    const travellerIndex = currentTraveller
    const currentUploads = currentTravellerData.uploadedFiles[currentDocument.id] || {}

    const hasAnyFile =
      !!currentUploads.front ||
      !!currentUploads.back ||
      !!currentUploads.frontPreview ||
      !!currentUploads.backPreview

    const isPassportDocument = (() => {
      const n = currentDocument.name.trim().toLowerCase()
      return n === "passport" || n === "valid passport"
    })()
    const isPassportFrontSide = isPassportDocument && currentSide === "front"

    if (!hasAnyFile && !currentTravellerData.ocrData) {
      return
    }

    setIsSavingStep(true) // 👈 loader on

    try {
      const formData = new FormData()

      const userString = localStorage.getItem("user")
      let userEmail = "abc@gmail.com"
      let userPhone = "7070357583"

      if (userString) {
        try {
          const user = JSON.parse(userString)
          userEmail = user.email || userEmail
          userPhone = user.phoneNumber || userPhone
        } catch (e) {}
      }

      formData.append("visaId", visaId)
      formData.append("travellers", travellersCount.toString())
      formData.append("email", userEmail)
      formData.append("phone", userPhone)
      formData.append("country", country)
      formData.append("paymentId", paymentId)
      formData.append("paymentOrderId", paymentId)

      if (processingMode) {
        formData.append("processingMode", processingMode)
      }
      if (employeeId) {
        formData.append("employeeId", employeeId)
      }

      if (currentUploads.front instanceof File) {
        formData.append(`documents[${travellerIndex}][${currentDocument.id}][front]`, currentUploads.front)
      }
      if (currentUploads.back instanceof File) {
        formData.append(`documents[${travellerIndex}][${currentDocument.id}][back]`, currentUploads.back)
      }

      if (isPassportFrontSide && currentTravellerData.ocrData?.data && currentTravellerData.passportDataSaved) {
        const d = currentTravellerData.ocrData.data

        const passportDataArray = [
          {
            travellerIndex,
            passport_number: d.passport_number || "",
            surname: d.surname || "",
            given_names: d.given_names || "",
            nationality: d.nationality || "",
            date_of_birth: d.date_of_birth || "",
            place_of_birth: d.place_of_birth || "",
            sex: d.sex || "",
            date_of_issue: d.date_of_issue || "",
            date_of_expiry: d.date_of_expiry || "",
            place_of_issue: d.place_of_issue || "",
            file_number: d.file_number || "",
            father_name: d.father_name || "",
            mother_name: d.mother_name || "",
            spouse_name: d.spouse_name || "",
            address: d.address || "",
          },
        ]

        formData.append("passportData", JSON.stringify(passportDataArray))
      }

      const token = localStorage.getItem("token")

      const response = await fetch("http://localhost:5000/api/VisaApplication/apply-visa", {
        method: "POST",
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Server responded with status: ${response.status}`)
      }

      await response.json()
    } finally {
      setIsSavingStep(false) // 👈 loader off
    }
  }

  const handleNext = async () => {
    if (isSavingStep) return // double click se bachao

    try {
      await saveCurrentStep()
    } catch (error) {
      console.error("Step save failed:", error)
      setSubmitError(error instanceof Error ? error.message : "Failed to save current step")
      return
    }

    const currentDoc = documents[currentStep]
    if (currentDoc.requiresBothSides && currentSide === "front") {
      setCurrentSide("back")
      return
    }

    if (currentStep < documents.length - 1) {
      setCurrentStep(currentStep + 1)
      setCurrentSide("front")
    } else {
      if (currentTraveller < travellersCount - 1) {
        setCurrentTraveller(currentTraveller + 1)
        setCurrentStep(0)
        setCurrentSide("front")
      } else {
        setShowReview(true)
      }
    }
  }

  const handlePrevious = () => {
    if (isSavingStep) return // save ke time pe previous mat allow karo

    const currentDoc = documents[currentStep]
    if (currentDoc.requiresBothSides && currentSide === "back") {
      setCurrentSide("front")
      return
    }

    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setCurrentSide(documents[currentStep - 1].requiresBothSides ? "back" : "front")
    } else if (currentTraveller > 0) {
      setCurrentTraveller(currentTraveller - 1)
      setCurrentStep(documents.length - 1)
      setCurrentSide(documents[documents.length - 1].requiresBothSides ? "back" : "front")
    }
  }

  // FINAL SUBMIT – light
 const handleSubmitApplication = async () => {
  setIsSubmitting(true)
  setSubmitError(null)

  try {
    const formData = new FormData()
    const userString = localStorage.getItem("user")
    let userEmail = "abc@gmail.com"
    let userPhone = "7070357583"

    // 🔹 localStorage parse error bhi log karo
    if (userString) {
      try {
        const user = JSON.parse(userString)
        userEmail = user.email || userEmail
        userPhone = user.phoneNumber || userPhone
      } catch (e) {
        console.error("Failed to parse user from localStorage:", e)
      }
    }

    formData.append("visaId", visaId)
    formData.append("travellers", travellersCount.toString())
    formData.append("email", userEmail)
    formData.append("phone", userPhone)
    formData.append("country", country)
    formData.append("paymentId", paymentId)
    formData.append("paymentOrderId", paymentId)

    if (processingMode) {
      formData.append("processingMode", processingMode)
    }
    if (employeeId) {
      formData.append("employeeId", employeeId)
    }

    // ✅ yahi se final submit flag bhej rahe hain
    formData.append("isFinalSubmit", "true")

    const token = localStorage.getItem("token")

    const response = await fetch("http://localhost:5000/api/VisaApplication/apply-visa", {
      method: "POST",
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
      body: formData,
    })

    // 🔹 response body try–catch ke bina ignore nahi karenge
    const data = await response.json().catch((e) => {
      console.error("Failed to parse final submit response JSON:", e)
      return null
    })

    if (!response.ok) {
      console.error("Final submit API error:", data)

      const msg =
        (data && (data.message || data.error || data.details)) ||
        `Server responded with status: ${response.status}`

      throw new Error(msg)
    }

    console.log("Final submit success:", data)
    setSubmitSuccess(true)
  } catch (error) {
    console.error("Final submit failed:", error)
    setSubmitError(error instanceof Error ? error.message : "An unexpected error occurred")
  } finally {
    setIsSubmitting(false)
  }
}


  // ====== UI STATES ======

  if (showProcessingModal && !processingMode) {
    return <ProcessingModeModal isOpen={showProcessingModal} onClose={handleProcessingModeSelect} />
  }

  if (isLoading || isInitializingProgress) {
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

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="text-center p-10 bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-lg">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Successfully docs uploaded / submitted!</h2>
          <p className="text-gray-600 mb-2">
            Your visa application for{" "}
            <span className="font-semibold text-gray-900">
              {travellersCount} traveller{travellersCount > 1 ? "s" : ""}
            </span>{" "}
            has been submitted successfully.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Processing Mode:</span>{" "}
              {processingMode === "online" ? "Online" : "Offline"}
            </p>
            {employeeId && (
              <p className="text-sm text-blue-800 mt-1">
                <span className="font-semibold">Employee ID:</span> {employeeId}
              </p>
            )}
          </div>
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
                          data: data,
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

  // 🔴 IMPORTANT: preview se bhi uploaded maanenge (restore ke liye)
  const hasUploadedFile =
    !!currentUploads[currentSide] ||
    !!currentUploads.front ||
    !!currentUploads[`${currentSide}Preview`] ||
    !!currentUploads.frontPreview

  const isPassportDocument = (() => {
    const n = currentDocument.name.trim().toLowerCase()
    return n === "passport" || n === "valid passport"
  })()
  const isPassportFrontSide = isPassportDocument && currentSide === "front"
  const hasPassportData = currentTravellerData.ocrData !== null
  const isPassportDataSaved = currentTravellerData.passportDataSaved

  const canProceedNext = hasUploadedFile && (!isPassportFrontSide || !hasPassportData || isPassportDataSaved)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Document Upload</h1>
              <p className="text-gray-600 mt-1">
                Traveller {currentTraveller + 1} of {travellersCount} • {currentDocument.name}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    processingMode === "online" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                  }`}
                >
                  {processingMode === "online" ? "Online Processing" : "Offline Processing"}
                </span>
                {employeeId && <span className="text-xs text-gray-500">Employee: {employeeId}</span>}
              </div>
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
          passportDataSaved={currentTravellerData.passportDataSaved}
        />

        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <button
              onClick={handlePrevious}
              disabled={isSavingStep || (currentStep === 0 && currentSide === "front" && currentTraveller === 0)}
              className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              ← Previous
            </button>

            <div className="flex flex-col items-end">
              <button
                onClick={handleNext}
                disabled={isSavingStep || !canProceedNext}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg flex items-center justify-center"
              >
                {isSavingStep ? (
                  <>
                    Saving...
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  </>
                ) : currentTraveller === travellersCount - 1 && currentStep === documents.length - 1 ? (
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

              {!canProceedNext && !isSavingStep && (
                <p className="text-xs text-red-600 mt-2 text-right">
                  {!hasUploadedFile
                    ? "Please upload the document first"
                    : isPassportFrontSide && hasPassportData && !isPassportDataSaved
                    ? "Please save passport details before proceeding"
                    : ""}
                </p>
              )}

              {submitError && (
                <p className="text-xs text-red-500 mt-1 text-right">
                  {submitError}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
