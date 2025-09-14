"use client"

import type React from "react"
import { FaArrowRight, FaArrowLeft } from "react-icons/fa"

interface CountryDetailsProps {
  details: {
    name: string
    code: string
    embassyLocation: string
    applicationTips: string;
  }
  updateDetails: (details: any) => void
  nextStep: () => void
  prevStep: () => void
}

const CountryDetails: React.FC<CountryDetailsProps> = ({ details, updateDetails, nextStep, prevStep }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    updateDetails({
      ...details,
      [name]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    nextStep()
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Country Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Country Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={details.name}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., United States"
            />
          </div>
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Country Code
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={details.code}
              onChange={handleChange}
              maxLength={2}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., US"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="embassyLocation" className="block text-sm font-medium text-gray-700 mb-1">
              Embassy Location(s)
            </label>
            <input
              type="text"
              id="embassyLocation"
              name="embassyLocation"
              value={details.embassyLocation}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., New Delhi, Mumbai"
            />
          </div>
        </div>
       <div className="mb-4">
          <label htmlFor="applicationTips" className="block text-sm font-medium text-gray-700 mb-1">
            Application Tips
          </label>
          <textarea
            id="applicationTips"
            name="applicationTips"
            value={details.applicationTips}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter Tips Visa..."
          />
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <button
            type="submit"
            disabled={!details.name}
            className={`flex items-center px-4 py-2 rounded-md ${details.name ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
          >
            Next <FaArrowRight className="ml-2" />
          </button>
        </div>
      </form>
    </div>
  )
}

export default CountryDetails
