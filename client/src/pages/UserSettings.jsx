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
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      {/* Section 1: Profile Picture */}
      <Box mb={4}>
        <Typography variant="h6">Edit Profile Picture</Typography>
        {previewPic && <img src={previewPic} alt="Profile" width={120} />}
        <Input type="file" onChange={handleProfilePicChange} />
        <Button variant="contained" onClick={handleProfilePicUpload}>
          Update Picture
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={handleCancelProfilePic}
          sx={{ ml: 2 }}
        >
          Cancel
        </Button>
      </Box>
      <Divider />

      {/* Section 2: Edit Name and Email */}
      <Box mt={4} mb={4}>
        <Typography variant="h6">Edit Name & Email</Typography>
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {emailError}
          </Typography>
        )}
        <Button
          variant="contained"
          onClick={handleEmailUpdate}
          sx={{ mr: 2 }}
        >
          Update Details
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={handleCancelNameEmail}
          sx={{ ml: 2 }}
        >
          Cancel
        </Button>
      </Box>
      <Divider />

      {/* Section 3: Dietary Preferences */}
      <Box mt={4} mb={4}>
        <Typography variant="h6">Dietary Preferences</Typography>
        <Select
          multiple
          value={dietaryPreferences}
          onChange={(e) => setDietaryPreferences(e.target.value)}
          fullWidth
        >
          {dietaryEnum.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>

        <Box mt={2}>
          <Button
            variant="contained"
            onClick={() => handleUpdate({ dietaryPreferences })}
            sx={{ mr: 2 }}
          >
            Update Preferences
          </Button>
          <Button
            variant="outlined"
            color="warning"
            onClick={() => setDietaryPreferences([])}
          >
            Clear Preferences
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleCancelDietaryPreferences}
            sx={{ ml: 2 }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
      <Divider />

      {/* Section 4: Reset Password */}
      <Box mt={4} mb={4}>
        <Typography variant="h6">Reset Password</Typography>
        <Input
          placeholder="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Input
          placeholder="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {passwordError && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {passwordError}
          </Typography>
        )}
        <Button variant="contained" onClick={handlePasswordReset}>
          Reset Password
        </Button>
      </Box>
      <Divider />

      {/* Section 5: Sign Out & Delete */}
      <Box mt={4}>
        <Typography variant="h6">Account Actions</Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={handleSignOut}
          sx={{ mr: 2 }}
        >
          Sign Out
        </Button>
        <Button color="error" variant="contained" onClick={handleDelete}>
          Delete My Account
        </Button>
      </Box>
    </Box>
  );
};

export default SettingsPage;
