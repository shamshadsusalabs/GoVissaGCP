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

interface BookingFormProps {
  visaData: VisaConfiguration
  selectedVisaType: VisaType
  selectedDate: string
  travellers: number
  handleTravellerChange: (delta: number) => void
  setPaymentSuccess: (paymentMethod: string | false) => void // ✅ Updated to accept payment method type
  navigate: (path: string) => void
}

const BookingForm: React.FC<BookingFormProps> = ({
  visaData,
  selectedVisaType,
  selectedDate,
  travellers,
  handleTravellerChange,
  setPaymentSuccess,
}) => {
  
  // Calculate expected decision date based on expectedVisaDays
  const calculateExpectedDecisionDate = () => {
    if (!selectedVisaType?.expectedVisaDays || selectedVisaType.expectedVisaDays <= 0) {
      return null
    }
    
    const today = new Date()
    const expectedDays = selectedVisaType.expectedVisaDays
    const expectedDate = new Date(today.getTime() + (expectedDays * 24 * 60 * 60 * 1000))
    
    return expectedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const [contactInfo, setContactInfo] = useState({
    email: "",
    phone: "",
  })
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")
  const [otpVerified, setOtpVerified] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpError, setOtpError] = useState("")
  
  // ✅ NEW: Email OTP states
  const [emailOtpSent, setEmailOtpSent] = useState(false)
  const [emailOtp, setEmailOtp] = useState("")
  const [emailOtpVerified, setEmailOtpVerified] = useState(false)
  const [emailOtpLoading, setEmailOtpLoading] = useState(false)
  const [emailOtpError, setEmailOtpError] = useState("")
  
  const [appliedPromoCode, setAppliedPromoCode] = useState<any>(null)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [showPaymentOptions, setShowPaymentOptions] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"online" | "offline" | "cash" | "paylater" | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // ✅ NEW: Age group states
  const [children, setChildren] = useState(0) // 6y - 12y
  const [youngChildren, setYoungChildren] = useState(0)   // 0y - 6y
  
  // ✅ NEW: Pay Later form state
  // const [showPayLaterForm, setShowPayLaterForm] = useState(false) // Commented out unused variable
  const [payLaterDetails, setPayLaterDetails] = useState({
    corporateName: "",
    corporateEmail: "",
    corporatePhone: "",
    creditLimit: 0
  })

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
          // Merge entered email/phone into user before saving to localStorage
          const mergedUser = {
            ...data.user,
            email: contactInfo.email || data.user.email,
            phoneNumber: contactInfo.phone || data.user.phoneNumber,
          }
          localStorage.setItem("user", JSON.stringify(mergedUser))
        }
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken)
        }
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken)
        }
        // ✅ NEW: Send success email if both phone and email are now verified
        if (emailOtpVerified) {
          await sendSuccessEmail()
        }
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

  // const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target
  //   setContactInfo((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }))
  // }

  // ✅ NEW: Send success email after both OTPs are verified
  const sendSuccessEmail = async (paymentStatus?: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/User/send-success-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: contactInfo.email,
          phone: contactInfo.phone,
          name: contactInfo.email.split('@')[0], // Use email prefix as name fallback
          paymentStatus: paymentStatus || null, // Pass payment status if provided
        }),
      })
      
      if (response.ok) {
        // Success email sent successfully
      } else {
        // Failed to send success email
      }
    } catch (err) {
      // Error sending success email
    }
  }

  // ✅ NEW: Email OTP functions
  const handleSendEmailOtp = async () => {
    if (!contactInfo.email) {
      setEmailOtpError("Please enter email address")
      return
    }
    setEmailOtpLoading(true)
    setEmailOtpError("")
    try {
      const response = await fetch("http://localhost:5000/api/User/send-email-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: contactInfo.email,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        setEmailOtpSent(true)
        setEmailOtpError("")
      } else {
        setEmailOtpError(data.message || "Failed to send email OTP")
      }
    } catch (err) {
      setEmailOtpError("Failed to send email OTP. Please try again.")
    } finally {
      setEmailOtpLoading(false)
    }
  }

  const handleVerifyEmailOtp = async () => {
    if (!emailOtp || emailOtp.length !== 6) {
      setEmailOtpError("Please enter 6-digit OTP")
      return
    }
    setEmailOtpLoading(true)
    setEmailOtpError("")
    try {
      // First check if user is already logged in with phone
      const existingUser = localStorage.getItem("user")
      let currentUser = null
      
      if (existingUser) {
        currentUser = JSON.parse(existingUser)
      }

      const response = await fetch("http://localhost:5000/api/User/verify-email-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: contactInfo.email,
          otp: emailOtp,
        }),
      })
      const data = await response.json()
      
      if (response.ok) {
        setEmailOtpVerified(true)
        setEmailOtpError("")
        
        // If user was already logged in with phone, update their profile with email
        if (currentUser && currentUser._id && !currentUser.email) {
          try {
            const updateResponse = await fetch("http://localhost:5000/api/User/register-email", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: contactInfo.email,
                userId: currentUser._id,
              }),
            })
            
            if (updateResponse.ok) {
              const updateData = await updateResponse.json()
              localStorage.setItem("user", JSON.stringify(updateData.user))
            }
          } catch (updateErr) {
            // Failed to update user profile with email
          }
        }
        
        // ✅ NEW: Send success email if both phone and email are now verified
        if (otpVerified) {
          await sendSuccessEmail()
        }
      } else {
        setEmailOtpError(data.message || "Invalid email OTP")
      }
    } catch (err) {
      setEmailOtpError("Failed to verify email OTP. Please try again.")
    } finally {
      setEmailOtpLoading(false)
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setContactInfo((prev) => ({
      ...prev,
      email: value,
    }))
    if (emailOtpSent || emailOtpVerified) {
      setEmailOtpSent(false)
      setEmailOtpVerified(false)
      setEmailOtp("")
      setEmailOtpError("")
    }
  }

  const handlePayment = async () => {
    if (!selectedVisaType) return
    
    // ✅ Validate that a travel date is selected
    if (!selectedDate || selectedDate.trim() === "") {
      setError("Please select a travel date before proceeding with payment.")
      return
    }
    
    try {
      // Age-based pricing calculation for handlePayment
      const totalTravellers = travellers + children + youngChildren
      const adultAmount = (selectedVisaType.visaFee + selectedVisaType.serviceFee) * travellers
      const childAmount = ((selectedVisaType.childVisaFee || 0) + (selectedVisaType.childServiceFee || 0)) * children
      const youngChildAmount = ((selectedVisaType.youngChildVisaFee || 0) + (selectedVisaType.youngChildServiceFee || 0)) * youngChildren
      const originalAmount = adultAmount + childAmount + youngChildAmount
      const finalAmount = originalAmount - discountAmount
      const amountInRupees = Math.round(finalAmount); const amountInPaise = Math.round(finalAmount * 100)

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
          amount: amountInRupees,
          currency: selectedVisaType.currency,
          visaId: visaData._id,
          country: visaData.country,
          email: contactInfo.email,
          phone: contactInfo.phone,
          selectedDate,
          travellers: totalTravellers,
          // ✅ NEW: Age group breakdown
          travellerDetails: {
            adults: travellers,
            children: children,
            youngChildren: youngChildren,
            total: totalTravellers
          },
          promoCode: appliedPromoCode?.code || null,
          promoCodeId: appliedPromoCode?._id || null,
          discountAmount: discountAmount,
          originalAmount: subtotal.toString(),
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
        amount: amountInPaise,
        currency: selectedVisaType.currency,
        name: "Govissa Visa Services",
        description: "Visa Application Fee",
        order_id: data.id,
        handler: async (response: any) => {
          try {
            const verifyResponse = await fetch(
              "http://localhost:5000/api/payments/verify-payment",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  selectedDate,
                  travellers: totalTravellers,
                  visaId: visaData._id,
                  email: contactInfo.email,
                  phone: contactInfo.phone,
                }),
              },
            )
            const verifyData = await verifyResponse.json()
            if (verifyData.success) {
              setPaymentSuccess("online") // ✅ Pass payment method type
              // Send success email with payment status if both OTPs are verified
              if (otpVerified && emailOtpVerified) {
                await sendSuccessEmail("online")
              }
            } else {
              setError("Payment verification failed. Please contact support.")
            }
          } catch (err) {
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
        setError(`Payment failed: ${response.error.description || "Unknown error"}`)
      })
    } catch (err) {
      setError("Payment failed. Please try again.")
    }
  }

  const handleWhatsAppRedirect = async () => {
    if (!visaData || !selectedVisaType) return
    
    // ✅ Validate that a travel date is selected
    if (!selectedDate || selectedDate.trim() === "") {
      setError("Please select a travel date before proceeding.")
      return
    }
    
    try {
      // Age-based pricing calculation for WhatsApp redirect
      const totalTravellers = travellers + children + youngChildren
      const adultAmount = (selectedVisaType.visaFee + selectedVisaType.serviceFee) * travellers
      const childAmount = ((selectedVisaType.childVisaFee || 0) + (selectedVisaType.childServiceFee || 0)) * children
      const youngChildAmount = ((selectedVisaType.youngChildVisaFee || 0) + (selectedVisaType.youngChildServiceFee || 0)) * youngChildren
      const originalAmount = adultAmount + childAmount + youngChildAmount
      const finalAmount = originalAmount - discountAmount
      const amountInRupees = Math.round(finalAmount)

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
          amount: amountInRupees,
          currency: selectedVisaType.currency,
          visaId: visaData._id,
          country: visaData.country,
          email: contactInfo.email,
          phone: contactInfo.phone,
          selectedDate,
          travellers: totalTravellers,
          // ✅ NEW: Age group breakdown
          travellerDetails: {
            adults: travellers,
            children: children,
            youngChildren: youngChildren,
            total: totalTravellers
          },
          promoCode: appliedPromoCode?.code || null,
          promoCodeId: appliedPromoCode?._id || null,
          discountAmount: discountAmount,
          originalAmount: subtotal.toString(),
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

      await response.json()
      const message = encodeURIComponent(
        `Hi! I want to apply for ${visaData.country} visa. Here are my details:\n\n` +
          `📅 Appointment Date: ${selectedDate}\n` +
          `👥 Travelers: ${totalTravellers}\n` +
          `📧 Email: ${contactInfo.email}\n` +
          `📱 Phone: ${contactInfo.phone}\n` +
          `💰 Total Amount: ₹ ${total}\n\n` +
          `Please guide me with the offline payment process.`,
      )
      window.open(`https://wa.me/917070357583?text=${message}`, "_blank")
      setPaymentSuccess("offline") // ✅ Pass payment method type for offline
      // Send success email with payment status if both OTPs are verified
      if (otpVerified && emailOtpVerified) {
        await sendSuccessEmail("offline")
      }
    } catch (err) {
      setError("Failed to save booking details. Please try again.")
    }
  }

  // ✅ NEW: Handle Cash Payment
  const handleCashPayment = async () => {
    if (!visaData || !selectedVisaType) return
    
    // ✅ Validate that a travel date is selected
    if (!selectedDate || selectedDate.trim() === "") {
      setError("Please select a travel date before proceeding.")
      return
    }
    
    try {
      // Age-based pricing calculation for cash payment
      const totalTravellers = travellers + children + youngChildren
      const adultAmount = (selectedVisaType.visaFee + selectedVisaType.serviceFee) * travellers
      const childAmount = ((selectedVisaType.childVisaFee || 0) + (selectedVisaType.childServiceFee || 0)) * children
      const youngChildAmount = ((selectedVisaType.youngChildVisaFee || 0) + (selectedVisaType.youngChildServiceFee || 0)) * youngChildren
      const originalAmount = adultAmount + childAmount + youngChildAmount
      const finalAmount = originalAmount - discountAmount
      const amountInRupees = Math.round(finalAmount)

      const response = await fetch("http://localhost:5000/api/payments/create-cash-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountInRupees,
          currency: selectedVisaType.currency,
          visaId: visaData._id,
          country: visaData.country,
          email: contactInfo.email,
          phone: contactInfo.phone,
          selectedDate,
          travellers: totalTravellers,
          // ✅ NEW: Age group breakdown
          travellerDetails: {
            adults: travellers,
            children: children,
            youngChildren: youngChildren,
            total: totalTravellers
          },
          promoCode: appliedPromoCode?.code || null,
          promoCodeId: appliedPromoCode?._id || null,
          discountAmount: discountAmount,
          originalAmount: subtotal.toString(),
          cashDetails: {
            notes: `Cash payment for ${visaData.country} visa - ${totalTravellers} traveller(s) (Adults: ${travellers}, Children: ${children}, Young Children: ${youngChildren})`
          }
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create cash payment order")
      }

      await response.json()
      setPaymentSuccess("cash") // ✅ Pass payment method type for cash
      // Send success email with payment status if both OTPs are verified
      if (otpVerified && emailOtpVerified) {
        await sendSuccessEmail("cash")
      }
      setError(null)
    } catch (err) {
      setError("Failed to create cash payment order. Please try again.")
    }
  }

  // ✅ NEW: Handle Pay Later Payment
  const handlePayLaterPayment = async () => {
    if (!visaData || !selectedVisaType) return
    
    // ✅ Validate that a travel date is selected
    if (!selectedDate || selectedDate.trim() === "") {
      setError("Please select a travel date before proceeding.")
      return
    }
    
    try {
      // Age-based pricing calculation for pay later
      const totalTravellers = travellers + children + youngChildren
      const adultAmount = (selectedVisaType.visaFee + selectedVisaType.serviceFee) * travellers
      const childAmount = ((selectedVisaType.childVisaFee || 0) + (selectedVisaType.childServiceFee || 0)) * children
      const youngChildAmount = ((selectedVisaType.youngChildVisaFee || 0) + (selectedVisaType.youngChildServiceFee || 0)) * youngChildren
      const originalAmount = adultAmount + childAmount + youngChildAmount
      const finalAmount = originalAmount - discountAmount
      const amountInRupees = Math.round(finalAmount)

      const response = await fetch("http://localhost:5000/api/payments/create-paylater-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountInRupees,
          currency: selectedVisaType.currency,
          visaId: visaData._id,
          country: visaData.country,
          email: contactInfo.email,
          phone: contactInfo.phone,
          selectedDate,
          travellers: totalTravellers,
          // ✅ NEW: Age group breakdown
          travellerDetails: {
            adults: travellers,
            children: children,
            youngChildren: youngChildren,
            total: totalTravellers
          },
          promoCode: appliedPromoCode?.code || null,
          promoCodeId: appliedPromoCode?._id || null,
          discountAmount: discountAmount,
          originalAmount: subtotal.toString(),
          payLaterDetails: {
            ...payLaterDetails,
            creditLimit: amountInRupees // Convert back to rupees
          }
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create pay later order")
      }

      await response.json()
      setPaymentSuccess("paylater") // ✅ Pass payment method type for pay later
      // Send success email with payment status if both OTPs are verified
      if (otpVerified && emailOtpVerified) {
        await sendSuccessEmail("paylater")
      }
      setError(null)
    } catch (err) {
      setError("Failed to create pay later order. Please try again.")
    }
  }

  // ✅ NEW: Handle Pay Later form change
  const handlePayLaterFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPayLaterDetails(prev => ({
      ...prev,
      [name]: name === "creditLimit" ? parseFloat(value) || 0 : value
    }))
  }

  // Age-based pricing calculation logic
  const totalTravellers = travellers + children + youngChildren

  // Calculate costs for each age group
  const adultCost = (selectedVisaType.visaFee + selectedVisaType.serviceFee) * travellers
  const childCost = ((selectedVisaType.childVisaFee || 0) + (selectedVisaType.childServiceFee || 0)) * children
  const youngChildCost = ((selectedVisaType.youngChildVisaFee || 0) + (selectedVisaType.youngChildServiceFee || 0)) * youngChildren
  
  const subtotal = adultCost + childCost + youngChildCost
  const total = (subtotal - discountAmount).toFixed(2)

  // Individual fee variables for price breakdown display (removed unused variables)

      return (
        <div className="w-full rounded-2xl border border-gray-200 shadow-xl overflow-hidden bg-white">
         {selectedVisaType?.expectedVisaDays && selectedVisaType.expectedVisaDays > 0 && (
           <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 sm:p-6">
             <p className="font-medium text-sm opacity-90">Expected visa decision by</p>
             <h4 className="text-xl sm:text-2xl font-bold">{calculateExpectedDecisionDate()}</h4>
           </div>
         )}

          <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-2xl text-gray-700">👥</span>
                <span className="font-semibold text-lg text-gray-800">Travellers</span>
              </div>
              
              {/* Age Group Selection */}
              <div className="space-y-4">
                {/* Adults (12y+) */}
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-800">ADULTS (12y+)</div>
                    <div className="text-sm text-gray-500">on the day of travel</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleTravellerChange(-1)}
                      className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-lg font-bold"
                      disabled={travellers <= 0}
                    >
                      −
                    </button>
                    <span className="font-bold text-lg w-6 text-center text-gray-900 bg-blue-500 text-white rounded px-2 py-1">{travellers}</span>
                    <button
                      onClick={() => handleTravellerChange(1)}
                      className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition-all duration-200 ease-in-out text-lg font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children (6y - 12y) */}
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-800">CHILDREN (6y - 12y)</div>
                    <div className="text-sm text-gray-500">on the day of travel</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-lg font-bold"
                      disabled={children <= 0}
                    >
                      −
                    </button>
                    <span className="font-bold text-lg w-6 text-center text-gray-900 bg-blue-500 text-white rounded px-2 py-1">{children}</span>
                    <button
                      onClick={() => setChildren(children + 1)}
                      className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition-all duration-200 ease-in-out text-lg font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Young Children (0y - 6y) */}
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-800">YOUNG CHILDREN (0y - 6y)</div>
                    <div className="text-sm text-gray-500">on the day of travel</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setYoungChildren(Math.max(0, youngChildren - 1))}
                      className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed text-lg font-bold"
                      disabled={youngChildren <= 0}
                    >
                      −
                    </button>
                    <span className="font-bold text-lg w-6 text-center text-gray-900 bg-blue-500 text-white rounded px-2 py-1">{youngChildren}</span>
                    <button
                      onClick={() => setYoungChildren(youngChildren + 1)}
                      className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition-all duration-200 ease-in-out text-lg font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

        <div className="space-y-6">
          <h5 className="font-bold text-xl text-gray-800">Contact Information</h5>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={contactInfo.email}
                  onChange={handleEmailChange}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out text-gray-800 placeholder-gray-400"
                  placeholder="your@email.com"
                  required
                  disabled={emailOtpVerified}
                />
                {!emailOtpSent && !emailOtpVerified && (
                  <button
                    type="button"
                    onClick={handleSendEmailOtp}
                    disabled={!contactInfo.email || emailOtpLoading}
                    className="px-4 sm:px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap font-semibold transition-all duration-200 ease-in-out text-sm sm:text-base"
                  >
                    {emailOtpLoading ? "Sending..." : "Send Email OTP"}
                  </button>
                )}
                {emailOtpVerified && (
                  <div className="flex items-center px-4 py-3 bg-green-100 text-green-700 rounded-lg font-semibold text-sm sm:text-base">
                    <span className="text-lg mr-2">✓</span> Email Verified
                  </div>
                )}
              </div>
              {emailOtpSent && !emailOtpVerified && (
                <div className="mt-4 space-y-3">
                  <label htmlFor="emailOtp" className="block text-sm font-medium text-gray-700">
                    Enter 6-digit Email OTP
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      id="emailOtp"
                      type="text"
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center tracking-widest font-mono text-lg"
                      placeholder="000000"
                      maxLength={6}
                    />
                    <button
                      type="button"
                      onClick={handleVerifyEmailOtp}
                      disabled={emailOtp.length !== 6 || emailOtpLoading}
                      className="px-4 sm:px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 ease-in-out text-sm sm:text-base"
                    >
                      {emailOtpLoading ? "Verifying..." : "Verify Email"}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleSendEmailOtp}
                    disabled={emailOtpLoading}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-2"
                  >
                    Resend Email OTP
                  </button>
                </div>
              )}
              {emailOtpError && <div className="mt-3 text-red-500 text-sm font-medium">{emailOtpError}</div>}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
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
                    className="px-4 sm:px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap font-semibold transition-all duration-200 ease-in-out text-sm sm:text-base"
                  >
                    {otpLoading ? "Sending..." : "Send OTP"}
                  </button>
                )}
                {otpVerified && (
                  <div className="flex items-center px-4 py-3 bg-green-100 text-green-700 rounded-lg font-semibold text-sm sm:text-base">
                    <span className="text-lg mr-2">✓</span> Verified
                  </div>
                )}
              </div>
              {otpSent && !otpVerified && (
                <div className="mt-4 space-y-3">
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                    Enter 6-digit OTP
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
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
                      className="px-4 sm:px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 ease-in-out text-sm sm:text-base"
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
          totalAmount={subtotal}
        />

        <div className="space-y-4 border-t border-gray-200 pt-8">
          <h5 className="font-bold text-xl text-gray-800">Price Details</h5>
          
          {/* Adults (12+ years) */}
          {travellers > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h6 className="font-bold text-lg text-blue-800 mb-3">Adults (12+ years) - {travellers} traveller{travellers > 1 ? 's' : ''}</h6>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Government fee per person</span>
                  <span className="font-medium">₹ {selectedVisaType.visaFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Service fee per person</span>
                  <span className="font-medium">₹ {selectedVisaType.serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700 border-t pt-2">
                  <span className="font-semibold">Total per adult</span>
                  <span className="font-semibold">₹ {(selectedVisaType.visaFee + selectedVisaType.serviceFee).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base text-blue-800 font-bold border-t pt-2">
                  <span>Adults subtotal ({travellers} × ₹{(selectedVisaType.visaFee + selectedVisaType.serviceFee).toFixed(2)})</span>
                  <span>₹ {adultCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Children (6-12 years) */}
          {children > 0 && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h6 className="font-bold text-lg text-green-800 mb-3">Children (6-12 years) - {children} child{children > 1 ? 'ren' : ''}</h6>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Government fee per child</span>
                  <span className="font-medium">₹ {(selectedVisaType.childVisaFee || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Service fee per child</span>
                  <span className="font-medium">₹ {(selectedVisaType.childServiceFee || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700 border-t pt-2">
                  <span className="font-semibold">Total per child</span>
                  <span className="font-semibold">₹ {((selectedVisaType.childVisaFee || 0) + (selectedVisaType.childServiceFee || 0)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base text-green-800 font-bold border-t pt-2">
                  <span>Children subtotal ({children} × ₹{((selectedVisaType.childVisaFee || 0) + (selectedVisaType.childServiceFee || 0)).toFixed(2)})</span>
                  <span>₹ {childCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Young Children (0-6 years) */}
          {youngChildren > 0 && (
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h6 className="font-bold text-lg text-purple-800 mb-3">Young Children (0-6 years) - {youngChildren} child{youngChildren > 1 ? 'ren' : ''}</h6>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Government fee per young child</span>
                  <span className="font-medium">₹ {(selectedVisaType.youngChildVisaFee || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Service fee per young child</span>
                  <span className="font-medium">₹ {(selectedVisaType.youngChildServiceFee || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700 border-t pt-2">
                  <span className="font-semibold">Total per young child</span>
                  <span className="font-semibold">₹ {((selectedVisaType.youngChildVisaFee || 0) + (selectedVisaType.youngChildServiceFee || 0)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base text-purple-800 font-bold border-t pt-2">
                  <span>Young children subtotal ({youngChildren} × ₹{((selectedVisaType.youngChildVisaFee || 0) + (selectedVisaType.youngChildServiceFee || 0)).toFixed(2)})</span>
                  <span>₹ {youngChildCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Total Summary */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
            <div className="space-y-2">
              <div className="flex justify-between text-base text-gray-700">
                <span className="font-semibold">Total travelers</span>
                <span className="font-semibold">{totalTravellers}</span>
              </div>
              <div className="flex justify-between text-base text-gray-700 border-t pt-2">
                <span className="font-semibold">Subtotal</span>
                <span className="font-semibold">₹ {subtotal.toFixed(2)}</span>
              </div>
              {appliedPromoCode && (
                <div className="flex justify-between text-base text-gray-700">
                  <span>Discount ({appliedPromoCode.code})</span>
                  <span className="text-green-600 font-bold">-₹ {discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
          
        </div>

        <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-200">
          <h6 className="font-bold text-lg text-gray-800 mb-3">Important Notes</h6>
          <p className="text-sm text-gray-700 leading-relaxed">{selectedVisaType.notes || "No notes available"}</p>
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <span className="font-bold text-xl text-gray-800">Total Amount</span>
          <div className="text-right">
            <p className="text-sm text-gray-500">Inclusive of all taxes</p>
            <p className="text-3xl font-extrabold text-gray-900">₹ {total}</p>
          </div>
        </div>

        {error && <div className="text-red-500 text-sm font-medium mt-4">{error}</div>}

        {!showPaymentOptions ? (
          <button
            onClick={() => {
              if (!contactInfo.email || !contactInfo.phone || !otpVerified || !emailOtpVerified) {
                setError("Please fill in all contact details and verify both email and phone number to continue.")
                return
              }
              setError(null)
              setShowPaymentOptions(true)
            }}
            disabled={!contactInfo.email || !contactInfo.phone || !otpVerified || !emailOtpVerified}
            className={`w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 text-sm sm:text-base ${
              !contactInfo.email || !contactInfo.phone || !otpVerified || !emailOtpVerified ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {!otpVerified || !emailOtpVerified ? "Verify Contact Details to Continue" : "Continue to Payment"}
          </button>
        ) : (
          <div className="space-y-6">
            <h5 className="font-bold text-xl text-gray-800 text-center">Choose Payment Method</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <button
                onClick={() => setPaymentMethod("online")}
                className={`p-4 sm:p-6 border-2 rounded-xl text-center flex flex-col items-center justify-center h-auto transition-all duration-200 ease-in-out transform hover:-translate-y-1 ${
                  paymentMethod === "online"
                    ? "border-blue-600 bg-blue-50 text-blue-800 shadow-md"
                    : "border-gray-300 bg-white hover:border-blue-300 hover:shadow-sm"
                }`}
              >
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">💳</div>
                <div className="font-bold text-base sm:text-lg">Online Process</div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Pay via UPI, Card, Net Banking</div>
              </button>
              <button
                onClick={() => setPaymentMethod("offline")}
                className={`p-4 sm:p-6 border-2 rounded-xl text-center flex flex-col items-center justify-center h-auto transition-all duration-200 ease-in-out transform hover:-translate-y-1 ${
                  paymentMethod === "offline"
                    ? "border-green-600 bg-green-50 text-green-800 shadow-md"
                    : "border-gray-300 bg-white hover:border-green-300 hover:shadow-sm"
                }`}
              >
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">💬</div>
                <div className="font-bold text-base sm:text-lg">Offline Process</div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Connect via WhatsApp</div>
              </button>
              <button
                onClick={() => setPaymentMethod("cash")}
                className={`p-4 sm:p-6 border-2 rounded-xl text-center flex flex-col items-center justify-center h-auto transition-all duration-200 ease-in-out transform hover:-translate-y-1 ${
                  paymentMethod === "cash"
                    ? "border-orange-600 bg-orange-50 text-orange-800 shadow-md"
                    : "border-gray-300 bg-white hover:border-orange-300 hover:shadow-sm"
                }`}
              >
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">💵</div>
                <div className="font-bold text-base sm:text-lg">Cash Payment</div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Pay at our office</div>
              </button>
              <button
                onClick={() => setPaymentMethod("paylater")}
                className={`p-4 sm:p-6 border-2 rounded-xl text-center flex flex-col items-center justify-center h-auto transition-all duration-200 ease-in-out transform hover:-translate-y-1 ${
                  paymentMethod === "paylater"
                    ? "border-purple-600 bg-purple-50 text-purple-800 shadow-md"
                    : "border-gray-300 bg-white hover:border-purple-300 hover:shadow-sm"
                }`}
              >
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🏢</div>
                <div className="font-bold text-base sm:text-lg">Pay Later</div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Corporate credit facility</div>
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
                    
                    {/* ✅ NEW: Contact Section for Offline Orders */}
                    <div className="mt-4 p-4 bg-white rounded-lg border border-green-300">
                      <h4 className="font-bold text-green-800 mb-2">📞 For Next Process Contact:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="text-green-600">📧</span>
                          <span className="font-medium">Email:</span>
                          <a href="mailto:contact@traveli.asia" className="text-blue-600 hover:underline">
                            contact@traveli.asia
                          </a>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-green-600">📱</span>
                          <span className="font-medium">Phone:</span>
                          <a href="tel:+919289280509" className="text-blue-600 hover:underline">
                            +91 9289280509
                          </a>
                        </div>
                      </div>
                    </div>
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
                {paymentMethod === "cash" && (
                  <div className="bg-orange-50 p-5 rounded-xl border border-orange-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-orange-600 text-2xl">💵</span>
                      <span className="font-bold text-lg text-orange-800">Cash Payment</span>
                    </div>
                    <p className="text-sm text-orange-700 mb-3 leading-relaxed">
                      Visit our office to make cash payment. You'll receive a receipt immediately.
                    </p>
                    <p className="text-xs text-orange-600 leading-relaxed">
                      Please bring exact amount and valid ID proof for verification.
                    </p>
                    
                    {/* ✅ NEW: Contact Section for Cash Orders */}
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
                {paymentMethod === "paylater" && (
                  <div className="bg-purple-50 p-5 rounded-xl border border-purple-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-purple-600 text-2xl">🏢</span>
                      <span className="font-bold text-lg text-purple-800">Corporate Pay Later</span>
                    </div>
                    <p className="text-sm text-purple-700 mb-3 leading-relaxed">
                      Available for corporate clients with approved credit facility.
                    </p>
                    <p className="text-xs text-purple-600 leading-relaxed">
                      Requires corporate details and admin approval.
                    </p>
                    
                    {/* ✅ NEW: Contact Section for Corporate Orders */}
                    <div className="mt-4 p-4 bg-white rounded-lg border border-purple-300">
                      <h4 className="font-bold text-purple-800 mb-2">📞 For Next Process Contact:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="text-purple-600">📧</span>
                          <span className="font-medium">Email:</span>
                          <a href="mailto:contact@traveli.asia" className="text-blue-600 hover:underline">
                            contact@traveli.asia
                          </a>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-purple-600">📱</span>
                          <span className="font-medium">Phone:</span>
                          <a href="tel:+919289280509" className="text-blue-600 hover:underline">
                            +91 9289280509
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* ✅ NEW: Pay Later Form */}
                {paymentMethod === "paylater" && (
                  <div className="bg-white p-4 sm:p-5 rounded-xl border border-purple-200">
                    <h6 className="font-bold text-lg text-purple-800 mb-4">Corporate Details</h6>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Corporate Name *
                        </label>
                        <input
                          type="text"
                          name="corporateName"
                          value={payLaterDetails.corporateName}
                          onChange={handlePayLaterFormChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="Enter company name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Corporate Email *
                        </label>
                        <input
                          type="email"
                          name="corporateEmail"
                          value={payLaterDetails.corporateEmail}
                          onChange={handlePayLaterFormChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="corporate@company.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Corporate Phone *
                        </label>
                        <input
                          type="tel"
                          name="corporatePhone"
                          value={payLaterDetails.corporatePhone}
                          onChange={handlePayLaterFormChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="+91 9876543210"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Credit Limit (₹) *
                        </label>
                        <input
                          type="number"
                          name="creditLimit"
                          value={payLaterDetails.creditLimit}
                          onChange={handlePayLaterFormChange}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="50000"
                          min="0"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={() => {
                      setShowPaymentOptions(false)
                      setPaymentMethod(null)
                      // setShowPayLaterForm(false) // Commented out unused function
                    }}
                    className="flex-1 px-4 sm:px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-semibold text-sm sm:text-base"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      if (paymentMethod === "offline") {
                        handleWhatsAppRedirect()
                      } else if (paymentMethod === "online") {
                        handlePayment()
                      } else if (paymentMethod === "cash") {
                        handleCashPayment()
                      } else if (paymentMethod === "paylater") {
                        // Validate Pay Later form
                        if (!payLaterDetails.corporateName || !payLaterDetails.corporateEmail || !payLaterDetails.corporatePhone || payLaterDetails.creditLimit <= 0) {
                          setError("Please fill in all corporate details for Pay Later option.")
                          return
                        }
                        handlePayLaterPayment()
                      }
                    }}
                    className={`flex-1 px-4 sm:px-6 py-3 font-bold rounded-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 text-sm sm:text-base ${
                      paymentMethod === "online"
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                        : paymentMethod === "offline"
                        ? "bg-green-600 hover:bg-green-700 text-white shadow-md"
                        : paymentMethod === "cash"
                        ? "bg-orange-600 hover:bg-orange-700 text-white shadow-md"
                        : "bg-purple-600 hover:bg-purple-700 text-white shadow-md"
                    }`}
                  >
                    {paymentMethod === "offline" 
                      ? "Connect on WhatsApp" 
                      : paymentMethod === "online"
                      ? "Pay Now"
                      : paymentMethod === "cash"
                      ? "Create Cash Order"
                      : "Submit Pay Later Request"
                    }
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

export default BookingForm;