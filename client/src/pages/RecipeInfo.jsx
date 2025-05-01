import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Clock, Users, ChevronLeft } from "lucide-react";
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

// RecipeInfo Component
function RecipeInfo() {
    const { id } = useParams();
    const [isChatOpen, setIsChatOpen] = useState(false);

    // Mock recipe data (replace with actual data fetching logic)
    const recipes = [
        { id: "1", title: "Creamy Garlic Parmesan Pasta", image: "https://themewagon.github.io/delicious/img/bg-img/r2.jpg", time: "30 min", servings: 4, category: "Dinner", author: "Chef Maria", description: "A rich and creamy pasta dish with garlic and parmesan.", ingredients: ["Pasta", "Garlic", "Parmesan Cheese", "Cream"], instructions: ["Cook pasta.", "Sauté garlic.", "Add cream and cheese.", "Toss with pasta."] },
        { id: "2", title: "Avocado & Egg Breakfast Toast", image: "https://themewagon.github.io/delicious/img/bg-img/r2.jpg", time: "15 min", servings: 2, category: "Breakfast", author: "Chef John", description: "Healthy and quick avocado toast topped with eggs.", ingredients: ["Bread", "Avocado", "Eggs"], instructions: ["Toast bread.", "Mash avocado and spread.", "Fry eggs and place on top."] },
        { id: "3", title: "Chocolate Chip Cookies", image: "https://themewagon.github.io/delicious/img/bg-img/r2.jpg", time: "45 min", servings: 24, category: "Desserts", author: "Chef Lisa", description: "Classic chewy chocolate chip cookies.", ingredients: ["Flour", "Butter", "Sugar", "Chocolate Chips"], instructions: ["Mix ingredients.", "Scoop dough.", "Bake until golden."] },
        { id: "4", title: "Mediterranean Quinoa Salad", image: "https://themewagon.github.io/delicious/img/bg-img/r2.jpg", time: "20 min", servings: 4, category: "Vegetarian", author: "Chef Alex", description: "A fresh and vibrant quinoa salad.", ingredients: ["Quinoa", "Cucumber", "Tomato", "Feta"], instructions: ["Cook quinoa.", "Chop vegetables.", "Mix with dressing."] },
        { id: "5", title: "Spicy Thai Noodle Soup", image: "https://themewagon.github.io/delicious/img/bg-img/r2.jpg", time: "35 min", servings: 6, category: "Dinner", author: "Chef Kim", description: "A flavorful and spicy noodle soup.", ingredients: ["Noodles", "Coconut Milk", "Chili", "Vegetables"], instructions: ["Cook noodles.", "Simmer broth.", "Add vegetables and noodles."] },
        { id: "6", title: "Classic Beef Burger", image: "https://themewagon.github.io/delicious/img/bg-img/r2.jpg", time: "25 min", servings: 4, category: "Lunch", author: "Chef Mike", description: "Juicy beef burgers with all the fixings.", ingredients: ["Beef", "Buns", "Lettuce", "Tomato"], instructions: ["Form patties.", "Grill burgers.", "Assemble with toppings."] },
        { id: "7", title: "Homemade Pizza", image: "https://themewagon.github.io/delicious/img/bg-img/r2.jpg", time: "60 min", servings: 8, category: "Dinner", author: "Chef Tony", description: "Delicious homemade pizza with your favorite toppings.", ingredients: ["Dough", "Sauce", "Cheese", "Toppings"], instructions: ["Make dough.", "Spread sauce.", "Add toppings and bake."] },
        { id: "8", title: "Banana Bread", image: "https://themewagon.github.io/delicious/img/bg-img/r2.jpg", time: "70 min", servings: 10, category: "Desserts", author: "Chef Sarah", description: "Moist and flavorful banana bread.", ingredients: ["Bananas", "Flour", "Sugar", "Butter"], instructions: ["Mash bananas.", "Mix ingredients.", "Bake until done."] },
        { id: "9", title: "Greek Salad", image: "https://themewagon.github.io/delicious/img/bg-img/r2.jpg", time: "15 min", servings: 4, category: "Vegetarian", author: "Chef Nick", description: "A refreshing Greek salad with feta.", ingredients: ["Cucumber", "Tomato", "Feta", "Olives"], instructions: ["Chop ingredients.", "Toss with dressing."] },
        { id: "10", title: "Chicken Stir Fry", image: "https://themewagon.github.io/delicious/img/bg-img/r2.jpg", time: "25 min", servings: 4, category: "Quick Meals", author: "Chef Lily", description: "Quick and tasty chicken stir fry.", ingredients: ["Chicken", "Vegetables", "Soy Sauce"], instructions: ["Cook chicken.", "Stir-fry vegetables.", "Add sauce."] },
        { id: "11", title: "Blueberry Pancakes", image: "https://themewagon.github.io/delicious/img/bg-img/r2.jpg", time: "20 min", servings: 4, category: "Breakfast", author: "Chef Emma", description: "Fluffy pancakes with fresh blueberries.", ingredients: ["Flour", "Milk", "Blueberries"], instructions: ["Mix batter.", "Add blueberries.", "Cook on griddle."] },
        { id: "12", title: "Beef Tacos", image: "https://themewagon.github.io/delicious/img/bg-img/r2.jpg", time: "30 min", servings: 6, category: "Lunch", author: "Chef Carlos", description: "Spicy beef tacos with fresh toppings.", ingredients: ["Beef", "Tortillas", "Salsa"], instructions: ["Cook beef.", "Warm tortillas.", "Assemble tacos."] },
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
                {/* Back Button */}
                <Link to="/" className="flex items-center text-blue-500 hover:text-blue-600 mb-6">
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Back to Home
                </Link>

                {/* Recipe Header */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-96 object-cover"
                    />
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
                        <Button onClick={handleOpenChat} className="mb-6">Get AI Assist</Button>

                        {/* Recipe Details */}
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

            {/* ChatBot Popup */}
            {isChatOpen && <ChatBot recipe={recipe} onClose={handleCloseChat} />}
        </div>
    );
}

export default RecipeInfo;