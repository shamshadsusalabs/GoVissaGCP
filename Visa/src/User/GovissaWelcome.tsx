// src/User/GovissaWelcome.tsx
import { FaPassport, FaGlobeAmericas, FaClock, FaCheckCircle } from "react-icons/fa";
import { GiEarthAmerica } from "react-icons/gi";


const GovissaWelcome = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8  rounded-lg shadow-lg animate-fade-in">
      <div className="flex items-center justify-center mb-6">
        {/* <RiVisaLine className="text-6xl text-blue-600 mr-3" /> */}
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
         Visaafy
        </h1>
      </div>
      
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Welcome to Your Visa Application Portal
      </h2>
      
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
          <FaPassport className="text-4xl text-blue-500 mb-3" />
          <h3 className="font-medium text-gray-700">Passport Services</h3>
        </div>
        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
          <GiEarthAmerica className="text-4xl text-green-500 mb-3" />
          <h3 className="font-medium text-gray-700">Visa Applications</h3>
        </div>
        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
          <FaClock className="text-4xl text-yellow-500 mb-3" />
          <h3 className="font-medium text-gray-700">Track Status</h3>
        </div>
        <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
          <FaCheckCircle className="text-4xl text-emerald-500 mb-3" />
          <h3 className="font-medium text-gray-700">Approvals</h3>
        </div>
      </div>
      
      <p className="text-gray-600 max-w-2xl mb-6">
        Begin your journey with confidence. Manage your visa applications, track status in real-time, 
        and get notified when approvals are ready. Our platform makes international travel planning seamless.
      </p>
      
      <div className="flex items-center text-sm text-blue-500">
        <FaGlobeAmericas className="mr-2" />
        <span>Trusted by travelers in 50+ countries</span>
      </div>
    </div>
  );
};

export default GovissaWelcome;