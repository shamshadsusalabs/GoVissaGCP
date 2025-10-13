// Header.tsx
import { FaUserCircle, FaSearch } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="bg-[#4A54F1] text-white p-4 relative ml-[200px] max-w-[1400px]">
      {/* Top Navigation Bar */}
      <nav className="flex justify-between items-center px-6">
        {/* Logo with better semantic markup */}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white">atlys</h1>
          <span className="text-xs font-semibold leading-tight block">
            VISAS ON<br />TIME
          </span>
        </div>

        {/* Right Navigation Items */}
        <div className="flex items-center gap-6">
          <a href="#" className="text-sm underline font-semibold hover:text-gray-200 transition-colors">
            On Time Guaranteed
          </a>
          <button 
            aria-label="User account"
            className="hover:opacity-80 transition-opacity"
          >
            <FaUserCircle size={28} className="cursor-pointer" />
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <section className="flex flex-col items-center justify-center text-center mt-12 mb-8 px-4">
        <p className="text-green-400 font-semibold text-lg mb-2">
          <span className="inline-block animate-pulse">✓</span> 99.2% visas on time
        </p>
        <h2 className="text-4xl md:text-5xl font-bold leading-tight max-w-2xl">
          Get Your Visa on Time with Atlys
        </h2>
      </section>

      {/* Search Section */}
      <section className="flex justify-center mb-12 px-4">
        <div className="bg-white rounded-full flex items-center px-6 py-4 w-full max-w-2xl shadow-lg hover:shadow-xl transition-shadow">
          <FaSearch className="text-gray-500 mr-3 flex-shrink-0" />
          <input
            type="search"
            placeholder="Where to?"
            aria-label="Search destinations"
            className="w-full outline-none text-gray-800 placeholder-gray-500 text-lg bg-transparent"
          />
        </div>
      </section>
    </header>
  );
};

export default Header;