import express from "express";
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  getUserProfilePicture,
} from "../../Controllers/UserAndProfileManagement/User.js";
import { protect } from "../../Middleware/authMiddleware.js";
import { upload } from "../../Middleware/upload.js";

const router = express.Router();

router.get("/", protect, getAllUsers);
router.get("/:userId", protect, getUser);
router.post("/add", upload.single("profilePicture"), createUser); // <-- multer
router.put("/:userId", protect, upload.single("profilePicture"), updateUser);
router.delete("/:userId", protect, deleteUser);
router.post("/login", loginUser);

// New route to get profile picture
router.get("/profilePicture/:userId", getUserProfilePicture);

export default router;
