import Recipe from "../../Models/RecipeManagement/recipeModel.js";
import { v4 as uuidv4 } from "uuid";

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

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


// Generate PDF report for a specific recipe
export async function generateRecipePdf(req, res) {
  const { id } = req.params;

  try {
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Create a new PDF document
    const doc = new PDFDocument();
    
    // Set the response header for downloading the PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${recipe.recipeName}_report.pdf"`);

    // Pipe the PDF to the response
    doc.pipe(res);

    // Add content to the PDF
    doc.fontSize(18).text(`Recipe Report: ${recipe.recipeName}`, { align: 'center' });
    doc.moveDown();

    doc.fontSize(14).text(`Category: ${recipe.category}`);
    doc.text(`Dietary Preference: ${recipe.dietaryPreference}`);
    doc.text(`Time: ${recipe.time}`);
    doc.moveDown();

    doc.fontSize(12).text(`Ingredients:`);
    recipe.ingredients.forEach((ingredient, index) => {
      doc.text(`${index + 1}. ${ingredient.name} - ${ingredient.quantity}`);
    });
    doc.moveDown();

    doc.text(`Instructions:`);
    recipe.instructions.split('\n').forEach((instruction, index) => {
      doc.text(`${index + 1}. ${instruction}`);
    });
    doc.moveDown();

    doc.text(`Created On: ${new Date(recipe.createdAt).toLocaleDateString()}`, { underline: true });

    // Finalize the PDF and send it to the client
    doc.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
