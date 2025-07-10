

const TermsAndConditions = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
        <p className="text-lg text-gray-600">Effective from: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 sm:p-10 lg:p-12">
        <div className="prose prose-lg max-w-none text-gray-600">
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">1. Service Agreement</h2>
            <p className="mb-6">
              By using <span className="font-bold text-blue-600">GoVisaa</span> services, you agree to these terms. We provide visa consultation and application assistance, but final approval rests with immigration authorities.
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6">
              <p className="text-yellow-800 font-medium">Important: We are not a government agency and cannot guarantee visa approval.</p>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">2. Client Responsibilities</h2>
            <div className="grid md:grid-cols-2 gap-8 mb-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-medium text-lg text-gray-900 mb-3">You Must:</h3>
                <ul className="space-y-3 text-gray-600">
                  {[
                    'Provide accurate information',
                    'Submit documents on time',
                    'Notify us of changes',
                    'Pay required fees',
                    'Follow immigration laws'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-medium text-lg text-gray-900 mb-3">You Must Not:</h3>
                <ul className="space-y-3 text-gray-600">
                  {[
                    'Provide false information',
                    'Miss embassy appointments',
                    'Expect guaranteed approval',
                    'Blame us for policy changes',
                    'Share login credentials'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">3. Fees & Payments</h2>
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refund Policy</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { service: 'Visa Consultation', fee: '₹2,500', refund: '100% if not started' },
                    { service: 'Application Processing', fee: '₹5,000', refund: '50% if documents not submitted' },
                    { service: 'Premium Assistance', fee: '₹10,000', refund: 'Non-refundable once started' },
                    { service: 'Government Fees', fee: 'Varies', refund: 'As per embassy rules' }
                  ].map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.service}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.fee}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.refund}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">4. Limitation of Liability</h2>
            <p className="mb-6">
              <span className="font-bold text-blue-600">GoVisaa</span> shall not be liable for:
            </p>
            <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-6">
              <ul className="space-y-2 text-red-800">
                {[
                  'Visa rejections by immigration authorities',
                  'Delays caused by third parties',
                  'Incorrect information provided by you',
                  'Changes in immigration policies',
                  'Force majeure events'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;