import React from 'react';
import { FaFacebook, FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-gray-700 py-12 px-6 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">

          {/* Column 1 - Company */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-lg">Visaafy</h4>

            <div className="flex gap-4 mb-6">
              <a href="https://www.facebook.com/profile.php?id=61584367499474" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600">
                <FaFacebook size={20} />
              </a>
              <a href="https://x.com/visaafy" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black">
                <FaXTwitter size={20} />
              </a>
              <a href="https://www.linkedin.com/company/visaafy" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-700">
                <FaLinkedin size={20} />
              </a>
              <a href="https://www.instagram.com/visaafy/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-600">
                <FaInstagram size={20} />
              </a>
              <a href="https://www.youtube.com/channel/UCbXurecl6VRaAODKKoM8hAA" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-red-600">
                <FaYoutube size={20} />
              </a>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Fast Visa Provider
            </p>

            <div className="text-sm text-gray-500 space-y-2">
              <p>Email: contact@visaafy.com</p>
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
              <li className="text-gray-600">Visa Processing</li>
              <li className="text-gray-600">Travel Insurance</li>
              <li className="text-gray-600">Flight Booking</li>
              <li className="text-gray-600">Hotel Reservation</li>
            </ul>
          </div>

          {/* Column 3 - Contact + IATA */}
          <div className="flex flex-col gap-6">
            <div>
              <h4 className="font-bold text-gray-900 mb-4 text-lg">Contact Information</h4>
              <ul className="space-y-3">
                <li className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-700">Email:</span> contact@visaafy.com
                </li>
                <li className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-700">Phone:</span> 9289280509
                </li>
              </ul>
            </div>

            {/* IATA Logo */}
            <div>
              <img
                src="/iata.png"
                alt="IATA"
                className="h-18 object-contain opacity-95"
              />
            </div>
          </div>
        </div>

        <div className="text-center text-gray-600 text-sm mt-10">
          Powered by <span className="font-semibold text-gray-800">Kehar Travel Services Pvt. Ltd.</span>
        </div>

        <div className="border-t border-gray-200 mt-6 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Visaafy. All rights reserved.
          </div>

          <div className="flex gap-6">
            <Link to="/about" className="text-gray-500 hover:text-gray-900 text-sm">About Us</Link>
            <Link to="/PrivacyPolicy" className="text-gray-500 hover:text-gray-900 text-sm">Privacy Policy</Link>
            <Link to="/TermsAndConditions" className="text-gray-500 hover:text-gray-900 text-sm">Terms & Conditions</Link>
            <Link to="/CookiesPolicy" className="text-gray-500 hover:text-gray-900 text-sm">Cookies Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
