"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

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
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
  })
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")
  const [otpVerified, setOtpVerified] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpError, setOtpError] = useState("")

  const [promoCodes, setPromoCodes] = useState<any[]>([])
  const [selectedPromoCode, setSelectedPromoCode] = useState<string>("")
  const [appliedPromoCode, setAppliedPromoCode] = useState<any>(null)
  const [promoCodeError, setPromoCodeError] = useState("")
  const [promoCodeLoading, setPromoCodeLoading] = useState(false)
  const [discountAmount, setDiscountAmount] = useState(0)

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

  useEffect(() => {
    fetchPromoCodes()
  }, [])

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
    return date.toLocaleDateString("en-US", options)
  }

  const getDaysDifference = (date: string): string => {
    const dateParts = date.split(" ")
    const month = new Date(Date.parse(dateParts[1] + " 1, 2012")).getMonth() + 1
    const day = Number.parseInt(dateParts[0])
    const year = Number.parseInt(dateParts[2])

    const selectedDate = new Date(year, month - 1, day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const diffTime = selectedDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return `in ${diffDays} day${diffDays !== 1 ? "s" : ""}`
  }

  const handleSendOtp = async () => {
    if (!contactInfo.phone) {
      setOtpError("Please enter phone number")
      return
    }

    setOtpLoading(true)
    setOtpError("")

    try {
      const response = await fetch("http://localhost:5000/api/User/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: contactInfo.phone,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setOtpSent(true)
        setOtpError("")
      } else {
        setOtpError(data.message || "Failed to send OTP")
      }
    } catch (err) {
      setOtpError("Failed to send OTP. Please try again.")
    } finally {
      setOtpLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setOtpError("Please enter 6-digit OTP")
      return
    }

    setOtpLoading(true)
    setOtpError("")

    try {
      const response = await fetch("http://localhost:5000/api/User/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: contactInfo.phone,
          otp: otp,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setOtpVerified(true)
        setOtpError("")

        // Store user data and tokens in localStorage
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user))
        }
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken)
        }
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken)
        }

        console.log("User logged in successfully:", data.message)
      } else {
        setOtpError(data.message || "Invalid OTP")
      }
    } catch (err) {
      setOtpError("Failed to verify OTP. Please try again.")
    } finally {
      setOtpLoading(false)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setContactInfo((prev) => ({
      ...prev,
      phone: value,
    }))

    // Reset OTP states when phone number changes
    if (otpSent || otpVerified) {
      setOtpSent(false)
      setOtpVerified(false)
      setOtp("")
      setOtpError("")
    }
  }

  const fetchPromoCodes = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/promocode/getAll")
      if (response.ok) {
        const data = await response.json()
        setPromoCodes(data)
      }
    } catch (err) {
      console.error("Failed to fetch promo codes:", err)
    }
  }

  const handleApplyPromoCode = async () => {
    if (!selectedPromoCode) {
      setPromoCodeError("Please select a promo code")
      return
    }

    setPromoCodeLoading(true)
    setPromoCodeError("")

    try {
      const promoCode = promoCodes.find((code) => code.code === selectedPromoCode)

      if (!promoCode) {
        setPromoCodeError("Invalid promo code")
        return
      }

      if (!promoCode.isActive) {
        setPromoCodeError("This promo code is not active")
        return
      }

      const currentDate = new Date()
      const validFrom = new Date(promoCode.validFrom)
      const validUntil = new Date(promoCode.validUntil)

      if (currentDate < validFrom || currentDate > validUntil) {
        setPromoCodeError("This promo code has expired")
        return
      }

      if (promoCode.usedCount >= promoCode.maxUsage) {
        setPromoCodeError("This promo code has reached its usage limit")
        return
      }

      // Calculate discount
      const totalAmount = governmentFee * travellers + serviceFee
      let discount = 0

      if (promoCode.discountType === "percentage") {
        discount = (totalAmount * promoCode.discountValue) / 100
      } else if (promoCode.discountType === "fixed") {
        discount = promoCode.discountValue
      }

      // Ensure discount doesn't exceed total amount
      discount = Math.min(discount, totalAmount)

      setAppliedPromoCode(promoCode)
      setDiscountAmount(discount)
      setPromoCodeError("")
    } catch (err) {
      setPromoCodeError("Failed to apply promo code")
    } finally {
      setPromoCodeLoading(false)
    }
  }

  const handleRemovePromoCode = () => {
    setAppliedPromoCode(null)
    setDiscountAmount(0)
    setSelectedPromoCode("")
    setPromoCodeError("")
  }

  const handlePayment = async () => {
    if (!visaData || !visaData.visaTypes[0]) return

    try {
      const visaType = visaData.visaTypes[0]
      const originalAmount = visaType.visaFee * travellers + visaType.serviceFee
      const finalAmount = originalAmount - discountAmount
      const amount = Math.round(finalAmount * 100)

      const response = await fetch("http://localhost:5000/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          currency: "INR",
          visaId: visaData._id,
            country: visaData.country,

          

          email: contactInfo.email,
          phone: contactInfo.phone,
          selectedDate,
          travellers,
          promoCode: appliedPromoCode?.code || null,
          discountAmount: discountAmount,
          payment_methods: {
            upi: true,
            card: true,
            netbanking: true,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create payment order")
      }

      const data = await response.json()

      const options = {
        key: "rzp_test_ERx3UhM6jrYt2V",
        amount: data.amount,
        currency: "INR",
        name: "Govissa Visa Services",
        description: "Visa Application Fee",
        order_id: data.id,
        handler: async (response: any) => {
          try {
            const verifyResponse = await fetch("http://localhost:5000/api/payments/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                selectedDate,
                travellers,
                visaId: visaData._id,
                email: contactInfo.email,
                phone: contactInfo.phone,
              }),
            })

            const verifyData = await verifyResponse.json()

            if (verifyData.success) {
              setPaymentSuccess(true)
            } else {
              setError("Payment verification failed. Please contact support.")
            }
          } catch (err) {
            console.error("Payment verification error:", err)
            setError("Payment verification failed. Please try again.")
          }
        },
        prefill: {
          name: "Customer Name",
          email: contactInfo.email,
          contact: contactInfo.phone,
        },
        notes: {
          address: "Govissa Head Office",
          visaId: visaData._id,
          selectedDate,
          travellers: travellers.toString(),
        },
        theme: {
          color: "#3399cc",
        },
        method: {
          netbanking: true,
          upi: true,
          card: true,
          wallet: true,
        },
        upi: {
          flow: "collect",
        },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()

      rzp.on("payment.failed", (response: any) => {
        console.error("Payment failed:", response.error)
        setError(`Payment failed: ${response.error.description || "Unknown error"}`)
      })
    } catch (err) {
      console.error("Payment error:", err)
      setError("Payment failed. Please try again.")
    }
  }

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setContactInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
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

  const renderCalendar = () => {
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

    const weeks: (Date | null)[][] = []
    let currentWeek: (Date | null)[] = Array(firstDayOfMonth).fill(null)

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day)
      currentWeek.push(date)

      if (currentWeek.length === 7 || day === daysInMonth) {
        weeks.push(currentWeek)
        currentWeek = []
      }
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-xl font-bold mb-4">Select Appointment Date</h3>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-4">
              <button className="p-2 rounded hover:bg-gray-100">&lt;</button>
              <span className="font-medium">
                {new Date(currentYear, currentMonth, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
              <button className="p-2 rounded hover:bg-gray-100">&gt;</button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center font-medium text-sm text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {weeks.flatMap((week, weekIndex) =>
                week.map((date, dayIndex) =>
                  date ? (
                    <button
                      key={`${weekIndex}-${dayIndex}`}
                      onClick={() => handleSelectDate(date)}
                      className={`p-2 rounded-full text-center ${
                        date.toDateString() === new Date(selectedDate).toDateString()
                          ? "bg-blue-500 text-white"
                          : date < today
                            ? "text-gray-300 cursor-not-allowed"
                            : "hover:bg-blue-100"
                      }`}
                      disabled={date < today}
                    >
                      {date.getDate()}
                    </button>
                  ) : (
                    <div key={`${weekIndex}-${dayIndex}`} className="p-2"></div>
                  ),
                ),
              )}
            </div>
          </div>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowCalendar(false)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowCalendar(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    )
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

  const visaType = visaData.visaTypes[0]
  const visaDetails = visaType

  const visaDetailsCards = [
    { label: "Visa Type", value: visaType.name || "N/A", icon: "📱" },
    { label: "Length of Stay", value: visaDetails.stayDuration || "N/A", icon: "📅" },
    { label: "Validity", value: visaDetails.validity || "N/A", icon: "⏱️" },
    { label: "Entry", value: visaDetails.entries || "N/A", icon: "🚪" },
  ]

  const guaranteeOptions = [
    {
      date: formatDate(new Date(new Date().setDate(new Date().getDate() + 4))),
      in: getDaysDifference(formatDate(new Date(new Date().setDate(new Date().getDate() + 4)))),
    },
    {
      date: formatDate(new Date(new Date().setDate(new Date().getDate() + 7))),
      in: getDaysDifference(formatDate(new Date(new Date().setDate(new Date().getDate() + 7)))),
    },
  ]

  const governmentFee = visaDetails.visaFee || 0
  const serviceFee = visaDetails.serviceFee || 0
  const total = (governmentFee * travellers + serviceFee - discountAmount).toFixed(2)

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
          onClick={() =>
            navigate(
              `/user-dashboard/ApplyVisa`,
            )
          }
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg"
        >
          Upload Documents Now
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto p-4 grid md:grid-cols-2 gap-8">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{visaData.country || "N/A"} Visa Information</h2>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {visaDetailsCards.map((item, i) => (
            <div key={i} className="flex items-start space-x-3 bg-gray-50 rounded-lg p-3 border border-gray-100">
              <span className="text-2xl mt-1">{item.icon}</span>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">{item.label}</p>
                <p className="font-semibold text-gray-800">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Processing Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Processing Time</p>
              <p className="font-medium">{visaDetails.processingTime || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Processing Method</p>
              <p className="font-medium">{visaDetails.processingMethod || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Interview Required</p>
              <p className="font-medium">{visaDetails.interviewRequired ? "Yes" : "No"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Biometric Required</p>
              <p className="font-medium">{visaDetails.biometricRequired ? "Yes" : "No"}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
            Get a Guaranteed Visa on
          </h3>

          {guaranteeOptions.map((option, i) => (
            <div
              key={i}
              className={`border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center transition-all ${
                selectedDate === option.date
                  ? "border-blue-500 bg-blue-50 shadow-blue-100 shadow-sm"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
            >
              <div>
             
                <p className="text-md font-medium text-gray-800 mt-2">{option.date}</p>
                <button
                  onClick={() => setShowCalendar(true)}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center mt-1"
                >
                  <span className="mr-1">👁</span> View Timeline
                </button>
              </div>
              <button
                onClick={() => setSelectedDate(option.date)}
                className={`px-4 py-2 rounded-md text-sm font-medium mt-3 sm:mt-0 transition-colors ${
                  selectedDate === option.date
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {selectedDate === option.date ? "✓ Selected" : "Select"}
              </button>
            </div>
          ))}

          {showCalendar && renderCalendar()}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="bg-blue-600 text-white p-5">
          <p className="font-medium text-sm opacity-90">Visa guaranteed on</p>
          <h4 className="text-xl font-bold">{selectedDate}</h4>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl">👥</span>
              <span className="font-semibold text-gray-700">Travellers</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleTravellerChange(-1)}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                disabled={travellers <= 1}
              >
                −
              </button>
              <span className="font-medium w-6 text-center">{travellers}</span>
              <button
                onClick={() => handleTravellerChange(1)}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h5 className="font-medium text-gray-700">Contact Information</h5>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={contactInfo.email}
                  onChange={handleContactChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
                <div className="flex gap-2">
      <input
  type="tel"
  name="phone"
  value={contactInfo.phone}
  onChange={handlePhoneChange}
  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  placeholder="+91 9876543210"
  required
  disabled={otpVerified}
/>


                  {!otpSent && !otpVerified && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={!contactInfo.phone || otpLoading}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {otpLoading ? "Sending..." : "Send OTP"}
                    </button>
                  )}
                  {otpVerified && (
                    <div className="flex items-center px-3 py-2 bg-green-100 text-green-700 rounded-md">
                      <span className="text-sm">✓ Verified</span>
                    </div>
                  )}
                </div>

                {otpSent && !otpVerified && (
                  <div className="mt-3 space-y-2">
                    <label className="block text-sm text-gray-600">Enter 6-digit OTP</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center tracking-widest"
                        placeholder="000000"
                        maxLength={6}
                      />
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={otp.length !== 6 || otpLoading}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {otpLoading ? "Verifying..." : "Verify"}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpLoading}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Resend OTP
                    </button>
                  </div>
                )}

                {otpError && <div className="mt-2 text-red-500 text-sm">{otpError}</div>}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h5 className="font-medium text-gray-700">Promo Code</h5>
            {!appliedPromoCode ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Select Promo Code</label>
                  <select
                    value={selectedPromoCode}
                    onChange={(e) => setSelectedPromoCode(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Choose a promo code</option>
                    {promoCodes
                      .filter((code) => code.isActive)
                      .map((code) => (
                        <option key={code._id} value={code.code}>
                          {code.code} - {code.discountValue}
                          {code.discountType === "percentage" ? "%" : "₹"} OFF
                        </option>
                      ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleApplyPromoCode}
                  disabled={!selectedPromoCode || promoCodeLoading}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {promoCodeLoading ? "Applying..." : "Apply Promo Code"}
                </button>
                {promoCodeError && <div className="text-red-500 text-sm">{promoCodeError}</div>}
              </div>
            ) : (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-green-800">{appliedPromoCode.code}</p>
                    <p className="text-sm text-green-600">
                      {appliedPromoCode.discountValue}
                      {appliedPromoCode.discountType === "percentage" ? "%" : "₹"} discount applied
                    </p>
                    <p className="text-sm text-green-600">You saved ₹{discountAmount.toFixed(2)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePromoCode}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h5 className="font-medium text-gray-700">Price Details</h5>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Government fee</span>
              <span>
                ₹ {governmentFee.toLocaleString()} × {travellers}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Service Fees</span>
              <span className="text-green-600 font-medium">₹ {serviceFee.toFixed(2)}</span>
            </div>
            {appliedPromoCode && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount ({appliedPromoCode.code})</span>
                <span className="text-green-600 font-medium">-₹ {discountAmount.toFixed(2)}</span>
              </div>
            )}
            <p className="text-xs text-blue-600 mt-1">
              You pay ₹ {serviceFee.toFixed(2)} only when we deliver your visa on time
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <span className="text-blue-600 text-lg">🛡</span>
              </div>
              <div>
                <h6 className="font-semibold text-gray-800">GoVisaaProtect</h6>
                <ul className="text-xs text-gray-600 space-y-1 mt-1">
                  <li className="flex items-center">
                    <span className="w-1 h-1 rounded-full bg-gray-500 mr-2"></span>
                    If Visa Delayed — <strong className="ml-1">No Service Fee</strong>
                  </li>
                  <li className="flex items-center">
                    <span className="w-1 h-1 rounded-full bg-gray-500 mr-2"></span>
                    If Rejected — <strong className="ml-1">100% Refund</strong>
                  </li>
                </ul>
              </div>
              <span className="text-green-600 font-bold text-sm ml-auto">Free</span>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <h6 className="font-semibold text-gray-800 mb-2">Important Notes</h6>
            <p className="text-xs text-gray-600">{visaDetails.notes || "No notes available"}</p>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <span className="font-semibold text-gray-800">Total Amount</span>
            <div className="text-right">
              <p className="text-xs text-gray-500">Inclusive of all taxes</p>
              <p className="text-xl font-bold text-gray-900">₹ {total}</p>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={!contactInfo.email || !contactInfo.phone || !otpVerified}
            className={`w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all ${
              !contactInfo.email || !contactInfo.phone || !otpVerified ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {!otpVerified ? "Verify Phone Number to Continue" : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default VisaBookingCard
