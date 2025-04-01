import React, { createContext, useState, useEffect } from 'react';
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Navbar, SideBar } from "./scenes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddRecipe from './components/AddRecipe';
import UpdateRecipe from './components/UpdateRecipe';
import RecipeDetail from './components/RecipeDetail';
import HomeRecipe from "./pages/HomeRecipe"; // Corrected import
import ViewRecipe from "./pages/ViewRecipesPage";
import axios from 'axios'; // Ensure axios is imported

export const ToggledContext = createContext(null);

function App() {
  const [theme, colorMode] = useMode();
  const [toggled, setToggled] = useState(false);
  const [recipes, setRecipes] = useState([]);

  const values = { toggled, setToggled };
<<<<<<< HEAD
  
=======

  // Fetch recipes when component mounts
  const getAllRecipes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/recipes/get");
      return response.data;
    } catch (error) {
      console.error("Error fetching recipes:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      const data = await getAllRecipes();
      setRecipes(data);
    };

    fetchRecipes();
  }, []);

>>>>>>> parent of ba76ff8 (fixed version after merging tharushi's branch)
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToggledContext.Provider value={values}>
          <Box sx={{ display: "flex", height: "100vh", maxWidth: "100%" }}>
            <SideBar />
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                maxWidth: "100%",
              }}
            >
              <Navbar />
              <Box sx={{ overflowY: "auto", flex: 1, maxWidth: "100%" }}>
                <Routes>
                  <Route path="/homeRecipe" element={<HomeRecipe recipes={recipes} />} />
                  <Route path="/" element={<ViewRecipe />} />
                  <Route path="/add-recipe" element={<AddRecipe />} />
                  <Route path="/update-recipe/:id" element={<UpdateRecipe />} />
                  <Route path="/recipe/:id" element={<RecipeDetail />} />
                </Routes>
              </Box>
            </Box>
          </Box>
        </ToggledContext.Provider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
