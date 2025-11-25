const TermsAndConditions = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Terms of Use - Visaafy</h1>
          <p className="text-gray-500">Effective from: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="prose prose-blue max-w-none">
          <p className="text-gray-700 mb-6">
            By using this website, you agree to:
          </p>
          
          <ol className="list-decimal pl-5 mb-6 space-y-3 text-gray-700">
            <li>Provide accurate and truthful information in the visa application.</li>
            <li>Use this platform only for lawful purposes.</li>
            <li>Allow Visaafy to submit applications on your behalf to embassies or visa centers.</li>
          </ol>

          <h2 className="text-xl font-semibold text-gray-800 mb-3 mt-8 pb-2 border-b border-gray-200">Refund & Cancellation Policy:</h2>
          <ul className="list-disc pl-5 mb-6 space-y-2 text-gray-700">
            <li>Application fees are non-refundable once submitted.</li>
            <li>You can cancel before submission with a partial refund.</li>
          </ul>

          <div className="bg-yellow-50 rounded-lg p-4 mt-8">
            <p className="text-yellow-800">
              <strong>Service Disclaimer:</strong> Visaafy is not a government body. We are a third-party visa consultancy offering support services. Visa issuance is solely at the discretion of the respective embassy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;