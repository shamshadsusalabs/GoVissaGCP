"use client"

import type React from "react"
import { FaArrowRight } from "react-icons/fa"

interface ContinentSelectionProps {
  continent: string
  setContinent: (continent: string) => void
  nextStep: () => void
}

const continents = ["Africa", "Antarctica", "Asia", "Europe", "North America", "Oceania", "South America"]

const ContinentSelection: React.FC<ContinentSelectionProps> = ({ continent, setContinent, nextStep }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    nextStep()
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Select Continent</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {continents.map((cont) => (
            <div key={cont} className="flex items-center">
              <input
                id={`continent-${cont}`}
                type="radio"
                name="continent"
                checked={continent === cont}
                onChange={() => setContinent(cont)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={`continent-${cont}`} className="ml-2 block text-sm text-gray-700">
                {cont}
              </label>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!continent}
            className={`flex items-center px-4 py-2 rounded-md ${continent ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
          >
            Next <FaArrowRight className="ml-2" />
          </button>
        </div>
      </form>
    </div>
  )
}

export default ContinentSelection
