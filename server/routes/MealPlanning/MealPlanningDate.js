// mealPlan.routes.js
import express from 'express';
const router = express.Router();
import mealPlanController from '../../Controllers/MealPlanning/MealPlanningDate';

// Routes
router.post('/create', mealPlanController.createMealPlan);
router.get('/:userName', mealPlanController.getMealPlanByUsername);
router.put('/:id', mealPlanController.updateMealPlan);
router.delete('/:id', mealPlanController.deleteMealPlan);

export default router;