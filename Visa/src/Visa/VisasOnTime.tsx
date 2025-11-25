import { FaStar } from "react-icons/fa";

const VisasOnTime = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Visa On Time
        </h2>
        <hr className="w-16 border-t-2 border-gray-300 mx-auto mb-10" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-gray-100 p-6 rounded-2xl text-left shadow-sm hover:shadow-md transition">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">99.2%</h3>
            <p className="text-lg font-medium text-gray-800">Visa on time</p>
            <p className="text-sm text-gray-600 mt-1">
              Never miss your trip. Visas on visaafy come 2x faster
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-gray-900 text-white p-6 rounded-2xl text-left shadow-sm hover:shadow-md transition">
            <h3 className="text-3xl font-bold mb-2"></h3>
            <p className="text-lg font-medium">Visa Processed</p>
            <p className="text-sm text-gray-300 mt-1">
              In just over a year, we are India&apos;s second largest visa processing platform.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#5E50FA] text-white p-6 rounded-2xl text-left shadow-sm hover:shadow-md transition">
            <h3 className="text-3xl font-bold mb-2 flex items-center gap-2">
              4.91 <FaStar className="text-white text-xl" />
            </h3>
            <p className="text-lg font-medium">Rating</p>
            <p className="text-sm text-indigo-100 mt-1">
              Across Trustpilot, app stores, and expert reviews, we&apos;ve scored highest-in-class reviews
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisasOnTime;
