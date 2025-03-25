const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema({
    UserName: { type: String, required: true },
    dayspreferred: { type: String, required: true },
    calorie: { type: Number, required: true, min: 0 },
    breakfast: { type: String },
    lunch: { type: String },
    dinner: { type: String },
    suggestions: { type: String },
    mealSchedule: {
        type: Map,
        of: {
            breakfast: String,
            lunch: String,
            dinner: String,
        },
    },
    recipes: [{
        name: String,
        dietary: [String]
    }]
}, { timestamps: true });

module.exports = mongoose.model("Meal", mealSchema);