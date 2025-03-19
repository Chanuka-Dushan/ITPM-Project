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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-6">
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="text-center text-3xl font-semibold text-gray-800 mb-6">ChatBot</div>
        <div className="border rounded-lg bg-white p-4 shadow-lg flex flex-col h-[400px]">
          <div className="flex justify-between items-center bg-blue-600 text-white p-4 rounded-t-lg">
            <span className="font-semibold text-lg">ChatBot</span>
            <button className="rounded-full bg-white p-2 text-gray-700 transition-all duration-200 hover:bg-red-200 hover:scale-110" onClick={() => setMessages([])}>❌</button>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="flex flex-col flex-grow overflow-y-auto p-4 bg-gray-100 rounded-b-lg shadow-inner">
            <div className="flex flex-col space-y-2 text-gray-800">
              {messages.map((msg, index) => (
                <div key={index} className={`flex items-center gap-2 mb-4 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.sender === "bot" && <img src={botImg} className='w-8 h-8 rounded-full' alt='Bot' />}
                  <div className={`p-3 rounded-lg max-w-xs shadow-md ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-600 text-white"}`}>
                    {msg.message}
                  </div>
                  {msg.sender === "user" && <img src={userImg} className='w-8 h-8 rounded-full' alt='User' />}
                </div>
              ))}
            </div>
          </motion.div>
          <div className="mt-3 flex gap-2">
            <input type="text" placeholder="Type a message..." className="flex-1 p-3 rounded-lg border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" value={userMessage} onChange={(e) => setUserMessage(e.target.value)} onKeyPress={handleKeyPress} />
            <button className="rounded-lg bg-blue-500 px-6 py-3 text-white transition-all duration-200 hover:bg-blue-600 hover:scale-105" onClick={sendMessage}>
              {isTyping ? <div className="animate-spin w-6 h-6 border-4 border-t-transparent border-blue-500 rounded-full"></div> : "Send"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatBot;
