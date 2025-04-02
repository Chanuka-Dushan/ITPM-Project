import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './HomeRecipe.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/recipes/${id}`);
        setRecipe(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recipe details:', error);
        setError('Failed to load recipe details');
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading recipe details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!recipe) {
    return <div className="error">Recipe not found</div>;
  }

  return (
    <div className="recipe-detail">
      <div className="recipe-detail-header">
        <h1>{recipe.RecipeName}</h1>
        <div>
          <button 
            className="update-btn"
            onClick={() => navigate(`/edit-recipe/${recipe._id}`)}
          >
            Edit Recipe
          </button>
        </div>
      </div>

      <div className="recipe-detail-image">
        <img src={recipe.image || '/default-recipe.jpg'} alt={recipe.RecipeName} />
      </div>

      <div className="recipe-meta">
        <div className="recipe-meta-item">
          <strong>Category:</strong> {recipe.category}
        </div>
        <div className="recipe-meta-item">
          <strong>Preparation Time:</strong> {recipe.time}
        </div>
      </div>

      <div className="recipe-section">
        <h2>Ingredients</h2>
        <ul className="ingredients-list">
          {recipe.ingredients.split('\n').map((ingredient, index) => (
            <li key={index}>{ingredient.trim()}</li>
          ))}
        </ul>
      </div>

      <div className="recipe-section">
        <h2>Instructions</h2>
        <div className="instructions">
          {recipe.instructions}
        </div>
      </div>

      <Link to="/" className="back-button">Back to Recipes</Link>
    </div>
  );
};

export default RecipeDetail;