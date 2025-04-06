import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import MealPlanningDetails from './MealPlanningDetails'; // Import the MealPlanningDetails component
import MealPlanningDate from './MealPlanningDate'; // Import the MealPlanningDate component

// Placeholder components for navigation pages
const MealPlanner = () => <div className="container mt-5"><h1>Meal Planner Page</h1></div>;
const MealReports = () => <div className="container mt-5"><h1>Meal Reports Page</h1></div>;

// Meal Planning Card with navigation functionality
const MealPlanningCard = () => {
  const navigate = useNavigate();
  
  const handleButtonClick = () => {
    navigate('/app/MealPlanningDetails');
  };

  
  return (
    <div className="bg-white rounded-lg p-8 shadow-md hover:translate-y-1 transition-transform">
      <div className="text-4xl text-green-600 mb-5">🤖</div>
      <h3 className="text-xl font-bold mb-4 text-green-800">Meal Planning Details Form</h3>
      <p className="text-gray-600 leading-relaxed mb-6">
        You can enter your details about your meal plannings and give your suggestions.
      </p>
      <button 
        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        onClick={handleButtonClick}
      >
        Enter Details
      </button>
    </div>
  );
};

// Meal Scheduling Card with navigation functionality
const MealSchedulingCard = () => {
  const navigate = useNavigate();
  
  const handleButtonClick = () => {
    navigate('/app/MealPlanningDate');
  };

  return (
    <div className="bg-white rounded-lg p-8 shadow-md hover:translate-y-1 transition-transform">
      <div className="text-4xl text-green-600 mb-5">📅</div>
      <h3 className="text-xl font-bold mb-4 text-green-800">Meal Scheduling</h3>
      <p className="text-gray-600 leading-relaxed mb-6">
        Assign your favorite recipes to specific days of the week for perfect planning.
      </p>
      <button 
        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        onClick={handleButtonClick}
      >
        Schedule Meals
      </button>
    </div>
  );
};

// Main HomePage Component
const MealPlanningHome = () => {
  return (
    <div className="home-page">
      <header className="bg-green-600 text-white py-5 shadow-md">
        <div className="container mx-auto px-4">
          <div className="text-3xl font-bold text-center">RECIPE HUB</div>
        </div>
      </header>
      
      <main className="container mx-auto px-4">
        <section className="flex flex-col items-center justify-center py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-5 text-green-800">Smart Meal Planning Made Simple</h1>
          <p className="text-lg max-w-3xl mb-10 text-gray-600 leading-relaxed">
          The Meal Planning System of the Recipe Hub automates the process of creating balanced meal plans based on user preferences, dietary restrictions, and available ingredients. It utilizes AI to suggest personalized meal schedules, ensuring variety and nutritional balance. Users can generate grocery lists, track calorie intake, and optimize meal preparation, making meal planning more efficient and hassle-free.
          </p>
        </section>
        
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 my-10">
          <div className="bg-white rounded-lg p-8 shadow-md hover:translate-y-1 transition-transform">
            <div className="text-4xl text-green-600 mb-5">📝</div>
            <h3 className="text-xl font-bold mb-4 text-green-800">Functions</h3>
            <p className="text-gray-600 leading-relaxed">
              Users can easily select a meal according to their preferences and they can add a meal according to their preferences and view them.</p>
          </div>

          <MealSchedulingCard />
                    
         
          <MealPlanningCard />
        </section>
        
        <section className="bg-green-50 rounded-lg p-10 my-10 flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-5 text-green-800">Ready to simplify your meal planning?</h2>
          <p className="text-lg max-w-2xl mb-8 text-center text-gray-600 leading-relaxed">
            Start creating your personalized meal plans today or check insights on your most frequently planned meals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            
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
        <Route path="/" element={<MealPlanningHome />} />
        <Route path="/meal-planner" element={<MealPlanner />} />
        <Route path="/meal-reports" element={<MealReports />} />
        <Route path="/meal-planning-details" element={<MealPlanningDetails />} />
        <Route path="/meal-planning-date" element={<MealPlanningDate />} />
      </Routes>
    </Router>
  );
};

export default MealPlanningHome;