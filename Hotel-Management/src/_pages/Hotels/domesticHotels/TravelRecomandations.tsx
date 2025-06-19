import { useState } from 'react';
import { FiChevronDown, FiStar, FiUsers } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion'; // For animations

// Define interfaces for data structures
interface GroupTour {
  id: number;
  name: string;
  image: string;
  price: number;
  rating: number;
  travelers: number;
}

interface FlightDeal {
  id: number;
  route: string;
  price: number;
  discount: number;
  dates: string;
}

const TravelRecommendations: React.FC = () => {
  const [departureCity, setDepartureCity] = useState<string>('Mumbai');

  const groupTours: GroupTour[] = [
    {
      id: 1,
      name: '3-Day Kerala Backwaters & Alleppey Houseboat Tour',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
      price: 350,
      rating: 4.9,
      travelers: 1245,
    },
    {
      id: 2,
      name: '2-Day Ranthambore National Park Safari Adventure',
      image: 'https://images.unsplash.com/photo-1517649763966-7c8e2c12e7d1',
      price: 500,
      rating: 4.8,
      travelers: 987,
    },
    {
      id: 3,
      name: '4-Day Golden Triangle: Delhi, Agra & Jaipur Tour',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c',
      price: 650,
      rating: 4.7,
      travelers: 756,
    },
    {
      id: 4,
      name: '5-Day Goa Beaches & Culture Exploration',
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71fac224',
      price: 900,
      rating: 4.9,
      travelers: 1123,
    },
    {
      id: 5,
      name: '1-Day Taj Mahal & Agra Fort Private Tour',
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523',
      price: 250,
      rating: 4.6,
      travelers: 654,
    },
  ];

  const flightDeals: FlightDeal[] = [
    {
      id: 1,
      route: 'Mumbai ⇌ Delhi',
      price: 120,
      discount: 25,
      dates: 'Jun 15 - Jun 30',
    },
    {
      id: 2,
      route: 'Mumbai ⇌ Goa',
      price: 150,
      discount: 15,
      dates: 'Jun 10 - Jul 15',
    },
    {
      id: 3,
      route: 'Mumbai ⇌ Bengaluru',
      price: 100,
      discount: 30,
      dates: 'Jun 1 - Jun 30',
    },
    {
      id: 4,
      route: 'Mumbai ⇌ Kolkata',
      price: 90,
      discount: 20,
      dates: 'Jun 5 - Jul 10',
    },
    {
      id: 5,
      route: 'Mumbai ⇌ Chennai',
      price: 130,
      discount: 10,
      dates: 'Jun 20 - Jul 20',
    },
  ];

  const badgeColors: string[] = ['bg-red-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-yellow-500'];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 ml-[200px]">
      {/* Header with dropdown */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <h2 className="text-3xl font-bold text-gray-800">Top Travel Picks This Season</h2>
        <div className="relative">
          <select
            value={departureCity}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDepartureCity(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-lg pl-4 pr-10 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Kolkata">Kolkata</option>
            <option value="Chennai">Chennai</option>
          </select>
          <FiChevronDown className="absolute right-3 wonderfully-top-4 text-gray-500" />
        </div>
      </motion.div>

      {/* Two panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Group Tours */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-4 bg-indigo-600">
            <h3 className="text-lg font-semibold text-white">Best Group Tours This Season</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {groupTours.map((tour: GroupTour, index: number) => (
              <AnimatePresence key={tour.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full ${badgeColors[index]} flex items-center justify-center text-white font-bold`}>
                      {index + 1}
                    </div>
                    <img
                      src={tour.image}
                      alt={tour.name}
                      className="flex-shrink-0 w-16 h-16 rounded-lg object-cover shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{tour.name}</h4>
                      <div className="mt-2 flex items-center text-xs text-gray-500">
                        <FiStar className="text-yellow-400 mr-1" />
                        <span>{tour.rating} Rating</span>
                        <span className="mx-2">·</span>
                        <FiUsers className="mr-1" />
                        <span>{tour.travelers.toLocaleString()} Travelers</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <p className="text-lg font-bold text-indigo-600">From ${tour.price}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            ))}
          </div>
        </motion.div>

        {/* Right Panel - Flight Deals */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-4 bg-indigo-600">
            <h3 className="text-lg font-semibold text-white">Exclusive Flight Deals</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {flightDeals.map((deal: FlightDeal, index: number) => (
              <AnimatePresence key={deal.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full ${badgeColors[index]} flex items-center justify-center text-white font-bold`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">{deal.route}</h4>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                          Best Deal
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500">{deal.dates}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-indigo-600">${deal.price}</p>
                          {deal.discount && (
                            <p className="text-xs text-red-500">{deal.discount}% off</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TravelRecommendations;