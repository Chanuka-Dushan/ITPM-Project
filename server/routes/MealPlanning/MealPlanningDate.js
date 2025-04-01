import express from 'express';
import mealPlanController from '../../Controllers/MealPlanning/MealPlanningDate.js';

const router = express.Router();

// Routes
router.post('/create', mealPlanController.createMealPlan);
router.get('/:userName', mealPlanController.getMealPlanByUsername);
router.put('/:id', mealPlanController.updateMealPlan);
router.delete('/:id', mealPlanController.deleteMealPlan);

export default router;
