"use client"

import type React from "react"

interface CalendarModalProps {
  selectedDate: string
  onSelectDate: (date: Date) => void
  onClose: () => void
  error: string | null
}

const CalendarModal: React.FC<CalendarModalProps> = ({ selectedDate, onSelectDate, onClose, error }) => {
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

  const weeks: (Date | null)[][] = []
  let currentWeek: (Date | null)[] = Array(firstDayOfMonth).fill(null)

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day)
    currentWeek.push(date)

    if (currentWeek.length === 7 || day === daysInMonth) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Select Appointment Date</h3>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <button className="p-2 rounded hover:bg-gray-100">&lt;</button>
            <span className="font-medium">
              {new Date(currentYear, currentMonth, 1).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button className="p-2 rounded hover:bg-gray-100">&gt;</button>
          </div>
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-medium text-sm text-gray-500">
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
                    className={`p-2 rounded-full text-center ${
                      date.toDateString() === new Date(selectedDate).toDateString()
                        ? "bg-blue-500 text-white"
                        : date < today
                          ? "text-gray-300 cursor-not-allowed"
                          : "hover:bg-blue-100"
                    }`}
                    disabled={date < today}
                  >
                    {date.getDate()}
                  </button>
                ) : (
                  <div key={`${weekIndex}-${dayIndex}`} className="p-2"></div>
                ),
              ),
            )}
          </div>
        </div>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
            Cancel
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export default CalendarModal
