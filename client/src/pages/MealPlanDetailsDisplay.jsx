import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MealPlanDetailsDisplay = () => {
  const [mealPlans, setMealPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/mealplans");
        if (!response.ok) {
          throw new Error("Failed to fetch meal plans");
        }
        const data = await response.json();
        setMealPlans(data);
      } catch (error) {
        console.error("Error fetching meal plans:", error);
      }
    };

    fetchMealPlans();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/mealplans/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete meal plan");
      }

      setMealPlans((prevMealPlans) =>
        prevMealPlans.filter((mealPlan) => mealPlan._id !== id)
      );
    } catch (error) {
      console.error("Error deleting meal plan:", error);
    }
  };

  const handleEdit = (mealPlan) => {
    navigate("/MealPlanningDetails", { state: { mealPlan } });
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-4">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-sm font-bold text-gray-800 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr className="h-16">
            <th scope="col" className="px-6 py-4 whitespace-nowrap">User Name</th>
            <th scope="col" className="px-6 py-4 whitespace-nowrap">Meal Type</th>
            <th scope="col" className="px-6 py-4 whitespace-nowrap">Calorie Limit</th>
            <th scope="col" className="px-6 py-4 whitespace-nowrap">Meal Time</th>
            <th scope="col" className="px-6 py-4 whitespace-nowrap">Suggestions</th>
            <th scope="col" className="px-6 py-4 whitespace-nowrap">Action</th>
          </tr>
        </thead>
        <tbody>
          {mealPlans.map((mealPlan, index) => (
            <tr
              key={mealPlan._id}
              className={`${index % 2 === 0 ? "odd:bg-white odd:dark:bg-gray-900" : "even:bg-gray-50 even:dark:bg-gray-800"} border-b dark:border-gray-700 border-gray-200`}
            >
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {mealPlan.UserName}
              </th>
              <td className="px-6 py-4">{mealPlan.mealspreferred}</td>
              <td className="px-6 py-4">{mealPlan.calorie}</td>
              <td className="px-6 py-4">{mealPlan.timepreferred}</td>
              <td className="px-6 py-4">{mealPlan.suggestions}</td>
              <td className="px-6 py-4">
                <a
                  href="#"
                  onClick={() => handleEdit(mealPlan)} 
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4"
                >
                  Edit
                </a>
                <a
                  href="#"
                  onClick={() => handleDelete(mealPlan._id)}
                  className="font-medium text-red-600 dark:text-red-500 hover:underline"
                >
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
