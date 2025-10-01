"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

type Payment = {
  _id: string
  orderId: string
  amount: number
  currency: string
  status: "paid" | "pending" | "failed"
  receipt: string
  visaId: string
  email: string,
  country: string
  phone: string
  selectedDate: string
  travellers: number
  webhookVerified: boolean
  createdAt: number
  updatedAt: string
  __v: number
  paidAt?: string
  paymentId?: string
  signature?: string
  // ✅ NEW: Promo code fields
  promoCode?: string
  promoCodeId?: string
  discountAmount?: number
  originalAmount?: string
  // ✅ NEW: Admin approval fields
  adminApproval?: {
    isApproved: boolean
    approvedBy?: string
    approvedAt?: string
    notes?: string
  }
  paymentType?: string
}

type PaymentWithStatus = Payment & {
  hasDocumentsUploaded?: boolean
}

const columnHelper = createColumnHelper<PaymentWithStatus>()

export default function PaymentHistory() {
  const navigate = useNavigate()
  const [data, setData] = useState<PaymentWithStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [globalFilter, setGlobalFilter] = useState("")
  const [statusLoading, setStatusLoading] = useState<{ [key: string]: boolean }>({})

  // Function to check document status for a payment
  const checkDocumentStatus = async (paymentId: string) => {
    if (!paymentId) return false

    try {
      setStatusLoading((prev) => ({ ...prev, [paymentId]: true }))
      const response = await fetch(`http://localhost:5000/api/VisaApplication/getbyPaymentID/${paymentId}`)

      // Handle 404 as "no documents uploaded" instead of error
      if (response.status === 404) {
        return false
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result.success === true
    } catch (err) {
      console.error("Error checking document status:", err)
      // Return false instead of throwing error to prevent UI breaking
      return false
    } finally {
      setStatusLoading((prev) => ({ ...prev, [paymentId]: false }))
    }
  }

  // Columns definition
  const columns = [
    columnHelper.accessor("paymentId", {
      header: "Payment ID",
      cell: (info) => <span className="font-medium text-gray-900">{info.getValue() || 'Offline'}</span>,
    }),
    columnHelper.accessor("country", {
      header: "Country",
      cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
    }),
    columnHelper.accessor("originalAmount", {
      header: "Original Amount",
      cell: (info) => {
        const originalAmount = info.getValue()
        if (!originalAmount) return <span className="text-gray-400">-</span>
        // Display exactly what backend sends - no calculation
        return (
          <span className="text-gray-600">
            ₹{originalAmount}
          </span>
        )
      },
    }),
    columnHelper.accessor("promoCode", {
      header: "Promo Code",
      cell: (info) => {
        const promoCode = info.getValue()
        return promoCode ? (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
            {promoCode}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        )
      },
    }),
    columnHelper.accessor("discountAmount", {
      header: "Discount",
      cell: (info) => {
        const discount = info.getValue()
        if (!discount || discount === 0) return <span className="text-gray-400">-</span>
        // Display exactly what backend sends - no calculation
        return (
          <span className="text-green-600 font-medium">
            ₹{discount}
          </span>
        )
      },
    }),
    columnHelper.accessor("amount", {
      header: "Final Amount",
      cell: (info) => (
        <span className="text-gray-900 font-semibold">
          ₹{info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Payment Status",
      cell: (info) => {
        const status = info.getValue()
        const statusStyles = {
          paid: "bg-green-100 text-green-800 border border-green-200",
          pending: "bg-amber-100 text-amber-800 border border-amber-200",
          failed: "bg-red-100 text-red-800 border border-red-200",
        }
        return <div className={`px-3 py-1 rounded-full text-sm capitalize ${statusStyles[status]}`}>{status}</div>
      },
    }),
    columnHelper.accessor("createdAt", {
      header: "Date",
      cell: (info) => (
        <span className="text-gray-600">
          {new Date(info.getValue() * 1000).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const payment = row.original
        const isLoading = statusLoading[payment.paymentId || ""]
        
        // Check if this is an offline/cash payment
        const isOfflinePayment = !payment.paymentId || payment.paymentId === 'Offline' || payment.paymentType === 'cash' || payment.paymentType === 'paylater'
        
        // Check payment approval status
        const isPaymentApproved = payment.status === 'paid' || 
          (payment.adminApproval && payment.adminApproval.isApproved === true)

        if (isLoading) {
          return (
            <div className="px-4 py-2 flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )
        }

        if (payment.hasDocumentsUploaded) {
          return (
            <button
              onClick={() => navigate(`/user-dashboard/Visatarcker/${payment.paymentId}`)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Check Status
            </button>
          )
        }

        // For offline payments, check if payment is approved first
        if (isOfflinePayment && !isPaymentApproved) {
          return (
            <div className="flex flex-col gap-1">
              <div className="px-3 py-1.5 bg-orange-100 text-orange-800 rounded-lg text-sm font-medium text-center border border-orange-200">
                ⏳ Pending Admin Approval
              </div>
              <span className="text-xs text-gray-500 text-center">Payment approval required</span>
            </div>
          )
        }

        // For online payments with failed status
        if (!isOfflinePayment && payment.status === 'failed') {
          return (
            <div className="flex flex-col gap-1">
              <div className="px-3 py-1.5 bg-red-100 text-red-800 rounded-lg text-sm font-medium text-center border border-red-200">
                ❌ Payment Failed
              </div>
              <span className="text-xs text-gray-500 text-center">Please pay first</span>
            </div>
          )
        }

        // For online payments with pending status
        if (!isOfflinePayment && payment.status === 'pending') {
          return (
            <div className="flex flex-col gap-1">
              <div className="px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium text-center border border-yellow-200">
                ⏳ Payment Pending
              </div>
              <span className="text-xs text-gray-500 text-center">Complete payment first</span>
            </div>
          )
        }

        // Show upload documents button only if payment is approved/paid
        return (
          <div className="flex flex-col gap-1">
            <button
              onClick={() => {
                // Build URL with promo code data if available
                let uploadUrl = `/user-dashboard/upload-documents/${payment.visaId}/${payment.travellers}/${payment.paymentId}/${payment.country}`
                
                // Add promo code data to URL if available
                if (payment.promoCode || payment.promoCodeId || payment.discountAmount || payment.originalAmount) {
                  const promoParams = new URLSearchParams()
                  if (payment.promoCode) promoParams.set('promoCode', payment.promoCode)
                  if (payment.promoCodeId) promoParams.set('promoCodeId', payment.promoCodeId)
                  if (payment.discountAmount) promoParams.set('discountAmount', payment.discountAmount.toString())
                  if (payment.originalAmount) promoParams.set('originalAmount', payment.originalAmount)
                  uploadUrl += `?${promoParams.toString()}`
                }
                
                console.log("🚀 Navigating to upload documents with URL:", uploadUrl)
                navigate(uploadUrl)
              }}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              📄 Upload Documents
            </button>
            <span className="text-xs text-gray-500 text-center">Documents Required</span>
          </div>
        )
      },
    }),
  ]

  const fetchPayments = async () => {
    try {
      // Get phone number from local storage user object
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      const phoneNumber = user.phoneNumber

      if (!phoneNumber) {
        throw new Error("Phone number not found in user data")
      }

      const response = await fetch(`http://localhost:5000/api/payments/by-phone/${phoneNumber}`)

      if (!response.ok) {
        throw new Error("Failed to fetch payment history")
      }

      const result = await response.json()

      // Check document status for each payment
      const paymentsWithStatus = await Promise.all(
        result.map(async (payment: Payment) => {
          if (payment.paymentId) {
            const hasDocuments = await checkDocumentStatus(payment.paymentId)
            return { ...payment, hasDocumentsUploaded: hasDocuments }
          }
          return { ...payment, hasDocumentsUploaded: false }
        }),
      )

      setData(paymentsWithStatus)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment history...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-red-800">Error loading payment history</h3>
          <p className="mt-2 text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>

        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search payments..."
            className="flex-grow p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50 border-b">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-100">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-100 transition-colors even:bg-gray-50/30">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.length === 0 && <div className="p-8 text-center text-gray-500">No payment records found</div>}
      </div>

      {data.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              ← Previous
            </button>
            <span className="text-sm text-gray-700 mx-2">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <button
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next →
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">Show:</span>
            <select
              className="p-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 shadow-sm"
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
            >
              {[5, 10, 20, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  )
}