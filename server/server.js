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

// Track recent transcripts to detect duplicates
const recentTranscripts = new Map();
const MAX_TRANSCRIPT_AGE = 1500;

// Fuzzy matching for wake word and stop command
const isWakeWord = (transcript) => {
  const lowerTranscript = transcript.toLowerCase();
  const wakeWords = ["botty", "boti", "body", "boty", "buddy", "bot", "but you", "badi", "but", "hello"];

  // Explicit checks for common wake words
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

  // Fuzzy matching for other cases
  for (const word of wakeWords) {
    const results = fuzzy.filter(word, [lowerTranscript], { extract: (str) => str });
    if (results.length > 0 && results[0].score > 60) {
      console.log("Server: Fuzzy matched wake word:", word, "Score:", results[0].score, "Transcript:", lowerTranscript);
      return true;
    }
  }
  console.log("Server: No wake word matched. Fuzzy scores:", wakeWords.map(word => ({
    word,
    score: fuzzy.filter(word, [lowerTranscript], { extract: (str) => str })[0]?.score || 0
  })));
  return false;
};

const isStopCommand = (transcript) => {
  const lowerTranscript = transcript.toLowerCase();
  const stopPatterns = [
    "stop botty",
    "stop boti",
    "botty stop",
    "boti stop",
    "stop speaking",
    "stop stop",
    "stop talking",
  ];
  for (const pattern of stopPatterns) {
    const results = fuzzy.filter(pattern, [lowerTranscript], { extract: (str) => str });
    if (results.length > 0 && results[0].score > 60) {
      console.log("Server: Fuzzy matched stop command:", pattern, "Score:", results[0].score);
      return true;
    }
  }
  return false;
};

// Validate-voice endpoint
app.post("/validate-voice", async (req, res) => {
  const { transcript, recipe } = req.body;
  if (!transcript) {
    console.log("Server: No transcript provided");
    return res.status(400).json({ error: "No transcript provided" });
  }

  const requestId = uuidv4();
  console.log(`Server: Received /validate-voice request [${requestId}], transcript:`, transcript, "recipe:", recipe);

  // Check for duplicate transcripts
  const now = Date.now();
  if (recentTranscripts.has(transcript)) {
    const timestamp = recentTranscripts.get(transcript);
    if (now - timestamp < MAX_TRANSCRIPT_AGE) {
      console.log(`Server: Ignoring duplicate transcript [${requestId}]:`, transcript, "age:", now - timestamp, "ms");
      return res.json({ action: "ignore" });
    }
  }
  recentTranscripts.set(transcript, now);
  setTimeout(() => recentTranscripts.delete(transcript), MAX_TRANSCRIPT_AGE);

  try {
    if (isStopCommand(transcript)) {
      console.log(`Server: Detected stop command [${requestId}]`);
      return res.json({
        action: "stop",
        message: "Stopped listening. Say 'Botty' or 'Buddy' to resume.",
      });
    }
    if (isWakeWord(transcript)) {
      console.log(`Server: Detected wake word [${requestId}]`);
      // Improved wake word removal to preserve full query
      const wakeWordRegex = /^(botty|boti|body|boty|buddy|bot|but you|badi|but|hello)\s*/i;
      const userMessage = transcript.replace(wakeWordRegex, "").trim();
      console.log(`Server: Extracted user message [${requestId}]:`, userMessage);
      if (userMessage) {
        console.log(`Server: Processing user message [${requestId}]:`, userMessage);
        const recipeContext = `This conversation is about the recipe: ${recipe}. Details: Answer recipe-related questions accurately. For unrelated questions, provide a brief answer and suggest asking about the recipe.`;
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
          audioUrl: botData.audioUrl || null,
        });
      }
      console.log(`Server: Wake word detected but no question provided [${requestId}]`);
      return res.json({
        action: "listen",
        message: "I'm listening! What's your question?",
      });
    }
    console.log(`Server: No wake word detected, ignoring transcript [${requestId}]. Try saying 'Botty' or 'Buddy' first.`);
    return res.json({ action: "ignore" });
  } catch (error) {
    console.error(`Server: Error in /validate-voice [${requestId}]:`, error.message);
    return res.status(500).json({ error: `Failed to process voice input: ${error.message}` });
  }
});

// Chat with Bot endpoint (recipe-specific responses)
app.post("/chatwithbot", async (req, res) => {
  const { message, context } = req.body;

  console.log("Server: Received /chatwithbot request, message:", message, "context:", context);

  try {
    if (!message) {
      console.log("Server: No message provided for /chatwithbot");
      return res.status(400).json({ error: "No message provided" });
    }

    // Humanized prompt
    const fullPrompt = context 
      ? `${context}\n\nUser question: ${message}\n\nInstructions: Respond in a friendly, conversational tone as if you're a helpful chef. Rephrase the user's question naturally without repeating it verbatim. Use phrases like 'Sounds like you're curious about...' or 'Let’s dive into...' to make it engaging. Avoid robotic or repetitive language. If the question is about the recipe, provide accurate details. If unrelated, give a brief answer and gently suggest asking about the recipe.`
      : `User question: ${message}\n\nInstructions: Respond in a friendly, conversational tone as if you're a helpful chef. Rephrase the user's question naturally without repeating it verbatim. Use phrases like 'Sounds like you're curious about...' or 'Let’s dive into...' to make it engaging. Avoid robotic or repetitive language.`;

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