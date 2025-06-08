import React, { useState } from 'react';
import axios from 'axios';
import './NtR.css';

const API_KEY = 'fa723c6eb01948618fb63c9af0483425';
const BASE_URL = 'https://api.spoonacular.com/recipes/complexSearch';
const RECIPE_INFO_URL = 'https://api.spoonacular.com/recipes';

const NameToRecipe = () => {
  const [recipeName, setRecipeName] = useState('');
  const [recipeData, setRecipeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    setRecipeName(event.target.value);
  };

  const fetchRecipe = async () => {
    if (!recipeName) return;

    setLoading(true);
    setError(null);

    try {
      const searchResponse = await axios.get(`${BASE_URL}?query=${recipeName}&apiKey=${API_KEY}`);
      const recipe = searchResponse.data.results[0];

      if (recipe) {
        const recipeDetailResponse = await axios.get(
          `${RECIPE_INFO_URL}/${recipe.id}/information?apiKey=${API_KEY}`
        );

        setRecipeData({
          title: recipeDetailResponse.data.title,
          image: recipeDetailResponse.data.image,
          ingredients: recipeDetailResponse.data.extendedIngredients,
          instructions: recipeDetailResponse.data.instructions,
        });
      } else {
        setError('No recipe found.');
      }
    } catch (error) {
      setError('Error fetching recipe.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="name-to-recipe-container">
      <h1 className="recipe-title">🍽 Recipe Finder</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter a dish name..."
          value={recipeName}
          onChange={handleInputChange}
          className="search-input"
        />
        <button className="search-button" onClick={fetchRecipe} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {recipeData && (
        <div className="recipe-container">
          <h2 className="recipe-title">{recipeData.title}</h2>
          <div className="recipe-content">
            <img src={recipeData.image} alt={recipeData.title} className="recipe-image" />

            <div className="ingredients-box">
              <h3>Ingredients:</h3>
              <div className="ingredients-list">
                <ul>
                  {recipeData.ingredients &&
                    recipeData.ingredients.map((ingredient, index) => (
                      <li key={index}>
                        {`${ingredient.amount} ${ingredient.unit} ${ingredient.name}`}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="instructions">
            <h3>Instructions:</h3>
            <div dangerouslySetInnerHTML={{ __html: recipeData.instructions }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default NameToRecipe;
