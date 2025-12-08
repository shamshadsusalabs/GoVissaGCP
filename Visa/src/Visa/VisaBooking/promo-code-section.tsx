"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface PromoCode {
  _id: string
  code: string
  discountType: "percentage" | "fixed"
  discountValue: number
  maxUsage: number
  usedCount: number
  validFrom: string
  validUntil: string
  isActive: boolean
}

interface PromoCodeSectionProps {
  phoneNumber: string
  appliedPromoCode: PromoCode | null
  setAppliedPromoCode: (code: PromoCode | null) => void
  discountAmount: number
  setDiscountAmount: (amount: number) => void
  totalAmount: number
}

const PromoCodeSection: React.FC<PromoCodeSectionProps> = ({
  phoneNumber,
  appliedPromoCode,
  setAppliedPromoCode,
  discountAmount,
  setDiscountAmount,
  totalAmount,
}) => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
  const [selectedPromoCodeCode, setSelectedPromoCodeCode] = useState<string>("")
  const [promoCodeError, setPromoCodeError] = useState("")
  const [promoCodeLoading, setPromoCodeLoading] = useState(false)

  useEffect(() => {
    fetchPromoCodes()
  }, [])

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

  const checkUserExists = async (phoneNumber: string): Promise<boolean> => {
    try {
      const response = await fetch("http://localhost:5000/api/User/check-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
        }),
      })
      if (response.ok) {
        const data = await response.json()
        return data.exists
      }
      return false
    } catch (err) {
      console.error("Failed to check user:", err)
      return false
    }
  }

  const handleApplyPromoCode = async () => {
    if (!selectedPromoCodeCode) {
      setPromoCodeError("Please select a promo code")
      return
    }
    setPromoCodeLoading(true)
    setPromoCodeError("")

    try {
      const promoCode = promoCodes.find((code) => code.code === selectedPromoCodeCode)
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

      // Welcome promo logic
      if (promoCode.code.toUpperCase().includes("WELCOME")) {
        const userExists = await checkUserExists(phoneNumber)
        if (userExists) {
          setPromoCodeError("Welcome codes are only for new users")
          return
        }
      }

      let discount = 0
      if (promoCode.discountType === "percentage") {
        discount = (totalAmount * promoCode.discountValue) / 100
      } else if (promoCode.discountType === "fixed") {
        discount = promoCode.discountValue
      }
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
    setSelectedPromoCodeCode("")
    setPromoCodeError("")
  }

  const getAvailablePromoCodes = () => {
    return promoCodes.filter((code) => {
      if (!code.isActive) return false
      const currentDate = new Date()
      const validFrom = new Date(code.validFrom)
      const validUntil = new Date(code.validUntil)
      if (currentDate < validFrom || currentDate > validUntil) return false
      if (code.usedCount >= code.maxUsage) return false
      return true
    })
  }

  return (
    <div className="space-y-4">
      <h5 className="font-bold text-xl text-gray-800">Promo Code</h5>

      {!appliedPromoCode ? (
        <div className="space-y-4">
          <div>
            <label htmlFor="promo-code-select" className="block text-sm font-medium text-gray-700 mb-2">
              Select Promo Code
            </label>

            <div className="relative">
              <select
                id="promo-code-select"
                value={selectedPromoCodeCode}
                onChange={(e) => setSelectedPromoCodeCode(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 bg-white text-gray-800 text-sm sm:text-base transition-all duration-200"
              >
                <option value="">Choose a promo code</option>

                {getAvailablePromoCodes().map((code) => (
                  <option key={code._id} value={code.code}>
                    {code.code}  {/* Only promo code name */}
                  </option>
                ))}
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {getAvailablePromoCodes().length === 0 && (
              <p className="text-sm text-gray-500 mt-2">No promo codes available at the moment</p>
            )}
          </div>

          <button
            type="button"
            onClick={handleApplyPromoCode}
            disabled={!selectedPromoCodeCode || promoCodeLoading || !phoneNumber}
            className="w-full px-4 sm:px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 ease-in-out text-sm sm:text-base"
          >
            {promoCodeLoading ? "Applying..." : "Apply Promo Code"}
          </button>

          {!phoneNumber && (
            <p className="text-xs text-orange-600 font-medium mt-2">
              Please enter phone number to apply promo codes
            </p>
          )}

          {promoCodeError && (
            <div className="text-red-500 text-sm font-medium mt-2">{promoCodeError}</div>
          )}
        </div>
      ) : (
        <div className="bg-green-50 p-4 sm:p-5 rounded-xl border border-green-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex-1">
            <p className="font-bold text-base sm:text-lg text-green-800">{appliedPromoCode.code}</p>
            <p className="text-sm text-green-700">
              {appliedPromoCode.discountValue}
              {appliedPromoCode.discountType === "percentage" ? "%" : "₹"} discount applied
            </p>
            <p className="text-sm text-green-700 font-semibold mt-1">You saved ₹{discountAmount.toFixed(2)}</p>
          </div>

          <button
            type="button"
            onClick={handleRemovePromoCode}
            className="text-red-500 hover:text-red-700 text-sm font-semibold transition-colors duration-200 px-3 py-1 rounded border border-red-200 hover:bg-red-50"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  )
}

export default PromoCodeSection
