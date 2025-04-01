// routes/MealPlanning/MealPlanningRoutes.js
import express from 'express';
import {
  getAllMealPlans,
  getMealPlanById,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
} from '../../Controllers/MealPlanning/MealPlanningDetail.js';

const router = express.Router();

// Define routes
router.get('/', getAllMealPlans); // Fetch all meal plans
router.get('/:id', getMealPlanById); // Fetch meal plan by ID
router.post('/', createMealPlan); // Create a new meal plan
router.put('/:id', updateMealPlan); // Update a meal plan by ID
router.delete('/:id', deleteMealPlan); // Delete a meal plan by ID

export default router;
