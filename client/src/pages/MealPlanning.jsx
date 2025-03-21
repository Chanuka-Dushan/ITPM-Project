import { useState } from 'react';

const DashBoard = () => {
  const [formData, setFormData] = useState({
    recipeID: `RCP${Math.random().toString(36).substr(2, 9)}`,
    recipeName: '',
    category: '',
    ingredients: '',
    instructions: '',
    imageUrl: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
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

  return (
    <div style={formStyle}>
      <h1 style={titleStyle}>Recipe Form</h1>
      <form onSubmit={handleSubmit}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Recipe ID</label>
          <input
            style={inputStyle}
            type="text"
            value={formData.recipeID}
            disabled
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Recipe Name</label>
          <input
            style={inputStyle}
            type="text"
            name="recipeName"
            value={formData.recipeName}
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
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="Enter image URL"
            required
          />
        </div>

        <button
          type="submit"
          style={buttonStyle}
        >
          Save Recipe
        </button>
      </form>
    </div>
  );
};

export default MealPlanning;
