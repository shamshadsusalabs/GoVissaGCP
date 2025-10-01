import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import {
  FiMenu,
  FiX,
  
  FiLogOut,
  FiHome,
} from 'react-icons/fi';
import {
  MdFlight,
  MdHotel,
  MdAirportShuttle,
  MdMoneyOff,
} from 'react-icons/md';

const CorporateLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar Backdrop */}
      <div
        className={`fixed inset-0 z-20 bg-opacity-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-gradient-to-b from-teal-700 to-teal-800 text-white transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-teal-600">
          <h1 className="text-2xl font-bold flex items-center">
            <FiHome className="mr-2" />
            Corporate Panel
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-lg lg:hidden hover:bg-teal-600"
          >
            <FiX size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {/* Dashboard */}
          <Link
            to="/corporate/CorporateTravelDashboard"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-teal-600 transition-colors"
          >
            <FiHome />
            <span>Dashboard</span>
          </Link>

          {/* Flights */}
          <Link
            to="/corporate/CorporateFlightBookingsTable"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-teal-600 transition-colors"
          >
            <MdFlight />
            <span>All Flights</span>
          </Link>

          {/* Hotel */}
          <Link
            to="/corporate/CorporateHotelBookingsTable"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-teal-600 transition-colors"
          >
            <MdHotel />
            <span>Hotel</span>
          </Link>

          {/* Transport */}
          <Link
            to="/corporate/CorporateTransportBookingsTable"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-teal-600 transition-colors"
          >
            <MdAirportShuttle />
            <span>Transport</span>
          </Link>

          {/* Refund */}
          <Link
            to="/corporate/CorporateRefundTracker"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-teal-600 transition-colors"
          >
            <MdMoneyOff />
            <span>Refund</span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              >
                <FiMenu size={20} />
              </button>
              <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100">
                  <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-medium">
                    A
                  </div>
                  <span className="hidden md:inline text-gray-700">User</span>
                </button>
              </div>
              <button className="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 text-gray-600">
                <FiLogOut />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CorporateLayout;
