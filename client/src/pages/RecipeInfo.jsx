import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Clock, Users, ChevronLeft, Mic, Volume2, Square, Play } from "lucide-react";
import { motion } from "framer-motion";

// Mock images (replace with actual assets)
const botImg = "https://via.placeholder.com/32?text=Bot";
const userImg = "https://via.placeholder.com/32?text=User";

// Custom Button Component
function Button({ children, variant = "default", size = "default", className = "", ...props }) {
  const baseStyles = "inline-flex items-center justify-center rounded font-medium transition-colors";
  const variants = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-100",
    ghost: "bg-transparent hover:bg-gray-100",
    stop: "bg-red-500 text-white hover:bg-red-600",
    start: "bg-green-500 text-white hover:bg-green-600",
  };
  const sizes = {
    default: "px-4 py-2",
    sm: "px-3 py-1 text-sm",
    lg: "px-6 py-3",
    icon: "p-2",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// ChatBot Component
function ChatBot({ recipe, onClose }) {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userStopped, setUserStopped] = useState(true); // Start stopped
  const [currentStep, setCurrentStep] = useState(0);
  const recognitionRef = useRef(null);
  const lastTranscriptRef = useRef("");
  const utteranceQueueRef = useRef([]);
  const isSpeakingRef = useRef(false);
  const processingRef = useRef(false);
  const lastMessageRef = useRef({});
  const lastTranscriptTimeRef = useRef(0);
  const pendingTranscriptsRef = useRef([]);
  const recognitionStateRef = useRef("stopped");

  // Debounce function
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Process TTS queue using Web Speech API
  const speakNext = () => {
    if (isSpeakingRef.current || utteranceQueueRef.current.length === 0) return;
    isSpeakingRef.current = true;
    const utterance = utteranceQueueRef.current.shift();
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => {
      setIsPlaying(false);
      isSpeakingRef.current = false;
      speakNext();
    };
    utterance.onerror = (err) => {
      console.error("Client: TTS error:", err);
      setIsPlaying(false);
      isSpeakingRef.current = false;
      speakNext();
    };
    window.speechSynthesis.speak(utterance);
  };

  // Cancel all speech and recognition
  const cancelSpeech = () => {
    window.speechSynthesis.cancel();
    utteranceQueueRef.current = [];
    isSpeakingRef.current = false;
    setIsPlaying(false);
    stopRecording();
    setUserStopped(true);
    recognitionStateRef.current = "stopped";
    setIsRecording(false);
    console.log("Client: Cancelled all speech and recognition");
  };

  // Process pending transcripts
  const processPendingTranscripts = async () => {
    if (pendingTranscriptsRef.current.length === 0 || processingRef.current) return;
    const transcript = pendingTranscriptsRef.current.shift();
    console.log("Client: Processing pending transcript:", transcript);
    await handleTranscript(transcript);
    processPendingTranscripts();
  };

  // Initialize recognition
  const initializeRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    return recognition;
  };

  // Handle transcript processing
  const handleTranscript = async (transcript) => {
    const now = Date.now();
    if (transcript === lastTranscriptRef.current && now - lastTranscriptTimeRef.current < 800) {
      console.log("Client: Ignoring duplicate transcript:", transcript);
      return;
    }
    lastTranscriptRef.current = transcript;
    lastTranscriptTimeRef.current = now;
    processingRef.current = true;
    console.log("Client: Sending transcript:", transcript);
    setIsTyping(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch("http://localhost:5000/validate-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, recipeId: recipe.id, currentStep }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const data = await response.json();
      console.log("Client: Received response:", data);
      if (data.error) {
        appendMessage("bot", `Error: ${data.error}`);
      } else if (data.action === "stop") {
        cancelSpeech();
        appendMessage("bot", data.message);
      } else if (data.action === "respond") {
        appendMessage("user", data.userMessage);
        appendMessage("bot", data.message);
        setCurrentStep(data.nextStep || currentStep);
      } else if (data.action === "listen") {
        appendMessage("bot", data.message);
      } else if (data.action === "ignore") {
        // Silent ignore
      }
    } catch (error) {
      console.error("Client: Error validating voice:", error.message);
      appendMessage("bot", "Oops, try saying 'Botty' or 'Buddy' again!");
    } finally {
      setIsTyping(false);
      processingRef.current = false;
      lastTranscriptRef.current = "";
      lastTranscriptTimeRef.current = 0;
      if (!userStopped && recognitionStateRef.current !== "started") {
        console.log("Client: Restarting recognition after transcript processing");
        stopRecording();
        recognitionStateRef.current = "stopped";
        setTimeout(() => startRecording(), 200);
      }
    }
  };

  // Initialize Web Speech API
  useEffect(() => {
    recognitionRef.current = initializeRecognition();
    if (recognitionRef.current) {
      const handleResult = debounce(async (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("Client: Transcript:", transcript);

        if (isSpeakingRef.current && transcript.toLowerCase().includes("stop")) {
          console.log("Client: Detected stop command during speech:", transcript);
          cancelSpeech();
          pendingTranscriptsRef.current.push(transcript);
          processPendingTranscripts();
          return;
        }

        if (isSpeakingRef.current) {
          console.log("Client: Buffering transcript during speech:", transcript);
          pendingTranscriptsRef.current.push(transcript);
          processPendingTranscripts();
        } else {
          await handleTranscript(transcript);
        }
      }, 1000);

      recognitionRef.current.onresult = handleResult;

      recognitionRef.current.onerror = (event) => {
        console.error("Client: Speech recognition error:", event.error);
        appendMessage("bot", "I missed that! Say 'Botty' or 'Buddy' again.");
        processingRef.current = false;
        if (!userStopped) {
          console.log("Client: Restarting after error");
          stopRecording();
          recognitionStateRef.current = "stopped";
          setTimeout(() => startRecording(), 200);
        }
      };

      recognitionRef.current.onend = () => {
        console.log("Client: Speech recognition ended, isRecording:", isRecording, "userStopped:", userStopped);
        if (!userStopped) {
          recognitionStateRef.current = "stopped";
          setIsRecording(false);
          console.log("Client: Restarting speech recognition");
          setTimeout(() => startRecording(), 200);
        } else {
          recognitionStateRef.current = "stopped";
          setIsRecording(false);
        }
      };

      let watchdogTimeout;
      const startWatchdog = () => {
        clearTimeout(watchdogTimeout);
        watchdogTimeout = setTimeout(() => {
          if (isRecording && !userStopped) {
            console.log("Client: Watchdog triggered, restarting recognition");
            stopRecording();
            recognitionStateRef.current = "stopped";
            setTimeout(() => startRecording(), 200);
          }
        }, 3000);
      };

      recognitionRef.current.onspeechstart = startWatchdog;
      recognitionRef.current.onspeechend = startWatchdog;
    } else {
      appendMessage("bot", "Speech recognition not supported in your browser.");
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      cancelSpeech();
    };
  }, []);

  const startRecording = () => {
    if (recognitionRef.current && recognitionStateRef.current === "stopped") {
      try {
        recognitionRef.current.start();
        recognitionStateRef.current = "started";
        setIsRecording(true);
        setUserStopped(false);
        console.log("Client: Started recording");
        appendMessage("bot", "I'm listening! Say 'Botty' or 'Buddy' to start cooking with me.");
      } catch (error) {
        console.error("Client: Error starting speech recognition:", error);
        appendMessage("bot", "Failed to start listening. Try again.");
        setTimeout(() => startRecording(), 500);
      }
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      recognitionStateRef.current = "stopping";
      setIsRecording(false);
      console.log("Client: Stopped recording");
    }
  };

  const appendMessage = (sender, message) => {
    const messageKey = `${sender}:${message}`;
    if (lastMessageRef.current[messageKey]) {
      console.log("Client: Ignoring duplicate message:", messageKey);
      return;
    }
    lastMessageRef.current[messageKey] = true;
    setTimeout(() => delete lastMessageRef.current[messageKey], 60000);

    setMessages((prevMessages) => [...prevMessages, { sender, message }]);
    if (sender === "bot" && message) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = "en-US";
      utteranceQueueRef.current.push(utterance);
      speakNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 w-full max-w-lg h-[80vh] rounded-lg shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 flex justify-between items-center bg-opacity-20 bg-black backdrop-blur-lg sticky top-0 z-10">
          <h1 className="text-xl font-bold text-white tracking-wide">Chef Botty - {recipe.title}</h1>
          <button
            onClick={onClose}
            className="text-white hover:text-red-400 transition-all duration-200 transform hover:scale-110"
          >
            ✕
          </button>
        </div>
        <div className="p-4 text-white">
          <p>Current Step: {currentStep === 0 ? "Not started" : `Step ${currentStep}`}</p>
        </div>
        <div className="flex-grow overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-white text-center">
              Click Start to begin cooking {recipe.title} with Chef Botty!
            </div>
          )}
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "bot" && (
                <img src={botImg} className="w-8 h-8 rounded-full border-2 border-purple-400" alt="Chef Botty" />
              )}
              <div
                className={`max-w-xs p-3 rounded-xl shadow-lg text-white ${
                  msg.sender === "user" ? "bg-blue-600 bg-opacity-90" : "bg-purple-700 bg-opacity-90"
                }`}
              >
                {msg.message}
              </div>
              {msg.sender === "user" && (
                <img src={userImg} className="w-8 h-8 rounded-full border-2 border-blue-400" alt="User" />
              )}
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <img src={botImg} className="w-8 h-8 rounded-full border-2 border-purple-400" alt="Chef Botty" />
              <div className="bg-purple-700 bg-opacity-90 p-3 rounded-xl shadow-lg text-white flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
              </div>
            </motion.div>
          )}
        </div>
        <div className="p-4 bg-opacity-20 bg-black backdrop-blur-lg sticky bottom-0 z-10 flex items-center gap-4">
          <Button
            variant="start"
            size="lg"
            onClick={startRecording}
            disabled={isRecording}
            className={isRecording ? "opacity-50 cursor-not-allowed" : ""}
          >
            <Play className="h-5 w-5 mr-2" />
            Start
          </Button>
          <Button
            variant="stop"
            size="lg"
            onClick={cancelSpeech}
            disabled={!isRecording}
            className={!isRecording ? "opacity-50 cursor-not-allowed" : ""}
          >
            <Square className="h-5 w-5 mr-2" />
            Stop
          </Button>
          {isRecording && (
            <Mic className={`h-5 w-5 text-white ${isRecording ? "animate-pulse" : ""}`} />
          )}
          {isPlaying && <Volume2 className="h-5 w-5 text-white animate-pulse" />}
        </div>
      </motion.div>
    </motion.div>
  );
}

// RecipeInfo Component
function RecipeInfo() {
  const { id } = useParams();
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Mock recipe data (same as provided)
  const recipes = [
    {
      id: "1",
      title: "Creamy Garlic Parmesan Pasta",
      image: "https://themewagon.github.io/delicious/img/bg-img/r2.jpg",
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
      image: "https://themewagon.github.io/delicious/img/bg-img/r2.jpg",
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
      image: "https://themewagon.github.io/delicious/img/bg-img/r2.jpg",
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
      image: "https://themewagon.github.io/delicious/img/bg-img/r2.jpg",
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
      image: "https://themewagon.github.io/delicious/img/bg-img/r2.jpg",
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
      image: "https://themewagon.github.io/delicious/img/bg-img/r2.jpg",
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
      image: "https://themewagon.github.io/delicious/img/bg-img/r2.jpg",
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
      image: "https://themewagon.github.io/delicious/img/bg-img/r2.jpg",
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
      image: "https://themewagon.github.io/delicious/img/bg-img/r2.jpg",
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
      image: "https://themewagon.github.io/delicious/img/bg-img/r2.jpg",
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
      image: "https://themewagon.github.io/delicious/img/bg-img/r2.jpg",
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
      image: "https://themewagon.github.io/delicious/img/bg-img/r2.jpg",
      time: "30 min",
      servings: 6,
      category: "Lunch",
      author: "Chef Carlos",
      description: "Spicy beef tacos with fresh toppings.",
      ingredients: ["Beef", "Tortillas", "Salsa"],
      instructions: ["Cook beef.", "Warm tortillas.", "Assemble tacos."],
    },
  ];

  const recipe = recipes.find((r) => r.id === id);

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <h1 className="text-2xl font-bold">Recipe not found</h1>
      </div>
    );
  }

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center text-blue-500 hover:text-blue-600 mb-6">
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Home
        </Link>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img src={recipe.image} alt={recipe.title} className="w-full h-96 object-cover" />
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
            <p className="text-gray-600 mb-4">by {recipe.author}</p>
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center text-gray-500">
                <Clock className="h-5 w-5 mr-1" />
                {recipe.time}
              </div>
              <div className="flex items-center text-gray-500">
                <Users className="h-5 w-5 mr-1" />
                {recipe.servings} servings
              </div>
              <div className="text-blue-500 font-medium">{recipe.category}</div>
            </div>
            <Button onClick={handleOpenChat} className="mb-6">
              Talk to Chef Botty
            </Button>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{recipe.description}</p>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
              <ul className="list-disc list-inside text-gray-700">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Instructions</h2>
              <ol className="list-decimal list-inside text-gray-700">
                {recipe.instructions.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
      {isChatOpen && <ChatBot recipe={recipe} onClose={handleCloseChat} />}
    </div>
  );
}

export default RecipeInfo;