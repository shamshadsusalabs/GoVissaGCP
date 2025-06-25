import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UploadDifficultyMeter from './UploadDifficultyMeter';
import UploadTimeMeter from './UploadTimeMeter';

// Define types for better type safety
interface CountryData {
  countryName: string;
  documentNames: string[];
  eligibility: string;
}

// Map document types to emojis
const DOCUMENT_ICONS: Record<string, string> = {
  'Photo': '📷',
  'Passport': '🛂',
  'Bank Statement': '🏦',
  'Visa': '✈️',
  'Flight Tickets': '🎫',
  'Hotel Booking': '🏨',
  'Insurance': '🛡️',
};

const VisaRequirements = () => {
  const { id: countryId } = useParams<{ id: string }>();
  const [countryData, setCountryData] = useState<CountryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        if (!countryId) {
          throw new Error('Country ID is missing');
        }

        const response = await fetch(
          `http://localhost:5000/api/configurations/country-details/${countryId}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch country data: ${response.status}`);
        }

        const data: CountryData = await response.json();
        setCountryData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCountryData();
  }, [countryId]);

  if (loading) {
    return <div className="p-6 max-w-5xl mx-auto text-center">Loading visa requirements...</div>;
  }

  if (error) {
    return <div className="p-6 max-w-5xl mx-auto text-red-500">Error: {error}</div>;
  }

  if (!countryData) {
    return <div className="p-6 max-w-5xl mx-auto">No visa requirements data available.</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 border-b-2 inline-block border-indigo-500">
        {countryData.countryName} Visa Requirements
      </h2>

      {/* Eligibility section */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Eligibility Requirements</h3>
        <p className="text-gray-700">{countryData.eligibility}</p>
      </div>

      {/* Documents section */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Required Documents</h3>
        <div className="flex flex-wrap gap-3 my-4">
          {countryData.documentNames.map((docName, index) => (
            <button
              key={index}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
            >
              <span>{DOCUMENT_ICONS[docName] || '📄'}</span>
              {docName}
            </button>
          ))}
        </div>
      </div>

      {/* Meters section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6">
        <UploadDifficultyMeter />
        <UploadTimeMeter />
      </div>

      <hr className="my-6" />
    </div>
  );
};

export default VisaRequirements;
