// const mongoose = require("mongoose");
import { Schema, model } from "mongoose";
import mongoose from "mongoose";

const MealPlanningDetails = new mongoose.Schema({

  //_id: { type: String, required: true }, 
  RecipeID: { type: String, required: true },
  RecipeName: { type: String, required: true },
  category: { type: String, required: true },
  time: { type: String, required: true },
  ingredients: { type: [String], required: true, validate: (val) => val.length >= 3 },
  instructions: { type: String, required: true },
  image: { type: String },
  
});

export default mongoose.model("RDetails", MealPlanningDetails);