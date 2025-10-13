const UploadDifficultyMeter = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">👍</span>
        <h3 className="text-md font-bold">Ease of Applying</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        <strong>8822 users+</strong> found uploading documents as <strong>very easy</strong>
      </p>
      <div className="relative w-32 h-32 mx-auto">
        {/* Simulated circular meter */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="font-bold text-lg">Easy</p>
            <p className="text-xs text-gray-500">Upload Difficulty Meter</p>
          </div>
        </div>
        <div className="absolute inset-0 rounded-full border-8 border-indigo-300"></div>
      </div>
    </div>
  );
};

export default UploadDifficultyMeter;
