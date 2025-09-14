import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import {
  FiMenu,
  FiX,
  FiUser,

  FiBriefcase,
  FiShield,
  FiLogOut,
  FiChevronDown,
  FiChevronRight,
  FiHome,

  FiPhoneCall
} from 'react-icons/fi';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSubmenu, setActiveSubmenu] = useState<{
    user: boolean;
    corporate: boolean;
  }>({
    user: false,
    corporate: false,
  });

  const toggleSubmenu = (menu: keyof typeof activeSubmenu) => {
    setActiveSubmenu(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar Backdrop */}
      <div
        className={`fixed inset-0 z-20  bg-opacity-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar - Elegant Teal Color Scheme */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-gradient-to-b from-teal-700 to-teal-800 text-white transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-teal-600">
          <h1 className="text-2xl font-bold flex items-center">
            <FiHome className="mr-2" />
            Admin Panel
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
            to="/admin/dashboard"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-teal-600 transition-colors"
          >
            <FiHome />
            <span>Dashboard</span>
          </Link>

          {/* User Menu */}
          <div>
            <button
              onClick={() => toggleSubmenu('user')}
              className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-teal-600 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <FiUser />
                <span>Users</span>
              </div>
              {activeSubmenu.user ? <FiChevronDown /> : <FiChevronRight />}
            </button>
            
            {activeSubmenu.user && (
              <div className="ml-8 mt-1 space-y-1">
                <Link to="/admin/users" className="block p-2 rounded hover:bg-teal-500 transition-colors">All Users</Link>
                <Link to="/admin/users/flight-bookings" className="block p-2 rounded hover:bg-teal-500 transition-colors">Flight Bookings</Link>
                <Link to="/admin/users/hotel-bookings" className="block p-2 rounded hover:bg-teal-500 transition-colors">Hotel Bookings</Link>
                <Link to="/admin/users/transport" className="block p-2 rounded hover:bg-teal-500 transition-colors">TransPort</Link>
              </div>
            )}
          </div>

          {/* Corporate User Menu */}
          <div>
            <button
              onClick={() => toggleSubmenu('corporate')}
              className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-teal-600 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <FiBriefcase />
                <span>Corporate</span>
              </div>
              {activeSubmenu.corporate ? <FiChevronDown /> : <FiChevronRight />}
            </button>
            
            {activeSubmenu.corporate && (
              <div className="ml-8 mt-1 space-y-1">
                <Link to="/admin/corporate" className="block p-2 rounded hover:bg-teal-500 transition-colors">All Corporate</Link>
                <Link to="/admin/corporate/flight-bookings" className="block p-2 rounded hover:bg-teal-500 transition-colors">Flight Bookings</Link>
                <Link to="/admin/corporate/hotel-bookings" className="block p-2 rounded hover:bg-teal-500 transition-colors">Hotel Bookings</Link>
                <Link to="/admin/corporate/transport" className="block p-2 rounded hover:bg-teal-500 transition-colors">TransPort</Link>
              </div>
            )}
          </div>

          {/* Agents Menu */}
          <Link
            to="/admin/agents"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-teal-600 transition-colors"
          >
            <FiShield />
            <span>Agents</span>
          </Link>

          {/* Support Menu */}
          <Link
            to="/admin/visaconfig"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-teal-600 transition-colors"
          >
            <FiPhoneCall />
            <span>Visa config</span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar - Light and Clean */}
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
                  <span className="hidden md:inline text-gray-700">Admin</span>
                </button>
              </div>
              <button className="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 text-gray-600">
                <FiLogOut />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;