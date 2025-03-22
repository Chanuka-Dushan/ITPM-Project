// mealPlan.controller.js
const MealPlan = require('./mealPlan.model');

const mealPlanController = {
  // Create a new meal plan
  async createMealPlan(req, res) {
    try {
      const mealPlanData = {
        userName: req.body.UserName,
        breakfastTime: req.body.breakfast,
        lunchTime: req.body.lunch,
        dinnerTime: req.body.dinner,
        calorieGoal: req.body.calorie,
        mealSchedule: req.body.mealSchedule
      };

      const newMealPlan = new MealPlan(mealPlanData);
      const savedPlan = await newMealPlan.save();
      
      res.status(201).json({
        success: true,
        data: savedPlan,
        message: 'Meal plan created successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Error creating meal plan',
        error: error.message
      });
    }
  },

  // Get meal plan by username
  async getMealPlan(req, res) {
    try {
      const mealPlan = await MealPlan.findOne({ userName: req.params.userName });
      
      if (!mealPlan) {
        return res.status(404).json({
          success: false,
          message: 'Meal plan not found'
        });
      }

      res.status(200).json({
        success: true,
        data: mealPlan
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error retrieving meal plan',
        error: error.message
      });
    }
  },

  // Update meal plan
  async updateMealPlan(req, res) {
    try {
      const updatedPlan = await MealPlan.findByIdAndUpdate(
        req.params.id,
        {
          userName: req.body.UserName,
          breakfastTime: req.body.breakfast,
          lunchTime: req.body.lunch,
          dinnerTime: req.body.dinner,
          calorieGoal: req.body.calorie,
          mealSchedule: req.body.mealSchedule
        },
        { new: true }
      );

      if (!updatedPlan) {
        return res.status(404).json({
          success: false,
          message: 'Meal plan not found'
        });
      }

      res.status(200).json({
        success: true,
        data: updatedPlan,
        message: 'Meal plan updated successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Error updating meal plan',
        error: error.message
      });
    }
  },

  // Delete meal plan
  async deleteMealPlan(req, res) {
    try {
      const deletedPlan = await MealPlan.findByIdAndDelete(req.params.id);
      
      if (!deletedPlan) {
        return res.status(404).json({
          success: false,
          message: 'Meal plan not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Meal plan deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting meal plan',
        error: error.message
      });
    }
  }
};

module.exports = mealPlanController;