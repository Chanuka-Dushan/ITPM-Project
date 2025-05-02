import Recipe from "../../Models/RecipeManagement/recipeModel.js";
import { v4 as uuidv4 } from "uuid";
// Create a new recipe
export async function createRecipe(req, res) {
  try {

    const recipeId = uuidv4();

    const { recipeName, category,dietaryPreference, time, ingredients, instructions } = req.body;
    console.log('@@@@@@@@@@@@@@2',req.body)
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    if (!recipeName || !category || !dietaryPreference || !time || !instructions || !ingredients) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Ensure ingredients is an array
    const parsedIngredients = Array.isArray(ingredients)
      ? ingredients
      : JSON.parse(ingredients);

    if (parsedIngredients.length < 3) {
      return res.status(400).json({ message: "At least 3 ingredients required" });
    }

    // Validate each ingredient has both name and quantity
    for (const ing of parsedIngredients) {
      if (!ing.name || !ing.quantity) {
        return res.status(400).json({ message: "Each ingredient must have name and quantity" });
      }
    }

    const recipe = new Recipe({
      recipeId,
      recipeName,
      category,
      dietaryPreference,
      time,
      ingredients: parsedIngredients,
      instructions,
      image
    });
    
    

    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get all recipes
export async function getAllRecipes(req, res) {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get a recipe by ID
export async function getRecipeById(req, res) {
  try {
    const recipe = await Recipe.findById(req.params.id);  // Using _id instead of recipeId

    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


export async function updateRecipe(req, res) {
  try {
    const updatedData = req.body;

    // Parse ingredients if sent as JSON string
    if (updatedData.ingredients && typeof updatedData.ingredients === "string") {
      updatedData.ingredients = JSON.parse(updatedData.ingredients);
    }

    // Replace image if new file is uploaded
    if (req.file) {
      updatedData.image = `/uploads/${req.file.filename}`;
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json(updatedRecipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}



// Delete a recipe by ID
export async function deleteRecipe(req, res) {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
