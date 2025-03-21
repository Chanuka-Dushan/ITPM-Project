import { Router } from "express";
const router = Router();
import { addRecipe, getRecipes, getRecipeById, updateRecipe, deleteRecipe } from '../../Controllers/RecipeManagement/recipeController.js';

router.post("/add", addRecipe);
router.get("/get", getRecipes);
router.get("/:id", getRecipeById);
router.put("/:id", updateRecipe);
router.delete("/:id", deleteRecipe);

export default router;