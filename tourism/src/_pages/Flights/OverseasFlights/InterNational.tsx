import { FiCalendar, FiMapPin, FiChevronRight, FiGlobe } from 'react-icons/fi';
import { FaUmbrellaBeach, FaCity } from 'react-icons/fa';
import { useState } from 'react';

const InterNational = () => {
  const [departure, setDeparture] = useState('Delhi (DEL)');

  const categories = [
    {
      title: 'Asian Getaways',
      icon: <FiGlobe className="text-white" size={20} />,
      theme: 'bg-purple-600',
      deals: [
        {
          rank: 1,
          image: 'https://images.unsplash.com/photo-1538970272646-f61fabb3bfdf?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
          route: 'Delhi ⇌ Bangkok',
          price: '₹12,499',
          dates: '2025-05-04 to 2025-05-11',
          discount: '35% off'
        },
        {
          rank: 2,
          image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
          route: 'Mumbai ⇌ Singapore',
          price: '₹15,799',
          dates: '2025-05-15 to 2025-05-22',
          discount: '28% off'
        },
        {
          rank: 3,
          image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
          route: 'Bangalore ⇌ Kuala Lumpur',
          price: '₹14,299',
          dates: '2025-05-25 to 2025-06-01',
          discount: '32% off'
        },
        {
          rank: 4,
          image: 'https://images.unsplash.com/photo-1553826059-7a090c4bd362?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
          route: 'Chennai ⇌ Colombo',
          price: '₹9,999',
          dates: '2025-06-05 to 2025-06-12',
          discount: '40% off'
        },
        {
          rank: 5,
          image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
          route: 'Hyderabad ⇌ Dubai',
          price: '₹18,499',
          dates: '2025-06-15 to 2025-06-22',
          discount: '25% off'
        }
      ]
    },
    {
      title: 'European Escapes',
      icon: <FaCity className="text-white" size={20} />,
      theme: 'bg-blue-600',
      deals: [
        {
          rank: 1,
          image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
          route: 'Delhi ⇌ Paris',
          price: '₹42,999',
          dates: '2025-05-10 to 2025-05-20',
          discount: '20% off'
        },
        {
          rank: 2,
          image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
          route: 'Mumbai ⇌ London',
          price: '₹45,499',
          dates: '2025-05-20 to 2025-05-30',
          discount: '18% off'
        },
        {
          rank: 3,
          image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
          route: 'Bangalore ⇌ Rome',
          price: '₹47,899',
          dates: '2025-06-01 to 2025-06-11',
          discount: '15% off'
        },
        {
          rank: 4,
          image: 'https://images.unsplash.com/photo-1503917988258-f87a78e3c995?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
          route: 'Chennai ⇌ Amsterdam',
          price: '₹44,299',
          dates: '2025-06-10 to 2025-06-20',
          discount: '22% off'
        },
        {
          rank: 5,
          image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
          route: 'Hyderabad ⇌ Zurich',
          price: '₹49,999',
          dates: '2025-06-15 to 2025-06-25',
          discount: '12% off'
        }
      ]
    },
    {
      title: 'Tropical Paradises',
      icon: <FaUmbrellaBeach className="text-white" size={20} />,
      theme: 'bg-green-600',
      deals: [
        {
          rank: 1,
          image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
          route: 'Delhi ⇌ Maldives',
          price: '₹22,999',
          dates: '2025-05-05 to 2025-05-12',
          discount: '30% off'
        },
        {
          rank: 2,
          image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
          route: 'Mumbai ⇌ Bali',
          price: '₹28,499',
          dates: '2025-05-15 to 2025-05-22',
          discount: '25% off'
        },
        {
          rank: 3,
          image: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
          route: 'Bangalore ⇌ Phuket',
          price: '₹19,799',
          dates: '2025-05-25 to 2025-06-01',
          discount: '35% off'
        },
        {
          rank: 4,
          image: 'https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
          route: 'Chennai ⇌ Mauritius',
          price: '₹32,999',
          dates: '2025-06-05 to 2025-06-12',
          discount: '20% off'
        },
        {
          rank: 5,
          image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
          route: 'Hyderabad ⇌ Seychelles',
          price: '₹38,499',
          dates: '2025-06-15 to 2025-06-22',
          discount: '15% off'
        }
      ]
    }
  ];

  return (
    <div className="font-sans bg-gray-50 p-4 md:p-8 max-w-7xl mx-auto ml-[200px] max-w-[1400px]">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Overseas Flight Deals</h2>
          <p className="text-gray-600">Best international flight deals from your city</p>
        </div>
        
        <div className="flex items-center w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0 md:w-64 mr-4">
            <FiMapPin className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Departure from..."
            />
          </div>
          <a href="#" className="flex items-center text-blue-600 font-medium whitespace-nowrap">
            More destinations <FiChevronRight className="ml-1" />
          </a>
        </div>
      </div>

      {/* Deal Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {/* Category Header */}
            <div className={`${category.theme} p-4 flex items-center`}>
              <div className="bg-white bg-opacity-20 p-2 rounded-lg mr-3">
                {category.icon}
              </div>
              <h3 className="text-xl font-semibold text-white">{category.title}</h3>
            </div>
            
            {/* Deal List */}
            <div className="divide-y divide-gray-100">
              {category.deals.map((deal, dealIndex) => (
                <div key={dealIndex} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex">
                    {/* Rank Badge */}
                    <div className="flex-shrink-0 mr-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
                        deal.rank === 1 ? 'bg-yellow-500 text-white' : 
                        deal.rank === 2 ? 'bg-gray-300 text-gray-800' : 
                        deal.rank === 3 ? 'bg-amber-700 text-white' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {deal.rank}
                      </div>
                    </div>
                    
                    {/* Deal Content */}
                    <div className="flex-grow">
                      <div className="flex">
                        {/* Destination Image */}
                        <div className="w-16 h-16 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                          <img 
                            src={deal.image} 
                            alt={deal.route} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-grow">
                          {/* Route */}
                          <div className="flex items-center mb-1">
                            <span className="font-medium text-gray-800">{deal.route}</span>
                          </div>
                          
                          {/* Price */}
                          <div className="flex items-baseline mb-1">
                            <span className="text-lg font-bold text-gray-900 mr-2">{deal.price}</span>
                            {deal.discount && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                {deal.discount}
                              </span>
                            )}
                          </div>
                          
                          {/* Dates */}
                          <div className="text-xs text-gray-500 flex items-center">
                            <FiCalendar className="mr-1" size={12} />
                            {deal.dates}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterNational;