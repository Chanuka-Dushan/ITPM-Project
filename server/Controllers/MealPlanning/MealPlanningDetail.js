// controllers/MealPlanningController.js
import MealPlanning from "../../Models/MealPlanning/MealPlanningDetails.js";

// Fetch all meal plans
export const getAllMealPlans = async (req, res) => {
  try {
    const mealPlans = await MealPlanning.find();
    res.status(200).json(mealPlans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching meal plans', error });
  }
};

// Fetch a single meal plan by ID
export const getMealPlanById = async (req, res) => {
  const { id } = req.params;
  try {
    const mealPlan = await MealPlanning.findById(id);
    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }
    res.status(200).json(mealPlan);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching meal plan', error });
  }
};

// Create a new meal plan
export const createMealPlan = async (req, res) => {
  const { UserName, dayspreferred, mealspreferred, calorie, timepreferred, suggestions } = req.body;
  try {
    const newMealPlan = new MealPlanning({
      UserName,
      dayspreferred,
      mealspreferred,
      calorie,
      timepreferred,
      suggestions,
    });
    await newMealPlan.save();
    res.status(201).json(newMealPlan);
  } catch (error) {
    res.status(500).json({ message: 'Error creating meal plan', error });
  }
};

// Update a meal plan by ID
export const updateMealPlan = async (req, res) => {
  const { id } = req.params;
  const { UserName, dayspreferred, mealspreferred, calorie, timepreferred, suggestions } = req.body;
  try {
    const updatedMealPlan = await MealPlanning.findByIdAndUpdate(
      id,
      { UserName, dayspreferred, mealspreferred, calorie, timepreferred, suggestions },
      { new: true }
    );
    if (!updatedMealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }
    res.status(200).json(updatedMealPlan);
  } catch (error) {
    res.status(500).json({ message: 'Error updating meal plan', error });
  }
};

// Delete a meal plan by ID
export const deleteMealPlan = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedMealPlan = await MealPlanning.findByIdAndDelete(id);
    if (!deletedMealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }
    res.status(200).json({ message: 'Meal plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting meal plan', error });
  }
};
