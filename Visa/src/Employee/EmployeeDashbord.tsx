"use client"

import { useState, useEffect } from "react"
import { User, Award, FileText, Hash } from "lucide-react"

interface EmployeeData {
  success: boolean
  employeeId: string
  name: string
  points: number
  totalVisas: number
}

export default function EmployeeDashboard() {
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        // Get employee ID from localStorage
        const employeeDataFromStorage = localStorage.getItem("employee")
        if (!employeeDataFromStorage) {
          setError("No employee data found in localStorage")
          setLoading(false)
          return
        }

        const employee = JSON.parse(employeeDataFromStorage)
        const employeeId = employee.id

        if (!employeeId) {
          setError("Employee ID not found")
          setLoading(false)
          return
        }

        const response = await fetch(`http://localhost:5000/api/employee/points/${employeeId}`)

        if (response.ok) {
          const data: EmployeeData = await response.json()
          setEmployeeData(data)
        } else {
          setError("Failed to fetch employee data")
        }
      } catch (err) {
        setError("Error fetching employee data")
        console.error("Error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchEmployeeData()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="w-8 h-8 border-3 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        <div className="text-lg text-gray-600">Loading employee data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-red-600 text-center">{error}</div>
      </div>
    )
  }

  if (!employeeData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-red-600 text-center">No employee data found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Dashboard</h1>
        <p className="text-gray-600">Welcome back, {employeeData.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-8">
        {/* Employee Name Card */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Employee Name</div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2 break-all">{employeeData.name}</div>
          <div className="text-sm text-gray-500">Current logged in employee</div>
        </div>

        {/* Employee ID Card */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
              <Hash className="w-5 h-5 text-gray-600" />
            </div>
            <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Employee ID</div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2 break-all">{employeeData.employeeId}</div>
          <div className="text-sm text-gray-500">Unique identifier</div>
        </div>

        {/* Points Card */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
              <Award className="w-5 h-5 text-gray-600" />
            </div>
            <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Points Earned</div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">{employeeData.points}</div>
          <div className="text-sm text-gray-500">Total reward points</div>
        </div>

        {/* Total Visas Card */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
              <FileText className="w-5 h-5 text-gray-600" />
            </div>
            <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Visas</div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-2">{employeeData.totalVisas}</div>
          <div className="text-sm text-gray-500">Visas processed</div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 max-w-2xl mx-auto">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Performance Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-600">Average Points per Visa:</span>
            <span className="text-sm font-bold text-gray-900">
              {employeeData.totalVisas > 0 ? (employeeData.points / employeeData.totalVisas).toFixed(1) : "0"}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-600">Status:</span>
            <span className="text-sm font-bold text-gray-900">
              {employeeData.points >= 100 ? "Excellent" : employeeData.points >= 50 ? "Good" : "Needs Improvement"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
