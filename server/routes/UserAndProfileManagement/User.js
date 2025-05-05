import express from "express";
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  getUserProfilePicture,
  generateDietarySummaryReport
} from "../../Controllers/UserAndProfileManagement/User.js";
import { protect } from "../../Middleware/authMiddleware.js";
import { upload } from "../../Middleware/upload.js";

const router = express.Router();

router.get("/generate-dietary-summary-report", protect, generateDietarySummaryReport); // <-- move this up

router.get("/", protect, getAllUsers);
router.post("/add", upload.single("profilePicture"), createUser);
router.post("/login", loginUser);
router.get("/profilePicture/:userId", getUserProfilePicture);
router.put("/:userId", protect, upload.single("profilePicture"), updateUser);
router.delete("/:userId", protect, deleteUser);
router.get("/:userId", protect, getUser); // keep this last


export default router;
