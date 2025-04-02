import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddRecipe.css'; // You can create this CSS file for styling

const AddRecipe = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    RecipeID: `RCP${Math.random().toString(36).substr(2, 9)}`,
    RecipeName: '',
    category: '',
    time: '',
    ingredients: '',
    instructions: ''
  });
  
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Create a FormData object to handle file upload
      const data = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      
      // Append the image file if it exists
      if (image) {
        data.append('recipeImage', image);
      }
      
      // Send POST request to API
      const response = await axios.post('/api/recipes', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setLoading(false);
      alert('Recipe added successfully!');
      navigate('/'); // Redirect to home page
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add recipe');
      setLoading(false);
    }
  };

  return (
    <div className="add-recipe-container">
      <h1>Add New Recipe</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Recipe ID</label>
          <input
            type="text"
            value={formData.RecipeID}
            disabled
          />
        </div>

        <div className="form-group">
          <label>Recipe Name</label>
          <input
            type="text"
            name="RecipeName"
            value={formData.RecipeName}
            onChange={handleChange}
            placeholder="Enter recipe name"
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Enter recipe category"
            required
          />
        </div>

        <div className="form-group">
          <label>Preparation Time</label>
          <input
            type="text"
            name="time"
            value={formData.time}
            onChange={handleChange}
            placeholder="Enter cooking time (e.g., 30 minutes)"
            required
          />
        </div>

        <div className="form-group">
          <label>Ingredients</label>
          <textarea
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            placeholder="Enter ingredients (one per line)"
            required
          />
        </div>

        <div className="form-group">
          <label>Instructions</label>
          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            placeholder="Enter cooking instructions"
            required
          />
        </div>

        <div className="form-group">
          <label>Recipe Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {previewUrl && (
            <div className="image-preview">
              <img src={previewUrl} alt="Recipe preview" />
            </div>
          )}
        </div>

        <div className="form-buttons">
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Recipe'}
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate('/')}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRecipe;