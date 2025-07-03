import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header = ({ onSearch }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="bg-white text-white pt-8 pb-12 md:pb-16 relative overflow-hidden h-96">
      {/* Decorative elements */}
     

      {/* Hero Content */}
      <section className="flex flex-col items-center justify-center text-center mt-12 mb-8 px-4 max-w-4xl mx-auto relative z-10">
        <motion.p 
          className="text-green-400 font-semibold text-lg mb-4 flex items-center justify-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="inline-block animate-pulse">✓</span> 99.2% visas on time
        </motion.p>
        <motion.h2 
          className="text-4xl md:text-5xl font-bold leading-tight mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Get Your Visa <span className="text-[#F9D85E]">On Time</span> with GoVisaa
        </motion.h2>
        <motion.p 
          className="text-lg text-blue-500 max-w-2xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Fast, easy, and guaranteed visa processing for your next adventure
        </motion.p>
      </section>

      {/* Search Section */}
      <motion.section 
        className="flex justify-center mb-12 px-4 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <form onSubmit={handleSearch} className="w-full max-w-2xl">
          <div className="bg-white rounded-full flex items-center px-6 py-4 w-full shadow-lg hover:shadow-xl transition-all duration-300 focus-within:ring-2 focus-within:ring-[#F9D85E] focus-within:ring-opacity-50">
            <FaSearch className="text-gray-500 mr-3 flex-shrink-0" size={18} />
            <input
              type="search"
              placeholder="Search destinations (e.g. Dubai, India)"
              aria-label="Search destinations"
              className="w-full outline-none text-gray-800 placeholder-gray-500 text-lg bg-transparent pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <motion.button 
              type="submit"
              className="bg-[#4A54F1] text-white px-6 py-2 rounded-full text-sm font-medium ml-2 whitespace-nowrap"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Find Visa
            </motion.button>
          </div>
        </form>
      </motion.section>
    </header>
  );
};

export default Header;