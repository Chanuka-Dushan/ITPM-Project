// Models/MealPlanning/MealPlanningDetails.js
import mongoose from 'mongoose';

const MealPlanningSchema = new mongoose.Schema({
  UserName: {
    type: String,
    required: true,
  },
  dayspreferred: {
    type: String,
    required: true,
  },
  mealspreferred: {
    type: String,
    required: true,
  },
  calorie: {
    type: Number,
    required: true,
  },
  timepreferred: {
    type: String,
    required: true,
  },
  suggestions: {
    type: String,
    required: true,
  },
});

const MealPlanning = mongoose.model('MealPlanning', MealPlanningSchema);
export default MealPlanning;
