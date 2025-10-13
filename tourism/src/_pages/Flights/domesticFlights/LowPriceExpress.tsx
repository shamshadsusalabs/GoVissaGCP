import { FiCalendar, FiMapPin, FiChevronRight } from 'react-icons/fi';
import { FaUmbrellaBeach, FaMountain } from 'react-icons/fa';
import { useState } from 'react';

const LowPriceExpress = () => {
  const [departure, setDeparture] = useState('Delhi (DEL)');

  const categories = [
    {
      title: 'Weekend Getaways',
      icon: <FiCalendar className="text-white" size={20} />,
      theme: 'bg-green-600',
      deals: [
        {
          rank: 1,
          image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
          route: 'Del... ⇌ Mumbai',
          price: '₹1,425',
          dates: '2025-05-04 to 2025-05-07',
          discount: '54% off'
        },
        {
          rank: 2,
          image: 'https://images.unsplash.com/photo-1524492412937-b33874b7bdd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
          route: 'Ban... ⇌ Goa',
          price: '₹2,199',
          dates: '2025-05-11 to 2025-05-14',
          discount: '48% off'
        },
        {
          rank: 3,
          image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
          route: 'Mum... ⇌ Jaipur',
          price: '₹1,899',
          dates: '2025-05-18 to 2025-05-21',
          discount: '42% off'
        },
        {
          rank: 4,
          image: 'https://images.unsplash.com/photo-1582972236019-ea9eab4b8965?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
          route: 'Hyd... ⇌ Pune',
          price: '₹2,499',
          dates: '2025-05-25 to 2025-05-28',
          discount: '35% off'
        },
        {
          rank: 5,
          image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
          route: 'Che... ⇌ Kolkata',
          price: '₹2,799',
          dates: '2025-06-01 to 2025-06-04',
          discount: '30% off'
        }
      ]
    },
    {
      title: 'Nature & Mountains',
      icon: <FaMountain className="text-white" size={20} />,
      theme: 'bg-orange-600',
      deals: [
        {
          rank: 1,
          image: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
          route: 'Del... ⇌ Shimla',
          price: '₹3,425',
          dates: '2025-05-05 to 2025-05-09',
          discount: '52% off'
        },
        {
          rank: 2,
          image: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
          route: 'Mum... ⇌ Manali',
          price: '₹4,199',
          dates: '2025-05-12 to 2025-05-16',
          discount: '45% off'
        },
        {
          rank: 3,
          image: 'https://images.unsplash.com/photo-1605540436563-5bca919ae766?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
          route: 'Ban... ⇌ Darjeeling',
          price: '₹3,899',
          dates: '2025-05-19 to 2025-05-23',
          discount: '40% off'
        },
        {
          rank: 4,
          image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
          route: 'Hyd... ⇌ Gangtok',
          price: '₹4,499',
          dates: '2025-05-26 to 2025-05-30',
          discount: '38% off'
        },
        {
          rank: 5,
          image: 'https://images.unsplash.com/photo-1513415277900-a62401e19be4?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
          route: 'Che... ⇌ Nainital',
          price: '₹3,799',
          dates: '2025-06-02 to 2025-06-06',
          discount: '32% off'
        }
      ]
    },
    {
      title: 'Beach & Coastal Trips',
      icon: <FaUmbrellaBeach className="text-white" size={20} />,
      theme: 'bg-blue-600',
      deals: [
        {
          rank: 1,
          image: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
          route: 'Del... ⇌ Goa',
          price: '₹2,725',
          dates: '2025-05-06 to 2025-05-10',
          discount: '58% off'
        },
        {
          rank: 2,
          image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
          route: 'Mum... ⇌ Kochi',
          price: '₹3,199',
          dates: '2025-05-13 to 2025-05-17',
          discount: '50% off'
        },
        {
          rank: 3,
          image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
          route: 'Ban... ⇌ Andamans',
          price: '₹5,899',
          dates: '2025-05-20 to 2025-05-24',
          discount: '44% off'
        },
        {
          rank: 4,
          image: 'https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
          route: 'Hyd... ⇌ Puducherry',
          price: '₹2,999',
          dates: '2025-05-27 to 2025-05-31',
          discount: '39% off'
        },
        {
          rank: 5,
          image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
          route: 'Che... ⇌ Lakshadweep',
          price: '₹6,799',
          dates: '2025-06-03 to 2025-06-07',
          discount: '28% off'
        }
      ]
    }
  ];

  return (
    <div className="font-sans bg-gray-50 p-4 md:p-8 max-w-7xl mx-auto ml-[200px] max-w-[1400px]">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Low Price Express</h2>
          <p className="text-gray-600">Best flight deals from your city</p>
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

export default LowPriceExpress;