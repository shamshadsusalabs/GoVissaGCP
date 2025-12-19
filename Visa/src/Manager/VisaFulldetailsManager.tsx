"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  FileText,
  User,
  Calendar,
  Phone,
  Mail,
  CreditCard,
  Download,
  Eye,
  Users,
  MapPin,
} from "lucide-react"

interface Document {
  url: string
  fileName: string
}

interface DocumentGroup {
  front?: Document
  back?: Document
}

interface PassportData {
  travellerIndex: number
  passport_number: string
  surname: string
  given_names: string
  nationality: string
  date_of_birth: string
  place_of_birth: string
  sex: string
  date_of_issue: string
  date_of_expiry: string
  place_of_issue: string
  file_number: string
  father_name?: string
  mother_name?: string
  spouse_name?: string
  address?: string
  _id?: string
}

interface StatusEntry {
  label: string
  date: string
  _id?: string
}

interface VisaApplication {
  _id: string
  visaId: string
  paymentId: string
  paymentOrderId: string // ✅ Added for payment order reference
  travellers: string
  email: string
  phone: string
  country: string
  documents: { [key: string]: DocumentGroup }
  passportData: PassportData[]
  statusHistory?: StatusEntry[]
  createdAt: string
  updatedAt: string
  __v: number
  // ✅ Promo code fields
  promoCode?: string
  promoCodeId?: string
  discountAmount?: number
  originalAmount?: string
}

export default function VisaFullDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [application, setApplication] = useState<VisaApplication | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"details" | "documents" | "status">("details")
  const [activeTraveller, setActiveTraveller] = useState(0)
  const [paymentOrder, setPaymentOrder] = useState<any>(null) // ✅ Store payment order details

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await fetch(`https://govisaa-872569311567.asia-south2.run.app/api/VisaApplication/getById/${id}`)
        const data = await response.json()
        setApplication(data)
        
        // ✅ Fetch payment order details if paymentOrderId exists
        if (data.paymentOrderId) {
          try {
            const paymentResponse = await fetch("https://govisaa-872569311567.asia-south2.run.app/api/payments/getAll")
            const paymentData = await paymentResponse.json()
            if (paymentData.success && paymentData.data) {
              const foundPaymentOrder = paymentData.data.find((order: any) => order._id === data.paymentOrderId)
              if (foundPaymentOrder) {
                setPaymentOrder(foundPaymentOrder)
              }
            }
          } catch (paymentErr) {
            console.error("Failed to fetch payment order details:", paymentErr)
          }
        }
        
        setLoading(false)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Failed to fetch visa application details")
        setLoading(false)
      }
    }

    if (id) {
      fetchApplication()
    }
  }, [id])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getDocumentsByTraveller = (travellerIndex: number) => {
    if (!application) return {}

    const travellerDocs: { [key: string]: DocumentGroup } = {}

    Object.keys(application.documents).forEach((key) => {
      // Check if the key starts with the traveller index (new format: "0_timestamp")
      if (key.startsWith(`${travellerIndex}_`)) {
        travellerDocs[key] = application.documents[key]
      }
    })

    return travellerDocs
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const getLastStatus = () => {
    if (!application?.statusHistory || application.statusHistory.length === 0) {
      return "Pending"
    }
    return application.statusHistory[application.statusHistory.length - 1].label
  }

  const goBack = () => {
    navigate(-1)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading visa application details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center text-red-500 p-8">
          <FileText className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <p className="text-xl font-semibold mb-2">Error Loading Data</p>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-xl font-semibold mb-2">No Application Found</p>
          <p className="text-gray-600">The requested visa application could not be found.</p>
        </div>
      </div>
    )
  }

  const travellerCount = Number.parseInt(application.travellers)
  const currentTravellerDocs = getDocumentsByTraveller(activeTraveller)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <button
              onClick={goBack}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Applications
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Visa Application Details</h1>
            <p className="text-gray-600 mt-1">
              Application ID: <span className="font-mono text-gray-800">{application._id}</span>
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <div className="flex flex-col items-end">
              <span
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                  getLastStatus(),
                )}`}
              >
                Status: {getLastStatus()}
              </span>
              <span className="text-sm text-gray-500 mt-2">Last updated: {formatDate(application.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 border border-gray-200">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab("details")}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                  activeTab === "details"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Basic Details
              </button>
              <button
                onClick={() => setActiveTab("documents")}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                  activeTab === "documents"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Documents
              </button>
              {application.statusHistory && application.statusHistory.length > 0 && (
                <button
                  onClick={() => setActiveTab("status")}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                    activeTab === "status"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Status History
                </button>
              )}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Basic Details Tab */}
            {activeTab === "details" && (
              <div className="space-y-8">
                {/* Application Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    Application Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <InfoItem
                      icon={<FileText className="w-4 h-4 text-gray-500" />}
                      label="Visa ID"
                      value={application.visaId}
                    />
                    <InfoItem
                      icon={<CreditCard className="w-4 h-4 text-gray-500" />}
                      label="Payment ID"
                      value={application.paymentId}
                    />
                    <InfoItem
                      icon={<Users className="w-4 h-4 text-gray-500" />}
                      label="Travellers"
                      value={`${application.travellers}${paymentOrder?.travellerDetails ? ` (${paymentOrder.travellerDetails.adults}A, ${paymentOrder.travellerDetails.children}C, ${paymentOrder.travellerDetails.infants}I)` : ''}`}
                    />
                    <InfoItem
                      icon={<MapPin className="w-4 h-4 text-gray-500" />}
                      label="Country"
                      value={application.country}
                    />
                    <InfoItem
                      icon={<Mail className="w-4 h-4 text-gray-500" />}
                      label="Email"
                      value={application.email}
                    />
                    <InfoItem
                      icon={<Phone className="w-4 h-4 text-gray-500" />}
                      label="Phone"
                      value={application.phone}
                    />
                    <InfoItem
                      icon={<Calendar className="w-4 h-4 text-gray-500" />}
                      label="Application Date"
                      value={formatDate(application.createdAt)}
                    />
                  </div>
                </div>

                {/* Promo Code Information */}
                {(application.promoCode || paymentOrder?.promoCode) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                      Promo Code Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                      <InfoItem
                        label="Promo Code"
                        value={application.promoCode || paymentOrder?.promoCode || "N/A"}
                      />
                      <InfoItem
                        label="Original Amount"
                        value={`₹${application.originalAmount || paymentOrder?.originalAmount || "0"}`}
                      />
                      <InfoItem
                        label="Discount Amount"
                        value={`−₹${application.discountAmount || paymentOrder?.discountAmount || "0"}`}
                      />
                      <InfoItem
                        label="Final Amount"
                        value={`₹${paymentOrder?.amount || "0"}`}
                      />
                    </div>
                  </div>
                )}

                {/* Traveller Selection */}
                {travellerCount > 1 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-blue-600" />
                      Traveller Information
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {Array.from({ length: travellerCount }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveTraveller(index)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                            activeTraveller === index
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Traveller {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Passport Information */}
                {application.passportData && application.passportData.length > activeTraveller && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-blue-600" />
                      Passport Information {travellerCount > 1 ? `- Traveller ${activeTraveller + 1}` : ""}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
                      <InfoItem
                        label="Passport Number"
                        value={application.passportData[activeTraveller].passport_number}
                      />
                      <InfoItem label="Surname" value={application.passportData[activeTraveller].surname} />
                      <InfoItem label="Given Names" value={application.passportData[activeTraveller].given_names} />
                      <InfoItem label="Nationality" value={application.passportData[activeTraveller].nationality} />
                      <InfoItem label="Date of Birth" value={application.passportData[activeTraveller].date_of_birth} />
                      <InfoItem
                        label="Place of Birth"
                        value={application.passportData[activeTraveller].place_of_birth}
                      />
                      <InfoItem label="Gender" value={application.passportData[activeTraveller].sex} />
                      <InfoItem label="Date of Issue" value={application.passportData[activeTraveller].date_of_issue} />
                      <InfoItem
                        label="Date of Expiry"
                        value={application.passportData[activeTraveller].date_of_expiry}
                      />
                      <InfoItem
                        label="Place of Issue"
                        value={application.passportData[activeTraveller].place_of_issue}
                      />
                      {application.passportData[activeTraveller].file_number && (
                        <InfoItem label="File Number" value={application.passportData[activeTraveller].file_number} />
                      )}
                      {application.passportData[activeTraveller].father_name && (
                        <InfoItem label="Father's Name" value={application.passportData[activeTraveller].father_name} />
                      )}
                      {application.passportData[activeTraveller].mother_name && (
                        <InfoItem label="Mother's Name" value={application.passportData[activeTraveller].mother_name} />
                      )}
                      {application.passportData[activeTraveller].spouse_name && (
                        <InfoItem label="Spouse's Name" value={application.passportData[activeTraveller].spouse_name} />
                      )}
                      {application.passportData[activeTraveller].address && (
                        <InfoItem label="Address" value={application.passportData[activeTraveller].address} />
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === "documents" && (
              <div>
                {/* Traveller Selection for Documents */}
                {travellerCount > 1 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Traveller</h3>
                    <div className="flex flex-wrap gap-2">
                      {Array.from({ length: travellerCount }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveTraveller(index)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                            activeTraveller === index
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          Traveller {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Documents {travellerCount > 1 ? `- Traveller ${activeTraveller + 1}` : ""}
                </h3>

                {Object.keys(currentTravellerDocs).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(currentTravellerDocs).map(([docId, docGroup]) => (
                      <div key={docId} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                          <h4 className="font-medium text-gray-900">Document ID: {docId}</h4>
                        </div>
                        <div className="p-4 space-y-4">
                          {docGroup.front && (
                            <DocumentCard url={docGroup.front.url} fileName={docGroup.front.fileName} side="Front" />
                          )}
                          {docGroup.back && (
                            <DocumentCard url={docGroup.back.url} fileName={docGroup.back.fileName} side="Back" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                    <FileText className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600">No documents found for this traveller</p>
                  </div>
                )}
              </div>
            )}

            {/* Status History Tab */}
            {activeTab === "status" && application.statusHistory && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Status History
                </h3>

                {application.statusHistory.length > 0 ? (
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                    <div className="space-y-6 ml-9">
                      {application.statusHistory.map((status, index) => (
                        <div key={index} className="relative">
                          {/* Timeline dot */}
                          <div className="absolute -left-9 mt-1.5">
                            <div
                              className={`w-4 h-4 rounded-full border-2 border-white ${
                                index === application.statusHistory!.length - 1 ? "bg-green-500" : "bg-blue-500"
                              }`}
                            ></div>
                          </div>

                          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border mb-2 sm:mb-0 ${getStatusColor(
                                  status.label,
                                )}`}
                              >
                                {status.label}
                              </span>
                              <span className="text-sm text-gray-500">{formatDate(status.date)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                    <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600">No status history available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const InfoItem = ({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) => (
  <div className="flex items-start">
    {icon && <div className="mt-0.5 mr-3">{icon}</div>}
    <div>
      <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value || "-"}</p>
    </div>
  </div>
)

const DocumentCard = ({ url, fileName, side }: { url: string; fileName: string; side: string }) => {
  const fileExtension = fileName.split(".").pop()?.toLowerCase()
  const isPdf = fileExtension === "pdf"

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="flex justify-between items-start mb-3">
        <p className="text-xs font-medium text-gray-500">{side}</p>
        <span
          className={`text-xs px-2 py-0.5 rounded ${isPdf ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}
        >
          {fileExtension?.toUpperCase() || "FILE"}
        </span>
      </div>
      <p className="text-sm font-medium text-gray-900 mb-3 truncate" title={fileName}>
        {fileName}
      </p>
      <div className="flex space-x-2">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 flex-1"
        >
          <Eye className="w-4 h-4 mr-2" />
          View
        </a>
        <a
          href={url}
          download={fileName}
          className="flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 flex-1"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </a>
      </div>
    </div>
  )
}
