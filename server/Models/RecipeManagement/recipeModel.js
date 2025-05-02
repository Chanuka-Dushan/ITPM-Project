import { Schema, model } from "mongoose";
import mongoose from 'mongoose';



const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true }
});

const recipeSchema = new Schema({
  recipeId: {
    type: String,
    required: true
  },

  recipeName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  dietaryPreference: {
     type: String, 
     default: 'None' },
  time: {
    type: String,
    required: true
  },
  ingredients: [ingredientSchema],

  instructions: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ""
  },
}, { timestamps: true });

export default model("Recipe", recipeSchema);
