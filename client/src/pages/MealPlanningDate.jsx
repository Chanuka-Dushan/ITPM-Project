import React, { useState } from "react";

const MealPlanningDate = () => {
  // Days of the week for scheduling
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  // Sample recipes with dietary tags
  const defaultRecipes = [
    { name: "Avocado Toast", dietary: ["vegetarian", "vegan"] },
    { name: "Greek Yogurt with Berries", dietary: ["vegetarian", "low-carb"] },
    { name: "Smoothie Bowl", dietary: ["vegetarian", "vegan"] },
    { name: "Vegetable Stir Fry", dietary: ["vegetarian", "vegan", "gluten-free"] },
    { name: "Grilled Chicken Salad", dietary: ["high-protein", "low-carb"] },
    { name: "Salmon with Roasted Vegetables", dietary: ["high-protein", "gluten-free"] },
    { name: "Lentil Soup", dietary: ["vegetarian", "vegan", "high-protein"] },
    { name: "Quinoa Bowl", dietary: ["vegetarian", "high-protein"] }
  ];

  // Dietary preference options
  const dietaryOptions = ["vegetarian", "vegan", "gluten-free", "high-protein", "low-carb"];

  const [formData, setFormData] = useState({
    UserName: "",
    dayspreferred: "",
    calorie: "",
    breakfast: "",
    lunch: "",
    dinner: "",
    suggestions: "",
  });

  // State for recipes
  const [recipes, setRecipes] = useState(defaultRecipes);
  
  // State for custom recipe form
  const [newRecipe, setNewRecipe] = useState({ name: "", dietary: [] });
  
  // State for recipe filters
  const [dietaryFilters, setDietaryFilters] = useState([]);
  
  // State for showing/hiding custom recipe form
  const [showRecipeForm, setShowRecipeForm] = useState(false);

  // State for meal schedule
  const [mealSchedule, setMealSchedule] = useState(
    daysOfWeek.reduce((acc, day) => {
      acc[day] = { breakfast: "", lunch: "", dinner: "" };
      return acc;
    }, {})
  );

  // Current day being edited
  const [currentDay, setCurrentDay] = useState(daysOfWeek[0]);
  
  // Current meal being edited
  const [currentMeal, setCurrentMeal] = useState("breakfast");
  
  // Whether to show the meal scheduling modal
  const [showScheduler, setShowScheduler] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate calorie field to prevent negative numbers
    if (name === "calorie" && value < 0) {
      return; // Prevent setting negative calorie values
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleScheduleChange = (recipeName) => {
    setMealSchedule((prev) => ({
      ...prev,
      [currentDay]: {
        ...prev[currentDay],
        [currentMeal]: recipeName
      }
    }));
  };

  const handleDayChange = (e) => {
    setCurrentDay(e.target.value);
  };

  const handleMealTypeChange = (e) => {
    setCurrentMeal(e.target.value);
  };

  const toggleScheduler = () => {
    setShowScheduler(!showScheduler);
  };

  const toggleRecipeForm = () => {
    setShowRecipeForm(!showRecipeForm);
  };

  const handleNewRecipeChange = (e) => {
    setNewRecipe({
      ...newRecipe,
      name: e.target.value
    });
  };

  const handleDietaryChange = (diet) => {
    setNewRecipe((prev) => {
      const updatedDietary = prev.dietary.includes(diet)
        ? prev.dietary.filter(d => d !== diet)
        : [...prev.dietary, diet];
      
      return {
        ...prev,
        dietary: updatedDietary
      };
    });
  };

  const handleFilterChange = (diet) => {
    setDietaryFilters((prev) => {
      return prev.includes(diet)
        ? prev.filter(d => d !== diet)
        : [...prev, diet];
    });
  };

  const addNewRecipe = () => {
    if (newRecipe.name.trim() === "") {
      return; // Don't add empty recipes
    }
    
    setRecipes([...recipes, newRecipe]);
    setNewRecipe({ name: "", dietary: [] }); // Reset form
    setShowRecipeForm(false); // Hide form after adding
  };

  const getFilteredRecipes = () => {
    if (dietaryFilters.length === 0) {
      return recipes; // Return all recipes if no filters active
    }
    
    return recipes.filter(recipe => 
      dietaryFilters.every(filter => recipe.dietary.includes(filter))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Include meal schedule in the form submission
    const formSubmission = {
      ...formData,
      mealSchedule
    };
    console.log("Form Data:", formSubmission);
    alert("Form submitted successfully!");
  };

  // Styles
  const formStyle = {
    maxWidth: "600px",
    margin: "2rem auto",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#ffffff",
    textAlign: "center",
  };

  const titleStyle = {
    color: "#2c3e50",
    marginBottom: "1.5rem",
    textAlign: "center",
    fontSize: "1.8rem",
  };

  const fieldStyle = {
    marginBottom: "1rem",
    textAlign: "left",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "0.3rem",
    color: "#34495e",
    fontWeight: "500",
    fontSize: "0.9rem",
  };

  const inputStyle = {
    width: "99%",
    padding: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #cbd5e0",
    fontSize: "0.9rem",
    transition: "border-color 0.2s ease",
    display: "block",
    margin: "0 auto",
    color: "black",
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: "80px",
    resize: "vertical",
  };

  const buttonStyle = {
    backgroundColor: "#3498db",
    color: "white",
    padding: "0.6rem 1.2rem",
    border: "none",
    borderRadius: "4px",
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    width: "60%",
    display: "block",
    margin: "1rem auto",
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#2ecc71",
    width: "auto",
    padding: "0.4rem 0.8rem",
    fontSize: "0.8rem",
    margin: "0.5rem 0",
  };

  const tertiaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#9b59b6",
    width: "auto",
    padding: "0.4rem 0.8rem",
    fontSize: "0.8rem",
    margin: "0.5rem 0",
  };

  const flexContainer = {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
  };

  const smallInput = {
    padding: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #cbd5e0",
    fontSize: "0.9rem",
    textAlign: "center",
  };

  const scheduleModalStyle = {
    display: showScheduler ? "block" : "none",
    backgroundColor: "#f8f9fa",
    padding: "1rem",
    borderRadius: "8px",
    marginTop: "1rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  };

  const recipeButtonStyle = {
    backgroundColor: "#ecf0f1",
    border: "1px solid #ddd",
    borderRadius: "4px",
    padding: "0.5rem",
    margin: "0.3rem",
    cursor: "pointer",
    fontSize: "0.8rem",
    color: "#1a1a1a", // Darker text color for recipes
    fontWeight: "500",
  };

  const selectedRecipeStyle = {
    ...recipeButtonStyle,
    backgroundColor: "#d6eaf8",
    borderColor: "#3498db",
    color: "#1a1a1a", // Maintain dark text even when selected
  };

  const tagStyle = {
    display: "inline-block",
    backgroundColor: "#e8f4f8",
    border: "1px solid #a8d8e8",
    borderRadius: "12px",
    padding: "2px 8px",
    margin: "2px",
    fontSize: "0.7rem",
    color: "#1e6091", // Darker blue for better readability
    fontWeight: "500",
  };

  const selectedTagStyle = {
    ...tagStyle,
    backgroundColor: "#3498db",
    borderColor: "#2980b9",
    color: "white",
    fontWeight: "600",
  };

  const checkboxStyle = {
    marginRight: "5px",
  };

  const scheduleTableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1rem",
    fontSize: "0.85rem",
  };

  const tableCellStyle = {
    border: "1px solid #ddd",
    padding: "0.5rem",
    textAlign: "left",
    color: "#333", // Slightly darker text for table cells
  };

  const tableHeaderStyle = {
    ...tableCellStyle,
    backgroundColor: "#f2f2f2",
    fontWeight: "700", // Bolder text for headers
    color: "#000", // Black text for table headers
  };

  const sectionHeaderStyle = {
    fontSize: "1rem", 
    marginBottom: "0.5rem",
    color: "#1a1a1a", // Darker text for section headers
    fontWeight: "600",
  };

  const dietaryTagStyle = {
    fontSize: "0.6rem", 
    padding: "1px 4px", 
    backgroundColor: "#f0f0f0", 
    borderRadius: "8px",
    color: "#333", // Darker text for dietary tags
    fontWeight: "500",
  };

  const filteredRecipes = getFilteredRecipes();

  return (
    <div style={formStyle}>
      <h1 style={titleStyle}>Meal Planning Form</h1>
      <form onSubmit={handleSubmit}>
        <div style={fieldStyle}>
          <label style={labelStyle}>User Name</label>
          <input
            style={inputStyle}
            type="text"
            name="UserName"
            value={formData.UserName}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </div>

        {/* Meal Time Preferences Section */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Meal Time Preferences</label>
          <div style={flexContainer}>
            <div>
              <label style={labelStyle}>Breakfast</label>
              <input
                style={inputStyle}
                type="time"
                name="breakfast"
                value={formData.breakfast}
                onChange={handleChange}
              />
            </div>

            <div>
              <label style={labelStyle}>Lunch</label>
              <input
                style={inputStyle}
                type="time"
                name="lunch"
                value={formData.lunch}
                onChange={handleChange}
              />
            </div>

            <div>
              <label style={labelStyle}>Dinner</label>
              <input
                style={inputStyle}
                type="time"
                name="dinner"
                value={formData.dinner}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Meal Scheduling Section */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Meal Scheduling</label>
          <button 
            type="button" 
            style={secondaryButtonStyle} 
            onClick={toggleScheduler}
          >
            {showScheduler ? "Hide Meal Scheduler" : "Open Meal Scheduler"}
          </button>
          
          {/* Meal Scheduler Modal */}
          <div style={scheduleModalStyle}>
            <div style={flexContainer}>
              <div>
                <label style={labelStyle}>Day</label>
                <select style={inputStyle} value={currentDay} onChange={handleDayChange}>
                  {daysOfWeek.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Meal Type</label>
                <select style={inputStyle} value={currentMeal} onChange={handleMealTypeChange}>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                </select>
              </div>
            </div>
            
            {/* Recipe Management Section */}
            <div style={{ marginTop: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={sectionHeaderStyle}>Recipe Library</h3>
                <button 
                  type="button" 
                  style={tertiaryButtonStyle} 
                  onClick={toggleRecipeForm}
                >
                  {showRecipeForm ? "Cancel" : "Add Custom Recipe"}
                </button>
              </div>
              
              {/* Custom Recipe Form */}
              {showRecipeForm && (
                <div style={{ 
                  marginTop: "1rem", 
                  padding: "1rem", 
                  backgroundColor: "#f1f9f3", 
                  borderRadius: "8px" 
                }}>
                  <label style={labelStyle}>Recipe Name</label>
                  <input
                    style={inputStyle}
                    type="text"
                    value={newRecipe.name}
                    onChange={handleNewRecipeChange}
                    placeholder="Enter recipe name"
                  />
                  
                  <label style={{ ...labelStyle, marginTop: "0.5rem" }}>Dietary Properties</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.3rem" }}>
                    {dietaryOptions.map(diet => (
                      <span
                        key={diet}
                        style={newRecipe.dietary.includes(diet) ? selectedTagStyle : tagStyle}
                        onClick={() => handleDietaryChange(diet)}
                      >
                        {diet}
                      </span>
                    ))}
                  </div>
                  
                  <button
                    type="button"
                    style={{ ...secondaryButtonStyle, marginTop: "1rem" }}
                    onClick={addNewRecipe}
                  >
                    Add Recipe
                  </button>
                </div>
              )}
              
              {/* Recipe Filters */}
              <div style={{ marginTop: "1rem" }}>
                <label style={labelStyle}>Filter by Dietary Preferences:</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                  {dietaryOptions.map(diet => (
                    <span
                      key={diet}
                      style={dietaryFilters.includes(diet) ? selectedTagStyle : tagStyle}
                      onClick={() => handleFilterChange(diet)}
                    >
                      {diet}
                    </span>
                  ))}
                </div>
                {dietaryFilters.length > 0 && (
                  <div style={{ fontSize: "0.8rem", marginTop: "0.3rem", color: "#333" }}>
                    Showing recipes matching: {dietaryFilters.join(", ")}
                  </div>
                )}
              </div>
              
              {/* Recipe Selection */}
              <div style={{ marginTop: "1rem" }}>
                <label style={labelStyle}>Select a Recipe:</label>
                {filteredRecipes.length === 0 ? (
                  <div style={{ padding: "0.5rem", color: "#333" }}>
                    No recipes match the selected filters.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                    {filteredRecipes.map(recipe => (
                      <div key={recipe.name} style={{ position: "relative" }}>
                        <button
                          type="button"
                          style={mealSchedule[currentDay][currentMeal] === recipe.name ? selectedRecipeStyle : recipeButtonStyle}
                          onClick={() => handleScheduleChange(recipe.name)}
                        >
                          {recipe.name}
                          <div style={{ 
                            display: "flex", 
                            flexWrap: "wrap", 
                            gap: "2px", 
                            marginTop: "3px",
                            justifyContent: "center"
                          }}>
                            {recipe.dietary.map(diet => (
                              <span 
                                key={diet} 
                                style={dietaryTagStyle}
                              >
                                {diet}
                              </span>
                            ))}
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Weekly Schedule Overview */}
            <div style={{ marginTop: "1.5rem" }}>
              <h3 style={sectionHeaderStyle}>Weekly Meal Schedule</h3>
              <table style={scheduleTableStyle}>
                <thead>
                  <tr>
                    <th style={tableHeaderStyle}>Day</th>
                    <th style={tableHeaderStyle}>Breakfast</th>
                    <th style={tableHeaderStyle}>Lunch</th>
                    <th style={tableHeaderStyle}>Dinner</th>
                  </tr>
                </thead>
                <tbody>
                  {daysOfWeek.map(day => (
                    <tr key={day}>
                      <td style={tableCellStyle}>{day}</td>
                      <td style={tableCellStyle}>{mealSchedule[day].breakfast || "-"}</td>
                      <td style={tableCellStyle}>{mealSchedule[day].lunch || "-"}</td>
                      <td style={tableCellStyle}>{mealSchedule[day].dinner || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <button type="submit" style={buttonStyle}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default MealPlanningDate;