// Talkbot.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import botImg from "../assets/images/bot.png";
import userImg from "../assets/images/user.png";

const Talkbot = () => {
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState("Status: Idle");
  const [isStarted, setIsStarted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  const addMessage = (text, sender) => {
    console.log(`Adding message: ${text} from ${sender}`);
    setMessages((prev) => [...prev, { text, sender }]);
  };

  const speak = (text) => {
    console.log("Speaking:", text);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    // Stop recognition and set speaking state synchronously
    if (isListening) {
      console.log("Pausing recognition before speaking...");
      recognition.stop();
      // Wait briefly to ensure stop takes effect
      setTimeout(() => {
        setIsSpeaking(true);
      }, 100);
    } else {
      setIsSpeaking(true);
    }

    utterance.onstart = () => {
      console.log("Speech synthesis started.");
    };

    utterance.onend = () => {
      console.log("Speech finished.");
      setIsSpeaking(false);
      if (isListening) {
        setTimeout(() => {
          console.log("Resuming recognition after delay...");
          try {
            recognition.start();
          } catch (error) {
            console.error("Restart Error after speaking:", error);
          }
        }, 1500); // 1.5-second delay to avoid echo
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const getBotResponse = async (userInput) => {
    console.log("Fetching bot response for:", userInput);
    try {
      const response = await fetch("http://localhost:5000/voice-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch response from server: ${response.status}`);
      }

      const data = await response.json();
      console.log("Backend Response:", data);
      const botResponse = data.message;
      addMessage(botResponse, "bot");
      speak(botResponse);
    } catch (error) {
      console.error("Fetch Error:", error);
      addMessage("Sorry, there was an error. Please try again.", "bot");
    }
  };

  useEffect(() => {
    console.log("useEffect triggered, isStarted:", isStarted, "isListening:", isListening, "isSpeaking:", isSpeaking);
    if (!isStarted) return;

    recognition.onstart = () => {
      console.log("Speech recognition started.");
    };

    recognition.onresult = (event) => {
      console.log("Speech recognition result received.");
      const userInput = event.results[event.results.length - 1][0].transcript;
      console.log("Recognized Input:", userInput);
      addMessage(userInput, "user");
      setStatus("Status: Processing...");
      getBotResponse(userInput);
      setStatus("Status: Listening...");
    };

    recognition.onerror = (event) => {
      console.error("Recognition Error:", event.error);
      setStatus(`Error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log("Recognition Ended, isListening:", isListening, "isSpeaking:", isSpeaking);
      if (isListening && !isSpeaking) {
        console.log("Restarting recognition...");
        try {
          recognition.start();
        } catch (error) {
          console.error("Restart Error:", error);
        }
      } else if (isSpeaking) {
        console.log("Not restarting recognition because bot is speaking.");
      }
    };

    return () => {
      console.log("Cleaning up recognition...");
      recognition.stop();
    };
  }, [isListening, isStarted, isSpeaking]);

  const toggleListening = () => {
    if (isListening) {
      console.log("Stopping recognition...");
      recognition.stop();
      setStatus("Status: Idle");
      setIsListening(false);
    } else {
      console.log("Starting recognition...");
      try {
        recognition.start();
        setStatus("Status: Listening...");
        setIsListening(true);
      } catch (error) {
        console.error("Start Error:", error);
        setStatus("Error: Failed to start recognition");
      }
    }
  };

  const handleStart = () => {
    console.log("Start button clicked.");
    setIsStarted(true);
    toggleListening();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex flex-col">
      {!isStarted ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen w-full flex items-center justify-center backdrop-blur-md bg-opacity-50 bg-black"
        >
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={handleStart}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full text-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Start
          </motion.button>
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-4 flex justify-between items-center bg-opacity-20 bg-black backdrop-blur-lg sticky top-0 z-10"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">Voice Chatbot</h1>
            <button
              onClick={() => setMessages([])}
              className="text-white hover:text-red-400 transition-all duration-200 transform hover:scale-110"
            >
              ✕ Clear
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex-grow overflow-y-auto p-6 space-y-4"
          >
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-start gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <img src={botImg} className="w-10 h-10 rounded-full border-2 border-purple-400" alt="Bot" />
                )}
                <div
                  className={`max-w-xs md:max-w-md p-4 rounded-xl shadow-lg text-white ${
                    msg.sender === "user"
                      ? "bg-blue-600 bg-opacity-90"
                      : "bg-purple-700 bg-opacity-90"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === "user" && (
                  <img src={userImg} className="w-10 h-10 rounded-full border-2 border-blue-400" alt="User" />
                )}
              </motion.div>
            ))}
            {isListening && status === "Status: Processing..." && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3"
              >
                <img src={botImg} className="w-10 h-10 rounded-full border-2 border-purple-400" alt="Bot" />
                <div className="bg-purple-700 bg-opacity-90 p-4 rounded-xl shadow-lg text-white flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
                </div>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-4 bg-opacity-20 bg-black backdrop-blur-lg sticky bottom-0 z-10 flex items-center justify-center gap-4 w-full"
          >
            <button
              onClick={toggleListening}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
            >
              {isListening ? (
                <div className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
              ) : (
                "Start Listening"
              )}
            </button>
            <p className="text-sm text-gray-300">{status}</p>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Talkbot;