import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: 'What types of visas do you help with?',
    answer: 'We assist with tourist, business, student, work, and dependent visas for a wide range of countries.',
  },
  {
    question: 'How do I apply for a visa through GoVisaa?',
    answer: 'Simply select your visa type on our website, fill out the form, upload the required documents, and we’ll take care of the rest.',
  },
  {
    question: 'How long does the visa process take?',
    answer: 'Processing times vary by country and visa type. On average, it takes between 3 to 15 working days.',
  },
  {
    question: 'Is GoVisaa a registered visa provider?',
    answer: 'Yes, GoVisaa is a fully registered company with CIN: U30400DL2004PTC124202, operating since 2004.',
  },
  {
    question: 'What if my visa is rejected?',
    answer: 'We provide detailed feedback and guidance on reapplying. Refunds depend on the stage of processing and type of visa.',
  },
];

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold text-center text-gray-900 mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left flex justify-between items-center text-lg font-medium text-gray-800"
              >
                <span>{faq.question}</span>
                {activeIndex === index ? (
                  <FaChevronUp className="text-gray-500" />
                ) : (
                  <FaChevronDown className="text-gray-500" />
                )}
              </button>
              {activeIndex === index && (
                <div className="mt-4 text-gray-600 text-base leading-relaxed">
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
