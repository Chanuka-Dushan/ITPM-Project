import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Navbar, SideBar } from "./scenes";
import { Outlet } from "react-router-dom";

// Create context for user ID
export const UserContext = createContext(null);

// Create context for toggled state
export const ToggledContext = createContext({ toggled: false, setToggled: () => {} });

function App() {
  const [theme, colorMode] = useMode();
  const [toggled, setToggled] = useState(false);
  const [userId, setUserId] = useState(null);

  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.userId); // assuming userId is the claim in your token
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={userId}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ToggledContext.Provider value={{ toggled, setToggled }}>
            <Box sx={{ display: "flex", height: "100vh", maxWidth: "100%" }}>
              <SideBar />
              <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", height: "100%" }}>
                <Navbar />
                <Box sx={{ overflowY: "auto", flex: 1, maxWidth: "100%" }}>
                  <Outlet />
                </Box>
              </Box>
            </Box>
          </ToggledContext.Provider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
