import { useState } from "react"
import { Link } from "react-router-dom"
import { ChevronLeft, Clock, Users, Search, ChefHat } from "lucide-react"

function PopularPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState("rating") // rating, newest, time

  const popularRecipes = [
    {
      id: 1,
      title: "Creamy Garlic Parmesan Pasta",
      image: "https://themewagon.github.io/delicious/img/bg-img/r5.jpg",
      time: "30 min",
      servings: 4,
      category: "Dinner",
      author: "Chef Maria",
      rating: 4.9,
      reviews: 342,
      date: "2023-10-15",
    },
    {
      id: 7,
      title: "Homemade Pizza",
      image: "https://themewagon.github.io/delicious/img/bg-img/r5.jpg",
      time: "60 min",
      servings: 8,
      category: "Dinner",
      author: "Chef Tony",
      rating: 4.8,
      reviews: 287,
      date: "2023-11-05",
    },
    {
      id: 8,
      title: "Banana Bread",
      image: "https://themewagon.github.io/delicious/img/bg-img/r5.jpg",
      time: "70 min",
      servings: 10,
      category: "Desserts",
      author: "Chef Sarah",
      rating: 4.7,
      reviews: 256,
      date: "2023-09-22",
    },
    {
      id: 2,
      title: "Avocado & Egg Breakfast Toast",
      image: "https://themewagon.github.io/delicious/img/bg-img/r5.jpg",
      time: "15 min",
      servings: 2,
      category: "Breakfast",
      author: "Chef John",
      rating: 4.6,
      reviews: 198,
      date: "2023-12-01",
    },
    {
      id: 9,
      title: "Greek Salad",
      image: "https://themewagon.github.io/delicious/img/bg-img/r5.jpg",
      time: "15 min",
      servings: 4,
      category: "Vegetarian",
      author: "Chef Nick",
      rating: 4.5,
      reviews: 176,
      date: "2023-08-14",
    },
    {
      id: 3,
      title: "Chocolate Chip Cookies",
      image: "https://themewagon.github.io/delicious/img/bg-img/r5.jpg",
      time: "45 min",
      servings: 24,
      category: "Desserts",
      author: "Chef Lisa",
      rating: 4.9,
      reviews: 412,
      date: "2023-07-30",
    },
    {
      id: 10,
      title: "Chicken Stir Fry",
      image: "https://themewagon.github.io/delicious/img/bg-img/r5.jpg",
      time: "25 min",
      servings: 4,
      category: "Quick Meals",
      author: "Chef Lily",
      rating: 4.7,
      reviews: 231,
      date: "2023-11-18",
    },
    {
      id: 4,
      title: "Mediterranean Quinoa Salad",
      image: "https://themewagon.github.io/delicious/img/bg-img/r5.jpg",
      time: "20 min",
      servings: 4,
      category: "Vegetarian",
      author: "Chef Alex",
      rating: 4.6,
      reviews: 189,
      date: "2023-10-05",
    },
    {
      id: 11,
      title: "Blueberry Pancakes",
      image: "https://themewagon.github.io/delicious/img/bg-img/r5.jpg",
      time: "20 min",
      servings: 4,
      category: "Breakfast",
      author: "Chef Emma",
      rating: 4.8,
      reviews: 267,
      date: "2023-09-12",
    },
    {
      id: 5,
      title: "Spicy Thai Noodle Soup",
      image: "https://themewagon.github.io/delicious/img/bg-img/r5.jpg",
      time: "35 min",
      servings: 6,
      category: "Dinner",
      author: "Chef Kim",
      rating: 4.7,
      reviews: 203,
      date: "2023-12-10",
    },
    {
      id: 12,
      title: "Beef Tacos",
      image: "https://themewagon.github.io/delicious/img/bg-img/r5.jpg",
      time: "30 min",
      servings: 6,
      category: "Lunch",
      author: "Chef Carlos",
      rating: 4.5,
      reviews: 178,
      date: "2023-08-25",
    },
    {
      id: 35,
      title: "Classic Cheesecake",
      image: "https://themewagon.github.io/delicious/img/bg-img/r5.jpg",
      time: "90 min",
      servings: 12,
      category: "Desserts",
      author: "Chef Anna",
      rating: 4.9,
      reviews: 356,
      date: "2023-11-28",
    },
  ]

  // Filter recipes based on category and search query
  const filteredRecipes = popularRecipes
    .filter((recipe) => {
      if (activeFilter === "all") return true
      return recipe.category.toLowerCase() === activeFilter.toLowerCase()
    })
    .filter((recipe) => {
      if (!searchQuery) return true
      return (
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })

  // Sort recipes based on selected sort order
  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    if (sortOrder === "rating") {
      return b.rating - a.rating
    } else if (sortOrder === "newest") {
      return new Date(b.date) - new Date(a.date)
    } else if (sortOrder === "time") {
      return Number.parseInt(a.time) - Number.parseInt(b.time)
    }
    return 0
  })

  // Get unique categories for filter buttons
  const categories = ["all", ...new Set(popularRecipes.map((recipe) => recipe.category.toLowerCase()))]

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium">
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Popular Recipes</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our most loved recipes that have been tried, tested, and adored by thousands of home cooks. These
            crowd-pleasers are guaranteed to impress!
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search popular recipes..."
                className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <span className="text-sm font-medium whitespace-nowrap">Filter by:</span>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium whitespace-nowrap ${
                    activeFilter === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {category === "all" ? "All" : category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{sortedRecipes.length}</span> recipes
            </p>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Sort by:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background"
              >
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
                <option value="time">Cooking Time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Recipe Grid */}
        {sortedRecipes.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="group overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={recipe.image || "/placeholder.svg"}
                    alt={recipe.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute right-2 top-2 rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                    {recipe.category}
                  </div>
                  <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    {recipe.rating}
                  </div>
                </div>
                <div className="p-4">
                  <Link to={`/recipe/${recipe.id}`}>
                    <h3 className="line-clamp-1 text-lg font-semibold group-hover:text-primary">{recipe.title}</h3>
                  </Link>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-muted-foreground flex items-center">
                      <ChefHat className="mr-1 h-3 w-3" />
                      {recipe.author}
                    </p>
                    <p className="text-xs text-muted-foreground">{recipe.reviews} reviews</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 pt-0 border-t mt-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    {recipe.time}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-1 h-4 w-4" />
                    {recipe.servings} servings
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No recipes found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchQuery("")
                setActiveFilter("all")
              }}
              className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Popular Collections */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Popular Collections</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link to="/collection/quick-dinners" className="group relative overflow-hidden rounded-lg">
              <img
                src="https://themewagon.github.io/delicious/img/bg-img/r3.jpg"
                alt="Quick Dinners"
                className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-lg font-semibold text-white">Quick Dinners</h3>
                <p className="text-sm text-white/80">Ready in 30 minutes or less</p>
              </div>
            </Link>
            <Link to="/collection/comfort-food" className="group relative overflow-hidden rounded-lg">
              <img
                src="https://themewagon.github.io/delicious/img/bg-img/r3.jpg"
                alt="Comfort Food"
                className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-lg font-semibold text-white">Comfort Food</h3>
                <p className="text-sm text-white/80">Hearty dishes for cozy days</p>
              </div>
            </Link>
            <Link to="/collection/healthy-meals" className="group relative overflow-hidden rounded-lg">
              <img
                src="https://themewagon.github.io/delicious/img/bg-img/r3.jpg"
                alt="Healthy Meals"
                className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-lg font-semibold text-white">Healthy Meals</h3>
                <p className="text-sm text-white/80">Nutritious and delicious</p>
              </div>
            </Link>
            <Link to="/collection/desserts" className="group relative overflow-hidden rounded-lg">
              <img
                src="https://themewagon.github.io/delicious/img/bg-img/r3.jpg"
                alt="Desserts"
                className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-lg font-semibold text-white">Desserts</h3>
                <p className="text-sm text-white/80">Sweet treats for any occasion</p>
              </div>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t bg-background">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} RecipeHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default PopularPage

