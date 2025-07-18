import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaPassport, FaGavel, FaExclamationTriangle, FaInfoCircle, FaClock, FaCheckCircle } from 'react-icons/fa';

interface RejectionReason {
  id: string;
  reason: string;
  description: string;
  frequency: string;
}

const getReasonIcon = (reason: string) => {
  switch (reason) {
    case 'Expired Passport':
      return <FaPassport className="text-2xl text-red-500" />;
    case 'Criminal Record':
      return <FaGavel className="text-2xl text-red-500" />;
    case 'Previous Visa Violations':
      return <FaExclamationTriangle className="text-2xl text-red-500" />;
    default:
      return <FaInfoCircle className="text-2xl text-red-500" />;
  }
};

const getFrequencyBadge = (frequency: string) => {
  const freqLower = frequency.toLowerCase();
  if (freqLower.includes('common')) {
    return <span className="ml-2 px-2.5 py-0.5 bg-red-100 text-red-800 text-xs font-semibold rounded-full">Common</span>;
  } else if (freqLower.includes('occasional')) {
    return <span className="ml-2 px-2.5 py-0.5 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full">Occasional</span>;
  } else if (freqLower.includes('rare')) {
    return <span className="ml-2 px-2.5 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">Rare</span>;
  }
  return <span className="ml-2 px-2.5 py-0.5 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full">{frequency}</span>;
};

const VisaRejectionReasons: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [reasons, setReasons] = useState<RejectionReason[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRejectionReasons = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        const response = await fetch(`http://localhost:5000/api/configurations/rejections/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch rejection reasons');
        }
        const data = await response.json();
        setReasons(data.rejectionReasons || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRejectionReasons();
    }
  }, [id]);

  if (loading) {
    return (
      <section className="bg-gray-50 py-16 px-6 min-h-[300px] flex items-center justify-center">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center mb-4 w-16 h-16 bg-blue-50 rounded-full animate-pulse">
            <FaClock className="text-3xl text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Loading visa rejection reasons</h3>
          <p className="text-gray-500">Please wait while we fetch the data...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gray-50 py-16 px-6 min-h-[300px] flex items-center justify-center">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center mb-4 w-16 h-16 bg-red-50 rounded-full">
            <FaExclamationTriangle className="text-3xl text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Error loading data</h3>
          <p className="text-red-500 max-w-md mx-auto">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (reasons.length === 0) {
    return (
      <section className="bg-gray-50 py-16 px-6 min-h-[300px] flex items-center justify-center">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center mb-4 w-16 h-16 bg-blue-50 rounded-full">
            <FaInfoCircle className="text-3xl text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No rejection reasons found</h3>
          <p className="text-gray-500">There are no rejection reasons configured for this visa type.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Visa Rejection Reasons</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Understanding common factors that can lead to visa rejection and how to avoid them
          </p>
        </div>

        <div className="space-y-4 mb-10">
          {reasons.map((reason) => (
            <div 
              key={reason.id} 
              className="flex items-start gap-5 p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="mt-1 flex-shrink-0">
                {getReasonIcon(reason.reason)}
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <h3 className="font-semibold text-gray-900 text-lg">{reason.reason}</h3>
                  {getFrequencyBadge(reason.frequency)}
                </div>
                <p className="text-gray-600 mt-2 leading-relaxed">{reason.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
          <div className="flex items-start gap-3">
            <FaCheckCircle className="text-xl text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-800 text-lg mb-3">Tips to avoid rejection</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-200 text-blue-800 rounded-full text-xs mt-0.5 flex-shrink-0">1</span>
                  <span className="text-gray-700">Ensure all documents are valid and not expired</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-200 text-blue-800 rounded-full text-xs mt-0.5 flex-shrink-0">2</span>
                  <span className="text-gray-700">Provide complete and accurate information in your application</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-200 text-blue-800 rounded-full text-xs mt-0.5 flex-shrink-0">3</span>
                  <span className="text-gray-700">Apply well in advance of your travel date</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-200 text-blue-800 rounded-full text-xs mt-0.5 flex-shrink-0">4</span>
                  <span className="text-gray-700">Double-check all requirements before submitting</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisaRejectionReasons;