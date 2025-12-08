const AboutUs = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Visaafy</h1>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 sm:p-10 lg:p-12">
        <div className="prose prose-lg max-w-none text-gray-600">

          {/* INTRO */}
          <div className="mb-12">
            <p className="mb-6">
              <strong>Visaafy - A Unit of Kehar Travels</strong> is a trusted name in
              travel management and visa services, delivering reliable, transparent,
              and personalized travel solutions for individuals, families, and corporate
              clients across the globe.
            </p>

            <p className="mb-6">
              With years of experience in the travel industry, we specialize in creating
              smooth, stress-free travel experiences through professional planning,
              strong global partnerships, and a commitment to customer satisfaction.
            </p>

            <p className="mb-6">
              Our focus is not only on bookings but also on building long-term relationships
              through trust, service excellence, and accurate guidance. We aim to simplify
              international travel by offering one-stop solutions covering visas, flights,
              accommodation, holiday packages, and travel support — all under one trusted organization.
            </p>
          </div>

          {/* VISION */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b pb-2">
              Our Vision
            </h2>
            <p className="mb-6">
              To become a globally recognized travel and visa service provider known for
              transparency, efficiency, and customer-first service.
            </p>
          </div>

          {/* MISSION */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b pb-2">
              Our Mission
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To deliver reliable travel solutions with professionalism and integrity</li>
              <li>To provide accurate visa guidance and documentation support</li>
              <li>To ensure every client enjoys a hassle-free travel experience</li>
              <li>To build lasting client relationships through trust and service quality</li>
            </ul>
          </div>

          {/* VISA SERVICES */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b">
              Visa Services – Powered by Visaafy.com
            </h2>

            <p className="mb-6">
              Visaafy.com is the official visa processing and documentation division of
              Kehar Travel Services Pvt. Ltd., created to offer clients a faster, smarter,
              and more transparent visa experience.
            </p>

            <p className="mb-6">
              We understand that visa processing can be complicated and stressful.
              Visaafy.com simplifies the entire process by providing professional assistance,
              clear documentation guidance, and end-to-end support — from application
              submission to final decision.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Visa Expertise Includes:</h3>

            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Tourist Visas</li>
              <li>Business Visas</li>
              <li>Visitor Visas</li>
              <li>
                Support for destinations including the UK, Schengen countries, Canada, USA,
                Australia, New Zealand, UAE, Singapore, Thailand, and more.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">Documentation & Application Support</h3>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Profile assessment before applying</li>
              <li>Document checklist preparation</li>
              <li>Application form filling assistance</li>
              <li>Appointment booking</li>
              <li>File submission & tracking</li>
              <li>Embassy follow-ups (where applicable)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Choose Visaafy.com?</h3>

            <ul className="grid sm:grid-cols-2 gap-6 mb-6">
              {[
                'Expert evaluation before submission',
                'Transparent process with no false promises',
                'Personalized case handling',
                'Timely updates & support',
                'Accurate documentation guidance',
                'High success-oriented approach'
              ].map((item, index) => (
                <li key={index} className="flex items-start bg-blue-50 p-4 rounded-lg">
                  <svg
                    className="h-6 w-6 text-blue-500 mr-3 mt-0.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>

            <p className="text-sm text-gray-500 italic">
              Note: Visa approvals are subject to embassy discretion. Visaafy.com provides
              professional assistance and does not guarantee visa issuance.
            </p>
          </div>

          {/* WHY CHOOSE KEHAR TRAVELS */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b pb-2">
              Why Choose Kehar Travel Services?
            </h2>

            <ul className="grid sm:grid-cols-2 gap-6">
              {[
                'Experienced Professionals',
                'Transparent Pricing',
                'End-to-End Travel & Visa Solutions',
                'Global Supplier Network',
                'Customer-Centric Approach',
                'Ethical Business Practices'
              ].map((item, index) => (
                <li key={index} className="flex items-start bg-gray-50 p-4 rounded-lg">
                  <svg
                    className="h-6 w-6 text-blue-500 mr-3 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CUSTOMER CARE ONLY */}
          <div className="grid md:grid-cols-1">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Customer Care</h3>

              <p className="text-gray-600">
                Email:{" "}
                <a href="mailto:contact@visaafy.com" className="text-blue-600 hover:underline">
                  contact@visaafy.com
                </a>
              </p>

              <p className="text-gray-600 mt-2">Phone: 9289280509</p>

              <p className="text-gray-600 mt-2">
                Website:{" "}
                <a href="https://www.visaafy.com" className="text-blue-600 hover:underline">
                  www.visaafy.com
                </a>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutUs;
