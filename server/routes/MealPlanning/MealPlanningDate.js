// mealPlan.routes.js
const express = require('express');
const router = express.Router();
const mealPlanController = require('./mealPlan.controller');

// Routes
router.post('/create', mealPlanController.createMealPlan);
router.get('/:userName', mealPlanController.getMealPlan);
router.put('/:id', mealPlanController.updateMealPlan);
router.delete('/:id', mealPlanController.deleteMealPlan);

module.exports = router;