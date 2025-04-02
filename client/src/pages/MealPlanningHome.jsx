import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Placeholder components for navigation pages
const MealPlanner = () => <div className="container mt-5"><h1>Meal Planner Page</h1></div>;
const MealReports = () => <div className="container mt-5"><h1>Meal Reports Page</h1></div>;

// Main HomePage Component
const MealPlanningHome = () => {
  return (
    <div className="home-page">
      <header className="bg-green-600 text-white py-5 shadow-md">
        <div className="container mx-auto px-4">
          <div className="text-3xl font-bold text-center">MealMaster</div>
        </div>
      </header>
      
      <main className="container mx-auto px-4">
        <section className="flex flex-col items-center justify-center py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-5 text-green-800">Smart Meal Planning Made Simple</h1>
          <p className="text-lg max-w-3xl mb-10 text-gray-600 leading-relaxed">
            Create personalized weekly meal plans, discover new recipes, and never worry about what to cook again. 
            Our intelligent system ensures diverse meals that match your preferences without duplications.
          </p>
        </section>
        
       
        
        <section className="bg-green-50 rounded-lg p-10 my-10 flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-5 text-green-800">Ready to simplify your meal planning?</h2>
          <p className="text-lg max-w-2xl mb-8 text-center text-gray-600 leading-relaxed">
            Start creating your personalized meal plans today or check insights on your most frequently planned meals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/meal-planner" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-md transition-colors">
              Create Meal Plan
            </Link>
            <Link to="/meal-reports" className="bg-white hover:bg-green-50 text-green-600 font-bold py-3 px-8 rounded-md border-2 border-green-600 transition-colors">
              View Meal Reports
            </Link>
          </div>
        </section>
      </main>
      
      <footer className="text-center py-5 text-gray-500 mt-10">
        <div className="container mx-auto px-4">
          <p>© 2025 MealMaster - Your Personal Meal Planning Assistant</p>
        </div>
      </footer>
    </div>
  );
};

// App Component with Router
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/meal-planner" element={<MealPlanner />} />
        <Route path="/meal-reports" element={<MealReports />} />
      </Routes>
    </Router>
  );
};

export default MealPlanningHome;