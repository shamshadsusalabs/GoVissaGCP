import React, { useState } from 'react';
import { FaPlus, FaTrash, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

interface DocumentRequirement {
  id: string;
  name: string;
  description: string;
  isMandatory: boolean;
  example?: string;
  format?: string;
}

interface DocumentRequirementsProps {
  documents: DocumentRequirement[];
  updateDocuments: (documents: DocumentRequirement[]) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const DocumentRequirements: React.FC<DocumentRequirementsProps> = ({ 
  documents, 
  updateDocuments, 
  nextStep, 
  prevStep 
}) => {
  const [newDocument, setNewDocument] = useState<Omit<DocumentRequirement, 'id'>>({
    name: '',
    description: '',
    isMandatory: true,
    example: '',
    format: ''
  });
  const [showForm, setShowForm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    
    setNewDocument(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addDocument = () => {
    if (newDocument.name.trim()) {
      updateDocuments([
        ...documents,
        {
          ...newDocument,
          id: Date.now().toString()
        }
      ]);
      setNewDocument({
        name: '',
        description: '',
        isMandatory: true,
        example: '',
        format: ''
      });
      setShowForm(false);
    }
  };

  const removeDocument = (id: string) => {
    updateDocuments(documents.filter(doc => doc.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Document Requirements</h2>
      <form onSubmit={handleSubmit}>
        {documents.length > 0 ? (
          <div className="mb-6 space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">
                    {doc.name}
                    {doc.isMandatory && (
                      <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        Mandatory
                      </span>
                    )}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeDocument(doc.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
                {doc.description && (
                  <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {doc.example && (
                    <div>
                      <span className="text-gray-500">Example:</span> {doc.example}
                    </div>
                  )}
                  {doc.format && (
                    <div>
                      <span className="text-gray-500">Format:</span> {doc.format}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-6 text-gray-500 text-center py-4">
            No documents added yet
          </div>
        )}

        {showForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Add New Document</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={newDocument.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={newDocument.description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Example</label>
                <input
                  type="text"
                  name="example"
                  value={newDocument.example}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                <input
                  type="text"
                  name="format"
                  value={newDocument.format}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isMandatory"
                  checked={newDocument.isMandatory}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-sm">Mandatory Document</span>
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
                onClick={addDocument}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Add Document
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
            <FaPlus className="mr-2" /> Add Document
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

export default DocumentRequirements;