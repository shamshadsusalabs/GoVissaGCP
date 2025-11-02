import React, { useState } from 'react';
import { FaPlus, FaMinus, FaTrash, FaEdit, FaSave, FaTimes, FaInfoCircle } from 'react-icons/fa';

interface DocumentRequirement {
  id: string;
  name: string;
  description: string;
  isMandatory: boolean;
  example?: string;
  format?: string;
}

interface VisaDetails {
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
}

interface VisaType {
  id: string;
  name: string;
  code: string;
  category: string;
  details: VisaDetails;
  documents: DocumentRequirement[];
  eligibilityCriteria: string;
}

interface CountryConfig {
  id: string;
  country: string;
  countryCode: string;
  embassyLocation: string;
  visaTypes: VisaType[];
  generalRequirements: string;
}

const VisaConfigForm: React.FC = () => {
  const [configs, setConfigs] = useState<CountryConfig[]>([]);
  const [newCountry, setNewCountry] = useState('');
  const [newCountryCode, setNewCountryCode] = useState('');
  const [embassyLocation, setEmbassyLocation] = useState('');
  const [generalRequirements, setGeneralRequirements] = useState('');
  const [editingCountry, setEditingCountry] = useState<string | null>(null);
  const [newVisaType, setNewVisaType] = useState('');
  const [visaTypeCode, setVisaTypeCode] = useState('');
  const [visaCategory, setVisaCategory] = useState('');
  const [eligibilityCriteria, setEligibilityCriteria] = useState('');
  const [newDocument, setNewDocument] = useState('');
  const [documentDesc, setDocumentDesc] = useState('');
  const [documentExample, setDocumentExample] = useState('');
  const [documentFormat, setDocumentFormat] = useState('');
  const [isMandatory, setIsMandatory] = useState(true);
  
  const [visaDetails, setVisaDetails] = useState<VisaDetails>({
    processingTime: '',
    processingMethod: 'Standard',
    visaFee: 0,
    serviceFee: 0,
    currency: 'USD',
    validity: '',
    entries: 'Single',
    stayDuration: '',
    interviewRequired: false,
    biometricRequired: false,
    notes: ''
  });

  const addCountry = () => {
    if (newCountry.trim() && !configs.some(c => c.country.toLowerCase() === newCountry.toLowerCase())) {
      setConfigs([...configs, { 
        id: Date.now().toString(),
        country: newCountry,
        countryCode: newCountryCode,
        embassyLocation,
        visaTypes: [],
        generalRequirements
      }]);
      setNewCountry('');
      setNewCountryCode('');
      setEmbassyLocation('');
      setGeneralRequirements('');
    }
  };

  const removeCountry = (id: string) => {
    setConfigs(configs.filter(c => c.id !== id));
  };

  const addVisaType = (countryId: string) => {
    if (newVisaType.trim()) {
      setConfigs(configs.map(country => {
        if (country.id === countryId) {
          return {
            ...country,
            visaTypes: [
              ...country.visaTypes,
              {
                id: Date.now().toString(),
                name: newVisaType,
                code: visaTypeCode,
                category: visaCategory,
                details: visaDetails,
                documents: [],
                eligibilityCriteria
              }
            ]
          };
        }
        return country;
      }));
      setNewVisaType('');
      setVisaTypeCode('');
      setVisaCategory('');
      setEligibilityCriteria('');
      setVisaDetails({
        processingTime: '',
        processingMethod: 'Standard',
        visaFee: 0,
        serviceFee: 0,
        currency: 'USD',
        validity: '',
        entries: 'Single',
        stayDuration: '',
        interviewRequired: false,
        biometricRequired: false,
        notes: ''
      });
    }
  };

  const removeVisaType = (countryId: string, visaTypeId: string) => {
    setConfigs(configs.map(country => {
      if (country.id === countryId) {
        return {
          ...country,
          visaTypes: country.visaTypes.filter(vt => vt.id !== visaTypeId)
        };
      }
      return country;
    }));
  };

  const addDocument = (countryId: string, visaTypeId: string) => {
    if (newDocument.trim()) {
      setConfigs(configs.map(country => {
        if (country.id === countryId) {
          return {
            ...country,
            visaTypes: country.visaTypes.map(vt => {
              if (vt.id === visaTypeId) {
                return {
                  ...vt,
                  documents: [
                    ...vt.documents,
                    {
                      id: Date.now().toString(),
                      name: newDocument,
                      description: documentDesc,
                      isMandatory,
                      example: documentExample,
                      format: documentFormat
                    }
                  ]
                };
              }
              return vt;
            })
          };
        }
        return country;
      }));
      setNewDocument('');
      setDocumentDesc('');
      setDocumentExample('');
      setDocumentFormat('');
      setIsMandatory(true);
    }
  };

  const removeDocument = (countryId: string, visaTypeId: string, docId: string) => {
    setConfigs(configs.map(country => {
      if (country.id === countryId) {
        return {
          ...country,
          visaTypes: country.visaTypes.map(vt => {
            if (vt.id === visaTypeId) {
              return {
                ...vt,
                documents: vt.documents.filter(doc => doc.id !== docId)
              };
            }
            return vt;
          })
        };
      }
      return country;
    }));
  };

  const saveConfigurations = async () => {
  try {
    // Transform the data to match backend expectations
    const payload = configs.map(config => ({
      country: config.country,
      countryCode: config.countryCode,
      embassyLocation: config.embassyLocation,
      generalRequirements: config.generalRequirements,
      visaTypes: config.visaTypes.map(visaType => ({
        name: visaType.name,
        code: visaType.code,
        category: visaType.category,
        eligibilityCriteria: visaType.eligibilityCriteria,
        details: {
          processingTime: visaType.details.processingTime,
          processingMethod: visaType.details.processingMethod,
          visaFee: visaType.details.visaFee,
          serviceFee: visaType.details.serviceFee,
          currency: visaType.details.currency,
          validity: visaType.details.validity,
          entries: visaType.details.entries,
          stayDuration: visaType.details.stayDuration,
          interviewRequired: visaType.details.interviewRequired,
          biometricRequired: visaType.details.biometricRequired,
          notes: visaType.details.notes
        },
        documents: visaType.documents.map(doc => ({
          name: doc.name,
          description: doc.description,
          isMandatory: doc.isMandatory,
          example: doc.example,
          format: doc.format
        }))
      }))
    }));

    const response = await fetch('http://localhost:5000/api/configurations/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    alert('Configurations saved successfully!');
    console.log('Success:', result);
  } catch (error) {
    console.error('Error saving configurations:', error);
    alert('Failed to save configurations. Please try again.');
  }
};

  const downloadConfigurations = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(configs, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "visa_configurations.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-blue-800">Visa Configuration Dashboard</h1>
      
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Country</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newCountry}
              onChange={(e) => setNewCountry(e.target.value)}
              placeholder="e.g., United States, United Kingdom"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country Code</label>
            <input
              type="text"
              value={newCountryCode}
              onChange={(e) => setNewCountryCode(e.target.value)}
              placeholder="e.g., US, UK, AE"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              maxLength={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Embassy Location</label>
            <input
              type="text"
              value={embassyLocation}
              onChange={(e) => setEmbassyLocation(e.target.value)}
              placeholder="e.g., New Delhi, Mumbai"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">General Requirements</label>
          <textarea
            value={generalRequirements}
            onChange={(e) => setGeneralRequirements(e.target.value)}
            placeholder="Enter general requirements applicable to all visa types..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
        <div className="flex justify-end">
          <button 
            onClick={addCountry}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            disabled={!newCountry.trim()}
          >
            <FaPlus /> Add Country
          </button>
        </div>
      </div>

      {configs.map((country) => (
        <div key={country.id} className="mb-8 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-100 px-6 py-4 flex justify-between items-center border-b">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                {country.country}
                {country.countryCode && (
                  <span className="text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded">
                    {country.countryCode}
                  </span>
                )}
              </h2>
              {country.embassyLocation && (
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">Embassy:</span> {country.embassyLocation}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setEditingCountry(editingCountry === country.id ? null : country.id)}
                className="text-blue-600 hover:text-blue-800 p-2"
              >
                {editingCountry === country.id ? <FaTimes /> : <FaEdit />}
              </button>
              <button 
                onClick={() => removeCountry(country.id)}
                className="text-red-600 hover:text-red-800 p-2"
              >
                <FaTrash />
              </button>
            </div>
          </div>

          <div className="p-6">
            {country.generalRequirements && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-medium mb-2 text-gray-800 flex items-center gap-2">
                  <FaInfoCircle className="text-blue-600" /> General Requirements
                </h3>
                <p className="text-gray-700 whitespace-pre-line">{country.generalRequirements}</p>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4 text-gray-700">Visa Types</h3>
              
              {country.visaTypes.length > 0 ? (
                <div className="space-y-4">
                  {country.visaTypes.map((visaType) => (
                    <div key={visaType.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {visaType.name}
                            {visaType.code && (
                              <span className="ml-2 text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded">
                                {visaType.code}
                              </span>
                            )}
                            {visaType.category && (
                              <span className="ml-2 text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                {visaType.category}
                              </span>
                            )}
                          </h4>
                        </div>
                        <button 
                          onClick={() => removeVisaType(country.id, visaType.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-blue-50 p-3 rounded">
                          <p className="text-xs text-gray-500">Processing Time</p>
                          <p className="font-medium">{visaType.details.processingTime || 'Not specified'}</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded">
                          <p className="text-xs text-gray-500">Visa Fee</p>
                          <p className="font-medium">
                            {visaType.details.visaFee ? 
                              `${visaType.details.currency} ${visaType.details.visaFee.toFixed(2)}` : 'Not specified'}
                          </p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded">
                          <p className="text-xs text-gray-500">Validity</p>
                          <p className="font-medium">{visaType.details.validity || 'Not specified'}</p>
                        </div>
                        <div className="bg-yellow-50 p-3 rounded">
                          <p className="text-xs text-gray-500">Entries</p>
                          <p className="font-medium">{visaType.details.entries || 'Not specified'}</p>
                        </div>
                        <div className="bg-red-50 p-3 rounded">
                          <p className="text-xs text-gray-500">Service Fee</p>
                          <p className="font-medium">
                            {visaType.details.serviceFee ? 
                              `${visaType.details.currency} ${visaType.details.serviceFee.toFixed(2)}` : 'Not specified'}
                          </p>
                        </div>
                        <div className="bg-indigo-50 p-3 rounded">
                          <p className="text-xs text-gray-500">Processing Method</p>
                          <p className="font-medium">{visaType.details.processingMethod || 'Not specified'}</p>
                        </div>
                        <div className="bg-teal-50 p-3 rounded">
                          <p className="text-xs text-gray-500">Stay Duration</p>
                          <p className="font-medium">{visaType.details.stayDuration || 'Not specified'}</p>
                        </div>
                        <div className="bg-pink-50 p-3 rounded">
                          <p className="text-xs text-gray-500">Requirements</p>
                          <p className="font-medium flex gap-2">
                            {visaType.details.interviewRequired && (
                              <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded">Interview</span>
                            )}
                            {visaType.details.biometricRequired && (
                              <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded">Biometrics</span>
                            )}
                          </p>
                        </div>
                      </div>

                      {visaType.eligibilityCriteria && (
                        <div className="mb-4 p-3 bg-gray-50 rounded">
                          <h5 className="text-sm font-medium mb-1 text-gray-700">Eligibility Criteria</h5>
                          <p className="text-gray-600 whitespace-pre-line">{visaType.eligibilityCriteria}</p>
                        </div>
                      )}

                      {visaType.details.notes && (
                        <div className="mb-4 p-3 bg-yellow-50 rounded">
                          <h5 className="text-sm font-medium mb-1 text-gray-700">Additional Notes</h5>
                          <p className="text-gray-600 whitespace-pre-line">{visaType.details.notes}</p>
                        </div>
                      )}

                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="text-sm font-medium text-gray-700">Required Documents</h5>
                          {editingCountry === country.id && (
                            <button 
                              onClick={() => addDocument(country.id, visaType.id)}
                              className="text-green-600 hover:text-green-800 flex items-center gap-1"
                            >
                              <FaPlus size={12} /> Add Document
                            </button>
                          )}
                        </div>
                        {visaType.documents.length > 0 ? (
                          <ul className="space-y-2">
                            {visaType.documents.map((doc) => (
                              <li key={doc.id} className="flex justify-between items-start p-3 bg-gray-50 rounded border">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{doc.name}</span>
                                    {doc.isMandatory && (
                                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Mandatory</span>
                                    )}
                                  </div>
                                  {doc.description && (
                                    <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                                  )}
                                  {doc.example && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      <span className="font-medium">Example:</span> {doc.example}
                                    </p>
                                  )}
                                  {doc.format && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      <span className="font-medium">Format:</span> {doc.format}
                                    </p>
                                  )}
                                </div>
                                {editingCountry === country.id && (
                                  <button 
                                    onClick={() => removeDocument(country.id, visaType.id, doc.id)}
                                    className="text-red-500 hover:text-red-700 ml-4"
                                  >
                                    <FaMinus size={14} />
                                  </button>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 text-sm">No documents added for this visa type</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No visa types added yet</p>
              )}
            </div>

            {editingCountry === country.id && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium mb-3 text-gray-700">Add New Visa Type</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Visa Type Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newVisaType}
                      onChange={(e) => setNewVisaType(e.target.value)}
                      placeholder="e.g., Tourist, Business, Student"
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Visa Type Code</label>
                    <input
                      type="text"
                      value={visaTypeCode}
                      onChange={(e) => setVisaTypeCode(e.target.value)}
                      placeholder="e.g., B1, F1, T1"
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={visaCategory}
                      onChange={(e) => setVisaCategory(e.target.value)}
                      placeholder="e.g., Short Stay, Long Stay"
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Processing Time</label>
                    <input
                      type="text"
                      value={visaDetails.processingTime}
                      onChange={(e) => setVisaDetails({...visaDetails, processingTime: e.target.value})}
                      placeholder="e.g., 7-10 working days"
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Processing Method</label>
                    <select
                      value={visaDetails.processingMethod}
                      onChange={(e) => setVisaDetails({...visaDetails, processingMethod: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Standard">Standard</option>
                      <option value="Express">Express</option>
                      <option value="Premium">Premium</option>
                      <option value="Emergency">Emergency</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Visa Fee</label>
                    <div className="flex">
                      <select
                        value={visaDetails.currency}
                        onChange={(e) => setVisaDetails({...visaDetails, currency: e.target.value})}
                        className="p-2 border border-gray-300 rounded-l focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="INR">INR (₹)</option>
                        <option value="AED">AED (د.إ)</option>
                      </select>
                      <input
                        type="number"
                        value={visaDetails.visaFee || ''}
                        onChange={(e) => setVisaDetails({...visaDetails, visaFee: parseFloat(e.target.value) || 0})}
                        placeholder="Amount"
                        className="flex-1 p-2 border-t border-b border-r border-gray-300 rounded-r focus:ring-2 focus:ring-blue-500"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Fee</label>
                    <div className="flex">
                      <select
                        value={visaDetails.currency}
                        onChange={(e) => setVisaDetails({...visaDetails, currency: e.target.value})}
                        className="p-2 border border-gray-300 rounded-l focus:ring-2 focus:ring-blue-500"
                        disabled
                      >
                        <option value={visaDetails.currency}>{visaDetails.currency}</option>
                      </select>
                      <input
                        type="number"
                        value={visaDetails.serviceFee || ''}
                        onChange={(e) => setVisaDetails({...visaDetails, serviceFee: parseFloat(e.target.value) || 0})}
                        placeholder="Amount"
                        className="flex-1 p-2 border-t border-b border-r border-gray-300 rounded-r focus:ring-2 focus:ring-blue-500"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Validity Period</label>
                    <input
                      type="text"
                      value={visaDetails.validity}
                      onChange={(e) => setVisaDetails({...visaDetails, validity: e.target.value})}
                      placeholder="e.g., 3 months, 1 year"
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stay Duration</label>
                    <input
                      type="text"
                      value={visaDetails.stayDuration}
                      onChange={(e) => setVisaDetails({...visaDetails, stayDuration: e.target.value})}
                      placeholder="e.g., 30 days, 90 days"
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Entries Allowed</label>
                    <select
                      value={visaDetails.entries}
                      onChange={(e) => setVisaDetails({...visaDetails, entries: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Single">Single Entry</option>
                      <option value="Multiple">Multiple Entries</option>
                    </select>
                  </div>
                  <div className="flex items-end space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={visaDetails.interviewRequired}
                        onChange={(e) => setVisaDetails({...visaDetails, interviewRequired: e.target.checked})}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Interview Required</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={visaDetails.biometricRequired}
                        onChange={(e) => setVisaDetails({...visaDetails, biometricRequired: e.target.checked})}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Biometrics Required</span>
                    </label>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility Criteria</label>
                  <textarea
                    value={eligibilityCriteria}
                    onChange={(e) => setEligibilityCriteria(e.target.value)}
                    placeholder="Enter eligibility criteria for this visa type..."
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                  <textarea
                    value={visaDetails.notes}
                    onChange={(e) => setVisaDetails({...visaDetails, notes: e.target.value})}
                    placeholder="Enter any additional notes or special instructions..."
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2 text-gray-700">Add Required Document</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Document Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newDocument}
                        onChange={(e) => setNewDocument(e.target.value)}
                        placeholder="e.g., Passport, Bank Statement"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <input
                        type="text"
                        value={documentDesc}
                        onChange={(e) => setDocumentDesc(e.target.value)}
                        placeholder="e.g., Minimum 6 months validity"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Example</label>
                      <input
                        type="text"
                        value={documentExample}
                        onChange={(e) => setDocumentExample(e.target.value)}
                        placeholder="e.g., Recent bank statement with minimum balance"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                      <input
                        type="text"
                        value={documentFormat}
                        onChange={(e) => setDocumentFormat(e.target.value)}
                        placeholder="e.g., PDF, JPEG, Original"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mb-3">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={isMandatory}
                        onChange={(e) => setIsMandatory(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Mandatory Document</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button 
                    onClick={() => addVisaType(country.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                    disabled={!newVisaType.trim()}
                  >
                    <FaSave /> Save Visa Type
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {configs.length > 0 && (
        <div className="mt-6 flex justify-center gap-4">
          <button 
            onClick={saveConfigurations}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 flex items-center gap-2 shadow-lg"
          >
            <FaSave size={18} /> Save All Configurations
          </button>
          <button 
            onClick={downloadConfigurations}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-lg"
          >
            <FaSave size={18} /> Download as JSON
          </button>
        </div>
      )}
    </div>
  );
};

export default VisaConfigForm;