// mealPlan.model.js
const mongoose = require('mongoose');

const mealScheduleSchema = new mongoose.Schema({
  breakfast: { type: String, default: '' },
  lunch: { type: String, default: '' },
  dinner: { type: String, default: '' }
});

const mealPlanSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  breakfastTime: { type: String },
  lunchTime: { type: String },
  dinnerTime: { type: String },
  calorieGoal: { type: Number },
  mealSchedule: {
    Monday: mealScheduleSchema,
    Tuesday: mealScheduleSchema,
    Wednesday: mealScheduleSchema,
    Thursday: mealScheduleSchema,
    Friday: mealScheduleSchema,
    Saturday: mealScheduleSchema,
    Sunday: mealScheduleSchema
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MealPlan', mealPlanSchema);