

const PrivacyPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-lg text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 sm:p-10 lg:p-12">
        <div className="prose prose-lg max-w-none text-gray-600">
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">1. Introduction</h2>
            <p className="mb-6">
              At <span className="font-bold text-blue-600">GoVisaa</span>, we are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information when you use our visa services.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">2. Information We Collect</h2>
            <div className="grid md:grid-cols-2 gap-8 mb-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-medium text-lg text-gray-900 mb-3">Personal Information</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Full name and contact details
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Passport and visa information
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Payment and billing details
                  </li>
                </ul>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-medium text-lg text-gray-900 mb-3">Usage Data</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    IP address and device information
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Website usage patterns
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Cookies and tracking data
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">3. How We Use Your Data</h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
              <p className="text-blue-800 font-medium">We only use your information to provide and improve our visa services.</p>
            </div>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {[
                'Process visa applications',
                'Communicate application status',
                'Provide customer support',
                'Improve our services',
                'Prevent fraud',
                'Comply with legal requirements'
              ].map((item, index) => (
                <li key={index} className="flex items-start bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                  <svg className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">4. Data Security</h2>
            <p className="mb-4">
              We implement industry-standard security measures including:
            </p>
            <div className="flex flex-wrap gap-3 mb-6">
              {['256-bit SSL encryption', 'Secure servers', 'Regular audits', 'Access controls', 'Data minimization'].map((item, index) => (
                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">5. Contact Us</h2>
            <p className="mb-6">
              For any privacy concerns, please contact our Data Protection Officer:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg max-w-md">
              <p className="font-medium text-gray-900 mb-2">Email: <span className="text-blue-600">privacy@govisaa.com</span></p>
              <p className="font-medium text-gray-900">Phone: <span className="text-blue-600">+91 1234567890</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;