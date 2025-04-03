import React, { useState, useEffect } from "react";

const MealPlanningDetails = ({ mealPlanId }) => {
  const [formData, setFormData] = useState({
    UserName: "",
    dayspreferred: "",
    mealspreferred: "",
    calorie: "",
    timepreferred: "",
    suggestions: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    console.log("mealPlanId in useEffect:", mealPlanId); // Log the mealPlanId
    if (mealPlanId) {
      fetch(`http://localhost:5000/api/mealplans/${mealPlanId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch meal plan data");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Fetched meal plan data:", data); // Log fetched data
          setFormData(data);
          setIsUpdate(true); // Set to update mode
        })
        .catch((error) => {
          console.error("Error fetching meal plan:", error);
          alert("Failed to fetch meal plan. Please check the backend or API.");
        });
    }
  }, [mealPlanId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "calorie" && value < 0) {
      return; // Prevent setting negative calorie values
    }

    if (
      (name === "dayspreferred" || name === "mealspreferred" || name === "timepreferred") &&
      /[^a-zA-Z\s]/.test(value) // Validate to allow only text and spaces
    ) {
      return; // Prevent updating state if invalid character is found
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data on Submit:", formData);

    const method = isUpdate ? "PUT" : "POST";
    const url = isUpdate
      ? `http://localhost:5000/api/mealplans/${mealPlanId}`
      : "http://localhost:5000/api/mealplans";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(isUpdate ? "Failed to update meal plan" : "Failed to submit meal plan");
      }

      const result = await response.json();
      console.log(`${isUpdate ? "Updated" : "Submitted"} meal plan successfully:`, result);

      setSuccessMessage(`${isUpdate ? "Updated" : "Submitted"} meal plan successfully!`);
      setFormData({
        UserName: "",
        dayspreferred: "",
        mealspreferred: "",
        calorie: "",
        timepreferred: "",
        suggestions: "",
      });
    } catch (error) {
      console.error(isUpdate ? "Error updating meal plan:" : "Error submitting meal plan:", error);
    }
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

  const successStyle = {
    color: "green",
    fontSize: "1rem",
    marginBottom: "1rem",
  };

  return (
    <div style={formStyle}>
      <h1 style={titleStyle}>{isUpdate ? "Update Meal Plan" : "Meal Planning Details Form"}</h1>
      {successMessage && <div style={successStyle}>{successMessage}</div>}
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
          {isUpdate ? "Update" : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default MealPlanningDetails;
