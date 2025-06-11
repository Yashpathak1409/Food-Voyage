import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from "./components/pages/Login";
import MyHomePage from "./components/pages/front-end/myhomepage";
import AddRecipe from "./components/pages/AddRecipe";




import "./App.css";

const App = () => {
  const [recipeStores, setRecipeStores] = useState([]);

  useEffect(() => {
    fetch("http://localhost:6409/api/recipestores")
      .then((response) => response.json())
      .then((data) => setRecipeStores(data))
      .catch((error) => console.error("Error fetching recipe stores:", error));
  }, []);

  return (
    <Router>
      <Navbar />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<MyHomePage recipes={recipeStores} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/AddRecipe" element={<AddRecipe />} />

         
        </Routes>
      </div>
    </Router>
  );
};

export default App;
