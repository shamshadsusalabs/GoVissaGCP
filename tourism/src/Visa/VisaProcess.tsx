import React from "react";
import { FaCircle } from "react-icons/fa";

const steps = [
  {
    step: "Step 1",
    title: "Apply on Atlys",
    description: "Submit your documents on Atlys — only pay government fee.",
  },
  {
    step: "Step 2",
    title: "Your Documents Are Verified",
    description: "Atlys verifies your documents and submits to Immigration.",
  },
  {
    step: "Step 3",
    title: "Your Visa Gets Processed",
    description: "We work with Immigration to ensure you get your visa on time.",
    subSteps: [
      {
        message: "Application has been sent to the immigration supervisor",
        time: "8 Jan, 5:45 AM",
        status: "ON TIME",
      },
      {
        message: "Application has been sent to internal intelligence",
        time: "8 Jan, 5:45 AM",
        status: "ON TIME",
      },
    ],
  },
];

const VisaProcess: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-8 border-b-2 inline-block border-blue-600">
        How Dubai Visa Process Works
      </h2>

      <div className="relative">
        <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-blue-200" />

        {steps.map((step, index) => (
          <div key={index} className="relative pl-10 mb-8">
            <div className="absolute left-0 top-1">
              <FaCircle className="text-blue-600 text-xs" />
            </div>

            <div className="bg-white rounded-xl border p-4 shadow-sm">
              <h4 className="text-blue-600 font-semibold">{step.step}</h4>
              <h3 className="font-semibold text-lg">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>

              {step.subSteps && (
                <div className="mt-4 space-y-3 bg-gray-50 rounded-lg p-4 border">
                  {step.subSteps.map((sub, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <span className="text-blue-600 text-sm">•</span>
                      <div>
                        <p className="text-sm">{sub.message}</p>
                        <p className="text-xs text-gray-500">
                          {sub.time}{" "}
                          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                            {sub.status}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisaProcess;
