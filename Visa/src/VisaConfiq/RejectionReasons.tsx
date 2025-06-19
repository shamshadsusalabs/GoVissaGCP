import React, { useState } from 'react';
import { FaPlus, FaTrash, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

interface RejectionReason {
  id: string;
  reason: string;
  description: string;
  frequency: 'Rare' | 'Occasional' | 'Common';
}

interface RejectionReasonsProps {
  reasons: RejectionReason[];
  updateReasons: (reasons: RejectionReason[]) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const RejectionReasons: React.FC<RejectionReasonsProps> = ({ 
  reasons, 
  updateReasons, 
  nextStep, 
  prevStep 
}) => {
  const [newReason, setNewReason] = useState<Omit<RejectionReason, 'id'>>({
    reason: '',
    description: '',
    frequency: 'Occasional'
  });
  const [showForm, setShowForm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewReason(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addReason = () => {
    if (newReason.reason.trim()) {
      updateReasons([
        ...reasons,
        {
          ...newReason,
          id: Date.now().toString()
        }
      ]);
      setNewReason({
        reason: '',
        description: '',
        frequency: 'Occasional'
      });
      setShowForm(false);
    }
  };

  const removeReason = (id: string) => {
    updateReasons(reasons.filter(r => r.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'Common': return 'bg-red-100 text-red-800';
      case 'Occasional': return 'bg-yellow-100 text-yellow-800';
      case 'Rare': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Common Rejection Reasons</h2>
      <form onSubmit={handleSubmit}>
        {reasons.length > 0 ? (
          <div className="mb-6 space-y-4">
            {reasons.map((reason) => (
              <div key={reason.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{reason.reason}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded ${getFrequencyColor(reason.frequency)}`}>
                      {reason.frequency}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeReason(reason.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                {reason.description && (
                  <p className="text-sm text-gray-600">{reason.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-6 text-gray-500 text-center py-4">
            No rejection reasons added yet
          </div>
        )}

        {showForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Add Rejection Reason</h3>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
                <input
                  type="text"
                  name="reason"
                  value={newReason.reason}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="e.g., Insufficient financial proof"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={newReason.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Provide details about this rejection reason"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                <select
                  name="frequency"
                  value={newReason.frequency}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Rare">Rare</option>
                  <option value="Occasional">Occasional</option>
                  <option value="Common">Common</option>
                </select>
              </div>
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
                onClick={addReason}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Add Reason
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
            <FaPlus className="mr-2" /> Add Rejection Reason
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

export default RejectionReasons;