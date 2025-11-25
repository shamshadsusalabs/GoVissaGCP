import { Check, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function DetailsNavbar() {
  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-white border-b border-gray-200 py-3 shadow-sm">
      <div className="max-w-screen-lg mx-auto px-6 flex items-center justify-between">
        {/* Left: Logo Image (showing actual size) */}
        <Link to="/" className="flex items-center">
          <img
            src="/logo.jpeg"
            alt="Visaafy Logo"
            className="max-h-16 object-contain"
          />
        </Link>

        {/* Right: Guarantee + User */}
        <div className="flex items-center space-x-4 ml-auto">
          <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            <Check className="h-4 w-4 text-blue-600 mr-1.5" />
            <span className="text-blue-700 text-xs font-medium">
              <span className="font-semibold">On Time</span> Guarantee
            </span>
          </div>

          <div className="bg-blue-50 p-1.5 rounded-lg border border-blue-100">
            <User className="h-4 w-4 text-blue-600" />
          </div>
        </div>
      </div>
    </nav>
  );
}
