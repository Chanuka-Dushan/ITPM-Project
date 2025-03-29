import React, { useState } from "react";
import { Search, ChevronRight, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";

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

// Main RecipeHome Component
function RecipeHome() {
  const [searchQuery, setSearchQuery] = useState("");

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
            <Button variant="default" size="sm" className="hidden sm:flex">Sign In</Button>
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
              src="data:image/jpeg;base64,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"
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
                      <Link to={`/recipe/${recipe.id}`}>
                        <h3 className="line-clamp-1 text-lg font-semibold hover:text-blue-500">{recipe.title}</h3>
                      </Link>
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
                      <Link to={`/recipe/${recipe.id}`}>
                        <h3 className="line-clamp-1 text-lg font-semibold hover:text-blue-500">{recipe.title}</h3>
                      </Link>
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
    </div>
  );
}

export default RecipeHome;