import { 
  FiHome, 
  FiFileText, 
  FiLogOut,
  FiUsers,
  FiTag,
  FiUser
} from 'react-icons/fi';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const EmployeeLayout = () => {
  const navigate = useNavigate();
  const [managerName, setManagerName] = useState('Manager');

  useEffect(() => {
    // Try to get manager data from localStorage - check multiple possible keys
    const possibleKeys = ['manager', 'managerData', 'currentManager', 'loggedInManager', 'employee'];
    
    for (const key of possibleKeys) {
      const managerData = localStorage.getItem(key);
      if (managerData) {
        try {
          const manager = JSON.parse(managerData);
          if (manager && manager.name) {
            setManagerName(manager.name);
            return; // Exit early if we found the name
          }
        } catch (error) {
          console.error(`Error parsing manager data from key ${key}:`, error);
        }
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      // ✅ Step 1: Clear entire localStorage
      localStorage.clear();
      // ✅ Step 2: Call logout API
      await fetch('https://govisaa-872569311567.asia-south2.run.app/api/manager/logout', {
        method: 'POST',
        credentials: 'include', // include cookies if used
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // ✅ Step 3: Navigate to homepage
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Navbar */}
      <header className="bg-white shadow-sm z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-800">Manager Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="text-gray-600 hover:text-gray-900">
                <FiFileText className="h-6 w-6" />
              </button>
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </div>
            
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                <FiUser className="h-4 w-4" />
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">{managerName}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md z-0">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link to="/manager-dashboard/DashboardPagemanager" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100">
                  <FiHome className="h-5 w-5" />
                  <span className="ml-3">Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/manager-dashboard/AllVisaApplicationManager" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100">
                  <FiFileText className="h-5 w-5" />
                  <span className="ml-3">All Applications</span>
                </Link>
              </li>
             
              <li>
                <Link to="/manager-dashboard/EmployeeManager" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100">
                  <FiUsers className="h-5 w-5" />
                  <span className="ml-3">All Employee</span>
                </Link>
              </li>
              <li>
                <Link to="/manager-dashboard/ManagerCouponcode" className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100">
                  <FiTag className="h-5 w-5" />
                  <span className="ml-3">All Coupon</span>
                </Link>
              </li>
             
              <li>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center w-full p-2 text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <FiLogOut className="h-5 w-5" />
                  <span className="ml-3">Logout</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content with Outlet */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;