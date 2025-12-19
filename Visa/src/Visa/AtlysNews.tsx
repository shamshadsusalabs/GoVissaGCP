import React from "react";
import { FaQuoteLeft } from "react-icons/fa";

const CustomerSuccess: React.FC = () => {
  const reviews = [
    {
      name: "MK",
      role: "Visaafy Customer",
      review:
        "Totally satisfied with the services. I have taken more than 10 packages — outstanding service ever. Good helpful staff, Swiss visa. Best visa assistance in Gurgaon.",
    },
    {
      name: "Akshat Bajaj",
      role: "Singapore Visa Customer",
      review:
        "Leveraged their services for a Singapore visa. Very prompt service and fast turnaround.",
    },
    {
      name: "Govind Pandey",
      role: "Schengen & Dubai Visa Customer",
      review:
        "The best company in Gurugram. I got my Schengen visa within 5 days & Dubai visa within 3 hours. Very fast service. Highly recommended. Thanks to Rajan Kehar Ji.",
    },
  ];

  return (
    <section className="bg-gray-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
          Customer Success Stories
        </h2>

        {/* Cards */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
          {reviews.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 
              p-8 max-w-[360px] border border-gray-100"
            >
              <FaQuoteLeft className="text-indigo-500 text-3xl mb-4" />

              <p className="text-gray-700 text-[15px] leading-relaxed mb-6">
                “{item.review}”
              </p>

              <div>
                <h4 className="font-semibold text-gray-900">{item.name}</h4>
                <p className="text-sm text-gray-500">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerSuccess;
