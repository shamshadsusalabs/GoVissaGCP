import { useState } from 'react';
import { FiSearch, FiCalendar, FiUser, FiChevronDown, FiArrowRight,  } from 'react-icons/fi';

const FlightBookingUI = () => {
  const [activeTab, setActiveTab] = useState('Domestic');
  const [tripType, setTripType] = useState('Round Trip');
  const [region, setRegion] = useState('International/China, Hong Kong, Macao and Taiwan');
  const [departure, setDeparture] = useState('SHA - Shanghai');
  const [destination, setDestination] = useState('TYO - Tokyo');
  const [departureDate, setDepartureDate] = useState('2023-11-15');
  const [returnDate, setReturnDate] = useState('2023-11-22');
  const [directOnly, setDirectOnly] = useState(false);
  const [flightClass, setFlightClass] = useState('Economy');
  const [passengers] = useState({
    adults: 1,
    children: 0,
    infants: 0
  });

  const tabs = [
    'Domestic',
    'Special Flight Deals',
    'Flight Status',
    'Online Seat Selection',
    'Refund and Rebooking',
    'More Services'
  ];

  const tripTypes = ['One Way', 'Round Trip', 'Multi-pass'];
  const flightClasses = ['Economy', 'Extra Economy', 'Premium Economy', 'Business', 'First'];

  return (
    <div className=" bg-white font-sans ml-[200px] max-w-[1400px]">
    

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="overflow-x-auto">
          <div className="flex space-x-1 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === tab
                    ? 'bg-white text-blue-600 border-t-2 border-blue-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Search Panel */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Trip Type Selector */}
          <div className="flex mb-6">
            {tripTypes.map((type) => (
              <button
                key={type}
                onClick={() => setTripType(type)}
                className={`px-4 py-2 text-sm font-medium mr-2 rounded-full ${
                  tripType === type
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Search Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-4">
            {/* Region Selector */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Region</label>
              <div className="relative">
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white pr-8"
                >
                  <option>International/China, Hong Kong, Macao and Taiwan</option>
                  <option>Domestic (Mainland China)</option>
                  <option>Asia Pacific</option>
                  <option>Europe</option>
                  <option>Americas</option>
                </select>
                <FiChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Departure */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Departure</label>
              <div className="relative">
                <select
                  value={departure}
                  onChange={(e) => setDeparture(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white pr-8"
                >
                  <option>SHA - Shanghai</option>
                  <option>PEK - Beijing</option>
                  <option>CAN - Guangzhou</option>
                  <option>SZX - Shenzhen</option>
                  <option>TYO - Tokyo</option>
                  <option>SEL - Seoul</option>
                </select>
                <FiChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex items-center justify-center lg:col-span-1">
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600">
                <FiArrowRight className="transform rotate-90" />
              </button>
            </div>

            {/* Destination */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Destination</label>
              <div className="relative">
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white pr-8"
                >
                  <option>TYO - Tokyo</option>
                  <option>SHA - Shanghai</option>
                  <option>PEK - Beijing</option>
                  <option>HKG - Hong Kong</option>
                  <option>SIN - Singapore</option>
                  <option>BKK - Bangkok</option>
                </select>
                <FiChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Departure Date */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Departure Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white pr-8"
                />
                <FiCalendar className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Return Date */}
            {tripType === 'Round Trip' && (
              <div className="lg:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Return Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white pr-8"
                  />
                  <FiCalendar className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            )}

            {/* Direct Flights Toggle */}
            <div className="flex items-center lg:col-span-2">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={directOnly}
                  onChange={() => setDirectOnly(!directOnly)}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-700">Direct flights only</span>
              </label>
            </div>

            {/* Flight Class */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Class</label>
              <div className="relative">
                <select
                  value={flightClass}
                  onChange={(e) => setFlightClass(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white pr-8"
                >
                  {flightClasses.map((fc) => (
                    <option key={fc}>{fc}</option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Passengers */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Passengers</label>
              <div className="relative">
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white pr-8"
                >
                  <option>{passengers.adults} adult{passengers.adults !== 1 ? 's' : ''}, {passengers.children} child{passengers.children !== 1 ? 'ren' : ''}, {passengers.infants} infant{passengers.infants !== 1 ? 's' : ''}</option>
                </select>
                <FiUser className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Search Button */}
            <div className="lg:col-span-2 flex items-end">
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center">
                <FiSearch className="mr-2" />
                Search Flights
              </button>
            </div>
          </div>
        </div>

        {/* Promo Banner */}
      
      </main>
    </div>
  );
};

export default FlightBookingUI;