import React from 'react';

interface ServiceCard {
  id: number;
  title: string;
  description: string;
  iconUrl: string;
  bgColor: string;
}

interface InsuranceCard {
  id: number;
  title: string;
  subtitle: string;
  note: string;
  iconUrl: string;
}

const Service: React.FC = () => {
  const corporateServices: ServiceCard[] = [
    {
      id: 1,
      title: 'Global Business Travel',
      description: 'Seamless travel solutions for corporate teams with 24/7 support.',
      iconUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=80&h=80&fit=crop',
      bgColor: 'bg-blue-100',
    },
    {
      id: 2,
      title: 'Expense Management',
      description: 'Streamlined expense tracking and reporting for business trips.',
      iconUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=80&h=80&fit=crop',
      bgColor: 'bg-orange-100',
    },
    {
      id: 3,
      title: 'Group Bookings',
      description: 'Hassle-free bookings for corporate groups and events.',
      iconUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=80&h=80&fit=crop',
      bgColor: 'bg-green-100',
    },
  ];

  const insuranceOptions: InsuranceCard[] = [
    {
      id: 1,
      title: 'Trip Cancellation',
      subtitle: 'Up to $5,000 coverage',
      note: 'Covers non-refunded expenses',
      iconUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=80&h=80&fit=crop',
    },
    {
      id: 2,
      title: 'Medical Emergency',
      subtitle: 'Up to $50,000 coverage',
      note: 'Includes hospital stays',
      iconUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd82d57df4?w=80&h=80&fit=crop',
    },
    {
      id: 3,
      title: 'Lost Baggage',
      subtitle: 'Up to $1,500 coverage',
      note: 'For checked luggage',
      iconUrl: 'https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=80&h=80&fit=crop',
    },
    {
      id: 4,
      title: 'Flight Delay',
      subtitle: 'Up to $500 coverage',
      note: 'For delays over 6 hours',
      iconUrl: 'https://images.unsplash.com/photo-1544198365-4566c5c75e13?w=80&h=80&fit=crop',
    },
    {
      id: 5,
      title: 'Personal Accident',
      subtitle: 'Up to $25,000 coverage',
      note: 'For injuries during travel',
      iconUrl: 'https://images.unsplash.com/photo-1580281658626-0f5a01c1cbab?w=80&h=80&fit=crop',
    },
    {
      id: 6,
      title: 'Rental Car Damage',
      subtitle: 'Up to $10,000 coverage',
      note: 'For rental vehicle damage',
      iconUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=80&h=80&fit=crop',
    },
    {
      id: 7,
      title: 'Travel Assistance',
      subtitle: '24/7 hotline support',
      note: 'Global emergency services',
      iconUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=80&h=80&fit=crop',
    },
    {
      id: 8,
      title: 'Trip Interruption',
      subtitle: 'Up to $3,000 coverage',
      note: 'For unexpected disruptions',
      iconUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=80&h=80&fit=crop',
    },
  ];

  return (
    <div className="ml-[200px] max-w-[1400px] p-6 space-y-8">
      {/* Corporate Travel Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Corporate Travel</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          {corporateServices.map((service: ServiceCard) => (
            <div
              key={service.id}
              className={`flex-1 p-4 rounded-lg shadow-md ${service.bgColor} hover:shadow-lg transition-shadow duration-300`}
            >
              <img
                src={service.iconUrl}
                alt={service.title}
                loading="lazy"
                className="w-10 h-10 mb-3 object-cover rounded-full"
              />
              <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{service.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Ctrip Travel Insurance Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Ctrip Travel Insurance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {insuranceOptions.map((insurance: InsuranceCard) => (
            <div
              key={insurance.id}
              className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center mb-3">
                <img
                  src={insurance.iconUrl}
                  alt={insurance.title}
                  loading="lazy"
                  className="w-6 h-6 object-cover rounded-full"
                />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">{insurance.title}</h3>
              <p className="text-xs text-gray-600 mt-1">{insurance.subtitle}</p>
              <p className="text-xs text-gray-500 mt-1 italic">{insurance.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Service;
