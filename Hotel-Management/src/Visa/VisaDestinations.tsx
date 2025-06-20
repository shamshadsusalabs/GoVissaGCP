import React, { useState, useEffect } from 'react';
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

interface Destination {
  id: string;
  country: string;
  countryCode: string;
  embassyLocation: string;
  visaTypes: VisaType[];
  createdAt: string;
  updatedAt: string;
  image?: string;
  capital?: string;
  price?: string;
  date?: string;
  time?: string;
  visasOnTime?: string;
  rating?: number;
  popularity?: string;
}

const VisaDestinations: React.FC = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const countryImages: Record<string, string> = {
    'Dubai': 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1587&q=80',
    'Thailand': 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=1587&q=80',
    'Japan': 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=1553&q=80',
    'Italy': 'https://images.unsplash.com/photo-1533676802871-eca1ae998cd5?auto=format&fit=crop&w=1631&q=80',
    'Brazil': 'https://images.unsplash.com/photo-1483729558440-46709d8a0e2a?auto=format&fit=crop&w=1674&q=80',
    'Australia': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1740&q=80',
    'Canada': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1632&q=80'
  };

  const filters = ['All', 'Short stay', 'Long stay', 'Business'];

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/configurations/getAll');
        if (!response.ok) throw new Error('Failed to fetch destinations');

        const result = await response.json();
        console.log('API Response:', result);

        const visaArray = Array.isArray(result.data) ? result.data : [];

        const transformedData = visaArray.map((item: any) => ({
          ...item,
          image: countryImages[item.country] || 'https://via.placeholder.com/400x256?text=Destination+Image',
          capital: item.embassyLocation,
          price: `${item.visaTypes[0]?.details.visaFee + item.visaTypes[0]?.details.serviceFee} ${item.visaTypes[0]?.details.currency}`,
          date: new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          time: new Date(item.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          visasOnTime: '50K+',
          rating: 4.5,
          popularity: 'High',
        }));

        setDestinations(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const filteredDestinations = activeFilter === 'All'
    ? destinations
    : destinations.filter(dest =>
        dest.visaTypes.some(type => type.category === activeFilter)
      );

  const handleClick = () => {
    navigate(`/visa-details`);
  };

  if (loading) return <div className="text-center py-10">Loading destinations...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="mx-auto p-6 ml-[200px] max-w-[1400px]">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Popular Visa Destinations</h2>
        <p className="text-gray-600">Find your perfect destination with our visa services</p>
      </div>

      <div className="flex space-x-3 mb-8 pb-3">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              activeFilter === filter ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDestinations.map((dest) => {
          const primaryVisaType = dest.visaTypes[0];
          return (
            <div
              key={dest.id}
              onClick={() => handleClick()}
              className="cursor-pointer bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-64">
                <img
                  src={dest.image}
                  alt={dest.country}
                  className="w-full h-full object-cover"
                  onError={(e) => ((e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x256?text=Destination+Image')}
                />
                <div className="absolute bottom-3 left-3 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                  {dest.visasOnTime}
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{dest.country}</h3>
                    <p className="text-gray-500">{dest.embassyLocation}</p>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">
                    {primaryVisaType ? `${primaryVisaType.details.visaFee + primaryVisaType.details.serviceFee} ${primaryVisaType.details.currency}` : 'N/A'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>🕒</span>{primaryVisaType?.details.processingTime || 'N/A'}
                  </div>
                  <div className="flex items-center gap-2">
                    <span>⭐</span>4.5/5
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🔥</span>High
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📍</span>{dest.countryCode}
                  </div>
                </div>
                <button className="w-full mt-auto bg-blue-600 text-white py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition">View Details</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VisaDestinations;
