import React from "react";
import { Hotel,  Building2 } from "lucide-react";

const HotelAffiliationSection: React.FC = () => {
  const countries = [
    "Thailand Hotels", "South Korea", "Japanese Hotels", "Malaysia Hotels", "Indonesia Hotels",
    "American Hotels", "Vietnam Hotels", "Australia Hotels", "French Hotels", "Maldives Hotels",
    "Italy Hotels", "More countries..."
  ];

  const cities = [
    "Dubai Hotels", "Singapore Hotels", "Phuket Hotels", "Bali Hotels", "Las Vegas",
    "Boracay Islands", "Kuala Lumpur", "Seoul Hotels", "Chiang Mai", "Paris Hotels",
    "London Hotels", "New York Hotels"
  ];

  const brands = [
    "Hilton Hotels", "Sheraton Hotels", "Super 8 Hotel", "InterContinental", "Marriott",
    "Kempinski", "Ramada Hotel", "Westin Hotel", "Hyatt Hotels", "Sofitel Hotel",
    "Waldorf Astoria", "Crowne Plaza"
  ];

  return (
    <div className="bg-white py-14 px-4 sm:px-10 lg:px-20 ml-[200px] max-w-[1400px]">
      {/* Affiliation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="flex items-center gap-4 bg-blue-100 p-6 rounded-xl shadow hover:shadow-md transition cursor-pointer">
          <Hotel className="text-blue-700 w-8 h-8" />
          <div className="flex-1">
            <h2 className="text-lg md:text-xl font-semibold text-blue-800">Hotel Affiliation</h2>
            <p className="text-sm text-blue-600">Connect with top hotels globally</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-blue-100 p-6 rounded-xl shadow hover:shadow-md transition cursor-pointer">
          <Building2 className="text-blue-700 w-8 h-8" />
          <div className="flex-1">
            <h2 className="text-lg md:text-xl font-semibold text-blue-800">Supplier Affiliation</h2>
            <p className="text-sm text-blue-600">Partner with trusted suppliers</p>
          </div>
        </div>
      </div>

      {/* Lists Section */}
      <div className="border rounded-xl p-8 space-y-8 text-sm bg-gray-50 shadow-sm">
        {/* Single List Item */}
        {[{ title: "Popular countries", data: countries }, { title: "Popular cities", data: cities }, { title: "Popular brands", data: brands }].map((item, i) => (
          <div key={i} className="flex flex-col md:flex-row md:items-start">
            <span className="font-semibold w-48 mb-3 md:mb-0 text-gray-700">{item.title}</span>
            <div className="flex flex-wrap gap-3 text-gray-700">
              {item.data.map((val, idx) => (
                <a key={idx} href="#" className="hover:text-blue-600 hover:underline transition max-w-[160px] truncate">
                  {val}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelAffiliationSection;
