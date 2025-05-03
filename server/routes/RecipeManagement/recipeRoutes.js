import express from "express";

import multer from "multer";
import { extname } from "path";


import {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe
} from "../../Controllers/RecipeManagement/recipeController.js";
import { generateRecipePdf } from "../../Controllers/RecipeManagement/recipeController.js";
import { searchRecipes } from "../../Controllers/RecipeManagement/recipeController.js";




const router = express.Router();


// Multer storage & filter
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/"),
  filename: (_req, file, cb) =>
    cb(null, Date.now() + extname(file.originalname))
});

const fileFilter = (_req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif/;
  const valid =
    allowed.test(extname(file.originalname).toLowerCase()) &&
    allowed.test(file.mimetype);
  if (valid) cb(null, true);
  else cb(new Error("Only image files are allowed!"), false);
};

const upload = multer({ storage, fileFilter });

// Routes
router.post("/add", upload.single("image"), createRecipe);
router.get("/get", getAllRecipes);
router.get("/:id", getRecipeById);
router.put("/:id", upload.single("image"), updateRecipe);
router.delete("/:id", deleteRecipe);

router.get('/search', searchRecipes);

// Add the PDF route
router.get('/recipes/:id/report', generateRecipePdf);


export default router;
