import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatBot from "./chat-bot/bot";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div>Home page here</div>} />
        <Route path="/chatbot" element={<ChatBot/>} />
      </Routes>
    </Router>
  );
};

export default App;
