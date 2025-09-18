"use client"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import VisaDetailsCard from "./visa-details-card"
import BookingForm from "./booking-form"
import CalendarModal from "./calendar-modal"

interface VisaType {
  name: string
  code: string
  category: string
  biometricRequired: boolean
  interviewRequired: boolean
  notes: string
  processingTime: string
  processingMethod: string
  visaFee: number
  serviceFee: number
  currency: "INR" | "USD"
  validity: string
  entries: string
  stayDuration: string
  expectedVisaDays?: number
}

interface VisaConfiguration {
  _id: string
  country: string
  countryCode: string
  embassyLocation: string
  visaTypes: VisaType[]
}

const VisaBookingCard = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [visaData, setVisaData] = useState<VisaConfiguration | null>(null)
  const [selectedVisaType, setSelectedVisaType] = useState<VisaType | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [travellers, setTravellers] = useState(1)
  const [showCalendar, setShowCalendar] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  useEffect(() => {
    const fetchVisaData = async () => {
      try {
        if (!id) {
          throw new Error("Configuration ID not found")
        }
        const response = await fetch(
          `https://govisaa-872569311567.asia-south2.run.app/api/configurations/details/${id}`,
        )
        if (!response.ok) {
          throw new Error(`Failed to fetch visa data: ${response.statusText}`)
        }
        const result = await response.json()
        if (
          !result ||
          !result.data ||
          !result.data.visaTypes ||
          !Array.isArray(result.data.visaTypes) ||
          result.data.visaTypes.length === 0
        ) {
          throw new Error("No visa types found for this configuration.")
        }

        const transformedData = {
          ...result.data,
          country: result.data.countryDetails?.name || "N/A",
          countryCode: result.data.countryDetails?.code || "N/A",
          embassyLocation: result.data.countryDetails?.embassyLocation || "N/A",
          visaTypes: result.data.visaTypes.map((visaType: any) => ({
            ...visaType,
            currency: visaType.currency || "INR",
          })),
        }

        setVisaData(transformedData)
        setSelectedVisaType(transformedData.visaTypes[0])

        // Set default date to today instead of future date
        // Remove this line:
        // const defaultDate = new Date()
        // setSelectedDate(formatDate(defaultDate))

        // Replace with:
        setSelectedDate("")
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchVisaData()
  }, [id])

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
    return date.toLocaleDateString("en-US", options)
  }

  const handleSelectDate = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (date < today) {
      setError("Please select today's date or a future date")
      return
    }
    setSelectedDate(formatDate(date))
    setShowCalendar(false)
    setError(null)
  }

  const handleTravellerChange = (delta: number) => {
    setTravellers((prev) => Math.max(1, prev + delta))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-600 text-xl font-semibold">
        Loading visa information...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-red-600 text-xl font-semibold">
        Error: {error}
      </div>
    )
  }

  if (!visaData || !selectedVisaType) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-600 text-xl font-semibold">
        No visa data available or selected.
      </div>
    )
  }

  if (paymentSuccess) {
    return (
      <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl text-center my-12 border border-green-200">
        <div className="text-green-500 text-7xl mb-6 animate-bounce">✓</div>
        <h2 className="text-3xl font-extrabold mb-4 text-gray-800">Payment Successful!</h2>
        <p className="mb-8 text-gray-600 leading-relaxed">
          Your visa application is being processed. Please check your email for further instructions.
        </p>
        <div className="bg-blue-50 p-6 rounded-xl mb-8 text-left border border-blue-200">
          <h3 className="font-bold mb-3 text-blue-800 text-lg">Next Steps:</h3>
          <ol className="list-decimal list-inside space-y-3 text-sm text-blue-700">
            <li>Session will start. Upload required documents within 48 hours.</li>
            <li>{"We'll notify you about your visa status."}</li>
          </ol>
        </div>
        <button
          onClick={() => navigate(`/user-dashboard/ApplyVisa`)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
        >
          Upload Documents Now
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto p-2 sm:p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-7xl my-4 sm:my-8">
      <VisaDetailsCard
        visaData={visaData}
        selectedVisaType={selectedVisaType}
        setSelectedVisaType={setSelectedVisaType}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        setShowCalendar={setShowCalendar}
      />
      <BookingForm
        visaData={visaData}
        selectedVisaType={selectedVisaType}
        selectedDate={selectedDate}
        travellers={travellers}
        handleTravellerChange={handleTravellerChange}
        setPaymentSuccess={setPaymentSuccess}
        navigate={navigate}
      />
      {showCalendar && (
        <CalendarModal
          selectedDate={selectedDate}
          onSelectDate={handleSelectDate}
          onClose={() => setShowCalendar(false)}
          error={error}
          processingTime={selectedVisaType.processingTime}
        />
      )}
    </div>
  )
}

export default VisaBookingCard;