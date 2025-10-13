const UploadTimeMeter = () => {
  return (
    <div className="bg-green-50 p-6 rounded-xl shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">⏱️</span>
        <h3 className="text-md font-bold">Time to Upload</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        <strong>8822 users+</strong> average docs upload time is <strong>01:24 seconds</strong>
      </p>
      <div className="relative w-32 h-32 mx-auto">
        {/* Simulated progress meter */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="font-bold text-lg">01:24</p>
            <p className="text-xs text-gray-500">Time taken to upload</p>
          </div>
        </div>
        <div className="absolute inset-0 rounded-full border-8 border-green-300"></div>
      </div>
    </div>
  );
};

export default UploadTimeMeter;
