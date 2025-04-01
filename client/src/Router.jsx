import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ChatBot from "./chat-bot/bot";
import App from "./App";
import {
  Dashboard,
  Team,
  Invoices,
  Contacts,
  Form,
  Bar,
  Line,
  Pie,
  FAQ,
  Geography,
  Calendar,
  Stream,
} from "./scenes";
import AddRecipe from './components/AddRecipe';
import UpdateRecipe from './components/UpdateRecipe';
import RecipeDetail from './components/RecipeDetail';
import HomeRecipe from "./pages/HomeRecipe"; // Corrected import
import ViewRecipePage from "./pages/ViewRecipesPage"; // Corrected import

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/chatbot" element={<ChatBot />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/form" element={<Form />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/bar" element={<Bar />} />
          <Route path="/pie" element={<Pie />} />
          <Route path="/stream" element={<Stream />} />
          <Route path="/line" element={<Line />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/geography" element={<Geography />} />
          <Route path="*" element={<HomeRecipe />} />
          <Route path="/add-recipe" element={<AddRecipe />} />
          <Route path="/view-recipes" element={<ViewRecipePage />} />
          <Route path="/update-recipe/:id" element={<UpdateRecipe />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;