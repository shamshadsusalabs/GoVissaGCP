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
  {
    question: 'Will I get a refund if my visa application is rejected?',
    answer: 'Visa processing fees are generally non-refundable, even if your application is rejected. However, we offer consultation services to help strengthen your reapplication and increase approval chances.',
  },
  {
    question: 'What can I do if my visa application is rejected?',
    answer: (
      <>
        If your visa is rejected, here are your options:
        <div className="mt-3 space-y-3">
          <div>
            <strong className="text-gray-800">1. Read the Rejection Letter Carefully</strong>
            <p className="text-sm mt-1">Understand the exact reason(s) for rejection - they're usually listed clearly.</p>
          </div>
          <div>
            <strong className="text-gray-800">2. Check If You Can Appeal</strong>
            <p className="text-sm mt-1">Some countries allow appeals (e.g., Schengen visas). You may need to:</p>
            <ul className="list-disc pl-5 mt-1 text-sm space-y-1">
              <li>Write a formal appeal letter</li>
              <li>Submit additional documents</li>
              <li>Do this within 15–30 days (check your rejection letter)</li>
            </ul>
          </div>
          <div>
            <strong className="text-gray-800">3. If Appeal Isn't Available or Fails</strong>
            <p className="text-sm mt-1">Prepare a stronger reapplication by:</p>
            <ul className="list-disc pl-5 mt-1 text-sm space-y-1">
              <li>Adding missing documents</li>
              <li>Clarifying your travel purpose</li>
              <li>Showing stronger ties to home country (job, family, assets)</li>
              <li>Improving financial documentation</li>
            </ul>
          </div>
        </div>
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