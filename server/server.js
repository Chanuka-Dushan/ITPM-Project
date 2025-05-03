import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import fuzzy from "fuzzy";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup for audio uploads (not used but kept for compatibility)
const upload = multer({ storage: multer.memoryStorage() });

// Gemini API Key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// Mock recipe data
const recipes = [
  {
    id: "1",
    title: "Creamy Garlic Parmesan Pasta",
    time: "30 min",
    servings: 4,
    category: "Dinner",
    author: "Chef Maria",
    description: "A rich and creamy pasta dish with garlic and parmesan.",
    ingredients: ["Pasta", "Garlic", "Parmesan Cheese", "Cream"],
    instructions: ["Cook pasta.", "Sauté garlic.", "Add cream and cheese.", "Toss with pasta."],
  },
  {
    id: "2",
    title: "Avocado & Egg Breakfast Toast",
    time: "15 min",
    servings: 2,
    category: "Breakfast",
    author: "Chef John",
    description: "Healthy and quick avocado toast topped with eggs.",
    ingredients: ["Bread", "Avocado", "Eggs"],
    instructions: ["Toast bread.", "Mash avocado and spread.", "Fry eggs and place on top."],
  },
  {
    id: "3",
    title: "Chocolate Chip Cookies",
    time: "45 min",
    servings: 24,
    category: "Desserts",
    author: "Chef Lisa",
    description: "Classic chewy chocolate chip cookies.",
    ingredients: ["Flour", "Butter", "Sugar", "Chocolate Chips"],
    instructions: ["Mix ingredients.", "Scoop dough.", "Bake until golden."],
  },
  {
    id: "4",
    title: "Mediterranean Quinoa Salad",
    time: "20 min",
    servings: 4,
    category: "Vegetarian",
    author: "Chef Alex",
    description: "A fresh and vibrant quinoa salad.",
    ingredients: ["Quinoa", "Cucumber", "Tomato", "Feta"],
    instructions: ["Cook quinoa.", "Chop vegetables.", "Mix with dressing."],
  },
  {
    id: "5",
    title: "Spicy Thai Noodle Soup",
    time: "35 min",
    servings: 6,
    category: "Dinner",
    author: "Chef Kim",
    description: "A flavorful and spicy noodle soup.",
    ingredients: ["Noodles", "Coconut Milk", "Chili", "Vegetables"],
    instructions: ["Cook noodles.", "Simmer broth.", "Add vegetables and noodles."],
  },
  {
    id: "6",
    title: "Classic Beef Burger",
    time: "25 min",
    servings: 4,
    category: "Lunch",
    author: "Chef Mike",
    description: "Juicy beef burgers with all the fixings.",
    ingredients: ["Beef", "Buns", "Lettuce", "Tomato"],
    instructions: ["Form patties.", "Grill burgers.", "Assemble with toppings."],
  },
  {
    id: "7",
    title: "Homemade Pizza",
    time: "60 min",
    servings: 8,
    category: "Dinner",
    author: "Chef Tony",
    description: "Delicious homemade pizza with your favorite toppings.",
    ingredients: ["Dough", "Sauce", "Cheese", "Toppings"],
    instructions: ["Make dough.", "Spread sauce.", "Add toppings and bake."],
  },
  {
    id: "8",
    title: "Banana Bread",
    time: "70 min",
    servings: 10,
    category: "Desserts",
    author: "Chef Sarah",
    description: "Moist and flavorful banana bread.",
    ingredients: ["Bananas", "Flour", "Sugar", "Butter"],
    instructions: ["Mash bananas.", "Mix ingredients.", "Bake until done."],
  },
  {
    id: "9",
    title: "Greek Salad",
    time: "15 min",
    servings: 4,
    category: "Vegetarian",
    author: "Chef Nick",
    description: "A refreshing Greek salad with feta.",
    ingredients: ["Cucumber", "Tomato", "Feta", "Olives"],
    instructions: ["Chop ingredients.", "Toss with dressing."],
  },
  {
    id: "10",
    title: "Chicken Stir Fry",
    time: "25 min",
    servings: 4,
    category: "Quick Meals",
    author: "Chef Lily",
    description: "Quick and tasty chicken stir fry.",
    ingredients: ["Chicken", "Vegetables", "Soy Sauce"],
    instructions: ["Cook chicken.", "Stir-fry vegetables.", "Add sauce."],
  },
  {
    id: "11",
    title: "Blueberry Pancakes",
    time: "20 min",
    servings: 4,
    category: "Breakfast",
    author: "Chef Emma",
    description: "Fluffy pancakes with fresh blueberries.",
    ingredients: ["Flour", "Milk", "Blueberries"],
    instructions: ["Mix batter.", "Add blueberries.", "Cook on griddle."],
  },
  {
    id: "12",
    title: "Beef Tacos",
    time: "30 min",
    servings: 6,
    category: "Lunch",
    author: "Chef Carlos",
    description: "Spicy beef tacos with fresh toppings.",
    ingredients: ["Beef", "Tortillas", "Salsa"],
    instructions: ["Cook beef.", "Warm tortillas.", "Assemble tacos."],
  },
];

// Track recent transcripts to detect duplicates
const recentTranscripts = new Map();
const MAX_TRANSCRIPT_AGE = 1500;

// Fuzzy matching for wake word
const isWakeWord = (transcript) => {
  const lowerTranscript = transcript.toLowerCase();
  const wakeWords = ["botty", "boti", "body", "boty", "buddy", "bot", "but you", "badi", "but", "hello"];

  if (
    lowerTranscript.startsWith("buddy ") ||
    lowerTranscript.startsWith("but you ") ||
    lowerTranscript.startsWith("botty ") ||
    lowerTranscript.startsWith("boty ") ||
    lowerTranscript.startsWith("boti ") ||
    lowerTranscript.startsWith("body ") ||
    lowerTranscript.startsWith("bot ") ||
    lowerTranscript.startsWith("badi ") ||
    lowerTranscript.startsWith("but ") ||
    lowerTranscript.startsWith("hello ")
  ) {
    console.log("Server: Explicitly matched wake word:", lowerTranscript.split(" ")[0]);
    return true;
  }

  for (const word of wakeWords) {
    const results = fuzzy.filter(word, [lowerTranscript], { extract: (str) => str });
    if (results.length > 0 && results[0].score > 60) {
      console.log("Server: Fuzzy matched wake word:", word, "Score:", results[0].score);
      return true;
    }
  }
  return false;
};

// Validate-voice endpoint
app.post("/validate-voice", async (req, res) => {
  const { transcript, recipeId } = req.body;
  if (!transcript || !recipeId) {
    console.log("Server: Missing transcript or recipeId");
    return res.status(400).json({ error: "Missing transcript or recipeId" });
  }

  const requestId = uuidv4();
  console.log(`Server: Received /validate-voice request [${requestId}], transcript:`, transcript, "recipeId:", recipeId);

  // Find recipe
  const recipe = recipes.find((r) => r.id === recipeId);
  if (!recipe) {
    console.log(`Server: Recipe not found for ID [${requestId}]:`, recipeId);
    return res.status(404).json({ error: "Recipe not found" });
  }

  // Check for duplicate transcripts
  const now = Date.now();
  if (recentTranscripts.has(transcript)) {
    const timestamp = recentTranscripts.get(transcript);
    if (now - timestamp < MAX_TRANSCRIPT_AGE) {
      console.log(`Server: Ignoring duplicate transcript [${requestId}]:`, transcript);
      return res.json({ action: "ignore" });
    }
  }
  recentTranscripts.set(transcript, now);
  setTimeout(() => recentTranscripts.delete(transcript), MAX_TRANSCRIPT_AGE);

  try {
    if (isWakeWord(transcript)) {
      console.log(`Server: Detected wake word [${requestId}]`);
      const wakeWordRegex = /^(botty|boti|body|boty|buddy|bot|but you|badi|but|hello)\s*/i;
      const userMessage = transcript.replace(wakeWordRegex, "").trim();
      console.log(`Server: Extracted user message [${requestId}]:`, userMessage);
      if (userMessage) {
        console.log(`Server: Processing user message [${requestId}]:`, userMessage);
        const recipeContext = `Recipe: ${recipe.title}\nIngredients: ${recipe.ingredients.join(", ")}\nInstructions:\n${recipe.instructions.map((step, index) => `${index + 1}. ${step}`).join("\n")}\n\nAnswer the user's question accurately based on the recipe. If the user asks for a specific step (e.g., "first step," "second step"), provide only that step's instruction. For summary requests (e.g., "tell me briefly how to cook this"), give a concise overview of the cooking process. For general or unrelated questions, provide a brief answer and suggest asking about the recipe.`;
        const botResponse = await fetch("http://localhost:5000/chatwithbot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMessage,
            context: recipeContext,
          }),
        });
        if (!botResponse.ok) {
          console.error(`Server: Failed to fetch from /chatwithbot [${requestId}], status:`, botResponse.status);
          throw new Error(`Failed to fetch from /chatwithbot: ${botResponse.status}`);
        }
        const botData = await botResponse.json();
        console.log(`Server: /chatwithbot response [${requestId}]:`, botData);
        if (botData.error) {
          throw new Error(botData.error);
        }
        return res.json({
          action: "respond",
          userMessage,
          message: botData.message || "Sorry, I couldn't generate a response.",
        });
      }
      console.log(`Server: Wake word detected but no question provided [${requestId}]`);
      return res.json({
        action: "listen",
        message: "I'm here! What's your question about the recipe?",
      });
    }
    console.log(`Server: No wake word detected, ignoring transcript [${requestId}]. Try saying 'Botty' or 'Buddy' first.`);
    return res.json({ action: "ignore" });
  } catch (error) {
    console.error(`Server: Error in /validate-voice [${requestId}]:`, error.message);
    return res.status(500).json({ error: `Failed to process voice input: ${error.message}` });
  }
});

// Chat with Bot endpoint
app.post("/chatwithbot", async (req, res) => {
  const { message, context } = req.body;

  console.log("Server: Received /chatwithbot request, message:", message, "context:", context);

  try {
    if (!message) {
      console.log("Server: No message provided for /chatwithbot");
      return res.status(400).json({ error: "No message provided" });
    }

    // Detect summary request
    const isSummaryRequest = message.toLowerCase().includes("briefly") || message.toLowerCase().includes("summary");

    // Extract step number from query (e.g., "first step", "second step")
    const stepMatch = message.toLowerCase().match(/(first|second|third|fourth|fifth|\d+(st|nd|rd|th))\s*step/i);
    let stepNumber = null;
    if (stepMatch) {
      const stepText = stepMatch[1];
      if (stepText === "first") stepNumber = 1;
      else if (stepText === "second") stepNumber = 2;
      else if (stepText === "third") stepNumber = 3;
      else if (stepText === "fourth") stepNumber = 4;
      else if (stepText === "fifth") stepNumber = 5;
      else {
        stepNumber = parseInt(stepText);
      }
    }

    // Humanized prompt
    const fullPrompt = stepNumber
      ? `${context}\n\nUser question: ${message}\n\nInstructions: The user is asking for step ${stepNumber} of the recipe. Provide only the instruction for that specific step in a friendly, conversational tone (e.g., "For step ${stepNumber}, you'll want to..."). If the step number is invalid, politely inform the user and suggest valid steps.`
      : isSummaryRequest
      ? `${context}\n\nUser question: ${message}\n\nInstructions: Provide a concise summary of the entire cooking process for the recipe in a friendly, conversational tone. Use phrases like 'Here’s a quick rundown...' or 'Let’s go over the basics...' to make it engaging. List the key steps clearly without unnecessary details.`
      : `${context}\n\nUser question: ${message}\n\nInstructions: Respond in a friendly, conversational tone as if you're a helpful chef. Rephrase the user's question naturally (e.g., 'Sounds like you're asking about...'). Provide accurate guidance based on the recipe's instructions or ingredients. For unrelated questions, give a brief answer and suggest asking about the recipe.`;

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
      console.error("Server: Failed to fetch from Gemini API, status:", response.status);
      throw new Error("Failed to fetch response from Gemini API");
    }

    const data = await response.json();
    console.log("Server: Gemini API Response:", data);

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
      console.error("Server: No text found in Gemini API response");
      throw new Error("No text found in candidates content parts");
    }
  } catch (error) {
    console.error("Server: Error in /chatwithbot:", error);
    res.status(500).json({ error: "Failed to get response from Gemini API" });
  }
});

// Database Connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Sample Route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server: Running on port ${PORT}`);
});