import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    RecipeID: '',
    RecipeName: '',
    category: '',
    time: '',
    ingredients: '',
    instructions: '',
    image: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the recipe data based on the ID
    const fetchRecipe = async () => {
      try {
        // Replace this with your actual API call
        // Example: const response = await fetch(`/api/recipes/${id}`);
        
        // For demonstration, simulating with timeout
        setTimeout(() => {
          // Mock data - replace with actual API response
          const mockRecipe = {
            RecipeID: id,
            RecipeName: 'Sample Recipe',
            category: 'Dinner',
            time: '30 minutes',
            ingredients: 'Ingredient 1\nIngredient 2\nIngredient 3',
            instructions: '1. Step one\n2. Step two\n3. Step three',
            image: 'https://example.com/image.jpg'
          };
          
          setFormData(mockRecipe);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to fetch recipe details');
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Replace with your actual update API call
      // Example: await fetch(`/api/recipes/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      console.log('Updated Recipe Data:', formData);
      
      // Navigate back to recipe details or list page after successful update
      alert('Recipe updated successfully!');
      navigate('/recipes'); // Change this to your desired redirect path
    } catch (err) {
      setError('Failed to update recipe');
    }
  };

  const formStyle = {
    maxWidth: '800px',
    margin: '2rem auto',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff'
  };

  const titleStyle = {
    color: '#2c3e50',
    marginBottom: '2rem',
    textAlign: 'center',
    fontSize: '2rem'
  };

  const fieldStyle = {
    marginBottom: '1.5rem'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#34495e',
    fontWeight: '500'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #cbd5e0',
    fontSize: '1rem',
    transition: 'border-color 0.2s ease'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '120px',
    resize: 'vertical'
  };

  const buttonStyle = {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    width: '100%'
  };

  const loadingStyle = {
    textAlign: 'center',
    padding: '2rem',
    fontSize: '1.2rem',
    color: '#7f8c8d'
  };

  const errorStyle = {
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: '1rem'
  };

  if (loading) {
    return <div style={loadingStyle}>Loading recipe data...</div>;
  }

  if (error) {
    return (
      <div style={formStyle}>
        <div style={errorStyle}>{error}</div>
        <button 
          style={buttonStyle} 
          onClick={() => navigate('/recipes')}
        >
          Back to Recipes
        </button>
      </div>
    );
  }

  return (
    <div style={formStyle}>
      <h1 style={titleStyle}>Update Recipe</h1>
      <form onSubmit={handleSubmit}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Recipe ID</label>
          <input
            style={inputStyle}
            type="text"
            value={formData.RecipeID}
            disabled
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Recipe Name</label>
          <input
            style={inputStyle}
            type="text"
            name="RecipeName"
            value={formData.RecipeName}
            onChange={handleChange}
            placeholder="Enter recipe name"
            required
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Category</label>
          <input
            style={inputStyle}
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Enter recipe category"
            required
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Time</label>
          <input
            style={inputStyle}
            type="text"
            name="time"
            value={formData.time}
            onChange={handleChange}
            placeholder="Enter cooking time"
            required
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Ingredients</label>
          <textarea
            style={textareaStyle}
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            placeholder="Enter ingredients (one per line)"
            required
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Instructions</label>
          <textarea
            style={textareaStyle}
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            placeholder="Enter cooking instructions"
            required
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Image URL</label>
          <input
            style={inputStyle}
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Enter image URL"
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="submit"
            style={buttonStyle}
          >
            Update Recipe
          </button>
          <button
            type="button"
            style={{
              ...buttonStyle,
              backgroundColor: '#7f8c8d'
            }}
            onClick={() => navigate('/recipes')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateRecipe;