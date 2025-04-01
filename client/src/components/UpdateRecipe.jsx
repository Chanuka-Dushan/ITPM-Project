import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddRecipe.css'; // Reusing the same CSS file

const UpdateRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    RecipeID: '',
    RecipeName: '',
    category: '',
    time: '',
    ingredients: '',
    instructions: ''
  });
  
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch recipe data
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`/api/recipes/${id}`);
        const recipeData = response.data;
        
        setFormData({
          RecipeID: recipeData.RecipeID || recipeData._id,
          RecipeName: recipeData.RecipeName || '',
          category: recipeData.category || '',
          time: recipeData.time || '',
          ingredients: recipeData.ingredients || '',
          instructions: recipeData.instructions || ''
        });
        
        if (recipeData.image) {
          setCurrentImage(recipeData.image);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError('Failed to load recipe data');
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
    setSubmitting(true);
    setError(null);
    
    try {
      // Create a FormData object for file upload
      const data = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      
      // Append the image file if a new one was selected
      if (image) {
        data.append('recipeImage', image);
      }
      
      // Send PUT request to API
      await axios.put(`/api/recipes/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSubmitting(false);
      alert('Recipe updated successfully!');
      navigate('/'); // Redirect to home page
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update recipe');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading recipe data...</div>;
  }

  return (
    <div className="add-recipe-container">
      <h1>Update Recipe</h1>
      
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
          {previewUrl ? (
            <div className="image-preview">
              <img src={previewUrl} alt="Recipe preview" />
            </div>
          ) : currentImage ? (
            <div className="image-preview">
              <img src={currentImage} alt="Current recipe" />
              <p>Current image</p>
            </div>
          ) : null}
        </div>

        <div className="form-buttons">
          <button
            type="submit"
            className="submit-btn"
            disabled={submitting}
          >
            {submitting ? 'Updating...' : 'Update Recipe'}
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate('/')}
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateRecipe;