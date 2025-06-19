import React, { useState } from 'react';
import { FaPlus, FaTrash, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

interface VisaType {
  id: string;
  name: string;
  code: string;
  category: string;
  processingTime: string;
  processingMethod: string;
  visaFee: number | string; // Allow both number and string
  serviceFee: number | string;
  currency: string;
  validity: string;
  entries: string;
  stayDuration: string;
  interviewRequired: boolean;
  biometricRequired: boolean;
  notes: string;
}

interface VisaTypesProps {
  visaTypes: VisaType[];
  updateVisaTypes: (visaTypes: VisaType[]) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const VisaTypes: React.FC<VisaTypesProps> = ({ visaTypes, updateVisaTypes, nextStep, prevStep }) => {
  const [newVisaType, setNewVisaType] = useState<Omit<VisaType, 'id'>>({
    name: '',
    code: '',
    category: '',
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
  const [showForm, setShowForm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    
    setNewVisaType(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Helper function to format fee display
  const formatFee = (fee: number | string): string => {
    if (typeof fee === 'number') {
      return fee.toFixed(2);
    }
    const num = parseFloat(fee);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  const addVisaType = () => {
    if (newVisaType.name.trim()) {
      // Ensure fees are stored as numbers
      const visaFee = typeof newVisaType.visaFee === 'string' ? 
        parseFloat(newVisaType.visaFee) || 0 : 
        newVisaType.visaFee;
      
      const serviceFee = typeof newVisaType.serviceFee === 'string' ? 
        parseFloat(newVisaType.serviceFee) || 0 : 
        newVisaType.serviceFee;

      updateVisaTypes([
        ...visaTypes,
        {
          ...newVisaType,
          id: Date.now().toString(),
          visaFee,
          serviceFee
        }
      ]);
      setNewVisaType({
        name: '',
        code: '',
        category: '',
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
      setShowForm(false);
    }
  };

  const removeVisaType = (id: string) => {
    updateVisaTypes(visaTypes.filter(vt => vt.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Visa Types</h2>
      <form onSubmit={handleSubmit}>
        {visaTypes.length > 0 ? (
          <div className="mb-6 space-y-4">
            {visaTypes.map((visaType) => (
              <div key={visaType.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-lg">
                    {visaType.name}
                    {visaType.code && <span className="ml-2 text-sm bg-gray-200 px-2 py-1 rounded">{visaType.code}</span>}
                    {visaType.category && <span className="ml-2 text-sm bg-blue-100 px-2 py-1 rounded">{visaType.category}</span>}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeVisaType(visaType.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Processing:</span> {visaType.processingTime || 'N/A'}
                  </div>
                  <div>
                    <span className="text-gray-500">Fee:</span> {visaType.currency} {formatFee(visaType.visaFee)}
                  </div>
                  <div>
                    <span className="text-gray-500">Validity:</span> {visaType.validity || 'N/A'}
                  </div>
                  <div>
                    <span className="text-gray-500">Entries:</span> {visaType.entries}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-6 text-gray-500 text-center py-4">
            No visa types added yet
          </div>
        )}

        {/* Rest of the component remains the same */}
        {showForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Add New Visa Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={newVisaType.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                <input
                  type="text"
                  name="code"
                  value={newVisaType.code}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={newVisaType.category}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Processing Time</label>
                <input
                  type="text"
                  name="processingTime"
                  value={newVisaType.processingTime}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Processing Method</label>
                <select
                  name="processingMethod"
                  value={newVisaType.processingMethod}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Standard">Standard</option>
                  <option value="Express">Express</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visa Fee</label>
                <div className="flex">
                  <select
                    name="currency"
                    value={newVisaType.currency}
                    onChange={handleChange}
                    className="border-r-0 rounded-r-none"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                  <input
                    type="number"
                    name="visaFee"
                    value={newVisaType.visaFee}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="flex-1 rounded-l-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Fee</label>
                <input
                  type="number"
                  name="serviceFee"
                  value={newVisaType.serviceFee}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Validity</label>
                <input
                  type="text"
                  name="validity"
                  value={newVisaType.validity}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Entries</label>
                <select
                  name="entries"
                  value={newVisaType.entries}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Single">Single</option>
                  <option value="Multiple">Multiple</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stay Duration</label>
                <input
                  type="text"
                  name="stayDuration"
                  value={newVisaType.stayDuration}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="interviewRequired"
                    checked={newVisaType.interviewRequired}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm">Interview Required</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="biometricRequired"
                    checked={newVisaType.biometricRequired}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm">Biometrics Required</span>
                </label>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                name="notes"
                value={newVisaType.notes}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addVisaType}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Add Visa Type
              </button>
            </div>
          </div>
        )}

        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="mb-6 flex items-center px-4 py-2 bg-green-600 text-white rounded-md"
          >
            <FaPlus className="mr-2" /> Add Visa Type
          </button>
        )}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Next <FaArrowRight className="ml-2" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default VisaTypes;