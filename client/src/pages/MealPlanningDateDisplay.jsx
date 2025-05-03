import React from 'react';

const MealPlanningDateDisplay = () => {
  return (
    <div className="px-6">
      <div>
        <h1 className="text-xl font-bold mb-4 text-green-800 text-center">
          Your Meal Time Preferences 
        </h1>
      </div>

      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Breakfast Time
              </th>
              <th scope="col" className="px-6 py-3">
                Lunch Time
              </th>
              <th scope="col" className="px-6 py-3">
                Dinner Time
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Table body goes here */}
          </tbody>
        </table>
      </div>

      {/* Spacing added below */}
      <div className="mt-10">
        <h1 className="text-xl font-bold mb-4 text-green-800 text-center">
          Your Meal Scheduling
        </h1>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg px-6">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                  Day
                </th>
                <th scope="col" className="px-6 py-3">
                  Breakfast
                </th>
                <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                  Lunch
                </th>
                <th scope="col" className="px-6 py-3">
                  Dinner
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                  Monday
                </th> 
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                  Tuesday
                </th>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                  Wednesday
                </th>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                  Thursday
                </th>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                  Friday
                </th>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                  Saturday
                </th>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                  Sunday
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Button added at the bottom of the page with margin top for spacing */}
      <div className="flex justify-center mt-8 mb-6">
        <button 
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          onClick={() => alert('Button clicked!')}
        >
          Generate Report
        </button>
      </div>
    </div>
  );
};

export default MealPlanningDateDisplay;