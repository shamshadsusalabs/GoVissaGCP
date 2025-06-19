import React from 'react';
import { FaMapMarkerAlt, FaApple, FaGooglePlay } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-gray-700 py-20 px-6 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1 - Company */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-lg">Company</h4>
            <ul className="space-y-3">
              {['Careers', 'Blog', 'Newsroom', 'Contact', 'Partners', 'Inwards Out', 'Indian Armed Forces'].map((item) => (
                <li key={item} className="hover:text-gray-900 transition-colors cursor-pointer">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 - Products */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-lg">Products</h4>
            <ul className="space-y-3">
              {['GoVisaa', 'For Travel Agents', 'Security', 'Transparency', 'Visa Pre Approval', 'Vaya', 'U.S. Mock Interview'].map((item) => (
                <li key={item} className="hover:text-gray-900 transition-colors cursor-pointer">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Tools */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-lg">Tools</h4>
            <ul className="space-y-3">
              {[
                'Visa Photo Creator',
                'Schengen Cover Letter',
                'Schengen Invitation Letter',
                'Visa Eligibility Quiz',
                'Visa Glossary',
                'UAE Status Checker',
                'Vietnam Status Checker',
                'Passport Mobility Index',
                'Schengen Appointment Checker'
              ].map((item) => (
                <li key={item} className="hover:text-gray-900 transition-colors cursor-pointer">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Offices & App Stores */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-lg">Offices</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-gray-500 flex-shrink-0" />
                <span className="hover:text-gray-900 transition-colors">
                  7 Khullar Farms, Mandi Rd, Mehrauli, New Delhi, Delhi 110030
                </span>
              </li>
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-gray-500 flex-shrink-0" />
                <span className="hover:text-gray-900 transition-colors">
                  447 Broadway STE 851, New York, NY, 10013
                </span>
              </li>
            </ul>

            <h4 className="font-bold text-gray-900 mt-8 mb-4 text-lg">Get the App</h4>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center justify-center gap-2 bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors w-full sm:w-auto">
                <FaApple size={20} />
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-lg font-semibold -mt-1">App Store</div>
                </div>
              </button>
              <button className="flex items-center justify-center gap-2 bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors w-full sm:w-auto">
                <FaGooglePlay size={16} />
                <div className="text-left">
                  <div className="text-xs">Get it on</div>
                  <div className="text-lg font-semibold -mt-1">Google Play</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} GoVisaa. All rights reserved.
          </div>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a key={item} href="#" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;