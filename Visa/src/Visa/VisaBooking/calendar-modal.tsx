"use client"

import type React from "react"
import { useState } from "react"

interface CalendarModalProps {
  selectedDate: string
  onSelectDate: (date: Date) => void
  onClose: () => void
  error: string | null
}

const CalendarModal: React.FC<CalendarModalProps> = ({ selectedDate, onSelectDate, onClose, error }) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [displayMonth, setDisplayMonth] = useState(today.getMonth())
  const [displayYear, setDisplayYear] = useState(today.getFullYear())

  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(displayYear, displayMonth, 1).getDay()

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

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-200 transform scale-100 animate-fade-in">
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Select Appointment Date</h3>
          <div className="flex justify-between items-center mb-6">
            <button
              className="p-3 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-700 text-xl"
              onClick={() => handleMonthChange(-1)}
            >
              &lt;
            </button>
            <span className="font-bold text-xl text-gray-900">
              {new Date(displayYear, displayMonth, 1).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button
              className="p-3 rounded-full hover:bg-gray-100 transition-colors duration-200 text-gray-700 text-xl"
              onClick={() => handleMonthChange(1)}
            >
              &gt;
            </button>
          </div>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-semibold text-sm text-gray-600">
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
                    onClick={() => onSelectDate(date)}
                    className={`p-3 rounded-full text-center aspect-square font-medium transition-all duration-200 ease-in-out ${
                      date.toDateString() === new Date(selectedDate).toDateString()
                        ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                        : date < today
                          ? "text-gray-400 cursor-not-allowed opacity-60"
                          : "hover:bg-blue-100 text-gray-800"
                    }`}
                    disabled={date < today}
                  >
                    {date.getDate()}
                  </button>
                ) : (
                  <div key={`${weekIndex}-${dayIndex}`} className="p-3"></div>
                ),
              ),
            )}
          </div>
        </div>
        {error && <div className="text-red-500 text-sm font-medium mb-6">{error}</div>}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export default CalendarModal
