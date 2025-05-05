import { Avatar, Box, IconButton, Typography, useTheme } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { tokens } from "../../../theme";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import {
  MenuOutlined,
  PersonOutlined,
  FavoriteBorderOutlined,
  BookOutlined,
  SmartToy,
  SupportAgent,
  HomeOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import logo from "../../../assets/images/logo.png";
import Item from "../sidebar/Item";
import { ToggledContext, UserContext } from "../../../App";
import axiosInstance from "../../../axiosInstance";

const SidebarUser = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { toggled, setToggled } = useContext(ToggledContext);
  const userId = useContext(UserContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [userData, setUserData] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (userId) {
      // Fetch user details
      axiosInstance
        .get(`/user/${userId}`)
        .then((response) => {
          setUserData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });

      // Set profile picture URL
      setProfilePicUrl(`http://localhost:5000/api/user/profilePicture/${userId}`);
    }
  }, [userId]);

  return (
    <Sidebar
      backgroundColor={colors.primary[400]}
      rootStyles={{
        border: 0,
        height: "100%",
      }}
      collapsed={collapsed}
      onBackdropClick={() => setToggled(false)}
      toggled={toggled}
      breakPoint="md"
    >
      <Menu
        menuItemStyles={{
          button: { ":hover": { background: "transparent" } },
        }}
      >
        <MenuItem
          rootStyles={{
            margin: "10px 0 20px 0",
            color: colors.gray[100],
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {!collapsed && (
              <Box
                display="flex"
                alignItems="center"
                gap="12px"
                sx={{ transition: ".3s ease" }}
              >
                <img
                  style={{ width: "30px", height: "30px", borderRadius: "8px" }}
                  src={logo}
                  alt="RECIPE HUB"
                />
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  textTransform="capitalize"
                  color={colors.greenAccent[500]}
                >
                  RECIPE HUB
                </Typography>
              </Box>
            )}
            <IconButton onClick={() => setCollapsed(!collapsed)}>
              <MenuOutlined />
            </IconButton>
          </Box>
        </MenuItem>
      </Menu>

      {!collapsed && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            mb: "25px",
          }}
        >
          <Avatar
            alt="avatar"
            src={!imageError ? profilePicUrl : undefined}
            onError={() => setImageError(true)}
            sx={{ width: "100px", height: "100px" }}
          >
            {imageError && (
              <Typography variant="h6" color={colors.gray[100]}>
                Add Image
              </Typography>
            )}
          </Avatar>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h3" fontWeight="bold" color={colors.gray[100]}>
              {userData?.name || "Loading..."}
            </Typography> 
            <Typography
              variant="h6"
              fontWeight="500"
              color={colors.greenAccent[500]}
            >
              User
            </Typography>
          </Box>
        </Box>
      )}

      <Box mb={5} pl={collapsed ? undefined : "5%"}>
        <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#868dfb",
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          <Item
            title="Profile"
           path={`/app/profile/${userId}`}
            colors={colors}
            icon={<PersonOutlined />}
          />
          <Item
            title="Recipes For You"
            path="app/r"
            colors={colors}
            icon={<FavoriteBorderOutlined />}
          />
          <Item
            title="My Recipes"
            path="/app/my-recipes"
            colors={colors}
            icon={<BookOutlined />}
          />
          <Item
            title="Chat Bot"
            path="/app/chatbot"
            colors={colors}
            icon={<SmartToy />}
          />
          <Item
            title="Talk with Our Bot"
            path="/app/talkbot"
            colors={colors}
            icon={<SupportAgent />}
          />
          <Item
            title="Recipe Home"
            path="/app/recipe-home"
            colors={colors}
            icon={<HomeOutlined />}
          />

          <Item
            title="Diatary Summary"
            path="/app/diaterysummary"
            colors={colors}
            icon={<HomeOutlined />}
          />

          <Item
            title="Settings"
            path={`/app/usersettings/${userId}`}
            colors={colors}
            icon={<SettingsOutlined />}
          />
        </Menu>
      </Box>
    </Sidebar>
  );
};

export default SidebarUser;
