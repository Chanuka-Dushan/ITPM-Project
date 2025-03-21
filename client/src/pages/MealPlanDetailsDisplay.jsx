import React from "react";

const MealPlanDetailsDisplay = () => {
  const products = [
    // Your products will go here
  ];

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-4">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-sm font-bold text-gray-800 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          {/* Changed text-lg to text-sm */}
          <tr className="h-16"> {/* Increased height */}
            <th scope="col" className="px-6 py-4 whitespace-nowrap">User Name</th>
            <th scope="col" className="px-6 py-4 whitespace-nowrap">Meal Type</th>
            <th scope="col" className="px-6 py-4 whitespace-nowrap">Calorie Limit</th>
            <th scope="col" className="px-6 py-4 whitespace-nowrap">Meal Time</th>
            <th scope="col" className="px-6 py-4 whitespace-nowrap">Suggestions</th>
            <th scope="col" className="px-6 py-4 whitespace-nowrap">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0
                  ? "odd:bg-white odd:dark:bg-gray-900"
                  : "even:bg-gray-50 even:dark:bg-gray-800"
              } border-b dark:border-gray-700 border-gray-200`}
            >
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {product.username}
              </th>
              <td className="px-6 py-4">{product.meal}</td>
              <td className="px-6 py-4">{product.calorie}</td>
              <td className="px-6 py-4">{product.time}</td>
              <td className="px-6 py-4">{product.suggestions}</td>
              <td className="px-6 py-4">
                <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4">
                  Edit
                </a>
                <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                  Delete
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MealPlanDetailsDisplay;