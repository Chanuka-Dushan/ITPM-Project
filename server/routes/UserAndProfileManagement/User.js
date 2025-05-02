import express from "express";
import {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    loginUser,  // Import loginUser controller
} from "../../Controllers/UserAndProfileManagement/User.js";
import { protect } from "../../Middleware/authMiddleware.js";  // Import the middleware

const router = express.Router();

// Protect these routes with the 'protect' middleware
router.get("/", protect, getAllUsers); // This route will require a valid token
router.get("/:userId", protect, getUser); // This route will require a valid token
router.post("/add", createUser); // This route doesn't need protection
router.patch("/:userId", protect, updateUser); // This route will require a valid token
router.delete("/:userId", protect, deleteUser); // This route will require a valid token

// Login route (POST request to login)
router.post("/login", loginUser);  // New login route

export default router;
