import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RecipesPage.css';

const RecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch all recipes on mount
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('/api/recipes/get');


        const data = response.data;

        // ✅ Ensure data is an array
        if (Array.isArray(data)) {
          setRecipes(data);
        } else if (data.recipes && Array.isArray(data.recipes)) {
          setRecipes(data.recipes);
        } else {
          console.warn('Unexpected data format:', data);
          setError('Unexpected response format from the server.');
          setRecipes([]);
        }
      } catch (err) {
        setError('Failed to fetch recipes. Please try again later.');
        console.error('Error fetching recipes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await axios.delete(`/api/recipes/${id}`);
        setRecipes(prev => prev.filter(recipe => recipe._id !== id));
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
        <Link to="/app/add-recipe" className="add-recipe-btn">Add Recipe</Link>
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
                onClick={() => navigate(`/app/recipes/${recipe._id}`)}
                style={{
                  backgroundImage: recipe.image
                    ? `url("http://localhost:5000/${recipe.image}")`
                    : 'url("/default-recipe.jpg")',
                }}
                
              ></div>

              <div className="recipe-info">
                <h3
                  onClick={() => navigate(`/app/recipes/${recipe._id}`)}
                  className="recipe-name"
                >
                  {recipe.recipeName}
                </h3>
                <div className="recipe-actions">
                  <button
                    onClick={() => navigate(`/app/update-recipe/${recipe._id}`)}
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
