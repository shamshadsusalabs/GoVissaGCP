import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

type FAQItem = {
  question: string;
  answer: React.ReactNode;
};

const faqs: FAQItem[] = [
  {
    question: 'How long does it take to process my visa?',
    answer: 'Visa processing times vary by country. On average, it takes 3–15 business days. Urgent applications can be processed faster on request.',
  },
  {
    question: 'What documents are required?',
    answer: (
      <>
        We'll guide you based on your destination. Common documents include:
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Valid passport</li>
          <li>Passport-size photo</li>
          <li>Travel itinerary</li>
          <li>Bank statement or sponsor details</li>
        </ul>
      </>
    ),
  },
  {
    question: 'Can I track my application?',
    answer: 'Yes! You will receive a tracking link once your application is submitted.',
  },
  {
    question: 'Is my data safe?',
    answer: 'Absolutely. We use SSL encryption and secure cloud hosting to ensure your information is 100% protected.',
  },
  {
    question: 'What countries do you provide visas for?',
    answer: (
      <>
        We support tourist, business, and student visas for over 40+ countries, including:
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>UAE, Thailand, Singapore</li>
          <li>Schengen countries (France, Germany, Italy, etc.)</li>
          <li>UK, USA, Canada, Australia, and more</li>
        </ul>
      </>
    ),
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
          Frequently Asked Questions
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