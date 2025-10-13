import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FaCalendarAlt, FaArrowRight, FaArrowLeft } from "react-icons/fa";

const DateSelection = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { selectedDate: initialDate, travellers, visaData } = location.state || {};
  
  const [selectedDate, setSelectedDate] = useState<string>(initialDate || "");
  const [showCalendar, setShowCalendar] = useState(false);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);

  useEffect(() => {
    if (!initialDate) {
      // Set default date to 14 days from now if not provided
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 14);
      setSelectedDate(formatDate(defaultDate));
    }

    // Generate available dates (next 30 days excluding weekends)
    const dates: Date[] = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      if (date.getDay() !== 0 && date.getDay() !== 6) { // Skip weekends
        dates.push(date);
      }
    }
    setAvailableDates(dates);
  }, []);

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleDateString("en-US", options);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(formatDate(date));
    setShowCalendar(false);
  };

  const handleContinue = () => {
    navigate(`/PassportUpload/${id}`, {
      state: {
        selectedDate,
        travellers,
        visaData
      }
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={handleBack}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <FaArrowLeft className="mr-2" />
              Back
            </button>
            <h2 className="text-2xl font-bold text-gray-800">Select Appointment Date</h2>
            <div className="w-8"></div> {/* Spacer for alignment */}
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Selected Date</h3>
              <button 
                onClick={() => setShowCalendar(!showCalendar)}
                className="flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <FaCalendarAlt className="mr-2" />
                {showCalendar ? 'Hide Calendar' : 'Change Date'}
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <p className="text-sm text-blue-600 mb-1">Your appointment is scheduled for</p>
              <p className="text-2xl font-bold text-blue-800">{selectedDate || "No date selected"}</p>
            </div>
          </div>

          {showCalendar && (
            <div className="mb-8 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Available Dates</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {availableDates.map((date, index) => (
                  <button
                    key={index}
                    onClick={() => handleDateSelect(date)}
                    className={`p-4 rounded-lg border transition-colors ${
                      formatDate(date) === selectedDate
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="font-medium">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    <div className="text-xl font-bold">{date.getDate()}</div>
                    <div className="text-sm">{date.toLocaleDateString('en-US', { month: 'short' })}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleContinue}
              disabled={!selectedDate}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Document Upload
              <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateSelection;