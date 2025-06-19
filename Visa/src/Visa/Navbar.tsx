import { User } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-[#4A54F1] py-4 overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-6 flex items-center justify-between">
        {/* Left: Image Logo */}
        <Link to="/">
          <img
            src="/logo.jpeg"
            alt="GoVisaa Logo"
            className="h-12 w-auto object-contain rounded"
          />
        </Link>

        {/* Right: User Icon */}
        <Link to="/auth" className="bg-white p-2 rounded-lg">
          <User className="h-5 w-5 text-[#4f46e5]" />
        </Link>
      </div>
    </nav>
  );
}
