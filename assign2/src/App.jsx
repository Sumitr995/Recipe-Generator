import React, { useState } from 'react';
import Navbar from './components/Navbar';
import NameToRecipe from './components/NameToRecipe';
import IngredientsToRecipe from './components/IngredientsToRecipe';
import BMICalculator from './components/BMICalculator';
import './App.css';

const App = () => {
  const [currentFeature, setCurrentFeature] = useState('nameToRecipe'); // Default feature: Name to Recipe

  // Render feature dynamically based on user selection
  const renderFeature = () => {
    switch (currentFeature) {
      case 'nameToRecipe':
        return <NameToRecipe />;
      case 'ingredientsToRecipe':
        return <IngredientsToRecipe />;
      case 'bmiCalculator':
        return <BMICalculator />;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      {/* Navbar for switching between features */}
      <Navbar setFeature={setCurrentFeature} />

      {/* Container to display the selected feature */}
      <div className="feature-container">
        {renderFeature()}
      </div>
    </div>
  );
};

export default App;
