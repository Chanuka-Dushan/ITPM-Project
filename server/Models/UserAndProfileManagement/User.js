import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['user', 'admin'], default: "user" },
    profilePicture: { type: Buffer, default: null }, // Store image as Buffer

    // ✅ New: Dietary Preferences Enum
    dietaryPreferences: {
      type: [String],
      enum: [
        "vegan",
        "vegetarian",
        "keto",
        "paleo",
        "gluten-free",
        "lactose-free",
        "halal",
        "kosher",
        "high-protein",
        "low-carb"
      ],
      default: undefined // can be null or omitted at user creation
    }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);
