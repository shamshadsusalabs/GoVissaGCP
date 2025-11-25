import { User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in by looking for access token and user data
    const accessToken = localStorage.getItem('accessToken');
    
    if (accessToken) {
      // Try to get user data from localStorage
      const possibleKeys = ['user', 'userData', 'currentUser', 'loggedInUser'];
      
      for (const key of possibleKeys) {
        const userData = localStorage.getItem(key);
        if (userData) {
          try {
            const user = JSON.parse(userData);
            if (user && (user.email || user.phoneNumber)) {
              setUserEmail(user.email || user.phoneNumber);
              setIsLoggedIn(true);
              return;
            }
          } catch (error) {
            // Silent error handling
          }
        }
      }
      
      // If we have token but no user data, still consider logged in
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      setUserEmail(null);
    }
  }, []);

  const handleLogout = () => {
    // Clear all localStorage data
    localStorage.clear();
    setIsLoggedIn(false);
    setUserEmail(null);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-white py-4 overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-6 flex items-center justify-between">
        {/* Left: Image Logo */}
        <Link to="/">
          <img
            src="/logo.jpeg"
            alt="Visaafy Logo"
            className="h-18 w-auto object-contain rounded"
          />
        </Link>

        {/* Right: User Authentication */}
        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
              <User className="h-5 w-5 text-[#4f46e5]" />
              <span className="text-[#4f46e5] font-medium text-sm">
                {userEmail ? userEmail.split('@')[0] : 'User'}
              </span>
            </div>
            
            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="bg-red-50 hover:bg-red-100 p-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <LogOut className="h-5 w-5 text-red-600" />
              <span className="text-red-600 font-medium">Logout</span>
            </button>
          </div>
        ) : (
          /* Login Link */
          <Link to="/auth" className="bg-white p-2 rounded-lg flex items-center space-x-2">
            <User className="h-5 w-5 text-[#4f46e5]" />
            <span className="text-[#4f46e5] font-medium">Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
