import React, { useEffect } from "react";
import { motion } from "framer-motion";

const ChatBot = () => {
  useEffect(() => {
    // Get elements
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotContainer = document.getElementById('chatbot-container');

    const handleChatbotClose = () => {
      // Close chatbot (hide the container)
      chatbotContainer.style.display = 'none';
    };

    // Event listener for send button and Enter key
    const sendMessage = () => {
      const userMessage = chatbotInput.value.trim();
      if (userMessage) {
        appendMessage("user", userMessage);
        chatbotInput.value = "";
        getBotResponse(userMessage);
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    };

    const appendMessage = (sender, message) => {
      const messageElement = document.createElement("div");
      messageElement.classList.add("message", sender);
      messageElement.textContent = message;
      chatbotMessages.appendChild(messageElement);
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Auto-scroll to the bottom
    };

    // Updated getBotResponse to call the backend API
    const getBotResponse = async (userMessage) => {
      try {
        // Special check for "who is duhsn"
        if (userMessage.toLowerCase().includes("who is dushan")) {
          appendMessage("bot", "He is the greatest coder alive.");
          return;
        }

        const response = await fetch('http://localhost:5000/chat', { // Backend URL
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: userMessage }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch response from the server');
        }

        const data = await response.json();
        const botMessage = data.message;
        appendMessage("bot", botMessage);
      } catch (error) {
        console.error("Error:", error);
        appendMessage("bot", "Sorry, there was an error. Please try again.");
      }
    };

    // Event Listeners
    chatbotSend.addEventListener("click", sendMessage);
    chatbotInput.addEventListener("keypress", handleKeyPress);
    chatbotClose.addEventListener("click", handleChatbotClose);

    // Cleanup the event listeners
    return () => {
      chatbotSend.removeEventListener("click", sendMessage);
      chatbotInput.removeEventListener("keypress", handleKeyPress);
      chatbotClose.removeEventListener("click", handleChatbotClose);
    };
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-200 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-lg bg-white p-4 shadow-lg"
      >
        <div className="text-center text-2xl font-semibold text-gray-800 mb-4">
          ChatBot Page
        </div>

        {/* Chatbot Container */}
        <div id="chatbot-container" className="border rounded-lg bg-gray-100 p-4">
          {/* Chatbot Header */}
          <div
            id="chatbot-header"
            className="flex justify-between items-center bg-blue-600 text-white p-3 rounded-t-lg"
          >
            <span className="font-semibold text-lg">ChatBot</span>
            <button
              id="chatbot-close"
              className="rounded-full bg-white p-2 text-white transition-transform duration-200 hover:bg-red-100 hover:scale-110"
            >
              ❌
            </button>
          </div>

          {/* Chatbot Messages */}
          <motion.div
            id="chatbot-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="h-48 overflow-y-auto p-3 bg-white rounded-b-lg shadow-inner"
          >
            <div id="chatbot-messages" className="text-gray-700 flex flex-col space-y-4">
              {/* Messages will appear here */}
            </div>
          </motion.div>

          {/* Chatbot Input */}
          <div id="chatbot-inputs" className="mt-3 flex gap-2">
            <input
              type="text"
              id="chatbot-input"
              placeholder="Type a message..."
              className="flex-1 text-sm rounded-lg border p-2 focus:border-blue-400 focus:ring focus:ring-blue-300 outline-none"
            />
            <button
              id="chatbot-send"
              className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-transform duration-200 hover:bg-blue-600 hover:scale-105"
            >
              Send
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatBot;
