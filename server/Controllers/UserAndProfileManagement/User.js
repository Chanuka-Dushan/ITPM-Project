import User from "../../Models/UserAndProfileManagement/user.js";
import jwt from "jsonwebtoken";  // Import JWT
import bcrypt from "bcryptjs";  // Import bcrypt for password comparison

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single user by userId
export const getUser = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.userId });
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new user
export const createUser = async (req, res) => {
    const { name, password, email } = req.body;

    try {
        // Find the maximum userId in the collection
        const maxUser = await User.findOne({}, {}, { sort: { 'userId': -1 } });
        let newUserId = 'U001'; // Default if no users exist

        if (maxUser) {
            // Increment the maximum userId by 1
            const nextId = parseInt(maxUser.userId.slice(1)) + 1;
            newUserId = 'U' + nextId.toString().padStart(3, '0'); // Ensure 3-digit format
        }

        // Create a new user document with the retrieved data
        const user = await User.create({
            userId: newUserId, // Dynamically generated userId
            name,
            password,
            email,
        });

        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update a user by userId
export const updateUser = async (req, res) => {
    const { password } = req.body; // Extract password if provided

    try {
        // If password is being updated, hash it first
        if (password) {
            req.body.password = await bcrypt.hash(password, 10);
        }

        // Update user
        const updatedUser = await User.findOneAndUpdate(
            { userId: req.params.userId },
            req.body,
            { new: true }
        );
        
        if (!updatedUser) return res.status(404).json({ error: "User not found" });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a user by userId
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ userId: req.params.userId });
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login a user and return a JWT token along with userId
export const loginUser = async (req, res) => {
    const { userId, password } = req.body;

    try {
        // Find the user by userId
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user.userId, name: user.name },
            process.env.JWT_SECRET,  // Secret key from .env
            { expiresIn: "1h" }  // Token expires in 1 hour
        );

        // Send token and userId in response
        res.status(200).json({ token, userId: user.userId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
