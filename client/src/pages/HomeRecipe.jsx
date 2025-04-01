import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../components/HomeRecipe.css';
import dishes from '/src/assets/images/dishes.jpg';
import axios from 'axios'; // Make sure axios is installed

export default function HomeRecipe() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all recipes when component mounts
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/recipes/get'); // Adjust the API endpoint as needed
      console.log(response.data); // Log the response to check its format
      if (Array.isArray(response.data)) {
        setRecipes(response.data);
      } else {
        setError('API response is not in the expected format.');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setError('Failed to load recipes');
      setLoading(false);
    }
  };

  const handleDelete = async (recipeId) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await axios.delete(`/api/recipes/${recipeId}`);
        // After successful delete, refresh the recipes list
        fetchRecipes();
      } catch (error) {
        console.error('Error deleting recipe:', error);
        alert('Failed to delete recipe');
      }
    }
  };

  return (
    <>
      <section className='home-recipe'>
        <div className='center'>
          <h1>Recipes</h1>
          <p>
            Explore Delicious Recipes! Browse a variety of mouthwatering dishes and find the perfect recipe to try at home. Each recipe comes with detailed ingredients and step-by-step instructions to make cooking easy and enjoyable. Use the search bar to find recipes by category or ingredient. Start your cooking journey today! 👩‍🍳🔥
          </p>
          <button onClick={() => navigate('/add-recipe')}>Add Recipes</button>
        </div>
        <div className='right'>
          <img src={dishes} width="560px" height="800px" alt="Dishes" />
        </div>
      </section>
      <div className='bg'>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#00cba9" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,218.7C672,203,768,149,864,144C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      {/* Recipe Gallery Section */}
      <section className='recipe-gallery'>
        <div className='container'>
          <h2 className='section-title'>Our Recipes</h2>
          
          {loading ? (
            <div className='loading'>Loading recipes...</div>
          ) : error ? (
            <div className='error'>{error}</div>
          ) : (
            <div className='recipe-grid'>
              {Array.isArray(recipes) ? (
                recipes.map(recipe => (
                  <div className='recipe-card' key={recipe._id || recipe.RecipeID}>
                    <div className='recipe-image'>
                      <img 
                        src={recipe.image || '/default-recipe.jpg'} 
                        alt={recipe.RecipeName} 
                        onClick={() => navigate(`/recipe/${recipe._id}`)}
                      />
                    </div>
                    <div className='recipe-info'>
                      <h3>{recipe.RecipeName}</h3>
                      <div className='recipe-actions'>
                        <button 
                          className='update-btn'
                          onClick={() => navigate(`/update-recipe/:id/`)}
                        >
                          <i className='fa fa-edit'></i> Edit
                        </button>
                        <button 
                          className='delete-btn'
                          onClick={() => handleDelete(recipe._id)}
                        >
                          <i className='fa fa-trash'></i> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className='error'>No recipes available</div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

