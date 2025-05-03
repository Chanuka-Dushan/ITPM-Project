import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RecipeForm.css';

const UpdateRecipeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    recipeName: '',
    category: '',
    dietaryPreference: '',
    time: '',
    ingredients: [{ name: '', quantity: '' }],
    instructions: '',
    image: null
  });

  // Preview image state
  const [imagePreview, setImagePreview] = useState('');
  const [currentImage, setCurrentImage] = useState('');

  // Fetch recipe data when component mounts
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`/api/recipes/${id}`);
        const recipe = response.data;
        
        // Format ingredients for form
        const formattedIngredients = recipe.ingredients.map(ing => ({
          name: ing.name || '',
          quantity: ing.quantity || ''
        }));

        setFormData({
          recipeName: recipe.recipeName || '',
          category: recipe.category || '',
          dietaryPreference: recipe.dietaryPreference || '',
          time: recipe.time || '',
          ingredients: formattedIngredients.length > 0 ? formattedIngredients : [{ name: '', quantity: '' }],
          instructions: recipe.instructions || '',
          image: null
        });

        if (recipe.image) {
          //setCurrentImage(recipe.image);
          
          setCurrentImage(`http://localhost:5000${recipe.image}`);
          console.log('Current image URL:', recipe.image);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError('Failed to load recipe data. Please try again.');
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle ingredient changes
  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index][field] = value;
    setFormData({
      ...formData,
      ingredients: updatedIngredients
    });
  };

  // Add new ingredient field
  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { name: '', quantity: '' }]
    });
  };

  // Remove ingredient field
  const removeIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      const updatedIngredients = formData.ingredients.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        ingredients: updatedIngredients
      });
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file
      });
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.recipeName || !formData.category || !formData.dietaryPreference || !formData.time || !formData.instructions) {
      setError('Please fill out all required fields');
      return;
    }

    if (formData.ingredients.length < 3) {
      setError('Please add at least 3 ingredients');
      return;
    }

    // Check if all ingredients have both name and quantity
    const invalidIngredients = formData.ingredients.filter(
      ing => !ing.name.trim() || !ing.quantity.trim()
    );
    if (invalidIngredients.length > 0) {
      setError('Please complete all ingredient fields');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Create FormData object for multipart/form-data submission
      const data = new FormData();
      data.append('recipeName', formData.recipeName);
      data.append('category', formData.category);
      data.append('dietaryPreference', formData.dietaryPreference);
      data.append('time', formData.time);
      data.append('instructions', formData.instructions);
      
      // Format ingredients as expected by backend
      const ingredientsFormatted = formData.ingredients.map(ing => ({
        name: ing.name,
        quantity: ing.quantity
      }));
      data.append('ingredients', JSON.stringify(ingredientsFormatted));
      
      // Add image if exists
      if (formData.image) {
        data.append('image', formData.image);
      }

      // Send PUT request
      await axios.put(`/api/recipes/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Redirect to recipes page on success
      navigate('/app/recipes');
    } catch (err) {
      console.error('Error updating recipe:', err);
      setError(err.response?.data?.message || 'Failed to update recipe. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading recipe data...</div>;

  return (
    <div className="recipe-form-container">
      <h1>Update Recipe</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="recipe-form">
        <div className="form-group">
          <label htmlFor="recipeName">Recipe Name*</label>
          <input
            type="text"
            id="recipeName"
            name="recipeName"
            value={formData.recipeName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category*</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Appetizer">Appetizer</option>
            <option value="Dessert">Dessert</option>
            <option value="Snack">Snack</option>
            <option value="Drink">Drink</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
         <label htmlFor="dietaryPreference">Dietary Preference</label>
         <select
          id="dietaryPreference"
          name="dietaryPreference"
          value={formData.dietaryPreference}
          onChange={handleChange}
          required
      >
          <option value="">Select Preference</option>
          <option value="Vegan">Vegan</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Gluten-Free">Gluten-Free</option>
          <option value="Keto">Keto</option>
          <option value="Halal">Halal</option>
          <option value="Kosher">Kosher</option>
          <option value="None">None</option>
         </select>
        </div>

        <div className="form-group">
          <label htmlFor="time">Preparation Time*</label>
          <input
            type="text"
            id="time"
            name="time"
            placeholder="e.g., 30 minutes"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Ingredients* (at least 3)</label>
          {formData.ingredients.map((ingredient, index) => (
            <div key={index} className="ingredient-row">
              <input
                type="text"
                placeholder="Ingredient name"
                value={ingredient.name}
                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Quantity"
                value={ingredient.quantity}
                onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                required
              />
              <button 
                type="button" 
                className="remove-btn"
                onClick={() => removeIngredient(index)}
                disabled={formData.ingredients.length <= 1}
              >
                X
              </button>
            </div>
          ))}
          <button type="button" className="add-btn" onClick={addIngredient}>
            + Add Ingredient
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="instructions">Cooking Instructions*</label>
          <textarea
            id="instructions"
            name="instructions"
            rows="6"
            value={formData.instructions}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="image">Recipe Image</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          
          {/* Show image preview or current image */}
          {imagePreview ? (
            <div className="image-preview">
              <img src={imagePreview} alt="Recipe preview" />
              <p>New image selected</p>
            </div>
          ) : currentImage ? (
            <div className="image-preview">
              <img src={currentImage} alt="Current recipe" />
              <p>Current image</p>
            </div>
          ) : null}
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/app/recipes')} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? 'Saving...' : 'Update Recipe'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateRecipeForm;