"use client"

import type React from "react"
import { useState } from "react"
import PromoCodeSection from "./promo-code-section"

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

interface BookingFormProps {
  visaData: VisaConfiguration
  selectedDate: string
  travellers: number
  handleTravellerChange: (delta: number) => void
  setPaymentSuccess: (success: boolean) => void
  navigate: (path: string) => void
}

const BookingForm: React.FC<BookingFormProps> = ({
  visaData,
  selectedDate,
  travellers,
  handleTravellerChange,
  setPaymentSuccess,
}) => {
  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
  })
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")
  const [otpVerified, setOtpVerified] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpError, setOtpError] = useState("")
  const [appliedPromoCode, setAppliedPromoCode] = useState<any>(null)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [showPaymentOptions, setShowPaymentOptions] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"online" | "offline" | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSendOtp = async () => {
    if (!contactInfo.phone) {
      setOtpError("Please enter phone number")
      return
    }
    setOtpLoading(true)
    setOtpError("")
    try {
      const response = await fetch("https://govissa-872569311567.asia-south2.run.app/api/User/send-otp", {
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      const response = await fetch("https://govissa-872569311567.asia-south2.run.app/api/User/verify-otp", {
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setContactInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePayment = async () => {
    if (!visaData || !visaData.visaTypes[0]) return

    try {
      const visaType = visaData.visaTypes[0]
      const originalAmount = visaType.visaFee * travellers + visaType.serviceFee
      const finalAmount = originalAmount - discountAmount
      const amount = Math.round(finalAmount * 100)

      // Increment promo code usage if applied
      if (appliedPromoCode) {
        await fetch("https://govissa-872569311567.asia-south2.run.app/api/promocode/incrementUsage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: appliedPromoCode.code,
          }),
        })
      }

      const response = await fetch("https://govissa-872569311567.asia-south2.run.app/api/payments/create-order", {
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
            const verifyResponse = await fetch("https://govissa-872569311567.asia-south2.run.app/api/payments/verify-payment", {
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

  const handleWhatsAppRedirect = async () => {
    if (!visaData) return

    try {
      // First, save the offline booking details using the same API
      const visaType = visaData.visaTypes[0]
      const originalAmount = visaType.visaFee * travellers + visaType.serviceFee
      const finalAmount = originalAmount - discountAmount
      const amount = Math.round(finalAmount * 100)

      // Increment promo code usage if applied
      if (appliedPromoCode) {
        await fetch("https://govissa-872569311567.asia-south2.run.app/api/promocode/incrementUsage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: appliedPromoCode.code,
          }),
        })
      }

      // Use the same create-order API but with offline flag
      const response = await fetch("https://govissa-872569311567.asia-south2.run.app/api/payments/create-order", {
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
          paymentType: "offline", // Add this flag to indicate offline booking
          payment_methods: {
            upi: true,
            card: true,
            netbanking: true,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create offline booking")
      }

      const result = await response.json()
      console.log("Offline booking saved:", result)

      // Then redirect to WhatsApp
      const message = encodeURIComponent(
        `Hi! I want to apply for ${visaData.country} visa. Here are my details:\n\n` +
          `📅 Appointment Date: ${selectedDate}\n` +
          `👥 Travelers: ${travellers}\n` +
          `📧 Email: ${contactInfo.email}\n` +
          `📱 Phone: ${contactInfo.phone}\n` +
          `💰 Total Amount: ₹${total}\n\n` +
          `Please guide me with the offline payment process.`,
      )

      window.open(`https://wa.me/917070357583?text=${message}`, "_blank")

      // Show success message
      setPaymentSuccess(true)
    } catch (err) {
      console.error("Error saving offline booking:", err)
      setError("Failed to save booking details. Please try again.")
    }
  }

  const visaType = visaData.visaTypes[0]
  const governmentFee = visaType.visaFee || 0
  const serviceFee = visaType.serviceFee || 0
  const total = (governmentFee * travellers + serviceFee - discountAmount).toFixed(2)

  return (
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

        <PromoCodeSection
          phoneNumber={contactInfo.phone}
          appliedPromoCode={appliedPromoCode}
          setAppliedPromoCode={setAppliedPromoCode}
          discountAmount={discountAmount}
          setDiscountAmount={setDiscountAmount}
          totalAmount={governmentFee * travellers + serviceFee}
        />

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
          <p className="text-xs text-gray-600">{visaType.notes || "No notes available"}</p>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <span className="font-semibold text-gray-800">Total Amount</span>
          <div className="text-right">
            <p className="text-xs text-gray-500">Inclusive of all taxes</p>
            <p className="text-xl font-bold text-gray-900">₹ {total}</p>
          </div>
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        {/* Payment Method Selection */}
        {!showPaymentOptions ? (
          <button
            onClick={() => {
              if (!contactInfo.email || !contactInfo.phone || !otpVerified) {
                return
              }
              setShowPaymentOptions(true)
            }}
            disabled={!contactInfo.email || !contactInfo.phone || !otpVerified}
            className={`w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all ${
              !contactInfo.email || !contactInfo.phone || !otpVerified ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {!otpVerified ? "Verify Phone Number to Continue" : "Continue to Payment"}
          </button>
        ) : (
          <div className="space-y-4">
            <h5 className="font-medium text-gray-700 text-center">Choose Payment Method</h5>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod("online")}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  paymentMethod === "online"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-2xl mb-2">💳</div>
                <div className="font-medium">Online Process</div>
                <div className="text-xs text-gray-500 mt-1">Pay via UPI, Card, Net Banking</div>
              </button>

              <button
                onClick={() => setPaymentMethod("offline")}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  paymentMethod === "offline"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-2xl mb-2">💬</div>
                <div className="font-medium">Offline Process</div>
                <div className="text-xs text-gray-500 mt-1">Connect via WhatsApp</div>
              </button>
            </div>

            {paymentMethod && (
              <div className="space-y-3">
                {paymentMethod === "offline" && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-green-600 text-lg">📱</span>
                      <span className="font-medium text-green-800">WhatsApp Support</span>
                    </div>
                    <p className="text-sm text-green-700 mb-3">
                      Connect with our team on WhatsApp for personalized assistance and offline payment options.
                    </p>
                    <p className="text-xs text-green-600">
                      Our team will guide you through the payment process and document requirements.
                    </p>
                  </div>
                )}

                {paymentMethod === "online" && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-blue-600 text-lg">🔒</span>
                      <span className="font-medium text-blue-800">Secure Online Payment</span>
                    </div>
                    <p className="text-sm text-blue-700 mb-2">
                      Pay securely using UPI, Credit/Debit Card, or Net Banking.
                    </p>
                    <p className="text-xs text-blue-600">Your payment is protected by bank-level security.</p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowPaymentOptions(false)
                      setPaymentMethod(null)
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      if (paymentMethod === "offline") {
                        handleWhatsAppRedirect()
                      } else if (paymentMethod === "online") {
                        handlePayment()
                      }
                    }}
                    className={`flex-1 px-4 py-3 font-bold rounded-lg transition-all ${
                      paymentMethod === "online"
                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                  >
                    {paymentMethod === "offline" ? "Connect on WhatsApp" : "Pay Now"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingForm
