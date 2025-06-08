import React from 'react';

// Navbar component to toggle between features
const Navbar = ({ setFeature }) => {
  return (
    <nav className="navbar">
      <h1 className="navbar-title">Recipe App</h1>
      <ul className="navbar-links">
        <li>
          <button className="navbar-button" onClick={() => setFeature('nameToRecipe')}>
            Name to Recipe
          </button>
        </li>
        <li>
          <button className="navbar-button" onClick={() => setFeature('ingredientsToRecipe')}>
            Ingredients to Recipe
          </button>
        </li>
        <li>
          <button className="navbar-button" onClick={() => setFeature('bmiCalculator')}>
            BMI Calculator
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
