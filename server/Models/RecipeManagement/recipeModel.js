import { Schema, model } from "mongoose";

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
  time: {
    type: String,
    required: true
  },
  ingredients: {
    type: [String],
    required: true,
    validate: {
      validator: function (arr) {
        return arr.length >= 3;
      },
      message: 'At least 3 ingredients are required'
    }
  },
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
