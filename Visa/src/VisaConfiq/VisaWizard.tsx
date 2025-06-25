import React, { useState } from 'react';
import ContinentSelection from './ContinentSelection';
import CountryDetails from './CountryDetails';
import VisaTypes from './VisaTypes';
import DocumentRequirements from './DocumentRequirements';
import EligibilityCriteria from './EligibilityCriteria';
import RejectionReasons from './RejectionReasons';
import ImageUpload from './ImageUpload';
import ReviewSubmit from './ReviewSubmit';

interface ImageData {
  preview: string;
  file: File;
}

interface VisaConfiguration {
  continent: string;
  countryDetails: {
    name: string;
    code: string;
    embassyLocation: string;
    generalRequirements: string;
  };
  visaTypes: VisaType[];
  documents: DocumentRequirement[];
  eligibility: string;
  rejectionReasons: RejectionReason[];
  images: ImageData[];  // Now contains File objects
}

interface VisaType {
  id: string;
  name: string;
  code: string;
  category: string;
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

interface DocumentRequirement {
  id: string;
  name: string;
  description: string;
  isMandatory: boolean;
  example?: string;
  format?: string;
}

interface RejectionReason {
  id: string;
  reason: string;
  description: string;
  frequency: 'Rare' | 'Occasional' | 'Common';
}

const VisaWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<VisaConfiguration>({
    continent: '',
    countryDetails: {
      name: '',
      code: '',
      embassyLocation: '',
      generalRequirements: ''
    },
    visaTypes: [],
    documents: [],
    eligibility: '',
    rejectionReasons: [],
    images: []
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const updateConfig = (key: keyof VisaConfiguration, value: unknown) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <ContinentSelection 
                 continent={config.continent} 
                 setContinent={(val) => updateConfig('continent', val)} 
                 nextStep={nextStep}
               />;
      case 2:
        return <CountryDetails 
                 details={config.countryDetails} 
                 updateDetails={(val) => updateConfig('countryDetails', val)} 
                 nextStep={nextStep} 
                 prevStep={prevStep}
               />;
      case 3:
        return <VisaTypes 
                 visaTypes={config.visaTypes} 
                 updateVisaTypes={(val) => updateConfig('visaTypes', val)} 
                 nextStep={nextStep} 
                 prevStep={prevStep}
               />;
      case 4:
        return <DocumentRequirements 
                 documents={config.documents} 
                 updateDocuments={(val) => updateConfig('documents', val)} 
                 nextStep={nextStep} 
                 prevStep={prevStep}
               />;
      case 5:
        return <EligibilityCriteria 
                 eligibility={config.eligibility} 
                 updateEligibility={(val) => updateConfig('eligibility', val)} 
                 nextStep={nextStep} 
                 prevStep={prevStep}
               />;
      case 6:
        return <RejectionReasons 
                 reasons={config.rejectionReasons} 
                 updateReasons={(val) => updateConfig('rejectionReasons', val)} 
                 nextStep={nextStep} 
                 prevStep={prevStep}
               />;
      case 7:
        return <ImageUpload 
                 images={config.images} 
                 updateImages={(val) => updateConfig('images', val)} 
                 nextStep={nextStep} 
                 prevStep={prevStep}
               />;
      case 8:
        return <ReviewSubmit 
                 config={config} 
                 prevStep={prevStep}
                onSubmit={async () => {
  try {
    const formData = new FormData();

    // Separate images from the rest of the config
    const { images, continent, countryDetails, visaTypes, documents, eligibility, rejectionReasons } = config;

    // Append each field individually (backend expects this)
    formData.append('continent', continent);
    formData.append('countryDetails', JSON.stringify(countryDetails));
    formData.append('visaTypes', JSON.stringify(visaTypes));
    formData.append('documents', JSON.stringify(documents));
    formData.append('eligibility', eligibility);
    formData.append('rejectionReasons', JSON.stringify(rejectionReasons));

    // Append each image file
    images.forEach((image) => {
      formData.append('images', image.file); // 👈 'images' matches multer.array('images')
    });

    // Optional: Debugging the FormData before submission
    console.log('📦 FormData being sent:');
    for (const pair of formData.entries()) {
      if (pair[1] instanceof File) {
        console.log(`${pair[0]}:`, pair[1].name, pair[1].type);
      } else {
        console.log(`${pair[0]}:`, pair[1]);
      }
    }

    // Send form data to backend
    const response = await fetch('http://localhost:5000/api/configurations/add', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Upload failed!');

    const result = await response.json();
    console.log('✅ Success:', result);
    alert('Visa configuration submitted successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
    alert('Failed to submit. Check console for details.');
  }
}}


               />;
      default:
        return <ContinentSelection 
                 continent={config.continent} 
                 setContinent={(val) => updateConfig('continent', val)} 
                 nextStep={nextStep}
               />;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-2">Visa Configuration Wizard</h1>
        <div className="flex justify-center mb-8">
          <div className="steps flex overflow-x-auto py-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((stepNumber) => (
              <div key={stepNumber} className="step-item flex flex-col items-center mx-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                  ${step === stepNumber ? 'bg-blue-600 text-white' : 
                    step > stepNumber ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                  {stepNumber}
                </div>
                <div className="text-xs mt-2 text-gray-600 text-center capitalize">
                  {stepNumber === 1 && 'Continent'}
                  {stepNumber === 2 && 'Country'}
                  {stepNumber === 3 && 'Visa Types'}
                  {stepNumber === 4 && 'Documents'}
                  {stepNumber === 5 && 'Eligibility'}
                  {stepNumber === 6 && 'Rejections'}
                  {stepNumber === 7 && 'Images'}
                  {stepNumber === 8 && 'Review'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {renderStep()}
    </div>
  );
};

export default VisaWizard;