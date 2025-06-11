import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Allow only letters and spaces for the name field
    if (name === "name" && !/^[A-Za-z\s]*$/.test(value)) {
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = (email) => {
    const allowedDomains = /@([a-zA-Z0-9]+\.)+(com|org|gov|gov.in|nic.in|ac.in|edu.in|mil|gouv.fr|gov.uk|canada.ca|gc.ca|gov.au|bund.de|gov.sg|state.gov|usda.gov|cia.gov)$/;
    return allowedDomains.test(email);
  };


  const validatePassword = (password) => {
    // Intermediate password validation: At least 6 chars, 1 letter, 1 number
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@#$%^&*]{6,}$/.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      toast.error("Invalid email! Please include a valid domain.");
      return;
    }

    if (!validatePassword(formData.password)) {
      toast.error(
        "Weak password! Must be at least 6 characters and include a letter and a number."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:6409/register", formData);
      if (response.status === 201) {
        toast.success(response.data.message);

        // Reset form and force re-render
        setFormData({ name: "", email: "", password: "" });
        setSubmitted(!submitted);

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="register-container w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="register-title text-2xl font-bold text-center mb-6">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="label-text">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="input-field"
              required
            />
          </div>
          <div>
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
          <div className="relative">
            <label htmlFor="password" className="label-text">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="input-field pr-10"
              required
            />
            <button
              type="button"
              className="absolute right-2 top-10 text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
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

export default RegisterPage;
