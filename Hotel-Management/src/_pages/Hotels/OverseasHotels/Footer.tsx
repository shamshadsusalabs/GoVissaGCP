import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 py-8 px-4 sm:px-6 lg:px-8 ml-[200px] max-w-[1400px] p-6 space-y-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Travel Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Travel Information</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-600 hover:underline transition">Travel Guide</a></li>
              <li><a href="#" className="hover:text-blue-600 hover:underline transition">Flight Information</a></li>
              <li><a href="#" className="hover:text-blue-600 hover:underline transition">Hotel Information</a></li>
              <li><a href="#" className="hover:text-blue-600 hover:underline transition">Destination Finder</a></li>
              <li><a href="#" className="hover:text-blue-600 hover:underline transition">Travel Insurance</a></li>
            </ul>
          </div>

          {/* Franchise Cooperation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Franchise Cooperation</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-600 hover:underline transition">Partner With Us</a></li>
              <li><a href="#" className="hover:text-blue-600 hover:underline transition">Affiliate Program</a></li>
              <li><a href="#" className="hover:text-blue-600 hover:underline transition">Travel Agent</a></li>
              <li><a href="#" className="hover:text-blue-600 hover:underline transition">Corporate Travel</a></li>
              <li><a href="#" className="hover:text-blue-600 hover:underline transition">List Your Property</a></li>
            </ul>
          </div>

          {/* About Ctrip */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About Ctrip</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-600 hover:underline transition">About Us</a></li>
              <li><a href="#" className="hover:text-blue-600 hover:underline transition">Careers</a></li>
              <li><a href="#" className="hover:text-blue-600 hover:underline transition">Press Center</a></li>
              <li><a href="#" className="hover:text-blue-600 hover:underline transition">Investor Relations</a></li>
              <li><a href="#" className="hover:text-blue-600 hover:underline transition">Privacy Policy</a></li>
            </ul>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center md:items-end">
            <div className="bg-white p-2 rounded shadow-sm mb-2">
              <div className="w-24 h-24 bg-gray-300 flex items-center justify-center">
                <span className="text-xs text-gray-500">QR Code</span>
              </div>
            </div>
            <p className="text-sm text-center md:text-right">Scan to download our app</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-8 pt-6 text-sm text-center text-gray-500">
          <p>© {new Date().getFullYear()} Ctrip. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;