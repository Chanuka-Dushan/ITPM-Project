// const mongoose = require("mongoose");
import { Schema, model } from "mongoose";
import mongoose from "mongoose";

const MealPlanningDate = new mongoose.Schema({

  //_id: { type: String, required: true }, 
  UserName: { type: String, required: true },
  breakfast: { type: TimeRanges, required: true },
  lunch: { type: TimeRanges, required: true },
  dinner: { type: TimeRanges, required: true },
  ingredients: { type: [String], required: true, validate: (val) => val.length >= 3 },
  instructions: { type: String, required: true },
  image: { type: String },
  
});

export default mongoose.model("Dates", MealPlanningDate);