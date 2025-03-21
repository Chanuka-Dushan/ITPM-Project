import React, { useState } from "react";

const MealPlanning = () => {
  const [formData, setFormData] = useState({
    UserName: "",
    dayspreferred: "",
    mealspreferred: "",
    calorie: "",
    timepreferred: "",
    suggestions: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate for calorie field to prevent negative numbers
    if (name === "calorie" && value < 0) {
      return; // Prevent setting negative calorie values
    }

    // Validate for text-only fields (no numbers or special characters)
    if (
      (name === "dayspreferred" || name === "mealspreferred" || name === "timepreferred") &&
      /[^a-zA-Z\s]/.test(value) // Checks for any character that's not a letter or space
    ) {
      return; // Prevent updating state if invalid character is found
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  const formStyle = {
    maxWidth: "500px",
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
    width: "90%",
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
    width: "60%", // Adjusted width to make the button smaller
    display: "block",
    margin: "1rem auto",
  };

  return (
    <div style={formStyle}>
      <h1 style={titleStyle}>Recipe Details Form</h1>
      <form onSubmit={handleSubmit}>
        <div style={fieldStyle}>
          <label style={labelStyle}>User Name</label>
          <input
            style={inputStyle}
            type="text"
            name="UserName"
            value={formData.UserName}
            onChange={handleChange} // ✅ Now it updates state
            placeholder="Enter your name"
            required
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Preferred Days Category</label>
          <input
            style={inputStyle}
            type="text"
            name="dayspreferred"
            value={formData.dayspreferred}
            onChange={handleChange}
            placeholder="ex: Weekday/Weekend/Both"
            required
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Meal Types Preferred</label>
          <input
            style={inputStyle}
            type="text"
            name="mealspreferred"
            value={formData.mealspreferred}
            onChange={handleChange}
            placeholder="ex: vegetarian/keto/high-protein"
            required
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Calorie Limit</label>
          <input
            style={inputStyle}
            name="calorie"
            type="number"
            value={formData.calorie}
            onChange={handleChange}
            placeholder="Enter your daily calorie goal"
            required
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Meal Time Preferences</label>
          <input
            style={inputStyle}
            name="timepreferred"
            type="text"
            value={formData.timepreferred}
            onChange={handleChange}
            placeholder="ex: Breakfast/Lunch/Dinner/All"
            required
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Suggestions</label>
          <textarea
            style={textareaStyle}
            name="suggestions"
            value={formData.suggestions}
            onChange={handleChange}
            placeholder="Enter your suggestions"
            required
          />
        </div>

        <button type="submit" style={buttonStyle}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default MealPlanning;
