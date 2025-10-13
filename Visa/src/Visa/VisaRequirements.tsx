import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface DocumentDetail {
  name: string;
  description: string;
  sample?: string[]; // Added sample images array
}

interface CountryData {
  countryName: string;
  documentDetails: DocumentDetail[];
  eligibility: string;
  applicationTips?: string; // Added optional applicationTips field
}

const DOCUMENT_ICONS: Record<string, string> = {
  'Photo': '📷',
  'Passport': '🛂',
  'Bank Statement': '🏦',
  'Visa': '✈️',
  'Flight Tickets': '🎫',
  'Hotel Booking': '🏨',
  'Insurance': '🛡️',
  'Application Form': '📝',
  'Invitation Letter': '✉️',
  'Images': '🖼️', // Added for Dubai's "Images" document type
};

// Default sample images for document types
const DEFAULT_SAMPLES: Record<string, string[]> = {
  'Passport': [
    'https://res.cloudinary.com/dhy1ot6lf/image/upload/v1752826565/Visa_Images/trff1heng4lemv2xqxrv.jpg'
  ],
  'Photo': [
    'https://res.cloudinary.com/dhy1ot6lf/image/upload/v1752826640/Visa_Images/p93jrrg4vrgb5ryfsiza.webp'
  ],
  'Bank Statement': [
    'https://example.com/bank-statement-sample.jpg' // Replace with actual URL
  ],
  'Visa': [
    'https://example.com/visa-sample.jpg' // Replace with actual URL
  ],
  'Images': [
    'https://res.cloudinary.com/dhy1ot6lf/image/upload/v1752826640/Visa_Images/p93jrrg4vrgb5ryfsiza.webp'
  ],
};

// Default application tips as fallback
const DEFAULT_TIPS = [
  "Submit all documents at least 3 months before your planned travel date",
  "Ensure all documents are translated to English and notarized",
  "Passport must be valid for at least 6 months from date of entry",
  "Double-check for any document updates on the official embassy website"
];

const VisaRequirements = () => {
  const { id: countryId } = useParams<{ id: string }>();
  const [countryData, setCountryData] = useState<CountryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDocIndex, setExpandedDocIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        if (!countryId) {
          throw new Error('Country ID is missing');
        }

        // Simulate network delay for better loading state visualization
        await new Promise(resolve => setTimeout(resolve, 800));
        
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

  const toggleDocument = (index: number) => {
    setExpandedDocIndex(expandedDocIndex === index ? null : index);
  };

  // Get sample images for a document, using defaults if none provided
  const getSamples = (doc: DocumentDetail) => {
    if (doc.sample && doc.sample.length > 0) {
      return doc.sample;
    }
    return DEFAULT_SAMPLES[doc.name] || [];
  };

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto flex flex-col items-center min-h-[60vh] justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-indigo-100 h-16 w-16 flex items-center justify-center mb-4">
            <div className="bg-indigo-200 rounded-full h-8 w-8 animate-ping"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-5xl mx-auto text-center min-h-[60vh] flex items-center justify-center">
        <div className="bg-red-50 p-6 rounded-2xl border border-red-200 max-w-md w-full shadow-sm">
          <div className="bg-red-100 inline-flex rounded-full p-3 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-red-800 font-medium text-lg mb-2">Couldn't load requirements</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            className="text-red-600 hover:text-red-800 font-medium text-sm"
            onClick={() => window.location.reload()}
          >
            Try again →
          </button>
        </div>
      </div>
    );
  }

  if (!countryData) {
    return (
      <div className="p-6 max-w-5xl mx-auto text-center min-h-[60vh] flex items-center justify-center">
        <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-200 max-w-md w-full shadow-sm">
          <div className="bg-yellow-100 inline-flex rounded-full p-3 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-yellow-800 font-medium">No Visa Requirements Found</h3>
          <p className="text-yellow-600 mt-2 mb-4">We couldn't find any information for this country</p>
          <button 
            className="text-yellow-600 hover:text-yellow-800 font-medium text-sm"
            onClick={() => window.history.back()}
          >
            ← Back to countries
          </button>
        </div>
      </div>
    );
  }

  // Get tips to display - use dynamic if available, otherwise default
  const getApplicationTips = () => {
    if (countryData.applicationTips) {
      return countryData.applicationTips
        .split('\n')
        .filter(tip => tip.trim() !== '');
    }
    return DEFAULT_TIPS;
  };

  const applicationTips = getApplicationTips();

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="text-center mb-8 mt-4">
        <div className="inline-flex items-center justify-center bg-indigo-100 w-16 h-16 rounded-full mb-4">
          <span className="text-2xl">🌎</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          {countryData.countryName} Visa Requirements
        </h1>
        <div className="h-1.5 w-32 bg-gradient-to-r from-indigo-400 to-blue-400 mx-auto rounded-full"></div>
      </div>

      {/* ✅ NEW: Contact Information Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-sm mb-8 border border-blue-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200 rounded-full -m-12 opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 bg-white p-3 rounded-xl shadow-sm border border-blue-100">
              <span className="text-2xl">📞</span>
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Need Help with Your Application?</h3>
              <p className="text-blue-700 text-sm mb-4 leading-relaxed">
                Our visa experts are here to assist you with document preparation, application process, and any questions you may have.
              </p>
              <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 bg-blue-100 p-2 rounded-lg">
                      <span className="text-blue-600 text-lg">📧</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Email Support</p>
                      <a 
                        href="mailto:contact@traveli.asia" 
                        className="text-blue-600 hover:text-blue-800 font-semibold text-sm hover:underline transition-colors"
                      >
                        contact@traveli.asia
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 bg-blue-100 p-2 rounded-lg">
                      <span className="text-blue-600 text-lg">📱</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Phone Support</p>
                      <a 
                        href="tel:+919289280509" 
                        className="text-blue-600 hover:text-blue-800 font-semibold text-sm hover:underline transition-colors"
                      >
                        +91 9289280509
                      </a>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-blue-100">
                  <p className="text-xs text-blue-600 flex items-center gap-2">
                    <span className="text-sm">⏰</span>
                    Available Monday to Friday, 9:00 AM - 6:00 PM IST
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Eligibility section */}
      <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl shadow-sm mb-10 border border-indigo-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200 rounded-full -m-16 opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 bg-white p-2.5 rounded-lg shadow-sm border border-indigo-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-semibold text-indigo-800 mb-3">Eligibility Requirements</h3>
              <div className="bg-white p-4 rounded-lg border border-indigo-50">
                <ul className="space-y-3">
                  {countryData.eligibility
                    .split('\n\n')
                    .filter(point => point.trim())
                    .map((point, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center mt-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-gray-700 leading-relaxed">{point}</span>
                      </li>
                    ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-indigo-100">
                  <p className="text-sm text-indigo-700 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Requirements are subject to change - always verify with official sources
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Documents section */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-0.5 w-8 bg-indigo-400 rounded-full"></div>
          <h3 className="text-xl font-semibold text-gray-800">Required Documents</h3>
          <span className="text-xs bg-indigo-100 text-indigo-800 px-2.5 py-1.5 rounded-full font-medium">
            {countryData.documentDetails.length} documents
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {countryData.documentDetails.map((doc, index) => {
            const samples = getSamples(doc);
            return (
              <div 
                key={index}
                className={`bg-white rounded-2xl border overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md ${
                  expandedDocIndex === index 
                    ? 'border-indigo-300 ring-2 ring-indigo-100' 
                    : 'border-gray-200'
                }`}
              >
                <button
                  className="w-full flex items-start gap-4 p-5 text-left group"
                  onClick={() => toggleDocument(index)}
                >
                  <div className="flex-shrink-0 text-2xl mt-0.5 bg-indigo-50 p-3 rounded-lg">
                    {DOCUMENT_ICONS[doc.name] || '📄'}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors">{doc.name}</h4>
                    <p className={`text-sm text-gray-600 mt-2 transition-all ${
                      expandedDocIndex === index ? 'line-clamp-none' : 'line-clamp-2'
                    }`}>
                      {doc.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-gray-400 group-hover:text-indigo-500 mt-1 transition-colors">
                    {expandedDocIndex === index ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
                
                {expandedDocIndex === index && (
                  <div className="px-5 pb-5 pt-1 bg-indigo-50 border-t border-indigo-100 animate-fadeIn">
                    <p className="text-gray-700 text-sm mb-3">{doc.description}</p>
                    
                    {samples.length > 0 && (
                      <>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Sample Documents</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {samples.map((imgUrl, idx) => (
                            <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                              <img 
                                src={imgUrl} 
                                alt={`Sample ${idx+1} for ${doc.name}`}
                                className="w-full h-32 object-contain"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://via.placeholder.com/150?text=Sample+Not+Available';
                                  e.currentTarget.classList.add('object-cover');
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="bg-blue-100 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="font-medium text-gray-800 text-lg">Application Tips</h3>
        </div>
        <ul className="space-y-3 text-gray-700 pl-2">
          {applicationTips.map((tip, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mt-0.5">
                <span className="text-indigo-600 text-xs font-bold">{index + 1}</span>
              </div>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VisaRequirements;