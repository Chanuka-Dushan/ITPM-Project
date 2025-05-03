import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './RecipeDetail.css';
import SubstituteFinder from '../components/SubstituteFinder';
import jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`/api/recipes/${id}`);

        const data = response.data;
        setRecipe({
          ...data,
          ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
          instructions: typeof data.instructions === 'string' ? data.instructions : '',
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError('Failed to load recipe. Please try again.');
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await axios.delete(`/api/app/recipes/${id}`);
        navigate('/app/recipes'); // Fixed path
      } catch (err) {
        setError('Failed to delete recipe. Please try again.');
        console.error('Error deleting recipe:', err);
      }
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text(recipe.recipeName, 14, 20);

    // Category
    doc.setFontSize(12);
    doc.text(`Category: ${recipe.category}`, 14, 30);

    // Dietary Preference
    doc.text(`Dietary Preference: ${recipe.dietaryPreference}`, 14, 40);

    // Time
    doc.text(`Time: ${recipe.time}`, 14, 50);

    // Ingredients
    doc.text('Ingredients:', 14, 60);
    recipe.ingredients.forEach((ingredient, index) => {
      doc.text(`${ingredient.name}: ${ingredient.quantity}`, 14, 70 + index * 10);
    });

    // Instructions
    doc.text('Instructions:', 14, 80 + recipe.ingredients.length * 10);
    recipe.instructions.split('\n').forEach((paragraph, index) => {
      doc.text(paragraph, 14, 90 + (index + recipe.ingredients.length) * 10);
    });

    // Save the PDF
    doc.save(`${recipe.recipeName}.pdf`);
  };

  if (loading) return <div className="loading">Loading recipe...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!recipe) return <div className="error-message">Recipe not found</div>;

  return (
    <div className="recipe-detail-container">
      <div className="recipe-detail-header">
        <Link to="/app/recipes" className="back-link">
          &larr; Back to Recipes
        </Link>
        <div className="recipe-actions">
          <button 
            onClick={() => navigate(`/app/update-recipe/${recipe._id}`)} 
            className="edit-btn"
          >
            <i className="fas fa-edit"></i> Edit Recipe
          </button>
          <button 
            onClick={handleDelete} 
            className="delete-btn"
          >
            <i className="fas fa-trash-alt"></i> Delete Recipe
          </button>
          <button 
            onClick={generatePDF} 
            className="pdf-btn"
          >
            <i className="fas fa-file-pdf"></i> Generate PDF
          </button>
        </div>
      </div>

      <div className="recipe-content">
        <div className="recipe-main-info">
          <h1>{recipe.recipeName}</h1>
          <div className="recipe-meta">
            <span className="recipe-category">
              <i className="fas fa-utensils"></i> {recipe.category}
            </span>
            <span className="recipe-time">
              <i className="fas fa-clock"></i> {recipe.time}
            </span>
            <span className="recipe-dietary-preference">
              <i className="fas fa-leaf"></i> {recipe.dietaryPreference}
            </span>
          </div>
        </div>

        {(recipe.imageUrl || recipe.image) && (
          <div className="recipe-image-container">
            <img 
              src={`http://localhost:5000${recipe.imageUrl || recipe.image}`} 
              alt={recipe.recipeName} 
              className="recipe-detail-image" 
            />
          </div>
        )}

        <div className="recipe-sections">
          <div className="ingredients-section">
            <h2>Ingredients</h2>
            <ul className="ingredients-list">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>
                  <span className="ingredient-name">{ingredient.name}</span>
                  <span className="ingredient-quantity">{ingredient.quantity}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="instructions-section">
            <h2>Instructions</h2>
            <div className="instructions-content">
              {recipe.instructions.split('\n').map((paragraph, index) =>
                paragraph.trim() ? <p key={index}>{paragraph}</p> : null
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
