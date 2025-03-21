import Recipe from "../../Models/RecipeManagement/recipeModel.js";

// Add Recipe
export async function addRecipe(req, res) {
  try {
    const recipe = new Recipe(req.body);
    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Get All Recipes
export async function getRecipes(req, res) {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get Recipe by ID
export async function getRecipeById(req, res) {
  try {
    const recipe = await Recipe.findOne({ RecipeID: req.params.RecipeID });
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    
    
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Update Recipe
export async function updateRecipe(req, res) {
  try {
    const { RecipeID } = req.params; // Extract RecipeID from the request parameters

    // Ensure that you're querying by customId, not _id
    const updatedRecipe = await Recipe.findOneAndUpdate(
      { customId: RecipeID }, // Use customId for lookup
      req.body, 
      { new: true }
    );

    if (!updatedRecipe) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json(updatedRecipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}




// Delete Recipe
export async function deleteRecipe(req, res) {
  try {
    // Use custom ID if it's not ObjectId
    const deletedRecipe = await Recipe.findOneAndDelete({ customId: req.params.RecipeID });


    if (!deletedRecipe) return res.status(404).json({ message: "Recipe not found" });
    res.status(200).json({ message: "Recipe deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}