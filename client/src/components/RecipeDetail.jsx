import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './RecipeDetail.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch recipe data when component mounts
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`/api/recipes/${id}`);
        setRecipe(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError('Failed to load recipe. Please try again.');
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  // Function to handle recipe deletion
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await axios.delete(`/api/recipes/${id}`);
        navigate('/recipes');
      } catch (err) {
        setError('Failed to delete recipe. Please try again.');
        console.error('Error deleting recipe:', err);
      }
    }
  };

  if (loading) return <div className="loading">Loading recipe...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!recipe) return <div className="error-message">Recipe not found</div>;

  return (
    <div className="recipe-detail-container">
      <div className="recipe-detail-header">
        <Link to="/recipes" className="back-link">
          &larr; Back to Recipes
        </Link>
        <div className="recipe-actions">
          <button 
            onClick={() => navigate(`/update-recipe/${recipe._id}`)} 
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
          </div>
        </div>

        {recipe.image && (
          <div className="recipe-image-container">
            <img 
              src={recipe.image} 
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
              {recipe.instructions.split('\n').map((paragraph, index) => (
                paragraph.trim() ? <p key={index}>{paragraph}</p> : null
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;