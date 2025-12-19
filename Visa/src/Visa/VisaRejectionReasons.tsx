import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaPassport, FaGavel, FaExclamationTriangle, FaInfoCircle, FaClock, FaMoneyBillWave, FaCalendarTimes } from 'react-icons/fa';

interface RejectionReason {
  id: string;
  reason: string;
  description: string;
  frequency: string;
}

const getReasonIcon = (reason: string) => {
  switch (reason) {
    case 'Expired Passport':
    case 'Invalid Passport':
      return <FaPassport className="text-2xl text-red-500" />;
    case 'Criminal Record':
    case 'Security Concerns':
      return <FaGavel className="text-2xl text-red-500" />;
    case 'Previous Visa Violations':
    case 'Previous Visa Rejections or Overstays':
      return <FaExclamationTriangle className="text-2xl text-red-500" />;
    case 'Insufficient Financial Proof':
      return <FaMoneyBillWave className="text-2xl text-red-500" />;
    case 'Passport Validity Issues':
      return <FaCalendarTimes className="text-2xl text-red-500" />;
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
        const response = await fetch(`https://govisaa-872569311567.asia-south2.run.app/api/configurations/rejections/${id}`);
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

  // Static common rejection reasons
  const COMMON_REASONS: RejectionReason[] = [
    {
      id: 'common1',
      reason: 'Invalid Passport',
      description: 'Damaged or expired passport.\n\nPassport not valid for the required duration beyond intended stay.',
      frequency: 'Common'
    },
    {
      id: 'common2',
      reason: 'Criminal Record or Security Concerns',
      description: 'Any criminal background, even if minor.\n\nBeing considered a risk to national security or public policy.',
      frequency: 'Common'
    },
    {
      id: 'common3',
      reason: 'Previous Visa Rejections or Overstays',
      description: 'Past refusals for the same or another country.\n\nHistory of overstaying or violating visa terms.',
      frequency: 'Common'
    },
    {
      id: 'common4',
      reason: 'Insufficient Financial Proof',
      description: 'Bank balance is too low to cover the trip.\n\nNo evidence of regular income or stable financial status.\n\nInconsistent or suspicious financial documents.',
      frequency: 'Common'
    }
  ];

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

  return (
    <section className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Visa Rejection Reasons</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Understanding common factors that can lead to visa rejection and how to avoid them
          </p>
        </div>

        {/* Dynamic rejection reasons */}
        {reasons.length > 0 && (
          <div className="space-y-4 mb-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">
              Country-Specific Rejection Reasons
            </h3>
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
                  <p className="text-gray-600 mt-2 leading-relaxed whitespace-pre-line">{reason.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Common rejection reasons */}
        <div className="space-y-4 mb-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 border-l-4 border-red-500 pl-3">
            Common Reasons for Visa Rejection
          </h3>
          {COMMON_REASONS.map((reason) => (
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
                <p className="text-gray-600 mt-2 leading-relaxed whitespace-pre-line">{reason.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Prevention tips */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
          <div className="flex items-start gap-4">
            <div className="bg-blue-200 p-2 rounded-lg mt-0.5">
              <FaInfoCircle className="text-xl text-blue-800" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-800 text-lg mb-3">How to Avoid Visa Rejection</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="inline-flex items-center justify-center w-6 h-6 bg-blue-200 text-blue-800 rounded-full text-xs mt-0.5 flex-shrink-0">1</div>
                  <span className="text-gray-700">Ensure your passport is valid for at least 6 months beyond your travel dates</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="inline-flex items-center justify-center w-6 h-6 bg-blue-200 text-blue-800 rounded-full text-xs mt-0.5 flex-shrink-0">2</div>
                  <span className="text-gray-700">Provide clear and consistent financial documentation showing sufficient funds</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="inline-flex items-center justify-center w-6 h-6 bg-blue-200 text-blue-800 rounded-full text-xs mt-0.5 flex-shrink-0">3</div>
                  <span className="text-gray-700">Be honest about your travel history and any previous visa issues</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="inline-flex items-center justify-center w-6 h-6 bg-blue-200 text-blue-800 rounded-full text-xs mt-0.5 flex-shrink-0">4</div>
                  <span className="text-gray-700">Submit all required documents in the correct format and resolution</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="inline-flex items-center justify-center w-6 h-6 bg-blue-200 text-blue-800 rounded-full text-xs mt-0.5 flex-shrink-0">5</div>
                  <span className="text-gray-700">Apply well in advance of your travel date to allow for processing</span>
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