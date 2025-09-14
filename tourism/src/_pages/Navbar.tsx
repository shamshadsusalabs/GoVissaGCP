import React from 'react';
import { FaSearch, FaPhoneAlt, FaHandshake, FaUser, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
const Navbar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <nav className="flex flex-wrap items-center justify-between px-4 py-3 shadow-md bg-white md:px-6 ml-0 md:ml-[200px]">
      {/* Left side - Logo and Mobile Menu */}
      <div className="flex items-center space-x-2 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="Logo" className="h-8" />
          <span className="text-blue-600 text-xl font-bold hidden sm:inline">Tourism</span>
        </div>
        <button className="md:hidden text-gray-600">
          <FaBars size={20} />
        </button>
      </div>

      {/* Search Bar - Center */}
      <div className="mt-3 w-full md:mt-0 md:w-auto md:flex-1 md:max-w-xl md:mx-4">
        <div className="flex items-center w-full border rounded overflow-hidden shadow-sm">
          <input
            type="text"
            placeholder="Search for any travel related"
            className="w-full px-4 py-2 outline-none"
          />
          <button className="bg-blue-500 text-white px-4 py-2">
            <FaSearch />
          </button>
        </div>
      </div>

      {/* Right Side Buttons and Icons */}
      <div className="hidden md:flex items-center space-x-4 lg:space-x-6 text-sm text-gray-700">
        <button    onClick={() => navigate('/login')} className="bg-blue-50 px-4 py-2 rounded-full text-blue-600 font-medium hover:bg-blue-100 whitespace-nowrap">
          Log in
        </button>
        <button className="hover:text-blue-600 whitespace-nowrap">register</button>
        <span className="border-l h-4"></span>
        <button className="hover:text-blue-600 whitespace-nowrap hidden lg:inline">My Orders ▾</button>
        <span className="border-l h-4 hidden lg:inline"></span>
        <button className="hover:text-blue-600 whitespace-nowrap hidden lg:inline">Contact Customer Service</button>
        <span className="border-l h-4 hidden lg:inline"></span>
        <FaPhoneAlt className="text-gray-600 cursor-pointer hover:text-blue-600" />
        <FaHandshake className="text-gray-600 cursor-pointer hover:text-blue-600 hidden lg:inline" />
        <FaUser className="text-gray-600 cursor-pointer hover:text-blue-600 hidden lg:inline" />
      </div>

      {/* Mobile menu items */}
      <div className="md:hidden w-full mt-3 flex justify-between items-center">
        <button className="bg-blue-50 px-4 py-2 rounded-full text-blue-600 font-medium hover:bg-blue-100">
          Log in
        </button>
        <button className="hover:text-blue-600">register</button>
        <FaPhoneAlt className="text-gray-600 cursor-pointer hover:text-blue-600" />
        <FaHandshake className="text-gray-600 cursor-pointer hover:text-blue-600" />
        <FaUser className="text-gray-600 cursor-pointer hover:text-blue-600" />
      </div>
    </nav>
  );
};

export default Navbar;