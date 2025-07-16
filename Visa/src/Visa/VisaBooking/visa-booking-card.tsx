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
  currency: "INR"
  validity: string
  entries: string
  stayDuration: string
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

        const response = await fetch(`http://localhost:5000/api/configurations/details/${id}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch visa data: ${response.statusText}`)
        }

        const result = await response.json()
        if (
          !result ||
          !result.visaTypes ||
          !Array.isArray(result.visaTypes) ||
          result.visaTypes.length === 0 ||
          !result.visaTypes[0] ||
          !result.visaTypes[0].visaFee
        ) {
          throw new Error("Invalid visa configuration: missing required visa data")
        }

        const transformedData = {
          ...result,
          country: result.countryDetails?.name || "N/A",
          countryCode: result.countryDetails?.code || "N/A",
          embassyLocation: result.countryDetails?.embassyLocation || "N/A",
          visaTypes: result.visaTypes.map((visaType: any) => ({
            ...visaType,
            currency: "INR" as const,
          })),
        }

        setVisaData(transformedData)
        const defaultDate = new Date()
        defaultDate.setDate(defaultDate.getDate() + 14)
        setSelectedDate(formatDate(defaultDate))
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
      setError("Please select a future date")
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
    return <div className="text-center py-8">Loading visa information...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>
  }

  if (!visaData || !visaData.visaTypes || visaData.visaTypes.length === 0 || !visaData.visaTypes[0]) {
    return <div className="text-center py-8">No visa data available</div>
  }

  if (paymentSuccess) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h2 className="text-2xl font-bold mb-4">Payment Successful!</h2>
        <p className="mb-6">
          Your visa application is being processed. Please check your email for further instructions.
        </p>
        <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
          <h3 className="font-semibold mb-2">Next Steps:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Session be start Upload required documents within 48 hours</li>
            <li>{"We'll notify you about your visa status"}</li>
          </ol>
        </div>
        <button
          onClick={() => navigate(`/user-dashboard/ApplyVisa`)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg"
        >
          Upload Documents Now
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto p-4 grid md:grid-cols-2 gap-8">
      <VisaDetailsCard
        visaData={visaData}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        setShowCalendar={setShowCalendar}
      />

      <BookingForm
        visaData={visaData}
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
        />
      )}
    </div>
  )
}

export default VisaBookingCard
