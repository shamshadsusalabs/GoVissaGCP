"use client"
import type React from "react"
import { useState } from "react"

interface CalendarModalProps {
  selectedDate: string
  onSelectDate: (date: Date) => void
  onClose: () => void
  error: string | null
  processingTime: string
}

const CalendarModal: React.FC<CalendarModalProps> = ({
  selectedDate,
  onSelectDate,
  onClose,
  error,
  processingTime,
}) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [displayMonth, setDisplayMonth] = useState(today.getMonth())
  const [displayYear, setDisplayYear] = useState(today.getFullYear())
  const [showTimeline, setShowTimeline] = useState(false)

  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(displayYear, displayMonth, 1).getDay()

  // Calculate working days (excluding weekends)
  const calculateWorkingDays = (startDate: Date, workingDays: number): Date => {
    const currentDate = new Date(startDate)
    let addedDays = 0

    while (addedDays < workingDays) {
      currentDate.setDate(currentDate.getDate() + 1)
      // Skip weekends (Saturday = 6, Sunday = 0)
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        addedDays++
      }
    }
    return currentDate
  }

  // Extract working days from processing time
  const getWorkingDaysFromProcessingTime = (processingTime: string): number => {
    const match = processingTime.match(/(\d+)\s*working\s*days?/i)
    return match ? Number.parseInt(match[1]) : 3 // Default to 3 if not found
  }

  const workingDays = getWorkingDaysFromProcessingTime(processingTime)
  const estimatedCompletionDate = calculateWorkingDays(today, workingDays)

  const weeks: (Date | null)[][] = []
  let currentWeek: (Date | null)[] = Array(firstDayOfMonth).fill(null)

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(displayYear, displayMonth, day)
    currentWeek.push(date)
    if (currentWeek.length === 7 || day === daysInMonth) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }

  const handleMonthChange = (delta: number) => {
    const newDate = new Date(displayYear, displayMonth + delta, 1)
    setDisplayMonth(newDate.getMonth())
    setDisplayYear(newDate.getFullYear())
  }

  const isWorkingDay = (date: Date): boolean => {
    return date.getDay() !== 0 && date.getDay() !== 6
  }

  const TimelineView = () => (
    <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 mb-6">
      <h4 className="font-bold text-lg text-blue-800 mb-4 flex items-center">
        <span className="mr-2">📅</span>
        Processing Timeline
      </h4>
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <div>
            <p className="font-semibold text-gray-800">Today - Application Submission</p>
            <p className="text-sm text-gray-600">
              {today.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div>
            <p className="font-semibold text-gray-800">Estimated Processing Complete</p>
            <p className="text-sm text-gray-600">
              {estimatedCompletionDate.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              (typically {workingDays} working days)
            </p>
          </div>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg border border-yellow-300">
          <p className="text-sm text-yellow-800 font-medium">
            ⚠️ <strong>Important:</strong> We will process your application as quickly as possible, but actual processing time depends on the embassy:
          </p>
          <ul className="text-xs text-yellow-700 mt-2 ml-4 list-disc space-y-1">
            <li>Embassy workload and holidays</li>
            <li>Document verification requirements</li>
            <li>Individual case complexity</li>
            <li>Need for additional documents</li>
            <li>Some visas (like USA) may take up to 6 months</li>
          </ul>
        </div>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Select Travel Date</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <button
                onClick={() => setShowTimeline(false)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  !showTimeline
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Calendar View
              </button>
              <button
                onClick={() => setShowTimeline(true)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  showTimeline
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Timeline View
              </button>
            </div>

            {showTimeline ? (
              <TimelineView />
            ) : (
              <>
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <button
                    className="p-2 sm:p-3 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-700 text-lg sm:text-xl"
                    onClick={() => handleMonthChange(-1)}
                  >
                    &lt;
                  </button>
                  <span className="font-bold text-lg sm:text-xl text-gray-900">
                    {new Date(displayYear, displayMonth, 1).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <button
                    className="p-2 sm:p-3 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-700 text-lg sm:text-xl"
                    onClick={() => handleMonthChange(1)}
                  >
                    &gt;
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-3 sm:mb-4">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center font-semibold text-xs sm:text-sm text-gray-600">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-4 sm:mb-6">
                  {weeks.flatMap((week, weekIndex) =>
                    week.map((date, dayIndex) =>
                      date ? (
                        <button
                          key={`${weekIndex}-${dayIndex}`}
                          onClick={() => onSelectDate(date)}
                          className={`p-2 sm:p-3 rounded-full text-center aspect-square font-medium transition-all duration-200 ease-in-out relative text-sm sm:text-base ${
                            date.toDateString() === new Date(selectedDate).toDateString()
                              ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                              : date < today
                                ? "text-gray-400 cursor-not-allowed opacity-60"
                                : isWorkingDay(date)
                                  ? "hover:bg-blue-100 text-gray-800 border border-green-200"
                                  : "hover:bg-red-50 text-gray-600 border border-red-200"
                          }`}
                          disabled={date < today}
                          title={date < today ? "Past date" : isWorkingDay(date) ? "Working day" : "Weekend/Holiday"}
                        >
                          {date.getDate()}
                          {!isWorkingDay(date) && date >= today && (
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full"></div>
                          )}
                        </button>
                      ) : (
                        <div key={`${weekIndex}-${dayIndex}`} className="p-2 sm:p-3"></div>
                      ),
                    ),
                  )}
                </div>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 border border-green-200 rounded"></div>
                      <span>Working Days</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 border border-red-200 rounded relative">
                        <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                      </div>
                      <span>Weekends</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="bg-orange-50 p-3 sm:p-4 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-800 font-medium mb-2">
                📝 <strong>Please Note:</strong>
              </p>
              <ul className="text-xs text-orange-700 space-y-1 ml-4 list-disc">
                <li>
                  Your selected date is your <strong>preferred visa requirement date</strong>
                </li>
                <li>We will process your application as quickly as possible</li>
                <li>
                  However, actual processing time depends on the embassy's timeline
                </li>
                <li>Delays may occur due to embassy holidays or document issues</li>
                <li>Some countries (like USA) may take up to 6 months for visa processing</li>
              </ul>
            </div>
          </div>

          {error && <div className="text-red-500 text-sm font-medium mb-4 sm:mb-6">{error}</div>}

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 p-4 sm:p-6 pt-0">
            <button
              onClick={onClose}
              className="px-4 sm:px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-semibold text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="px-4 sm:px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold text-sm sm:text-base"
            >
              Confirm Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarModal