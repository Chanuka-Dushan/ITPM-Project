import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ChatBot from "./chat-bot/bot";
import MealPlanningDetails from "./pages/MealPlanningDetails";
import MealPlanningDate from "./pages/MealPlanningDate";
import MealPlanDetailsDisplay from "./pages/MealPlanDetailsDisplay";
import TalkBot from "./talk-bot/talkbot";
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
import RecipeHome from "./pages/home.jsx";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Standalone RecipeHome route */}
        <Route path="/" element={<RecipeHome />} />

        {/* App route with nested dashboard routes */}
        <Route path="/app" element={<App />}>
          <Route index element={<Dashboard />} /> {/* Default route under /app */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="chatbot" element={<ChatBot />} />
          <Route path="talkbot" element={<TalkBot />} />
          <Route path="mealplanning/:mealPlanId" element={<MealPlanningDetails />} />
          <Route path="team" element={<Team />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="form" element={<Form />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="bar" element={<Bar />} />
          <Route path="pie" element={<Pie />} />
          <Route path="stream" element={<Stream />} />
          <Route path="line" element={<Line />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="geography" element={<Geography />} />
          <Route path="mealplanningdetails" element={<MealPlanningDetails />} />
          <Route path="mealplanningdate" element={<MealPlanningDate />} />
          <Route path="mealplandetailsdisplay" element={<MealPlanDetailsDisplay />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;