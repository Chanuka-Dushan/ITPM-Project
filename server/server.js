// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import multer from "multer";
import mealPlanningRoute from "./routes/MealPlanning/MealPlanningDetails.js";
import MealPlanningDate from "./routes/MealPlanning/MealPlanningDate.js";
import recipeRoutes from "./routes/RecipeManagement/recipeRoutes.js"


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/mealplans', mealPlanningRoute);
app.use('/api/meals',MealPlanniengDate)
// Multer setup for audio uploads (not used here but kept for compatibility)
const upload = multer({ storage: multer.memoryStorage() });

// Gemini API Key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// Hardcoded recipes
const recipes = {
  "Spaghetti Bolognese": {
    description: "A classic Italian pasta dish with a rich, flavorful meat sauce.",
    steps: [
      "First, cook the spaghetti according to the package instructions.",
      "While that's cooking, heat up a pan and cook ground beef along with some onions and garlic.",
      "Next, add tomato sauce and let it simmer for about 15 to 20 minutes.",
      "Once everything's done, serve the sauce over the spaghetti and top it with some cheese."
    ]
  },
  "Chicken Curry": {
    description: "A spicy and savory chicken dish with a rich curry sauce.",
    steps: [
      "Start by cooking the chicken pieces until they’re nice and browned.",
      "Then, add onions, garlic, and curry spices, and cook them for about five minutes.",
      "Now, pour in the coconut milk and let it simmer until the chicken is tender.",
      "Serve it up with some rice or naan bread for a complete meal."
    ]
  },
  "Caesar Salad": {
    description: "A fresh salad with romaine lettuce, croutons, and Caesar dressing.",
    steps: [
      "Chop up some fresh romaine lettuce and toss it with croutons.",
      "Drizzle Caesar dressing over the top and toss everything together until it’s evenly coated.",
      "Finally, sprinkle some Parmesan cheese on top and serve it right away."
    ]
  },
  "Vegetable Stir Fry": {
    description: "A healthy stir fry with mixed vegetables in a savory sauce.",
    steps: [
      "Heat up some oil in a pan and stir fry your favorite mixed vegetables.",
      "After a few minutes, add soy sauce, garlic, and a little bit of ginger. Stir it all together and cook for another 5 minutes.",
      "Once everything’s nicely cooked, serve it up over rice or noodles."
    ]
  },
  "Chocolate Cake": {
    description: "A rich and moist chocolate cake topped with frosting.",
    steps: [
      "Preheat your oven and get your cake pan ready.",
      "Mix flour, cocoa powder, sugar, eggs, and butter together in a bowl.",
      "Pop the mixture into the oven and bake for about 30 to 35 minutes. Once done, let it cool.",
      "Finally, frost the cake with some chocolate icing, and you’re ready to serve!"
    ]
  }
};


// Simple rule-based dialogue management for voice chatbot
const getVoiceBotResponse = (userInput) => {
  console.log("Processing user input:", userInput);
  userInput = userInput.toLowerCase();

  if (userInput.includes("hi") || userInput.includes("Botty")) {
    return "Hello! I am Botty, I am here to Assist you?";
  } else if (userInput.includes("name") || userInput.includes("who are you")) {
    return "I’m an AI-powered Chatbot. Nice to meet you!";
  } else if (userInput.includes("bye") || userInput.includes("goodbye")) {
    return "Goodbye! Feel free to come back anytime.";
  } else if (userInput.includes("what can") || userInput.includes("what do you do")) {
    return "I can help you manage your recipes and assist you with cooking in real-time!";
  } else if(userInput.includes("thank you") || userInput.includes("thanks")) {
    return "You're welcome! Let me know if you need help with anything else.";
  }else if (userInput.includes("do you have recipes")) {
    return `I have 5 recipes: ${Object.keys(recipes).join(", ")}. Ask me to describe any of them!`;
  } else {
    // Check if the user is asking for a recipe description
    for (const recipeName in recipes) {
      if (userInput.includes(recipeName.toLowerCase())) {
        return `Here is how you make ${recipeName}:\n${recipes[recipeName].steps.join("\n")}`;
      }
    }

    return "I didn’t understand that. I’m still training to understand you better";
  }
};

// Voice Chat endpoint
app.post("/voice-chat", upload.single("audio"), async (req, res) => {
  const { message } = req.body;
  const audio = req.file; // Audio file from FormData (optional)

  console.log("Received /voice-chat request, message:", message, "audio:", !!audio);
  try {
    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    const botResponse = getVoiceBotResponse(message);
    const userId = audio ? `user_${Math.floor(Math.random() * 1000)}` : "unknown"; // Simulated userId
    res.json({ message: botResponse, userId });
  } catch (error) {
    console.error("Error in /voice-chat:", error);
    res.status(500).json({ error: "Failed to process voice chat request" });
  }
});

// Existing Chat endpoint (Gemini API)
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  console.log("Received /chat request, message:", message);
  try {
    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: message,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch response from Gemini API");
    }

    const data = await response.json();
    console.log("Gemini API Response:", data);

    if (
      data.candidates &&
      data.candidates.length > 0 &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts[0].text
    ) {
      const botMessage = data.candidates[0].content.parts[0].text;
      res.json({ message: botMessage });
    } else {
      throw new Error("No text found in candidates content parts");
    }
  } catch (error) {
    console.error("Error in /chat:", error);
    res.status(500).json({ error: "Failed to get response from Gemini API" });
  }
});


app.post("/chatwithbot", async (req, res) => {
  const { message, context } = req.body;

  console.log("Received /chat withbot request, message:", message, "context:", context);

  try {
    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    // Construct the prompt with context to guide the AI's response
    const fullPrompt = context
      ? `${context}\n\nUser question: ${message}`
      : message;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: fullPrompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch response from Gemini API");
    }

    const data = await response.json();
    console.log("Gemini API Response:", data);

    if (
      data.candidates &&
      data.candidates.length > 0 &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts[0].text
    ) {
      const botMessage = data.candidates[0].content.parts[0].text;
      res.json({ message: botMessage });
    } else {
      throw new Error("No text found in candidates content parts");
    }
  } catch (error) {
    console.error("Error in /chat:", error);
    res.status(500).json({ error: "Failed to get response from Gemini API" });
  }
});

// Database Connection
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

  
app.use("/api/recipes", recipeRoutes);


// Sample Route
app.get("/", (req, res) => {
  res.send("Server is running..., I will config MongoDB later");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
