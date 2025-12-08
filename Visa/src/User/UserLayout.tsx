import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, FileText, CheckCircle, XCircle, Plus, Receipt } from 'lucide-react';

const UserLayout: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    // Try to get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserName(user.name || user.firstName || user.email || 'User');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      // Step 1: Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');

      // Step 2: Call logout API
      await fetch('http://localhost:5000/api/User/logout', {
        method: 'POST',
        credentials: 'include', // for cookie-based tokens, optional
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Step 3: Navigate to homepage
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex h-screen ">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <img
            src="/logo.jpeg"
            alt="Visaafy Logo"
            className="h-12 w-auto object-contain rounded"
          />
        </div>
        <nav className="mt-6">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => navigate('/')}
                className="flex w-full items-center p-4 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
              >
                <Plus className="w-5 h-5 mr-3" />
                 New Application
              </button>
            </li>
            <li>
              <NavLink
                to="/user-dashboard/ApplyVisa"
                className={({ isActive }) =>
                  `flex items-center p-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                    isActive ? 'bg-blue-50 text-blue-600' : ''
                  }`
                }
              >
                <FileText className="w-5 h-5 mr-3" />
                Visa Applied
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/user-dashboard/Approved"
                className={({ isActive }) =>
                  `flex items-center p-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                    isActive ? 'bg-blue-50 text-blue-600' : ''
                  }`
                }
              >
                <CheckCircle className="w-5 h-5 mr-3" />
                Approved
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/user-dashboard/Rejected"
                className={({ isActive }) =>
                  `flex items-center p-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                    isActive ? 'bg-blue-50 text-blue-600' : ''
                  }`
                }
              >
                <XCircle className="w-5 h-5 mr-3" />
                Rejected
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/user-dashboard/BillList"
                className={({ isActive }) =>
                  `flex items-center p-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                    isActive ? 'bg-blue-50 text-blue-600' : ''
                  }`
                }
              >
                <Receipt className="w-5 h-5 mr-3" />
                Invoice
              </NavLink>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex w-full items-center p-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-white shadow">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-semibold text-gray-800">Visaafy Dashboard</h2>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {userName ? (userName.includes('@') ? userName.split('@')[0] : userName) : 'User'}</span>
              <LogOut
                className="w-6 h-6 text-gray-600 cursor-pointer"
                onClick={handleLogout}
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
