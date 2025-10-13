import React from 'react';
import { FaMapMarkerAlt, FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-gray-700 py-12 px-6 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Column 1 - Company */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-lg">Company</h4>
            <div className="flex gap-4 mb-6">
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-400 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-700 transition-colors">
                <FaLinkedin size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-pink-600 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-red-600 transition-colors">
                <FaYoutube size={20} />
              </a>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Fast Visa Provider | Trusted Immigration Services
            </p>
            <div className="text-sm text-gray-500 space-y-2">
              <p>Email: contact@traveli.asia</p>
              <p>Phone: 9289280509</p>
              <p>
                CIN: U30400DL2004PTC124202<br />
                Registered since 2004<br />
                ROC: Delhi
              </p>
            </div>
          </div>

          {/* Column 2 - Services */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-lg">Services</h4>
            <ul className="space-y-3">
              {['Visa Processing', 'Immigration Consultation', 'Document Verification', 'Travel Insurance', 'Flight Booking', 'Hotel Reservation'].map((item) => (
                <li key={item} className="hover:text-gray-900 transition-colors cursor-pointer">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Offices */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-lg">Our Offices</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-gray-500 flex-shrink-0" />
                <div>
                  <span className="hover:text-gray-900 transition-colors block">
                    New Delhi Head Office
                  </span>
                  <span className="text-sm text-gray-500">
                    KEHAR TRAVEL SERVICES PRIVATE LIMITED on its Email address - contact@traveli.asia. B 122 MAIN BAZARSHAKARPUR , DELHI, Delhi, India - 110092.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-gray-500 flex-shrink-0" />
                <div>
                  <span className="hover:text-gray-900 transition-colors block">
                    Second Office
                  </span>
                  <span className="text-sm text-gray-500">
                    Kehar Travel Services Pvt Ltd iMNM-1 Old DLF Colony, Sector-14, Gurgaon, Haryana, 122001.
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} GoVisaa. All rights reserved.
          </div>
          <div className="flex gap-6">
             <Link to="/about" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">
              About Us
            </Link>
            <Link to="/PrivacyPolicy" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/TermsAndConditions" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/CookiesPolicy" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">
              Cookies Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
