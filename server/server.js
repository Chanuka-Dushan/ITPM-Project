// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import multer from "multer";
import MealPlanningDate from "./routes/MealPlanning/MealPlanningDate.js"
import MealPlanningDetails from "./routes/MealPlanning/MealPlanningDetails.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup for audio uploads (not used here but kept for compatibility)
const upload = multer({ storage: multer.memoryStorage() });

// Gemini API Key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// Simple rule-based dialogue management for voice chatbot
const getVoiceBotResponse = (userInput) => {
  console.log("Processing user input:", userInput);
  userInput = userInput.toLowerCase();
  if (userInput.includes("hello") || userInput.includes("hi")) {
    return "Hello! I am Botty, how can I help you today?";
  } else if (userInput.includes("name") || userInput.includes("who are you")) {
    return "I’m an AI-powered Chatbot. Nice to meet you!";
  } else if (userInput.includes("bye") || userInput.includes("goodbye")) {
    return "Goodbye! Feel free to come back anytime.";
  } else if (userInput.includes("what can") || userInput.includes("do")) {
    return "I can help you manage your recipes and assist you with cooking in real-time!";
  } else {
    return "Sorry, I didn’t understand that. I’m still training to understand you better. Sorry for the inconvenience!";
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

// Database Connection
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

  app.use("api/mealplanningdate",MealPlanningDate)
  app.use("api/mealplanningdetails",MealPlanningDetails)

// Sample Route
app.get("/", (req, res) => {
  res.send("Server is running..., I will config MongoDB later");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});