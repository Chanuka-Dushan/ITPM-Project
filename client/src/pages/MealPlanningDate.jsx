import React, { useState, useEffect } from "react";

const MealPlanningDate = () => {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
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

  const [timeErrors, setTimeErrors] = useState({
    breakfast: "",
    lunch: "",
    dinner: ""
  });

  const [recipes, setRecipes] = useState(defaultRecipes);
  const [newRecipe, setNewRecipe] = useState({ name: "", dietary: [] });
  const [dietaryFilters, setDietaryFilters] = useState([]);
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  
  const [mealSchedule, setMealSchedule] = useState(
    daysOfWeek.reduce((acc, day) => {
      acc[day] = { breakfast: "", lunch: "", dinner: "" };
      return acc;
    }, {})
  );

  const [currentDay, setCurrentDay] = useState(daysOfWeek[0]);
  const [currentMeal, setCurrentMeal] = useState("breakfast");
  const [showScheduler, setShowScheduler] = useState(false);

  // Fetch existing meal data on component mount
  useEffect(() => {
    const fetchMealData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/meals");
        if (!response.ok) {
          throw new Error("Failed to fetch meal data");
        }
        const data = await response.json();
        
        // If data exists, update the states with fetched values
        if (data && data.length > 0) {
          const latestData = data[data.length - 1]; // Get the most recent entry
          
          setFormData(prev => ({
            ...prev,
            UserName: latestData.UserName || "",
            dayspreferred: latestData.dayspreferred || "",
            calorie: latestData.calorie || "",
            breakfast: latestData.breakfast || "",
            lunch: latestData.lunch || "",
            dinner: latestData.dinner || "",
            suggestions: latestData.suggestions || ""
          }));

          // Update meal schedule if it exists in the data
          if (latestData.mealSchedule) {
            setMealSchedule(prev => ({
              ...prev,
              ...latestData.mealSchedule
            }));
          }

          // Update recipes if additional ones exist in the data
          if (latestData.recipes && latestData.recipes.length > 0) {
            setRecipes(prev => [...defaultRecipes, ...latestData.recipes]);
          }
        }
      } catch (error) {
        console.error("Error fetching meal data:", error);
      }
    };

    fetchMealData();
  }, []); // Empty dependency array means this runs once on mount

  const convertTo12Hour = (time24) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours);
    const meridiem = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${meridiem}`;
  };

  const getHoursFromTime = (timeString) => {
    if (!timeString) return null;
    const [hours] = timeString.split(":");
    return parseInt(hours);
  };

  const validateTime = (name, value) => {
    let error = "";
    const hours = getHoursFromTime(value);
    
    if (value && hours !== null) {
      if (name === "breakfast" && hours >= 12) {
        error = "Breakfast time must be in AM (before 12:00)";
      } else if ((name === "lunch" || name === "dinner") && hours < 12) {
        error = `${name.charAt(0).toUpperCase() + name.slice(1)} time must be in PM (12:00 or later)`;
      }
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "calorie" && value < 0) {
      return;
    }

    if (["breakfast", "lunch", "dinner"].includes(name)) {
      const error = validateTime(name, value);
      setTimeErrors(prev => ({
        ...prev,
        [name]: error
      }));
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
      return;
    }
    
    setRecipes([...recipes, newRecipe]);
    setNewRecipe({ name: "", dietary: [] });
    setShowRecipeForm(false);
  };

  const getFilteredRecipes = () => {
    if (dietaryFilters.length === 0) {
      return recipes;
    }
    
    return recipes.filter(recipe => 
      dietaryFilters.every(filter => recipe.dietary.includes(filter))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const hasTimeErrors = Object.values(timeErrors).some(error => error !== "");
    
    if (hasTimeErrors) {
      alert("Please fix time errors before submitting");
      return;
    }
    
    const formSubmission = {
      ...formData,
      mealSchedule,
      recipes // Include recipes in the submission
    };

    try {
      const response = await fetch("http://localhost:5000/api/meals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formSubmission),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Form submitted successfully:", data);
      alert("Form submitted successfully!");
      
      setFormData({
        UserName: "",
        dayspreferred: "",
        calorie: "",
        breakfast: "",
        lunch: "",
        dinner: "",
        suggestions: "",
      });
      
      setMealSchedule(
        daysOfWeek.reduce((acc, day) => {
          acc[day] = { breakfast: "", lunch: "", dinner: "" };
          return acc;
        }, {})
      );

    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form. Please try again.");
    }
  };

  // Styles remain unchanged
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

  const errorInputStyle = {
    ...inputStyle,
    borderColor: "#e74c3c",
  };

  const errorMessageStyle = {
    color: "#e74c3c",
    fontSize: "0.8rem",
    marginTop: "0.2rem",
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
    color: "#1a1a1a",
    fontWeight: "500",
  };

  const selectedRecipeStyle = {
    ...recipeButtonStyle,
    backgroundColor: "#d6eaf8",
    borderColor: "#3498db",
    color: "#1a1a1a",
  };

  const tagStyle = {
    display: "inline-block",
    backgroundColor: "#e8f4f8",
    border: "1px solid #a8d8e8",
    borderRadius: "12px",
    padding: "2px 8px",
    margin: "2px",
    fontSize: "0.7rem",
    color: "#1e6091",
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
    color: "#333",
  };

  const tableHeaderStyle = {
    ...tableCellStyle,
    backgroundColor: "#f2f2f2",
    fontWeight: "700",
    color: "#000",
  };

  const sectionHeaderStyle = {
    fontSize: "1rem",
    marginBottom: "0.5rem",
    color: "#1a1a1a",
    fontWeight: "600",
  };

  const dietaryTagStyle = {
    fontSize: "0.6rem",
    padding: "1px 4px",
    backgroundColor: "#f0f0f0",
    borderRadius: "8px",
    color: "#333",
    fontWeight: "500",
  };

  const timeHintStyle = {
    fontSize: "0.7rem",
    color: "#666",
    marginTop: "0.1rem",
  };

  const filteredRecipes = getFilteredRecipes();

  return (
    <div style={formStyle}>
      <h1 style={titleStyle}>Meal Scheduling</h1>
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

        <div style={fieldStyle}>
          <label style={labelStyle}>Meal Time Preferences</label>
          <div style={flexContainer}>
            <div>
              <label style={labelStyle}>Breakfast</label>
              <input
                style={timeErrors.breakfast ? errorInputStyle : inputStyle}
                type="time"
                name="breakfast"
                value={formData.breakfast}
                onChange={handleChange}
              />
              {timeErrors.breakfast && <div style={errorMessageStyle}>{timeErrors.breakfast}</div>}
              <div style={timeHintStyle}>Morning hours only (AM)</div>
            </div>

            <div>
              <label style={labelStyle}>Lunch</label>
              <input
                style={timeErrors.lunch ? errorInputStyle : inputStyle}
                type="time"
                name="lunch"
                value={formData.lunch}
                onChange={handleChange}
              />
              {timeErrors.lunch && <div style={errorMessageStyle}>{timeErrors.lunch}</div>}
              <div style={timeHintStyle}>Afternoon hours only (PM)</div>
            </div>

            <div>
              <label style={labelStyle}>Dinner</label>
              <input
                style={timeErrors.dinner ? errorInputStyle : inputStyle}
                type="time"
                name="dinner"
                value={formData.dinner}
                onChange={handleChange}
              />
              {timeErrors.dinner && <div style={errorMessageStyle}>{timeErrors.dinner}</div>}
              <div style={timeHintStyle}>Evening hours only (PM)</div>
            </div>
          </div>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Meal Scheduling</label>
          <button 
            type="button" 
            style={secondaryButtonStyle} 
            onClick={toggleScheduler}
          >
            {showScheduler ? "Hide Meal Scheduler" : "Open Meal Scheduler"}
          </button>
          
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