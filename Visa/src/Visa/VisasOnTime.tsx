import { FaStar } from "react-icons/fa";

const VisasOnTime = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          How we Simplified Visa?
        </h2>
        <hr className="w-16 border-t-2 border-gray-300 mx-auto mb-10" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-gray-100 p-6 rounded-2xl text-left shadow-sm hover:shadow-md transition">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">99.2%</h3>
            <p className="text-lg font-medium text-gray-800">
              Visa Approval Assistance
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Our expert documentation team ensures maximum accuracy and compliance for smoother approvals.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-gray-900 text-white p-6 rounded-2xl text-left shadow-sm hover:shadow-md transition">
            <h3 className="text-3xl font-bold mb-2">22+ Years</h3>
            <p className="text-lg font-medium">Visa Expertise</p>
            <p className="text-sm text-gray-300 mt-1">
              Proudly recognized as the largest visa processing platform, Visaafy brings decades of trusted experience — relied on by thousands every month.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#5E50FA] text-white p-6 rounded-2xl text-left shadow-sm hover:shadow-md transition">
            <h3 className="text-3xl font-bold mb-2 flex items-center gap-2">
              4.7 <FaStar className="text-white text-xl" />
            </h3>
            <p className="text-lg font-medium">Google Rating</p>
            <p className="text-sm text-indigo-100 mt-1">
              Thousands of travelers trust our services for transparent pricing, expert guidance, and reliable support — backed by consistently high ratings on Google.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-gray-100 p-6 rounded-2xl text-left shadow-sm hover:shadow-md transition md:col-span-1 sm:col-span-2">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              Live Tracking
            </h3>
            <p className="text-lg font-medium text-gray-800">
              Real-Time Application Tracking
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Track your visa status anytime with live updates directly from our system.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-gray-900 text-white p-6 rounded-2xl text-left shadow-sm hover:shadow-md transition md:col-span-1 sm:col-span-2">
            <h3 className="text-3xl font-bold mb-2">100% Secure</h3>
            <p className="text-lg font-medium">Encrypted Document Handling</p>
            <p className="text-sm text-gray-300 mt-1">
              Your personal data is protected with industry-grade encryption and security protocols for full safety.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default VisasOnTime;
