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
  currency: "INR" | "USD" // Keep for data, display will be '₹'
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
  selectedVisaType: VisaType
  selectedDate: string
  travellers: number
  handleTravellerChange: (delta: number) => void
  setPaymentSuccess: (success: boolean) => void
  navigate: (path: string) => void
}

const BookingForm: React.FC<BookingFormProps> = ({
  visaData,
  selectedVisaType,
  selectedDate,
  travellers,
  handleTravellerChange,
  setPaymentSuccess,
  navigate,
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
    if (!selectedVisaType) return
    try {
      const originalAmount = selectedVisaType.visaFee * travellers + selectedVisaType.serviceFee
      const finalAmount = originalAmount - discountAmount
      const amount = Math.round(finalAmount * 100)

      if (appliedPromoCode) {
        await fetch("http://localhost:5000/api/promocode/incrementUsage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: appliedPromoCode.code,
          }),
        })
      }

      const response = await fetch("http://localhost:5000/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          currency: selectedVisaType.currency, // Keep currency code for backend
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
        currency: selectedVisaType.currency, // Keep currency code for Razorpay
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

  const handleWhatsAppRedirect = async () => {
    if (!visaData || !selectedVisaType) return
    try {
      const originalAmount = selectedVisaType.visaFee * travellers + selectedVisaType.serviceFee
      const finalAmount = originalAmount - discountAmount
      const amount = Math.round(finalAmount * 100)

      if (appliedPromoCode) {
        await fetch("http://localhost:5000/api/promocode/incrementUsage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: appliedPromoCode.code,
          }),
        })
      }

      const response = await fetch("http://localhost:5000/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          currency: selectedVisaType.currency, // Keep currency code for backend
          visaId: visaData._id,
          country: visaData.country,
          email: contactInfo.email,
          phone: contactInfo.phone,
          selectedDate,
          travellers,
          promoCode: appliedPromoCode?.code || null,
          discountAmount: discountAmount,
          paymentType: "offline",
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

      const message = encodeURIComponent(
        `Hi! I want to apply for ${visaData.country} visa. Here are my details:\n\n` +
          `📅 Appointment Date: ${selectedDate}\n` +
          `👥 Travelers: ${travellers}\n` +
          `📧 Email: ${contactInfo.email}\n` +
          `📱 Phone: ${contactInfo.phone}\n` +
          `💰 Total Amount: ₹ ${total}\n\n` + // Changed to '₹'
          `Please guide me with the offline payment process.`,
      )
      window.open(`https://wa.me/917070357583?text=${message}`, "_blank")
      setPaymentSuccess(true)
    } catch (err) {
      console.error("Error saving offline booking:", err)
      setError("Failed to save booking details. Please try again.")
    }
  }

  const governmentFee = selectedVisaType.visaFee || 0
  const serviceFee = selectedVisaType.serviceFee || 0
  const total = (governmentFee * travellers + serviceFee - discountAmount).toFixed(2)

  return (
    <div className="w-full rounded-2xl border border-gray-200 shadow-xl overflow-hidden bg-white">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
        <p className="font-medium text-sm opacity-90">Visa guaranteed on</p>
        <h4 className="text-2xl font-bold">{selectedDate}</h4>
      </div>
      <div className="p-8 space-y-8">
        <div className="flex justify-between items-center border-b border-gray-200 pb-6">
          <div className="flex items-center space-x-3">
            <span className="text-2xl text-gray-700">👥</span>
            <span className="font-semibold text-lg text-gray-800">Travellers</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleTravellerChange(-1)}
              className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-xl font-bold"
              disabled={travellers <= 1}
            >
              −
            </button>
            <span className="font-bold text-xl w-8 text-center text-gray-900">{travellers}</span>
            <button
              onClick={() => handleTravellerChange(1)}
              className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all duration-200 ease-in-out text-xl font-bold"
            >
              +
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <h5 className="font-bold text-xl text-gray-800">Contact Information</h5>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={contactInfo.email}
                onChange={handleContactChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out text-gray-800 placeholder-gray-400"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="flex gap-3">
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={contactInfo.phone}
                  onChange={handlePhoneChange}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out text-gray-800 placeholder-gray-400"
                  placeholder="+91 9876543210"
                  required
                  disabled={otpVerified}
                />
                {!otpSent && !otpVerified && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={!contactInfo.phone || otpLoading}
                    className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap font-semibold transition-all duration-200 ease-in-out"
                  >
                    {otpLoading ? "Sending..." : "Send OTP"}
                  </button>
                )}
                {otpVerified && (
                  <div className="flex items-center px-4 py-3 bg-green-100 text-green-700 rounded-lg font-semibold">
                    <span className="text-lg mr-2">✓</span> Verified
                  </div>
                )}
              </div>
              {otpSent && !otpVerified && (
                <div className="mt-4 space-y-3">
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                    Enter 6-digit OTP
                  </label>
                  <div className="flex gap-3">
                    <input
                      id="otp"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center tracking-widest font-mono text-lg"
                      placeholder="000000"
                      maxLength={6}
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={otp.length !== 6 || otpLoading}
                      className="px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 ease-in-out"
                    >
                      {otpLoading ? "Verifying..." : "Verify"}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpLoading}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-2"
                  >
                    Resend OTP
                  </button>
                </div>
              )}
              {otpError && <div className="mt-3 text-red-500 text-sm font-medium">{otpError}</div>}
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

        <div className="space-y-4 border-t border-gray-200 pt-8">
          <h5 className="font-bold text-xl text-gray-800">Price Details</h5>
          <div className="flex justify-between text-base text-gray-700">
            <span>Government fee</span>
            <span className="font-medium">
              ₹ {governmentFee.toLocaleString()} × {travellers} {/* Changed to '₹' */}
            </span>
          </div>
          <div className="flex justify-between text-base text-gray-700">
            <span>Service Fees</span>
            <span className="text-green-600 font-bold">
              ₹ {serviceFee.toFixed(2)} {/* Changed to '₹' */}
            </span>
          </div>
          {appliedPromoCode && (
            <div className="flex justify-between text-base text-gray-700">
              <span>Discount ({appliedPromoCode.code})</span>
              <span className="text-green-600 font-bold">
                -₹ {discountAmount.toFixed(2)} {/* Changed to '₹' */}
              </span>
            </div>
          )}
          <p className="text-xs text-blue-600 mt-2 leading-relaxed">
            You pay ₹ {serviceFee.toFixed(2)} only when we deliver your visa on time {/* Changed to '₹' */}
          </p>
        </div>

        <div className="bg-blue-50 p-5 rounded-xl border border-blue-200 flex items-start space-x-4">
          <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
            <span className="text-blue-600 text-2xl">🛡</span>
          </div>
          <div>
            <h6 className="font-bold text-lg text-gray-800 mb-1">GoVisaaProtect</h6>
            <ul className="text-sm text-gray-700 space-y-2 mt-1">
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-2 flex-shrink-0"></span>
                If Visa Delayed — <strong className="ml-1 text-gray-900">No Service Fee</strong>
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-2 flex-shrink-0"></span>
                If Rejected — <strong className="ml-1 text-gray-900">100% Refund</strong>
              </li>
            </ul>
          </div>
          <span className="text-green-600 font-bold text-base ml-auto flex-shrink-0">Free</span>
        </div>

        <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-200">
          <h6 className="font-bold text-lg text-gray-800 mb-3">Important Notes</h6>
          <p className="text-sm text-gray-700 leading-relaxed">{selectedVisaType.notes || "No notes available"}</p>
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <span className="font-bold text-xl text-gray-800">Total Amount</span>
          <div className="text-right">
            <p className="text-sm text-gray-500">Inclusive of all taxes</p>
            <p className="text-3xl font-extrabold text-gray-900">
              ₹ {total} {/* Changed to '₹' */}
            </p>
          </div>
        </div>

        {error && <div className="text-red-500 text-sm font-medium mt-4">{error}</div>}

        {!showPaymentOptions ? (
          <button
            onClick={() => {
              if (!contactInfo.email || !contactInfo.phone || !otpVerified) {
                setError("Please fill in all contact details and verify phone number to continue.")
                return
              }
              setError(null) // Clear previous errors
              setShowPaymentOptions(true)
            }}
            disabled={!contactInfo.email || !contactInfo.phone || !otpVerified}
            className={`w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 ${
              !contactInfo.email || !contactInfo.phone || !otpVerified ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {!otpVerified ? "Verify Phone Number to Continue" : "Continue to Payment"}
          </button>
        ) : (
          <div className="space-y-6">
            <h5 className="font-bold text-xl text-gray-800 text-center">Choose Payment Method</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentMethod("online")}
                className={`p-6 border-2 rounded-xl text-center flex flex-col items-center justify-center h-auto transition-all duration-200 ease-in-out transform hover:-translate-y-1 ${
                  paymentMethod === "online"
                    ? "border-blue-600 bg-blue-50 text-blue-800 shadow-md"
                    : "border-gray-300 bg-white hover:border-blue-300 hover:shadow-sm"
                }`}
              >
                <div className="text-4xl mb-3">💳</div>
                <div className="font-bold text-lg">Online Process</div>
                <div className="text-sm text-gray-600 mt-1">Pay via UPI, Card, Net Banking</div>
              </button>
              <button
                onClick={() => setPaymentMethod("offline")}
                className={`p-6 border-2 rounded-xl text-center flex flex-col items-center justify-center h-auto transition-all duration-200 ease-in-out transform hover:-translate-y-1 ${
                  paymentMethod === "offline"
                    ? "border-green-600 bg-green-50 text-green-800 shadow-md"
                    : "border-gray-300 bg-white hover:border-green-300 hover:shadow-sm"
                }`}
              >
                <div className="text-4xl mb-3">💬</div>
                <div className="font-bold text-lg">Offline Process</div>
                <div className="text-sm text-gray-600 mt-1">Connect via WhatsApp</div>
              </button>
            </div>
            {paymentMethod && (
              <div className="space-y-4">
                {paymentMethod === "offline" && (
                  <div className="bg-green-50 p-5 rounded-xl border border-green-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-green-600 text-2xl">📱</span>
                      <span className="font-bold text-lg text-green-800">WhatsApp Support</span>
                    </div>
                    <p className="text-sm text-green-700 mb-3 leading-relaxed">
                      Connect with our team on WhatsApp for personalized assistance and offline payment options.
                    </p>
                    <p className="text-xs text-green-600 leading-relaxed">
                      Our team will guide you through the payment process and document requirements.
                    </p>
                  </div>
                )}
                {paymentMethod === "online" && (
                  <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-blue-600 text-2xl">🔒</span>
                      <span className="font-bold text-lg text-blue-800">Secure Online Payment</span>
                    </div>
                    <p className="text-sm text-blue-700 mb-2 leading-relaxed">
                      Pay securely using UPI, Credit/Debit Card, or Net Banking.
                    </p>
                    <p className="text-xs text-blue-600 leading-relaxed">
                      Your payment is protected by bank-level security.
                    </p>
                  </div>
                )}
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      setShowPaymentOptions(false)
                      setPaymentMethod(null)
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-semibold"
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
                    className={`flex-1 px-6 py-3 font-bold rounded-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 ${
                      paymentMethod === "online"
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                        : "bg-green-600 hover:bg-green-700 text-white shadow-md"
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
