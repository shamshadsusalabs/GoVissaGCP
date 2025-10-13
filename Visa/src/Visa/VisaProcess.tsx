import React from "react";
import {  FaCheck} from "react-icons/fa";

const steps = [
  {
    step: "Step 1",
    title: "Create Your Account",
    description: "Create your account through email ID and phone number verification.",
  },
  {
    step: "Step 2",
    title: "Submit & Pay Fees",
    description: "Pay only the government visa fees after submitting your application.",
  },
  {
    step: "Step 3",
    title: "Upload Documents",
    description: "Upload all required documents as per visa requirements.",
  },
  {
    step: "Step 4",
    title: "Document Verification",
    description: "Our team will verify your documents and submit them to immigration authorities.",
    subSteps: [
      {
        message: "Documents received and under review",
        time: "Today, 10:30 AM",
        status: "IN PROGRESS",
      },
      {
        message: "Documents verified successfully",
        time: "Today, 11:45 AM",
        status: "COMPLETED",
        completed: true
      },
    ],
  },
  {
    step: "Step 5",
    title: "Visa Processing & Approval",
    description: "We work with immigration authorities to process your visa and you receive it electronically once approved.",
  },
];

const VisaProcess: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Visa Application Process
        </h2>
        <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
      </div>

      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-blue-100" />

        {steps.map((step, index) => (
          <div key={index} className="relative pl-16 mb-10 group">
            {/* Timeline dot */}
            <div className="absolute left-0 top-1 w-10 h-10 flex items-center justify-center">
              {index === steps.length - 1 ? (
                <div className="w-5 h-5 rounded-full bg-blue-600 border-4 border-white ring-2 ring-blue-300 transform group-hover:scale-110 transition-transform"></div>
              ) : (
                <div className="w-3 h-3 rounded-full bg-blue-600 transform group-hover:scale-125 transition-transform"></div>
              )}
            </div>

            {/* Step card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-200">
              <div className="flex items-start">
                <div className="flex-1">
                  <span className="text-blue-600 font-medium text-sm tracking-wider">{step.step}</span>
                  <h3 className="font-semibold text-xl mt-1 text-gray-900">{step.title}</h3>
                  <p className="text-gray-600 mt-3 leading-relaxed">{step.description}</p>
                </div>
                {index === steps.length - 1 && (
                  <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full animate-pulse">
                    Current Step
                  </span>
                )}
              </div>

              {step.subSteps && (
                <div className="mt-6 space-y-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                  {step.subSteps.map((sub, idx) => (
                    <div key={idx} className="flex items-start space-x-4">
                      {sub.completed ? (
                        <div className="mt-1 p-1.5 bg-green-100 rounded-full flex-shrink-0">
                          <FaCheck className="text-green-600 text-xs" />
                        </div>
                      ) : (
                        <div className="mt-1.5 w-3 h-3 rounded-full bg-blue-400 flex-shrink-0 animate-pulse"></div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{sub.message}</p>
                        <div className="flex items-center mt-2 space-x-3">
                          <span className="text-xs text-gray-500">{sub.time}</span>
                          <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                            sub.status === "COMPLETED" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {sub.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex items-start">
          <FaInfoCircle className="text-blue-500 text-xl mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-800 mb-3 text-lg">Important Notes:</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Ensure all documents are clear and valid before uploading</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Processing times may vary based on immigration workload</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>You'll receive email notifications at each stage</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Approval is subject to immigration authorities' discretion</span>
              </li>
            </ul>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default VisaProcess;