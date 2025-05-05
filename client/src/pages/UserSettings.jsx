import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import {
  Box,
  Button,
  Divider,
  Input,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

// Dietary preferences enum
const dietaryEnum = ["vegan", "keto", "gluten-free", "vegetarian", "paleo"];

const SettingsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dietaryPreferences, setDietaryPreferences] = useState([]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [originalName, setOriginalName] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [originalDietaryPreferences, setOriginalDietaryPreferences] = useState([]);
  const [originalProfilePic, setOriginalProfilePic] = useState(null);

  // State for validation errors
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    axiosInstance.get(`/user/${userId}`).then((res) => {
      setUserData(res.data);
      setOriginalName(res.data.name);
      setOriginalEmail(res.data.email);
      setOriginalDietaryPreferences(res.data.dietaryPreferences || []);
      setName(res.data.name);
      setEmail(res.data.email);
      setDietaryPreferences(res.data.dietaryPreferences || []);
    });

    axiosInstance
      .get(`/user/profilePicture/${userId}`, { responseType: "blob" })
      .then((res) => setPreviewPic(URL.createObjectURL(res.data)));
  }, [userId]);

  // Update the user data (name, email, dietary preferences)
  const handleUpdate = (fields) => {
    axiosInstance
      .put(`/user/${userId}`, fields)
      .then(() => alert("Updated successfully"))
      .catch(() => alert("Update failed"));
  };

  // Password reset logic
  const handlePasswordReset = () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    // Password strength validation (min 8 characters, uppercase, lowercase, number, special character)
    const passwordStrengthRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordStrengthRegex.test(newPassword)) {
      setPasswordError(
        "Password must be at least 8 characters long, include an uppercase letter, lowercase letter, number, and a special character."
      );
      return;
    }

    axiosInstance
      .put(`/user/${userId}`, { password: newPassword })
      .then(() => {
        alert("Password updated. Signing out...");
        localStorage.clear();
        navigate("/");
      })
      .catch(() => alert("Failed to update password"));
  };

  // Handle account deletion
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      axiosInstance
        .delete(`/user/${userId}`)
        .then(() => {
          alert("Account deleted. Signing out...");
          localStorage.clear();
          navigate("/");
        })
        .catch(() => alert("Failed to delete account"));
    }
  };

  // Sign-out logic
  const handleSignOut = () => {
    localStorage.clear();
    navigate("/");
  };

  // Profile picture change logic
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    setPreviewPic(URL.createObjectURL(file));
  };

  const handleProfilePicUpload = () => {
    const formData = new FormData();
    formData.append("profilePicture", profilePic);
    axiosInstance
      .put(`/user/${userId}`, formData)
      .then(() => alert("Profile picture updated"))
      .catch(() => alert("Failed to update profile picture"));
  };

  // Cancel profile picture update
  const handleCancelProfilePic = () => {
    setPreviewPic(originalProfilePic);
    setProfilePic(null);
    window.location.reload(); // Refresh the page
  };

  // Cancel name/email update
  const handleCancelNameEmail = () => {
    setName(originalName);
    setEmail(originalEmail);
    setEmailError("");
    window.location.reload(); // Refresh the page
  };

  // Cancel dietary preferences update
  const handleCancelDietaryPreferences = () => {
    setDietaryPreferences(originalDietaryPreferences);
    window.location.reload(); // Refresh the page
  };

  // Email validation (basic check)
  const handleEmailValidation = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const handleEmailUpdate = () => {
    if (!handleEmailValidation(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError(""); // Clear email error
    handleUpdate({ email });
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      background: "linear-gradient(to bottom right, #6366F1, #9333EA)",
      py: 4,
      px: 2,
      display: "flex",
      justifyContent: "center"
    }}>
      <Box sx={{
        width: "100%",
        maxWidth: "800px",
        bgcolor: "white",
        borderRadius: "12px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        p: 4
      }}>
        <Typography variant="h4" gutterBottom sx={{
          color: "#4F46E5",
          fontWeight: 700,
          textAlign: "center",
          mb: 4
        }}>
          Settings
        </Typography>

        {/* Section 1: Profile Picture */}
        <Box mb={4}>
          <Typography variant="h6" sx={{
            color: "#4B5563", 
            fontWeight: 600,
            mb: 2
          }}>
            Edit Profile Picture
          </Typography>
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 2
          }}>
            {previewPic && (
              <Box sx={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                overflow: "hidden",
                border: "3px solid #6366F1",
                mb: 2
              }}>
                <img 
                  src={previewPic} 
                  alt="Profile" 
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
              </Box>
            )}
            <Input 
              type="file" 
              onChange={handleProfilePicChange}
              sx={{
                mb: 2,
                "&::before": {
                  border: "none"
                },
                "&::after": {
                  border: "none"
                }
              }} 
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button 
              variant="contained" 
              onClick={handleProfilePicUpload}
              sx={{
                bgcolor: "#4F46E5",
                "&:hover": {
                  bgcolor: "#4338CA"
                },
                borderRadius: "8px",
                boxShadow: "none",
                px: 3
              }}
            >
              Update Picture
            </Button>
            <Button
              variant="outlined"
              onClick={handleCancelProfilePic}
              sx={{
                color: "#4F46E5",
                borderColor: "#4F46E5",
                "&:hover": {
                  borderColor: "#4338CA",
                  bgcolor: "rgba(79, 70, 229, 0.04)"
                },
                borderRadius: "8px"
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
        <Divider sx={{ my: 3, borderColor: "#E5E7EB" }} />

        {/* Section 2: Edit Name and Email */}
        <Box mb={4}>
          <Typography variant="h6" sx={{
            color: "#4B5563", 
            fontWeight: 600,
            mb: 2
          }}>
            Edit Name & Email
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ 
              fontSize: "0.875rem", 
              fontWeight: 500, 
              color: "#4B5563",
              mb: 0.5
            }}>
              Name
            </Typography>
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              sx={{
                p: 1,
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                "&::before": {
                  border: "none"
                },
                "&::after": {
                  border: "none"
                },
                "&:hover:not(.Mui-disabled):before": {
                  border: "none"
                }
              }}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ 
              fontSize: "0.875rem", 
              fontWeight: 500, 
              color: "#4B5563",
              mb: 0.5
            }}>
              Email
            </Typography>
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              sx={{
                p: 1,
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                "&::before": {
                  border: "none"
                },
                "&::after": {
                  border: "none"
                },
                "&:hover:not(.Mui-disabled):before": {
                  border: "none"
                }
              }}
            />
          </Box>
          {emailError && (
            <Typography sx={{ 
              color: "#DC2626", 
              fontSize: "0.875rem",
              mb: 2
            }}>
              {emailError}
            </Typography>
          )}
          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleEmailUpdate}
              sx={{
                bgcolor: "#4F46E5",
                "&:hover": {
                  bgcolor: "#4338CA"
                },
                borderRadius: "8px",
                boxShadow: "none",
                px: 3
              }}
            >
              Update Details
            </Button>
            <Button
              variant="outlined"
              onClick={handleCancelNameEmail}
              sx={{
                color: "#4F46E5",
                borderColor: "#4F46E5",
                "&:hover": {
                  borderColor: "#4338CA",
                  bgcolor: "rgba(79, 70, 229, 0.04)"
                },
                borderRadius: "8px"
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
        <Divider sx={{ my: 3, borderColor: "#E5E7EB" }} />

        {/* Section 3: Dietary Preferences */}
        <Box mb={4}>
          <Typography variant="h6" sx={{
            color: "#4B5563", 
            fontWeight: 600,
            mb: 2
          }}>
            Dietary Preferences
          </Typography>
          <Typography sx={{ 
            fontSize: "0.875rem", 
            fontWeight: 500, 
            color: "#4B5563",
            mb: 0.5
          }}>
            Select Preferences
          </Typography>
          <Select
            multiple
            value={dietaryPreferences}
            onChange={(e) => setDietaryPreferences(e.target.value)}
            fullWidth
            sx={{
              mb: 2,
              borderRadius: "8px",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#D1D5DB"
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#9CA3AF"
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#4F46E5"
              }
            }}
          >
            {dietaryEnum.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              onClick={() => handleUpdate({ dietaryPreferences })}
              sx={{
                bgcolor: "#4F46E5",
                "&:hover": {
                  bgcolor: "#4338CA"
                },
                borderRadius: "8px",
                boxShadow: "none"
              }}
            >
              Update Preferences
            </Button>
            <Button
              variant="outlined"
              onClick={() => setDietaryPreferences([])}
              sx={{
                color: "#F59E0B",
                borderColor: "#F59E0B",
                "&:hover": {
                  borderColor: "#D97706",
                  bgcolor: "rgba(245, 158, 11, 0.04)"
                },
                borderRadius: "8px"
              }}
            >
              Clear Preferences
            </Button>
            <Button
              variant="outlined"
              onClick={handleCancelDietaryPreferences}
              sx={{
                color: "#4F46E5",
                borderColor: "#4F46E5",
                "&:hover": {
                  borderColor: "#4338CA",
                  bgcolor: "rgba(79, 70, 229, 0.04)"
                },
                borderRadius: "8px"
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
        <Divider sx={{ my: 3, borderColor: "#E5E7EB" }} />

        {/* Section 4: Reset Password */}
        <Box mb={4}>
          <Typography variant="h6" sx={{
            color: "#4B5563", 
            fontWeight: 600,
            mb: 2
          }}>
            Reset Password
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ 
              fontSize: "0.875rem", 
              fontWeight: 500, 
              color: "#4B5563",
              mb: 0.5
            }}>
              New Password
            </Typography>
            <Input
              placeholder="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              sx={{
                p: 1,
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                "&::before": {
                  border: "none"
                },
                "&::after": {
                  border: "none"
                },
                "&:hover:not(.Mui-disabled):before": {
                  border: "none"
                }
              }}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ 
              fontSize: "0.875rem", 
              fontWeight: 500, 
              color: "#4B5563",
              mb: 0.5
            }}>
              Confirm Password
            </Typography>
            <Input
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              sx={{
                p: 1,
                border: "1px solid #D1D5DB",
                borderRadius: "8px",
                "&::before": {
                  border: "none"
                },
                "&::after": {
                  border: "none"
                },
                "&:hover:not(.Mui-disabled):before": {
                  border: "none"
                }
              }}
            />
          </Box>
          {passwordError && (
            <Typography sx={{ 
              color: "#DC2626", 
              fontSize: "0.875rem",
              mb: 2
            }}>
              {passwordError}
            </Typography>
          )}
          <Button 
            variant="contained" 
            onClick={handlePasswordReset}
            sx={{
              bgcolor: "#4F46E5",
              "&:hover": {
                bgcolor: "#4338CA"
              },
              borderRadius: "8px",
              boxShadow: "none",
              mt: 1
            }}
          >
            Reset Password
          </Button>
        </Box>
        <Divider sx={{ my: 3, borderColor: "#E5E7EB" }} />

        {/* Section 5: Sign Out & Delete */}
        <Box mt={4}>
          <Typography variant="h6" sx={{
            color: "#4B5563", 
            fontWeight: 600,
            mb: 2
          }}>
            Account Actions
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleSignOut}
              sx={{
                color: "#4F46E5",
                borderColor: "#4F46E5",
                "&:hover": {
                  borderColor: "#4338CA",
                  bgcolor: "rgba(79, 70, 229, 0.04)"
                },
                borderRadius: "8px"
              }}
            >
              Sign Out
            </Button>
            <Button 
              color="error" 
              variant="contained" 
              onClick={handleDelete}
              sx={{
                bgcolor: "#DC2626",
                "&:hover": {
                  bgcolor: "#B91C1C"
                },
                borderRadius: "8px",
                boxShadow: "none"
              }}
            >
              Delete My Account
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SettingsPage;