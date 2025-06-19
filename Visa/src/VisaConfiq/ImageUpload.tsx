import React, { useState, useCallback, useEffect } from 'react';
import { FaUpload, FaTrash, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import Dropzone from 'react-dropzone';

interface ImageData {
  preview: string; // For displaying in UI
  file: File; // For actual upload
}

interface ImageUploadProps {
  images: ImageData[];
  updateImages: (images: ImageData[]) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  updateImages,
  nextStep,
  prevStep,
}) => {
  const [uploading, setUploading] = useState(false);

  // Handle file drop
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setUploading(true);
      const newImages = acceptedFiles.map((file) => ({
        preview: URL.createObjectURL(file), // For preview
        file: file, // For actual upload
      }));
      updateImages([...images, ...newImages]);
      setUploading(false);
    },
    [images, updateImages]
  );

  // Remove an image
  const removeImage = (index: number) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview); // Clean up memory
    newImages.splice(index, 1);
    updateImages(newImages);
  };

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, [images]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Upload Country Images</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload up to 5 images of the country (flags, landmarks, etc.)
          </label>

          <Dropzone
            onDrop={onDrop}
            accept={{
              'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'],
            }}
            maxFiles={5 - images.length}
            disabled={images.length >= 5}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
                  images.length >= 5 ? 'border-gray-300 bg-gray-100' : 'border-blue-300 hover:border-blue-500'
                }`}
              >
                <input {...getInputProps()} />
                {uploading ? (
                  <div className="text-blue-600">Uploading...</div>
                ) : (
                  <>
                    <FaUpload className="mx-auto text-3xl text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      {images.length >= 5
                        ? 'Maximum 5 images reached'
                        : 'Drag & drop images here, or click to select'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {5 - images.length} more can be added
                    </p>
                  </>
                )}
              </div>
            )}
          </Dropzone>
        </div>

        {images.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-gray-700">Uploaded Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img.preview}
                    alt={`Country image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            disabled={images.length === 0}
          >
            Next <FaArrowRight className="ml-2" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ImageUpload;