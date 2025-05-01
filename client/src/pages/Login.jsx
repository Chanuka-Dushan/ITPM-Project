import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

function Login() {
  const [formData, setFormData] = useState({
    userId: "",
    password: ""
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/user/login", formData);

      const token = res.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", res.data.userId);

      // Decode token and store user info if necessary
      const decoded = jwtDecode(token);
      console.log("Decoded JWT:", decoded); // Check decoded token in the console

      // Example: Store user role if it exists in the token
      if (decoded.role) {
        localStorage.setItem("userRole", decoded.role);
      }

      // Redirect to the app dashboard or specific page after login
      navigate("/app");
    } catch (err) {
      const errMsg = err.response?.data?.error || "Login failed.";
      setError(errMsg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600">
      <div className="bg-white shadow-2xl rounded-xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">User ID</label>
            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your user ID"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="text-red-600 font-medium text-sm mt-1">{error}</div>
          )}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <span
            className="text-purple-600 cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
