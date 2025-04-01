import jwt from "jsonwebtoken";

// Middleware to protect routes
export const protect = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ error: "No token, authorization denied" });
    }

    try {
        // Remove the "Bearer" prefix from the token if present
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = decoded;  // Attach the decoded user to the request object
        next();
    } catch (error) {
        res.status(401).json({ error: "Token is not valid" });
    }
};
