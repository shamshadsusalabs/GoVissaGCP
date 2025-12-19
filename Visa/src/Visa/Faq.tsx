import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

type FAQItem = {
  question: string;
  answer: React.ReactNode;
};

const faqs: FAQItem[] = [
  {
    question: "How long does it take to get a visa through Visaafy?",
    answer: "Visa processing time depends on the country, type of visa, and embassy. On average, it takes 5–15 business days for standard processing. Visaafy ensures timely updates and helps avoid delays by checking all documents before submission.",
  },
  {
    question: "What are the most common reasons a visa gets rejected?",
    answer: "Common visa rejection reasons include incomplete documentation, incorrect application details, insufficient financial proof, and lack of supporting letters. Visaafy guides applicants to submit complete and accurate documents, reducing the risk of rejection.",
  },
  {
    question: "Can Visaafy help with urgent visa applications?",
    answer: "Yes! Visaafy offers fast-track visa services for urgent travel. They prioritize your application and ensure proper documentation to meet embassy timelines.",
  },
  {
    question: "What documents do I need for a visa application?",
    answer: "Typical documents include a passport valid for at least 6 months, visa application form, photographs, financial statements, travel itinerary, and invitation letters (if applicable). Visaafy provides a personalized document checklist to make the process hassle-free.",
  },
  {
    question: "How can I check the status of my visa application?",
    answer: "After submission, Visaafy provides real-time tracking of your visa application. You’ll receive updates via email and portal, so you always know where your application stands.",
  },
  {
    question: "Does Visaafy handle rejected visas?",
    answer: "Yes. If a visa is rejected, Visaafy offers expert guidance on re-application, including reviewing your documents, identifying errors, and improving your chances for approval.",
  },
  {
    question: "Do I need travel insurance for my visa application?",
    answer: "Many countries require travel insurance as part of the visa application. Visaafy can assist in arranging suitable travel insurance to meet visa requirements.",
  },
  {
    question: "Can Visaafy help with multiple types of visas?",
    answer: "Absolutely. Visaafy specializes in tourist, business, and visitor visas across multiple countries, ensuring applicants get accurate guidance for every type.",
  },
  {
    question: "Is Visaafy reliable for first-time visa applicants?",
    answer: "Yes. Visaafy’s team guides first-time applicants step by step, providing clear instructions, document checks, and free interview preparation to avoid mistakes that often lead to rejection.",
  },
  {
    question: "How much does it cost to apply for a visa through Visaafy?",
    answer: "Visaafy charges transparent service fees, depending on the visa type and processing speed. There are no hidden charges, and applicants receive a detailed fee breakdown before starting the application. Charges may be subject to change as per embassy fluctuating charges.",
  },
];

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-8">
          People Also Ask – FAQ’s
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow duration-200"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left flex justify-between items-center text-lg font-medium text-gray-800"
              >
                <span>{faq.question}</span>
                {activeIndex === index ? (
                  <FaChevronUp className="text-gray-500 ml-2" />
                ) : (
                  <FaChevronDown className="text-gray-500 ml-2" />
                )}
              </button>

              {activeIndex === index && (
                <div className="mt-3 text-gray-600 text-base leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
