import UploadDifficultyMeter from './UploadDifficultyMeter';
import UploadTimeMeter from './UploadTimeMeter';
import Partners from './Partners';

const VisaRequirements = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 border-b-2 inline-block border-indigo-500">
        Dubai Visa Requirements
      </h2>

      <div className="flex gap-4 my-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
          <span>📷</span> Photo
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
          <span>🛂</span> Passport
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6">
        <UploadDifficultyMeter />
        <UploadTimeMeter />
      </div>

      <hr className="my-6" />

      <Partners />
    </div>
  );
};

export default VisaRequirements;
