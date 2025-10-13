const AboutUs = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Govisaa</h1>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 sm:p-10 lg:p-12">
        <div className="prose prose-lg max-w-none text-gray-600">
          <div className="mb-12">
            <p className="mb-6">
              At Govisaa, we are committed to simplifying global travel through fast, secure, and reliable visa services. Whether you're applying for a tourist, business, or student visa, our expert team ensures a seamless process from start to finish.
            </p>
            <p className="mb-6">
              With a presence across multiple countries and a customer-first approach, we make visa applications transparent, hassle-free, and tailored to your travel needs.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">Why Choose Us:</h2>
            <ul className="grid sm:grid-cols-2 gap-6 mb-6">
              {[
                '99% visa approval rate',
                'Personalized application support',
                'Real-time application tracking',
                'Global expertise, local support'
              ].map((item, index) => (
                <li key={index} className="flex items-start bg-blue-50 p-4 rounded-lg">
                  <svg className="h-6 w-6 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Head Office
              </h3>
              <p className="text-gray-600">[Your head office address here]</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Customer Care
              </h3>
              <p className="text-gray-600">Email: <a href="mailto:support@govisaa.com" className="text-blue-600 hover:underline">support@govisaa.com</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;