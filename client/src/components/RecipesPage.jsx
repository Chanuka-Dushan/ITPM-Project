import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RecipesPage.css';

const RecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch all recipes when component mounts
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('/api/recipes/get');
        setRecipes(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch recipes. Please try again later.');
        setLoading(false);
        console.error('Error fetching recipes:', err);
      }
    };

    fetchRecipes();
  }, []);

  // Function to handle recipe deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await axios.delete(`/api/recipes/${id}`);
        // Remove deleted recipe from state
        setRecipes(recipes.filter(recipe => recipe._id !== id));
      } catch (err) {
        setError('Failed to delete recipe. Please try again.');
        console.error('Error deleting recipe:', err);
      }
    }
  };

  if (loading) return <div className="loading">Loading recipes...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="recipes-container">
      <div className="recipes-header">
        <h1>Our Recipes Collection</h1>
        <Link to="/add-recipe" className="add-recipe-btn">Add Recipe</Link>
      </div>
      
      {recipes.length === 0 ? (
        <div className="no-recipes">
          <p>No recipes found. Be the first to add a recipe!</p>
        </div>
      ) : (
        <div className="recipes-grid">
          {recipes.map(recipe => (
            <div key={recipe._id} className="recipe-card">
              <div 
                className="recipe-image" 
                onClick={() => navigate(`/recipe/${recipe._id}`)}
                style={{
                  backgroundImage: recipe.image 
                    ? `url(${recipe.image})` 
                    : 'url(/default-recipe.jpg)'
                }}
              ></div>
              
              <div className="recipe-info">
                <h3 
                  onClick={() => navigate(`/recipe/${recipe._id}`)}
                  className="recipe-name"
                >
                  {recipe.recipeName}
                </h3>
                <div className="recipe-actions">
                  <button 
                    onClick={() => navigate(`/update-recipe/${recipe._id}`)} 
                    className="edit-btn"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    onClick={() => handleDelete(recipe._id)} 
                    className="delete-btn"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipesPage;