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

//create a new user
export const createUser = async (req, res) => {
  const { name, password, email, dietaryPreferences } = req.body;
  const profilePicture = req.file ? req.file.buffer : null;

  try {
    const maxUser = await User.findOne({}, {}, { sort: { userId: -1 } });
    let newUserId = 'U001';
    if (maxUser) {
      const nextId = parseInt(maxUser.userId.slice(1)) + 1;
      newUserId = 'U' + nextId.toString().padStart(3, '0');
    }

    const user = await User.create({
      userId: newUserId,
      name,
      password,
      email,
      profilePicture,
      dietaryPreferences, // <-- optional on create
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

  
//update a user by userId
export const updateUser = async (req, res) => {
  try {
    const { password, name, email, role, dietaryPreferences } = req.body;
    const profilePicture = req.file?.buffer;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (profilePicture) updateData.profilePicture = profilePicture;
    if (dietaryPreferences) updateData.dietaryPreferences = dietaryPreferences;

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findOneAndUpdate(
      { userId: req.params.userId },
      { $set: updateData },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

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
  const { email, password } = req.body;

  try {
      // Find the user by userId
      const user = await User.findOne({ email });
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

//get image by user id
export const getUserProfilePicture = async (req, res) => {
    try {
      const user = await User.findOne({ userId: req.params.userId });
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      if (!user.profilePicture) {
        // Return 200 with empty body if no profile picture is set
        return res.status(200).send();
      }
  
      res.set("Content-Type", "image/jpeg"); // Adjust the content type as needed
      res.status(200).send(user.profilePicture);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  
