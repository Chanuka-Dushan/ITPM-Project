import Recipe from "../../Models/RecipeManagement/recipeModel.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';


// Set up file storage configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// Create upload middleware
export const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function(req, file, cb) {
    // Accept only image files
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
}).single('recipeImage');

// Add Recipe with image upload
export async function addRecipe(req, res) {
  try {
    // Handle file upload
    upload(req, res, async function(err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      
      // Create recipe object from form data
      const recipeData = {
        ...req.body,
        // If an image was uploaded, save its path
        image: req.file ? `/uploads/${req.file.filename}` : undefined
      };
      
      const recipe = new Recipe(recipeData);
      await recipe.save();
      res.status(201).json(recipe);
    });
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

/// Get Recipe by ID
export async function getRecipeById(req, res) {
  try {
    // Use MongoDB ObjectId instead of custom ID
    const recipe = await Recipe.findById(req.params.id);

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