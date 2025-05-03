import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ChatBot from "./chat-bot/bot";
import MealPlanningDetails from "./pages/MealPlanningDetails";
import MealPlanningDate from "./pages/MealPlanningDate.jsx";
import MealPlanDetailsDisplay from "./pages/MealPlanDetailsDisplay";
import MealPlanningHome from "./pages/MealPlanningHome";
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
import PopularPage from "./pages/popular.jsx";
import AboutPage from "./pages/aboutus.jsx";
import HomeRecipe from "./pages/HomeRecipe.jsx";
import AddRecipePage from "./pages/AddRecipePage.jsx";
import ViewRecipe from "./pages/ViewRecipesPage.jsx";
import UpdateRecipePage from "./pages/UpdateRecipePage.jsx";

//user and profile management
import SignUpPage from "./pages/SignUp.jsx";
import LoginPage from "./pages/Login.jsx";
import UserProfilePage from "./pages/UserProfile.jsx";
import SignUpOptionsPage from "./pages/SignupOptions.jsx";



import RecipeInfo from "./pages/RecipeInfo.jsx";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Standalone RecipeHome route */}
        <Route path="/" element={<RecipeHome />} />
        <Route path="/popular" element={<PopularPage />} />
        <Route path="/about" element={<AboutPage />} />

        <Route path="/signupoptions" element={< SignUpOptionsPage/>}/>
        <Route path="/signup" element={< SignUpPage/>}/>
        <Route path="/login" element={< LoginPage/>}/>

        <Route path="/recipe-info/:id" element={<RecipeInfo />} />

        {/* App route with nested dashboard routes */}
        <Route path="/app/*" element={<App />}> {/* Added wildcard * here */}
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile/:userId" element={<UserProfilePage/>} />
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
          <Route path="mealplanningdate" element={<MealPlanningDate />} />
          <Route path="mealplandetailsdisplay" element={<MealPlanDetailsDisplay />} />
          <Route path="mealplanninghome" element={<MealPlanningHome />} />
          <Route path="homeRecipe" element={<HomeRecipe  />} />
          <Route path="viewrecipe" element={<ViewRecipe />} />
          <Route path="add-recipe" element={<AddRecipePage />} />
          <Route path="update-recipe/:id" element={<UpdateRecipePage />} />
          {/* <Route path="recipe/:id" element={<RecipeDeta />} /> */}
         
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
