import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddRecipe.css";

const AddRecipe = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    price: "",
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "price" ? value.replace(/[^0-9.]/g, "") : value,
    }));
  };

  const isFormValid = () => {
    const { name, description, image, price } = formData;
    if (!name || !description || !image || !price) {
      toast.error("Please fill in all fields.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Unauthorized: No token found! Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:6409/api/Recipestores",
        { ...formData, price: parseFloat(formData.price) },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Recipe added successfully! 🎉");
        setFormData({ name: "", description: "", image: "", price: "" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recipe-container">
      <h2 className="recipe-title">Add a New Yippee! 😃 Recipe</h2>
      <form onSubmit={handleSubmit} className="recipe-form">
        <InputField label="Recipe Name" type="text" name="name" value={formData.name} placeholder="Enter recipe name" onChange={handleInputChange} />
        <TextAreaField label="Description" name="description" value={formData.description} placeholder="Enter recipe description" onChange={handleInputChange} />
        <InputField label="Image URL" type="text" name="image" value={formData.image} placeholder="Enter image URL" onChange={handleInputChange} />
        <InputField label="Price" type="text" name="price" value={formData.price} placeholder="Enter recipe price" onChange={handleInputChange} />

        <button type="submit" className="recipe-button" disabled={loading}>
          {loading ? "Submitting..." : "Submit Recipe"}
        </button>
      </form>

      {/* Toast Notification Component */}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

/** Input Field Component */
const InputField = ({ label, type, name, value, placeholder, onChange }) => (
  <div className="recipe-input-group">
    <label className="recipe-label">{label}</label>
    <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} className="recipe-input" required />
  </div>
);

/** Text Area Field Component */
const TextAreaField = ({ label, name, value, placeholder, onChange }) => (
  <div className="recipe-input-group">
    <label className="recipe-label">{label}</label>
    <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} className="recipe-textarea" required />
  </div>
);

export default AddRecipe;
