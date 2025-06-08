import React, { useState } from 'react';
import axios from 'axios';
import './ItR.css';

const IngredientsToRecipe = () => {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState('');

  const fetchRecipes = async () => {
    if (!ingredients.trim()) {
      setError('Please enter some ingredients.');
      return;
    }

    try {
      setError('');
      const apiKey = '24e80ab078e64495853c90e592fa1f82';
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/findByIngredients`,
        {
          params: {
            ingredients,
            number: 5,
            apiKey,
          },
        }
      );

      if (response.data.length === 0) {
        setError('No recipes found with the given ingredients.');
        setRecipes([]);
      } else {
        const detailedRecipes = await Promise.all(
          response.data.map(async (recipe) => {
            const details = await axios.get(
              `https://api.spoonacular.com/recipes/${recipe.id}/information`,
              {
                params: { apiKey },
              }
            );
            return { ...recipe, details: details.data };
          })
        );

        setRecipes(detailedRecipes);
      }
    } catch (err) {
      console.error(err);
      setError('Error fetching recipes. Please try again.');
      setRecipes([]);
    }
  };

  return (
    <div className="app">
      <h1>Recipe Generator</h1>
      <div className="input-section">
        <input
          type="text"
          placeholder="Enter ingredients (comma separated)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <button onClick={fetchRecipes}>Get Recipes</button>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="recipes">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <img src={recipe.image} alt="Recipe" className="recipe-image" />
            <div className="recipe-details">
              {recipe.details && (
                <>
                  <h4>Instructions:</h4>
                  <p>
                 {recipe.details.instructions
                  ? recipe.details.instructions.replace(/<\/?[^>]+(>|$)/g, '')
                  : 'Instructions not available.'}
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IngredientsToRecipe;