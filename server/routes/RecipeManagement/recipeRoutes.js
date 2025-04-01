import { Router } from "express";
const router = Router();
import { addRecipe, getRecipes, getRecipeById, updateRecipe, deleteRecipe } from '../../controllers/RecipeManagement/recipeController.js';

router.post("/add", addRecipe);
router.get("/get", getRecipes);
router.get("/recipes/:id", getRecipeById);
router.put("/:id", updateRecipe);
router.delete("/:id", deleteRecipe);

export default router;