import  { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaCheck, FaClock, FaFilter } from 'react-icons/fa';
import Header from './Header';

interface Destination {
  _id: string;
  name: string;
  image: string;
  processingTime: string;
  totalFee: number;
}

const VisaDestinations = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const timeFilters = ['All', '3 days', '7 days', '14 days', '30 days'];

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/configurations/visa-summaries');
        if (!response.ok) throw new Error('Failed to fetch destinations');
        const result = await response.json();
        setDestinations(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
    setActiveFilter('All');
  };

  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = searchQuery === '' || 
      dest.name.toLowerCase().includes(searchQuery);
    const matchesTimeFilter = activeFilter === 'All' || 
      dest.processingTime.includes(activeFilter);
    return matchesSearch && matchesTimeFilter;
  });

  const handleClick = (id: string) => {
    navigate(`/visa-details/${id}`);
  };

  if (loading) return (
    <div>
      <Header onSearch={handleSearch} />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Loading Visa Destinations...</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow overflow-hidden">
              <div className="h-64 bg-gray-200 animate-pulse"></div>
              <div className="p-6">
                <div className="h-8 w-3/4 bg-gray-200 rounded mb-4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div>
      <Header onSearch={handleSearch} />
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-red-500 text-2xl mb-4">⚠️ Error loading destinations</div>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <Header onSearch={handleSearch} />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {searchQuery ? `Results for "${searchQuery}"` : 'Visa Destinations'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {filteredDestinations.length} destinations found
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <div className="flex items-center text-gray-600 mr-2">
            <FaFilter className="mr-2" />
            <span className="text-sm font-medium">Processing Time:</span>
          </div>
          {timeFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center ${
                activeFilter === filter
                  ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter !== 'All' && <FaClock className="mr-1" size={12} />}
              {filter}
            </button>
          ))}
        </div>

        {filteredDestinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((dest) => (
              <div
                key={dest._id}
                onClick={() => handleClick(dest._id)}
                className="cursor-pointer bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => ((e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x256?text=Destination+Image')}
                  />
                  <div className="absolute bottom-4 left-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <FaCheck size={10} /> Popular
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{dest.name}</h3>
                      <p className="text-gray-500 flex items-center gap-1">
                        <FaMapMarkerAlt className="text-blue-500" size={12} />
                        {dest.name} Embassy
                      </p>
                    </div>
                    <span className="text-xl font-bold text-[#4A54F1]">
                      ₹{dest.totalFee.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                    <FaClock className="text-blue-500" />
                    <span>Processing: {dest.processingTime}</span>
                  </div>

                  <button className="w-full mt-auto bg-[#4A54F1] text-white py-3 rounded-lg text-sm font-medium transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-gray-500 text-xl mb-4">
              {searchQuery 
                ? `No destinations found for "${searchQuery}"`
                : 'No destinations found for this filter'}
            </div>
            <button 
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('All');
              }}
              className="px-6 py-2 bg-[#4A54F1] text-white rounded-full transition-colors"
            >
              Show All Destinations
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisaDestinations;