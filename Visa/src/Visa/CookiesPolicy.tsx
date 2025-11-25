

const CookiesPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookies Policy</h1>
        <p className="text-lg text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 sm:p-10 lg:p-12">
        <div className="prose prose-lg max-w-none text-gray-600">
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">1. What Are Cookies</h2>
            <p className="mb-6">
              Cookies are small text files placed on your device when you visit <span className="font-bold text-blue-600">Visaafy</span>. They help us:
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {[
                { icon: '🔒', title: 'Secure Your Session', desc: 'Keep you logged in securely' },
                { icon: '📊', title: 'Analyze Usage', desc: 'Understand how visitors use our site' },
                { icon: '⚙️', title: 'Remember Preferences', desc: 'Save your language and settings' }
              ].map((item, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg text-center">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-medium text-lg text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">2. Types of Cookies We Use</h2>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cookie Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { type: 'Essential', purpose: 'Site functionality and security', duration: 'Session' },
                    { type: 'Analytics', purpose: 'Visitor statistics (Google Analytics)', duration: '2 years' },
                    { type: 'Preference', purpose: 'Remember your settings', duration: '1 year' },
                    { type: 'Marketing', purpose: 'Relevant ads (if enabled)', duration: '6 months' }
                  ].map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.purpose}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">3. Managing Cookies</h2>
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h3 className="font-medium text-lg text-gray-900 mb-3">Browser Controls</h3>
              <p className="mb-4">
                Most browsers allow you to:
              </p>
              <ul className="space-y-2 text-gray-600">
                {[
                  'View and delete cookies',
                  'Block third-party cookies',
                  'Get alerts for new cookies',
                  'Completely disable cookies'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-gray-500">
                Note: Disabling essential cookies may break site functionality.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">4. Changes to This Policy</h2>
            <p className="mb-6">
              We may update this policy occasionally. We'll notify you of significant changes by:
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-medium text-lg text-gray-900 mb-3">Website Notice</h3>
                <p className="text-gray-600">A banner on our homepage for 30 days</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-medium text-lg text-gray-900 mb-3">Email Notification</h3>
                <p className="text-gray-600">For registered users (if changes affect data use)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiesPolicy;