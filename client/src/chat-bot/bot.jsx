import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import botImg from "../assets/images/bot.png";
import userImg from "../assets/images/user.png";

const ChatBot = () => {
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    const message = userMessage.trim();
    if (!message || message.length < 2) {
      appendMessage("bot", "Please type a valid message.");
      return;
    }

    appendMessage("user", message);
    setUserMessage("");
    setIsTyping(true);

    await getBotResponse(message);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const appendMessage = (sender, message) => {
    setMessages((prevMessages) => [...prevMessages, { sender, message }]);
  };

  const getBotResponse = async (userMessage) => {
    try {
      if (userMessage.toLowerCase().includes("who is dushan")) {
        appendMessage("bot", "He is the greatest coder alive.");
        return;
      }

      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from the server");
      }

      const data = await response.json();
      appendMessage("bot", data.message);
    } catch (error) {
      console.error("Error:", error);
      appendMessage("bot", "Sorry, there was an error. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex flex-col">
     
      <motion.div 
        initial={{ y: -50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 0.5 }}
        className="p-4 flex justify-between items-center bg-opacity-20 bg-black backdrop-blur-lg sticky top-0 z-10"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">AI RECIPE AGENT</h1>
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
              {msg.message}
            </div>
            {msg.sender === "user" && (
              <img src={userImg} className="w-10 h-10 rounded-full border-2 border-blue-400" alt="User" />
            )}
          </motion.div>
        ))}
        {isTyping && (
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

      {/* Input Area */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 0.5 }}
        className="p-4 bg-opacity-20 bg-black backdrop-blur-lg sticky bottom-0 z-10 flex items-center gap-4 w-full max-w-full"
      >
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-grow p-3 rounded-full bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 min-w-0"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={sendMessage}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 flex items-center justify-center shrink-0"
        >
          {isTyping ? (
            <div className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
          ) : (
            "Send"
          )}
        </button>
      </motion.div>
    </div>
  );
};

export default ChatBot;