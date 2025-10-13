import React, { useState } from 'react';
import { FiSearch, FiMapPin, FiCalendar, FiUser, FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaSwimmingPool, FaWifi, FaParking, FaUtensils, FaRegHeart, FaHeart } from 'react-icons/fa';

const HotelBooking: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Shanghai');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [currentSlide, setCurrentSlide] = useState(0);

  const toggleFavorite = (hotelId: string) => {
    setFavorites(prev => ({
      ...prev,
      [hotelId]: !prev[hotelId]
    }));
  };

  const cities = ['Shanghai', 'Beijing', 'Guangzhou', 'Sanya', 'Chengdu'];
  
  const promotions = [
    {
      id: 1,
      title: "Summer Getaway Deals",
      subtitle: "Up to 40% off luxury resorts",
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: 2,
      title: "Weekend Special",
      subtitle: "Free breakfast for 2 nights stay",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    {
      id: 3,
      title: "Business Travel Package",
      subtitle: "Complimentary airport transfer",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    }
  ];

  const hotels = {
    Shanghai: [
      {
        id: 'sh1',
        name: "CitiGO Hotel Shanghai Jingan",
        location: "Jingan District",
        price: 120,
        rating: 4.8,
        reviews: 1245,
        amenities: ['pool', 'wifi', 'restaurant'],
        isAd: false,
        image: "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      },
      {
        id: 'sh2',
        name: "The PuLi Hotel and Spa",
        location: "Jingan District",
        price: 320,
        rating: 4.9,
        reviews: 892,
        amenities: ['pool', 'wifi', 'parking', 'restaurant', 'spa'],
        isAd: true,
        image: "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
      }
    ],
    Beijing: [
      {
        id: 'bj1',
        name: "The Peninsula Beijing",
        location: "Wangfujing",
        price: 280,
        rating: 4.7,
        reviews: 1023,
        amenities: ['pool', 'wifi', 'parking', 'restaurant'],
        isAd: false,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      }
    ],
    Guangzhou: [
      {
        id: 'gz1',
        name: "Four Seasons Guangzhou",
        location: "Tianhe District",
        price: 260,
        rating: 4.6,
        reviews: 756,
        amenities: ['pool', 'wifi', 'restaurant'],
        isAd: false,
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      }
    ],
    Sanya: [
      {
        id: 'sy1',
        name: "Raffles Hainan",
        location: "Sanya Bay",
        price: 350,
        rating: 4.9,
        reviews: 1245,
        amenities: ['pool', 'wifi', 'parking', 'restaurant', 'beach'],
        isAd: true,
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      }
    ],
    Chengdu: [
      {
        id: 'cd1',
        name: "The Temple House",
        location: "Taikoo Li",
        price: 220,
        rating: 4.8,
        reviews: 932,
        amenities: ['pool', 'wifi', 'restaurant', 'spa'],
        isAd: false,
        image: "https://images.unsplash.com/photo-1582719471387-9c060c5d0ab1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      }
    ]
  };

  const recommendedHotels = [
    {
      id: 'rec1',
      name: "The Ritz-Carlton Shanghai",
      price: 380,
      image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1932&q=80"
    },
    {
      id: 'rec2',
      name: "Bulgari Hotel Beijing",
      price: 420,
      image: "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
    },
    {
      id: 'rec3',
      name: "Capella Sanya",
      price: 450,
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === promotions.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? promotions.length - 1 : prev - 1));
  };

  return (
    <div className="ml-[200px] max-w-[1400px] p-6 space-y-8">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Find your perfect stay</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Destination */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination or Hotel Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMapPin className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Where are you going?"
                  className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Check-in */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="text-gray-400" />
                </div>
                <input
                  type="date"
                  className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Check-out */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="text-gray-400" />
                </div>
                <input
                  type="date"
                  className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Rooms & Guests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rooms & Guests</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <select className="pl-10 w-full p-3 border border-gray-200 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>1 room, 1 adult</option>
                  <option>1 room, 2 adults</option>
                  <option>2 rooms, 4 adults</option>
                </select>
              </div>
            </div>
            
            {/* Search Button */}
            <div className="flex items-end">
              <button className="bg-blue-600 hover:bg-blue-700 text-white w-full p-3 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-300">
                <FiSearch />
                <span>Search</span>
              </button>
            </div>
          </div>
          
          {/* Advanced Filters */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Class</label>
              <select className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Any class</option>
                <option>5 stars</option>
                <option>4 stars</option>
                <option>3 stars</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
              <input
                type="text"
                placeholder="Pool, beach, spa, etc."
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                + More filters
              </button>
            </div>
          </div>
        </div>
        
        {/* Promotion Carousel */}
        <div className="relative rounded-2xl overflow-hidden h-64 mb-8">
          {promotions.map((promo, index) => (
            <div 
              key={promo.id}
              className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            >
              <img
                src={promo.image}
                alt={promo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-center p-8">
                <div className="max-w-md">
                  <h3 className="text-2xl font-bold text-white mb-2">{promo.title}</h3>
                  <p className="text-white/90 mb-4">{promo.subtitle}</p>
                  <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-medium hover:bg-blue-50 transition-colors">
                    View Offer
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Carousel Controls */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
          >
            <FiChevronLeft className="text-gray-800" size={24} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
          >
            <FiChevronRight className="text-gray-800" size={24} />
          </button>
          
          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {promotions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Hotel Recommendations */}
          <div className="lg:w-2/3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Popular <span className="text-blue-600">Destinations</span>
              </h2>
            </div>
            
            {/* City Tabs */}
            <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
              {cities.map(city => (
                <button
                  key={city}
                  onClick={() => setActiveTab(city)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === city
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
            
            {/* Hotel Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hotels[activeTab as keyof typeof hotels]?.map((hotel) => (
                <div key={hotel.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="relative">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full h-48 object-cover"
                    />
                    <button 
                      onClick={() => toggleFavorite(hotel.id)}
                      className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                    >
                      {favorites[hotel.id] ? (
                        <FaHeart className="text-red-500" />
                      ) : (
                        <FaRegHeart className="text-gray-700" />
                      )}
                    </button>
                    {hotel.isAd && (
                      <div className="absolute bottom-3 left-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                        ADVERTISEMENT
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg text-gray-800">{hotel.name}</h4>
                      <div className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        <FiStar className="mr-1" />
                        {hotel.rating}
                      </div>
                    </div>
                    
                    <p className="text-gray-500 text-sm mb-3 flex items-center">
                      <FiMapPin className="mr-1" size={14} />
                      {hotel.location}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {hotel.amenities.includes('pool') && (
                        <span className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          <FaSwimmingPool className="mr-1" /> Pool
                        </span>
                      )}
                      {hotel.amenities.includes('wifi') && (
                        <span className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          <FaWifi className="mr-1" /> WiFi
                        </span>
                      )}
                      {hotel.amenities.includes('parking') && (
                        <span className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          <FaParking className="mr-1" /> Parking
                        </span>
                      )}
                      {hotel.amenities.includes('restaurant') && (
                        <span className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          <FaUtensils className="mr-1" /> Restaurant
                        </span>
                      )}
                      {hotel.amenities.includes('spa') && (
                        <span className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          💆 Spa
                        </span>
                      )}
                      {hotel.amenities.includes('beach') && (
                        <span className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          🏖️ Beach
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-500 text-xs">{hotel.reviews} reviews</p>
                        <p className="font-bold text-blue-600">${hotel.price} <span className="text-gray-500 text-sm font-normal">/ night</span></p>
                      </div>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Recommended Hotels Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Recommended for you</h3>
              
              <div className="space-y-4">
                {recommendedHotels.map(hotel => (
                  <div key={hotel.id} className="flex gap-4 items-center">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-gray-800">{hotel.name}</h4>
                      <p className="text-blue-600 font-bold">${hotel.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 relative rounded-lg overflow-hidden h-40">
                <img
                  src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Scenic view"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <p className="text-white font-medium">Beautiful Sanya Beach Resorts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelBooking;