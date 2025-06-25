import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaPassport, FaGavel, FaExclamationTriangle, FaInfoCircle, FaClock } from 'react-icons/fa';

interface RejectionReason {
  id: string;
  reason: string;
  description: string;
  frequency: string;
}

const getReasonIcon = (reason: string) => {
  switch (reason) {
    case 'Expired Passport':
      return <FaPassport className="text-xl mt-1 text-red-500" />;
    case 'Criminal Record':
      return <FaGavel className="text-xl mt-1 text-red-500" />;
    case 'Previous Visa Violations':
      return <FaExclamationTriangle className="text-xl mt-1 text-red-500" />;
    default:
      return <FaInfoCircle className="text-xl mt-1 text-red-500" />;
  }
};

const getFrequencyBadge = (frequency: string) => {
  switch (frequency.toLowerCase()) {
    case 'common':
      return <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">Common</span>;
    case 'occasional':
      return <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">Occasional</span>;
    case 'rare':
      return <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Rare</span>;
    default:
      return <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">{frequency}</span>;
  }
};

const VisaRejectionReasons: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [reasons, setReasons] = useState<RejectionReason[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRejectionReasons = async () => {
      try {
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
      <section className="bg-white py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <FaClock className="text-3xl text-blue-500 mx-auto mb-4" />
          <p>Loading visa rejection reasons...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-12 px-6">
        <div className="max-w-3xl mx-auto text-center text-red-500">
          <FaExclamationTriangle className="text-3xl mx-auto mb-4" />
          <p>Error: {error}</p>
        </div>
      </section>
    );
  }

  if (reasons.length === 0) {
    return (
      <section className="bg-white py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <FaInfoCircle className="text-3xl text-blue-500 mx-auto mb-4" />
          <p>No rejection reasons data available.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-2 text-gray-900">Visa Rejection Reasons</h2>
        <p className="text-gray-600 mb-8">Common factors that can lead to visa rejection</p>

        <div className="space-y-6">
          {reasons.map((reason) => (
            <div key={reason.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              {getReasonIcon(reason.reason)}
              <div className="flex-1">
                <div className="flex items-center">
                  <h3 className="font-semibold text-gray-900">{reason.reason}</h3>
                  {getFrequencyBadge(reason.frequency)}
                </div>
                <p className="text-sm text-gray-600 mt-1">{reason.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="font-medium text-blue-800 mb-2">Tips to avoid rejection:</h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>Ensure all documents are valid and not expired</li>
            <li>Provide complete and accurate information</li>
            <li>Apply well in advance of your travel date</li>
            <li>Check all requirements before submitting</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default VisaRejectionReasons;