const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Visaafy Privacy Policy</h1>
          <p className="text-gray-500">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="prose prose-blue max-w-none">
          <p className="text-gray-700 mb-6 leading-relaxed">
            At Visaafy, we value your privacy. We collect only necessary personal data to process visa applications, such as name, passport number, travel dates, and contact details.
          </p>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">What We Collect:</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Personal info (name, DOB, passport info)
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Travel-related info (flight, stay, etc.)
              </li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Why We Collect:</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                To process your visa applications accurately
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                To communicate with you regarding updates
              </li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Data Protection:</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Encrypted form submissions
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Stored securely on cloud servers
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Not shared with any third party without consent
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mt-8">
            <p className="text-blue-800 text-center">
              You have the right to access, modify, or delete your data. Email us at{" "}
              <a href="mailto:privacy@Visaafy.com" className="font-semibold hover:underline">
                privacy@Visaafy.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;