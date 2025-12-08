"use client"
import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { FaPlus, FaTrash, FaArrowRight, FaArrowLeft, FaEdit, FaSave, FaTimes, FaUpload, FaCopy, FaDownload } from "react-icons/fa"
import { useDropzone } from "react-dropzone"

interface DocumentRequirement {
  id: string
  name: string
  description: string
  isMandatory: boolean
  sample?: string[]
  format?: string
  configId?: string // ✅ Add optional configId for tracking source
}

// Removed unused interface DocumentTemplate

interface DocumentRequirementsProps {
  documents: DocumentRequirement[]
  updateDocuments: (documents: DocumentRequirement[]) => void
  nextStep: () => void
  prevStep: () => void
  configId?: string | null // Updated to accept null
}

const DocumentRequirements: React.FC<DocumentRequirementsProps> = ({
  documents,
  updateDocuments,
  nextStep,
  prevStep,
  configId,
}) => {
  const [currentDocument, setCurrentDocument] = useState<DocumentRequirement | null>(null)
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string>("")
  
  // ✅ NEW: Template selection states
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [templates, setTemplates] = useState<DocumentRequirement[]>([])
  const [loadingTemplates, setLoadingTemplates] = useState(false)
  
  // ✅ NEW: Common Documents checkbox state
  const [includeCommonDocuments, setIncludeCommonDocuments] = useState(true)
  const [showCommonDocsManager, setShowCommonDocsManager] = useState(false)
  const [editingCommonDoc, setEditingCommonDoc] = useState<DocumentRequirement | null>(null)

  // ✅ NEW: Common Documents for Tourist Visa Application (now editable)
  const [commonDocuments, setCommonDocuments] = useState<DocumentRequirement[]>([
    {
      id: "common-passport",
      name: "Valid Passport",
      description: "Original passport (valid for at least 6 months beyond your return date). Minimum 2 blank pages. Attach copies of previous visas (if any)",
      isMandatory: true,
      format: "Original document + photocopies"
    },
    {
      id: "common-photos",
      name: "Passport-Sized Photographs",
      description: "Recent photos (usually 35mm x 45mm). White background. As per specific embassy photo guidelines",
      isMandatory: true,
      format: "35mm x 45mm, white background"
    },
    {
      id: "common-accommodation",
      name: "Proof of Accommodation",
      description: "Hotel bookings or invitation letter from host (if staying with family/friends). Airbnb confirmation or similar accepted in most cases",
      isMandatory: true,
      format: "Hotel booking confirmation or invitation letter"
    },
    {
      id: "common-financial",
      name: "Proof of Financial Means",
      description: "Bank statements for last 3–6 months (stamped). Income tax returns (ITR) or Form 16. Pay slips (if employed). Sponsorship letter (if someone else is funding your trip)",
      isMandatory: true,
      format: "Bank statements, ITR, pay slips, sponsorship letter"
    },
    {
      id: "common-insurance",
      name: "Travel Insurance",
      description: "Valid for entire duration of stay. Minimum coverage (e.g., €30,000 for Schengen). Must cover medical emergencies, hospitalization, and repatriation",
      isMandatory: true,
      format: "Insurance policy document"
    },
    {
      id: "common-flight",
      name: "Flight Reservation / Booking",
      description: "Return ticket booking (do NOT purchase until visa is granted unless required). Proof of internal travel (trains/flights between cities if applicable)",
      isMandatory: true,
      format: "Flight reservation or booking confirmation"
    }
  ])

  // ✅ NEW: Fetch available templates
  const fetchTemplates = async () => {
    setLoadingTemplates(true)
    try {
      const response = await fetch("http://localhost:5000/api/configurations/visa-with-5-docs")
      if (!response.ok) {
        throw new Error("Failed to fetch templates")
      }
      const result = await response.json()
      
      if (result.success && result.data) {
        // ✅ NEW: Extract all unique documents from all templates
        const allDocuments: DocumentRequirement[] = []
        const seenNames = new Set<string>()
        
        Object.entries(result.data).forEach(([configId, documents]) => {
          (documents as DocumentRequirement[]).forEach(doc => {
            const normalizedName = doc.name.toLowerCase().trim()
            if (!seenNames.has(normalizedName)) {
              seenNames.add(normalizedName)
              allDocuments.push({
                ...doc,
                id: doc.id, // Keep original ID
                configId: configId // Add source config ID
              })
            }
          })
        })
        
        setTemplates(allDocuments)
      }
    } catch (error) {
      console.error("Error fetching templates:", error)
    } finally {
      setLoadingTemplates(false)
    }
  }

  // ✅ NEW: Load templates when component mounts
  useEffect(() => {
    fetchTemplates()
  }, [])

  // ✅ NEW: Auto-include common documents on first load if documents array is empty
  useEffect(() => {
    if (documents.length === 0 && includeCommonDocuments) {
      const initialCommonDocs = commonDocuments.map(doc => ({
        ...doc,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
      }))
      updateDocuments(initialCommonDocs)
    }
  }, []) // Only run on mount

  // ✅ NEW: Handle common documents checkbox
  const handleCommonDocumentsChange = (checked: boolean) => {
    setIncludeCommonDocuments(checked)
    
    if (checked) {
      // Add common documents that don't already exist
      const existingNames = documents.map(doc => doc.name.toLowerCase().trim())
      const newCommonDocs = commonDocuments.filter(commonDoc => 
        !existingNames.includes(commonDoc.name.toLowerCase().trim())
      ).map(doc => ({
        ...doc,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
      }))
      
      if (newCommonDocs.length > 0) {
        updateDocuments([...documents, ...newCommonDocs])
      }
    } else {
      // Remove common documents from the list
      const commonDocNames = commonDocuments.map(doc => doc.name.toLowerCase().trim())
      const filteredDocuments = documents.filter(doc => 
        !commonDocNames.includes(doc.name.toLowerCase().trim())
      )
      updateDocuments(filteredDocuments)
    }
  }

  // ✅ NEW: Check if common documents are already included
  useEffect(() => {
    const commonDocNames = commonDocuments.map(doc => doc.name.toLowerCase().trim())
    const hasAllCommonDocs = commonDocNames.every(commonName =>
      documents.some(doc => doc.name.toLowerCase().trim() === commonName)
    )
    setIncludeCommonDocuments(hasAllCommonDocs)
  }, [documents, commonDocuments])

  // ✅ NEW: Common Documents Management Functions
  const handleEditCommonDoc = (doc: DocumentRequirement) => {
    setEditingCommonDoc({ ...doc })
  }

  const handleSaveCommonDoc = () => {
    if (!editingCommonDoc || !editingCommonDoc.name.trim()) return
    
    const isNewDoc = !commonDocuments.find(doc => doc.id === editingCommonDoc.id)
    
    let updatedCommonDocs
    if (isNewDoc) {
      // Add new document
      updatedCommonDocs = [...commonDocuments, editingCommonDoc]
    } else {
      // Update existing document
      updatedCommonDocs = commonDocuments.map(doc => 
        doc.id === editingCommonDoc.id ? editingCommonDoc : doc
      )
    }
    
    setCommonDocuments(updatedCommonDocs)
    setEditingCommonDoc(null)
    
    // Update existing documents in the main list if they exist
    const updatedDocuments = documents.map(doc => {
      const commonDoc = updatedCommonDocs.find(cd => cd.name.toLowerCase().trim() === doc.name.toLowerCase().trim())
      return commonDoc ? { ...doc, ...commonDoc, id: doc.id } : doc
    })
    updateDocuments(updatedDocuments)
    
    // If common documents are enabled and this is a new doc, add it to main list
    if (isNewDoc && includeCommonDocuments) {
      const newDocForMainList = {
        ...editingCommonDoc,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
      }
      updateDocuments([...updatedDocuments, newDocForMainList])
    }
  }

  const handleDeleteCommonDoc = (docId: string) => {
    if (confirm('Are you sure you want to delete this common document?')) {
      const docToDelete = commonDocuments.find(doc => doc.id === docId)
      if (!docToDelete) return
      
      // Remove from common documents
      const updatedCommonDocs = commonDocuments.filter(doc => doc.id !== docId)
      setCommonDocuments(updatedCommonDocs)
      
      // Remove from main documents list if it exists
      const updatedDocuments = documents.filter(doc => 
        doc.name.toLowerCase().trim() !== docToDelete.name.toLowerCase().trim()
      )
      updateDocuments(updatedDocuments)
    }
  }

  const handleAddNewCommonDoc = () => {
    const newDoc: DocumentRequirement = {
      id: `common-${Date.now()}`,
      name: "",
      description: "",
      isMandatory: true,
      format: ""
    }
    setEditingCommonDoc(newDoc)
  }

  const handleCancelEditCommonDoc = () => {
    setEditingCommonDoc(null)
  }

  // ✅ NEW: Apply selected document
  const applyDocument = (selectedDoc: DocumentRequirement) => {
    // Check if document already exists (case-insensitive)
    const existingDoc = documents.find(doc => 
      doc.name.toLowerCase().trim() === selectedDoc.name.toLowerCase().trim()
    )
    
    if (existingDoc) {
      alert(`Document "${selectedDoc.name}" already exists in your list.`)
      return
    }
    
    // Add the selected document with a new ID
    const newDocument = {
      ...selectedDoc,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    }
    
    updateDocuments([...documents, newDocument])
  }

  // Auto-save documents when they change
  useEffect(() => {
    if (configId && documents.length > 0) {
      saveDocumentsStep()
    }
  }, [documents, configId])

  const saveDocumentsStep = async () => {
    if (!configId) return
    try {
      const response = await fetch("http://localhost:5000/api/configurations/save-step", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stepNumber: 4,
          stepData: { documents },
          configId: configId,
        }),
      })
      if (!response.ok) {
        console.error("Failed to save documents step")
      }
    } catch (error) {
      console.error("Error saving documents step:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    const checked = (e.target as HTMLInputElement).checked
    setCurrentDocument((prev) => {
      if (!prev) return null
      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }
    })
  }

  const handleAddOrUpdateDocument = async () => {
    if (!currentDocument || !currentDocument.name.trim()) {
      return
    }

    let updatedDocuments
    if (currentDocument.id) {
      updatedDocuments = documents.map((doc) => (doc.id === currentDocument.id ? { ...currentDocument } : doc))
    } else {
      const newDoc = {
        ...currentDocument,
        id: Date.now().toString(),
      }
      updatedDocuments = [...documents, newDoc]
    }

    updateDocuments(updatedDocuments)
    setCurrentDocument(null)
  }

  const handleEditDocument = (id: string) => {
    const docToEdit = documents.find((doc) => doc.id === id)
    if (docToEdit) {
      setCurrentDocument(docToEdit)
    }
  }

  const handleCancelEdit = () => {
    setCurrentDocument(null)
  }

  const handleRemoveDocument = (id: string) => {
    updateDocuments(documents.filter((doc) => doc.id !== id))
  }

  // Handle sample image upload
  const uploadSampleImages = async (documentId: string, files: File[]) => {
    if (!configId) {
      setUploadError("Please save the document first before uploading samples")
      return
    }

    // Check if document exists in the current documents array
    const documentExists = documents.find((doc) => doc.id === documentId)
    if (!documentExists) {
      setUploadError("Document not found. Please save the document first.")
      return
    }

    setUploadingDocId(documentId)
    setUploadError("")

    try {
      const formData = new FormData()
      formData.append("configId", configId)
      formData.append("documentId", documentId)
      files.forEach((file) => {
        formData.append("samples", file)
      })

      console.log("Uploading samples for document:", documentId, "Config:", configId)

      const response = await fetch("http://localhost:5000/api/configurations/save-document-samples", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Failed to upload samples: ${response.status} - ${errorData.message}`)
      }

      const result = await response.json()

      // Update local state with new sample URLs
      const updatedDocuments = documents.map((doc) => {
        if (doc.id === documentId) {
          const updatedDoc = result.data.documents.find((d: any) => d.id === documentId)
          return updatedDoc ? { ...doc, sample: updatedDoc.sample } : doc
        }
        return doc
      })

      updateDocuments(updatedDocuments)
    } catch (error) {
      console.error("Error uploading samples:", error)
      // Fixed: Properly handle unknown error type
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      setUploadError(`Failed to upload sample images: ${errorMessage}`)
    } finally {
      setUploadingDocId(null)
    }
  }

  // Handle sample image removal
  const removeSampleImage = async (documentId: string, sampleUrl: string) => {
    if (!configId) return

    try {
      const response = await fetch("http://localhost:5000/api/configurations/remove-document-sample", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          configId,
          documentId,
          sampleUrl,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to remove sample: ${response.status}`)
      }

      // Update local state
      const updatedDocuments = documents.map((doc) => {
        if (doc.id === documentId) {
          return {
            ...doc,
            sample: doc.sample?.filter((url) => url !== sampleUrl) || [],
          }
        }
        return doc
      })

      updateDocuments(updatedDocuments)
    } catch (error) {
      console.error("Error removing sample:", error)
      setUploadError("Failed to remove sample image")
    }
  }

  const SampleImageUpload: React.FC<{ documentId: string; samples: string[] }> = ({ documentId, samples }) => {
    const onDrop = useCallback(
      (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
          uploadSampleImages(documentId, acceptedFiles)
        }
      },
      [documentId],
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: {
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
        "image/webp": [".webp"],
      },
      maxFiles: 5,
      maxSize: 5 * 1024 * 1024, // 5MB
    })

    return (
      <div className="mt-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">Sample Images (Optional)</label>
        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
            uploadingDocId === documentId
              ? "border-gray-300 bg-gray-100 cursor-not-allowed"
              : isDragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-blue-400"
          }`}
        >
          <input {...getInputProps()} />
          {uploadingDocId === documentId ? (
            <div className="text-blue-600">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              Uploading...
            </div>
          ) : (
            <>
              <FaUpload className="mx-auto text-2xl mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">
                {isDragActive ? "Drop sample images here..." : "Drag & drop sample images, or click to select"}
              </p>
              <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WEBP • Max 5MB each • Up to 5 images</p>
            </>
          )}
        </div>

        {/* Display uploaded samples */}
        {samples && samples.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Samples:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {samples.map((sampleUrl, index) => (
                <div key={index} className="relative group">
                  <img
                    src={sampleUrl || "/placeholder.svg"}
                    alt={`Sample ${index + 1}`}
                    className="w-full h-20 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removeSampleImage(documentId, sampleUrl)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove sample"
                  >
                    <FaTrash size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {uploadError && <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">{uploadError}</div>}
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    nextStep()
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Document Requirements</h2>

      {/* ✅ NEW: Common Documents Checkbox */}
      <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeCommonDocuments"
              checked={includeCommonDocuments}
              onChange={(e) => handleCommonDocumentsChange(e.target.checked)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mr-3"
            />
            <label htmlFor="includeCommonDocuments" className="text-lg font-medium text-green-900">
              📄 Include Common Documents Required for Tourist Visa Application
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-green-700 bg-green-100 px-2 py-1 rounded">
              {commonDocuments.length} documents
            </span>
            <button
              type="button"
              onClick={() => setShowCommonDocsManager(!showCommonDocsManager)}
              className="text-sm text-green-600 hover:text-green-800 font-medium px-2 py-1 border border-green-300 rounded hover:bg-green-50"
            >
              <FaEdit className="inline mr-1" />
              {showCommonDocsManager ? 'Hide Manager' : 'Manage'}
            </button>
          </div>
        </div>
        
        {includeCommonDocuments && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {commonDocuments.map((doc) => (
              <div key={doc.id} className="p-3 bg-white rounded border border-green-200">
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">📄</span>
                  <h4 className="font-medium text-gray-900 text-sm">{doc.name}</h4>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">{doc.description}</p>
                {doc.isMandatory && (
                  <span className="inline-block mt-1 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                    Mandatory
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-3 text-sm text-green-700">
          {includeCommonDocuments ? (
            <p>✅ Common tourist visa documents are included in this configuration</p>
          ) : (
            <p>❌ Common tourist visa documents are excluded from this configuration</p>
          )}
        </div>

        {/* ✅ NEW: Common Documents Manager */}
        {showCommonDocsManager && (
          <div className="mt-6 p-4 bg-white rounded-lg border border-green-300">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Manage Common Documents</h4>
              <button
                type="button"
                onClick={handleAddNewCommonDoc}
                className="px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 flex items-center"
              >
                <FaPlus className="mr-1" />
                Add New
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Description</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-700">Format</th>
                    <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700">Mandatory</th>
                    <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {commonDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm">{doc.name}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm max-w-xs truncate" title={doc.description}>
                        {doc.description}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">{doc.format}</td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {doc.isMandatory ? (
                          <span className="text-red-600 font-semibold">✓</span>
                        ) : (
                          <span className="text-gray-400">✗</span>
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            type="button"
                            onClick={() => handleEditCommonDoc(doc)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCommonDoc(doc.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Edit Form for Common Documents */}
            {editingCommonDoc && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                <h5 className="text-md font-medium mb-4">
                  {commonDocuments.find(doc => doc.id === editingCommonDoc.id) ? 'Edit Common Document' : 'Add New Common Document'}
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      value={editingCommonDoc.name}
                      onChange={(e) => setEditingCommonDoc({...editingCommonDoc, name: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Document name"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={editingCommonDoc.description}
                      onChange={(e) => setEditingCommonDoc({...editingCommonDoc, description: e.target.value})}
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Document description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                    <input
                      type="text"
                      value={editingCommonDoc.format || ''}
                      onChange={(e) => setEditingCommonDoc({...editingCommonDoc, format: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Document format"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingCommonDoc.isMandatory}
                      onChange={(e) => setEditingCommonDoc({...editingCommonDoc, isMandatory: e.target.checked})}
                      className="mr-2"
                    />
                    <span className="text-sm">Mandatory Document</span>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    type="button"
                    onClick={handleCancelEditCommonDoc}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    <FaTimes className="mr-1 inline" />
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCommonDoc}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    disabled={!editingCommonDoc.name.trim()}
                  >
                    <FaSave className="mr-1 inline" />
                    {commonDocuments.find(doc => doc.id === editingCommonDoc.id) ? 'Save Changes' : 'Add Document'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ✅ NEW: Template Selector Section */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-blue-900 flex items-center">
            <FaCopy className="mr-2" />
            Use Existing Document Templates
          </h3>
          <button
            type="button"
            onClick={() => setShowTemplateSelector(!showTemplateSelector)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {showTemplateSelector ? "Hide Templates" : "Show Templates"}
          </button>
        </div>

        {showTemplateSelector && (
          <div className="space-y-4">
            {loadingTemplates ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Loading templates...</p>
              </div>
            ) : templates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 border rounded-lg cursor-pointer transition-all duration-200 border-gray-200 hover:border-blue-300 hover:bg-blue-25"
                    onClick={() => applyDocument(doc)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{doc.name}</h4>
                      {doc.isMandatory && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Mandatory</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      <p className="mb-2 text-xs">{doc.description}</p>
                      {doc.format && (
                        <p className="text-xs text-gray-500">Format: {doc.format}</p>
                      )}
                      {doc.sample && doc.sample.length > 0 && (
                        <p className="text-xs text-gray-500">{doc.sample.length} sample(s)</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        applyDocument(doc)
                      }}
                      className="mt-3 w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <FaDownload className="mr-1" />
                      Add This Document
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <FaCopy className="mx-auto text-2xl mb-2 text-gray-400" />
                <p>No templates available</p>
              </div>
            )}
          </div>
        )}

        {/* No longer showing "✓ Template applied successfully!" as templates are now individual documents */}
      </div>

      {!configId && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ Please save your configuration first to enable sample image uploads.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {documents.length > 0 ? (
          <div className="mb-6 space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">
                    {doc.name}
                    {doc.isMandatory && (
                      <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Mandatory</span>
                    )}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => handleEditDocument(doc.id)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit document"
                    >
                      <FaEdit />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveDocument(doc.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove document"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                {doc.description && <p className="text-sm text-gray-600 mb-2">{doc.description}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-3">
                  {doc.format && (
                    <div>
                      <span className="text-gray-500">Format:</span> {doc.format}
                    </div>
                  )}
                  {doc.sample && doc.sample.length > 0 && (
                    <div>
                      <span className="text-gray-500">Samples:</span> {doc.sample.length} image(s)
                    </div>
                  )}
                </div>
                {/* Sample Image Upload Component - Only show if configId exists */}
                {configId && <SampleImageUpload documentId={doc.id} samples={doc.sample || []} />}
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-6 text-gray-500 text-center py-4">No documents added yet</div>
        )}

        {/* Form for adding/editing documents */}
        {currentDocument ? (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-4">{currentDocument.id ? "Edit Document" : "Add New Document"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={currentDocument.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={currentDocument.description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                <input
                  type="text"
                  name="format"
                  value={currentDocument.format}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isMandatory"
                  checked={currentDocument.isMandatory}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-sm">Mandatory Document</span>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
              >
                <FaTimes className="mr-2" /> Cancel
              </button>
              <button
                type="button"
                onClick={handleAddOrUpdateDocument}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                {currentDocument.id ? (
                  <>
                    <FaSave className="mr-2" /> Save Changes
                  </>
                ) : (
                  <>
                    <FaPlus className="mr-2" /> Add Document
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() =>
              setCurrentDocument({
                id: "",
                name: "",
                description: "",
                isMandatory: true,
                sample: [],
                format: "",
              })
            }
            className="mb-6 flex items-center px-4 py-2 bg-green-600 text-white rounded-md"
          >
            <FaPlus className="mr-2" /> Add Document
          </button>
        )}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <button type="submit" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md">
            Next <FaArrowRight className="ml-2" />
          </button>
        </div>
      </form>
    </div>
  )
}

export default DocumentRequirements
