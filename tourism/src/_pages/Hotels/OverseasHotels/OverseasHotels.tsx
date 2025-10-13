import { useState } from 'react';
import { FiSearch, FiCalendar, FiUser,  FiCheck, FiHeadphones, FiBell } from 'react-icons/fi';

const HotelBookingUI = () => {
  const [destination, setDestination] = useState('Tokyo');
  const [checkInDate] = useState('April 22 (Today)');
  const [checkOutDate] = useState('April 23 (Tomorrow)');
  const [nights] = useState(1);
  const [roomGuests] = useState('1 room, 1 person');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStarFilter, setActiveStarFilter] = useState('');

  const starFilters = [
    { id: '2', label: 'Two-star (Diamond) and below' },
    { id: '3', label: 'Three-star (Diamond)' },
    { id: '4', label: 'Four-star (Diamond)' },
    { id: '5', label: 'Five-star (Diamond)' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 ml-[200px] max-w-[1400px]">
      {/* Hero Section with Background Image */}
      <div className="relative h-96 bg-blue-900 overflow-hidden">
        <div className="absolute inset-0 "></div>
        <img 
          src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
          alt="Resort view" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">Find Your Perfect Stay</h1>
        </div>
      </div>

      {/* Floating Search Card */}
      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-white rounded-xl shadow-xl p-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Destination Input */}
            <div className="col-span-1 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination/Hotel Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Check-in Date */}
            <div className="col-span-1 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
              <div className="relative">
                <input
                  type="text"
                  value={checkInDate}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white cursor-pointer"
                />
                <FiCalendar className="absolute right-3 top-3.5 text-gray-400" />
              </div>
            </div>

            {/* Nights Counter */}
            <div className="flex items-center justify-center">
              <div className="text-center bg-gray-100 rounded-full px-4 py-2">
                <span className="text-sm font-medium">{nights} night{nights !== 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* Check-out Date */}
            <div className="col-span-1 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
              <div className="relative">
                <input
                  type="text"
                  value={checkOutDate}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white cursor-pointer"
                />
                <FiCalendar className="absolute right-3 top-3.5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
            {/* Room & Guests Selector */}
            <div className="col-span-1 md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Room & Guests</label>
              <div className="relative">
                <input
                  type="text"
                  value={roomGuests}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white cursor-pointer"
                />
                <FiUser className="absolute right-3 top-3.5 text-gray-400" />
              </div>
            </div>

            {/* Search Input */}
            <div className="col-span-1 md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Airport, train station, hotel name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <FiSearch className="absolute right-3 top-3.5 text-gray-400" />
              </div>
            </div>

            {/* Search Button */}
            <div className="col-span-1 md:col-span-1 flex items-end">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center">
                <FiSearch className="mr-2" />
                Search
              </button>
            </div>
          </div>

          {/* Star Filters */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Star/Diamond Rating</h3>
            <div className="flex flex-wrap gap-2">
              {starFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveStarFilter(filter.id === activeStarFilter ? '' : filter.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition duration-200 ${
                    activeStarFilter === filter.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="text-center p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition duration-200">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <FiCheck className="text-blue-600 text-xl" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Accommodation Guarantee</h3>
            <p className="text-gray-600 text-sm">
              Verified listings with quality assurance for a worry-free stay.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="text-center p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition duration-200">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <FiHeadphones className="text-green-600 text-xl" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Professional Customer Service</h3>
            <p className="text-gray-600 text-sm">
              24/7 support from our dedicated hospitality experts.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="text-center p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition duration-200">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <FiBell className="text-red-600 text-xl" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Emergency Support</h3>
            <p className="text-gray-600 text-sm">
              Immediate assistance available whenever you need it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelBookingUI;