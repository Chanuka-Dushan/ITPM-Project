import React, { useState } from "react";
import { Search, ChevronRight, Clock, Users, Mic } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import botImg from "../assets/images/bot.png";
import userImg from "../assets/images/user.png";

// Custom Button Component
function Button({ children, variant = "default", size = "default", className = "", ...props }) {
  const baseStyles = "inline-flex items-center justify-center rounded font-medium transition-colors";
  const variants = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-100",
    ghost: "bg-transparent hover:bg-gray-100",
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

// Custom Input Component
function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
}

// Custom Card Components
function Card({ children, className = "", ...props }) {
  return (
    <div className={`border border-gray-200 rounded-lg bg-white ${className}`} {...props}>
      {children}
    </div>
  );
}

function CardContent({ children, className = "", ...props }) {
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ children, className = "", ...props }) {
  return (
    <div className={`p-4 border-t border-gray-200 ${className}`} {...props}>
      {children}
    </div>
  );
}

// Custom Tabs Components
function Tabs({ defaultValue, children }) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <div>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  );
}

function TabsList({ children, activeTab, setActiveTab }) {
  return (
    <div className="flex space-x-2">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  );
}

function TabsTrigger({ children, value, activeTab, setActiveTab, className = "" }) {
  return (
    <button
      className={`px-4 py-2 rounded ${activeTab === value ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"} ${className}`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

function TabsContent({ children, value, activeTab, className = "" }) {
  return activeTab === value ? (
    <div className={className}>{children}</div>
  ) : null;
}

// ChatBot Component
function ChatBot({ recipe, onClose }) {
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
        setIsTyping(false);
        return;
      }

      const recipeContext = `This conversation is about the recipe: ${recipe.title}. Details: Time: ${recipe.time}, Servings: ${recipe.servings}, Category: ${recipe.category}, Author: ${recipe.author}. Only respond to questions related to this recipe.`;

      const response = await fetch("http://localhost:5000/chatwithbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          context: recipeContext,
        }),
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
          <h1 className="text-xl font-bold text-white tracking-wide">AI Recipe Agent - {recipe.title}</h1>
          <button
            onClick={onClose}
            className="text-white hover:text-red-400 transition-all duration-200 transform hover:scale-110"
          >
            ✕
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-white text-center">Ask me anything about {recipe.title}!</div>
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
                <img src={botImg} className="w-8 h-8 rounded-full border-2 border-purple-400" alt="Bot" />
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
              <img src={botImg} className="w-8 h-8 rounded-full border-2 border-purple-400" alt="Bot" />
              <div className="bg-purple-700 bg-opacity-90 p-3 rounded-xl shadow-lg text-white flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
              </div>
            </motion.div>
          )}
        </div>
        <div className="p-4 bg-opacity-20 bg-black backdrop-blur-lg sticky bottom-0 z-10 flex items-center gap-4">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-grow p-2 rounded-full bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={sendMessage}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
          >
            {isTyping ? (
              <div className="w-5 h-5 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
            ) : (
              "Send"
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Main RecipeHome Component
function RecipeHome() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const categories = [
    { name: "Breakfast", icon: "🍳", count: 42 },
    { name: "Lunch", icon: "🥪", count: 57 },
    { name: "Dinner", icon: "🍲", count: 83 },
    { name: "Desserts", icon: "🍰", count: 29 },
    { name: "Vegetarian", icon: "🥗", count: 35 },
    { name: "Quick Meals", icon: "⏱️", count: 20 },
  ];

  const featuredRecipes = [
    { id: 1, title: "Creamy Garlic Parmesan Pasta", image: "https://themewagon.github.io/delicious/img/bg-img/r2.jpg", time: "30 min", servings: 4, category: "Dinner", author: "Chef Maria" },
    { id: 2, title: "Avocado & Egg Breakfast Toast", image: "https://themewagon.github.io/delicious/img/bg-img/r2.jpg", time: "15 min", servings: 2, category: "Breakfast", author: "Chef John" },
    { id: 3, title: "Chocolate Chip Cookies", image: "https://themewagon.github.io/delicious/img/bg-img/r2.jpg", time: "45 min", servings: 24, category: "Desserts", author: "Chef Lisa" },
    { id: 4, title: "Mediterranean Quinoa Salad", image: "https://themewagon.github.io/delicious/img/bg-img/r2.jpg", time: "20 min", servings: 4, category: "Vegetarian", author: "Chef Alex" },
    { id: 5, title: "Spicy Thai Noodle Soup", image: "https://themewagon.github.io/delicious/img/bg-img/r2.jpg", time: "35 min", servings: 6, category: "Dinner", author: "Chef Kim" },
    { id: 6, title: "Classic Beef Burger", image: "https://themewagon.github.io/delicious/img/bg-img/r2.jpg", time: "25 min", servings: 4, category: "Lunch", author: "Chef Mike" },
  ];

  const popularRecipes = [
    { id: 7, title: "Homemade Pizza", image: "https://themewagon.github.io/delicious/img/bg-img/r2.jpg", time: "60 min", servings: 8, category: "Dinner", author: "Chef Tony" },
    { id: 8, title: "Banana Bread", image: "https://themewagon.github.io/delicious/img/bg-img/r2.jpg", time: "70 min", servings: 10, category: "Desserts", author: "Chef Sarah" },
    { id: 9, title: "Greek Salad", image: "https://themewagon.github.io/delicious/img/bg-img/r2.jpg", time: "15 min", servings: 4, category: "Vegetarian", author: "Chef Nick" },
    { id: 10, title: "Chicken Stir Fry", image: "https://themewagon.github.io/delicious/img/bg-img/r2.jpg", time: "25 min", servings: 4, category: "Quick Meals", author: "Chef Lily" },
    { id: 11, title: "Blueberry Pancakes", image: "https://themewagon.github.io/delicious/img/bg-img/r2.jpg", time: "20 min", servings: 4, category: "Breakfast", author: "Chef Emma" },
    { id: 12, title: "Beef Tacos", image: "https://themewagon.github.io/delicious/img/bg-img/r2.jpg", time: "30 min", servings: 6, category: "Lunch", author: "Chef Carlos" },
  ];

  const handleOpenChat = (recipe) => {
    setSelectedRecipe(recipe);
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setSelectedRecipe(null);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-gray-100">
        <div className="flex h-16 items-center justify-between max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🍽️</span>
              <span className="hidden font-bold sm:inline-block">RecipeHub</span>
            </Link>
          </div>

          <div className="hidden md:flex md:flex-1 md:items-center md:justify-center">
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link to="/" className="font-bold transition-colors hover:text-blue-500">Home</Link>
              <Link to="/app" className="transition-colors hover:text-blue-500">Categories</Link>
              <Link to="/popular" className="transition-colors hover:text-blue-500">Popular</Link>
              <Link to="/new" className="transition-colors hover:text-blue-500">New Recipes</Link>
              <Link to="/about" className="transition-colors hover:text-blue-500">About</Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search recipes..."
                className="w-[200px] pl-8 md:w-[300px] lg:w-[320px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Link to="/login">
              <Button variant="default" size="sm" className="hidden sm:flex">
                Sign In
              </Button>
            </Link>
            <Button variant="outline" size="sm" className="md:hidden">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
            <Button variant="outline" size="sm" className="md:hidden">
              <span className="sr-only">Menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Banner */}
        <section className="relative">
          <div className="relative h-[500px] w-full overflow-hidden">
            <img
              src="https://www.shutterstock.com/image-photo/unhealthy-products-food-bad-figure-260nw-1043372752.jpg"
              alt="Delicious food"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white max-w-7xl mx-auto px-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Discover Delicious Recipes</h1>
              <p className="mt-4 max-w-2xl text-lg sm:text-xl">
                Find and save your favorite recipes from around the world
              </p>
              <div className="mt-8 flex gap-4">
                <Button size="lg" className="rounded-full">Explore Recipes</Button>
                <Button size="lg" variant="outline" className="rounded-full bg-white/10 text-white hover:bg-white/20">
                  Create Account
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-12 max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Categories</h2>
            <Link to="/categories" className="flex items-center text-sm font-medium text-blue-500">
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/category/${category.name.toLowerCase()}`}
                className="group flex flex-col items-center rounded-lg border p-4 transition-colors hover:bg-gray-100"
              >
                <span className="text-3xl">{category.icon}</span>
                <h3 className="mt-2 font-medium">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count} recipes</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Recipe Tabs */}
        <section className="py-12 max-w-7xl mx-auto px-4">
          <Tabs defaultValue="featured">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="featured">Featured Recipes</TabsTrigger>
                <TabsTrigger value="popular">Popular Recipes</TabsTrigger>
              </TabsList>
              <Link to="/recipes" className="flex items-center text-sm font-medium text-blue-500">
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <TabsContent value="featured" className="mt-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featuredRecipes.map((recipe) => (
                  <Card key={recipe.id} className="overflow-hidden">
                    <div className="aspect-video relative">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute right-2 top-2 rounded-full bg-blue-500 px-2 py-1 text-xs font-medium text-white">
                        {recipe.category}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <Link to={`/recipe/${recipe.id}`}>
                          <h3 className="line-clamp-1 text-lg font-semibold hover:text-blue-500">{recipe.title}</h3>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenChat(recipe)}
                          className="text-gray-500 hover:text-blue-500"
                        >
                          <Mic className="h-5 w-5" />
                          <span className="sr-only">Chat about this recipe</span>
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">by {recipe.author}</p>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between p-4 pt-0">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="mr-1 h-4 w-4" />
                        {recipe.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="mr-1 h-4 w-4" />
                        {recipe.servings} servings
                      </div>
                      <Link to={`/recipe-info/${recipe.id}`}>
                        <Button variant="default" size="sm">Cook Now</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="popular" className="mt-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {popularRecipes.map((recipe) => (
                  <Card key={recipe.id} className="overflow-hidden">
                    <div className="aspect-video relative">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute right-2 top-2 rounded-full bg-blue-500 px-2 py-1 text-xs font-medium text-white">
                        {recipe.category}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <Link to={`/recipe/${recipe.id}`}>
                          <h3 className="line-clamp-1 text-lg font-semibold hover:text-blue-500">{recipe.title}</h3>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenChat(recipe)}
                          className="text-gray-500 hover:text-blue-500"
                        >
                          <Mic className="h-5 w-5" />
                          <span className="sr-only">Chat about this recipe</span>
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">by {recipe.author}</p>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between p-4 pt-0">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="mr-1 h-4 w-4" />
                        {recipe.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="mr-1 h-4 w-4" />
                        {recipe.servings} servings
                      </div>
                      <Link to={`/recipe-info/${recipe.id}`}>
                        <Button variant="default" size="sm">Cook Now</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Newsletter */}
        <section className="bg-gray-100 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Subscribe to our newsletter</h2>
              <p className="mt-4 text-gray-500">
                Get weekly recipe inspiration, cooking tips, and exclusive content delivered to your inbox.
              </p>
              <div className="mt-6 flex items-center gap-2">
                <Input type="email" placeholder="Enter your email" className="max-w-md flex-1" />
                <Button>Subscribe</Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-gray-100">
        <div className="py-8 md:py-12 max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
            <div className="col-span-2 lg:col-span-2">
              <Link to="/" className="flex items-center gap-2">
                <span className="text-2xl">🍽️</span>
                <span className="font-bold">RecipeHub</span>
              </Link>
              <p className="mt-2 text-sm text-gray-500">
                Discover, save, and share your favorite recipes from around the world.
              </p>
              <div className="mt-4 flex gap-4">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                  <span className="sr-only">Facebook</span>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  <span className="sr-only">Instagram</span>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                  <span className="sr-only">Twitter</span>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                  <span className="sr-only">LinkedIn</span>
                </Button>
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold">Explore</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/recipes" className="text-gray-500 hover:text-black">All Recipes</Link></li>
                <li><Link to="/categories" className="text-gray-500 hover:text-black">Categories</Link></li>
                <li><Link to="/popular" className="text-gray-500 hover:text-black">Popular</Link></li>
                <li><Link to="/new" className="text-gray-500 hover:text-black">New Recipes</Link></li>
                <li><Link to="/collections" className="text-gray-500 hover:text-black">Collections</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="text-gray-500 hover:text-black">About Us</Link></li>
                <li><Link to="/blog" className="text-gray-500 hover:text-black">Blog</Link></li>
                <li><Link to="/careers" className="text-gray-500 hover:text-black">Careers</Link></li>
                <li><Link to="/contact" className="text-gray-500 hover:text-black">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/terms" className="text-gray-500 hover:text-black">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-gray-500 hover:text-black">Privacy Policy</Link></li>
                <li><Link to="/cookies" className="text-gray-500 hover:text-black">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} RecipeHub. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* ChatBot Popup */}
      {isChatOpen && selectedRecipe && <ChatBot recipe={selectedRecipe} onClose={handleCloseChat} />}
    </div>
  );
}

export default RecipeHome;