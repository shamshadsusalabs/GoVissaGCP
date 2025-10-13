import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface VisaType {
  name: string;
  code: string;
  category: string;
  details: {
    processingTime: string;
    processingMethod: string;
    visaFee: number;
    serviceFee: number;
    currency: string;
    validity: string;
    entries: string;
    stayDuration: string;
    interviewRequired: boolean;
    biometricRequired: boolean;
    notes: string;
  };
}

interface VisaConfiguration {
  country: string;
  countryCode: string;
  embassyLocation: string;
  visaTypes: VisaType[];
}

const VisaBookingCard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visaData, setVisaData] = useState<VisaConfiguration | null>(null);
  const [selectedDate, setSelectedDate] = useState("14 May 2025 at 01:48 AM");
  const [travellers, setTravellers] = useState(1);

useEffect(() => {
  const fetchVisaData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/configurations/getAll");
      if (!response.ok) {
        throw new Error("Failed to fetch visa data");
      }
      const result = await response.json();
      
      // Ensure we're working with the data array inside 'result'
      const visaConfigurations = result.data; // This is the array you need

      // Find the visa configuration for Dubai
      const dubaiVisa = visaConfigurations.find((item: VisaConfiguration) => item.country === "Dubai");

      if (!dubaiVisa) {
        throw new Error("Dubai visa configuration not found");
      }

      setVisaData(dubaiVisa);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  fetchVisaData();
}, []);



  const handleClick = () => {
    navigate("/PassportUpload");
  };

  const handleSelectDate = (date: string) => setSelectedDate(date);

  const handleTravellerChange = (delta: number) => {
    setTravellers((prev) => Math.max(1, prev + delta));
  };

  if (loading) {
    return <div className="text-center py-8">Loading visa information...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  if (!visaData || visaData.visaTypes.length === 0) {
    return <div className="text-center py-8">No visa data available</div>;
  }

  // Get the first visa type (assuming there's at least one)
  const visaType = visaData.visaTypes[0];
  const visaDetails = visaType.details;

  const visaDetailsCards = [
    { label: "Visa Type", value: visaType.name, icon: "📱" },
    { label: "Length of Stay", value: visaDetails.stayDuration, icon: "📅" },
    { label: "Validity", value: visaDetails.validity, icon: "⏱️" },
    { label: "Entry", value: visaDetails.entries, icon: "🚪" },
  ];

  const guaranteeOptions = [
    { date: "14 May 2025 at 01:48 AM", in: "in 4 days", selected: true },
    { date: "13 May 2025 at 11:48 AM", in: "in 3 days", selected: false },
  ];

  const governmentFee = visaDetails.visaFee;
  const atlysFee = visaDetails.serviceFee;
  const total = governmentFee * travellers;

  return (
    <div className="mx-auto p-4 grid md:grid-cols-2 gap-8 ml-[200px] max-w-[1400px]">
      {/* Left Panel - Visa Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{visaData.country} Visa Information</h2>
        
        {/* Visa Details Cards */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {visaDetailsCards.map((item, i) => (
            <div key={i} className="flex items-start space-x-3 bg-gray-50 rounded-lg p-3 border border-gray-100">
              <span className="text-2xl mt-1">{item.icon}</span>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">{item.label}</p>
                <p className="font-semibold text-gray-800">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Visa Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Processing Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Processing Time</p>
              <p className="font-medium">{visaDetails.processingTime}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Processing Method</p>
              <p className="font-medium">{visaDetails.processingMethod}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Interview Required</p>
              <p className="font-medium">{visaDetails.interviewRequired ? "Yes" : "No"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Biometric Required</p>
              <p className="font-medium">{visaDetails.biometricRequired ? "Yes" : "No"}</p>
            </div>
          </div>
        </div>

        {/* Guaranteed Visa Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
            Get a Guaranteed Visa on
          </h3>

          {guaranteeOptions.map((option, i) => (
            <div
              key={i}
              className={`border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center transition-all ${
                selectedDate === option.date 
                  ? "border-blue-500 bg-blue-50 shadow-blue-100 shadow-sm" 
                  : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
            >
              <div>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {option.in}
                </span>
                <p className="text-md font-medium text-gray-800 mt-2">{option.date}</p>
                <button className="text-xs text-blue-600 hover:text-blue-800 flex items-center mt-1">
                  <span className="mr-1">👁</span> View Timeline
                </button>
              </div>
              <button
                onClick={() => handleSelectDate(option.date)}
                className={`px-4 py-2 rounded-md text-sm font-medium mt-3 sm:mt-0 transition-colors ${
                  selectedDate === option.date
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {selectedDate === option.date ? "✓ Selected" : "Select"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Booking Summary */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
        {/* Guaranteed Date Banner */}
        <div className="bg-blue-600 text-white p-5">
          <p className="font-medium text-sm opacity-90">Visa guaranteed on</p>
          <h4 className="text-xl font-bold">{selectedDate}</h4>
        </div>

        <div className="p-6 space-y-6">
          {/* Travellers Counter */}
          <div className="flex justify-between items-center border-b pb-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl">👥</span>
              <span className="font-semibold text-gray-700">Travellers</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleTravellerChange(-1)}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                disabled={travellers <= 1}
              >
                −
              </button>
              <span className="font-medium w-6 text-center">{travellers}</span>
              <button
                onClick={() => handleTravellerChange(1)}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-3">
            <h5 className="font-medium text-gray-700">Price Details</h5>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Government fee</span>
              <span>{visaDetails.currency} {governmentFee.toLocaleString()} × {travellers}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Service Fees</span>
              <span className="text-green-600 font-medium">{visaDetails.currency} {atlysFee.toFixed(2)}</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              You pay {visaDetails.currency} {atlysFee.toFixed(2)} only when we deliver your visa on time
            </p>
          </div>

          {/* Protection Plan */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <span className="text-blue-600 text-lg">🛡</span>
              </div>
              <div>
                <h6 className="font-semibold text-gray-800">AtlysProtect</h6>
                <ul className="text-xs text-gray-600 space-y-1 mt-1">
                  <li className="flex items-center">
                    <span className="w-1 h-1 rounded-full bg-gray-500 mr-2"></span>
                    If Visa Delayed — <strong className="ml-1">No Service Fee</strong>
                  </li>
                  <li className="flex items-center">
                    <span className="w-1 h-1 rounded-full bg-gray-500 mr-2"></span>
                    If Rejected — <strong className="ml-1">100% Refund</strong>
                  </li>
                </ul>
              </div>
              <span className="text-green-600 font-bold text-sm ml-auto">Free</span>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <h6 className="font-semibold text-gray-800 mb-2">Important Notes</h6>
            <p className="text-xs text-gray-600">{visaDetails.notes}</p>
          </div>

          {/* Total Amount */}
          <div className="flex justify-between items-center pt-4 border-t">
            <span className="font-semibold text-gray-800">Total Amount</span>
            <div className="text-right">
              <p className="text-xs text-gray-500">Inclusive of all taxes</p>
              <p className="text-xl font-bold text-gray-900">
                {visaDetails.currency} {(total + atlysFee).toLocaleString()}
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <button 
            onClick={handleClick} 
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            Start Application
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisaBookingCard;