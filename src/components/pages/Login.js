import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css"; // Make sure this CSS file exists

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading indicator

    try {
      const response = await axios.post("http://localhost:6409/login", formData);

      if (response.status === 200) {
        // Save the token to localStorage
        const { token } = response.data;
        localStorage.setItem("token", token);

        // Show success message
        toast.success("Login successful!");

        // Optionally, navigate to the dashboard or another page
        console.log("Token saved:", token);
        setTimeout(() => {
          navigate("/"); // Redirect after successful login
        }, 2000);
      }
    } catch (error) {
      console.error("Login failed", error);

      // Check if error response exists to display the correct message
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "Invalid email or password!");
      } else {
        toast.error("An error occurred. Please try again!");
      }
    } finally {
      setLoading(false); // Remove loading indicator
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="email" className="label-text">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="input-field"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password" className="label-text">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="input-field"
              required
            />
          </div>

          {/* Forgot Password (left) & Register (right) */}
          <div className="login-links">
            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
            <Link to="/register" className="register-link">
              New User?
            </Link>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
      {/* Toast Container for notifications */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Login;
