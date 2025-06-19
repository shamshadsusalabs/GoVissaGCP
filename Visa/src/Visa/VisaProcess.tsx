import React from "react";
import { FaCircle, FaCheck } from "react-icons/fa";

const steps = [
  {
    step: "Step 1",
    title: "Complete Your Application",
    description: "Fill out the visa application form and upload all required documents.",
  },
  {
    step: "Step 2",
    title: "Submit & Pay Fees",
    description: "Pay only the government visa fees after submitting your application.",
  },
  {
    step: "Step 3",
    title: "Document Verification",
    description: "Our team will verify your documents and submit them to immigration authorities.",
  },
  {
    step: "Step 4",
    title: "Visa Processing",
    description: "We work with immigration to ensure timely processing of your visa.",
    subSteps: [
      {
        message: "Application received by immigration authorities",
        time: "Today, 10:30 AM",
        status: "IN PROGRESS",
      },
      {
        message: "Documents under verification",
        time: "Today, 11:45 AM",
        status: "COMPLETED",
        completed: true
      },
    ],
  },
  {
    step: "Step 5",
    title: "Visa Approval",
    description: "Receive your visa electronically once approved.",
  },
];

const VisaProcess: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-8 border-b-2 inline-block border-blue-600">
        Visa Application Process
      </h2>

      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-blue-200" />

        {steps.map((step, index) => (
          <div key={index} className="relative pl-12 mb-8">
            {/* Timeline dot */}
            <div className="absolute left-0 top-1 w-8 h-8 flex items-center justify-center">
              {index === steps.length - 1 ? (
                <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white ring-2 ring-blue-300"></div>
              ) : (
                <FaCircle className="text-blue-600 text-xs" />
              )}
            </div>

            {/* Step card */}
            <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start">
                <div className="flex-1">
                  <span className="text-blue-600 font-medium text-sm">{step.step}</span>
                  <h3 className="font-semibold text-lg mt-1">{step.title}</h3>
                  <p className="text-gray-600 mt-2">{step.description}</p>
                </div>
                {index === steps.length - 1 && (
                  <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    Current Step
                  </span>
                )}
              </div>

              {step.subSteps && (
                <div className="mt-4 space-y-3 bg-gray-50 rounded-lg p-4 border border-gray-100">
                  {step.subSteps.map((sub, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      {sub.completed ? (
                        <div className="mt-1 p-1 bg-green-100 rounded-full">
                          <FaCheck className="text-green-600 text-xs" />
                        </div>
                      ) : (
                        <div className="mt-1 w-2 h-2 rounded-full bg-blue-400"></div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">{sub.message}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-xs text-gray-500">{sub.time}</span>
                          <span className={`ml-2 px-2 py-0.5 text-xs rounded ${
                            sub.status === "COMPLETED" 
                              ? "bg-green-100 text-green-700" 
                              : "bg-blue-100 text-blue-700"
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

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="font-medium text-blue-800 mb-2">Important Notes:</h3>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          <li>Ensure all documents are clear and valid before uploading</li>
          <li>Processing times may vary based on immigration workload</li>
          <li>You'll receive email notifications at each stage</li>
          <li>Approval is subject to immigration authorities' discretion</li>
        </ul>
      </div>
    </div>
  );
};

export default VisaProcess;