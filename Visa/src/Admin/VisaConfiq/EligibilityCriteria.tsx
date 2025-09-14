"use client"

import type React from "react"
import { FaArrowRight, FaArrowLeft } from "react-icons/fa"

interface EligibilityCriteriaProps {
  eligibility: string
  updateEligibility: (eligibility: string) => void
  nextStep: () => void
  prevStep: () => void
}

const EligibilityCriteria: React.FC<EligibilityCriteriaProps> = ({
  eligibility,
  updateEligibility,
  nextStep,
  prevStep,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateEligibility(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    nextStep()
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Eligibility Criteria</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter the eligibility criteria for visa applicants:
          </label>
          <textarea
            value={eligibility}
            onChange={handleChange}
            rows={8}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Example:- Minimum passport validity of 6 months- Proof of sufficient funds for the duration of stay- Return ticket or onward journey proof- Travel insurance covering the stay period- No criminal record"
          />
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
          <button type="submit" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md">
            Next <FaArrowRight className="ml-2" />
          </button>
        </div>
      </form>
    </div>
  )
}

export default EligibilityCriteria
