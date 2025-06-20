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
      cell: (info) => <span className="font-medium text-gray-900">{info.getValue() || 'N/A'}</span>,
    }),
    columnHelper.accessor("country", {
      header: "Country",
      cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
    }),
    columnHelper.accessor("amount", {
      header: "Amount",
      cell: (info) => (
        <span className="text-gray-600">
          ₹{(info.getValue() / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
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

        return (
          <button
            onClick={() =>
              navigate(`/user-dashboard/upload-documents/${payment.visaId}/${payment.travellers}/${payment.paymentId}/${payment.country}`)
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upload Documents
          </button>
        )
      },
    }),
  ]

  useEffect(() => {
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
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
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