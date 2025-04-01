// Example recipes
const recipes = [
    {
      name: "Spaghetti Carbonara",
      description: "A classic Italian pasta dish with eggs, cheese, pancetta, and pepper.",
      steps: [
        "Boil water and cook the spaghetti until al dente.",
        "In a pan, fry pancetta until crispy.",
        "Whisk together eggs, grated Parmesan, and black pepper.",
        "Drain the spaghetti, then combine it with the pancetta.",
        "Toss with the egg mixture and serve immediately."
      ]
    },
    {
      name: "Chicken Curry",
      description: "A spicy and flavorful curry made with chicken, onions, tomatoes, and spices.",
      steps: [
        "Heat oil and sauté onions, garlic, and ginger.",
        "Add chopped tomatoes and cook until soft.",
        "Add chicken and cook until browned.",
        "Stir in spices (curry powder, cumin, etc.) and cook for 2 minutes.",
        "Add water or broth, simmer until chicken is fully cooked, and serve with rice."
      ]
    },
    {
      name: "Caesar Salad",
      description: "A classic salad with romaine lettuce, croutons, Parmesan, and Caesar dressing.",
      steps: [
        "Chop the romaine lettuce and place it in a bowl.",
        "Add croutons and grated Parmesan cheese.",
        "Toss with Caesar dressing and serve."
      ]
    },
    {
      name: "Vegetable Stir-Fry",
      description: "A healthy stir-fry with a variety of vegetables and soy sauce.",
      steps: [
        "Chop the vegetables (carrots, bell peppers, broccoli, etc.).",
        "Stir-fry vegetables in hot oil for 5-7 minutes.",
        "Add soy sauce and stir to coat the vegetables.",
        "Serve with rice or noodles."
      ]
    },
    {
      name: "Chocolate Cake",
      description: "A rich and moist chocolate cake with a simple frosting.",
      steps: [
        "Preheat the oven to 350°F (175°C).",
        "Mix flour, cocoa powder, baking soda, and sugar.",
        "Add eggs, milk, and melted butter, and mix until smooth.",
        "Pour the batter into a greased cake pan and bake for 30-35 minutes.",
        "Let the cake cool, then frost with your favorite chocolate frosting."
      ]
    }
  ];
  
  // Function to describe a specific recipe by matching with user input
  export const describeRecipe = (userInput) => {
    const recipeName = userInput.replace("describe the ", "").trim().toLowerCase(); // Normalize input
    const recipe = recipes.find(r => r.name.toLowerCase() === recipeName); // Exact match for recipe name
  
    if (!recipe) {
      return "Sorry, I couldn't find a recipe by that name. Can you try again with a different phrase?";
    }
  
    let description = `Here's the recipe for ${recipe.name}: ${recipe.description}\n\nSteps:\n`;
    recipe.steps.forEach((step, index) => {
      description += `${index + 1}. ${step}\n`;
    });
  
    return description;
  };
  
  // Modified rule-based voice bot response for recipe requests
  export const getVoiceBotResponse = (userInput) => {
    console.log("Processing user input:", userInput);
    userInput = userInput.toLowerCase();
  
    // Check if the user is greeting
    if (userInput.includes("hello") || userInput.includes("hi")) {
      return "Hello! I am Botty, how can I help you today?";
    } 
    // Check if the user asks for bot identity
    else if (userInput.includes("name") || userInput.includes("who are you")) {
      return "I’m an AI-powered Chatbot. Nice to meet you!";
    } 
    // Check if the user is saying goodbye
    else if (userInput.includes("bye") || userInput.includes("goodbye")) {
      return "Goodbye! Feel free to come back anytime.";
    } 
    // Check if the user is asking about the bot's capabilities
    else if (userInput.includes("what can") || userInput.includes("do")) {
      return "I can help you manage your recipes and assist you with cooking in real-time!";
    } 
    // Check if the user mentions "recipe" or "tell me a recipe"
    else if (userInput.includes("recipe") || userInput.includes("tell me a recipe")) {
      return `I have the following recipes: Spaghetti Carbonara, Chicken Curry, Caesar Salad, Vegetable Stir-Fry, Chocolate Cake. Which one would you like to hear about?`;
    } 
    // If the user asks for a recipe by name (without using 'describe the')
    else if (userInput.includes("like") || userInput.includes("interested in") || userInput.includes("craving")) {
      const match = recipes.find(recipe => userInput.includes(recipe.name.toLowerCase())); // Search for a recipe name in user input
      if (match) {
        return describeRecipe(`describe the ${match.name.toLowerCase()}`);
      } else {
        return "Sorry, I couldn't find a recipe that matches what you're looking for. Please try again!";
      }
    } 
    // Check for 'describe the' phrase and respond with the recipe description
    else if (userInput.includes("describe the")) {
      return describeRecipe(userInput); // Use describeRecipe for dynamic recipe description
    } 
    // Default response when the bot doesn't understand the input
    else {
      return "Sorry, I didn’t understand that. I’m still training to understand you better. Sorry for the inconvenience!";
    }
  };
  