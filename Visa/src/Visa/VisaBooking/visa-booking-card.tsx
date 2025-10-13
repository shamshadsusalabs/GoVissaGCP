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
  // Adult pricing (12+ years)
  visaFee: number
  serviceFee: number
  // Children pricing (6-12 years)
  childVisaFee: number
  childServiceFee: number
  // Young children pricing (0-6 years)
  youngChildVisaFee: number
  youngChildServiceFee: number
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
  const [travellers, setTravellers] = useState(0)
  const [showCalendar, setShowCalendar] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState<string | false>(false) // ✅ Changed to store payment method type

  useEffect(() => {
    const fetchVisaData = async () => {
      try {
        if (!id) {
          throw new Error("Configuration ID not found")
        }
        const response = await fetch(
          `http://localhost:5000/api/configurations/details/${id}`,
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
    setTravellers((prev) => Math.max(0, prev + delta))
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
    // ✅ Different messages based on payment method
    const isOnlinePayment = paymentSuccess === "online"
    const isOfflinePayment = ["offline", "cash", "paylater"].includes(paymentSuccess as string)
    
    return (
      <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl text-center my-12 border border-green-200">
        <div className="text-green-500 text-7xl mb-6 animate-bounce">✓</div>
        
        {/* ✅ Different titles based on payment method */}
        <h2 className="text-3xl font-extrabold mb-4 text-gray-800">
          {isOnlinePayment ? "Payment Successful!" : "Request Successfully Sent!"}
        </h2>
        
        {/* ✅ Different descriptions based on payment method */}
        <p className="mb-8 text-gray-600 leading-relaxed">
          {isOnlinePayment 
            ? "Your visa application is being processed. Please check your email for further instructions."
            : "Your visa application request has been submitted. Our team will contact you shortly for payment processing."
          }
        </p>
        
        {/* ✅ Show next steps only for online payments */}
        {isOnlinePayment && (
          <div className="bg-blue-50 p-6 rounded-xl mb-8 text-left border border-blue-200">
            <h3 className="font-bold mb-3 text-blue-800 text-lg">Next Steps:</h3>
            <ol className="list-decimal list-inside space-y-3 text-sm text-blue-700">
              <li>Session will start. Upload required documents within 48 hours.</li>
              <li>{"We'll notify you about your visa status."}</li>
            </ol>
          </div>
        )}
        
        {/* ✅ Show different messages for offline payments */}
        {isOfflinePayment && (
          <div className="bg-orange-50 p-6 rounded-xl mb-8 text-left border border-orange-200">
            <h3 className="font-bold mb-3 text-orange-800 text-lg">What's Next:</h3>
            <ol className="list-decimal list-inside space-y-3 text-sm text-orange-700">
              <li>Our team will contact you within 24 hours for payment processing.</li>
              <li>After payment confirmation, you'll receive document upload instructions.</li>
              <li>{"We'll keep you updated via email and phone."}</li>
            </ol>
            
            {/* ✅ NEW: Contact Section for Next Process */}
            <div className="mt-4 p-4 bg-white rounded-lg border border-orange-300">
              <h4 className="font-bold text-orange-800 mb-2">📞 For Next Process Contact:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-orange-600">📧</span>
                  <span className="font-medium">Email:</span>
                  <a href="mailto:contact@traveli.asia" className="text-blue-600 hover:underline">
                    contact@traveli.asia
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-orange-600">📱</span>
                  <span className="font-medium">Phone:</span>
                  <a href="tel:+919289280509" className="text-blue-600 hover:underline">
                    +91 9289280509
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* ✅ Show upload button only for online payments */}
        {isOnlinePayment && (
          <button
            onClick={() => navigate(`/user-dashboard/ApplyVisa`)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
          >
            Upload Documents Now
          </button>
        )}
        
        {/* ✅ Show different button for offline payments */}
        {isOfflinePayment && (
          <button
            onClick={() => navigate(`/`)}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
          >
            Back to Home
          </button>
        )}
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