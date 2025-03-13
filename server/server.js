import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());

// Gemini API Key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + GEMINI_API_KEY;

// Chat endpoint
app.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    // Ensure message exists
    if (!message) {
      return res.status(400).json({ error: 'No message provided' });
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: message
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch response from Gemini API');
    }

    const data = await response.json();

    // Log the entire response to understand the structure
    console.log('Gemini API Response:', data);

    // Check if the response contains candidates and extract the content
    if (data.candidates && data.candidates.length > 0) {
      // Log candidates to ensure we know the correct structure
      console.log('Candidates:', data.candidates);

      // Access the text from the parts array inside the content
      if (data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
        const botMessage = data.candidates[0].content.parts[0].text;
        res.json({ message: botMessage });
      } else {
        throw new Error('No text found in candidates content parts');
      }
    } else {
      throw new Error('No valid response from Gemini API');
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Failed to get response from Gemini API' });
  }
});

// Database Connection
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Sample Route
app.get("/", (req, res) => {
  res.send("Server is running...,I will config mongodb later");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
