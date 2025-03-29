import Meal from "../../Models/MealPlanning/MealPlanningDate.js"; 

const mealController = {
    // Create a new meal plan
    createMealPlan: async (req, res) => {
        try {
            const meal = new Meal(req.body);
            await meal.save();
            res.status(201).json(meal);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Get all meal plans
    getMealPlans: async (req, res) => {
        try {
            const meals = await Meal.find();
            res.status(200).json(meals);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get meal plan by username
    getMealPlanByUsername: async (req, res) => {
        try {
            const meals = await Meal.find({ UserName: req.params.username });
            if (!meals.length) return res.status(404).json({ error: "No meals found for this username" });
            res.status(200).json(meals);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get a single meal plan by ID
    getMealPlanById: async (req, res) => {
        try {
            const meal = await Meal.findById(req.params.id);
            if (!meal) return res.status(404).json({ error: "Meal not found" });
            res.status(200).json(meal);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update a meal plan
    updateMealPlan: async (req, res) => {
        try {
            const meal = await Meal.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!meal) return res.status(404).json({ error: "Meal not found" });
            res.status(200).json(meal);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    // Delete a meal plan
    deleteMealPlan: async (req, res) => {
        try {
            const meal = await Meal.findByIdAndDelete(req.params.id);
            if (!meal) return res.status(404).json({ error: "Meal not found" });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};


export default mealController;
