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
  const [selectedPromoCode, setSelectedPromoCode] = useState<string>("")
  const [promoCodeError, setPromoCodeError] = useState("")
  const [promoCodeLoading, setPromoCodeLoading] = useState(false)

  useEffect(() => {
    fetchPromoCodes()
  }, [])

  const fetchPromoCodes = async () => {
    try {
      const response = await fetch("https://govissa-872569311567.asia-south2.run.app/api/promocode/getAll")
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
      const response = await fetch("https://govissa-872569311567.asia-south2.run.app/api/User/check-user", {
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

      // Special check for WELCOME codes
      if (promoCode.code.toUpperCase().includes("WELCOME")) {
        const userExists = await checkUserExists(phoneNumber)
        if (userExists) {
          setPromoCodeError("Welcome codes are only for new users")
          return
        }
      }

      // Calculate discount
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const getPromoCodeDisplayText = (code: PromoCode) => {
    const discountText =
      code.discountType === "percentage" ? `${code.discountValue}% OFF` : `₹${code.discountValue} OFF`

    const usageText = `${code.usedCount}/${code.maxUsage} used`
    const expiryDate = new Date(code.validUntil).toLocaleDateString()

    return `${code.code} - ${discountText} (${usageText}, expires ${expiryDate})`
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
              {getAvailablePromoCodes().map((code) => (
                <option key={code._id} value={code.code}>
                  {getPromoCodeDisplayText(code)}
                </option>
              ))}
            </select>
            {getAvailablePromoCodes().length === 0 && (
              <p className="text-sm text-gray-500 mt-1">No promo codes available at the moment</p>
            )}
          </div>

          <button
            type="button"
            onClick={handleApplyPromoCode}
            disabled={!selectedPromoCode || promoCodeLoading || !phoneNumber}
            className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {promoCodeLoading ? "Applying..." : "Apply Promo Code"}
          </button>

          {!phoneNumber && <p className="text-xs text-orange-600">Please enter phone number to apply promo codes</p>}

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
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PromoCodeSection
