import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './homepage.css';

const Homepage = () => {
  const [recipeStores, setRecipeStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRecipe, setExpandedRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipeStores = async () => {
      try {
        const response = await axios.get('http://localhost:6409/api/recipestores');
        setRecipeStores(response.data);
      } catch (error) {
        console.error('Error fetching recipe stores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeStores();
  }, []);

  const handleExpand = (store) => {
    setExpandedRecipe(store);
  };

  const handleCloseExpand = () => {
    setExpandedRecipe(null);
  };

  return (
    <div className="homepage-container">
      <h1>Recipe Stores</h1>

      {loading ? (
        <p>Loading...</p>
      ) : recipeStores.length === 0 ? (
        <p>No recipe stores found.</p>
      ) : (
        <div className="recipe-grid">
          {recipeStores.map((store) => (
            <div
              className="recipe-card"
              key={store._id}
              onClick={() => handleExpand(store)}
            >
              <div className="recipe-image">
                <img src={store.image} alt={store.name} />
              </div>
              <div className="recipe-info">
                <h3>{store.name}</h3>
                <p>{store.description}</p>
                <p><strong>Price:</strong> ₹{store.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {expandedRecipe && (
        <div className="expanded-overlay" onClick={handleCloseExpand}>
          <div className="expanded-content" onClick={(e) => e.stopPropagation()}>
            <img src={expandedRecipe.image} alt={expandedRecipe.name} />
            <div className="expanded-info">
              <h2>{expandedRecipe.name}</h2>
              <p>{expandedRecipe.description}</p>
              <p><strong>Price:</strong> ₹{expandedRecipe.price}</p>
              <button className="close-btn" onClick={handleCloseExpand}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;
